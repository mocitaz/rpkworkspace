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

    /**
     * In-memory fast conflict scan without persisting to database.
     *
     * @param  list<string|null>  $names
     * @return array{searched_names: list<string>, status: string, matches: list<array<string, mixed>>, match_count: int}
     */
    public function scan(array $names, ?Client $client = null, ?Matter $matter = null): array
    {
        $searchedNames = collect($names)
            ->filter(fn ($name) => filled($name))
            ->map(fn ($name) => str((string) $name)->squish()->toString())
            ->filter()
            ->unique()
            ->values();

        if ($searchedNames->isEmpty()) {
            return [
                'searched_names' => [],
                'status' => 'clear',
                'matches' => [],
                'match_count' => 0,
            ];
        }

        $matches = $searchedNames->flatMap(fn (string $name) => $this->findMatches($name))
            ->unique(fn (array $match): string => $match['type'].':'.$match['id'])
            ->sortByDesc('similarity')
            ->values();

        $status = $matches->contains(fn (array $match) => $match['risk'] === 'blocked')
            ? 'blocked'
            : ($matches->isEmpty() ? 'clear' : 'potential_match');

        return [
            'searched_names' => $searchedNames->all(),
            'status' => $status,
            'matches' => $matches->all(),
            'match_count' => $matches->count(),
        ];
    }

    /**
     * Persist a full Conflict Check with immutable audit logging.
     *
     * @param  list<string|null>  $names
     */
    public function handle(User $actor, array $names, ?Client $client = null, ?Matter $matter = null): ConflictCheck
    {
        $scanResult = $this->scan($names, $client, $matter);

        if (empty($scanResult['searched_names'])) {
            throw new \DomainException('Conflict check memerlukan setidaknya satu nama pihak yang sah.');
        }

        $check = ConflictCheck::query()->create([
            'client_id' => $client?->getKey(),
            'matter_id' => $matter?->getKey(),
            'subject_name' => $scanResult['searched_names'][0],
            'searched_names' => $scanResult['searched_names'],
            'matches' => $scanResult['matches'],
            'status' => $scanResult['status'],
            'expires_at' => now()->addDays(30),
            'requested_by' => $actor->getKey(),
        ]);

        $this->audit->record($check, 'conflict.checked', [
            'match_count' => $scanResult['match_count'],
            'status' => $scanResult['status'],
            'searched_names' => $scanResult['searched_names'],
            'expires_at' => $check->expires_at !== null ? Carbon::parse($check->expires_at)->toIso8601String() : null,
        ], $actor);

        return $check;
    }

    /**
     * @return Collection<int, array<string, mixed>>
     */
    private function findMatches(string $name): Collection
    {
        $cleanName = $this->normalizeName($name);
        $tokens = collect(explode(' ', $cleanName))->filter(fn (string $token): bool => mb_strlen($token) >= 3)->values();

        if ($cleanName === '' || $tokens->isEmpty()) {
            return collect();
        }

        return collect()
            // 1. Check Clients
            ->concat(Client::query()->withCount(['matters' => fn ($q) => $q->whereNull('closed_at')->whereNull('archived_at')])->where(function ($query) use ($tokens, $name): void {
                $tokens->each(fn (string $token) => $query->orWhereRaw('LOWER(display_name) LIKE ?', ['%'.$token.'%']));
                $digits = preg_replace('/\D/', '', $name);
                if (mb_strlen($digits) >= 6) {
                    $query->orWhere('tax_identifier', 'like', "%{$digits}%")
                        ->orWhere('registration_identifier', 'like', "%{$digits}%");
                }
            })->limit(50)->get()->map(function (Client $client) use ($cleanName, $name) {
                $percent = $this->similarity($cleanName, $client->display_name);
                $hasActiveMatters = ($client->matters_count ?? 0) > 0;
                $isBlocked = $hasActiveMatters;

                return [
                    'type' => 'client',
                    'id' => (string) $client->getKey(),
                    'name' => $client->display_name,
                    'searched_query' => $name,
                    'risk' => $isBlocked ? 'blocked' : 'potential_match',
                    'similarity' => (int) round($percent),
                    'role_label' => $hasActiveMatters ? 'KLIEN AKTIF FIRMA' : 'MANTAN KLIEN',
                    'client_number' => $client->client_number,
                    'details' => $hasActiveMatters
                        ? "Klien aktif RPK Law Firm dengan {$client->matters_count} perkara berjalan (No. Klien: {$client->client_number})."
                        : "Klien terdaftar RPK Law Firm (No. Klien: {$client->client_number}).",
                ];
            })->filter(fn (array $match): bool => $match['similarity'] >= 70))

            // 2. Check Matter Parties
            ->concat(MatterParty::query()->with([
                'matter:id,matter_number,title,status,responsible_partner_id',
                'matter.responsiblePartner:id,name',
            ])->where(function ($query) use ($tokens): void {
                $tokens->each(fn (string $token) => $query->orWhere(function ($candidate) use ($token): void {
                    $candidate->whereRaw('LOWER(name) LIKE ?', ['%'.$token.'%'])
                        ->orWhereRaw('LOWER(organization_name) LIKE ?', ['%'.$token.'%']);
                }));
            })->limit(50)->get()->map(function (MatterParty $party) use ($cleanName, $name) {
                $target = $party->organization_name ?? $party->name;
                $percent = $this->similarity($cleanName, $target);
                $isOpposing = in_array($party->party_type, ['opposing_party', 'opponent', 'opposing_counsel'], true);
                $roleLabel = match ($party->party_type) {
                    'opposing_party', 'opponent' => 'PIHAK LAWAN (ADVERSE PARTY)',
                    'opposing_counsel' => 'KUASA HUKUM LAWAN',
                    'witness' => 'Saksi Fakta',
                    'expert_witness' => 'Saksi Ahli',
                    'related_party', 'third_party' => 'Pihak Terafiliasi / Pihak Ketiga',
                    default => 'Pihak Terkait Perkara',
                };

                $matterTitle = $party->matter->title ?? '-';
                $matterNumber = $party->matter->matter_number ?? '-';
                $partnerName = $party->matter->responsiblePartner->name ?? null;

                return [
                    'type' => 'matter_party',
                    'id' => (string) $party->getKey(),
                    'name' => $target,
                    'searched_query' => $name,
                    'risk' => $isOpposing ? 'blocked' : 'potential_match',
                    'similarity' => (int) round($percent),
                    'role_label' => $roleLabel,
                    'matter_id' => $party->matter_id,
                    'matter_number' => $matterNumber,
                    'matter_title' => $matterTitle,
                    'matter_status' => $party->matter->status ?? null,
                    'responsible_partner' => $partnerName,
                    'details' => "{$roleLabel} pada Perkara: {$matterTitle} ({$matterNumber})".($partnerName ? " • Partner: {$partnerName}" : ''),
                ];
            })->filter(fn (array $match): bool => $match['similarity'] >= 70))

            // 3. Check Contacts
            ->concat(Contact::query()->where(function ($query) use ($tokens): void {
                $tokens->each(fn (string $token) => $query->orWhere(function ($candidate) use ($token): void {
                    $candidate->whereRaw('LOWER(first_name) LIKE ?', ['%'.$token.'%'])
                        ->orWhereRaw('LOWER(last_name) LIKE ?', ['%'.$token.'%'])
                        ->orWhereRaw('LOWER(organization_name) LIKE ?', ['%'.$token.'%']);
                }));
            })->limit(50)->get()->map(function (Contact $contact) use ($cleanName, $name) {
                $target = $contact->organization_name ?: $contact->full_name;
                $percent = max($this->similarity($cleanName, $target), $this->similarity($cleanName, $contact->full_name));

                return [
                    'type' => 'contact',
                    'id' => (string) $contact->getKey(),
                    'name' => $target,
                    'searched_query' => $name,
                    'risk' => 'potential_match',
                    'similarity' => (int) round($percent),
                    'role_label' => 'KONTAK / DIREKSI',
                    'details' => 'Kontak Pribadi / Direksi / Afiliasi Perusahaan ('.($contact->organization_name ?? 'Individu').')',
                ];
            })->filter(fn (array $match): bool => $match['similarity'] >= 70))

            // 4. Check Matter Titles
            ->concat(Matter::query()->with('responsiblePartner:id,name')->where(function ($query) use ($tokens): void {
                $tokens->each(fn (string $token) => $query->orWhereRaw('LOWER(title) LIKE ?', ['%'.$token.'%']));
            })->limit(50)->get()->map(function (Matter $matter) use ($cleanName, $name) {
                $percent = $this->similarity($cleanName, $matter->title);

                return [
                    'type' => 'matter',
                    'id' => (string) $matter->getKey(),
                    'name' => $matter->title,
                    'searched_query' => $name,
                    'risk' => 'potential_match',
                    'similarity' => (int) round($percent),
                    'role_label' => 'PERKARA TERDAFTAR',
                    'matter_id' => $matter->getKey(),
                    'matter_number' => $matter->matter_number,
                    'matter_title' => $matter->title,
                    'matter_status' => $matter->status,
                    'responsible_partner' => $matter->responsiblePartner->name ?? null,
                    'details' => "Judul Perkara Aktif: {$matter->matter_number} - {$matter->title}",
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
        $legalForms = 'pt|perseroan terbatas|cv|commanditaire vennootschap|tbk|inc|incorporated|ltd|limited|llc|corp|corporation|co|company|plc|pte|gmbh|bhd|yayasan|firma|koperasi|perum|persero';
        $normalized = preg_replace('/\\b(?:'.$legalForms.')\\b/', ' ', $normalized) ?? '';

        return Str::squish($normalized);
    }
}
