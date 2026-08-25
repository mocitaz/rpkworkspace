<?php

use App\Models\Client;
use App\Models\ClientComplianceDocument;
use App\Models\ConflictCheck;
use App\Models\Matter;
use App\Models\MatterEvidence;

it('supports parent-child matter hierarchy for appellate and derivative cases', function () {
    $user = rafUser(['matter.view', 'matter.view.all', 'matter.create', 'matter.update', 'client.view', 'conflict.view']);
    $client = Client::factory()->create();
    $conflictCheck = ConflictCheck::query()->create([
        'client_id' => $client->id,
        'subject_name' => 'PT Mandiri Jaya Abadi',
        'searched_names' => ['PT Mandiri Jaya Abadi'],
        'status' => 'clear',
        'decision' => 'approved',
        'requested_by' => $user->id,
    ]);

    $parentMatter = Matter::factory()->create([
        'client_id' => $client->id,
        'title' => 'Gugatan Wanprestasi Tingkat Pertama',
    ]);

    $response = $this->actingAs($user)->post(route('matters.store'), [
        'client_id' => $client->id,
        'title' => 'Permohonan Banding PT TUN',
        'practice_area_id' => $parentMatter->practice_area_id,
        'parent_matter_id' => $parentMatter->id,
        'relationship_type' => 'appeal_pt',
        'status' => 'active',
        'priority' => 'normal',
        'confidentiality_level' => 'standard',
        'responsible_partner_id' => $user->id,
        'conflict_check_id' => $conflictCheck->id,
    ]);

    $response->assertSessionHasNoErrors();
    $childMatter = Matter::query()->where('parent_matter_id', $parentMatter->id)->first();
    expect($childMatter)->not->toBeNull()
        ->and($childMatter->relationship_type)->toBe('appeal_pt')
        ->and($childMatter->parentMatter->id)->toBe($parentMatter->id);

    expect($parentMatter->childMatters)->toHaveCount(1)
        ->and($parentMatter->childMatters->first()->id)->toBe($childMatter->id);
});

it('manages physical evidence vault lifecycle and custody tracking', function () {
    $user = rafUser(['matter.view', 'matter.view.all', 'matter.update', 'matter.manage']);
    $matter = Matter::factory()->create([
        'created_by' => $user->id,
        'responsible_partner_id' => $user->id,
        'confidentiality_level' => 'standard',
    ]);

    // 1. Store Evidence
    $response = $this->actingAs($user)->post("/matters/{$matter->id}/evidences", [
        'evidence_code' => 'Bukti P-1',
        'title' => 'Asli Akta Perjanjian Jual Beli No. 12',
        'originality' => 'original',
        'vault_location' => 'Brankas Litigasi A-01',
        'status' => 'in_vault',
        'custodian_name' => 'Adv. Roni, S.H.',
        'description' => 'Membuktikan adanya klausula pembayaran.',
        'custody_notes' => 'Diserahkan oleh Direktur Utama klien.',
    ]);

    $response->assertSessionHasNoErrors();
    $response->assertRedirect();
    $evidence = MatterEvidence::query()->where('matter_id', $matter->getKey())->first();
    expect($evidence)->not->toBeNull()
        ->and($evidence->evidence_code)->toBe('Bukti P-1')
        ->and($evidence->originality)->toBe('original')
        ->and($evidence->status)->toBe('in_vault');

    // 2. Update Status & Custody
    $updateResponse = $this->actingAs($user)->put("/matters/{$matter->id}/evidences/{$evidence->id}", [
        'evidence_code' => 'Bukti P-1',
        'title' => 'Asli Akta Perjanjian Jual Beli No. 12 (Legalisir)',
        'originality' => 'original',
        'vault_location' => 'Ruang Sidang PN Bandung',
        'status' => 'borrowed_for_hearing',
        'custodian_name' => 'Adv. Putra, S.H.',
        'description' => 'Dibawa untuk pembuktian sidang saksi.',
        'custody_notes' => 'Dipinjam untuk sidang tanggal 25 Agustus 2026.',
    ]);

    $updateResponse->assertSessionHasNoErrors();
    expect($evidence->fresh()->status)->toBe('borrowed_for_hearing')
        ->and($evidence->fresh()->vault_location)->toBe('Ruang Sidang PN Bandung');

    // 3. Delete Evidence
    $deleteResponse = $this->actingAs($user)->delete("/matters/{$matter->id}/evidences/{$evidence->id}");
    $deleteResponse->assertSessionHasNoErrors();
    expect(MatterEvidence::query()->find($evidence->id))->toBeNull();
});

it('tracks client corporate compliance documents and expiry watchdog', function () {
    $user = rafUser(['client.view', 'client.update', 'client.manage']);
    $client = Client::factory()->create(['type' => 'corporate']);

    // 1. Create Active Deed
    $response = $this->actingAs($user)->post("/clients/{$client->id}/compliance-documents", [
        'document_type' => 'deed_establishment',
        'document_number' => 'No. 88 Tanggal 10-02-2020',
        'title' => 'Akta Pendirian PT Mandiri Jaya Abadi',
        'issuer' => 'Notaris Sugeng, S.H.',
        'issued_at' => '2020-02-10',
        'expires_at' => null,
        'notes' => 'Pengesahan Kemenkumham AHU-00129.AH.01.01.TAHUN 2020',
    ]);

    $response->assertSessionHasNoErrors();
    $doc = ClientComplianceDocument::query()->where('client_id', $client->id)->first();
    expect($doc)->not->toBeNull()
        ->and($doc->compliance_status)->toBe('no_expiry');

    // 2. Create Expired License
    $expiredDoc = ClientComplianceDocument::query()->create([
        'client_id' => $client->id,
        'document_type' => 'kbli_license',
        'document_number' => 'IZIN-2021-001',
        'title' => 'Izin Operasional Khusus Sektoral',
        'issued_at' => now()->subYears(3)->format('Y-m-d'),
        'expires_at' => now()->subDays(10)->format('Y-m-d'),
        'created_by' => $user->id,
    ]);
    expect($expiredDoc->compliance_status)->toBe('expired');

    // 3. Create Expiring Soon License (H-30)
    $expiringDoc = ClientComplianceDocument::query()->create([
        'client_id' => $client->id,
        'document_type' => 'nib',
        'document_number' => 'NIB-991283',
        'title' => 'Sertifikat Standar OSS',
        'issued_at' => now()->subYears(1)->format('Y-m-d'),
        'expires_at' => now()->addDays(25)->format('Y-m-d'),
        'created_by' => $user->id,
    ]);
    expect($expiringDoc->compliance_status)->toBe('expiring_soon');

    // 4. Update Compliance Document
    $this->actingAs($user)->put("/clients/{$client->id}/compliance-documents/{$expiredDoc->id}", [
        'document_type' => 'kbli_license',
        'document_number' => 'IZIN-2021-001-RENEWED',
        'title' => 'Perpanjangan Izin Operasional Khusus Sektoral',
        'expires_at' => now()->addYears(2)->format('Y-m-d'),
    ]);
    expect($expiredDoc->fresh()->compliance_status)->toBe('active')
        ->and($expiredDoc->fresh()->document_number)->toBe('IZIN-2021-001-RENEWED');

    // 5. Delete Compliance Document
    $this->actingAs($user)->delete("/clients/{$client->id}/compliance-documents/{$expiredDoc->id}");
    expect(ClientComplianceDocument::query()->find($expiredDoc->id))->toBeNull();
});

it('redirects templates index to documents', function () {
    $user = rafUser(['document.view']);
    $indexResponse = $this->actingAs($user)->get(route('templates.index'));
    $indexResponse->assertRedirect('/documents');
});
