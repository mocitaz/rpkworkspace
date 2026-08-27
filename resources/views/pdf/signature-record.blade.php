@php
    $verificationUrl = route('signature.verify', $signatureRequest->verification_code);
    $qrDataUri = (new \Endroid\QrCode\Writer\PngWriter())->write(
        new \Endroid\QrCode\QrCode(data: $verificationUrl, size: 160, margin: 0)
    )->getDataUri();

    $isCompleted = $signatureRequest->status === 'completed';
    $statusColor = $isCompleted ? '#059669' : '#0284c7';
    $statusLabel = $isCompleted ? 'TERVERIFIKASI (VERIFIED)' : 'DALAM PROSES (' . strtoupper($signatureRequest->status) . ')';
    $certCode = $signatureRequest->verification_code;
    $checksum = $signatureRequest->documentVersion->checksum ?? $signatureRequest->document_checksum ?? hash('sha256', $signatureRequest->verification_code);
@endphp
<!doctype html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <title>Rekaman Audit Tanda Tangan {{ $certCode }} — RPK Law Firm</title>
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
            font-size: 14.5px;
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
            font-size: 9.5px;
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
            width: 30%;
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
            width: 66%;
            color: #0f172a;
            font-weight: bold;
            padding-left: 2px;
        }

        .hash-card {
            background: #ffffff;
            border: 1px solid #cbd5e1;
            border-left: 3px solid #0369a1;
            border-radius: 4px;
            padding: 4px 6px;
            margin-top: 4px;
            font-size: 6.8px;
            color: #0f172a;
            word-break: break-all;
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

        /* Section Headings */
        .section-title {
            font-size: 7.5px;
            font-weight: bold;
            color: #0a1b33;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            margin-top: 8px;
            margin-bottom: 4px;
            padding-bottom: 2px;
            border-bottom: 1.5px solid #0a1b33;
        }

        /* Box Summary */
        .summary-box {
            background-color: #fbfaf7;
            border: 1px solid #e2d2aa;
            border-radius: 6px;
            padding: 6px 10px;
            font-size: 7.2px;
            line-height: 1.45;
            color: #334155;
            margin-bottom: 10px;
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
            <td>RONI, PUTRA &amp; KUSUMAH LAW FIRM &nbsp;|&nbsp; LEMBAR AUDIT REKAM JEJAK TANDA TANGAN DIGITAL &nbsp;|&nbsp; DOKUMEN SAH</td>
            <td class="mono">{{ $certCode }} &nbsp;|&nbsp; {{ now()->timezone(config('raf.timezone'))->format('d/m/Y H:i') }} WIB</td>
        </tr>
    </table>

    <!-- QR Code Fixed in Bottom-Right Corner -->
    <div class="qr-bottom-right-corner">
        <img src="{{ $qrDataUri }}" alt="QR Verifikasi" />
        <div class="qr-label">
            SCAN VERIFIKASI<br><span style="font-weight: normal; color: #64748b;">Audit Jejak Digital</span>
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
                Divisi Otoritas Tanda Tangan Elektronik &amp; Audit Forensik Dokumen<br>
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
                <div class="doc-kicker">DIGITAL SIGNATURE AUDIT TRAIL &amp; EVIDENCE LOG</div>
                <div class="doc-title">REKAMAN RESMI PENGESAHAN DOKUMEN</div>
                <div class="doc-subtitle">Bukti pengikatan kriptografi versi berkas asli dengan tanda tangan para pihak.</div>
            </td>
            <td style="width: 50%; text-align: right;">
                <table class="meta-table">
                    <tr>
                        <td class="meta-label">Kode Verifikasi</td>
                        <td class="meta-sep">:</td>
                        <td class="meta-val mono" style="color: #0369a1;">{{ $certCode }}</td>
                    </tr>
                    <tr>
                        <td class="meta-label">Tanggal Rekam</td>
                        <td class="meta-sep">:</td>
                        <td class="meta-val" style="color: #059669;">{{ $signatureRequest->completed_at?->translatedFormat('d F Y, H:i') . ' WIB' ?? now()->translatedFormat('d F Y, H:i') . ' WIB' }}</td>
                    </tr>
                    <tr>
                        <td class="meta-label">Status Jejak</td>
                        <td class="meta-sep">:</td>
                        <td class="meta-val" style="color: {{ $statusColor }};">{{ $statusLabel }}</td>
                    </tr>
                    <tr>
                        <td class="meta-label">Modus Eksekusi</td>
                        <td class="meta-sep">:</td>
                        <td class="meta-val uppercase">{{ $signatureRequest->mode === 'sequential' ? 'Berurutan (Sequential)' : 'Simultan (Parallel)' }}</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    <!-- 3. Information Grid -->
    <table class="info-card">
        <tr>
            <!-- Document Details & Checksum -->
            <td>
                <div class="section-label">DOKUMEN SUMBER &amp; INTEGRITAS BERKAS ASLI</div>
                <div class="person-name">{{ $signatureRequest->document->title ?? 'Dokumen Perkara Resmi' }}</div>
                <table style="width: 100%;">
                    <tr class="detail-row">
                        <td class="detail-label">Versi Berkas</td>
                        <td class="detail-sep">:</td>
                        <td class="detail-val">Versi {{ $signatureRequest->documentVersion->version_number ?? 1 }}.0 ({{ $signatureRequest->documentVersion->original_filename ?? 'document.pdf' }})</td>
                    </tr>
                    <tr class="detail-row">
                        <td class="detail-label">Status Alur</td>
                        <td class="detail-sep">:</td>
                        <td class="detail-val uppercase">{{ strtoupper((string) $signatureRequest->status) }}</td>
                    </tr>
                </table>
                <div class="detail-label" style="margin-top: 4px; font-weight: bold;">CHECKSUM SIDIK JARI BERKAS (SHA-256):</div>
                <div class="hash-card mono">{{ $checksum }}</div>
            </td>

            <!-- Matter & Client Context -->
            <td>
                <div class="section-label">PERKARA HUKUM &amp; KLIEN TERKAIT</div>
                <div class="person-name mono" style="color: #0369a1;">
                    {{ $signatureRequest->document->matter->matter_number ?? 'DOKUMEN KORPORASI UMUM' }}
                </div>
                <table style="width: 100%;">
                    <tr class="detail-row">
                        <td class="detail-label">Judul Perkara</td>
                        <td class="detail-sep">:</td>
                        <td class="detail-val">{{ $signatureRequest->document->matter->title ?? 'Dokumen Hukum Korporasi RPK' }}</td>
                    </tr>
                    <tr class="detail-row">
                        <td class="detail-label">Klien Utama</td>
                        <td class="detail-sep">:</td>
                        <td class="detail-val">{{ $signatureRequest->document->client->display_name ?? 'Klien Terdaftar' }}</td>
                    </tr>
                    <tr class="detail-row">
                        <td class="detail-label">Tanggal Dibuat</td>
                        <td class="detail-sep">:</td>
                        <td class="detail-val mono">{{ $signatureRequest->created_at?->translatedFormat('d F Y, H:i') . ' WIB' ?? '-' }}</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    <!-- 4. Summary Box -->
    <div class="summary-box">
        <strong>JAMINAN KEASLIAN &amp; KEUTUHAN DOKUMEN:</strong> Setiap tanda tangan elektronik pada dokumen ini diikat secara kriptografis menggunakan algoritma SHA-256. Setiap perubahan satu karakter pun pada berkas setelah penandatanganan selesai akan mengubah nilai hash dan membatalkan keabsahan sertifikasi dokumen.
    </div>

    <!-- 5. Signers Audit Table -->
    <div class="section-title">DAFTAR REKAM JEJAK PENANDATANGANAN ELEKTRONIK</div>
    <div class="financial-card">
        <table>
            <thead>
                <tr>
                    <th class="center" style="width: 6%;">NO</th>
                    <th style="width: 28%; text-align: left;">NAMA PENANDATANGAN</th>
                    <th style="width: 32%; text-align: left;">EMAIL &amp; IDENTIFIKASI AKSES</th>
                    <th style="width: 20%; text-align: left;">WAKTU PENANDATANGANAN</th>
                    <th class="right" style="width: 14%;">STATUS</th>
                </tr>
            </thead>
            <tbody>
                @forelse ($signatureRequest->signers ?? [] as $index => $signer)
                    <tr>
                        <td class="center mono muted">{{ str_pad((string) ($index + 1), 2, '0', STR_PAD_LEFT) }}</td>
                        <td>
                            <strong style="color: #0a1b33;">{{ $signer->accepted_name ?: $signer->name }}</strong>
                            @if ($signer->signing_order)
                                <div style="font-size: 6.5px; color: #64748b;">Urutan Penandatanganan: #{{ $signer->signing_order }}</div>
                            @endif
                        </td>
                        <td>
                            <div class="mono" style="font-size: 7.2px;">{{ $signer->email }}</div>
                            @if ($signer->signed_ip_address)
                                <div class="mono muted" style="font-size: 6.2px;">IP: {{ $signer->signed_ip_address }}</div>
                            @endif
                        </td>
                        <td class="mono font-bold" style="color: #0f172a;">
                            {{ $signer->signed_at ? \Carbon\Carbon::parse($signer->signed_at)->translatedFormat('d M Y, H:i') . ' WIB' : '-' }}
                        </td>
                        <td class="right">
                            @if ($signer->status === 'signed' || $signer->signed_at)
                                <span style="font-weight: bold; color: #059669;">SAH &amp; VALID</span>
                            @else
                                <span style="font-weight: bold; color: #d97706;">MENUNGGU</span>
                            @endif
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="5" class="center muted" style="padding: 10px; font-style: italic;">Tidak ada data penandatangan tercatat.</td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>

    <!-- 6. Closing Signatures -->
    <table class="closing-layout">
        <tr>
            <td class="legal-clause" style="width: 60%; padding-right: 20px;">
                <strong>CATATAN AUDIT DIGITAL:</strong><br>
                Lembar rekaman audit ini dihasilkan secara otomatis oleh sistem RPK App dan berfungsi sebagai bukti otentikasi bahwa seluruh tahapan penandatanganan elektronik telah diselesaikan sesuai prosedur hukum yang berlaku.
            </td>
            <td class="sig-box" style="width: 40%;">
                <div class="sig-role">OTORITAS SERTIFIKASI DIGITAL FIRMA</div>
                <div class="sig-firm">RONI, PUTRA &amp; KUSUMAH LAW FIRM</div>
                <div class="sig-space"></div>
                <div class="sig-line"></div>
                <div class="sig-name">Muhamad Fajar Roni, S.H. (Managing Partner)</div>
            </td>
        </tr>
    </table>

</body>
</html>
