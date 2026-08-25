<?php

namespace App\Notifications;

use App\Models\Task;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TaskCompletedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Task $task) {}

    /** @return array<int, string> */
    public function via(object $notifiable): array
    {
        return ['database', 'mail'];
    }

    /** @return array<string, string> */
    public function viaQueues(): array
    {
        return [
            'database' => config('raf.queues.notifications', 'notifications'),
            'mail' => config('raf.queues.notifications', 'notifications'),
        ];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('[Tugas Selesai] '.$this->task->title)
            ->view('mail.task-completed', [
                'task' => $this->task,
                'recipientName' => $notifiable->name ?? 'Bapak/Ibu Partner',
                'actionUrl' => route('tasks.index'),
            ]);
    }

    /** @return array<string, mixed> */
    public function toArray(object $notifiable): array
    {
        return [
            'kind' => 'task_completed',
            'title' => 'Tugas Diselesaikan: '.$this->task->title,
            'message' => ($this->task->assignee?->name ?? 'Pelaksana tugas').' telah menyelesaikan tugas ini.',
            'url' => route('tasks.index'),
            'task_id' => $this->task->getKey(),
            'matter_id' => $this->task->matter_id,
        ];
    }

    public function databaseType(object $notifiable): string
    {
        return 'task-completed';
    }
}
