@extends('mail.layouts.rpk', [
    'subject' => '[Penugasan Klien] ' . $client->display_name,
    'preheader' => 'Anda telah ditunjuk sebagai Relationship Partner untuk klien: ' . $client->display_name,
    'badgeText' => 'Penugasan Klien Baru',
    'badgeBg' => '#f0fdf4',
    'badgeColor' => '#166534',
    'badgeBorder' => '#bbf7d0',
    'heading' => 'Penunjukan Relationship Partner',
    'recipientName' => $recipientName ?? 'Bapak/Ibu Partner',
    'actionText' => 'Buka Profil Klien di Workspace',
    'actionUrl' => $actionUrl ?? (config('app.url') . '/clients/' . $client->id),
])

@section('content')
<p style="margin: 0 0 16px 0; font-size: 14px; line-height: 22px; color: #475569;">
    Anda telah resmi ditunjuk sebagai <strong>Relationship Partner (Penanggung Jawab Klien)</strong> untuk entitas/klien berikut:
</p>

<!-- Information Matrix Card -->
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 20px; overflow: hidden;">
    <tr>
        <td style="padding: 16px 20px; border-bottom: 1px solid #edf2f7;">
            <span style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 4px;">Nama Entitas Klien</span>
            <span style="font-size: 15px; font-weight: 800; color: #0f172a;">{{ $client->display_name }}</span>
            @if($client->legal_name && $client->legal_name !== $client->display_name)
            <span style="font-size: 12px; font-weight: 500; color: #64748b; display: block; margin-top: 2px;">{{ $client->legal_name }}</span>
            @endif
        </td>
    </tr>
    <tr>
        <td style="padding: 12px 20px; border-bottom: 1px solid #edf2f7;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                    <td width="50%" style="vertical-align: top;">
                        <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; display: block; margin-bottom: 2px;">Klasifikasi / Tipe</span>
                        <span style="font-size: 12px; font-weight: 600; color: #1e293b;">{{ $client->type === 'organization' ? 'Badan Usaha / Korporasi' : 'Perorangan' }}</span>
                    </td>
                    <td width="50%" style="vertical-align: top;">
                        <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; display: block; margin-bottom: 2px;">Sektor Industri</span>
                        <span style="font-size: 12px; font-weight: 600; color: #1e293b;">{{ $client->industry ?? 'Umum' }}</span>
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
                        <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; display: block; margin-bottom: 2px;">Email Kontak</span>
                        <span style="font-size: 12px; font-weight: 600; color: #1e293b;">{{ $client->email ?? '-' }}</span>
                    </td>
                    <td width="50%" style="vertical-align: top;">
                        <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; display: block; margin-bottom: 2px;">Telepon</span>
                        <span style="font-size: 12px; font-weight: 600; color: #1e293b;">{{ $client->phone ?? '-' }}</span>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>

<p style="margin: 0; font-size: 13px; line-height: 20px; color: #64748b;">
    Sebagai Partner Penanggung Jawab, Anda dapat mengelola persetujuan KYC, memonitor penanganan seluruh perkara terkait, dan mengoordinasikan tagihan retainer klien.
</p>
@endsection
