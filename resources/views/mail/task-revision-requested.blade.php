@extends('mail.layouts.rpk', [
    'subject' => '[Permintaan Revisi Tugas] ' . $task->task_number . ': ' . $task->title,
    'preheader' => 'Partner meminta revisi pada tugas: ' . $task->title,
    'badgeText' => 'Perlu Revisi / Perbaikan',
    'badgeBg' => '#fffbeb',
    'badgeColor' => '#b45309',
    'badgeBorder' => '#fde68a',
    'heading' => 'Permintaan Revisi Tugas',
    'recipientName' => $recipientName ?? 'Rekan Advokat',
    'actionText' => 'Lihat Catatan Revisi di Workspace',
    'actionUrl' => $actionUrl ?? (config('app.url') . '/tasks/' . $task->id),
])

@section('content')
<p style="margin: 0 0 16px 0; font-size: 14px; line-height: 22px; color: #475569;">
    Partner <strong>{{ $actor->name }}</strong> telah menelaah pengajuan tugas Anda dan meminta <strong style="color: #b45309;">REVISI / PERBAIKAN</strong> pada tugas berikut:
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
                        <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; display: block; margin-bottom: 2px;">Reviewer</span>
                        <span style="font-size: 12px; font-weight: 700; color: #0f172a;">{{ $actor->name }}</span>
                    </td>
                    <td width="50%" style="vertical-align: top;">
                        <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; display: block; margin-bottom: 2px;">Status Saat Ini</span>
                        <span style="font-size: 12px; font-weight: 700; color: #2563eb;">Sedang Dikerjakan (In Progress)</span>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>

@if(!empty($feedback))
<div style="background-color: #fffbeb; border: 1px solid #fde68a; border-radius: 10px; padding: 14px 18px; margin-bottom: 20px;">
    <span style="font-size: 11px; font-weight: 700; color: #92400e; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 6px;">Catatan &amp; Instruksi Perbaikan dari Partner:</span>
    <p style="margin: 0; font-size: 13px; line-height: 20px; color: #78350f; white-space: pre-wrap;">{{ $feedback }}</p>
</div>
@endif

<p style="margin: 0 0 16px 0; font-size: 13px; line-height: 20px; color: #64748b;">
    Silakan perbaiki tugas sesuai arahan di atas, lalu klik <strong>Ajukan Review ke Partner</strong> kembali setelah selesai diperbaiki.
</p>
@endsection
