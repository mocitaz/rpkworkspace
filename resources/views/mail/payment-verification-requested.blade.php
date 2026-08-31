@extends('mail.layouts.rpk', [
    'subject' => '[Verifikasi Pembayaran Masuk] Tagihan: ' . $invoiceNumber . ' (' . $clientName . ')',
    'preheader' => 'Klien telah mengunggah bukti pelunasan invoice sebesar: ' . $amountPaid,
    'badgeText' => 'Verifikasi Pembayaran Invoice',
    'badgeBg' => '#f0fdf4',
    'badgeColor' => '#15803d',
    'badgeBorder' => '#bbf7d0',
    'heading' => 'Verifikasi Pembayaran Klien Masuk',
    'recipientName' => $recipientName ?? 'Tim Finance & Billing',
    'actionText' => 'Tinjau Bukti Pembayaran',
    'actionUrl' => $actionUrl ?? (config('app.url') . '/finance'),
])

@section('content')
<p style="margin: 0 0 16px 0; font-size: 14px; line-height: 22px; color: #475569;">
    Pemberitahuan: Pembayaran baru dari klien <strong>{{ $clientName }}</strong> telah dicatat dan membutuhkan konfirmasi bagian keuangan:
</p>

<!-- Information Matrix Card -->
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 20px; overflow: hidden;">
    <tr>
        <td style="padding: 16px 20px; border-bottom: 1px solid #edf2f7; background-color: #f0fdf4;">
            <span style="font-size: 11px; font-weight: 700; color: #166534; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 4px;">Jumlah Pembayaran</span>
            <span style="font-size: 20px; font-weight: 800; color: #14532d;">{{ $amountPaid }}</span>
        </td>
    </tr>
    <tr>
        <td style="padding: 12px 20px; border-bottom: 1px solid #edf2f7;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                    <td width="50%" style="vertical-align: top;">
                        <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; display: block; margin-bottom: 2px;">Nomor Invoice</span>
                        <span style="font-size: 12px; font-weight: 700; color: #0f172a;">{{ $invoiceNumber }}</span>
                    </td>
                    <td width="50%" style="vertical-align: top;">
                        <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; display: block; margin-bottom: 2px;">Metode Pembayaran</span>
                        <span style="font-size: 12px; font-weight: 600; color: #1e293b;">{{ $paymentMethod ?? 'Transfer Bank (BCA Escrow)' }}</span>
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
                        <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; display: block; margin-bottom: 2px;">Tanggal Transaksi</span>
                        <span style="font-size: 12px; font-weight: 600; color: #1e293b;">{{ $paymentDate ?? now()->translatedFormat('d F Y') }}</span>
                    </td>
                    <td width="50%" style="vertical-align: top;">
                        <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; display: block; margin-bottom: 2px;">Nomor Referensi Bank</span>
                        <span style="font-size: 12px; font-weight: 600; color: #1e293b;">{{ $bankReference ?? '-' }}</span>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>

<p style="margin: 0; font-size: 13px; line-height: 20px; color: #64748b;">
    Silakan cocokkan mutasi rekening bank dengan bukti transfer yang terlampir. Setelah diverifikasi, Anda dapat langsung menerbitkan Kwitansi Resmi (*Official Receipt*) dari sistem.
</p>
@endsection
