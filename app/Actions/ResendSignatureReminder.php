<?php

namespace App\Actions;

use App\Models\SignatureRequest;
use App\Models\User;
use App\Notifications\SignatureReminderNotification;
use App\Services\AuditService;
use Illuminate\Support\Facades\Notification;

class ResendSignatureReminder
{
    public function __construct(private AuditService $audit) {}

    public function handle(SignatureRequest $signatureRequest, User $actor): int
    {
        if ($signatureRequest->status !== 'sent' || $signatureRequest->expires_at?->isPast()) {
            throw new \DomainException('Permintaan tanda tangan sudah tidak aktif.');
        }

        $cooldownHours = (int) config('raf.signature.reminder_interval_hours', 24);
        $signers = $signatureRequest->signers()
            ->where('status', 'pending')
            ->where(fn ($query) => $query->whereNull('last_reminded_at')->orWhere('last_reminded_at', '<=', now()->subHours($cooldownHours)))
            ->get();

        if ($signers->isEmpty()) {
            throw new \DomainException('Reminder masih dalam masa cooldown.');
        }

        $signers->each(function ($signer): void {
            Notification::route('mail', $signer->email)->notify((new SignatureReminderNotification($signer))->afterCommit());
            $signer->update(['last_reminded_at' => now()]);
        });
        $this->audit->record($signatureRequest, 'signature.reminder_resent', ['signer_count' => $signers->count()], $actor);

        return $signers->count();
    }
}
