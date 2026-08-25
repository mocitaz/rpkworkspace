<?php

namespace App\Actions;

use App\Models\Invoice;
use App\Models\Matter;
use App\Models\Payment;
use App\Models\User;
use App\Services\AuditService;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use LogicException;

class RecordPayment
{
    public function __construct(private EnsureMatterIsNotOnLegalHold $legalHold) {}

    /** @param array<string, mixed> $attributes */
    public function handle(array $attributes, User $recorder, AuditService $audit): Payment
    {
        return DB::transaction(function () use ($attributes, $recorder, $audit): Payment {
            $allocations = collect(Arr::wrap($attributes['allocations'] ?? []))
                ->filter(fn (array $allocation): bool => (int) ($allocation['amount'] ?? 0) > 0)
                ->sortBy('invoice_id')
                ->values();
            $amount = (int) $attributes['amount'];
            $allocatedAmount = $allocations->sum(fn (array $allocation): int => (int) $allocation['amount']);

            $matterId = $attributes['matter_id'] ?? null;
            $matter = is_string($matterId) && $matterId !== ''
                ? Matter::query()->lockForUpdate()->whereKey($matterId)->sole()
                : null;
            $this->legalHold->handle($matter);

            if ($allocatedAmount > $amount) {
                throw new LogicException('Alokasi pembayaran melebihi nominal pembayaran.');
            }

            $payment = Payment::query()->create([
                ...Arr::except($attributes, ['allocations', 'recorded_by']),
                'currency' => $attributes['currency'] ?? config('raf.finance.currency', 'IDR'),
                'recorded_by' => $recorder->getKey(),
            ]);

            foreach ($allocations as $allocation) {
                $invoice = Invoice::query()
                    ->lockForUpdate()
                    ->whereKey((string) $allocation['invoice_id'])
                    ->firstOrFail();
                $allocationAmount = (int) $allocation['amount'];

                if ($invoice->client_id !== $payment->client_id || $invoice->currency !== $payment->currency) {
                    throw new LogicException('Invoice harus memiliki klien dan mata uang yang sama dengan pembayaran.');
                }

                if ($invoice->matter_id !== $payment->matter_id) {
                    throw new LogicException('Invoice harus berada pada matter yang sama dengan pembayaran.');
                }

                if (! in_array($invoice->status, ['sent', 'overdue'], true)) {
                    throw new LogicException('Pembayaran hanya dapat dialokasikan ke invoice terkirim atau overdue.');
                }

                if ($allocationAmount > $invoice->outstanding_amount) {
                    throw new LogicException('Alokasi pembayaran melebihi sisa tagihan invoice.');
                }

                $payment->allocations()->create([
                    'invoice_id' => $invoice->getKey(),
                    'amount' => $allocationAmount,
                ]);

                $previousPaidAmount = $invoice->paid_amount;
                $paidAmount = $previousPaidAmount + $allocationAmount;
                $outstandingAmount = $invoice->outstanding_amount - $allocationAmount;

                $invoice->update([
                    'paid_amount' => $paidAmount,
                    'outstanding_amount' => $outstandingAmount,
                    'status' => $outstandingAmount === 0 ? 'paid' : $invoice->status,
                    'paid_at' => $outstandingAmount === 0 ? now() : $invoice->paid_at,
                ]);
                $audit->recordMonetaryChange($invoice, 'payment.allocated', $previousPaidAmount, $paidAmount, $recorder);
            }

            $audit->record($payment, 'payment.recorded', [
                'amount' => $amount,
                'currency' => $payment->currency,
                'allocated_amount' => $allocatedAmount,
            ], $recorder);

            return $payment;
        }, 3);
    }
}
