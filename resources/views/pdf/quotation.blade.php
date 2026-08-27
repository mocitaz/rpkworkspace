@php
    $verificationUrl = route('verify.quotation', $quotation->quotation_number);
    $qrDataUri = (new \Endroid\QrCode\Writer\PngWriter())->write(
        new \Endroid\QrCode\QrCode(data: $verificationUrl, size: 160, margin: 0)
    )->getDataUri();

    function rpkTerbilangQuotation($number): string {
        $number = abs((int) $number);
        $words = ["", "Satu", "Dua", "Tiga", "Empat", "Lima", "Enam", "Tujuh", "Delapan", "Sembilan", "Sepuluh", "Sebelas"];
        if ($number < 12) {
            return $words[$number];
        } elseif ($number < 20) {
            return rpkTerbilangQuotation($number - 10) . " Belas";
        } elseif ($number < 100) {
            return rpkTerbilangQuotation(intdiv($number, 10)) . " Puluh " . rpkTerbilangQuotation($number % 10);
        } elseif ($number < 200) {
            return "Seratus " . rpkTerbilangQuotation($number - 100);
        } elseif ($number < 1000) {
            return rpkTerbilangQuotation(intdiv($number, 100)) . " Ratus " . rpkTerbilangQuotation($number % 100);
        } elseif ($number < 2000) {
            return "Seribu " . rpkTerbilangQuotation($number - 1000);
        } elseif ($number < 1000000) {
            return rpkTerbilangQuotation(intdiv($number, 1000)) . " Ribu " . rpkTerbilangQuotation($number % 1000);
        } elseif ($number < 1000000000) {
            return rpkTerbilangQuotation(intdiv($number, 1000000)) . " Juta " . rpkTerbilangQuotation($number % 1000000);
        } elseif ($number < 1000000000000) {
            return rpkTerbilangQuotation(intdiv($number, 1000000000)) . " Miliar " . rpkTerbilangQuotation($number % 1000000000);
        } else {
            return rpkTerbilangQuotation(intdiv($number, 1000000000000)) . " Triliun " . rpkTerbilangQuotation($number % 1000000000000);
        }
    }
    $currency = $quotation->currency ?: 'IDR';
    $spelled = ($currency === 'IDR') 
        ? (trim(rpkTerbilangQuotation($quotation->total_amount)) . " Rupiah")
        : (number_format($quotation->total_amount, 2, '.', ',') . " " . $currency);

    $statusColor = match($quotation->status) {
        'accepted', 'converted' => '#059669',
        'sent' => '#0284c7',
        'rejected' => '#e11d48',
        default => '#64748b'
    };
    $statusLabel = match($quotation->status) {
        'accepted' => 'DISETUJUI (ACCEPTED)',
        'converted' => 'DIKONVERSI KE INVOICE',
        'sent' => 'TERKIRIM (SENT)',
        'rejected' => 'DITOLAK (REJECTED)',
        default => 'DRAFT'
    };
@endphp
<!doctype html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <title>Surat Penawaran {{ $quotation->quotation_number }} — RPK Law Firm</title>
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
            font-size: 16px;
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

        /* Scope of Work Box */
        .scope-box {
            background: #fbfaf7;
            border: 1px solid #e2d2aa;
            border-radius: 5px;
            padding: 7px 10px;
            margin-bottom: 12px;
        }
        .scope-title {
            font-size: 7px;
            font-weight: bold;
            color: #8f6a22;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 3px;
        }
        .scope-text {
            font-size: 7.3px;
            color: #334155;
            line-height: 1.45;
        }

        /* 4. Financial Table */
        .financial-card {
            border: 1px solid #cbd5e1;
            border-radius: 6px;
            margin-bottom: 10px;
            overflow: hidden;
            background: #ffffff;
        }
        .financial-card table {
            width: 100%;
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
        .item-desc {
            font-weight: bold;
            color: #0f172a;
            font-size: 7.8px;
        }

        /* 5. Total Card (Take Home Pay Style) */
        .total-card {
            background: #0a1b33;
            border-radius: 6px;
            color: #ffffff;
            margin-bottom: 12px;
            padding: 8px 12px;
        }
        .total-card td {
            vertical-align: middle;
        }
        .total-left {
            width: 60%;
        }
        .total-right {
            width: 40%;
            text-align: right;
        }
        .total-title {
            font-size: 6.8px;
            font-weight: bold;
            letter-spacing: 1px;
            text-transform: uppercase;
            color: #d4af37;
        }
        .total-spelled {
            margin-top: 3px;
            font-size: 7.2px;
            color: #cbd5e1;
            font-style: italic;
            line-height: 1.3;
        }
        .total-spelled-tag {
            color: #94a3b8;
            font-weight: bold;
            font-style: normal;
        }
        .total-spelled-text {
            color: #ffffff;
            font-weight: 500;
        }
        .total-amount {
            font-size: 14px;
            font-weight: bold;
            color: #ffffff;
            letter-spacing: 0.3px;
        }

        /* 6. Terms & Breakdown Layout */
        .summary-layout {
            margin-bottom: 12px;
        }
        .summary-layout td {
            vertical-align: top;
        }
        .terms-box {
            background-color: #f8fafc;
            border: 1px solid #cbd5e1;
            border-radius: 6px;
            padding: 7px 10px;
        }
        .terms-title {
            font-size: 6.8px;
            font-weight: bold;
            color: #0a1b33;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            margin-bottom: 4px;
            padding-bottom: 2px;
            border-bottom: 1px solid #e2e8f0;
        }
        .terms-item {
            font-size: 6.8px;
            color: #475569;
            line-height: 1.4;
            margin-bottom: 2px;
        }
        
        .breakdown-table {
            border: 1px solid #cbd5e1;
            border-radius: 6px;
            background: #ffffff;
            overflow: hidden;
        }
        .breakdown-table td {
            padding: 3.5px 8px;
            font-size: 7.2px;
        }
        .breakdown-label {
            color: #64748b;
            font-weight: bold;
        }
        .breakdown-val {
            text-align: right;
            color: #0f172a;
            font-weight: bold;
        }

        /* 7. Signatures & Closing */
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
            height: 38px;
        }
        .sig-line {
            width: 140px;
            border-top: 1px solid #0a1b33;
            margin: 0 auto 3px;
        }
        .sig-name {
            font-size: 7.2px;
            font-weight: bold;
            color: #0a1b33;
        }

        /* 8. QR Code Corner */
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

        /* 9. Footer */
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
            <td>RONI, PUTRA &amp; KUSUMAH LAW FIRM &nbsp;|&nbsp; PROPOSAL PENAWARAN JASA HUKUM &nbsp;|&nbsp; RAHASIA</td>
            <td class="mono">{{ $quotation->quotation_number }} &nbsp;|&nbsp; {{ now()->timezone(config('raf.timezone'))->format('d/m/Y H:i') }} WIB</td>
        </tr>
    </table>

    <!-- QR Code Fixed in Bottom-Right Corner -->
    <div class="qr-bottom-right-corner">
        <img src="{{ $qrDataUri }}" alt="QR Verifikasi" />
        <div class="qr-label">
            SCAN VERIFIKASI<br><span style="font-weight: normal; color: #64748b;">Keabsahan Penawaran</span>
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
                Jl. Bukit Nirwana VII, Blok CC.04, Sariwangi<br>
                Kabupaten Bandung Barat, Jawa Barat<br>
                Telp: 0852 9560 1417 &nbsp;·&nbsp; Email: contact@rpklawoffice.com
            </td>
        </tr>
    </table>
    <div class="gold-rule"></div>

    <!-- 2. Document Header & Perfectly Aligned Metadata -->
    <table class="doc-header-table">
        <tr>
            <td style="width: 50%;">
                <div class="doc-kicker">SURAT PENAWARAN JASA HUKUM (FEE PROPOSAL)</div>
                <div class="doc-title">PROPOSAL HONORARIUM ADVOKAT</div>
                <div class="doc-subtitle">Penawaran ruang lingkup pendampingan hukum, advokasi perkara, dan estimasi biaya profesional.</div>
            </td>
            <td style="width: 50%; text-align: right;">
                <table class="meta-table">
                    <tr>
                        <td class="meta-label">Nomor Penawaran</td>
                        <td class="meta-sep">:</td>
                        <td class="meta-val mono">{{ $quotation->quotation_number }}</td>
                    </tr>
                    <tr>
                        <td class="meta-label">Tanggal Terbit</td>
                        <td class="meta-sep">:</td>
                        <td class="meta-val" style="color: #059669;">{{ $quotation->issued_at?->translatedFormat('d F Y') ?? now()->translatedFormat('d F Y') }}</td>
                    </tr>
                    <tr>
                        <td class="meta-label">Masa Berlaku</td>
                        <td class="meta-sep">:</td>
                        <td class="meta-val" style="color: #b91c1c;">{{ $quotation->valid_until?->translatedFormat('d F Y') ?? '30 Hari Sejak Diterbitkan' }}</td>
                    </tr>
                    <tr>
                        <td class="meta-label">Status</td>
                        <td class="meta-sep">:</td>
                        <td class="meta-val" style="color: {{ $statusColor }};">{{ $statusLabel }}</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    <!-- 3. Information Grid -->
    <table class="info-card">
        <tr>
            <!-- Bill To / Proposal To -->
            <td>
                <div class="section-label">DITUJUKAN KEPADA (PROPOSAL TO)</div>
                <div class="person-name">{{ $quotation->client->display_name }}</div>
                <table style="width: 100%;">
                    @if ($quotation->client->legal_name && $quotation->client->legal_name !== $quotation->client->display_name)
                        <tr class="detail-row">
                            <td class="detail-label">Badan Hukum</td>
                            <td class="detail-sep">:</td>
                            <td class="detail-val">{{ $quotation->client->legal_name }}</td>
                        </tr>
                    @endif
                    <tr class="detail-row">
                        <td class="detail-label">Alamat</td>
                        <td class="detail-sep">:</td>
                        <td class="detail-val">{{ $quotation->client->address_line_1 ?: '-' }}@if ($quotation->client->city), {{ $quotation->client->city }}@endif</td>
                    </tr>
                    <tr class="detail-row">
                        <td class="detail-label">Email</td>
                        <td class="detail-sep">:</td>
                        <td class="detail-val">{{ $quotation->client->email ?: '-' }}</td>
                    </tr>
                    <tr class="detail-row">
                        <td class="detail-label">NPWP</td>
                        <td class="detail-sep">:</td>
                        <td class="detail-val mono">{{ $quotation->client->tax_identifier ?: '-' }}</td>
                    </tr>
                </table>
            </td>

            <!-- Matter & Engagement Details -->
            <td>
                <div class="section-label">RINCIAN PERKARA &amp; PERIKATAN</div>
                <div class="person-name mono" style="color: #0369a1;">
                    {{ $quotation->matter ? $quotation->matter->matter_number : $quotation->quotation_number }}
                </div>
                <table style="width: 100%;">
                    @if ($quotation->matter)
                        <tr class="detail-row">
                            <td class="detail-label">Perkara</td>
                            <td class="detail-sep">:</td>
                            <td class="detail-val">{{ $quotation->matter->title }}</td>
                        </tr>
                    @endif
                    <tr class="detail-row">
                        <td class="detail-label">Perihal Penawaran</td>
                        <td class="detail-sep">:</td>
                        <td class="detail-val">{{ $quotation->title }}</td>
                    </tr>
                    <tr class="detail-row">
                        <td class="detail-label">Mata Uang</td>
                        <td class="detail-sep">:</td>
                        <td class="detail-val mono">{{ $currency }} (Rupiah)</td>
                    </tr>
                    <tr class="detail-row">
                        <td class="detail-label">Disiapkan Oleh</td>
                        <td class="detail-sep">:</td>
                        <td class="detail-val">{{ $quotation->creator->name ?? 'Tim Legal RPK' }}</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    <!-- Ruang Lingkup Pekerjaan (Optional Scope Box) -->
    @if ($quotation->scope)
        <div class="scope-box">
            <div class="scope-title">RUANG LINGKUP PEKERJAAN &amp; ADVOKASI HUKUM (SCOPE OF ENGAGEMENT)</div>
            <div class="scope-text">{!! nl2br(e($quotation->scope)) !!}</div>
        </div>
    @endif

    <!-- 4. Line Items Table -->
    <div class="financial-card">
        <table>
            <thead>
                <tr>
                    <th class="center" style="width: 6%;">NO</th>
                    <th style="width: 52%; text-align: left;">DESKRIPSI JASA HUKUM &amp; PEKERJAAN</th>
                    <th class="center" style="width: 10%;">KUANTITAS</th>
                    <th class="right" style="width: 16%;">TARIF SATUAN ({{ $currency }})</th>
                    <th class="right" style="width: 16%;">TOTAL ({{ $currency }})</th>
                </tr>
            </thead>
            <tbody>
                @forelse ($quotation->lineItems as $index => $item)
                    <tr>
                        <td class="center mono muted">{{ str_pad((string) ($index + 1), 2, '0', STR_PAD_LEFT) }}</td>
                        <td>
                            <div class="item-desc">{{ $item->description }}</div>
                        </td>
                        <td class="center mono">{{ $item->quantity }}</td>
                        <td class="right mono">{{ number_format($item->unit_amount ?? ($item->total_amount / max(1, $item->quantity)), 0, ',', '.') }}</td>
                        <td class="right mono"><strong>{{ number_format($item->total_amount, 0, ',', '.') }}</strong></td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="5" class="center muted" style="padding: 12px; font-style: italic;">Belum ada item penawaran tercatat.</td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>

    <!-- 5. Grand Total Card (Take Home Pay style) -->
    <table class="total-card">
        <tr>
            <td class="total-left">
                <div class="total-title">TOTAL ESTIMASI PENAWARAN (GRAND TOTAL)</div>
                <div class="total-spelled">
                    <span class="total-spelled-tag">Terbilang:</span>
                    <span class="total-spelled-text">{{ $spelled }}</span>
                </div>
            </td>
            <td class="total-right">
                <div class="total-amount mono">
                    {{ $currency }} {{ number_format($quotation->total_amount, 0, ',', '.') }}
                </div>
            </td>
        </tr>
    </table>

    <!-- 6. Terms & Conditions + Financial Breakdown -->
    <table class="summary-layout">
        <tr>
            <!-- Terms Box -->
            <td style="width: 55%; padding-right: 14px;">
                <div class="terms-box">
                    <div class="terms-title">KETENTUAN &amp; MEKANISME PERIKATAN</div>
                    <div class="terms-item">1. Penawaran ini berlaku selama <strong>30 (tiga puluh) hari kalender</strong> sejak tanggal diterbitkan.</div>
                    <div class="terms-item">2. Biaya penanganan belum termasuk biaya operasional lapangan/disbursement resmi (PNBP, registrasi perkara, appraisal, akomodasi luar kota).</div>
                    <div class="terms-item">3. Apabila penawaran ini disetujui, harap menandatangani lembar persetujuan di samping atau menerbitkan Surat Perintah Kerja (SPK).</div>
                    <div class="terms-item">4. Pembayaran dilakukan via transfer bank resmi firma hukum Roni, Putra &amp; Kusumah setelah invoice diterbitkan.</div>
                </div>
            </td>

            <!-- Financial Breakdown Table -->
            <td style="width: 45%;">
                <table class="breakdown-table" style="width: 100%;">
                    <tr>
                        <td class="breakdown-label">Subtotal:</td>
                        <td class="breakdown-val mono">{{ $currency }} {{ number_format($quotation->subtotal_amount, 0, ',', '.') }}</td>
                    </tr>
                    @if ($quotation->discount_amount > 0)
                        <tr>
                            <td class="breakdown-label">Potongan / Diskon:</td>
                            <td class="breakdown-val mono" style="color: #047857;">- {{ $currency }} {{ number_format($quotation->discount_amount, 0, ',', '.') }}</td>
                        </tr>
                    @endif
                    @if ($quotation->tax_amount > 0)
                        <tr>
                            <td class="breakdown-label">PPN:</td>
                            <td class="breakdown-val mono">{{ $currency }} {{ number_format($quotation->tax_amount, 0, ',', '.') }}</td>
                        </tr>
                    @endif
                    <tr style="background: #f8fafc; border-top: 1px solid #cbd5e1;">
                        <td class="breakdown-label" style="color: #0a1b33; font-size: 7.8px;">TOTAL PENAWARAN:</td>
                        <td class="breakdown-val mono" style="color: #0a1b33; font-size: 7.8px;">{{ $currency }} {{ number_format($quotation->total_amount, 0, ',', '.') }}</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    <!-- 7. Closing Signatures -->
    <table class="closing-layout">
        <tr>
            <td class="legal-clause" style="width: 46%; padding-right: 14px;">
                <strong>PENGESAHAN PERIKATAN HUKUM:</strong><br>
                Surat penawaran ini disusun secara profesional melalui sistem terkomputerisasi RPK App. Penandatanganan dokumen ini oleh Klien merupakan persetujuan awal (Letter of Intent) untuk penyusunan Perjanjian Jasa Bantuan Hukum resmi.
            </td>
            <td class="sig-box" style="width: 27%;">
                <div class="sig-role">DISETUJUI OLEH KLIEN</div>
                <div class="sig-firm">{{ $quotation->client->display_name }}</div>
                <div class="sig-space"></div>
                <div class="sig-line"></div>
                <div class="sig-name">Nama: .......................................</div>
            </td>
            <td class="sig-box" style="width: 27%;">
                <div class="sig-role">HORMAT KAMI</div>
                <div class="sig-firm">RPK LAW FIRM</div>
                <div class="sig-space"></div>
                <div class="sig-line"></div>
                <div class="sig-name">{{ $quotation->approver->name ?? 'Managing Partner' }}</div>
            </td>
        </tr>
    </table>

</body>
</html>
