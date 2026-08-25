@extends('mail.layouts.rpk', [
    'subject' => '[Tugas Selesai] ' . $task->title,
    'preheader' => 'Laporan penyelesaian tugas: ' . $task->title,
    'badgeText' => 'Tugas Telah Diselesaikan',
    'badgeBg' => '#ecfdf5',
    'badgeColor' => '#047857',
    'badgeBorder' => '#a7f3d0',
    'heading' => 'Laporan Penyelesaian Tugas',
    'recipientName' => $recipientName ?? 'Bapak/Ibu Partner',
    'actionText' => 'Tinjau Hasil Tugas di Workspace',
    'actionUrl' => $actionUrl ?? (config('app.url') . '/tasks'),
])

@section('content')
<p style="margin: 0 0 16px 0; font-size: 14px; line-height: 22px; color: #475569;">
    Rekan <strong>{{ $task->assignee?->name ?? 'Pelaksana Tugas' }}</strong> telah menandai tugas berikut sebagai <strong style="color: #047857;">SELESAI (Completed)</strong>:
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
                        <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; display: block; margin-bottom: 2px;">Diselesaikan Oleh</span>
                        <span style="font-size: 12px; font-weight: 700; color: #0f172a;">{{ $task->assignee?->name ?? '-' }}</span>
                    </td>
                    <td width="50%" style="vertical-align: top;">
                        <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; display: block; margin-bottom: 2px;">Waktu Penyelesaian</span>
                        <span style="font-size: 12px; font-weight: 700; color: #047857;">
                            {{ $task->completed_at ? \Carbon\Carbon::parse($task->completed_at)->translatedFormat('l, d F Y (H:i T)') : now()->translatedFormat('l, d F Y (H:i T)') }}
                        </span>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>

<p style="margin: 0; font-size: 13px; line-height: 20px; color: #64748b;">
    Silakan periksa lampiran hasil kerja atau verifikasi pemenuhan deliverables pada halaman detail tugas.
</p>
@endsection
