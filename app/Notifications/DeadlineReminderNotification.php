<?php

namespace App\Notifications;

use App\Models\Deadline;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class DeadlineReminderNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(public Deadline $deadline, public int $hoursBefore) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /** @return array<string, string> */
    public function viaQueues(): array
    {
        return ['database' => config('raf.queues.notifications', 'notifications')];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'kind' => 'deadline_reminder',
            'title' => 'Pengingat tenggat '.$this->hoursBefore.' jam',
            'message' => $this->deadline->title,
            'url' => route('matters.show', $this->deadline->matter_id),
            'deadline_id' => $this->deadline->getKey(),
            'matter_id' => $this->deadline->matter_id,
            'due_at' => $this->deadline->due_at?->toIso8601String(),
        ];
    }

    public function databaseType(object $notifiable): string
    {
        return 'deadline-reminder';
    }
}
