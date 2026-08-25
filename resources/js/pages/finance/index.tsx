import { Form, Head, Link } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowUpRight,
    Banknote,
    Building2,
    CalendarClock,
    CheckCircle2,
    ChevronDown,
    ChevronRight,
    DollarSign,
    FileDown,
    FilePlus2,
    FileText,
    FolderKanban,
    Layers,
    Plus,
    Receipt,
    ReceiptText,
    RotateCcw,
    Search,
    Trash2,
    TrendingUp,
    Undo2,
    WalletCards,
} from 'lucide-react';
import { useMemo, useState } from 'react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { formatDate, formatMoney } from '@/lib/format';
import * as financeRoutes from '@/routes/finance';
import * as expenseRoutes from '@/routes/finance/expenses';
import * as invoiceRoutes from '@/routes/finance/invoices';
import * as paymentRoutes from '@/routes/finance/payments';
import * as quotationRoutes from '@/routes/finance/quotations';

type Matter = {
    id: string;
    matter_number: string;
    title: string;
    client?: string;
};

type LedgerItem = {
    id: string;
    invoice_number?: string;
    quotation_number?: string;
    title?: string;
    category?: string;
    description?: string;
    status: string;
    total_amount?: number;
    paid_amount?: number;
    amount?: number;
    outstanding_amount?: number;
    currency: string;
    due_at?: string;
    incurred_at?: string;
    received_at?: string;
    matter?: Matter;
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
        'invoice' | 'quotation' | 'expense' | 'payment' | null
    >(null);
    const [reversePayment, setReversePayment] = useState<LedgerItem | null>(null);
    const [refundPayment, setRefundPayment] = useState<LedgerItem | null>(null);
    const [cancelInvoice, setCancelInvoice] = useState<LedgerItem | null>(null);
    const [activeTab, setActiveTab] = useState<'all' | 'invoices' | 'quotations' | 'expenses' | 'payments'>('all');

    const currency = overview?.currency ?? 'IDR';

    return (
        <>
            <Head title="Keuangan & Billing Operasional - RPK Legal Workspace" />

            <div className="min-h-screen bg-[#fafafc] pb-16 dark:bg-[#0c0d10]">
                <main className="mx-auto max-w-7xl space-y-3.5 px-4 py-3.5 sm:px-6 lg:px-8">
                    {/* 1. Header & Actions */}
                    <div className="flex flex-col justify-between gap-3 border-b border-slate-200/60 pb-3 sm:flex-row sm:items-center dark:border-white/[0.06]">
                        <div className="space-y-0.5">
                            <h1 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl dark:text-white">
                                Keuangan &amp; Billing Operasional
                            </h1>
                            <p className="text-[11px] text-slate-500 sm:text-xs dark:text-zinc-400">
                                Manajemen invoice tagihan klien, quotation tarif perkara, pengeluaran (disbursement), dan arus kas firma.
                            </p>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex flex-wrap items-center gap-1.5">
                            {can.quotation && (
                                <Button
                                    variant="outline"
                                    onClick={() => setModal('quotation')}
                                    className="h-7.5 rounded-lg border-slate-200/70 bg-white px-2.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-white/10 dark:bg-[#14161b] dark:text-zinc-200"
                                >
                                    <FilePlus2 className="mr-1 size-3.5 text-blue-600 dark:text-blue-400" />
                                    Quotation
                                </Button>
                            )}
                            {can.expense && (
                                <Button
                                    variant="outline"
                                    onClick={() => setModal('expense')}
                                    className="h-7.5 rounded-lg border-slate-200/70 bg-white px-2.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-white/10 dark:bg-[#14161b] dark:text-zinc-200"
                                >
                                    <WalletCards className="mr-1 size-3.5 text-rose-600 dark:text-rose-400" />
                                    Catat Biaya
                                </Button>
                            )}
                            {can.payment && (
                                <Button
                                    variant="outline"
                                    onClick={() => setModal('payment')}
                                    className="h-7.5 rounded-lg border-slate-200/70 bg-white px-2.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-white/10 dark:bg-[#14161b] dark:text-zinc-200"
                                >
                                    <Banknote className="mr-1 size-3.5 text-emerald-600 dark:text-emerald-400" />
                                    Pembayaran
                                </Button>
                            )}
                            {can.invoice && (
                                <Button
                                    onClick={() => setModal('invoice')}
                                    className="h-7.5 rounded-lg bg-slate-900 px-3 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 active:scale-95 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                                >
                                    <ReceiptText className="mr-1 size-3.5" />
                                    Buat Invoice
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Filter / Matter Selector Bar */}
                    <Form
                        {...financeRoutes.index.form()}
                        className="flex flex-col gap-2 rounded-xl border border-slate-200/70 bg-white p-2.5 shadow-2xs sm:flex-row sm:items-center dark:border-white/[0.06] dark:bg-[#14161b]"
                    >
                        <div className="flex items-center gap-1.5 text-slate-500 dark:text-zinc-400">
                            <FolderKanban className="size-3.5 shrink-0" />
                            <span className="text-xs font-semibold whitespace-nowrap">Lingkup Perkara:</span>
                        </div>
                        <div className="relative flex-1">
                            <select
                                name="matter_id"
                                defaultValue={selectedMatterId}
                                className="h-7.5 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-slate-50/70 pr-7 pl-2.5 text-xs font-medium text-slate-800 transition-colors outline-hidden hover:bg-slate-100 focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-zinc-200"
                            >
                                <option value="">
                                    Semua Lingkup Perkara (Ringkasan Finansial Global)
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
                            className="h-7.5 w-full shrink-0 rounded-lg bg-slate-900 px-3 text-xs font-semibold text-white hover:bg-slate-800 sm:w-auto dark:bg-white dark:text-slate-900"
                        >
                            Filter Ringkasan
                        </Button>
                    </Form>

                    {/* Bento Metric Cards */}
                    {overview ? (
                        <div className="space-y-2.5">
                            {/* Primary 4 Financial Metrics */}
                            <section className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
                                {/* 1. Invoice Diterbitkan */}
                                <div className="group rounded-xl border border-slate-200/70 bg-white p-3 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#14161b]">
                                    <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                        <span className="text-[10px] font-bold uppercase tracking-wider">TOTAL TAGIHAN</span>
                                        <Receipt className="size-3.5 text-slate-400 transition-colors group-hover:text-blue-600 dark:text-zinc-500" />
                                    </div>
                                    <div className="mt-1.5 flex items-baseline justify-between">
                                        <span className="font-mono text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                                            {formatMoney(overview.invoiced_amount, currency)}
                                        </span>
                                    </div>
                                    <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-1.5 text-[10px] text-slate-500 dark:border-white/[0.04]">
                                        <span>Invoice Diterbitkan</span>
                                        <span className="font-semibold text-blue-600 dark:text-blue-400">Aktif</span>
                                    </div>
                                </div>

                                {/* 2. Pembayaran Diterima (Total Kas Masuk) */}
                                <div className="group rounded-xl border border-slate-200/70 bg-white p-3 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#14161b]">
                                    <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                        <span className="text-[10px] font-bold uppercase tracking-wider">TOTAL KAS MASUK</span>
                                        <Banknote className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <div className="mt-1.5 flex items-baseline justify-between">
                                        <span className="font-mono text-lg sm:text-xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                                            {formatMoney(overview.total_cash_inflow ?? overview.payment_received_amount, currency)}
                                        </span>
                                    </div>
                                    <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-1.5 text-[10px] text-slate-500 dark:border-white/[0.04]">
                                        <span className="truncate">
                                            Teralokasi: {formatMoney(overview.payment_received_amount, currency)}
                                            {(overview.unallocated_payment_amount ?? 0) > 0 && (
                                                <span className="text-amber-600 dark:text-amber-400 ml-1">
                                                    · DP: {formatMoney(overview.unallocated_payment_amount ?? 0, currency)}
                                                </span>
                                            )}
                                        </span>
                                        <span className="shrink-0 font-semibold text-emerald-600 dark:text-emerald-400">Kas Riil</span>
                                    </div>
                                </div>

                                {/* 3. Piutang Berjalan */}
                                <div className="group rounded-xl border border-slate-200/70 bg-white p-3 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#14161b]">
                                    <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                        <span className="text-[10px] font-bold uppercase tracking-wider">PIUTANG (OUTSTANDING)</span>
                                        <CalendarClock className="size-3.5 text-amber-500 dark:text-amber-400" />
                                    </div>
                                    <div className="mt-1.5 flex items-baseline justify-between">
                                        <span className="font-mono text-lg sm:text-xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
                                            {formatMoney(overview.receivable_amount, currency)}
                                        </span>
                                    </div>
                                    <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-1.5 text-[10px] text-slate-500 dark:border-white/[0.04]">
                                        <span>Belum Dilunasi</span>
                                        <span className="font-semibold text-amber-600 dark:text-amber-400">Berjalan</span>
                                    </div>
                                </div>

                                {/* 4. Net Margin */}
                                <div className="group rounded-xl border border-slate-200/70 bg-white p-3 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#14161b]">
                                    <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                        <span className="text-[10px] font-bold uppercase tracking-wider">MARGIN &amp; PROFIT</span>
                                        <DollarSign className="size-3.5 text-slate-400 transition-colors group-hover:text-blue-600 dark:text-zinc-500" />
                                    </div>
                                    <div className="mt-1.5 flex items-baseline justify-between">
                                        <span className="font-mono text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                                            {formatMoney(overview.margin_amount, currency)}
                                        </span>
                                    </div>
                                    <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-1.5 text-[10px] text-slate-500 dark:border-white/[0.04]">
                                        <span>Net Margin</span>
                                        <span className="font-semibold text-slate-700 dark:text-zinc-300">Setelah Biaya</span>
                                    </div>
                                </div>
                            </section>

                            {/* Secondary Operational Metrics Bar */}
                            <section className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                                <div className="rounded-xl border border-slate-200/70 bg-white p-2.5 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                    <p className="text-[9.5px] font-bold text-slate-500 uppercase tracking-wider dark:text-zinc-400">
                                        Anggaran (Budget)
                                    </p>
                                    <p className="mt-0.5 font-mono text-xs font-bold text-slate-900 dark:text-white">
                                        {formatMoney(overview.budget_amount, currency)}
                                    </p>
                                </div>
                                <div className="rounded-xl border border-slate-200/70 bg-white p-2.5 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                    <p className="text-[9.5px] font-bold text-slate-500 uppercase tracking-wider dark:text-zinc-400">
                                        Biaya Perkara (Expense)
                                    </p>
                                    <p className="mt-0.5 font-mono text-xs font-bold text-rose-600 dark:text-rose-400">
                                        {formatMoney(overview.expense_amount, currency)}
                                    </p>
                                </div>
                                <div className="rounded-xl border border-slate-200/70 bg-white p-2.5 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                    <p className="text-[9.5px] font-bold text-slate-500 uppercase tracking-wider dark:text-zinc-400">
                                        Quotation Diajukan
                                    </p>
                                    <p className="mt-0.5 font-mono text-xs font-bold text-slate-900 dark:text-white">
                                        {formatMoney(overview.quotation_amount, currency)}
                                    </p>
                                </div>
                                <div className="rounded-xl border border-slate-200/70 bg-white p-2.5 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                    <p className="text-[9.5px] font-bold text-slate-500 uppercase tracking-wider dark:text-zinc-400">
                                        Lewat Jatuh Tempo
                                    </p>
                                    <p className="mt-0.5 font-mono text-xs font-bold text-rose-600 dark:text-rose-400">
                                        {formatMoney(overview.overdue_amount ?? 0, currency)}
                                    </p>
                                </div>
                            </section>

                            {/* Aging Analysis Breakdown Bar */}
                            {overview.aging && (
                                <div className="rounded-xl border border-slate-200/70 bg-white p-3 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                    <div className="mb-2 flex items-center justify-between">
                                        <div className="flex items-center gap-1.5">
                                            <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-slate-700 uppercase dark:bg-zinc-800 dark:text-zinc-300">
                                                AGING REPORT
                                            </span>
                                            <h3 className="text-xs font-semibold text-slate-900 dark:text-white">
                                                Analisis Umur Piutang (Receivables Schedule)
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-5">
                                        {[
                                            [
                                                'Belum Jatuh Tempo',
                                                overview.aging.current,
                                                'text-slate-900 dark:text-white',
                                                'border-slate-200 bg-slate-50/60 dark:border-white/5 dark:bg-[#121418]',
                                            ],
                                            [
                                                '1-30 Hari',
                                                overview.aging['1_30'],
                                                'text-amber-600 dark:text-amber-400',
                                                'border-amber-100 bg-amber-50/40 dark:border-amber-900/20 dark:bg-amber-950/10',
                                            ],
                                            [
                                                '31-60 Hari',
                                                overview.aging['31_60'],
                                                'text-amber-700 dark:text-amber-300',
                                                'border-amber-200 bg-amber-50/60 dark:border-amber-900/30 dark:bg-amber-950/20',
                                            ],
                                            [
                                                '61-90 Hari',
                                                overview.aging['61_90'],
                                                'text-rose-600 dark:text-rose-400',
                                                'border-rose-100 bg-rose-50/40 dark:border-rose-900/20 dark:bg-rose-950/10',
                                            ],
                                            [
                                                '>90 Hari (Kritis)',
                                                overview.aging.over_90,
                                                'text-rose-700 dark:text-rose-300 font-bold',
                                                'border-rose-200 bg-rose-50/70 dark:border-rose-900/40 dark:bg-rose-950/30',
                                            ],
                                        ].map(([label, val, textCls, cardCls]) => (
                                            <div
                                                key={String(label)}
                                                className={`rounded-lg border p-2 ${cardCls}`}
                                            >
                                                <p className="truncate text-[9.5px] font-semibold text-slate-500 dark:text-zinc-400">
                                                    {label}
                                                </p>
                                                <p className={`mt-0.5 font-mono text-xs font-bold ${textCls}`}>
                                                    {formatMoney(Number(val), currency)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex min-h-[160px] items-center justify-center rounded-xl border border-slate-200/70 bg-white p-5 text-center shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                            <EmptyState
                                title="Pilih perkara untuk melihat ringkasan keuangan"
                                description="Pilih perkara melalui menu di atas untuk menampilkan rincian budget, invoice, dan penerimaan."
                            />
                        </div>
                    )}

                    {/* Segmented Tab Navigation for Ledgers */}
                    <div className="flex items-center gap-1 overflow-x-auto border-b border-slate-200/60 pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden dark:border-white/[0.06]">
                        <button
                            type="button"
                            onClick={() => setActiveTab('all')}
                            className={`flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
                                activeTab === 'all'
                                    ? 'bg-slate-900 text-white shadow-2xs dark:bg-white dark:text-slate-900'
                                    : 'border border-slate-200/70 bg-white text-slate-600 hover:bg-slate-50 dark:border-white/[0.06] dark:bg-[#14161b] dark:text-zinc-400'
                            }`}
                        >
                            <Layers className="size-3" />
                            Semua Ledger
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('invoices')}
                            className={`flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
                                activeTab === 'invoices'
                                    ? 'bg-slate-900 text-white shadow-2xs dark:bg-white dark:text-slate-900'
                                    : 'border border-slate-200/70 bg-white text-slate-700 hover:bg-slate-50 dark:border-white/[0.06] dark:bg-[#14161b] dark:text-zinc-300'
                            }`}
                        >
                            <ReceiptText className="size-3" />
                            Invoice Tagihan ({invoices.length})
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('quotations')}
                            className={`flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
                                activeTab === 'quotations'
                                    ? 'bg-slate-900 text-white shadow-2xs dark:bg-white dark:text-slate-900'
                                    : 'border border-slate-200/70 bg-white text-slate-700 hover:bg-slate-50 dark:border-white/[0.06] dark:bg-[#14161b] dark:text-zinc-300'
                            }`}
                        >
                            <FilePlus2 className="size-3" />
                            Quotation ({quotations.length})
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('expenses')}
                            className={`flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
                                activeTab === 'expenses'
                                    ? 'bg-rose-600 text-white shadow-2xs'
                                    : 'border border-slate-200/70 bg-white text-rose-700 hover:bg-rose-50/50 dark:border-white/[0.06] dark:bg-[#14161b] dark:text-rose-400'
                            }`}
                        >
                            <WalletCards className="size-3" />
                            Biaya Perkara ({expenses.length})
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('payments')}
                            className={`flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
                                activeTab === 'payments'
                                    ? 'bg-emerald-600 text-white shadow-2xs'
                                    : 'border border-slate-200/70 bg-white text-emerald-700 hover:bg-emerald-50/50 dark:border-white/[0.06] dark:bg-[#14161b] dark:text-emerald-400'
                            }`}
                        >
                            <Banknote className="size-3" />
                            Penerimaan Kas ({payments.length})
                        </button>
                    </div>

                    {/* 4 Ledgers Grid */}
                    <div className="grid gap-3 lg:grid-cols-2">
                        {/* 1. Invoice Terbaru */}
                        {(activeTab === 'all' || activeTab === 'invoices') && (
                            <div className={activeTab === 'invoices' ? 'lg:col-span-2' : ''}>
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

                        {/* 2. Quotation Terbaru */}
                        {(activeTab === 'all' || activeTab === 'quotations') && (
                            <div className={activeTab === 'quotations' ? 'lg:col-span-2' : ''}>
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

                        {/* 3. Biaya Perkara & Disbursement */}
                        {(activeTab === 'all' || activeTab === 'expenses') && (
                            <div className={activeTab === 'expenses' ? 'lg:col-span-2' : ''}>
                                <Ledger
                                    title="Biaya Perkara & Disbursement"
                                    items={expenses}
                                    currency={currency}
                                    icon={WalletCards}
                                    iconBg="bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400"
                                    value={(i) => i.amount ?? 0}
                                    date={(i) => i.incurred_at}
                                    canCreate={can.expense}
                                    onCreate={() => setModal('expense')}
                                    actionLabel="Catat Biaya Perkara"
                                    emptyTitle="Belum Ada Catatan Biaya Perkara"
                                    emptyDescription="Belum ada pengeluaran operasional perkara seperti panjar pengadilan, materai, akomodasi, atau transportasi yang dicatat."
                                />
                            </div>
                        )}

                        {/* 4. Riwayat Penerimaan Pembayaran */}
                        {(activeTab === 'all' || activeTab === 'payments') && (
                            <div className={activeTab === 'payments' ? 'lg:col-span-2' : ''}>
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
                </main>
            </div>

            {/* Dialogs */}
            <FinanceDialog
                type={modal}
                onClose={() => setModal(null)}
                matters={matters}
                clients={clients}
                invoices={invoices}
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
        <div className="flex flex-col rounded-xl border border-slate-200/70 bg-white p-3 sm:p-3.5 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-100 pb-2.5 dark:border-white/[0.04]">
                <div className="flex items-center gap-2">
                    <div className={`flex size-7 shrink-0 items-center justify-center rounded-lg ${iconBg}`}>
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
                            {actionLabel ? actionLabel.replace('Baru', '').trim() : 'Tambah'}
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
                    <div className="max-h-[460px] overflow-y-auto space-y-1.5 pr-1">
                        {filteredItems.map((i) => (
                            <div
                                key={i.id}
                                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-xl border border-slate-200/70 bg-white p-2.5 sm:p-3 shadow-2xs transition-all hover:border-slate-300 hover:bg-slate-50/20 hover:shadow-xs dark:border-white/[0.05] dark:bg-[#14161b] dark:hover:border-white/10 dark:hover:bg-white/[0.02]"
                            >
                                <div className="flex items-start gap-2.5 min-w-0 flex-1">
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

                                        <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                                            {i.invoice_number ? (
                                                <Link
                                                    href={invoiceRoutes.show.url(i.id)}
                                                    className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                                                >
                                                    {i.invoice_number}
                                                </Link>
                                            ) : (
                                                i.quotation_number ?? i.title ?? i.description
                                            )}
                                        </h4>

                                        <div className="flex flex-wrap items-center gap-x-1.5 text-[10.5px] text-slate-500 dark:text-zinc-400">
                                            {i.matter?.title && (
                                                <span className="truncate max-w-[260px] font-medium text-slate-600 dark:text-zinc-300">
                                                    {i.matter.title}
                                                </span>
                                            )}
                                            {date?.(i) && (
                                                <>
                                                    <span>·</span>
                                                    <span className="font-mono text-slate-500 dark:text-zinc-400">
                                                        Jatuh Tempo: {formatDate(date(i)!)}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between sm:flex-col sm:items-end sm:justify-center gap-1 shrink-0 pl-9.5 sm:pl-0 border-t sm:border-t-0 border-slate-100 pt-1.5 sm:pt-0 dark:border-white/[0.04]">
                                    <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                                        {formatMoney(value(i), i.currency || currency)}
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
                                                    href={invoiceRoutes.pdf.url(i.id)}
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
                                                    href={quotationRoutes.pdf.url(i.id)}
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
                                                <Form {...invoiceRoutes.transition.form(i.id)}>
                                                    <input type="hidden" name="status" value="sent" />
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
                                            ['draft', 'sent', 'overdue'].includes(i.status) &&
                                            (i.paid_amount ?? 0) === 0 && (
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => onCancel?.(i)}
                                                    className="h-6.5 rounded-lg text-[10px] font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                                                >
                                                    Batal
                                                </Button>
                                            )}

                                        {approveQuotations &&
                                            i.quotation_number &&
                                            ['draft', 'pending_approval'].includes(i.status) && (
                                                <Form {...quotationRoutes.approve.form(i.id)}>
                                                    <Button
                                                        size="sm"
                                                        className="h-6.5 rounded-lg bg-emerald-600 px-2 text-[10px] font-semibold text-white hover:bg-emerald-700"
                                                    >
                                                        Setujui
                                                    </Button>
                                                </Form>
                                            )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-8 px-3 text-center">
                        <div className="flex size-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-white/[0.06] dark:text-zinc-300">
                            <IconComp className="size-4.5" />
                        </div>
                        <p className="mt-2.5 text-xs font-bold text-slate-800 dark:text-zinc-200">
                            {searchQuery ? 'Tidak Ada Hasil Pencarian' : emptyTitle}
                        </p>
                        <p className="mt-0.5 text-[10.5px] text-slate-400 dark:text-zinc-500 max-w-xs">
                            {searchQuery
                                ? 'Sesuaikan kata kunci pencarian Anda.'
                                : emptyDescription}
                        </p>
                        {canCreate && onCreate && !searchQuery && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onCreate}
                                className="mt-3 h-7.5 rounded-lg text-xs font-semibold text-slate-900 border-slate-200 hover:bg-slate-50 dark:border-white/10 dark:text-white dark:hover:bg-zinc-800"
                            >
                                <Plus className="mr-1 size-3" /> {actionLabel || `Buat ${title.split(' ')[0]} Baru`}
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
                p.allocations?.some((a) => a.invoice?.invoice_number?.toLowerCase().includes(q))
            );
        });
    }, [items, searchQuery]);

    return (
        <div className="flex flex-col rounded-xl border border-slate-200/70 bg-white p-3 sm:p-3.5 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-100 pb-2.5 dark:border-white/[0.04]">
                <div className="flex items-center gap-2">
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                        <Banknote className="size-3.5" />
                    </div>
                    <div>
                        <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                            Riwayat Penerimaan Pembayaran
                        </h3>
                        <p className="text-[10px] text-slate-400 dark:text-zinc-500">
                            Log transfer kas masuk, pelunasan invoice &amp; deposit klien
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
                    <div className="max-h-[460px] overflow-y-auto space-y-1.5 pr-1">
                        {filteredItems.map((payment) => (
                            <div
                                key={payment.id}
                                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-xl border border-slate-200/70 bg-white p-2.5 sm:p-3 shadow-2xs transition-all hover:border-emerald-300 hover:bg-emerald-50/20 hover:shadow-xs dark:border-white/[0.05] dark:bg-[#14161b] dark:hover:border-emerald-800/50 dark:hover:bg-white/[0.02]"
                            >
                                <div className="flex items-start gap-2.5 min-w-0 flex-1">
                                    <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg border border-emerald-200/60 bg-emerald-50 text-emerald-600 transition-transform group-hover:scale-105 dark:border-emerald-900/40 dark:bg-emerald-950/60 dark:text-emerald-400">
                                        <Banknote className="size-3.5" />
                                    </div>

                                    <div className="min-w-0 flex-1 space-y-0.5">
                                        <div className="flex flex-wrap items-center gap-1 text-[9.5px]">
                                            {payment.matter?.matter_number && (
                                                <span className="inline-flex items-center rounded bg-slate-100 px-1.5 py-0.5 font-mono font-bold text-slate-700 dark:bg-white/[0.08] dark:text-zinc-300">
                                                    {payment.matter.matter_number}
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
                                                    {formatDate(payment.received_at)}
                                                </span>
                                            )}
                                        </div>

                                        <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                                            <Link
                                                href={paymentRoutes.show.url(payment.id)}
                                                className="transition-colors hover:text-emerald-600 dark:hover:text-emerald-400"
                                            >
                                                Penerimaan: {formatMoney(payment.amount ?? 0, payment.currency || currency)}
                                            </Link>
                                        </h4>

                                        <div className="flex flex-wrap items-center gap-x-1.5 text-[10.5px] text-slate-500 dark:text-zinc-400">
                                            <span>
                                                {payment.matter?.title
                                                    ? payment.matter.title
                                                    : 'Tanpa Terikat Perkara Khusus'}
                                            </span>
                                            {payment.allocations?.map((allocation) => (
                                                <span
                                                    key={allocation.id}
                                                    className="font-mono text-slate-600 dark:text-zinc-300"
                                                >
                                                    · Alokasi: {allocation.invoice?.invoice_number ?? 'Invoice'} (
                                                    {formatMoney(allocation.amount, allocation.invoice?.currency ?? currency)})
                                                </span>
                                            ))}
                                        </div>

                                        {payment.reversed_at && (
                                            <p className="mt-0.5 text-[9.5px] font-semibold text-rose-600 dark:text-rose-400">
                                                Dikoreksi: {payment.reversal_reason}
                                            </p>
                                        )}
                                        {payment.refunded_at && (
                                            <p className="mt-0.5 text-[9.5px] font-semibold text-rose-600 dark:text-rose-400">
                                                Direfund: {payment.refund_reason}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between sm:flex-col sm:items-end sm:justify-center gap-1 shrink-0 pl-9.5 sm:pl-0 border-t sm:border-t-0 border-slate-100 pt-1.5 sm:pt-0 dark:border-white/[0.04]">
                                    <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                        {formatMoney(payment.amount ?? 0, payment.currency || currency)}
                                    </span>

                                    {canManage &&
                                        !payment.reversed_at &&
                                        !payment.refunded_at && (
                                            <div className="flex items-center gap-1">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => onReverse(payment)}
                                                    className="h-6.5 rounded-lg border-slate-200 px-2 text-[10px] font-semibold hover:bg-slate-50 dark:border-white/10"
                                                >
                                                    Koreksi
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => onRefund(payment)}
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
                    <div className="flex flex-col items-center justify-center py-8 px-3 text-center">
                        <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                            <Banknote className="size-4.5" />
                        </div>
                        <p className="mt-2.5 text-xs font-bold text-slate-800 dark:text-zinc-200">
                            {searchQuery ? 'Tidak Ada Hasil Pencarian' : emptyTitle}
                        </p>
                        <p className="mt-0.5 text-[10.5px] text-slate-400 dark:text-zinc-500 max-w-xs">
                            {searchQuery
                                ? 'Sesuaikan kata kunci pencarian Anda.'
                                : emptyDescription}
                        </p>
                        {canManage && onCreate && !searchQuery && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onCreate}
                                className="mt-3 h-7.5 rounded-lg text-xs font-semibold text-emerald-600 border-emerald-200 hover:bg-emerald-50 dark:border-emerald-900/40 dark:text-emerald-400"
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
                                    Alokasi invoice akan dibuka kembali dan transaksi dicatat dalam log audit.
                                </p>
                                <div className="grid gap-1">
                                    <Label
                                        htmlFor="reason"
                                        className="text-xs font-semibold text-slate-700 dark:text-zinc-200"
                                    >
                                        Alasan Pembatalan
                                    </Label>
                                    <textarea
                                        className="w-full rounded-lg border border-slate-200 bg-slate-50/70 p-2 text-xs text-slate-900 transition-colors outline-hidden focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
                                        id="reason"
                                        name="reason"
                                        rows={3}
                                        placeholder="Koreksi salah nominal atau salah rekening..."
                                        required
                                        minLength={8}
                                    />
                                    {errors.reason && (
                                        <p className="text-xs text-rose-500">{errors.reason}</p>
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
                                    Gunakan jika dana telah ditransfer balik ke rekening klien. Saldo invoice akan disesuaikan.
                                </p>
                                <div className="grid gap-1">
                                    <Label
                                        htmlFor="refund-reason"
                                        className="text-xs font-semibold text-slate-700 dark:text-zinc-200"
                                    >
                                        Alasan Pengembalian (Refund)
                                    </Label>
                                    <textarea
                                        className="w-full rounded-lg border border-slate-200 bg-slate-50/70 p-2 text-xs text-slate-900 transition-colors outline-hidden focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
                                        id="refund-reason"
                                        name="reason"
                                        rows={3}
                                        placeholder="Kelebihan bayar atau perkara dihentikan..."
                                        required
                                        minLength={8}
                                    />
                                    {errors.reason && (
                                        <p className="text-xs text-rose-500">{errors.reason}</p>
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
                                <input type="hidden" name="status" value="cancelled" />
                                <p className="text-xs text-slate-500 dark:text-zinc-400">
                                    Invoice {invoice.invoice_number} akan dibatalkan secara permanen.
                                </p>
                                <div className="grid gap-1">
                                    <Label
                                        htmlFor="cancellation-reason"
                                        className="text-xs font-semibold text-slate-700 dark:text-zinc-200"
                                    >
                                        Alasan Pembatalan
                                    </Label>
                                    <textarea
                                        className="w-full rounded-lg border border-slate-200 bg-slate-50/70 p-2 text-xs text-slate-900 transition-colors outline-hidden focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
                                        id="cancellation-reason"
                                        name="reason"
                                        rows={3}
                                        placeholder="Perubahan skema penagihan..."
                                        required
                                        minLength={8}
                                    />
                                    {errors.reason && (
                                        <p className="text-xs text-rose-500">{errors.reason}</p>
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
}: {
    type: 'invoice' | 'quotation' | 'expense' | 'payment' | null;
    onClose: () => void;
    matters: Matter[];
    clients: { id: string; display_name: string }[];
    invoices: LedgerItem[];
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

    const DialogIcon = dialogIcons[type];

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
                                {dialogTitles[type]}
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
                                label="Klien"
                                clients={clients}
                                required={!isExpense}
                            />

                            {!isExpense && !isPayment && (
                                <>
                                    <Field
                                        name="title"
                                        label="Judul Tagihan / Penawaran"
                                        placeholder="Contoh: Honorarium Jasa Hukum Tahap Mediasi"
                                        required
                                    />
                                    {type === 'quotation' && (
                                        <Field
                                            name="conflict_check_id"
                                            label="ID Conflict Check (Wajib jika tanpa matter)"
                                            placeholder="Masukkan ID conflict check terverifikasi"
                                        />
                                    )}

                                    {/* Line Items Builder */}
                                    <div className="space-y-2 rounded-lg border border-slate-200/70 bg-slate-50/60 p-3 dark:border-white/[0.04] dark:bg-[#121418]">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-semibold text-slate-900 dark:text-white">
                                                Rincian Item Jasa / Biaya
                                            </span>
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="outline"
                                                className="h-6.5 rounded-lg border-slate-200 bg-white px-2 text-[10px] font-semibold hover:bg-slate-50 dark:border-white/10 dark:bg-[#16181d]"
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
                                                <Plus className="mr-0.5 size-2.5" /> Tambah Baris
                                            </Button>
                                        </div>

                                        <div className="space-y-1.5 pt-1">
                                            {lineItems.map((item, index) => {
                                                const rowTotal =
                                                    (Number(item.quantity) || 0) *
                                                    (Number(item.unitAmount) || 0);

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
                                                                value={item.description}
                                                                onChange={(e) =>
                                                                    setLineItems((items) =>
                                                                        items.map((cur, idx) =>
                                                                            idx === index
                                                                                ? {
                                                                                      ...cur,
                                                                                      description: e.target.value,
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
                                                                value={item.quantity}
                                                                onChange={(e) =>
                                                                    setLineItems((items) =>
                                                                        items.map((cur, idx) =>
                                                                            idx === index
                                                                                ? {
                                                                                      ...cur,
                                                                                      quantity: e.target.value,
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
                                                                value={item.unitAmount}
                                                                onChange={(e) =>
                                                                    setLineItems((items) =>
                                                                        items.map((cur, idx) =>
                                                                            idx === index
                                                                                ? {
                                                                                      ...cur,
                                                                                      unitAmount: e.target.value,
                                                                                  }
                                                                                : cur,
                                                                        ),
                                                                    )
                                                                }
                                                            />
                                                            {lineItems.length > 1 && (
                                                                <Button
                                                                    type="button"
                                                                    size="icon"
                                                                    variant="ghost"
                                                                    className="size-7 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 shrink-0"
                                                                    onClick={() =>
                                                                        setLineItems((items) =>
                                                                            items.filter((_, idx) => idx !== index),
                                                                        )
                                                                    }
                                                                >
                                                                    <Trash2 className="size-3" />
                                                                </Button>
                                                            )}
                                                        </div>
                                                        {rowTotal > 0 && (
                                                            <div className="flex justify-end text-[10px] font-semibold text-slate-500 dark:text-zinc-400">
                                                                Subtotal: <span className="font-mono text-slate-800 dark:text-white ml-1">{formatMoney(rowTotal, 'IDR')}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Discount & Tax Rates */}
                                    <div className="grid gap-2.5 sm:grid-cols-2">
                                        <div className="grid gap-1">
                                            <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                                                Diskon Potongan (IDR)
                                            </Label>
                                            <Input
                                                name="discount_amount"
                                                type="number"
                                                min="0"
                                                value={discountAmount}
                                                onChange={(e) => setDiscountAmount(e.target.value)}
                                                placeholder="0"
                                                className="h-8 rounded-lg border-slate-200 bg-slate-50/70 text-xs dark:border-white/10 dark:bg-[#121418]"
                                            />
                                        </div>
                                        <div className="grid gap-1">
                                            <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                                                Tarif Pajak PPN (%)
                                            </Label>
                                            <Input
                                                name="tax_rate"
                                                type="number"
                                                step="0.1"
                                                min="0"
                                                max="100"
                                                value={taxRate}
                                                onChange={(e) => setTaxRate(e.target.value)}
                                                placeholder="11"
                                                className="h-8 rounded-lg border-slate-200 bg-slate-50/70 text-xs dark:border-white/10 dark:bg-[#121418]"
                                            />
                                        </div>
                                    </div>

                                    {/* Live Calculation Preview Card */}
                                    <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-3 space-y-1.5 dark:border-blue-900/30 dark:bg-blue-950/20">
                                        <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-zinc-300">
                                            <span>Subtotal Item:</span>
                                            <span className="font-mono">{formatMoney(subtotal, 'IDR')}</span>
                                        </div>
                                        {discount > 0 && (
                                            <div className="flex items-center justify-between text-xs font-medium text-rose-600 dark:text-rose-400">
                                                <span>Diskon Potongan:</span>
                                                <span className="font-mono">- {formatMoney(discount, 'IDR')}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-zinc-400">
                                            <span>PPN ({taxRate || '0'}%):</span>
                                            <span className="font-mono">+ {formatMoney(tax, 'IDR')}</span>
                                        </div>
                                        <div className="border-t border-blue-200/80 pt-1.5 flex items-center justify-between text-xs font-bold text-blue-700 dark:border-blue-900/60 dark:text-blue-400">
                                            <span>Total Tagihan (Grand Total):</span>
                                            <span className="font-mono text-sm">{formatMoney(grandTotal, 'IDR')}</span>
                                        </div>
                                    </div>
                                </>
                            )}

                            {isExpense && (
                                <>
                                    <div className="grid gap-2.5 sm:grid-cols-2">
                                        <Field
                                            name="category"
                                            label="Kategori Biaya"
                                            defaultValue="Court fee"
                                            placeholder="Biaya PNBP, Saksi, Notaris..."
                                            required
                                        />
                                        <Field
                                            name="incurred_at"
                                            label="Tanggal Biaya"
                                            type="date"
                                            required
                                        />
                                    </div>
                                    <Field
                                        name="description"
                                        label="Deskripsi Pengeluaran"
                                        placeholder="Rincian pembayaran biaya pendaftaran..."
                                        required
                                    />
                                    <Field
                                        name="amount"
                                        label="Nominal Pengeluaran (IDR)"
                                        type="number"
                                        placeholder="0"
                                        required
                                    />
                                    <div className="grid gap-1">
                                        <Label
                                            htmlFor="expense-proof"
                                            className="text-xs font-semibold text-slate-700 dark:text-zinc-200"
                                        >
                                            Unggah Bukti / Kuitansi
                                        </Label>
                                        <Input
                                            id="expense-proof"
                                            name="proof"
                                            type="file"
                                            accept="application/pdf,image/png,image/jpeg,image/webp"
                                            className="h-8 rounded-lg border-slate-200 bg-slate-50/70 text-xs file:mr-2.5 file:rounded file:border-0 file:bg-slate-200 file:px-2 file:py-0.5 file:text-xs file:font-semibold dark:border-white/10 dark:bg-[#121418]"
                                        />
                                    </div>
                                    <input type="hidden" name="status" value="draft" />
                                </>
                            )}

                            {isPayment && (
                                <>
                                    <div className="grid gap-2.5 sm:grid-cols-2">
                                        <Field
                                            name="amount"
                                            label="Nominal Pembayaran (IDR)"
                                            type="number"
                                            placeholder="0"
                                            required
                                        />
                                        <Field
                                            name="method"
                                            label="Metode Pembayaran"
                                            defaultValue="Transfer bank"
                                            required
                                        />
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
                                        <Input
                                            id="payment-proof"
                                            name="proof"
                                            type="file"
                                            accept="application/pdf,image/png,image/jpeg,image/webp"
                                            className="h-8 rounded-lg border-slate-200 bg-slate-50/70 text-xs file:mr-2.5 file:rounded file:border-0 file:bg-slate-200 file:px-2 file:py-0.5 file:text-xs file:font-semibold dark:border-white/10 dark:bg-[#121418]"
                                        />
                                    </div>

                                    {/* Invoice Allocation Builder */}
                                    {(() => {
                                        const eligibleInvoices = invoices.filter(
                                            (inv) => ['sent', 'overdue'].includes(inv.status) && (inv.outstanding_amount ?? 0) > 0
                                        );
                                        const draftInvoices = invoices.filter(
                                            (inv) => inv.status === 'draft' && (inv.outstanding_amount ?? 0) > 0
                                        );

                                        return (
                                            <div className="space-y-2 rounded-lg border border-slate-200/70 bg-slate-50/60 p-3 dark:border-white/[0.04] dark:bg-[#121418]">
                                                <Label className="text-xs font-semibold text-slate-900 dark:text-white">
                                                    Alokasi ke Invoice
                                                </Label>

                                                {eligibleInvoices.length > 0 ? (
                                                    <>
                                                        <p className="text-[10.5px] text-slate-500 dark:text-zinc-400">
                                                            Alokasikan nominal pembayaran ke invoice resmi yang terkirim / overdue:
                                                        </p>
                                                        <div className="space-y-1.5 pt-1">
                                                            {eligibleInvoices.map((inv, index) => (
                                                                <div
                                                                    className="grid grid-cols-[1fr_7.5rem] items-center gap-2"
                                                                    key={inv.id}
                                                                >
                                                                    <div className="min-w-0">
                                                                        <div className="flex items-center gap-1.5">
                                                                            <p className="truncate font-mono text-xs font-semibold text-slate-900 dark:text-white">
                                                                                {inv.invoice_number}
                                                                            </p>
                                                                            <span className="rounded bg-blue-50 px-1 py-0.5 text-[9px] font-semibold text-blue-600 uppercase dark:bg-blue-950/40 dark:text-blue-400">
                                                                                {inv.status}
                                                                            </span>
                                                                        </div>
                                                                        <p className="text-[10px] text-slate-500">
                                                                            Sisa {formatMoney(inv.outstanding_amount ?? 0, inv.currency)}
                                                                        </p>
                                                                    </div>
                                                                    <input
                                                                        type="hidden"
                                                                        name={`allocations[${index}][invoice_id]`}
                                                                        value={inv.id}
                                                                    />
                                                                    <Input
                                                                        name={`allocations[${index}][amount]`}
                                                                        type="number"
                                                                        min="1"
                                                                        placeholder="0"
                                                                        className="h-7.5 rounded-lg border-slate-200 bg-white text-xs dark:border-white/10 dark:bg-zinc-800"
                                                                    />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </>
                                                ) : (
                                                    <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                                                        Tidak ada invoice aktif (Sent/Overdue) dengan sisa tagihan. Pembayaran ini akan dicatat sebagai <strong>uang muka / dana titipan (Unallocated Retainer)</strong>.
                                                    </p>
                                                )}

                                                {draftInvoices.length > 0 && (
                                                    <div className="mt-2 rounded-md border border-amber-200/80 bg-amber-50/70 p-2 text-[10.5px] text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-300">
                                                        <span className="font-semibold">Perhatian:</span> Terdapat {draftInvoices.length} invoice berstatus <em>Draft</em>. Invoice Draft harus dikirim (Sent) terlebih dahulu sebelum dapat dialokasikan pembayaran.
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })()}
                                </>
                            )}

                            <input type="hidden" name="currency" value="IDR" />
                            {!isExpense && !isPayment && (
                                <input type="hidden" name="status" value="draft" />
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
                                <p className="text-xs font-semibold text-rose-500" key={e}>
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
            <div className="relative">
                <select
                    id={name}
                    name={name}
                    required={required}
                    className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-slate-50/70 pr-7 pl-2.5 text-xs font-medium text-slate-900 transition-colors outline-hidden hover:bg-slate-100 focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-zinc-200"
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
                <ChevronDown className="pointer-events-none absolute top-1/2 right-2 size-3 -translate-y-1/2 text-slate-400" />
            </div>
        </div>
    );
}

FinanceIndex.layout = {
    breadcrumbs: [{ title: 'Keuangan', href: financeRoutes.index() }],
};
