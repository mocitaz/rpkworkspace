import { Form, Head, Link } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowUpRight,
    Banknote,
    Building2,
    CalendarClock,
    CheckCircle2,
    ChevronDown,
    DollarSign,
    FilePlus2,
    FileText,
    FolderKanban,
    Plus,
    Receipt,
    ReceiptText,
    Trash2,
    Undo2,
    WalletCards,
} from 'lucide-react';
import { useState } from 'react';
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
    expense_amount: number;
    receivable_amount: number;
    overdue_amount?: number;
    aging?: Record<string, number>;
    margin_amount: number;
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
    const currency = overview?.currency ?? 'IDR';

    return (
        <>
            <Head title="Keuangan & Billing Operasional" />

            <div className="min-h-screen w-full bg-[#fbfbfa] text-[#111111] antialiased dark:bg-[#121212] dark:text-[#fbfbfa]">
                <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
                    {/* Header Minimalist Notion */}
                    <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div className="space-y-1">
                            <h1 className="text-2xl font-bold tracking-tight text-[#111111] dark:text-white">
                                Keuangan &amp; Billing
                            </h1>
                            <p className="text-xs text-[#787774] dark:text-zinc-400">
                                Manajemen invoice tagihan, quotation tarif hukum, biaya perkara (disbursement), dan arus kas.
                            </p>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex flex-wrap items-center gap-2">
                            {can.quotation && (
                                <Button
                                    variant="outline"
                                    onClick={() => setModal('quotation')}
                                    className="h-8 rounded-lg border-black/10 bg-white px-3 text-xs font-medium text-[#111111] shadow-2xs hover:bg-black/[0.03] dark:border-white/10 dark:bg-[#1c1c1e] dark:text-zinc-200"
                                >
                                    <FilePlus2 className="mr-1.5 size-3.5 text-[#787774]" />
                                    Quotation
                                </Button>
                            )}
                            {can.expense && (
                                <Button
                                    variant="outline"
                                    onClick={() => setModal('expense')}
                                    className="h-8 rounded-lg border-black/10 bg-white px-3 text-xs font-medium text-[#111111] shadow-2xs hover:bg-black/[0.03] dark:border-white/10 dark:bg-[#1c1c1e] dark:text-zinc-200"
                                >
                                    <WalletCards className="mr-1.5 size-3.5 text-[#787774]" />
                                    Catat Biaya
                                </Button>
                            )}
                            {can.payment && (
                                <Button
                                    variant="outline"
                                    onClick={() => setModal('payment')}
                                    className="h-8 rounded-lg border-black/10 bg-white px-3 text-xs font-medium text-[#111111] shadow-2xs hover:bg-black/[0.03] dark:border-white/10 dark:bg-[#1c1c1e] dark:text-zinc-200"
                                >
                                    <Banknote className="mr-1.5 size-3.5 text-emerald-600 dark:text-emerald-400" />
                                    Pembayaran
                                </Button>
                            )}
                            {can.invoice && (
                                <Button
                                    onClick={() => setModal('invoice')}
                                    className="h-8 rounded-lg bg-[#111111] px-3.5 text-xs font-semibold text-white shadow-2xs transition-colors hover:bg-black active:scale-95 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                                >
                                    <ReceiptText className="mr-1.5 size-3.5" />
                                    Buat Invoice
                                </Button>
                            )}
                        </div>
                    </header>

                    {/* Filter / Matter Selector Bar */}
                    <Form
                        {...financeRoutes.index.form()}
                        className="flex flex-col gap-2 rounded-xl border border-black/[0.08] bg-white p-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] sm:flex-row sm:items-center dark:border-white/[0.08] dark:bg-[#1a1a1c]"
                    >
                        <div className="relative flex-1">
                            <select
                                name="matter_id"
                                defaultValue={selectedMatterId}
                                className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-black/[0.08] bg-[#fbfbfa] pl-3 pr-8 text-xs font-medium text-[#111111] outline-none transition-colors hover:bg-black/[0.02] focus:border-black/20 focus:bg-white dark:border-white/[0.1] dark:bg-[#121212] dark:text-zinc-200"
                            >
                                <option value="">Semua Lingkup Perkara (Ringkasan Global)</option>
                                {matters.map((m) => (
                                    <option value={m.id} key={m.id}>
                                        {m.matter_number} — {m.title} {m.client ? `(${m.client})` : ''}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-[#787774]" />
                        </div>
                        <Button
                            type="submit"
                            variant="outline"
                            className="h-8 shrink-0 rounded-lg border-black/10 bg-white px-3.5 text-xs font-medium text-[#111111] hover:bg-black/[0.03] dark:border-white/10 dark:bg-[#1c1c1e] dark:text-zinc-200"
                        >
                            Tampilkan Ringkasan
                        </Button>
                    </Form>

                    {/* Bento Metric Cards */}
                    {overview ? (
                        <div className="space-y-3">
                            {/* Primary 4 Financial Metrics (h-[76px]) */}
                            <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                {/* 1. Invoice Diterbitkan */}
                                <div className="flex h-[76px] flex-col justify-between rounded-xl border border-black/[0.07] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                                    <div className="flex items-center justify-between text-[11px] font-medium text-[#787774] dark:text-zinc-400">
                                        <span>Total Tagihan Diterbitkan</span>
                                        <Receipt className="size-3.5 text-[#1f6c9f] dark:text-sky-400" />
                                    </div>
                                    <div className="flex items-baseline justify-between">
                                        <span className="font-mono text-base font-bold tracking-tight text-[#111111] dark:text-white">
                                            {formatMoney(overview.invoiced_amount, currency)}
                                        </span>
                                        <span className="text-[10px] text-[#787774] dark:text-zinc-400">
                                            invoice resmi
                                        </span>
                                    </div>
                                </div>

                                {/* 2. Pembayaran Diterima */}
                                <div className="flex h-[76px] flex-col justify-between rounded-xl border border-black/[0.07] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                                    <div className="flex items-center justify-between text-[11px] font-medium text-[#787774] dark:text-zinc-400">
                                        <span>Kas Diterima (Collected)</span>
                                        <Banknote className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <div className="flex items-baseline justify-between">
                                        <span className="font-mono text-base font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                                            {formatMoney(overview.payment_received_amount, currency)}
                                        </span>
                                        <span className="text-[10px] text-[#787774] dark:text-zinc-400">
                                            dana masuk
                                        </span>
                                    </div>
                                </div>

                                {/* 3. Piutang Berjalan */}
                                <div className="flex h-[76px] flex-col justify-between rounded-xl border border-black/[0.07] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                                    <div className="flex items-center justify-between text-[11px] font-medium text-[#787774] dark:text-zinc-400">
                                        <span>Piutang (Outstanding)</span>
                                        <CalendarClock className="size-3.5 text-amber-600 dark:text-amber-400" />
                                    </div>
                                    <div className="flex items-baseline justify-between">
                                        <span className="font-mono text-base font-bold tracking-tight text-amber-600 dark:text-amber-400">
                                            {formatMoney(overview.receivable_amount, currency)}
                                        </span>
                                        <span className="text-[10px] text-[#787774] dark:text-zinc-400">
                                            belum lunas
                                        </span>
                                    </div>
                                </div>

                                {/* 4. Net Margin */}
                                <div className="flex h-[76px] flex-col justify-between rounded-xl border border-black/[0.07] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                                    <div className="flex items-center justify-between text-[11px] font-medium text-[#787774] dark:text-zinc-400">
                                        <span>Net Margin &amp; Profit</span>
                                        <DollarSign className="size-3.5 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div className="flex items-baseline justify-between">
                                        <span className="font-mono text-base font-bold tracking-tight text-purple-600 dark:text-purple-400">
                                            {formatMoney(overview.margin_amount, currency)}
                                        </span>
                                        <span className="text-[10px] text-[#787774] dark:text-zinc-400">
                                            setelah biaya
                                        </span>
                                    </div>
                                </div>
                            </section>

                            {/* Secondary Operational Metrics & Aging */}
                            <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                <div className="rounded-xl border border-black/[0.07] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                                    <p className="text-[10px] font-medium text-[#787774] dark:text-zinc-400">Anggaran (Budget)</p>
                                    <p className="mt-0.5 font-mono text-xs font-bold text-[#111111] dark:text-white">
                                        {formatMoney(overview.budget_amount, currency)}
                                    </p>
                                </div>
                                <div className="rounded-xl border border-black/[0.07] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                                    <p className="text-[10px] font-medium text-[#787774] dark:text-zinc-400">Biaya Perkara (Expense)</p>
                                    <p className="mt-0.5 font-mono text-xs font-bold text-rose-600 dark:text-rose-400">
                                        {formatMoney(overview.expense_amount, currency)}
                                    </p>
                                </div>
                                <div className="rounded-xl border border-black/[0.07] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                                    <p className="text-[10px] font-medium text-[#787774] dark:text-zinc-400">Quotation Diajukan</p>
                                    <p className="mt-0.5 font-mono text-xs font-bold text-[#111111] dark:text-white">
                                        {formatMoney(overview.quotation_amount, currency)}
                                    </p>
                                </div>
                                <div className="rounded-xl border border-black/[0.07] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                                    <p className="text-[10px] font-medium text-[#787774] dark:text-zinc-400">Lewat Jatuh Tempo</p>
                                    <p className="mt-0.5 font-mono text-xs font-bold text-rose-600 dark:text-rose-400">
                                        {formatMoney(overview.overdue_amount ?? 0, currency)}
                                    </p>
                                </div>
                            </section>

                            {/* Aging Analysis Breakdown Bar */}
                            {overview.aging && (
                                <div className="rounded-xl border border-black/[0.08] bg-white p-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                                    <div className="mb-2 flex items-center justify-between">
                                        <span className="text-[11px] font-bold text-[#111111] dark:text-white">
                                            Analisis Umur Piutang (Aging Receivables)
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                                        {[
                                            ['Belum Jatuh Tempo', overview.aging.current, 'text-[#111111] dark:text-white'],
                                            ['1–30 Hari', overview.aging['1_30'], 'text-amber-600 dark:text-amber-400'],
                                            ['31–60 Hari', overview.aging['31_60'], 'text-amber-700 dark:text-amber-300'],
                                            ['61–90 Hari', overview.aging['61_90'], 'text-rose-600 dark:text-rose-400'],
                                            ['>90 Hari (Kritis)', overview.aging.over_90, 'text-rose-700 dark:text-rose-300 font-bold'],
                                        ].map(([label, val, textCls]) => (
                                            <div
                                                key={String(label)}
                                                className="rounded-lg bg-[#fafafa] p-2 dark:bg-zinc-800/40"
                                            >
                                                <p className="text-[10px] text-[#787774] dark:text-zinc-400 truncate">{label}</p>
                                                <p className={`mt-0.5 font-mono text-xs font-semibold ${textCls}`}>
                                                    {formatMoney(Number(val), currency)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-black/[0.08] bg-white p-8 text-center shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                            <EmptyState
                                title="Pilih perkara untuk melihat ringkasan keuangan"
                                description="Pilih perkara melalui menu di atas untuk menampilkan rincian budget, invoice, dan penerimaan."
                            />
                        </div>
                    )}

                    {/* 4 Ledgers Grid */}
                    <div className="grid gap-4 lg:grid-cols-2">
                        {/* 1. Invoice Terbaru */}
                        <Ledger
                            title="Invoice Tagihan Terbaru"
                            items={invoices}
                            currency={currency}
                            icon={ReceiptText}
                            value={(i) => i.outstanding_amount ?? i.total_amount ?? 0}
                            date={(i) => i.due_at}
                            canTransition={can.invoiceTransition}
                            onCancel={setCancelInvoice}
                        />

                        {/* 2. Quotation Terbaru */}
                        <Ledger
                            title="Quotation / Penawaran Biaya"
                            items={quotations}
                            currency={currency}
                            icon={FilePlus2}
                            value={(i) => i.total_amount ?? 0}
                            approveQuotations={can.quotationApprove}
                            canTransition={can.invoiceTransition}
                        />

                        {/* 3. Biaya Perkara & Disbursement */}
                        <Ledger
                            title="Biaya Perkara &amp; Disbursement"
                            items={expenses}
                            currency={currency}
                            icon={WalletCards}
                            value={(i) => i.amount ?? 0}
                            date={(i) => i.incurred_at}
                        />

                        {/* 4. Riwayat Penerimaan Pembayaran */}
                        <PaymentLedger
                            items={payments}
                            currency={currency}
                            canManage={can.payment}
                            onReverse={setReversePayment}
                            onRefund={setRefundPayment}
                        />
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
            <ReversePaymentDialog payment={reversePayment} onClose={() => setReversePayment(null)} />
            <RefundPaymentDialog payment={refundPayment} onClose={() => setRefundPayment(null)} />
            <CancelInvoiceDialog invoice={cancelInvoice} onClose={() => setCancelInvoice(null)} />
        </>
    );
}

function Ledger({
    title,
    items,
    currency,
    icon: IconComp,
    value,
    date,
    approveQuotations = false,
    canTransition = false,
    onCancel,
}: {
    title: string;
    items: LedgerItem[];
    currency: string;
    icon: typeof ReceiptText;
    value: (item: LedgerItem) => number;
    date?: (item: LedgerItem) => string | undefined;
    approveQuotations?: boolean;
    canTransition?: boolean;
    onCancel?: (invoice: LedgerItem) => void;
}) {
    return (
        <div className="flex flex-col justify-between rounded-xl border border-black/[0.08] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
            <div>
                <div className="flex items-center gap-2 border-b border-black/[0.04] pb-2.5 dark:border-white/[0.04]">
                    <div className="flex size-6 items-center justify-center rounded-md bg-black/[0.04] text-[#111111] dark:bg-white/[0.06] dark:text-zinc-200">
                        <IconComp className="size-3.5" />
                    </div>
                    <h3 className="text-xs font-bold text-[#111111] dark:text-white">
                        {title}
                    </h3>
                </div>

                <div className="divide-y divide-black/[0.04] dark:divide-white/[0.04]">
                    {items.length ? (
                        items.map((i) => (
                            <div
                                key={i.id}
                                className="flex items-center justify-between gap-3 py-2.5 transition-colors hover:bg-black/[0.01] dark:hover:bg-white/[0.02]"
                            >
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        {i.invoice_number ? (
                                            <Link
                                                href={invoiceRoutes.show.url(i.id)}
                                                className="font-mono text-xs font-semibold text-blue-600 hover:underline dark:text-sky-400"
                                            >
                                                {i.invoice_number}
                                            </Link>
                                        ) : (
                                            <p className="truncate text-xs font-semibold text-[#111111] dark:text-white">
                                                {i.quotation_number ?? i.title ?? i.description}
                                            </p>
                                        )}
                                        <StatusBadge value={i.status} />
                                    </div>
                                    <p className="mt-0.5 truncate font-mono text-[10px] text-[#787774] dark:text-zinc-400">
                                        {i.matter?.matter_number ? `${i.matter.matter_number} · ${i.matter.title}` : 'Tanpa Matter'}
                                        {date?.(i) ? ` · ${formatDate(date(i)!)}` : ''}
                                    </p>
                                </div>

                                <div className="flex shrink-0 items-center gap-2 text-right">
                                    <div className="text-right">
                                        <span className="font-mono text-xs font-bold text-[#111111] dark:text-white">
                                            {formatMoney(value(i), i.currency || currency)}
                                        </span>
                                    </div>

                                    {/* Action Links */}
                                    {i.invoice_number && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="size-7 rounded-md text-[#787774] hover:bg-black/[0.04] hover:text-[#111111]"
                                            asChild
                                        >
                                            <a
                                                href={invoiceRoutes.pdf.url(i.id)}
                                                target="_blank"
                                                rel="noreferrer"
                                                title="Download PDF Invoice"
                                            >
                                                <FileText className="size-3.5" />
                                            </a>
                                        </Button>
                                    )}

                                    {i.quotation_number && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="size-7 rounded-md text-[#787774] hover:bg-black/[0.04] hover:text-[#111111]"
                                            asChild
                                        >
                                            <a
                                                href={quotationRoutes.pdf.url(i.id)}
                                                target="_blank"
                                                rel="noreferrer"
                                                title="Download PDF Quotation"
                                            >
                                                <FileText className="size-3.5" />
                                            </a>
                                        </Button>
                                    )}

                                    {/* Transitions & Approvals */}
                                    {canTransition && i.invoice_number && i.status === 'draft' && (
                                        <Form {...invoiceRoutes.transition.form(i.id)}>
                                            <input type="hidden" name="status" value="sent" />
                                            <Button size="sm" className="h-6 rounded-md bg-[#111111] px-2 text-[10px] font-medium text-white hover:bg-black dark:bg-white dark:text-black">
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
                                                className="h-6 rounded-md text-[10px] text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                                            >
                                                Batal
                                            </Button>
                                        )}

                                    {approveQuotations &&
                                        i.quotation_number &&
                                        ['draft', 'pending_approval'].includes(i.status) && (
                                            <Form {...quotationRoutes.approve.form(i.id)}>
                                                <Button size="sm" className="h-6 rounded-md bg-emerald-600 px-2 text-[10px] font-medium text-white hover:bg-emerald-700">
                                                    Setujui
                                                </Button>
                                            </Form>
                                        )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="py-6 text-center text-xs text-[#787774] dark:text-zinc-500">
                            Belum ada catatan transaksi.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

function PaymentLedger({
    items,
    currency,
    canManage,
    onReverse,
    onRefund,
}: {
    items: LedgerItem[];
    currency: string;
    canManage: boolean;
    onReverse: (payment: LedgerItem) => void;
    onRefund: (payment: LedgerItem) => void;
}) {
    return (
        <div className="flex flex-col justify-between rounded-xl border border-black/[0.08] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
            <div>
                <div className="flex items-center gap-2 border-b border-black/[0.04] pb-2.5 dark:border-white/[0.04]">
                    <div className="flex size-6 items-center justify-center rounded-md bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                        <Banknote className="size-3.5" />
                    </div>
                    <h3 className="text-xs font-bold text-[#111111] dark:text-white">
                        Riwayat Penerimaan Pembayaran
                    </h3>
                </div>

                <div className="divide-y divide-black/[0.04] dark:divide-white/[0.04]">
                    {items.length ? (
                        items.map((payment) => (
                            <div key={payment.id} className="py-2.5">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <Link
                                            href={paymentRoutes.show.url(payment.id)}
                                            className="font-mono text-xs font-bold text-emerald-600 hover:underline dark:text-emerald-400"
                                        >
                                            {formatMoney(payment.amount ?? 0, payment.currency || currency)}
                                        </Link>
                                        <p className="mt-0.5 font-mono text-[10px] text-[#787774] dark:text-zinc-400">
                                            {payment.matter?.matter_number ?? 'Tanpa Matter'} ·{' '}
                                            {payment.received_at ? formatDate(payment.received_at) : ''}
                                        </p>
                                        {payment.allocations?.map((allocation) => (
                                            <p className="mt-0.5 font-mono text-[10px] text-[#787774]" key={allocation.id}>
                                                → Alokasi {allocation.invoice.invoice_number}: {formatMoney(allocation.amount, allocation.invoice.currency)}
                                            </p>
                                        ))}
                                        {payment.reversed_at && (
                                            <p className="mt-1 text-[10px] font-semibold text-rose-600">
                                                Dikoreksi: {payment.reversal_reason}
                                            </p>
                                        )}
                                        {payment.refunded_at && (
                                            <p className="mt-1 text-[10px] font-semibold text-rose-600">
                                                Direfund: {payment.refund_reason}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex flex-col items-end gap-1.5 text-right">
                                        <span className="rounded-md bg-black/[0.04] px-2 py-0.5 text-[10px] font-medium text-[#787774] dark:bg-white/[0.06] dark:text-zinc-300">
                                            {payment.reversed_at ? 'Dikoreksi' : payment.refunded_at ? 'Direfund' : 'Tercatat'}
                                        </span>

                                        {canManage && !payment.reversed_at && !payment.refunded_at && (
                                            <div className="flex items-center gap-1">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => onReverse(payment)}
                                                    className="h-6 rounded-md border-black/10 px-2 text-[10px] hover:bg-black/[0.03]"
                                                >
                                                    Koreksi
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => onRefund(payment)}
                                                    className="h-6 rounded-md px-2 text-[10px] text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                                                >
                                                    Refund
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="py-6 text-center text-xs text-[#787774] dark:text-zinc-500">
                            Belum ada catatan pembayaran.
                        </p>
                    )}
                </div>
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
            <DialogContent className="rounded-2xl border border-black/[0.08] bg-white p-5 shadow-2xl sm:max-w-md dark:border-white/10 dark:bg-[#1c1c1e]">
                <DialogHeader className="border-b border-black/[0.04] pb-3 dark:border-white/[0.04]">
                    <div className="flex items-center gap-2.5">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/40">
                            <Undo2 className="size-4" />
                        </div>
                        <DialogTitle className="text-sm font-bold text-[#111111] dark:text-white">
                            Koreksi &amp; Batalkan Pembayaran
                        </DialogTitle>
                    </div>
                </DialogHeader>
                {payment && (
                    <Form {...paymentRoutes.reverse.form(payment.id)} className="space-y-3 pt-2" onSuccess={onClose}>
                        {({ processing, errors }) => (
                            <>
                                <p className="text-xs text-[#787774] dark:text-zinc-400">
                                    Alokasi invoice akan dibuka kembali dan transaksi dicatat dalam log audit.
                                </p>
                                <div className="grid gap-1.5">
                                    <Label htmlFor="reason" className="text-xs font-medium text-[#2f3437] dark:text-zinc-200">
                                        Alasan Pembatalan
                                    </Label>
                                    <textarea
                                        className="w-full rounded-lg border border-black/[0.08] bg-[#fbfbfa] p-2.5 text-xs text-[#111111] outline-none transition-colors focus:border-black/20 focus:bg-white dark:border-white/10 dark:bg-[#121212] dark:text-white"
                                        id="reason"
                                        name="reason"
                                        rows={3}
                                        placeholder="Koreksi salah nominal atau salah rekening..."
                                        required
                                        minLength={8}
                                    />
                                    {errors.reason && <p className="text-xs text-rose-500">{errors.reason}</p>}
                                </div>
                                <div className="flex items-center justify-end gap-2 border-t border-black/[0.04] pt-3 dark:border-white/[0.04]">
                                    <Button type="button" variant="outline" onClick={onClose} className="h-8 rounded-lg px-3 text-xs font-medium">
                                        Batal
                                    </Button>
                                    <Button variant="destructive" disabled={processing} className="h-8 rounded-lg px-4 text-xs font-semibold">
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
            <DialogContent className="rounded-2xl border border-black/[0.08] bg-white p-5 shadow-2xl sm:max-w-md dark:border-white/10 dark:bg-[#1c1c1e]">
                <DialogHeader className="border-b border-black/[0.04] pb-3 dark:border-white/[0.04]">
                    <div className="flex items-center gap-2.5">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/40">
                            <Undo2 className="size-4" />
                        </div>
                        <DialogTitle className="text-sm font-bold text-[#111111] dark:text-white">
                            Refund Dana ke Klien
                        </DialogTitle>
                    </div>
                </DialogHeader>
                {payment && (
                    <Form {...paymentRoutes.refund.form(payment.id)} className="space-y-3 pt-2" onSuccess={onClose}>
                        {({ processing, errors }) => (
                            <>
                                <p className="text-xs text-[#787774] dark:text-zinc-400">
                                    Gunakan jika dana telah ditransfer balik ke rekening klien. Saldo invoice akan disesuaikan.
                                </p>
                                <div className="grid gap-1.5">
                                    <Label htmlFor="refund-reason" className="text-xs font-medium text-[#2f3437] dark:text-zinc-200">
                                        Alasan Pengembalian (Refund)
                                    </Label>
                                    <textarea
                                        className="w-full rounded-lg border border-black/[0.08] bg-[#fbfbfa] p-2.5 text-xs text-[#111111] outline-none transition-colors focus:border-black/20 focus:bg-white dark:border-white/10 dark:bg-[#121212] dark:text-white"
                                        id="refund-reason"
                                        name="reason"
                                        rows={3}
                                        placeholder="Kelebihan bayar atau perkara dihentikan..."
                                        required
                                        minLength={8}
                                    />
                                    {errors.reason && <p className="text-xs text-rose-500">{errors.reason}</p>}
                                </div>
                                <div className="flex items-center justify-end gap-2 border-t border-black/[0.04] pt-3 dark:border-white/[0.04]">
                                    <Button type="button" variant="outline" onClick={onClose} className="h-8 rounded-lg px-3 text-xs font-medium">
                                        Batal
                                    </Button>
                                    <Button variant="destructive" disabled={processing} className="h-8 rounded-lg px-4 text-xs font-semibold">
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
            <DialogContent className="rounded-2xl border border-black/[0.08] bg-white p-5 shadow-2xl sm:max-w-md dark:border-white/10 dark:bg-[#1c1c1e]">
                <DialogHeader className="border-b border-black/[0.04] pb-3 dark:border-white/[0.04]">
                    <div className="flex items-center gap-2.5">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/40">
                            <Trash2 className="size-4" />
                        </div>
                        <DialogTitle className="text-sm font-bold text-[#111111] dark:text-white">
                            Batalkan Invoice
                        </DialogTitle>
                    </div>
                </DialogHeader>
                {invoice && (
                    <Form {...invoiceRoutes.transition.form(invoice.id)} className="space-y-3 pt-2" onSuccess={onClose}>
                        {({ processing, errors }) => (
                            <>
                                <input type="hidden" name="status" value="cancelled" />
                                <p className="text-xs text-[#787774] dark:text-zinc-400">
                                    Invoice {invoice.invoice_number} akan dibatalkan permanen.
                                </p>
                                <div className="grid gap-1.5">
                                    <Label htmlFor="cancellation-reason" className="text-xs font-medium text-[#2f3437] dark:text-zinc-200">
                                        Alasan Pembatalan
                                    </Label>
                                    <textarea
                                        className="w-full rounded-lg border border-black/[0.08] bg-[#fbfbfa] p-2.5 text-xs text-[#111111] outline-none transition-colors focus:border-black/20 focus:bg-white dark:border-white/10 dark:bg-[#121212] dark:text-white"
                                        id="cancellation-reason"
                                        name="reason"
                                        rows={3}
                                        placeholder="Perubahan skema penagihan..."
                                        required
                                        minLength={8}
                                    />
                                    {errors.reason && <p className="text-xs text-rose-500">{errors.reason}</p>}
                                </div>
                                <div className="flex items-center justify-end gap-2 border-t border-black/[0.04] pt-3 dark:border-white/[0.04]">
                                    <Button type="button" variant="outline" onClick={onClose} className="h-8 rounded-lg px-3 text-xs font-medium">
                                        Batal
                                    </Button>
                                    <Button variant="destructive" disabled={processing} className="h-8 rounded-lg px-4 text-xs font-semibold">
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
            <DialogContent className="max-h-[85vh] overflow-y-auto rounded-2xl border border-black/[0.08] bg-white p-5 shadow-2xl sm:max-w-xl dark:border-white/10 dark:bg-[#1c1c1e]">
                <DialogHeader className="border-b border-black/[0.04] pb-3 dark:border-white/[0.04]">
                    <div className="flex items-center gap-2.5">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-black/[0.04] text-[#111111] dark:bg-white/[0.06] dark:text-white">
                            <DialogIcon className="size-4" />
                        </div>
                        <div>
                            <DialogTitle className="text-sm font-bold tracking-tight text-[#111111] dark:text-white">
                                {dialogTitles[type]}
                            </DialogTitle>
                            <DialogDescription className="text-xs text-[#787774] dark:text-zinc-400">
                                Lengkapi formulir transaksi keuangan berikut dengan benar.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <Form
                    {...route.form()}
                    className="space-y-3.5 pt-1"
                    onSuccess={onClose}
                >
                    {({ processing, errors }) => (
                        <>
                            <SelectField
                                name="matter_id"
                                label="Terkait Matter"
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
                                    <div className="space-y-2 rounded-xl border border-black/[0.08] bg-[#fafafa] p-3 dark:border-white/[0.08] dark:bg-zinc-800/40">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-[#111111] dark:text-white">
                                                Rincian Item Jasa / Biaya
                                            </span>
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="outline"
                                                className="h-6.5 rounded-md border-black/10 bg-white px-2.5 text-[10px] font-medium"
                                                onClick={() =>
                                                    setLineItems((items) => [
                                                        ...items,
                                                        { description: '', quantity: '1', unitAmount: '' },
                                                    ])
                                                }
                                            >
                                                <Plus className="mr-1 size-3" /> Tambah Baris
                                            </Button>
                                        </div>

                                        <div className="space-y-2 pt-1">
                                            {lineItems.map((item, index) => (
                                                <div
                                                    key={index}
                                                    className="grid gap-2 sm:grid-cols-[1fr_4.5rem_7rem_auto] sm:items-center"
                                                >
                                                    <Input
                                                        name={`items[${index}][description]`}
                                                        placeholder="Deskripsi item..."
                                                        className="h-8 rounded-lg border-black/[0.08] bg-white text-xs dark:bg-zinc-800"
                                                        required
                                                        value={item.description}
                                                        onChange={(e) =>
                                                            setLineItems((items) =>
                                                                items.map((cur, idx) =>
                                                                    idx === index ? { ...cur, description: e.target.value } : cur,
                                                                ),
                                                            )
                                                        }
                                                    />
                                                    <Input
                                                        name={`items[${index}][quantity]`}
                                                        type="number"
                                                        min="1"
                                                        placeholder="Qty"
                                                        className="h-8 rounded-lg border-black/[0.08] bg-white text-xs dark:bg-zinc-800"
                                                        required
                                                        value={item.quantity}
                                                        onChange={(e) =>
                                                            setLineItems((items) =>
                                                                items.map((cur, idx) =>
                                                                    idx === index ? { ...cur, quantity: e.target.value } : cur,
                                                                ),
                                                            )
                                                        }
                                                    />
                                                    <Input
                                                        name={`items[${index}][unit_amount]`}
                                                        type="number"
                                                        min="0"
                                                        placeholder="Nominal (IDR)"
                                                        className="h-8 rounded-lg border-black/[0.08] bg-white text-xs dark:bg-zinc-800"
                                                        required
                                                        value={item.unitAmount}
                                                        onChange={(e) =>
                                                            setLineItems((items) =>
                                                                items.map((cur, idx) =>
                                                                    idx === index ? { ...cur, unitAmount: e.target.value } : cur,
                                                                ),
                                                            )
                                                        }
                                                    />
                                                    {lineItems.length > 1 && (
                                                        <Button
                                                            type="button"
                                                            size="icon"
                                                            variant="ghost"
                                                            className="size-7 rounded-md text-rose-500 hover:bg-rose-50"
                                                            onClick={() =>
                                                                setLineItems((items) => items.filter((_, idx) => idx !== index))
                                                            }
                                                        >
                                                            <Trash2 className="size-3.5" />
                                                        </Button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}

                            {isExpense && (
                                <>
                                    <div className="grid gap-3 sm:grid-cols-2">
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
                                    <div className="grid gap-1.5">
                                        <Label htmlFor="expense-proof" className="text-xs font-medium text-[#2f3437] dark:text-zinc-200">
                                            Unggah Bukti / Kuitansi
                                        </Label>
                                        <Input
                                            id="expense-proof"
                                            name="proof"
                                            type="file"
                                            accept="application/pdf,image/png,image/jpeg,image/webp"
                                            className="h-8 rounded-lg border-black/[0.08] bg-[#fbfbfa] text-xs file:mr-3 file:rounded-md file:border-0 file:bg-zinc-200 file:px-2.5 file:py-0.5 file:text-xs"
                                        />
                                    </div>
                                    <input type="hidden" name="status" value="draft" />
                                </>
                            )}

                            {isPayment && (
                                <>
                                    <div className="grid gap-3 sm:grid-cols-2">
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
                                    <div className="grid gap-1.5">
                                        <Label htmlFor="payment-proof" className="text-xs font-medium text-[#2f3437] dark:text-zinc-200">
                                            Unggah Bukti Transfer
                                        </Label>
                                        <Input
                                            id="payment-proof"
                                            name="proof"
                                            type="file"
                                            accept="application/pdf,image/png,image/jpeg,image/webp"
                                            className="h-8 rounded-lg border-black/[0.08] bg-[#fbfbfa] text-xs file:mr-3 file:rounded-md file:border-0 file:bg-zinc-200 file:px-2.5 file:py-0.5 file:text-xs"
                                        />
                                    </div>

                                    {/* Invoice Allocation Builder */}
                                    {invoices.filter((inv) => (inv.outstanding_amount ?? 0) > 0).length > 0 && (
                                        <div className="space-y-2 rounded-xl border border-black/[0.08] bg-[#fafafa] p-3 dark:border-white/[0.08] dark:bg-zinc-800/40">
                                            <Label className="text-xs font-bold text-[#111111] dark:text-white">Alokasi ke Invoice</Label>
                                            <p className="text-[10px] text-[#787774]">
                                                Alokasikan nominal pembayaran ke invoice yang memiliki sisa tagihan:
                                            </p>
                                            <div className="space-y-2 pt-1">
                                                {invoices
                                                    .filter((inv) => (inv.outstanding_amount ?? 0) > 0)
                                                    .map((inv, index) => (
                                                        <div className="grid grid-cols-[1fr_8rem] items-center gap-2" key={inv.id}>
                                                            <div className="min-w-0">
                                                                <p className="truncate font-mono text-xs font-semibold">{inv.invoice_number}</p>
                                                                <p className="text-[10px] text-[#787774]">
                                                                    Sisa {formatMoney(inv.outstanding_amount ?? 0, inv.currency)}
                                                                </p>
                                                            </div>
                                                            <input type="hidden" name={`allocations[${index}][invoice_id]`} value={inv.id} />
                                                            <Input
                                                                name={`allocations[${index}][amount]`}
                                                                type="number"
                                                                min="1"
                                                                placeholder="0"
                                                                className="h-8 rounded-lg border-black/[0.08] bg-white text-xs dark:bg-zinc-800"
                                                            />
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}

                            <input type="hidden" name="currency" value="IDR" />
                            {!isExpense && !isPayment && (
                                <input type="hidden" name="status" value="draft" />
                            )}

                            <div className="flex items-center justify-end gap-2 border-t border-black/[0.04] pt-3 dark:border-white/[0.04]">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onClose}
                                    className="h-8 rounded-lg border-black/10 bg-white px-3 text-xs font-medium text-[#111111] hover:bg-black/[0.03]"
                                >
                                    Batal
                                </Button>
                                <Button
                                    disabled={processing}
                                    className="h-8 rounded-lg bg-[#111111] px-4 text-xs font-semibold text-white shadow-2xs hover:bg-black active:scale-95 dark:bg-white dark:text-black"
                                >
                                    {processing ? (
                                        <>
                                            <Spinner className="mr-1.5 size-3.5" />
                                            Menyimpan...
                                        </>
                                    ) : (
                                        'Simpan Data'
                                    )}
                                </Button>
                            </div>

                            {Object.values(errors).map((e) => (
                                <p className="text-xs text-rose-500" key={e}>
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
        <div className="grid gap-1.5">
            <Label htmlFor={name} className="text-xs font-medium text-[#2f3437] dark:text-zinc-200">
                {label} {required && <span className="text-rose-500">*</span>}
            </Label>
            <Input
                id={name}
                name={name}
                type={type}
                defaultValue={defaultValue}
                placeholder={placeholder}
                required={required}
                className="h-8 rounded-lg border-black/[0.08] bg-[#fbfbfa] text-xs text-[#111111] transition-colors focus:border-black/20 focus:bg-white dark:border-white/10 dark:bg-[#121212] dark:text-white"
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
        <div className="grid gap-1.5">
            <Label htmlFor={name} className="text-xs font-medium text-[#2f3437] dark:text-zinc-200">
                {label} {required && <span className="text-rose-500">*</span>}
            </Label>
            <div className="relative">
                <select
                    id={name}
                    name={name}
                    required={required}
                    className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-black/[0.08] bg-[#fbfbfa] pl-3 pr-8 text-xs font-medium text-[#111111] outline-none transition-colors hover:bg-black/[0.02] focus:border-black/20 focus:bg-white dark:border-white/10 dark:bg-[#121212] dark:text-zinc-200"
                >
                    <option value="">Pilih {label.toLowerCase()}</option>
                    {data.map((item) => (
                        <option value={item.id} key={item.id}>
                            {'matter_number' in item
                                ? `${item.matter_number} — ${item.title}`
                                : item.display_name}
                        </option>
                    ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-[#787774]" />
            </div>
        </div>
    );
}

FinanceIndex.layout = {
    breadcrumbs: [{ title: 'Keuangan', href: financeRoutes.index() }],
};
