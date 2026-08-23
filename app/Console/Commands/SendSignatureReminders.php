<?php

namespace App\Console\Commands;

use App\Models\SignatureSigner;
use App\Notifications\SignatureReminderNotification;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Notification;

#[Description('Send pending internal signature reminders.')]
class SendSignatureReminders extends Command
{
    protected $signature = 'raf:send-signature-reminders';

    protected $description = 'Send reminders for pending signature requests.';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $sent = 0;

        SignatureSigner::query()
            ->with('signatureRequest')
            ->where('status', 'pending')
            ->whereHas('signatureRequest', fn ($query) => $query->where('status', 'sent')->where(fn ($query) => $query->whereNull('expires_at')->orWhere('expires_at', '>', now())))
            ->where(fn ($query) => $query->whereNull('last_reminded_at')->orWhere('last_reminded_at', '<=', now()->subDay()))
            ->lazyById()
            ->each(function (SignatureSigner $signer) use (&$sent): void {
                Notification::route('mail', $signer->email)->notify((new SignatureReminderNotification($signer))->afterCommit());
                $signer->update(['last_reminded_at' => now()]);
                $sent++;
            });

        $this->components->info("{$sent} pengingat tanda tangan masuk ke antrean.");

        return self::SUCCESS;
    }
}
