@php
    $refNumber = $payment->reference_number ?: ('PAY-' . $payment->id);
    $verificationUrl = route('verify.payment-receipt', $refNumber);
    $qrDataUri = (new \Endroid\QrCode\Writer\PngWriter())->write(
        new \Endroid\QrCode\QrCode(data: $verificationUrl, size: 160, margin: 0)
    )->getDataUri();

    function rpkTerbilangReceipt($number): string {
        $number = abs((int) $number);
        $words = ["", "Satu", "Dua", "Tiga", "Empat", "Lima", "Enam", "Tujuh", "Delapan", "Sembilan", "Sepuluh", "Sebelas"];
        if ($number < 12) {
            return $words[$number];
        } elseif ($number < 20) {
            return rpkTerbilangReceipt($number - 10) . " Belas";
        } elseif ($number < 100) {
            return rpkTerbilangReceipt(intdiv($number, 10)) . " Puluh " . rpkTerbilangReceipt($number % 10);
        } elseif ($number < 200) {
            return "Seratus " . rpkTerbilangReceipt($number - 100);
        } elseif ($number < 1000) {
            return rpkTerbilangReceipt(intdiv($number, 100)) . " Ratus " . rpkTerbilangReceipt($number % 100);
        } elseif ($number < 2000) {
            return "Seribu " . rpkTerbilangReceipt($number - 1000);
        } elseif ($number < 1000000) {
            return rpkTerbilangReceipt(intdiv($number, 1000)) . " Ribu " . rpkTerbilangReceipt($number % 1000);
        } elseif ($number < 1000000000) {
            return rpkTerbilangReceipt(intdiv($number, 1000000)) . " Juta " . rpkTerbilangReceipt($number % 1000000);
        } elseif ($number < 1000000000000) {
            return rpkTerbilangReceipt(intdiv($number, 1000000000)) . " Miliar " . rpkTerbilangReceipt($number % 1000000000);
        } else {
            return rpkTerbilangReceipt(intdiv($number, 1000000000000)) . " Triliun " . rpkTerbilangReceipt($number % 1000000000000);
        }
    }
    $currency = $payment->currency ?: 'IDR';
    $spelled = ($currency === 'IDR') 
        ? (trim(rpkTerbilangReceipt($payment->amount)) . " Rupiah")
        : (number_format($payment->amount, 2, '.', ',') . " " . $currency);

    $methodLabel = match($payment->method) {
        'bank_transfer' => 'TRANSFER BANK',
        'cash' => 'TUNAI (CASH)',
        'cheque' => 'CEK / GIRO',
        'qris' => 'QRIS RESMI',
        default => strtoupper($payment->method ?: 'BANK TRANSFER')
    };
@endphp
<!doctype html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <title>Kuitansi Pembayaran {{ $refNumber }} — RPK Law Firm</title>
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

        /* 4. Financial Total Card (Take Home Pay Style) */
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
            font-size: 15px;
            font-weight: bold;
            color: #ffffff;
            letter-spacing: 0.3px;
        }

        /* 5. Allocation Table */
        .financial-card {
            border: 1px solid #cbd5e1;
            border-radius: 6px;
            margin-bottom: 12px;
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

        /* 6. Stamp & Closing Layout */
        .closing-layout {
            margin-top: 14px;
        }
        .closing-layout td {
            vertical-align: middle;
        }
        .legal-clause {
            font-size: 6.5px;
            color: #64748b;
            line-height: 1.45;
            text-align: justify;
        }
        .stamp-box {
            text-align: center;
        }
        .stamp-badge {
            border: 2px solid #059669;
            color: #059669;
            padding: 4px 10px;
            display: inline-block;
            font-weight: 900;
            font-size: 10.5px;
            letter-spacing: 1.5px;
            border-radius: 4px;
            text-transform: uppercase;
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
            height: 58px;
        }
        .sig-line {
            width: 180px;
            border-top: 1px solid #0a1b33;
            margin: 0 auto 4px;
        }
        .sig-name {
            font-size: 7.5px;
            font-weight: bold;
            color: #0a1b33;
        }

        /* 7. QR Code Corner */
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

        /* 8. Footer */
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
            <td>RONI, PUTRA &amp; KUSUMAH LAW FIRM &nbsp;|&nbsp; KUITANSI PEMBAYARAN RESMI &nbsp;|&nbsp; RAHASIA</td>
            <td class="mono">{{ $refNumber }} &nbsp;|&nbsp; {{ now()->timezone(config('raf.timezone'))->format('d/m/Y H:i') }} WIB</td>
        </tr>
    </table>

    <!-- QR Code Fixed in Bottom-Right Corner -->
    <div class="qr-bottom-right-corner">
        <img src="{{ $qrDataUri }}" alt="QR Verifikasi" />
        <div class="qr-label">
            SCAN VERIFIKASI<br><span style="font-weight: normal; color: #64748b;">Keabsahan Kuitansi</span>
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
                <div class="doc-kicker">BUKTI TANDA TERIMA PEMBAYARAN SAH (OFFICIAL RECEIPT)</div>
                <div class="doc-title">KUITANSI PEMBAYARAN RESMI</div>
                <div class="doc-subtitle">Tanda terima sah pelunasan honorarium advokat, biaya perkara, dan setoran dana klien.</div>
            </td>
            <td style="width: 50%; text-align: right;">
                <table class="meta-table">
                    <tr>
                        <td class="meta-label">Nomor Kuitansi</td>
                        <td class="meta-sep">:</td>
                        <td class="meta-val mono">{{ $refNumber }}</td>
                    </tr>
                    <tr>
                        <td class="meta-label">Tanggal Diterima</td>
                        <td class="meta-sep">:</td>
                        <td class="meta-val" style="color: #059669;">{{ $payment->received_at?->translatedFormat('d F Y') ?? now()->translatedFormat('d F Y') }}</td>
                    </tr>
                    <tr>
                        <td class="meta-label">Metode Bayar</td>
                        <td class="meta-sep">:</td>
                        <td class="meta-val mono" style="color: #0369a1;">{{ $methodLabel }}</td>
                    </tr>
                    <tr>
                        <td class="meta-label">Status</td>
                        <td class="meta-sep">:</td>
                        <td class="meta-val" style="color: #059669;">LUNAS (SETTLED)</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    <!-- 3. Information Grid -->
    <table class="info-card">
        <tr>
            <!-- Received From -->
            <td>
                <div class="section-label">TELAH DITERIMA DARI (RECEIVED FROM)</div>
                <div class="person-name">{{ $payment->client->display_name ?? 'Klien Terdaftar' }}</div>
                <table style="width: 100%;">
                    @if ($payment->client?->legal_name && $payment->client->legal_name !== $payment->client->display_name)
                        <tr class="detail-row">
                            <td class="detail-label">Badan Hukum</td>
                            <td class="detail-sep">:</td>
                            <td class="detail-val">{{ $payment->client->legal_name }}</td>
                        </tr>
                    @endif
                    <tr class="detail-row">
                        <td class="detail-label">Alamat</td>
                        <td class="detail-sep">:</td>
                        <td class="detail-val">{{ $payment->client?->address_line_1 ?: '-' }}@if ($payment->client?->city), {{ $payment->client->city }}@endif</td>
                    </tr>
                    <tr class="detail-row">
                        <td class="detail-label">Email</td>
                        <td class="detail-sep">:</td>
                        <td class="detail-val">{{ $payment->client?->email ?: '-' }}</td>
                    </tr>
                    <tr class="detail-row">
                        <td class="detail-label">NPWP</td>
                        <td class="detail-sep">:</td>
                        <td class="detail-val mono">{{ $payment->client?->tax_identifier ?: '-' }}</td>
                    </tr>
                </table>
            </td>

            <!-- Receipt & Receiving Account Details -->
            <td>
                <div class="section-label">DETAIL PENERIMAAN &amp; REKENING FIRMA</div>
                <table style="width: 100%;">
                    @if ($payment->matter)
                        <tr class="detail-row">
                            <td class="detail-label">No. Perkara</td>
                            <td class="detail-sep">:</td>
                            <td class="detail-val mono" style="color: #0369a1;">{{ $payment->matter->matter_number }}</td>
                        </tr>
                        <tr class="detail-row">
                            <td class="detail-label">Judul Perkara</td>
                            <td class="detail-sep">:</td>
                            <td class="detail-val">{{ $payment->matter->title }}</td>
                        </tr>
                    @endif
                    <tr class="detail-row">
                        <td class="detail-label">Rekening Masuk</td>
                        <td class="detail-sep">:</td>
                        <td class="detail-val">{{ $payment->account->name ?? 'Rekening Bank Operasional' }}</td>
                    </tr>
                    @if ($payment->account && $payment->account->account_number)
                        <tr class="detail-row">
                            <td class="detail-label">No. Rekening</td>
                            <td class="detail-sep">:</td>
                            <td class="detail-val mono">{{ $payment->account->bank_name }} - {{ $payment->account->account_number }}</td>
                        </tr>
                    @endif
                    <tr class="detail-row">
                        <td class="detail-label">Dicatat Oleh</td>
                        <td class="detail-sep">:</td>
                        <td class="detail-val">{{ $payment->recorder->name ?? 'Bagian Keuangan Firma' }}</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    <!-- 4. Grand Total Received Card (Take Home Pay style) -->
    <table class="total-card">
        <tr>
            <td class="total-left">
                <div class="total-title">JUMLAH PEMBAYARAN DITERIMA (TOTAL SETORAN)</div>
                <div class="total-spelled">
                    <span class="total-spelled-tag">Terbilang:</span>
                    <span class="total-spelled-text">{{ $spelled }}</span>
                </div>
            </td>
            <td class="total-right">
                <div class="total-amount mono">
                    {{ $currency }} {{ number_format($payment->amount, 0, ',', '.') }}
                </div>
            </td>
        </tr>
    </table>

    <!-- 5. Payment Allocation Table or Notes -->
    @if ($payment->allocations->isNotEmpty())
        <div class="financial-card">
            <table>
                <thead>
                    <tr>
                        <th class="center" style="width: 6%;">NO</th>
                        <th style="width: 30%; text-align: left;">NOMOR FAKTUR TAGIHAN</th>
                        <th style="width: 40%; text-align: left;">PERIHAL / DESKRIPSI TAGIHAN</th>
                        <th class="right" style="width: 24%;">ALOKASI BAYAR ({{ $currency }})</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($payment->allocations as $index => $alloc)
                        <tr>
                            <td class="center mono muted">{{ str_pad((string) ($index + 1), 2, '0', STR_PAD_LEFT) }}</td>
                            <td class="mono font-bold" style="color: #0369a1;">{{ $alloc->invoice?->invoice_number ?? '-' }}</td>
                            <td>{{ $alloc->invoice?->title ?? 'Tagihan Jasa Hukum' }}</td>
                            <td class="right mono"><strong>{{ number_format($alloc->amount, 0, ',', '.') }}</strong></td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    @endif

    <!-- Notes if any -->
    @if ($payment->notes)
        <div class="note-box">
            <div class="note-title">KETERANGAN &amp; PERUNTUKAN PEMBAYARAN:</div>
            <div class="note-desc">{{ $payment->notes }}</div>
        </div>
    @endif

    <!-- 6. Closing Signatures & Stamp -->
    <table class="closing-layout">
        <tr>
            <td class="legal-clause" style="width: 42%; padding-right: 14px;">
                <strong>CATATAN KEABSAHAN TRANSAKSI:</strong><br>
                Kuitansi ini diterbitkan secara otomatis dan sah melalui sistem RPK App setelah dana efektif diterima pada rekening firma hukum Roni, Putra &amp; Kusumah. Dokumen ini merupakan bukti pelunasan yang mengikat menurut hukum perdata dan perpajakan.
            </td>
            <td class="stamp-box" style="width: 22%;">
                <div class="stamp-badge">
                    LUNAS<br><span style="font-size: 6.5px; font-weight: normal; letter-spacing: 0.8px;">OFFICIAL RECEIPT</span>
                </div>
            </td>
            <td class="sig-box" style="width: 36%;">
                <div class="sig-role">PENERIMA PEMBAYARAN</div>
                <div class="sig-firm">RPK LAW FIRM</div>
                <div class="sig-space"></div>
                <div class="sig-line"></div>
                <div class="sig-name">{{ $payment->recorder->name ?? 'Bagian Keuangan Firma' }}</div>
            </td>
        </tr>
    </table>

</body>
</html>
