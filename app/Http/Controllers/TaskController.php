<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Models\AuditLog;
use App\Models\Document;
use App\Models\Matter;
use App\Models\Task;
use App\Models\User;
use App\Notifications\TaskApprovedNotification;
use App\Notifications\TaskAssignedNotification;
use App\Notifications\TaskCompletedNotification;
use App\Notifications\TaskReviewRequestedNotification;
use App\Notifications\TaskRevisionRequestedNotification;
use App\Services\AuditService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Task::class);
        $visibleMatterIds = Matter::query()->visibleTo($request->user())->select('id');
        $userId = $request->user()->getKey();

        $query = Task::query()->with([
            'matter:id,matter_number,title,client_id',
            'matter.client:id,client_number,display_name,legal_name,type',
            'assignee:id,name,position_title,avatar_path',
            'reviewer:id,name,position_title,avatar_path',
            'reporter:id,name,position_title,avatar_path',
            'comments' => fn ($query) => $query->whereNull('parent_id')->with([
                'user:id,name,position_title,avatar_path',
                'reactions.user:id,name',
                'replies' => fn ($r) => $r->with(['user:id,name,position_title,avatar_path', 'reactions.user:id,name'])->oldest(),
            ])->orderByDesc('is_pinned')->latest(),
        ])
            ->where(fn ($q) => $q->whereNull('matter_id')->orWhereIn('matter_id', $visibleMatterIds))
            ->when($request->string('view')->toString() === 'mine', fn ($q) => $q->where('assignee_id', $userId))
            ->when($request->string('view')->toString() === 'created', fn ($q) => $q->where('reporter_id', $userId))
            ->when($request->string('view')->toString() === 'overdue', fn ($q) => $q->where('due_at', '<', now())->whereNotIn('status', ['completed', 'cancelled']))
            ->when($request->string('status')->toString(), fn ($q, $status) => $q->where('status', $status))
            ->when($request->string('category')->toString(), fn ($q, $cat) => $q->where('category', $cat))
            ->when($request->string('matter_id')->toString(), fn ($q, $matterId) => $q->where('matter_id', $matterId));

        $metrics = [
            'total' => Task::query()->where(fn ($q) => $q->whereNull('matter_id')->orWhereIn('matter_id', $visibleMatterIds))->count(),
            'mine' => Task::query()->where('assignee_id', $userId)->whereNotIn('status', ['completed', 'cancelled'])->count(),
            'overdue' => Task::query()->where(fn ($q) => $q->whereNull('matter_id')->orWhereIn('matter_id', $visibleMatterIds))->where('due_at', '<', now())->whereNotIn('status', ['completed', 'cancelled'])->count(),
            'completed' => Task::query()->where(fn ($q) => $q->whereNull('matter_id')->orWhereIn('matter_id', $visibleMatterIds))->where('status', 'completed')->count(),
        ];

        return Inertia::render('tasks/index', [
            'tasks' => $query->orderByRaw('due_at is null, due_at asc')->paginate(15)->withQueryString(),
            'matters' => Matter::query()->visibleTo($request->user())->whereNotIn('status', ['closed', 'archived'])->orderBy('matter_number')->get(['id', 'matter_number', 'title']),
            'users' => User::query()->where('is_active', true)->orderBy('name')->get(['id', 'name', 'position_title', 'avatar_path']),
            'categories' => self::categories(),
            'stages' => self::stages(),
            'metrics' => $metrics,
            'filters' => $request->only(['view', 'status', 'category', 'matter_id']),
            'can' => [
                'create' => $request->user()->can('create', Task::class),
                'update' => $request->user()->can('update', Task::class),
                'delete' => $request->user()->can('delete', Task::class),
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request): Response
    {
        Gate::authorize('create', Task::class);

        $year = now()->format('Y');
        $lastTask = Task::query()
            ->where('task_number', 'like', "TSK-{$year}-%")
            ->orderByDesc('task_number')
            ->first();
        $nextSeq = 1;
        if ($lastTask && preg_match('/TSK-\d{4}-(\d+)/', (string) $lastTask->task_number, $matches)) {
            $nextSeq = ((int) $matches[1]) + 1;
        }
        $nextTaskNumber = sprintf('TSK-%s-%04d', $year, $nextSeq);

        return Inertia::render('tasks/create', [
            'defaultTaskNumber' => $nextTaskNumber,
            'matters' => Matter::query()
                ->visibleTo($request->user())
                ->whereNotIn('status', ['closed', 'archived'])
                ->with('client:id,client_number,display_name,legal_name,type')
                ->orderBy('matter_number')
                ->get(['id', 'matter_number', 'title', 'client_id']),
            'users' => User::query()
                ->where('is_active', true)
                ->orderBy('name')
                ->get(['id', 'name', 'position_title', 'department', 'avatar_path']),
            'categories' => self::categories(),
            'stages' => self::stages(),
            'preselectedMatterId' => $request->query('matter_id'),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTaskRequest $request, AuditService $audit): RedirectResponse
    {
        if ($request->validated('matter_id')) {
            Gate::authorize('view', Matter::query()->findOrFail($request->validated('matter_id')));
        }

        $attributes = $request->validated();
        $attributes['reporter_id'] = $request->user()->getKey();

        // Format and clean checklists
        if (isset($attributes['checklists']) && is_array($attributes['checklists'])) {
            $attributes['checklists'] = array_values(array_filter(array_map(function ($item, $index) {
                if (empty($item['title'])) {
                    return null;
                }

                return [
                    'id' => $item['id'] ?? (string) str()->ulid(),
                    'title' => trim((string) $item['title']),
                    'is_completed' => (bool) ($item['is_completed'] ?? false),
                    'completed_at' => ($item['is_completed'] ?? false) ? ($item['completed_at'] ?? now()->toIso8601String()) : null,
                ];
            }, $attributes['checklists'], array_keys($attributes['checklists']))));
        }

        $task = Task::query()->create($attributes);
        $this->notifyAssignee($task, $request->user());
        $audit->record($task, 'task.created', [
            'task_number' => $task->task_number,
            'assignee_id' => $task->assignee_id,
            'priority' => $task->priority,
        ], $request->user(), $request);

        return redirect()->route('tasks.show', $task)->with('success', "Tugas {$task->task_number} berhasil dibuat.");
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Task $task): Response
    {
        Gate::authorize('view', $task);

        $task->load([
            'matter:id,matter_number,title,client_id,practice_area_id,status',
            'matter.client:id,client_number,display_name,legal_name,type',
            'matter.practiceArea:id,name',
            'assignee:id,name,email,position_title,avatar_path,department',
            'reviewer:id,name,email,position_title,avatar_path,department',
            'reporter:id,name,email,position_title,avatar_path,department',
            'comments' => fn ($query) => $query->whereNull('parent_id')->with([
                'user:id,name,position_title,avatar_path',
                'reactions.user:id,name',
                'replies' => fn ($r) => $r->with(['user:id,name,position_title,avatar_path', 'reactions.user:id,name'])->oldest(),
            ])->orderByDesc('is_pinned')->latest(),
        ]);

        $documents = [];
        if ($task->matter_id) {
            $documents = Document::query()
                ->where('matter_id', $task->matter_id)
                ->with('latestVersion')
                ->latest()
                ->take(10)
                ->get(['id', 'document_number', 'title', 'category', 'status', 'created_at']);
        }

        $auditLogs = AuditLog::query()
            ->where(function ($q) use ($task) {
                $q->where('subject_type', $task->getMorphClass())
                    ->orWhere('subject_type', Task::class);
            })
            ->where('subject_id', (string) $task->getKey())
            ->with('actor:id,name,avatar_path,position_title')
            ->latest('created_at')
            ->take(20)
            ->get();

        $staffList = User::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'position_title', 'department', 'avatar_path']);

        return Inertia::render('tasks/show', [
            'task' => $task,
            'documents' => $documents,
            'auditLogs' => $auditLogs,
            'staffList' => $staffList,
            'categories' => self::categories(),
            'stages' => self::stages(),
            'can' => [
                'update' => $request->user()->can('update', $task),
                'delete' => $request->user()->can('delete', $task),
            ],
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request, Task $task): Response
    {
        Gate::authorize('update', $task);

        return $this->show($request, $task);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTaskRequest $request, Task $task, AuditService $audit): RedirectResponse
    {
        $previousAssigneeId = $task->assignee_id;
        $previousStatus = $task->status;
        $attributes = $request->validated();
        $attributes['completed_at'] = $attributes['status'] === 'completed' ? ($task->completed_at ?: now()) : null;

        // Format checklists if provided
        if (array_key_exists('checklists', $attributes)) {
            if (is_array($attributes['checklists'])) {
                $attributes['checklists'] = array_values(array_filter(array_map(function ($item) {
                    if (empty($item['title'])) {
                        return null;
                    }

                    return [
                        'id' => $item['id'] ?? (string) str()->ulid(),
                        'title' => trim((string) $item['title']),
                        'is_completed' => (bool) ($item['is_completed'] ?? false),
                        'completed_at' => ($item['is_completed'] ?? false) ? ($item['completed_at'] ?? now()->toIso8601String()) : null,
                    ];
                }, $attributes['checklists'])));
            } else {
                $attributes['checklists'] = null;
            }
        }

        $task->update($attributes);

        if ($task->assignee_id !== $previousAssigneeId) {
            $this->notifyAssignee($task, $request->user());
        }

        if ($task->status === 'completed' && $previousStatus !== 'completed' && $task->reporter_id && $task->reporter_id !== $request->user()->getKey()) {
            $reporter = User::query()->where('is_active', true)->find($task->reporter_id);
            $reporter?->notify((new TaskCompletedNotification($task))->afterCommit());
        }

        $audit->record($task, 'task.updated', [
            'task_number' => $task->task_number,
            'status' => $task->status,
            'assignee_id' => $task->assignee_id,
        ], $request->user(), $request);

        return back()->with('success', "Tugas {$task->task_number} berhasil diperbarui.");
    }

    /**
     * Toggle a specific checklist item.
     */
    public function toggleChecklist(Request $request, Task $task, string $checklistId, AuditService $audit): RedirectResponse
    {
        Gate::authorize('update', $task);

        $checklists = $task->checklists ?? [];
        $updated = false;
        $isCompletedNow = false;

        foreach ($checklists as &$item) {
            if (($item['id'] ?? '') === $checklistId) {
                $item['is_completed'] = ! ($item['is_completed'] ?? false);
                $item['completed_at'] = $item['is_completed'] ? now()->toIso8601String() : null;
                $isCompletedNow = $item['is_completed'];
                $updated = true;
                break;
            }
        }

        if ($updated) {
            $task->update(['checklists' => $checklists]);
            $audit->record($task, 'task.checklist_toggled', [
                'checklist_id' => $checklistId,
                'is_completed' => $isCompletedNow,
            ], $request->user(), $request);
        }

        return back()->with('success', 'Status checklist diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task, AuditService $audit): RedirectResponse
    {
        Gate::authorize('delete', $task);

        $taskNumber = $task->task_number ?? $task->title;
        $task->delete();

        $audit->record($task, 'task.deleted', ['task_number' => $taskNumber], request()->user(), request());

        return redirect()->route('tasks.index')->with('success', "Tugas {$taskNumber} berhasil dihapus.");
    }

    /**
     * Submit task for review to reviewer or partner.
     */
    public function submitReview(Request $request, Task $task, AuditService $audit): RedirectResponse
    {
        Gate::authorize('update', $task);

        $validated = $request->validate([
            'notes' => ['nullable', 'string', 'max:2000'],
        ]);

        $notes = ! empty($validated['notes']) ? trim((string) $validated['notes']) : null;

        $task->update([
            'status' => 'review',
        ]);

        // If reviewer is set, notify reviewer; otherwise notify reporter
        $recipientId = $task->reviewer_id ?: $task->reporter_id;
        if ($recipientId && $recipientId !== $request->user()->getKey()) {
            $reviewer = User::query()->where('is_active', true)->find($recipientId);
            $reviewer?->notify((new TaskReviewRequestedNotification($task, $request->user(), $notes))->afterCommit());
        }

        // Add discussion comment if notes provided
        if (! empty($notes)) {
            $task->comments()->create([
                'user_id' => $request->user()->getKey(),
                'body' => "📤 **[Pengajuan Review Tugas]**\n\n".$notes,
            ]);
        }

        $audit->record($task, 'task.review_requested', [
            'task_number' => $task->task_number,
            'reviewer_id' => $task->reviewer_id,
            'notes' => $notes,
        ], $request->user(), $request);

        return back()->with('success', "Tugas {$task->task_number} berhasil diajukan untuk ditinjau oleh Pemeriksa.");
    }

    /**
     * Approve and complete task.
     */
    public function approve(Request $request, Task $task, AuditService $audit): RedirectResponse
    {
        Gate::authorize('update', $task);

        $validated = $request->validate([
            'remarks' => ['nullable', 'string', 'max:2000'],
        ]);

        $remarks = ! empty($validated['remarks']) ? trim((string) $validated['remarks']) : null;

        $task->update([
            'status' => 'completed',
            'completed_at' => now(),
        ]);

        // Notify assignee if not the approver
        if ($task->assignee_id && $task->assignee_id !== $request->user()->getKey()) {
            $assignee = User::query()->where('is_active', true)->find($task->assignee_id);
            $assignee?->notify((new TaskApprovedNotification($task, $request->user(), $remarks))->afterCommit());
        }

        // Notify reporter if different from assignee and approver
        if ($task->reporter_id && $task->reporter_id !== $request->user()->getKey() && $task->reporter_id !== $task->assignee_id) {
            $reporter = User::query()->where('is_active', true)->find($task->reporter_id);
            $reporter?->notify((new TaskCompletedNotification($task))->afterCommit());
        }

        // Add discussion comment if remarks provided
        if (! empty($remarks)) {
            $task->comments()->create([
                'user_id' => $request->user()->getKey(),
                'body' => "✅ **[Persetujuan & Penyelesaian Tugas]**\n\n".$remarks,
            ]);
        }

        $audit->record($task, 'task.approved', [
            'task_number' => $task->task_number,
            'approver_id' => $request->user()->getKey(),
            'remarks' => $remarks,
        ], $request->user(), $request);

        return back()->with('success', "Tugas {$task->task_number} telah berhasil disetujui & diselesaikan.");
    }

    /**
     * Request revision on task.
     */
    public function requestRevision(Request $request, Task $task, AuditService $audit): RedirectResponse
    {
        Gate::authorize('update', $task);

        $validated = $request->validate([
            'feedback' => ['required', 'string', 'min:3', 'max:2000'],
        ]);

        $feedback = trim((string) $validated['feedback']);

        $task->update([
            'status' => 'in_progress',
        ]);

        // Notify assignee
        if ($task->assignee_id && $task->assignee_id !== $request->user()->getKey()) {
            $assignee = User::query()->where('is_active', true)->find($task->assignee_id);
            $assignee?->notify((new TaskRevisionRequestedNotification($task, $request->user(), $feedback))->afterCommit());
        }

        // Add discussion comment with feedback
        $task->comments()->create([
            'user_id' => $request->user()->getKey(),
            'body' => "⚠️ **[Permintaan Revisi Tugas]**\n\n".$feedback,
        ]);

        $audit->record($task, 'task.revision_requested', [
            'task_number' => $task->task_number,
            'reviewer_id' => $request->user()->getKey(),
            'feedback' => $feedback,
        ], $request->user(), $request);

        return back()->with('success', "Instruksi revisi tugas {$task->task_number} telah dikirimkan kepada pelaksana.");
    }

    private function notifyAssignee(Task $task, User $actor): void
    {
        if ($task->assignee_id === null || $task->assignee_id === $actor->getKey()) {
            return;
        }

        $assignee = User::query()->where('is_active', true)->find($task->assignee_id);
        $assignee?->notify((new TaskAssignedNotification($task))->afterCommit());
    }

    /**
     * @return array<int, array{id: string, name: string}>
     */
    public static function categories(): array
    {
        return [
            ['id' => 'drafting', 'name' => 'Drafting Dokumen / Surat Kuasa / Gugatan'],
            ['id' => 'legal_research', 'name' => 'Riset Hukum & Legal Opinion'],
            ['id' => 'court_hearing', 'name' => 'Kehadiran Sidang Pengadilan'],
            ['id' => 'investigation', 'name' => 'Penyelidikan / BAP Kepolisian / Kejaksaan'],
            ['id' => 'meeting_negotiation', 'name' => 'Mediasi / Negosiasi / Rapat Klien'],
            ['id' => 'agency_filing', 'name' => 'Pendaftaran / PNBP / Berkas Instansi'],
            ['id' => 'administration', 'name' => 'Administrasi & Operasional Kantor'],
            ['id' => 'general', 'name' => 'Lain-lain / Umum'],
        ];
    }

    /**
     * @return array<int, array{id: string, name: string}>
     */
    public static function stages(): array
    {
        return [
            ['id' => 'pre_litigation', 'name' => 'Pra-Litigasi / Somasi / Konsultasi'],
            ['id' => 'district_court', 'name' => 'Pengadilan Negeri / Tingkat I'],
            ['id' => 'high_court', 'name' => 'Pengadilan Tinggi (Banding)'],
            ['id' => 'supreme_court', 'name' => 'Mahkamah Agung (Kasasi / PK)'],
            ['id' => 'execution', 'name' => 'Eksekusi Putusan'],
            ['id' => 'non_litigation', 'name' => 'Non-Litigasi / Corporate Legal'],
            ['id' => 'general', 'name' => 'Umum / Non-Perkara'],
        ];
    }
}
