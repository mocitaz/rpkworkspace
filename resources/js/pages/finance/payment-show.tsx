import { Head, Link } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowLeft,
    ArrowUpRight,
    Banknote,
    Building2,
    CalendarClock,
    CheckCircle2,
    Clock,
    CreditCard,
    FileText,
    Receipt,
    Scale,
    ShieldAlert,
    Undo2,
    UserCheck,
} from 'lucide-react';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { formatDate, formatMoney } from '@/lib/format';
import * as financeRoutes from '@/routes/finance';
import * as invoiceRoutes from '@/routes/finance/invoices';
import * as paymentRoutes from '@/routes/finance/payments';

type Payment = {
    id: string;
    reference_number?: string;
    amount: number;
    currency: string;
    method: string;
    received_at: string;
    reversed_at?: string;
    refunded_at?: string;
    reversal_reason?: string;
    refund_reason?: string;
    client: { display_name: string };
    allocations: {
        id: string;
        amount: number;
        invoice: {
            id: string;
            invoice_number: string;
            title: string;
            outstanding_amount: number;
            currency: string;
            status: string;
        };
    }[];
};

export default function PaymentShow({ payment }: { payment: Payment }) {
    const isReversed = !!payment.reversed_at;
    const isRefunded = !!payment.refunded_at;
    const isNormal = !isReversed && !isRefunded;

    return (
        <>
            <Head title={`Detail Penerimaan Kas - ${formatMoney(payment.amount, payment.currency)}`} />

            <div className="min-h-screen bg-[#fafafc] pb-20 dark:bg-[#0c0d10]">
                <main className="mx-auto max-w-4xl space-y-5 px-4 py-5 sm:px-6 lg:px-8">
                    {/* 1. Header Toolbar */}
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center border-b border-slate-200/60 pb-4 dark:border-white/[0.06]">
                        <div className="space-y-1">
                            <Link
                                href={financeRoutes.index()}
                                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 transition-colors hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white"
                            >
                                <ArrowLeft className="size-3" />
                                Kembali ke Keuangan
                            </Link>
                            <div className="flex flex-wrap items-center gap-2 pt-0.5">
                                <h1 className="font-mono text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    {payment.reference_number ?? 'Penerimaan Kas'}
                                </h1>
                                <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-semibold text-slate-700 dark:bg-white/[0.06] dark:text-zinc-300">
                                    OFFICIAL CASH RECEIPT
                                </span>
                            </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-2">
                            <Button
                                size="sm"
                                className="h-8 rounded-lg bg-emerald-600 px-3.5 text-xs font-semibold text-white shadow-2xs hover:bg-emerald-700 active:scale-95"
                                asChild
                            >
                                <a
                                    href={paymentRoutes.receipt.url(payment.id)}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <Receipt className="mr-1 size-3" />
                                    Cetak Kuitansi (PDF)
                                </a>
                            </Button>
                        </div>
                    </div>

                    {/* 2. Top Amount Banner */}
                    <div className="rounded-xl border border-slate-200/70 bg-white p-5 shadow-2xs sm:p-6 dark:border-white/[0.06] dark:bg-[#14161b]">
                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                            <div className="space-y-1">
                                <span className="text-[10px] font-semibold text-slate-500 uppercase dark:text-zinc-400">
                                    NOMINAL DITERIMA (VERIFIED)
                                </span>
                                <div className="flex items-baseline gap-2">
                                    <span className="font-mono text-2xl font-bold tracking-tight text-emerald-600 sm:text-3xl dark:text-emerald-400">
                                        {formatMoney(payment.amount, payment.currency)}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-600 dark:text-zinc-400">
                                    Pembayar:{' '}
                                    <span className="font-semibold text-slate-900 dark:text-white">
                                        {payment.client.display_name}
                                    </span>{' '}
                                    · Melalui <span className="font-semibold text-slate-900 dark:text-white">{payment.method}</span>
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                {isNormal && (
                                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                                        <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        Tercatat Sah &amp; Valid
                                    </span>
                                )}
                                {isReversed && (
                                    <span className="inline-flex items-center gap-1 rounded-lg bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
                                        <ShieldAlert className="size-3" />
                                        Transaksi Dikoreksi
                                    </span>
                                )}
                                {isRefunded && (
                                    <span className="inline-flex items-center gap-1 rounded-lg bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
                                        <Undo2 className="size-3" />
                                        Dana Direfund
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Reversal / Refund Alert */}
                        {payment.reversed_at && (
                            <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50/80 p-3 text-xs font-medium text-rose-900 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-200">
                                <strong className="font-semibold">Alasan Koreksi Pembayaran:</strong>{' '}
                                {payment.reversal_reason}
                            </div>
                        )}
                        {payment.refunded_at && (
                            <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50/80 p-3 text-xs font-medium text-rose-900 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-200">
                                <strong className="font-semibold">Alasan Pengembalian (Refund):</strong>{' '}
                                {payment.refund_reason}
                            </div>
                        )}
                    </div>

                    {/* 3. Compact 3-Column Meta Bento */}
                    <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <div className="rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[10px] font-semibold uppercase">
                                    WAKTU PENERIMAAN
                                </span>
                                <CalendarClock className="size-3.5" />
                            </div>
                            <p className="mt-1.5 font-mono text-xs font-bold text-slate-900 dark:text-white">
                                {formatDate(payment.received_at, true)}
                            </p>
                        </div>

                        <div className="rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[10px] font-semibold uppercase">
                                    METODE PEMBAYARAN
                                </span>
                                <CreditCard className="size-3.5" />
                            </div>
                            <p className="mt-1.5 text-xs font-bold text-slate-900 dark:text-white">
                                {payment.method}
                            </p>
                        </div>

                        <div className="rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[10px] font-semibold uppercase">
                                    ALOKASI INVOICE
                                </span>
                                <Receipt className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <p className="mt-1.5 font-mono text-xs font-bold text-slate-900 dark:text-white">
                                {payment.allocations.length} Invoice Terkait
                            </p>
                        </div>
                    </section>

                    {/* 4. Allocations Card */}
                    <div className="rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-white/[0.04]">
                            <div className="flex items-center gap-2">
                                <div className="flex size-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                                    <Receipt className="size-3.5" />
                                </div>
                                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                                    Alokasi Pelunasan Invoice Tagihan
                                </h3>
                            </div>
                            <span className="rounded bg-slate-100 px-1.5 py-0.2 font-mono text-[10px] font-semibold text-slate-600 dark:bg-zinc-800 dark:text-zinc-400">
                                {payment.allocations.length} Alokasi
                            </span>
                        </div>

                        <div className="divide-y divide-slate-100 pt-1 dark:divide-white/[0.04]">
                            {payment.allocations.length ? (
                                payment.allocations.map((allocation) => (
                                    allocation.invoice ? (
                                        <Link
                                            key={allocation.id}
                                            href={invoiceRoutes.show.url(allocation.invoice.id)}
                                            className="group flex flex-col justify-between gap-2 py-3 transition-colors hover:bg-slate-50/50 sm:flex-row sm:items-center dark:hover:bg-white/[0.02]"
                                        >
                                            <div className="space-y-0.5">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="font-mono text-xs font-semibold text-blue-600 group-hover:underline dark:text-blue-400">
                                                        {allocation.invoice.invoice_number}
                                                    </span>
                                                    <StatusBadge value={allocation.invoice.status} />
                                                </div>
                                                <p className="text-xs font-medium text-slate-900 dark:text-white">
                                                    {allocation.invoice.title}
                                                </p>
                                                <p className="font-mono text-[10px] text-slate-500 dark:text-zinc-400">
                                                    Sisa Tagihan: {formatMoney(allocation.invoice.outstanding_amount, allocation.invoice.currency)}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-2.5 text-right">
                                                <div className="text-right">
                                                    <span className="text-[9.5px] font-semibold text-slate-400 uppercase block">
                                                        Dialokasikan
                                                    </span>
                                                    <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                                        {formatMoney(allocation.amount, allocation.invoice.currency)}
                                                    </span>
                                                </div>
                                                <ArrowUpRight className="size-3.5 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-blue-600" />
                                            </div>
                                        </Link>
                                    ) : (
                                        <div
                                            key={allocation.id}
                                            className="flex flex-col justify-between gap-2 py-3 sm:flex-row sm:items-center"
                                        >
                                            <div className="space-y-0.5">
                                                <span className="font-mono text-xs font-semibold text-slate-500">
                                                    Invoice Tidak Ditemukan
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                                    {formatMoney(allocation.amount, payment.currency)}
                                                </span>
                                            </div>
                                        </div>
                                    )
                                ))
                            ) : (
                                <p className="py-6 text-center text-xs font-medium text-slate-400 dark:text-zinc-500">
                                    Belum ada alokasi invoice tercatat pada transaksi ini.
                                </p>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}

PaymentShow.layout = {
    breadcrumbs: [{ title: 'Detail Pembayaran', href: financeRoutes.index() }],
};
