<?php

namespace App\Actions;

use App\Models\Client;
use App\Models\ConflictCheck;
use App\Models\Contact;
use App\Models\Matter;
use App\Models\MatterParty;
use App\Models\User;
use App\Services\AuditService;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;

class RunConflictCheck
{
    public function __construct(private AuditService $audit) {}

    /** @param list<string> $names */
    public function handle(User $actor, array $names, ?Client $client = null, ?Matter $matter = null): ConflictCheck
    {
        $searchedNames = collect($names)->map(fn (string $name) => str($name)->squish()->toString())->filter()->unique()->values();

        if ($searchedNames->isEmpty()) {
            throw new \DomainException('Conflict check memerlukan setidaknya satu nama pihak.');
        }

        $matches = $searchedNames->flatMap(fn (string $name) => $this->findMatches($name))->values();
        $status = $matches->contains(fn (array $match) => $match['risk'] === 'blocked') ? 'blocked' : ($matches->isEmpty() ? 'clear' : 'potential_match');

        $check = ConflictCheck::query()->create([
            'client_id' => $client?->getKey(),
            'matter_id' => $matter?->getKey(),
            'subject_name' => $searchedNames->first(),
            'searched_names' => $searchedNames->all(),
            'matches' => $matches->all(),
            'status' => $status,
            'expires_at' => now()->addDays(30),
            'requested_by' => $actor->getKey(),
        ]);

        $this->audit->record($check, 'conflict.checked', [
            'match_count' => $matches->count(),
            'status' => $status,
            'searched_names' => $searchedNames->all(),
            'expires_at' => $check->expires_at !== null ? Carbon::parse($check->expires_at)->toIso8601String() : null,
        ], $actor);

        return $check;
    }

    /** @return Collection<int, array{type: string, id: string, name: string, risk: string}> */
    private function findMatches(string $name): Collection
    {
        $like = '%'.$name.'%';

        return collect()
            ->concat(Client::query()->where('display_name', 'like', $like)->limit(20)->get()->map(fn (Client $client) => ['type' => 'client', 'id' => (string) $client->getKey(), 'name' => $client->display_name, 'risk' => 'potential_match']))
            ->concat(Contact::query()->where(fn ($query) => $query->where('first_name', 'like', $like)->orWhere('last_name', 'like', $like)->orWhere('organization_name', 'like', $like))->limit(20)->get()->map(fn (Contact $contact) => ['type' => 'contact', 'id' => (string) $contact->getKey(), 'name' => $contact->full_name, 'risk' => 'potential_match']))
            ->concat(Matter::query()->where('title', 'like', $like)->limit(20)->get()->map(fn (Matter $matter) => ['type' => 'matter', 'id' => (string) $matter->getKey(), 'name' => $matter->title, 'risk' => 'potential_match']))
            ->concat(MatterParty::query()->where(fn ($query) => $query->where('name', 'like', $like)->orWhere('organization_name', 'like', $like))->limit(20)->get()->map(fn (MatterParty $party) => ['type' => 'matter_party', 'id' => (string) $party->getKey(), 'name' => $party->organization_name ?? $party->name, 'risk' => in_array($party->party_type, ['opposing_party', 'opponent'], true) ? 'blocked' : 'potential_match']));
    }
}
