<?php

namespace App\Notifications;

use App\Models\Document;
use App\Models\DocumentApproval;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Str;

class DocumentApprovalResolvedNotification extends Notification
{
    use Queueable;

    public function __construct(
        public DocumentApproval $approval,
        public Document $document,
        public User $reviewer,
        public bool $approved
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
        $statusText = $this->approved ? 'Disetujui' : 'Diminta Revisi';

        return [
            'kind' => 'document_approval_resolved',
            'document_id' => $this->document->getKey(),
            'category' => 'document',
            'title' => sprintf('Review Dokumen %s: %s', $statusText, Str::limit($this->document->title, 40)),
            'message' => sprintf(
                '%s telah %s dokumen "%s"%s',
                $this->reviewer->name,
                $this->approved ? 'menyetujui' : 'meminta revisi pada',
                $this->document->title,
                $this->approval->resolution_note ? ' dengan catatan: "'.$this->approval->resolution_note.'"' : '.'
            ),
            'url' => route('documents.show', $this->document->getKey()),
            'sender_name' => $this->reviewer->name,
            'sender_avatar' => $this->reviewer->avatar_url ?? '/images/default-avatar.svg',
            'sender_title' => $this->reviewer->position_title,
            'matter_number' => $matterNumber,
            'severity' => $this->approved ? 'normal' : 'high',
        ];
    }

    public function databaseType(object $notifiable): string
    {
        return 'document-approval-resolved';
    }
}
