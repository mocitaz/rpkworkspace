<?php

namespace App\Notifications;

use App\Models\Matter;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class HearingScheduledNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public string $hearingTitle,
        public string $hearingDate,
        public ?string $hearingTime = null,
        public ?string $courtName = null,
        public ?string $courtRoom = null,
        public ?Matter $matter = null,
        public ?string $scheduledBy = null,
        public ?string $instructions = null
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
        $subject = '[Jadwal Sidang Baru] '.($this->matter ? $this->matter->matter_number.' - ' : '').$this->hearingTitle;

        $mail = (new MailMessage)
            ->subject($subject)
            ->view('mail.hearing-scheduled', [
                'hearingTitle' => $this->hearingTitle,
                'hearingDate' => $this->hearingDate,
                'hearingTime' => $this->hearingTime,
                'courtName' => $this->courtName,
                'courtRoom' => $this->courtRoom,
                'matter' => $this->matter,
                'scheduledBy' => $this->scheduledBy,
                'instructions' => $this->instructions,
                'recipientName' => $notifiable->name ?? 'Tim Litigasi Advokat',
                'actionUrl' => route('calendar.index'),
            ]);

        $mail->attachData($this->buildIcs($notifiable), 'undangan-sidang.ics', [
            'mime' => 'text/calendar; charset=utf-8; method=REQUEST',
        ]);

        return $mail;
    }

    private function buildIcs(object $notifiable): string
    {
        $start = now()->utc()->format('Ymd\THis\Z');
        $end = now()->addHours(2)->utc()->format('Ymd\THis\Z');

        try {
            if ($this->hearingDate) {
                $parsedDate = Carbon::parse($this->hearingDate, config('raf.timezone'));
                if ($this->hearingTime && preg_match('/(\d{1,2}):(\d{2})/', $this->hearingTime, $matches)) {
                    $parsedDate->setTime((int) $matches[1], (int) $matches[2]);
                } else {
                    $parsedDate->setTime(9, 0);
                }
                $start = $parsedDate->utc()->format('Ymd\THis\Z');
                $end = $parsedDate->copy()->addHours(2)->utc()->format('Ymd\THis\Z');
            }
        } catch (\Throwable) {
        }

        $summary = '['.($this->matter->matter_number ?? 'RPK').'] '.$this->hearingTitle;
        $location = $this->courtName ? ($this->courtName.($this->courtRoom ? ', '.$this->courtRoom : '')) : 'Pengadilan';
        $description = 'Sidang Perkara: '.($this->matter->title ?? '-')."\n".'Dijadwalkan oleh: '.($this->scheduledBy ?? 'RPK Law Office')."\n".($this->instructions ? "\nInstruksi: ".$this->instructions : '');
        $uid = 'hearing-'.md5($this->hearingTitle.$this->hearingDate.($this->matter?->id ?? '')).'@rpklaw.co.id';

        $lines = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//RPK Law Firm//Legal Practice Workspace//ID',
            'CALSCALE:GREGORIAN',
            'METHOD:REQUEST',
            'BEGIN:VEVENT',
            'UID:'.$uid,
            'DTSTAMP:'.now()->utc()->format('Ymd\THis\Z'),
            'ORGANIZER;CN="RPK Law Office":mailto:contact@rpklawoffice.com',
            'ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;CN='.addslashes($notifiable->name ?? 'Advokat').':mailto:'.($notifiable->email ?? 'advokat@rpklawoffice.com'),
            'DTSTART:'.$start,
            'DTEND:'.$end,
            'SUMMARY:'.str_replace(["\r", "\n", ',', ';'], [' ', ' ', '\,', '\;'], $summary),
            'LOCATION:'.str_replace(["\r", "\n", ',', ';'], [' ', ' ', '\,', '\;'], $location),
            'DESCRIPTION:'.str_replace(["\r", "\n"], ['\n', '\n'], $description),
            'STATUS:CONFIRMED',
            'SEQUENCE:0',
            'END:VEVENT',
            'END:VCALENDAR',
        ];

        return implode("\r\n", $lines);
    }

    /** @return array<string, mixed> */
    public function toArray(object $notifiable): array
    {
        return [
            'kind' => 'hearing_scheduled',
            'title' => 'Jadwal Sidang Baru: '.$this->hearingTitle,
            'message' => 'Sidang dijadwalkan pada '.$this->hearingDate.' di '.($this->courtName ?? 'Pengadilan'),
            'url' => route('calendar.index'),
            'matter_id' => $this->matter?->getKey(),
            'severity' => 'high',
        ];
    }

    public function databaseType(object $notifiable): string
    {
        return 'hearing-scheduled';
    }
}
