<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PaymentVerificationRequestedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public string $invoiceNumber,
        public string $clientName,
        public string $amountPaid,
        public ?string $paymentMethod = null,
        public ?string $bankReference = null,
        public ?string $paymentDate = null,
        public ?string $invoiceId = null
    ) {}

    /** @return array<int, string> */
    public function via(object $notifiable): array
    {
        return ['database', 'mail'];
    }

    /** @return array<string, string> */
    public function viaQueues(): array
    {
        return [
            'database' => config('raf.queues.notifications', 'notifications'),
            'mail' => config('raf.queues.notifications', 'notifications'),
        ];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('[Verifikasi Pembayaran Masuk] Tagihan: '.$this->invoiceNumber.' ('.$this->clientName.')')
            ->view('mail.payment-verification-requested', [
                'invoiceNumber' => $this->invoiceNumber,
                'clientName' => $this->clientName,
                'amountPaid' => $this->amountPaid,
                'paymentMethod' => $this->paymentMethod,
                'bankReference' => $this->bankReference,
                'paymentDate' => $this->paymentDate,
                'recipientName' => $notifiable->name ?? 'Tim Finance & Billing',
                'actionUrl' => route('finance.index'),
            ]);
    }

    /** @return array<string, mixed> */
    public function toArray(object $notifiable): array
    {
        return [
            'kind' => 'payment_verification_requested',
            'title' => 'Pembayaran Masuk: '.$this->invoiceNumber,
            'message' => 'Pembayaran '.$this->amountPaid.' dari '.$this->clientName.' menunggu verifikasi finance.',
            'url' => route('finance.index'),
            'severity' => 'high',
        ];
    }

    public function databaseType(object $notifiable): string
    {
        return 'payment-verification-requested';
    }
}
