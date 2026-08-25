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
            ->subject('[PERINGATAN TENGGAT MELEBIHI WAKTU] '.$this->task->title)
            ->view('mail.task-overdue', [
                'task' => $this->task,
                'recipientName' => $notifiable->name ?? 'Rekan Kerja',
                'actionUrl' => route('tasks.index', ['view' => 'mine']),
            ]);
    }

    /** @return array<string, mixed> */
    public function toArray(object $notifiable): array
    {
        return [
            'kind' => 'task_overdue',
            'title' => 'Tugas Melewati Batas Waktu: '.$this->task->title,
            'message' => 'Tugas belum diselesaikan padahal sudah melewati tanggal jatuh tempo.',
            'url' => route('tasks.index', ['view' => 'mine']),
            'task_id' => $this->task->getKey(),
            'matter_id' => $this->task->matter_id,
            'severity' => 'high',
        ];
    }

    public function databaseType(object $notifiable): string
    {
        return 'task-overdue';
    }
}
