<?php

namespace App\Actions;

use App\Models\Document;
use App\Models\DocumentApproval;
use App\Models\User;
use App\Services\AuditService;
use Illuminate\Support\Facades\DB;

class SubmitDocumentForApproval
{
    public function __construct(private AuditService $audit, private EnsureMatterIsNotOnLegalHold $legalHold) {}

    public function handle(Document $document, User $requester, User $reviewer, ?string $note = null): DocumentApproval
    {
        $document->loadMissing('matter');
        $this->legalHold->handle($document->matter);
        if (! in_array($document->status, ['draft', 'revision_requested'], true)) {
            throw new \DomainException('Hanya dokumen draft atau revisi yang dapat dikirim untuk review.');
        }

        $approval = DB::transaction(function () use ($document, $requester, $reviewer, $note) {
            $lockedDocument = Document::query()->lockForUpdate()->whereKey($document)->firstOrFail();
            $lockedDocument->update(['status' => 'under_review']);

            return $lockedDocument->approvals()->create([
                'requested_by' => $requester->getKey(),
                'reviewer_id' => $reviewer->getKey(),
                'request_note' => $note,
            ]);
        }, 3);

        $this->audit->record($approval, 'document.approval_requested', ['document_id' => $document->getKey()], $requester);

        return $approval;
    }
}
