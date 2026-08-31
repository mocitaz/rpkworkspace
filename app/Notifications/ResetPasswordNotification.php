<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ResetPasswordNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        #[\SensitiveParameter]
        public string $token
    ) {
        $this->queue = config('raf.queues.notifications', 'notifications');
    }

    /**
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $resetUrl = rtrim((string) config('app.url'), '/').route('password.reset', [
            'token' => $this->token,
            'email' => $notifiable->getEmailForPasswordReset(),
        ], false);

        return (new MailMessage)
            ->subject('[Keamanan Akun] Permintaan Reset Password RPK Workspace')
            ->view('mail.auth-reset-password', [
                'token' => $this->token,
                'resetUrl' => $resetUrl,
                'recipientName' => $notifiable->name ?? 'Rekan Pengguna',
            ]);
    }
}
