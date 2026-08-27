@php
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
    $totalEarnings = $payroll->basic_salary + $payroll->fixed_allowance + $payroll->transport_meal_allowance + $payroll->overtime_amount + $payroll->bonus_amount;
    $totalDeductions = $payroll->deductions_amount + $payroll->tax_deduction_amount;
@endphp
<!doctype html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <title>Slip Gaji {{ $payroll->payslip_number }} — {{ $payroll->user->name }}</title>
    <style>
        @page { margin: 28px 36px 36px; size: A4 portrait; }
        * { box-sizing: border-box; }
        body { margin: 0; color: #1e293b; font-family: "DejaVu Sans", Helvetica, Arial, sans-serif; font-size: 8.5px; line-height: 1.48; }
        table { width: 100%; border-collapse: collapse; }
        .mono { font-family: "DejaVu Sans Mono", monospace; }
        .navy { color: #0a1b33; }
        .muted { color: #64748b; }
        .right { text-align: right; }
        .center { text-align: center; }

        .frame { border: 2px solid #0a1b33; padding: 18px 22px; background: #ffffff; }
        .inner-border { border: 1px solid #d4af37; padding: 16px 18px; }

        .letterhead td { vertical-align: middle; }
        .logo-cell { width: 55%; font-size: 16px; font-weight: bold; color: #0a1b33; letter-spacing: 2px; }
        .office-cell { width: 45%; color: #475569; font-size: 7.2px; line-height: 1.5; text-align: right; }
        .gold-rule { height: 2px; border-top: 1.5px solid #8f6a22; border-bottom: 1px solid #e2d2aa; margin: 12px 0 16px; }

        .payslip-title { font-size: 15px; font-weight: bold; color: #0a1b33; text-transform: uppercase; letter-spacing: 1px; text-align: center; margin-bottom: 2px; }
        .payslip-period { font-size: 8.5px; font-weight: bold; color: #64748b; text-align: center; text-transform: uppercase; margin-bottom: 14px; }

        .emp-table { margin-bottom: 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; padding: 8px 12px; }
        .emp-table td { padding: 3px 4px; font-size: 8px; }

        .salary-table { margin-top: 10px; width: 100%; border: 1px solid #cbd5e1; }
        .salary-table th { background: #0a1b33; color: #ffffff; padding: 6px 8px; font-size: 7.5px; text-transform: uppercase; }
        .salary-table td { padding: 5px 8px; border-bottom: 1px solid #f1f5f9; font-size: 8px; vertical-align: top; }
        .subtotal-row { background: #f8fafc; font-weight: bold; border-top: 1px solid #cbd5e1; }

        .net-box { margin-top: 16px; background: #0a1b33; color: #ffffff; padding: 10px 14px; border-radius: 4px; }
        .spelled-text { font-style: italic; font-size: 8px; color: #e2e8f0; margin-top: 4px; }

        .sig-table { margin-top: 24px; }
        .sig-table td { width: 50%; vertical-align: top; text-align: center; font-size: 7.5px; }
        .sig-space { height: 50px; }
    </style>
</head>
<body>
<div class="frame">
    <div class="inner-border">
        <!-- Letterhead -->
        <table class="letterhead">
            <tr>
                <td class="logo-cell">
                    RONI, PUTRA & KUSUMAH<br>
                    <span style="font-size: 8.5px; font-weight: normal; color: #8f6a22; letter-spacing: 1px;">ATTORNEYS & COUNSELORS AT LAW</span>
                </td>
                <td class="office-cell">
                    Jl. Bukit Nirwana VII, Blok CC.04, Sariwangi<br>
                    Kabupaten Bandung Barat, Jawa Barat<br>
                    Telp: 0852 9560 1417 &bull; contact@gmail.com
                </td>
            </tr>
        </table>
        <div class="gold-rule"></div>

        <div class="payslip-title">SLIP PENGHASILAN & HONORARIUM</div>
        <div class="payslip-period">Periode: {{ \Carbon\Carbon::parse($payroll->period . '-01')->translatedFormat('F Y') }} &bull; No: {{ $payroll->payslip_number }}</div>

        <!-- Employee Info -->
        <table class="emp-table">
            <tr>
                <td style="width: 18%; color: #64748b;">Nama Pegawai</td>
                <td style="width: 2%;">:</td>
                <td style="width: 30%; font-weight: bold;">{{ $payroll->user->name }}</td>
                <td style="width: 18%; color: #64748b;">Kode Pegawai / NIK</td>
                <td style="width: 2%;">:</td>
                <td style="width: 30%; font-weight: bold;">{{ $payroll->user->employee_code ?: '-' }}</td>
            </tr>
            <tr>
                <td style="color: #64748b;">Jabatan / Posisi</td>
                <td>:</td>
                <td style="font-weight: bold;">{{ $payroll->user->position_title ?: 'Advokat / Staf' }}</td>
                <td style="color: #64748b;">Departemen</td>
                <td>:</td>
                <td style="font-weight: bold;">{{ $payroll->user->department ?: 'Legal Practice' }}</td>
            </tr>
            <tr>
                <td style="color: #64748b;">Rekening Pembayaran</td>
                <td>:</td>
                <td colspan="4" style="font-weight: bold;">
                    {{ $payroll->user->bank_name ?: 'Bank' }} - {{ $payroll->user->bank_account_number ?: '-' }} (a.n {{ $payroll->user->bank_account_holder ?: $payroll->user->name }})
                </td>
            </tr>
        </table>

        <!-- Salary Components Table -->
        <table class="salary-table">
            <thead>
                <tr>
                    <th style="width: 50%;">PENGHASILAN / PENERIMAAN (EARNINGS)</th>
                    <th style="width: 50%;">POTONGAN (DEDUCTIONS)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <table style="width: 100%;">
                            <tr>
                                <td>Gaji Pokok / Honorarium Dasar</td>
                                <td class="right mono">Rp {{ number_format($payroll->basic_salary, 0, ',', '.') }}</td>
                            </tr>
                            <tr>
                                <td>Tunjangan Tetap / Jabatan</td>
                                <td class="right mono">Rp {{ number_format($payroll->fixed_allowance, 0, ',', '.') }}</td>
                            </tr>
                            <tr>
                                <td>Tunjangan Transport & Makan</td>
                                <td class="right mono">Rp {{ number_format($payroll->transport_meal_allowance, 0, ',', '.') }}</td>
                            </tr>
                            <tr>
                                <td>Upah Lembur</td>
                                <td class="right mono">Rp {{ number_format($payroll->overtime_amount, 0, ',', '.') }}</td>
                            </tr>
                            <tr>
                                <td>Bonus / Insentif Perkara</td>
                                <td class="right mono">Rp {{ number_format($payroll->bonus_amount, 0, ',', '.') }}</td>
                            </tr>
                        </table>
                    </td>
                    <td>
                        <table style="width: 100%;">
                            <tr>
                                <td>Potongan PPh 21</td>
                                <td class="right mono">Rp {{ number_format($payroll->tax_deduction_amount, 0, ',', '.') }}</td>
                            </tr>
                            <tr>
                                <td>Potongan Kasbon / BPJS / Lainnya</td>
                                <td class="right mono">Rp {{ number_format($payroll->deductions_amount, 0, ',', '.') }}</td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr class="subtotal-row">
                    <td>
                        <table style="width: 100%;">
                            <tr>
                                <td><strong>TOTAL PENGHASILAN BRUTO</strong></td>
                                <td class="right mono"><strong>Rp {{ number_format($totalEarnings, 0, ',', '.') }}</strong></td>
                            </tr>
                        </table>
                    </td>
                    <td>
                        <table style="width: 100%;">
                            <tr>
                                <td><strong>TOTAL POTONGAN</strong></td>
                                <td class="right mono"><strong>Rp {{ number_format($totalDeductions, 0, ',', '.') }}</strong></td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Net Salary Box -->
        <table class="net-box">
            <tr>
                <td style="width: 60%;">
                    <div style="font-size: 7.5px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8;">GAJI BERSIH DITERIMA (TAKE HOME PAY)</div>
                    <div class="spelled-text">Terbilang: {{ $spelled }}</div>
                </td>
                <td style="width: 40%; text-align: right;">
                    <div style="font-size: 16px; font-weight: bold;" class="mono">Rp {{ number_format($payroll->net_salary, 0, ',', '.') }}</div>
                </td>
            </tr>
        </table>

        <!-- Signatures -->
        <table class="sig-table">
            <tr>
                <td>
                    Penerima / Karyawan,<br>
                    <div class="sig-space"></div>
                    <strong>{{ $payroll->user->name }}</strong>
                </td>
                <td>
                    Disetujui Oleh,<br>
                    <strong>Managing Partner RPK Law Firm</strong><br>
                    <div class="sig-space"></div>
                    <strong>Muhamad Fajar Roni, S.H.</strong>
                </td>
            </tr>
        </table>
    </div>
</div>
</body>
</html>
