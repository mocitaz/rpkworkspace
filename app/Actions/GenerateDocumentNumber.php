<?php

namespace App\Actions;

use App\DocumentNumberType;
use App\Models\DocumentNumberSequence;
use Illuminate\Support\Facades\DB;

class GenerateDocumentNumber
{
    public function handle(DocumentNumberType $type, ?int $year = null): string
    {
        $sequenceYear = $year ?? (int) now(config('raf.timezone'))->format('Y');

        return DB::transaction(function () use ($type, $sequenceYear): string {
            DocumentNumberSequence::query()->insertOrIgnore([
                'type' => $type->value,
                'year' => $sequenceYear,
                'next_value' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $sequence = DocumentNumberSequence::query()
                ->where('type', $type->value)
                ->where('year', $sequenceYear)
                ->lockForUpdate()
                ->firstOrFail();

            $number = sprintf('%s-%d-%04d', $type->prefix(), $sequenceYear, $sequence->next_value);
            $sequence->increment('next_value');

            return $number;
        }, 3);
    }
}
