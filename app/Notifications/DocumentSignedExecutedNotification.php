<?php

namespace App\Notifications;

use App\Models\Document;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class DocumentSignedExecutedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Document $document,
        public ?string $signerName = null,
        public ?string $securityHash = null
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
            ->subject('[E-Sign Selesai] '.$this->document->title.' (Telah Disahkan)')
            ->view('mail.document-signed-executed', [
                'document' => $this->document,
                'signerName' => $this->signerName,
                'securityHash' => $this->securityHash,
                'recipientName' => $notifiable->name ?? 'Tim Perkara & Partner',
                'actionUrl' => route('documents.show', $this->document->getKey()),
            ]);
    }

    /** @return array<string, mixed> */
    public function toArray(object $notifiable): array
    {
        return [
            'kind' => 'document_signed_executed',
            'title' => 'E-Sign Disahkan: '.$this->document->title,
            'message' => 'Dokumen telah selesai ditandatangani secara digital oleh '.($this->signerName ?? 'pihak terkait'),
            'url' => route('documents.show', $this->document->getKey()),
            'document_id' => $this->document->getKey(),
        ];
    }

    public function databaseType(object $notifiable): string
    {
        return 'document-signed-executed';
    }
}
