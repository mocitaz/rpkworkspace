@php
    $verificationUrl = route('verify.matter-status', $matter);
    $qrDataUri = (new \Endroid\QrCode\Writer\PngWriter())->write(
        new \Endroid\QrCode\QrCode(data: $verificationUrl, size: 160, margin: 0)
    )->getDataUri();

    $statusColor = match($matter->status) {
        'active', 'open' => '#059669',
        'closed', 'won' => '#0284c7',
        'lost' => '#e11d48',
        'settled' => '#8b5cf6',
        default => '#059669'
    };
    $statusLabel = strtoupper((string) ($matter->status ?: 'AKTIF'));
@endphp
<!doctype html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <title>Laporan Perkara {{ $matter->matter_number }} — RPK Law Firm</title>
    <style>
        @page {
            margin: 26px 36px 42px;
            size: A4 portrait;
        }
        * {
            box-sizing: border-box;
        }
        body {
            margin: 0;
            color: #1e293b;
            font-family: "DejaVu Sans", Helvetica, Arial, sans-serif;
            font-size: 8.2px;
            line-height: 1.45;
            position: relative;
            background-color: #ffffff;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        .mono {
            font-family: "DejaVu Sans Mono", monospace;
        }
        .navy {
            color: #0a1b33;
        }
        .gold {
            color: #8f6a22;
        }
        .muted {
            color: #64748b;
        }
        .right {
            text-align: right;
        }
        .center {
            text-align: center;
        }
        .uppercase {
            text-transform: uppercase;
        }

        /* 1. Letterhead */
        .letterhead {
            margin-bottom: 10px;
        }
        .letterhead td {
            vertical-align: middle;
        }
        .logo-cell {
            width: 52%;
        }
        .logo-crop {
            width: 190px;
            height: 58px;
            overflow: hidden;
        }
        .logo-crop img {
            width: 190px;
            height: auto;
            margin-top: -24px;
        }
        .office-cell {
            width: 48%;
            color: #334155;
            font-size: 7px;
            line-height: 1.5;
            text-align: right;
        }
        .gold-rule {
            height: 2px;
            border-top: 1.5px solid #8f6a22;
            border-bottom: 1px solid #d4af37;
            margin-bottom: 14px;
        }

        /* 2. Document Header & Perfectly Aligned Meta */
        .doc-header-table {
            margin-bottom: 14px;
        }
        .doc-header-table td {
            vertical-align: middle;
        }
        .doc-kicker {
            font-size: 6.8px;
            font-weight: bold;
            color: #8f6a22;
            letter-spacing: 1px;
            text-transform: uppercase;
        }
        .doc-title {
            margin-top: 3px;
            font-size: 15px;
            font-weight: bold;
            color: #0a1b33;
            letter-spacing: .3px;
        }
        .doc-subtitle {
            margin-top: 2px;
            font-size: 7.2px;
            color: #64748b;
        }

        .meta-table {
            width: auto;
            margin-left: auto;
            border-collapse: separate;
            border-spacing: 0 2px;
        }
        .meta-table td {
            padding: 1px 0;
            font-size: 7.5px;
            vertical-align: middle;
        }
        .meta-label {
            width: 95px;
            color: #64748b;
            font-weight: bold;
            text-align: left;
        }
        .meta-sep {
            width: 12px;
            color: #94a3b8;
            font-weight: bold;
            text-align: center;
        }
        .meta-val {
            font-weight: bold;
            color: #0f172a;
            text-align: left;
            padding-left: 4px;
        }

        /* 3. Information Grid */
        .info-card {
            background-color: #f8fafc;
            border: 1px solid #cbd5e1;
            border-radius: 6px;
            margin-bottom: 12px;
            table-layout: fixed;
        }
        .info-card > tbody > tr > td {
            width: 50%;
            padding: 8px 12px;
            vertical-align: top;
        }
        .info-card > tbody > tr > td:first-child {
            border-right: 1px solid #cbd5e1;
        }
        .section-label {
            font-size: 6.5px;
            font-weight: bold;
            color: #8f6a22;
            letter-spacing: 0.8px;
            text-transform: uppercase;
            margin-bottom: 4px;
            padding-bottom: 2px;
            border-bottom: 1px solid #e2e8f0;
        }
        .person-name {
            font-size: 10px;
            font-weight: bold;
            color: #0a1b33;
            margin-bottom: 3px;
        }
        .detail-row td {
            padding: 1.2px 0;
            font-size: 7.2px;
            vertical-align: top;
        }
        .detail-label {
            width: 32%;
            color: #64748b;
            font-weight: 500;
        }
        .detail-sep {
            width: 4%;
            color: #94a3b8;
            font-weight: bold;
            text-align: center;
        }
        .detail-val {
            width: 64%;
            color: #0f172a;
            font-weight: bold;
            padding-left: 2px;
        }

        /* Section Headings */
        .section-title {
            font-size: 7.5px;
            font-weight: bold;
            color: #0a1b33;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            margin-top: 10px;
            margin-bottom: 4px;
            padding-bottom: 2px;
            border-bottom: 1.5px solid #0a1b33;
        }

        /* Box Summary */
        .summary-box {
            background-color: #fbfaf7;
            border: 1px solid #e2d2aa;
            border-radius: 6px;
            padding: 7px 10px;
            font-size: 7.3px;
            line-height: 1.45;
            color: #334155;
            margin-bottom: 10px;
        }

        /* 4. Financial / Data Card Tables */
        .financial-card {
            border: 1px solid #cbd5e1;
            border-radius: 6px;
            margin-bottom: 10px;
            overflow: hidden;
            background: #ffffff;
        }
        .financial-card thead th {
            background-color: #0a1b33;
            color: #ffffff;
            font-size: 6.8px;
            font-weight: bold;
            padding: 5px 8px;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            border: none;
        }
        .financial-card tbody td {
            padding: 5.5px 8px;
            border-bottom: 1px solid #e2e8f0;
            font-size: 7.5px;
            vertical-align: middle;
        }
        .financial-card tbody tr:last-child td {
            border-bottom: none;
        }

        /* 5. Closing & Signatures */
        .closing-layout {
            margin-top: 14px;
        }
        .closing-layout td {
            vertical-align: top;
        }
        .legal-clause {
            font-size: 6.5px;
            color: #64748b;
            line-height: 1.45;
            text-align: justify;
        }
        .sig-box {
            text-align: center;
        }
        .sig-role {
            font-size: 6.5px;
            color: #64748b;
            font-weight: bold;
            letter-spacing: 0.5px;
            text-transform: uppercase;
        }
        .sig-firm {
            font-size: 7.5px;
            font-weight: bold;
            color: #0a1b33;
            margin-top: 1px;
        }
        .sig-space {
            height: 60px;
        }
        .sig-line {
            width: 195px;
            border-top: 1px solid #0a1b33;
            margin: 0 auto 4px;
        }
        .sig-name {
            font-size: 7.5px;
            font-weight: bold;
            color: #0a1b33;
        }

        /* 6. QR Code Corner */
        .qr-bottom-right-corner {
            position: fixed;
            bottom: 28px;
            right: 0px;
            width: 72px;
            text-align: center;
            z-index: 100;
        }
        .qr-bottom-right-corner img {
            width: 62px;
            height: 62px;
            display: block;
            margin: 0 auto;
            border: 1px solid #e2e8f0;
            padding: 2px;
            background: #ffffff;
            border-radius: 4px;
        }
        .qr-bottom-right-corner .qr-label {
            font-size: 5.2px;
            font-weight: bold;
            color: #0a1b33;
            margin-top: 2px;
            line-height: 1.15;
            letter-spacing: 0.2px;
            text-transform: uppercase;
        }

        /* 7. Footer */
        .footer {
            position: fixed;
            right: 75px;
            bottom: -22px;
            left: 0;
            padding-top: 4px;
            border-top: 1px solid #cbd5e1;
            color: #64748b;
            font-size: 6.5px;
            line-height: 1.3;
        }
        .footer td:last-child {
            text-align: right;
        }
    </style>
</head>
<body>

    <!-- Fixed Footer -->
    <table class="footer">
        <tr>
            <td>RONI, PUTRA &amp; KUSUMAH LAW FIRM &nbsp;|&nbsp; LAPORAN PERKEMBANGAN PERKARA &nbsp;|&nbsp; RAHASIA</td>
            <td class="mono">{{ $matter->matter_number }} &nbsp;|&nbsp; {{ now()->timezone(config('raf.timezone'))->format('d/m/Y H:i') }} WIB</td>
        </tr>
    </table>

    <!-- QR Code Fixed in Bottom-Right Corner -->
    <div class="qr-bottom-right-corner">
        <img src="{{ $qrDataUri }}" alt="QR Verifikasi" />
        <div class="qr-label">
            SCAN VERIFIKASI<br><span style="font-weight: normal; color: #64748b;">Keaslian Laporan</span>
        </div>
    </div>

    <!-- 1. Letterhead -->
    <table class="letterhead">
        <tr>
            <td class="logo-cell">
                <div class="logo-crop">
                    <img src="{{ public_path('logo/logo.png') }}" alt="Roni, Putra & Kusumah Law Firm">
                </div>
            </td>
            <td class="office-cell">
                <strong>RONI, PUTRA &amp; KUSUMAH LAW FIRM</strong><br>
                Divisi Penanganan Perkara &amp; Konsultasi Hukum Klien<br>
                Jl. Bukit Nirwana VII, Blok CC.04, Sariwangi, Bandung Barat, Jawa Barat<br>
                Telp: 0852 9560 1417 &nbsp;·&nbsp; Email: contact@rpklawoffice.com
            </td>
        </tr>
    </table>
    <div class="gold-rule"></div>

    <!-- 2. Document Header & Perfectly Aligned Metadata -->
    <table class="doc-header-table">
        <tr>
            <td style="width: 50%;">
                <div class="doc-kicker">LAPORAN EKSEKUTIF PERKEMBANGAN PERKARA</div>
                <div class="doc-title">MATTER STATUS &amp; PROGRESS REPORT</div>
                <div class="doc-subtitle">Ringkasan penanganan perkara, tahapan hukum yang telah ditempuh, dan rencana tindakan lanjutan.</div>
            </td>
            <td style="width: 50%; text-align: right;">
                <table class="meta-table">
                    <tr>
                        <td class="meta-label">Nomor Perkara</td>
                        <td class="meta-sep">:</td>
                        <td class="meta-val mono" style="color: #0369a1;">{{ $matter->matter_number }}</td>
                    </tr>
                    <tr>
                        <td class="meta-label">Tanggal Laporan</td>
                        <td class="meta-sep">:</td>
                        <td class="meta-val" style="color: #059669;">{{ now()->translatedFormat('d F Y') }}</td>
                    </tr>
                    <tr>
                        <td class="meta-label">Status Penanganan</td>
                        <td class="meta-sep">:</td>
                        <td class="meta-val" style="color: {{ $statusColor }};">{{ $statusLabel }}</td>
                    </tr>
                    <tr>
                        <td class="meta-label">Tahap Berjalan</td>
                        <td class="meta-sep">:</td>
                        <td class="meta-val uppercase">{{ strtoupper((string) ($matter->stage ?? 'Aktif')) }}</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    <!-- 3. Information Grid -->
    <table class="info-card">
        <tr>
            <!-- Matter & Client Details -->
            <td>
                <div class="section-label">IDENTITAS PERKARA &amp; KLIEN UTAMA</div>
                <div class="person-name">{{ $matter->title }}</div>
                <table style="width: 100%;">
                    <tr class="detail-row">
                        <td class="detail-label">Klien Prinsipal</td>
                        <td class="detail-sep">:</td>
                        <td class="detail-val">{{ $matter->client->display_name ?? 'Klien Korporasi' }}</td>
                    </tr>
                    <tr class="detail-row">
                        <td class="detail-label">Bidang Praktik</td>
                        <td class="detail-sep">:</td>
                        <td class="detail-val">{{ $matter->practiceArea->name ?? 'Litigasi / Korporasi' }}</td>
                    </tr>
                    <tr class="detail-row">
                        <td class="detail-label">Tanggal Dibuka</td>
                        <td class="detail-sep">:</td>
                        <td class="detail-val mono">{{ $matter->opened_at?->translatedFormat('d F Y') ?? '-' }}</td>
                    </tr>
                </table>
            </td>

            <!-- Legal Team Counsel -->
            <td>
                <div class="section-label">TIM KUASA HUKUM &amp; PENANGGUNG JAWAB</div>
                <div class="person-name mono" style="color: #0369a1;">
                    {{ $matter->responsiblePartner->name ?? 'Managing Partner' }}
                </div>
                <table style="width: 100%;">
                    <tr class="detail-row">
                        <td class="detail-label">Peran Partner</td>
                        <td class="detail-sep">:</td>
                        <td class="detail-val">Responsible Partner (Penanggung Jawab)</td>
                    </tr>
                    @if ($matter->supervisingLawyer)
                        <tr class="detail-row">
                            <td class="detail-label">Advokat Pelaksana</td>
                            <td class="detail-sep">:</td>
                            <td class="detail-val">{{ $matter->supervisingLawyer->name }}</td>
                        </tr>
                    @endif
                    <tr class="detail-row">
                        <td class="detail-label">Klasifikasi</td>
                        <td class="detail-sep">:</td>
                        <td class="detail-val uppercase">{{ strtoupper((string) ($matter->case_category ?? 'Perdata / Bisnis')) }}</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    <!-- 4. Ringkasan Posisi Hukum -->
    @if ($matter->summary)
        <div class="section-title">1. RINGKASAN POSISI HUKUM &amp; DOKUMEN POKOK PERKARA</div>
        <div class="summary-box">
            {!! nl2br(e($matter->summary)) !!}
        </div>
    @endif

    <!-- 5. Parties Involved Roster -->
    <div class="section-title">2. DAFTAR PARA PIHAK TERKAIT (PARTIES ROSTER)</div>
    <div class="financial-card">
        <table>
            <thead>
                <tr>
                    <th class="center" style="width: 6%;">NO</th>
                    <th style="width: 24%; text-align: left;">KEDUDUKAN / PERAN</th>
                    <th style="width: 40%; text-align: left;">NAMA ENTITAS / PIHAK</th>
                    <th style="width: 30%; text-align: left;">KUASA HUKUM / COUNSEL</th>
                </tr>
            </thead>
            <tbody>
                @forelse ($matter->parties as $index => $party)
                    <tr>
                        <td class="center mono muted">{{ str_pad((string) ($index + 1), 2, '0', STR_PAD_LEFT) }}</td>
                        <td style="font-weight: bold; color: #0a1b33;">{{ strtoupper((string) $party->role) }}</td>
                        <td style="font-weight: bold;">{{ $party->name }}</td>
                        <td class="muted">{{ $party->counsel ?: '-' }}</td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="4" class="center muted" style="padding: 10px; font-style: italic;">Tidak ada pihak lawan/pihak ketiga yang terdaftar khusus.</td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>

    <!-- 6. Hearings & Key Milestones -->
    <div class="section-title">3. JADWAL PERSIDANGAN &amp; AGENDA HUKUM TERKINI</div>
    <div class="financial-card">
        <table>
            <thead>
                <tr>
                    <th class="center" style="width: 6%;">NO</th>
                    <th style="width: 24%; text-align: left;">TANGGAL &amp; WAKTU</th>
                    <th style="width: 45%; text-align: left;">AGENDA / TAHAPAN HUKUM</th>
                    <th class="right" style="width: 25%;">LOKASI / FORUM</th>
                </tr>
            </thead>
            <tbody>
                @forelse ($matter->events->take(6) as $index => $event)
                    <tr>
                        <td class="center mono muted">{{ str_pad((string) ($index + 1), 2, '0', STR_PAD_LEFT) }}</td>
                        <td class="mono font-bold">{{ $event->starts_at?->translatedFormat('d M Y, H:i') ?? '-' }}</td>
                        <td style="font-weight: bold; color: #0f172a;">{{ $event->title }}</td>
                        <td class="right muted">{{ $event->location ?: 'Pengadilan / Kantor RPK' }}</td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="4" class="center muted" style="padding: 10px; font-style: italic;">Belum ada agenda sidang atau tahapan lanjutan yang terjadwal.</td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>

    <!-- 7. Closing Signatures -->
    <table class="closing-layout">
        <tr>
            <td class="legal-clause" style="width: 60%; padding-right: 20px;">
                <strong>DISCLAIMER &amp; KERAHASIAAN DOKUMEN:</strong><br>
                Laporan ini disusun secara profesional oleh tim kuasa hukum RPK Law Firm untuk kepentingan eksklusif Klien. Informasi yang tercantum dilindungi oleh asas kerahasiaan hubungan advokat-klien (*attorney-client privilege*) dan tidak boleh disebarluaskan kepada pihak ketiga tanpa persetujuan tertulis.
            </td>
            <td class="sig-box" style="width: 40%;">
                <div class="sig-role">PENANGGUNG JAWAB PERKARA</div>
                <div class="sig-firm">RONI, PUTRA &amp; KUSUMAH LAW FIRM</div>
                <div class="sig-space"></div>
                <div class="sig-line"></div>
                <div class="sig-name">{{ $matter->responsiblePartner->name ?? 'Managing Partner' }}</div>
            </td>
        </tr>
    </table>

</body>
</html>
