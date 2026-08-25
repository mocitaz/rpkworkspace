@extends('mail.layouts.rpk', [
    'subject' => '[Update Tahapan Perkara] ' . $matter->matter_number . ' - ' . $newStage,
    'preheader' => 'Pembaruan tahapan perkara: ' . $matter->matter_number . ' berpindah ke ' . $newStage,
    'badgeText' => 'Perubahan Tahapan Kasus',
    'badgeBg' => '#f0f9ff',
    'badgeColor' => '#0369a1',
    'badgeBorder' => '#bae6fd',
    'heading' => 'Perkembangan Tahapan Perkara',
    'recipientName' => $recipientName ?? 'Tim Kuasa Hukum',
    'actionText' => 'Buka Linimasa Perkara',
    'actionUrl' => $actionUrl ?? (config('app.url') . '/matters/' . $matter->id),
])

@section('content')
<p style="margin: 0 0 16px 0; font-size: 14px; line-height: 22px; color: #475569;">
    Perkara <strong>{{ $matter->matter_number }} ({{ $matter->title }})</strong> telah resmi diperbarui tahapannya oleh <strong>{{ $updatedBy ?? 'Lead Partner' }}</strong>:
</p>

<!-- Information Matrix Card -->
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 20px; overflow: hidden;">
    <tr>
        <td style="padding: 16px 20px; border-bottom: 1px solid #edf2f7; background-color: #ffffff;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                    <td width="45%" style="vertical-align: middle; text-align: center; padding: 8px;">
                        <span style="font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; display: block; margin-bottom: 2px;">Tahapan Sebelumnya</span>
                        <span style="font-size: 13px; font-weight: 700; color: #64748b; text-decoration: line-through;">{{ $oldStage ?? 'Tahap Awal' }}</span>
                    </td>
                    <td width="10%" style="vertical-align: middle; text-align: center;">
                        <span style="font-size: 18px; color: #0284c7; font-weight: bold;">&rarr;</span>
                    </td>
                    <td width="45%" style="vertical-align: middle; text-align: center; padding: 8px; background-color: #f0f9ff; border-radius: 8px; border: 1px solid #bae6fd;">
                        <span style="font-size: 10px; font-weight: 700; color: #0369a1; text-transform: uppercase; display: block; margin-bottom: 2px;">Tahapan Baru</span>
                        <span style="font-size: 14px; font-weight: 800; color: #0369a1;">{{ $newStage }}</span>
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
                        <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; display: block; margin-bottom: 2px;">Klien</span>
                        <span style="font-size: 12px; font-weight: 700; color: #0f172a;">{{ $matter->client?->display_name ?? '-' }}</span>
                    </td>
                    <td width="50%" style="vertical-align: top;">
                        <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; display: block; margin-bottom: 2px;">Waktu Pembaruan</span>
                        <span style="font-size: 12px; font-weight: 700; color: #0f172a;">{{ now()->translatedFormat('l, d F Y (H:i T)') }}</span>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>

@if(isset($notes) && $notes)
<div style="background-color: #ffffff; border-left: 3px solid #0284c7; padding: 12px 16px; margin-bottom: 20px; font-size: 13px; line-height: 20px; color: #334155;">
    <strong style="color: #0f172a; display: block; margin-bottom: 4px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em;">Catatan Milestone:</strong>
    {!! nl2br(e($notes)) !!}
</div>
@endif

<p style="margin: 0; font-size: 13px; line-height: 20px; color: #64748b;">
    Silakan sesuaikan agenda sidang, checklist dokumen pembuktian, atau rencana kerja tim kuasa hukum pada berkas perkara terkait.
</p>
@endsection
