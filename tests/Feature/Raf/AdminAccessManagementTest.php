<?php

use App\Models\AuditLog;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;

it('invites a user, assigns roles, and sets default password to password', function () {
    $administrator = rafUser(['admin.users.manage']);
    $associate = Role::query()->create(['name' => 'Associate', 'slug' => 'associate']);

    $this->actingAs($administrator)->post(route('admin.users.store'), [
        'name' => 'Ayu Associate',
        'email' => 'ayu@example.test',
        'position_title' => 'Associate',
        'role_ids' => [$associate->getKey()],
    ])->assertSessionHasNoErrors();

    $invited = User::query()->where('email', 'ayu@example.test')->firstOrFail();
    expect($invited->is_active)->toBeTrue()
        ->and(Hash::check('password', $invited->password))->toBeTrue()
        ->and($invited->roles()->pluck('roles.id')->all())->toContain($associate->getKey())
        ->and(AuditLog::query()->where('event', 'user.invited')->where('subject_id', $invited->getKey())->exists())->toBeTrue();
});

it('lets an administrator update role permissions while retaining administration access', function () {
    $administrator = rafUser(['admin.users.manage']);
    $role = Role::query()->create(['name' => 'Administrator', 'slug' => 'administrator']);
    Permission::query()->firstOrCreate(['name' => 'admin.users.manage']);
    $auditPermission = Permission::query()->firstOrCreate(['name' => 'audit.view']);

    $this->actingAs($administrator)->put(route('admin.roles.update', $role), [
        'permission_ids' => [$auditPermission->getKey()],
    ])->assertSessionHasNoErrors();

    expect($role->fresh()->permissions()->pluck('permissions.name')->all())
        ->toContain('audit.view', 'admin.users.manage');
});

it('allows an administrator to create a user with a manual password without sending reset link', function () {
    Notification::fake();

    $administrator = rafUser(['admin.users.manage']);
    $associate = Role::query()->create(['name' => 'Staff Associate', 'slug' => 'staff-associate']);

    $this->actingAs($administrator)->post(route('admin.users.store'), [
        'name' => 'Budi Staff',
        'email' => 'budi@example.test',
        'password' => 'Secret12345!',
        'position_title' => 'Associate',
        'role_ids' => [$associate->getKey()],
    ])->assertSessionHasNoErrors();

    $user = User::query()->where('email', 'budi@example.test')->firstOrFail();
    expect($user->is_active)->toBeTrue()
        ->and(Hash::check('Secret12345!', $user->password))->toBeTrue();

    Notification::assertNothingSent();

    // Now update the password
    $this->actingAs($administrator)->put(route('admin.users.update', $user), [
        'name' => 'Budi Staff Updated',
        'email' => 'budi@example.test',
        'position_title' => 'Associate',
        'password' => 'NewPassword999!',
        'is_active' => true,
        'role_ids' => [$associate->getKey()],
    ])->assertSessionHasNoErrors();

    expect(Hash::check('NewPassword999!', $user->fresh()->password))->toBeTrue();
});

it('allows an administrator to delete a user', function () {
    $administrator = rafUser(['admin.users.manage']);
    $userToDelete = User::factory()->create(['name' => 'Staf Akan Dihapus', 'email' => 'hapus@example.test']);

    $this->actingAs($administrator)->delete(route('admin.users.destroy', $userToDelete))
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    expect(User::query()->whereKey($userToDelete->getKey())->exists())->toBeFalse()
        ->and(AuditLog::query()->where('event', 'user.deleted')->where('subject_id', $userToDelete->getKey())->exists())->toBeTrue();
});

it('prevents an administrator from deleting themselves', function () {
    $administrator = rafUser(['admin.users.manage']);

    $this->actingAs($administrator)->delete(route('admin.users.destroy', $administrator))
        ->assertStatus(422);

    expect(User::query()->whereKey($administrator->getKey())->exists())->toBeTrue();
});

it('supports creating and updating users with staff hr fields and searching by them', function () {
    $administrator = rafUser(['admin.users.manage']);
    $role = Role::query()->create(['name' => 'Senior Associate', 'slug' => 'senior-associate']);

    $this->actingAs($administrator)->post(route('admin.users.store'), [
        'name' => 'Citra Dewi, S.H.',
        'email' => 'citra@example.test',
        'position_title' => 'Senior Associate',
        'employee_code' => 'RPK-2026-077',
        'department' => 'Litigasi & Arbitrase',
        'employment_type' => 'Tetap',
        'work_mode' => 'Hybrid',
        'role_ids' => [$role->getKey()],
    ])->assertSessionHasNoErrors();

    $user = User::query()->where('email', 'citra@example.test')->firstOrFail();
    expect($user->employee_code)->toBe('RPK-2026-077')
        ->and($user->department)->toBe('Litigasi & Arbitrase')
        ->and($user->work_mode)->toBe('Hybrid');

    // Update HR fields
    $this->actingAs($administrator)->put(route('admin.users.update', $user), [
        'name' => 'Citra Dewi, S.H., LL.M.',
        'email' => 'citra@example.test',
        'position_title' => 'Junior Partner',
        'employee_code' => 'RPK-2026-077',
        'department' => 'Hukum Korporasi',
        'employment_type' => 'Partner',
        'work_mode' => 'WFO',
        'is_active' => true,
        'role_ids' => [$role->getKey()],
    ])->assertSessionHasNoErrors();

    $updated = $user->fresh();
    expect($updated->name)->toBe('Citra Dewi, S.H., LL.M.')
        ->and($updated->position_title)->toBe('Junior Partner')
        ->and($updated->department)->toBe('Hukum Korporasi')
        ->and($updated->work_mode)->toBe('WFO');

    // Search by employee code
    $this->actingAs($administrator)->get(route('admin.users.index', ['search' => 'RPK-2026-077']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('admin/users/index')
            ->has('users.data', 1)
            ->where('users.data.0.name', 'Citra Dewi, S.H., LL.M.')
        );
});

it('can render dedicated admin.users.create and admin.users.edit pages', function () {
    $administrator = rafUser(['admin.users.manage']);
    $role = Role::query()->create(['name' => 'Associate Counsel', 'slug' => 'associate-counsel']);
    $staff = User::factory()->create();
    $staff->roles()->sync([$role->getKey() => ['assigned_by' => $administrator->getKey()]]);

    $this->actingAs($administrator)->get(route('admin.users.create'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('admin/users/create')
            ->has('roles')
            ->has('departments')
            ->has('positions')
            ->has('defaultEmployeeCode')
        );

    $this->actingAs($administrator)->get(route('admin.users.edit', $staff))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('admin/users/edit')
            ->has('staff')
            ->has('roles')
            ->has('departments')
        );
});
