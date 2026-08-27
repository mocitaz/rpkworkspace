<!doctype html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <title>Laporan Perkembangan Perkara {{ $matter->matter_number }} — RPK Law Firm</title>
    <style>
        @page { margin: 32px 40px 42px; size: A4 portrait; }
        * { box-sizing: border-box; }
        body { margin: 0; color: #1e293b; font-family: "DejaVu Sans", Helvetica, Arial, sans-serif; font-size: 8px; line-height: 1.48; }
        table { width: 100%; border-collapse: collapse; }
        .mono { font-family: "DejaVu Sans Mono", monospace; }
        .navy { color: #0a1b33; }
        .gold { color: #8f6a22; }
        .muted { color: #64748b; }
        .right { text-align: right; }
        .center { text-align: center; }

        /* Letterhead Header */
        .letterhead { margin-bottom: 14px; }
        .letterhead td { vertical-align: middle; }
        .logo-cell { width: 55%; }
        .logo-crop { width: 195px; height: 62px; overflow: hidden; }
        .logo-crop img { width: 195px; height: auto; margin-top: -24px; }
        .office-cell { width: 45%; color: #475569; font-size: 7.2px; line-height: 1.55; text-align: right; }
        .gold-rule { height: 2px; border-top: 1.5px solid #8f6a22; border-bottom: 1px solid #e2d2aa; margin-bottom: 18px; }

        /* Title Box */
        .title-box { margin-bottom: 16px; }
        .title-badge { display: inline-block; background: #0a1b33; color: #ffffff; padding: 2.5px 8px; font-size: 6.8px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; border-radius: 3px; }
        .doc-title { margin-top: 5px; font-size: 18px; font-weight: bold; color: #0a1b33; }
        .doc-subtitle { margin-top: 2px; font-size: 7.5px; color: #64748b; }

        /* Meta Card */
        .meta-card { background: #f8fafc; border: 1px solid #cbd5e1; padding: 10px 14px; margin-bottom: 14px; border-radius: 5px; }
        .meta-table td { padding: 2.5px 0; font-size: 7.8px; vertical-align: top; }
        .meta-label { width: 28%; color: #64748b; font-weight: bold; }
        .meta-value { width: 72%; color: #0f172a; font-weight: bold; }

        .section-header { font-size: 8.5px; font-weight: bold; color: #0a1b33; text-transform: uppercase; letter-spacing: .8px; margin-top: 14px; margin-bottom: 6px; padding-bottom: 3px; border-bottom: 1.5px solid #0a1b33; }

        .custom-table th { background: #0a1b33; color: #ffffff; font-size: 7px; font-weight: bold; padding: 6px 8px; text-align: left; text-transform: uppercase; letter-spacing: .5px; }
        .custom-table td { padding: 7px 8px; border-bottom: 1px solid #e2e8f0; font-size: 7.5px; vertical-align: top; }

        .tag-status { display: inline-block; background: #ecfdf5; color: #047857; padding: 2px 6px; font-size: 6.8px; font-weight: bold; border-radius: 3px; }

        /* Signature Block */
        .signature-block { margin-top: 26px; page-break-inside: avoid; }
        .signature-block td { vertical-align: top; }
        .sig-col { width: 45%; }
        .sig-space { height: 42px; }
        .sig-line { width: 170px; border-top: 1px solid #0a1b33; margin-top: 3px; margin-bottom: 3px; }

        .watermark { position: fixed; top: 38%; left: 0; width: 100%; text-align: center; transform: rotate(-25deg); opacity: 0.04; font-size: 26px; font-weight: bold; color: #0a1b33; z-index: -1000; }
        .footer { margin-top: 22px; padding-top: 8px; border-top: 1px solid #cbd5e1; font-size: 6.8px; color: #64748b; }
    </style>
</head>
<body>

    <div class="watermark">
        DIUNDUH OLEH {{ strtoupper(auth()->user()->name ?? 'RPK USER') }}<br>
        {{ now()->format('Y-m-d H:i') }} WIB · LAPORAN PERKARA RESMI RPK LAW FIRM
    </div>

    <!-- Letterhead Header -->
    <table class="letterhead">
        <tr>
            <td class="logo-cell">
                <div class="logo-crop">
                    <img src="{{ public_path('logo/logo.png') }}" alt="RPK Law Firm">
                </div>
            </td>
            <td class="office-cell">
                <strong>RONI, PUTRA &amp; KUSUMAH LAW FIRM</strong><br>
                Jl. Bukit Nirwana VII, Blok CC.04, Sariwangi<br>
                Kabupaten Bandung Barat, Jawa Barat<br>
                Telp: 0852 9560 1417 &nbsp;·&nbsp; Email: contact@gmail.com
            </td>
        </tr>
    </table>
    <div class="gold-rule"></div>

    <!-- Title Box -->
    <div class="title-box">
        <span class="title-badge">LAPORAN EKSEKUTIF PERKEMBANGAN PERKARA</span>
        <div class="doc-title">MATTER STATUS &amp; PROGRESS REPORT</div>
        <div class="doc-subtitle">Ringkasan penanganan perkara, tahapan hukum yang telah ditempuh, dan rencana langkah strategis lanjutan.</div>
    </div>

    <!-- Matter Identity -->
    <div class="meta-card">
        <table class="meta-table">
            <tr>
                <td class="meta-label">NOMOR PERKARA:</td>
                <td class="meta-value mono" style="color: #0369a1; font-size: 8.5px;">{{ $matter->matter_number }}</td>
            </tr>
            <tr>
                <td class="meta-label">JUDUL PERKARA:</td>
                <td class="meta-value" style="font-size: 8.5px;">{{ $matter->title }}</td>
            </tr>
            <tr>
                <td class="meta-label">KLIEN:</td>
                <td class="meta-value">{{ $matter->client->display_name ?? 'Klien Korporasi' }}</td>
            </tr>
            <tr>
                <td class="meta-label">BIDANG HUKUM &amp; STATUS:</td>
                <td class="meta-value">{{ $matter->practiceArea->name ?? '-' }} &nbsp;·&nbsp; <strong style="color: #047857;">{{ strtoupper((string) ($matter->status ?? 'Aktif')) }} (Tahap: {{ strtoupper((string) ($matter->stage ?? 'Aktif')) }})</strong></td>
            </tr>
            <tr>
                <td class="meta-label">TIM KUASA HUKUM:</td>
                <td class="meta-value">
                    Partner Penanggung Jawab: <strong>{{ $matter->responsiblePartner->name ?? 'Managing Partner' }}</strong>
                    @if ($matter->assignedLawyer)
                        &nbsp;·&nbsp; Advokat Pelaksana: <strong>{{ $matter->assignedLawyer->name }}</strong>
                    @endif
                </td>
            </tr>
            <tr>
                <td class="meta-label">TANGGAL LAPORAN:</td>
                <td class="meta-value mono">{{ now()->translatedFormat('d F Y') }}</td>
            </tr>
        </table>
    </div>

    @if ($matter->summary)
        <div class="section-header">1. RINGKASAN POSISI HUKUM &amp; POKOK SENGKETA</div>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; padding: 8px 12px; font-size: 7.6px; line-height: 1.5; color: #334155; margin-bottom: 12px;">
            {!! nl2br(e($matter->summary)) !!}
        </div>
    @endif

    <!-- Parties Involved -->
    <div class="section-header">2. PARA PIHAK TERKAIT SENGKETA (PARTIES ROSTER)</div>
    <table class="custom-table" style="margin-bottom: 12px;">
        <thead>
            <tr>
                <th style="width: 25%;">Peran / Kedudukan</th>
                <th style="width: 45%;">Nama Entitas / Pihak</th>
                <th style="width: 30%;">Kuasa Hukum / Legal Counsel</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($matter->parties as $party)
                <tr>
                    <td style="font-weight: bold; color: #0a1b33;">{{ strtoupper((string) $party->role) }}</td>
                    <td style="font-weight: bold;">{{ $party->name }}</td>
                    <td>{{ $party->counsel ?? '-' }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="3" class="center muted" style="padding: 10px;">Belum ada pihak terdaftar khusus.</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <!-- Hearings Schedule -->
    <div class="section-header">3. JADWAL PERSIDANGAN &amp; AGENDA HUKUM</div>
    <table class="custom-table" style="margin-bottom: 12px;">
        <thead>
            <tr>
                <th style="width: 25%;">Tanggal &amp; Waktu</th>
                <th style="width: 45%;">Agenda Persidangan / Pertemuan</th>
                <th style="width: 30%;">Lokasi / Pengadilan</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($matter->events as $event)
                <tr>
                    <td class="mono" style="font-weight: bold; color: #0369a1;">{{ \Carbon\Carbon::parse($event->starts_at)->translatedFormat('d M Y, H:i') }} WIB</td>
                    <td>
                        <strong style="color: #0a1b33;">{{ $event->title }}</strong>
                        @if ($event->description)
                            <div style="font-size: 6.8px; color: #64748b; margin-top: 1px;">{{ $event->description }}</div>
                        @endif
                    </td>
                    <td>{{ $event->location ?? 'Pengadilan / Kantor' }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="3" class="center muted" style="padding: 10px;">Belum ada agenda sidang mendatang.</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <!-- Evidences Checklist -->
    <div class="section-header">4. DAFTAR ALAT BUKTI &amp; SURAT PENDUKUNG</div>
    <table class="custom-table" style="margin-bottom: 14px;">
        <thead>
            <tr>
                <th style="width: 15%;">Kode Bukti</th>
                <th style="width: 55%;">Nama / Deskripsi Bukti Surat</th>
                <th style="width: 30%;">Status &amp; Kesiapan</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($matter->evidences as $evidence)
                <tr>
                    <td class="mono" style="font-weight: bold; color: #b45309;">{{ $evidence->code ?: '-' }}</td>
                    <td>
                        <strong style="color: #0a1b33;">{{ $evidence->title }}</strong>
                        @if ($evidence->description)
                            <div style="font-size: 6.8px; color: #64748b;">{{ $evidence->description }}</div>
                        @endif
                    </td>
                    <td>
                        <span class="tag-status">{{ strtoupper((string) ($evidence->status ?? 'Tersedia')) }}</span>
                    </td>
                </tr>
            @empty
                <tr>
                    <td colspan="3" class="center muted" style="padding: 10px;">Belum ada alat bukti terdaftar.</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <!-- Strategic Signatures -->
    <table class="signature-block">
        <tr>
            <td class="sig-col">
                <div style="font-size: 7.2px; color: #64748b;">Disusun Oleh:</div>
                <div style="font-size: 8.5px; font-weight: bold; color: #0a1b33; margin-top: 2px;">TIM LITIGASI PERKARA</div>
                <div class="sig-space"></div>
                <div class="sig-line"></div>
                <div style="font-size: 7.5px; font-weight: bold; color: #0a1b33;">{{ $matter->assignedLawyer->name ?? 'Advokat Litigasi' }}</div>
                <div style="font-size: 6.8px; color: #64748b;">Advokat Pelaksana Perkara</div>
            </td>
            <td style="width: 10%;"></td>
            <td class="sig-col">
                <div style="font-size: 7.2px; color: #64748b;">Mengetahui &amp; Menyetujui:</div>
                <div style="font-size: 8.5px; font-weight: bold; color: #0a1b33; margin-top: 2px;">RONI, PUTRA &amp; KUSUMAH LAW FIRM</div>
                <div class="sig-space"></div>
                <div class="sig-line"></div>
                <div style="font-size: 7.5px; font-weight: bold; color: #0a1b33;">{{ $matter->responsiblePartner->name ?? 'Managing Partner' }}</div>
                <div style="font-size: 6.8px; color: #64748b;">Partner Penanggung Jawab Perkara</div>
            </td>
        </tr>
    </table>

    <table class="footer">
        <tr>
            <td>RONI, PUTRA &amp; KUSUMAH LAW FIRM &nbsp;|&nbsp; LAPORAN STATUS PERKARA HUKUM &nbsp;|&nbsp; RAHASIA KLIEN</td>
            <td class="right mono">{{ $matter->matter_number }} &nbsp;|&nbsp; {{ now()->timezone(config('raf.timezone'))->format('d/m/Y H:i') }} WIB</td>
        </tr>
    </table>
</body>
</html>
