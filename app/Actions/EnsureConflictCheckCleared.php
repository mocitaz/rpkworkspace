<?php

namespace App\Actions;

use App\Models\ConflictCheck;
use Illuminate\Support\Carbon;
use LogicException;

class EnsureConflictCheckCleared
{
    public function forMatter(string $conflictCheckId, string $clientId): ConflictCheck
    {
        $check = ConflictCheck::query()->lockForUpdate()->findOrFail($conflictCheckId);

        if ($check->matter_id !== null || $check->client_id !== $clientId) {
            throw new LogicException('Conflict check tidak sesuai dengan klien matter ini atau sudah digunakan.');
        }

        $this->ensureNotExpired($check);

        $this->ensureClearOrWaived($check);

        return $check;
    }

    public function forStandaloneQuotation(string $conflictCheckId, string $clientId): ConflictCheck
    {
        $check = ConflictCheck::query()->lockForUpdate()->findOrFail($conflictCheckId);

        if ($check->quotation_id !== null || $check->client_id !== $clientId) {
            throw new LogicException('Conflict check tidak sesuai dengan klien quotation ini atau sudah digunakan.');
        }

        $this->ensureNotExpired($check);

        $this->ensureClearOrWaived($check);

        return $check;
    }

    private function ensureClearOrWaived(ConflictCheck $check): void
    {
        if ($check->status !== 'clear' && $check->decision !== 'waived') {
            throw new LogicException('Matter atau quotation hanya dapat dibuat setelah conflict check clear atau di-waive partner.');
        }
    }

    private function ensureNotExpired(ConflictCheck $check): void
    {
        if ($check->expires_at !== null && Carbon::parse($check->expires_at)->isPast()) {
            throw new LogicException('Conflict check sudah kedaluwarsa. Jalankan pemeriksaan ulang.');
        }
    }
}
