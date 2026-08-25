<?php

namespace App\Actions;

use App\Models\SignatureRequest;
use App\Models\SignatureSigner;
use App\Models\User;
use App\Notifications\DocumentSignedExecutedNotification;
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
                'signature_data' => $request->input('signature_data'),
                'page_number' => $request->filled('page_number') ? (int) $request->input('page_number') : null,
                'position_x' => $request->filled('position_x') ? (float) $request->input('position_x') : null,
                'position_y' => $request->filled('position_y') ? (float) $request->input('position_y') : null,
                'stamp_layout' => (string) $request->input('stamp_layout', 'sig_left'),
                'name_position' => (string) $request->input('name_position', 'bottom'),
                'signer_title' => $request->filled('signer_title') ? (string) $request->input('signer_title') : null,
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

            if ($signatureRequest->document->matter) {
                $members = $signatureRequest->document->matter->members()->get();
                foreach ($members as $member) {
                    $member->notify((new DocumentSignedExecutedNotification(
                        $signatureRequest->document,
                        $signer->accepted_name ?? $signer->name,
                        $signatureRequest->verification_code
                    ))->afterCommit());
                }
            } elseif ($signatureRequest->created_by) {
                $creator = User::query()->find($signatureRequest->created_by);
                $creator?->notify((new DocumentSignedExecutedNotification(
                    $signatureRequest->document,
                    $signer->accepted_name ?? $signer->name,
                    $signatureRequest->verification_code
                ))->afterCommit());
            }
        }

        return $signatureRequest;
    }
}
