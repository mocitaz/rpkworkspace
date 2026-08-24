<!doctype html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <title>Surat Penawaran Honorarium {{ $quotation->quotation_number }} — RPK Law Firm</title>
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
        .ref-status { display: inline-block; padding: 2px 7px; font-size: 6.5px; font-weight: bold; border-radius: 3px; margin-top: 4px; text-transform: uppercase; background: #eff6ff; color: #1d4ed8; }

        /* Information Grid */
        .info-card { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 5px; margin-bottom: 14px; table-layout: fixed; }
        .info-card > tbody > tr > td { width: 50%; padding: 10px 14px; vertical-align: top; }
        .info-card > tbody > tr > td:first-child { border-right: 1px solid #e2e8f0; }
        .section-label { font-size: 6.8px; font-weight: bold; color: #8f6a22; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 5px; }
        .client-name { font-size: 11px; font-weight: bold; color: #0a1b33; margin-bottom: 2px; }
        .client-detail { font-size: 7.6px; color: #475569; line-height: 1.5; }
        .detail-row td { padding: 1.8px 0; font-size: 7.6px; vertical-align: top; }
        .detail-label { width: 40%; color: #64748b; font-weight: bold; }
        .detail-val { width: 60%; color: #0f172a; font-weight: bold; }

        /* Scope Box */
        .scope-box { background: #fbfaf7; border: 1px solid #d8c9a7; border-radius: 4px; padding: 8px 12px; margin-bottom: 14px; page-break-inside: avoid; }
        .scope-title { font-size: 8px; font-weight: bold; color: #8f6a22; text-transform: uppercase; margin-bottom: 3px; }
        .scope-text { font-size: 7.6px; color: #334155; line-height: 1.5; }

        /* Items Table */
        .items-table { margin-bottom: 14px; }
        .items-table th { background: #0a1b33; color: #ffffff; font-size: 7px; font-weight: bold; padding: 6px 8px; text-transform: uppercase; letter-spacing: .5px; }
        .items-table td { padding: 8px 8px; border-bottom: 1px solid #e2e8f0; font-size: 7.8px; vertical-align: top; }
        .item-desc { font-weight: bold; color: #0a1b33; font-size: 8.5px; }

        /* Summary & Terms */
        .summary-layout { margin-bottom: 16px; page-break-inside: avoid; }
        .summary-layout td { vertical-align: top; }
        .terms-cell { width: 56%; padding-right: 20px; }
        .terms-box { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 4px; padding: 9px 12px; }
        .terms-title { font-size: 7.8px; font-weight: bold; color: #0a1b33; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; padding-bottom: 3px; margin-bottom: 5px; }
        .terms-list { font-size: 7px; color: #475569; line-height: 1.45; }
        .terms-list div { margin-bottom: 2px; }

        .totals-cell { width: 44%; }
        .totals-table { border: 1px solid #cbd5e1; border-radius: 4px; background: #ffffff; }
        .totals-table td { padding: 4.5px 8px; font-size: 7.8px; }
        .totals-label { color: #64748b; font-weight: bold; }
        .totals-val { text-align: right; color: #0f172a; font-weight: bold; }
        .total-highlight td { background: #0a1b33; color: #ffffff; font-size: 9.5px; font-weight: bold; padding: 7px 8px; }
        .total-highlight .totals-label { color: #ffffff; }
        .total-highlight .totals-val { color: #ffffff; }

        /* Acceptance Signatures */
        .signatures-layout { margin-top: 22px; page-break-inside: avoid; }
        .signatures-layout td { width: 45%; vertical-align: top; }
        .signatures-spacer { width: 10%; }
        .sig-intro { font-size: 7.2px; color: #64748b; }
        .sig-firm { font-size: 8.5px; font-weight: bold; color: #0a1b33; margin-top: 2px; }
        .sig-space { height: 38px; }
        .sig-line { width: 165px; border-top: 1px solid #0a1b33; margin-bottom: 3px; }
        .sig-name { font-size: 7.5px; font-weight: bold; color: #0a1b33; }
        .sig-title { font-size: 6.8px; color: #64748b; }

        /* Watermark & Footer */
        .watermark { position: fixed; top: 40%; left: 0; width: 100%; text-align: center; transform: rotate(-25deg); opacity: 0.04; font-size: 24px; font-weight: bold; color: #0a1b33; z-index: -1000; }
        .footer { position: fixed; right: 0; bottom: -30px; left: 0; padding-top: 5px; border-top: 1px solid #cbd5e1; color: #64748b; font-size: 6.5px; }
        .footer td:last-child { text-align: right; }
    </style>
</head>
<body>

    <div class="watermark">
        DIUNDUH OLEH {{ strtoupper(auth()->user()->name ?? 'RPK USER') }}<br>
        {{ now()->format('Y-m-d H:i') }} WIB · SURAT PENAWARAN RESMI RPK LAW FIRM
    </div>

    <table class="footer">
        <tr>
            <td>RONI, PUTRA &amp; KUSUMAH LAW FIRM &nbsp;|&nbsp; PROPOSAL PENAWARAN JASA HUKUM &nbsp;|&nbsp; RAHASIA</td>
            <td class="mono">{{ $quotation->quotation_number }} &nbsp;|&nbsp; {{ now()->timezone(config('raf.timezone'))->format('d/m/Y H:i') }} WIB</td>
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
                Tel: +62 22 420 8899 &nbsp;·&nbsp; Email: proposal@rpklaw.co.id
            </td>
        </tr>
    </table>
    <div class="gold-rule"></div>

    <!-- Document Header & Reference -->
    <table class="doc-header-table">
        <tr>
            <td>
                <span class="doc-badge">SURAT PENAWARAN JASA HUKUM (FEE PROPOSAL)</span>
                <div class="doc-title">PROPOSAL HONORARIUM ADVOKAT</div>
                <div class="doc-subtitle">Penawaran ruang lingkup pendampingan hukum, advokasi perkara, dan estimasi biaya profesional.</div>
            </td>
            <td style="width: 40%; text-align: right;">
                <div class="ref-box" style="margin-left: auto;">
                    <div class="ref-label">NOMOR PENAWARAN</div>
                    <div class="ref-val mono">{{ $quotation->quotation_number }}</div>
                    <span class="ref-status">STATUS: {{ strtoupper($quotation->status ?: 'DRAFT') }}</span>
                </div>
            </td>
        </tr>
    </table>

    <!-- Client & Proposal Information Grid -->
    <table class="info-card">
        <tr>
            <td>
                <div class="section-label">DITUJUKAN KEPADA (PROPOSAL TO):</div>
                <div class="client-name">{{ $quotation->client->display_name }}</div>
                @if ($quotation->client->legal_name && $quotation->client->legal_name !== $quotation->client->display_name)
                    <div class="client-detail" style="font-weight: bold;">{{ $quotation->client->legal_name }}</div>
                @endif
                <div class="client-detail">
                    @if ($quotation->client->address_line_1){{ $quotation->client->address_line_1 }}<br>@endif
                    @if ($quotation->client->city){{ $quotation->client->city }}@if ($quotation->client->postal_code) {{ $quotation->client->postal_code }}@endif<br>@endif
                    @if ($quotation->client->email)Email: {{ $quotation->client->email }}<br>@endif
                    @if ($quotation->client->phone)Telp: {{ $quotation->client->phone }}@endif
                </div>
            </td>
            <td>
                <div class="section-label">RINCIAN PENAWARAN:</div>
                <table class="detail-row">
                    <tr><td class="detail-label">Perihal:</td><td class="detail-val">{{ $quotation->title }}</td></tr>
                    @if ($quotation->matter)
                        <tr><td class="detail-label">Perkara Terkait:</td><td class="detail-val mono" style="color: #0369a1;">{{ $quotation->matter->matter_number }}</td></tr>
                    @endif
                    <tr><td class="detail-label">Tanggal Penawaran:</td><td class="detail-val">{{ $quotation->issued_at?->translatedFormat('d F Y') ?? now()->translatedFormat('d F Y') }}</td></tr>
                    <tr><td class="detail-label">Masa Berlaku:</td><td class="detail-val" style="color: #b91c1c;">{{ $quotation->valid_until?->translatedFormat('d F Y') ?? '30 Hari Sejak Diterbitkan' }}</td></tr>
                    <tr><td class="detail-label">Mata Uang:</td><td class="detail-val mono">{{ $quotation->currency ?: 'IDR' }}</td></tr>
                </table>
            </td>
        </tr>
    </table>

    @if ($quotation->scope_of_work)
        <!-- Scope of Work -->
        <div class="scope-box">
            <div class="scope-title">RUANG LINGKUP PEKERJAAN (SCOPE OF LEGAL SERVICES):</div>
            <div class="scope-text">{!! nl2br(e($quotation->scope_of_work)) !!}</div>
        </div>
    @endif

    <!-- Items Table -->
    <table class="items-table">
        <thead>
            <tr>
                <th class="center" style="width: 6%">No</th>
                <th style="width: 50%; text-align: left">Uraian Jasa Hukum / Tahapan Pendampingan</th>
                <th class="center" style="width: 10%">Kuantitas</th>
                <th class="right" style="width: 17%">Tarif Satuan ({{ $quotation->currency ?: 'IDR' }})</th>
                <th class="right" style="width: 17%">Total ({{ $quotation->currency ?: 'IDR' }})</th>
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
                <tr><td colspan="5" class="center muted" style="padding: 14px;">Belum ada rincian item penawaran.</td></tr>
            @endforelse
        </tbody>
    </table>

    <!-- Terms & Totals -->
    <table class="summary-layout">
        <tr>
            <td class="terms-cell">
                <div class="terms-box">
                    <div class="terms-title">Ketentuan Penawaran &amp; Tahapan Pelaksanaan</div>
                    <div class="terms-list">
                        <div>1. Penawaran ini mengikat selama 30 (tiga puluh) hari kalender sejak tanggal diterbitkan.</div>
                        <div>2. Biaya penanganan belum termasuk biaya resmi perkara pengadilan (*court court fee/panjar biaya perkara*).</div>
                        <div>3. Pelaksanaan penanganan perkara dimulai setelah Surat Kuasa Khusus dan Perjanjian Jasa Hukum ditandatangani serta pembayaran termin pertama lunas.</div>
                    </div>
                </div>
            </td>
            <td class="totals-cell">
                <table class="totals-table">
                    <tr>
                        <td class="totals-label">Subtotal:</td>
                        <td class="totals-val mono">{{ $quotation->currency ?: 'IDR' }} {{ number_format($quotation->subtotal_amount, 0, ',', '.') }}</td>
                    </tr>
                    @if ($quotation->discount_amount > 0)
                        <tr>
                            <td class="totals-label">Potongan Biaya:</td>
                            <td class="totals-val mono" style="color: #047857;">- {{ $quotation->currency ?: 'IDR' }} {{ number_format($quotation->discount_amount, 0, ',', '.') }}</td>
                        </tr>
                    @endif
                    @if ($quotation->tax_amount > 0)
                        <tr>
                            <td class="totals-label">PPN (11%):</td>
                            <td class="totals-val mono">{{ $quotation->currency ?: 'IDR' }} {{ number_format($quotation->tax_amount, 0, ',', '.') }}</td>
                        </tr>
                    @endif
                    <tr class="total-highlight">
                        <td class="totals-label">ESTIMASI TOTAL BIAYA:</td>
                        <td class="totals-val mono">{{ $quotation->currency ?: 'IDR' }} {{ number_format($quotation->total_amount, 0, ',', '.') }}</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    <!-- Dual Acceptance Signatures -->
    <table class="signatures-layout">
        <tr>
            <td>
                <div class="sig-intro">Diajukan Oleh:</div>
                <div class="sig-firm">RONI, PUTRA &amp; KUSUMAH LAW FIRM</div>
                <div class="sig-space"></div>
                <div class="sig-line"></div>
                <div class="sig-name">Managing Partner / Senior Counsel</div>
                <div class="sig-title">Kuasa Hukum &amp; Advokat</div>
            </td>
            <td class="signatures-spacer"></td>
            <td>
                <div class="sig-intro">Disetujui &amp; Diterima Oleh:</div>
                <div class="sig-firm">{{ strtoupper($quotation->client->display_name) }}</div>
                <div class="sig-space"></div>
                <div class="sig-line"></div>
                <div class="sig-name">Nama: .................................................</div>
                <div class="sig-title">Jabatan: ..............................................</div>
            </td>
        </tr>
    </table>
</body>
</html>
