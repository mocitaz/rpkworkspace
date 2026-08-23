<?php

use App\Actions\GenerateSignedFinalPdf;
use App\Actions\IngestInboundEmail;
use App\Models\Document;
use App\Models\DocumentVersion;
use App\Models\Matter;
use App\Models\SignatureRequest;
use App\Services\SystemReadiness;
use Dompdf\Dompdf;
use Illuminate\Support\Facades\Storage;
use PhpOffice\PhpWord\PhpWord;
use PhpOffice\PhpWord\Writer\Word2007;

it('marks signed final PDF unavailable instead of generating a false final artifact', function () {
    Storage::fake('local');
    config()->set('raf.signature.libreoffice_binary', 'missing-soffice');
    $actor = rafUser();
    $document = Document::factory()->recycle($actor)->create();
    $version = DocumentVersion::factory()->recycle([$document, $actor])->create([
        'document_id' => $document->getKey(), 'uploaded_by' => $actor->getKey(),
        'original_filename' => 'agreement.docx', 'storage_disk' => 'local', 'storage_path' => 'documents/agreement.docx',
    ]);
    Storage::disk('local')->put($version->storage_path, 'DOCX placeholder');
    $signature = SignatureRequest::factory()->recycle([$document, $version, $actor])->create([
        'document_id' => $document->getKey(), 'document_version_id' => $version->getKey(),
        'verification_code' => 'verify-local-readiness', 'document_checksum' => str_repeat('a', 64), 'created_by' => $actor->getKey(),
    ]);

    app(GenerateSignedFinalPdf::class)->handle($signature);

    expect($signature->refresh()->signed_final_status)->toBe('unavailable')
        ->and($signature->signed_final_path)->toBeNull();
});

it('stamps a PDF source into a signed final PDF with verification details', function () {
    Storage::fake('local');
    $actor = rafUser();
    $document = Document::factory()->recycle($actor)->create();
    $version = DocumentVersion::factory()->recycle([$document, $actor])->create([
        'document_id' => $document->getKey(), 'uploaded_by' => $actor->getKey(),
        'original_filename' => 'agreement.pdf', 'storage_disk' => 'local', 'storage_path' => 'documents/agreement.pdf',
    ]);
    $sourcePdf = new Dompdf;
    $sourcePdf->loadHtml('<h1>Agreement</h1><p>Legal document source.</p>');
    $sourcePdf->render();
    Storage::disk('local')->put($version->storage_path, $sourcePdf->output());
    $signature = SignatureRequest::factory()->recycle([$document, $version, $actor])->create([
        'document_id' => $document->getKey(), 'document_version_id' => $version->getKey(),
        'verification_code' => 'verify-final-pdf', 'document_checksum' => str_repeat('b', 64), 'created_by' => $actor->getKey(),
    ]);

    app(GenerateSignedFinalPdf::class)->handle($signature);

    expect($signature->refresh()->signed_final_status)->toBe('completed')
        ->and($signature->signed_final_path)->not->toBeNull();
    Storage::disk('local')->assertExists($signature->signed_final_path);
});

it('converts a DOCX source before stamping its signed final PDF', function () {
    Storage::fake('local');
    config()->set('raf.signature.libreoffice_binary', '/opt/homebrew/bin/soffice');
    $actor = rafUser();
    $document = Document::factory()->recycle($actor)->create();
    $version = DocumentVersion::factory()->recycle([$document, $actor])->create([
        'document_id' => $document->getKey(), 'uploaded_by' => $actor->getKey(),
        'original_filename' => 'agreement.docx', 'storage_disk' => 'local', 'storage_path' => 'documents/agreement-docx',
    ]);
    $temporaryDocx = tempnam(sys_get_temp_dir(), 'raf-docx-');
    $word = new PhpWord;
    $word->addSection()->addText('Agreement source document');
    (new Word2007($word))->save($temporaryDocx);
    Storage::disk('local')->put($version->storage_path, file_get_contents($temporaryDocx));
    unlink($temporaryDocx);
    $signature = SignatureRequest::factory()->recycle([$document, $version, $actor])->create([
        'document_id' => $document->getKey(), 'document_version_id' => $version->getKey(),
        'verification_code' => 'verify-final-docx', 'document_checksum' => str_repeat('c', 64), 'created_by' => $actor->getKey(),
    ]);

    app(GenerateSignedFinalPdf::class)->handle($signature);

    expect($signature->refresh()->signed_final_status)->toBe('completed')
        ->and($signature->signed_final_message)->toBeNull();
    Storage::disk('local')->assertExists($signature->signed_final_path);
});

it('ingests a signed BCC email once and stores attachments as private matter documents', function () {
    Storage::fake('local');
    $actor = rafUser();
    config()->set('raf.inbound_email.actor_id', $actor->getKey());
    $matter = Matter::factory()->recycle($actor)->create();
    $payload = [
        'message_id' => '<inbound-001@example.test>',
        'from' => ['client@example.test'], 'to' => ['matter@raf.test'],
        'subject' => 'Re: '.$matter->matter_number.' - dokumen pendukung',
        'text' => 'Mohon ditinjau.',
        'attachments' => [[
            'filename' => 'evidence.txt', 'mime_type' => 'text/plain', 'content_base64' => base64_encode('evidence'),
        ]],
    ];

    $first = app(IngestInboundEmail::class)->handle($payload);
    $second = app(IngestInboundEmail::class)->handle($payload);

    expect($second->getKey())->toBe($first->getKey())
        ->and($first->documents)->toHaveCount(1)
        ->and($first->documents->first()->matter_id)->toBe($matter->getKey());
});

it('accepts only a timely HMAC signed inbound email payload', function () {
    $actor = rafUser();
    $matter = Matter::factory()->recycle($actor)->create();
    config()->set('raf.inbound_email.actor_id', $actor->getKey());
    config()->set('raf.inbound_email.secret', 'inbound-local-secret');
    $payload = ['message_id' => '<hmac-001@example.test>', 'from' => ['client@example.test'], 'to' => ['matter@raf.test'], 'subject' => $matter->matter_number.' - HMAC inbound'];
    $raw = json_encode($payload, JSON_THROW_ON_ERROR);
    $timestamp = (string) now()->timestamp;
    $signature = hash_hmac('sha256', $timestamp.'.'.$raw, 'inbound-local-secret');

    $this->postJson(route('inbound.email.store'), $payload, [
        'X-RAF-Timestamp' => $timestamp, 'X-RAF-Signature' => $signature,
    ])->assertStatus(202);

    $this->postJson(route('inbound.email.store'), $payload)->assertForbidden();
});

it('only exposes host readiness diagnostics to administrators', function () {
    $this->actingAs(rafUser())->get(route('admin.system-readiness'))->assertForbidden();

    $administrator = rafUser(['admin.users.manage']);
    $this->actingAs($administrator)->get(route('admin.system-readiness'))->assertSuccessful()->assertJsonStructure(['ready', 'checks' => ['queue', 'private_storage', 'mail', 'clamav', 'tesseract', 'poppler', 'libreoffice']]);
    expect(app(SystemReadiness::class)->report())->toHaveKey('checks');
});
