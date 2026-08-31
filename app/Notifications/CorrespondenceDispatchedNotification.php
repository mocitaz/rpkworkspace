<?php

namespace App\Notifications;

use App\Models\Correspondence;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CorrespondenceDispatchedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Correspondence $correspondence,
        public ?string $dispositionNote = null
    ) {
        $this->queue = config('raf.queues.notifications', 'notifications');
    }

    /**
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database', 'mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $subject = '[Disposisi Korespondensi] '.$this->correspondence->subject;

        return (new MailMessage)
            ->subject($subject)
            ->view('mail.correspondence-dispatched', [
                'correspondence' => $this->correspondence,
                'dispositionNote' => $this->dispositionNote,
                'recipientName' => $notifiable->name ?? 'Rekan Advokat',
                'actionUrl' => rtrim((string) config('app.url'), '/').route('governance.correspondences.show', $this->correspondence, false),
            ]);
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'correspondence_dispatched',
            'correspondence_id' => $this->correspondence->id,
            'subject' => $this->correspondence->subject,
            'matter_id' => $this->correspondence->matter_id,
            'disposition_note' => $this->dispositionNote,
        ];
    }
}
