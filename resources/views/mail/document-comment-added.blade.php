@extends('mail.layouts.rpk', [
    'subject' => '[Komentar Dokumen Baru] ' . $document->title,
    'preheader' => 'Rekan kerja menambahkan catatan baru pada dokumen: ' . $document->title,
    'badgeText' => 'Catatan Diskusi Dokumen',
    'badgeBg' => '#f1f5f9',
    'badgeColor' => '#334155',
    'badgeBorder' => '#cbd5e1',
    'heading' => 'Catatan Baru pada Dokumen',
    'recipientName' => $recipientName ?? 'Rekan Kerja',
    'actionText' => 'Balas Catatan di Workspace',
    'actionUrl' => $actionUrl ?? (config('app.url') . '/documents/' . $document->id),
])

@section('content')
<p style="margin: 0 0 16px 0; font-size: 14px; line-height: 22px; color: #475569;">
    Rekan <strong>{{ $commenterName ?? 'Rekan Kerja' }}</strong> telah menambahkan catatan/revisi pada dokumen:
</p>

<!-- Information Matrix Card -->
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 20px; overflow: hidden;">
    <tr>
        <td style="padding: 16px 20px; border-bottom: 1px solid #edf2f7;">
            <span style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 4px;">Nama Dokumen</span>
            <span style="font-size: 14px; font-weight: 700; color: #0f172a;">{{ $document->title }}</span>
        </td>
    </tr>
    @if(isset($clauseRef) && $clauseRef)
    <tr>
        <td style="padding: 12px 20px; border-bottom: 1px solid #edf2f7;">
            <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; display: block; margin-bottom: 2px;">Referensi Pasal / Klausul</span>
            <span style="font-size: 12px; font-weight: 600; color: #2563eb;">{{ $clauseRef }}</span>
        </td>
    </tr>
    @endif
</table>

<!-- Comment Box -->
<div style="background-color: #ffffff; border-left: 3px solid #2563eb; padding: 14px 18px; margin-bottom: 20px; font-size: 13px; line-height: 22px; color: #1e293b; border-radius: 0 8px 8px 0; box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
    <strong style="color: #2563eb; display: block; margin-bottom: 6px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em;">Isi Komentar:</strong>
    "{!! nl2br(e($commentBody)) !!}"
</div>

<p style="margin: 0; font-size: 13px; line-height: 20px; color: #64748b;">
    Anda dapat membalas tanggapan ini langsung pada panel diskusi interaktif dokumen.
</p>
@endsection
