<?php

namespace App\Actions;

use App\DocumentNumberType;
use App\Models\ConflictCheck;
use App\Models\Matter;
use App\Models\Quotation;
use App\Models\User;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

class CreateQuotation
{
    public function __construct(
        private EnsureMatterIsNotOnLegalHold $legalHold,
        private EnsureConflictCheckCleared $conflicts,
    ) {}

    /** @param array<string, mixed> $attributes */
    public function handle(array $attributes, User $creator, GenerateDocumentNumber $numbers): Quotation
    {
        return DB::transaction(function () use ($attributes, $creator, $numbers): Quotation {
            if (empty($attributes['matter_id']) && empty($attributes['conflict_check_id'])) {
                throw new \LogicException('Conflict check wajib untuk quotation tanpa matter.');
            }

            if (isset($attributes['conflict_check_id']) && empty($attributes['matter_id'])) {
                $this->conflicts->forStandaloneQuotation((string) $attributes['conflict_check_id'], (string) $attributes['client_id']);
            }

            if (isset($attributes['matter_id']) && is_string($attributes['matter_id']) && $attributes['matter_id'] !== '') {
                $this->legalHold->handle(Matter::query()->whereKey($attributes['matter_id'])->sole());
            }
            $items = array_values(Arr::wrap($attributes['items'] ?? []));
            $subtotal = collect($items)->sum(fn (array $item): int => ((int) $item['quantity']) * ((int) $item['unit_amount']));
            $discount = (int) ($attributes['discount_amount'] ?? 0);
            $taxRate = (float) ($attributes['tax_rate'] ?? 0);
            $taxableAmount = max(0, $subtotal - $discount);
            $taxAmount = (int) round($taxableAmount * ($taxRate / 100));

            $quotation = Quotation::query()->create([
                ...Arr::except($attributes, ['items', 'discount_amount', 'tax_rate', 'conflict_check_id']),
                'quotation_number' => $numbers->handle(DocumentNumberType::Quotation),
                'currency' => $attributes['currency'] ?? config('raf.finance.currency', 'IDR'),
                'subtotal_amount' => $subtotal,
                'discount_amount' => $discount,
                'tax_rate' => $taxRate,
                'tax_amount' => $taxAmount,
                'total_amount' => $taxableAmount + $taxAmount,
                'created_by' => $creator->getKey(),
            ]);

            foreach ($items as $index => $item) {
                $quotation->lineItems()->create([
                    'description' => $item['description'],
                    'quantity' => (int) $item['quantity'],
                    'unit_amount' => (int) $item['unit_amount'],
                    'total_amount' => ((int) $item['quantity']) * ((int) $item['unit_amount']),
                    'sort_order' => $index,
                ]);
            }

            if (isset($attributes['conflict_check_id'])) {
                ConflictCheck::query()->whereKey($attributes['conflict_check_id'])->update(['quotation_id' => $quotation->getKey()]);
            }

            return $quotation;
        }, 3);
    }
}
