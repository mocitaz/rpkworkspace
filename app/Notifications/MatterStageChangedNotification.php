<?php

namespace App\Notifications;

use App\Models\Matter;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class MatterStageChangedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Matter $matter,
        public string $newStage,
        public ?string $oldStage = null,
        public ?string $updatedBy = null,
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
            ->subject('[Update Tahapan Perkara] '.$this->matter->matter_number.' - '.$this->newStage)
            ->view('mail.matter-stage-changed', [
                'matter' => $this->matter,
                'newStage' => $this->newStage,
                'oldStage' => $this->oldStage,
                'updatedBy' => $this->updatedBy,
                'notes' => $this->notes,
                'recipientName' => $notifiable->name ?? 'Tim Kuasa Hukum',
                'actionUrl' => route('matters.show', $this->matter),
            ]);
    }

    /** @return array<string, mixed> */
    public function toArray(object $notifiable): array
    {
        return [
            'kind' => 'matter_stage_changed',
            'title' => 'Tahapan Perkara Diperbarui: '.$this->matter->matter_number,
            'message' => 'Tahapan perkara berpindah ke "'.$this->newStage.'".',
            'url' => route('matters.show', $this->matter),
            'matter_id' => $this->matter->getKey(),
        ];
    }

    public function databaseType(object $notifiable): string
    {
        return 'matter-stage-changed';
    }
}
