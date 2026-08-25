<?php

use App\Models\Client;
use App\Models\Document;
use App\Models\Invoice;
use App\Models\Matter;
use App\Models\Role;
use App\Models\User;

it('wipes operational data while preserving users, roles, and auth structure', function () {
    // 1. Arrange: Create Users & Roles
    $user = rafUser(['admin.users.manage']);
    $role = Role::query()->firstOrCreate(['name' => 'Partner', 'slug' => 'partner']);
    $user->roles()->sync([$role->getKey()]);

    // 2. Arrange: Create Operational Data
    $client = Client::factory()->create();
    $matter = Matter::factory()->for($client)->create();
    $invoice = Invoice::factory()->for($client)->for($matter)->create();
    $document = Document::factory()->for($matter)->create(['created_by' => $user->id]);

    expect(User::query()->count())->toBeGreaterThan(0)
        ->and(Client::query()->count())->toBe(1)
        ->and(Matter::query()->count())->toBe(1)
        ->and(Invoice::query()->count())->toBe(1)
        ->and(Document::query()->count())->toBe(1);

    // 3. Act: Execute Wipe Command
    $this->artisan('workspace:wipe-data --force')
        ->assertSuccessful();

    // 4. Assert: Operational data is 0, but users and roles remain intact
    expect(Client::query()->count())->toBe(0)
        ->and(Matter::query()->count())->toBe(0)
        ->and(Invoice::query()->count())->toBe(0)
        ->and(Document::query()->count())->toBe(0)
        ->and(User::query()->whereKey($user->id)->exists())->toBeTrue()
        ->and($user->fresh()->roles()->pluck('roles.id')->all())->toContain($role->getKey());
});
