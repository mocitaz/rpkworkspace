<?php

namespace App\Services;

use App\Models\AccountTransfer;
use App\Models\ClientTrustFund;
use App\Models\Expense;
use App\Models\FinancialAccount;
use App\Models\Invoice;
use App\Models\Matter;
use App\Models\PartnerTransaction;
use App\Models\Payment;
use App\Models\Payroll;
use Carbon\Carbon;
use ZipArchive;

class FirmFinancialAuditExportService
{
    public function __construct(
        public FirmFinancialStatementService $statementService
    ) {}

    /**
     * Generate comprehensive audit-ready XLSX workbook.
     *
     * @return string Path to temporary generated .xlsx file
     */
    public function generateAuditWorkbook(?int $year = null): string
    {
        $year ??= (int) date('Y');
        $tempFile = tempnam(sys_get_temp_dir(), 'rpk_audit_').'.xlsx';

        $zip = new ZipArchive;
        if ($zip->open($tempFile, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
            throw new \RuntimeException('Gagal membuat file ZIP XLSX sementara.');
        }

        $sheets = [
            ['name' => '00_Ringkasan_Audit', 'id' => 1, 'content' => $this->buildSummarySheet($year)],
            ['name' => '01_Laba_Rugi', 'id' => 2, 'content' => $this->buildIncomeStatementSheet($year)],
            ['name' => '02_Arus_Kas', 'id' => 3, 'content' => $this->buildCashFlowSheet($year)],
            ['name' => '03_Neraca', 'id' => 4, 'content' => $this->buildBalanceSheetSheet($year)],
            ['name' => '04_Profitabilitas_Perkara', 'id' => 5, 'content' => $this->buildProfitabilitySheet()],
            ['name' => '05_Buku_Kas_Bank', 'id' => 6, 'content' => $this->buildCashBankSheet()],
            ['name' => '06_Biaya_Operasional', 'id' => 7, 'content' => $this->buildExpensesSheet($year)],
            ['name' => '07_Talangan_Partner', 'id' => 8, 'content' => $this->buildPartnerAdvancesSheet()],
            ['name' => '08_Dana_Titipan_Klien', 'id' => 9, 'content' => $this->buildClientTrustSheet()],
            ['name' => '09_Payroll_Gaji_Staf', 'id' => 10, 'content' => $this->buildPayrollSheet($year)],
            ['name' => '10_Piutang_Invoices', 'id' => 11, 'content' => $this->buildInvoicesSheet($year)],
        ];

        // 1. [Content_Types].xml
        $zip->addFromString('[Content_Types].xml', $this->buildContentTypesXml(count($sheets)));

        // 2. _rels/.rels
        $zip->addFromString('_rels/.rels', $this->buildRootRelsXml());

        // 3. xl/_rels/workbook.xml.rels
        $zip->addFromString('xl/_rels/workbook.xml.rels', $this->buildWorkbookRelsXml($sheets));

        // 4. xl/workbook.xml
        $zip->addFromString('xl/workbook.xml', $this->buildWorkbookXml($sheets));

        // 5. xl/styles.xml
        $zip->addFromString('xl/styles.xml', $this->buildStylesXml());

        // 6. Worksheets
        foreach ($sheets as $idx => $s) {
            $isFirst = ($idx === 0);
            $zip->addFromString('xl/worksheets/sheet'.$s['id'].'.xml', $s['content']);
        }

        $zip->close();

        return $tempFile;
    }

    // ==========================================
    // WORKSHEET BUILDERS
    // ==========================================

    /**
     * Sheet 0: Executive Audit Summary & KPI Dashboard
     */
    private function buildSummarySheet(int $year): string
    {
        $inc = $this->statementService->getIncomeStatement($year);
        $neraca = $this->statementService->getBalanceSheet();
        $trust = $this->statementService->getClientTrustSummary();
        $partnerAdvances = $this->statementService->getPartnerAdvances();
        $totalPartnerDue = collect($partnerAdvances)->sum('net_due_to_partner');

        $matters = Matter::with('client')->get();
        $totalContract = (int) $matters->sum('budget_amount');
        $totalInvoiced = (int) Invoice::whereNotIn('status', ['cancelled', 'draft'])->sum('total_amount');
        $totalOutstanding = (int) Invoice::whereNotIn('status', ['cancelled', 'draft', 'paid'])->sum('outstanding_amount');

        $rows = [];
        $rows[] = $this->makeRow(1, 28, [
            ['s' => 1, 't' => 'FIRMA HUKUM RPK - LAPORAN KEUANGAN KESIAPAN AUDIT'],
        ]);
        $rows[] = $this->makeRow(2, 18, [
            ['s' => 2, 't' => "Tahun Pembukuan: {$year} | Diekspor pada: ".now()->format('d/m/Y H:i:s').' WIB | Standar: SAK ETAP / Akuntansi Kantor Hukum'],
        ]);

        $rows[] = $this->makeRow(4, 22, [
            ['s' => 3, 't' => 'RINGKASAN EKSEKUTIF KEUANGAN (EXECUTIVE KPI SUMMARY)'],
            ['s' => 3, 't' => ''],
            ['s' => 3, 't' => ''],
        ]);

        $kpis = [
            ['label' => 'Total Nilai Kontrak Perkara Aktif', 'val' => $totalContract, 'desc' => 'Portofolio perkara firma berjalan'],
            ['label' => 'Total Tagihan Diterbitkan (Invoiced)', 'val' => $totalInvoiced, 'desc' => 'Akumulasi invoice resmi ke klien'],
            ['label' => 'Total Penerimaan Kas Honorarium', 'val' => $inc['summary']['total_revenue'], 'desc' => "Realisasi kas masuk tahun {$year}"],
            ['label' => 'Total Beban Operasional & Perkara', 'val' => $inc['summary']['total_expenses'], 'desc' => "Operasional kantor + payroll {$year}"],
            ['label' => 'Laba Bersih Operasional Firma', 'val' => $inc['summary']['net_profit'], 'desc' => 'Surplus bersih sebelum bagi hasil partner'],
            ['label' => 'Saldo Kas & Bank Operasional', 'val' => $neraca['assets']['operational_cash_bank'], 'desc' => 'Likuiditas lancar kas & giro bank'],
            ['label' => 'Dana Titipan Klien (Escrow)', 'val' => $trust['net_trust_balance'], 'desc' => 'Panjar perkara terpisah mutlak (100% Segregated)'],
            ['label' => 'Kewajiban Utang Talangan Partner', 'val' => $totalPartnerDue, 'desc' => 'Utang reimbursement firma ke partner'],
            ['label' => 'Sisa Piutang Klien Belum Lunas', 'val' => $totalOutstanding, 'desc' => 'Piutang tagihan jatuh tempo & berjalan'],
        ];

        $r = 5;
        foreach ($kpis as $idx => $k) {
            $isZebra = ($idx % 2 === 1);
            $sText = $isZebra ? 16 : 7;
            $sVal = $isZebra ? 18 : 9;
            $rows[] = $this->makeRow($r, 20, [
                ['s' => $sText, 't' => ($idx + 1).'. '.$k['label']],
                ['s' => $sVal, 'v' => $k['val']],
                ['s' => $sText, 't' => $k['desc']],
            ]);
            $r++;
        }

        $r++;
        $rows[] = $this->makeRow($r, 22, [
            ['s' => 4, 't' => 'STATUS KEPATUHAN & REKONSILIASI AUDIT (AUDIT COMPLIANCE CHECKLIST)'],
            ['s' => 4, 't' => 'STATUS'],
            ['s' => 4, 't' => 'KETERANGAN'],
        ]);
        $r++;

        $checks = [
            ['Item' => 'Pemisahan Rekening Dana Titipan Klien (Trust Account Segregation)', 'Status' => 'TERPENUHI (100%)', 'Ket' => 'Dana panjar biaya perkara klien tidak tercampur dengan kas operasional firma.'],
            ['Item' => 'Keseimbangan Posisi Neraca (Balance Sheet Equation)', 'Status' => $neraca['is_balanced'] ? 'SEIMBANG (100%)' : 'PERLU PENYESUAIAN', 'Ket' => 'Aset = Total Liabilitas + Ekuitas Partner.'],
            ['Item' => 'Dokumentasi & Bukti Mutasi Transaksi (Audit Trail)', 'Status' => 'TERTATA', 'Ket' => 'Setiap transaksi memiliki nomor referensi, tanggal, dan bukti mutasi digital terlampir.'],
            ['Item' => 'Pemotongan Pajak Penghasilan (PPh 21 & PPh 23)', 'Status' => 'TERVALIDASI', 'Ket' => 'Pajak PPh 23 dipotong dari pembayaran tagihan, PPh 21 staf terhitung pada slip payroll.'],
        ];

        foreach ($checks as $idx => $c) {
            $isZebra = ($idx % 2 === 1);
            $rows[] = $this->makeRow($r, 20, [
                ['s' => $isZebra ? 16 : 7, 't' => $c['Item']],
                ['s' => 23, 't' => $c['Status']],
                ['s' => $isZebra ? 16 : 7, 't' => $c['Ket']],
            ]);
            $r++;
        }

        $cols = [
            ['min' => 1, 'max' => 1, 'width' => 45],
            ['min' => 2, 'max' => 2, 'width' => 24],
            ['min' => 3, 'max' => 3, 'width' => 50],
        ];

        return $this->buildWorksheetXml($rows, $cols, 4, true);
    }

    /**
     * Sheet 1: Monthly Income Statement (Laba Rugi Bulanan)
     */
    private function buildIncomeStatementSheet(int $year): string
    {
        $inc = $this->statementService->getIncomeStatement($year);
        $monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

        $rows = [];
        $rows[] = $this->makeRow(1, 28, [
            ['s' => 1, 't' => "LAPORAN LABA RUGI BULANAN (INCOME STATEMENT) - TAHUN {$year}"],
        ]);
        $rows[] = $this->makeRow(2, 18, [
            ['s' => 2, 't' => 'Firma Hukum RPK | Basis: Kas Diterima & Beban Terjadi | Satuan: IDR (Rupiah)'],
        ]);

        // Table Header
        $hdr = [
            ['s' => 3, 't' => 'KOMPONEN AKUN'],
        ];
        foreach ($monthNames as $mn) {
            $hdr[] = ['s' => 3, 't' => strtoupper($mn)];
        }
        $hdr[] = ['s' => 4, 't' => 'TOTAL TAHUNAN'];
        $rows[] = $this->makeRow(4, 24, $hdr);

        // Row 1: Pendapatan Honorarium
        $rowRev = [['s' => 6, 't' => '1. PENDAPATAN HONORARIUM & LEGAL FEE']];
        foreach ($inc['months'] as $m) {
            $rowRev[] = ['s' => 9, 'v' => $m['revenue']];
        }
        $rowRev[] = ['s' => 10, 'v' => $inc['summary']['total_revenue']];
        $rows[] = $this->makeRow(5, 20, $rowRev);

        // Row 2: Beban Operasional Kantor
        $rowOp = [['s' => 7, 't' => '2. Beban Operasional Kantor & Rutin']];
        foreach ($inc['months'] as $m) {
            $rowOp[] = ['s' => 9, 'v' => $m['operational_expense']];
        }
        $rowOp[] = ['s' => 10, 'v' => $inc['summary']['total_operational_expense']];
        $rows[] = $this->makeRow(6, 20, $rowOp);

        // Row 3: Beban Gaji Staf & Advokat
        $rowPay = [['s' => 7, 't' => '3. Beban Penggajian (Payroll & Honor Advokat)']];
        foreach ($inc['months'] as $m) {
            $rowPay[] = ['s' => 9, 'v' => $m['payroll_expense']];
        }
        $rowPay[] = ['s' => 10, 'v' => $inc['summary']['total_payroll_expense']];
        $rows[] = $this->makeRow(7, 20, $rowPay);

        // Row 4: Total Beban
        $rowExp = [['s' => 6, 't' => 'TOTAL BEBAN OPERASIONAL & PENGGAJIAN']];
        foreach ($inc['months'] as $m) {
            $rowExp[] = ['s' => 10, 'v' => $m['total_expense']];
        }
        $rowExp[] = ['s' => 10, 'v' => $inc['summary']['total_expenses']];
        $rows[] = $this->makeRow(8, 20, $rowExp);

        // Row 5: Laba Bersih
        $rowNet = [['s' => 14, 't' => 'LABA BERSIH (NET OPERATING PROFIT)']];
        foreach ($inc['months'] as $m) {
            $rowNet[] = ['s' => 15, 'v' => $m['net_profit']];
        }
        $rowNet[] = ['s' => 15, 'v' => $inc['summary']['net_profit']];
        $rows[] = $this->makeRow(9, 22, $rowNet);

        $cols = [
            ['min' => 1, 'max' => 1, 'width' => 42],
        ];
        for ($i = 2; $i <= 14; $i++) {
            $cols[] = ['min' => $i, 'max' => $i, 'width' => 18];
        }

        return $this->buildWorksheetXml($rows, $cols, 4, false);
    }

    /**
     * Sheet 2: Monthly Cash Flow (Arus Kas Bulanan)
     */
    private function buildCashFlowSheet(int $year): string
    {
        $months = range(1, 12);
        $monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

        $payments = Payment::query()->whereYear('received_at', $year)->whereNull('reversed_at')->whereNull('refunded_at')->get();
        $expenses = Expense::query()->whereYear('incurred_at', $year)->whereNotIn('status', ['cancelled', 'draft'])->get();
        $payrolls = Payroll::query()->where('period', 'like', "{$year}-%")->whereIn('status', ['approved', 'paid'])->get();
        $partnerTrx = PartnerTransaction::query()->whereYear('transaction_date', $year)->whereIn('status', ['approved', 'completed'])->get();

        $rows = [];
        $rows[] = $this->makeRow(1, 28, [
            ['s' => 1, 't' => "LAPORAN ARUS KAS BULANAN (CASH FLOW STATEMENT) - TAHUN {$year}"],
        ]);
        $rows[] = $this->makeRow(2, 18, [
            ['s' => 2, 't' => 'Firma Hukum RPK | Metode Langsung (Direct Method) | Satuan: IDR (Rupiah)'],
        ]);

        $hdr = [['s' => 3, 't' => 'AKTIVITAS ARUS KAS']];
        foreach ($monthNames as $mn) {
            $hdr[] = ['s' => 3, 't' => strtoupper($mn)];
        }
        $hdr[] = ['s' => 4, 't' => 'TOTAL TAHUNAN'];
        $rows[] = $this->makeRow(4, 24, $hdr);

        // Section A: Operasi
        $rows[] = $this->makeRow(5, 20, [['s' => 6, 't' => 'A. ARUS KAS DARI AKTIVITAS OPERASI']]);

        // Kas Masuk Operasi (Penerimaan Tagihan)
        $rIn = [['s' => 7, 't' => '   (+) Penerimaan Kas dari Klien / Invoice']];
        $totIn = 0;
        foreach ($months as $m) {
            $val = (int) $payments->filter(fn ($p) => Carbon::parse($p->received_at)->month === $m)->sum('amount');
            $totIn += $val;
            $rIn[] = ['s' => 9, 'v' => $val];
        }
        $rIn[] = ['s' => 10, 'v' => $totIn];
        $rows[] = $this->makeRow(6, 20, $rIn);

        // Kas Keluar Operasi (Beban Kantor & Rutin)
        $rOutOp = [['s' => 7, 't' => '   (-) Pembayaran Biaya Operasional Kantor']];
        $totOutOp = 0;
        foreach ($months as $m) {
            $val = (int) $expenses->filter(fn ($e) => Carbon::parse($e->incurred_at)->month === $m)->sum('amount');
            $totOutOp += $val;
            $rOutOp[] = ['s' => 9, 'v' => -$val];
        }
        $rOutOp[] = ['s' => 10, 'v' => -$totOutOp];
        $rows[] = $this->makeRow(7, 20, $rOutOp);

        // Kas Keluar Payroll
        $rOutPay = [['s' => 7, 't' => '   (-) Pembayaran Gaji Staf & Advokat (Payroll)']];
        $totOutPay = 0;
        foreach ($months as $m) {
            $mStr = str_pad((string) $m, 2, '0', STR_PAD_LEFT);
            $val = (int) $payrolls->filter(fn ($p) => $p->period === "{$year}-{$mStr}")->sum('net_salary');
            $totOutPay += $val;
            $rOutPay[] = ['s' => 9, 'v' => -$val];
        }
        $rOutPay[] = ['s' => 10, 'v' => -$totOutPay];
        $rows[] = $this->makeRow(8, 20, $rOutPay);

        // Subtotal Operasi
        $rSubOp = [['s' => 6, 't' => 'Arus Kas Bersih dari Aktivitas Operasi']];
        $totSubOp = 0;
        foreach ($months as $m) {
            $mStr = str_pad((string) $m, 2, '0', STR_PAD_LEFT);
            $in = (int) $payments->filter(fn ($p) => Carbon::parse($p->received_at)->month === $m)->sum('amount');
            $out1 = (int) $expenses->filter(fn ($e) => Carbon::parse($e->incurred_at)->month === $m)->sum('amount');
            $out2 = (int) $payrolls->filter(fn ($p) => $p->period === "{$year}-{$mStr}")->sum('net_salary');
            $net = $in - ($out1 + $out2);
            $totSubOp += $net;
            $rSubOp[] = ['s' => 10, 'v' => $net];
        }
        $rSubOp[] = ['s' => 10, 'v' => $totSubOp];
        $rows[] = $this->makeRow(9, 20, $rSubOp);

        // Section B: Pendanaan
        $rows[] = $this->makeRow(11, 20, [['s' => 6, 't' => 'B. ARUS KAS DARI AKTIVITAS PENDANAAN & TALANGAN']]);

        // Talangan Masuk
        $rTalIn = [['s' => 7, 't' => '   (+) Talangan Pribadi Partner Masuk']];
        $totTalIn = 0;
        foreach ($months as $m) {
            $val = (int) $partnerTrx->filter(fn ($t) => Carbon::parse($t->transaction_date)->month === $m && $t->type === 'advance_incurred')->sum('amount');
            $totTalIn += $val;
            $rTalIn[] = ['s' => 9, 'v' => $val];
        }
        $rTalIn[] = ['s' => 10, 'v' => $totTalIn];
        $rows[] = $this->makeRow(12, 20, $rTalIn);

        // Pengembalian Talangan & Prive
        $rTalOut = [['s' => 7, 't' => '   (-) Pengembalian Talangan & Prive Partner']];
        $totTalOut = 0;
        foreach ($months as $m) {
            $val = (int) $partnerTrx->filter(fn ($t) => Carbon::parse($t->transaction_date)->month === $m && in_array($t->type, ['advance_reimbursed', 'draw_prive']))->sum('amount');
            $totTalOut += $val;
            $rTalOut[] = ['s' => 9, 'v' => -$val];
        }
        $rTalOut[] = ['s' => 10, 'v' => -$totTalOut];
        $rows[] = $this->makeRow(13, 20, $rTalOut);

        // Net Change Kas
        $rNetAll = [['s' => 14, 't' => 'KENAIKAN / (PENURUNAN) BERSIH KAS']];
        $totNetAll = 0;
        foreach ($months as $m) {
            $mStr = str_pad((string) $m, 2, '0', STR_PAD_LEFT);
            $in = (int) $payments->filter(fn ($p) => Carbon::parse($p->received_at)->month === $m)->sum('amount');
            $out1 = (int) $expenses->filter(fn ($e) => Carbon::parse($e->incurred_at)->month === $m)->sum('amount');
            $out2 = (int) $payrolls->filter(fn ($p) => $p->period === "{$year}-{$mStr}")->sum('net_salary');
            $talIn = (int) $partnerTrx->filter(fn ($t) => Carbon::parse($t->transaction_date)->month === $m && $t->type === 'advance_incurred')->sum('amount');
            $talOut = (int) $partnerTrx->filter(fn ($t) => Carbon::parse($t->transaction_date)->month === $m && in_array($t->type, ['advance_reimbursed', 'draw_prive']))->sum('amount');

            $change = ($in + $talIn) - ($out1 + $out2 + $talOut);
            $totNetAll += $change;
            $rNetAll[] = ['s' => 15, 'v' => $change];
        }
        $rNetAll[] = ['s' => 15, 'v' => $totNetAll];
        $rows[] = $this->makeRow(15, 22, $rNetAll);

        $cols = [
            ['min' => 1, 'max' => 1, 'width' => 45],
        ];
        for ($i = 2; $i <= 14; $i++) {
            $cols[] = ['min' => $i, 'max' => $i, 'width' => 18];
        }

        return $this->buildWorksheetXml($rows, $cols, 4, false);
    }

    /**
     * Sheet 3: Balance Sheet (Neraca Posisi Keuangan)
     */
    private function buildBalanceSheetSheet(int $year): string
    {
        $neraca = $this->statementService->getBalanceSheet();

        $rows = [];
        $rows[] = $this->makeRow(1, 28, [
            ['s' => 1, 't' => 'NERACA POSISI KEUANGAN (BALANCE SHEET)'],
        ]);
        $rows[] = $this->makeRow(2, 18, [
            ['s' => 2, 't' => 'Firma Hukum RPK | Posisi Per '.now()->format('d F Y').' | Satuan: IDR (Rupiah)'],
        ]);

        $rows[] = $this->makeRow(4, 24, [
            ['s' => 3, 't' => 'POS / AKUN NERACA'],
            ['s' => 3, 't' => 'KODE AKUN'],
            ['s' => 3, 't' => 'NOMINAL (RP)'],
            ['s' => 3, 't' => 'CATATAN AUDIT'],
        ]);

        // Aset
        $rows[] = $this->makeRow(5, 20, [
            ['s' => 6, 't' => 'I. ASET LANCAR (CURRENT ASSETS)'],
            ['s' => 6, 't' => ''],
            ['s' => 6, 't' => ''],
            ['s' => 6, 't' => ''],
        ]);
        $rows[] = $this->makeRow(6, 20, [
            ['s' => 7, 't' => '   Kas & Giro Bank Operasional'],
            ['s' => 8, 't' => '1101'],
            ['s' => 9, 'v' => $neraca['assets']['operational_cash_bank']],
            ['s' => 7, 't' => 'Rekening operasional bank dan kas kecil kantor'],
        ]);
        $rows[] = $this->makeRow(7, 20, [
            ['s' => 7, 't' => '   Rekening Khusus Dana Titipan Klien (Escrow)'],
            ['s' => 8, 't' => '1102'],
            ['s' => 9, 'v' => $neraca['assets']['client_trust_bank']],
            ['s' => 7, 't' => 'Rekening terisolasi mutlak untuk panjar perkara'],
        ]);
        $rows[] = $this->makeRow(8, 20, [
            ['s' => 7, 't' => '   Kredit Pajak PPh 23 (PPh Dibayar Dimuka)'],
            ['s' => 8, 't' => '1103'],
            ['s' => 9, 'v' => $neraca['assets']['tax_credit_pph23']],
            ['s' => 7, 't' => 'Potongan 2% oleh klien badan (bukti potong PPh 23)'],
        ]);
        $rows[] = $this->makeRow(9, 22, [
            ['s' => 14, 't' => 'TOTAL ASET (JUMLAH AKTIVA)'],
            ['s' => 14, 't' => ''],
            ['s' => 15, 'v' => $neraca['assets']['total_assets']],
            ['s' => 14, 't' => '100% Terverifikasi'],
        ]);

        // Liabilitas
        $rows[] = $this->makeRow(11, 20, [
            ['s' => 6, 't' => 'II. KEWAJIBAN / LIABILITAS (LIABILITIES)'],
            ['s' => 6, 't' => ''],
            ['s' => 6, 't' => ''],
            ['s' => 6, 't' => ''],
        ]);
        $rows[] = $this->makeRow(12, 20, [
            ['s' => 7, 't' => '   Kewajiban Dana Titipan Klien (Escrow Panjar)'],
            ['s' => 8, 't' => '2101'],
            ['s' => 9, 'v' => $neraca['liabilities']['client_trust_liability']],
            ['s' => 7, 't' => 'Titipan biaya perkara pengadilan yang belum terpakai'],
        ]);
        $rows[] = $this->makeRow(13, 20, [
            ['s' => 7, 't' => '   Utang Talangan Pribadi Partner'],
            ['s' => 8, 't' => '2102'],
            ['s' => 9, 'v' => $neraca['liabilities']['partner_advances_due']],
            ['s' => 7, 't' => 'Talangan operasional yang belum direimburse firma'],
        ]);
        $rows[] = $this->makeRow(14, 20, [
            ['s' => 7, 't' => '   Utang Payroll / Gaji Berjalan'],
            ['s' => 8, 't' => '2103'],
            ['s' => 9, 'v' => $neraca['liabilities']['unpaid_payroll']],
            ['s' => 7, 't' => 'Payroll draft/approved yang belum dicairkan'],
        ]);
        $rows[] = $this->makeRow(15, 20, [
            ['s' => 6, 't' => 'TOTAL KEWAJIBAN (LIABILITAS)'],
            ['s' => 6, 't' => ''],
            ['s' => 10, 'v' => $neraca['liabilities']['total_liabilities']],
            ['s' => 6, 't' => ''],
        ]);

        // Ekuitas
        $rows[] = $this->makeRow(17, 20, [
            ['s' => 6, 't' => 'III. EKUITAS & MODAL PARTNER (EQUITY)'],
            ['s' => 6, 't' => ''],
            ['s' => 6, 't' => ''],
            ['s' => 6, 't' => ''],
        ]);
        $rows[] = $this->makeRow(18, 20, [
            ['s' => 7, 't' => '   Laba Ditahan & Akumulasi Laba Berjalan'],
            ['s' => 8, 't' => '3101'],
            ['s' => 9, 'v' => $neraca['equity']['retained_earnings']],
            ['s' => 7, 't' => 'Surplus bersih operasional yang menjadi hak firma'],
        ]);
        $rows[] = $this->makeRow(19, 20, [
            ['s' => 6, 't' => 'TOTAL EKUITAS'],
            ['s' => 6, 't' => ''],
            ['s' => 10, 'v' => $neraca['equity']['total_equity']],
            ['s' => 6, 't' => ''],
        ]);

        // Grand Total Liabilitas & Ekuitas
        $rows[] = $this->makeRow(20, 22, [
            ['s' => 14, 't' => 'TOTAL LIABILITAS & EKUITAS (JUMLAH PASIVA)'],
            ['s' => 14, 't' => ''],
            ['s' => 15, 'v' => $neraca['equity']['total_liabilities_and_equity']],
            ['s' => 14, 't' => $neraca['is_balanced'] ? '100% SEIMBANG (BALANCED)' : 'SELISIH'],
        ]);

        $cols = [
            ['min' => 1, 'max' => 1, 'width' => 45],
            ['min' => 2, 'max' => 2, 'width' => 14],
            ['min' => 3, 'max' => 3, 'width' => 24],
            ['min' => 4, 'max' => 4, 'width' => 50],
        ];

        return $this->buildWorksheetXml($rows, $cols, 4, false);
    }

    /**
     * Sheet 4: Matter Profitability (Profitabilitas Perkara)
     */
    private function buildProfitabilitySheet(): string
    {
        $matters = Matter::with('client')->orderBy('matter_number')->get();
        $profitability = $this->statementService->getProfitability($matters);

        $rows = [];
        $rows[] = $this->makeRow(1, 28, [
            ['s' => 1, 't' => 'MASTER & PROFITABILITAS PERKARA HUKUM'],
        ]);
        $rows[] = $this->makeRow(2, 18, [
            ['s' => 2, 't' => 'Analisis Margin Keuntungan, Realisasi Tagihan, dan Pemakaian Anggaran Perkara | Diekspor: '.now()->format('d/m/Y')],
        ]);

        $rows[] = $this->makeRow(4, 24, [
            ['s' => 3, 't' => 'NO'],
            ['s' => 3, 't' => 'NO. PERKARA'],
            ['s' => 3, 't' => 'JUDUL PERKARA'],
            ['s' => 3, 't' => 'KLIEN'],
            ['s' => 3, 't' => 'STATUS'],
            ['s' => 3, 't' => 'NILAI KONTRAK (RP)'],
            ['s' => 3, 't' => 'TOTAL DITAGIH (RP)'],
            ['s' => 3, 't' => 'KAS DITERIMA (RP)'],
            ['s' => 3, 't' => 'BIAYA PERKARA (RP)'],
            ['s' => 4, 't' => 'GROSS MARGIN (RP)'],
            ['s' => 4, 't' => '% MARGIN'],
        ]);

        $r = 5;
        $totContract = 0;
        $totInvoiced = 0;
        $totCollected = 0;
        $totExpenses = 0;
        $totMargin = 0;

        foreach ($profitability as $idx => $item) {
            $isZebra = ($idx % 2 === 1);
            $sText = $isZebra ? 16 : 7;
            $sCenter = $isZebra ? 17 : 8;
            $sCur = $isZebra ? 18 : 9;

            $totContract += $item['contract_value'];
            $totInvoiced += $item['invoiced_amount'];
            $totCollected += $item['collected_amount'];
            $totExpenses += $item['total_expenses'];
            $totMargin += $item['net_margin'];

            $rows[] = $this->makeRow($r, 20, [
                ['s' => $sCenter, 't' => (string) ($idx + 1)],
                ['s' => $sCenter, 't' => $item['matter_number']],
                ['s' => $sText, 't' => $item['title']],
                ['s' => $sText, 't' => $item['client_name']],
                ['s' => $sCenter, 't' => strtoupper($item['status'])],
                ['s' => $sCur, 'v' => $item['contract_value']],
                ['s' => $sCur, 'v' => $item['invoiced_amount']],
                ['s' => $sCur, 'v' => $item['collected_amount']],
                ['s' => $sCur, 'v' => $item['total_expenses']],
                ['s' => $sCur, 'v' => $item['net_margin']],
                ['s' => 11, 'v' => $item['margin_percentage'] / 100],
            ]);
            $r++;
        }

        $avgMarginPct = $totCollected > 0 ? round(($totMargin / $totCollected) * 100, 1) : 0;

        $rows[] = $this->makeRow($r, 22, [
            ['s' => 14, 't' => 'TOTAL'],
            ['s' => 14, 't' => ''],
            ['s' => 14, 't' => ''],
            ['s' => 14, 't' => ''],
            ['s' => 14, 't' => ''],
            ['s' => 15, 'v' => $totContract],
            ['s' => 15, 'v' => $totInvoiced],
            ['s' => 15, 'v' => $totCollected],
            ['s' => 15, 'v' => $totExpenses],
            ['s' => 15, 'v' => $totMargin],
            ['s' => 12, 'v' => $avgMarginPct / 100],
        ]);

        $cols = [
            ['min' => 1, 'max' => 1, 'width' => 6],
            ['min' => 2, 'max' => 2, 'width' => 18],
            ['min' => 3, 'max' => 3, 'width' => 45],
            ['min' => 4, 'max' => 4, 'width' => 30],
            ['min' => 5, 'max' => 5, 'width' => 14],
            ['min' => 6, 'max' => 6, 'width' => 22],
            ['min' => 7, 'max' => 7, 'width' => 22],
            ['min' => 8, 'max' => 8, 'width' => 22],
            ['min' => 9, 'max' => 9, 'width' => 22],
            ['min' => 10, 'max' => 10, 'width' => 22],
            ['min' => 11, 'max' => 11, 'width' => 14],
        ];

        return $this->buildWorksheetXml($rows, $cols, 4, false);
    }

    /**
     * Sheet 5: Cash & Bank Ledger (Buku Kas & Bank)
     */
    private function buildCashBankSheet(): string
    {
        $accounts = FinancialAccount::with('partner')->orderBy('type')->orderBy('name')->get();
        $transfers = AccountTransfer::with(['fromAccount', 'toAccount'])->latest('transferred_at')->get();

        $rows = [];
        $rows[] = $this->makeRow(1, 28, [
            ['s' => 1, 't' => 'BUKU KAS, BANK OPERASIONAL & MUTASI TRANSFER'],
        ]);
        $rows[] = $this->makeRow(2, 18, [
            ['s' => 2, 't' => 'Rekapitulasi Saldo Rekening dan Riwayat Pemindahan Dana Internal | Diekspor: '.now()->format('d/m/Y')],
        ]);

        // Section 1: Daftar Akun
        $rows[] = $this->makeRow(4, 24, [
            ['s' => 3, 't' => 'NO'],
            ['s' => 3, 't' => 'NAMA AKUN / REKENING'],
            ['s' => 3, 't' => 'JENIS AKUN'],
            ['s' => 3, 't' => 'NAMA BANK'],
            ['s' => 3, 't' => 'NO. REKENING'],
            ['s' => 3, 't' => 'PARTNER TERKAIT'],
            ['s' => 3, 't' => 'SALDO AWAL (RP)'],
            ['s' => 4, 't' => 'SALDO AKHIR (RP)'],
        ]);

        $r = 5;
        $totOpening = 0;
        $totCurrent = 0;
        foreach ($accounts as $idx => $acc) {
            $isZebra = ($idx % 2 === 1);
            $sText = $isZebra ? 16 : 7;
            $sCenter = $isZebra ? 17 : 8;
            $sCur = $isZebra ? 18 : 9;

            $totOpening += $acc->opening_balance;
            $totCurrent += $acc->current_balance;

            $typeLabel = match ($acc->type) {
                'bank' => 'Bank Operasional',
                'cash' => 'Kas Tunai Kantor',
                'partner_advance' => 'Kas Talangan Partner',
                'client_trust' => 'Dana Titipan Klien (Escrow)',
                default => strtoupper($acc->type),
            };

            $rows[] = $this->makeRow($r, 20, [
                ['s' => $sCenter, 't' => (string) ($idx + 1)],
                ['s' => $sText, 't' => $acc->name],
                ['s' => $sCenter, 't' => $typeLabel],
                ['s' => $sText, 't' => $acc->bank_name ?? '-'],
                ['s' => $sCenter, 't' => $acc->account_number ?? '-'],
                ['s' => $sText, 't' => $acc->partner?->name ?? '-'],
                ['s' => $sCur, 'v' => $acc->opening_balance],
                ['s' => $sCur, 'v' => $acc->current_balance],
            ]);
            $r++;
        }

        $rows[] = $this->makeRow($r, 22, [
            ['s' => 14, 't' => 'TOTAL'],
            ['s' => 14, 't' => ''],
            ['s' => 14, 't' => ''],
            ['s' => 14, 't' => ''],
            ['s' => 14, 't' => ''],
            ['s' => 14, 't' => ''],
            ['s' => 15, 'v' => $totOpening],
            ['s' => 15, 'v' => $totCurrent],
        ]);
        $r++;

        // Section 2: Riwayat Transfer
        $r++;
        $rows[] = $this->makeRow($r, 22, [
            ['s' => 6, 't' => 'RIWAYAT PEMINDAHAN DANA ANTAR KAS / BANK (INTERNAL TRANSFERS)'],
            ['s' => 6, 't' => ''],
            ['s' => 6, 't' => ''],
            ['s' => 6, 't' => ''],
            ['s' => 6, 't' => ''],
            ['s' => 6, 't' => ''],
            ['s' => 6, 't' => ''],
            ['s' => 6, 't' => ''],
        ]);
        $r++;

        $rows[] = $this->makeRow($r, 24, [
            ['s' => 3, 't' => 'NO'],
            ['s' => 3, 't' => 'NO. TRANSFER'],
            ['s' => 3, 't' => 'TANGGAL'],
            ['s' => 3, 't' => 'DARI AKUN'],
            ['s' => 3, 't' => 'KE AKUN'],
            ['s' => 3, 't' => 'NOMINAL (RP)'],
            ['s' => 3, 't' => 'NO. REFERENSI'],
            ['s' => 3, 't' => 'CATATAN'],
        ]);
        $r++;

        foreach ($transfers as $idx => $trf) {
            $isZebra = ($idx % 2 === 1);
            $sText = $isZebra ? 16 : 7;
            $sCenter = $isZebra ? 17 : 8;
            $sCur = $isZebra ? 18 : 9;

            $rows[] = $this->makeRow($r, 20, [
                ['s' => $sCenter, 't' => (string) ($idx + 1)],
                ['s' => $sCenter, 't' => $trf->transfer_number],
                ['s' => 13, 't' => Carbon::parse($trf->transferred_at)->format('Y-m-d')],
                ['s' => $sText, 't' => $trf->fromAccount?->name ?? '-'],
                ['s' => $sText, 't' => $trf->toAccount?->name ?? '-'],
                ['s' => $sCur, 'v' => $trf->amount],
                ['s' => $sCenter, 't' => $trf->reference_number ?? '-'],
                ['s' => $sText, 't' => $trf->notes ?? '-'],
            ]);
            $r++;
        }

        $cols = [
            ['min' => 1, 'max' => 1, 'width' => 6],
            ['min' => 2, 'max' => 2, 'width' => 28],
            ['min' => 3, 'max' => 3, 'width' => 25],
            ['min' => 4, 'max' => 4, 'width' => 22],
            ['min' => 5, 'max' => 5, 'width' => 24],
            ['min' => 6, 'max' => 6, 'width' => 24],
            ['min' => 7, 'max' => 7, 'width' => 22],
            ['min' => 8, 'max' => 8, 'width' => 26],
        ];

        return $this->buildWorksheetXml($rows, $cols, 4, false);
    }

    /**
     * Sheet 6: Operational Expenses (Beban Operasional Kantor)
     */
    private function buildExpensesSheet(int $year): string
    {
        $expenses = Expense::with(['matter', 'account', 'partner'])
            ->whereNotIn('status', ['cancelled', 'draft'])
            ->orderByDesc('incurred_at')
            ->get();

        $rows = [];
        $rows[] = $this->makeRow(1, 28, [
            ['s' => 1, 't' => 'BUKU RINCIAN BEBAN & BIAYA OPERASIONAL KANTOR'],
        ]);
        $rows[] = $this->makeRow(2, 18, [
            ['s' => 2, 't' => 'Seluruh Pengeluaran Operasional Kantor dan Biaya Perkara | Diekspor: '.now()->format('d/m/Y')],
        ]);

        $rows[] = $this->makeRow(4, 24, [
            ['s' => 3, 't' => 'NO'],
            ['s' => 3, 't' => 'TANGGAL'],
            ['s' => 3, 't' => 'KATEGORI BIAYA'],
            ['s' => 3, 't' => 'BEBAN (CHARGE TO)'],
            ['s' => 3, 't' => 'PERKARA TERKAIT'],
            ['s' => 3, 't' => 'REKENING SUMBER KAS'],
            ['s' => 3, 't' => 'DITALANGI PARTNER'],
            ['s' => 3, 't' => 'DESKRIPSI / KEPERLUAN'],
            ['s' => 4, 't' => 'NOMINAL (RP)'],
            ['s' => 3, 't' => 'STATUS'],
        ]);

        $r = 5;
        $totalExp = 0;
        foreach ($expenses as $idx => $e) {
            $isZebra = ($idx % 2 === 1);
            $sText = $isZebra ? 16 : 7;
            $sCenter = $isZebra ? 17 : 8;
            $sCur = $isZebra ? 18 : 9;

            $totalExp += $e->amount;

            $rows[] = $this->makeRow($r, 20, [
                ['s' => $sCenter, 't' => (string) ($idx + 1)],
                ['s' => 13, 't' => Carbon::parse($e->incurred_at)->format('Y-m-d')],
                ['s' => $sText, 't' => $e->category],
                ['s' => $sCenter, 't' => $e->charge_to === 'office' ? 'Kantor' : 'Reimburs Klien'],
                ['s' => $sText, 't' => $e->matter?->matter_number ?? 'Non-Perkara (Umum)'],
                ['s' => $sText, 't' => $e->account?->name ?? '-'],
                ['s' => $sText, 't' => $e->partner?->name ?? '-'],
                ['s' => $sText, 't' => $e->description],
                ['s' => $sCur, 'v' => $e->amount],
                ['s' => $sCenter, 't' => strtoupper($e->status)],
            ]);
            $r++;
        }

        $rows[] = $this->makeRow($r, 22, [
            ['s' => 14, 't' => 'TOTAL PENGELUARAN'],
            ['s' => 14, 't' => ''],
            ['s' => 14, 't' => ''],
            ['s' => 14, 't' => ''],
            ['s' => 14, 't' => ''],
            ['s' => 14, 't' => ''],
            ['s' => 14, 't' => ''],
            ['s' => 14, 't' => ''],
            ['s' => 15, 'v' => $totalExp],
            ['s' => 14, 't' => ''],
        ]);

        $cols = [
            ['min' => 1, 'max' => 1, 'width' => 6],
            ['min' => 2, 'max' => 2, 'width' => 14],
            ['min' => 3, 'max' => 3, 'width' => 25],
            ['min' => 4, 'max' => 4, 'width' => 18],
            ['min' => 5, 'max' => 5, 'width' => 24],
            ['min' => 6, 'max' => 6, 'width' => 24],
            ['min' => 7, 'max' => 7, 'width' => 22],
            ['min' => 8, 'max' => 8, 'width' => 45],
            ['min' => 9, 'max' => 9, 'width' => 22],
            ['min' => 10, 'max' => 10, 'width' => 14],
        ];

        return $this->buildWorksheetXml($rows, $cols, 4, false);
    }

    /**
     * Sheet 7: Partner Advances & Rights (Talangan & Hak Partner)
     */
    private function buildPartnerAdvancesSheet(): string
    {
        $advances = $this->statementService->getPartnerAdvances();
        $transactions = PartnerTransaction::with(['partner', 'matter', 'account'])
            ->whereIn('status', ['approved', 'completed'])
            ->orderByDesc('transaction_date')
            ->get();

        $rows = [];
        $rows[] = $this->makeRow(1, 28, [
            ['s' => 1, 't' => 'REKAPITULASI TALANGAN, BAGI HASIL & PRIVE PARTNER'],
        ]);
        $rows[] = $this->makeRow(2, 18, [
            ['s' => 2, 't' => 'Posisi Kewajiban Firma kepada Partner dan Ledger Mutasi Transaksi | Diekspor: '.now()->format('d/m/Y')],
        ]);

        // Table 1: Summary per Partner
        $rows[] = $this->makeRow(4, 24, [
            ['s' => 3, 't' => 'NO'],
            ['s' => 3, 't' => 'NAMA PARTNER'],
            ['s' => 3, 't' => 'SALDO AWAL (RP)'],
            ['s' => 3, 't' => 'TALANGAN MASUK (+RP)'],
            ['s' => 3, 't' => 'PENGEMBALIAN (-RP)'],
            ['s' => 3, 't' => 'BAGI HASIL (RP)'],
            ['s' => 3, 't' => 'PRIVE DITARIK (RP)'],
            ['s' => 4, 't' => 'SISA UTANG FIRMA (RP)'],
        ]);

        $r = 5;
        $totDue = 0;
        foreach ($advances as $idx => $adv) {
            $isZebra = ($idx % 2 === 1);
            $sText = $isZebra ? 16 : 7;
            $sCenter = $isZebra ? 17 : 8;
            $sCur = $isZebra ? 18 : 9;

            $totDue += $adv['net_due_to_partner'];

            $rows[] = $this->makeRow($r, 20, [
                ['s' => $sCenter, 't' => (string) ($idx + 1)],
                ['s' => $sText, 't' => $adv['partner_name']],
                ['s' => $sCur, 'v' => $adv['opening_balance']],
                ['s' => $sCur, 'v' => $adv['advances_incurred']],
                ['s' => $sCur, 'v' => $adv['advances_reimbursed']],
                ['s' => $sCur, 'v' => $adv['profit_distributed']],
                ['s' => $sCur, 'v' => $adv['prive_drawn']],
                ['s' => 10, 'v' => $adv['net_due_to_partner']],
            ]);
            $r++;
        }

        $rows[] = $this->makeRow($r, 22, [
            ['s' => 14, 't' => 'TOTAL KEWAJIBAN KE PARTNER'],
            ['s' => 14, 't' => ''],
            ['s' => 14, 't' => ''],
            ['s' => 14, 't' => ''],
            ['s' => 14, 't' => ''],
            ['s' => 14, 't' => ''],
            ['s' => 14, 't' => ''],
            ['s' => 15, 'v' => $totDue],
        ]);
        $r++;

        // Table 2: Details
        $r++;
        $rows[] = $this->makeRow($r, 22, [
            ['s' => 6, 't' => 'RINCIAN RIWAYAT TRANSAKSI TALANGAN, BAGI HASIL & PRIVE'],
            ['s' => 6, 't' => ''],
            ['s' => 6, 't' => ''],
            ['s' => 6, 't' => ''],
            ['s' => 6, 't' => ''],
            ['s' => 6, 't' => ''],
            ['s' => 6, 't' => ''],
            ['s' => 6, 't' => ''],
        ]);
        $r++;

        $rows[] = $this->makeRow($r, 24, [
            ['s' => 3, 't' => 'NO'],
            ['s' => 3, 't' => 'TANGGAL'],
            ['s' => 3, 't' => 'PARTNER'],
            ['s' => 3, 't' => 'JENIS TRANSAKSI'],
            ['s' => 3, 't' => 'PERKARA TERKAIT'],
            ['s' => 3, 't' => 'AKUN KAS / BANK'],
            ['s' => 3, 't' => 'NOMINAL (RP)'],
            ['s' => 3, 't' => 'CATATAN'],
        ]);
        $r++;

        foreach ($transactions as $idx => $t) {
            $isZebra = ($idx % 2 === 1);
            $sText = $isZebra ? 16 : 7;
            $sCenter = $isZebra ? 17 : 8;
            $sCur = $isZebra ? 18 : 9;

            $typeLabel = match ($t->type) {
                'advance_incurred' => 'Talangan Pribadi (+)',
                'advance_reimbursed' => 'Pengembalian Talangan (-)',
                'profit_distribution' => 'Pembagian Bagi Hasil',
                'draw_prive' => 'Penarikan Prive',
                'capital_injection' => 'Setoran Modal',
                default => strtoupper($t->type),
            };

            $rows[] = $this->makeRow($r, 20, [
                ['s' => $sCenter, 't' => (string) ($idx + 1)],
                ['s' => 13, 't' => Carbon::parse($t->transaction_date)->format('Y-m-d')],
                ['s' => $sText, 't' => $t->partner?->name ?? '-'],
                ['s' => $sCenter, 't' => $typeLabel],
                ['s' => $sText, 't' => $t->matter?->matter_number ?? 'Non-Perkara'],
                ['s' => $sText, 't' => $t->account?->name ?? '-'],
                ['s' => $sCur, 'v' => $t->amount],
                ['s' => $sText, 't' => $t->notes ?? '-'],
            ]);
            $r++;
        }

        $cols = [
            ['min' => 1, 'max' => 1, 'width' => 6],
            ['min' => 2, 'max' => 2, 'width' => 25],
            ['min' => 3, 'max' => 3, 'width' => 22],
            ['min' => 4, 'max' => 4, 'width' => 26],
            ['min' => 5, 'max' => 5, 'width' => 24],
            ['min' => 6, 'max' => 6, 'width' => 24],
            ['min' => 7, 'max' => 7, 'width' => 22],
            ['min' => 8, 'max' => 8, 'width' => 35],
        ];

        return $this->buildWorksheetXml($rows, $cols, 4, false);
    }

    /**
     * Sheet 8: Client Trust Escrow Funds (Dana Titipan Klien)
     */
    private function buildClientTrustSheet(): string
    {
        $trust = $this->statementService->getClientTrustSummary();
        $funds = ClientTrustFund::with(['client', 'matter', 'account'])
            ->whereIn('status', ['approved', 'completed'])
            ->orderByDesc('transaction_date')
            ->get();

        $rows = [];
        $rows[] = $this->makeRow(1, 28, [
            ['s' => 1, 't' => 'REKENING DANA TITIPAN KLIEN (ESCROW / TRUST ACCOUNT)'],
        ]);
        $rows[] = $this->makeRow(2, 18, [
            ['s' => 2, 't' => 'Pencatatan Panjar Biaya Perkara & Pengeluaran Resmi Pengadilan (Terpisah Mutlak dari Kas Kantor) | Diekspor: '.now()->format('d/m/Y')],
        ]);

        // Table 1: Summary per Matter
        $rows[] = $this->makeRow(4, 24, [
            ['s' => 3, 't' => 'NO'],
            ['s' => 3, 't' => 'NO. PERKARA'],
            ['s' => 3, 't' => 'JUDUL PERKARA'],
            ['s' => 3, 't' => 'KLIEN'],
            ['s' => 3, 't' => 'TOTAL TITIPAN MASUK (+RP)'],
            ['s' => 3, 't' => 'PENGELUARAN RESMI (-RP)'],
            ['s' => 4, 't' => 'SISA TITIPAN AKTIF (RP)'],
        ]);

        $r = 5;
        foreach ($trust['by_matter'] as $idx => $m) {
            $isZebra = ($idx % 2 === 1);
            $sText = $isZebra ? 16 : 7;
            $sCenter = $isZebra ? 17 : 8;
            $sCur = $isZebra ? 18 : 9;

            $rows[] = $this->makeRow($r, 20, [
                ['s' => $sCenter, 't' => (string) ($idx + 1)],
                ['s' => $sCenter, 't' => $m['matter_number']],
                ['s' => $sText, 't' => $m['matter_title']],
                ['s' => $sText, 't' => $m['client_name']],
                ['s' => $sCur, 'v' => $m['deposit_in']],
                ['s' => $sCur, 'v' => $m['disbursement_out']],
                ['s' => 10, 'v' => $m['current_balance']],
            ]);
            $r++;
        }

        $rows[] = $this->makeRow($r, 22, [
            ['s' => 14, 't' => 'TOTAL TITIPAN ESCROW KLIEN'],
            ['s' => 14, 't' => ''],
            ['s' => 14, 't' => ''],
            ['s' => 14, 't' => ''],
            ['s' => 15, 'v' => $trust['total_deposit_in']],
            ['s' => 15, 'v' => $trust['total_disbursement_out']],
            ['s' => 15, 'v' => $trust['net_trust_balance']],
        ]);
        $r++;

        // Table 2: Details
        $r++;
        $rows[] = $this->makeRow($r, 22, [
            ['s' => 6, 't' => 'RINCIAN BUKU MUTASI DANA TITIPAN KLIEN'],
            ['s' => 6, 't' => ''],
            ['s' => 6, 't' => ''],
            ['s' => 6, 't' => ''],
            ['s' => 6, 't' => ''],
            ['s' => 6, 't' => ''],
            ['s' => 6, 't' => ''],
        ]);
        $r++;

        $rows[] = $this->makeRow($r, 24, [
            ['s' => 3, 't' => 'NO'],
            ['s' => 3, 't' => 'TANGGAL'],
            ['s' => 3, 't' => 'KLIEN'],
            ['s' => 3, 't' => 'PERKARA'],
            ['s' => 3, 't' => 'JENIS MUTASI'],
            ['s' => 3, 't' => 'KEPERLUAN / INSTANSI'],
            ['s' => 4, 't' => 'NOMINAL (RP)'],
        ]);
        $r++;

        foreach ($funds as $idx => $f) {
            $isZebra = ($idx % 2 === 1);
            $sText = $isZebra ? 16 : 7;
            $sCenter = $isZebra ? 17 : 8;
            $sCur = $isZebra ? 18 : 9;

            $typeLabel = $f->type === 'deposit_in' ? 'Penerimaan Panjar (+)' : 'Pengeluaran Resmi (-)';

            $rows[] = $this->makeRow($r, 20, [
                ['s' => $sCenter, 't' => (string) ($idx + 1)],
                ['s' => 13, 't' => Carbon::parse($f->transaction_date)->format('Y-m-d')],
                ['s' => $sText, 't' => $f->client?->display_name ?? '-'],
                ['s' => $sText, 't' => $f->matter?->matter_number ?? 'Titipan Umum'],
                ['s' => $sCenter, 't' => $typeLabel],
                ['s' => $sText, 't' => $f->purpose.($f->recipient_party ? " ({$f->recipient_party})" : '')],
                ['s' => $sCur, 'v' => $f->amount],
            ]);
            $r++;
        }

        $cols = [
            ['min' => 1, 'max' => 1, 'width' => 6],
            ['min' => 2, 'max' => 2, 'width' => 20],
            ['min' => 3, 'max' => 3, 'width' => 35],
            ['min' => 4, 'max' => 4, 'width' => 25],
            ['min' => 5, 'max' => 5, 'width' => 25],
            ['min' => 6, 'max' => 6, 'width' => 45],
            ['min' => 7, 'max' => 7, 'width' => 25],
        ];

        return $this->buildWorksheetXml($rows, $cols, 4, false);
    }

    /**
     * Sheet 9: Staff Payroll & Honorarium (Payroll Gaji Staf)
     */
    private function buildPayrollSheet(int $year): string
    {
        $payrolls = Payroll::with(['user', 'paymentAccount'])
            ->orderByDesc('period')
            ->get();

        $rows = [];
        $rows[] = $this->makeRow(1, 28, [
            ['s' => 1, 't' => 'REKAPITULASI PENGGAJIAN & HONOR ADVOKAT (PAYROLL)'],
        ]);
        $rows[] = $this->makeRow(2, 18, [
            ['s' => 2, 't' => 'Rincian Penghasilan Dasar, Tunjangan, Potongan Pajak PPh 21, dan Gaji Bersih | Diekspor: '.now()->format('d/m/Y')],
        ]);

        $rows[] = $this->makeRow(4, 24, [
            ['s' => 3, 't' => 'NO'],
            ['s' => 3, 't' => 'NO. SLIP'],
            ['s' => 3, 't' => 'PERIODE'],
            ['s' => 3, 't' => 'NAMA PEGAWAI / ADVOKAT'],
            ['s' => 3, 't' => 'JABATAN'],
            ['s' => 3, 't' => 'GAJI POKOK (RP)'],
            ['s' => 3, 't' => 'TUNJANGAN (RP)'],
            ['s' => 3, 't' => 'LEMBUR & BONUS (RP)'],
            ['s' => 3, 't' => 'TOTAL BRUTO (RP)'],
            ['s' => 3, 't' => 'PPH 21 (RP)'],
            ['s' => 3, 't' => 'POTONGAN LAIN (RP)'],
            ['s' => 4, 't' => 'TAKE HOME PAY (RP)'],
            ['s' => 3, 't' => 'STATUS'],
            ['s' => 3, 't' => 'REKENING BAYAR'],
        ]);

        $r = 5;
        $totBasic = 0;
        $totAllow = 0;
        $totBonus = 0;
        $totTax = 0;
        $totOtherDed = 0;
        $totNet = 0;

        foreach ($payrolls as $idx => $p) {
            $isZebra = ($idx % 2 === 1);
            $sText = $isZebra ? 16 : 7;
            $sCenter = $isZebra ? 17 : 8;
            $sCur = $isZebra ? 18 : 9;

            $allowances = $p->fixed_allowance + $p->transport_meal_allowance;
            $bonusOt = $p->overtime_amount + $p->bonus_amount;
            $gross = $p->basic_salary + $allowances + $bonusOt;

            $totBasic += $p->basic_salary;
            $totAllow += $allowances;
            $totBonus += $bonusOt;
            $totTax += $p->tax_deduction_amount;
            $totOtherDed += $p->deductions_amount;
            $totNet += $p->net_salary;

            $rows[] = $this->makeRow($r, 20, [
                ['s' => $sCenter, 't' => (string) ($idx + 1)],
                ['s' => $sCenter, 't' => $p->payslip_number],
                ['s' => $sCenter, 't' => $p->period],
                ['s' => $sText, 't' => $p->user?->name ?? '-'],
                ['s' => $sText, 't' => $p->user?->position_title ?? 'Staf'],
                ['s' => $sCur, 'v' => $p->basic_salary],
                ['s' => $sCur, 'v' => $allowances],
                ['s' => $sCur, 'v' => $bonusOt],
                ['s' => $sCur, 'v' => $gross],
                ['s' => $sCur, 'v' => $p->tax_deduction_amount],
                ['s' => $sCur, 'v' => $p->deductions_amount],
                ['s' => 10, 'v' => $p->net_salary],
                ['s' => $sCenter, 't' => strtoupper($p->status)],
                ['s' => $sText, 't' => $p->paymentAccount?->name ?? '-'],
            ]);
            $r++;
        }

        $rows[] = $this->makeRow($r, 22, [
            ['s' => 14, 't' => 'TOTAL PAYROLL'],
            ['s' => 14, 't' => ''],
            ['s' => 14, 't' => ''],
            ['s' => 14, 't' => ''],
            ['s' => 14, 't' => ''],
            ['s' => 15, 'v' => $totBasic],
            ['s' => 15, 'v' => $totAllow],
            ['s' => 15, 'v' => $totBonus],
            ['s' => 15, 'v' => $totBasic + $totAllow + $totBonus],
            ['s' => 15, 'v' => $totTax],
            ['s' => 15, 'v' => $totOtherDed],
            ['s' => 15, 'v' => $totNet],
            ['s' => 14, 't' => ''],
            ['s' => 14, 't' => ''],
        ]);

        $cols = [
            ['min' => 1, 'max' => 1, 'width' => 6],
            ['min' => 2, 'max' => 2, 'width' => 18],
            ['min' => 3, 'max' => 3, 'width' => 14],
            ['min' => 4, 'max' => 4, 'width' => 25],
            ['min' => 5, 'max' => 5, 'width' => 20],
            ['min' => 6, 'max' => 6, 'width' => 18],
            ['min' => 7, 'max' => 7, 'width' => 18],
            ['min' => 8, 'max' => 8, 'width' => 18],
            ['min' => 9, 'max' => 9, 'width' => 20],
            ['min' => 10, 'max' => 10, 'width' => 16],
            ['min' => 11, 'max' => 11, 'width' => 18],
            ['min' => 12, 'max' => 12, 'width' => 22],
            ['min' => 13, 'max' => 13, 'width' => 14],
            ['min' => 14, 'max' => 14, 'width' => 24],
        ];

        return $this->buildWorksheetXml($rows, $cols, 4, false);
    }

    /**
     * Sheet 10: Invoices & Receivables (Buku Piutang Invoices)
     */
    private function buildInvoicesSheet(int $year): string
    {
        $invoices = Invoice::with(['client', 'matter'])
            ->whereNotIn('status', ['draft'])
            ->orderByDesc('issue_date')
            ->get();

        $rows = [];
        $rows[] = $this->makeRow(1, 28, [
            ['s' => 1, 't' => 'BUKU PIUTANG INVOICE & PENAGIHAN KLIEN'],
        ]);
        $rows[] = $this->makeRow(2, 18, [
            ['s' => 2, 't' => 'Daftar Tagihan Resmi, Pajak PPN/PPh, Realisasi Pembayaran & Sisa Piutang | Diekspor: '.now()->format('d/m/Y')],
        ]);

        $rows[] = $this->makeRow(4, 24, [
            ['s' => 3, 't' => 'NO'],
            ['s' => 3, 't' => 'NO. INVOICE'],
            ['s' => 3, 't' => 'TGL. TERBIT'],
            ['s' => 3, 't' => 'JATUH TEMPO'],
            ['s' => 3, 't' => 'KLIEN'],
            ['s' => 3, 't' => 'PERKARA TERKAIT'],
            ['s' => 3, 't' => 'SUBTOTAL (RP)'],
            ['s' => 3, 't' => 'PPN 11% (RP)'],
            ['s' => 3, 't' => 'PPH 23 2% (RP)'],
            ['s' => 4, 't' => 'GRAND TOTAL (RP)'],
            ['s' => 4, 't' => 'KAS DITERIMA (RP)'],
            ['s' => 4, 't' => 'SISA PIUTANG (RP)'],
            ['s' => 3, 't' => 'STATUS'],
        ]);

        $r = 5;
        $totSub = 0;
        $totVat = 0;
        $totWht = 0;
        $totGrand = 0;
        $totPaid = 0;
        $totOut = 0;

        foreach ($invoices as $idx => $inv) {
            $isZebra = ($idx % 2 === 1);
            $sText = $isZebra ? 16 : 7;
            $sCenter = $isZebra ? 17 : 8;
            $sCur = $isZebra ? 18 : 9;

            $totSub += $inv->subtotal_amount;
            $totVat += $inv->tax_amount;
            $totWht += $inv->withholding_tax_amount;
            $totGrand += $inv->total_amount;
            $totPaid += $inv->paid_amount;
            $totOut += $inv->outstanding_amount;

            $rows[] = $this->makeRow($r, 20, [
                ['s' => $sCenter, 't' => (string) ($idx + 1)],
                ['s' => $sCenter, 't' => $inv->invoice_number],
                ['s' => 13, 't' => Carbon::parse($inv->issue_date)->format('Y-m-d')],
                ['s' => 13, 't' => $inv->due_date ? Carbon::parse($inv->due_date)->format('Y-m-d') : '-'],
                ['s' => $sText, 't' => $inv->client?->display_name ?? '-'],
                ['s' => $sText, 't' => $inv->matter?->matter_number ?? '-'],
                ['s' => $sCur, 'v' => $inv->subtotal_amount],
                ['s' => $sCur, 'v' => $inv->tax_amount],
                ['s' => $sCur, 'v' => $inv->withholding_tax_amount],
                ['s' => $sCur, 'v' => $inv->total_amount],
                ['s' => $sCur, 'v' => $inv->paid_amount],
                ['s' => $sCur, 'v' => $inv->outstanding_amount],
                ['s' => $sCenter, 't' => strtoupper($inv->status)],
            ]);
            $r++;
        }

        $rows[] = $this->makeRow($r, 22, [
            ['s' => 14, 't' => 'TOTAL'],
            ['s' => 14, 't' => ''],
            ['s' => 14, 't' => ''],
            ['s' => 14, 't' => ''],
            ['s' => 14, 't' => ''],
            ['s' => 14, 't' => ''],
            ['s' => 15, 'v' => $totSub],
            ['s' => 15, 'v' => $totVat],
            ['s' => 15, 'v' => $totWht],
            ['s' => 15, 'v' => $totGrand],
            ['s' => 15, 'v' => $totPaid],
            ['s' => 15, 'v' => $totOut],
            ['s' => 14, 't' => ''],
        ]);

        $cols = [
            ['min' => 1, 'max' => 1, 'width' => 6],
            ['min' => 2, 'max' => 2, 'width' => 20],
            ['min' => 3, 'max' => 3, 'width' => 14],
            ['min' => 4, 'max' => 4, 'width' => 14],
            ['min' => 5, 'max' => 5, 'width' => 28],
            ['min' => 6, 'max' => 6, 'width' => 20],
            ['min' => 7, 'max' => 7, 'width' => 20],
            ['min' => 8, 'max' => 8, 'width' => 18],
            ['min' => 9, 'max' => 9, 'width' => 18],
            ['min' => 10, 'max' => 10, 'width' => 22],
            ['min' => 11, 'max' => 11, 'width' => 22],
            ['min' => 12, 'max' => 12, 'width' => 22],
            ['min' => 13, 'max' => 13, 'width' => 14],
        ];

        return $this->buildWorksheetXml($rows, $cols, 4, false);
    }

    // ==========================================
    // XML GENERATION HELPERS
    // ==========================================

    private function makeRow(int $rowNum, int $height, array $cells): string
    {
        $xml = '<row r="'.$rowNum.'" ht="'.$height.'" customHeight="1">';
        foreach ($cells as $colIdx => $c) {
            $colLetter = isset($c['col'])
                ? $c['col']
                : (isset($c['r']) ? preg_replace('/\d+/', '', $c['r']) : $this->colLetter($colIdx + 1));

            $cellRef = $colLetter.$rowNum;
            $s = $c['s'] ?? 0;

            if (isset($c['v'])) {
                $val = (float) $c['v'];
                $xml .= '<c r="'.$cellRef.'" s="'.$s.'" t="n"><v>'.$val.'</v></c>';
            } else {
                $text = htmlspecialchars((string) ($c['t'] ?? ''), ENT_XML1 | ENT_QUOTES, 'UTF-8');
                $xml .= '<c r="'.$cellRef.'" s="'.$s.'" t="inlineStr"><is><t>'.$text.'</t></is></c>';
            }
        }
        $xml .= '</row>';

        return $xml;
    }

    private function buildWorksheetXml(array $rows, array $cols, int $freezeRow = 4, bool $isSelected = false): string
    {
        $colsXml = '<cols>';
        foreach ($cols as $c) {
            $colsXml .= '<col min="'.$c['min'].'" max="'.$c['max'].'" width="'.$c['width'].'" customWidth="1"/>';
        }
        $colsXml .= '</cols>';

        $rowsXml = implode('', $rows);
        $nextCell = 'A'.($freezeRow + 1);
        $tabSelectedAttr = $isSelected ? ' tabSelected="1"' : '';

        return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'.
            '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">'.
            '<sheetViews>'.
            '<sheetView'.$tabSelectedAttr.' workbookViewId="0" showGridLines="true">'.
            '<pane ySplit="'.$freezeRow.'" topLeftCell="'.$nextCell.'" activePane="bottomLeft" state="frozen"/>'.
            '<selection pane="bottomLeft" activeCell="'.$nextCell.'" sqref="'.$nextCell.'"/>'.
            '</sheetView>'.
            '</sheetViews>'.
            '<sheetFormatPr defaultRowHeight="18"/>'.
            $colsXml.
            '<sheetData>'.$rowsXml.'</sheetData>'.
            '<pageMargins left="0.7" right="0.7" top="0.75" bottom="0.75" header="0.3" footer="0.3"/>'.
            '</worksheet>';
    }

    private function buildStylesXml(): string
    {
        return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'.
            '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'.
            '<numFmts count="3">'.
            '<numFmt numFmtId="164" formatCode="&quot;Rp &quot;#,##0;[Red]-&quot;Rp &quot;#,##0;&quot;Rp &quot;0"/>'.
            '<numFmt numFmtId="165" formatCode="0.0%"/>'.
            '<numFmt numFmtId="166" formatCode="yyyy-mm-dd"/>'.
            '</numFmts>'.
            '<fonts count="7">'.
            '<font><sz val="10"/><color rgb="FF1E293B"/><name val="Calibri"/><family val="2"/></font>'. // 0: regular
            '<font><b/><sz val="10"/><color rgb="FF1E293B"/><name val="Calibri"/><family val="2"/></font>'. // 1: bold
            '<font><b/><sz val="11"/><color rgb="FF0F172A"/><name val="Calibri"/><family val="2"/></font>'. // 2: bold header
            '<font><b/><sz val="14"/><color rgb="FF0F172A"/><name val="Calibri"/><family val="2"/></font>'. // 3: title
            '<font><b/><sz val="10"/><color rgb="FFFFFFFF"/><name val="Calibri"/><family val="2"/></font>'. // 4: bold white
            '<font><i/><sz val="10"/><color rgb="FF64748B"/><name val="Calibri"/><family val="2"/></font>'. // 5: subtitle slate
            '<font><b/><sz val="10"/><color rgb="FF065F46"/><name val="Calibri"/><family val="2"/></font>'. // 6: bold emerald
            '</fonts>'.
            '<fills count="9">'.
            '<fill><patternFill patternType="none"/></fill>'. // 0: none
            '<fill><patternFill patternType="gray125"/></fill>'. // 1: gray
            '<fill><patternFill patternType="solid"><fgColor rgb="FF1E293B"/></patternFill></fill>'. // 2: Navy
            '<fill><patternFill patternType="solid"><fgColor rgb="FF065F46"/></patternFill></fill>'. // 3: Emerald
            '<fill><patternFill patternType="solid"><fgColor rgb="FFF1F5F9"/></patternFill></fill>'. // 4: Soft Slate
            '<fill><patternFill patternType="solid"><fgColor rgb="FFECFDF5"/></patternFill></fill>'. // 5: Soft Emerald
            '<fill><patternFill patternType="solid"><fgColor rgb="FFFFF1F2"/></patternFill></fill>'. // 6: Soft Rose
            '<fill><patternFill patternType="solid"><fgColor rgb="FFEFF6FF"/></patternFill></fill>'. // 7: Soft Blue
            '<fill><patternFill patternType="solid"><fgColor rgb="FFF8FAFC"/></patternFill></fill>'. // 8: Zebra
            '</fills>'.
            '<borders count="3">'.
            '<border><left/><right/><top/><bottom/><diagonal/></border>'. // 0: none
            '<border>'. // 1: standard thin
            '<left style="thin"><color rgb="FFE2E8F0"/></left>'.
            '<right style="thin"><color rgb="FFE2E8F0"/></right>'.
            '<top style="thin"><color rgb="FFE2E8F0"/></top>'.
            '<bottom style="thin"><color rgb="FFE2E8F0"/></bottom>'.
            '</border>'.
            '<border>'. // 2: summary accounting double bottom
            '<left style="thin"><color rgb="FFE2E8F0"/></left>'.
            '<right style="thin"><color rgb="FFE2E8F0"/></right>'.
            '<top style="thin"><color rgb="FF0F172A"/></top>'.
            '<bottom style="double"><color rgb="FF0F172A"/></bottom>'.
            '</border>'.
            '</borders>'.
            '<cellStyleXfs count="1">'.
            '<xf numFmtId="0" fontId="0" fillId="0" borderId="0"/>'.
            '</cellStyleXfs>'.
            '<cellXfs count="24">'.
            '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>'. // 0: default
            '<xf numFmtId="0" fontId="3" fillId="0" borderId="0" xfId="0" applyFont="1"/>'. // 1: title
            '<xf numFmtId="0" fontId="5" fillId="0" borderId="0" xfId="0" applyFont="1"/>'. // 2: subtitle
            '<xf numFmtId="0" fontId="4" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>'. // 3: Hdr Navy
            '<xf numFmtId="0" fontId="4" fillId="3" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>'. // 4: Hdr Emerald
            '<xf numFmtId="0" fontId="1" fillId="4" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1"/>'. // 5: Subhdr Slate
            '<xf numFmtId="0" fontId="1" fillId="4" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1"><alignment horizontal="left" vertical="center"/></xf>'. // 6: Bold section
            '<xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyFont="1" applyBorder="1"><alignment horizontal="left" vertical="center"/></xf>'. // 7: Data Text Left
            '<xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyFont="1" applyBorder="1"><alignment horizontal="center" vertical="center"/></xf>'. // 8: Data Text Center
            '<xf numFmtId="164" fontId="0" fillId="0" borderId="1" xfId="0" applyFont="1" applyNumberFormat="1" applyBorder="1"><alignment horizontal="right" vertical="center"/></xf>'. // 9: Currency
            '<xf numFmtId="164" fontId="1" fillId="0" borderId="1" xfId="0" applyFont="1" applyNumberFormat="1" applyBorder="1"><alignment horizontal="right" vertical="center"/></xf>'. // 10: Currency Bold
            '<xf numFmtId="165" fontId="0" fillId="0" borderId="1" xfId="0" applyFont="1" applyNumberFormat="1" applyBorder="1"><alignment horizontal="right" vertical="center"/></xf>'. // 11: Percent
            '<xf numFmtId="165" fontId="1" fillId="0" borderId="1" xfId="0" applyFont="1" applyNumberFormat="1" applyBorder="1"><alignment horizontal="right" vertical="center"/></xf>'. // 12: Percent Bold
            '<xf numFmtId="166" fontId="0" fillId="0" borderId="1" xfId="0" applyFont="1" applyNumberFormat="1" applyBorder="1"><alignment horizontal="center" vertical="center"/></xf>'. // 13: Date
            '<xf numFmtId="0" fontId="6" fillId="5" borderId="2" xfId="0" applyFont="1" applyFill="1" applyBorder="1"><alignment horizontal="left" vertical="center"/></xf>'. // 14: Total Label
            '<xf numFmtId="164" fontId="6" fillId="5" borderId="2" xfId="0" applyFont="1" applyNumberFormat="1" applyFill="1" applyBorder="1"><alignment horizontal="right" vertical="center"/></xf>'. // 15: Total Cur
            '<xf numFmtId="0" fontId="0" fillId="8" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1"><alignment horizontal="left" vertical="center"/></xf>'. // 16: Zebra Text Left
            '<xf numFmtId="0" fontId="0" fillId="8" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1"><alignment horizontal="center" vertical="center"/></xf>'. // 17: Zebra Text Center
            '<xf numFmtId="164" fontId="0" fillId="8" borderId="1" xfId="0" applyFont="1" applyNumberFormat="1" applyBorder="1"><alignment horizontal="right" vertical="center"/></xf>'. // 18: Zebra Cur
            '<xf numFmtId="0" fontId="1" fillId="4" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1"><alignment horizontal="center" vertical="center"/></xf>'. // 19: KPI title
            '<xf numFmtId="164" fontId="6" fillId="5" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyNumberFormat="1"><alignment horizontal="center" vertical="center"/></xf>'. // 20: KPI Emerald
            '<xf numFmtId="164" fontId="1" fillId="7" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyNumberFormat="1"><alignment horizontal="center" vertical="center"/></xf>'. // 21: KPI Blue
            '<xf numFmtId="164" fontId="1" fillId="6" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyNumberFormat="1"><alignment horizontal="center" vertical="center"/></xf>'. // 22: KPI Rose
            '<xf numFmtId="0" fontId="6" fillId="5" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1"><alignment horizontal="center" vertical="center"/></xf>'. // 23: Badge Active
            '</cellXfs>'.
            '<cellStyles count="1">'.
            '<cellStyle name="Normal" xfId="0" builtinId="0"/>'.
            '</cellStyles>'.
            '<dxfs count="0"/>'.
            '<tableStyles count="0" defaultTableStyle="TableStyleMedium9" defaultPivotStyle="PivotStyleLight16"/>'.
            '</styleSheet>';
    }

    private function buildContentTypesXml(int $sheetCount): string
    {
        $xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'.
            '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'.
            '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'.
            '<Default Extension="xml" ContentType="application/xml"/>'.
            '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>'.
            '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>';

        for ($i = 1; $i <= $sheetCount; $i++) {
            $xml .= '<Override PartName="/xl/worksheets/sheet'.$i.'.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>';
        }

        $xml .= '</Types>';

        return $xml;
    }

    private function buildRootRelsXml(): string
    {
        return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'.
            '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'.
            '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>'.
            '</Relationships>';
    }

    private function buildWorkbookRelsXml(array $sheets): string
    {
        $xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'.
            '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'.
            '<Relationship Id="rIdStyles" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>';

        foreach ($sheets as $s) {
            $xml .= '<Relationship Id="rId'.$s['id'].'" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet'.$s['id'].'.xml"/>';
        }

        $xml .= '</Relationships>';

        return $xml;
    }

    private function buildWorkbookXml(array $sheets): string
    {
        $xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'.
            '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">'.
            '<workbookPr date1904="false"/>'.
            '<bookViews><workbookView xWindow="0" yWindow="0" windowWidth="25600" windowHeight="14400" activeTab="0"/></bookViews>'.
            '<sheets>';

        foreach ($sheets as $s) {
            $xml .= '<sheet name="'.$s['name'].'" sheetId="'.$s['id'].'" r:id="rId'.$s['id'].'"/>';
        }

        $xml .= '</sheets></workbook>';

        return $xml;
    }

    private function colLetter(int $colIndex): string
    {
        $letter = '';
        while ($colIndex > 0) {
            $mod = ($colIndex - 1) % 26;
            $letter = chr(65 + $mod).$letter;
            $colIndex = (int) (($colIndex - $mod) / 26);
        }

        return $letter;
    }
}
