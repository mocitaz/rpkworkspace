@extends('mail.layouts.rpk', [
    'subject' => '[Jadwal Sidang Baru] ' . ($matter ? $matter->matter_number . ' - ' : '') . $hearingTitle,
    'preheader' => 'Jadwal sidang pengadilan baru telah diagendakan pada: ' . $hearingDate,
    'badgeText' => 'Agenda Sidang Pengadilan',
    'badgeBg' => '#fef2f2',
    'badgeColor' => '#dc2626',
    'badgeBorder' => '#fecaca',
    'heading' => 'Jadwal Sidang Pengadilan Baru',
    'recipientName' => $recipientName ?? 'Tim Litigasi Advokat',
    'actionText' => 'Buka Agenda Sidang',
    'actionUrl' => $actionUrl ?? (config('app.url') . '/calendar'),
])

@section('content')
<p style="margin: 0 0 16px 0; font-size: 14px; line-height: 22px; color: #475569;">
    Jadwal sidang pengadilan baru telah dimasukkan ke dalam kalender perkara oleh <strong>{{ $scheduledBy ?? 'Sekretariat / Tim Litigasi' }}</strong>:
</p>

<!-- Information Matrix Card -->
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 20px; overflow: hidden;">
    <tr>
        <td style="padding: 16px 20px; border-bottom: 1px solid #edf2f7; background-color: #fff1f2;">
            <span style="font-size: 11px; font-weight: 700; color: #9f1239; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 4px;">Agenda Sidang</span>
            <span style="font-size: 15px; font-weight: 800; color: #881337;">{{ $hearingTitle }}</span>
        </td>
    </tr>
    <tr>
        <td style="padding: 12px 20px; border-bottom: 1px solid #edf2f7;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                    <td width="50%" style="vertical-align: top;">
                        <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; display: block; margin-bottom: 2px;">Hari &amp; Tanggal Sidang</span>
                        <span style="font-size: 13px; font-weight: 800; color: #dc2626;">{{ $hearingDate }}</span>
                    </td>
                    <td width="50%" style="vertical-align: top;">
                        <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; display: block; margin-bottom: 2px;">Waktu / Jam</span>
                        <span style="font-size: 13px; font-weight: 700; color: #0f172a;">{{ $hearingTime ?? '09:00 WIB s/d Selesai' }}</span>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
    <tr>
        <td style="padding: 12px 20px; border-bottom: 1px solid #edf2f7;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                    <td width="50%" style="vertical-align: top;">
                        <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; display: block; margin-bottom: 2px;">Pengadilan / Lokasi</span>
                        <span style="font-size: 12px; font-weight: 700; color: #0f172a;">{{ $courtName ?? 'Pengadilan Negeri Jakarta Pusat' }}</span>
                    </td>
                    <td width="50%" style="vertical-align: top;">
                        <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; display: block; margin-bottom: 2px;">Ruang Sidang</span>
                        <span style="font-size: 12px; font-weight: 600; color: #1e293b;">{{ $courtRoom ?? 'Ruang Kusumah Atmadja' }}</span>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
    @if(isset($matter) && $matter)
    <tr>
        <td style="padding: 12px 20px;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                    <td width="50%" style="vertical-align: top;">
                        <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; display: block; margin-bottom: 2px;">Perkara</span>
                        <span style="font-size: 12px; font-weight: 600; color: #1e293b;">{{ $matter->matter_number }}</span>
                    </td>
                    <td width="50%" style="vertical-align: top;">
                        <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; display: block; margin-bottom: 2px;">Klien</span>
                        <span style="font-size: 12px; font-weight: 600; color: #1e293b;">{{ $matter->client?->display_name ?? '-' }}</span>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
    @endif
</table>

@if(isset($instructions) && $instructions)
<div style="background-color: #ffffff; border-left: 3px solid #dc2626; padding: 12px 16px; margin-bottom: 20px; font-size: 13px; line-height: 20px; color: #334155;">
    <strong style="color: #0f172a; display: block; margin-bottom: 4px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em;">Persiapan &amp; Alat Bukti yang Harus Dibawa:</strong>
    {!! nl2br(e($instructions)) !!}
</div>
@endif

<p style="margin: 0; font-size: 13px; line-height: 20px; color: #64748b;">
    Mohon persiapkan Surat Kuasa Khusus, berkas pembuktian asli dan leges, serta konfirmasi kehadiran advokat yang akan bersidang.
</p>
@endsection
