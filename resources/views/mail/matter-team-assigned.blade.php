@extends('mail.layouts.rpk', [
    'subject' => '[Penugasan Perkara] ' . $matter->matter_number . ' - ' . $matter->title,
    'preheader' => 'Anda telah ditambahkan ke dalam tim kuasa hukum perkara: ' . $matter->title,
    'badgeText' => 'Tim Kuasa Hukum Perkara',
    'badgeBg' => '#f5f3ff',
    'badgeColor' => '#6d28d9',
    'badgeBorder' => '#ddd6fe',
    'heading' => 'Penugasan Perkara Baru',
    'recipientName' => $recipientName ?? 'Rekan Advokat',
    'actionText' => 'Buka Berkas Perkara di Workspace',
    'actionUrl' => $actionUrl ?? (config('app.url') . '/matters/' . $matter->id),
])

@section('content')
<p style="margin: 0 0 16px 0; font-size: 14px; line-height: 22px; color: #475569;">
    Anda telah ditunjuk sebagai bagian dari <strong>Tim Kuasa Hukum</strong> untuk menangani perkara hukum berikut:
</p>

<!-- Information Matrix Card -->
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 20px; overflow: hidden;">
    <tr>
        <td style="padding: 16px 20px; border-bottom: 1px solid #edf2f7;">
            <span style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 4px;">Nomor &amp; Judul Perkara</span>
            <span style="font-size: 15px; font-weight: 800; color: #0f172a;">{{ $matter->matter_number }}</span>
            <span style="font-size: 13px; font-weight: 600; color: #334155; display: block; margin-top: 2px;">{{ $matter->title }}</span>
        </td>
    </tr>
    <tr>
        <td style="padding: 12px 20px; border-bottom: 1px solid #edf2f7;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                    <td width="50%" style="vertical-align: top;">
                        <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; display: block; margin-bottom: 2px;">Klien</span>
                        <span style="font-size: 12px; font-weight: 700; color: #0f172a;">{{ $matter->client?->display_name ?? '-' }}</span>
                    </td>
                    <td width="50%" style="vertical-align: top;">
                        <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; display: block; margin-bottom: 2px;">Bidang Praktik</span>
                        <span style="font-size: 12px; font-weight: 600; color: #1e293b;">{{ $matter->practiceArea?->name ?? 'Litigasi & Penyelesaian Sengketa' }}</span>
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
                        <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; display: block; margin-bottom: 2px;">Lead Partner</span>
                        <span style="font-size: 12px; font-weight: 700; color: #6d28d9;">{{ $matter->responsiblePartner?->name ?? 'Managing Partner' }}</span>
                    </td>
                    <td width="50%" style="vertical-align: top;">
                        <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; display: block; margin-bottom: 2px;">Status / Tahapan</span>
                        <span style="font-size: 12px; font-weight: 700; color: #2563eb; text-transform: uppercase;">
                            {{ strtoupper(str_replace('_', ' ', $matter->status ?? 'Active')) }}
                        </span>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>

@if($matter->description)
<div style="background-color: #ffffff; border-left: 3px solid #6d28d9; padding: 12px 16px; margin-bottom: 20px; font-size: 13px; line-height: 20px; color: #334155;">
    <strong style="color: #0f172a; display: block; margin-bottom: 4px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em;">Ringkasan Pokok Perkara:</strong>
    {!! nl2br(e($matter->description)) !!}
</div>
@endif

<p style="margin: 0; font-size: 13px; line-height: 20px; color: #64748b;">
    Seluruh berkas perkara, jadwal persidangan, riwayat bukti, dan catatan diskusi dapat Anda akses secara komprehensif pada menu Perkara di bawah ini.
</p>
@endsection
