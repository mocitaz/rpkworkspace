<?php

use App\Models\AuditLog;
use App\Models\Client;
use App\Models\Matter;
use App\Models\User;
use App\Notifications\MatterAssignedNotification;
use Illuminate\Support\Facades\Notification;

it('updates a client and preserves a blank encrypted tax identifier', function () {
    $manager = rafUser(['client.view', 'client.manage']);
    $client = Client::factory()->recycle($manager)->create([
        'tax_identifier' => 'NPWP-RAHASIA',
        'country_code' => 'ID',
    ]);

    $this->actingAs($manager)->patch(route('clients.update', $client), [
        'type' => 'organization',
        'legal_name' => 'PT RAF Diperbarui',
        'display_name' => 'RAF Diperbarui',
        'status' => 'active',
        'country_code' => 'ID',
        'tax_identifier' => '',
    ])->assertSessionHasNoErrors();

    expect($client->fresh()->legal_name)->toBe('PT RAF Diperbarui')
        ->and($client->fresh()->tax_identifier)->toBe('NPWP-RAHASIA')
        ->and(AuditLog::query()->where('event', 'client.updated')->where('subject_id', $client->getKey())->exists())->toBeTrue();
});

it('synchronizes matter members and notifies only newly added active members', function () {
    Notification::fake();

    $editor = rafUser(['matter.view', 'matter.update']);
    $existingMember = User::factory()->create();
    $newMember = User::factory()->create();
    $matter = Matter::factory()->recycle($editor)->create([
        'responsible_partner_id' => $editor->getKey(),
        'created_by' => $editor->getKey(),
    ]);
    $matter->members()->attach([
        $editor->getKey() => ['role' => 'responsible_partner'],
        $existingMember->getKey() => ['role' => 'member'],
    ]);

    $this->actingAs($editor)->patch(route('matters.update', $matter), [
        'title' => $matter->title,
        'status' => 'active',
        'priority' => 'normal',
        'confidentiality_level' => 'standard',
        'responsible_partner_id' => $editor->getKey(),
        'member_ids' => [$existingMember->getKey(), $newMember->getKey()],
    ])->assertSessionHasNoErrors();

    expect($matter->fresh()->members()->pluck('users.id')->all())
        ->toContain($editor->getKey(), $existingMember->getKey(), $newMember->getKey());
    Notification::assertSentTo($newMember, MatterAssignedNotification::class);
    Notification::assertNotSentTo($existingMember, MatterAssignedNotification::class);
});
