<?php

namespace App\Actions;

use App\Models\Matter;
use App\Models\Quotation;
use App\Models\User;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

class UpdateQuotation
{
    public function __construct(
        private EnsureMatterIsNotOnLegalHold $legalHold,
    ) {}

    /** @param array<string, mixed> $attributes */
    public function handle(Quotation $quotation, array $attributes, User $actor): Quotation
    {
        return DB::transaction(function () use ($quotation, $attributes): Quotation {
            $matterId = $attributes['matter_id'] ?? $quotation->matter_id;
            if ($matterId && is_string($matterId)) {
                $this->legalHold->handle(Matter::query()->whereKey($matterId)->sole());
            }

            $items = array_values(Arr::wrap($attributes['items'] ?? []));
            $subtotal = collect($items)->sum(fn (array $item): int => ((int) $item['quantity']) * ((int) $item['unit_amount']));
            $discount = (int) ($attributes['discount_amount'] ?? 0);
            $taxRate = (float) ($attributes['tax_rate'] ?? 0);
            $taxableAmount = max(0, $subtotal - $discount);
            $taxAmount = (int) round($taxableAmount * ($taxRate / 100));
            $total = $taxableAmount + $taxAmount;

            $quotation->update([
                'client_id' => $attributes['client_id'] ?? $quotation->client_id,
                'matter_id' => $attributes['matter_id'] ?? $quotation->matter_id,
                'title' => $attributes['title'] ?? $quotation->title,
                'scope' => $attributes['scope'] ?? $quotation->scope,
                'status' => $attributes['status'] ?? $quotation->status,
                'currency' => $attributes['currency'] ?? $quotation->currency,
                'subtotal_amount' => $subtotal,
                'discount_amount' => $discount,
                'tax_rate' => $taxRate,
                'tax_amount' => $taxAmount,
                'total_amount' => $total,
                'issued_at' => $attributes['issued_at'] ?? $quotation->issued_at,
                'valid_until' => $attributes['valid_until'] ?? $quotation->valid_until,
            ]);

            // Re-sync line items
            $quotation->lineItems()->delete();
            foreach ($items as $index => $item) {
                $quotation->lineItems()->create([
                    'description' => $item['description'],
                    'quantity' => (int) $item['quantity'],
                    'unit_amount' => (int) $item['unit_amount'],
                    'total_amount' => ((int) $item['quantity']) * ((int) $item['unit_amount']),
                    'sort_order' => $index,
                ]);
            }

            return $quotation->fresh(['client', 'matter', 'lineItems']);
        }, 3);
    }
}
