@extends('mail.layouts.rpk', [
    'subject' => '[Permintaan Review Tugas] ' . $task->task_number . ': ' . $task->title,
    'preheader' => 'Pengajuan review tugas oleh ' . $actor->name . ': ' . $task->title,
    'badgeText' => 'Menunggu Review Partner',
    'badgeBg' => '#f3e8ff',
    'badgeColor' => '#7e22ce',
    'badgeBorder' => '#d8b4fe',
    'heading' => 'Pengajuan Review Tugas',
    'recipientName' => $recipientName ?? 'Bapak/Ibu Partner',
    'actionText' => 'Buka Halaman Tugas & Berikan Review',
    'actionUrl' => $actionUrl ?? (config('app.url') . '/tasks/' . $task->id),
])

@section('content')
<p style="margin: 0 0 16px 0; font-size: 14px; line-height: 22px; color: #475569;">
    Rekan <strong>{{ $actor->name }}</strong> telah menyelesaikan pengerjaan tugas berikut dan mengajukan permohonan <strong>penelaahan &amp; persetujuan (Review)</strong> kepada Anda:
</p>

<!-- Information Matrix Card -->
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 20px; overflow: hidden;">
    <tr>
        <td style="padding: 16px 20px; border-bottom: 1px solid #edf2f7;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                    <td width="30%" style="vertical-align: top;">
                        <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; display: block; margin-bottom: 2px;">Nomor Tugas</span>
                        <span style="font-size: 12px; font-family: monospace; font-weight: 700; color: #2563eb;">{{ $task->task_number }}</span>
                    </td>
                    <td width="70%" style="vertical-align: top;">
                        <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; display: block; margin-bottom: 2px;">Judul Tugas</span>
                        <span style="font-size: 13px; font-weight: 700; color: #0f172a;">{{ $task->title }}</span>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
    @if($task->matter)
    <tr>
        <td style="padding: 12px 20px; border-bottom: 1px solid #edf2f7;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                    <td width="50%" style="vertical-align: top;">
                        <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; display: block; margin-bottom: 2px;">Perkara Terkait</span>
                        <span style="font-size: 12px; font-weight: 600; color: #1e293b;">{{ $task->matter->matter_number }} · {{ $task->matter->title }}</span>
                    </td>
                    <td width="50%" style="vertical-align: top;">
                        <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; display: block; margin-bottom: 2px;">Klien</span>
                        <span style="font-size: 12px; font-weight: 600; color: #1e293b;">{{ $task->matter->client?->display_name ?? $task->matter->client?->name ?? '-' }}</span>
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
                        <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; display: block; margin-bottom: 2px;">Diajukan Oleh</span>
                        <span style="font-size: 12px; font-weight: 700; color: #0f172a;">{{ $actor->name }}</span>
                    </td>
                    <td width="50%" style="vertical-align: top;">
                        <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; display: block; margin-bottom: 2px;">Waktu Pengajuan</span>
                        <span style="font-size: 12px; font-weight: 700; color: #7e22ce;">{{ now()->translatedFormat('l, d F Y (H:i T)') }}</span>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>

@if(!empty($notes))
<div style="background-color: #faf5ff; border: 1px solid #e9d5ff; border-radius: 10px; padding: 14px 18px; margin-bottom: 20px;">
    <span style="font-size: 11px; font-weight: 700; color: #7e22ce; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 6px;">Catatan Hasil Pengerjaan / Resume:</span>
    <p style="margin: 0; font-size: 13px; line-height: 20px; color: #581c87; white-space: pre-wrap;">{{ $notes }}</p>
</div>
@endif

<p style="margin: 0 0 16px 0; font-size: 13px; line-height: 20px; color: #64748b;">
    Silakan klik tombol di bawah untuk memeriksa butir pengerjaan, menyetujui, atau memberikan instruksi revisi kepada pelaksana tugas.
</p>
@endsection
