<!doctype html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <title>INVOICE — {{ $invoice->invoice_number }}</title>
    <style>
        @page {
            margin: 32px 36px 40px 36px;
            size: a4 portrait;
        }
        * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact;
        }
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #1a1a1a;
            margin: 0;
            padding: 0;
            font-size: 11px;
            line-height: 1.45;
        }
        .header-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 24px;
            border-bottom: 2px solid #0f172a;
            padding-bottom: 16px;
        }
        .firm-title {
            font-size: 20px;
            font-weight: bold;
            color: #0f172a;
            letter-spacing: 0.5px;
            margin: 0 0 4px 0;
            text-transform: uppercase;
        }
        .firm-subtitle {
            font-size: 9.5px;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            font-weight: 600;
            margin: 0 0 8px 0;
        }
        .firm-address {
            font-size: 9.5px;
            color: #475569;
            line-height: 1.4;
        }
        .doc-badge-title {
            font-size: 24px;
            font-weight: 900;
            color: #0f172a;
            letter-spacing: 1px;
            text-align: right;
            margin: 0 0 4px 0;
        }
        .doc-badge-number {
            font-size: 12px;
            font-family: 'Courier New', Courier, monospace;
            font-weight: bold;
            color: #0284c7;
            text-align: right;
            margin: 0 0 4px 0;
        }
        .doc-badge-status {
            text-align: right;
            font-size: 9px;
            font-weight: bold;
            text-transform: uppercase;
            color: #475569;
            letter-spacing: 0.5px;
        }
        .meta-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        .meta-box {
            width: 50%;
            vertical-align: top;
            padding: 12px 14px;
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
        }
        .meta-label {
            font-size: 8.5px;
            font-weight: bold;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            margin-bottom: 4px;
        }
        .meta-value-title {
            font-size: 12px;
            font-weight: bold;
            color: #0f172a;
            margin-bottom: 3px;
        }
        .meta-value-sub {
            font-size: 9.5px;
            color: #475569;
            line-height: 1.35;
        }
        .info-row {
            margin-bottom: 3px;
        }
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 18px;
        }
        .items-table th {
            background-color: #0f172a;
            color: #ffffff;
            font-size: 9px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.6px;
            padding: 8px 10px;
            border: none;
        }
        .items-table td {
            padding: 9px 10px;
            border-bottom: 1px solid #e2e8f0;
            font-size: 10px;
            vertical-align: top;
        }
        .items-table tbody tr:nth-child(even) {
            background-color: #f8fafc;
        }
        .text-left { text-align: left; }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .font-mono { font-family: 'Courier New', Courier, monospace; }

        .summary-wrapper {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 24px;
        }
        .notes-column {
            width: 55%;
            vertical-align: top;
            padding-right: 20px;
        }
        .totals-column {
            width: 45%;
            vertical-align: top;
        }
        .totals-table {
            width: 100%;
            border-collapse: collapse;
        }
        .totals-table td {
            padding: 5px 8px;
            font-size: 10px;
        }
        .totals-table tr.grand-total td {
            background-color: #0f172a;
            color: #ffffff;
            font-weight: bold;
            font-size: 12px;
            padding: 9px 10px;
            border-radius: 4px;
        }
        .bank-box {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 10px 12px;
            margin-top: 4px;
        }
        .bank-title {
            font-size: 9px;
            font-weight: bold;
            color: #0f172a;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 5px;
        }
        .signature-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        .signature-box {
            width: 40%;
            vertical-align: top;
            text-align: center;
        }
        .signature-line {
            width: 180px;
            border-bottom: 1px solid #0f172a;
            margin: 50px auto 4px auto;
        }
        .footer-note {
            margin-top: 24px;
            border-top: 1px solid #e2e8f0;
            padding-top: 8px;
            font-size: 8px;
            color: #94a3b8;
            text-align: center;
        }
    </style>
</head>
<body>

    <!-- Header / Letterhead -->
    <table class="header-table">
        <tr>
            <td style="width: 58%; vertical-align: top;">
                <div class="firm-title">{{ config('raf.firm.name', 'RPK Law Firm') }}</div>
                <div class="firm-subtitle">Advocates &amp; Legal Consultants</div>
                <div class="firm-address">
                    Gedung Perkantoran Menara Hukum Lt. 18, Jl. Jend. Sudirman Kav. 52-53<br>
                    Jakarta Selatan 12190, Indonesia · Tel: +62 21 520 8899<br>
                    Email: billing@raflaw.co.id · Website: www.raflaw.co.id
                </div>
            </td>
            <td style="width: 42%; vertical-align: top; text-align: right;">
                <div class="doc-badge-title">INVOICE</div>
                <div class="doc-badge-number">{{ $invoice->invoice_number }}</div>
                <div class="doc-badge-status">
                    Status: <strong>{{ strtoupper($invoice->status) }}</strong>
                </div>
            </td>
        </tr>
    </table>

    <!-- Metadata Section: Client & Invoice Info -->
    <table class="meta-table">
        <tr>
            <td class="meta-box" style="margin-right: 8px;">
                <div class="meta-label">Ditujukan Kepada (Billed To):</div>
                <div class="meta-value-title">{{ $invoice->client->display_name }}</div>
                @if ($invoice->client->legal_name && $invoice->client->legal_name !== $invoice->client->display_name)
                    <div class="meta-value-sub" style="font-style: italic; margin-bottom: 4px;">{{ $invoice->client->legal_name }}</div>
                @endif
                @if ($invoice->client->address_line1)
                    <div class="meta-value-sub">
                        {{ $invoice->client->address_line1 }}
                        @if ($invoice->client->city), {{ $invoice->client->city }}@endif
                        @if ($invoice->client->postal_code) {{ $invoice->client->postal_code }}@endif
                    </div>
                @endif
                @if ($invoice->client->email)
                    <div class="meta-value-sub">Email: {{ $invoice->client->email }}</div>
                @endif
                @if ($invoice->client->tax_identification_number)
                    <div class="meta-value-sub font-mono">NPWP: {{ $invoice->client->tax_identification_number }}</div>
                @endif
            </td>
            <td style="width: 4%;"></td>
            <td class="meta-box">
                <div class="meta-label">Rincian Penagihan:</div>
                <div class="info-row">
                    <span class="meta-value-sub" style="color: #64748b; width: 90px; display: inline-block;">Perihal / Judul:</span>
                    <strong style="color: #0f172a;">{{ $invoice->title }}</strong>
                </div>
                @if ($invoice->matter)
                    <div class="info-row">
                        <span class="meta-value-sub" style="color: #64748b; width: 90px; display: inline-block;">No. Matter:</span>
                        <strong class="font-mono" style="color: #0284c7;">{{ $invoice->matter->matter_number }}</strong>
                        <span class="meta-value-sub">({{ $invoice->matter->title }})</span>
                    </div>
                @endif
                <div class="info-row">
                    <span class="meta-value-sub" style="color: #64748b; width: 90px; display: inline-block;">Tgl. Diterbitkan:</span>
                    <span class="meta-value-sub font-mono"><strong>{{ $invoice->issued_at?->translatedFormat('d F Y') ?? date('d F Y') }}</strong></span>
                </div>
                <div class="info-row">
                    <span class="meta-value-sub" style="color: #64748b; width: 90px; display: inline-block;">Tgl. Jatuh Tempo:</span>
                    <span class="meta-value-sub font-mono" style="color: #dc2626;"><strong>{{ $invoice->due_at?->translatedFormat('d F Y') ?? '—' }}</strong></span>
                </div>
                <div class="info-row">
                    <span class="meta-value-sub" style="color: #64748b; width: 90px; display: inline-block;">Mata Uang:</span>
                    <strong class="font-mono">{{ $invoice->currency }}</strong>
                </div>
            </td>
        </tr>
    </table>

    <!-- Line Items Table -->
    <table class="items-table">
        <thead>
            <tr>
                <th class="text-center" style="width: 6%;">No.</th>
                <th class="text-left" style="width: 52%;">Uraian Jasa Hukum / Deskripsi Biaya</th>
                <th class="text-center" style="width: 10%;">Qty</th>
                <th class="text-right" style="width: 16%;">Tarif Satuan ({{ $invoice->currency }})</th>
                <th class="text-right" style="width: 16%;">Jumlah ({{ $invoice->currency }})</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($invoice->lineItems as $idx => $item)
                <tr>
                    <td class="text-center font-mono" style="color: #64748b;">{{ $idx + 1 }}</td>
                    <td class="text-left">
                        <strong style="color: #0f172a;">{{ $item->description }}</strong>
                    </td>
                    <td class="text-center font-mono">{{ $item->quantity }}</td>
                    <td class="text-right font-mono">{{ number_format($item->unit_amount ?? ($item->total_amount / max(1, $item->quantity)), 0, ',', '.') }}</td>
                    <td class="text-right font-mono" style="font-weight: 600;">{{ number_format($item->total_amount, 0, ',', '.') }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="5" class="text-center" style="padding: 16px; color: #94a3b8;">Tidak ada rincian item invoice.</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <!-- Summary & Bank Payment Instructions -->
    <table class="summary-wrapper">
        <tr>
            <!-- Left: Payment Instructions -->
            <td class="notes-column">
                <div class="bank-box">
                    <div class="bank-title">Instruksi Pembayaran &amp; Rekening Bank:</div>
                    <div class="meta-value-sub" style="margin-bottom: 4px;">
                        Mohon lakukan transfer pembayaran ke rekening resmi kantor hukum kami:
                    </div>
                    <table style="width: 100%; border-collapse: collapse; font-size: 9.5px;">
                        <tr>
                            <td style="width: 90px; color: #64748b; padding: 1.5px 0;">Bank:</td>
                            <td style="font-weight: bold; color: #0f172a;">Bank Central Asia (BCA) KCU Sudirman</td>
                        </tr>
                        <tr>
                            <td style="color: #64748b; padding: 1.5px 0;">No. Rekening:</td>
                            <td class="font-mono" style="font-weight: bold; color: #0284c7; font-size: 11px;">872-009-8811</td>
                        </tr>
                        <tr>
                            <td style="color: #64748b; padding: 1.5px 0;">Atas Nama:</td>
                            <td style="font-weight: bold; color: #0f172a;">RPK LAW FIRM &amp; PARTNERS</td>
                        </tr>
                        <tr>
                            <td style="color: #64748b; padding: 1.5px 0;">Berita Transfer:</td>
                            <td class="font-mono" style="font-size: 9px; color: #475569;">{{ $invoice->invoice_number }} - {{ $invoice->client->display_name }}</td>
                        </tr>
                    </table>
                </div>
            </td>

            <!-- Right: Totals -->
            <td class="totals-column">
                <table class="totals-table">
                    <tr>
                        <td class="text-left" style="color: #64748b;">Subtotal Jasa:</td>
                        <td class="text-right font-mono">{{ $invoice->currency }} {{ number_format($invoice->subtotal_amount, 0, ',', '.') }}</td>
                    </tr>
                    @if ($invoice->discount_amount > 0)
                        <tr>
                            <td class="text-left" style="color: #16a34a;">Potongan / Diskon:</td>
                            <td class="text-right font-mono" style="color: #16a34a;">- {{ $invoice->currency }} {{ number_format($invoice->discount_amount, 0, ',', '.') }}</td>
                        </tr>
                    @endif
                    @if ($invoice->tax_amount > 0)
                        <tr>
                            <td class="text-left" style="color: #64748b;">PPN / Pajak:</td>
                            <td class="text-right font-mono">{{ $invoice->currency }} {{ number_format($invoice->tax_amount, 0, ',', '.') }}</td>
                        </tr>
                    @endif
                    <tr class="grand-total">
                        <td class="text-left">TOTAL TAGIHAN:</td>
                        <td class="text-right font-mono">{{ $invoice->currency }} {{ number_format($invoice->total_amount, 0, ',', '.') }}</td>
                    </tr>
                    @if ($invoice->paid_amount > 0)
                        <tr>
                            <td class="text-left" style="padding-top: 6px; color: #16a34a; font-weight: 600;">Jumlah Telah Dibayar:</td>
                            <td class="text-right font-mono" style="padding-top: 6px; color: #16a34a; font-weight: 600;">{{ $invoice->currency }} {{ number_format($invoice->paid_amount, 0, ',', '.') }}</td>
                        </tr>
                        <tr>
                            <td class="text-left" style="color: #dc2626; font-weight: bold;">Sisa Tagihan (Outstanding):</td>
                            <td class="text-right font-mono" style="color: #dc2626; font-weight: bold;">{{ $invoice->currency }} {{ number_format($invoice->outstanding_amount, 0, ',', '.') }}</td>
                        </tr>
                    @endif
                </table>
            </td>
        </tr>
    </table>

    <!-- Signature Block -->
    <table class="signature-table">
        <tr>
            <td style="width: 60%; vertical-align: bottom;">
                <div class="meta-value-sub" style="font-size: 8.5px; color: #64748b; line-height: 1.4;">
                    * Pembayaran dianggap sah setelah dana efektif masuk ke rekening kantor kami.<br>
                    * Harap mengirimkan bukti transfer via email ke billing@raflaw.co.id.
                </div>
            </td>
            <td class="signature-box">
                <div class="meta-value-sub" style="margin-bottom: 2px;">Jakarta, {{ date('d F Y') }}</div>
                <div class="meta-value-sub" style="font-weight: bold; color: #0f172a;">{{ config('raf.firm.name', 'RPK Law Firm') }}</div>
                <div class="signature-line"></div>
                <div style="font-size: 10px; font-weight: bold; color: #0f172a;">Managing Partner / Finance Director</div>
                <div style="font-size: 8.5px; color: #64748b;">Advokat &amp; Konsultan Hukum</div>
            </td>
        </tr>
    </table>

    <!-- Footer Security & Timestamp -->
    <div class="footer-note">
        Dokumen ini diterbitkan secara resmi melalui Sistem Manajemen Keuangan {{ config('raf.firm.name') }}. Dokumen ID: {{ $invoice->id }} · Dicetak pada: {{ now()->timezone(config('raf.timezone'))->translatedFormat('d/m/Y H:i:s T') }}
    </div>

</body>
</html>
