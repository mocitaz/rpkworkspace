<?php

namespace App\Actions;

use App\Models\Correspondence;
use App\Models\Matter;
use App\Models\User;
use App\Notifications\CorrespondenceDispatchedNotification;
use App\Services\AuditService;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

class LogCorrespondence
{
    public function __construct(private AuditService $audit, private EnsureMatterIsNotOnLegalHold $legalHold) {}

    /** @param array<string, mixed> $attributes */
    public function handle(Matter $matter, array $attributes, User $actor): Correspondence
    {
        $this->legalHold->handle($matter);
        $correspondence = DB::transaction(function () use ($matter, $attributes, $actor) {
            $documentIds = Arr::wrap($attributes['document_ids'] ?? []);
            $correspondence = $matter->correspondences()->create([
                ...Arr::except($attributes, ['matter_id', 'created_by', 'document_ids']),
                'client_id' => $attributes['client_id'] ?? $matter->client_id,
                'created_by' => $actor->getKey(),
            ]);

            if ($documentIds !== []) {
                $eligibleDocumentIds = $matter->documents()->whereKey($documentIds)->pluck('id')->all();
                if (count($eligibleDocumentIds) !== count($documentIds)) {
                    throw new \DomainException('Lampiran correspondence harus berasal dari matter yang sama.');
                }
                $correspondence->documents()->sync($eligibleDocumentIds);
            }

            return $correspondence;
        }, 3);

        $this->audit->record($correspondence, 'correspondence.logged', [
            'matter_id' => $matter->getKey(),
            'direction' => $correspondence->direction,
            'source' => $correspondence->source,
        ], $actor);

        if ($matter->responsible_partner_id && $matter->responsible_partner_id !== $actor->getKey()) {
            $partner = User::query()->where('is_active', true)->find($matter->responsible_partner_id);
            $partner?->notify((new CorrespondenceDispatchedNotification($correspondence))->afterCommit());
        }

        return $correspondence;
    }
}
