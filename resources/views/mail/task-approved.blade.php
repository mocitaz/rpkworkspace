@extends('mail.layouts.rpk', [
    'subject' => '[Tugas Disetujui] ' . $task->task_number . ': ' . $task->title,
    'preheader' => 'Tugas ' . $task->title . ' telah disetujui & diselesaikan oleh ' . $actor->name,
    'badgeText' => 'Tugas Telah Disetujui & Selesai',
    'badgeBg' => '#ecfdf5',
    'badgeColor' => '#047857',
    'badgeBorder' => '#a7f3d0',
    'heading' => 'Persetujuan & Penyelesaian Tugas',
    'recipientName' => $recipientName ?? 'Rekan Advokat',
    'actionText' => 'Lihat Detail Tugas di Workspace',
    'actionUrl' => $actionUrl ?? (config('app.url') . '/tasks/' . $task->id),
])

@section('content')
<p style="margin: 0 0 16px 0; font-size: 14px; line-height: 22px; color: #475569;">
    Kabar baik! Partner <strong>{{ $actor->name }}</strong> telah menelaah dan <strong style="color: #047857;">MENYETUJUI (APPROVED)</strong> pengerjaan tugas berikut:
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
    <tr>
        <td style="padding: 12px 20px;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                    <td width="50%" style="vertical-align: top;">
                        <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; display: block; margin-bottom: 2px;">Disetujui Oleh</span>
                        <span style="font-size: 12px; font-weight: 700; color: #0f172a;">{{ $actor->name }}</span>
                    </td>
                    <td width="50%" style="vertical-align: top;">
                        <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; display: block; margin-bottom: 2px;">Waktu Persetujuan</span>
                        <span style="font-size: 12px; font-weight: 700; color: #047857;">{{ now()->translatedFormat('l, d F Y (H:i T)') }}</span>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>

@if(!empty($remarks))
<div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 14px 18px; margin-bottom: 20px;">
    <span style="font-size: 11px; font-weight: 700; color: #166534; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 6px;">Catatan Persetujuan dari Partner:</span>
    <p style="margin: 0; font-size: 13px; line-height: 20px; color: #14532d; white-space: pre-wrap;">{{ $remarks }}</p>
</div>
@endif

<p style="margin: 0 0 16px 0; font-size: 13px; line-height: 20px; color: #64748b;">
    Tugas ini kini telah berstatus <strong style="color: #047857;">Selesai (Completed)</strong> dan tercatat rapi pada berkas penanganan perkara. Terima kasih atas kerja keras rekan-rekan.
</p>
@endsection
