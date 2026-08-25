@extends('mail.layouts.rpk', [
    'subject' => '[Permintaan Telaah Dokumen] ' . $document->title,
    'preheader' => 'Rekan kerja meminta review dan persetujuan draf dokumen: ' . $document->title,
    'badgeText' => 'Permintaan Telaah Dokumen',
    'badgeBg' => '#fef3c7',
    'badgeColor' => '#92400e',
    'badgeBorder' => '#fde68a',
    'heading' => 'Permintaan Telaah & Review Dokumen',
    'recipientName' => $recipientName ?? 'Bapak/Ibu Reviewer',
    'actionText' => 'Buka Dokumen untuk Direview',
    'actionUrl' => $actionUrl ?? (config('app.url') . '/documents/' . $document->id),
])

@section('content')
<p style="margin: 0 0 16px 0; font-size: 14px; line-height: 22px; color: #475569;">
    Rekan <strong>{{ $requestedBy ?? $document->creator?->name ?? 'Pembuat Dokumen' }}</strong> mengajukan draf dokumen hukum berikut untuk Anda telaah:
</p>

<!-- Information Matrix Card -->
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 20px; overflow: hidden;">
    <tr>
        <td style="padding: 16px 20px; border-bottom: 1px solid #edf2f7;">
            <span style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 4px;">Nama Dokumen</span>
            <span style="font-size: 15px; font-weight: 800; color: #0f172a;">{{ $document->title }}</span>
            <span style="font-size: 12px; font-weight: 500; color: #64748b; display: block; margin-top: 2px;">{{ $document->file_name ?? $document->title }}</span>
        </td>
    </tr>
    <tr>
        <td style="padding: 12px 20px; border-bottom: 1px solid #edf2f7;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                    <td width="50%" style="vertical-align: top;">
                        <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; display: block; margin-bottom: 2px;">Kategori Dokumen</span>
                        <span style="font-size: 12px; font-weight: 600; color: #1e293b;">{{ strtoupper(str_replace('_', ' ', $document->category ?? 'Perjanjian / Kontrak')) }}</span>
                    </td>
                    <td width="50%" style="vertical-align: top;">
                        <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; display: block; margin-bottom: 2px;">Versi</span>
                        <span style="font-size: 12px; font-weight: 700; color: #2563eb;">v{{ $document->current_version ?? '1.0' }}</span>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
    @if($document->matter)
    <tr>
        <td style="padding: 12px 20px;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                    <td width="50%" style="vertical-align: top;">
                        <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; display: block; margin-bottom: 2px;">Perkara Terkait</span>
                        <span style="font-size: 12px; font-weight: 600; color: #1e293b;">{{ $document->matter->matter_number }}</span>
                    </td>
                    <td width="50%" style="vertical-align: top;">
                        <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; display: block; margin-bottom: 2px;">Klien</span>
                        <span style="font-size: 12px; font-weight: 600; color: #1e293b;">{{ $document->matter->client?->display_name ?? '-' }}</span>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
    @endif
</table>

@if(isset($reviewNotes) && $reviewNotes)
<div style="background-color: #ffffff; border-left: 3px solid #d97706; padding: 12px 16px; margin-bottom: 20px; font-size: 13px; line-height: 20px; color: #334155;">
    <strong style="color: #0f172a; display: block; margin-bottom: 4px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em;">Catatan Pembuat Draf:</strong>
    {!! nl2br(e($reviewNotes)) !!}
</div>
@endif

<p style="margin: 0; font-size: 13px; line-height: 20px; color: #64748b;">
    Silakan klik tombol di bawah untuk membaca pratinjau dokumen, memberikan koreksi klausul (*in-line annotations*), atau menyetujui draf final.
</p>
@endsection
