<?php

namespace App\Notifications;

use App\Models\Document;
use App\Models\DocumentApproval;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Str;

class DocumentApprovalRequestedNotification extends Notification
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
        return ['database'];
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
