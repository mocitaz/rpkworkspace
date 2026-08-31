@extends('mail.layouts.rpk', [
    'subject' => '[Peringatan Kedaluwarsa Berkas] Dokumen Klien: ' . $clientName,
    'preheader' => 'Masa berlaku dokumen legalitas/kepatuhan klien akan segera habis: ' . $docName,
    'badgeText' => 'Kepatuhan & Legalitas Klien',
    'badgeBg' => '#fef3c7',
    'badgeColor' => '#b45309',
    'badgeBorder' => '#fde68a',
    'heading' => 'Peringatan Masa Berlaku Dokumen',
    'recipientName' => $recipientName ?? 'Tim Legal & Admin',
    'actionText' => 'Periksa Berkas Klien',
    'actionUrl' => $actionUrl ?? (config('app.url') . '/clients'),
])

@section('content')
<p style="margin: 0 0 16px 0; font-size: 14px; line-height: 22px; color: #475569;">
    Sistem kepatuhan mendeteksi bahwa dokumen legalitas/perizinan klien berikut akan <strong style="color: #b45309;">segera habis masa berlakunya</strong>:
</p>

<!-- Information Matrix Card -->
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 20px; overflow: hidden;">
    <tr>
        <td style="padding: 16px 20px; border-bottom: 1px solid #edf2f7;">
            <span style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 4px;">Nama Klien</span>
            <span style="font-size: 15px; font-weight: 800; color: #0f172a;">{{ $clientName }}</span>
        </td>
    </tr>
    <tr>
        <td style="padding: 12px 20px; border-bottom: 1px solid #edf2f7;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                    <td width="50%" style="vertical-align: top;">
                        <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; display: block; margin-bottom: 2px;">Jenis Dokumen</span>
                        <span style="font-size: 13px; font-weight: 700; color: #0f172a;">{{ $docName }}</span>
                    </td>
                    <td width="50%" style="vertical-align: top;">
                        <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; display: block; margin-bottom: 2px;">Tanggal Kedaluwarsa</span>
                        <span style="font-size: 13px; font-weight: 800; color: #dc2626;">{{ $expiryDate }}</span>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>

<p style="margin: 0; font-size: 13px; line-height: 20px; color: #64748b;">
    Mohon hubungi perwakilan klien untuk meminta salinan dokumen perpanjangan terbaru guna memastikan kepatuhan hukum dan validitas kuasa advokat tetap terjaga.
</p>
@endsection
