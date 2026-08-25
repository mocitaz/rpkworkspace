<?php

namespace App\Notifications;

use App\Models\Matter;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class HearingScheduledNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public string $hearingTitle,
        public string $hearingDate,
        public ?string $hearingTime = null,
        public ?string $courtName = null,
        public ?string $courtRoom = null,
        public ?Matter $matter = null,
        public ?string $scheduledBy = null,
        public ?string $instructions = null
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
        $subject = '[Jadwal Sidang Baru] '.($this->matter ? $this->matter->matter_number.' - ' : '').$this->hearingTitle;

        return (new MailMessage)
            ->subject($subject)
            ->view('mail.hearing-scheduled', [
                'hearingTitle' => $this->hearingTitle,
                'hearingDate' => $this->hearingDate,
                'hearingTime' => $this->hearingTime,
                'courtName' => $this->courtName,
                'courtRoom' => $this->courtRoom,
                'matter' => $this->matter,
                'scheduledBy' => $this->scheduledBy,
                'instructions' => $this->instructions,
                'recipientName' => $notifiable->name ?? 'Tim Litigasi Advokat',
                'actionUrl' => route('calendar.index'),
            ]);
    }

    /** @return array<string, mixed> */
    public function toArray(object $notifiable): array
    {
        return [
            'kind' => 'hearing_scheduled',
            'title' => 'Jadwal Sidang Baru: '.$this->hearingTitle,
            'message' => 'Sidang dijadwalkan pada '.$this->hearingDate.' di '.($this->courtName ?? 'Pengadilan'),
            'url' => route('calendar.index'),
            'matter_id' => $this->matter?->getKey(),
            'severity' => 'high',
        ];
    }

    public function databaseType(object $notifiable): string
    {
        return 'hearing-scheduled';
    }
}
