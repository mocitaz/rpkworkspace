<?php

namespace App\Actions;

use App\Models\Invoice;
use App\Models\User;
use App\Services\AuditService;
use App\WorkflowStatus;
use Illuminate\Support\Facades\DB;

class TransitionInvoice
{
    public function __construct(private AuditService $audit, private EnsureMatterIsNotOnLegalHold $legalHold) {}

    public function handle(Invoice $invoice, WorkflowStatus $target, ?User $actor = null, ?string $reason = null): Invoice
    {
        return DB::transaction(function () use ($invoice, $target, $actor, $reason): Invoice {
            $invoice = Invoice::query()->lockForUpdate()->whereKey($invoice->getKey())->sole();
            $invoice->loadMissing('matter');
            $this->legalHold->handle($invoice->matter);
            $current = WorkflowStatus::from($invoice->status);
            $current->ensureCanTransitionTo($target);

            $updates = ['status' => $target->value];
            if ($target === WorkflowStatus::Sent) {
                $updates['sent_at'] = now();
                $updates['issued_at'] = $invoice->issued_at ?? now()->toDateString();
            }
            if ($target === WorkflowStatus::Paid) {
                $updates['paid_at'] = now();
                $updates['outstanding_amount'] = 0;
                $updates['paid_amount'] = $invoice->total_amount;
            }
            if ($target === WorkflowStatus::Cancelled) {
                if ($invoice->paid_amount > 0 || $invoice->outstanding_amount !== $invoice->total_amount) {
                    throw new \LogicException('Invoice yang telah menerima pembayaran tidak dapat dibatalkan. Koreksi atau refund pembayaran terlebih dahulu.');
                }
                if (! is_string($reason) || mb_strlen(trim($reason)) < 8) {
                    throw new \LogicException('Alasan pembatalan invoice wajib diisi.');
                }
                $updates['cancelled_at'] = now();
                $updates['cancelled_by'] = $actor?->getKey();
                $updates['cancellation_reason'] = trim($reason);
            }

            $invoice->update($updates);
            $this->audit->recordWorkflowTransition($invoice, 'invoice.status_changed', $current, $target, $actor);
            if ($target === WorkflowStatus::Cancelled) {
                $this->audit->record($invoice, 'invoice.cancelled', [
                    'reason' => trim((string) $reason),
                    'paid_amount' => $invoice->paid_amount,
                    'outstanding_amount' => $invoice->outstanding_amount,
                    'currency' => $invoice->currency,
                ], $actor);
            }

            return $invoice;
        }, 3);
    }
}
