<?php

namespace App\Notifications;

use App\Models\Matter;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class HearingOutcomeNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public string $hearingTitle,
        public string $hearingDate,
        public ?string $outcomeSummary = null,
        public ?string $courtName = null,
        public ?Matter $matter = null,
        public ?string $attendedBy = null,
        public ?string $nextHearingDate = null,
        public ?string $nextHearingAgenda = null
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
        $subject = '[Hasil Sidang Dicatat] '.($this->matter ? $this->matter->matter_number.' - ' : '').$this->hearingTitle;

        return (new MailMessage)
            ->subject($subject)
            ->view('mail.hearing-outcome', [
                'hearingTitle' => $this->hearingTitle,
                'hearingDate' => $this->hearingDate,
                'outcomeSummary' => $this->outcomeSummary,
                'courtName' => $this->courtName,
                'matter' => $this->matter,
                'attendedBy' => $this->attendedBy,
                'nextHearingDate' => $this->nextHearingDate,
                'nextHearingAgenda' => $this->nextHearingAgenda,
                'recipientName' => $notifiable->name ?? 'Managing Partner & Tim',
                'actionUrl' => route('calendar.index'),
            ]);
    }

    /** @return array<string, mixed> */
    public function toArray(object $notifiable): array
    {
        return [
            'kind' => 'hearing_outcome',
            'title' => 'Hasil Sidang Dicatat: '.$this->hearingTitle,
            'message' => 'Catatan jalannya sidang telah diperbarui oleh '.($this->attendedBy ?? 'advokat pendamping'),
            'url' => route('calendar.index'),
            'matter_id' => $this->matter?->getKey(),
        ];
    }

    public function databaseType(object $notifiable): string
    {
        return 'hearing-outcome';
    }
}
