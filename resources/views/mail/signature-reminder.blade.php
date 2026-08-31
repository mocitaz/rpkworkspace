@extends('mail.layouts.rpk', [
    'subject' => '[Pengingat Tanda Tangan] Dokumen Menunggu Persetujuan Anda',
    'preheader' => 'Dokumen RPK Law Firm masih menunggu tanda tangan Anda.',
    'badgeText' => 'Menunggu Tanda Tangan',
    'badgeBg' => '#fff7ed',
    'badgeColor' => '#c2410c',
    'badgeBorder' => '#fed7aa',
    'heading' => 'Pengingat Tanda Tangan Dokumen',
    'recipientName' => $signer->name,
    'actionText' => 'Tanda Tangani Dokumen',
    'actionUrl' => $actionUrl,
])

@section('content')
<p style="margin: 0 0 16px 0; color: #475569; font-size: 14px; line-height: 22px;">
    Dokumen berikut masih menunggu tanda tangan elektronik Anda di RPK Law Firm Workspace.
</p>

<table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="margin-bottom: 20px; overflow: hidden; border: 1px solid #e2e8f0; border-radius: 10px; background-color: #f8fafc;">
    <tr>
        <td style="padding: 16px 20px;">
            <span style="display: block; margin-bottom: 4px; color: #64748b; font-size: 10px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;">Dokumen</span>
            <span style="display: block; color: #0f172a; font-size: 14px; font-weight: 700; line-height: 20px;">
                {{ $signer->signatureRequest?->document?->title ?? 'Dokumen untuk Ditandatangani' }}
            </span>
        </td>
    </tr>
</table>

<p style="margin: 0; color: #64748b; font-size: 12px; line-height: 18px;">
    Jika Anda tidak mengenali permintaan ini, jangan membuka tautan dan segera hubungi RPK Law Firm.
</p>
@endsection
