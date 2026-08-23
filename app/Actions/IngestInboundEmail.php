<?php

namespace App\Actions;

use App\Models\Correspondence;
use App\Models\Document;
use App\Models\Matter;
use App\Models\User;
use App\Services\AuditService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use LogicException;

class IngestInboundEmail
{
    public function __construct(
        private AuditService $audit,
        private CreateDocumentVersion $createDocumentVersion,
        private EnsureMatterIsNotOnLegalHold $legalHold,
    ) {}

    /** @param array<string, mixed> $attributes */
    public function handle(array $attributes): Correspondence
    {
        $existing = Correspondence::query()->where('external_message_id', $attributes['message_id'])->first();
        if ($existing !== null) {
            return $existing;
        }

        $matter = $this->matterFromSubject((string) $attributes['subject']);
        if ($matter === null) {
            throw new LogicException('Kode matter RAF-YYYY-XXXX tidak ditemukan pada subjek email.');
        }
        $this->legalHold->handle($matter);

        $actor = $this->inboundActor();
        $correspondence = DB::transaction(function () use ($attributes, $matter, $actor): Correspondence {
            return Correspondence::query()->create([
                'matter_id' => $matter->getKey(), 'client_id' => $matter->client_id,
                'direction' => 'inbound', 'source' => 'bcc', 'subject' => $attributes['subject'],
                'from_addresses' => $attributes['from'], 'to_addresses' => $attributes['to'],
                'cc_addresses' => $attributes['cc'] ?? [], 'body' => $attributes['text'] ?? null,
                'external_message_id' => $attributes['message_id'], 'occurred_at' => $attributes['occurred_at'] ?? now(),
                'created_by' => $actor->getKey(),
            ]);
        }, 3);

        $documentIds = collect(Arr::wrap($attributes['attachments'] ?? []))
            ->map(fn (mixed $attachment) => $this->storeAttachment($this->validatedAttachment($attachment), $matter, $actor)->getKey())
            ->all();
        $correspondence->documents()->sync($documentIds);
        $this->audit->record($correspondence, 'correspondence.bcc_ingested', [
            'message_id' => $attributes['message_id'], 'attachment_count' => count($documentIds),
        ], $actor);

        return $correspondence;
    }

    private function matterFromSubject(string $subject): ?Matter
    {
        preg_match('/\bRAF-\d{4}-\d{4}\b/i', $subject, $matches);
        $matterNumber = $matches[0] ?? null;

        return is_string($matterNumber) ? Matter::query()->where('matter_number', strtoupper($matterNumber))->first() : null;
    }

    /** @param array{filename: string, mime_type: string, content_base64: string} $attachment */
    private function storeAttachment(array $attachment, Matter $matter, User $actor): Document
    {
        $contents = base64_decode($attachment['content_base64'], true);
        if ($contents === false) {
            throw new LogicException('Lampiran BCC tidak menggunakan Base64 yang valid.');
        }

        $temporaryPath = tempnam(sys_get_temp_dir(), 'raf-bcc-');
        if ($temporaryPath === false) {
            throw new LogicException('Lampiran BCC tidak dapat diproses.');
        }

        try {
            file_put_contents($temporaryPath, $contents);
            $document = Document::query()->create([
                'matter_id' => $matter->getKey(), 'client_id' => $matter->client_id,
                'title' => Str::limit(pathinfo($attachment['filename'], PATHINFO_FILENAME), 255, ''),
                'document_type' => 'email_attachment', 'confidentiality_level' => 'restricted', 'created_by' => $actor->getKey(),
            ]);
            $file = new UploadedFile($temporaryPath, $attachment['filename'], $attachment['mime_type'], null, true);
            $this->createDocumentVersion->handle($document, $file, $actor, 'Lampiran correspondence BCC.');

            return $document;
        } finally {
            if (is_file($temporaryPath)) {
                unlink($temporaryPath);
            }
        }
    }

    private function inboundActor(): User
    {
        $actorId = config('raf.inbound_email.actor_id');
        if (! is_int($actorId) && ! ctype_digit((string) $actorId)) {
            throw new LogicException('RAF_INBOUND_EMAIL_ACTOR_ID belum dikonfigurasi.');
        }

        return User::query()->whereKey($actorId)->where('is_active', true)->sole();
    }

    /** @return array{filename: string, mime_type: string, content_base64: string} */
    private function validatedAttachment(mixed $attachment): array
    {
        if (! is_array($attachment)
            || ! is_string($attachment['filename'] ?? null)
            || ! is_string($attachment['mime_type'] ?? null)
            || ! is_string($attachment['content_base64'] ?? null)) {
            throw new LogicException('Struktur lampiran BCC tidak valid.');
        }

        return [
            'filename' => $attachment['filename'],
            'mime_type' => $attachment['mime_type'],
            'content_base64' => $attachment['content_base64'],
        ];
    }
}
