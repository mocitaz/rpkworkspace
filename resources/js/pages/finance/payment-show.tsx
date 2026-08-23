import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Banknote, Building2, CheckCircle2, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDate, formatMoney } from '@/lib/format';
import * as financeRoutes from '@/routes/finance';
import * as invoiceRoutes from '@/routes/finance/invoices';

type Payment = {
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
    return (
        <>
            <Head title="Detail Pembayaran Masuk" />

            <div className="min-h-screen w-full bg-[#fbfbfa] text-[#111111] antialiased dark:bg-[#121212] dark:text-[#fbfbfa]">
                <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
                    {/* Header Minimalist Notion */}
                    <div className="space-y-1">
                        <Link
                            href={financeRoutes.index()}
                            className="inline-flex items-center gap-1 text-xs font-medium text-[#787774] transition-colors hover:text-[#111111] dark:text-zinc-400 dark:hover:text-white"
                        >
                            <ArrowLeft className="size-3.5" />
                            Kembali ke Ringkasan Keuangan
                        </Link>
                        <div className="pt-1">
                            <span className="font-mono text-2xl font-bold tracking-tight text-emerald-600 sm:text-3xl dark:text-emerald-400">
                                {formatMoney(payment.amount, payment.currency)}
                            </span>
                        </div>
                        <p className="text-xs text-[#787774] dark:text-zinc-400">
                            Pembayaran dari <span className="font-semibold text-[#111111] dark:text-white">{payment.client.display_name}</span> · Melalui {payment.method} · {formatDate(payment.received_at)}
                        </p>
                        {payment.reversed_at && (
                            <p className="mt-2 text-xs font-semibold text-rose-600">
                                Transaksi Dikoreksi: {payment.reversal_reason}
                            </p>
                        )}
                        {payment.refunded_at && (
                            <p className="mt-2 text-xs font-semibold text-rose-600">
                                Dana Direfund: {payment.refund_reason}
                            </p>
                        )}
                    </div>

                    {/* Allocations Card */}
                    <div className="rounded-xl border border-black/[0.08] bg-white p-4.5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                        <div className="border-b border-black/[0.04] pb-2.5 dark:border-white/[0.04]">
                            <h3 className="text-xs font-bold text-[#111111] dark:text-white">
                                Alokasi Pelunasan Invoice
                            </h3>
                        </div>

                        <div className="divide-y divide-black/[0.04] pt-1 dark:divide-white/[0.04]">
                            {payment.allocations.length ? (
                                payment.allocations.map((allocation) => (
                                    <Link
                                        key={allocation.id}
                                        href={invoiceRoutes.show.url(allocation.invoice.id)}
                                        className="group flex items-center justify-between py-3 text-xs transition-colors hover:bg-black/[0.01] dark:hover:bg-white/[0.02]"
                                    >
                                        <div className="space-y-0.5">
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono font-semibold text-blue-600 group-hover:underline dark:text-sky-400">
                                                    {allocation.invoice.invoice_number}
                                                </span>
                                                <span className="rounded-md bg-black/[0.04] px-1.5 py-0.2 text-[10px] text-[#787774] dark:bg-white/[0.06] dark:text-zinc-300">
                                                    {allocation.invoice.status}
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-[#787774] dark:text-zinc-400">
                                                {allocation.invoice.title} · Sisa Tagihan {formatMoney(allocation.invoice.outstanding_amount, allocation.invoice.currency)}
                                            </p>
                                        </div>

                                        <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                            {formatMoney(allocation.amount, allocation.invoice.currency)}
                                        </span>
                                    </Link>
                                ))
                            ) : (
                                <p className="py-6 text-center text-xs text-[#787774] dark:text-zinc-500">
                                    Belum ada alokasi invoice tercatat.
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
