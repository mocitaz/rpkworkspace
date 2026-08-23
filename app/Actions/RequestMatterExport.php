<?php

namespace App\Actions;

use App\Jobs\GenerateMatterHandoverExport;
use App\Models\Matter;
use App\Models\MatterExport;
use App\Models\User;
use App\Services\AuditService;

class RequestMatterExport
{
    public function __construct(private AuditService $audit) {}

    public function handle(Matter $matter, User $actor): MatterExport
    {
        $export = $matter->exports()->create(['requested_by' => $actor->getKey()]);
        GenerateMatterHandoverExport::dispatch((string) $export->getKey())->afterCommit();
        $this->audit->record($export, 'matter.export_requested', ['matter_id' => $matter->getKey()], $actor);

        return $export;
    }
}
