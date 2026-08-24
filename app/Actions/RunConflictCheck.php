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

    /** @return Collection<int, array{type: string, id: string, name: string, risk: string, similarity: int, details: string}> */
    private function findMatches(string $name): Collection
    {
        $like = '%'.$name.'%';
        $cleanName = strtolower(trim($name));

        return collect()
            ->concat(Client::query()->where('display_name', 'like', $like)->limit(20)->get()->map(function (Client $client) use ($cleanName) {
                similar_text($cleanName, strtolower($client->display_name), $percent);

                return [
                    'type' => 'client',
                    'id' => (string) $client->getKey(),
                    'name' => $client->display_name,
                    'risk' => 'potential_match',
                    'similarity' => (int) round($percent),
                    'details' => 'Klien Aktif/Eksisting RPK Law Firm (No. Klien: '.$client->client_number.')',
                ];
            }))
            ->concat(Contact::query()->where(fn ($query) => $query->where('first_name', 'like', $like)->orWhere('last_name', 'like', $like)->orWhere('organization_name', 'like', $like))->limit(20)->get()->map(function (Contact $contact) use ($cleanName) {
                similar_text($cleanName, strtolower($contact->full_name), $percent);

                return [
                    'type' => 'contact',
                    'id' => (string) $contact->getKey(),
                    'name' => $contact->full_name,
                    'risk' => 'potential_match',
                    'similarity' => (int) round($percent),
                    'details' => 'Kontak Pribadi / Direksi / Afiliasi Perusahaan ('.($contact->organization_name ?? 'Individu').')',
                ];
            }))
            ->concat(Matter::query()->where('title', 'like', $like)->limit(20)->get()->map(function (Matter $matter) use ($cleanName) {
                similar_text($cleanName, strtolower($matter->title), $percent);

                return [
                    'type' => 'matter',
                    'id' => (string) $matter->getKey(),
                    'name' => $matter->title,
                    'risk' => 'potential_match',
                    'similarity' => (int) round($percent),
                    'details' => 'Judul Perkara Aktif: '.$matter->matter_number,
                ];
            }))
            ->concat(MatterParty::query()->with('matter:id,matter_number,title')->where(fn ($query) => $query->where('name', 'like', $like)->orWhere('organization_name', 'like', $like))->limit(20)->get()->map(function (MatterParty $party) use ($cleanName) {
                $target = $party->organization_name ?? $party->name;
                similar_text($cleanName, strtolower($target), $percent);
                $isOpposing = in_array($party->party_type, ['opposing_party', 'opponent', 'opposing_counsel'], true);
                $roleLabel = match ($party->party_type) {
                    'opposing_party', 'opponent' => 'PIHAK LAWAN (ADVERSE PARTY)',
                    'opposing_counsel' => 'KUASA HUKUM LAWAN',
                    'witness' => 'Saksi Fakta',
                    'expert_witness' => 'Saksi Ahli',
                    default => 'Pihak Terkait Perkara',
                };

                return [
                    'type' => 'matter_party',
                    'id' => (string) $party->getKey(),
                    'name' => $target,
                    'risk' => $isOpposing ? 'blocked' : 'potential_match',
                    'similarity' => (int) round($percent),
                    'details' => $roleLabel.' pada Perkara: '.($party->matter->title ?? '-').' ('.($party->matter->matter_number ?? '-').')',
                ];
            }));
    }
}
