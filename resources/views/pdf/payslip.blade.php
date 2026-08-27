@php
    $verificationUrl = route('verify.payslip', $payroll->payslip_number);
    $qrDataUri = (new \Endroid\QrCode\Writer\PngWriter())->write(
        new \Endroid\QrCode\QrCode(data: $verificationUrl, size: 160, margin: 0)
    )->getDataUri();

    function rpkTerbilangGaji($number): string {
        $number = abs((int) $number);
        $words = ["", "Satu", "Dua", "Tiga", "Empat", "Lima", "Enam", "Tujuh", "Delapan", "Sembilan", "Sepuluh", "Sebelas"];
        if ($number < 12) {
            return $words[$number];
        } elseif ($number < 20) {
            return rpkTerbilangGaji($number - 10) . " Belas";
        } elseif ($number < 100) {
            return rpkTerbilangGaji(intdiv($number, 10)) . " Puluh " . rpkTerbilangGaji($number % 10);
        } elseif ($number < 200) {
            return "Seratus " . rpkTerbilangGaji($number - 100);
        } elseif ($number < 1000) {
            return rpkTerbilangGaji(intdiv($number, 100)) . " Ratus " . rpkTerbilangGaji($number % 100);
        } elseif ($number < 2000) {
            return "Seribu " . rpkTerbilangGaji($number - 1000);
        } elseif ($number < 1000000) {
            return rpkTerbilangGaji(intdiv($number, 1000)) . " Ribu " . rpkTerbilangGaji($number % 1000);
        } elseif ($number < 1000000000) {
            return rpkTerbilangGaji(intdiv($number, 1000000)) . " Juta " . rpkTerbilangGaji($number % 1000000);
        } elseif ($number < 1000000000000) {
            return rpkTerbilangGaji(intdiv($number, 1000000000)) . " Miliar " . rpkTerbilangGaji($number % 1000000000);
        } else {
            return rpkTerbilangGaji(intdiv($number, 1000000000000)) . " Triliun " . rpkTerbilangGaji($number % 1000000000000);
        }
    }
    $spelled = trim(rpkTerbilangGaji($payroll->net_salary)) . " Rupiah";
    $totalEarnings = (int) ($payroll->basic_salary + $payroll->fixed_allowance + $payroll->transport_meal_allowance + $payroll->overtime_amount + $payroll->bonus_amount);
    $totalDeductions = (int) ($payroll->deductions_amount + $payroll->tax_deduction_amount);

    $earningsItems = [];
    if ($payroll->basic_salary > 0 || ($payroll->basic_salary == 0 && $totalEarnings == 0)) {
        $earningsItems[] = ['label' => 'Gaji Pokok / Honorarium Dasar', 'amount' => $payroll->basic_salary];
    }
    if ($payroll->fixed_allowance > 0) {
        $earningsItems[] = ['label' => 'Tunjangan Tetap / Jabatan', 'amount' => $payroll->fixed_allowance];
    }
    if ($payroll->transport_meal_allowance > 0) {
        $earningsItems[] = ['label' => 'Tunjangan Transport & Makan', 'amount' => $payroll->transport_meal_allowance];
    }
    if ($payroll->overtime_amount > 0) {
        $earningsItems[] = ['label' => 'Upah Lembur (Overtime)', 'amount' => $payroll->overtime_amount];
    }
    if ($payroll->bonus_amount > 0) {
        $earningsItems[] = ['label' => 'Bonus / Insentif Perkara', 'amount' => $payroll->bonus_amount];
    }

    $deductionItems = [];
    if ($payroll->tax_deduction_amount > 0) {
        $deductionItems[] = ['label' => 'Potongan Pajak PPh 21', 'amount' => $payroll->tax_deduction_amount];
    }
    if ($payroll->deductions_amount > 0) {
        $deductionItems[] = ['label' => 'Potongan Kasbon / BPJS / Lainnya', 'amount' => $payroll->deductions_amount];
    }

    $statusColor = match($payroll->status) {
        'paid' => '#059669',
        'approved' => '#0284c7',
        default => '#e11d48'
    };
    $statusLabel = match($payroll->status) {
        'paid' => 'LUNAS (PAID)',
        'approved' => 'DISETUJUI (APPROVED)',
        default => 'DRAFT'
    };
@endphp
<!doctype html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <title>Slip Gaji {{ $payroll->payslip_number }} — {{ $payroll->user->name }} — RPK Law Firm</title>
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
            padding: 2.5px 0;
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

        /* 3. Information Grid */
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
            margin-bottom: 4px;
        }
        .person-name {
            font-size: 10px;
            font-weight: bold;
            color: #0a1b33;
            margin-bottom: 2px;
        }
        .detail-row td {
            padding: 2px 0;
            font-size: 7.4px;
            vertical-align: top;
        }
        .detail-label {
            width: 38%;
            color: #64748b;
            font-weight: bold;
        }
        .detail-val {
            width: 62%;
            color: #0f172a;
            font-weight: bold;
        }

        /* 4. Financial Breakdown Table */
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
        .group-header-row td {
            background: #f1f5f9;
            font-size: 7px;
            font-weight: bold;
            color: #0a1b33;
            padding: 5.5px 10px;
            letter-spacing: .5px;
            text-transform: uppercase;
            border-bottom: 1px solid #e2e8f0;
        }
        .item-row td {
            padding: 5px 10px 5px 18px;
            border-bottom: 1px solid #f1f5f9;
            font-size: 7.6px;
            color: #334155;
        }
        .item-row .amount {
            text-align: right;
            font-weight: bold;
            color: #0f172a;
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

        /* 5. Take Home Pay Card (Refined & Balanced) */
        .thp-card {
            background: #fdfbf7;
            border: 1px solid #e8e1d5;
            border-left: 4px solid #8f6a22;
            border-radius: 4px;
            margin-top: 14px;
            margin-bottom: 16px;
        }
        .thp-card td {
            padding: 10px 14px;
            vertical-align: middle;
        }
        .thp-left {
            width: 58%;
        }
        .thp-title {
            font-size: 6.8px;
            font-weight: bold;
            color: #8f6a22;
            letter-spacing: 0.8px;
            text-transform: uppercase;
            margin-bottom: 3px;
        }
        .thp-spelled {
            font-size: 7.8px;
            color: #334155;
            line-height: 1.4;
        }
        .thp-spelled-tag {
            font-weight: bold;
            color: #64748b;
            margin-right: 3px;
        }
        .thp-spelled-text {
            font-weight: bold;
            color: #0a1b33;
            font-style: italic;
        }
        .thp-right {
            width: 42%;
            text-align: right;
        }
        .thp-amount {
            font-size: 19px;
            font-weight: bold;
            color: #0a1b33;
            letter-spacing: -0.3px;
        }

        /* 6. Notes & Summary Section */
        .summary-layout {
            margin-bottom: 14px;
            page-break-inside: avoid;
        }
        .summary-layout td {
            vertical-align: top;
        }
        .note-box {
            background: #f8fafc;
            border: 1px solid #cbd5e1;
            border-top: 2px solid #0a1b33;
            border-radius: 4px;
            padding: 8px 10px;
        }
        .note-title {
            font-size: 7.2px;
            font-weight: bold;
            color: #0a1b33;
            text-transform: uppercase;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 3px;
            margin-bottom: 4px;
        }
        .note-desc {
            font-size: 6.8px;
            color: #475569;
            line-height: 1.45;
        }

        /* 7. Closing Signatures */
        .closing-layout {
            margin-top: 26px;
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
            height: 48px;
        }
        .sig-line {
            width: 140px;
            border-top: 1px solid #0a1b33;
            margin: 0 auto 2px;
        }
        .sig-name {
            font-size: 7.4px;
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

    <!-- Fixed Footer safely above bottom edge -->
    <table class="footer">
        <tr>
            <td>RONI, PUTRA &amp; KUSUMAH LAW FIRM &nbsp;|&nbsp; DOKUMEN SLIP GAJI RESMI &nbsp;|&nbsp; RAHASIA</td>
            <td class="mono">{{ $payroll->payslip_number }} &nbsp;|&nbsp; {{ now()->timezone(config('raf.timezone'))->format('d/m/Y H:i') }} WIB</td>
        </tr>
    </table>

    <!-- QR Code Fixed in Bottom-Right Corner of the Paper -->
    <div class="qr-bottom-right-corner">
        <img src="{{ $qrDataUri }}" alt="QR Verifikasi" />
        <div class="qr-label">
            SCAN VERIFIKASI<br><span style="font-weight: normal; color: #64748b;">Keabsahan Slip</span>
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
            <td style="width: 52%;">
                <div class="doc-kicker">SLIP PENGHASILAN RESMI</div>
                <div class="doc-title">SLIP GAJI &amp; HONORARIUM</div>
                <div class="doc-subtitle">Rincian penghasilan kotor, honorarium dasar, tunjangan, dan potongan periode berjalan.</div>
            </td>
            <td style="width: 48%; text-align: right;">
                <table class="meta-table">
                    <tr>
                        <td class="meta-label">Nomor Slip</td>
                        <td class="meta-sep">:</td>
                        <td class="meta-val mono">{{ $payroll->payslip_number }}</td>
                    </tr>
                    <tr>
                        <td class="meta-label">Periode</td>
                        <td class="meta-sep">:</td>
                        <td class="meta-val" style="color: #059669;">{{ \Carbon\Carbon::parse($payroll->period . '-01')->translatedFormat('F Y') }}</td>
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
            <!-- Employee Info -->
            <td>
                <div class="section-label">DATA PEGAWAI / ADVOKAT</div>
                <div class="person-name">{{ $payroll->user->name }}</div>
                <table style="width: 100%; margin-top: 3px;">
                    <tr class="detail-row">
                        <td class="detail-label">Kode / NIK:</td>
                        <td class="detail-val mono">{{ $payroll->user->employee_code ?: '-' }}</td>
                    </tr>
                    <tr class="detail-row">
                        <td class="detail-label">Jabatan / Posisi:</td>
                        <td class="detail-val">{{ $payroll->user->position_title ?: 'Advokat / Staf' }}</td>
                    </tr>
                    <tr class="detail-row">
                        <td class="detail-label">Departemen:</td>
                        <td class="detail-val">{{ $payroll->user->department ?: 'Legal Practice' }}</td>
                    </tr>
                    <tr class="detail-row">
                        <td class="detail-label">Email:</td>
                        <td class="detail-val">{{ $payroll->user->email ?: '-' }}</td>
                    </tr>
                </table>
            </td>

            <!-- Payment & Bank Metadata -->
            <td>
                <div class="section-label">DETAIL PEMBAYARAN &amp; REKENING</div>
                <table style="width: 100%; margin-top: 3px;">
                    <tr class="detail-row">
                        <td class="detail-label">Periode Gaji:</td>
                        <td class="detail-val" style="color: #059669; font-weight: bold;">{{ \Carbon\Carbon::parse($payroll->period . '-01')->translatedFormat('F Y') }}</td>
                    </tr>
                    <tr class="detail-row">
                        <td class="detail-label">Bank Penerima:</td>
                        <td class="detail-val">{{ $payroll->user->bank_name ?: '-' }}</td>
                    </tr>
                    <tr class="detail-row">
                        <td class="detail-label">No. Rekening:</td>
                        <td class="detail-val mono">{{ $payroll->user->bank_account_number ?: '-' }}</td>
                    </tr>
                    <tr class="detail-row">
                        <td class="detail-label">Atas Nama (A.N):</td>
                        <td class="detail-val">{{ $payroll->user->bank_account_holder ?: $payroll->user->name }}</td>
                    </tr>
                    <tr class="detail-row">
                        <td class="detail-label">Akun Pembayar:</td>
                        <td class="detail-val">{{ $payroll->paymentAccount->name ?? 'Kas / Bank Operasional' }}</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    <!-- 4. Unified Financial Breakdown Table (Penghasilan & Potongan) -->
    <div class="financial-card">
        <table>
            <thead>
                <tr>
                    <th style="text-align: left; width: 68%;">RINCIAN KOMPONEN PENGHASILAN &amp; POTONGAN</th>
                    <th style="text-align: right; width: 32%;">JUMLAH (IDR)</th>
                </tr>
            </thead>
            <tbody>
                <!-- PENGHASILAN -->
                <tr class="group-header-row">
                    <td colspan="2">A. PENGHASILAN &amp; TUNJANGAN (EARNINGS)</td>
                </tr>
                @forelse ($earningsItems as $item)
                    <tr class="item-row">
                        <td>{{ $item['label'] }}</td>
                        <td class="amount mono">Rp {{ number_format($item['amount'], 0, ',', '.') }}</td>
                    </tr>
                @empty
                    <tr class="item-row">
                        <td colspan="2" class="muted" style="font-style: italic;">Tidak ada komponen penghasilan tercatat.</td>
                    </tr>
                @endforelse
                <tr class="subtotal-row">
                    <td>TOTAL PENGHASILAN BRUTO</td>
                    <td class="right mono" style="color: #059669;">Rp {{ number_format($totalEarnings, 0, ',', '.') }}</td>
                </tr>

                <!-- POTONGAN -->
                <tr class="group-header-row">
                    <td colspan="2">B. POTONGAN RESMI (DEDUCTIONS)</td>
                </tr>
                @forelse ($deductionItems as $item)
                    <tr class="item-row">
                        <td>{{ $item['label'] }}</td>
                        <td class="amount mono" style="color: #be123c;">Rp {{ number_format($item['amount'], 0, ',', '.') }}</td>
                    </tr>
                @empty
                    <tr class="item-row">
                        <td class="muted" style="font-style: italic;">Nihil / Tidak ada potongan pada periode ini.</td>
                        <td class="amount mono">Rp 0</td>
                    </tr>
                @endforelse
                <tr class="subtotal-row">
                    <td>TOTAL POTONGAN</td>
                    <td class="right mono" style="color: {{ $totalDeductions > 0 ? '#be123c' : '#0f172a' }};">
                        {{ $totalDeductions > 0 ? '- Rp ' . number_format($totalDeductions, 0, ',', '.') : 'Rp 0' }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- 5. Take Home Pay Card (Refined & Balanced) -->
    <table class="thp-card">
        <tr>
            <td class="thp-left">
                <div class="thp-title">TOTAL PENGHASILAN BERSIH (TAKE HOME PAY)</div>
                <div class="thp-spelled">
                    <span class="thp-spelled-tag">Terbilang:</span>
                    <span class="thp-spelled-text">{{ $spelled }}</span>
                </div>
            </td>
            <td class="thp-right">
                <div class="thp-amount mono">
                    Rp {{ number_format($payroll->net_salary, 0, ',', '.') }}
                </div>
            </td>
        </tr>
    </table>

    <!-- 6. Keterangan & Catatan -->
    @if ($payroll->notes)
        <table class="summary-layout">
            <tr>
                <td>
                    <div class="note-box">
                        <div class="note-title">KETERANGAN &amp; CATATAN TAMBAHAN</div>
                        <div class="note-desc">{{ $payroll->notes }}</div>
                    </div>
                </td>
            </tr>
        </table>
    @endif

    <!-- 7. Closing Signatures -->
    <table class="closing-layout">
        <tr>
            <td class="legal-clause" style="width: 48%; padding-right: 16px;">
                <strong>CATATAN PENGESAHAN DOKUMEN:</strong><br>
                Slip penghasilan ini diterbitkan secara resmi melalui sistem terkomputerisasi RPK App - Integrated Legal Practice System. Bersifat rahasia (confidential) dan sah sebagai bukti pemenuhan hak keuangan pegawai / advokat.
            </td>
            <td class="sig-box" style="width: 26%;">
                <div class="sig-role">PENERIMA / PEGAWAI</div>
                <div class="sig-firm">&nbsp;</div>
                <div class="sig-space"></div>
                <div class="sig-line"></div>
                <div class="sig-name">{{ $payroll->user->name }}</div>
            </td>
            <td class="sig-box" style="width: 26%;">
                <div class="sig-role">DISETUJUI OLEH</div>
                <div class="sig-firm">MANAGING PARTNER RPK</div>
                <div class="sig-space"></div>
                <div class="sig-line"></div>
                <div class="sig-name">Muhamad Fajar Roni, S.H.</div>
            </td>
        </tr>
    </table>

</body>
</html>
