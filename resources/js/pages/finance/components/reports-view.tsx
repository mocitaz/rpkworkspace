import { useState } from 'react';
import {
    ArrowDownLeft,
    ArrowUpRight,
    BarChart3,
    CheckCircle2,
    DollarSign,
    Layers,
    Receipt,
    Scale,
    TrendingDown,
    TrendingUp,
    Users,
    WalletCards,
} from 'lucide-react';
import { formatMoney } from '@/lib/format';

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

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

export function ReportsView({
    incomeStatement,
    balanceSheet,
}: {
    incomeStatement: IncomeStatementData;
    balanceSheet: BalanceSheetData;
}) {
    const [subTab, setSubTab] = useState<'income_statement' | 'cash_flow' | 'balance_sheet'>('income_statement');

    const netProfit = incomeStatement.summary.net_profit;
    const isProfit = netProfit >= 0;
    const netMarginPercent =
        incomeStatement.summary.total_revenue > 0
            ? Math.round((netProfit / incomeStatement.summary.total_revenue) * 100)
            : 0;

    return (
        <div className="space-y-4">
            {/* Sub Tabs for Financial Reports */}
            <div className="flex [scrollbar-width:none] items-center gap-1 overflow-x-auto border-b border-slate-200/60 pb-2 [-ms-overflow-style:none] dark:border-white/[0.06] [&::-webkit-scrollbar]:hidden">
                <button
                    type="button"
                    onClick={() => setSubTab('income_statement')}
                    className={`flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
                        subTab === 'income_statement'
                            ? 'bg-emerald-600 text-white shadow-2xs'
                            : 'border border-slate-200/70 bg-white text-emerald-700 hover:bg-emerald-50/50 dark:border-white/[0.06] dark:bg-[#14161b] dark:text-emerald-400'
                    }`}
                >
                    <BarChart3 className="size-3" />
                    Laba Rugi Bulanan
                </button>
                <button
                    type="button"
                    onClick={() => setSubTab('cash_flow')}
                    className={`flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
                        subTab === 'cash_flow'
                            ? 'bg-blue-600 text-white shadow-2xs'
                            : 'border border-slate-200/70 bg-white text-blue-700 hover:bg-blue-50/50 dark:border-white/[0.06] dark:bg-[#14161b] dark:text-blue-400'
                    }`}
                >
                    <TrendingUp className="size-3" />
                    Arus Kas Bulanan
                </button>
                <button
                    type="button"
                    onClick={() => setSubTab('balance_sheet')}
                    className={`flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
                        subTab === 'balance_sheet'
                            ? 'bg-purple-600 text-white shadow-2xs'
                            : 'border border-slate-200/70 bg-white text-purple-700 hover:bg-purple-50/50 dark:border-white/[0.06] dark:bg-[#14161b] dark:text-purple-400'
                    }`}
                >
                    <Scale className="size-3" />
                    Neraca Posisi Keuangan
                </button>
            </div>

            {/* TAB 1: LABA RUGI BULANAN */}
            {subTab === 'income_statement' && (
                <div className="space-y-4">
                    {/* Executive Clean KPI Cards (No harsh black boxes) */}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {/* 1. Pendapatan */}
                        <div className="group relative rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.08] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase dark:text-zinc-400">
                                    Total Pendapatan Jasa
                                </span>
                                <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                                    <Receipt className="size-3.5" />
                                </div>
                            </div>
                            <div className="mt-2 flex items-baseline justify-between">
                                <p className="font-mono text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    {formatMoney(incomeStatement.summary.total_revenue, 'IDR')}
                                </p>
                            </div>
                            <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[10.5px] text-slate-500 dark:border-white/[0.04]">
                                <span>Honorarium &amp; Retainer</span>
                                <span className="font-semibold text-emerald-600 dark:text-emerald-400">12 Bulan</span>
                            </div>
                        </div>

                        {/* 2. Beban Operasional */}
                        <div className="group relative rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.08] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase dark:text-zinc-400">
                                    Beban Operasional &amp; Perkara
                                </span>
                                <div className="flex size-7 items-center justify-center rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
                                    <WalletCards className="size-3.5" />
                                </div>
                            </div>
                            <div className="mt-2 flex items-baseline justify-between">
                                <p className="font-mono text-xl font-bold tracking-tight text-rose-600 dark:text-rose-400">
                                    {formatMoney(incomeStatement.summary.total_operational_expense, 'IDR')}
                                </p>
                            </div>
                            <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[10.5px] text-slate-500 dark:border-white/[0.04]">
                                <span>Rutin Kantor &amp; Perkara</span>
                                <span className="font-semibold text-rose-600 dark:text-rose-400">Biaya Riil</span>
                            </div>
                        </div>

                        {/* 3. Beban Payroll */}
                        <div className="group relative rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.08] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase dark:text-zinc-400">
                                    Beban Payroll &amp; Honor
                                </span>
                                <div className="flex size-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                                    <Users className="size-3.5" />
                                </div>
                            </div>
                            <div className="mt-2 flex items-baseline justify-between">
                                <p className="font-mono text-xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400">
                                    {formatMoney(incomeStatement.summary.total_payroll_expense, 'IDR')}
                                </p>
                            </div>
                            <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[10.5px] text-slate-500 dark:border-white/[0.04]">
                                <span>Gaji Staf &amp; Honor Advokat</span>
                                <span className="font-semibold text-indigo-600 dark:text-indigo-400">Tenaga Kerja</span>
                            </div>
                        </div>

                        {/* 4. Laba Bersih (Clean Premium Highlight, No Harsh Dark Card) */}
                        <div className="group relative rounded-2xl border border-emerald-300/80 bg-gradient-to-br from-emerald-50/70 via-emerald-50/30 to-white p-4 shadow-xs dark:border-emerald-500/30 dark:from-emerald-950/30 dark:via-[#14161b] dark:to-[#14161b]">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold tracking-wider text-emerald-800 uppercase dark:text-emerald-300">
                                    Laba Bersih Tahun {incomeStatement.year}
                                </span>
                                <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300">
                                    <TrendingUp className="size-3.5" />
                                </div>
                            </div>
                            <div className="mt-2 flex items-baseline justify-between">
                                <p className="font-mono text-xl font-bold tracking-tight text-emerald-700 dark:text-emerald-400">
                                    {formatMoney(netProfit, 'IDR')}
                                </p>
                            </div>
                            <div className="mt-2.5 flex items-center justify-between border-t border-emerald-100/80 pt-2 text-[10.5px] text-emerald-700/80 dark:border-emerald-500/20 dark:text-emerald-300/80">
                                <span>Margin Bersih: {netMarginPercent}%</span>
                                <span className="font-bold text-emerald-700 dark:text-emerald-300">Surplus</span>
                            </div>
                        </div>
                    </div>

                    {/* Matrix Table with Table-Fixed Precision */}
                    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xs dark:border-white/[0.08] dark:bg-[#14161b]">
                        <div className="flex items-center justify-between border-b border-slate-200/70 px-4 py-3 dark:border-white/[0.08]">
                            <div>
                                <h3 className="text-xs font-bold tracking-tight text-slate-900 uppercase dark:text-white">
                                    Laporan Laba Rugi Berjalan (Januari – Desember {incomeStatement.year})
                                </h3>
                                <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                                    Rincian pendapatan neto jasa hukum dikurangi seluruh beban operasional dan honor tenaga kerja bulanan.
                                </p>
                            </div>
                            <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600 dark:bg-zinc-800 dark:text-zinc-300">
                                <Scale className="size-3" />
                                IDR Rupiah
                            </span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-[1000px] w-full text-left text-xs">
                                <thead className="border-b border-slate-200/80 bg-slate-50/80 text-[10px] font-bold tracking-wider text-slate-600 uppercase dark:border-white/[0.08] dark:bg-[#121418] dark:text-zinc-400">
                                    <tr>
                                        <th className="w-56 px-4 py-2.5">Komponen Keuangan</th>
                                        {MONTH_NAMES.map((m) => (
                                            <th key={m} className="px-2 py-2.5 text-right font-semibold">
                                                {m}
                                            </th>
                                        ))}
                                        <th className="w-36 px-4 py-2.5 text-right font-bold text-slate-900 dark:text-white">
                                            Total Tahun
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 font-medium text-slate-700 dark:divide-white/[0.04] dark:text-zinc-300">
                                    {/* 1. Pendapatan */}
                                    <tr className="bg-emerald-50/30 transition-colors hover:bg-emerald-50/50 dark:bg-emerald-500/5 dark:hover:bg-emerald-500/10">
                                        <td className="px-4 py-2.5 font-bold text-emerald-800 dark:text-emerald-300">
                                            1. Pendapatan Jasa Hukum (Neto)
                                        </td>
                                        {incomeStatement.months.map((m) => (
                                            <td key={m.month} className="px-2 py-2.5 text-right font-mono text-[11px] tabular-nums">
                                                {m.revenue > 0 ? (
                                                    <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                                                        {formatMoney(m.revenue, 'IDR')}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-300 dark:text-zinc-600">-</span>
                                                )}
                                            </td>
                                        ))}
                                        <td className="px-4 py-2.5 text-right font-mono font-bold text-emerald-700 tabular-nums dark:text-emerald-400">
                                            {formatMoney(incomeStatement.summary.total_revenue, 'IDR')}
                                        </td>
                                    </tr>

                                    {/* 2. Beban Operasional */}
                                    <tr className="transition-colors hover:bg-slate-50/60 dark:hover:bg-white/[0.02]">
                                        <td className="px-4 py-2.5 pl-7 text-slate-600 dark:text-zinc-400">
                                            Beban Operasional &amp; Perkara
                                        </td>
                                        {incomeStatement.months.map((m) => (
                                            <td key={m.month} className="px-2 py-2.5 text-right font-mono text-[11px] tabular-nums">
                                                {m.operational_expense > 0 ? (
                                                    <span className="text-rose-600 dark:text-rose-400">
                                                        {formatMoney(m.operational_expense, 'IDR')}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-300 dark:text-zinc-600">-</span>
                                                )}
                                            </td>
                                        ))}
                                        <td className="px-4 py-2.5 text-right font-mono font-semibold text-rose-600 tabular-nums dark:text-rose-400">
                                            {formatMoney(incomeStatement.summary.total_operational_expense, 'IDR')}
                                        </td>
                                    </tr>

                                    {/* 3. Beban Payroll */}
                                    <tr className="transition-colors hover:bg-slate-50/60 dark:hover:bg-white/[0.02]">
                                        <td className="px-4 py-2.5 pl-7 text-slate-600 dark:text-zinc-400">
                                            Gaji &amp; Honor Tenaga Kerja
                                        </td>
                                        {incomeStatement.months.map((m) => (
                                            <td key={m.month} className="px-2 py-2.5 text-right font-mono text-[11px] tabular-nums">
                                                {m.payroll_expense > 0 ? (
                                                    <span className="text-indigo-600 dark:text-indigo-400">
                                                        {formatMoney(m.payroll_expense, 'IDR')}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-300 dark:text-zinc-600">-</span>
                                                )}
                                            </td>
                                        ))}
                                        <td className="px-4 py-2.5 text-right font-mono font-semibold text-indigo-600 tabular-nums dark:text-indigo-400">
                                            {formatMoney(incomeStatement.summary.total_payroll_expense, 'IDR')}
                                        </td>
                                    </tr>

                                    {/* Total Beban */}
                                    <tr className="bg-rose-50/25 font-semibold transition-colors hover:bg-rose-50/40 dark:bg-rose-500/5 dark:hover:bg-rose-500/10">
                                        <td className="px-4 py-2.5 font-bold text-rose-800 dark:text-rose-300">
                                            Total Beban Operasional
                                        </td>
                                        {incomeStatement.months.map((m) => (
                                            <td key={m.month} className="px-2 py-2.5 text-right font-mono text-[11px] tabular-nums">
                                                {m.total_expense > 0 ? (
                                                    <span className="font-bold text-rose-700 dark:text-rose-300">
                                                        {formatMoney(m.total_expense, 'IDR')}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-300 dark:text-zinc-600">-</span>
                                                )}
                                            </td>
                                        ))}
                                        <td className="px-4 py-2.5 text-right font-mono font-bold text-rose-700 tabular-nums dark:text-rose-300">
                                            {formatMoney(incomeStatement.summary.total_expenses, 'IDR')}
                                        </td>
                                    </tr>

                                    {/* Net Profit Row (Clean Emerald Strip, NO Harsh Black) */}
                                    <tr className="border-t-2 border-emerald-500/80 bg-emerald-100/40 font-bold transition-colors hover:bg-emerald-100/60 dark:border-emerald-500 dark:bg-emerald-950/40 dark:hover:bg-emerald-950/60">
                                        <td className="px-4 py-3 font-bold tracking-tight text-emerald-950 uppercase dark:text-emerald-200">
                                            LABA / (RUGI) BERSIH
                                        </td>
                                        {incomeStatement.months.map((m) => {
                                            const isMProfit = m.net_profit >= 0;
                                            return (
                                                <td key={m.month} className="px-2 py-3 text-right font-mono text-[11px] font-bold tabular-nums">
                                                    {m.net_profit !== 0 ? (
                                                        <span
                                                            className={
                                                                isMProfit
                                                                    ? 'text-emerald-800 dark:text-emerald-300'
                                                                    : 'text-rose-700 dark:text-rose-400'
                                                            }
                                                        >
                                                            {formatMoney(m.net_profit, 'IDR')}
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-300 dark:text-zinc-600">-</span>
                                                    )}
                                                </td>
                                            );
                                        })}
                                        <td className="px-4 py-3 text-right font-mono text-sm font-bold tabular-nums">
                                            <span
                                                className={
                                                    isProfit
                                                        ? 'text-emerald-900 dark:text-emerald-300'
                                                        : 'text-rose-700 dark:text-rose-400'
                                                }
                                            >
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
                    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xs dark:border-white/[0.08] dark:bg-[#14161b]">
                        <div className="flex items-center justify-between border-b border-slate-200/70 px-4 py-3 dark:border-white/[0.08]">
                            <div>
                                <h3 className="text-xs font-bold tracking-tight text-slate-900 uppercase dark:text-white">
                                    Laporan Arus Kas Operasional ({incomeStatement.year})
                                </h3>
                                <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                                    Penerimaan kas bersih masuk dikurangi kas operasional langsung keluar (Metode Langsung).
                                </p>
                            </div>
                            <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                                <TrendingUp className="size-3" />
                                Arus Kas Riil
                            </span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-[1000px] w-full text-left text-xs">
                                <thead className="border-b border-slate-200/80 bg-slate-50/80 text-[10px] font-bold tracking-wider text-slate-600 uppercase dark:border-white/[0.08] dark:bg-[#121418] dark:text-zinc-400">
                                    <tr>
                                        <th className="w-56 px-4 py-2.5">Arus Kas</th>
                                        {MONTH_NAMES.map((m) => (
                                            <th key={m} className="px-2 py-2.5 text-right font-semibold">
                                                {m}
                                            </th>
                                        ))}
                                        <th className="w-36 px-4 py-2.5 text-right font-bold text-slate-900 dark:text-white">
                                            Total Tahun
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 font-medium text-slate-700 dark:divide-white/[0.04] dark:text-zinc-300">
                                    <tr className="bg-emerald-50/20 font-semibold transition-colors hover:bg-emerald-50/40 dark:bg-emerald-500/5">
                                        <td className="px-4 py-2.5 text-emerald-800 dark:text-emerald-300">
                                            (+) Kas Masuk Operasional
                                        </td>
                                        {incomeStatement.months.map((m) => (
                                            <td key={m.month} className="px-2 py-2.5 text-right font-mono text-[11px] tabular-nums">
                                                {m.revenue > 0 ? (
                                                    <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                                                        {formatMoney(m.revenue, 'IDR')}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-300 dark:text-zinc-600">-</span>
                                                )}
                                            </td>
                                        ))}
                                        <td className="px-4 py-2.5 text-right font-mono font-bold text-emerald-700 tabular-nums dark:text-emerald-400">
                                            {formatMoney(incomeStatement.summary.total_revenue, 'IDR')}
                                        </td>
                                    </tr>

                                    <tr className="bg-rose-50/20 font-semibold transition-colors hover:bg-rose-50/40 dark:bg-rose-500/5">
                                        <td className="px-4 py-2.5 text-rose-800 dark:text-rose-300">
                                            (-) Kas Keluar Operasional
                                        </td>
                                        {incomeStatement.months.map((m) => (
                                            <td key={m.month} className="px-2 py-2.5 text-right font-mono text-[11px] tabular-nums">
                                                {m.total_expense > 0 ? (
                                                    <span className="font-semibold text-rose-600 dark:text-rose-400">
                                                        {formatMoney(m.total_expense, 'IDR')}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-300 dark:text-zinc-600">-</span>
                                                )}
                                            </td>
                                        ))}
                                        <td className="px-4 py-2.5 text-right font-mono font-bold text-rose-600 tabular-nums dark:text-rose-400">
                                            {formatMoney(incomeStatement.summary.total_expenses, 'IDR')}
                                        </td>
                                    </tr>

                                    {/* Net Cash Flow Row */}
                                    <tr className="border-t-2 border-blue-500/80 bg-blue-50/60 font-bold transition-colors hover:bg-blue-50/80 dark:border-blue-500 dark:bg-blue-950/40">
                                        <td className="px-4 py-3 font-bold tracking-tight text-blue-950 uppercase dark:text-blue-200">
                                            ARUS KAS BERSIH BULANAN
                                        </td>
                                        {incomeStatement.months.map((m) => {
                                            const netCash = m.revenue - m.total_expense;
                                            return (
                                                <td key={m.month} className="px-2 py-3 text-right font-mono text-[11px] font-bold tabular-nums">
                                                    {netCash !== 0 ? (
                                                        <span
                                                            className={
                                                                netCash >= 0
                                                                    ? 'text-emerald-700 dark:text-emerald-400'
                                                                    : 'text-rose-600 dark:text-rose-400'
                                                            }
                                                        >
                                                            {formatMoney(netCash, 'IDR')}
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-300 dark:text-zinc-600">-</span>
                                                    )}
                                                </td>
                                            );
                                        })}
                                        <td className="px-4 py-3 text-right font-mono text-sm font-bold tabular-nums">
                                            <span
                                                className={
                                                    isProfit
                                                        ? 'text-emerald-800 dark:text-emerald-300'
                                                        : 'text-rose-600 dark:text-rose-400'
                                                }
                                            >
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

            {/* TAB 3: NERACA POSISI KEUANGAN */}
            {subTab === 'balance_sheet' && (
                <div className="space-y-4">
                    {/* Status Balance Alert */}
                    <div className="flex items-center justify-between rounded-xl border border-emerald-200/80 bg-emerald-50/60 px-4 py-2.5 text-xs font-semibold text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
                            <span>Posisi Neraca: <strong>Total Aktiva (Aset) = Total Pasiva (Kewajiban + Ekuitas)</strong></span>
                        </div>
                        <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-300">100% Seimbang</span>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {/* ASET (AKTIVA) */}
                        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xs dark:border-white/[0.08] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between border-b border-blue-100/80 bg-blue-50/50 px-4 py-3 dark:border-blue-500/10 dark:bg-blue-500/5">
                                <div className="flex items-center gap-2">
                                    <div className="flex size-6 items-center justify-center rounded-md bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                                        <Scale className="size-3.5" />
                                    </div>
                                    <h3 className="text-xs font-bold text-blue-900 uppercase dark:text-blue-300">
                                        ASET / AKTIVA
                                    </h3>
                                </div>
                                <span className="font-mono text-sm font-bold text-blue-700 dark:text-blue-400">
                                    {formatMoney(balanceSheet.assets.total_assets, 'IDR')}
                                </span>
                            </div>

                            <div className="p-4 space-y-3 text-xs">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-white/[0.04]">
                                    <span className="text-slate-600 dark:text-zinc-300">Kas &amp; Bank Operasional Tersedia</span>
                                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                                        {formatMoney(balanceSheet.assets.operational_cash_bank, 'IDR')}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-white/[0.04]">
                                    <span className="text-slate-600 dark:text-zinc-300">Dana Titipan Klien di Bank (Escrow)</span>
                                    <span className="font-mono font-bold text-purple-600 dark:text-purple-400">
                                        {formatMoney(balanceSheet.assets.client_trust_bank, 'IDR')}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-white/[0.04]">
                                    <span className="text-slate-600 dark:text-zinc-300">Pajak Dipotong Klien (Kredit Pajak PPh 23)</span>
                                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                                        {formatMoney(balanceSheet.assets.tax_credit_pph23, 'IDR')}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between rounded-xl bg-blue-50/70 p-3 font-bold text-blue-900 dark:bg-blue-950/40 dark:text-blue-300">
                                    <span className="uppercase tracking-wider">TOTAL ASET</span>
                                    <span className="font-mono text-sm">{formatMoney(balanceSheet.assets.total_assets, 'IDR')}</span>
                                </div>
                            </div>
                        </div>

                        {/* KEWAJIBAN & EKUITAS (PASIVA) */}
                        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xs dark:border-white/[0.08] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between border-b border-purple-100/80 bg-purple-50/50 px-4 py-3 dark:border-purple-500/10 dark:bg-purple-500/5">
                                <div className="flex items-center gap-2">
                                    <div className="flex size-6 items-center justify-center rounded-md bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300">
                                        <Layers className="size-3.5" />
                                    </div>
                                    <h3 className="text-xs font-bold text-purple-900 uppercase dark:text-purple-300">
                                        KEWAJIBAN &amp; EKUITAS (PASIVA)
                                    </h3>
                                </div>
                                <span className="font-mono text-sm font-bold text-purple-700 dark:text-purple-400">
                                    {formatMoney(balanceSheet.equity.total_liabilities_and_equity, 'IDR')}
                                </span>
                            </div>

                            <div className="p-4 space-y-3 text-xs">
                                <div className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
                                    1. Kewajiban (Liabilities)
                                </div>
                                <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-white/[0.04]">
                                    <span className="text-slate-600 dark:text-zinc-300">Talangan / Utang kepada Partner</span>
                                    <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                                        {formatMoney(balanceSheet.liabilities.partner_advances_due, 'IDR')}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-white/[0.04]">
                                    <span className="text-slate-600 dark:text-zinc-300">Utang Gaji yang Belum Dibayar</span>
                                    <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
                                        {formatMoney(balanceSheet.liabilities.unpaid_payroll, 'IDR')}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-white/[0.04]">
                                    <span className="text-slate-600 dark:text-zinc-300">Dana Titipan Milik Klien</span>
                                    <span className="font-mono font-bold text-purple-600 dark:text-purple-400">
                                        {formatMoney(balanceSheet.liabilities.client_trust_liability, 'IDR')}
                                    </span>
                                </div>

                                <div className="pt-2 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
                                    2. Ekuitas Firma
                                </div>
                                <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-white/[0.04]">
                                    <span className="text-slate-600 dark:text-zinc-300">Ekuitas Firma / Saldo Laba Ditahan</span>
                                    <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                                        {formatMoney(balanceSheet.equity.retained_earnings, 'IDR')}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between rounded-xl bg-purple-50/70 p-3 font-bold text-purple-900 dark:bg-purple-950/40 dark:text-purple-300">
                                    <span className="uppercase tracking-wider">TOTAL KEWAJIBAN &amp; EKUITAS</span>
                                    <span className="font-mono text-sm">{formatMoney(balanceSheet.equity.total_liabilities_and_equity, 'IDR')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
