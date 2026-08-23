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
        if (! is_string($matterId) || $matterId === '') {
            throw new \InvalidArgumentException('Matter wajib diisi untuk biaya.');
        }
        $this->legalHold->handle(Matter::query()->whereKey($matterId)->sole());

        return Expense::query()->create([
            ...Arr::except($attributes, ['created_by']),
            'currency' => $attributes['currency'] ?? config('raf.finance.currency', 'IDR'),
            'created_by' => $creator->getKey(),
        ]);
    }
}
