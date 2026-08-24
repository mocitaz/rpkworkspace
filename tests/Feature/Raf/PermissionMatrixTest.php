<?php

use App\Models\Matter;
use Inertia\Testing\AssertableInertia as Assert;

test('finance, governance, and audit pages enforce their permission matrix', function (string $route, array $deniedPermissions, array $allowedPermissions) {
    $denied = rafUser($deniedPermissions);
    $this->actingAs($denied)->get(route($route))->assertForbidden();

    $allowed = rafUser($allowedPermissions);
    Matter::factory()->recycle($allowed)->create(['responsible_partner_id' => $allowed->getKey()]);
    $this->actingAs($allowed)->get(route($route))->assertSuccessful()->assertInertia(fn (Assert $page) => $page->component(match ($route) {
        'finance.index' => 'finance/index',
        'governance.index' => 'governance/index',
        default => 'admin/audit/index',
    }));
})->with([
    'finance' => ['finance.index', ['matter.view'], ['matter.view', 'billing.view']],
    'governance' => ['governance.index', ['matter.view'], ['matter.view', 'correspondence.view']],
    'audit' => ['admin.audit.index', [], ['audit.view']],
]);
