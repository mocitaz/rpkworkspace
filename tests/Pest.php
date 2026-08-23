<?php

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Tests\BrowserTestCase;
use Tests\TestCase;

uses(TestCase::class, LazilyRefreshDatabase::class)->in('Feature/Raf');
uses(BrowserTestCase::class, LazilyRefreshDatabase::class)->in('Browser');

/** @param list<string> $permissions */
function rafUser(array $permissions = []): User
{
    $user = User::factory()->create();
    $role = Role::query()->create(['name' => 'Test Role '.uniqid(), 'slug' => 'test-role-'.uniqid()]);
    $permissionModels = collect($permissions)->map(fn (string $name) => Permission::query()->firstOrCreate(['name' => $name]));
    $role->permissions()->sync($permissionModels->pluck('id'));
    $user->roles()->attach($role);

    return $user;
}
