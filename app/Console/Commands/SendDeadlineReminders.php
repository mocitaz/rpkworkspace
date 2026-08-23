<?php

namespace App\Console\Commands;

use App\Models\Deadline;
use App\Models\DeadlineReminderDelivery;
use App\Notifications\DeadlineReminderNotification;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('raf:send-deadline-reminders')]
#[Description('Send idempotent in-app reminders for upcoming RAF deadlines')]
class SendDeadlineReminders extends Command
{
    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $hours = config('raf.notifications.deadline_reminder_hours', [48, 24, 4]);

        if (! is_array($hours) || $hours === []) {
            return self::FAILURE;
        }

        $reminderHours = array_map('intval', $hours);
        $sent = 0;

        Deadline::query()
            ->with(['owner:id,name,email,is_active', 'matter:id,matter_number,title'])
            ->where('status', 'open')
            ->whereNotNull('owner_id')
            ->whereBetween('due_at', [now(), now()->addHours(max($reminderHours))])
            ->orderBy('id')
            ->chunkById(100, function ($deadlines) use ($reminderHours, &$sent): void {
                foreach ($deadlines as $deadline) {
                    if ($deadline->owner === null || ! $deadline->owner->is_active) {
                        continue;
                    }

                    $remainingHours = (int) ceil(now()->diffInMinutes($deadline->due_at, false) / 60);

                    $hoursBefore = collect($reminderHours)
                        ->sort()
                        ->first(fn (int $threshold): bool => $remainingHours <= $threshold);

                    if ($hoursBefore === null) {
                        continue;
                    }

                    $delivery = DeadlineReminderDelivery::query()->firstOrCreate([
                        'deadline_id' => $deadline->getKey(),
                        'user_id' => $deadline->owner->getKey(),
                        'hours_before' => $hoursBefore,
                    ]);

                    if ($delivery->wasRecentlyCreated) {
                        $deadline->owner->notify((new DeadlineReminderNotification($deadline, $hoursBefore))->afterCommit());
                        $sent++;
                    }
                }
            });

        $this->info("{$sent} pengingat tenggat dijadwalkan.");

        return self::SUCCESS;
    }
}
