@extends('mail.layouts.rpk', [
    'subject' => '[E-Sign Selesai] ' . $document->title . ' (Telah Disahkan)',
    'preheader' => 'Dokumen resmi telah selesai ditandatangani secara digital oleh seluruh pihak.',
    'badgeText' => 'E-Signature Executed & Validated',
    'badgeBg' => '#ecfdf5',
    'badgeColor' => '#047857',
    'badgeBorder' => '#a7f3d0',
    'heading' => 'Dokumen Telah Sah Ditandatangani',
    'recipientName' => $recipientName ?? 'Tim Perkara & Partner',
    'actionText' => 'Unduh Berkas PDF Final & Sertifikat',
    'actionUrl' => $actionUrl ?? (config('app.url') . '/documents/' . $document->id),
])

@section('content')
<p style="margin: 0 0 16px 0; font-size: 14px; line-height: 22px; color: #475569;">
    Pemberitahuan resmi: Dokumen berikut telah berhasil <strong style="color: #047857;">ditandatangani dan disahkan</strong> secara digital dengan integritas kriptografi bersertifikat:
</p>

<!-- Information Matrix Card -->
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 20px; overflow: hidden;">
    <tr>
        <td style="padding: 16px 20px; border-bottom: 1px solid #edf2f7; background-color: #f0fdf4;">
            <span style="font-size: 11px; font-weight: 700; color: #166534; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 4px;">Nama Dokumen</span>
            <span style="font-size: 15px; font-weight: 800; color: #14532d;">{{ $document->title }}</span>
        </td>
    </tr>
    <tr>
        <td style="padding: 12px 20px; border-bottom: 1px solid #edf2f7;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                    <td width="50%" style="vertical-align: top;">
                        <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; display: block; margin-bottom: 2px;">Penandatangan Utama</span>
                        <span style="font-size: 12px; font-weight: 700; color: #0f172a;">{{ $signerName ?? $document->matter?->client?->display_name ?? 'Klien / Pihak Terkait' }}</span>
                    </td>
                    <td width="50%" style="vertical-align: top;">
                        <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; display: block; margin-bottom: 2px;">Waktu Pengesahan</span>
                        <span style="font-size: 12px; font-weight: 700; color: #047857;">{{ now()->translatedFormat('l, d F Y (H:i T)') }}</span>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
    @if(isset($securityHash) && $securityHash)
    <tr>
        <td style="padding: 12px 20px;">
            <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; display: block; margin-bottom: 2px;">Digital Audit Hash (SHA-256)</span>
            <code style="font-size: 11px; font-family: monospace; color: #0284c7; word-break: break-all;">{{ $securityHash }}</code>
        </td>
    </tr>
    @endif
</table>

<p style="margin: 0; font-size: 13px; line-height: 20px; color: #64748b;">
    Salinan dokumen final yang telah tertera QR Code verifikasi dan jejak audit digital (Audit Trail Log) telah tersimpan aman di repositori dokumen perkara.
</p>
@endsection
