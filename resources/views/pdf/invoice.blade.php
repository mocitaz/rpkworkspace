@php
    $verificationUrl = route('verify.invoice', $invoice->invoice_number);
    $qrDataUri = (new \Endroid\QrCode\Writer\PngWriter())->write(
        new \Endroid\QrCode\QrCode(data: $verificationUrl, size: 160, margin: 0)
    )->getDataUri();

    function rpkTerbilangInvoice($number): string {
        $number = abs((int) $number);
        $words = ["", "Satu", "Dua", "Tiga", "Empat", "Lima", "Enam", "Tujuh", "Delapan", "Sembilan", "Sepuluh", "Sebelas"];
        if ($number < 12) {
            return $words[$number];
        } elseif ($number < 20) {
            return rpkTerbilangInvoice($number - 10) . " Belas";
        } elseif ($number < 100) {
            return rpkTerbilangInvoice(intdiv($number, 10)) . " Puluh " . rpkTerbilangInvoice($number % 10);
        } elseif ($number < 200) {
            return "Seratus " . rpkTerbilangInvoice($number - 100);
        } elseif ($number < 1000) {
            return rpkTerbilangInvoice(intdiv($number, 100)) . " Ratus " . rpkTerbilangInvoice($number % 100);
        } elseif ($number < 2000) {
            return "Seribu " . rpkTerbilangInvoice($number - 1000);
        } elseif ($number < 1000000) {
            return rpkTerbilangInvoice(intdiv($number, 1000)) . " Ribu " . rpkTerbilangInvoice($number % 1000);
        } elseif ($number < 1000000000) {
            return rpkTerbilangInvoice(intdiv($number, 1000000)) . " Juta " . rpkTerbilangInvoice($number % 1000000);
        } elseif ($number < 1000000000000) {
            return rpkTerbilangInvoice(intdiv($number, 1000000000)) . " Miliar " . rpkTerbilangInvoice($number % 1000000000);
        } else {
            return rpkTerbilangInvoice(intdiv($number, 1000000000000)) . " Triliun " . rpkTerbilangInvoice($number % 1000000000000);
        }
    }
    $currency = $invoice->currency ?: 'IDR';
    $spelled = ($currency === 'IDR') 
        ? (trim(rpkTerbilangInvoice($invoice->total_amount)) . " Rupiah")
        : (number_format($invoice->total_amount, 2, '.', ',') . " " . $currency);

    $isPaid = $invoice->status === 'paid' || ($invoice->outstanding_amount <= 0 && $invoice->total_amount > 0);
    $statusColor = match($invoice->status) {
        'paid' => '#059669',
        'partial' => '#d97706',
        default => ($isPaid ? '#059669' : '#e11d48')
    };
    $statusLabel = match($invoice->status) {
        'paid' => 'LUNAS (PAID)',
        'partial' => 'DIBAYAR SEBAGIAN',
        default => ($isPaid ? 'LUNAS (PAID)' : 'BELUM DIBAYAR (UNPAID)')
    };

    $matterTitle = $invoice->matter?->title;
    $invoiceTitle = $invoice->title;
    $cleanedTitle = $invoiceTitle;
    if ($matterTitle && $invoiceTitle) {
        $cleanedTitle = preg_replace('/\s*[-—–]\s*' . preg_quote($matterTitle, '/') . '\s*$/u', '', $invoiceTitle);
        $cleanedTitle = trim($cleanedTitle);
    }
@endphp
<!doctype html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <title>Faktur Tagihan {{ $invoice->invoice_number }} — RPK Law Firm</title>
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
            margin-bottom: 16px;
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
            font-size: 17px;
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
            margin-left: auto;
            border-collapse: collapse;
            width: auto;
        }
        .meta-table td {
            padding: 2px 0;
            vertical-align: middle;
        }
        .meta-label {
            font-size: 6.8px;
            font-weight: bold;
            color: #64748b;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            text-align: left;
            white-space: nowrap;
        }
        .meta-sep {
            color: #64748b;
            font-weight: bold;
            font-size: 7.2px;
            padding: 0 6px;
            text-align: center;
            width: 14px;
        }
        .meta-val {
            font-size: 8.5px;
            font-weight: bold;
            color: #0f172a;
            text-align: left;
            white-space: nowrap;
        }

        /* 3. Information Grid (Aligned 3-column table with neat vertical colons) */
        .info-card {
            background: #f8fafc;
            border: 1px solid #cbd5e1;
            border-radius: 4px;
            margin-bottom: 14px;
            table-layout: fixed;
        }
        .info-card > tbody > tr > td {
            width: 50%;
            padding: 8px 12px;
            vertical-align: top;
        }
        .info-card > tbody > tr > td:first-child {
            border-right: 1px solid #e2e8f0;
        }
        .section-label {
            font-size: 6.5px;
            font-weight: bold;
            color: #8f6a22;
            letter-spacing: 1px;
            text-transform: uppercase;
            margin-bottom: 3px;
        }
        .person-name {
            font-size: 10px;
            font-weight: bold;
            color: #0a1b33;
            margin-bottom: 4px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .detail-row td {
            padding: 2px 0;
            font-size: 7.3px;
            vertical-align: top;
            line-height: 1.35;
        }
        .detail-label {
            width: 24%;
            color: #64748b;
            font-weight: bold;
            white-space: nowrap;
        }
        .detail-sep {
            width: 10px;
            text-align: center;
            color: #64748b;
            font-weight: bold;
            padding: 0 2px;
        }
        .detail-val {
            width: 76%;
            color: #0f172a;
            font-weight: bold;
        }

        /* 4. Line Items Table */
        .financial-card {
            border: 1px solid #cbd5e1;
            border-radius: 4px;
            overflow: hidden;
            background: #ffffff;
            margin-bottom: 14px;
        }
        .financial-card table {
            width: 100%;
        }
        .financial-card th {
            background: #f8fafc;
            color: #0a1b33;
            font-size: 6.8px;
            font-weight: bold;
            padding: 6px 10px;
            text-transform: uppercase;
            letter-spacing: .5px;
            border-bottom: 1.5px solid #cbd5e1;
        }
        .item-row td {
            padding: 5.5px 10px;
            border-bottom: 1px solid #f1f5f9;
            font-size: 7.6px;
            color: #334155;
            vertical-align: top;
        }
        .item-desc {
            font-weight: bold;
            color: #0a1b33;
            font-size: 7.8px;
        }
        .subtotal-row td {
            background: #faf8f5;
            font-size: 7.8px;
            font-weight: bold;
            color: #0a1b33;
            padding: 6px 10px;
            border-top: 1px solid #cbd5e1;
            border-bottom: 1.5px solid #cbd5e1;
        }

        /* 5. Grand Total Card (Take Home Pay Style) */
        .total-card {
            background: #fdfbf7;
            border: 1px solid #e8e1d5;
            border-left: 4px solid #8f6a22;
            border-radius: 4px;
            margin-top: 14px;
            margin-bottom: 16px;
        }
        .total-card td {
            padding: 10px 14px;
            vertical-align: middle;
        }
        .total-left {
            width: 58%;
        }
        .total-title {
            font-size: 6.8px;
            font-weight: bold;
            color: #8f6a22;
            letter-spacing: 0.8px;
            text-transform: uppercase;
            margin-bottom: 3px;
        }
        .total-spelled {
            font-size: 7.8px;
            color: #334155;
            line-height: 1.4;
        }
        .total-spelled-tag {
            font-weight: bold;
            color: #64748b;
            margin-right: 3px;
        }
        .total-spelled-text {
            font-weight: bold;
            color: #0a1b33;
            font-style: italic;
        }
        .total-right {
            width: 42%;
            text-align: right;
        }
        .total-amount {
            font-size: 19px;
            font-weight: bold;
            color: #0a1b33;
            letter-spacing: -0.3px;
        }

        /* 6. Bank & Payment Remittance Layout */
        .summary-layout {
            margin-bottom: 14px;
            page-break-inside: avoid;
        }
        .summary-layout td {
            vertical-align: top;
        }
        .bank-box {
            background: #f8fafc;
            border: 1px solid #cbd5e1;
            border-top: 2px solid #0a1b33;
            border-radius: 4px;
            padding: 8px 10px;
        }
        .bank-title {
            font-size: 7.2px;
            font-weight: bold;
            color: #0a1b33;
            text-transform: uppercase;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 3px;
            margin-bottom: 5px;
        }
        .bank-item {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 3px;
            padding: 4px 7px;
            margin-bottom: 4px;
        }
        .bank-item-title {
            font-size: 7px;
            font-weight: bold;
            color: #0a1b33;
        }
        .bank-item-acc {
            font-size: 8px;
            font-weight: bold;
            color: #0369a1;
        }
        .bank-item-name {
            font-size: 6.6px;
            color: #475569;
        }

        .breakdown-table {
            border: 1px solid #cbd5e1;
            border-radius: 4px;
            background: #ffffff;
        }
        .breakdown-table td {
            padding: 4.5px 8px;
            font-size: 7.4px;
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
        .outstanding-highlight td {
            background: #fff1f2;
            color: #be123c;
            font-weight: bold;
            font-size: 7.8px;
            border-top: 1px solid #fecdd3;
        }

        /* 7. Closing Signatures */
        .closing-layout {
            margin-top: 22px;
            page-break-inside: avoid;
        }
        .closing-layout td {
            vertical-align: top;
        }
        .legal-clause {
            font-size: 6.5px;
            color: #64748b;
            line-height: 1.45;
        }
        .sig-box {
            text-align: center;
            font-size: 7.2px;
        }
        .sig-role {
            font-size: 6.5px;
            color: #64748b;
            text-transform: uppercase;
            font-weight: bold;
        }
        .sig-firm {
            font-size: 7.2px;
            font-weight: bold;
            color: #0a1b33;
            margin-top: 1px;
            text-transform: uppercase;
        }
        .sig-space {
            height: 60px;
        }
        .sig-line {
            width: 190px;
            border-top: 1px solid #0a1b33;
            margin: 0 auto 4px;
        }
        .sig-name {
            font-size: 7.5px;
            font-weight: bold;
            color: #0a1b33;
        }

        /* 8. QR Verification Fixed at Absolute Bottom-Right of Paper */
        .qr-bottom-right-corner {
            position: fixed;
            right: 0px;
            bottom: -12px;
            text-align: center;
            z-index: 100;
        }
        .qr-bottom-right-corner img {
            width: 46px;
            height: 46px;
            border: 1px solid #cbd5e1;
            padding: 2px;
            border-radius: 3px;
            background: #ffffff;
        }
        .qr-bottom-right-corner .qr-label {
            font-size: 5.2px;
            color: #475569;
            margin-top: 1.5px;
            font-weight: bold;
            line-height: 1.15;
            text-align: center;
        }

        /* 9. Footer with safe margin from bottom edge */
        .footer {
            position: fixed;
            right: 60px;
            bottom: -14px;
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
            <td>RONI, PUTRA &amp; KUSUMAH LAW FIRM &nbsp;|&nbsp; DOKUMEN FAKTUR TAGIHAN RESMI &nbsp;|&nbsp; RAHASIA</td>
            <td class="mono">{{ $invoice->invoice_number }} &nbsp;|&nbsp; {{ now()->timezone(config('raf.timezone'))->format('d/m/Y H:i') }} WIB</td>
        </tr>
    </table>

    <!-- QR Code Fixed in Bottom-Right Corner of the Paper -->
    <div class="qr-bottom-right-corner">
        <img src="{{ $qrDataUri }}" alt="QR Verifikasi" />
        <div class="qr-label">
            SCAN VERIFIKASI<br><span style="font-weight: normal; color: #64748b;">Keaslian Faktur</span>
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

    <!-- 2. Document Header & Inline Metadata with Perfectly Aligned Spacing -->
    <table class="doc-header-table">
        <tr>
            <td style="width: 50%;">
                <div class="doc-kicker">FAKTUR TAGIHAN RESMI (INVOICE)</div>
                <div class="doc-title">INVOICE PENAGIHAN JASA HUKUM</div>
                <div class="doc-subtitle">Honorarium advokat, biaya penanganan perkara, dan penggantian pengeluaran operasional.</div>
            </td>
            <td style="width: 50%; text-align: right;">
                <table class="meta-table">
                    <tr>
                        <td class="meta-label">Nomor Faktur</td>
                        <td class="meta-sep">:</td>
                        <td class="meta-val mono">{{ $invoice->invoice_number }}</td>
                    </tr>
                    <tr>
                        <td class="meta-label">Tanggal Terbit</td>
                        <td class="meta-sep">:</td>
                        <td class="meta-val" style="color: #059669;">{{ $invoice->issued_at?->translatedFormat('d F Y') ?? now()->translatedFormat('d F Y') }}</td>
                    </tr>
                    <tr>
                        <td class="meta-label">Jatuh Tempo</td>
                        <td class="meta-sep">:</td>
                        <td class="meta-val" style="color: #b91c1c;">{{ $invoice->due_at?->translatedFormat('d F Y') ?? 'Saat Diterima' }}</td>
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

    <!-- 3. Information Grid (Aligned 3-column table with neat vertical colons & matched visual balance) -->
    <table class="info-card">
        <tr>
            <!-- Bill To -->
            <td>
                <div class="section-label">DITUJUKAN KEPADA (BILL TO)</div>
                <div class="person-name">{{ $invoice->client->display_name }}</div>
                <table style="width: 100%;">
                    @if ($invoice->client->legal_name && $invoice->client->legal_name !== $invoice->client->display_name)
                        <tr class="detail-row">
                            <td class="detail-label">Badan Hukum</td>
                            <td class="detail-sep">:</td>
                            <td class="detail-val">{{ $invoice->client->legal_name }}</td>
                        </tr>
                    @endif
                    <tr class="detail-row">
                        <td class="detail-label">Alamat</td>
                        <td class="detail-sep">:</td>
                        <td class="detail-val">{{ $invoice->client->address_line_1 ?: '-' }}@if ($invoice->client->city), {{ $invoice->client->city }}@endif</td>
                    </tr>
                    <tr class="detail-row">
                        <td class="detail-label">Email</td>
                        <td class="detail-sep">:</td>
                        <td class="detail-val">{{ $invoice->client->email ?: '-' }}</td>
                    </tr>
                    <tr class="detail-row">
                        <td class="detail-label">NPWP</td>
                        <td class="detail-sep">:</td>
                        <td class="detail-val mono">{{ $invoice->client->tax_identifier ?: '-' }}</td>
                    </tr>
                </table>
            </td>

            <!-- Matter & Billing Details -->
            <td>
                <div class="section-label">RINCIAN PERKARA &amp; PENAGIHAN</div>
                <div class="person-name mono" style="color: #0369a1;">
                    {{ $invoice->matter ? $invoice->matter->matter_number : $invoice->invoice_number }}
                </div>
                <table style="width: 100%;">
                    @if ($invoice->matter)
                        <tr class="detail-row">
                            <td class="detail-label">Perkara</td>
                            <td class="detail-sep">:</td>
                            <td class="detail-val">{{ $invoice->matter->title }}</td>
                        </tr>
                        @if ($cleanedTitle && $cleanedTitle !== $invoice->matter->title)
                            <tr class="detail-row">
                                <td class="detail-label">Termin Tagihan</td>
                                <td class="detail-sep">:</td>
                                <td class="detail-val">{{ $cleanedTitle }}</td>
                            </tr>
                        @endif
                    @else
                        <tr class="detail-row">
                            <td class="detail-label">Perihal Tagihan</td>
                            <td class="detail-sep">:</td>
                            <td class="detail-val">{{ $invoice->title }}</td>
                        </tr>
                    @endif
                    <tr class="detail-row">
                        <td class="detail-label">Mata Uang</td>
                        <td class="detail-sep">:</td>
                        <td class="detail-val mono">{{ $currency }} (Rupiah)</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    <!-- 4. Line Items Table -->
    <div class="financial-card">
        <table>
            <thead>
                <tr>
                    <th class="center" style="width: 6%;">NO</th>
                    <th style="width: 52%; text-align: left;">DESKRIPSI JASA HUKUM &amp; PENGELUARAN</th>
                    <th class="center" style="width: 10%;">KUANTITAS</th>
                    <th class="right" style="width: 16%;">TARIF SATUAN ({{ $currency }})</th>
                    <th class="right" style="width: 16%;">TOTAL ({{ $currency }})</th>
                </tr>
            </thead>
            <tbody>
                @forelse ($invoice->lineItems as $index => $item)
                    <tr class="item-row">
                        <td class="center mono muted">{{ str_pad((string) ($index + 1), 2, '0', STR_PAD_LEFT) }}</td>
                        <td>
                            <div class="item-desc">{{ $item->description }}</div>
                        </td>
                        <td class="center mono">{{ $item->quantity }}</td>
                        <td class="right mono">{{ number_format($item->unit_amount ?? ($item->total_amount / max(1, $item->quantity)), 0, ',', '.') }}</td>
                        <td class="right mono"><strong>{{ number_format($item->total_amount, 0, ',', '.') }}</strong></td>
                    </tr>
                @empty
                    <tr class="item-row">
                        <td colspan="5" class="center muted" style="padding: 12px; font-style: italic;">Belum ada item tagihan tercatat.</td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>

    <!-- 5. Grand Total Card (Take Home Pay style) -->
    <table class="total-card">
        <tr>
            <td class="total-left">
                <div class="total-title">TOTAL TAGIHAN (GRAND TOTAL)</div>
                <div class="total-spelled">
                    <span class="total-spelled-tag">Terbilang:</span>
                    <span class="total-spelled-text">{{ $spelled }}</span>
                </div>
            </td>
            <td class="total-right">
                <div class="total-amount mono">
                    {{ $currency }} {{ number_format($invoice->total_amount, 0, ',', '.') }}
                </div>
            </td>
        </tr>
    </table>

    <!-- 6. Bank & Payment Remittance + Financial Breakdown -->
    <table class="summary-layout">
        <tr>
            <!-- Bank Remittance Box -->
            <td style="width: 55%; padding-right: 14px;">
                <div class="bank-box">
                    <div class="bank-title">INFORMASI PEMBAYARAN &amp; REKENING RESMI</div>
                    
                    <!-- BCA -->
                    <div class="bank-item">
                        <div class="bank-item-title">Bank Central Asia (BCA) — KCU Dago Bandung</div>
                        <div class="bank-item-acc mono">777-088-9921</div>
                        <div class="bank-item-name">a.n. <strong>RONI PUTRA KUSUMAH LAW FIRM</strong></div>
                    </div>

                    <!-- Mandiri -->
                    <div class="bank-item" style="margin-bottom: 2px;">
                        <div class="bank-item-title">Bank Mandiri — KCP Thamrin Jakarta</div>
                        <div class="bank-item-acc mono">137-00-198899-2</div>
                        <div class="bank-item-name">a.n. <strong>RPK LAW FIRM</strong></div>
                    </div>

                    <div style="margin-top: 4px; font-size: 6.5px; color: #64748b; font-style: italic;">
                        *Cantumkan Nomor Faktur <strong>{{ $invoice->invoice_number }}</strong> pada berita transfer dan kirim bukti pembayaran ke <strong>contact@rpklawoffice.com</strong>.
                    </div>
                </div>
            </td>

            <!-- Financial Breakdown Table -->
            <td style="width: 45%;">
                <table class="breakdown-table">
                    <tr>
                        <td class="breakdown-label">Subtotal:</td>
                        <td class="breakdown-val mono">{{ $currency }} {{ number_format($invoice->subtotal_amount, 0, ',', '.') }}</td>
                    </tr>
                    @if ($invoice->discount_amount > 0)
                        <tr>
                            <td class="breakdown-label">Potongan / Diskon:</td>
                            <td class="breakdown-val mono" style="color: #047857;">- {{ $currency }} {{ number_format($invoice->discount_amount, 0, ',', '.') }}</td>
                        </tr>
                    @endif
                    @if ($invoice->tax_amount > 0)
                        <tr>
                            <td class="breakdown-label">PPN:</td>
                            <td class="breakdown-val mono">{{ $currency }} {{ number_format($invoice->tax_amount, 0, ',', '.') }}</td>
                        </tr>
                    @endif
                    @if ($invoice->paid_amount > 0)
                        <tr>
                            <td class="breakdown-label" style="color: #047857;">Telah Dibayar:</td>
                            <td class="breakdown-val mono" style="color: #047857;">{{ $currency }} {{ number_format($invoice->paid_amount, 0, ',', '.') }}</td>
                        </tr>
                        <tr class="outstanding-highlight">
                            <td class="breakdown-label" style="color: #be123c;">SISA TAGIHAN:</td>
                            <td class="breakdown-val mono">{{ $currency }} {{ number_format($invoice->outstanding_amount, 0, ',', '.') }}</td>
                        </tr>
                    @endif
                </table>
            </td>
        </tr>
    </table>

    <!-- 7. Closing Signatures -->
    <table class="closing-layout">
        <tr>
            <td class="legal-clause" style="width: 60%; padding-right: 20px;">
                <strong>CATATAN HUKUM &amp; KEPATUHAN:</strong><br>
                Faktur ini diterbitkan secara sah berdasarkan Perjanjian Jasa Hukum yang disepakati melalui sistem terkomputerisasi RPK App - Integrated Legal Practice System. Pembayaran dianggap sah setelah dana efektif masuk ke salah satu rekening resmi firma hukum Roni, Putra &amp; Kusumah di atas. Dokumen ini merupakan bukti tagihan yang sah menurut hukum.
            </td>
            <td class="sig-box" style="width: 40%;">
                <div class="sig-role">HORMAT KAMI,</div>
                <div class="sig-firm">RONI, PUTRA &amp; KUSUMAH LAW FIRM</div>
                <div class="sig-space"></div>
                <div class="sig-line"></div>
                <div class="sig-name">Managing Partner / Bagian Keuangan</div>
            </td>
        </tr>
    </table>

</body>
</html>
