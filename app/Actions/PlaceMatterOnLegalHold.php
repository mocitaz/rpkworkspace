<?php

namespace App\Actions;

use App\Models\Matter;
use App\Models\User;
use App\Services\AuditService;

class PlaceMatterOnLegalHold
{
    public function __construct(private AuditService $audit) {}

    public function handle(Matter $matter, User $actor, ?string $reason, bool $place = true): Matter
    {
        $matter->update($place ? [
            'legal_hold_at' => now(),
            'legal_hold_by' => $actor->getKey(),
            'legal_hold_reason' => $reason,
        ] : [
            'legal_hold_at' => null,
            'legal_hold_by' => null,
            'legal_hold_reason' => null,
        ]);

        $this->audit->record($matter, $place ? 'matter.legal_hold_placed' : 'matter.legal_hold_released', ['reason' => $reason], $actor);

        return $matter;
    }
}
