<?php

use App\Models\AuditLog;
use App\Models\Client;

it('validates and audits authorized client creation', function () {
    $user = rafUser(['client.view', 'client.manage']);
    $this->actingAs($user)->post(route('clients.store'), [])->assertSessionHasErrors(['type', 'legal_name', 'display_name']);

    $this->actingAs($user)->post(route('clients.store'), [
        'type' => 'organization', 'legal_name' => 'PT Uji Integritas', 'display_name' => 'PT Uji Integritas',
    ])->assertSessionHasNoErrors();

    $client = Client::query()->firstOrFail();
    expect($client->client_number)->toStartWith('RPK-C-')
        ->and(AuditLog::query()->where('event', 'client.created')->where('subject_id', $client->getKey())->exists())->toBeTrue();
});

it('prevents a user without capabilities from creating clients', function () {
    $this->actingAs(rafUser())->post(route('clients.store'), [
        'type' => 'organization', 'legal_name' => 'Blocked', 'display_name' => 'Blocked',
    ])->assertForbidden();
});
