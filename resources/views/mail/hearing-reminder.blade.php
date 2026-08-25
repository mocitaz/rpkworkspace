@extends('mail.layouts.rpk', [
    'subject' => '[PENGINGAT SIDANG ' . ($daysBefore ?? 'H-1') . '] ' . $hearingTitle . ' (' . ($courtName ?? 'Pengadilan') . ')',
    'preheader' => 'Pengingat jadwal persidangan: ' . $hearingTitle . ' pada ' . $hearingDate,
    'badgeText' => 'Pengingat Jadwal Sidang ' . ($daysBefore ?? 'H-1'),
    'badgeBg' => '#fef2f2',
    'badgeColor' => '#991b1b',
    'badgeBorder' => '#fca5a5',
    'heading' => 'Pengingat Jadwal Sidang Pengadilan',
    'recipientName' => $recipientName ?? 'Tim Kuasa Hukum',
    'actionText' => 'Buka Detail Jadwal Sidang',
    'actionUrl' => $actionUrl ?? (config('app.url') . '/calendar'),
])

@section('content')
<p style="margin: 0 0 16px 0; font-size: 14px; line-height: 22px; color: #475569;">
    Ini adalah pengingat persidangan penting yang akan berlangsung dalam <strong style="color: #991b1b;">{{ $daysBefore ?? '1 hari ke depan' }}</strong>:
</p>

<!-- Information Matrix Card -->
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fff1f2; border: 1px solid #fecdd3; border-radius: 12px; margin-bottom: 20px; overflow: hidden;">
    <tr>
        <td style="padding: 16px 20px; border-bottom: 1px solid #fecdd3;">
            <span style="font-size: 11px; font-weight: 700; color: #9f1239; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 4px;">Agenda Sidang</span>
            <span style="font-size: 15px; font-weight: 800; color: #881337;">{{ $hearingTitle }}</span>
        </td>
    </tr>
    <tr>
        <td style="padding: 12px 20px; border-bottom: 1px solid #fecdd3; background-color: #ffffff;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                    <td width="50%" style="vertical-align: top;">
                        <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; display: block; margin-bottom: 2px;">Hari &amp; Tanggal</span>
                        <span style="font-size: 13px; font-weight: 800; color: #dc2626;">{{ $hearingDate }}</span>
                    </td>
                    <td width="50%" style="vertical-align: top;">
                        <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; display: block; margin-bottom: 2px;">Waktu</span>
                        <span style="font-size: 13px; font-weight: 700; color: #0f172a;">{{ $hearingTime ?? '09:00 WIB' }}</span>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
    <tr>
        <td style="padding: 12px 20px; background-color: #ffffff;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                    <td width="50%" style="vertical-align: top;">
                        <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; display: block; margin-bottom: 2px;">Pengadilan</span>
                        <span style="font-size: 12px; font-weight: 700; color: #0f172a;">{{ $courtName ?? '-' }}</span>
                    </td>
                    <td width="50%" style="vertical-align: top;">
                        <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; display: block; margin-bottom: 2px;">Ruang Sidang</span>
                        <span style="font-size: 12px; font-weight: 600; color: #1e293b;">{{ $courtRoom ?? '-' }}</span>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>

@if(isset($googleMapsUrl) && $googleMapsUrl)
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 20px;">
    <tr>
        <td style="background-color: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 8px; padding: 10px 14px;">
            <span style="font-size: 11px; color: #475569;">📍 <strong>Navigasi Lokasi Pengadilan:</strong> <a href="{{ $googleMapsUrl }}" target="_blank" style="color: #2563eb;">Buka Google Maps &rarr;</a></span>
        </td>
    </tr>
</table>
@endif

<p style="margin: 0; font-size: 13px; line-height: 20px; color: #64748b;">
    Harap memastikan advokat pendamping, kartu anggota advokat (KTA), berita acara sumpah (BAS), serta berkas persidangan telah lengkap dan siap sebelum jam keberangkatan.
</p>
@endsection
