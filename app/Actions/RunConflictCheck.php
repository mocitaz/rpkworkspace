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
use Illuminate\Support\Str;

class RunConflictCheck
{
    public function __construct(private AuditService $audit) {}

    /** @param list<string|null> $names */
    public function handle(User $actor, array $names, ?Client $client = null, ?Matter $matter = null): ConflictCheck
    {
        $searchedNames = collect($names)
            ->filter(fn ($name) => filled($name))
            ->map(fn ($name) => str((string) $name)->squish()->toString())
            ->filter()
            ->unique()
            ->values();

        if ($searchedNames->isEmpty()) {
            throw new \DomainException('Conflict check memerlukan setidaknya satu nama pihak yang sah.');
        }

        $matches = $searchedNames->flatMap(fn (string $name) => $this->findMatches($name))
            ->unique(fn (array $match): string => $match['type'].':'.$match['id'])
            ->values();
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
        $cleanName = $this->normalizeName($name);
        $tokens = collect(explode(' ', $cleanName))->filter(fn (string $token): bool => mb_strlen($token) >= 3)->values();

        if ($cleanName === '' || $tokens->isEmpty()) {
            return collect();
        }

        return collect()
            ->concat(Client::query()->where(function ($query) use ($tokens): void {
                $tokens->each(fn (string $token) => $query->orWhereRaw('LOWER(display_name) LIKE ?', ['%'.$token.'%']));
            })->limit(50)->get()->map(function (Client $client) use ($cleanName) {
                $percent = $this->similarity($cleanName, $client->display_name);

                return [
                    'type' => 'client',
                    'id' => (string) $client->getKey(),
                    'name' => $client->display_name,
                    'risk' => 'potential_match',
                    'similarity' => (int) round($percent),
                    'details' => 'Klien Aktif/Eksisting RPK Law Firm (No. Klien: '.$client->client_number.')',
                ];
            })->filter(fn (array $match): bool => $match['similarity'] >= 70))
            ->concat(Contact::query()->where(function ($query) use ($tokens): void {
                $tokens->each(fn (string $token) => $query->orWhere(function ($candidate) use ($token): void {
                    $candidate->whereRaw('LOWER(first_name) LIKE ?', ['%'.$token.'%'])
                        ->orWhereRaw('LOWER(last_name) LIKE ?', ['%'.$token.'%'])
                        ->orWhereRaw('LOWER(organization_name) LIKE ?', ['%'.$token.'%']);
                }));
            })->limit(50)->get()->map(function (Contact $contact) use ($cleanName) {
                $target = $contact->organization_name ?: $contact->full_name;
                $percent = max($this->similarity($cleanName, $target), $this->similarity($cleanName, $contact->full_name));

                return [
                    'type' => 'contact',
                    'id' => (string) $contact->getKey(),
                    'name' => $target,
                    'risk' => 'potential_match',
                    'similarity' => (int) round($percent),
                    'details' => 'Kontak Pribadi / Direksi / Afiliasi Perusahaan ('.($contact->organization_name ?? 'Individu').')',
                ];
            })->filter(fn (array $match): bool => $match['similarity'] >= 70))
            ->concat(Matter::query()->where(function ($query) use ($tokens): void {
                $tokens->each(fn (string $token) => $query->orWhereRaw('LOWER(title) LIKE ?', ['%'.$token.'%']));
            })->limit(50)->get()->map(function (Matter $matter) use ($cleanName) {
                $percent = $this->similarity($cleanName, $matter->title);

                return [
                    'type' => 'matter',
                    'id' => (string) $matter->getKey(),
                    'name' => $matter->title,
                    'risk' => 'potential_match',
                    'similarity' => (int) round($percent),
                    'details' => 'Judul Perkara Aktif: '.$matter->matter_number,
                ];
            })->filter(fn (array $match): bool => $match['similarity'] >= 70))
            ->concat(MatterParty::query()->with('matter:id,matter_number,title')->where(function ($query) use ($tokens): void {
                $tokens->each(fn (string $token) => $query->orWhere(function ($candidate) use ($token): void {
                    $candidate->whereRaw('LOWER(name) LIKE ?', ['%'.$token.'%'])
                        ->orWhereRaw('LOWER(organization_name) LIKE ?', ['%'.$token.'%']);
                }));
            })->limit(50)->get()->map(function (MatterParty $party) use ($cleanName) {
                $target = $party->organization_name ?? $party->name;
                $percent = $this->similarity($cleanName, $target);
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
            })->filter(fn (array $match): bool => $match['similarity'] >= 70));
    }

    private function similarity(string $normalizedNeedle, string $candidate): int
    {
        similar_text($normalizedNeedle, $this->normalizeName($candidate), $percent);

        return (int) round($percent);
    }

    private function normalizeName(string $name): string
    {
        $normalized = Str::lower(Str::ascii($name));
        $normalized = preg_replace('/[^a-z0-9]+/', ' ', $normalized) ?? '';
        $legalForms = 'pt|perseroan terbatas|cv|commanditaire vennootschap|tbk|inc|incorporated|ltd|limited|llc|corp|corporation|co|company|plc|pte|gmbh|bhd|yayasan|firma';
        $normalized = preg_replace('/\\b(?:'.$legalForms.')\\b/', ' ', $normalized) ?? '';

        return Str::squish($normalized);
    }
}
