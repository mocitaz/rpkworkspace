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
    public function __construct(public string $emailMessageId)
    {
        $email = EmailMessage::query()->findOrFail($this->emailMessageId);
        if ($email->status === 'sent') {
            return;
        }
        try {
            Mail::send('mail.email-message', ['email' => $email, 'body' => $email->body], function ($message) use ($email): void {
                $message->from($email->from_address)->to($email->to_addresses)->subject($email->subject);
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

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        //
    }
}
