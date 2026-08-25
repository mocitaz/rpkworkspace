<?php

namespace App\Notifications;

use App\Models\Document;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class DocumentCommentAddedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Document $document,
        public string $commentBody,
        public ?string $commenterName = null,
        public ?string $clauseRef = null
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
            ->subject('[Komentar Dokumen Baru] '.$this->document->title)
            ->view('mail.document-comment-added', [
                'document' => $this->document,
                'commentBody' => $this->commentBody,
                'commenterName' => $this->commenterName,
                'clauseRef' => $this->clauseRef,
                'recipientName' => $notifiable->name ?? 'Rekan Kerja',
                'actionUrl' => route('documents.show', $this->document->getKey()),
            ]);
    }

    /** @return array<string, mixed> */
    public function toArray(object $notifiable): array
    {
        return [
            'kind' => 'document_comment_added',
            'title' => 'Catatan Baru: '.$this->document->title,
            'message' => ($this->commenterName ?? 'Rekan kerja').' menambahkan catatan pada dokumen.',
            'url' => route('documents.show', $this->document->getKey()),
            'document_id' => $this->document->getKey(),
        ];
    }

    public function databaseType(object $notifiable): string
    {
        return 'document-comment-added';
    }
}
