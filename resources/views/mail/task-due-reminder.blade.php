@extends('mail.layouts.rpk', [
    'subject' => '[Pengingat Tenggat] ' . $task->title,
    'preheader' => 'Pengingat batas waktu pengerjaan tugas: ' . $task->title,
    'badgeText' => 'Pengingat Batas Waktu',
    'badgeBg' => '#fef3c7',
    'badgeColor' => '#b45309',
    'badgeBorder' => '#fde68a',
    'heading' => 'Pengingat Batas Waktu Tugas',
    'recipientName' => $recipientName ?? 'Rekan Kerja',
    'actionText' => 'Periksa Progres Tugas',
    'actionUrl' => $actionUrl ?? (config('app.url') . '/tasks?view=mine'),
])

@section('content')
<p style="margin: 0 0 16px 0; font-size: 14px; line-height: 22px; color: #475569;">
    Ini adalah pengingat otomatis bahwa tugas berikut akan segera mencapai batas waktu pengerjaan:
</p>

<!-- Information Matrix Card -->
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 20px; overflow: hidden;">
    <tr>
        <td style="padding: 16px 20px; border-bottom: 1px solid #edf2f7;">
            <span style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 4px;">Judul Tugas</span>
            <span style="font-size: 14px; font-weight: 700; color: #0f172a;">{{ $task->title }}</span>
        </td>
    </tr>
    @if($task->matter)
    <tr>
        <td style="padding: 12px 20px; border-bottom: 1px solid #edf2f7;">
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
        <td style="padding: 12px 20px;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                    <td width="50%" style="vertical-align: top;">
                        <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; display: block; margin-bottom: 2px;">Status Saat Ini</span>
                        <span style="font-size: 12px; font-weight: 700; color: #b45309; text-transform: uppercase;">
                            {{ strtoupper(str_replace('_', ' ', $task->status ?? 'In Progress')) }}
                        </span>
                    </td>
                    <td width="50%" style="vertical-align: top;">
                        <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; display: block; margin-bottom: 2px;">Jatuh Tempo</span>
                        <span style="font-size: 12px; font-weight: 800; color: #dc2626;">
                            {{ $task->due_at ? \Carbon\Carbon::parse($task->due_at)->translatedFormat('l, d F Y (H:i T)') : '-' }}
                        </span>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>

<p style="margin: 0; font-size: 13px; line-height: 20px; color: #64748b;">
    Mohon pastikan seluruh draf atau kelengkapan tugas telah diserahkan sebelum batas waktu di atas. Apabila tugas telah selesai, silakan perbarui status menjadi <strong>Completed</strong> pada sistem.
</p>
@endsection
