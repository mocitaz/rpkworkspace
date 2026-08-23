<?php

use App\Models\Matter;

it('allows a member and denies an outsider on a restricted matter', function () {
    $member = rafUser(['matter.view']);
    $outsider = rafUser(['matter.view']);
    $matter = Matter::factory()->create(['confidentiality_level' => 'restricted']);
    $matter->members()->attach($member, ['role' => 'member']);

    $this->actingAs($member)->get(route('matters.show', $matter))->assertSuccessful();
    $this->actingAs($outsider)->get(route('matters.show', $matter))->assertForbidden();
});

it('allows a capability holder to view all confidential matters', function () {
    $administrator = rafUser(['matter.view', 'matter.view.all']);
    $matter = Matter::factory()->create(['confidentiality_level' => 'confidential']);

    $this->actingAs($administrator)->get(route('matters.show', $matter))->assertSuccessful();
});
