<?php

use App\Actions\CreateMatter;
use App\Models\Client;
use App\Models\MatterNumberSequence;

it('generates unique server-side matter numbers from a locked annual sequence', function () {
    $creator = rafUser(['matter.create']);
    $client = Client::factory()->recycle($creator)->create();
    $attributes = [
        'title' => 'Commercial Agreement Review', 'client_id' => $client->getKey(), 'status' => 'active',
        'priority' => 'normal', 'confidentiality_level' => 'standard',
        'responsible_partner_id' => $creator->getKey(), 'member_ids' => [],
    ];

    $first = app(CreateMatter::class)->handle($attributes, $creator);
    $second = app(CreateMatter::class)->handle([...$attributes, 'title' => 'Corporate Restructuring'], $creator);

    expect($first->matter_number)->toMatch('/^RAF-\d{4}-0001$/')
        ->and($second->matter_number)->toMatch('/^RAF-\d{4}-0002$/')
        ->and($first->matter_number)->not->toBe($second->matter_number)
        ->and(MatterNumberSequence::query()->value('next_value'))->toBe(3);
});
