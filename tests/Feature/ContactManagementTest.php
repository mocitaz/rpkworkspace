<?php

use App\Models\Contact;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Tests\TestCase;

uses(TestCase::class, LazilyRefreshDatabase::class);

test('authorized user can create contact with selected avatar', function () {
    $user = rafUser(['contact.view', 'contact.manage']);

    $response = $this->actingAs($user)->post(route('contacts.store'), [
        'first_name' => 'Budi',
        'last_name' => 'Santoso',
        'job_title' => 'Direktur Legal',
        'organization_name' => 'PT Sumber Makmur',
        'email' => 'budi@makmur.co.id',
        'phone' => '0215551234',
        'mobile' => '08123456789',
        'avatar_url' => '/images/avatars/avatar-7.svg',
        'notes' => 'Kontak utama urusan perizinan',
    ]);

    $response->assertRedirect();

    $this->assertDatabaseHas('contacts', [
        'first_name' => 'Budi',
        'last_name' => 'Santoso',
        'email' => 'budi@makmur.co.id',
        'avatar_url' => '/images/avatars/avatar-7.svg',
        'created_by' => $user->id,
    ]);
});

test('authorized user can update contact avatar and details', function () {
    $user = rafUser(['contact.view', 'contact.manage']);

    $contact = Contact::factory()->create([
        'first_name' => 'Rina',
        'last_name' => 'Wijaya',
        'avatar_url' => '/images/avatars/avatar-2.svg',
        'created_by' => $user->id,
    ]);

    $response = $this->actingAs($user)->put(route('contacts.update', $contact), [
        'first_name' => 'Rina',
        'last_name' => 'Wijaya Kusuma',
        'avatar_url' => '/images/avatars/avatar-12.svg',
        'email' => 'rina.wijaya@example.com',
    ]);

    $response->assertRedirect();

    $contact->refresh();
    expect($contact->last_name)->toBe('Wijaya Kusuma')
        ->and($contact->avatar_url)->toBe('/images/avatars/avatar-12.svg');
});
