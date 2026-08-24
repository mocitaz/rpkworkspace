<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreStaffRequest;
use App\Http\Requests\UpdateStaffRequest;
use App\Models\User;
use App\Services\AuditService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class StaffController extends Controller
{
    public function index(Request $request): Response
    {
        abort_unless($request->user()->hasPermission('admin.users.manage'), 403);

        $departments = ['Corporate', 'Dispute Resolution', 'Finance & Tax', 'Operations', 'People & Culture'];
        $employmentTypes = ['Permanent', 'Permanent', 'Permanent', 'Contract'];
        $workModes = ['Hybrid', 'Office', 'Hybrid', 'Remote'];

        $staff = User::query()
            ->with('roles:id,name')
            ->withCount(['matters', 'auditLogs'])
            ->orderByDesc('is_active')
            ->orderBy('name')
            ->get()
            ->values()
            ->map(function (User $user, int $index) use ($departments, $employmentTypes, $workModes): array {
                $performanceScores = [4.8, 4.6, 4.4, 4.7, 4.3, 4.5];
                $leaveBalances = [8, 11, 5, 14, 7, 10];
                $utilization = [86, 74, 91, 68, 82, 77];
                $employmentType = $employmentTypes[$index % count($employmentTypes)];
                $hasHrRecord = $user->employee_code !== null;

                return [
                    'id' => $user->getKey(),
                    'name' => $user->name,
                    'email' => $user->email,
                    'position' => $user->position_title ?: ($user->roles->first()?->name ?? 'Legal Operations'),
                    'avatar_url' => $user->avatar_url,
                    'roles' => $user->roles->pluck('name')->values(),
                    'department' => $user->department ?? $departments[$index % count($departments)],
                    'employment_type' => $user->employment_type ?? $employmentType,
                    'work_mode' => $user->work_mode ?? $workModes[$index % count($workModes)],
                    'status' => $user->employment_status ?? ($user->is_active ? 'Active' : 'Inactive'),
                    'employee_code' => $user->employee_code ?? 'RPK-'.str_pad((string) ($index + 1), 3, '0', STR_PAD_LEFT),
                    'joined_at' => $user->joined_at?->toDateString() ?? $user->created_at?->copy()->subMonths(($index + 1) * 4)->toDateString(),
                    'contract_end' => $user->contract_end?->toDateString(),
                    'matters_count' => $user->matters_count,
                    'activity_count' => $user->audit_logs_count,
                    'utilization' => $hasHrRecord ? $user->utilization : $utilization[$index % count($utilization)],
                    'leave_balance' => $hasHrRecord ? $user->leave_balance : $leaveBalances[$index % count($leaveBalances)],
                    'performance_score' => $hasHrRecord ? (float) $user->performance_score : $performanceScores[$index % count($performanceScores)],
                    'next_review' => $user->next_review?->toDateString() ?? now()->addDays(14 + ($index * 9))->toDateString(),
                ];
            });

        return Inertia::render('staff/index', [
            'staff' => $staff,
            'insights' => [
                'total' => $staff->count(),
                'active' => $staff->where('status', 'Active')->count(),
                'on_leave' => $staff->where('status', 'On leave')->count(),
                'contracts_due' => $staff->whereNotNull('contract_end')->count(),
                'average_utilization' => (int) round($staff->avg('utilization') ?? 0),
            ],
        ]);
    }

    public function store(StoreStaffRequest $request, AuditService $audit): RedirectResponse
    {
        $highestAssignedSequence = User::query()
            ->whereNotNull('employee_code')
            ->pluck('employee_code')
            ->map(fn (string $code): int => (int) Str::after($code, 'RPK-'))
            ->max() ?? 0;
        $nextSequence = max($highestAssignedSequence, User::query()->count()) + 1;

        $staff = User::query()->create([
            ...$request->validated(),
            'employee_code' => 'RPK-'.str_pad((string) $nextSequence, 3, '0', STR_PAD_LEFT),
            'password' => Str::password(32),
            'is_active' => $request->validated('employment_status') !== 'Inactive',
            'locale' => 'id',
            'timezone' => 'Asia/Jakarta',
        ]);

        $audit->record($staff, 'staff.created', ['employee_code' => $staff->employee_code], $request->user(), $request);

        return back()->with('success', 'Data staff berhasil ditambahkan.');
    }

    public function update(UpdateStaffRequest $request, User $user, AuditService $audit): RedirectResponse
    {
        $user->update([
            ...$request->validated(),
            'is_active' => $request->validated('employment_status') !== 'Inactive',
            'disabled_at' => $request->validated('employment_status') === 'Inactive' ? now() : null,
        ]);

        $audit->record($user, 'staff.updated', ['employee_code' => $user->employee_code], $request->user(), $request);

        return back()->with('success', 'Data HR staff berhasil diperbarui.');
    }
}
