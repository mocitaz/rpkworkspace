<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Models\Matter;
use App\Models\Task;
use App\Models\User;
use App\Notifications\TaskAssignedNotification;
use App\Notifications\TaskCompletedNotification;
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
            'matter:id,matter_number,title',
            'assignee:id,name,position_title,avatar_path',
            'reviewer:id,name,position_title,avatar_path',
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
            'metrics' => $metrics,
            'filters' => $request->only(['view', 'status', 'matter_id']),
            'can' => [
                'create' => $request->user()->can('create', Task::class),
                'update' => $request->user()->can('update', Task::class),
                'delete' => $request->user()->can('delete', Task::class),
            ],
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

        $task = Task::query()->create([...$request->validated(), 'reporter_id' => $request->user()->getKey()]);
        $this->notifyAssignee($task, $request->user());
        $audit->record($task, 'task.created', ['assignee_id' => $task->assignee_id], $request->user(), $request);

        return back()->with('success', 'Tugas berhasil dibuat.');
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
        $task->update($attributes);

        if ($task->assignee_id !== $previousAssigneeId) {
            $this->notifyAssignee($task, $request->user());
        }

        if ($task->status === 'completed' && $previousStatus !== 'completed' && $task->reporter_id && $task->reporter_id !== $request->user()->getKey()) {
            $reporter = User::query()->where('is_active', true)->find($task->reporter_id);
            $reporter?->notify((new TaskCompletedNotification($task))->afterCommit());
        }

        $audit->record($task, 'task.updated', ['status' => $task->status, 'assignee_id' => $task->assignee_id], $request->user(), $request);

        return back()->with('success', 'Tugas diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task, AuditService $audit): RedirectResponse
    {
        Gate::authorize('delete', $task);

        $title = $task->title;
        $task->delete();

        $audit->record($task, 'task.deleted', ['title' => $title], request()->user(), request());

        return back()->with('success', 'Tugas berhasil dihapus.');
    }

    private function notifyAssignee(Task $task, User $actor): void
    {
        if ($task->assignee_id === null || $task->assignee_id === $actor->getKey()) {
            return;
        }

        $assignee = User::query()->where('is_active', true)->find($task->assignee_id);
        $assignee?->notify((new TaskAssignedNotification($task))->afterCommit());
    }
}
