import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('client matter finance uses a compact single-workspace layout', async () => {
    const source = await readFile(
        new URL('../../resources/js/pages/finance/index.tsx', import.meta.url),
        'utf8',
    );

    assert.match(source, /event\.currentTarget\.form\?\.requestSubmit\(\)/);
    assert.doesNotMatch(source, />\s*Tampilkan Data Perkara\s*</);
    assert.match(source, /aria-label="Navigasi keuangan perkara"/);
    assert.match(source, />\('profitability'\);/);
    assert.doesNotMatch(source, />\s*Ringkasan\s*</);
    assert.match(source, /matterTab === 'invoices' &&/);
    assert.match(source, /matterTab === 'quotations' &&/);
    assert.doesNotMatch(
        source,
        /matterTab === 'all' \|\|\s*matterTab === 'invoices'/,
    );
});

test('profitability and client trust share a neutral compact visual system', async () => {
    const profitability = await readFile(
        new URL(
            '../../resources/js/pages/finance/components/profitability-table.tsx',
            import.meta.url,
        ),
        'utf8',
    );
    const trust = await readFile(
        new URL(
            '../../resources/js/pages/finance/components/client-trust-view.tsx',
            import.meta.url,
        ),
        'utf8',
    );

    assert.doesNotMatch(profitability, />\s*Filter\s*</);
    assert.match(profitability, /data-testid="profitability-workspace"/);
    assert.match(profitability, /Profitabilitas Perkara/);
    assert.doesNotMatch(profitability, /Rincian Profitabilitas/);
    assert.doesNotMatch(profitability, /<table/);
    assert.match(profitability, /Total Nilai Kontrak/);
    assert.match(profitability, /Atur Nilai Kontrak/);
    assert.match(trust, /data-testid="client-trust-workspace"/);
    assert.match(trust, /grid overflow-hidden.*sm:grid-cols-3/);
    assert.doesNotMatch(
        trust,
        /font-mono text-base font-bold text-(?:emerald|rose|purple)/,
    );
});

test('aging analysis is a neutral iconless disclosure strip', async () => {
    const source = await readFile(
        new URL('../../resources/js/pages/finance/index.tsx', import.meta.url),
        'utf8',
    );

    assert.match(source, />\s*Umur Piutang\s*</);
    assert.match(
        source,
        /Aging analysis[\s\S]{0,120}berdasarkan jatuh[\s\S]{0,80}tempo/,
    );
    assert.doesNotMatch(source, /Klasifikasi\s+Umur Piutang\s+Klien/);
    assert.match(
        source,
        /Distribusi[\s\S]{0,80}Piutang[\s\S]{0,80}Berdasarkan[\s\S]{0,80}Jatuh Tempo/,
    );
});

test('invoice ledger uses clean text status and invoice totals', async () => {
    const source = await readFile(
        new URL('../../resources/js/pages/finance/index.tsx', import.meta.url),
        'utf8',
    );

    assert.match(source, /paid: 'Lunas'/);
    assert.match(source, /!i\.invoice_number &&/);
    assert.match(source, /Total invoice/);
    assert.match(
        source,
        /value=\{\(i\) =>[\s\S]{0,120}i\.total_amount \?\?[\s\S]{0,120}i\.outstanding_amount/,
    );
});

test('finance ledgers share text-only status styling', async () => {
    const finance = await readFile(
        new URL('../../resources/js/pages/finance/index.tsx', import.meta.url),
        'utf8',
    );
    const trust = await readFile(
        new URL(
            '../../resources/js/pages/finance/components/client-trust-view.tsx',
            import.meta.url,
        ),
        'utf8',
    );

    assert.match(finance, /accepted: 'Diterima'/);
    assert.match(finance, /approved: 'Disetujui'/);
    assert.match(finance, /Penerimaan Kas Klien/);
    assert.match(finance, /Kas diterima/);
    assert.match(
        finance,
        /text-sm font-bold text-slate-900 dark:text-white[\s\S]{0,180}\{title\}/,
    );
    assert.match(
        finance,
        /mt-0\.5 text-\[11px\] text-slate-500 dark:text-zinc-400/,
    );
    assert.match(
        trust,
        /mt-0\.5 text-\[11px\] text-slate-500 dark:text-zinc-400/,
    );
    assert.doesNotMatch(trust, /<Lock|<Shield|<Wallet|<FileText/);
    assert.doesNotMatch(trust, /rounded-full bg-emerald-50/);
});

test('accounts use a structured treasury workspace with balance visuals', async () => {
    const source = await readFile(
        new URL(
            '../../resources/js/pages/finance/components/accounts-view.tsx',
            import.meta.url,
        ),
        'utf8',
    );

    assert.match(source, /Likuiditas Operasional/);
    assert.match(source, /data-testid="account-composition-panel"/);
    assert.match(source, /Komposisi Saldo/);
    assert.match(source, /Kontribusi/);
    assert.match(source, /Rekening Terdaftar/);
    assert.match(source, /balanceScale/);
    assert.match(source, /largestAccountBalance/);
    assert.match(source, /bg-\[#eef5ff\]/);
    assert.doesNotMatch(source, /typeIcons/);
    assert.doesNotMatch(source, /rounded-full bg-emerald-50/);
});

test('office expenses expose a compact operational expense summary', async () => {
    const source = await readFile(
        new URL('../../resources/js/pages/finance/index.tsx', import.meta.url),
        'utf8',
    );

    assert.match(source, /data-testid="office-expense-summary"/);
    assert.match(source, /Total Beban Operasional/);
    assert.match(source, /Komposisi Beban/);
    assert.match(source, /Rata-rata Transaksi/);
    assert.match(source, /Kategori Terbesar/);
});

test('payroll uses a compact compensation workspace and ledger rows', async () => {
    const source = await readFile(
        new URL(
            '../../resources/js/pages/finance/components/payroll-view.tsx',
            import.meta.url,
        ),
        'utf8',
    );

    assert.match(source, /Total Take Home Pay/);
    assert.match(source, /payrollCompositionTotal/);
    assert.match(source, /bg-\[#eef5ff\]/);
    assert.match(source, /Take Home Pay/);
    assert.match(source, /Periode &amp; Slip/);
    assert.match(source, /Penyesuaian/);
    assert.match(source, /<table/);
    assert.match(source, /min-w-\[920px\]/);
    assert.doesNotMatch(source, /rounded-full px-2 py-0\.5/);
    assert.match(source, /data-testid="payroll-composition-panel"/);
    assert.match(source, /Komposisi Payroll/);
    assert.match(source, /Kontribusi/);
    assert.doesNotMatch(source, /min-h-\[170px\]/);
});

test('office operations opens directly with contextual sub-tabs', async () => {
    const source = await readFile(
        new URL('../../resources/js/pages/finance/index.tsx', import.meta.url),
        'utf8',
    );

    assert.doesNotMatch(source, /officeSummaryScale/);
    assert.doesNotMatch(source, /Kas &amp; Bank Operasional/);
    assert.doesNotMatch(source, /Titipan Klien di Bank/);
    assert.doesNotMatch(source, /Total Payroll Gaji/);
    assert.match(source, /Beban Operasional Kantor/);
    assert.match(source, /Rekening ·/);
    assert.match(source, /Beban Operasional ·/);
    assert.match(source, /border-b-2 px-1 pb-2 pt-1/);
    assert.doesNotMatch(source, /bg-indigo-600 text-white shadow-2xs/);
});

test('financial report tabs use the same understated underline navigation', async () => {
    const source = await readFile(
        new URL(
            '../../resources/js/pages/finance/components/reports-view.tsx',
            import.meta.url,
        ),
        'utf8',
    );

    assert.match(source, /Laba Rugi Bulanan/);
    assert.match(source, /Arus Kas Bulanan/);
    assert.match(source, /Neraca Posisi Keuangan/);
    assert.match(source, /<ExportExcelConfirmButton/);
    assert.match(source, /border-b-2 px-1 pb-2 pt-1/);
    assert.doesNotMatch(source, /bg-emerald-600 text-white shadow-2xs/);
    assert.doesNotMatch(source, /<BarChart3 className="size-3"/);
});

test('income statement uses an executive composition panel and sticky matrix', async () => {
    const source = await readFile(
        new URL(
            '../../resources/js/pages/finance/components/reports-view.tsx',
            import.meta.url,
        ),
        'utf8',
    );

    assert.match(source, /data-testid="income-statement-summary"/);
    assert.match(source, /Komposisi Kinerja/);
    assert.match(source, /Terhadap pendapatan/);
    assert.match(source, /sticky left-0/);
    assert.match(source, /sticky right-0/);
    assert.match(source, /Bersih Tahun/);
    assert.match(source, /border-l-2 border-amber-300/);
    assert.match(source, /bg-amber-50\/35 font-semibold/);
    assert.match(source, /Net Profit Row/);
    assert.doesNotMatch(source, /Executive Clean KPI Cards/);
});

test('cash flow uses a compact flow summary and sticky monthly matrix', async () => {
    const source = await readFile(
        new URL(
            '../../resources/js/pages/finance/components/reports-view.tsx',
            import.meta.url,
        ),
        'utf8',
    );

    assert.match(source, /data-testid="cash-flow-summary"/);
    assert.match(source, /Komposisi Arus Kas/);
    assert.match(source, /Kas Masuk/);
    assert.match(source, /Kas Keluar/);
    assert.match(source, /Arus Kas Bersih/);
    assert.match(source, /Periode Laporan/);
    assert.match(source, /Sepanjang Tahun/);
    assert.match(source, /selectedCashFlowPeriod/);
    assert.match(source, /Rincian Periode/);
    assert.match(source, /Rasio Pengeluaran/);
    assert.match(source, /border-l-2 border-emerald-400/);
    assert.match(source, /border-l-2 border-amber-400/);
    assert.match(source, /border-t-2 border-blue-500\/70/);
    assert.doesNotMatch(source, /bg-emerald-50\/20 font-semibold/);
    assert.doesNotMatch(source, /bg-rose-50\/20 font-semibold/);
});

test('balance sheet uses a balanced position panel and neutral ledger columns', async () => {
    const source = await readFile(
        new URL(
            '../../resources/js/pages/finance/components/reports-view.tsx',
            import.meta.url,
        ),
        'utf8',
    );

    assert.match(source, /data-testid="balance-position-summary"/);
    assert.match(source, /Posisi Neraca/);
    assert.match(source, /'Seimbang'/);
    assert.match(source, /Total Aset/);
    assert.match(source, /Total Pasiva/);
    assert.match(source, /Sumber daya yang dikuasai firma/);
    assert.match(source, /Sumber pendanaan aset firma/);
    assert.match(source, /md:divide-x/);
    assert.match(source, /bg-blue-50\/45/);
    assert.match(source, /bg-indigo-50\/35/);
    assert.doesNotMatch(
        source,
        /KEWAJIBAN &amp; EKUITAS \(PASIVA\)[\s\S]{0,500}text-purple/,
    );
    assert.doesNotMatch(source, /100% Seimbang/);
});

test('financial analytics uses an executive summary and interactive visual cards', async () => {
    const source = await readFile(
        new URL(
            '../../resources/js/pages/finance/components/financial-analytics-view.tsx',
            import.meta.url,
        ),
        'utf8',
    );

    assert.match(source, /data-testid="financial-analytics-summary"/);
    assert.match(source, /Kinerja Bersih/);
    assert.match(source, /Pendapatan YTD/);
    assert.match(source, /Total Beban YTD/);
    assert.match(source, /Likuiditas Kas/);
    assert.match(source, /hoveredMonth/);
    assert.match(source, /Distribusi Alokasi Beban/);
    assert.match(source, /data-testid="financial-analytics-grid"/);
    assert.match(source, /lg:col-span-2/);
    assert.match(source, /mt-4 grid gap-3 lg:grid-cols-3/);
    assert.match(source, /hover:-translate-y-0\.5/);
    assert.doesNotMatch(source, /border-t-blue-400\/70/);
    assert.doesNotMatch(source, /<BarChart3 className="size-4\.5"/);
    assert.doesNotMatch(source, /<PieChart className="size-4\.5"/);
    assert.doesNotMatch(source, /<Scale className="size-4\.5"/);
    assert.doesNotMatch(source, /rounded-full bg-emerald-50 px-2 py-0\.5/);
});

test('partner advances use a compact reconciliation workspace with text statuses', async () => {
    const source = await readFile(
        new URL(
            '../../resources/js/pages/finance/components/partner-advances-view.tsx',
            import.meta.url,
        ),
        'utf8',
    );

    assert.match(source, /data-testid="partner-advances-workspace"/);
    assert.match(source, /Total Utang Partner Bersih/);
    assert.match(source, /Rincian Posisi Talangan/);
    assert.match(source, /Register Transaksi &amp; Mutasi Partner/);
    assert.match(source, /text-emerald-600 uppercase/);
    assert.doesNotMatch(source, /rounded-full bg-emerald-50/);
    assert.doesNotMatch(source, /size-1\.5 rounded-full bg-emerald-500/);
    assert.doesNotMatch(source, /typeInfo\.color/);
    assert.match(source, /grid gap-3 p-4 lg:grid-cols-5/);
    assert.match(source, /lg:col-span-2/);
    assert.match(source, /lg:col-span-3/);
    assert.match(source, /sm:grid-cols-3/);
    assert.doesNotMatch(source, /className="space-y-2"/);
    assert.match(source, /data-testid="partner-composition-panel"/);
    assert.match(source, /Komposisi Kewajiban Partner/);
    assert.match(source, /Kontribusi/);
    assert.doesNotMatch(source, /min-h-\[170px\]/);
});
