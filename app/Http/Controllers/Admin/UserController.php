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
use Illuminate\Support\Facades\Storage;
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

    /**
     * Show the form for creating a new user / staff member.
     */
    public function create(Request $request): Response
    {
        abort_unless($request->user()->hasPermission('admin.users.manage'), 403);

        $latestUser = User::query()->whereNotNull('employee_code')->latest('id')->first();
        $nextEmployeeCode = 'RPK-'.str_pad((string) (User::query()->count() + 1), 3, '0', STR_PAD_LEFT);

        return Inertia::render('admin/users/create', [
            'roles' => Role::query()->with('permissions:id,name,description')->orderBy('name')->get(),
            'departments' => $this->departmentOptions(),
            'positions' => $this->positionOptions(),
            'employmentTypes' => $this->employmentTypeOptions(),
            'workModes' => $this->workModeOptions(),
            'defaultEmployeeCode' => $nextEmployeeCode,
        ]);
    }

    /**
     * Show the form for editing the specified user / staff member.
     */
    public function edit(Request $request, User $user): Response
    {
        abort_unless($request->user()->hasPermission('admin.users.manage'), 403);

        $user->load(['roles:id,name,slug,description', 'roles.permissions:id,name']);

        return Inertia::render('admin/users/edit', [
            'staff' => $user,
            'roles' => Role::query()->with('permissions:id,name,description')->orderBy('name')->get(),
            'departments' => $this->departmentOptions(),
            'positions' => $this->positionOptions(),
            'employmentTypes' => $this->employmentTypeOptions(),
            'workModes' => $this->workModeOptions(),
        ]);
    }

    /**
     * Display the specified user profile details.
     */
    public function show(Request $request, User $user): Response
    {
        abort_unless($request->user()->hasPermission('admin.users.manage'), 403);

        $user->load([
            'roles:id,name,slug,description',
            'roles.permissions:id,name',
            'matters' => fn ($q) => $q->select(['matters.id', 'matters.matter_number', 'matters.title', 'matters.status', 'matters.priority', 'matters.opened_at'])->latest('matters.opened_at')->take(10),
        ]);

        $roles = Role::query()->with('permissions:id,name')->orderBy('name')->get();

        return Inertia::render('admin/users/show', [
            'staff' => $user,
            'roles' => $roles,
            'metrics' => [
                'active_matters_count' => $user->matters()->where('status', 'active')->count(),
                'total_matters_count' => $user->matters()->count(),
            ],
        ]);
    }

    public function store(StoreAdminUserRequest $request, AuditService $audit): RedirectResponse
    {
        $hasCustomPassword = $request->filled('password');
        $initialPassword = $hasCustomPassword ? (string) $request->input('password') : 'password';

        $user = DB::transaction(function () use ($request, $initialPassword) {
            $data = $request->safe()->except(['role_ids', 'password', 'avatar']);
            $data['password'] = $initialPassword;
            $data['email_verified_at'] = now();
            $data['is_active'] = true;

            if ($request->hasFile('avatar')) {
                $data['avatar_path'] = $request->file('avatar')->store('avatars', 'public');
            }

            $user = User::query()->create($data);
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

        return redirect()->route('admin.users.show', $user)->with(
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
            $data = collect($validated)->except(['role_ids', 'password', 'avatar', 'remove_avatar'])->all();
            if ($request->filled('password')) {
                $data['password'] = (string) $request->input('password');
            }
            $data['disabled_at'] = $validated['is_active'] ? null : now();
            $data['email_verified_at'] = $user->email_verified_at ?? now();

            // If email is modified by admin, auto-verify immediately
            if (isset($data['email']) && $data['email'] !== $user->email) {
                $data['email_verified_at'] = now();
            }

            // Handle avatar removal or update
            if ($request->boolean('remove_avatar') && $user->avatar_path) {
                Storage::disk('public')->delete($user->avatar_path);
                $data['avatar_path'] = null;
            }

            if ($request->hasFile('avatar')) {
                if ($user->avatar_path) {
                    Storage::disk('public')->delete($user->avatar_path);
                }
                $data['avatar_path'] = $request->file('avatar')->store('avatars', 'public');
            }

            $user->update($data);
            $user->roles()->sync($this->roleAssignments($validated['role_ids'], $request->user()));
        });
        $audit->record($user, 'user.updated', [
            'is_active' => $user->is_active,
            'role_ids' => $validated['role_ids'],
            'password_changed' => $request->filled('password'),
        ], $request->user(), $request);

        return redirect()->route('admin.users.show', $user)->with('success', 'Profil dan data pengguna berhasil diperbarui.');
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

    /**
     * @return list<string>
     */
    private function departmentOptions(): array
    {
        return [
            'Litigasi dan Non Litigasi',
            'Corporate Legal',
            'Executive & Strategic Litigation',
            'Finance & Accounting',
            'General Affairs & Operations',
        ];
    }

    /**
     * @return list<string>
     */
    private function positionOptions(): array
    {
        return [
            'Managing Partner',
            'Senior Partner',
            'Partner',
            'Senior Associate',
            'Junior Associate',
            'Advokat Magang',
            'Paralegal',
            'Legal Assistant',
            'Finance Manager',
            'Office Administrator',
        ];
    }

    /**
     * @return list<string>
     */
    private function employmentTypeOptions(): array
    {
        return [
            'Permanent',
            'Contract',
            'Internship',
            'Of Counsel',
            'Partner',
        ];
    }

    /**
     * @return list<string>
     */
    private function workModeOptions(): array
    {
        return [
            'WFO',
            'Hybrid',
            'Remote',
        ];
    }
}
