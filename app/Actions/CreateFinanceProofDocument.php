<?php

namespace App\Actions;

use App\Models\Client;
use App\Models\Document;
use App\Models\Matter;
use App\Models\User;
use Illuminate\Http\UploadedFile;

class CreateFinanceProofDocument
{
    public function __construct(
        private CreateDocumentVersion $createDocumentVersion,
        private EnsureMatterIsNotOnLegalHold $legalHold,
    ) {}

    public function handle(UploadedFile $file, User $actor, string $title, ?Matter $matter = null, ?Client $client = null): Document
    {
        $this->legalHold->handle($matter);
        $document = Document::query()->create([
            'matter_id' => $matter?->getKey(),
            'client_id' => $client?->getKey() ?? $matter?->client_id,
            'title' => $title,
            'document_type' => 'financial_proof',
            'confidentiality_level' => 'restricted',
            'created_by' => $actor->getKey(),
        ]);
        $this->createDocumentVersion->handle($document, $file, $actor, 'Bukti transaksi keuangan.');

        return $document;
    }
}
