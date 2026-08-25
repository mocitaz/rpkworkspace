<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SecurityAlertNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public string $activityType,
        public ?string $ipAddress = null,
        public ?string $userAgent = null,
        public ?string $eventTime = null
    ) {
        $this->queue = config('raf.queues.notifications', 'notifications');
        $this->eventTime = $this->eventTime ?? now()->translatedFormat('l, d F Y (H:i T)');
    }

    /**
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database', 'mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $subject = '[Keamanan Akun] Peringatan Aktivitas: '.$this->activityType;

        return (new MailMessage)
            ->subject($subject)
            ->view('mail.security-alert', [
                'activityType' => $this->activityType,
                'ipAddress' => $this->ipAddress ?? '127.0.0.1',
                'userAgent' => $this->userAgent ?? 'Web Browser',
                'eventTime' => $this->eventTime,
                'recipientName' => $notifiable->name ?? 'Rekan Pengguna',
                'actionUrl' => 'https://app.rpklawoffice.com/settings/security',
            ]);
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'security_alert',
            'activity_type' => $this->activityType,
            'ip_address' => $this->ipAddress,
            'user_agent' => $this->userAgent,
            'event_time' => $this->eventTime,
        ];
    }
}
