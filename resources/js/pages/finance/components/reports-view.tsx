import { Scale, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { formatMoney } from '@/lib/format';
import { ExportExcelConfirmButton } from './export-excel-confirm-button';

export type IncomeStatementMonth = {
    month: number;
    period: string;
    revenue: number;
    operational_expense: number;
    payroll_expense: number;
    total_expense: number;
    net_profit: number;
};

export type IncomeStatementData = {
    year: number;
    months: IncomeStatementMonth[];
    summary: {
        total_revenue: number;
        total_operational_expense: number;
        total_payroll_expense: number;
        total_expenses: number;
        net_profit: number;
    };
};

export type BalanceSheetData = {
    assets: {
        operational_cash_bank: number;
        client_trust_bank: number;
        tax_credit_pph23: number;
        total_assets: number;
    };
    liabilities: {
        partner_advances_due: number;
        unpaid_payroll: number;
        client_trust_liability: number;
        total_liabilities: number;
    };
    equity: {
        retained_earnings: number;
        total_equity: number;
        total_liabilities_and_equity: number;
    };
    is_balanced: boolean;
};

const MONTH_NAMES = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'Mei',
    'Jun',
    'Jul',
    'Agu',
    'Sep',
    'Okt',
    'Nov',
    'Des',
];

export function ReportsView({
    incomeStatement,
    balanceSheet,
}: {
    incomeStatement: IncomeStatementData;
    balanceSheet: BalanceSheetData;
}) {
    const [subTab, setSubTab] = useState<
        'income_statement' | 'cash_flow' | 'balance_sheet'
    >('income_statement');
    const [selectedCashFlowPeriod, setSelectedCashFlowPeriod] = useState(() => {
        const latestActiveMonth = [...incomeStatement.months]
            .reverse()
            .find((month) => month.revenue !== 0 || month.total_expense !== 0);

        return latestActiveMonth ? String(latestActiveMonth.month) : 'year';
    });
    const reportTabClass = (
        tab: 'income_statement' | 'cash_flow' | 'balance_sheet',
    ): string =>
        `relative shrink-0 border-b-2 px-1 pb-2 pt-1 text-[11px] font-semibold transition-colors ${
            subTab === tab
                ? 'border-slate-950 text-slate-950 dark:border-white dark:text-white'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white'
        }`;

    const netProfit = incomeStatement.summary.net_profit;
    const isProfit = netProfit >= 0;
    const netMarginPercent =
        incomeStatement.summary.total_revenue > 0
            ? Math.round(
                  (netProfit / incomeStatement.summary.total_revenue) * 100,
              )
            : 0;
    const revenueScale = Math.max(
        incomeStatement.summary.total_revenue,
        incomeStatement.summary.total_expenses,
        1,
    );
    const performanceComposition = [
        {
            label: 'Beban Operasional',
            amount: incomeStatement.summary.total_operational_expense,
            displayAmount: incomeStatement.summary.total_operational_expense,
            color: 'bg-amber-400',
        },
        {
            label: 'Payroll & Honor',
            amount: incomeStatement.summary.total_payroll_expense,
            displayAmount: incomeStatement.summary.total_payroll_expense,
            color: 'bg-sky-400',
        },
        {
            label: isProfit ? 'Laba Bersih' : 'Rugi Bersih',
            amount: Math.max(netProfit, 0),
            displayAmount: netProfit,
            color: isProfit ? 'bg-blue-500' : 'bg-rose-500',
        },
    ];
    const selectedCashFlowMonth =
        selectedCashFlowPeriod === 'year'
            ? null
            : incomeStatement.months.find(
                  (month) => month.month === Number(selectedCashFlowPeriod),
              );
    const visibleCashFlowMonths = selectedCashFlowMonth
        ? [selectedCashFlowMonth]
        : incomeStatement.months;
    const totalCashIn = selectedCashFlowMonth
        ? selectedCashFlowMonth.revenue
        : incomeStatement.summary.total_revenue;
    const totalCashOut = selectedCashFlowMonth
        ? selectedCashFlowMonth.total_expense
        : incomeStatement.summary.total_expenses;
    const netCashFlow = totalCashIn - totalCashOut;
    const cashFlowScale = Math.max(totalCashIn + totalCashOut, 1);
    const cashOutRatio =
        totalCashIn > 0 ? (totalCashOut / totalCashIn) * 100 : 0;
    const cashFlowPeriodLabel = selectedCashFlowMonth
        ? `${MONTH_NAMES[selectedCashFlowMonth.month - 1]} ${incomeStatement.year}`
        : `Sepanjang Tahun ${incomeStatement.year}`;

    return (
        <div className="space-y-4">
            {/* Sub Tabs for Financial Reports */}
            <div className="flex items-end justify-between gap-4 border-b border-slate-200/60 dark:border-white/[0.06]">
                <div className="flex [scrollbar-width:none] items-center gap-8 overflow-x-auto [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                    <button
                        type="button"
                        onClick={() => setSubTab('income_statement')}
                        className={reportTabClass('income_statement')}
                    >
                        Laba Rugi Bulanan
                    </button>
                    <button
                        type="button"
                        onClick={() => setSubTab('cash_flow')}
                        className={reportTabClass('cash_flow')}
                    >
                        Arus Kas Bulanan
                    </button>
                    <button
                        type="button"
                        onClick={() => setSubTab('balance_sheet')}
                        className={reportTabClass('balance_sheet')}
                    >
                        Neraca Posisi Keuangan
                    </button>
                </div>
                <ExportExcelConfirmButton className="mb-1.5 inline-flex h-7 shrink-0 items-center gap-1.5 rounded-lg border border-slate-200/80 bg-white px-2.5 text-[10px] font-semibold whitespace-nowrap text-slate-700 shadow-2xs transition-colors hover:bg-slate-50 dark:border-white/10 dark:bg-[#14161b] dark:text-zinc-200 dark:hover:bg-white/[0.06]" />
            </div>

            {/* TAB 1: LABA RUGI BULANAN */}
            {subTab === 'income_statement' && (
                <div className="space-y-4">
                    <section
                        data-testid="income-statement-summary"
                        className="grid gap-3 rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs lg:grid-cols-5 dark:border-white/[0.06] dark:bg-[#14161b]"
                    >
                        <div className="relative flex min-h-[150px] flex-col justify-between overflow-hidden rounded-xl border border-blue-100 bg-[#eef5ff] p-4 lg:col-span-2 dark:border-blue-400/10 dark:bg-blue-500/[0.06]">
                            <div className="pointer-events-none absolute -top-12 -right-10 size-32 rounded-full border-[20px] border-white/60 dark:border-white/[0.025]" />
                            <div>
                                <p className="relative text-[10px] font-bold tracking-[0.14em] text-blue-600 uppercase dark:text-blue-300">
                                    {isProfit ? 'Laba' : 'Rugi'} Bersih Tahun{' '}
                                    {incomeStatement.year}
                                </p>
                                <p className="relative mt-1 font-mono text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
                                    {formatMoney(netProfit, 'IDR')}
                                </p>
                                <p className="relative mt-1 text-[10px] text-slate-500 dark:text-zinc-400">
                                    Pendapatan setelah seluruh beban firma
                                </p>
                            </div>
                            <div className="relative mt-4 flex justify-between border-t border-blue-200/60 pt-3 text-[9.5px] font-medium text-slate-500 dark:border-white/[0.06] dark:text-zinc-400">
                                <span>Margin bersih {netMarginPercent}%</span>
                                <span
                                    className={
                                        isProfit
                                            ? 'text-blue-600 dark:text-blue-300'
                                            : 'text-rose-600 dark:text-rose-400'
                                    }
                                >
                                    {isProfit ? 'Surplus' : 'Defisit'}
                                </span>
                            </div>
                        </div>

                        <div className="flex min-h-[150px] flex-col rounded-xl border border-slate-200/70 bg-slate-50/60 p-4 lg:col-span-3 dark:border-white/[0.06] dark:bg-white/[0.025]">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-[10px] font-bold tracking-[0.12em] text-slate-500 uppercase dark:text-zinc-400">
                                        Komposisi Kinerja
                                    </p>
                                    <p className="mt-0.5 text-[10px] text-slate-400 dark:text-zinc-500">
                                        Alokasi pendapatan terhadap beban dan
                                        hasil bersih
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[9px] text-slate-400 dark:text-zinc-500">
                                        Total Pendapatan Jasa
                                    </p>
                                    <p className="font-mono text-xs font-bold text-slate-700 dark:text-zinc-200">
                                        {formatMoney(
                                            incomeStatement.summary
                                                .total_revenue,
                                            'IDR',
                                        )}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-slate-200/80 dark:bg-white/[0.07]">
                                {performanceComposition.map((item) => (
                                    <div
                                        key={item.label}
                                        className={item.color}
                                        style={{
                                            width: `${(item.amount / revenueScale) * 100}%`,
                                        }}
                                    />
                                ))}
                            </div>
                            <div className="mt-3 grid flex-1 divide-y divide-slate-200/70 sm:grid-cols-3 sm:divide-x sm:divide-y-0 dark:divide-white/[0.06]">
                                {performanceComposition.map((item) => (
                                    <div
                                        key={item.label}
                                        className="py-2 sm:px-3 sm:py-0"
                                    >
                                        <p className="text-[9px] font-semibold text-slate-400 uppercase dark:text-zinc-500">
                                            {item.label}
                                        </p>
                                        <p className="mt-1 font-mono text-sm font-bold text-slate-950 dark:text-white">
                                            {formatMoney(
                                                item.displayAmount ??
                                                    item.amount,
                                                'IDR',
                                            )}
                                        </p>
                                        <p className="mt-0.5 text-[9px] text-slate-400 dark:text-zinc-500">
                                            Terhadap pendapatan{' '}
                                            {(
                                                (Math.abs(
                                                    item.displayAmount ??
                                                        item.amount,
                                                ) /
                                                    Math.max(
                                                        incomeStatement.summary
                                                            .total_revenue,
                                                        1,
                                                    )) *
                                                100
                                            ).toFixed(1)}
                                            %
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Matrix Table with Table-Fixed Precision */}
                    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xs dark:border-white/[0.08] dark:bg-[#14161b]">
                        <div className="flex items-center justify-between border-b border-slate-200/70 px-4 py-3 dark:border-white/[0.08]">
                            <div>
                                <h3 className="text-xs font-bold tracking-tight text-slate-900 uppercase dark:text-white">
                                    Laporan Laba Rugi Berjalan (Januari –
                                    Desember {incomeStatement.year})
                                </h3>
                                <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                                    Rincian pendapatan neto jasa hukum dikurangi
                                    seluruh beban operasional dan honor tenaga
                                    kerja bulanan.
                                </p>
                            </div>
                            <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600 dark:bg-zinc-800 dark:text-zinc-300">
                                <Scale className="size-3" />
                                IDR Rupiah
                            </span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[1000px] text-left text-xs">
                                <thead className="border-b border-slate-200/80 bg-slate-50/80 text-[10px] font-bold tracking-wider text-slate-600 uppercase dark:border-white/[0.08] dark:bg-[#121418] dark:text-zinc-400">
                                    <tr>
                                        <th className="sticky left-0 z-20 w-56 bg-slate-50 px-4 py-2.5 dark:bg-[#121418]">
                                            Komponen Keuangan
                                        </th>
                                        {MONTH_NAMES.map((m) => (
                                            <th
                                                key={m}
                                                className="px-2 py-2.5 text-right font-semibold"
                                            >
                                                {m}
                                            </th>
                                        ))}
                                        <th className="sticky right-0 z-20 w-36 bg-slate-50 px-4 py-2.5 text-right font-bold text-slate-900 dark:bg-[#121418] dark:text-white">
                                            Total Tahun
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 font-medium text-slate-700 dark:divide-white/[0.04] dark:text-zinc-300">
                                    {/* 1. Pendapatan */}
                                    <tr className="transition-colors hover:bg-emerald-50/35 dark:hover:bg-emerald-500/[0.035]">
                                        <td className="sticky left-0 z-10 border-l-2 border-emerald-400 bg-white px-4 py-2.5 font-bold text-slate-900 dark:bg-[#14161b] dark:text-white">
                                            1. Pendapatan Jasa Hukum (Neto)
                                        </td>
                                        {incomeStatement.months.map((m) => (
                                            <td
                                                key={m.month}
                                                className="px-2 py-2.5 text-right font-mono text-[11px] tabular-nums"
                                            >
                                                {m.revenue > 0 ? (
                                                    <span className="font-semibold text-slate-900 dark:text-white">
                                                        {formatMoney(
                                                            m.revenue,
                                                            'IDR',
                                                        )}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-300 dark:text-zinc-600">
                                                        -
                                                    </span>
                                                )}
                                            </td>
                                        ))}
                                        <td className="sticky right-0 z-10 bg-white px-4 py-2.5 text-right font-mono font-bold text-slate-950 tabular-nums dark:bg-[#14161b] dark:text-white">
                                            {formatMoney(
                                                incomeStatement.summary
                                                    .total_revenue,
                                                'IDR',
                                            )}
                                        </td>
                                    </tr>

                                    {/* 2. Beban Operasional */}
                                    <tr className="transition-colors hover:bg-amber-50/30 dark:hover:bg-amber-500/[0.025]">
                                        <td className="sticky left-0 z-10 border-l-2 border-amber-300 bg-white px-4 py-2.5 pl-7 text-slate-600 dark:bg-[#14161b] dark:text-zinc-400">
                                            Beban Operasional &amp; Perkara
                                        </td>
                                        {incomeStatement.months.map((m) => (
                                            <td
                                                key={m.month}
                                                className="px-2 py-2.5 text-right font-mono text-[11px] tabular-nums"
                                            >
                                                {m.operational_expense > 0 ? (
                                                    <span className="text-slate-900 dark:text-white">
                                                        {formatMoney(
                                                            m.operational_expense,
                                                            'IDR',
                                                        )}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-300 dark:text-zinc-600">
                                                        -
                                                    </span>
                                                )}
                                            </td>
                                        ))}
                                        <td className="sticky right-0 z-10 bg-white px-4 py-2.5 text-right font-mono font-semibold text-slate-950 tabular-nums dark:bg-[#14161b] dark:text-white">
                                            {formatMoney(
                                                incomeStatement.summary
                                                    .total_operational_expense,
                                                'IDR',
                                            )}
                                        </td>
                                    </tr>

                                    {/* 3. Beban Payroll */}
                                    <tr className="transition-colors hover:bg-amber-50/30 dark:hover:bg-amber-500/[0.025]">
                                        <td className="sticky left-0 z-10 border-l-2 border-amber-300 bg-white px-4 py-2.5 pl-7 text-slate-600 dark:bg-[#14161b] dark:text-zinc-400">
                                            Gaji &amp; Honor Tenaga Kerja
                                        </td>
                                        {incomeStatement.months.map((m) => (
                                            <td
                                                key={m.month}
                                                className="px-2 py-2.5 text-right font-mono text-[11px] tabular-nums"
                                            >
                                                {m.payroll_expense > 0 ? (
                                                    <span className="text-slate-900 dark:text-white">
                                                        {formatMoney(
                                                            m.payroll_expense,
                                                            'IDR',
                                                        )}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-300 dark:text-zinc-600">
                                                        -
                                                    </span>
                                                )}
                                            </td>
                                        ))}
                                        <td className="sticky right-0 z-10 bg-white px-4 py-2.5 text-right font-mono font-semibold text-slate-950 tabular-nums dark:bg-[#14161b] dark:text-white">
                                            {formatMoney(
                                                incomeStatement.summary
                                                    .total_payroll_expense,
                                                'IDR',
                                            )}
                                        </td>
                                    </tr>

                                    {/* Total Beban */}
                                    <tr className="bg-amber-50/35 font-semibold dark:bg-amber-500/[0.045]">
                                        <td className="sticky left-0 z-10 bg-[#fffaf0] px-4 py-2.5 font-bold text-slate-900 dark:bg-[#1b1914] dark:text-white">
                                            Total Beban Operasional
                                        </td>
                                        {incomeStatement.months.map((m) => (
                                            <td
                                                key={m.month}
                                                className="px-2 py-2.5 text-right font-mono text-[11px] tabular-nums"
                                            >
                                                {m.total_expense > 0 ? (
                                                    <span className="font-bold text-slate-950 dark:text-white">
                                                        {formatMoney(
                                                            m.total_expense,
                                                            'IDR',
                                                        )}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-300 dark:text-zinc-600">
                                                        -
                                                    </span>
                                                )}
                                            </td>
                                        ))}
                                        <td className="sticky right-0 z-10 bg-[#fffaf0] px-4 py-2.5 text-right font-mono font-bold text-slate-950 tabular-nums dark:bg-[#1b1914] dark:text-white">
                                            {formatMoney(
                                                incomeStatement.summary
                                                    .total_expenses,
                                                'IDR',
                                            )}
                                        </td>
                                    </tr>

                                    {/* Net Profit Row */}
                                    <tr className="border-t-2 border-blue-500/70 bg-blue-50/55 font-bold dark:border-blue-400/60 dark:bg-blue-500/[0.07]">
                                        <td className="sticky left-0 z-10 bg-[#f3f7ff] px-4 py-3 font-bold tracking-tight text-slate-950 uppercase dark:bg-[#171c25] dark:text-white">
                                            LABA / (RUGI) BERSIH
                                        </td>
                                        {incomeStatement.months.map((m) => {
                                            return (
                                                <td
                                                    key={m.month}
                                                    className="px-2 py-3 text-right font-mono text-[11px] font-bold tabular-nums"
                                                >
                                                    {m.net_profit !== 0 ? (
                                                        <span className="text-slate-950 dark:text-white">
                                                            {formatMoney(
                                                                m.net_profit,
                                                                'IDR',
                                                            )}
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-300 dark:text-zinc-600">
                                                            -
                                                        </span>
                                                    )}
                                                </td>
                                            );
                                        })}
                                        <td className="sticky right-0 z-10 bg-[#f3f7ff] px-4 py-3 text-right font-mono text-sm font-bold tabular-nums dark:bg-[#171c25]">
                                            <span className="text-slate-950 dark:text-white">
                                                {formatMoney(netProfit, 'IDR')}
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 2: ARUS KAS BULANAN */}
            {subTab === 'cash_flow' && (
                <div className="space-y-4">
                    <div className="flex flex-col justify-between gap-2 rounded-xl border border-slate-200/70 bg-white px-4 py-3 sm:flex-row sm:items-center dark:border-white/[0.06] dark:bg-[#14161b]">
                        <div>
                            <p className="text-[10px] font-bold tracking-[0.12em] text-slate-500 uppercase dark:text-zinc-400">
                                Periode Laporan
                            </p>
                            <p className="mt-0.5 text-[10px] text-slate-400 dark:text-zinc-500">
                                Pilih bulan untuk memusatkan analisis arus kas
                            </p>
                        </div>
                        <select
                            value={selectedCashFlowPeriod}
                            onChange={(event) =>
                                setSelectedCashFlowPeriod(event.target.value)
                            }
                            className="h-8 min-w-52 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition-colors outline-none focus:border-blue-400 dark:border-white/10 dark:bg-[#111318] dark:text-zinc-200"
                        >
                            <option value="year">Sepanjang Tahun</option>
                            {incomeStatement.months.map((month) => (
                                <option key={month.month} value={month.month}>
                                    {MONTH_NAMES[month.month - 1]}{' '}
                                    {incomeStatement.year}
                                </option>
                            ))}
                        </select>
                    </div>
                    <section
                        data-testid="cash-flow-summary"
                        className="grid gap-3 rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs lg:grid-cols-5 dark:border-white/[0.06] dark:bg-[#14161b]"
                    >
                        <div className="relative flex min-h-[142px] flex-col justify-between overflow-hidden rounded-xl border border-blue-100 bg-[#eef5ff] p-4 lg:col-span-2 dark:border-blue-400/10 dark:bg-blue-500/[0.06]">
                            <div className="pointer-events-none absolute -top-12 -right-10 size-32 rounded-full border-[20px] border-white/60 dark:border-white/[0.025]" />
                            <div>
                                <p className="relative text-[10px] font-bold tracking-[0.14em] text-blue-600 uppercase dark:text-blue-300">
                                    Arus Kas Bersih · {cashFlowPeriodLabel}
                                </p>
                                <p className="relative mt-1 font-mono text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
                                    {formatMoney(netCashFlow, 'IDR')}
                                </p>
                                <p className="relative mt-1 text-[10px] text-slate-500 dark:text-zinc-400">
                                    Kas masuk setelah pengeluaran operasional
                                </p>
                            </div>
                            <div className="relative mt-4 flex justify-between border-t border-blue-200/60 pt-3 text-[9.5px] font-medium text-slate-500 dark:border-white/[0.06] dark:text-zinc-400">
                                <span>
                                    Rasio Pengeluaran {cashOutRatio.toFixed(1)}%
                                </span>
                                <span className="text-blue-600 dark:text-blue-300">
                                    {netCashFlow >= 0
                                        ? 'Kas Positif'
                                        : 'Kas Negatif'}
                                </span>
                            </div>
                        </div>

                        <div className="flex min-h-[142px] flex-col rounded-xl border border-slate-200/70 bg-slate-50/60 p-4 lg:col-span-3 dark:border-white/[0.06] dark:bg-white/[0.025]">
                            <div>
                                <p className="text-[10px] font-bold tracking-[0.12em] text-slate-500 uppercase dark:text-zinc-400">
                                    Komposisi Arus Kas
                                </p>
                                <p className="mt-0.5 text-[10px] text-slate-400 dark:text-zinc-500">
                                    Perbandingan kas masuk, keluar, dan saldo
                                    bersih
                                </p>
                            </div>
                            <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-slate-200/80 dark:bg-white/[0.07]">
                                <div
                                    className="bg-blue-500"
                                    style={{
                                        width: `${(totalCashIn / cashFlowScale) * 100}%`,
                                    }}
                                />
                                <div
                                    className="bg-amber-400"
                                    style={{
                                        width: `${(totalCashOut / cashFlowScale) * 100}%`,
                                    }}
                                />
                            </div>
                            <div className="mt-3 grid flex-1 divide-y divide-slate-200/70 sm:grid-cols-3 sm:divide-x sm:divide-y-0 dark:divide-white/[0.06]">
                                {[
                                    ['Kas Masuk', totalCashIn],
                                    ['Kas Keluar', totalCashOut],
                                    ['Arus Kas Bersih', netCashFlow],
                                ].map(([label, amount]) => (
                                    <div
                                        key={label}
                                        className="py-2 sm:px-3 sm:py-0"
                                    >
                                        <p className="text-[9px] font-semibold text-slate-400 uppercase dark:text-zinc-500">
                                            {label}
                                        </p>
                                        <p className="mt-1 font-mono text-sm font-bold text-slate-950 dark:text-white">
                                            {formatMoney(Number(amount), 'IDR')}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xs dark:border-white/[0.08] dark:bg-[#14161b]">
                        <div className="flex items-center justify-between border-b border-slate-200/70 px-4 py-3 dark:border-white/[0.08]">
                            <div>
                                <h3 className="text-xs font-bold tracking-tight text-slate-900 uppercase dark:text-white">
                                    Rincian Periode · {cashFlowPeriodLabel}
                                </h3>
                                <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                                    Penerimaan kas bersih masuk dikurangi kas
                                    operasional langsung keluar (Metode
                                    Langsung).
                                </p>
                            </div>
                            <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                                <TrendingUp className="size-3" />
                                Arus Kas Riil
                            </span>
                        </div>

                        <div className="overflow-x-auto">
                            <table
                                className={`w-full text-left text-xs ${selectedCashFlowMonth ? 'min-w-[560px]' : 'min-w-[1000px]'}`}
                            >
                                <thead className="border-b border-slate-200/80 bg-slate-50/80 text-[10px] font-bold tracking-wider text-slate-600 uppercase dark:border-white/[0.08] dark:bg-[#121418] dark:text-zinc-400">
                                    <tr>
                                        <th className="sticky left-0 z-20 w-56 bg-slate-50 px-4 py-2.5 dark:bg-[#121418]">
                                            Arus Kas
                                        </th>
                                        {visibleCashFlowMonths.map((month) => (
                                            <th
                                                key={month.month}
                                                className="px-2 py-2.5 text-right font-semibold"
                                            >
                                                {MONTH_NAMES[month.month - 1]}
                                            </th>
                                        ))}
                                        <th className="sticky right-0 z-20 w-36 bg-slate-50 px-4 py-2.5 text-right font-bold text-slate-900 dark:bg-[#121418] dark:text-white">
                                            {selectedCashFlowMonth
                                                ? 'Total Periode'
                                                : 'Total Tahun'}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 font-medium text-slate-700 dark:divide-white/[0.04] dark:text-zinc-300">
                                    <tr className="font-semibold transition-colors hover:bg-emerald-50/35 dark:hover:bg-emerald-500/[0.035]">
                                        <td className="sticky left-0 z-10 border-l-2 border-emerald-400 bg-white px-4 py-2.5 font-bold text-slate-900 dark:bg-[#14161b] dark:text-white">
                                            (+) Kas Masuk Operasional
                                        </td>
                                        {visibleCashFlowMonths.map((m) => (
                                            <td
                                                key={m.month}
                                                className="px-2 py-2.5 text-right font-mono text-[11px] tabular-nums"
                                            >
                                                {m.revenue > 0 ? (
                                                    <span className="font-semibold text-slate-900 dark:text-white">
                                                        {formatMoney(
                                                            m.revenue,
                                                            'IDR',
                                                        )}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-300 dark:text-zinc-600">
                                                        -
                                                    </span>
                                                )}
                                            </td>
                                        ))}
                                        <td className="sticky right-0 z-10 bg-white px-4 py-2.5 text-right font-mono font-bold text-slate-950 tabular-nums dark:bg-[#14161b] dark:text-white">
                                            {formatMoney(totalCashIn, 'IDR')}
                                        </td>
                                    </tr>

                                    <tr className="font-semibold transition-colors hover:bg-amber-50/40 dark:hover:bg-amber-500/[0.035]">
                                        <td className="sticky left-0 z-10 border-l-2 border-amber-400 bg-white px-4 py-2.5 font-bold text-slate-900 dark:bg-[#14161b] dark:text-white">
                                            (-) Kas Keluar Operasional
                                        </td>
                                        {visibleCashFlowMonths.map((m) => (
                                            <td
                                                key={m.month}
                                                className="px-2 py-2.5 text-right font-mono text-[11px] tabular-nums"
                                            >
                                                {m.total_expense > 0 ? (
                                                    <span className="font-semibold text-slate-900 dark:text-white">
                                                        {formatMoney(
                                                            m.total_expense,
                                                            'IDR',
                                                        )}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-300 dark:text-zinc-600">
                                                        -
                                                    </span>
                                                )}
                                            </td>
                                        ))}
                                        <td className="sticky right-0 z-10 bg-white px-4 py-2.5 text-right font-mono font-bold text-slate-950 tabular-nums dark:bg-[#14161b] dark:text-white">
                                            {formatMoney(totalCashOut, 'IDR')}
                                        </td>
                                    </tr>

                                    {/* Net Cash Flow Row */}
                                    <tr className="border-t-2 border-blue-500/70 bg-blue-50/55 font-bold dark:border-blue-400/60 dark:bg-blue-500/[0.07]">
                                        <td className="sticky left-0 z-10 bg-[#f3f7ff] px-4 py-3 font-bold tracking-tight text-slate-950 uppercase dark:bg-[#171c25] dark:text-white">
                                            ARUS KAS BERSIH BULANAN
                                        </td>
                                        {visibleCashFlowMonths.map((m) => {
                                            const netCash =
                                                m.revenue - m.total_expense;

                                            return (
                                                <td
                                                    key={m.month}
                                                    className="px-2 py-3 text-right font-mono text-[11px] font-bold tabular-nums"
                                                >
                                                    {netCash !== 0 ? (
                                                        <span className="text-slate-950 dark:text-white">
                                                            {formatMoney(
                                                                netCash,
                                                                'IDR',
                                                            )}
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-300 dark:text-zinc-600">
                                                            -
                                                        </span>
                                                    )}
                                                </td>
                                            );
                                        })}
                                        <td className="sticky right-0 z-10 bg-[#f3f7ff] px-4 py-3 text-right font-mono text-sm font-bold tabular-nums dark:bg-[#171c25]">
                                            <span className="text-slate-950 dark:text-white">
                                                {formatMoney(
                                                    netCashFlow,
                                                    'IDR',
                                                )}
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 3: NERACA POSISI KEUANGAN */}
            {subTab === 'balance_sheet' && (
                <div className="space-y-4">
                    <section
                        data-testid="balance-position-summary"
                        className="grid gap-3 rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs lg:grid-cols-5 dark:border-white/[0.06] dark:bg-[#14161b]"
                    >
                        <div className="relative flex min-h-[130px] flex-col justify-between overflow-hidden rounded-xl border border-blue-100 bg-[#eef5ff] p-4 lg:col-span-2 dark:border-blue-400/10 dark:bg-blue-500/[0.06]">
                            <div className="pointer-events-none absolute -top-12 -right-10 size-32 rounded-full border-[20px] border-white/60 dark:border-white/[0.025]" />
                            <div>
                                <p className="relative text-[10px] font-bold tracking-[0.14em] text-blue-600 uppercase dark:text-blue-300">
                                    Posisi Neraca{' '}
                                    {balanceSheet.is_balanced
                                        ? 'Seimbang'
                                        : 'Belum Seimbang'}
                                </p>
                                <p className="relative mt-1 font-mono text-2xl font-bold text-slate-950 dark:text-white">
                                    {formatMoney(
                                        balanceSheet.assets.total_assets,
                                        'IDR',
                                    )}
                                </p>
                                <p className="relative mt-1 text-[10px] text-slate-500 dark:text-zinc-400">
                                    Total posisi keuangan firma
                                </p>
                            </div>
                            <p className="relative mt-3 border-t border-blue-200/60 pt-3 text-[9.5px] text-slate-500 dark:border-white/[0.06] dark:text-zinc-400">
                                Aset = Kewajiban + Ekuitas
                            </p>
                        </div>
                        <div className="grid overflow-hidden rounded-xl border border-slate-200/70 bg-slate-50/60 sm:grid-cols-2 lg:col-span-3 dark:border-white/[0.06] dark:bg-white/[0.025]">
                            <div className="flex flex-col justify-center border-b border-slate-200/70 p-4 sm:border-r sm:border-b-0 dark:border-white/[0.06]">
                                <p className="text-[10px] font-bold tracking-[0.12em] text-slate-400 uppercase">
                                    Total Aset
                                </p>
                                <p className="mt-1 font-mono text-xl font-bold text-slate-950 dark:text-white">
                                    {formatMoney(
                                        balanceSheet.assets.total_assets,
                                        'IDR',
                                    )}
                                </p>
                                <div className="mt-3 h-1.5 rounded-full bg-blue-500" />
                            </div>
                            <div className="flex flex-col justify-center p-4">
                                <p className="text-[10px] font-bold tracking-[0.12em] text-slate-400 uppercase">
                                    Total Pasiva
                                </p>
                                <p className="mt-1 font-mono text-xl font-bold text-slate-950 dark:text-white">
                                    {formatMoney(
                                        balanceSheet.equity
                                            .total_liabilities_and_equity,
                                        'IDR',
                                    )}
                                </p>
                                <div className="mt-3 h-1.5 rounded-full bg-slate-500" />
                            </div>
                        </div>
                    </section>

                    <div className="grid grid-cols-1 overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-2xs md:grid-cols-2 md:divide-x md:divide-slate-200/80 dark:border-white/[0.08] dark:bg-[#14161b] dark:md:divide-white/[0.08]">
                        {/* ASET (AKTIVA) */}
                        <div className="min-w-0">
                            <div className="flex min-h-14 items-center justify-between border-b border-blue-100/80 bg-blue-50/45 px-5 py-3 dark:border-blue-400/10 dark:bg-blue-500/[0.045]">
                                <div>
                                    <h3 className="text-xs font-bold tracking-[0.08em] text-slate-900 uppercase dark:text-white">
                                        ASET / AKTIVA
                                    </h3>
                                    <p className="mt-0.5 text-[10px] text-slate-400 dark:text-zinc-500">
                                        Sumber daya yang dikuasai firma
                                    </p>
                                </div>
                                <span className="font-mono text-sm font-bold text-slate-950 dark:text-white">
                                    {formatMoney(
                                        balanceSheet.assets.total_assets,
                                        'IDR',
                                    )}
                                </span>
                            </div>

                            <div className="p-5 text-xs">
                                <div className="flex min-h-11 items-center justify-between gap-4 border-b border-slate-100 dark:border-white/[0.05]">
                                    <span className="text-slate-600 dark:text-zinc-300">
                                        Kas &amp; Bank Operasional Tersedia
                                    </span>
                                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                                        {formatMoney(
                                            balanceSheet.assets
                                                .operational_cash_bank,
                                            'IDR',
                                        )}
                                    </span>
                                </div>
                                <div className="flex min-h-11 items-center justify-between gap-4 border-b border-slate-100 dark:border-white/[0.05]">
                                    <span className="text-slate-600 dark:text-zinc-300">
                                        Dana Titipan Klien di Bank (Escrow)
                                    </span>
                                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                                        {formatMoney(
                                            balanceSheet.assets
                                                .client_trust_bank,
                                            'IDR',
                                        )}
                                    </span>
                                </div>
                                <div className="flex min-h-11 items-center justify-between gap-4 border-b border-slate-100 dark:border-white/[0.05]">
                                    <span className="text-slate-600 dark:text-zinc-300">
                                        Pajak Dipotong Klien (Kredit Pajak PPh
                                        23)
                                    </span>
                                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                                        {formatMoney(
                                            balanceSheet.assets
                                                .tax_credit_pph23,
                                            'IDR',
                                        )}
                                    </span>
                                </div>

                                <div className="mt-4 flex min-h-12 items-center justify-between border-t-2 border-blue-500/70 bg-blue-50/45 px-3 font-bold text-slate-950 dark:border-blue-400/60 dark:bg-blue-500/[0.05] dark:text-white">
                                    <span className="tracking-[0.08em] uppercase">
                                        TOTAL ASET
                                    </span>
                                    <span className="font-mono text-sm">
                                        {formatMoney(
                                            balanceSheet.assets.total_assets,
                                            'IDR',
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* KEWAJIBAN & EKUITAS (PASIVA) */}
                        <div className="min-w-0 border-t border-slate-200/80 md:border-t-0 dark:border-white/[0.08]">
                            <div className="flex min-h-14 items-center justify-between border-b border-indigo-100/80 bg-indigo-50/35 px-5 py-3 dark:border-indigo-400/10 dark:bg-indigo-500/[0.04]">
                                <div>
                                    <h3 className="text-xs font-bold tracking-[0.08em] text-slate-900 uppercase dark:text-white">
                                        KEWAJIBAN &amp; EKUITAS (PASIVA)
                                    </h3>
                                    <p className="mt-0.5 text-[10px] text-slate-400 dark:text-zinc-500">
                                        Sumber pendanaan aset firma
                                    </p>
                                </div>
                                <span className="font-mono text-sm font-bold text-slate-950 dark:text-white">
                                    {formatMoney(
                                        balanceSheet.equity
                                            .total_liabilities_and_equity,
                                        'IDR',
                                    )}
                                </span>
                            </div>

                            <div className="p-5 text-xs">
                                <div className="pb-1 text-[10px] font-bold tracking-[0.12em] text-slate-400 uppercase">
                                    1. Kewajiban (Liabilities)
                                </div>
                                <div className="flex min-h-10 items-center justify-between gap-4 border-b border-slate-100 dark:border-white/[0.05]">
                                    <span className="text-slate-600 dark:text-zinc-300">
                                        Talangan / Utang kepada Partner
                                    </span>
                                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                                        {formatMoney(
                                            balanceSheet.liabilities
                                                .partner_advances_due,
                                            'IDR',
                                        )}
                                    </span>
                                </div>
                                <div className="flex min-h-10 items-center justify-between gap-4 border-b border-slate-100 dark:border-white/[0.05]">
                                    <span className="text-slate-600 dark:text-zinc-300">
                                        Utang Gaji yang Belum Dibayar
                                    </span>
                                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                                        {formatMoney(
                                            balanceSheet.liabilities
                                                .unpaid_payroll,
                                            'IDR',
                                        )}
                                    </span>
                                </div>
                                <div className="flex min-h-10 items-center justify-between gap-4 border-b border-slate-100 dark:border-white/[0.05]">
                                    <span className="text-slate-600 dark:text-zinc-300">
                                        Dana Titipan Milik Klien
                                    </span>
                                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                                        {formatMoney(
                                            balanceSheet.liabilities
                                                .client_trust_liability,
                                            'IDR',
                                        )}
                                    </span>
                                </div>

                                <div className="pt-4 pb-1 text-[10px] font-bold tracking-[0.12em] text-slate-400 uppercase">
                                    2. Ekuitas Firma
                                </div>
                                <div className="flex min-h-10 items-center justify-between gap-4 border-b border-slate-100 dark:border-white/[0.05]">
                                    <span className="text-slate-600 dark:text-zinc-300">
                                        Ekuitas Firma / Saldo Laba Ditahan
                                    </span>
                                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                                        {formatMoney(
                                            balanceSheet.equity
                                                .retained_earnings,
                                            'IDR',
                                        )}
                                    </span>
                                </div>

                                <div className="mt-4 flex min-h-12 items-center justify-between border-t-2 border-indigo-400/70 bg-indigo-50/35 px-3 font-bold text-slate-950 dark:border-indigo-400/55 dark:bg-indigo-500/[0.045] dark:text-white">
                                    <span className="tracking-[0.08em] uppercase">
                                        TOTAL KEWAJIBAN &amp; EKUITAS
                                    </span>
                                    <span className="font-mono text-sm">
                                        {formatMoney(
                                            balanceSheet.equity
                                                .total_liabilities_and_equity,
                                            'IDR',
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
