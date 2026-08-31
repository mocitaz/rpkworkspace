<?php

namespace App\Console\Commands;

use App\Models\Task;
use App\Models\TaskOverdueReminderDelivery;
use App\Models\User;
use App\Notifications\TaskOverdueNotification;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('raf:send-task-overdue-reminders')]
#[Description('Send idempotent overdue task reminders using the H+1, H+3, H+7, then weekly cadence')]
class SendTaskOverdueReminders extends Command
{
    public function handle(): int
    {
        $sent = 0;

        Task::query()
            ->with([
                'assignee:id,name,email,is_active',
                'reporter:id,name,email,is_active',
                'matter.client',
            ])
            ->whereNotIn('status', ['completed', 'cancelled'])
            ->whereNotNull('assignee_id')
            ->whereNotNull('due_at')
            ->where('due_at', '<=', now()->subDay())
            ->chunkById(100, function ($tasks) use (&$sent): void {
                foreach ($tasks as $task) {
                    $overdueDays = intdiv(
                        (int) $task->due_at->diffInSeconds(now(), false),
                        86_400,
                    );

                    if (! $this->isReminderDay($overdueDays)) {
                        continue;
                    }

                    $sent += $this->notify($task, $task->assignee, $overdueDays, false);

                    if ($overdueDays >= 7 && $task->reporter_id !== $task->assignee_id) {
                        $sent += $this->notify($task, $task->reporter, $overdueDays, true);
                    }
                }
            });

        $this->info("{$sent} pengingat tugas terlambat dijadwalkan.");

        return self::SUCCESS;
    }

    private function isReminderDay(int $overdueDays): bool
    {
        return in_array($overdueDays, [1, 3, 7], true)
            || ($overdueDays > 7 && $overdueDays % 7 === 0);
    }

    private function notify(Task $task, ?User $recipient, int $overdueDays, bool $escalated): int
    {
        if ($recipient === null || ! $recipient->is_active) {
            return 0;
        }

        $delivery = TaskOverdueReminderDelivery::query()->firstOrCreate([
            'task_id' => $task->getKey(),
            'user_id' => $recipient->getKey(),
            'task_due_at' => $task->due_at,
            'overdue_days' => $overdueDays,
        ], [
            'sent_at' => now(),
        ]);

        if (! $delivery->wasRecentlyCreated) {
            return 0;
        }

        $recipient->notify(
            (new TaskOverdueNotification($task, $overdueDays, $escalated))->afterCommit(),
        );

        return 1;
    }
}
