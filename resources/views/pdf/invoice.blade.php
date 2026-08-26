@php
    $verificationUrl = route('verify.invoice', $invoice->invoice_number);
    $qrDataUri = (new \Endroid\QrCode\Writer\PngWriter())->write(
        new \Endroid\QrCode\QrCode(data: $verificationUrl, size: 160, margin: 0)
    )->getDataUri();
@endphp
<!doctype html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <title>Faktur Tagihan {{ $invoice->invoice_number }} — RPK Law Firm</title>
    <style>
        @page { margin: 28px 36px 36px; size: A4 portrait; }
        * { box-sizing: border-box; }
        body { margin: 0; color: #1e293b; font-family: "DejaVu Sans", Helvetica, Arial, sans-serif; font-size: 8.2px; line-height: 1.45; position: relative; }
        table { width: 100%; border-collapse: collapse; }
        .mono { font-family: "DejaVu Sans Mono", monospace; }
        .navy { color: #0a1b33; }
        .gold { color: #8f6a22; }
        .muted { color: #64748b; }
        .right { text-align: right; }
        .center { text-align: center; }
        .uppercase { text-transform: uppercase; }

        /* Letterhead Header */
        .letterhead { margin-bottom: 12px; }
        .letterhead td { vertical-align: middle; }
        .logo-cell { width: 52%; }
        .logo-crop { width: 190px; height: 58px; overflow: hidden; }
        .logo-crop img { width: 190px; height: auto; margin-top: -24px; }
        .office-cell { width: 48%; color: #334155; font-size: 7px; line-height: 1.5; text-align: right; }
        .gold-rule { height: 2px; border-top: 1.5px solid #8f6a22; border-bottom: 1px solid #d4af37; margin-bottom: 14px; }

        /* Document Header */
        .doc-header-table { margin-bottom: 14px; position: relative; }
        .doc-header-table td { vertical-align: top; }
        .doc-badge { display: inline-block; background: #0a1b33; color: #ffffff; padding: 2px 8px; font-size: 6.5px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; border-radius: 2px; }
        .doc-title { margin-top: 4px; font-size: 18px; font-weight: bold; color: #0a1b33; letter-spacing: .3px; }
        .doc-subtitle { margin-top: 2px; font-size: 7.2px; color: #64748b; }
        
        .ref-box { background: #f8fafc; border: 1px solid #cbd5e1; border-top: 2.5px solid #0a1b33; border-radius: 3px; padding: 7px 10px; text-align: right; width: 42%; }
        .ref-label { font-size: 6.5px; font-weight: bold; color: #8f6a22; letter-spacing: 1px; text-transform: uppercase; }
        .ref-val { font-size: 11px; font-weight: bold; color: #0a1b33; margin-top: 2px; }
        .ref-status { display: inline-block; padding: 2px 7px; font-size: 6.5px; font-weight: bold; border-radius: 3px; margin-top: 3px; text-transform: uppercase; }
        .status-paid { background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; }
        .status-unpaid { background: #fff1f2; color: #be123c; border: 1px solid #fecdd3; }
        .status-partial { background: #fffbeb; color: #b45309; border: 1px solid #fde68a; }

        /* Stamp: PAID / LUNAS */
        .stamp-paid-container {
            position: absolute;
            top: 28px;
            right: 170px;
            border: 2.5px double #059669;
            color: #059669;
            padding: 4px 10px;
            text-align: center;
            border-radius: 4px;
            transform: rotate(-10deg);
            background: #ffffff;
            opacity: 0.92;
            z-index: 50;
        }
        .stamp-paid-title {
            font-size: 11px;
            font-weight: bold;
            letter-spacing: 2px;
            text-transform: uppercase;
        }
        .stamp-paid-subtitle {
            font-size: 5.5px;
            font-weight: bold;
            letter-spacing: .5px;
            color: #047857;
            margin-top: 1px;
        }

        /* Information Grid */
        .info-card { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 4px; margin-bottom: 14px; table-layout: fixed; }
        .info-card > tbody > tr > td { width: 50%; padding: 8px 12px; vertical-align: top; }
        .info-card > tbody > tr > td:first-child { border-right: 1px solid #e2e8f0; }
        .section-label { font-size: 6.5px; font-weight: bold; color: #8f6a22; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 4px; }
        .client-name { font-size: 10.5px; font-weight: bold; color: #0a1b33; margin-bottom: 2px; }
        .client-detail { font-size: 7.2px; color: #475569; line-height: 1.45; }
        .detail-row td { padding: 1.5px 0; font-size: 7.2px; vertical-align: top; }
        .detail-label { width: 40%; color: #64748b; font-weight: bold; }
        .detail-val { width: 60%; color: #0f172a; font-weight: bold; }

        /* Items Table */
        .items-table { margin-bottom: 14px; }
        .items-table th { background: #0a1b33; color: #ffffff; font-size: 6.8px; font-weight: bold; padding: 5.5px 7px; text-transform: uppercase; letter-spacing: .4px; }
        .items-table td { padding: 7px 7px; border-bottom: 1px solid #e2e8f0; font-size: 7.4px; vertical-align: top; }
        .item-desc { font-weight: bold; color: #0a1b33; font-size: 8px; }

        /* Summary & Multi-Bank Remittance */
        .summary-layout { margin-bottom: 14px; page-break-inside: avoid; }
        .summary-layout td { vertical-align: top; }
        .bank-cell { width: 55%; padding-right: 16px; }
        .bank-box { background: #f8fafc; border: 1px solid #cbd5e1; border-top: 2px solid #0a1b33; border-radius: 4px; padding: 8px 10px; }
        .bank-title { font-size: 7.5px; font-weight: bold; color: #0a1b33; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; padding-bottom: 3px; margin-bottom: 5px; }
        
        .bank-item { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 3px; padding: 5px 8px; margin-bottom: 5px; }
        .bank-item-title { font-size: 7.2px; font-weight: bold; color: #0a1b33; }
        .bank-item-acc { font-size: 8.2px; font-weight: bold; color: #0369a1; }
        .bank-item-name { font-size: 6.8px; color: #475569; }

        .totals-cell { width: 45%; }
        .totals-table { border: 1px solid #cbd5e1; border-radius: 4px; background: #ffffff; }
        .totals-table td { padding: 4px 7px; font-size: 7.4px; }
        .totals-label { color: #64748b; font-weight: bold; }
        .totals-val { text-align: right; color: #0f172a; font-weight: bold; }
        .total-highlight td { background: #0a1b33; color: #ffffff; font-size: 9px; font-weight: bold; padding: 6px 7px; }
        .total-highlight .totals-label { color: #ffffff; }
        .total-highlight .totals-val { color: #ffffff; }
        .outstanding-row td { background: #fff1f2; color: #be123c; font-weight: bold; font-size: 8px; border-top: 1px solid #fecdd3; }

        /* Closing Signature */
        .closing-layout { margin-top: 18px; page-break-inside: avoid; }
        .closing-layout td { vertical-align: bottom; }
        .legal-clause { width: 58%; padding-right: 20px; font-size: 6.5px; color: #64748b; line-height: 1.45; }
        .sig-col { width: 42%; text-align: center; }
        .sig-firm { font-size: 8px; font-weight: bold; color: #0a1b33; margin-top: 2px; }
        .sig-space { height: 38px; }
        .sig-line { width: 160px; border-top: 1px solid #0a1b33; margin: 0 auto 2px; }
        .sig-name { font-size: 7.2px; font-weight: bold; color: #0a1b33; }

        /* Footer */
        .footer { position: fixed; right: 0; bottom: -24px; left: 0; padding-top: 4px; border-top: 1px solid #cbd5e1; color: #64748b; font-size: 6.2px; }
        .footer td:last-child { text-align: right; }
    </style>
</head>
<body>

    <table class="footer">
        <tr>
            <td>RONI, PUTRA &amp; KUSUMAH LAW FIRM &nbsp;|&nbsp; DOKUMEN FAKTUR TAGIHAN RESMI &nbsp;|&nbsp; RAHASIA</td>
            <td class="mono">{{ $invoice->invoice_number }} &nbsp;|&nbsp; {{ now()->timezone(config('raf.timezone'))->format('d/m/Y H:i') }} WIB</td>
        </tr>
    </table>

    <!-- Letterhead -->
    <table class="letterhead">
        <tr>
            <td class="logo-cell">
                <div class="logo-crop">
                    <img src="{{ public_path('logo/logo.png') }}" alt="Roni, Putra & Kusumah Law Firm">
                </div>
            </td>
            <td class="office-cell">
                <strong>RONI, PUTRA &amp; KUSUMAH LAW FIRM</strong><br>
                Menara Hukum RPK, Lantai 5, Jl. LLRE Martadinata No. 88, Bandung 40115<br>
                Tel: +62 22 420 8899 &nbsp;·&nbsp; Email: billing@rpklaw.co.id &nbsp;·&nbsp; www.rpklaw.co.id
            </td>
        </tr>
    </table>
    <div class="gold-rule"></div>

    <!-- Document Header & Reference -->
    <table class="doc-header-table">
        <tr>
            <td>
                <span class="doc-badge">FAKTUR TAGIHAN RESMI (INVOICE)</span>
                <div class="doc-title">INVOICE PENAGIHAN JASA HUKUM</div>
                <div class="doc-subtitle">Honorarium advokat, biaya penanganan perkara, dan penggantian pengeluaran operasional.</div>
            </td>
            <td style="width: 40%; text-align: right;">
                <div class="ref-box" style="margin-left: auto;">
                    <div class="ref-label">NOMOR FAKTUR</div>
                    <div class="ref-val mono">{{ $invoice->invoice_number }}</div>
                    @php
                        $isPaid = $invoice->status === 'paid' || ($invoice->outstanding_amount <= 0 && $invoice->total_amount > 0);
                        $statusClass = $isPaid ? 'status-paid' : ($invoice->status === 'partial' ? 'status-partial' : 'status-unpaid');
                        $statusLabel = $isPaid ? 'LUNAS (PAID)' : ($invoice->status === 'partial' ? 'DIBAYAR SEBAGIAN' : 'BELUM DIBAYAR (UNPAID)');
                    @endphp
                    <span class="ref-status {{ $statusClass }}">{{ $statusLabel }}</span>
                </div>
            </td>
        </tr>
    </table>

    <!-- Automatic PAID / LUNAS Stamp -->
    @if ($isPaid)
        <div class="stamp-paid-container">
            <div class="stamp-paid-title">&#10003; LUNAS / PAID</div>
            <div class="stamp-paid-subtitle">RPK LAW FIRM VERIFIED</div>
        </div>
    @endif

    <!-- Client & Matter Information Grid -->
    <table class="info-card">
        <tr>
            <td>
                <div class="section-label">DITUJUKAN KEPADA (BILL TO):</div>
                <div class="client-name">{{ $invoice->client->display_name }}</div>
                @if ($invoice->client->legal_name && $invoice->client->legal_name !== $invoice->client->display_name)
                    <div class="client-detail" style="font-weight: bold;">{{ $invoice->client->legal_name }}</div>
                @endif
                <div class="client-detail">
                    @if ($invoice->client->address_line_1){{ $invoice->client->address_line_1 }}<br>@endif
                    @if ($invoice->client->city){{ $invoice->client->city }}@if ($invoice->client->postal_code) {{ $invoice->client->postal_code }}@endif<br>@endif
                    @if ($invoice->client->email)Email: {{ $invoice->client->email }}<br>@endif
                    @if ($invoice->client->tax_identifier)NPWP: <span class="mono">{{ $invoice->client->tax_identifier }}</span>@endif
                </div>
            </td>
            <td>
                <div class="section-label">RINCIAN PERKARA &amp; PENAGIHAN:</div>
                <table class="detail-row">
                    <tr><td class="detail-label">Perihal:</td><td class="detail-val">{{ $invoice->title }}</td></tr>
                    @if ($invoice->matter)
                        <tr><td class="detail-label">Nomor Perkara:</td><td class="detail-val mono" style="color: #0369a1;">{{ $invoice->matter->matter_number }}</td></tr>
                    @endif
                    <tr><td class="detail-label">Tanggal Terbit:</td><td class="detail-val">{{ $invoice->issued_at?->translatedFormat('d F Y') ?? now()->translatedFormat('d F Y') }}</td></tr>
                    <tr><td class="detail-label">Jatuh Tempo:</td><td class="detail-val" style="color: #b91c1c;">{{ $invoice->due_at?->translatedFormat('d F Y') ?? 'Saat Diterima' }}</td></tr>
                    <tr><td class="detail-label">Mata Uang:</td><td class="detail-val mono">{{ $invoice->currency ?: 'IDR' }}</td></tr>
                </table>
            </td>
        </tr>
    </table>

    <!-- Line Items Table -->
    <table class="items-table">
        <thead>
            <tr>
                <th class="center" style="width: 6%">No</th>
                <th style="width: 50%; text-align: left">Deskripsi Jasa Hukum &amp; Pengeluaran</th>
                <th class="center" style="width: 10%">Kuantitas</th>
                <th class="right" style="width: 17%">Tarif Satuan ({{ $invoice->currency ?: 'IDR' }})</th>
                <th class="right" style="width: 17%">Total ({{ $invoice->currency ?: 'IDR' }})</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($invoice->lineItems as $index => $item)
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
                <tr><td colspan="5" class="center muted" style="padding: 12px;">Belum ada item tagihan tercatat.</td></tr>
            @endforelse
        </tbody>
    </table>

    <!-- Settlement & Multi-Bank Remittance Details -->
    <table class="summary-layout">
        <tr>
            <td class="bank-cell">
                <div class="bank-box">
                    <div class="bank-title">Instruksi Pembayaran &amp; Rekening Resmi Multi-Bank</div>
                    
                    <!-- Rekening 1: BCA -->
                    <div class="bank-item">
                        <div class="bank-item-title">Bank Central Asia (BCA) — KCU Sudirman</div>
                        <div class="bank-item-acc mono">872-009-8811</div>
                        <div class="bank-item-name">a.n. <strong>RPK LAW FIRM &amp; PARTNERS</strong></div>
                    </div>

                    <!-- Rekening 2: Bank Mandiri -->
                    <div class="bank-item" style="margin-bottom: 3px;">
                        <div class="bank-item-title">Bank Mandiri — KCP Thamrin Jakarta</div>
                        <div class="bank-item-acc mono">137-00-198899-2</div>
                        <div class="bank-item-name">a.n. <strong>RPK LAW FIRM</strong></div>
                    </div>

                    <div style="margin-top: 4px; font-size: 6.5px; color: #64748b; font-style: italic;">
                        *Cantumkan Nomor Faktur <strong>{{ $invoice->invoice_number }}</strong> pada berita transfer dan kirim bukti pembayaran ke <strong>billing@rpklaw.co.id</strong>.
                    </div>
                </div>
            </td>
            <td class="totals-cell">
                <table class="totals-table">
                    <tr>
                        <td class="totals-label">Subtotal:</td>
                        <td class="totals-val mono">{{ $invoice->currency ?: 'IDR' }} {{ number_format($invoice->subtotal_amount, 0, ',', '.') }}</td>
                    </tr>
                    @if ($invoice->discount_amount > 0)
                        <tr>
                            <td class="totals-label">Potongan / Diskon:</td>
                            <td class="totals-val mono" style="color: #047857;">- {{ $invoice->currency ?: 'IDR' }} {{ number_format($invoice->discount_amount, 0, ',', '.') }}</td>
                        </tr>
                    @endif
                    @if ($invoice->tax_amount > 0)
                        <tr>
                            <td class="totals-label">PPN:</td>
                            <td class="totals-val mono">{{ $invoice->currency ?: 'IDR' }} {{ number_format($invoice->tax_amount, 0, ',', '.') }}</td>
                        </tr>
                    @endif
                    <tr class="total-highlight">
                        <td class="totals-label">TOTAL TAGIHAN:</td>
                        <td class="totals-val mono">{{ $invoice->currency ?: 'IDR' }} {{ number_format($invoice->total_amount, 0, ',', '.') }}</td>
                    </tr>
                    @if ($invoice->paid_amount > 0)
                        <tr>
                            <td class="totals-label" style="color: #047857;">Telah Dibayar:</td>
                            <td class="totals-val mono" style="color: #047857;">{{ $invoice->currency ?: 'IDR' }} {{ number_format($invoice->paid_amount, 0, ',', '.') }}</td>
                        </tr>
                        <tr class="outstanding-row">
                            <td class="totals-label" style="color: #be123c;">SISA TAGIHAN:</td>
                            <td class="totals-val mono">{{ $invoice->currency ?: 'IDR' }} {{ number_format($invoice->outstanding_amount, 0, ',', '.') }}</td>
                        </tr>
                    @endif
                </table>
            </td>
        </tr>
    </table>

    <!-- Legal Notes, QR Verification & Signatures -->
    <table class="closing-layout">
        <tr>
            <td class="legal-clause" style="width: 50%;">
                <strong>Catatan Hukum &amp; Kepatuhan:</strong><br>
                Faktur ini diterbitkan secara sah berdasarkan Perjanjian Jasa Hukum yang disepakati. Pembayaran dianggap sah setelah dana efektif masuk ke salah satu rekening resmi firma hukum Roni, Putra &amp; Kusumah di atas. Dokumen ini merupakan bukti tagihan yang sah menurut hukum.
            </td>
            <td class="qr-col" style="width: 18%; vertical-align: middle; text-align: center;">
                <img src="{{ $qrDataUri }}" style="width: 48px; height: 48px; border: 1px solid #cbd5e1; padding: 2px; border-radius: 3px;" alt="QR Verifikasi" />
                <div style="font-size: 5.5px; color: #475569; margin-top: 2px; font-weight: bold; line-height: 1.2;">
                    SCAN VERIFIKASI<br><span style="font-weight: normal; color: #64748b;">Keaslian Faktur</span>
                </div>
            </td>
            <td class="sig-col" style="width: 32%;">
                <div style="font-size: 7px; color: #64748b;">Hormat Kami,</div>
                <div class="sig-firm">RONI, PUTRA &amp; KUSUMAH LAW FIRM</div>
                <div class="sig-space"></div>
                <div class="sig-line"></div>
                <div class="sig-name">Managing Partner / Bagian Keuangan</div>
            </td>
        </tr>
    </table>
</body>
</html>
