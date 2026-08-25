<?php

use App\Actions\ArchiveMatter;
use App\Actions\CreateDocumentVersion;
use App\Actions\EnsureConflictCheckCleared;
use App\Actions\LogCorrespondence;
use App\Actions\PlaceMatterOnLegalHold;
use App\Actions\RequestMatterExport;
use App\Actions\ResolveConflictCheck;
use App\Actions\RunConflictCheck;
use App\Jobs\GenerateMatterHandoverExport;
use App\Models\Client;
use App\Models\ConflictCheck;
use App\Models\Document;
use App\Models\DocumentVersion;
use App\Models\Matter;
use App\Models\MatterParty;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Storage;

it('logs correspondence against a matter with auditable message metadata', function () {
    $actor = rafUser();
    $matter = Matter::factory()->recycle($actor)->create();
    $attachment = Document::factory()->recycle($matter)->recycle($actor)->create(['matter_id' => $matter->getKey(), 'created_by' => $actor->getKey()]);

    $correspondence = app(LogCorrespondence::class)->handle($matter, [
        'direction' => 'outbound',
        'source' => 'manual',
        'subject' => 'Pembahasan langkah berikutnya',
        'from_addresses' => ['partner@raf.test'],
        'to_addresses' => ['client@example.test'],
        'cc_addresses' => [],
        'body' => 'Mohon konfirmasi jadwal.',
        'occurred_at' => now(),
        'document_ids' => [$attachment->getKey()],
    ], $actor);

    $this->assertModelExists($correspondence);
    expect($correspondence->matter_id)->toBe($matter->getKey())
        ->and($correspondence->client_id)->toBe($matter->client_id);
    expect($correspondence->documents()->pluck('id')->all())->toBe([$attachment->getKey()]);
});

it('records blocked conflict matches and a partner waiver decision', function () {
    $actor = rafUser();
    $partner = rafUser();
    $existingMatter = Matter::factory()->recycle($actor)->create();
    MatterParty::factory()->create([
        'matter_id' => $existingMatter->getKey(),
        'created_by' => $actor->getKey(),
        'party_type' => 'opposing_party',
        'name' => 'PT Merah Nusantara',
    ]);

    $check = app(RunConflictCheck::class)->handle($actor, ['PT Merah Nusantara']);

    expect($check->status)->toBe('blocked')
        ->and($check->matches)->not->toBeEmpty();
    app(ResolveConflictCheck::class)->handle($check, $partner, 'waived', 'Partner menyetujui waiver.');

    expect($check->refresh()->decision)->toBe('waived')
        ->and($check->reviewed_by)->toBe($partner->getKey());
});

it('requires a clear or waived conflict check before intake may continue', function () {
    $actor = rafUser();
    $matter = Matter::factory()->recycle($actor)->create();
    MatterParty::factory()->create([
        'matter_id' => $matter->getKey(),
        'created_by' => $actor->getKey(),
        'party_type' => 'opposing_party',
        'name' => 'PT Konflik Intake',
    ]);
    $blocked = app(RunConflictCheck::class)->handle($actor, ['PT Konflik Intake'], $matter->client);

    expect(fn () => app(EnsureConflictCheckCleared::class)->forMatter($blocked->getKey(), $matter->client_id))->toThrow(LogicException::class);
});

it('enforces legal hold before archive and queues private matter export', function () {
    Queue::fake();
    $actor = rafUser();
    $matter = Matter::factory()->recycle($actor)->create(['status' => 'closed']);

    app(PlaceMatterOnLegalHold::class)->handle($matter, $actor, 'Retensi untuk sengketa berjalan.');
    expect(fn () => app(ArchiveMatter::class)->handle($matter, $actor))->toThrow(DomainException::class);
    app(PlaceMatterOnLegalHold::class)->handle($matter, $actor, null, false);
    app(ArchiveMatter::class)->handle($matter, $actor);
    $export = app(RequestMatterExport::class)->handle($matter, $actor);

    expect($matter->refresh()->status)->toBe('archived');
    $this->assertModelExists($export);
    Queue::assertPushed(GenerateMatterHandoverExport::class, fn (GenerateMatterHandoverExport $job) => $job->matterExportId === $export->getKey());
});

it('prevents operational matter changes and document versions while a legal hold is active', function () {
    Storage::fake('local');
    $actor = rafUser();
    $matter = Matter::factory()->recycle($actor)->create();
    $document = Document::factory()->recycle($matter)->recycle($actor)->create(['matter_id' => $matter->getKey(), 'created_by' => $actor->getKey()]);
    app(PlaceMatterOnLegalHold::class)->handle($matter, $actor, 'Preservasi bukti aktif.');

    expect(fn () => app(LogCorrespondence::class)->handle($matter, [
        'direction' => 'outbound', 'source' => 'manual', 'subject' => 'Tidak boleh tercatat',
        'from_addresses' => ['partner@raf.test'], 'to_addresses' => ['client@example.test'], 'occurred_at' => now(),
    ], $actor))->toThrow(DomainException::class)
        ->and(fn () => app(CreateDocumentVersion::class)->handle($document, UploadedFile::fake()->create('evidence.pdf', 10, 'application/pdf'), $actor))->toThrow(DomainException::class);
});

it('builds a private handover bundle containing clean documents only', function () {
    Storage::fake('local');
    $actor = rafUser();
    $matter = Matter::factory()->recycle($actor)->create();
    $document = Document::factory()->recycle($matter)->recycle($actor)->create(['matter_id' => $matter->getKey(), 'created_by' => $actor->getKey()]);
    $version = DocumentVersion::factory()->recycle($document)->recycle($actor)->create([
        'document_id' => $document->getKey(),
        'uploaded_by' => $actor->getKey(),
        'storage_path' => 'documents/export-test.pdf',
        'scan_status' => 'clean',
    ]);
    $document->update(['current_version_id' => $version->getKey()]);
    Storage::disk('local')->put($version->storage_path, 'confidential matter document');
    $export = $matter->exports()->create(['requested_by' => $actor->getKey()]);

    (new GenerateMatterHandoverExport($export->getKey()))->handle();

    expect($export->refresh()->status)->toBe('completed')
        ->and($export->storage_path)->not->toBeNull();
    Storage::disk('local')->assertExists($export->storage_path);
});

it('processes conflict check via HTTP on matter intake and redirects back to create form with results', function () {
    $actor = rafUser(['matter.create', 'conflict.manage', 'client.view']);
    $client = Client::factory()->create(['status' => 'active']);

    $response = $this->actingAs($actor)->post(route('matters.conflict-checks.store'), [
        'client_id' => $client->id,
        'names' => ['tes', '', '', ''],
    ]);

    $response->assertSessionHasNoErrors();
    $conflictCheck = ConflictCheck::query()->where('client_id', $client->id)->firstOrFail();
    $response->assertRedirect(route('matters.create', ['conflict_check' => $conflictCheck->id]));

    // Now visit the create page with the conflict check param
    $createPage = $this->actingAs($actor)->get(route('matters.create', ['conflict_check' => $conflictCheck->id]));
    $createPage->assertOk();
});
