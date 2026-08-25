<?php

use App\Models\Client;
use App\Models\Contact;
use App\Models\Document;
use App\Models\Invoice;
use App\Models\Matter;
use App\Models\Role;
use App\Models\User;

it('wipes operational data while preserving users, roles, and real client RPK-C-2026-YNGZAW', function () {
    // 1. Arrange: Create Users & Roles
    $user = rafUser(['admin.users.manage']);
    $role = Role::query()->firstOrCreate(['name' => 'Partner', 'slug' => 'partner']);
    $user->roles()->sync([$role->getKey()]);

    // 2. Arrange: Create Real Client (PT KKG) & Dummy Client
    $realClient = Client::factory()->create([
        'client_number' => 'RPK-C-2026-YNGZAW',
        'legal_name' => 'PT KEMBANG KEMBAR GRUP',
        'display_name' => 'PT KKG',
        'created_by' => $user->id,
    ]);
    $realContact = Contact::factory()->for($realClient)->create(['created_by' => $user->id]);

    $dummyClient = Client::factory()->create(['client_number' => 'RPK-C-DUMMY-999']);
    $dummyContact = Contact::factory()->for($dummyClient)->create(['created_by' => $user->id]);
    $dummyMatter = Matter::factory()->for($dummyClient)->create();
    $dummyInvoice = Invoice::factory()->for($dummyClient)->for($dummyMatter)->create();
    $dummyDocument = Document::factory()->for($dummyMatter)->create(['created_by' => $user->id]);

    expect(User::query()->count())->toBeGreaterThan(0)
        ->and(Client::query()->count())->toBe(2)
        ->and(Contact::query()->count())->toBe(2)
        ->and(Matter::query()->count())->toBe(1)
        ->and(Invoice::query()->count())->toBe(1)
        ->and(Document::query()->count())->toBe(1);

    // 3. Act: Execute Wipe Command
    $this->artisan('workspace:wipe-data --force')
        ->assertSuccessful();

    // 4. Assert: Dummy data wiped, Real Client (PT KKG) & Contact preserved, Users & Roles intact
    expect(Client::query()->count())->toBe(1)
        ->and(Client::query()->first()->client_number)->toBe('RPK-C-2026-YNGZAW')
        ->and(Contact::query()->count())->toBe(1)
        ->and(Contact::query()->first()->client_id)->toBe($realClient->id)
        ->and(Matter::query()->count())->toBe(0)
        ->and(Invoice::query()->count())->toBe(0)
        ->and(Document::query()->count())->toBe(0)
        ->and(User::query()->whereKey($user->id)->exists())->toBeTrue()
        ->and($user->fresh()->roles()->pluck('roles.id')->all())->toContain($role->getKey());
});
