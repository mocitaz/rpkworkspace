<?php

use App\Models\AuditLog;
use App\Models\Client;
use App\Models\Matter;
use App\Models\Task;

it('creates, assigns, and completes an authorized task with an audit trail', function () {
    $manager = rafUser(['task.view', 'task.create', 'task.manage']);
    $assignee = rafUser(['task.view']);

    $this->actingAs($manager)->post(route('tasks.store'), [
        'title' => 'Review legal memorandum',
        'category' => 'drafting',
        'stage' => 'district_court',
        'assignee_id' => $assignee->getKey(),
        'status' => 'todo',
        'priority' => 'high',
        'start_date' => '2026-08-26',
        'due_at' => '2026-08-30 17:00:00',
        'is_billable' => true,
        'estimated_hours' => 4.5,
        'checklists' => [
            ['id' => 'chk-1', 'title' => 'Kumpulkan alat bukti P-1 s/d P-5', 'is_completed' => false],
            ['id' => 'chk-2', 'title' => 'Draft gugatan awal', 'is_completed' => false],
        ],
    ])->assertSessionHasNoErrors();

    $task = Task::query()->firstOrFail();
    expect($task->assignee_id)->toBe($assignee->getKey())
        ->and($task->task_number)->toStartWith('TSK-')
        ->and($task->category)->toBe('drafting')
        ->and($task->stage)->toBe('district_court')
        ->and($task->is_billable)->toBeTrue()
        ->and((float) $task->estimated_hours)->toBe(4.5)
        ->and(count($task->checklists))->toBe(2)
        ->and(AuditLog::query()->where('event', 'task.created')->where('subject_id', $task->getKey())->exists())->toBeTrue();

    // Test checklist toggle
    $this->actingAs($manager)->patch(route('tasks.checklists.toggle', [$task, 'chk-1']))
        ->assertSessionHasNoErrors();

    $task->refresh();
    expect($task->checklists[0]['is_completed'])->toBeTrue();

    $this->actingAs($manager)->put(route('tasks.update', $task), [
        'title' => $task->title,
        'assignee_id' => $assignee->getKey(),
        'status' => 'completed',
        'priority' => 'high',
        'completion_notes' => 'Gugatan sudah siap dan di-ACC partner.',
    ])->assertSessionHasNoErrors();

    expect($task->fresh()->status)->toBe('completed')
        ->and($task->fresh()->completed_at)->not->toBeNull()
        ->and($task->fresh()->completion_notes)->toBe('Gugatan sudah siap dan di-ACC partner.');
});

it('can render tasks.create and tasks.show pages', function () {
    $manager = rafUser(['task.view', 'task.create', 'task.manage', 'matter.view']);
    $client = Client::factory()->create(['display_name' => 'PT Test Client']);
    $matter = Matter::factory()->create(['client_id' => $client->getKey(), 'status' => 'open']);
    $task = Task::factory()->create([
        'reporter_id' => $manager->getKey(),
        'task_number' => 'TSK-2026-0001',
        'matter_id' => $matter->getKey(),
    ]);

    $this->actingAs($manager)->get(route('tasks.create'))
        ->assertOk();

    $this->actingAs($manager)->get(route('tasks.show', $task))
        ->assertOk();
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
