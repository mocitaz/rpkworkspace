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

it('allows authorized users to prune audit logs by retention duration and records an audit event', function () {
    $auditor = rafUser(['audit.view']);
    $actor = User::factory()->create();

    // Create old logs (> 45 days ago)
    AuditLog::factory()->create([
        'actor_id' => $actor->getKey(),
        'event' => 'document.viewed',
        'created_at' => now()->subDays(45),
    ]);

    // Create recent log (< 5 days ago)
    $recentLog = AuditLog::factory()->create([
        'actor_id' => $actor->getKey(),
        'event' => 'matter.created',
        'created_at' => now()->subDays(2),
    ]);

    // Prune logs older than 30 days
    $this->actingAs($auditor)
        ->from(route('admin.audit.index'))
        ->post(route('admin.audit.prune'), ['retention' => '30'])
        ->assertRedirect(route('admin.audit.index'))
        ->assertSessionHas('success');

    // Old log should be deleted, recent log retained, and new audit.pruned log created
    expect(AuditLog::query()->where('id', $recentLog->getKey())->exists())->toBeTrue()
        ->and(AuditLog::query()->where('event', 'document.viewed')->exists())->toBeFalse()
        ->and(AuditLog::query()->where('event', 'audit.pruned')->exists())->toBeTrue();
});

it('forbids unauthorized users from pruning audit logs', function () {
    $this->actingAs(rafUser())
        ->post(route('admin.audit.prune'), ['retention' => '30'])
        ->assertForbidden();
});

it('can prune audit logs via artisan command', function () {
    $actor = User::factory()->create();

    AuditLog::factory()->create([
        'actor_id' => $actor->getKey(),
        'event' => 'invoice.sent',
        'created_at' => now()->subDays(100),
    ]);

    $this->artisan('raf:prune-audit-logs', ['--days' => 90])
        ->assertSuccessful()
        ->expectsOutputToContain('Berhasil membersihkan');

    expect(AuditLog::query()->where('event', 'invoice.sent')->exists())->toBeFalse();
});
