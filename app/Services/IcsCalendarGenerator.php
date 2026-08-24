<?php

namespace App\Services;

use App\Models\Deadline;
use App\Models\MatterEvent;
use Illuminate\Support\Collection;

class IcsCalendarGenerator
{
    /**
     * @param  Collection<int, MatterEvent>  $events
     * @param  Collection<int, Deadline>  $deadlines
     */
    public function generate(Collection $events, Collection $deadlines): string
    {
        $lines = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//RPK Law Firm//Legal Practice Workspace//ID',
            'CALSCALE:GREGORIAN',
            'METHOD:PUBLISH',
            'X-WR-CALNAME:RPK Law Firm — Sidang & Agenda Perkara',
            'X-WR-TIMEZONE:Asia/Jakarta',
        ];

        foreach ($events as $event) {
            $start = $event->starts_at?->utc()->format('Ymd\THis\Z') ?? now()->utc()->format('Ymd\THis\Z');
            $end = $event->ends_at ? $event->ends_at->utc()->format('Ymd\THis\Z') : $event->starts_at?->addHours(2)->utc()->format('Ymd\THis\Z');
            $summary = '['.($event->matter->matter_number ?? 'Perkara').'] '.$event->title;
            $location = $event->location ?? 'Pengadilan / Kantor RPK Law Firm';
            $description = ($event->description ? $event->description."\n\n" : '').'Perkara: '.($event->matter->title ?? '-');

            $lines[] = 'BEGIN:VEVENT';
            $lines[] = 'UID:event-'.$event->id.'@rpklaw.co.id';
            $lines[] = 'DTSTAMP:'.now()->utc()->format('Ymd\THis\Z');
            $lines[] = 'DTSTART:'.$start;
            $lines[] = 'DTEND:'.$end;
            $lines[] = 'SUMMARY:'.$this->escapeIcs($summary);
            $lines[] = 'LOCATION:'.$this->escapeIcs($location);
            $lines[] = 'DESCRIPTION:'.$this->escapeIcs($description);
            $lines[] = 'STATUS:CONFIRMED';
            $lines[] = 'END:VEVENT';
        }

        foreach ($deadlines as $deadline) {
            $start = $deadline->due_at?->utc()->format('Ymd\THis\Z') ?? now()->utc()->format('Ymd\THis\Z');
            $end = $deadline->due_at?->addHour()->utc()->format('Ymd\THis\Z') ?? now()->utc()->format('Ymd\THis\Z');
            $summary = '⏳ [TENGGAT '.($deadline->matter->matter_number ?? 'Perkara').'] '.$deadline->title;
            $description = 'Batas Waktu Hukum / Tenggat Pengajuan Bukti. Perkara: '.($deadline->matter->title ?? '-');

            $lines[] = 'BEGIN:VEVENT';
            $lines[] = 'UID:deadline-'.$deadline->id.'@rpklaw.co.id';
            $lines[] = 'DTSTAMP:'.now()->utc()->format('Ymd\THis\Z');
            $lines[] = 'DTSTART:'.$start;
            $lines[] = 'DTEND:'.$end;
            $lines[] = 'SUMMARY:'.$this->escapeIcs($summary);
            $lines[] = 'DESCRIPTION:'.$this->escapeIcs($description);
            $lines[] = 'STATUS:CONFIRMED';
            $lines[] = 'END:VEVENT';
        }

        $lines[] = 'END:VCALENDAR';

        return implode("\r\n", $lines);
    }

    private function escapeIcs(string $text): string
    {
        $text = str_replace('\\', '\\\\', $text);
        $text = str_replace(',', '\,', $text);
        $text = str_replace(';', '\;', $text);
        $text = str_replace("\n", '\n', $text);

        return $text;
    }
}
