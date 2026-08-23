<?php

use Inertia\Testing\AssertableInertia as Assert;

test('renders finance workspace for an authorized user', function () {
    $user = rafUser(['matter.view', 'billing.view']);
    $user->forceFill(['email_verified_at' => now()])->save();

    $response = $this->actingAs($user)->get(route('finance.index'));

    $response->assertSuccessful()->assertInertia(fn (Assert $page) => $page->component('finance/index'));
});
