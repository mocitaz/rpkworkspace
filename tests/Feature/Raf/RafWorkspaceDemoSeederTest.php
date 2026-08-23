<?php

use App\Models\AuditLog;
use App\Models\Client;
use App\Models\Correspondence;
use App\Models\Document;
use App\Models\DocumentTemplate;
use App\Models\Invoice;
use App\Models\Matter;
use App\Models\Payment;
use App\Models\Permission;
use App\Models\Role;
use App\Models\SignatureRequest;
use App\Models\User;
use Database\Seeders\RafWorkspaceDemoSeeder;
use Illuminate\Support\Facades\Storage;

test('workspace demo seeder preserves auth and creates a complete professional dataset', function () {
    Storage::fake('local');
    $user = User::factory()->create(['email' => 'preserved-admin@raf.test']);
    $role = Role::query()->create(['name' => 'Administrator', 'slug' => 'administrator', 'description' => 'Preserved role']);
    $permission = Permission::query()->create(['name' => 'matter.view', 'description' => 'Preserved permission']);
    $role->permissions()->attach($permission);
    $user->roles()->attach($role);

    app(RafWorkspaceDemoSeeder::class)->run();

    expect(User::query()->whereKey($user->getKey())->exists())->toBeTrue()
        ->and(Role::query()->whereKey($role->getKey())->exists())->toBeTrue()
        ->and(Permission::query()->whereKey($permission->getKey())->exists())->toBeTrue()
        ->and(Client::query()->count())->toBe(8)
        ->and(Matter::query()->count())->toBe(12)
        ->and(Document::query()->count())->toBeGreaterThanOrEqual(34)
        ->and(DocumentTemplate::query()->count())->toBe(5)
        ->and(Invoice::query()->count())->toBe(10)
        ->and(Payment::query()->count())->toBeGreaterThanOrEqual(5)
        ->and(Correspondence::query()->count())->toBe(24)
        ->and(SignatureRequest::query()->count())->toBe(4)
        ->and(AuditLog::query()->whereNotNull('entry_hash')->count())->toBeGreaterThan(40)
        ->and(AuditLog::query()->whereNotNull('ip_address')->count())->toBe(AuditLog::query()->count());

    expect(Invoice::query()->where('status', 'paid')->whereColumn('paid_amount', 'total_amount')->exists())->toBeTrue()
        ->and(Invoice::query()->where('status', 'overdue')->where('outstanding_amount', '>', 0)->exists())->toBeTrue()
        ->and(Payment::query()->whereNotNull('reversed_at')->whereNotNull('reversal_reason')->exists())->toBeTrue()
        ->and(Payment::query()->whereNotNull('refunded_at')->whereNotNull('refund_reason')->exists())->toBeTrue();
});
