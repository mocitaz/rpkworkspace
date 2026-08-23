<?php

use App\Models\AuditLog;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\Facades\Notification;

it('invites a user, assigns roles, and dispatches a password setup notification', function () {
    Notification::fake();

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
        ->and($invited->roles()->pluck('roles.id')->all())->toContain($associate->getKey())
        ->and(AuditLog::query()->where('event', 'user.invited')->where('subject_id', $invited->getKey())->exists())->toBeTrue();
    Notification::assertSentTo($invited, ResetPassword::class);
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

it('prevents an administrator from disabling themselves', function () {
    $administrator = rafUser(['admin.users.manage']);
    $administratorRole = Role::query()->create(['name' => 'Administrator', 'slug' => 'administrator']);
    $administratorRole->permissions()->sync([Permission::query()->firstOrCreate(['name' => 'admin.users.manage'])->getKey()]);
    $administrator->roles()->sync([$administratorRole->getKey()]);

    $this->actingAs($administrator)->put(route('admin.users.update', $administrator), [
        'name' => $administrator->name,
        'email' => $administrator->email,
        'is_active' => false,
        'role_ids' => [$administratorRole->getKey()],
    ])->assertStatus(422);
});
