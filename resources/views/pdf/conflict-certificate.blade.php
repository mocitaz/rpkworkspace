@php
    $verificationUrl = route('verify.conflict-certificate', $conflictCheck);
    $qrDataUri = (new \Endroid\QrCode\Writer\PngWriter())->write(
        new \Endroid\QrCode\QrCode(data: $verificationUrl, size: 160, margin: 0)
    )->getDataUri();

    $isClear = $conflictCheck->status === 'clear' || $conflictCheck->decision === 'cleared' || $conflictCheck->decision === 'approved';
    $isWaived = $conflictCheck->decision === 'waived';
    $isBlocked = $conflictCheck->status === 'blocked' && $conflictCheck->decision !== 'waived';

    $statusColor = $isClear ? '#059669' : ($isWaived ? '#d97706' : '#e11d48');
    $statusLabel = $isClear ? 'MEMENUHI SYARAT (CLEAR)' : ($isWaived ? 'DISPENSASI (WAIVED)' : 'BENTURAN LANGSUNG (BLOCKED)');
    $certNumber = 'CC-RPK-' . strtoupper(substr($conflictCheck->id, 0, 10));
@endphp
<!doctype html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <title>Sertifikat Bebas Konflik {{ $certNumber }} — RPK Law Firm</title>
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
            width: 100px;
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

        /* Status Highlight Card */
        .status-hero {
            background: #f8fafc;
            border: 1px solid #cbd5e1;
            border-left: 4px solid {{ $statusColor }};
            border-radius: 6px;
            padding: 8px 12px;
            margin-bottom: 12px;
        }
        .status-hero-tag {
            font-size: 6.8px;
            font-weight: bold;
            color: #64748b;
            letter-spacing: 0.8px;
            text-transform: uppercase;
        }
        .status-hero-title {
            font-size: 11px;
            font-weight: bold;
            color: {{ $statusColor }};
            margin-top: 2px;
        }
        .status-hero-desc {
            font-size: 7.2px;
            color: #475569;
            margin-top: 2px;
            line-height: 1.4;
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

        /* 4. Findings Table */
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

        /* Note Box */
        .note-box {
            background-color: #f8fafc;
            border: 1px solid #cbd5e1;
            border-radius: 6px;
            padding: 7px 10px;
            margin-bottom: 12px;
        }
        .note-title {
            font-size: 6.8px;
            font-weight: bold;
            color: #0a1b33;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            margin-bottom: 3px;
        }
        .note-desc {
            font-size: 7.3px;
            color: #334155;
            line-height: 1.45;
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
            <td>RONI, PUTRA &amp; KUSUMAH LAW FIRM &nbsp;|&nbsp; SERTIFIKAT BEBAS BENTURAN KEPENTINGAN &nbsp;|&nbsp; RAHASIA</td>
            <td class="mono">{{ $certNumber }} &nbsp;|&nbsp; {{ now()->timezone(config('raf.timezone'))->format('d/m/Y H:i') }} WIB</td>
        </tr>
    </table>

    <!-- QR Code Fixed in Bottom-Right Corner -->
    <div class="qr-bottom-right-corner">
        <img src="{{ $qrDataUri }}" alt="QR Verifikasi" />
        <div class="qr-label">
            SCAN VERIFIKASI<br><span style="font-weight: normal; color: #64748b;">Keaslian Sertifikat</span>
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
                Divisi Kepatuhan Etika Profesi &amp; Tata Kelola Independensi<br>
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
                <div class="doc-kicker">FORMULIR KEPATUHAN ETIKA &amp; INDEPENDENSI</div>
                <div class="doc-title">SURAT KETERANGAN BEBAS BENTURAN KEPENTINGAN</div>
                <div class="doc-subtitle">Certificate of Conflict of Interest Clearance &amp; Independent Ethical Review.</div>
            </td>
            <td style="width: 50%; text-align: right;">
                <table class="meta-table">
                    <tr>
                        <td class="meta-label">Nomor Sertifikat</td>
                        <td class="meta-sep">:</td>
                        <td class="meta-val mono">{{ $certNumber }}</td>
                    </tr>
                    <tr>
                        <td class="meta-label">Tanggal Uji</td>
                        <td class="meta-sep">:</td>
                        <td class="meta-val" style="color: #059669;">{{ $conflictCheck->created_at?->translatedFormat('d F Y') ?? now()->translatedFormat('d F Y') }}</td>
                    </tr>
                    <tr>
                        <td class="meta-label">Tanggal Review</td>
                        <td class="meta-sep">:</td>
                        <td class="meta-val">{{ $conflictCheck->reviewed_at?->translatedFormat('d F Y') ?? now()->translatedFormat('d F Y') }}</td>
                    </tr>
                    <tr>
                        <td class="meta-label">Keputusan Etika</td>
                        <td class="meta-sep">:</td>
                        <td class="meta-val" style="color: {{ $statusColor }};">{{ $statusLabel }}</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    <!-- 3. Status Hero Banner -->
    <div class="status-hero">
        <div class="status-hero-tag">KESIMPULAN UJI INDEPENDENSI PROFESI &amp; KELAYAKAN PERKARA</div>
        <div class="status-hero-title">
            @if ($isClear)
                MEMENUHI SYARAT INDEPENDENSI • LAYAK DITANGANI
            @elseif ($isWaived)
                DISETUJUI DENGAN KETENTUAN KHUSUS (ETHICAL WALL WAIVER)
            @else
                TIDAK DAPAT DITANGANI • BENTURAN LANGSUNG DITEMUKAN
            @endif
        </div>
        <div class="status-hero-desc">
            @if ($isClear)
                Berdasarkan penelusuran menyeluruh (*Comprehensive Conflict of Interest Scan*) terhadap pangkalan data perkara berjalan, mantan klien, pihak lawan (*adverse parties*), dan rekanan, tidak ditemukan benturan kepentingan dan perkara dinyatakan sah untuk diproses.
            @elseif ($isWaived)
                Terdapat potensi benturan kepentingan yang telah ditinjau dan disetujui oleh Managing Partner dengan ketentuan pembatasan akses data (*Ethical Wall*).
            @else
                Ditemukan benturan kepentingan langsung dengan pihak lawan atau portofolio perkara aktif firma hukum sehingga penanganan tidak dapat dilanjutkan.
            @endif
        </div>
    </div>

    <!-- 4. Information Grid -->
    <table class="info-card">
        <tr>
            <!-- Subject Under Investigation -->
            <td>
                <div class="section-label">SUBJEK &amp; PIHAK YANG DIPERIKSA (TARGET SUBJECT)</div>
                <div class="person-name">{{ $conflictCheck->subject_name }}</div>
                <table style="width: 100%;">
                    @if ($conflictCheck->client)
                        <tr class="detail-row">
                            <td class="detail-label">Klien Terkait</td>
                            <td class="detail-sep">:</td>
                            <td class="detail-val">{{ $conflictCheck->client->display_name }}</td>
                        </tr>
                    @endif
                    @if ($conflictCheck->matter)
                        <tr class="detail-row">
                            <td class="detail-label">Perkara</td>
                            <td class="detail-sep">:</td>
                            <td class="detail-val">{{ $conflictCheck->matter->title }} ({{ $conflictCheck->matter->matter_number }})</td>
                        </tr>
                    @endif
                    <tr class="detail-row">
                        <td class="detail-label">Metode Scan</td>
                        <td class="detail-sep">:</td>
                        <td class="detail-val">Algoritma Pencocokan Multi-Entitas RPK App</td>
                    </tr>
                </table>
            </td>

            <!-- Governance & Officer -->
            <td>
                <div class="section-label">OTORISASI &amp; PENINJAU KEPATUHAN (ETHICS OFFICER)</div>
                <div class="person-name mono" style="color: #0369a1;">
                    {{ $conflictCheck->reviewer->name ?? 'Tim Kepatuhan Etika RPK' }}
                </div>
                <table style="width: 100%;">
                    <tr class="detail-row">
                        <td class="detail-label">Pemohon Uji</td>
                        <td class="detail-sep">:</td>
                        <td class="detail-val">{{ $conflictCheck->requester->name ?? 'Advokat RPK' }}</td>
                    </tr>
                    <tr class="detail-row">
                        <td class="detail-label">Jabatan Peninjau</td>
                        <td class="detail-sep">:</td>
                        <td class="detail-val">{{ $conflictCheck->reviewer->position_title ?? 'Managing Partner' }}</td>
                    </tr>
                    <tr class="detail-row">
                        <td class="detail-label">Masa Berlaku</td>
                        <td class="detail-sep">:</td>
                        <td class="detail-val mono">{{ $conflictCheck->expires_at?->translatedFormat('d F Y') ?? '90 Hari Sejak Diterbitkan' }}</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    <!-- 5. Searched Names Table -->
    @php
        $searched = is_array($conflictCheck->searched_names) ? $conflictCheck->searched_names : [];
        if (empty($searched) && $conflictCheck->subject_name) {
            $searched = [$conflictCheck->subject_name];
        }
    @endphp
    @if (!empty($searched))
        <div class="financial-card">
            <table>
                <thead>
                    <tr>
                        <th class="center" style="width: 6%;">NO</th>
                        <th style="width: 44%; text-align: left;">NAMA ENTITAS / PIHAK YANG DITELUSURI</th>
                        <th style="width: 30%; text-align: left;">SUMBER BASIS DATA SISTEM</th>
                        <th class="right" style="width: 20%;">HASIL UJI BENTURAN</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($searched as $index => $name)
                        <tr>
                            <td class="center mono muted">{{ str_pad((string) ($index + 1), 2, '0', STR_PAD_LEFT) }}</td>
                            <td style="font-weight: bold; color: #0f172a;">{{ is_string($name) ? $name : ($name['name'] ?? '-') }}</td>
                            <td class="muted">Perkara Aktif, Klien, Pihak Lawan &amp; Saksi</td>
                            <td class="right">
                                <span style="font-weight: bold; color: {{ $statusColor }};">
                                    {{ $isClear ? 'BEBAS BENTURAN (CLEAR)' : ($isWaived ? 'TERDAPAT CATATAN' : 'BENTURAN DITEMUKAN') }}
                                </span>
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    @endif

    <!-- Notes if any -->
    @if ($conflictCheck->decision_note)
        <div class="note-box">
            <div class="note-title">CATATAN &amp; PERTIMBANGAN HUKUM PENINJAU:</div>
            <div class="note-desc">{{ $conflictCheck->decision_note }}</div>
        </div>
    @endif

    <!-- 6. Closing Signatures -->
    <table class="closing-layout">
        <tr>
            <td class="legal-clause" style="width: 60%; padding-right: 20px;">
                <strong>DASAR HUKUM &amp; KEPATUHAN PROFESI:</strong><br>
                Pemeriksaan ini tunduk pada ketentuan Pasal 19 Undang-Undang No. 18 Tahun 2003 tentang Advokat serta Kode Etik Advokat Indonesia (KEAI) mengenai larangan bertindak untuk pihak-pihak yang kepentingannya saling bertentangan dalam satu perkara. Dokumen ini sah dan mengikat secara internal di lingkungan firma hukum Roni, Putra &amp; Kusumah.
            </td>
            <td class="sig-box" style="width: 40%;">
                <div class="sig-role">PEJABAT KEPATUHAN ETIKA / MANAGING PARTNER</div>
                <div class="sig-firm">RONI, PUTRA &amp; KUSUMAH LAW FIRM</div>
                <div class="sig-space"></div>
                <div class="sig-line"></div>
                <div class="sig-name">{{ $conflictCheck->reviewer->name ?? 'Muhamad Fajar Roni, S.H.' }}</div>
            </td>
        </tr>
    </table>

</body>
</html>
