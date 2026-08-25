@extends('mail.layouts.rpk', [
    'subject' => '[Keamanan Akun] Peringatan Aktivitas Akun: ' . $activityType,
    'preheader' => 'Peringatan keamanan: ' . $activityType . ' pada akun RPK Workspace Anda.',
    'heading' => 'Pemberitahuan Keamanan Akun',
    'recipientName' => $recipientName ?? 'Rekan Pengguna',
    'actionText' => 'Periksa Pengaturan Keamanan',
    'actionUrl' => $actionUrl ?? ('https://app.rpklawoffice.com/settings/security'),
])

@section('content')
<p style="margin: 0 0 18px 0; font-size: 14px; line-height: 22px; color: #475569;">
    Sistem mendeteksi adanya aktivitas keamanan baru pada akun RPK Law Firm Workspace Anda:
</p>

<!-- Information Matrix Card -->
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; margin-bottom: 20px; overflow: hidden;">
    <tr>
        <td style="padding: 16px 20px; border-bottom: 1px solid #e2e8f0;">
            <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.06em; display: block; margin-bottom: 4px;">Jenis Aktivitas</span>
            <span style="font-size: 14px; font-weight: 700; color: #0f172a; line-height: 20px; display: block;">{{ $activityType }}</span>
        </td>
    </tr>
    <tr>
        <td style="padding: 14px 20px; border-bottom: 1px solid #e2e8f0;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                    <td width="50%" style="vertical-align: top; padding-right: 10px;">
                        <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 3px;">Waktu &amp; Tanggal</span>
                        <span style="font-size: 12.5px; font-weight: 600; color: #1e293b;">{{ $eventTime ?? now()->translatedFormat('l, d F Y (H:i T)') }}</span>
                    </td>
                    <td width="50%" style="vertical-align: top; padding-left: 10px;">
                        <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 3px;">Alamat IP</span>
                        <span style="font-size: 12.5px; font-weight: 600; color: #1e293b; font-family: monospace;">{{ $ipAddress ?? '127.0.0.1' }}</span>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
    <tr>
        <td style="padding: 14px 20px;">
            <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 3px;">Perangkat &amp; Browser</span>
            <span style="font-size: 12px; font-weight: 500; color: #334155;">{{ $userAgent ?? 'Web Browser' }}</span>
        </td>
    </tr>
</table>

<div style="background-color: #fff1f2; border-left: 3px solid #dc2626; border-radius: 0 6px 6px 0; padding: 12px 16px; margin-bottom: 20px; font-size: 12.5px; line-height: 19px; color: #991b1b;">
    <strong>Bukan Anda yang melakukan aktivitas ini?</strong> Segera lakukan reset password akun Anda dan aktifkan verifikasi dua langkah (2FA / Passkey) untuk mengamankan akses data perkara klien.
</div>
@endsection
