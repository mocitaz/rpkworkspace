<?php

namespace App\Notifications;

use App\Models\Task;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TaskOverdueNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Task $task,
        public ?int $overdueDays = null,
        public bool $escalated = false,
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
        $this->task->loadMissing(['assignee', 'reporter', 'matter.client']);

        return (new MailMessage)
            ->subject('[PERINGATAN TENGGAT MELEBIHI WAKTU] '.$this->task->title)
            ->view('mail.task-overdue', [
                'task' => $this->task,
                'recipientName' => $notifiable->name ?? 'Rekan Kerja',
                'overdueDays' => $this->overdueDays,
                'escalated' => $this->escalated,
                'actionUrl' => rtrim((string) config('app.url'), '/').route('tasks.show', $this->task, false),
            ]);
    }

    /** @return array<string, mixed> */
    public function toArray(object $notifiable): array
    {
        return [
            'kind' => 'task_overdue',
            'title' => 'Tugas Melewati Batas Waktu: '.$this->task->title,
            'message' => 'Tugas belum diselesaikan padahal sudah melewati tanggal jatuh tempo.',
            'url' => route('tasks.show', $this->task),
            'task_id' => $this->task->getKey(),
            'matter_id' => $this->task->matter_id,
            'severity' => 'high',
            'overdue_days' => $this->overdueDays,
            'escalated' => $this->escalated,
        ];
    }

    public function databaseType(object $notifiable): string
    {
        return 'task-overdue';
    }
}
