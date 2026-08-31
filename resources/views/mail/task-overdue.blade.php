@extends('mail.layouts.rpk', [
    'subject' => '[PERINGATAN TENGGAT MELEBIHI WAKTU] ' . $task->title,
    'preheader' => 'Pemberitahuan: Tugas telah melewati batas waktu' . ($overdueDays ? ' selama ' . $overdueDays . ' hari.' : '.'),
    'badgeText' => $overdueDays ? 'Terlambat H+' . $overdueDays : 'Tugas Melewati Batas Waktu',
    'badgeBg' => '#fef2f2',
    'badgeColor' => '#b91c1c',
    'badgeBorder' => '#fecaca',
    'heading' => 'Peringatan Tugas Terlambat',
    'recipientName' => $recipientName ?? 'Rekan Kerja',
    'actionText' => 'Buka Detail Tugas',
    'actionUrl' => $actionUrl ?? (rtrim((string) config('app.url'), '/') . route('tasks.show', $task, false)),
])

@section('content')
<p style="margin: 0 0 16px 0; font-size: 14px; line-height: 22px; color: #475569;">
    Sistem mendeteksi bahwa tugas berikut telah <strong style="color: #b91c1c;">melewati batas waktu (overdue)</strong> dan masih berstatus belum selesai:
</p>

@if($escalated ?? false)
<div style="margin-bottom: 20px; padding: 12px 16px; border-left: 3px solid #b91c1c; border-radius: 0 8px 8px 0; background-color: #fff7ed; color: #9a3412; font-size: 12px; line-height: 18px;">
    <strong>Eskalasi kepada penanggung jawab:</strong> Tugas telah terlambat {{ $overdueDays }} hari dan belum diselesaikan oleh assignee.
</div>
@endif

<!-- Information Matrix Card -->
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; margin-bottom: 20px; overflow: hidden;">
    <tr>
        <td style="padding: 16px 20px; border-bottom: 1px solid #fee2e2;">
            <span style="font-size: 11px; font-weight: 700; color: #991b1b; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 4px;">Judul Tugas</span>
            <span style="font-size: 14px; font-weight: 700; color: #7f1d1d;">{{ $task->title }}</span>
        </td>
    </tr>
    @if($task->matter)
    <tr>
        <td style="padding: 12px 20px; border-bottom: 1px solid #fee2e2; background-color: #ffffff;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                    <td width="50%" style="vertical-align: top;">
                        <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; display: block; margin-bottom: 2px;">Perkara</span>
                        <span style="font-size: 12px; font-weight: 600; color: #1e293b;">{{ $task->matter->matter_number }}</span>
                    </td>
                    <td width="50%" style="vertical-align: top;">
                        <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; display: block; margin-bottom: 2px;">Klien</span>
                        <span style="font-size: 12px; font-weight: 600; color: #1e293b;">{{ $task->matter->client?->display_name ?? '-' }}</span>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
    @endif
    <tr>
        <td style="padding: 12px 20px; background-color: #ffffff;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                    <td width="50%" style="vertical-align: top;">
                        <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; display: block; margin-bottom: 2px;">Penanggung Jawab</span>
                        <span style="font-size: 12px; font-weight: 700; color: #0f172a;">{{ $task->assignee?->name ?? 'Belum Ditugaskan' }}</span>
                    </td>
                    <td width="50%" style="vertical-align: top;">
                        <span style="font-size: 10px; font-weight: 700; color: #991b1b; text-transform: uppercase; display: block; margin-bottom: 2px;">Batas Waktu Terlewat</span>
                        <span style="font-size: 12px; font-weight: 800; color: #b91c1c;">
                            {{ $task->due_at ? \Carbon\Carbon::parse($task->due_at)->translatedFormat('l, d F Y (H:i T)') : '-' }}
                        </span>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>

<p style="margin: 0; font-size: 13px; line-height: 20px; color: #64748b;">
    Mohon segera lakukan koordinasi dengan Partner terkait atau perbarui progres pengerjaan pada tautan berikut guna mencegah keterlambatan jadwal perkara klien.
</p>
@endsection
