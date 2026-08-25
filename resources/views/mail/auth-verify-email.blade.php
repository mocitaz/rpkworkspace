@extends('mail.layouts.rpk', [
    'subject' => '[Verifikasi Email] Konfirmasi Alamat Email RPK Workspace',
    'preheader' => 'Verifikasi alamat email dinas Anda untuk mengaktifkan akses penuh ke RPK Law Firm Workspace.',
    'heading' => 'Verifikasi Alamat Email',
    'recipientName' => $recipientName ?? 'Rekan Pengguna',
    'actionText' => 'Verifikasi Alamat Email Saya',
    'actionUrl' => $verificationUrl,
])

@section('content')
<p style="margin: 0 0 16px 0; font-size: 14px; line-height: 22px; color: #475569;">
    Terima kasih telah bergabung dengan <strong>RPK Law Firm Workspace</strong>.
</p>

<p style="margin: 0 0 20px 0; font-size: 14px; line-height: 22px; color: #475569;">
    Untuk memastikan keamanan data perkara dan mengaktifkan notifikasi penugasan tugas resmi, silakan konfirmasi kepemilikan alamat email ini dengan mengklik tombol di bawah:
</p>

<p style="margin: 0; font-size: 12px; line-height: 18px; color: #94a3b8;">
    Jika Anda tidak mendaftarkan akun di sistem kami, tidak ada tindakan lebih lanjut yang diperlukan.
</p>
@endsection
