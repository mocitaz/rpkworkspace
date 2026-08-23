import { Head, Link } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowLeft,
    Banknote,
    Building2,
    CalendarClock,
    Check,
    CheckCircle2,
    Copy,
    Download,
    FileText,
    FolderKanban,
    Mail,
    Phone,
    Printer,
    Receipt,
    ReceiptText,
    Scale,
    ShieldAlert,
    UserCheck,
} from 'lucide-react';
import { useState } from 'react';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { formatDate, formatMoney, terbilang } from '@/lib/format';
import * as clientRoutes from '@/routes/clients';
import * as financeRoutes from '@/routes/finance';
import * as invoiceRoutes from '@/routes/finance/invoices';
import * as matterRoutes from '@/routes/matters';

type Invoice = {
    id: string;
    invoice_number: string;
    title: string;
    status: string;
    currency: string;
    subtotal_amount?: number;
    discount_amount?: number;
    tax_rate?: number;
    tax_amount?: number;
    total_amount: number;
    paid_amount: number;
    outstanding_amount: number;
    issued_at?: string;
    due_at?: string;
    cancellation_reason?: string;
    client: {
        id?: string;
        display_name: string;
        legal_name?: string;
        client_number?: string;
        email?: string;
        phone?: string;
        address_line_1?: string;
        city?: string;
        province?: string;
        postal_code?: string;
    };
    matter?: {
        id: string;
        matter_number: string;
        title: string;
        matter_type?: string;
        court?: string;
        jurisdiction?: string;
        responsible_partner_id?: number;
        responsible_partner?: { id: number; name: string };
    };
    line_items: {
        id: string;
        description: string;
        quantity: number;
        unit_amount: number;
        total_amount: number;
    }[];
    payment_allocations: {
        id: string;
        amount: number;
        payment: {
            id: string;
            amount: number;
            received_at: string;
            reference_number?: string;
            reversed_at?: string;
            refunded_at?: string;
        };
    }[];
};

export default function InvoiceShow({ invoice }: { invoice: Invoice }) {
    const [copiedAccount, setCopiedAccount] = useState(false);
    const [copiedInvoiceNumber, setCopiedInvoiceNumber] = useState(false);

    const isOverdue =
        invoice.due_at &&
        new Date(invoice.due_at) < new Date() &&
        !['paid', 'cancelled'].includes(invoice.status);

    const handleCopyAccount = () => {
        navigator.clipboard.writeText('872-009-8811');
        setCopiedAccount(true);
        setTimeout(() => setCopiedAccount(false), 2000);
    };

    const handleCopyInvoiceNumber = () => {
        navigator.clipboard.writeText(invoice.invoice_number);
        setCopiedInvoiceNumber(true);
        setTimeout(() => setCopiedInvoiceNumber(false), 2000);
    };

    const handlePrint = () => {
        window.print();
    };

    const subtotal = invoice.subtotal_amount ?? invoice.line_items.reduce((acc, curr) => acc + Number(curr.total_amount || 0), 0);
    const discount = invoice.discount_amount ?? 0;
    const taxAmount = invoice.tax_amount ?? 0;
    const totalAmount = invoice.total_amount;

    return (
        <>
            <Head title={`Invoice ${invoice.invoice_number} — ${invoice.client.display_name}`} />

            <div className="min-h-screen w-full bg-[#fbfbfa] text-[#111111] antialiased print:bg-white print:p-0 dark:bg-[#121212] dark:text-[#fbfbfa]">
                <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 print:max-w-none print:px-0 print:py-0">
                    {/* Navigation Breadcrumb & Action Toolbar */}
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center print:hidden">
                        <div className="space-y-1">
                            <Link
                                href={financeRoutes.index()}
                                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#787774] transition-colors hover:text-[#111111] dark:text-zinc-400 dark:hover:text-white"
                            >
                                <ArrowLeft className="size-3.5" />
                                Kembali ke Ringkasan Keuangan
                            </Link>
                            <div className="flex flex-wrap items-center gap-2.5 pt-0.5">
                                <h1 className="font-mono text-2xl font-bold tracking-tight text-[#111111] dark:text-white">
                                    {invoice.invoice_number}
                                </h1>
                                <button
                                    type="button"
                                    onClick={handleCopyInvoiceNumber}
                                    title="Salin Nomor Invoice"
                                    className="inline-flex items-center gap-1 rounded-md border border-black/[0.08] bg-white px-2 py-0.5 text-[10px] font-medium text-[#787774] transition-colors hover:bg-black/[0.03] dark:border-white/[0.08] dark:bg-[#1a1a1c] dark:text-zinc-300"
                                >
                                    {copiedInvoiceNumber ? (
                                        <>
                                            <Check className="size-3 text-emerald-600" />
                                            Tersalin
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="size-3" />
                                            Salin
                                        </>
                                    )}
                                </button>
                                <StatusBadge value={invoice.status} />
                            </div>
                        </div>

                        {/* Top Action Buttons */}
                        <div className="flex flex-wrap items-center gap-2">
                            <Button
                                variant="outline"
                                onClick={handlePrint}
                                className="h-8 rounded-lg border-black/10 bg-white px-3 text-xs font-medium text-[#111111] shadow-2xs hover:bg-black/[0.03] dark:border-white/10 dark:bg-[#1c1c1e] dark:text-zinc-200"
                            >
                                <Printer className="mr-1.5 size-3.5 text-[#787774]" />
                                Cetak
                            </Button>
                            <Button
                                className="h-8 rounded-lg bg-[#111111] px-3.5 text-xs font-semibold text-white shadow-2xs transition-colors hover:bg-black active:scale-95 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                                asChild
                            >
                                <a href={invoiceRoutes.pdf.url(invoice.id)} target="_blank" rel="noreferrer">
                                    <Download className="mr-1.5 size-3.5" />
                                    Download PDF Resmi
                                </a>
                            </Button>
                        </div>
                    </div>

                    {/* Compact 4-Column Stat Strips (h-[76px]) */}
                    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 print:hidden">
                        {/* 1. Total Tagihan */}
                        <div className="flex h-[76px] flex-col justify-between rounded-xl border border-black/[0.07] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                            <div className="flex items-center justify-between text-[11px] font-medium text-[#787774] dark:text-zinc-400">
                                <span>Total Tagihan (Gross)</span>
                                <Receipt className="size-3.5 text-[#1f6c9f] dark:text-sky-400" />
                            </div>
                            <div className="flex items-baseline justify-between">
                                <span className="font-mono text-base font-bold tracking-tight text-[#111111] dark:text-white">
                                    {formatMoney(totalAmount, invoice.currency)}
                                </span>
                                <span className="text-[10px] text-[#787774] dark:text-zinc-400">
                                    termasuk pajak
                                </span>
                            </div>
                        </div>

                        {/* 2. Telah Dibayar */}
                        <div className="flex h-[76px] flex-col justify-between rounded-xl border border-black/[0.07] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                            <div className="flex items-center justify-between text-[11px] font-medium text-[#787774] dark:text-zinc-400">
                                <span>Telah Dibayar (Collected)</span>
                                <Banknote className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div className="flex items-baseline justify-between">
                                <span className="font-mono text-base font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                                    {formatMoney(invoice.paid_amount, invoice.currency)}
                                </span>
                                <span className="text-[10px] text-[#787774] dark:text-zinc-400">
                                    {totalAmount > 0
                                        ? `${Math.round((invoice.paid_amount / totalAmount) * 100)}% lunas`
                                        : '0%'}
                                </span>
                            </div>
                        </div>

                        {/* 3. Sisa Tagihan (Outstanding) */}
                        <div className="flex h-[76px] flex-col justify-between rounded-xl border border-black/[0.07] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                            <div className="flex items-center justify-between text-[11px] font-medium text-[#787774] dark:text-zinc-400">
                                <span>Sisa Tagihan (Outstanding)</span>
                                <CalendarClock className="size-3.5 text-rose-600 dark:text-rose-400" />
                            </div>
                            <div className="flex items-baseline justify-between">
                                <span className="font-mono text-base font-bold tracking-tight text-rose-600 dark:text-rose-400">
                                    {formatMoney(invoice.outstanding_amount, invoice.currency)}
                                </span>
                                <span className="text-[10px] text-[#787774] dark:text-zinc-400">
                                    belum dilunasi
                                </span>
                            </div>
                        </div>

                        {/* 4. Status Tenggat */}
                        <div className="flex h-[76px] flex-col justify-between rounded-xl border border-black/[0.07] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                            <div className="flex items-center justify-between text-[11px] font-medium text-[#787774] dark:text-zinc-400">
                                <span>Batas Waktu Pembayaran</span>
                                <AlertCircle className="size-3.5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div className="flex items-baseline justify-between">
                                <span className={`font-mono text-xs font-bold ${isOverdue ? 'text-rose-600' : 'text-[#111111] dark:text-white'}`}>
                                    {invoice.due_at ? formatDate(invoice.due_at) : 'Tanpa Tenggat'}
                                </span>
                                <span className="text-[10px] text-[#787774] dark:text-zinc-400">
                                    {isOverdue ? 'Lewat jatuh tempo' : 'Jatuh tempo'}
                                </span>
                            </div>
                        </div>
                    </section>

                    {/* Cancellation Warning if present */}
                    {invoice.cancellation_reason && (
                        <div className="rounded-xl border border-rose-200/80 bg-[#fdebec] p-3.5 text-xs text-[#9f2f2d] dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-200">
                            <strong>Alasan Pembatalan Invoice:</strong> {invoice.cancellation_reason}
                        </div>
                    )}

                    {/* Formal Invoice Document Paper Sheet */}
                    <div className="overflow-hidden rounded-2xl border border-black/[0.08] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] sm:p-8 dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                        {/* 1. Firm Letterhead & Invoice Header */}
                        <div className="flex flex-col justify-between gap-6 border-b border-black/[0.08] pb-6 sm:flex-row dark:border-white/[0.08]">
                            {/* Firm Identity */}
                            <div className="space-y-1.5">
                                <div className="flex items-center gap-2">
                                    <div className="flex size-7 items-center justify-center rounded-lg bg-[#111111] text-white dark:bg-white dark:text-black">
                                        <Scale className="size-4" />
                                    </div>
                                    <span className="text-base font-bold tracking-tight text-[#111111] uppercase dark:text-white">
                                        RPK Law Firm &amp; Partners
                                    </span>
                                </div>
                                <p className="text-[11px] font-semibold tracking-wider text-[#787774] uppercase">
                                    Advocates &amp; Legal Consultants
                                </p>
                                <p className="max-w-sm text-xs leading-relaxed text-[#787774] dark:text-zinc-400">
                                    Menara Sudirman Lt. 18, Jl. Jend. Sudirman Kav. 52-53, Jakarta 12190
                                    <br />
                                    Tel: +62 21 520 8899 · Email: billing@raflaw.co.id
                                </p>
                            </div>

                            {/* Document Title & Reference */}
                            <div className="space-y-1 sm:text-right">
                                <div className="text-2xl font-black tracking-tight text-[#111111] uppercase dark:text-white">
                                    INVOICE
                                </div>
                                <p className="font-mono text-sm font-bold text-blue-600 dark:text-sky-400">
                                    {invoice.invoice_number}
                                </p>
                                <div className="space-y-0.5 pt-1 text-xs text-[#787774] dark:text-zinc-400">
                                    <p>
                                        Tanggal Terbit:{' '}
                                        <span className="font-mono font-semibold text-[#111111] dark:text-white">
                                            {formatDate(invoice.issued_at ?? new Date().toISOString())}
                                        </span>
                                    </p>
                                    <p>
                                        Jatuh Tempo:{' '}
                                        <span className="font-mono font-semibold text-rose-600 dark:text-rose-400">
                                            {formatDate(invoice.due_at)}
                                        </span>
                                    </p>
                                    <p>
                                        Mata Uang:{' '}
                                        <span className="font-mono font-semibold text-[#111111] dark:text-white">
                                            {invoice.currency}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* 2. Bill-To & Matter Overview Bento */}
                        <div className="grid gap-4 py-6 sm:grid-cols-2">
                            {/* Bill To */}
                            <div className="rounded-xl border border-black/[0.06] bg-[#fafafa] p-4 dark:border-white/[0.06] dark:bg-zinc-900/40">
                                <span className="text-[10px] font-bold tracking-wider text-[#787774] uppercase">
                                    Ditujukan Kepada (Billed To)
                                </span>
                                <h3 className="mt-1.5 text-sm font-bold text-[#111111] dark:text-white">
                                    {invoice.client.display_name}
                                </h3>
                                {invoice.client.legal_name && invoice.client.legal_name !== invoice.client.display_name && (
                                    <p className="text-xs italic text-[#787774] dark:text-zinc-400">
                                        {invoice.client.legal_name}
                                    </p>
                                )}
                                <div className="mt-2 space-y-1 text-xs text-[#787774] dark:text-zinc-400">
                                    {invoice.client.address_line_1 && (
                                        <p>
                                            {invoice.client.address_line_1}
                                            {invoice.client.city ? `, ${invoice.client.city}` : ''}
                                            {invoice.client.postal_code ? ` ${invoice.client.postal_code}` : ''}
                                        </p>
                                    )}
                                    {invoice.client.email && (
                                        <p className="flex items-center gap-1.5">
                                            <Mail className="size-3 text-[#787774]" /> {invoice.client.email}
                                        </p>
                                    )}
                                    {invoice.client.phone && (
                                        <p className="flex items-center gap-1.5">
                                            <Phone className="size-3 text-[#787774]" /> {invoice.client.phone}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Matter & Case Scope */}
                            <div className="rounded-xl border border-black/[0.06] bg-[#fafafa] p-4 dark:border-white/[0.06] dark:bg-zinc-900/40">
                                <span className="text-[10px] font-bold tracking-wider text-[#787774] uppercase">
                                    Referensi Perkara &amp; Layanan Hukum
                                </span>
                                <h3 className="mt-1.5 text-sm font-bold text-[#111111] dark:text-white">
                                    {invoice.title}
                                </h3>
                                {invoice.matter ? (
                                    <div className="mt-2 space-y-1.5 text-xs">
                                        <div className="flex items-center gap-1.5">
                                            <span className="font-medium text-[#787774]">No. Matter:</span>
                                            <Link
                                                href={matterRoutes.show(invoice.matter.id)}
                                                className="inline-flex items-center gap-1 font-mono font-semibold text-blue-600 hover:underline dark:text-sky-400"
                                            >
                                                <span className="rounded bg-[#e1f3fe] px-1.5 py-0.2 font-semibold text-[#1f6c9f] dark:bg-blue-950/50 dark:text-sky-300">
                                                    {invoice.matter.matter_number}
                                                </span>
                                            </Link>
                                        </div>
                                        <p className="truncate text-[#787774] dark:text-zinc-400">
                                            {invoice.matter.title}
                                        </p>
                                        {invoice.matter.responsible_partner && (
                                            <p className="text-[11px] text-[#787774] dark:text-zinc-400">
                                                Lead Partner: <span className="font-semibold text-[#111111] dark:text-white">{invoice.matter.responsible_partner.name}</span>
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <p className="mt-2 text-xs text-[#787774] dark:text-zinc-500">
                                        Layanan Hukum Umum / Retainer Advisory
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* 3. Professional Line Items Table */}
                        <div className="overflow-hidden rounded-xl border border-black/[0.08] dark:border-white/[0.08]">
                            <table className="w-full text-left text-xs">
                                <thead>
                                    <tr className="border-b border-black/[0.06] bg-[#fafafa] text-[10px] font-semibold uppercase tracking-wider text-[#787774] dark:border-white/[0.06] dark:bg-[#161618]">
                                        <th className="w-12 py-3 pl-4 pr-2 text-center">#</th>
                                        <th className="py-3 px-3">Uraian Jasa Hukum / Deliverable</th>
                                        <th className="w-20 py-3 px-3 text-center">Kuantitas</th>
                                        <th className="w-36 py-3 px-3 text-right">Tarif Satuan ({invoice.currency})</th>
                                        <th className="w-36 py-3 pl-3 pr-4 text-right">Jumlah ({invoice.currency})</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-black/[0.04] dark:divide-white/[0.05]">
                                    {invoice.line_items.map((item, idx) => (
                                        <tr key={item.id} className="transition-colors hover:bg-black/[0.01]">
                                            <td className="py-3 pl-4 pr-2 text-center font-mono text-[11px] text-[#787774]">
                                                {idx + 1}
                                            </td>
                                            <td className="py-3 px-3">
                                                <p className="font-medium text-[#111111] dark:text-white">
                                                    {item.description}
                                                </p>
                                            </td>
                                            <td className="py-3 px-3 text-center font-mono text-xs text-[#787774] dark:text-zinc-400">
                                                {item.quantity}
                                            </td>
                                            <td className="py-3 px-3 text-right font-mono text-xs text-[#787774] dark:text-zinc-400">
                                                {formatMoney(item.unit_amount, invoice.currency)}
                                            </td>
                                            <td className="py-3 pl-3 pr-4 text-right font-mono text-xs font-bold text-[#111111] dark:text-white">
                                                {formatMoney(item.total_amount, invoice.currency)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* 4. Financial Calculation Summary & Payment Details Grid */}
                        <div className="mt-6 grid gap-6 sm:grid-cols-12">
                            {/* Left: Bank Transfer Instructions */}
                            <div className="space-y-3 sm:col-span-7">
                                <div className="rounded-xl border border-black/[0.06] bg-[#fafafa] p-4 dark:border-white/[0.06] dark:bg-zinc-900/40">
                                    <div className="flex items-center justify-between border-b border-black/[0.04] pb-2 dark:border-white/[0.04]">
                                        <span className="text-[10px] font-bold tracking-wider text-[#787774] uppercase">
                                            Instruksi Pembayaran &amp; Rekening Resmi
                                        </span>
                                        <button
                                            type="button"
                                            onClick={handleCopyAccount}
                                            className="inline-flex items-center gap-1 text-[10px] font-medium text-blue-600 hover:underline dark:text-sky-400"
                                        >
                                            {copiedAccount ? (
                                                <>
                                                    <Check className="size-3" />
                                                    No. Rekening Disalin
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="size-3" />
                                                    Salin Rekening
                                                </>
                                            )}
                                        </button>
                                    </div>
                                    <div className="mt-3 space-y-1.5 text-xs">
                                        <div className="flex justify-between">
                                            <span className="text-[#787774]">Nama Bank:</span>
                                            <span className="font-semibold text-[#111111] dark:text-white">Bank Central Asia (BCA) KCU Sudirman</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[#787774]">Nomor Rekening:</span>
                                            <span className="font-mono text-sm font-bold text-blue-600 dark:text-sky-400">872-009-8811</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[#787774]">Atas Nama (Beneficiary):</span>
                                            <span className="font-semibold text-[#111111] dark:text-white">RPK LAW FIRM &amp; PARTNERS</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[#787774]">Berita Transfer:</span>
                                            <span className="font-mono text-[11px] text-[#787774]">{invoice.invoice_number}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Spelled Out Words (Terbilang) */}
                                <div className="rounded-xl border border-black/[0.06] bg-[#fafafa] p-3 text-xs dark:border-white/[0.06] dark:bg-zinc-900/40">
                                    <span className="text-[10px] font-bold tracking-wider text-[#787774] uppercase">
                                        Jumlah Terbilang:
                                    </span>
                                    <p className="mt-0.5 font-medium italic text-[#111111] dark:text-white">
                                        "{terbilang(totalAmount)} Rupiah"
                                    </p>
                                </div>
                            </div>

                            {/* Right: Totals Table */}
                            <div className="sm:col-span-5">
                                <div className="rounded-xl border border-black/[0.08] bg-[#fafafa] p-4 dark:border-white/[0.08] dark:bg-zinc-900/40">
                                    <div className="space-y-2 text-xs">
                                        <div className="flex justify-between text-[#787774] dark:text-zinc-400">
                                            <span>Subtotal Jasa:</span>
                                            <span className="font-mono text-[#111111] dark:text-white">
                                                {formatMoney(subtotal, invoice.currency)}
                                            </span>
                                        </div>

                                        {discount > 0 && (
                                            <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                                                <span>Potongan / Diskon:</span>
                                                <span className="font-mono">
                                                    - {formatMoney(discount, invoice.currency)}
                                                </span>
                                            </div>
                                        )}

                                        {taxAmount > 0 && (
                                            <div className="flex justify-between text-[#787774] dark:text-zinc-400">
                                                <span>PPN / Pajak ({invoice.tax_rate ?? 0}%):</span>
                                                <span className="font-mono text-[#111111] dark:text-white">
                                                    {formatMoney(taxAmount, invoice.currency)}
                                                </span>
                                            </div>
                                        )}

                                        <div className="border-t border-black/[0.08] pt-2 dark:border-white/[0.08]">
                                            <div className="flex items-baseline justify-between">
                                                <span className="text-xs font-bold text-[#111111] uppercase dark:text-white">
                                                    Total Tagihan:
                                                </span>
                                                <span className="font-mono text-base font-bold text-[#111111] dark:text-white">
                                                    {formatMoney(totalAmount, invoice.currency)}
                                                </span>
                                            </div>
                                        </div>

                                        {invoice.paid_amount > 0 && (
                                            <div className="border-t border-dashed border-black/[0.08] pt-2 space-y-1.5 dark:border-white/[0.08]">
                                                <div className="flex justify-between text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                                                    <span>Jumlah Telah Dibayar:</span>
                                                    <span className="font-mono">
                                                        {formatMoney(invoice.paid_amount, invoice.currency)}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-xs text-rose-600 dark:text-rose-400 font-bold">
                                                    <span>Sisa Tagihan:</span>
                                                    <span className="font-mono">
                                                        {formatMoney(invoice.outstanding_amount, invoice.currency)}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 5. Terms & Signature Block */}
                        <div className="mt-8 border-t border-black/[0.08] pt-6 dark:border-white/[0.08]">
                            <div className="grid gap-6 sm:grid-cols-12">
                                <div className="space-y-1.5 text-xs text-[#787774] sm:col-span-8 dark:text-zinc-400">
                                    <p className="font-semibold text-[#111111] dark:text-white">
                                        Ketentuan &amp; Catatan Penagihan:
                                    </p>
                                    <ul className="list-inside list-disc space-y-1 text-[11px] leading-relaxed">
                                        <li>Pembayaran dianggap sah setelah dana efektif masuk ke rekening kantor hukum.</li>
                                        <li>Harap mencantumkan nomor invoice pada berita acara transfer bank.</li>
                                        <li>Bukti transfer dapat dikirimkan melalui email ke <span className="font-medium text-[#111111] dark:text-white">billing@raflaw.co.id</span>.</li>
                                        <li>Pengeluaran perkara resmi (court fees / disbursement) dihitung berdasarkan bukti sah terlampir.</li>
                                    </ul>
                                </div>

                                <div className="text-center sm:col-span-4 sm:text-right">
                                    <p className="text-xs text-[#787774]">Jakarta, {formatDate(invoice.issued_at ?? new Date().toISOString())}</p>
                                    <p className="text-xs font-bold text-[#111111] dark:text-white">RPK Law Firm &amp; Partners</p>
                                    <div className="my-8 hidden border-b border-black/20 sm:block" />
                                    <p className="text-xs font-bold text-[#111111] dark:text-white">Managing Partner / Finance Director</p>
                                    <p className="text-[10px] text-[#787774]">Advokat &amp; Konsultan Hukum</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 6. Payment Allocations Card */}
                    <div className="rounded-xl border border-black/[0.08] bg-white p-4.5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] print:hidden dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                        <div className="flex items-center justify-between border-b border-black/[0.04] pb-2.5 dark:border-white/[0.04]">
                            <h3 className="text-xs font-bold text-[#111111] dark:text-white">
                                Riwayat Alokasi Pembayaran Masuk
                            </h3>
                            <span className="text-[10px] font-mono text-[#787774]">
                                {invoice.payment_allocations.length} Transaksi Tercatat
                            </span>
                        </div>

                        <div className="divide-y divide-black/[0.04] pt-1 dark:divide-white/[0.04]">
                            {invoice.payment_allocations.length ? (
                                invoice.payment_allocations.map((allocation) => (
                                    <div
                                        key={allocation.id}
                                        className="flex items-center justify-between py-2.5 text-xs"
                                    >
                                        <div className="space-y-0.5">
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono font-semibold text-[#111111] dark:text-white">
                                                    {formatDate(allocation.payment.received_at)}
                                                </span>
                                                <span className="rounded-md bg-emerald-50 px-1.5 py-0.2 text-[10px] font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                                                    Lunas Alokasi
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-[#787774] dark:text-zinc-400">
                                                Ref: {allocation.payment.reference_number ?? 'Transfer Bank BCA'}
                                                {allocation.payment.reversed_at ? ' · (Dikoreksi)' : ''}
                                                {allocation.payment.refunded_at ? ' · (Direfund)' : ''}
                                            </p>
                                        </div>
                                        <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                            {formatMoney(allocation.amount, invoice.currency)}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p className="py-6 text-center text-xs text-[#787774] dark:text-zinc-500">
                                    Belum ada alokasi pembayaran untuk invoice ini.
                                </p>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}

InvoiceShow.layout = {
    breadcrumbs: [{ title: 'Detail Invoice', href: financeRoutes.index() }],
};
