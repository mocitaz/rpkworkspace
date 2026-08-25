@extends('mail.layouts.rpk', [
    'subject' => '[Selamat Datang] Akun Workspace Anda Telah Dibuat - RPK Law Firm',
    'preheader' => 'Selamat bergabung di tim RPK Law Firm. Berikut informasi kredensial akun workspace Anda.',
    'heading' => 'Selamat Datang di RPK Law Firm',
    'recipientName' => $user->name,
    'actionText' => 'Masuk ke Workspace',
    'actionUrl' => $actionUrl ?? ('https://app.rpklawoffice.com/login'),
])

@section('content')
<p style="margin: 0 0 16px 0; font-size: 14px; line-height: 22px; color: #475569;">
    Administrator telah membuatkan akun akses resmi <strong>RPK Law Firm Legal &amp; Case Management Workspace</strong> untuk Anda.
</p>

<!-- Information Matrix Card -->
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; margin-bottom: 20px; overflow: hidden;">
    <tr>
        <td style="padding: 14px 20px; border-bottom: 1px solid #e2e8f0;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                    <td width="50%" style="vertical-align: top; padding-right: 10px;">
                        <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 3px;">Email Login</span>
                        <span style="font-size: 13px; font-weight: 600; color: #0f172a;">{{ $user->email }}</span>
                    </td>
                    <td width="50%" style="vertical-align: top; padding-left: 10px;">
                        <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 3px;">Posisi / Jabatan</span>
                        <span style="font-size: 13px; font-weight: 600; color: #0f172a;">{{ $user->position_title ?? 'Staff / Associate' }}</span>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
    @if(isset($initialPassword) && $initialPassword)
    <tr>
        <td style="padding: 14px 20px;">
            <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 3px;">Password Sementara</span>
            <span style="font-size: 13px; font-weight: 700; font-family: monospace; color: #0f172a; background-color: #ffffff; border: 1px solid #cbd5e1; border-radius: 6px; padding: 3px 8px; display: inline-block;">
                {{ $initialPassword }}
            </span>
            <span style="font-size: 11px; color: #64748b; display: block; margin-top: 5px;">
                Demi alasan keamanan, Anda disarankan untuk segera mengganti kata sandi ini setelah login pertama kali.
            </span>
        </td>
    </tr>
    @endif
</table>

<p style="margin: 0; font-size: 13px; line-height: 20px; color: #64748b;">
    Silakan klik tombol di bawah untuk langsung menuju halaman login workspace dan mulai mengelola berkas perkara serta tugas Anda.
</p>
@endsection
