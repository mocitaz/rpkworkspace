<?php

namespace App\Jobs;

use App\Models\EmailMessage;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Mail;
use Throwable;

class SendEmailMessage implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(public string $emailMessageId) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $email = EmailMessage::query()->with(['sender', 'matter'])->findOrFail($this->emailMessageId);
        if ($email->status === 'sent') {
            return;
        }

        $rawBody = (string) $email->body;
        $hasSignature = false;
        $signerName = $email->sender?->name ?: (config('mail.from.name') ?: 'RPK Law Office');
        $signerTitle = $email->sender?->position_title ?: 'Advokat & Konsultan Hukum';
        $cleanBody = $rawBody;

        if (str_contains($rawBody, '--SIGNATURE--')) {
            $parts = explode('--SIGNATURE--', $rawBody, 2);
            $cleanBody = trim($parts[0]);
            $hasSignature = true;
            if (preg_match('/name:\s*([^\r\n]+)/i', $parts[1], $nameMatch)) {
                $parsedName = trim($nameMatch[1]);
                if ($parsedName !== '') {
                    $signerName = $parsedName;
                }
            }
            if (preg_match('/title:\s*([^\r\n]+)/i', $parts[1], $titleMatch)) {
                $parsedTitle = trim($titleMatch[1]);
                if ($parsedTitle !== '') {
                    $signerTitle = $parsedTitle;
                }
            }
        } elseif (str_contains($rawBody, '[CONFIDENTIALITY NOTICE') || str_contains($rawBody, 'PERNYATAAN KERAHASIAAN')) {
            $hasSignature = true;
            $parts = preg_split('/(?:\n--|\n\[CONFIDENTIALITY|\n\[PERNYATAAN)/', $rawBody);
            $cleanBody = trim($parts[0] ?? $rawBody);
        }

        // Format sender display name for email client (e.g. "Bima Priambodo (RPK Law Office)")
        $fromDisplayName = $signerName;
        if (! str_contains(strtolower($fromDisplayName), 'rpk')) {
            $fromDisplayName = "{$fromDisplayName} (RPK Law Office)";
        }

        try {
            Mail::send('mail.email-message', [
                'email' => $email,
                'cleanBody' => $cleanBody,
                'hasSignature' => $hasSignature,
                'signerName' => $signerName,
                'signerTitle' => $signerTitle,
            ], function ($message) use ($email, $fromDisplayName): void {
                $message->from($email->from_address, $fromDisplayName)
                    ->to($email->to_addresses)
                    ->subject($email->subject);

                if ($email->cc_addresses) {
                    $message->cc($email->cc_addresses);
                }
                if ($email->bcc_addresses) {
                    $message->bcc($email->bcc_addresses);
                }
            });
            $email->forceFill(['status' => 'sent', 'sent_at' => now(), 'error_message' => null])->save();
        } catch (Throwable $exception) {
            $email->forceFill(['status' => 'failed', 'failed_at' => now(), 'error_message' => $exception->getMessage()])->save();
            throw $exception;
        }
    }
}
