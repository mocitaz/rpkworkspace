<?php

namespace App\Services;

use App\Models\Client;
use App\Models\Contact;
use App\Models\Document;
use App\Models\Matter;
use App\Models\User;

class GlobalSearchService
{
    /** @return array<int, array{type: string, id: mixed, title: string, subtitle: string|null, url: string}> */
    public function search(User $user, string $term, int $limit = 8): array
    {
        $term = trim($term);

        if (mb_strlen($term) < 2) {
            return [];
        }

        $matters = Matter::query()->visibleTo($user)
            ->where(fn ($query) => $query->where('matter_number', 'like', "%{$term}%")->orWhere('title', 'like', "%{$term}%"))
            ->limit($limit)->get()->map(fn (Matter $matter) => [
                'type' => 'matter', 'id' => $matter->getKey(), 'title' => $matter->matter_number,
                'subtitle' => $matter->title, 'url' => route('matters.show', $matter),
            ]);

        $clients = $user->hasPermission('client.view') ? Client::query()
            ->where(fn ($query) => $query->where('legal_name', 'like', "%{$term}%")->orWhere('display_name', 'like', "%{$term}%"))
            ->limit($limit)->get()->map(fn (Client $client) => [
                'type' => 'client', 'id' => $client->getKey(), 'title' => $client->display_name,
                'subtitle' => $client->client_number, 'url' => route('clients.show', $client),
            ]) : collect();

        $contacts = $user->hasPermission('contact.view') ? Contact::query()
            ->where(fn ($query) => $query->where('first_name', 'like', "%{$term}%")->orWhere('last_name', 'like', "%{$term}%")->orWhere('organization_name', 'like', "%{$term}%"))
            ->limit($limit)->get()->map(fn (Contact $contact) => [
                'type' => 'contact', 'id' => $contact->getKey(), 'title' => $contact->full_name,
                'subtitle' => $contact->organization_name, 'url' => route('contacts.index', ['search' => $contact->email ?: $contact->full_name]),
            ]) : collect();

        $documents = Document::query()->visibleTo($user)
            ->where('title', 'like', "%{$term}%")->limit($limit)->get()->map(fn (Document $document) => [
                'type' => 'document', 'id' => $document->getKey(), 'title' => $document->title,
                'subtitle' => $document->document_type, 'url' => route('documents.show', $document),
            ]);

        return $matters->concat($clients)->concat($contacts)->concat($documents)->take($limit)->values()->all();
    }
}
