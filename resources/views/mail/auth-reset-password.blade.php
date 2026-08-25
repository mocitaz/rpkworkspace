@extends('mail.layouts.rpk', [
    'subject' => '[Keamanan Akun] Permintaan Reset Password RPK Workspace',
    'preheader' => 'Gunakan tautan aman berikut untuk mengatur ulang password akun RPK Workspace Anda.',
    'heading' => 'Permintaan Reset Password',
    'recipientName' => $recipientName ?? 'Rekan Pengguna',
    'actionText' => 'Atur Ulang Password Saya',
    'actionUrl' => $resetUrl,
])

@section('content')
<p style="margin: 0 0 16px 0; font-size: 14px; line-height: 22px; color: #475569;">
    Kami menerima permintaan untuk mengatur ulang (*reset*) kata sandi akun <strong>RPK Law Firm Workspace</strong> Anda.
</p>

<p style="margin: 0 0 20px 0; font-size: 14px; line-height: 22px; color: #475569;">
    Silakan klik tombol di bawah untuk membuat kata sandi baru yang aman:
</p>

<div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 16px; margin-bottom: 20px; font-size: 12px; line-height: 18px; color: #64748b;">
    Tautan pengaturan ulang kata sandi ini akan kedaluwarsa secara otomatis dalam waktu <strong>60 menit</strong>.
</div>

<p style="margin: 0; font-size: 12px; line-height: 18px; color: #94a3b8;">
    Jika Anda tidak meminta pengaturan ulang kata sandi, abaikan email ini. Kata sandi akun Anda tetap aman dan tidak akan berubah tanpa konfirmasi melalui tautan di atas.
</p>
@endsection
