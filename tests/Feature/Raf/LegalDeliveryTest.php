<?php

use App\Actions\CreateSignatureRequest;
use App\Actions\GenerateDocumentFromTemplate;
use App\Actions\ResendSignatureReminder;
use App\Actions\ResolveDocumentApproval;
use App\Actions\SignSignatureRequest;
use App\Actions\SubmitDocumentForApproval;
use App\Jobs\GenerateSignedFinalArtifact;
use App\Models\Document;
use App\Models\DocumentTemplate;
use App\Models\DocumentVersion;
use App\Models\Matter;
use App\Models\SignatureRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Storage;
use PhpOffice\PhpWord\PhpWord;
use PhpOffice\PhpWord\Writer\Word2007;

it('generates a private matter document from moustache placeholders in a DOCX template', function () {
    Storage::fake('local');
    $actor = rafUser();
    $matter = Matter::factory()->recycle($actor)->create();
    $temporaryTemplate = tempnam(sys_get_temp_dir(), 'raf-docx-');
    $phpWord = new PhpWord;
    $phpWord->addSection()->addText('Klien: {{client.name}} | Matter: {{matter.number}} | Partner: {{partner.name}}');
    (new Word2007($phpWord))->save($temporaryTemplate);
    Storage::disk('local')->put('templates/engagement.docx', file_get_contents($temporaryTemplate));
    unlink($temporaryTemplate);

    $template = DocumentTemplate::query()->create([
        'name' => 'Engagement Letter', 'document_type' => 'engagement_letter', 'storage_disk' => 'local',
        'storage_path' => 'templates/engagement.docx', 'original_filename' => 'engagement.docx',
        'checksum' => hash('sha256', Storage::disk('local')->get('templates/engagement.docx')),
        'placeholders' => ['client.name', 'matter.number', 'partner.name'], 'created_by' => $actor->getKey(),
    ]);

    $document = app(GenerateDocumentFromTemplate::class)->handle($template, $matter, $actor, [
        'client.name' => $matter->client->display_name,
        'matter.number' => $matter->matter_number,
        'partner.name' => $actor->name,
    ], 'Engagement Letter '.$matter->matter_number);

    expect($document->matter_id)->toBe($matter->getKey());
    $this->assertModelExists($document);
    Storage::disk('local')->assertExists($document->currentVersion->storage_path);
});

it('moves a document through requested review, revision, approved, and signing verification', function () {
    Queue::fake();
    Storage::fake((string) config('raf.documents.disk'));
    $author = rafUser();
    $reviewer = rafUser();
    $document = Document::factory()->recycle($author)->create(['status' => 'draft']);
    $version = DocumentVersion::factory()->recycle($document)->recycle($author)->create(['document_id' => $document->getKey(), 'uploaded_by' => $author->getKey()]);
    $document->update(['current_version_id' => $version->getKey()]);

    $approval = app(SubmitDocumentForApproval::class)->handle($document, $author, $reviewer, 'Mohon review.');
    expect($document->refresh()->status)->toBe('under_review');
    app(ResolveDocumentApproval::class)->handle($approval, $reviewer, false, 'Perlu revisi.');
    expect($document->refresh()->status)->toBe('revision_requested');
    $approval = app(SubmitDocumentForApproval::class)->handle($document, $author, $reviewer);
    app(ResolveDocumentApproval::class)->handle($approval, $reviewer, true, 'Disetujui.');
    expect($document->refresh()->status)->toBe('approved');

    $signatureRequest = app(CreateSignatureRequest::class)->handle($document, $author, [
        ['name' => 'Signer Pertama', 'email' => 'one@example.test'],
        ['name' => 'Signer Kedua', 'email' => 'two@example.test'],
    ]);
    $signers = $signatureRequest->signers()->get();
    $request = Request::create('/sign/'.$signers[0]->signing_token, 'POST', [], [], [], ['REMOTE_ADDR' => '127.0.0.1', 'HTTP_USER_AGENT' => 'Pest']);

    app(SignSignatureRequest::class)->handle($signers[0], 'Signer Pertama', $request);
    expect($signatureRequest->refresh()->status)->toBe('sent');
    app(SignSignatureRequest::class)->handle($signers[1], 'Signer Kedua', $request);

    expect($signatureRequest->refresh()->status)->toBe('completed')
        ->and($document->refresh()->status)->toBe('signed');
    expect($signatureRequest->signed_record_path)->not->toBeNull()
        ->and($signatureRequest->certificate_path)->not->toBeNull();
    Storage::disk((string) config('raf.documents.disk'))->assertExists($signatureRequest->signed_record_path);
    Storage::disk((string) config('raf.documents.disk'))->assertExists($signatureRequest->certificate_path);
    expect($signatureRequest->signed_final_status)->toBe('queued');
    Queue::assertPushed(GenerateSignedFinalArtifact::class, fn (GenerateSignedFinalArtifact $job) => $job->signatureRequestId === $signatureRequest->getKey());
    $this->get(route('signature.verify', $signatureRequest->verification_code))
        ->assertSuccessful()
        ->assertSee('Dokumen telah ditandatangani');
    $this->get(route('signature.qr', $signatureRequest->verification_code))
        ->assertSuccessful()
        ->assertHeader('content-type', 'image/svg+xml');
});

it('queues a signature reminder and records its cooldown timestamp', function () {
    Notification::fake();
    $actor = rafUser();
    $document = Document::factory()->recycle($actor)->create(['status' => 'approved']);
    $version = DocumentVersion::factory()->recycle($document)->recycle($actor)->create(['document_id' => $document->getKey(), 'uploaded_by' => $actor->getKey()]);
    $document->update(['current_version_id' => $version->getKey()]);
    $signatureRequest = app(CreateSignatureRequest::class)->handle($document, $actor, [
        ['name' => 'Signer', 'email' => 'signer@example.test'],
    ]);

    $count = app(ResendSignatureReminder::class)->handle($signatureRequest, $actor);

    expect($count)->toBe(1)
        ->and($signatureRequest->signers()->sole()->last_reminded_at)->not->toBeNull();
});

it('allows sending internal e-sign requests via HTTP on any document with versions', function () {
    $actor = rafUser(['document.view', 'document.upload', 'matter.view', 'matter.view.all', 'signature.manage']);
    $document = Document::factory()->recycle($actor)->create(['status' => 'draft']);
    $version = DocumentVersion::factory()->recycle($document)->recycle($actor)->create(['document_id' => $document->getKey(), 'uploaded_by' => $actor->getKey()]);
    $document->update(['current_version_id' => $version->getKey()]);

    $response = $this->actingAs($actor)->post(route('documents.signature-requests.store', $document), [
        'mode' => 'sequential',
        'signers' => [
            ['name' => 'Muhamad Fajar Roni', 'email' => 'fajaroni@rpklawoffice.local', 'signing_order' => 1],
        ],
    ]);

    $response->assertSessionHasNoErrors();
    $signatureRequest = SignatureRequest::query()->where('document_id', $document->getKey())->firstOrFail();
    expect($signatureRequest->status)->toBe('sent')
        ->and($signatureRequest->mode)->toBe('sequential')
        ->and($signatureRequest->signers)->toHaveCount(1)
        ->and($signatureRequest->signers->first()->email)->toBe('fajaroni@rpklawoffice.local');
});

it('allows choosing a specific document version for e-signature request', function () {
    $actor = rafUser(['document.view', 'document.upload', 'matter.view', 'matter.view.all', 'signature.manage']);
    $document = Document::factory()->recycle($actor)->create(['status' => 'draft']);
    $version1 = DocumentVersion::factory()->recycle($document)->recycle($actor)->create([
        'document_id' => $document->getKey(),
        'version_number' => 1,
        'original_filename' => 'Kontrak_v1.pdf',
        'uploaded_by' => $actor->getKey(),
    ]);
    $version2 = DocumentVersion::factory()->recycle($document)->recycle($actor)->create([
        'document_id' => $document->getKey(),
        'version_number' => 2,
        'original_filename' => 'Kontrak_v2.pdf',
        'uploaded_by' => $actor->getKey(),
    ]);
    $document->update(['current_version_id' => $version2->getKey()]);

    // Request e-sign targeting specific older version1
    $response = $this->actingAs($actor)->post(route('documents.signature-requests.store', $document), [
        'document_version_id' => $version1->getKey(),
        'mode' => 'parallel',
        'signers' => [
            ['name' => 'Signer A', 'email' => 'a@example.test'],
        ],
    ]);

    $response->assertSessionHasNoErrors();
    $signatureRequest = SignatureRequest::query()->where('document_id', $document->getKey())->firstOrFail();
    expect($signatureRequest->document_version_id)->toBe($version1->getKey())
        ->and($signatureRequest->document_checksum)->toBe($version1->checksum);
});

it('renders the executive signing page with Privy-grade stamp customization and accepts customized stamp parameters', function () {
    $actor = rafUser();
    $document = Document::factory()->recycle($actor)->create(['status' => 'approved']);
    $version = DocumentVersion::factory()->recycle($document)->recycle($actor)->create(['document_id' => $document->getKey(), 'uploaded_by' => $actor->getKey()]);
    $document->update(['current_version_id' => $version->getKey()]);

    $signatureRequest = app(CreateSignatureRequest::class)->handle($document, $actor, [
        ['name' => 'Muhamad Fajar Roni, S.H.', 'email' => 'fajar@rpklawoffice.local'],
    ]);

    $signer = $signatureRequest->signers()->sole();

    // 1. View signing page
    $this->get(route('signature.sign.show', $signer->signing_token))
        ->assertSuccessful()
        ->assertSee('RPK LAW FIRM')
        ->assertSee('Digital Signing Workspace')
        ->assertSee('UU ITE & SHA-256 Valid')
        ->assertSee('Bubuhkan Tanda Tangan')
        ->assertSee('Pengaturan Stempel & Ukuran Presisi')
        ->assertSee('Sertakan QR Code');

    // 2. Submit signature with customized stamp dimensions and toggles
    $response = $this->post(route('signature.sign.store', $signer->signing_token), [
        'accepted_name' => 'Muhamad Fajar Roni, S.H.',
        'signer_title' => 'Managing Partner & Advocate',
        'accept_terms' => '1',
        'signature_data' => 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        'page_number' => 1,
        'position_x' => 65.5,
        'position_y' => 80.0,
        'stamp_width' => 48.0,
        'stamp_height' => 28.0,
        'show_qr' => '0',
        'show_name' => '1',
        'show_title' => '1',
        'show_border' => '1',
        'stamp_layout' => 'sig_left',
        'name_position' => 'bottom',
        'signature_type' => 'type',
    ]);

    $response->assertRedirect(route('signature.verify', $signatureRequest->verification_code));

    $signer->refresh();
    expect($signer->status)->toBe('signed')
        ->and($signer->accepted_name)->toBe('Muhamad Fajar Roni, S.H.')
        ->and($signer->signer_title)->toBe('Managing Partner & Advocate')
        ->and((float) $signer->stamp_width)->toBe(48.0)
        ->and((float) $signer->stamp_height)->toBe(28.0)
        ->and($signer->show_qr)->toBeFalse()
        ->and($signer->show_name)->toBeTrue()
        ->and($signer->show_title)->toBeTrue()
        ->and($signer->show_border)->toBeTrue()
        ->and($signer->signature_type)->toBe('type');
});
