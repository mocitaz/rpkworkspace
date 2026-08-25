<?php

use App\Models\Client;
use App\Models\Correspondence;
use App\Models\Document;
use App\Models\Invoice;
use App\Models\Matter;
use App\Models\Payment;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Database\Seeders\RafWorkspaceDemoSeeder;

beforeEach(function () {
    $this->seed(DatabaseSeeder::class);
    $this->seed(RafWorkspaceDemoSeeder::class);
    $this->user = User::where('email', 'fajarroni@rpklawoffice.com')->first();
    $this->actingAs($this->user);
});

dataset('all_app_routes', function () {
    return [
        'dashboard' => fn () => '/dashboard',
        'clients_index' => fn () => '/clients',
        'clients_create' => fn () => '/clients/create',
        'clients_show' => fn () => '/clients/'.Client::first()->getKey(),
        'clients_edit' => fn () => '/clients/'.Client::first()->getKey().'/edit',
        'matters_index' => fn () => '/matters',
        'matters_create' => fn () => '/matters/create',
        'matters_show' => fn () => '/matters/'.Matter::first()->getKey(),
        'documents_index' => fn () => '/documents',
        'documents_show' => fn () => '/documents/'.Document::first()->getKey(),
        'tasks_index' => fn () => '/tasks',
        'contacts_index' => fn () => '/contacts',
        'governance_index' => fn () => '/governance',
        'governance_correspondence_show' => fn () => '/governance/correspondences/'.Correspondence::first()->getKey(),
        'finance_index' => fn () => '/finance',
        'finance_invoice_show' => fn () => '/finance/invoices/'.Invoice::first()->getKey(),
        'finance_payment_show' => fn () => '/finance/payments/'.Payment::first()->getKey(),
        'calendar_index' => fn () => '/calendar',
        'chat_index' => fn () => '/chat',
        'admin_users_index' => fn () => '/admin/users',
        'admin_audit_index' => fn () => '/admin/audit',
        'admin_system_readiness' => fn () => '/admin/system-readiness',
        'settings_profile' => fn () => '/settings/profile',
        'settings_appearance' => fn () => '/settings/appearance',
        'settings_security' => fn () => '/settings/security',
        'search_index' => fn () => '/search?q=test',
    ];
});

it('renders all main app routes successfully with HTTP 200 and no 500 exceptions', function ($urlResolver) {
    $url = is_callable($urlResolver) ? $urlResolver() : $urlResolver;

    $response = $this->withSession(['auth.password_confirmed_at' => time()])->get($url);

    $response->assertOk();
})->with('all_app_routes');
