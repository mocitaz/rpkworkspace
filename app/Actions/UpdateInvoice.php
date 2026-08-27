<?php

namespace App\Actions;

use App\Models\Invoice;
use App\Models\Matter;
use App\Models\User;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

class UpdateInvoice
{
    public function __construct(private EnsureMatterIsNotOnLegalHold $legalHold) {}

    /** @param array<string, mixed> $attributes */
    public function handle(Invoice $invoice, array $attributes, User $actor): Invoice
    {
        return DB::transaction(function () use ($invoice, $attributes): Invoice {
            $matterId = $attributes['matter_id'] ?? $invoice->matter_id;
            if ($matterId && is_string($matterId)) {
                $this->legalHold->handle(Matter::query()->whereKey($matterId)->sole());
            }

            $items = array_values(Arr::wrap($attributes['items'] ?? []));
            $subtotal = collect($items)->sum(fn (array $item): int => ((int) $item['quantity']) * ((int) $item['unit_amount']));
            $discount = (int) ($attributes['discount_amount'] ?? 0);
            [$taxRate, $taxRateBasisPoints] = $this->normalizeTaxRate($attributes['tax_rate'] ?? 0);
            $taxableAmount = max(0, $subtotal - $discount);
            $taxAmount = intdiv(($taxableAmount * $taxRateBasisPoints) + 5_000, 10_000);
            $total = $taxableAmount + $taxAmount;

            $paidAmount = (int) $invoice->paid_amount;
            $outstanding = max(0, $total - $paidAmount);

            $status = $attributes['status'] ?? $invoice->status;
            if ($status !== 'cancelled') {
                if ($paidAmount >= $total && $total > 0) {
                    $status = 'paid';
                } elseif ($paidAmount > 0 && $paidAmount < $total) {
                    $status = 'partial';
                }
            }

            $invoice->update([
                'client_id' => $attributes['client_id'] ?? $invoice->client_id,
                'matter_id' => $attributes['matter_id'] ?? $invoice->matter_id,
                'title' => $attributes['title'] ?? $invoice->title,
                'status' => $status,
                'currency' => $attributes['currency'] ?? $invoice->currency,
                'subtotal_amount' => $subtotal,
                'discount_amount' => $discount,
                'tax_rate' => $taxRate,
                'tax_amount' => $taxAmount,
                'total_amount' => $total,
                'outstanding_amount' => $outstanding,
                'issued_at' => $attributes['issued_at'] ?? $invoice->issued_at,
                'due_at' => $attributes['due_at'] ?? $invoice->due_at,
            ]);

            // Re-sync line items
            $invoice->lineItems()->delete();
            foreach ($items as $index => $item) {
                $invoice->lineItems()->create([
                    'description' => $item['description'],
                    'quantity' => (int) $item['quantity'],
                    'unit_amount' => (int) $item['unit_amount'],
                    'total_amount' => ((int) $item['quantity']) * ((int) $item['unit_amount']),
                    'sort_order' => $index,
                ]);
            }

            return $invoice->fresh(['client', 'matter', 'lineItems']);
        }, 3);
    }

    /** @return array{0: string, 1: int} */
    private function normalizeTaxRate(mixed $taxRate): array
    {
        $value = str_replace(',', '.', trim((string) $taxRate));

        if (preg_match('/^(\d{1,3})(?:\.(\d{1,2}))?$/', $value, $matches) !== 1) {
            throw new \InvalidArgumentException('Tarif pajak harus berupa persentase dengan maksimal dua angka desimal.');
        }

        $whole = (int) $matches[1];
        $fraction = str_pad($matches[2] ?? '', 2, '0');
        $basisPoints = ($whole * 100) + (int) $fraction;

        return [sprintf('%d.%02d', $whole, (int) $fraction), $basisPoints];
    }
}
