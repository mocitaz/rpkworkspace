<?php

namespace App\Actions;

use App\Models\Invoice;
use App\Models\Payment;
use App\Models\User;
use App\Services\AuditService;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use LogicException;

class RefundPayment
{
    public function __construct(private AuditService $audit, private EnsureMatterIsNotOnLegalHold $legalHold) {}

    public function handle(Payment $payment, User $actor, string $reason): Payment
    {
        return DB::transaction(function () use ($payment, $actor, $reason): Payment {
            $payment = Payment::query()->lockForUpdate()->with('allocations')->whereKey($payment->getKey())->sole();
            $this->legalHold->handle($payment->matter);

            if ($payment->reversed_at !== null || $payment->refunded_at !== null) {
                throw new LogicException('Pembayaran ini sudah dikoreksi atau dikembalikan.');
            }

            foreach ($payment->allocations as $allocation) {
                $invoice = Invoice::query()->lockForUpdate()->findOrFail($allocation->invoice_id);
                $previousPaidAmount = $invoice->paid_amount;
                $paidAmount = max(0, $previousPaidAmount - $allocation->amount);
                $outstandingAmount = min($invoice->total_amount, $invoice->outstanding_amount + $allocation->amount);

                $invoice->update([
                    'paid_amount' => $paidAmount,
                    'outstanding_amount' => $outstandingAmount,
                    'status' => $invoice->due_at !== null && Carbon::parse($invoice->due_at)->isPast() ? 'overdue' : 'sent',
                    'paid_at' => null,
                ]);

                $this->audit->recordMonetaryChange($invoice, 'payment.allocation_refunded', $previousPaidAmount, $paidAmount, $actor, null, $invoice->currency);
            }

            $payment->update([
                'refunded_at' => now(),
                'refunded_by' => $actor->getKey(),
                'refund_reason' => $reason,
            ]);

            $this->audit->record($payment, 'payment.refunded', [
                'reason' => $reason,
                'allocation_count' => $payment->allocations->count(),
            ], $actor);

            return $payment;
        }, 3);
    }
}
