<?php

namespace App\Actions;

use App\DocumentNumberType;
use App\Models\Invoice;
use App\Models\Matter;
use App\Models\User;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

class CreateInvoice
{
    public function __construct(private EnsureMatterIsNotOnLegalHold $legalHold) {}

    /** @param array<string, mixed> $attributes */
    public function handle(array $attributes, User $creator, GenerateDocumentNumber $numbers): Invoice
    {
        return DB::transaction(function () use ($attributes, $creator, $numbers): Invoice {
            if (isset($attributes['matter_id']) && is_string($attributes['matter_id']) && $attributes['matter_id'] !== '') {
                $this->legalHold->handle(Matter::query()->whereKey($attributes['matter_id'])->sole());
            }
            $items = array_values(Arr::wrap($attributes['items'] ?? []));
            $subtotal = collect($items)->sum(fn (array $item): int => ((int) $item['quantity']) * ((int) $item['unit_amount']));
            $discount = (int) ($attributes['discount_amount'] ?? 0);
            $taxRate = (float) ($attributes['tax_rate'] ?? 0);
            $taxableAmount = max(0, $subtotal - $discount);
            $taxAmount = (int) round($taxableAmount * ($taxRate / 100));
            $total = $taxableAmount + $taxAmount;

            $invoice = Invoice::query()->create([
                ...Arr::except($attributes, ['items', 'discount_amount', 'tax_rate']),
                'invoice_number' => $numbers->handle(DocumentNumberType::Invoice),
                'currency' => $attributes['currency'] ?? config('raf.finance.currency', 'IDR'),
                'subtotal_amount' => $subtotal,
                'discount_amount' => $discount,
                'tax_rate' => $taxRate,
                'tax_amount' => $taxAmount,
                'total_amount' => $total,
                'outstanding_amount' => $total,
                'created_by' => $creator->getKey(),
            ]);

            foreach ($items as $index => $item) {
                $invoice->lineItems()->create([
                    'description' => $item['description'],
                    'quantity' => (int) $item['quantity'],
                    'unit_amount' => (int) $item['unit_amount'],
                    'total_amount' => ((int) $item['quantity']) * ((int) $item['unit_amount']),
                    'sort_order' => $index,
                ]);
            }

            return $invoice;
        }, 3);
    }
}
