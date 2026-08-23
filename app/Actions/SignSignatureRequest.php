<?php

namespace App\Actions;

use App\Models\SignatureRequest;
use App\Models\SignatureSigner;
use App\Services\AuditService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SignSignatureRequest
{
    public function __construct(
        private AuditService $audit,
        private GenerateSignatureArtifacts $generateArtifacts,
        private EnsureMatterIsNotOnLegalHold $legalHold,
    ) {}

    public function handle(SignatureSigner $signer, string $acceptedName, Request $request): SignatureRequest
    {
        $signatureRequest = DB::transaction(function () use ($signer, $acceptedName, $request) {
            $lockedSigner = SignatureSigner::query()->lockForUpdate()->with('signatureRequest.document')->whereKey($signer)->firstOrFail();
            $signatureRequest = $lockedSigner->signatureRequest;
            $signatureRequest->document->loadMissing('matter');
            $this->legalHold->handle($signatureRequest->document->matter);

            if ($signatureRequest->status !== 'sent' || $lockedSigner->status !== 'pending') {
                throw new \DomainException('Permintaan tanda tangan sudah tidak aktif.');
            }

            if ($signatureRequest->expires_at?->isPast()) {
                $signatureRequest->update(['status' => 'expired']);
                throw new \DomainException('Permintaan tanda tangan telah kedaluwarsa.');
            }

            if ($signatureRequest->mode === 'sequential') {
                $hasEarlierPendingSigner = $signatureRequest->signers()
                    ->where('status', 'pending')
                    ->where('signing_order', '<', $lockedSigner->signing_order)
                    ->exists();

                if ($hasEarlierPendingSigner) {
                    throw new \DomainException('Belum giliran Anda untuk menandatangani dokumen ini.');
                }
            }

            $lockedSigner->update([
                'status' => 'signed',
                'signed_at' => now(),
                'signed_ip_address' => $request->ip(),
                'signed_user_agent' => $request->userAgent(),
                'accepted_name' => $acceptedName,
            ]);

            if (! $signatureRequest->signers()->where('status', 'pending')->exists()) {
                $signatureRequest->update(['status' => 'completed', 'completed_at' => now()]);
                $signatureRequest->document->update(['status' => 'signed']);
            }

            return $signatureRequest;
        }, 3);

        $this->audit->record($signatureRequest, 'signature.signer_completed', [
            'signer_id' => $signer->getKey(),
            'verification_code' => $signatureRequest->verification_code,
        ], null, $request);

        if ($signatureRequest->status === 'completed') {
            $signatureRequest = $this->generateArtifacts->handle($signatureRequest);
            $this->audit->record($signatureRequest, 'signature.artifacts_generated', [
                'verification_code' => $signatureRequest->verification_code,
            ], null, $request);
        }

        return $signatureRequest;
    }
}
