<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAdminUserRequest;
use App\Http\Requests\UpdateAdminUserRequest;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use App\Notifications\NewStaffWelcomeNotification;
use App\Services\AuditService;
use Illuminate\Database\QueryException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        abort_unless($request->user()->hasPermission('admin.users.manage'), 403);
        $search = $request->string('search')->trim()->toString();
        $roleId = $request->string('role_id')->toString();

        $metrics = [
            'total' => User::query()->count(),
            'active' => User::query()->where('is_active', true)->count(),
            'roles_count' => Role::query()->count(),
            'permissions_count' => Permission::query()->count(),
        ];

        $users = User::query()
            ->with('roles:id,name,slug')
            ->when($search, fn ($query) => $query->where(fn ($nested) => $nested
                ->where('name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%")
                ->orWhere('position_title', 'like', "%{$search}%")
                ->orWhere('employee_code', 'like', "%{$search}%")
                ->orWhere('department', 'like', "%{$search}%")
            ))
            ->when($roleId, fn ($query) => $query->whereHas('roles', fn ($r) => $r->where('roles.id', $roleId)))
            ->orderBy('name')
            ->paginate(24)
            ->withQueryString();

        return Inertia::render('admin/users/index', [
            'users' => $users,
            'roles' => Role::query()->with('permissions:id,name')->orderBy('name')->get(),
            'permissions' => Permission::query()->orderBy('name')->get(['id', 'name', 'description']),
            'metrics' => $metrics,
            'filters' => $request->only(['search', 'role_id']),
        ]);
    }

    public function store(StoreAdminUserRequest $request, AuditService $audit): RedirectResponse
    {
        $hasCustomPassword = $request->filled('password');
        $initialPassword = $hasCustomPassword ? (string) $request->input('password') : 'password';

        $user = DB::transaction(function () use ($request, $initialPassword) {
            $user = User::query()->create([
                ...$request->safe()->except(['role_ids', 'password']),
                'password' => $initialPassword,
                'email_verified_at' => now(),
                'is_active' => true,
            ]);
            $user->roles()->sync($this->roleAssignments($request->validated('role_ids'), $request->user()));

            return $user;
        });

        $audit->record($user, 'user.invited', [
            'role_ids' => $request->validated('role_ids'),
            'manual_password_set' => $hasCustomPassword,
        ], $request->user(), $request);

        if (! $hasCustomPassword) {
            $user->notify((new NewStaffWelcomeNotification($user, $initialPassword))->afterCommit());
        }

        return back()->with(
            'success',
            "Pengguna {$user->name} berhasil ditambahkan. Password login: {$initialPassword}"
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAdminUserRequest $request, User $user, AuditService $audit): RedirectResponse
    {
        abort_if($request->user()->is($user) && ! $request->boolean('is_active'), 422, 'Anda tidak dapat menonaktifkan akun sendiri.');

        $validated = $request->validated();
        $selectedRolesRetainAdministration = Role::query()
            ->whereKey($validated['role_ids'])
            ->whereHas('permissions', fn ($query) => $query->where('name', 'admin.users.manage'))
            ->exists();

        abort_if($request->user()->is($user) && ! $selectedRolesRetainAdministration, 422, 'Anda tidak dapat mencabut akses administrasi akun sendiri.');

        DB::transaction(function () use ($validated, $request, $user): void {
            $data = collect($validated)->except(['role_ids', 'password'])->all();
            if ($request->filled('password')) {
                $data['password'] = (string) $request->input('password');
            }
            $data['disabled_at'] = $validated['is_active'] ? null : now();
            $data['email_verified_at'] = $user->email_verified_at ?? now();

            // If email is modified by admin, auto-verify immediately
            if (isset($data['email']) && $data['email'] !== $user->email) {
                $data['email_verified_at'] = now();
            }

            $user->update($data);
            $user->roles()->sync($this->roleAssignments($validated['role_ids'], $request->user()));
        });
        $audit->record($user, 'user.updated', [
            'is_active' => $user->is_active,
            'role_ids' => $validated['role_ids'],
            'password_changed' => $request->filled('password'),
        ], $request->user(), $request);

        return back()->with('success', 'Data pengguna berhasil diperbarui.');
    }

    /**
     * Remove the specified user from storage.
     */
    public function destroy(Request $request, User $user, AuditService $audit): RedirectResponse
    {
        abort_unless($request->user()->hasPermission('admin.users.manage'), 403);
        abort_if($request->user()->is($user), 422, 'Anda tidak dapat menghapus akun Anda sendiri.');

        $isLastAdmin = $user->hasRole('administrator') && User::query()->whereHas('roles', fn ($q) => $q->where('slug', 'administrator'))->count() <= 1;
        abort_if($isLastAdmin, 422, 'Tidak dapat menghapus administrator sistem terakhir.');

        $userName = $user->name;
        $userEmail = $user->email;

        try {
            DB::transaction(function () use ($user, $userName, $userEmail, $audit, $request): void {
                $audit->record($user, 'user.deleted', [
                    'email' => $userEmail,
                    'name' => $userName,
                ], $request->user(), $request);

                $user->roles()->detach();
                $user->directMessagesSent()->delete();
                $user->directMessagesReceived()->delete();
                $user->notifications()->delete();
                $user->delete();
            });

            return back()->with('success', "Pengguna {$userName} ({$userEmail}) berhasil dihapus.");
        } catch (QueryException $e) {
            // If user has foreign key constraints on matter/financial records, deactivate safely
            $user->update(['is_active' => false, 'disabled_at' => now()]);

            return back()->with('warning', "Pengguna {$userName} memiliki riwayat perkara atau data keuangan terkait, sehingga akun telah dinonaktifkan secara aman.");
        }
    }

    /**
     * @param  list<int>  $roleIds
     * @return array<int, array{assigned_by: int}>
     */
    private function roleAssignments(array $roleIds, User $actor): array
    {
        $assignments = [];

        foreach ($roleIds as $roleId) {
            $assignments[$roleId] = ['assigned_by' => (int) $actor->getKey()];
        }

        return $assignments;
    }
}
