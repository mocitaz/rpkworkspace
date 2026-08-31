<?php

namespace App\Notifications;

use App\Models\SignatureSigner;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SignatureReminderNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(public SignatureSigner $signer) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('[Pengingat Tanda Tangan] Dokumen Menunggu Persetujuan Anda')
            ->view('mail.signature-reminder', [
                'signer' => $this->signer->loadMissing('signatureRequest.document'),
                'actionUrl' => rtrim((string) config('app.url'), '/').route('signature.sign.show', $this->signer->signing_token, false),
            ]);
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'signature_request_id' => $this->signer->signature_request_id,
        ];
    }

    /** @return array<string, string> */
    public function viaQueues(): array
    {
        return ['mail' => config('raf.queues.notifications', 'notifications')];
    }
}
