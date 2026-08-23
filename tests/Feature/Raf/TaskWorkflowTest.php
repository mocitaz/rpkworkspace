<?php

use App\Models\AuditLog;
use App\Models\Task;

it('creates, assigns, and completes an authorized task with an audit trail', function () {
    $manager = rafUser(['task.view', 'task.create', 'task.manage']);
    $assignee = rafUser(['task.view']);

    $this->actingAs($manager)->post(route('tasks.store'), [
        'title' => 'Review legal memorandum',
        'assignee_id' => $assignee->getKey(),
        'status' => 'todo',
        'priority' => 'high',
    ])->assertSessionHasNoErrors();

    $task = Task::query()->firstOrFail();
    expect($task->assignee_id)->toBe($assignee->getKey())
        ->and(AuditLog::query()->where('event', 'task.created')->where('subject_id', $task->getKey())->exists())->toBeTrue();

    $this->actingAs($manager)->put(route('tasks.update', $task), [
        'title' => $task->title,
        'assignee_id' => $assignee->getKey(),
        'status' => 'completed',
        'priority' => 'high',
    ])->assertSessionHasNoErrors();

    expect($task->fresh()->status)->toBe('completed')
        ->and($task->fresh()->completed_at)->not->toBeNull();
});

it('denies task creation and updates without the required capability', function () {
    $manager = rafUser(['task.view', 'task.create', 'task.manage']);
    $outsider = rafUser(['task.view']);
    $task = Task::factory()->create(['reporter_id' => $manager->getKey()]);

    $this->actingAs($outsider)->post(route('tasks.store'), [
        'title' => 'Unauthorized task', 'status' => 'todo', 'priority' => 'normal',
    ])->assertForbidden();

    $this->actingAs($outsider)->put(route('tasks.update', $task), [
        'title' => $task->title, 'status' => 'completed', 'priority' => $task->priority,
    ])->assertForbidden();
});
