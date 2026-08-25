<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewStaffWelcomeNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public object $user,
        public ?string $initialPassword = null
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
        return (new MailMessage)
            ->subject('[Selamat Datang] Akun Workspace Anda Telah Dibuat - RPK Law Firm')
            ->view('mail.new-staff-welcome', [
                'user' => $this->user,
                'initialPassword' => $this->initialPassword,
                'actionUrl' => 'https://app.rpklawoffice.com/login',
            ]);
    }
}
