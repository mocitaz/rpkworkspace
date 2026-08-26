import { Form, Head, Link, router } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowRightLeft,
    ArrowUpRight,
    Banknote,
    BarChart3,
    Building,
    Building2,
    CalendarClock,
    CheckCircle2,
    ChevronDown,
    ChevronRight,
    ChevronUp,
    DollarSign,
    FileDown,
    FilePlus2,
    FileSpreadsheet,
    FileText,
    FolderKanban,
    HandCoins,
    Layers,
    Lock,
    Plus,
    Receipt,
    ReceiptText,
    RotateCcw,
    Scale,
    Search,
    Trash2,
    TrendingUp,
    Undo2,
    User,
    Users,
    Wallet,
    WalletCards,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { EmptyState } from '@/components/empty-state';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { FileInput } from '@/components/ui/file-input';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { formatDate, formatMoney } from '@/lib/format';
import * as financeRoutes from '@/routes/finance';
import * as expenseRoutes from '@/routes/finance/expenses';
import * as invoiceRoutes from '@/routes/finance/invoices';
import * as paymentRoutes from '@/routes/finance/payments';
import * as quotationRoutes from '@/routes/finance/quotations';
import { ProfitabilityTable, type ProfitabilityItem } from './components/profitability-table';
import { AccountsView, type FinancialAccountItem, type AccountTransferItem } from './components/accounts-view';
import { PartnerAdvancesView, type PartnerAdvanceSummaryItem, type PartnerTransactionItem } from './components/partner-advances-view';
import { ClientTrustView, type ClientTrustSummary, type ClientTrustFundItem } from './components/client-trust-view';
import { PayrollView, type PayrollItem } from './components/payroll-view';
import { ReportsView, type IncomeStatementData, type BalanceSheetData } from './components/reports-view';
import { CreateAccountDialog } from './components/create-account-dialog';
import { CreateTransferDialog } from './components/create-transfer-dialog';
import { CreatePartnerTransactionDialog } from './components/create-partner-transaction-dialog';
import { CreateClientTrustDialog } from './components/create-client-trust-dialog';
import { CreatePayrollDialog } from './components/create-payroll-dialog';

type Matter = {
    id: string;
    matter_number: string;
    title: string;
    client?: string;
    budget_amount?: number;
};

type LedgerItem = {
    id: string;
    invoice_number?: string;
    quotation_number?: string;
    title?: string;
    category?: string;
    charge_to?: string;
    description?: string;
    status: string;
    total_amount?: number;
    paid_amount?: number;
    amount?: number;
    gross_amount?: number;
    tax_withheld?: number;
    outstanding_amount?: number;
    currency: string;
    due_at?: string;
    incurred_at?: string;
    received_at?: string;
    matter?: Matter;
    account?: { id: string; name: string };
    partner?: { id: number; name: string };
    reversed_at?: string;
    reversal_reason?: string;
    refunded_at?: string;
    refund_reason?: string;
    allocations?: {
        id: string;
        amount: number;
        invoice: {
            invoice_number: string;
            outstanding_amount: number;
            currency: string;
        };
    }[];
};

type Overview = {
    currency: string;
    budget_amount: number;
    quotation_amount: number;
    invoiced_amount: number;
    payment_received_amount: number;
    total_cash_inflow?: number;
    unallocated_payment_amount?: number;
    expense_amount: number;
    receivable_amount: number;
    overdue_amount?: number;
    aging?: Record<string, number>;
    margin_amount: number;
    net_cash_flow?: number;
};

export default function FinanceIndex({
    matters,
    clients,
    overview,
    selectedMatterId,
    invoices,
    quotations,
    expenses,
    payments,
    accounts = [],
    transfers = [],
    partnerTransactions = [],
    partnerAdvances = [],
    clientTrustFunds = [],
    clientTrustSummary,
    payrolls = [],
    profitability = [],
    incomeStatement,
    balanceSheet,
    staffUsers = [],
    can,
}: {
    matters: Matter[];
    clients: { id: string; display_name: string }[];
    overview: Overview | null;
    selectedMatterId?: string;
    invoices: LedgerItem[];
    quotations: LedgerItem[];
    expenses: LedgerItem[];
    payments: LedgerItem[];
    accounts?: FinancialAccountItem[];
    transfers?: AccountTransferItem[];
    partnerTransactions?: PartnerTransactionItem[];
    partnerAdvances?: PartnerAdvanceSummaryItem[];
    clientTrustFunds?: ClientTrustFundItem[];
    clientTrustSummary?: ClientTrustSummary;
    payrolls?: PayrollItem[];
    profitability?: ProfitabilityItem[];
    incomeStatement?: IncomeStatementData;
    balanceSheet?: BalanceSheetData;
    staffUsers?: { id: number; name: string; position_title?: string; department?: string; employee_code?: string; bank_name?: string; bank_account_number?: string }[];
    can: {
        invoice: boolean;
        quotation: boolean;
        quotationApprove: boolean;
        expense: boolean;
        payment: boolean;
        invoiceTransition: boolean;
    };
}) {
    const [modal, setModal] = useState<
        'invoice' | 'quotation' | 'expense' | 'payment' | 'account' | 'transfer' | 'partner_transaction' | 'client_trust' | 'payroll' | null
    >(null);
    const [reversePayment, setReversePayment] = useState<LedgerItem | null>(null);
    const [refundPayment, setRefundPayment] = useState<LedgerItem | null>(null);
    const [cancelInvoice, setCancelInvoice] = useState<LedgerItem | null>(null);
    const [expenseToDelete, setExpenseToDelete] = useState<LedgerItem | null>(null);
    const [isDeletingExpense, setIsDeletingExpense] = useState(false);

    // 3 Primary Scopes: Client & Matters, Office Operations, Financial Reports
    const [scope, setScope] = useState<'client_matters' | 'office_operations' | 'financial_reports'>('client_matters');
    const [matterTab, setMatterTab] = useState<'all' | 'profitability' | 'invoices' | 'quotations' | 'trust_funds' | 'disbursements' | 'payments'>('all');
    const [officeTab, setOfficeTab] = useState<'accounts' | 'office_expenses' | 'payroll' | 'partner_advances'>('accounts');
    const [showDetailedAnalytics, setShowDetailedAnalytics] = useState(false);

    const currency = overview?.currency ?? 'IDR';

    const partnersList = useMemo(() => {
        return staffUsers.filter((u) => u.name.toLowerCase().includes('partner') || u.id <= 3);
    }, [staffUsers]);

    const trustAccountsList = useMemo(() => {
        return accounts.filter((a) => a.type === 'client_trust');
    }, [accounts]);

    const matterExpenses = useMemo(() => {
        return expenses.filter((e) => e.charge_to === 'client' || !!e.matter);
    }, [expenses]);

    const officeExpenses = useMemo(() => {
        return expenses.filter((e) => e.charge_to === 'office' || !e.matter);
    }, [expenses]);

    const totalOperationalCashBank = useMemo(() => {
        return accounts.filter((a) => a.type !== 'client_trust').reduce((sum, a) => sum + (a.current_balance || 0), 0);
    }, [accounts]);

    const totalClientTrustBank = useMemo(() => {
        return accounts.filter((a) => a.type === 'client_trust').reduce((sum, a) => sum + (a.current_balance || 0), 0);
    }, [accounts]);

    const totalOfficeExpenseSum = useMemo(() => {
        return officeExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    }, [officeExpenses]);

    const totalPayrollSum = useMemo(() => {
        return payrolls.reduce((sum, p) => sum + (p.net_salary || 0), 0);
    }, [payrolls]);

    const totalPartnerAdvDue = useMemo(() => {
        return partnerAdvances.reduce((sum, p) => sum + (p.net_balance || 0), 0);
    }, [partnerAdvances]);

    return (
        <>
            <Head title="Keuangan & Billing Operasional - RPK Legal Workspace" />

            <div className="min-h-screen bg-[#fafafc] pb-16 dark:bg-[#0c0d10]">
                <main className="mx-auto max-w-7xl space-y-4 px-4 py-3.5 sm:px-6 lg:px-8">
                    {/* 1. Header & Actions */}
                    <div className="flex flex-col justify-between gap-3 border-b border-slate-200/60 pb-3 sm:flex-row sm:items-center dark:border-white/[0.06]">
                        <div className="space-y-0.5">
                            <h1 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl dark:text-white">
                                Keuangan Firma Hukum RPK
                            </h1>
                            <p className="text-[11px] text-slate-500 sm:text-xs dark:text-zinc-400">
                                Pusat keuangan terpadu: Penagihan perkara klien, operasional kantor &amp; laporan neraca firma.
                            </p>
                        </div>

                        {/* Right: Single-Line Horizontal Action Buttons */}
                        <div className="flex [scrollbar-width:none] items-center gap-1.5 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                            {scope === 'client_matters' && (
                                <>
                                    <Button
                                        variant="outline"
                                        onClick={() => setModal('client_trust')}
                                        className="h-7.5 shrink-0 rounded-lg border-slate-200/70 bg-white px-2.5 text-xs font-semibold whitespace-nowrap text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-white/10 dark:bg-[#14161b] dark:text-zinc-200"
                                    >
                                        <Lock className="mr-1 size-3.5 text-cyan-600 dark:text-cyan-400" />
                                        Titipan Klien
                                    </Button>
                                    {can.quotation && (
                                        <Button
                                            variant="outline"
                                            onClick={() => setModal('quotation')}
                                            className="h-7.5 shrink-0 rounded-lg border-slate-200/70 bg-white px-2.5 text-xs font-semibold whitespace-nowrap text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-white/10 dark:bg-[#14161b] dark:text-zinc-200"
                                        >
                                            <FilePlus2 className="mr-1 size-3.5 text-blue-600 dark:text-blue-400" />
                                            Quotation
                                        </Button>
                                    )}
                                    {can.expense && (
                                        <Button
                                            variant="outline"
                                            onClick={() => setModal('expense')}
                                            className="h-7.5 shrink-0 rounded-lg border-slate-200/70 bg-white px-2.5 text-xs font-semibold whitespace-nowrap text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-white/10 dark:bg-[#14161b] dark:text-zinc-200"
                                        >
                                            <WalletCards className="mr-1 size-3.5 text-rose-600 dark:text-rose-400" />
                                            Biaya Perkara
                                        </Button>
                                    )}
                                    {can.payment && (
                                        <Button
                                            variant="outline"
                                            onClick={() => setModal('payment')}
                                            className="h-7.5 shrink-0 rounded-lg border-slate-200/70 bg-white px-2.5 text-xs font-semibold whitespace-nowrap text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-white/10 dark:bg-[#14161b] dark:text-zinc-200"
                                        >
                                            <Banknote className="mr-1 size-3.5 text-emerald-600 dark:text-emerald-400" />
                                            Pembayaran
                                        </Button>
                                    )}
                                    {can.invoice && (
                                        <Button
                                            onClick={() => setModal('invoice')}
                                            className="h-7.5 shrink-0 rounded-lg bg-slate-900 px-3 text-xs font-semibold whitespace-nowrap text-white shadow-2xs hover:bg-slate-800 active:scale-95 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                                        >
                                            <ReceiptText className="mr-1 size-3.5" />
                                            Buat Invoice
                                        </Button>
                                    )}
                                </>
                            )}

                            {scope === 'office_operations' && (
                                <>
                                    <Button
                                        variant="outline"
                                        onClick={() => setModal('account')}
                                        className="h-7.5 shrink-0 rounded-lg border-slate-200/70 bg-white px-2.5 text-xs font-semibold whitespace-nowrap text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-white/10 dark:bg-[#14161b] dark:text-zinc-200"
                                    >
                                        <Building className="mr-1 size-3.5 text-blue-600 dark:text-blue-400" />
                                        Tambah Akun
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => setModal('transfer')}
                                        className="h-7.5 shrink-0 rounded-lg border-slate-200/70 bg-white px-2.5 text-xs font-semibold whitespace-nowrap text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-white/10 dark:bg-[#14161b] dark:text-zinc-200"
                                    >
                                        <ArrowRightLeft className="mr-1 size-3.5 text-purple-600 dark:text-purple-400" />
                                        Transfer Kas
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => setModal('partner_transaction')}
                                        className="h-7.5 shrink-0 rounded-lg border-slate-200/70 bg-white px-2.5 text-xs font-semibold whitespace-nowrap text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-white/10 dark:bg-[#14161b] dark:text-zinc-200"
                                    >
                                        <HandCoins className="mr-1 size-3.5 text-amber-600 dark:text-amber-400" />
                                        Talangan Partner
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => setModal('expense')}
                                        className="h-7.5 shrink-0 rounded-lg border-slate-200/70 bg-white px-2.5 text-xs font-semibold whitespace-nowrap text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-white/10 dark:bg-[#14161b] dark:text-zinc-200"
                                    >
                                        <WalletCards className="mr-1 size-3.5 text-rose-600 dark:text-rose-400" />
                                        Biaya Kantor
                                    </Button>
                                    <Button
                                        onClick={() => setModal('payroll')}
                                        className="h-7.5 shrink-0 rounded-lg bg-indigo-600 px-3 text-xs font-semibold whitespace-nowrap text-white shadow-2xs hover:bg-indigo-700 active:scale-95"
                                    >
                                        <Users className="mr-1 size-3.5" />
                                        Input Gaji
                                    </Button>
                                </>
                            )}

                            {scope === 'financial_reports' && (
                                <a
                                    href="/finance/export/excel"
                                    className="inline-flex h-7.5 shrink-0 items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-3 text-xs font-bold whitespace-nowrap text-emerald-800 shadow-2xs transition-colors hover:bg-emerald-100 active:scale-95 dark:border-emerald-500/30 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-900/50"
                                    title="Download Laporan Keuangan Lengkap 11 Sheet Excel (.xlsx) untuk Kesiapan Audit"
                                >
                                    <FileSpreadsheet className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                                    Export Audit (.xlsx)
                                </a>
                            )}
                        </div>
                    </div>

                    {/* 2. Top-Level 3-Scope Segmented Switcher */}
                    <div className="grid grid-cols-1 gap-2 rounded-2xl border border-slate-200/80 bg-slate-100/60 p-1.5 sm:grid-cols-3 dark:border-white/[0.08] dark:bg-[#121418]/80">
                        {/* Scope 1: Keuangan Perkara & Klien */}
                        <button
                            type="button"
                            onClick={() => setScope('client_matters')}
                            className={`group relative flex cursor-pointer items-start gap-3 rounded-xl p-3 text-left transition-all duration-200 ${
                                scope === 'client_matters'
                                    ? 'bg-white shadow-xs ring-1 ring-slate-900/5 dark:bg-[#181a20] dark:ring-1 dark:ring-white/10'
                                    : 'hover:bg-white/60 dark:hover:bg-white/[0.04]'
                            }`}
                        >
                            <div
                                className={`flex size-9 shrink-0 items-center justify-center rounded-xl transition-colors ${
                                    scope === 'client_matters'
                                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                                        : 'bg-blue-50 text-blue-600 group-hover:bg-blue-100/80 dark:bg-blue-950/40 dark:text-blue-400 dark:group-hover:bg-blue-950/60'
                                }`}
                            >
                                <FolderKanban className="size-4.5" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-1">
                                    <div className="flex items-center gap-1.5">
                                        <span className="font-mono text-[10px] font-bold text-blue-600 dark:text-blue-400">
                                            01
                                        </span>
                                        <h3
                                            className={`text-xs font-bold tracking-tight transition-colors ${
                                                scope === 'client_matters'
                                                    ? 'text-slate-900 dark:text-white'
                                                    : 'text-slate-700 dark:text-zinc-300'
                                            }`}
                                        >
                                            Keuangan Perkara &amp; Klien
                                        </h3>
                                    </div>
                                    {scope === 'client_matters' && (
                                        <span className="size-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                                    )}
                                </div>
                                <p className="mt-0.5 text-[11px] font-medium text-slate-500 dark:text-zinc-400">
                                    Billing, Dana Titipan &amp; Profitabilitas
                                </p>
                            </div>
                            {scope === 'client_matters' && (
                                <div className="absolute inset-x-4 bottom-0 h-0.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                            )}
                        </button>

                        {/* Scope 2: Operasional Kantor & Firma */}
                        <button
                            type="button"
                            onClick={() => setScope('office_operations')}
                            className={`group relative flex cursor-pointer items-start gap-3 rounded-xl p-3 text-left transition-all duration-200 ${
                                scope === 'office_operations'
                                    ? 'bg-white shadow-xs ring-1 ring-slate-900/5 dark:bg-[#181a20] dark:ring-1 dark:ring-white/10'
                                    : 'hover:bg-white/60 dark:hover:bg-white/[0.04]'
                            }`}
                        >
                            <div
                                className={`flex size-9 shrink-0 items-center justify-center rounded-xl transition-colors ${
                                    scope === 'office_operations'
                                        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/25'
                                        : 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100/80 dark:bg-indigo-950/40 dark:text-indigo-400 dark:group-hover:bg-indigo-950/60'
                                }`}
                            >
                                <Building2 className="size-4.5" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-1">
                                    <div className="flex items-center gap-1.5">
                                        <span className="font-mono text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                                            02
                                        </span>
                                        <h3
                                            className={`text-xs font-bold tracking-tight transition-colors ${
                                                scope === 'office_operations'
                                                    ? 'text-slate-900 dark:text-white'
                                                    : 'text-slate-700 dark:text-zinc-300'
                                            }`}
                                        >
                                            Operasional Kantor &amp; Firma
                                        </h3>
                                    </div>
                                    {scope === 'office_operations' && (
                                        <span className="size-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                                    )}
                                </div>
                                <p className="mt-0.5 text-[11px] font-medium text-slate-500 dark:text-zinc-400">
                                    Kas, Bank, Biaya Rutin, Payroll &amp; Talangan
                                </p>
                            </div>
                            {scope === 'office_operations' && (
                                <div className="absolute inset-x-4 bottom-0 h-0.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                            )}
                        </button>

                        {/* Scope 3: Laporan Keuangan & Neraca */}
                        <button
                            type="button"
                            onClick={() => setScope('financial_reports')}
                            className={`group relative flex cursor-pointer items-start gap-3 rounded-xl p-3 text-left transition-all duration-200 ${
                                scope === 'financial_reports'
                                    ? 'bg-white shadow-xs ring-1 ring-slate-900/5 dark:bg-[#181a20] dark:ring-1 dark:ring-white/10'
                                    : 'hover:bg-white/60 dark:hover:bg-white/[0.04]'
                            }`}
                        >
                            <div
                                className={`flex size-9 shrink-0 items-center justify-center rounded-xl transition-colors ${
                                    scope === 'financial_reports'
                                        ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/25'
                                        : 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100/80 dark:bg-emerald-950/40 dark:text-emerald-400 dark:group-hover:bg-emerald-950/60'
                                }`}
                            >
                                <Scale className="size-4.5" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-1">
                                    <div className="flex items-center gap-1.5">
                                        <span className="font-mono text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                                            03
                                        </span>
                                        <h3
                                            className={`text-xs font-bold tracking-tight transition-colors ${
                                                scope === 'financial_reports'
                                                    ? 'text-slate-900 dark:text-white'
                                                    : 'text-slate-700 dark:text-zinc-300'
                                            }`}
                                        >
                                            Laporan Keuangan &amp; Neraca
                                        </h3>
                                    </div>
                                    {scope === 'financial_reports' && (
                                        <span className="size-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                                    )}
                                </div>
                                <p className="mt-0.5 text-[11px] font-medium text-slate-500 dark:text-zinc-400">
                                    Laba Rugi Bulanan, Arus Kas &amp; Neraca
                                </p>
                            </div>
                            {scope === 'financial_reports' && (
                                <div className="absolute inset-x-4 bottom-0 h-0.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                            )}
                        </button>
                    </div>

                    {/* ========================================================================= */}
                    {/* SCOPE 1: KEUANGAN PERKARA & KLIEN */}
                    {/* ========================================================================= */}
                    {scope === 'client_matters' && (
                        <div className="space-y-3.5">
                            {/* Matter Selector Bar (Wajib Pilih) */}
                            <Form
                                {...financeRoutes.index.form()}
                                className="flex flex-col gap-2 rounded-xl border border-slate-200/70 bg-white p-2.5 shadow-2xs sm:flex-row sm:items-center dark:border-white/[0.06] dark:bg-[#14161b]"
                            >
                                <div className="flex items-center gap-1.5 text-slate-500 dark:text-zinc-400">
                                    <FolderKanban className="size-3.5 shrink-0 text-blue-600 dark:text-blue-400" />
                                    <span className="text-xs font-semibold whitespace-nowrap">
                                        Filter Perkara:
                                    </span>
                                </div>
                                <div className="relative flex-1">
                                    <select
                                        name="matter_id"
                                        defaultValue={selectedMatterId}
                                        className="h-7.5 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-slate-50/70 pr-7 pl-2.5 text-xs font-medium text-slate-800 outline-hidden transition-colors hover:bg-slate-100 focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-zinc-200"
                                    >
                                        <option value="">
                                            -- Pilih Perkara / Klien Terlebih Dahulu --
                                        </option>
                                        {matters.map((m) => (
                                            <option value={m.id} key={m.id}>
                                                {m.matter_number} - {m.title}{' '}
                                                {m.client ? `(${m.client})` : ''}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="pointer-events-none absolute top-1/2 right-2 size-3 -translate-y-1/2 text-slate-400" />
                                </div>
                                <Button
                                    type="submit"
                                    size="sm"
                                    className="h-7.5 w-full shrink-0 rounded-lg bg-blue-600 px-3 text-xs font-semibold text-white hover:bg-blue-700 sm:w-auto"
                                >
                                    Tampilkan Data Perkara
                                </Button>
                            </Form>

                            {!selectedMatterId ? (
                                <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-white p-12 text-center shadow-xs dark:border-white/10 dark:bg-[#14161b]">
                                    <div className="flex size-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                                        <FolderKanban className="size-7" />
                                    </div>
                                    <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
                                        Pilih Perkara Terlebih Dahulu
                                    </h3>
                                    <p className="mt-1.5 max-w-md text-xs text-slate-500 dark:text-zinc-400">
                                        Seluruh data keuangan perkara, invoice tagihan klien, panjar pengadilan, dan rincian disbursement disembunyikan. Silakan pilih nomor perkara atau nama klien pada menu filter di atas untuk memulai.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {/* Client Matters Bento KPI Cards */}
                                    {overview && (
                                        <div className="space-y-2.5">
                                            <section className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
                                                <div className="group rounded-xl border border-slate-200/70 bg-white p-3 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#14161b]">
                                                    <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                                        <span className="text-[10px] font-bold tracking-wider uppercase">
                                                            TOTAL TAGIHAN KLIEN
                                                        </span>
                                                        <Receipt className="size-3.5 text-slate-400 transition-colors group-hover:text-blue-600 dark:text-zinc-500" />
                                                    </div>
                                                    <div className="mt-1.5 flex items-baseline justify-between">
                                                        <span className="font-mono text-lg font-bold tracking-tight text-slate-900 sm:text-xl dark:text-white">
                                                            {formatMoney(overview.invoiced_amount, currency)}
                                                        </span>
                                                    </div>
                                                    <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-1.5 text-[10px] text-slate-500 dark:border-white/[0.04]">
                                                        <span>Invoice Terbit</span>
                                                        <span className="font-semibold text-blue-600 dark:text-blue-400">Aktif</span>
                                                    </div>
                                                </div>

                                                <div className="group rounded-xl border border-slate-200/70 bg-white p-3 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#14161b]">
                                                    <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                                        <span className="text-[10px] font-bold tracking-wider uppercase">
                                                            TERTAGIH RIIL (COLLECTED)
                                                        </span>
                                                        <Banknote className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                                                    </div>
                                                    <div className="mt-1.5 flex items-baseline justify-between">
                                                        <span className="font-mono text-lg font-bold tracking-tight text-emerald-600 sm:text-xl dark:text-emerald-400">
                                                            {formatMoney(overview.total_cash_inflow ?? overview.payment_received_amount, currency)}
                                                        </span>
                                                    </div>
                                                    <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-1.5 text-[10px] text-slate-500 dark:border-white/[0.04]">
                                                        <span>Penerimaan Kas Klien</span>
                                                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">Lunas/DP</span>
                                                    </div>
                                                </div>

                                                <div className="group rounded-xl border border-slate-200/70 bg-white p-3 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#14161b]">
                                                    <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                                        <span className="text-[10px] font-bold tracking-wider uppercase">
                                                            SISA PIUTANG (OUTSTANDING)
                                                        </span>
                                                        <CalendarClock className="size-3.5 text-amber-500 dark:text-amber-400" />
                                                    </div>
                                                    <div className="mt-1.5 flex items-baseline justify-between">
                                                        <span className="font-mono text-lg font-bold tracking-tight text-amber-600 sm:text-xl dark:text-amber-400">
                                                            {formatMoney(overview.receivable_amount, currency)}
                                                        </span>
                                                    </div>
                                                    <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-1.5 text-[10px] text-slate-500 dark:border-white/[0.04]">
                                                        <span>Belum Dilunasi Klien</span>
                                                        <span className="font-semibold text-amber-600 dark:text-amber-400">Berjalan</span>
                                                    </div>
                                                </div>

                                                <div className="group rounded-xl border border-slate-200/70 bg-white p-3 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#14161b]">
                                                    <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                                        <span className="text-[10px] font-bold tracking-wider uppercase">
                                                            MARGIN LABA PERKARA
                                                        </span>
                                                        <DollarSign className="size-3.5 text-slate-400 transition-colors group-hover:text-blue-600 dark:text-zinc-500" />
                                                    </div>
                                                    <div className="mt-1.5 flex items-baseline justify-between">
                                                        <span className="font-mono text-lg font-bold tracking-tight text-slate-900 sm:text-xl dark:text-white">
                                                            {formatMoney(overview.margin_amount, currency)}
                                                        </span>
                                                    </div>
                                                    <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-1.5 text-[10px] text-slate-500 dark:border-white/[0.04]">
                                                        <span>Setelah Biaya Perkara</span>
                                                        <span className="font-semibold text-slate-700 dark:text-zinc-300">Netto</span>
                                                    </div>
                                                </div>
                                            </section>

                                            {/* Toggle Button for Aging Report */}
                                            <div className="flex items-center justify-between pt-0.5">
                                                <button
                                                    type="button"
                                                    onClick={() => setShowDetailedAnalytics((prev) => !prev)}
                                                    className="group inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200/80 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-2xs transition-all hover:border-slate-300 hover:bg-slate-50 dark:border-white/10 dark:bg-[#14161b] dark:text-zinc-300 dark:hover:bg-zinc-800/60"
                                                >
                                                    <span className="flex size-4 items-center justify-center rounded bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400">
                                                        {showDetailedAnalytics ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
                                                    </span>
                                                    <span>
                                                        {showDetailedAnalytics ? 'Sembunyikan Analisis Umur Piutang' : 'Tampilkan Analisis Umur Piutang (Aging Report)'}
                                                    </span>
                                                </button>
                                            </div>

                                            {showDetailedAnalytics && overview.aging && (
                                                <div className="rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                                    <span className="text-xs font-bold text-slate-900 uppercase dark:text-white">
                                                        Klasifikasi Umur Piutang Klien (Aging Analysis)
                                                    </span>
                                                    <div className="mt-2.5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                                                        {Object.entries(overview.aging).map(([bracket, val]) => (
                                                            <div key={bracket} className="rounded-lg bg-slate-50 p-2.5 text-center dark:bg-zinc-800/50">
                                                                <span className="text-[10px] font-semibold text-slate-500 uppercase dark:text-zinc-400">{bracket}</span>
                                                                <p className="mt-1 font-mono text-xs font-bold text-slate-900 dark:text-white">
                                                                    {formatMoney(Number(val), currency)}
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Sub Tabs for Client Matters */}
                                    <div className="flex [scrollbar-width:none] items-center gap-1 overflow-x-auto border-b border-slate-200/60 pb-2 [-ms-overflow-style:none] dark:border-white/[0.06] [&::-webkit-scrollbar]:hidden">
                                         <button
                                             type="button"
                                             onClick={() => setMatterTab('all')}
                                             className={`flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
                                                 matterTab === 'all'
                                                     ? 'bg-slate-900 text-white shadow-2xs dark:bg-white dark:text-slate-900'
                                                     : 'border border-slate-200/70 bg-white text-slate-600 hover:bg-slate-50 dark:border-white/[0.06] dark:bg-[#14161b] dark:text-zinc-400'
                                             }`}
                                         >
                                             <Layers className="size-3" />
                                             Semua Ledger Perkara
                                         </button>
                                         <button
                                             type="button"
                                             onClick={() => setMatterTab('profitability')}
                                             className={`flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
                                                 matterTab === 'profitability'
                                                     ? 'bg-blue-600 text-white shadow-2xs'
                                                     : 'border border-slate-200/70 bg-white text-slate-600 hover:bg-slate-50 dark:border-white/[0.06] dark:bg-[#14161b] dark:text-zinc-400'
                                             }`}
                                         >
                                             <BarChart3 className="size-3" />
                                             Profitabilitas Perkara ({profitability.length})
                                         </button>
                                         <button
                                             type="button"
                                             onClick={() => setMatterTab('invoices')}
                                             className={`flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
                                                 matterTab === 'invoices'
                                                     ? 'bg-slate-900 text-white shadow-2xs dark:bg-white dark:text-slate-900'
                                                     : 'border border-slate-200/70 bg-white text-slate-700 hover:bg-slate-50 dark:border-white/[0.06] dark:bg-[#14161b] dark:text-zinc-300'
                                             }`}
                                         >
                                             <ReceiptText className="size-3" />
                                             Invoice Tagihan ({invoices.length})
                                         </button>
                                         <button
                                             type="button"
                                             onClick={() => setMatterTab('quotations')}
                                             className={`flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
                                                 matterTab === 'quotations'
                                                     ? 'bg-slate-900 text-white shadow-2xs dark:bg-white dark:text-slate-900'
                                                     : 'border border-slate-200/70 bg-white text-slate-700 hover:bg-slate-50 dark:border-white/[0.06] dark:bg-[#14161b] dark:text-zinc-300'
                                             }`}
                                         >
                                             <FilePlus2 className="size-3" />
                                             Quotation ({quotations.length})
                                         </button>
                                         <button
                                             type="button"
                                             onClick={() => setMatterTab('trust_funds')}
                                             className={`flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
                                                 matterTab === 'trust_funds'
                                                     ? 'bg-cyan-600 text-white shadow-2xs'
                                                     : 'border border-slate-200/70 bg-white text-cyan-700 hover:bg-cyan-50/50 dark:border-white/[0.06] dark:bg-[#14161b] dark:text-cyan-400'
                                             }`}
                                         >
                                             <Lock className="size-3" />
                                             Dana Titipan Klien ({clientTrustFunds.length})
                                         </button>
                                         <button
                                             type="button"
                                             onClick={() => setMatterTab('disbursements')}
                                             className={`flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
                                                 matterTab === 'disbursements'
                                                     ? 'bg-rose-600 text-white shadow-2xs'
                                                     : 'border border-slate-200/70 bg-white text-rose-700 hover:bg-rose-50/50 dark:border-white/[0.06] dark:bg-[#14161b] dark:text-rose-400'
                                             }`}
                                         >
                                             <WalletCards className="size-3" />
                                             Biaya Perkara ({matterExpenses.length})
                                         </button>
                                         <button
                                             type="button"
                                             onClick={() => setMatterTab('payments')}
                                             className={`flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
                                                 matterTab === 'payments'
                                                     ? 'bg-emerald-600 text-white shadow-2xs'
                                                     : 'border border-slate-200/70 bg-white text-emerald-700 hover:bg-emerald-50/50 dark:border-white/[0.06] dark:bg-[#14161b] dark:text-emerald-400'
                                             }`}
                                         >
                                             <Banknote className="size-3" />
                                             Penerimaan Kas ({payments.length})
                                         </button>
                                     </div>

                                    {/* Views for Scope 1 */}
                                    {matterTab === 'profitability' && (
                                        <ProfitabilityTable items={profitability} />
                                    )}

                                    {matterTab === 'trust_funds' && (
                                        <ClientTrustView
                                            trustSummary={
                                                clientTrustSummary || {
                                                    total_deposit_in: 0,
                                                    total_disbursement_out: 0,
                                                    net_trust_balance: 0,
                                                    by_matter: [],
                                                }
                                            }
                                            trustFunds={clientTrustFunds}
                                            onOpenTrustModal={() => setModal('client_trust')}
                                        />
                                    )}

                                    {(matterTab === 'invoices' ||
                                        matterTab === 'quotations' ||
                                        matterTab === 'disbursements' ||
                                        matterTab === 'payments' ||
                                        matterTab === 'all') && (
                                        <div className="grid gap-3 lg:grid-cols-2">
                                            {(matterTab === 'all' || matterTab === 'invoices') && (
                                                <div className={matterTab === 'invoices' ? 'lg:col-span-2' : ''}>
                                                    <Ledger
                                                        title="Invoice Tagihan Klien"
                                                        items={invoices}
                                                        currency={currency}
                                                        icon={ReceiptText}
                                                        iconBg="bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
                                                        value={(i) => i.outstanding_amount ?? i.total_amount ?? 0}
                                                        date={(i) => i.due_at}
                                                        canTransition={can.invoiceTransition}
                                                        canCreate={can.invoice}
                                                        onCreate={() => setModal('invoice')}
                                                        actionLabel="Buat Invoice Baru"
                                                        emptyTitle="Belum Ada Invoice Tagihan"
                                                        emptyDescription="Belum ada tagihan yang diterbitkan untuk perkara atau klien terpilih. Terbitkan invoice baru untuk mencatat honorarium dan termin pembayaran."
                                                        onCancel={setCancelInvoice}
                                                    />
                                                </div>
                                            )}

                                            {(matterTab === 'all' || matterTab === 'quotations') && (
                                                <div className={matterTab === 'quotations' ? 'lg:col-span-2' : ''}>
                                                    <Ledger
                                                        title="Quotation & Penawaran Honorarium"
                                                        items={quotations}
                                                        currency={currency}
                                                        icon={FilePlus2}
                                                        iconBg="bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300"
                                                        value={(i) => i.total_amount ?? 0}
                                                        approveQuotations={can.quotationApprove}
                                                        canTransition={can.invoiceTransition}
                                                        canCreate={can.quotation}
                                                        onCreate={() => setModal('quotation')}
                                                        actionLabel="Buat Quotation Baru"
                                                        emptyTitle="Belum Ada Quotation Terdaftar"
                                                        emptyDescription="Belum ada proposal penawaran tarif jasa hukum atau estimasi biaya perkara yang diajukan ke calon klien."
                                                    />
                                                </div>
                                            )}

                                            {(matterTab === 'all' || matterTab === 'disbursements') && (
                                                <div className={matterTab === 'disbursements' ? 'lg:col-span-2' : ''}>
                                                    <Ledger
                                                        title="Biaya Perkara & Disbursement"
                                                        items={matterExpenses}
                                                        currency={currency}
                                                        icon={WalletCards}
                                                        iconBg="bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400"
                                                        value={(i) => i.amount ?? 0}
                                                        date={(i) => i.incurred_at}
                                                        canCreate={can.expense}
                                                        onCreate={() => setModal('expense')}
                                                        onDeleteExpense={can.expense ? (exp) => setExpenseToDelete(exp) : undefined}
                                                        actionLabel="Catat Biaya Perkara"
                                                        emptyTitle="Belum Ada Catatan Biaya Perkara"
                                                        emptyDescription="Belum ada pengeluaran operasional perkara seperti panjar pengadilan, materai, akomodasi, atau transportasi yang dicatat."
                                                    />
                                                </div>
                                            )}

                                            {(matterTab === 'all' || matterTab === 'payments') && (
                                                <div className={matterTab === 'payments' ? 'lg:col-span-2' : ''}>
                                                    <PaymentLedger
                                                        items={payments}
                                                        currency={currency}
                                                        canManage={can.payment}
                                                        onCreate={() => setModal('payment')}
                                                        actionLabel="Catat Penerimaan Kas"
                                                        emptyTitle="Belum Ada Penerimaan Kas"
                                                        emptyDescription="Belum ada riwayat transaksi pembayaran invoice, penerimaan retainer fee, atau transfer kas dari klien yang dicatat."
                                                        onReverse={setReversePayment}
                                                        onRefund={setRefundPayment}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}

                    {/* ========================================================================= */}
                    {/* SCOPE 2: OPERASIONAL KANTOR & FIRMA */}
                    {/* ========================================================================= */}
                    {scope === 'office_operations' && (
                        <div className="space-y-3.5">
                            {/* Office Operations KPI Banner */}
                            <section className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
                                <div className="rounded-xl border border-slate-200/70 bg-white p-3 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                    <span className="text-[10px] font-bold text-blue-600 uppercase dark:text-blue-400">Kas &amp; Bank Operasional</span>
                                    <p className="mt-1 font-mono text-base font-bold text-slate-900 dark:text-white">
                                        {formatMoney(totalOperationalCashBank, 'IDR')}
                                    </p>
                                    <span className="text-[9.5px] text-slate-400">Kas Kantor + Giro Bank</span>
                                </div>

                                <div className="rounded-xl border border-slate-200/70 bg-white p-3 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                    <span className="text-[10px] font-bold text-purple-600 uppercase dark:text-purple-400">Titipan Klien di Bank</span>
                                    <p className="mt-1 font-mono text-base font-bold text-purple-600 dark:text-purple-400">
                                        {formatMoney(totalClientTrustBank, 'IDR')}
                                    </p>
                                    <span className="text-[9.5px] text-slate-400">Rekening Escrow Panjar</span>
                                </div>

                                <div className="rounded-xl border border-slate-200/70 bg-white p-3 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                    <span className="text-[10px] font-bold text-rose-500 uppercase">Biaya Rutin Kantor</span>
                                    <p className="mt-1 font-mono text-base font-bold text-rose-600 dark:text-rose-400">
                                        {formatMoney(totalOfficeExpenseSum, 'IDR')}
                                    </p>
                                    <span className="text-[9.5px] text-slate-400">Non-Perkara</span>
                                </div>

                                <div className="rounded-xl border border-slate-200/70 bg-white p-3 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                    <span className="text-[10px] font-bold text-indigo-500 uppercase">Total Payroll Gaji</span>
                                    <p className="mt-1 font-mono text-base font-bold text-indigo-600 dark:text-indigo-400">
                                        {formatMoney(totalPayrollSum, 'IDR')}
                                    </p>
                                    <span className="text-[9.5px] text-slate-400">Staf &amp; Honor Advokat</span>
                                </div>

                                <div className="rounded-xl border border-slate-200/70 bg-white p-3 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                    <span className="text-[10px] font-bold text-amber-500 uppercase">Utang Talangan Partner</span>
                                    <p className="mt-1 font-mono text-base font-bold text-amber-600 dark:text-amber-400">
                                        {formatMoney(totalPartnerAdvDue, 'IDR')}
                                    </p>
                                    <span className="text-[9.5px] text-slate-400">Kewajiban ke Partner</span>
                                </div>
                            </section>

                            {/* Sub Tabs for Office Operations */}
                            <div className="flex [scrollbar-width:none] items-center gap-1 overflow-x-auto border-b border-slate-200/60 pb-2 [-ms-overflow-style:none] dark:border-white/[0.06] [&::-webkit-scrollbar]:hidden">
                                <button
                                    type="button"
                                    onClick={() => setOfficeTab('accounts')}
                                    className={`flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
                                        officeTab === 'accounts'
                                            ? 'bg-slate-900 text-white shadow-2xs dark:bg-white dark:text-slate-900'
                                            : 'border border-slate-200/70 bg-white text-slate-600 hover:bg-slate-50 dark:border-white/[0.06] dark:bg-[#14161b] dark:text-zinc-400'
                                    }`}
                                >
                                    <Building className="size-3" />
                                    Rekening Kas &amp; Bank ({accounts.length})
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setOfficeTab('office_expenses')}
                                    className={`flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
                                        officeTab === 'office_expenses'
                                            ? 'bg-rose-600 text-white shadow-2xs'
                                            : 'border border-slate-200/70 bg-white text-rose-700 hover:bg-rose-50/50 dark:border-white/[0.06] dark:bg-[#14161b] dark:text-rose-400'
                                    }`}
                                >
                                    <WalletCards className="size-3" />
                                    Beban Operasional Kantor ({officeExpenses.length})
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setOfficeTab('payroll')}
                                    className={`flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
                                        officeTab === 'payroll'
                                            ? 'bg-indigo-600 text-white shadow-2xs'
                                            : 'border border-slate-200/70 bg-white text-indigo-700 hover:bg-indigo-50/50 dark:border-white/[0.06] dark:bg-[#14161b] dark:text-indigo-400'
                                    }`}
                                >
                                    <Users className="size-3" />
                                    Penggajian &amp; Slip Gaji ({payrolls.length})
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setOfficeTab('partner_advances')}
                                    className={`flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
                                        officeTab === 'partner_advances'
                                            ? 'bg-amber-600 text-white shadow-2xs'
                                            : 'border border-slate-200/70 bg-white text-amber-700 hover:bg-amber-50/50 dark:border-white/[0.06] dark:bg-[#14161b] dark:text-amber-400'
                                    }`}
                                >
                                    <HandCoins className="size-3" />
                                    Talangan &amp; Hak Partner ({partnerAdvances.length})
                                </button>
                            </div>

                            {/* Views for Scope 2 */}
                            {officeTab === 'accounts' && (
                                <AccountsView
                                    accounts={accounts}
                                    transfers={transfers}
                                    onOpenAccountModal={() => setModal('account')}
                                    onOpenTransferModal={() => setModal('transfer')}
                                />
                            )}

                            {officeTab === 'office_expenses' && (
                                <div className="grid gap-3">
                                    <Ledger
                                        title="Beban Operasional Rutin Kantor (Non-Perkara)"
                                        items={officeExpenses}
                                        currency={currency}
                                        icon={WalletCards}
                                        iconBg="bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400"
                                        value={(i) => i.amount ?? 0}
                                        date={(i) => i.incurred_at}
                                        canCreate={can.expense}
                                        onCreate={() => setModal('expense')}
                                        onDeleteExpense={can.expense ? (exp) => setExpenseToDelete(exp) : undefined}
                                        actionLabel="Catat Biaya Kantor"
                                        emptyTitle="Belum Ada Biaya Operasional Kantor"
                                        emptyDescription="Belum ada pengeluaran rutin kantor seperti sewa gedung, listrik, internet, ATK, atau langganan software yang dicatat."
                                    />
                                </div>
                            )}

                            {officeTab === 'payroll' && (
                                <PayrollView
                                    payrolls={payrolls}
                                    onOpenPayrollModal={() => setModal('payroll')}
                                />
                            )}

                            {officeTab === 'partner_advances' && (
                                <PartnerAdvancesView
                                    advancesSummary={partnerAdvances}
                                    transactions={partnerTransactions}
                                    onOpenPartnerModal={() => setModal('partner_transaction')}
                                />
                            )}
                        </div>
                    )}

                    {/* ========================================================================= */}
                    {/* SCOPE 3: LAPORAN KEUANGAN & NERACA */}
                    {/* ========================================================================= */}
                    {scope === 'financial_reports' && (
                        <div className="space-y-3.5">
                            <ReportsView
                                incomeStatement={
                                    incomeStatement || {
                                        year: new Date().getFullYear(),
                                        months: [],
                                        summary: {
                                            total_revenue: 0,
                                            total_operational_expense: 0,
                                            total_payroll_expense: 0,
                                            total_expenses: 0,
                                            net_profit: 0,
                                        },
                                    }
                                }
                                balanceSheet={
                                    balanceSheet || {
                                        assets: {
                                            operational_cash_bank: 0,
                                            client_trust_bank: 0,
                                            tax_credit_pph23: 0,
                                            total_assets: 0,
                                        },
                                        liabilities: {
                                            partner_advances_due: 0,
                                            unpaid_payroll: 0,
                                            client_trust_liability: 0,
                                            total_liabilities: 0,
                                        },
                                        equity: {
                                            retained_earnings: 0,
                                            total_equity: 0,
                                            total_liabilities_and_equity: 0,
                                        },
                                        is_balanced: true,
                                    }
                                }
                            />
                        </div>
                    )}
                </main>
            </div>

            {/* Dialogs */}
            <FinanceDialog
                type={
                    modal === 'invoice' ||
                    modal === 'quotation' ||
                    modal === 'expense' ||
                    modal === 'payment'
                        ? modal
                        : null
                }
                onClose={() => setModal(null)}
                matters={matters}
                clients={clients}
                invoices={invoices}
                accounts={accounts}
                staffUsers={staffUsers}
            />

            <CreateAccountDialog
                open={modal === 'account'}
                onOpenChange={(open) => setModal(open ? 'account' : null)}
                partners={partnersList}
            />

            <CreateTransferDialog
                open={modal === 'transfer'}
                onOpenChange={(open) => setModal(open ? 'transfer' : null)}
                accounts={accounts}
            />

            <CreatePartnerTransactionDialog
                open={modal === 'partner_transaction'}
                onOpenChange={(open) =>
                    setModal(open ? 'partner_transaction' : null)
                }
                partners={partnersList}
                matters={matters}
                accounts={accounts}
            />

            <CreateClientTrustDialog
                open={modal === 'client_trust'}
                onOpenChange={(open) =>
                    setModal(open ? 'client_trust' : null)
                }
                clients={clients}
                matters={matters}
                trustAccounts={trustAccountsList}
            />

            <CreatePayrollDialog
                open={modal === 'payroll'}
                onOpenChange={(open) => setModal(open ? 'payroll' : null)}
                staffUsers={staffUsers}
                accounts={accounts}
            />
            <ReversePaymentDialog
                payment={reversePayment}
                onClose={() => setReversePayment(null)}
            />
            <RefundPaymentDialog
                payment={refundPayment}
                onClose={() => setRefundPayment(null)}
            />
            <CancelInvoiceDialog
                invoice={cancelInvoice}
                onClose={() => setCancelInvoice(null)}
            />

            {/* Modal Konfirmasi Hapus Biaya Perkara */}
            <ConfirmDialog
                open={!!expenseToDelete}
                onOpenChange={(open) => !open && setExpenseToDelete(null)}
                title="Hapus Catatan Biaya Perkara"
                description={
                    expenseToDelete
                        ? `Apakah Anda yakin ingin menghapus catatan biaya "${expenseToDelete.description || expenseToDelete.title || 'Biaya Operasional'}" senilai ${formatMoney(expenseToDelete.amount ?? 0, expenseToDelete.currency || currency)}?`
                        : ''
                }
                confirmLabel="Hapus Biaya"
                variant="danger"
                processing={isDeletingExpense}
                onConfirm={() => {
                    if (!expenseToDelete) return;
                    setIsDeletingExpense(true);
                    router.delete(`/finance/expenses/${expenseToDelete.id}`, {
                        onFinish: () => {
                            setIsDeletingExpense(false);
                            setExpenseToDelete(null);
                        },
                    });
                }}
            />
        </>
    );
}

function Ledger({
    title,
    items,
    currency,
    icon: IconComp,
    iconBg = 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400',
    value,
    date,
    approveQuotations = false,
    canTransition = false,
    canCreate = false,
    onCreate,
    actionLabel,
    emptyTitle = 'Belum ada catatan transaksi',
    emptyDescription = 'Belum ada data pada bagian ini.',
    onCancel,
    onDeleteExpense,
}: {
    title: string;
    items: LedgerItem[];
    currency: string;
    icon: typeof ReceiptText;
    iconBg?: string;
    value: (item: LedgerItem) => number;
    date?: (item: LedgerItem) => string | undefined;
    approveQuotations?: boolean;
    canTransition?: boolean;
    canCreate?: boolean;
    onCreate?: () => void;
    actionLabel?: string;
    emptyTitle?: string;
    emptyDescription?: string;
    onCancel?: (invoice: LedgerItem) => void;
    onDeleteExpense?: (expense: LedgerItem) => void;
}) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredItems = useMemo(() => {
        if (!searchQuery) return items;
        const q = searchQuery.toLowerCase();
        return items.filter((i) => {
            return (
                i.invoice_number?.toLowerCase().includes(q) ||
                i.quotation_number?.toLowerCase().includes(q) ||
                i.title?.toLowerCase().includes(q) ||
                i.description?.toLowerCase().includes(q) ||
                i.category?.toLowerCase().includes(q) ||
                i.matter?.matter_number.toLowerCase().includes(q) ||
                i.matter?.title.toLowerCase().includes(q)
            );
        });
    }, [items, searchQuery]);

    return (
        <div className="flex flex-col rounded-xl border border-slate-200/70 bg-white p-3 shadow-2xs sm:p-3.5 dark:border-white/[0.06] dark:bg-[#14161b]">
            {/* Header */}
            <div className="flex flex-col justify-between gap-2.5 border-b border-slate-100 pb-2.5 sm:flex-row sm:items-center dark:border-white/[0.04]">
                <div className="flex items-center gap-2">
                    <div
                        className={`flex size-7 shrink-0 items-center justify-center rounded-lg ${iconBg}`}
                    >
                        <IconComp className="size-3.5" />
                    </div>
                    <div>
                        <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                            {title}
                        </h3>
                        <p className="text-[10px] text-slate-400 dark:text-zinc-500">
                            Log transaksi &amp; status pembukuan keuangan
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-slate-600 dark:bg-zinc-800 dark:text-zinc-400">
                        {items.length} entri
                    </span>
                    {canCreate && onCreate && (
                        <Button
                            size="sm"
                            onClick={onCreate}
                            className="h-7 rounded-lg bg-slate-900 px-2.5 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 dark:bg-white dark:text-slate-900"
                        >
                            <Plus className="mr-1 size-3" />
                            {actionLabel
                                ? actionLabel.replace('Baru', '').trim()
                                : 'Tambah'}
                        </Button>
                    )}
                </div>
            </div>

            {/* Quick Search Toolbar */}
            <div className="my-2.5 flex gap-1.5">
                <div className="relative flex-1">
                    <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-slate-400" />
                    <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={`Cari nomor, perihal, atau perkara ${title.toLowerCase()}...`}
                        className="h-7.5 rounded-lg border-slate-200/80 bg-slate-50/50 pl-8 text-xs text-slate-900 focus:border-blue-500 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-zinc-100"
                    />
                </div>
                {searchQuery && (
                    <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="flex h-7.5 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white px-2 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-300"
                        title="Reset Pencarian"
                    >
                        <RotateCcw className="size-3 text-slate-400" />
                    </button>
                )}
            </div>

            {/* Feed List */}
            <div className="mt-0.5">
                {filteredItems.length > 0 ? (
                    <div className="max-h-[460px] space-y-1.5 overflow-y-auto pr-1">
                        {filteredItems.map((i) => (
                            <div
                                key={i.id}
                                className="group flex flex-col justify-between gap-2.5 rounded-xl border border-slate-200/70 bg-white p-2.5 shadow-2xs transition-all hover:border-slate-300 hover:bg-slate-50/20 hover:shadow-xs sm:flex-row sm:items-center sm:p-3 dark:border-white/[0.05] dark:bg-[#14161b] dark:hover:border-white/10 dark:hover:bg-white/[0.02]"
                            >
                                <div className="flex min-w-0 flex-1 items-start gap-2.5">
                                    <div
                                        className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg border transition-transform group-hover:scale-105 ${iconBg} border-slate-200/60 dark:border-white/10`}
                                    >
                                        <IconComp className="size-3.5" />
                                    </div>

                                    <div className="min-w-0 flex-1 space-y-0.5">
                                        <div className="flex flex-wrap items-center gap-1 text-[9.5px]">
                                            {i.matter?.matter_number && (
                                                <span className="inline-flex items-center rounded bg-slate-100 px-1.5 py-0.5 font-mono font-bold text-slate-700 dark:bg-white/[0.08] dark:text-zinc-300">
                                                    {i.matter.matter_number}
                                                </span>
                                            )}
                                            <StatusBadge value={i.status} />
                                            {i.category && (
                                                <span className="inline-flex items-center rounded bg-slate-100 px-1.5 py-0.5 font-medium text-slate-600 capitalize dark:bg-zinc-800 dark:text-zinc-400">
                                                    {i.category}
                                                </span>
                                            )}
                                        </div>

                                        <h4 className="line-clamp-1 text-xs font-bold text-slate-900 dark:text-white">
                                            {i.invoice_number ? (
                                                <Link
                                                    href={invoiceRoutes.show.url(
                                                        i.id,
                                                    )}
                                                    className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                                                >
                                                    {i.invoice_number}
                                                </Link>
                                            ) : (
                                                (i.quotation_number ??
                                                i.title ??
                                                i.description)
                                            )}
                                        </h4>

                                        <div className="flex flex-wrap items-center gap-x-1.5 text-[10.5px] text-slate-500 dark:text-zinc-400">
                                            {i.matter?.title && (
                                                <span className="max-w-[260px] truncate font-medium text-slate-600 dark:text-zinc-300">
                                                    {i.matter.title}
                                                </span>
                                            )}
                                            {date?.(i) && (
                                                <>
                                                    <span>·</span>
                                                    <span className="font-mono text-slate-500 dark:text-zinc-400">
                                                        Jatuh Tempo:{' '}
                                                        {formatDate(date(i)!)}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex shrink-0 items-center justify-between gap-1 border-t border-slate-100 pt-1.5 pl-9.5 sm:flex-col sm:items-end sm:justify-center sm:border-t-0 sm:pt-0 sm:pl-0 dark:border-white/[0.04]">
                                    <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                                        {formatMoney(
                                            value(i),
                                            i.currency || currency,
                                        )}
                                    </span>

                                    <div className="flex items-center gap-1">
                                        {i.invoice_number && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="size-6.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-white/[0.06] dark:hover:text-white"
                                                asChild
                                            >
                                                <a
                                                    href={invoiceRoutes.pdf.url(
                                                        i.id,
                                                    )}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    title="Download Dokumen PDF Invoice"
                                                >
                                                    <FileDown className="size-3.5 text-blue-600 dark:text-blue-400" />
                                                </a>
                                            </Button>
                                        )}

                                        {i.quotation_number && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="size-6.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-white/[0.06] dark:hover:text-white"
                                                asChild
                                            >
                                                <a
                                                    href={quotationRoutes.pdf.url(
                                                        i.id,
                                                    )}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    title="Download Dokumen PDF Quotation"
                                                >
                                                    <FileDown className="size-3.5 text-slate-700 dark:text-zinc-300" />
                                                </a>
                                            </Button>
                                        )}

                                        {canTransition &&
                                            i.invoice_number &&
                                            i.status === 'draft' && (
                                                <Form
                                                    {...invoiceRoutes.transition.form(
                                                        i.id,
                                                    )}
                                                >
                                                    <input
                                                        type="hidden"
                                                        name="status"
                                                        value="sent"
                                                    />
                                                    <Button
                                                        size="sm"
                                                        className="h-6.5 rounded-lg bg-slate-900 px-2 text-[10px] font-semibold text-white hover:bg-black dark:bg-white dark:text-slate-900"
                                                    >
                                                        Kirim
                                                    </Button>
                                                </Form>
                                            )}

                                        {canTransition &&
                                            i.invoice_number &&
                                            [
                                                'draft',
                                                'sent',
                                                'overdue',
                                            ].includes(i.status) &&
                                            (i.paid_amount ?? 0) === 0 && (
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() =>
                                                        onCancel?.(i)
                                                    }
                                                    className="h-6.5 rounded-lg text-[10px] font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                                                >
                                                    Batal
                                                </Button>
                                            )}

                                        {approveQuotations &&
                                            i.quotation_number &&
                                            [
                                                'draft',
                                                'pending_approval',
                                            ].includes(i.status) && (
                                                <Form
                                                    {...quotationRoutes.approve.form(
                                                        i.id,
                                                    )}
                                                >
                                                    <Button
                                                        size="sm"
                                                        className="h-6.5 rounded-lg bg-emerald-600 px-2 text-[10px] font-semibold text-white hover:bg-emerald-700"
                                                    >
                                                        Setujui
                                                    </Button>
                                                </Form>
                                            )}

                                        {onDeleteExpense &&
                                            !i.invoice_number &&
                                            !i.quotation_number && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() =>
                                                        onDeleteExpense(i)
                                                    }
                                                    className="size-6.5 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30 dark:hover:text-rose-400"
                                                    title="Hapus Catatan Biaya"
                                                >
                                                    <Trash2 className="size-3 text-rose-500" />
                                                </Button>
                                            )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center px-3 py-8 text-center">
                        <div className="flex size-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-white/[0.06] dark:text-zinc-300">
                            <IconComp className="size-4.5" />
                        </div>
                        <p className="mt-2.5 text-xs font-bold text-slate-800 dark:text-zinc-200">
                            {searchQuery
                                ? 'Tidak Ada Hasil Pencarian'
                                : emptyTitle}
                        </p>
                        <p className="mt-0.5 max-w-xs text-[10.5px] text-slate-400 dark:text-zinc-500">
                            {searchQuery
                                ? 'Sesuaikan kata kunci pencarian Anda.'
                                : emptyDescription}
                        </p>
                        {canCreate && onCreate && !searchQuery && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onCreate}
                                className="mt-3 h-7.5 rounded-lg border-slate-200 text-xs font-semibold text-slate-900 hover:bg-slate-50 dark:border-white/10 dark:text-white dark:hover:bg-zinc-800"
                            >
                                <Plus className="mr-1 size-3" />{' '}
                                {actionLabel ||
                                    `Buat ${title.split(' ')[0]} Baru`}
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function PaymentLedger({
    items,
    currency,
    canManage,
    onCreate,
    actionLabel,
    emptyTitle = 'Belum Ada Penerimaan Kas',
    emptyDescription = 'Belum ada riwayat transaksi pembayaran invoice, penerimaan retainer fee, atau transfer kas dari klien yang dicatat.',
    onReverse,
    onRefund,
}: {
    items: LedgerItem[];
    currency: string;
    canManage: boolean;
    onCreate?: () => void;
    actionLabel?: string;
    emptyTitle?: string;
    emptyDescription?: string;
    onReverse: (payment: LedgerItem) => void;
    onRefund: (payment: LedgerItem) => void;
}) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredItems = useMemo(() => {
        if (!searchQuery) return items;
        const q = searchQuery.toLowerCase();
        return items.filter((p) => {
            return (
                p.matter?.matter_number.toLowerCase().includes(q) ||
                p.matter?.title.toLowerCase().includes(q) ||
                p.reversal_reason?.toLowerCase().includes(q) ||
                p.refund_reason?.toLowerCase().includes(q) ||
                p.allocations?.some((a) =>
                    a.invoice?.invoice_number?.toLowerCase().includes(q),
                )
            );
        });
    }, [items, searchQuery]);

    return (
        <div className="flex flex-col rounded-xl border border-slate-200/70 bg-white p-3 shadow-2xs sm:p-3.5 dark:border-white/[0.06] dark:bg-[#14161b]">
            {/* Header */}
            <div className="flex flex-col justify-between gap-2.5 border-b border-slate-100 pb-2.5 sm:flex-row sm:items-center dark:border-white/[0.04]">
                <div className="flex items-center gap-2">
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                        <Banknote className="size-3.5" />
                    </div>
                    <div>
                        <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                            Riwayat Penerimaan Pembayaran
                        </h3>
                        <p className="text-[10px] text-slate-400 dark:text-zinc-500">
                            Log transfer kas masuk, pelunasan invoice &amp;
                            deposit klien
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-slate-600 dark:bg-zinc-800 dark:text-zinc-400">
                        {items.length} pembayaran
                    </span>
                    {canManage && onCreate && (
                        <Button
                            size="sm"
                            onClick={onCreate}
                            className="h-7 rounded-lg bg-emerald-600 px-2.5 text-xs font-semibold text-white shadow-2xs hover:bg-emerald-700"
                        >
                            <Plus className="mr-1 size-3" />
                            Catat Kas
                        </Button>
                    )}
                </div>
            </div>

            {/* Quick Search Toolbar */}
            <div className="my-2.5 flex gap-1.5">
                <div className="relative flex-1">
                    <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-slate-400" />
                    <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cari perkara atau alokasi invoice pembayaran..."
                        className="h-7.5 rounded-lg border-slate-200/80 bg-slate-50/50 pl-8 text-xs text-slate-900 focus:border-emerald-500 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-zinc-100"
                    />
                </div>
                {searchQuery && (
                    <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="flex h-7.5 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white px-2 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-300"
                        title="Reset Pencarian"
                    >
                        <RotateCcw className="size-3 text-slate-400" />
                    </button>
                )}
            </div>

            {/* Feed List */}
            <div className="mt-0.5">
                {filteredItems.length > 0 ? (
                    <div className="max-h-[460px] space-y-1.5 overflow-y-auto pr-1">
                        {filteredItems.map((payment) => (
                            <div
                                key={payment.id}
                                className="group flex flex-col justify-between gap-2.5 rounded-xl border border-slate-200/70 bg-white p-2.5 shadow-2xs transition-all hover:border-emerald-300 hover:bg-emerald-50/20 hover:shadow-xs sm:flex-row sm:items-center sm:p-3 dark:border-white/[0.05] dark:bg-[#14161b] dark:hover:border-emerald-800/50 dark:hover:bg-white/[0.02]"
                            >
                                <div className="flex min-w-0 flex-1 items-start gap-2.5">
                                    <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg border border-emerald-200/60 bg-emerald-50 text-emerald-600 transition-transform group-hover:scale-105 dark:border-emerald-900/40 dark:bg-emerald-950/60 dark:text-emerald-400">
                                        <Banknote className="size-3.5" />
                                    </div>

                                    <div className="min-w-0 flex-1 space-y-0.5">
                                        <div className="flex flex-wrap items-center gap-1 text-[9.5px]">
                                            {payment.matter?.matter_number && (
                                                <span className="inline-flex items-center rounded bg-slate-100 px-1.5 py-0.5 font-mono font-bold text-slate-700 dark:bg-white/[0.08] dark:text-zinc-300">
                                                    {
                                                        payment.matter
                                                            .matter_number
                                                    }
                                                </span>
                                            )}
                                            <span className="inline-flex items-center rounded bg-emerald-50 px-1.5 py-0.5 font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                                                {payment.reversed_at
                                                    ? 'Dikoreksi'
                                                    : payment.refunded_at
                                                      ? 'Direfund'
                                                      : 'Tercatat Sah'}
                                            </span>
                                            {payment.received_at && (
                                                <span className="inline-flex items-center rounded bg-slate-100 px-1.5 py-0.5 font-mono text-slate-600 dark:bg-zinc-800 dark:text-zinc-400">
                                                    {formatDate(
                                                        payment.received_at,
                                                    )}
                                                </span>
                                            )}
                                        </div>

                                        <h4 className="line-clamp-1 text-xs font-bold text-slate-900 dark:text-white">
                                            <Link
                                                href={paymentRoutes.show.url(
                                                    payment.id,
                                                )}
                                                className="transition-colors hover:text-emerald-600 dark:hover:text-emerald-400"
                                            >
                                                Penerimaan:{' '}
                                                {formatMoney(
                                                    payment.amount ?? 0,
                                                    payment.currency ||
                                                        currency,
                                                )}
                                            </Link>
                                        </h4>

                                        <div className="flex flex-wrap items-center gap-x-1.5 text-[10.5px] text-slate-500 dark:text-zinc-400">
                                            <span>
                                                {payment.matter?.title
                                                    ? payment.matter.title
                                                    : 'Tanpa Terikat Perkara Khusus'}
                                            </span>
                                            {payment.allocations?.map(
                                                (allocation) => (
                                                    <span
                                                        key={allocation.id}
                                                        className="font-mono text-slate-600 dark:text-zinc-300"
                                                    >
                                                        · Alokasi:{' '}
                                                        {allocation.invoice
                                                            ?.invoice_number ??
                                                            'Invoice'}{' '}
                                                        (
                                                        {formatMoney(
                                                            allocation.amount,
                                                            allocation.invoice
                                                                ?.currency ??
                                                                currency,
                                                        )}
                                                        )
                                                    </span>
                                                ),
                                            )}
                                        </div>

                                        {payment.reversed_at && (
                                            <p className="mt-0.5 text-[9.5px] font-semibold text-rose-600 dark:text-rose-400">
                                                Dikoreksi:{' '}
                                                {payment.reversal_reason}
                                            </p>
                                        )}
                                        {payment.refunded_at && (
                                            <p className="mt-0.5 text-[9.5px] font-semibold text-rose-600 dark:text-rose-400">
                                                Direfund:{' '}
                                                {payment.refund_reason}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex shrink-0 items-center justify-between gap-1 border-t border-slate-100 pt-1.5 pl-9.5 sm:flex-col sm:items-end sm:justify-center sm:border-t-0 sm:pt-0 sm:pl-0 dark:border-white/[0.04]">
                                    <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                        {formatMoney(
                                            payment.amount ?? 0,
                                            payment.currency || currency,
                                        )}
                                    </span>

                                    {canManage &&
                                        !payment.reversed_at &&
                                        !payment.refunded_at && (
                                            <div className="flex items-center gap-1">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() =>
                                                        onReverse(payment)
                                                    }
                                                    className="h-6.5 rounded-lg border-slate-200 px-2 text-[10px] font-semibold hover:bg-slate-50 dark:border-white/10"
                                                >
                                                    Koreksi
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() =>
                                                        onRefund(payment)
                                                    }
                                                    className="h-6.5 rounded-lg px-2 text-[10px] font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                                                >
                                                    Refund
                                                </Button>
                                            </div>
                                        )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center px-3 py-8 text-center">
                        <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                            <Banknote className="size-4.5" />
                        </div>
                        <p className="mt-2.5 text-xs font-bold text-slate-800 dark:text-zinc-200">
                            {searchQuery
                                ? 'Tidak Ada Hasil Pencarian'
                                : emptyTitle}
                        </p>
                        <p className="mt-0.5 max-w-xs text-[10.5px] text-slate-400 dark:text-zinc-500">
                            {searchQuery
                                ? 'Sesuaikan kata kunci pencarian Anda.'
                                : emptyDescription}
                        </p>
                        {canManage && onCreate && !searchQuery && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onCreate}
                                className="mt-3 h-7.5 rounded-lg border-emerald-200 text-xs font-semibold text-emerald-600 hover:bg-emerald-50 dark:border-emerald-900/40 dark:text-emerald-400"
                            >
                                <Plus className="mr-1 size-3" /> Catat Kas Masuk
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function ReversePaymentDialog({
    payment,
    onClose,
}: {
    payment: LedgerItem | null;
    onClose: () => void;
}) {
    return (
        <Dialog open={!!payment} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xl sm:max-w-md dark:border-white/10 dark:bg-[#14161b]">
                <DialogHeader className="border-b border-slate-100 pb-3 dark:border-white/[0.06]">
                    <div className="flex items-center gap-2.5">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/40">
                            <Undo2 className="size-4" />
                        </div>
                        <DialogTitle className="text-sm font-bold text-slate-900 dark:text-white">
                            Koreksi &amp; Batalkan Pembayaran
                        </DialogTitle>
                    </div>
                </DialogHeader>
                {payment && (
                    <Form
                        {...paymentRoutes.reverse.form(payment.id)}
                        className="space-y-3 pt-1"
                        onSuccess={onClose}
                    >
                        {({ processing, errors }) => (
                            <>
                                <p className="text-xs text-slate-500 dark:text-zinc-400">
                                    Alokasi invoice akan dibuka kembali dan
                                    transaksi dicatat dalam log audit.
                                </p>
                                <div className="grid gap-1">
                                    <Label
                                        htmlFor="reason"
                                        className="text-xs font-semibold text-slate-700 dark:text-zinc-200"
                                    >
                                        Alasan Pembatalan
                                    </Label>
                                    <textarea
                                        className="w-full rounded-lg border border-slate-200 bg-slate-50/70 p-2 text-xs text-slate-900 outline-hidden transition-colors focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
                                        id="reason"
                                        name="reason"
                                        rows={3}
                                        placeholder="Koreksi salah nominal atau salah rekening..."
                                        required
                                        minLength={8}
                                    />
                                    {errors.reason && (
                                        <p className="text-xs text-rose-500">
                                            {errors.reason}
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3 dark:border-white/[0.06]">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={onClose}
                                        className="h-8 rounded-lg border-slate-200 px-3 text-xs text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-zinc-300"
                                    >
                                        Batal
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        disabled={processing}
                                        className="h-8 rounded-lg px-3.5 text-xs font-semibold"
                                    >
                                        Batalkan Pembayaran
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                )}
            </DialogContent>
        </Dialog>
    );
}

function RefundPaymentDialog({
    payment,
    onClose,
}: {
    payment: LedgerItem | null;
    onClose: () => void;
}) {
    return (
        <Dialog open={!!payment} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xl sm:max-w-md dark:border-white/10 dark:bg-[#14161b]">
                <DialogHeader className="border-b border-slate-100 pb-3 dark:border-white/[0.06]">
                    <div className="flex items-center gap-2.5">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/40">
                            <Undo2 className="size-4" />
                        </div>
                        <DialogTitle className="text-sm font-bold text-slate-900 dark:text-white">
                            Refund Dana ke Klien
                        </DialogTitle>
                    </div>
                </DialogHeader>
                {payment && (
                    <Form
                        {...paymentRoutes.refund.form(payment.id)}
                        className="space-y-3 pt-1"
                        onSuccess={onClose}
                    >
                        {({ processing, errors }) => (
                            <>
                                <p className="text-xs text-slate-500 dark:text-zinc-400">
                                    Gunakan jika dana telah ditransfer balik ke
                                    rekening klien. Saldo invoice akan
                                    disesuaikan.
                                </p>
                                <div className="grid gap-1">
                                    <Label
                                        htmlFor="refund-reason"
                                        className="text-xs font-semibold text-slate-700 dark:text-zinc-200"
                                    >
                                        Alasan Pengembalian (Refund)
                                    </Label>
                                    <textarea
                                        className="w-full rounded-lg border border-slate-200 bg-slate-50/70 p-2 text-xs text-slate-900 outline-hidden transition-colors focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
                                        id="refund-reason"
                                        name="reason"
                                        rows={3}
                                        placeholder="Kelebihan bayar atau perkara dihentikan..."
                                        required
                                        minLength={8}
                                    />
                                    {errors.reason && (
                                        <p className="text-xs text-rose-500">
                                            {errors.reason}
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3 dark:border-white/[0.06]">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={onClose}
                                        className="h-8 rounded-lg border-slate-200 px-3 text-xs text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-zinc-300"
                                    >
                                        Batal
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        disabled={processing}
                                        className="h-8 rounded-lg px-3.5 text-xs font-semibold"
                                    >
                                        Catat Refund Dana
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                )}
            </DialogContent>
        </Dialog>
    );
}

function CancelInvoiceDialog({
    invoice,
    onClose,
}: {
    invoice: LedgerItem | null;
    onClose: () => void;
}) {
    return (
        <Dialog open={!!invoice} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xl sm:max-w-md dark:border-white/10 dark:bg-[#14161b]">
                <DialogHeader className="border-b border-slate-100 pb-3 dark:border-white/[0.06]">
                    <div className="flex items-center gap-2.5">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/40">
                            <Trash2 className="size-4" />
                        </div>
                        <DialogTitle className="text-sm font-bold text-slate-900 dark:text-white">
                            Batalkan Invoice
                        </DialogTitle>
                    </div>
                </DialogHeader>
                {invoice && (
                    <Form
                        {...invoiceRoutes.transition.form(invoice.id)}
                        className="space-y-3 pt-1"
                        onSuccess={onClose}
                    >
                        {({ processing, errors }) => (
                            <>
                                <input
                                    type="hidden"
                                    name="status"
                                    value="cancelled"
                                />
                                <p className="text-xs text-slate-500 dark:text-zinc-400">
                                    Invoice {invoice.invoice_number} akan
                                    dibatalkan secara permanen.
                                </p>
                                <div className="grid gap-1">
                                    <Label
                                        htmlFor="cancellation-reason"
                                        className="text-xs font-semibold text-slate-700 dark:text-zinc-200"
                                    >
                                        Alasan Pembatalan
                                    </Label>
                                    <textarea
                                        className="w-full rounded-lg border border-slate-200 bg-slate-50/70 p-2 text-xs text-slate-900 outline-hidden transition-colors focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
                                        id="cancellation-reason"
                                        name="reason"
                                        rows={3}
                                        placeholder="Perubahan skema penagihan..."
                                        required
                                        minLength={8}
                                    />
                                    {errors.reason && (
                                        <p className="text-xs text-rose-500">
                                            {errors.reason}
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3 dark:border-white/[0.06]">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={onClose}
                                        className="h-8 rounded-lg border-slate-200 px-3 text-xs text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-zinc-300"
                                    >
                                        Batal
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        disabled={processing}
                                        className="h-8 rounded-lg px-3.5 text-xs font-semibold"
                                    >
                                        Batalkan Invoice
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                )}
            </DialogContent>
        </Dialog>
    );
}

function FinanceDialog({
    type,
    onClose,
    matters,
    clients,
    invoices,
    accounts = [],
    staffUsers = [],
}: {
    type:
        | 'invoice'
        | 'quotation'
        | 'expense'
        | 'payment'
        | 'account'
        | 'transfer'
        | 'partner_transaction'
        | 'client_trust'
        | 'payroll'
        | null;
    onClose: () => void;
    matters: Matter[];
    clients: { id: string; display_name: string }[];
    invoices: LedgerItem[];
    accounts?: FinancialAccountItem[];
    staffUsers?: { id: number; name: string }[];
}) {
    const [lineItems, setLineItems] = useState([
        { description: '', quantity: '1', unitAmount: '' },
    ]);
    const [discountAmount, setDiscountAmount] = useState<string>('0');
    const [taxRate, setTaxRate] = useState<string>('11');

    const subtotal = lineItems.reduce((acc, item) => {
        const qty = Number(item.quantity) || 0;
        const amt = Number(item.unitAmount) || 0;
        return acc + qty * amt;
    }, 0);

    const discount = Number(discountAmount) || 0;
    const taxableAmount = Math.max(0, subtotal - discount);
    const tax = Math.round(taxableAmount * ((Number(taxRate) || 0) / 100));
    const grandTotal = taxableAmount + tax;

    if (!type) {
        return null;
    }

    const route =
        type === 'invoice'
            ? invoiceRoutes.store
            : type === 'quotation'
              ? quotationRoutes.store
              : type === 'expense'
                ? expenseRoutes.store
                : paymentRoutes.store;
    const isExpense = type === 'expense';
    const isPayment = type === 'payment';

    const dialogTitles = {
        invoice: 'Buat Invoice Tagihan Baru',
        quotation: 'Buat Penawaran Tarif (Quotation)',
        expense: 'Catat Pengeluaran & Biaya Perkara',
        payment: 'Catat Penerimaan Pembayaran',
    };

    const dialogIcons = {
        invoice: ReceiptText,
        quotation: FilePlus2,
        expense: WalletCards,
        payment: Banknote,
    };

    const DialogIcon = (dialogIcons as any)[type] || ReceiptText;

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="max-h-[85vh] overflow-y-auto rounded-xl border border-slate-200/80 bg-white p-5 shadow-xl sm:max-w-lg dark:border-white/10 dark:bg-[#14161b]">
                <DialogHeader className="border-b border-slate-100 pb-3 dark:border-white/[0.06]">
                    <div className="flex items-center gap-2.5">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                            <DialogIcon className="size-4" />
                        </div>
                        <div>
                            <DialogTitle className="text-sm font-bold text-slate-900 dark:text-white">
                                {(dialogTitles as any)[type] || 'Transaksi Keuangan'}
                            </DialogTitle>
                            <DialogDescription className="text-xs text-slate-500 dark:text-zinc-400">
                                Lengkapi formulir transaksi keuangan berikut.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <Form
                    {...route.form()}
                    encType="multipart/form-data"
                    className="space-y-3 pt-1"
                    onSuccess={onClose}
                >
                    {({ processing, errors }) => (
                        <>
                            <SelectField
                                name="matter_id"
                                label="Terkait Perkara (Matter)"
                                matters={matters}
                                required={isExpense}
                            />

                            <SelectField
                                name="client_id"
                                label="Klien (Client)"
                                clients={clients}
                                required={!isExpense}
                            />

                            {!isExpense && !isPayment && (
                                <>
                                    <Field
                                        name="title"
                                        label="Judul Tagihan / Quotation"
                                        placeholder="cth: Tagihan Honorarium Retainer Bulan Juni"
                                        required
                                    />
                                    <div className="grid gap-2.5 sm:grid-cols-2">
                                        <Field
                                            name="currency"
                                            label="Mata Uang"
                                            defaultValue="IDR"
                                            required
                                        />
                                        <Field
                                            name={
                                                type === 'invoice'
                                                    ? 'due_at'
                                                    : 'valid_until'
                                            }
                                            label={
                                                type === 'invoice'
                                                    ? 'Jatuh Tempo'
                                                    : 'Berlaku Hingga'
                                            }
                                            type="date"
                                            required
                                        />
                                    </div>

                                    {/* Line Items Dynamic Builder */}
                                    <div className="space-y-2 rounded-lg border border-slate-200/70 bg-slate-50/60 p-3 dark:border-white/[0.04] dark:bg-[#121418]">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-xs font-semibold text-slate-900 dark:text-white">
                                                Rincian Item (Line Items)
                                            </Label>
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="outline"
                                                className="h-6 rounded-md px-2 text-[10.5px]"
                                                onClick={() =>
                                                    setLineItems((items) => [
                                                        ...items,
                                                        {
                                                            description: '',
                                                            quantity: '1',
                                                            unitAmount: '',
                                                        },
                                                    ])
                                                }
                                            >
                                                <Plus className="mr-0.5 size-2.5" />{' '}
                                                Tambah Baris
                                            </Button>
                                        </div>

                                        <div className="space-y-1.5 pt-1">
                                            {lineItems.map((item, index) => {
                                                const rowTotal =
                                                    (Number(item.quantity) ||
                                                        0) *
                                                    (Number(item.unitAmount) ||
                                                        0);

                                                return (
                                                    <div
                                                        key={index}
                                                        className="space-y-1 rounded-lg border border-slate-200/60 bg-white p-2 dark:border-white/[0.04] dark:bg-zinc-800/60"
                                                    >
                                                        <div className="grid gap-1.5 sm:grid-cols-[1fr_4rem_7rem_auto] sm:items-center">
                                                            <Input
                                                                name={`items[${index}][description]`}
                                                                placeholder="Deskripsi item..."
                                                                className="h-7.5 rounded-lg border-slate-200 bg-slate-50/50 text-xs dark:border-white/10 dark:bg-zinc-800"
                                                                required
                                                                value={
                                                                    item.description
                                                                }
                                                                onChange={(e) =>
                                                                    setLineItems(
                                                                        (
                                                                            items,
                                                                        ) =>
                                                                            items.map(
                                                                                (
                                                                                    cur,
                                                                                    idx,
                                                                                ) =>
                                                                                    idx ===
                                                                                    index
                                                                                        ? {
                                                                                              ...cur,
                                                                                              description:
                                                                                                  e
                                                                                                      .target
                                                                                                      .value,
                                                                                          }
                                                                                        : cur,
                                                                            ),
                                                                    )
                                                                }
                                                            />
                                                            <Input
                                                                name={`items[${index}][quantity]`}
                                                                type="number"
                                                                min="1"
                                                                placeholder="Qty"
                                                                className="h-7.5 rounded-lg border-slate-200 bg-slate-50/50 text-xs dark:border-white/10 dark:bg-zinc-800"
                                                                required
                                                                value={
                                                                    item.quantity
                                                                }
                                                                onChange={(e) =>
                                                                    setLineItems(
                                                                        (
                                                                            items,
                                                                        ) =>
                                                                            items.map(
                                                                                (
                                                                                    cur,
                                                                                    idx,
                                                                                ) =>
                                                                                    idx ===
                                                                                    index
                                                                                        ? {
                                                                                              ...cur,
                                                                                              quantity:
                                                                                                  e
                                                                                                      .target
                                                                                                      .value,
                                                                                          }
                                                                                        : cur,
                                                                            ),
                                                                    )
                                                                }
                                                            />
                                                            <Input
                                                                name={`items[${index}][unit_amount]`}
                                                                type="number"
                                                                min="0"
                                                                placeholder="Nominal (IDR)"
                                                                className="h-7.5 rounded-lg border-slate-200 bg-slate-50/50 text-xs dark:border-white/10 dark:bg-zinc-800"
                                                                required
                                                                value={
                                                                    item.unitAmount
                                                                }
                                                                onChange={(e) =>
                                                                    setLineItems(
                                                                        (
                                                                            items,
                                                                        ) =>
                                                                            items.map(
                                                                                (
                                                                                    cur,
                                                                                    idx,
                                                                                ) =>
                                                                                    idx ===
                                                                                    index
                                                                                        ? {
                                                                                              ...cur,
                                                                                              unitAmount:
                                                                                                  e
                                                                                                      .target
                                                                                                      .value,
                                                                                          }
                                                                                        : cur,
                                                                            ),
                                                                    )
                                                                }
                                                            />
                                                            {lineItems.length >
                                                                1 && (
                                                                <Button
                                                                    type="button"
                                                                    size="icon"
                                                                    variant="ghost"
                                                                    className="size-7 shrink-0 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                                                                    onClick={() =>
                                                                        setLineItems(
                                                                            (
                                                                                items,
                                                                            ) =>
                                                                                items.filter(
                                                                                    (
                                                                                        _,
                                                                                        i,
                                                                                    ) =>
                                                                                        i !==
                                                                                        index,
                                                                                ),
                                                                        )
                                                                    }
                                                                >
                                                                    <Trash2 className="size-3.5" />
                                                                </Button>
                                                            )}
                                                        </div>
                                                        <div className="flex justify-end text-[10px] font-mono text-slate-500 dark:text-zinc-400">
                                                            Subtotal:{' '}
                                                            {formatMoney(
                                                                rowTotal,
                                                                'IDR',
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Discount & Tax Row */}
                                    <div className="grid gap-2.5 sm:grid-cols-2">
                                        <div className="grid gap-1">
                                            <Label
                                                htmlFor="discount_amount"
                                                className="text-xs font-semibold text-slate-700 dark:text-zinc-200"
                                            >
                                                Diskon (IDR)
                                            </Label>
                                            <Input
                                                id="discount_amount"
                                                name="discount_amount"
                                                type="number"
                                                min="0"
                                                placeholder="0"
                                                value={discountAmount}
                                                onChange={(e) =>
                                                    setDiscountAmount(
                                                        e.target.value,
                                                    )
                                                }
                                                className="h-8 rounded-lg border-slate-200 bg-slate-50/70 text-xs font-mono dark:border-white/10 dark:bg-[#121418]"
                                            />
                                        </div>
                                        <div className="grid gap-1">
                                            <Label
                                                htmlFor="tax_rate"
                                                className="text-xs font-semibold text-slate-700 dark:text-zinc-200"
                                            >
                                                Tarif PPN (%)
                                            </Label>
                                            <Input
                                                id="tax_rate"
                                                name="tax_rate"
                                                type="number"
                                                min="0"
                                                max="100"
                                                placeholder="11"
                                                value={taxRate}
                                                onChange={(e) =>
                                                    setTaxRate(e.target.value)
                                                }
                                                className="h-8 rounded-lg border-slate-200 bg-slate-50/70 text-xs font-mono dark:border-white/10 dark:bg-[#121418]"
                                            />
                                        </div>
                                    </div>

                                    {/* Realtime Grand Total Summary Card */}
                                    <div className="space-y-1 rounded-lg border border-blue-100 bg-blue-50/50 p-2.5 dark:border-blue-900/30 dark:bg-blue-950/20">
                                        <div className="flex items-center justify-between text-xs text-slate-600 dark:text-zinc-300">
                                            <span>Subtotal:</span>
                                            <span className="font-mono font-medium">
                                                {formatMoney(subtotal, 'IDR')}
                                            </span>
                                        </div>
                                        {discount > 0 && (
                                            <div className="flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400">
                                                <span>Diskon:</span>
                                                <span className="font-mono font-medium">
                                                    -
                                                    {formatMoney(
                                                        discount,
                                                        'IDR',
                                                    )}
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex items-center justify-between text-xs text-slate-600 dark:text-zinc-300">
                                            <span>PPN ({taxRate || 0}%):</span>
                                            <span className="font-mono font-medium">
                                                {formatMoney(tax, 'IDR')}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between border-t border-blue-200/80 pt-1.5 text-xs font-bold text-blue-700 dark:border-blue-900/60 dark:text-blue-400">
                                            <span>
                                                Total Tagihan (Grand Total):
                                            </span>
                                            <span className="font-mono text-sm">
                                                {formatMoney(grandTotal, 'IDR')}
                                            </span>
                                        </div>
                                    </div>
                                </>
                            )}

                            {isExpense && (
                                <>
                                    <div className="grid gap-2.5 sm:grid-cols-2">
                                        <div className="grid gap-1">
                                            <Label htmlFor="charge_to" className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                                                Beban Biaya (Charge To) *
                                            </Label>
                                            <div className="relative mt-0.5">
                                                <select
                                                    id="charge_to"
                                                    name="charge_to"
                                                    defaultValue="office"
                                                    className="h-8.5 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white pr-8 pl-2.5 text-xs font-medium text-slate-800 shadow-2xs outline-hidden transition-colors hover:border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600/30 dark:border-white/10 dark:bg-[#14161b] dark:text-zinc-200"
                                                >
                                                    <option value="office">Beban Operasional Kantor</option>
                                                    <option value="client">Reimbursement Klien</option>
                                                </select>
                                                <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-slate-400" />
                                            </div>
                                        </div>
                                        <Field
                                            name="category"
                                            label="Kategori Biaya"
                                            defaultValue="Court fee"
                                            placeholder="Biaya PNBP, Saksi, Notaris..."
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2.5 sm:grid-cols-2">
                                        <Field
                                            name="incurred_at"
                                            label="Tanggal Biaya"
                                            type="date"
                                            required
                                        />
                                        <Field
                                            name="amount"
                                            label="Nominal Pengeluaran (IDR)"
                                            type="number"
                                            placeholder="0"
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2.5 sm:grid-cols-2">
                                        <div className="grid gap-1">
                                            <Label htmlFor="account_id" className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                                                Sumber Kas / Rekening (Opsional)
                                            </Label>
                                            <div className="relative mt-0.5">
                                                <select
                                                    id="account_id"
                                                    name="account_id"
                                                    className="h-8.5 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white pr-8 pl-2.5 text-xs font-medium text-slate-800 shadow-2xs outline-hidden transition-colors hover:border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600/30 dark:border-white/10 dark:bg-[#14161b] dark:text-zinc-200"
                                                >
                                                    <option value="">Pilih Rekening Kas/Bank</option>
                                                    {accounts.map((a) => (
                                                        <option key={a.id} value={a.id}>{a.name}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-slate-400" />
                                            </div>
                                        </div>
                                        <div className="grid gap-1">
                                            <Label htmlFor="partner_id" className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                                                Ditalangi Partner (Opsional)
                                            </Label>
                                            <div className="relative mt-0.5">
                                                <select
                                                    id="partner_id"
                                                    name="partner_id"
                                                    className="h-8.5 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white pr-8 pl-2.5 text-xs font-medium text-slate-800 shadow-2xs outline-hidden transition-colors hover:border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600/30 dark:border-white/10 dark:bg-[#14161b] dark:text-zinc-200"
                                                >
                                                    <option value="">Bukan Talangan Partner</option>
                                                    {staffUsers.map((u) => (
                                                        <option key={u.id} value={u.id}>{u.name}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-slate-400" />
                                            </div>
                                        </div>
                                    </div>
                                    <Field
                                        name="description"
                                        label="Deskripsi Pengeluaran"
                                        placeholder="Rincian pembayaran biaya pendaftaran..."
                                        required
                                    />
                                    <div className="grid gap-1">
                                        <Label
                                            htmlFor="expense-proof"
                                            className="text-xs font-semibold text-slate-700 dark:text-zinc-200"
                                        >
                                            Unggah Bukti / Kuitansi
                                        </Label>
                                        <FileInput
                                            id="expense-proof"
                                            name="proof"
                                            accept="application/pdf,image/png,image/jpeg,image/webp"
                                            buttonText="Unggah Berkas"
                                            placeholder="Pilih berkas kuitansi / nota..."
                                        />
                                    </div>
                                    <input
                                        type="hidden"
                                        name="status"
                                        value="draft"
                                    />
                                </>
                            )}

                            {isPayment && (
                                <>
                                    <div className="grid gap-2.5 sm:grid-cols-2">
                                        <Field
                                            name="amount"
                                            label="Nominal Pembayaran Bersih (IDR)"
                                            type="number"
                                            placeholder="0"
                                            required
                                        />
                                        <Field
                                            name="tax_withheld"
                                            label="Potongan Pajak PPh 23 (2%)"
                                            type="number"
                                            placeholder="0"
                                        />
                                    </div>
                                    <div className="grid gap-2.5 sm:grid-cols-2">
                                        <Field
                                            name="method"
                                            label="Metode Pembayaran"
                                            defaultValue="Transfer bank"
                                            required
                                        />
                                        <div className="grid gap-1">
                                            <Label htmlFor="pay_account_id" className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                                                Rekening Kas/Bank Penerima
                                            </Label>
                                            <div className="relative mt-0.5">
                                                <select
                                                    id="pay_account_id"
                                                    name="account_id"
                                                    className="h-8.5 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white pr-8 pl-2.5 text-xs font-medium text-slate-800 shadow-2xs outline-hidden transition-colors hover:border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600/30 dark:border-white/10 dark:bg-[#14161b] dark:text-zinc-200"
                                                >
                                                    <option value="">Pilih Rekening Penerimaan</option>
                                                    {accounts.map((a) => (
                                                        <option key={a.id} value={a.id}>{a.name}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-slate-400" />
                                            </div>
                                        </div>
                                    </div>
                                    <Field
                                        name="received_at"
                                        label="Tanggal & Waktu Diterima"
                                        type="datetime-local"
                                        required
                                    />
                                    <div className="grid gap-1">
                                        <Label
                                            htmlFor="payment-proof"
                                            className="text-xs font-semibold text-slate-700 dark:text-zinc-200"
                                        >
                                            Unggah Bukti Transfer
                                        </Label>
                                        <FileInput
                                            id="payment-proof"
                                            name="proof"
                                            accept="application/pdf,image/png,image/jpeg,image/webp"
                                            buttonText="Unggah Bukti"
                                            placeholder="Pilih slip / screenshot transfer..."
                                        />
                                    </div>

                                    {/* Invoice Allocation Builder */}
                                    {(() => {
                                        const eligibleInvoices =
                                            invoices.filter(
                                                (inv) =>
                                                    [
                                                        'sent',
                                                        'overdue',
                                                        'partially_paid',
                                                    ].includes(inv.status) &&
                                                    (inv.outstanding_amount ??
                                                        0) > 0,
                                            );
                                        const draftInvoices = invoices.filter(
                                            (inv) =>
                                                [
                                                    'draft',
                                                    'pending_approval',
                                                ].includes(inv.status) &&
                                                (inv.outstanding_amount ?? 0) >
                                                    0,
                                        );

                                        return (
                                            <div className="space-y-2 rounded-lg border border-slate-200/70 bg-slate-50/60 p-3 dark:border-white/[0.04] dark:bg-[#121418]">
                                                <Label className="text-xs font-semibold text-slate-900 dark:text-white">
                                                    Alokasi ke Invoice
                                                </Label>

                                                {eligibleInvoices.length > 0 ? (
                                                    <>
                                                        <p className="text-[10.5px] text-slate-500 dark:text-zinc-400">
                                                            Alokasikan nominal
                                                            pembayaran ke
                                                            invoice resmi yang
                                                            terkirim / overdue:
                                                        </p>
                                                        <div className="space-y-1.5 pt-1">
                                                            {eligibleInvoices.map(
                                                                (
                                                                    inv,
                                                                    index,
                                                                ) => (
                                                                    <div
                                                                        className="grid grid-cols-[1fr_7.5rem] items-center gap-2"
                                                                        key={
                                                                            inv.id
                                                                        }
                                                                    >
                                                                        <div className="min-w-0">
                                                                            <div className="flex items-center gap-1.5">
                                                                                <p className="truncate font-mono text-xs font-semibold text-slate-900 dark:text-white">
                                                                                    {
                                                                                        inv.invoice_number
                                                                                    }
                                                                                </p>
                                                                                <span className="rounded bg-blue-50 px-1 py-0.5 text-[9px] font-semibold text-blue-600 uppercase dark:bg-blue-950/40 dark:text-blue-400">
                                                                                    {
                                                                                        inv.status
                                                                                    }
                                                                                </span>
                                                                            </div>
                                                                            <p className="text-[10px] text-slate-500">
                                                                                Sisa{' '}
                                                                                {formatMoney(
                                                                                    inv.outstanding_amount ??
                                                                                        0,
                                                                                    inv.currency,
                                                                                )}
                                                                            </p>
                                                                        </div>
                                                                        <input
                                                                            type="hidden"
                                                                            name={`allocations[${index}][invoice_id]`}
                                                                            value={
                                                                                inv.id
                                                                            }
                                                                        />
                                                                        <Input
                                                                            name={`allocations[${index}][amount]`}
                                                                            type="number"
                                                                            min="1"
                                                                            placeholder="0"
                                                                            className="h-7.5 rounded-lg border-slate-200 bg-white text-xs dark:border-white/10 dark:bg-zinc-800"
                                                                        />
                                                                    </div>
                                                                ),
                                                            )}
                                                        </div>
                                                    </>
                                                ) : (
                                                    <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                                                        Tidak ada invoice aktif
                                                        (Sent/Overdue) dengan
                                                        sisa tagihan. Pembayaran
                                                        ini akan dicatat sebagai{' '}
                                                        <strong>
                                                            uang muka / dana
                                                            titipan (Unallocated
                                                            Retainer)
                                                        </strong>
                                                        .
                                                    </p>
                                                )}

                                                {draftInvoices.length > 0 && (
                                                    <div className="mt-2 rounded-md border border-amber-200/80 bg-amber-50/70 p-2 text-[10.5px] text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-300">
                                                        <span className="font-semibold">
                                                            Perhatian:
                                                        </span>{' '}
                                                        Terdapat{' '}
                                                        {draftInvoices.length}{' '}
                                                        invoice berstatus{' '}
                                                        <em>Draft</em>. Invoice
                                                        Draft harus dikirim
                                                        (Sent) terlebih dahulu
                                                        sebelum dapat
                                                        dialokasikan pembayaran.
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })()}
                                </>
                            )}

                            <input type="hidden" name="currency" value="IDR" />
                            {!isExpense && !isPayment && (
                                <input
                                    type="hidden"
                                    name="status"
                                    value="draft"
                                />
                            )}

                            <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3 dark:border-white/[0.06]">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={onClose}
                                    className="h-8 rounded-lg border-slate-200 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-zinc-300"
                                >
                                    Batal
                                </Button>
                                <Button
                                    size="sm"
                                    disabled={processing}
                                    className="h-8 rounded-lg bg-slate-900 px-4 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 active:scale-95 disabled:opacity-50 dark:bg-white dark:text-slate-900"
                                >
                                    {processing ? (
                                        <>
                                            <Spinner className="mr-1.5 size-3" />
                                            Menyimpan...
                                        </>
                                    ) : (
                                        'Simpan Data'
                                    )}
                                </Button>
                            </div>

                            {Object.values(errors).map((e) => (
                                <p
                                    className="text-xs font-semibold text-rose-500"
                                    key={e}
                                >
                                    {e}
                                </p>
                            ))}
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}

function Field({
    name,
    label,
    type = 'text',
    defaultValue,
    placeholder,
    required,
}: {
    name: string;
    label: string;
    type?: string;
    defaultValue?: string;
    placeholder?: string;
    required?: boolean;
}) {
    return (
        <div className="grid gap-1">
            <Label
                htmlFor={name}
                className="text-xs font-semibold text-slate-700 dark:text-zinc-200"
            >
                {label} {required && <span className="text-rose-500">*</span>}
            </Label>
            <Input
                id={name}
                name={name}
                type={type}
                defaultValue={defaultValue}
                placeholder={placeholder}
                required={required}
                className="h-8 rounded-lg border-slate-200 bg-slate-50/70 text-xs text-slate-900 transition-colors focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
            />
        </div>
    );
}

function SelectField({
    name,
    label,
    matters,
    clients,
    required,
}: {
    name: string;
    label: string;
    matters?: Matter[];
    clients?: { id: string; display_name: string }[];
    required?: boolean;
}) {
    const data = matters ?? clients ?? [];

    return (
        <div className="grid gap-1">
            <Label
                htmlFor={name}
                className="text-xs font-semibold text-slate-700 dark:text-zinc-200"
            >
                {label} {required && <span className="text-rose-500">*</span>}
            </Label>
            <div className="relative mt-0.5">
                <select
                    id={name}
                    name={name}
                    required={required}
                    className="h-8.5 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white pr-8 pl-2.5 text-xs font-medium text-slate-800 shadow-2xs outline-hidden transition-colors hover:border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600/30 dark:border-white/10 dark:bg-[#14161b] dark:text-zinc-200"
                >
                    <option value="">Pilih {label.toLowerCase()}</option>
                    {data.map((item) => (
                        <option value={item.id} key={item.id}>
                            {'matter_number' in item
                                ? `${item.matter_number} - ${item.title}`
                                : item.display_name}
                        </option>
                    ))}
                </select>
                <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-slate-400" />
            </div>
        </div>
    );
}

FinanceIndex.layout = {
    breadcrumbs: [{ title: 'Keuangan', href: financeRoutes.index() }],
};
