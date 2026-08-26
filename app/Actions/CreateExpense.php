<?php

namespace App\Actions;

use App\Models\Expense;
use App\Models\Matter;
use App\Models\User;
use Illuminate\Support\Arr;

class CreateExpense
{
    public function __construct(private EnsureMatterIsNotOnLegalHold $legalHold) {}

    /** @param array<string, mixed> $attributes */
    public function handle(array $attributes, User $creator): Expense
    {
        $matterId = $attributes['matter_id'] ?? null;
        if (is_string($matterId) && $matterId !== '') {
            $this->legalHold->handle(Matter::query()->whereKey($matterId)->sole());
        } else {
            $matterId = null;
        }

        return Expense::query()->create([
            ...Arr::except($attributes, ['created_by']),
            'matter_id' => $matterId,
            'status' => $attributes['status'] ?? 'approved',
            'charge_to' => $attributes['charge_to'] ?? ($matterId ? 'client' : 'office'),
            'currency' => $attributes['currency'] ?? config('raf.finance.currency', 'IDR'),
            'created_by' => $creator->getKey(),
        ]);
    }
}
