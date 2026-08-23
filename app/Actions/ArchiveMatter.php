<?php

namespace App\Actions;

use App\Models\Matter;
use App\Models\User;
use App\Services\AuditService;

class ArchiveMatter
{
    public function __construct(private AuditService $audit) {}

    public function handle(Matter $matter, User $actor): Matter
    {
        if ($matter->legal_hold_at !== null) {
            throw new \DomainException('Matter dalam legal hold tidak dapat diarsipkan.');
        }

        if ($matter->status !== 'closed') {
            throw new \DomainException('Hanya matter yang sudah selesai dapat diarsipkan.');
        }

        $matter->update(['status' => 'archived', 'archived_at' => now(), 'archived_by' => $actor->getKey()]);
        $this->audit->record($matter, 'matter.archived', [], $actor);

        return $matter;
    }
}
