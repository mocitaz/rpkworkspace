<?php

use App\Models\AuditLog;
use App\Models\Deadline;
use App\Models\DeadlineReminderDelivery;
use App\Models\Matter;
use App\Models\User;
use App\Notifications\DeadlineReminderNotification;
use App\Notifications\TaskAssignedNotification;
use Illuminate\Support\Facades\Notification;
use Inertia\Testing\AssertableInertia as Assert;

it('shows audit records only to users with audit permission', function () {
    $auditor = rafUser(['audit.view']);
    $actor = User::factory()->create();
    AuditLog::factory()->create(['actor_id' => $actor->getKey(), 'event' => 'client.updated']);

    $this->actingAs($auditor)->get(route('admin.audit.index', ['event' => 'client.updated']))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/audit/index')
            ->has('auditLogs.data', 1)
            ->where('filters.event', 'client.updated'));

    $this->actingAs(rafUser())->get(route('admin.audit.index'))->assertForbidden();
});

it('sends task assignment notifications and sends each deadline reminder only once', function () {
    Notification::fake();
    config()->set('raf.notifications.deadline_reminder_hours', [48, 24, 4]);

    $manager = rafUser(['task.view', 'task.create']);
    $assignee = rafUser(['task.view']);
    $this->actingAs($manager)->post(route('tasks.store'), [
        'title' => 'Review kontrak',
        'assignee_id' => $assignee->getKey(),
        'status' => 'todo',
        'priority' => 'high',
    ])->assertSessionHasNoErrors();
    Notification::assertSentTo($assignee, TaskAssignedNotification::class);

    $matter = Matter::factory()->recycle($assignee)->create();
    $deadline = Deadline::factory()->recycle([$matter, $assignee])->create([
        'matter_id' => $matter->getKey(),
        'owner_id' => $assignee->getKey(),
        'due_at' => now()->addHours(3),
        'status' => 'open',
    ]);

    $this->artisan('raf:send-deadline-reminders')->assertSuccessful();
    $this->artisan('raf:send-deadline-reminders')->assertSuccessful();

    expect(DeadlineReminderDelivery::query()->where('deadline_id', $deadline->getKey())->count())->toBe(1);
    Notification::assertSentTo($assignee, DeadlineReminderNotification::class, fn (DeadlineReminderNotification $notification) => $notification->hoursBefore === 4);
});
