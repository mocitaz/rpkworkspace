<?php

namespace App\Actions;

use App\Models\ConflictCheck;
use App\Models\User;
use App\Services\AuditService;
use Illuminate\Support\Carbon;

class ResolveConflictCheck
{
    public function __construct(private AuditService $audit) {}

    public function handle(ConflictCheck $check, User $partner, string $decision, ?string $note = null): ConflictCheck
    {
        if (! in_array($decision, ['cleared', 'waived', 'blocked'], true)) {
            throw new \DomainException('Keputusan conflict check tidak valid.');
        }

        if ($check->status === 'blocked' && $decision === 'cleared') {
            throw new \DomainException('Conflict yang diblokir harus di-waive atau tetap diblokir.');
        }

        if (in_array($decision, ['waived', 'blocked'], true) && (! is_string($note) || mb_strlen(trim($note)) < 8)) {
            throw new \DomainException('Alasan keputusan conflict wajib diisi.');
        }

        $check->update(['decision' => $decision, 'decision_note' => $note, 'reviewed_by' => $partner->getKey(), 'reviewed_at' => now()]);
        $this->audit->record($check, 'conflict.resolved', [
            'decision' => $decision,
            'decision_note' => $note,
            'status' => $check->status,
            'expires_at' => $check->expires_at !== null ? Carbon::parse($check->expires_at)->toIso8601String() : null,
        ], $partner);

        return $check;
    }
}
