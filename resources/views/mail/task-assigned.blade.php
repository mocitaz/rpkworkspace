@extends('mail.layouts.rpk', [
    'subject' => '[Tugas Baru] ' . $task->title,
    'preheader' => 'Anda telah ditugaskan pada tugas baru: ' . $task->title,
    'heading' => 'Pemberitahuan Tugas Baru',
    'recipientName' => $recipientName ?? 'Rekan Kerja',
    'actionText' => 'Buka Detail Tugas',
    'actionUrl' => $actionUrl ?? (rtrim((string) config('app.url'), '/') . route('tasks.index', ['view' => 'mine'], false)),
])

@section('content')
<p style="margin: 0 0 18px 0; font-size: 14px; line-height: 22px; color: #475569;">
    Anda telah ditugaskan oleh <strong>{{ $task->reporter?->name ?? 'Managing Partner' }}</strong> untuk menangani tugas berikut:
</p>

<!-- Information Matrix Card -->
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; margin-bottom: 20px; overflow: hidden;">
    <tr>
        <td style="padding: 16px 20px; border-bottom: 1px solid #e2e8f0;">
            <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.06em; display: block; margin-bottom: 4px;">Judul Tugas</span>
            <span style="font-size: 14px; font-weight: 700; color: #0f172a; line-height: 20px; display: block;">{{ $task->title }}</span>
        </td>
    </tr>
    @if($task->matter)
    <tr>
        <td style="padding: 14px 20px; border-bottom: 1px solid #e2e8f0;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                    <td width="50%" style="vertical-align: top; padding-right: 10px;">
                        <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 3px;">Terkait Perkara</span>
                        <span style="font-size: 12.5px; font-weight: 600; color: #1e293b;">{{ $task->matter->matter_number }}</span>
                    </td>
                    <td width="50%" style="vertical-align: top; padding-left: 10px;">
                        <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 3px;">Klien</span>
                        <span style="font-size: 12.5px; font-weight: 600; color: #1e293b;">{{ $task->matter->client?->display_name ?? '-' }}</span>
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
                        <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 3px;">Prioritas</span>
                        <span style="font-size: 12px; font-weight: 700; color: {{ in_array($task->priority, ['urgent', 'critical', 'high']) ? '#dc2626' : '#334155' }}; text-transform: uppercase;">
                            {{ strtoupper($task->priority ?? 'Normal') }}
                        </span>
                    </td>
                    <td width="50%" style="vertical-align: top; padding-left: 10px;">
                        <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 3px;">Batas Waktu (Tenggat)</span>
                        <span style="font-size: 12.5px; font-weight: 600; color: #0f172a;">
                            {{ $task->due_at ? \Carbon\Carbon::parse($task->due_at)->translatedFormat('l, d F Y (H:i T)') : 'Tidak ditentukan' }}
                        </span>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>

@if($task->description)
<div style="background-color: #ffffff; border-left: 3px solid #0f172a; border-radius: 0 6px 6px 0; padding: 12px 16px; margin-bottom: 20px; font-size: 13px; line-height: 20px; color: #334155;">
    <strong style="color: #0f172a; display: block; margin-bottom: 4px; font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.05em;">Instruksi / Catatan:</strong>
    {!! nl2br(e($task->description)) !!}
</div>
@endif

<p style="margin: 0; font-size: 13px; line-height: 20px; color: #64748b;">
    Silakan klik tombol di bawah untuk melihat rincian tugas dan memperbarui progres pengerjaan Anda.
</p>
@endsection
