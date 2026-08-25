<?php

namespace App\Actions;

use App\Models\Quotation;
use App\Models\User;
use App\Services\AuditService;
use Illuminate\Support\Facades\DB;

class ApproveQuotation
{
    public function __construct(private AuditService $audit, private EnsureMatterIsNotOnLegalHold $legalHold) {}

    public function handle(Quotation $quotation, User $approver, ?string $note = null): Quotation
    {
        return DB::transaction(function () use ($quotation, $approver, $note): Quotation {
            $lockedQuotation = Quotation::query()->lockForUpdate()->findOrFail($quotation->getKey());
            $lockedQuotation->loadMissing('matter');
            $this->legalHold->handle($lockedQuotation->matter);

            if (! in_array($lockedQuotation->status, ['draft', 'pending_approval'], true)) {
                throw new \DomainException('Quotation tidak dapat lagi disetujui.');
            }

            $lockedQuotation->update([
                'status' => 'approved',
                'approved_by' => $approver->getKey(),
                'approved_at' => now(),
            ]);
            $this->audit->record($lockedQuotation, 'quotation.approved', ['note' => $note], $approver);

            return $lockedQuotation;
        }, 3);
    }
}
