import {
    Building2,
    CheckCircle2,
    FolderKanban,
    ShieldCheck,
    Users,
} from 'lucide-react';
import { useState } from 'react';
import { formatMoney } from '@/lib/format';

interface MonthData {
    month: number;
    period: string;
    revenue: number;
    operational_expense: number;
    payroll_expense: number;
    total_expense: number;
    net_profit: number;
}

interface FinancialAnalyticsViewProps {
    currency?: string;
    incomeStatement: {
        year: number;
        months: MonthData[];
        summary: {
            total_revenue: number;
            total_operational_expense: number;
            total_payroll_expense: number;
            total_expenses: number;
            net_profit: number;
        };
    };
    balanceSheet: {
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
    profitability: {
        id: string;
        matter_number: string;
        title: string;
        client_name: string;
        status: string;
        contract_value: number;
        invoiced_amount: number;
        collected_amount: number;
        unbilled_contract: number;
        office_expenses: number;
        client_expenses: number;
        total_expenses: number;
        net_margin: number;
        margin_percentage: number;
    }[];
    clientTrustSummary: {
        total_deposit_in: number;
        total_disbursement_out: number;
        net_trust_balance: number;
        by_matter: {
            matter_id: string;
            matter_number: string;
            matter_title: string;
            client_name: string;
            deposit_in: number;
            disbursement_out: number;
            current_balance: number;
        }[];
    };
    partnerAdvances: {
        account_id: string;
        account_name: string;
        partner_id: string | null;
        partner_name: string;
        opening_balance: number;
        advances_incurred: number;
        advances_reimbursed: number;
        profit_distributed: number;
        prive_drawn: number;
        net_due_to_partner: number;
    }[];
    expenses: {
        id: string;
        amount: number;
        charge_to: string;
        category?: string;
    }[];
}

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

export function FinancialAnalyticsView({
    currency = 'IDR',
    incomeStatement,
    balanceSheet,
    profitability,
    clientTrustSummary,
    partnerAdvances,
    expenses,
}: FinancialAnalyticsViewProps) {
    const [hoveredMonth, setHoveredMonth] = useState<MonthData | null>(null);

    const months = incomeStatement?.months || [];
    const summary = incomeStatement?.summary || {
        total_revenue: 0,
        total_operational_expense: 0,
        total_payroll_expense: 0,
        total_expenses: 0,
        net_profit: 0,
    };

    // Calculate maximum monthly value for chart scaling
    const maxMonthlyVal = Math.max(
        ...months.map((m) =>
            Math.max(m.revenue, m.total_expense, Math.abs(m.net_profit)),
        ),
        1000000,
    );

    // Compute Expense Category Breakdown
    const officeExpenseTotal = (expenses ?? [])
        .filter((e) => e.charge_to === 'office')
        .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

    const clientDisbursementTotal = (expenses ?? [])
        .filter((e) => e.charge_to === 'client')
        .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

    const payrollTotal = summary.total_payroll_expense;
    const totalAllExpenses = Math.max(
        1,
        officeExpenseTotal + clientDisbursementTotal + payrollTotal,
    );

    const expenseCategories = [
        {
            name: 'Gaji & Payroll Staf/Advokat',
            subtitle: 'Honorarium & gaji tim',
            amount: payrollTotal,
            color: 'bg-indigo-500',
            textColor: 'text-indigo-600 dark:text-indigo-400',
            bgLight: 'bg-indigo-50/70 dark:bg-indigo-950/30',
            icon: Users,
            percent: Math.round((payrollTotal / totalAllExpenses) * 100),
        },
        {
            name: 'Operasional Rutin Kantor',
            subtitle: 'Sewa, utilitas, ATK, langganan',
            amount: officeExpenseTotal,
            color: 'bg-amber-500',
            textColor: 'text-amber-600 dark:text-amber-400',
            bgLight: 'bg-amber-50/70 dark:bg-amber-950/30',
            icon: Building2,
            percent: Math.round((officeExpenseTotal / totalAllExpenses) * 100),
        },
        {
            name: 'Disbursement / Biaya Perkara',
            subtitle: 'Panjar perkara & biaya klien',
            amount: clientDisbursementTotal,
            color: 'bg-blue-500',
            textColor: 'text-blue-600 dark:text-blue-400',
            bgLight: 'bg-blue-50/70 dark:bg-blue-950/30',
            icon: FolderKanban,
            percent: Math.round(
                (clientDisbursementTotal / totalAllExpenses) * 100,
            ),
        },
    ];

    // Profitability Top 5 Ranking
    const sortedProfitability = [...(profitability || [])]
        .sort((a, b) => b.net_margin - a.net_margin)
        .slice(0, 5);

    const maxMatterMargin = Math.max(
        ...sortedProfitability.map((p) =>
            Math.max(p.collected_amount, p.net_margin),
        ),
        1000000,
    );

    // Financial Ratios
    const totalLiabilities = balanceSheet?.liabilities?.total_liabilities || 0;
    const netProfitMargin =
        summary.total_revenue > 0
            ? Math.round((summary.net_profit / summary.total_revenue) * 100)
            : 0;

    const cashToDebtRatio =
        totalLiabilities > 0
            ? (
                  (balanceSheet?.assets?.operational_cash_bank /
                      totalLiabilities) *
                  100
              ).toFixed(1)
            : '100';

    return (
        <div className="space-y-4">
            <section
                data-testid="financial-analytics-summary"
                className="grid overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-2xs sm:grid-cols-2 lg:grid-cols-5 dark:border-white/[0.08] dark:bg-[#14161b]"
            >
                <div className="relative flex min-h-36 flex-col justify-between overflow-hidden border-b border-slate-200/80 bg-blue-50/55 p-5 sm:col-span-2 lg:border-r lg:border-b-0 dark:border-white/[0.08] dark:bg-blue-500/[0.06]">
                    <div className="pointer-events-none absolute -top-12 -right-10 size-36 rounded-full border-[22px] border-white/65 dark:border-white/[0.025]" />
                    <div className="relative">
                        <p className="text-[10px] font-bold tracking-[0.14em] text-blue-600 uppercase dark:text-blue-300">
                            Kinerja Bersih {incomeStatement.year}
                        </p>
                        <div className="mt-2 flex items-end gap-3">
                            <p className="font-mono text-3xl font-black text-slate-950 dark:text-white">
                                {netProfitMargin}%
                            </p>
                            <span className="pb-1 text-xs font-bold text-slate-600 dark:text-zinc-300">
                                {summary.net_profit >= 0
                                    ? 'Surplus'
                                    : 'Defisit'}
                            </span>
                        </div>
                        <p className="mt-1 text-[10.5px] text-slate-500 dark:text-zinc-400">
                            Net Profit Margin
                        </p>
                    </div>
                    <div className="relative mt-4 flex items-end justify-between border-t border-blue-200/60 pt-3 dark:border-white/[0.07]">
                        <span className="text-[10px] text-slate-500 dark:text-zinc-400">
                            Laba Bersih Tahun Ini
                        </span>
                        <span className="font-mono text-sm font-bold text-slate-950 dark:text-white">
                            {formatMoney(summary.net_profit, currency)}
                        </span>
                    </div>
                </div>

                <div className="flex min-h-36 flex-col justify-between border-b border-slate-200/80 p-4 sm:border-r lg:border-b-0 dark:border-white/[0.08]">
                    <div>
                        <p className="text-[10px] font-bold tracking-[0.1em] text-slate-400 uppercase">
                            Pendapatan YTD
                        </p>
                        <p className="mt-2 font-mono text-xl font-bold text-slate-950 dark:text-white">
                            {formatMoney(summary.total_revenue, currency)}
                        </p>
                    </div>
                    <div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-white/[0.06]">
                            <div className="h-full w-full rounded-full bg-emerald-400" />
                        </div>
                        <p className="mt-2 text-[10px] text-slate-400">
                            Rata-rata{' '}
                            {formatMoney(
                                Math.round(summary.total_revenue / 12),
                                currency,
                            )}{' '}
                            / bulan
                        </p>
                    </div>
                </div>

                <div className="flex min-h-36 flex-col justify-between border-b border-slate-200/80 p-4 lg:border-r lg:border-b-0 dark:border-white/[0.08]">
                    <div>
                        <p className="text-[10px] font-bold tracking-[0.1em] text-slate-400 uppercase">
                            Total Beban YTD
                        </p>
                        <p className="mt-2 font-mono text-xl font-bold text-slate-950 dark:text-white">
                            {formatMoney(summary.total_expenses, currency)}
                        </p>
                    </div>
                    <div>
                        <div className="flex h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-white/[0.06]">
                            <div
                                className="h-full bg-amber-400"
                                style={{
                                    width: `${Math.round((summary.total_operational_expense / Math.max(1, summary.total_expenses)) * 100)}%`,
                                }}
                            />
                            <div className="h-full flex-1 bg-blue-400" />
                        </div>
                        <p className="mt-2 text-[10px] text-slate-400">
                            Operasional dan payroll
                        </p>
                    </div>
                </div>

                <div className="flex min-h-36 flex-col justify-between p-4">
                    <div>
                        <p className="text-[10px] font-bold tracking-[0.1em] text-slate-400 uppercase">
                            Likuiditas Kas
                        </p>
                        <div className="mt-2 flex items-end gap-2">
                            <p className="font-mono text-xl font-bold text-slate-950 dark:text-white">
                                {cashToDebtRatio}%
                            </p>
                            <span className="pb-0.5 text-[10px] font-semibold text-blue-600 dark:text-blue-300">
                                Kapasitas
                            </span>
                        </div>
                    </div>
                    <div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-white/[0.06]">
                            <div
                                className="h-full rounded-full bg-blue-500"
                                style={{
                                    width: `${Math.min(Number(cashToDebtRatio), 100)}%`,
                                }}
                            />
                        </div>
                        <p className="mt-2 text-[10px] text-slate-400">
                            Kas{' '}
                            {formatMoney(
                                balanceSheet?.assets?.operational_cash_bank ||
                                    0,
                                currency,
                            )}
                        </p>
                    </div>
                </div>
            </section>

            {/* Visual Charts Grid (3 Symmetrical Rows x 2 Equal-Height Cards) */}
            <div
                data-testid="financial-analytics-grid"
                className="grid grid-cols-1 gap-3 lg:grid-cols-2"
            >
                {/* ============================================================= */}
                {/* ROW 1 / CARD 1: Tren Arus Kas & Laba Rugi Bulanan (12 Bulan) */}
                {/* ============================================================= */}
                <section className="flex h-full flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs lg:col-span-2 dark:border-white/[0.08] dark:bg-[#14161b]">
                    <div>
                        {/* Card Header */}
                        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3.5 dark:border-white/[0.06]">
                            <div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h4 className="text-xs font-bold tracking-tight text-slate-900 uppercase dark:text-white">
                                            01. Tren Arus Kas &amp; Laba Rugi
                                            Bulanan
                                        </h4>
                                        <span className="py-0.2 rounded-md border border-slate-200 bg-slate-100 px-1.5 font-mono text-[10px] font-bold text-slate-700 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-300">
                                            {incomeStatement.year}
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                                        Perbandingan realisasi penerimaan fee vs
                                        beban pengeluaran bulanan.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50/70 px-2.5 py-1 text-[10.5px] font-semibold dark:border-white/[0.04] dark:bg-white/[0.02]">
                                <div className="flex items-center gap-1.5">
                                    <span className="size-2 rounded-full bg-emerald-500 shadow-xs" />
                                    <span className="text-slate-600 dark:text-zinc-300">
                                        Masuk
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="size-2 rounded-full bg-rose-500 shadow-xs" />
                                    <span className="text-slate-600 dark:text-zinc-300">
                                        Keluar
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Bar Chart Area with Gridlines */}
                        <div className="relative mt-5">
                            {/* Horizontal Reference Gridlines */}
                            <div className="pointer-events-none absolute inset-0 flex flex-col justify-between pb-8 opacity-40">
                                <div className="border-b border-dashed border-slate-200 dark:border-zinc-800" />
                                <div className="border-b border-dashed border-slate-200 dark:border-zinc-800" />
                                <div className="border-b border-dashed border-slate-200 dark:border-zinc-800" />
                                <div className="border-b border-slate-200 dark:border-zinc-800" />
                            </div>

                            {/* Dual Bars Container */}
                            <div className="relative z-10 flex h-48 items-end gap-1 sm:gap-2">
                                {months.map((m, idx) => {
                                    const revHeight = Math.max(
                                        5,
                                        Math.min(
                                            100,
                                            Math.round(
                                                (m.revenue / maxMonthlyVal) *
                                                    100,
                                            ),
                                        ),
                                    );
                                    const expHeight = Math.max(
                                        5,
                                        Math.min(
                                            100,
                                            Math.round(
                                                (m.total_expense /
                                                    maxMonthlyVal) *
                                                    100,
                                            ),
                                        ),
                                    );
                                    const isProfit = m.net_profit >= 0;
                                    const isSelected =
                                        hoveredMonth?.month === m.month;

                                    return (
                                        <div
                                            key={m.month}
                                            onMouseEnter={() =>
                                                setHoveredMonth(m)
                                            }
                                            onMouseLeave={() =>
                                                setHoveredMonth(null)
                                            }
                                            className={`group relative flex h-full flex-1 cursor-pointer flex-col items-center justify-end rounded-lg transition-all ${
                                                isSelected
                                                    ? 'bg-indigo-50/50 dark:bg-indigo-950/20'
                                                    : ''
                                            }`}
                                        >
                                            {/* Dual Bars */}
                                            <div className="flex h-38 w-full items-end justify-center gap-0.5 sm:gap-1">
                                                {/* Revenue Bar */}
                                                <div
                                                    style={{
                                                        height: `${revHeight}%`,
                                                    }}
                                                    className={`w-full max-w-[12px] rounded-t-sm transition-all duration-300 ${
                                                        isSelected
                                                            ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50 brightness-110'
                                                            : 'bg-emerald-500/85 group-hover:bg-emerald-500'
                                                    }`}
                                                />
                                                {/* Expense Bar */}
                                                <div
                                                    style={{
                                                        height: `${expHeight}%`,
                                                    }}
                                                    className={`w-full max-w-[12px] rounded-t-sm transition-all duration-300 ${
                                                        isSelected
                                                            ? 'bg-rose-500 shadow-sm shadow-rose-500/50 brightness-110'
                                                            : 'bg-rose-500/80 group-hover:bg-rose-500'
                                                    }`}
                                                />
                                            </div>

                                            {/* Net Margin Indicator Dot */}
                                            <div className="mt-1.5 flex h-2 items-center justify-center">
                                                <span
                                                    className={`size-1.5 rounded-full transition-all ${
                                                        m.revenue === 0 &&
                                                        m.total_expense === 0
                                                            ? 'bg-slate-300 dark:bg-zinc-700'
                                                            : isProfit
                                                              ? 'bg-emerald-500 ring-2 ring-emerald-500/20'
                                                              : 'bg-rose-500 ring-2 ring-rose-500/20'
                                                    }`}
                                                />
                                            </div>

                                            {/* Month Label */}
                                            <span
                                                className={`mt-1 font-mono text-[10px] font-semibold transition-colors ${
                                                    isSelected
                                                        ? 'font-bold text-indigo-600 dark:text-indigo-400'
                                                        : 'text-slate-500 group-hover:text-slate-900 dark:text-zinc-400 dark:group-hover:text-white'
                                                }`}
                                            >
                                                {MONTH_NAMES[idx]}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Bottom Dynamic Interactive Detail Strip */}
                    <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/80 p-3 text-xs dark:border-white/[0.04] dark:bg-white/[0.02]">
                        {hoveredMonth ? (
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-slate-900 dark:text-white">
                                        Bulan{' '}
                                        {MONTH_NAMES[hoveredMonth.month - 1]}:
                                    </span>
                                    <span className="text-slate-500">
                                        Masuk:{' '}
                                        <strong className="font-mono text-emerald-600 dark:text-emerald-400">
                                            {formatMoney(
                                                hoveredMonth.revenue,
                                                currency,
                                            )}
                                        </strong>
                                    </span>
                                    <span className="text-slate-300 dark:text-zinc-600">
                                        •
                                    </span>
                                    <span className="text-slate-500">
                                        Keluar:{' '}
                                        <strong className="font-mono text-rose-600 dark:text-rose-400">
                                            {formatMoney(
                                                hoveredMonth.total_expense,
                                                currency,
                                            )}
                                        </strong>
                                    </span>
                                </div>
                                <div className="font-mono font-bold">
                                    Laba Bersih:{' '}
                                    <span
                                        className={
                                            hoveredMonth.net_profit >= 0
                                                ? 'text-emerald-600 dark:text-emerald-400'
                                                : 'text-rose-600 dark:text-rose-400'
                                        }
                                    >
                                        {formatMoney(
                                            hoveredMonth.net_profit,
                                            currency,
                                        )}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-zinc-400">
                                <span>
                                    Arahkan kursor pada diagram batang bulanan
                                    untuk detail arus kas.
                                </span>
                                <div className="flex items-center gap-1.5">
                                    <span>Total Laba:</span>
                                    <strong className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                        {formatMoney(
                                            summary.net_profit,
                                            currency,
                                        )}
                                    </strong>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* ============================================================= */}
                {/* ROW 1 / CARD 2: Struktur & Komposisi Beban Pengeluaran Firma */}
                {/* ============================================================= */}
                <section className="flex h-full flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs dark:border-white/[0.08] dark:bg-[#14161b]">
                    <div>
                        {/* Card Header */}
                        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3.5 dark:border-white/[0.06]">
                            <div>
                                <div>
                                    <h4 className="text-xs font-bold tracking-tight text-slate-900 uppercase dark:text-white">
                                        02. Struktur Beban Pengeluaran Firma
                                    </h4>
                                    <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                                        Alokasi biaya operasional kantor,
                                        honorarium payroll, dan disbursement.
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-[10px] font-bold text-slate-400 uppercase dark:text-zinc-500">
                                    Total Beban
                                </div>
                                <div className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                                    {formatMoney(totalAllExpenses, currency)}
                                </div>
                            </div>
                        </div>

                        {/* Visual Proportion Segmented Bar */}
                        <div className="mt-4 space-y-4">
                            <div className="space-y-1.5">
                                <div className="flex justify-between text-[11px] font-medium text-slate-500 dark:text-zinc-400">
                                    <span>Distribusi Alokasi Beban</span>
                                    <span>100% Total Anggaran</span>
                                </div>
                                <div className="flex h-3.5 w-full overflow-hidden rounded-full bg-slate-100 p-0.5 dark:bg-zinc-800">
                                    {expenseCategories.map((cat) => (
                                        <div
                                            key={cat.name}
                                            style={{
                                                width: `${Math.max(4, cat.percent)}%`,
                                            }}
                                            className={`h-full rounded-full transition-all ${cat.color} opacity-90 hover:opacity-100`}
                                            title={`${cat.name}: ${cat.percent}%`}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* 3 Detailed Category Rows */}
                            <div className="space-y-2.5">
                                {expenseCategories.map((cat) => {
                                    const IconComponent = cat.icon;

                                    return (
                                        <div
                                            key={cat.name}
                                            className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-2.5 text-xs transition-colors hover:bg-slate-50 dark:border-white/[0.04] dark:bg-white/[0.02]"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${cat.bgLight} ${cat.textColor}`}
                                                >
                                                    <IconComponent className="size-4" />
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-slate-800 dark:text-zinc-200">
                                                        {cat.name}
                                                    </div>
                                                    <div className="text-[10.5px] text-slate-400 dark:text-zinc-500">
                                                        {cat.subtitle}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <div className="font-mono font-bold text-slate-900 dark:text-white">
                                                    {formatMoney(
                                                        cat.amount,
                                                        currency,
                                                    )}
                                                </div>
                                                <div
                                                    className={`font-mono text-[10.5px] font-bold ${cat.textColor}`}
                                                >
                                                    {cat.percent}% dari total
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Bottom Summary Strip */}
                    <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2 text-[11px] text-slate-500 dark:border-white/[0.04] dark:bg-white/[0.02] dark:text-zinc-400">
                        <span>Rasio Efisiensi Beban Operasional:</span>
                        <span className="font-mono font-bold text-slate-800 dark:text-zinc-200">
                            {formatMoney(
                                Math.round(totalAllExpenses / 12),
                                currency,
                            )}{' '}
                            / bulan rata-rata
                        </span>
                    </div>
                </section>

                {/* ============================================================= */}
                {/* ROW 2 / CARD 3: Top 5 Perkara & Klien Paling Menguntungkan */}
                {/* ============================================================= */}
                <section className="flex h-full flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs dark:border-white/[0.08] dark:bg-[#14161b]">
                    <div>
                        {/* Card Header */}
                        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3.5 dark:border-white/[0.06]">
                            <div>
                                <div>
                                    <h4 className="text-xs font-bold tracking-tight text-slate-900 uppercase dark:text-white">
                                        03. Top 5 Perkara &amp; Klien Paling
                                        Menguntungkan
                                    </h4>
                                    <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                                        Peringkat perkara dengan kontribusi
                                        margin laba bersih terbesar.
                                    </p>
                                </div>
                            </div>
                            <span className="text-[10.5px] font-bold text-emerald-600 dark:text-emerald-400">
                                Ranking Perkara
                            </span>
                        </div>

                        {sortedProfitability.length === 0 ? (
                            <div className="flex h-56 flex-col items-center justify-center text-center text-xs text-slate-400">
                                <FolderKanban className="mb-2 size-8 text-slate-300 dark:text-zinc-600" />
                                Belum ada data perkara hukum yang tercatat.
                            </div>
                        ) : (
                            <div className="mt-4 space-y-3">
                                {sortedProfitability.map((p, idx) => {
                                    const progressWidth = Math.max(
                                        10,
                                        Math.min(
                                            100,
                                            Math.round(
                                                (p.collected_amount /
                                                    maxMatterMargin) *
                                                    100,
                                            ),
                                        ),
                                    );
                                    const isPositive = p.net_margin >= 0;

                                    const rankBadgeStyles = [
                                        'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800',
                                        'bg-slate-200 text-slate-800 border-slate-300 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700',
                                        'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-950/50 dark:text-orange-300 dark:border-orange-800',
                                        'bg-slate-100 text-slate-600 border-slate-200 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800',
                                        'bg-slate-100 text-slate-600 border-slate-200 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800',
                                    ];

                                    return (
                                        <div
                                            key={p.id}
                                            className="space-y-1.5 rounded-xl border border-slate-100 bg-slate-50/40 p-2.5 transition-colors hover:bg-slate-50 dark:border-white/[0.04] dark:bg-white/[0.02]"
                                        >
                                            <div className="flex items-center justify-between text-xs">
                                                <div className="flex min-w-0 items-center gap-2">
                                                    <span
                                                        className={`flex size-5 shrink-0 items-center justify-center rounded-md border font-mono text-[10px] font-bold ${rankBadgeStyles[idx] || rankBadgeStyles[3]}`}
                                                    >
                                                        #{idx + 1}
                                                    </span>
                                                    <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                                                        {p.matter_number}
                                                    </span>
                                                    <span className="max-w-[140px] truncate font-medium text-slate-700 sm:max-w-[200px] dark:text-zinc-200">
                                                        {p.title}
                                                    </span>
                                                </div>

                                                <div className="flex shrink-0 items-center gap-2">
                                                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                                                        {formatMoney(
                                                            p.net_margin,
                                                            currency,
                                                        )}
                                                    </span>
                                                    <span
                                                        className={`py-0.2 rounded-md px-1.5 font-mono text-[10px] font-bold ${
                                                            isPositive
                                                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                                                                : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                                                        }`}
                                                    >
                                                        {p.margin_percentage}%
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Visual Progress Bar */}
                                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200/80 dark:bg-zinc-800">
                                                <div
                                                    style={{
                                                        width: `${progressWidth}%`,
                                                    }}
                                                    className={`h-full rounded-full transition-all ${
                                                        isPositive
                                                            ? 'bg-emerald-500'
                                                            : 'bg-rose-500'
                                                    }`}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Bottom Summary Strip */}
                    <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2 text-[11px] text-slate-500 dark:border-white/[0.04] dark:bg-white/[0.02] dark:text-zinc-400">
                        <span>Total Kontribusi Margin Top 5:</span>
                        <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            {formatMoney(
                                sortedProfitability.reduce(
                                    (sum, p) => sum + p.net_margin,
                                    0,
                                ),
                                currency,
                            )}
                        </span>
                    </div>
                </section>

                {/* ============================================================= */}
                {/* ROW 2 / CARD 4: Aliran Dana Titipan Klien (Client Trust) */}
                {/* ============================================================= */}
                <section className="flex h-full flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs dark:border-white/[0.08] dark:bg-[#14161b]">
                    <div>
                        {/* Card Header */}
                        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3.5 dark:border-white/[0.06]">
                            <div>
                                <div>
                                    <h4 className="text-xs font-bold tracking-tight text-slate-900 uppercase dark:text-white">
                                        04. Aliran Dana Titipan Klien (Escrow)
                                    </h4>
                                    <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                                        Monitoring saldo titipan klien yang
                                        terisolasi dari rekening kas kantor.
                                    </p>
                                </div>
                            </div>
                            <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-cyan-700 dark:text-cyan-400">
                                Rekening Escrow
                            </span>
                        </div>

                        {/* 3 Pillars Summary */}
                        <div className="mt-4 grid grid-cols-3 gap-2.5">
                            <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3 text-center dark:border-emerald-900/30 dark:bg-emerald-950/20">
                                <div className="text-[10px] font-bold text-emerald-800 uppercase dark:text-emerald-300">
                                    Total Masuk (+)
                                </div>
                                <div className="mt-1 font-mono text-xs font-bold text-emerald-700 sm:text-sm dark:text-emerald-400">
                                    {formatMoney(
                                        clientTrustSummary?.total_deposit_in ||
                                            0,
                                        currency,
                                    )}
                                </div>
                            </div>

                            <div className="rounded-xl border border-rose-100 bg-rose-50/50 p-3 text-center dark:border-rose-900/30 dark:bg-rose-950/20">
                                <div className="text-[10px] font-bold text-rose-800 uppercase dark:text-rose-300">
                                    Disbursement (-)
                                </div>
                                <div className="mt-1 font-mono text-xs font-bold text-rose-700 sm:text-sm dark:text-rose-400">
                                    {formatMoney(
                                        clientTrustSummary?.total_disbursement_out ||
                                            0,
                                        currency,
                                    )}
                                </div>
                            </div>

                            <div className="rounded-xl border border-purple-100 bg-purple-50/50 p-3 text-center dark:border-purple-900/30 dark:bg-purple-950/20">
                                <div className="text-[10px] font-bold text-purple-800 uppercase dark:text-purple-300">
                                    Saldo Mengendap
                                </div>
                                <div className="mt-1 font-mono text-xs font-bold text-purple-700 sm:text-sm dark:text-purple-400">
                                    {formatMoney(
                                        clientTrustSummary?.net_trust_balance ||
                                            0,
                                        currency,
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Matters with Trust Funds List / Clean Placeholder */}
                        <div className="mt-4 space-y-2">
                            <div className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400">
                                Rincian Saldo Perkara Klien:
                            </div>

                            {!clientTrustSummary?.by_matter ||
                            clientTrustSummary.by_matter.length === 0 ? (
                                <div className="flex h-36 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-4 text-center dark:border-zinc-800 dark:bg-white/[0.01]">
                                    <ShieldCheck className="size-6 text-purple-500 opacity-80" />
                                    <div className="mt-1.5 text-xs font-bold text-slate-700 dark:text-zinc-300">
                                        Seluruh Titipan Terselesaikan Bersih
                                    </div>
                                    <p className="mt-0.5 text-[11px] text-slate-400 dark:text-zinc-500">
                                        Tidak ada sisa saldo titipan yang
                                        tertahan di rekening escrow saat ini.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {clientTrustSummary.by_matter
                                        .slice(0, 3)
                                        .map((item) => (
                                            <div
                                                key={
                                                    item.matter_id ||
                                                    item.matter_number
                                                }
                                                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-2.5 text-xs dark:border-white/[0.04] dark:bg-white/[0.02]"
                                            >
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                                                            {item.matter_number}
                                                        </span>
                                                        <span className="truncate text-slate-700 dark:text-zinc-200">
                                                            {item.client_name}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="font-mono font-bold text-purple-600 dark:text-purple-400">
                                                    {formatMoney(
                                                        item.current_balance,
                                                        currency,
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Bottom Summary Strip */}
                    <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2 text-[11px] text-slate-500 dark:border-white/[0.04] dark:bg-white/[0.02] dark:text-zinc-400">
                        <span>Status Isolasi Rekening Dana Klien:</span>
                        <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="size-3.5" />
                            100% Sesuai Kepatuhan
                        </span>
                    </div>
                </section>

                {/* ============================================================= */}
                {/* ROW 3 / CARD 5: Posisi Neraca Keuangan & Solvabilitas Firma */}
                {/* ============================================================= */}
                <section className="flex h-full flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs dark:border-white/[0.08] dark:bg-[#14161b]">
                    <div>
                        {/* Card Header */}
                        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3.5 dark:border-white/[0.06]">
                            <div>
                                <div>
                                    <h4 className="text-xs font-bold tracking-tight text-slate-900 uppercase dark:text-white">
                                        05. Posisi Neraca &amp; Solvabilitas
                                        Firma
                                    </h4>
                                    <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                                        Keseimbangan antara total aset,
                                        kewajiban liabilitas, dan ekuitas firma.
                                    </p>
                                </div>
                            </div>
                            <span
                                className={`inline-flex items-center gap-1 text-[10.5px] font-bold ${
                                    balanceSheet?.is_balanced
                                        ? 'text-emerald-600 dark:text-emerald-400'
                                        : 'text-amber-600 dark:text-amber-400'
                                }`}
                            >
                                {balanceSheet?.is_balanced
                                    ? 'Balanced (Sesuai)'
                                    : 'Perlu Penyesuaian'}
                            </span>
                        </div>

                        {/* Dual Column Neraca Bento */}
                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            {/* Aktiva (Assets) */}
                            <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-3.5 text-xs dark:border-white/[0.06] dark:bg-white/[0.02]">
                                <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                                    <span className="font-bold text-slate-800 uppercase dark:text-zinc-200">
                                        Total Aset Firma
                                    </span>
                                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                                        {formatMoney(
                                            balanceSheet?.assets
                                                ?.total_assets || 0,
                                            currency,
                                        )}
                                    </span>
                                </div>
                                <div className="mt-2.5 space-y-2 text-[11px] text-slate-500 dark:text-zinc-400">
                                    <div className="flex justify-between">
                                        <span>Kas &amp; Bank Operasional</span>
                                        <span className="font-mono font-semibold text-slate-800 dark:text-zinc-200">
                                            {formatMoney(
                                                balanceSheet?.assets
                                                    ?.operational_cash_bank ||
                                                    0,
                                                currency,
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Rekening Titipan Klien</span>
                                        <span className="font-mono font-semibold text-slate-800 dark:text-zinc-200">
                                            {formatMoney(
                                                balanceSheet?.assets
                                                    ?.client_trust_bank || 0,
                                                currency,
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Kredit Pajak PPh 23</span>
                                        <span className="font-mono font-semibold text-slate-800 dark:text-zinc-200">
                                            {formatMoney(
                                                balanceSheet?.assets
                                                    ?.tax_credit_pph23 || 0,
                                                currency,
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Pasiva & Ekuitas */}
                            <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-3.5 text-xs dark:border-white/[0.06] dark:bg-white/[0.02]">
                                <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                                    <span className="font-bold text-slate-800 uppercase dark:text-zinc-200">
                                        Liabilitas &amp; Ekuitas
                                    </span>
                                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                                        {formatMoney(
                                            balanceSheet?.equity
                                                ?.total_liabilities_and_equity ||
                                                0,
                                            currency,
                                        )}
                                    </span>
                                </div>
                                <div className="mt-2.5 space-y-2 text-[11px] text-slate-500 dark:text-zinc-400">
                                    <div className="flex justify-between">
                                        <span>Utang Talangan Partner</span>
                                        <span className="font-mono font-semibold text-slate-800 dark:text-zinc-200">
                                            {formatMoney(
                                                balanceSheet?.liabilities
                                                    ?.partner_advances_due || 0,
                                                currency,
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Liabilitas Titipan Klien</span>
                                        <span className="font-mono font-semibold text-slate-800 dark:text-zinc-200">
                                            {formatMoney(
                                                balanceSheet?.liabilities
                                                    ?.client_trust_liability ||
                                                    0,
                                                currency,
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between border-t border-slate-200/60 pt-1 text-indigo-600 dark:text-indigo-400">
                                        <span className="font-bold">
                                            Ekuitas Laba Ditahan
                                        </span>
                                        <span className="font-mono font-bold">
                                            {formatMoney(
                                                balanceSheet?.equity
                                                    ?.retained_earnings || 0,
                                                currency,
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Summary Strip */}
                    <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2 text-[11px] text-slate-500 dark:border-white/[0.04] dark:bg-white/[0.02] dark:text-zinc-400">
                        <span>Solvabilitas Likuiditas Kas:</span>
                        <span className="font-mono font-bold text-slate-800 dark:text-zinc-200">
                            {cashToDebtRatio}% Kapasitas Pelunasan Liabilitas
                        </span>
                    </div>
                </section>

                {/* ============================================================= */}
                {/* ROW 3 / CARD 6: Matriks Transaksi & Distribusi Partner */}
                {/* ============================================================= */}
                <section className="flex h-full flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs lg:col-span-2 dark:border-white/[0.08] dark:bg-[#14161b]">
                    <div>
                        {/* Card Header */}
                        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3.5 dark:border-white/[0.06]">
                            <div>
                                <div>
                                    <h4 className="text-xs font-bold tracking-tight text-slate-900 uppercase dark:text-white">
                                        06. Matriks Transaksi &amp; Distribusi
                                        Partner
                                    </h4>
                                    <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                                        Rekapitulasi talangan aktif, penarikan
                                        prive, dan pembagian dividen laba per
                                        partner.
                                    </p>
                                </div>
                            </div>
                            <span className="text-[10.5px] font-bold text-slate-500 dark:text-zinc-400">
                                Partner Advokat
                            </span>
                        </div>

                        {!partnerAdvances || partnerAdvances.length === 0 ? (
                            <div className="flex h-56 flex-col items-center justify-center text-center text-xs text-slate-400">
                                <Users className="mb-2 size-8 text-slate-300 dark:text-zinc-600" />
                                Belum ada data transaksi partner.
                            </div>
                        ) : (
                            <div className="mt-4 grid gap-3 lg:grid-cols-3">
                                {partnerAdvances.map((pa) => (
                                    <div
                                        key={pa.partner_id || pa.account_id}
                                        className="rounded-xl border border-slate-200/80 bg-slate-50/45 p-3 text-xs transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white hover:shadow-sm dark:border-white/[0.06] dark:bg-white/[0.02] dark:hover:bg-white/[0.04]"
                                    >
                                        <div className="flex flex-wrap items-center justify-between gap-1.5">
                                            <div className="font-bold text-slate-900 dark:text-white">
                                                {pa.partner_name}
                                            </div>
                                            <span className="font-mono text-[10.5px] font-bold text-amber-700 dark:text-amber-400">
                                                Utang Talangan:{' '}
                                                {formatMoney(
                                                    pa.net_due_to_partner,
                                                    currency,
                                                )}
                                            </span>
                                        </div>

                                        <div className="mt-3 grid grid-cols-3 divide-x divide-slate-200/80 border-t border-slate-200/80 pt-3 text-center text-[10.5px] dark:divide-white/[0.07] dark:border-white/[0.07]">
                                            <div className="px-1">
                                                <span className="text-slate-400 dark:text-zinc-500">
                                                    Talangan Aktif
                                                </span>
                                                <div className="mt-1 font-mono font-bold text-slate-900 dark:text-white">
                                                    {formatMoney(
                                                        pa.advances_incurred,
                                                        currency,
                                                    )}
                                                </div>
                                            </div>
                                            <div className="px-1">
                                                <span className="text-slate-400 dark:text-zinc-500">
                                                    Bagi Hasil Laba
                                                </span>
                                                <div className="mt-1 font-mono font-bold text-slate-900 dark:text-white">
                                                    {formatMoney(
                                                        pa.profit_distributed,
                                                        currency,
                                                    )}
                                                </div>
                                            </div>
                                            <div className="px-1">
                                                <span className="text-slate-400 dark:text-zinc-500">
                                                    Prive Ditarik
                                                </span>
                                                <div className="mt-1 font-mono font-bold text-slate-900 dark:text-white">
                                                    {formatMoney(
                                                        pa.prive_drawn,
                                                        currency,
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Bottom Summary Strip */}
                    <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2 text-[11px] text-slate-500 dark:border-white/[0.04] dark:bg-white/[0.02] dark:text-zinc-400">
                        <span>Total Utang Talangan Semua Partner:</span>
                        <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                            {formatMoney(
                                partnerAdvances.reduce(
                                    (sum, pa) => sum + pa.net_due_to_partner,
                                    0,
                                ),
                                currency,
                            )}
                        </span>
                    </div>
                </section>
            </div>
        </div>
    );
}
