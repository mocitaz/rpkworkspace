@extends('mail.layouts.rpk', [
    'subject' => '[Hasil Sidang Dicatat] ' . ($matter ? $matter->matter_number . ' - ' : '') . $hearingTitle,
    'preheader' => 'Catatan hasil persidangan telah diperbarui: ' . $hearingTitle,
    'badgeText' => 'Catatan Hasil Sidang',
    'badgeBg' => '#ecfdf5',
    'badgeColor' => '#065f46',
    'badgeBorder' => '#a7f3d0',
    'heading' => 'Hasil Persidangan Dicatat',
    'recipientName' => $recipientName ?? 'Managing Partner & Tim',
    'actionText' => 'Baca Berita Acara & Catatan Sidang',
    'actionUrl' => $actionUrl ?? (config('app.url') . '/calendar'),
])

@section('content')
<p style="margin: 0 0 16px 0; font-size: 14px; line-height: 22px; color: #475569;">
    Rekan advokat <strong>{{ $attendedBy ?? 'Advokat Pendamping' }}</strong> telah selesai menghadiri persidangan dan mencatat resume persidangan:
</p>

<!-- Information Matrix Card -->
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 20px; overflow: hidden;">
    <tr>
        <td style="padding: 16px 20px; border-bottom: 1px solid #edf2f7;">
            <span style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 4px;">Agenda Sidang</span>
            <span style="font-size: 15px; font-weight: 800; color: #0f172a;">{{ $hearingTitle }}</span>
        </td>
    </tr>
    <tr>
        <td style="padding: 12px 20px; border-bottom: 1px solid #edf2f7;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                    <td width="50%" style="vertical-align: top;">
                        <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; display: block; margin-bottom: 2px;">Pengadilan</span>
                        <span style="font-size: 12px; font-weight: 700; color: #0f172a;">{{ $courtName ?? '-' }}</span>
                    </td>
                    <td width="50%" style="vertical-align: top;">
                        <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; display: block; margin-bottom: 2px;">Tanggal Sidang</span>
                        <span style="font-size: 12px; font-weight: 700; color: #0f172a;">{{ $hearingDate }}</span>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
    @if(isset($nextHearingDate) && $nextHearingDate)
    <tr>
        <td style="padding: 12px 20px; background-color: #f0fdf4;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                    <td width="50%" style="vertical-align: top;">
                        <span style="font-size: 10px; font-weight: 700; color: #166534; text-transform: uppercase; display: block; margin-bottom: 2px;">Sidang Lanjutan Berikutnya</span>
                        <span style="font-size: 13px; font-weight: 800; color: #15803d;">{{ $nextHearingDate }}</span>
                    </td>
                    <td width="50%" style="vertical-align: top;">
                        <span style="font-size: 10px; font-weight: 700; color: #166534; text-transform: uppercase; display: block; margin-bottom: 2px;">Agenda Lanjutan</span>
                        <span style="font-size: 12px; font-weight: 700; color: #166534;">{{ $nextHearingAgenda ?? 'Jawaban Tergugat / Replik' }}</span>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
    @endif
</table>

@if(isset($outcomeSummary) && $outcomeSummary)
<div style="background-color: #ffffff; border-left: 3px solid #059669; padding: 14px 18px; margin-bottom: 20px; font-size: 13px; line-height: 22px; color: #1e293b;">
    <strong style="color: #047857; display: block; margin-bottom: 6px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em;">Resume Jalannya Persidangan &amp; Perintah Hakim:</strong>
    {!! nl2br(e($outcomeSummary)) !!}
</div>
@endif

<p style="margin: 0; font-size: 13px; line-height: 20px; color: #64748b;">
    Detail lengkap serta salinan Berita Acara Persidangan (jika ada) dapat diunduh pada menu berkas perkara.
</p>
@endsection
