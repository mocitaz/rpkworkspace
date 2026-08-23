<?php

namespace App\Actions;

use App\Models\Matter;
use DomainException;

class EnsureMatterIsNotOnLegalHold
{
    public function handle(?Matter $matter): void
    {
        if ($matter?->legal_hold_at !== null) {
            throw new DomainException('Matter sedang dalam legal hold. Perubahan operasional tidak diizinkan.');
        }
    }
}
