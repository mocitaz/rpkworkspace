<?php

namespace App\Actions;

use App\Models\DocumentApproval;
use App\Models\User;
use App\Notifications\DocumentApprovalResolvedNotification;
use App\Services\AuditService;
use Illuminate\Support\Facades\DB;

class ResolveDocumentApproval
{
    public function __construct(private AuditService $audit, private EnsureMatterIsNotOnLegalHold $legalHold) {}

    public function handle(DocumentApproval $approval, User $reviewer, bool $approved, ?string $note = null): DocumentApproval
    {
        $approval->loadMissing('document.matter');
        $this->legalHold->handle($approval->document->matter);
        if ($approval->reviewer_id !== $reviewer->getKey()) {
            throw new \DomainException('Hanya reviewer yang ditunjuk yang dapat menyelesaikan approval.');
        }

        if ($approval->status !== 'pending') {
            throw new \DomainException('Approval dokumen ini sudah diselesaikan.');
        }

        DB::transaction(function () use ($approval, $approved, $note) {
            $lockedApproval = DocumentApproval::query()->lockForUpdate()->with('document')->whereKey($approval)->firstOrFail();
            $status = $approved ? 'approved' : 'revision_requested';
            $lockedApproval->update(['status' => $status, 'resolution_note' => $note, 'resolved_at' => now()]);
            $lockedApproval->document->update(['status' => $approved ? 'approved' : 'revision_requested']);
        }, 3);

        $approval->refresh();
        $this->audit->record($approval, $approved ? 'document.approved' : 'document.revision_requested', ['document_id' => $approval->document_id], $reviewer);

        if ($approval->requester) {
            $approval->requester->notify(new DocumentApprovalResolvedNotification(
                $approval,
                $approval->document,
                $reviewer,
                $approved
            ));
        }

        return $approval;
    }
}
