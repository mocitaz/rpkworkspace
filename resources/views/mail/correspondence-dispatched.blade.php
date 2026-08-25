@extends('mail.layouts.rpk', [
    'subject' => '[Disposisi Korespondensi] ' . $correspondence->subject,
    'preheader' => 'Disposisi surat / pesan masuk resmi: ' . $correspondence->subject,
    'heading' => 'Disposisi Surat Masuk Resmi',
    'recipientName' => $recipientName ?? 'Rekan Advokat',
    'actionText' => 'Buka Berkas di Workspace',
    'actionUrl' => $actionUrl ?? ('https://app.rpklawoffice.com/correspondences/' . $correspondence->id),
])

@section('content')
<p style="margin: 0 0 18px 0; font-size: 14px; line-height: 22px; color: #475569;">
    Sekretariat telah mencatat dan mendisposisikan korespondensi / surat resmi berikut untuk Anda tindak lanjuti:
</p>

<!-- Information Matrix Card -->
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; margin-bottom: 20px; overflow: hidden;">
    <tr>
        <td style="padding: 16px 20px; border-bottom: 1px solid #e2e8f0;">
            <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.06em; display: block; margin-bottom: 4px;">Perihal Surat / Pesan</span>
            <span style="font-size: 14px; font-weight: 700; color: #0f172a; line-height: 20px; display: block;">{{ $correspondence->subject }}</span>
        </td>
    </tr>
    <tr>
        <td style="padding: 14px 20px; border-bottom: 1px solid #e2e8f0;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                    <td width="50%" style="vertical-align: top; padding-right: 10px;">
                        <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 3px;">Arah Korespondensi</span>
                        <span style="font-size: 12.5px; font-weight: 600; color: #1e293b; text-transform: uppercase;">{{ $correspondence->direction === 'inbound' ? 'Surat Masuk (Inbound)' : 'Surat Keluar (Outbound)' }}</span>
                    </td>
                    <td width="50%" style="vertical-align: top; padding-left: 10px;">
                        <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 3px;">Sumber / Kanal</span>
                        <span style="font-size: 12.5px; font-weight: 600; color: #1e293b; text-transform: uppercase;">{{ $correspondence->source ?? 'Manual' }}</span>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
    @if($correspondence->matter)
    <tr>
        <td style="padding: 14px 20px; border-bottom: 1px solid #e2e8f0;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                    <td width="50%" style="vertical-align: top; padding-right: 10px;">
                        <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 3px;">Perkara Terkait</span>
                        <span style="font-size: 12.5px; font-weight: 600; color: #1e293b;">{{ $correspondence->matter->matter_number }}</span>
                    </td>
                    <td width="50%" style="vertical-align: top; padding-left: 10px;">
                        <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 3px;">Klien</span>
                        <span style="font-size: 12.5px; font-weight: 600; color: #1e293b;">{{ $correspondence->matter->client?->display_name ?? '-' }}</span>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
    @endif
    <tr>
        <td style="padding: 14px 20px;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                    <td width="50%" style="vertical-align: top; padding-right: 10px;">
                        <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 3px;">Pengirim</span>
                        <span style="font-size: 12px; font-weight: 600; color: #0f172a;">
                            {{ is_array($correspondence->from_addresses) ? implode(', ', $correspondence->from_addresses) : ($correspondence->from_addresses ?? 'Pihak Terkait') }}
                        </span>
                    </td>
                    <td width="50%" style="vertical-align: top; padding-left: 10px;">
                        <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 3px;">Waktu Kejadian</span>
                        <span style="font-size: 12.5px; font-weight: 600; color: #0f172a;">
                            {{ $correspondence->occurred_at ? \Carbon\Carbon::parse($correspondence->occurred_at)->translatedFormat('l, d F Y') : now()->translatedFormat('l, d F Y') }}
                        </span>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>

@if(isset($dispositionNote) && $dispositionNote)
<div style="background-color: #ffffff; border-left: 3px solid #0f172a; border-radius: 0 6px 6px 0; padding: 12px 16px; margin-bottom: 20px; font-size: 13px; line-height: 20px; color: #334155;">
    <strong style="color: #0f172a; display: block; margin-bottom: 4px; font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.05em;">Instruksi Disposisi:</strong>
    {!! nl2br(e($dispositionNote)) !!}
</div>
@endif

<p style="margin: 0; font-size: 13px; line-height: 20px; color: #64748b;">
    Silakan periksa pindaian (scan) berkas surat dan lampiran pendukung melalui tombol di bawah.
</p>
@endsection
