<?php

namespace App\Notifications;

use App\Models\Client;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ClientPartnerAssignedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Client $client) {}

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
            ->subject('[Penugasan Klien] '.$this->client->display_name)
            ->view('mail.client-partner-assigned', [
                'client' => $this->client,
                'recipientName' => $notifiable->name ?? 'Bapak/Ibu Partner',
                'actionUrl' => route('clients.show', $this->client),
            ]);
    }

    /** @return array<string, mixed> */
    public function toArray(object $notifiable): array
    {
        return [
            'kind' => 'client_partner_assigned',
            'title' => 'Penunjukan Partner Klien: '.$this->client->display_name,
            'message' => 'Anda telah ditunjuk sebagai Relationship Partner untuk klien ini.',
            'url' => route('clients.show', $this->client),
            'client_id' => $this->client->getKey(),
        ];
    }

    public function databaseType(object $notifiable): string
    {
        return 'client-partner-assigned';
    }
}
