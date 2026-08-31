<?php

use App\Models\Task;
use App\Models\User;
use App\Notifications\TaskOverdueNotification;
use Illuminate\Support\Facades\Notification;

it('reminds the assignee on H+1 and never duplicates the same reminder', function () {
    Notification::fake();
    $this->travelTo('2026-08-21 09:00:00');

    $assignee = User::factory()->create();
    $reporter = User::factory()->create();
    Task::factory()->create([
        'assignee_id' => $assignee->id,
        'reporter_id' => $reporter->id,
        'due_at' => now()->subDay(),
    ]);

    $this->artisan('raf:send-task-overdue-reminders')->assertSuccessful();
    $this->artisan('raf:send-task-overdue-reminders')->assertSuccessful();

    Notification::assertSentToTimes($assignee, TaskOverdueNotification::class, 1);
    Notification::assertNotSentTo($reporter, TaskOverdueNotification::class);
});

it('uses H+3 and escalates to the reporter from H+7 then every seven days', function (int $overdueDays, bool $escalated) {
    Notification::fake();
    $this->travelTo('2026-08-21 09:00:00');

    $assignee = User::factory()->create();
    $reporter = User::factory()->create();
    Task::factory()->create([
        'assignee_id' => $assignee->id,
        'reporter_id' => $reporter->id,
        'due_at' => now()->subDays($overdueDays),
    ]);

    $this->artisan('raf:send-task-overdue-reminders')->assertSuccessful();

    Notification::assertSentTo($assignee, TaskOverdueNotification::class);

    if ($escalated) {
        Notification::assertSentTo($reporter, TaskOverdueNotification::class);
    } else {
        Notification::assertNotSentTo($reporter, TaskOverdueNotification::class);
    }
})->with([
    'H+3' => [3, false],
    'H+7' => [7, true],
    'H+14' => [14, true],
    'H+21' => [21, true],
]);

it('does not send outside the cadence or for terminal task statuses', function () {
    Notification::fake();
    $this->travelTo('2026-08-21 09:00:00');

    Task::factory()->create(['due_at' => now()->subDays(2)]);
    Task::factory()->create(['due_at' => now()->subDays(8)]);
    Task::factory()->create(['due_at' => now()->subDay(), 'status' => 'completed']);
    Task::factory()->create(['due_at' => now()->subDay(), 'status' => 'cancelled']);

    $this->artisan('raf:send-task-overdue-reminders')->assertSuccessful();

    Notification::assertNothingSent();
});

it('starts a fresh reminder cycle after the deadline changes', function () {
    Notification::fake();
    $this->travelTo('2026-08-21 09:00:00');

    $assignee = User::factory()->create();
    $task = Task::factory()->create([
        'assignee_id' => $assignee->id,
        'due_at' => now()->subDay(),
    ]);

    $this->artisan('raf:send-task-overdue-reminders')->assertSuccessful();

    $task->update(['due_at' => now()]);
    $this->travel(1)->day();
    $this->artisan('raf:send-task-overdue-reminders')->assertSuccessful();

    Notification::assertSentToTimes($assignee, TaskOverdueNotification::class, 2);
});
