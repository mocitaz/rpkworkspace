<?php

namespace App\Notifications;

use App\Models\Document;
use App\Models\DocumentApproval;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Str;

class DocumentApprovalRequestedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public DocumentApproval $approval,
        public Document $document,
        public User $requester
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

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('[Permintaan Telaah Dokumen] '.$this->document->title)
            ->view('mail.document-review-requested', [
                'document' => $this->document,
                'requestedBy' => $this->requester->name,
                'reviewNotes' => $this->approval->request_note,
                'recipientName' => $notifiable->name ?? 'Bapak/Ibu Reviewer',
                'actionUrl' => route('documents.show', $this->document->getKey()),
            ]);
    }

    /** @return array<string, mixed> */
    public function toArray(object $notifiable): array
    {
        $matterNumber = $this->document->matter?->matter_number;

        return [
            'kind' => 'document_approval_requested',
            'category' => 'document',
            'title' => sprintf('Permintaan Review Dokumen: %s', Str::limit($this->document->title, 40)),
            'message' => sprintf('%s mengajukan review untuk dokumen "%s"%s', $this->requester->name, $this->document->title, $this->approval->request_note ? ': "'.$this->approval->request_note.'"' : '.'),
            'url' => route('documents.show', $this->document->getKey()),
            'sender_name' => $this->requester->name,
            'sender_avatar' => $this->requester->avatar_url ?? '/images/default-avatar.svg',
            'sender_title' => $this->requester->position_title,
            'matter_number' => $matterNumber,
            'severity' => 'high',
        ];
    }

    public function databaseType(object $notifiable): string
    {
        return 'document-approval-requested';
    }
}
