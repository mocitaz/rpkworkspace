<?php

namespace App\Notifications;

use App\Models\Task;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class TaskAssignedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(public Task $task) {}

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
            'kind' => 'task_assigned',
            'title' => 'Tugas baru ditugaskan kepada Anda',
            'message' => $this->task->title,
            'url' => route('tasks.index', ['view' => 'mine']),
            'task_id' => $this->task->getKey(),
            'matter_id' => $this->task->matter_id,
        ];
    }

    public function databaseType(object $notifiable): string
    {
        return 'task-assigned';
    }
}
