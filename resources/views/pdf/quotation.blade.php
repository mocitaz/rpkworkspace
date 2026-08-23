<!doctype html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <title>FEE PROPOSAL / QUOTATION — {{ $quotation->quotation_number }}</title>
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
            font-size: 20px;
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
        .scope-box {
            background-color: #f8fafc;
            border-left: 3px solid #0284c7;
            padding: 10px 14px;
            margin-bottom: 18px;
            border-radius: 0 6px 6px 0;
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
        .signature-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 24px;
        }
        .signature-box {
            width: 45%;
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
            <td style="width: 55%; vertical-align: top;">
                <div class="firm-title">{{ config('raf.firm.name', 'RPK Law Firm') }}</div>
                <div class="firm-subtitle">Advocates &amp; Legal Consultants</div>
                <div class="firm-address">
                    Gedung Perkantoran Menara Hukum Lt. 18, Jl. Jend. Sudirman Kav. 52-53<br>
                    Jakarta Selatan 12190, Indonesia · Tel: +62 21 520 8899<br>
                    Email: proposal@raflaw.co.id · Website: www.raflaw.co.id
                </div>
            </td>
            <td style="width: 45%; vertical-align: top; text-align: right;">
                <div class="doc-badge-title">PENGAJUAN BIAYA &amp; TARIF (QUOTATION)</div>
                <div class="doc-badge-number">{{ $quotation->quotation_number }}</div>
                <div class="doc-badge-status">
                    Status: <strong>{{ strtoupper($quotation->status) }}</strong>
                </div>
            </td>
        </tr>
    </table>

    <!-- Metadata Section: Client & Proposal Details -->
    <table class="meta-table">
        <tr>
            <td class="meta-box" style="margin-right: 8px;">
                <div class="meta-label">Ditujukan Kepada (Prospective / Current Client):</div>
                <div class="meta-value-title">{{ $quotation->client->display_name }}</div>
                @if ($quotation->client->legal_name && $quotation->client->legal_name !== $quotation->client->display_name)
                    <div class="meta-value-sub" style="font-style: italic; margin-bottom: 4px;">{{ $quotation->client->legal_name }}</div>
                @endif
                @if ($quotation->client->address_line1)
                    <div class="meta-value-sub">
                        {{ $quotation->client->address_line1 }}
                        @if ($quotation->client->city), {{ $quotation->client->city }}@endif
                    </div>
                @endif
                @if ($quotation->client->email)
                    <div class="meta-value-sub">Email: {{ $quotation->client->email }}</div>
                @endif
            </td>
            <td style="width: 4%;"></td>
            <td class="meta-box">
                <div class="meta-label">Detail Proposal &amp; Lingkup:</div>
                <div class="info-row">
                    <span class="meta-value-sub" style="color: #64748b; width: 90px; display: inline-block;">Perihal / Judul:</span>
                    <strong style="color: #0f172a;">{{ $quotation->title }}</strong>
                </div>
                @if ($quotation->matter)
                    <div class="info-row">
                        <span class="meta-value-sub" style="color: #64748b; width: 90px; display: inline-block;">No. Matter:</span>
                        <strong class="font-mono" style="color: #0284c7;">{{ $quotation->matter->matter_number }}</strong>
                        <span class="meta-value-sub">({{ $quotation->matter->title }})</span>
                    </div>
                @endif
                <div class="info-row">
                    <span class="meta-value-sub" style="color: #64748b; width: 90px; display: inline-block;">Tgl. Penawaran:</span>
                    <span class="meta-value-sub font-mono"><strong>{{ date('d F Y') }}</strong></span>
                </div>
                <div class="info-row">
                    <span class="meta-value-sub" style="color: #64748b; width: 90px; display: inline-block;">Masa Berlaku:</span>
                    <span class="meta-value-sub font-mono" style="color: #d97706;"><strong>{{ $quotation->valid_until?->translatedFormat('d F Y') ?? '30 Hari sejak diterbitkan' }}</strong></span>
                </div>
                <div class="info-row">
                    <span class="meta-value-sub" style="color: #64748b; width: 90px; display: inline-block;">Mata Uang:</span>
                    <strong class="font-mono">{{ $quotation->currency }}</strong>
                </div>
            </td>
        </tr>
    </table>

    <!-- Scope of Work if Provided -->
    @if ($quotation->scope)
        <div class="scope-box">
            <div class="meta-label" style="color: #0284c7; margin-bottom: 3px;">Ruang Lingkup Jasa Hukum (Scope of Legal Services):</div>
            <div class="meta-value-sub" style="color: #1e293b; font-size: 10px; line-height: 1.45;">
                {{ $quotation->scope }}
            </div>
        </div>
    @endif

    <!-- Line Items Table -->
    <table class="items-table">
        <thead>
            <tr>
                <th class="text-center" style="width: 6%;">No.</th>
                <th class="text-left" style="width: 52%;">Uraian Pekerjaan / Layanan Hukum</th>
                <th class="text-center" style="width: 10%;">Qty</th>
                <th class="text-right" style="width: 16%;">Estimasi Satuan ({{ $quotation->currency }})</th>
                <th class="text-right" style="width: 16%;">Jumlah ({{ $quotation->currency }})</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($quotation->lineItems as $idx => $item)
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
                    <td colspan="5" class="text-center" style="padding: 16px; color: #94a3b8;">Tidak ada rincian item quotation.</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <!-- Summary & Proposal Notes -->
    <table class="summary-wrapper">
        <tr>
            <!-- Left: Terms & Conditions -->
            <td class="notes-column">
                <div style="font-size: 9px; font-weight: bold; color: #0f172a; text-transform: uppercase; margin-bottom: 4px;">
                    Syarat &amp; Ketentuan Penawaran:
                </div>
                <div class="meta-value-sub" style="font-size: 8.5px; color: #64748b; line-height: 1.4;">
                    1. Penawaran biaya ini belum termasuk pengeluaran riil di luar kantor (out-of-pocket expenses / disbursement) seperti biaya PNBP, biaya pengadilan, dan materai resmi.<br>
                    2. Pelaksanaan penugasan akan dimulai setelah penandatanganan Surat Kuasa Khusus / Perjanjian Jasa Hukum (Engagement Agreement).<br>
                    3. Pembayaran termin diatur sesuai kesepakatan tertulis.
                </div>
            </td>

            <!-- Right: Totals -->
            <td class="totals-column">
                <table class="totals-table">
                    <tr>
                        <td class="text-left" style="color: #64748b;">Subtotal Penawaran:</td>
                        <td class="text-right font-mono">{{ $quotation->currency }} {{ number_format($quotation->subtotal_amount, 0, ',', '.') }}</td>
                    </tr>
                    @if ($quotation->discount_amount > 0)
                        <tr>
                            <td class="text-left" style="color: #16a34a;">Diskon / Penyesuaian:</td>
                            <td class="text-right font-mono" style="color: #16a34a;">- {{ $quotation->currency }} {{ number_format($quotation->discount_amount, 0, ',', '.') }}</td>
                        </tr>
                    @endif
                    @if ($quotation->tax_amount > 0)
                        <tr>
                            <td class="text-left" style="color: #64748b;">PPN / Pajak:</td>
                            <td class="text-right font-mono">{{ $quotation->currency }} {{ number_format($quotation->tax_amount, 0, ',', '.') }}</td>
                        </tr>
                    @endif
                    <tr class="grand-total">
                        <td class="text-left">TOTAL ESTIMASI:</td>
                        <td class="text-right font-mono">{{ $quotation->currency }} {{ number_format($quotation->total_amount, 0, ',', '.') }}</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    <!-- Signatures: Firm & Client Acceptance -->
    <table class="signature-table">
        <tr>
            <td class="signature-box">
                <div class="meta-value-sub" style="font-weight: bold; color: #0f172a;">Diajukan Oleh:</div>
                <div class="meta-value-sub">{{ config('raf.firm.name', 'RPK Law Firm') }}</div>
                <div class="signature-line"></div>
                <div style="font-size: 10px; font-weight: bold; color: #0f172a;">Partner Penanggung Jawab</div>
                <div style="font-size: 8.5px; color: #64748b;">Advokat &amp; Konsultan Hukum</div>
            </td>
            <td style="width: 10%;"></td>
            <td class="signature-box">
                <div class="meta-value-sub" style="font-weight: bold; color: #0f172a;">Disetujui Oleh Klien:</div>
                <div class="meta-value-sub">{{ $quotation->client->display_name }}</div>
                <div class="signature-line"></div>
                <div style="font-size: 10px; font-weight: bold; color: #0f172a;">Kuasa / Perwakilan Sah Klien</div>
                <div style="font-size: 8.5px; color: #64748b;">Tanggal: ........................................</div>
            </td>
        </tr>
    </table>

    <!-- Footer Security & Timestamp -->
    <div class="footer-note">
        Dokumen ini diterbitkan secara resmi melalui Sistem Manajemen Keuangan {{ config('raf.firm.name') }}. Dokumen ID: {{ $quotation->id }} · Dicetak pada: {{ now()->timezone(config('raf.timezone'))->translatedFormat('d/m/Y H:i:s T') }}
    </div>

</body>
</html>
