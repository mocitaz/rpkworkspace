<?php

namespace App\Notifications;

use App\Models\Task;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TaskReviewRequestedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Task $task,
        public User $actor,
        public ?string $notes = null
    ) {}

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
            ->subject('[Permintaan Review Tugas] '.$this->task->task_number.': '.$this->task->title)
            ->view('mail.task-review-requested', [
                'task' => $this->task,
                'actor' => $this->actor,
                'notes' => $this->notes,
                'recipientName' => $notifiable->name ?? 'Bapak/Ibu Partner',
                'actionUrl' => route('tasks.show', $this->task),
            ]);
    }

    /** @return array<string, mixed> */
    public function toArray(object $notifiable): array
    {
        return [
            'kind' => 'task_review_requested',
            'title' => 'Permintaan Review: '.$this->task->task_number,
            'message' => $this->actor->name.' telah menyelesaikan pengerjaan dan mengajukan review tugas "'.$this->task->title.'".',
            'url' => route('tasks.show', $this->task),
            'task_id' => $this->task->getKey(),
            'matter_id' => $this->task->matter_id,
            'notes' => $this->notes,
        ];
    }

    public function databaseType(object $notifiable): string
    {
        return 'task-review-requested';
    }
}
