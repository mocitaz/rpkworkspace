<?php

namespace App\Services;

use App\Models\AuditLog;
use App\Models\User;
use App\WorkflowStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AuditService
{
    /** @param array<string, mixed> $metadata */
    public function record(Model $subject, string $event, array $metadata = [], ?User $actor = null, ?Request $request = null, ?string $category = null): AuditLog
    {
        return DB::transaction(function () use ($subject, $event, $metadata, $actor, $request, $category): AuditLog {
            $previousHash = AuditLog::query()->lockForUpdate()->latest('created_at')->value('entry_hash');
            $payload = [
                'actor_id' => $actor?->getKey(),
                'event' => $event,
                'category' => $category ?? str($event)->before('.')->toString(),
                'subject_type' => $subject->getMorphClass(),
                'subject_id' => (string) $subject->getKey(),
                'metadata' => $metadata,
                'created_at' => now()->toIso8601String(),
            ];

            return AuditLog::query()->create([
                ...$payload,
                'previous_hash' => $previousHash,
                'entry_hash' => hash('sha256', json_encode([$previousHash, $payload], JSON_THROW_ON_ERROR)),
                'actor_id' => $actor?->getKey(),
                'ip_address' => $request?->ip(),
                'user_agent' => $request?->userAgent(),
                'created_at' => $payload['created_at'],
            ]);
        }, 3);
    }

    /**
     * @param  array<string, mixed>  $before
     * @param  array<string, mixed>  $after
     */
    public function recordChange(Model $subject, string $event, array $before, array $after, ?User $actor = null, ?Request $request = null): AuditLog
    {
        return $this->record($subject, $event, [
            'changes' => ['before' => $before, 'after' => $after],
        ], $actor, $request);
    }

    public function recordWorkflowTransition(Model $subject, string $event, WorkflowStatus $from, WorkflowStatus $to, ?User $actor = null, ?Request $request = null): AuditLog
    {
        $from->ensureCanTransitionTo($to);

        return $this->record($subject, $event, [
            'workflow' => [
                'from' => $from->value,
                'to' => $to->value,
            ],
        ], $actor, $request);
    }

    public function recordMonetaryChange(Model $subject, string $event, int $beforeAmount, int $afterAmount, ?User $actor = null, ?Request $request = null, ?string $currency = null): AuditLog
    {
        return $this->record($subject, $event, [
            'amount' => [
                'before' => $beforeAmount,
                'after' => $afterAmount,
                'currency' => $currency ?? config('raf.finance.currency', 'IDR'),
            ],
        ], $actor, $request, 'billing');
    }
}
