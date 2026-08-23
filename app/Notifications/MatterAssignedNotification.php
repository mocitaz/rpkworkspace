<?php

namespace App\Notifications;

use App\Models\Matter;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class MatterAssignedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(public Matter $matter) {}

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
            'kind' => 'matter_assigned',
            'title' => 'Anda ditambahkan ke tim matter',
            'message' => $this->matter->matter_number.' — '.$this->matter->title,
            'url' => route('matters.show', $this->matter),
            'matter_id' => $this->matter->getKey(),
        ];
    }

    public function databaseType(object $notifiable): string
    {
        return 'matter-assigned';
    }
}
