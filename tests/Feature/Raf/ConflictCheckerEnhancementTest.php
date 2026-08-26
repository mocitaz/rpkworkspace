<?php

use App\Actions\ResolveConflictCheck;
use App\Actions\RunConflictCheck;
use App\Models\Client;
use App\Models\ConflictCheck;
use App\Models\Matter;
use App\Models\MatterParty;

it('scans and returns preview without persisting records', function () {
    $actor = rafUser(['conflict.view', 'conflict.manage', 'matter.create']);
    $client = Client::factory()->create([
        'display_name' => 'PT Sumber Energi Sejahtera',
        'legal_name' => 'PT Sumber Energi Sejahtera Indonesia',
    ]);

    $response = $this->actingAs($actor)->postJson(route('governance.conflict-checks.preview'), [
        'names' => ['PT Sumber Energi Sejahtera'],
    ]);

    $response->assertSuccessful();
    $data = $response->json();

    expect($data['match_count'])->toBeGreaterThanOrEqual(1)
        ->and($data['status'])->toBeIn(['blocked', 'potential_match'])
        ->and(ConflictCheck::query()->count())->toBe(0); // No record persisted during preview
});

it('detects direct adverse conflict from active matter opposing parties as blocked', function () {
    $actor = rafUser(['conflict.view', 'conflict.manage', 'matter.create']);
    $matter = Matter::factory()->recycle($actor)->create([
        'status' => 'active',
        'title' => 'Sengketa Kontrak Tambang',
    ]);

    MatterParty::factory()->create([
        'matter_id' => $matter->getKey(),
        'created_by' => $actor->getKey(),
        'party_type' => 'opposing_party',
        'name' => 'PT Lawan Perkasa',
    ]);

    $check = app(RunConflictCheck::class)->handle($actor, ['PT Lawan Perkasa']);

    expect($check->status)->toBe('blocked')
        ->and($check->matches)->toBeArray()
        ->and(count($check->matches))->toBeGreaterThanOrEqual(1)
        ->and($check->matches[0]['risk'])->toBe('blocked')
        ->and($check->matches[0]['role_label'])->toContain('PIHAK LAWAN');
});

it('detects former client matches as potential_match with similarity scoring', function () {
    $actor = rafUser(['conflict.view', 'conflict.manage', 'matter.create']);
    $client = Client::factory()->create([
        'display_name' => 'PT Mitra Solusi Nusantara',
        'status' => 'inactive',
    ]);

    $check = app(RunConflictCheck::class)->handle($actor, ['PT Mitra Solusi']);

    expect($check->status)->toBe('potential_match')
        ->and($check->matches)->toBeArray()
        ->and($check->matches[0]['similarity'])->toBeGreaterThan(50);
});

it('allows partner to record ethical waiver on conflict checks', function () {
    $partner = rafUser(['conflict.manage', 'conflict.approve']);
    $check = ConflictCheck::factory()->create([
        'status' => 'blocked',
        'decision' => 'pending',
    ]);

    $resolved = app(ResolveConflictCheck::class)->handle(
        $check,
        $partner,
        'waived',
        'Telah ditinjau bersama Managing Partner dan disetujui klausul non-disclosure barrier.'
    );

    expect($resolved->decision)->toBe('waived')
        ->and($resolved->reviewed_by)->toBe($partner->getKey())
        ->and($resolved->decision_note)->toContain('disetujui klausul');
});

it('renders the official conflict clearance certificate page', function () {
    $partner = rafUser(['conflict.view', 'governance.view']);
    $check = ConflictCheck::factory()->create([
        'status' => 'clear',
        'decision' => 'cleared',
        'searched_names' => ['PT Bumi Sejahtera', 'John Doe'],
        'reviewed_by' => $partner->getKey(),
        'reviewed_at' => now(),
    ]);

    $response = $this->actingAs($partner)->get(route('governance.conflict-checks.certificate', $check));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('governance/conflict-certificate')
        ->has('conflictCheck')
        ->where('conflictCheck.id', $check->getKey())
    );
});
