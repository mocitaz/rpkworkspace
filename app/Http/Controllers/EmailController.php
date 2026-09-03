<?php

namespace App\Http\Controllers;

use App\Actions\LogCorrespondence;
use App\Jobs\SendEmailMessage;
use App\Models\Client;
use App\Models\EmailMessage;
use App\Models\Matter;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class EmailController extends Controller
{
    public function index(Request $request): Response
    {
        abort_unless($request->user()->hasPermission('email.view'), 403);

        return Inertia::render('email/index', ['messages' => EmailMessage::query()->where('sender_id', $request->user()->id)->with('matter:id,matter_number,title')->latest()->limit(100)->get(), 'matters' => Matter::query()->visibleTo($request->user())->orderBy('matter_number')->get(['id', 'matter_number', 'title']), 'clients' => Client::query()->orderBy('display_name')->get(['id', 'display_name']), 'fromAddress' => (string) config('mail.from.address'), 'canSend' => $request->user()->hasPermission('email.send')]);
    }

    public function store(Request $request, LogCorrespondence $logCorrespondence): RedirectResponse
    {
        abort_unless($request->user()->hasPermission('email.send'), 403);
        $validated = $request->validate(['to' => ['required', 'string', 'max:5000'], 'cc' => ['nullable', 'string', 'max:5000'], 'bcc' => ['nullable', 'string', 'max:5000'], 'subject' => ['required', 'string', 'max:255'], 'body' => ['required', 'string', 'max:100000'], 'matter_id' => ['nullable', 'exists:matters,id'], 'client_id' => ['nullable', 'exists:clients,id'], 'save_draft' => ['nullable', 'boolean']]);
        $parse = static fn (string $value): array => collect(preg_split('/[\s,;]+/', trim($value)) ?: [])->filter()->unique()->values()->all();
        $to = $parse($validated['to']);
        $cc = $parse($validated['cc'] ?? '');
        $bcc = $parse($validated['bcc'] ?? '');
        validator(['emails' => [...$to, ...$cc, ...$bcc]], ['emails.*' => ['email']])->validate();
        $draft = $request->boolean('save_draft');
        $matter = ! empty($validated['matter_id']) ? Matter::query()->visibleTo($request->user())->findOrFail($validated['matter_id']) : null;
        $email = DB::transaction(fn () => EmailMessage::query()->create(['sender_id' => $request->user()->id, 'matter_id' => $matter?->getKey(), 'client_id' => $validated['client_id'] ?? $matter?->client_id, 'from_address' => (string) config('mail.from.address'), 'to_addresses' => $to, 'cc_addresses' => $cc, 'bcc_addresses' => $bcc, 'subject' => $validated['subject'], 'body' => $validated['body'], 'status' => $draft ? 'draft' : 'queued', 'queued_at' => $draft ? null : now()]));
        if ($matter && ! $draft) {
            $correspondence = $logCorrespondence->handle($matter, ['direction' => 'outgoing', 'source' => 'email', 'subject' => $email->subject, 'from_addresses' => [$email->from_address], 'to_addresses' => $email->to_addresses, 'cc_addresses' => $email->cc_addresses, 'body' => $email->body, 'occurred_at' => now()], $request->user());
            $email->forceFill(['correspondence_id' => $correspondence->getKey()])->save();
        }
        if (! $draft) {
            SendEmailMessage::dispatch($email->getKey())->onQueue(config('raf.queues.notifications', 'notifications'));
        }

        return back()->with('success', $draft ? 'Draft email disimpan.' : 'Email masuk antrean pengiriman.');
    }
}
