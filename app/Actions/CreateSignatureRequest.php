<?php

namespace App\Actions;

use App\Models\Document;
use App\Models\SignatureRequest;
use App\Models\User;
use App\Services\AuditService;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CreateSignatureRequest
{
    public function __construct(private AuditService $audit, private EnsureMatterIsNotOnLegalHold $legalHold) {}

    /** @param list<array{name: string, email: string, signing_order?: int}> $signers */
    public function handle(Document $document, User $actor, array $signers, string $mode = 'sequential', ?\DateTimeInterface $expiresAt = null): SignatureRequest
    {
        $document->loadMissing('matter');
        $this->legalHold->handle($document->matter);
        if (! in_array($document->status, ['approved', 'final'], true) || $document->currentVersion === null) {
            throw new \DomainException('Dokumen harus disetujui atau final sebelum dikirim untuk tanda tangan.');
        }

        if (! in_array($mode, ['sequential', 'parallel'], true) || $signers === []) {
            throw new \DomainException('Mode atau daftar penanda tangan tidak valid.');
        }

        $request = DB::transaction(function () use ($document, $actor, $signers, $mode, $expiresAt) {
            $lockedDocument = Document::query()->lockForUpdate()->with('currentVersion')->whereKey($document)->firstOrFail();
            $version = $lockedDocument->currentVersion;

            if ($version === null) {
                throw new \DomainException('Dokumen belum memiliki versi untuk ditandatangani.');
            }

            $request = SignatureRequest::query()->create([
                'document_id' => $lockedDocument->getKey(),
                'document_version_id' => $version->getKey(),
                'verification_code' => Str::upper(Str::random(16)),
                'mode' => $mode,
                'status' => 'sent',
                'document_checksum' => $version->checksum,
                'expires_at' => $expiresAt,
                'sent_at' => now(),
                'created_by' => $actor->getKey(),
            ]);

            foreach ($signers as $index => $signer) {
                $request->signers()->create([
                    'name' => Arr::get($signer, 'name'),
                    'email' => Arr::get($signer, 'email'),
                    'signing_order' => $mode === 'parallel' ? 1 : Arr::get($signer, 'signing_order', $index + 1),
                    'signing_token' => Str::random(64),
                ]);
            }

            return $request;
        }, 3);

        $this->audit->record($request, 'signature.request_sent', [
            'document_id' => $document->getKey(),
            'signer_count' => count($signers),
            'mode' => $mode,
        ], $actor);

        return $request;
    }
}
