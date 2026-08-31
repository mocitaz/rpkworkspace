<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ComplianceExpiringNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public string $clientName,
        public string $docName,
        public string $expiryDate,
        public ?string $clientId = null
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
            ->subject('[Peringatan Kedaluwarsa Berkas] Dokumen Klien: '.$this->clientName)
            ->view('mail.compliance-expiring', [
                'clientName' => $this->clientName,
                'docName' => $this->docName,
                'expiryDate' => $this->expiryDate,
                'recipientName' => $notifiable->name ?? 'Tim Legal & Admin',
                'actionUrl' => $this->clientId ? route('clients.show', $this->clientId) : route('clients.index'),
            ]);
    }

    /** @return array<string, mixed> */
    public function toArray(object $notifiable): array
    {
        return [
            'kind' => 'compliance_expiring',
            'client_id' => $this->clientId,
            'title' => 'Masa Berlaku Dokumen: '.$this->clientName,
            'message' => 'Dokumen "'.$this->docName.'" akan kedaluwarsa pada '.$this->expiryDate,
            'url' => $this->clientId ? route('clients.show', $this->clientId) : route('clients.index'),
        ];
    }

    public function databaseType(object $notifiable): string
    {
        return 'compliance-expiring';
    }
}
