<?php

namespace App\Actions;

use App\Models\Quotation;
use App\Models\User;
use App\Services\AuditService;

class ApproveQuotation
{
    public function __construct(private AuditService $audit, private EnsureMatterIsNotOnLegalHold $legalHold) {}

    public function handle(Quotation $quotation, User $approver, ?string $note = null): Quotation
    {
        $quotation->loadMissing('matter');
        $this->legalHold->handle($quotation->matter);
        if (! in_array($quotation->status, ['draft', 'pending_approval'], true)) {
            throw new \DomainException('Quotation tidak dapat lagi disetujui.');
        }

        $quotation->update([
            'status' => 'approved',
            'approved_by' => $approver->getKey(),
            'approved_at' => now(),
        ]);
        $this->audit->record($quotation, 'quotation.approved', ['note' => $note], $approver);

        return $quotation;
    }
}
