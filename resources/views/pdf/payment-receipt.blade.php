@php
    function rpkTerbilang($number): string {
        $number = abs((int) $number);
        $words = ["", "Satu", "Dua", "Tiga", "Empat", "Lima", "Enam", "Tujuh", "Delapan", "Sembilan", "Sepuluh", "Sebelas"];
        if ($number < 12) {
            return $words[$number];
        } elseif ($number < 20) {
            return rpkTerbilang($number - 10) . " Belas";
        } elseif ($number < 100) {
            return rpkTerbilang(intdiv($number, 10)) . " Puluh " . rpkTerbilang($number % 10);
        } elseif ($number < 200) {
            return "Seratus " . rpkTerbilang($number - 100);
        } elseif ($number < 1000) {
            return rpkTerbilang(intdiv($number, 100)) . " Ratus " . rpkTerbilang($number % 100);
        } elseif ($number < 2000) {
            return "Seribu " . rpkTerbilang($number - 1000);
        } elseif ($number < 1000000) {
            return rpkTerbilang(intdiv($number, 1000)) . " Ribu " . rpkTerbilang($number % 1000);
        } elseif ($number < 1000000000) {
            return rpkTerbilang(intdiv($number, 1000000)) . " Juta " . rpkTerbilang($number % 1000000);
        } elseif ($number < 1000000000000) {
            return rpkTerbilang(intdiv($number, 1000000000)) . " Miliar " . rpkTerbilang($number % 1000000000);
        } else {
            return rpkTerbilang(intdiv($number, 1000000000000)) . " Triliun " . rpkTerbilang($number % 1000000000000);
        }
    }
    $spelled = trim(rpkTerbilang($payment->amount)) . " Rupiah";
@endphp
<!doctype html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <title>Kuitansi Pembayaran {{ $payment->reference_number ?: ('PAY-' . $payment->id) }} — RPK Law Firm</title>
    <style>
        @page { margin: 28px 36px 36px; size: A4 portrait; }
        * { box-sizing: border-box; }
        body { margin: 0; color: #1e293b; font-family: "DejaVu Sans", Helvetica, Arial, sans-serif; font-size: 8.5px; line-height: 1.48; }
        table { width: 100%; border-collapse: collapse; }
        .mono { font-family: "DejaVu Sans Mono", monospace; }
        .navy { color: #0a1b33; }
        .gold { color: #8f6a22; }
        .muted { color: #64748b; }
        .right { text-align: right; }
        .center { text-align: center; }

        /* Ornate Frame */
        .receipt-frame { border: 2px solid #0a1b33; padding: 16px 20px; position: relative; background: #ffffff; }
        .receipt-inner-border { border: 1px solid #d4af37; padding: 16px 18px; }

        /* Letterhead Header */
        .letterhead { margin-bottom: 12px; }
        .letterhead td { vertical-align: middle; }
        .logo-cell { width: 55%; }
        .logo-crop { width: 185px; height: 58px; overflow: hidden; }
        .logo-crop img { width: 185px; height: auto; margin-top: -22px; }
        .office-cell { width: 45%; color: #475569; font-size: 7px; line-height: 1.55; text-align: right; }
        .gold-rule { height: 2px; border-top: 1.5px solid #8f6a22; border-bottom: 1px solid #e2d2aa; margin-bottom: 16px; }

        /* Receipt Title Banner */
        .receipt-header { margin-bottom: 16px; text-align: center; }
        .receipt-badge { display: inline-block; background: #0a1b33; color: #ffffff; padding: 2.5px 10px; font-size: 6.8px; font-weight: bold; letter-spacing: 1.2px; text-transform: uppercase; border-radius: 3px; }
        .receipt-title { font-size: 17px; font-weight: bold; color: #0a1b33; letter-spacing: 1px; text-transform: uppercase; margin-top: 5px; }
        .receipt-subtitle { font-size: 7.5px; color: #64748b; margin-top: 2px; }
        .receipt-num { font-size: 9.5px; font-weight: bold; color: #0369a1; margin-top: 4px; }

        /* Receipt Body */
        .receipt-body { margin-top: 14px; border-top: 1px dashed #cbd5e1; border-bottom: 1px dashed #cbd5e1; padding: 12px 0; }
        .receipt-row td { padding: 4.5px 0; font-size: 8.5px; vertical-align: top; }
        .row-label { width: 24%; color: #64748b; font-weight: bold; text-transform: uppercase; font-size: 7.2px; }
        .row-colon { width: 3%; color: #64748b; font-weight: bold; }
        .row-val { width: 73%; color: #0f172a; font-weight: bold; }

        .spelled-card { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 4px; padding: 7px 12px; font-style: italic; color: #0a1b33; font-weight: bold; font-size: 8.5px; margin-top: 2px; }
        .amount-badge { background: #0a1b33; color: #ffffff; padding: 7px 14px; display: inline-block; font-size: 13px; font-weight: bold; border-radius: 4px; letter-spacing: .5px; margin-top: 4px; }

        /* Allocations Table */
        .allocations-box { margin-top: 14px; }
        .allocations-title { font-size: 7.5px; font-weight: bold; color: #0a1b33; text-transform: uppercase; margin-bottom: 4px; }
        .alloc-table th { background: #f1f5f9; color: #334155; font-size: 6.8px; font-weight: bold; padding: 5px 8px; text-transform: uppercase; border-bottom: 1px solid #cbd5e1; }
        .alloc-table td { padding: 6px 8px; border-bottom: 1px solid #f1f5f9; font-size: 7.5px; }

        /* Official Stamp & Signatures */
        .stamp-lunas { border: 2px solid #047857; color: #047857; padding: 4px 10px; display: inline-block; font-weight: 900; font-size: 11px; letter-spacing: 2px; transform: rotate(-5deg); border-radius: 4px; }
        .sig-table { margin-top: 20px; }
        .sig-table td { vertical-align: bottom; }
        .sig-space { height: 45px; }
        .sig-line { width: 165px; border-top: 1px solid #0a1b33; margin: 0 auto 3px; }

        /* Watermark & Footer */
        .watermark { position: fixed; top: 40%; left: 0; width: 100%; text-align: center; transform: rotate(-25deg); opacity: 0.04; font-size: 26px; font-weight: bold; color: #0a1b33; z-index: -1000; }
        .footer { margin-top: 16px; padding-top: 6px; border-top: 1px solid #cbd5e1; font-size: 6.5px; color: #64748b; }
    </style>
</head>
<body>

<div class="watermark">
    DIUNDUH OLEH {{ strtoupper(auth()->user()->name ?? 'RPK USER') }}<br>
    {{ now()->format('Y-m-d H:i') }} WIB · KUITANSI RESMI RPK LAW FIRM
</div>

<div class="receipt-frame">
    <div class="receipt-inner-border">
        <!-- Letterhead -->
        <table class="letterhead">
            <tr>
                <td class="logo-cell">
                    <div class="logo-crop">
                        <img src="{{ public_path('logo/logo.png') }}" alt="RPK Law Firm">
                    </div>
                </td>
                <td class="office-cell">
                    <strong>RONI, PUTRA &amp; KUSUMAH LAW FIRM</strong><br>
                    Menara Hukum RPK, Lt. 5, Jl. LLRE Martadinata No. 88, Bandung 40115<br>
                    Tel: +62 22 420 8899 &nbsp;·&nbsp; Email: finance@rpklaw.co.id
                </td>
            </tr>
        </table>
        <div class="gold-rule"></div>

        <!-- Receipt Header Title -->
        <div class="receipt-header">
            <span class="receipt-badge">BUKTI TANDA TERIMA PEMBAYARAN SAH</span>
            <div class="receipt-title">KUITANSI PEMBAYARAN RESMI</div>
            <div class="receipt-subtitle">OFFICIAL LEGAL FEE PAYMENT RECEIPT &amp; SETTLEMENT VOUCHER</div>
            <div class="receipt-num mono">NO. BUKTI: {{ $payment->reference_number ?: ('PAY-' . $payment->id) }}</div>
        </div>

        <!-- Receipt Body Details -->
        <div class="receipt-body">
            <table class="receipt-row">
                <tr>
                    <td class="row-label">Telah Diterima Dari</td>
                    <td class="row-colon">:</td>
                    <td class="row-val" style="font-size: 9.5px; color: #0a1b33;">
                        {{ $payment->client->display_name ?? 'Klien Terdaftar' }}
                        @if ($payment->client->legal_name && $payment->client->legal_name !== $payment->client->display_name)
                            <span style="font-size: 8px; color: #475569;">({{ $payment->client->legal_name }})</span>
                        @endif
                    </td>
                </tr>
                <tr>
                    <td class="row-label">Jumlah Pembayaran</td>
                    <td class="row-colon">:</td>
                    <td class="row-val">
                        <div class="amount-badge mono">
                            {{ $payment->currency ?: 'IDR' }} {{ number_format($payment->amount, 0, ',', '.') }}
                        </div>
                    </td>
                </tr>
                <tr>
                    <td class="row-label">Terbilang (In Words)</td>
                    <td class="row-colon">:</td>
                    <td class="row-val">
                        <div class="spelled-card">
                            "{{ $spelled }}"
                        </div>
                    </td>
                </tr>
                <tr>
                    <td class="row-label">Untuk Pembayaran</td>
                    <td class="row-colon">:</td>
                    <td class="row-val" style="color: #0f172a;">
                        Pembayaran Jasa Hukum / Faktur Tagihan Perkara {{ $payment->matter ? ('(' . $payment->matter->matter_number . ' - ' . $payment->matter->title . ')') : 'Umum' }}
                        @if ($payment->notes)
                            <br><span style="font-size: 7.5px; color: #475569; font-weight: normal;">Catatan: {{ $payment->notes }}</span>
                        @endif
                    </td>
                </tr>
                <tr>
                    <td class="row-label">Metode Pembayaran</td>
                    <td class="row-colon">:</td>
                    <td class="row-val mono">
                        {{ strtoupper(str_replace('_', ' ', (string) ($payment->method ?: 'Bank Transfer'))) }}
                        &nbsp;·&nbsp; Tanggal: {{ $payment->paid_at ? \Carbon\Carbon::parse($payment->paid_at)->translatedFormat('d F Y') : now()->translatedFormat('d F Y') }}
                    </td>
                </tr>
            </table>
        </div>

        @if ($payment->allocations && count($payment->allocations) > 0)
            <!-- Invoice Allocation Details -->
            <div class="allocations-box">
                <div class="allocations-title">Rincian Alokasi Faktur Tagihan (Invoice Allocation)</div>
                <table class="alloc-table">
                    <thead>
                        <tr>
                            <th style="text-align: left; width: 35%;">Nomor Faktur</th>
                            <th style="text-align: left; width: 35%;">Perihal / Uraian</th>
                            <th style="text-align: right; width: 30%;">Nominal Alokasi ({{ $payment->currency ?: 'IDR' }})</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($payment->allocations as $alloc)
                            <tr>
                                <td class="mono" style="font-weight: bold; color: #0369a1;">{{ $alloc->invoice->invoice_number ?? '-' }}</td>
                                <td>{{ $alloc->invoice->title ?? 'Pembayaran Tagihan' }}</td>
                                <td class="right mono" style="font-weight: bold;">{{ number_format($alloc->amount, 0, ',', '.') }}</td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        @endif

        <!-- Signatures and Stamps -->
        <table class="sig-table">
            <tr>
                <td style="width: 35%; text-align: center;">
                    <div class="stamp-lunas">LUNAS / SETTLED</div>
                    <div style="font-size: 6.8px; color: #047857; margin-top: 4px; font-weight: bold;">VERIFIED LEGAL SETTLEMENT</div>
                </td>
                <td style="width: 30%;"></td>
                <td style="width: 35%; text-align: center;">
                    <div style="font-size: 7.2px; color: #64748b;">Bandung, {{ $payment->paid_at ? \Carbon\Carbon::parse($payment->paid_at)->translatedFormat('d F Y') : now()->translatedFormat('d F Y') }}</div>
                    <div style="font-size: 8px; font-weight: bold; color: #0a1b33; margin-top: 2px;">Bagian Keuangan &amp; Kasir</div>
                    <div class="sig-space"></div>
                    <div class="sig-line"></div>
                    <div style="font-size: 7.5px; font-weight: bold; color: #0a1b33;">RONI, PUTRA &amp; KUSUMAH</div>
                    <div style="font-size: 6.8px; color: #64748b;">Authorized Finance Officer</div>
                </td>
            </tr>
        </table>

        <!-- Footer -->
        <table class="footer">
            <tr>
                <td>RONI, PUTRA &amp; KUSUMAH LAW FIRM &nbsp;|&nbsp; KUITANSI RESMI TANDA TERIMA PEMBAYARAN</td>
                <td class="right mono">{{ now()->timezone(config('raf.timezone'))->format('d/m/Y H:i') }} WIB</td>
            </tr>
        </table>
    </div>
</div>

</body>
</html>
