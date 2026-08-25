<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class HearingReminderNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public string $hearingTitle,
        public string $hearingDate,
        public ?string $daysBefore = 'H-1',
        public ?string $hearingTime = null,
        public ?string $courtName = null,
        public ?string $courtRoom = null,
        public ?string $googleMapsUrl = null
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
        $subject = '[PENGINGAT SIDANG '.$this->daysBefore.'] '.$this->hearingTitle.' ('.($this->courtName ?? 'Pengadilan').')';

        return (new MailMessage)
            ->subject($subject)
            ->view('mail.hearing-reminder', [
                'hearingTitle' => $this->hearingTitle,
                'hearingDate' => $this->hearingDate,
                'daysBefore' => $this->daysBefore,
                'hearingTime' => $this->hearingTime,
                'courtName' => $this->courtName,
                'courtRoom' => $this->courtRoom,
                'googleMapsUrl' => $this->googleMapsUrl,
                'recipientName' => $notifiable->name ?? 'Tim Kuasa Hukum',
                'actionUrl' => route('calendar.index'),
            ]);
    }

    /** @return array<string, mixed> */
    public function toArray(object $notifiable): array
    {
        return [
            'kind' => 'hearing_reminder',
            'title' => 'Pengingat Sidang '.$this->daysBefore.': '.$this->hearingTitle,
            'message' => 'Sidang pada '.$this->hearingDate.' di '.($this->courtName ?? 'Pengadilan'),
            'url' => route('calendar.index'),
            'severity' => 'high',
        ];
    }

    public function databaseType(object $notifiable): string
    {
        return 'hearing-reminder';
    }
}
