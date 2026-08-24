<!doctype html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <title>Faktur Tagihan {{ $invoice->invoice_number }} — RPK Law Firm</title>
    <style>
        @page { margin: 32px 40px 42px; size: A4 portrait; }
        * { box-sizing: border-box; }
        body { margin: 0; color: #1e293b; font-family: "DejaVu Sans", Helvetica, Arial, sans-serif; font-size: 8.5px; line-height: 1.48; }
        table { width: 100%; border-collapse: collapse; }
        .mono { font-family: "DejaVu Sans Mono", monospace; }
        .navy { color: #0a1b33; }
        .gold { color: #8f6a22; }
        .muted { color: #64748b; }
        .right { text-align: right; }
        .center { text-align: center; }
        .uppercase { text-transform: uppercase; }

        /* Letterhead Header */
        .letterhead { margin-bottom: 14px; }
        .letterhead td { vertical-align: middle; }
        .logo-cell { width: 55%; }
        .logo-crop { width: 195px; height: 62px; overflow: hidden; }
        .logo-crop img { width: 195px; height: auto; margin-top: -24px; }
        .office-cell { width: 45%; color: #475569; font-size: 7.2px; line-height: 1.55; text-align: right; }
        .gold-rule { height: 2px; border-top: 1.5px solid #8f6a22; border-bottom: 1px solid #e2d2aa; margin-bottom: 18px; }

        /* Document Header */
        .doc-header-table { margin-bottom: 16px; }
        .doc-header-table td { vertical-align: top; }
        .doc-badge { display: inline-block; background: #0a1b33; color: #ffffff; padding: 2.5px 8px; font-size: 6.8px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; border-radius: 3px; }
        .doc-title { margin-top: 5px; font-size: 19px; font-weight: bold; color: #0a1b33; letter-spacing: .3px; }
        .doc-subtitle { margin-top: 2px; font-size: 7.5px; color: #64748b; }
        
        .ref-box { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 4px; padding: 8px 12px; text-align: right; width: 42%; }
        .ref-label { font-size: 6.8px; font-weight: bold; color: #8f6a22; letter-spacing: 1px; text-transform: uppercase; }
        .ref-val { font-size: 11.5px; font-weight: bold; color: #0a1b33; margin-top: 2px; }
        .ref-status { display: inline-block; padding: 2px 7px; font-size: 6.5px; font-weight: bold; border-radius: 3px; margin-top: 4px; text-transform: uppercase; }
        .status-paid { background: #ecfdf5; color: #047857; }
        .status-unpaid { background: #fff1f2; color: #be123c; }
        .status-partial { background: #fffbeb; color: #b45309; }

        /* Information Grid */
        .info-card { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 5px; margin-bottom: 16px; table-layout: fixed; }
        .info-card > tbody > tr > td { width: 50%; padding: 10px 14px; vertical-align: top; }
        .info-card > tbody > tr > td:first-child { border-right: 1px solid #e2e8f0; }
        .section-label { font-size: 6.8px; font-weight: bold; color: #8f6a22; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 5px; }
        .client-name { font-size: 11px; font-weight: bold; color: #0a1b33; margin-bottom: 2px; }
        .client-detail { font-size: 7.6px; color: #475569; line-height: 1.5; }
        .detail-row td { padding: 1.8px 0; font-size: 7.6px; vertical-align: top; }
        .detail-label { width: 40%; color: #64748b; font-weight: bold; }
        .detail-val { width: 60%; color: #0f172a; font-weight: bold; }

        /* Items Table */
        .items-table { margin-bottom: 16px; }
        .items-table th { background: #0a1b33; color: #ffffff; font-size: 7px; font-weight: bold; padding: 6px 8px; text-transform: uppercase; letter-spacing: .5px; }
        .items-table td { padding: 8px 8px; border-bottom: 1px solid #e2e8f0; font-size: 7.8px; vertical-align: top; }
        .item-desc { font-weight: bold; color: #0a1b33; font-size: 8.5px; }

        /* Summary & Bank Remittance */
        .summary-layout { margin-bottom: 18px; page-break-inside: avoid; }
        .summary-layout td { vertical-align: top; }
        .bank-cell { width: 55%; padding-right: 20px; }
        .bank-box { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 4px; padding: 10px 12px; }
        .bank-title { font-size: 8px; font-weight: bold; color: #0a1b33; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 6px; }
        .bank-grid td { padding: 2px 0; font-size: 7.5px; vertical-align: top; }
        .bank-label { width: 32%; color: #64748b; font-weight: bold; }
        .bank-val { color: #0a1b33; font-weight: bold; }

        .totals-cell { width: 45%; }
        .totals-table { border: 1px solid #cbd5e1; border-radius: 4px; background: #ffffff; }
        .totals-table td { padding: 4.5px 8px; font-size: 7.8px; }
        .totals-label { color: #64748b; font-weight: bold; }
        .totals-val { text-align: right; color: #0f172a; font-weight: bold; }
        .total-highlight td { background: #0a1b33; color: #ffffff; font-size: 9.5px; font-weight: bold; padding: 7px 8px; }
        .total-highlight .totals-label { color: #ffffff; }
        .total-highlight .totals-val { color: #ffffff; }
        .outstanding-row td { background: #fff1f2; color: #be123c; font-weight: bold; font-size: 8.5px; border-top: 1px solid #fecdd3; }

        /* Closing Signature */
        .closing-layout { margin-top: 24px; page-break-inside: avoid; }
        .closing-layout td { vertical-align: bottom; }
        .legal-clause { width: 58%; padding-right: 24px; font-size: 6.8px; color: #64748b; line-height: 1.5; }
        .sig-col { width: 42%; text-align: center; }
        .sig-firm { font-size: 8.5px; font-weight: bold; color: #0a1b33; margin-top: 2px; }
        .sig-space { height: 42px; }
        .sig-line { width: 170px; border-top: 1px solid #0a1b33; margin: 0 auto 3px; }
        .sig-name { font-size: 7.5px; font-weight: bold; color: #0a1b33; }

        /* Watermark & Footer */
        .watermark { position: fixed; top: 40%; left: 0; width: 100%; text-align: center; transform: rotate(-25deg); opacity: 0.04; font-size: 26px; font-weight: bold; color: #0a1b33; z-index: -1000; }
        .footer { position: fixed; right: 0; bottom: -30px; left: 0; padding-top: 5px; border-top: 1px solid #cbd5e1; color: #64748b; font-size: 6.5px; }
        .footer td:last-child { text-align: right; }
    </style>
</head>
<body>

    <div class="watermark">
        DIUNDUH OLEH {{ strtoupper(auth()->user()->name ?? 'RPK USER') }}<br>
        {{ now()->format('Y-m-d H:i') }} WIB · DOKUMEN RESMI RPK LAW FIRM
    </div>

    <table class="footer">
        <tr>
            <td>RONI, PUTRA &amp; KUSUMAH LAW FIRM &nbsp;|&nbsp; DOKUMEN TAGIHAN RESMI &nbsp;|&nbsp; RAHASIA</td>
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
                Tel: +62 22 420 8899 &nbsp;·&nbsp; Email: billing@rpklaw.co.id
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
                        $statusClass = $invoice->status === 'paid' ? 'status-paid' : ($invoice->status === 'partial' ? 'status-partial' : 'status-unpaid');
                        $statusLabel = $invoice->status === 'paid' ? 'LUNAS (PAID)' : ($invoice->status === 'partial' ? 'DIBAYAR SEBAGIAN' : 'BELUM DIBAYAR (UNPAID)');
                    @endphp
                    <span class="ref-status {{ $statusClass }}">{{ $statusLabel }}</span>
                </div>
            </td>
        </tr>
    </table>

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
                <tr><td colspan="5" class="center muted" style="padding: 14px;">Belum ada item tagihan tercatat.</td></tr>
            @endforelse
        </tbody>
    </table>

    <!-- Settlement & Remittance Details -->
    <table class="summary-layout">
        <tr>
            <td class="bank-cell">
                <div class="bank-box">
                    <div class="bank-title">Instruksi Pembayaran &amp; Rekening Resmi</div>
                    <table class="bank-grid">
                        <tr><td class="bank-label">Bank Penerima:</td><td class="bank-val">Bank Central Asia (BCA) — KCU Sudirman</td></tr>
                        <tr><td class="bank-label">Nomor Rekening:</td><td class="bank-val mono" style="color: #0369a1; font-size: 8.5px;">872-009-8811</td></tr>
                        <tr><td class="bank-label">Atas Nama:</td><td class="bank-val">RPK LAW FIRM &amp; PARTNERS</td></tr>
                        <tr><td class="bank-label">Berita Transfer:</td><td class="bank-val mono">{{ $invoice->invoice_number }}</td></tr>
                    </table>
                    <div style="margin-top: 5px; font-size: 6.8px; color: #64748b; font-style: italic;">
                        *Mohon mencantumkan Nomor Faktur pada berita transfer dan mengirimkan bukti transfer ke <strong>billing@rpklaw.co.id</strong>.
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
                            <td class="totals-label">PPN (11%):</td>
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

    <!-- Legal Notes & Signatures -->
    <table class="closing-layout">
        <tr>
            <td class="legal-clause">
                <strong>Catatan Hukum &amp; Kepatuhan:</strong><br>
                Faktur ini diterbitkan secara sah berdasarkan Perjanjian Jasa Hukum yang disepakati. Pembayaran dianggap sah setelah dana efektif masuk ke rekening resmi firma hukum Roni, Putra &amp; Kusumah. Dokumen ini merupakan tanda bukti tagihan resmi yang sah menurut hukum.
            </td>
            <td class="sig-col">
                <div style="font-size: 7.2px; color: #64748b;">Hormat Kami,</div>
                <div class="sig-firm">RONI, PUTRA &amp; KUSUMAH LAW FIRM</div>
                <div class="sig-space"></div>
                <div class="sig-line"></div>
                <div class="sig-name">Managing Partner / Direktur Keuangan</div>
            </td>
        </tr>
    </table>
</body>
</html>
