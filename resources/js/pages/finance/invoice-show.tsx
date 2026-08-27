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
    ExternalLink,
    FileDown,
    FileText,
    FolderKanban,
    Mail,
    Pencil,
    Phone,
    Printer,
    Receipt,
    ReceiptText,
    Scale,
    ShieldAlert,
    ShieldCheck,
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
import { EditInvoiceDialog } from './components/edit-invoice-dialog';

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

export default function InvoiceShow({
    invoice,
    clients = [],
    matters = [],
}: {
    invoice: Invoice;
    clients?: { id: string; display_name: string; legal_name?: string }[];
    matters?: {
        id: string;
        matter_number: string;
        title: string;
        client_id?: string;
    }[];
}) {
    const [copiedAccount, setCopiedAccount] = useState(false);
    const [copiedInvoiceNumber, setCopiedInvoiceNumber] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

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

    const subtotal =
        invoice.subtotal_amount ??
        invoice.line_items.reduce(
            (acc, curr) => acc + Number(curr.total_amount || 0),
            0,
        );
    const discount = invoice.discount_amount ?? 0;
    const taxAmount = invoice.tax_amount ?? 0;
    const totalAmount = invoice.total_amount;

    return (
        <>
            <Head
                title={`Invoice ${invoice.invoice_number} - ${invoice.client.display_name}`}
            />

            <div className="min-h-screen bg-[#fafafc] pb-20 dark:bg-[#0c0d10] print:bg-white print:p-0">
                <main className="mx-auto max-w-5xl space-y-5 px-4 py-5 sm:px-6 lg:px-8 print:max-w-none print:px-0 print:py-0">
                    {/* 1. Header Toolbar */}
                    <div className="flex flex-col justify-between gap-4 border-b border-slate-200/60 pb-4 sm:flex-row sm:items-center dark:border-white/[0.06] print:hidden">
                        <div className="space-y-1">
                            <Link
                                href={financeRoutes.index.url()}
                                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 transition-colors hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white"
                            >
                                <ArrowLeft className="size-3" />
                                Kembali ke Keuangan
                            </Link>

                            <div className="flex flex-wrap items-center gap-2 pt-0.5">
                                <h1 className="font-mono text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    {invoice.invoice_number}
                                </h1>
                                <button
                                    type="button"
                                    onClick={handleCopyInvoiceNumber}
                                    title="Salin Nomor Invoice"
                                    className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-700 shadow-2xs transition-colors hover:bg-slate-50 dark:border-white/10 dark:bg-[#14161b] dark:text-zinc-300"
                                >
                                    {copiedInvoiceNumber ? (
                                        <>
                                            <Check className="size-2.5 text-emerald-600" />
                                            Tersalin
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="size-2.5 text-slate-400" />
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
                                size="sm"
                                onClick={() => setIsEditDialogOpen(true)}
                                className="h-8 rounded-lg border-blue-200 bg-blue-50/50 px-3 text-xs font-semibold text-blue-700 shadow-2xs hover:bg-blue-100 dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-300 dark:hover:bg-blue-900/60"
                            >
                                <Pencil className="mr-1 size-3 text-blue-600 dark:text-blue-400" />
                                Edit Invoice
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 rounded-lg border-slate-200/70 bg-white px-3 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-white/10 dark:bg-[#14161b] dark:text-zinc-200"
                                asChild
                            >
                                <a
                                    href={`/verify/invoice/${invoice.invoice_number}`}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <ShieldCheck className="mr-1 size-3.5 text-emerald-600 dark:text-emerald-400" />
                                    Verifikasi Publik
                                    <ExternalLink className="ml-1 size-2.5 text-slate-400" />
                                </a>
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handlePrint}
                                className="h-8 rounded-lg border-slate-200/70 bg-white px-3 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-white/10 dark:bg-[#14161b] dark:text-zinc-200"
                            >
                                <Printer className="mr-1 size-3 text-slate-500" />
                                Cetak
                            </Button>
                            <Button
                                size="sm"
                                className="h-8 rounded-lg bg-slate-900 px-3.5 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 active:scale-95 dark:bg-white dark:text-slate-900"
                                asChild
                            >
                                <a
                                    href={invoiceRoutes.pdf.url(invoice.id)}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <Download className="mr-1 size-3" />
                                    Download PDF
                                </a>
                            </Button>
                        </div>
                    </div>

                    <EditInvoiceDialog
                        open={isEditDialogOpen}
                        onOpenChange={setIsEditDialogOpen}
                        invoice={invoice as any}
                        clients={clients}
                        matters={matters}
                    />

                    {/* 2. Top 4 KPI Metrics Bento Cards */}
                    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 print:hidden">
                        {/* 1. Total Tagihan */}
                        <div className="group rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[11px] font-semibold">
                                    TOTAL TAGIHAN
                                </span>
                                <Receipt className="size-3.5 text-slate-400 dark:text-zinc-500" />
                            </div>
                            <div className="mt-2 flex items-baseline justify-between">
                                <span className="font-mono text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    {formatMoney(totalAmount, invoice.currency)}
                                </span>
                            </div>
                            <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-500 dark:border-white/[0.04]">
                                <span>Termasuk Pajak</span>
                                <span className="font-semibold text-blue-600 dark:text-blue-400">
                                    Bruto
                                </span>
                            </div>
                        </div>

                        {/* 2. Telah Dibayar */}
                        <div className="group rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[11px] font-semibold">
                                    TELAH DIBAYAR
                                </span>
                                <Banknote className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div className="mt-2 flex items-baseline justify-between">
                                <span className="font-mono text-xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                                    {formatMoney(
                                        invoice.paid_amount,
                                        invoice.currency,
                                    )}
                                </span>
                            </div>
                            <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-500 dark:border-white/[0.04]">
                                <span>Persentase</span>
                                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                    {totalAmount > 0
                                        ? `${Math.round((invoice.paid_amount / totalAmount) * 100)}% Lunas`
                                        : '0% Lunas'}
                                </span>
                            </div>
                        </div>

                        {/* 3. Sisa Tagihan (Outstanding) */}
                        <div className="group rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[11px] font-semibold">
                                    SISA TAGIHAN
                                </span>
                                <CalendarClock className="size-3.5 text-rose-500 dark:text-rose-400" />
                            </div>
                            <div className="mt-2 flex items-baseline justify-between">
                                <span className="font-mono text-xl font-bold tracking-tight text-rose-600 dark:text-rose-400">
                                    {formatMoney(
                                        invoice.outstanding_amount,
                                        invoice.currency,
                                    )}
                                </span>
                            </div>
                            <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-500 dark:border-white/[0.04]">
                                <span>Status</span>
                                <span className="font-semibold text-rose-600 dark:text-rose-400">
                                    {invoice.outstanding_amount === 0
                                        ? 'LUNAS'
                                        : 'Belum Lunas'}
                                </span>
                            </div>
                        </div>

                        {/* 4. Status Tenggat */}
                        <div className="group rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[11px] font-semibold">
                                    JATUH TEMPO
                                </span>
                                <AlertCircle className="size-3.5 text-slate-400 dark:text-zinc-500" />
                            </div>
                            <div className="mt-2 flex items-baseline justify-between">
                                <span
                                    className={`font-mono text-base font-bold ${isOverdue ? 'text-rose-600' : 'text-slate-900 dark:text-white'}`}
                                >
                                    {invoice.due_at
                                        ? formatDate(invoice.due_at)
                                        : 'Tanpa Tenggat'}
                                </span>
                            </div>
                            <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-500 dark:border-white/[0.04]">
                                <span>Kondisi</span>
                                <span
                                    className={`font-semibold ${isOverdue ? 'text-rose-600' : 'text-slate-700 dark:text-zinc-300'}`}
                                >
                                    {isOverdue ? 'Lewat Tenggat' : 'Normal'}
                                </span>
                            </div>
                        </div>
                    </section>

                    {/* Cancellation Warning if present */}
                    {invoice.cancellation_reason && (
                        <div className="rounded-xl border border-rose-200 bg-rose-50/80 p-3.5 text-xs font-medium text-rose-900 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-200">
                            <strong className="font-semibold">
                                Alasan Pembatalan:
                            </strong>{' '}
                            {invoice.cancellation_reason}
                        </div>
                    )}

                    {/* 3. Formal Invoice Document Paper Sheet */}
                    <div className="overflow-hidden rounded-xl border border-slate-200/70 bg-white p-6 shadow-2xs sm:p-8 dark:border-white/[0.06] dark:bg-[#14161b]">
                        {/* 1. Firm Letterhead & Invoice Header */}
                        <div className="flex flex-col justify-between gap-6 border-b border-slate-100 pb-6 sm:flex-row dark:border-white/[0.04]">
                            {/* Firm Identity */}
                            <div className="space-y-1.5">
                                <div className="flex items-center gap-2">
                                    <div className="flex size-7 items-center justify-center rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                                        <Scale className="size-4" />
                                    </div>
                                    <span className="text-base font-bold tracking-tight text-slate-900 uppercase dark:text-white">
                                        RPK Law Firm &amp; Partners
                                    </span>
                                </div>
                                <p className="text-[10.5px] font-semibold text-slate-500 uppercase">
                                    Advocates &amp; Legal Consultants
                                </p>
                                <p className="max-w-sm text-xs leading-relaxed text-slate-500 dark:text-zinc-400">
                                    Jl. Bukit Nirwana VII, Blok CC.04, Sariwangi
                                    <br />
                                    Kabupaten Bandung Barat, Jawa Barat
                                    <br />
                                    Telp: 0852 9560 1417 · Email:
                                    contact@rpklawoffice.com
                                </p>
                            </div>

                            {/* Document Title & Reference */}
                            <div className="space-y-1 sm:text-right">
                                <div className="text-2xl font-bold tracking-tight text-slate-900 uppercase dark:text-white">
                                    INVOICE
                                </div>
                                <p className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                                    {invoice.invoice_number}
                                </p>
                                <div className="space-y-0.5 pt-1 text-xs text-slate-500 dark:text-zinc-400">
                                    <p>
                                        Tanggal Terbit:{' '}
                                        <span className="font-mono font-semibold text-slate-900 dark:text-white">
                                            {formatDate(
                                                invoice.issued_at ??
                                                    new Date().toISOString(),
                                            )}
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
                                        <span className="font-mono font-semibold text-slate-900 dark:text-white">
                                            {invoice.currency}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* 2. Bill-To & Matter Overview Bento */}
                        <div className="grid gap-3 py-6 sm:grid-cols-2">
                            {/* Bill To */}
                            <div className="rounded-lg border border-slate-200/70 bg-slate-50/60 p-4 dark:border-white/[0.04] dark:bg-[#121418]">
                                <span className="text-[10px] font-semibold text-slate-500 uppercase dark:text-zinc-400">
                                    DITUJUKAN KEPADA (BILLED TO)
                                </span>
                                <h3 className="mt-1.5 text-xs font-bold text-slate-900 dark:text-white">
                                    {invoice.client.display_name}
                                </h3>
                                {invoice.client.legal_name &&
                                    invoice.client.legal_name !==
                                        invoice.client.display_name && (
                                        <p className="text-[11px] text-slate-500 italic dark:text-zinc-400">
                                            {invoice.client.legal_name}
                                        </p>
                                    )}
                                <div className="mt-2 space-y-1 text-xs text-slate-600 dark:text-zinc-400">
                                    {invoice.client.address_line_1 && (
                                        <p>
                                            {invoice.client.address_line_1}
                                            {invoice.client.city
                                                ? `, ${invoice.client.city}`
                                                : ''}
                                            {invoice.client.postal_code
                                                ? ` ${invoice.client.postal_code}`
                                                : ''}
                                        </p>
                                    )}
                                    {invoice.client.email && (
                                        <p className="flex items-center gap-1">
                                            <Mail className="size-3 text-slate-400" />{' '}
                                            {invoice.client.email}
                                        </p>
                                    )}
                                    {invoice.client.phone && (
                                        <p className="flex items-center gap-1">
                                            <Phone className="size-3 text-slate-400" />{' '}
                                            {invoice.client.phone}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Matter & Case Scope */}
                            <div className="rounded-lg border border-slate-200/70 bg-slate-50/60 p-4 dark:border-white/[0.04] dark:bg-[#121418]">
                                <span className="text-[10px] font-semibold text-slate-500 uppercase dark:text-zinc-400">
                                    REFERENSI PERKARA &amp; LAYANAN HUKUM
                                </span>
                                <h3 className="mt-1.5 text-xs font-bold text-slate-900 dark:text-white">
                                    {invoice.title}
                                </h3>
                                {invoice.matter ? (
                                    <div className="mt-2 space-y-1.5 text-xs">
                                        <div className="flex items-center gap-1.5">
                                            <span className="font-medium text-slate-500">
                                                Perkara:
                                            </span>
                                            <Link
                                                href={matterRoutes.show.url(
                                                    invoice.matter.id,
                                                )}
                                                className="inline-flex items-center gap-1 font-mono font-semibold text-blue-600 hover:underline dark:text-blue-400"
                                            >
                                                <span className="py-0.2 rounded bg-blue-50 px-1.5 font-semibold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                                                    {
                                                        invoice.matter
                                                            .matter_number
                                                    }
                                                </span>
                                            </Link>
                                        </div>
                                        <p className="truncate text-slate-600 dark:text-zinc-400">
                                            {invoice.matter.title}
                                        </p>
                                        {invoice.matter.responsible_partner && (
                                            <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                                                Lead Partner:{' '}
                                                <span className="font-semibold text-slate-900 dark:text-white">
                                                    {
                                                        invoice.matter
                                                            .responsible_partner
                                                            .name
                                                    }
                                                </span>
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <p className="mt-2 text-xs text-slate-500 dark:text-zinc-400">
                                        Layanan Penasehat Hukum Umum / Retainer
                                        Advisory
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* 3. Line Items Table */}
                        <div className="overflow-hidden rounded-lg border border-slate-200/70 dark:border-white/[0.06]">
                            <table className="w-full text-left text-xs">
                                <thead>
                                    <tr className="border-b border-slate-100 bg-slate-50/60 text-[10px] font-semibold text-slate-500 uppercase dark:border-white/[0.04] dark:bg-[#121418]">
                                        <th className="w-10 py-2.5 pr-2 pl-3 text-center">
                                            #
                                        </th>
                                        <th className="px-3 py-2.5">
                                            Uraian Jasa Hukum / Deliverable
                                        </th>
                                        <th className="w-20 px-3 py-2.5 text-center">
                                            Qty
                                        </th>
                                        <th className="w-36 px-3 py-2.5 text-right">
                                            Tarif Satuan ({invoice.currency})
                                        </th>
                                        <th className="w-36 py-2.5 pr-3 pl-3 text-right">
                                            Jumlah ({invoice.currency})
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                                    {invoice.line_items.map((item, idx) => (
                                        <tr
                                            key={item.id}
                                            className="transition-colors hover:bg-slate-50/50 dark:hover:bg-white/[0.02]"
                                        >
                                            <td className="py-2.5 pr-2 pl-3 text-center font-mono text-[10px] text-slate-400">
                                                {idx + 1}
                                            </td>
                                            <td className="px-3 py-2.5">
                                                <p className="font-semibold text-slate-900 dark:text-white">
                                                    {item.description}
                                                </p>
                                            </td>
                                            <td className="px-3 py-2.5 text-center font-mono text-xs text-slate-600 dark:text-zinc-400">
                                                {item.quantity}
                                            </td>
                                            <td className="px-3 py-2.5 text-right font-mono text-xs text-slate-600 dark:text-zinc-400">
                                                {formatMoney(
                                                    item.unit_amount,
                                                    invoice.currency,
                                                )}
                                            </td>
                                            <td className="py-2.5 pr-3 pl-3 text-right font-mono text-xs font-bold text-slate-900 dark:text-white">
                                                {formatMoney(
                                                    item.total_amount,
                                                    invoice.currency,
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* 4. Financial Calculation Summary & Payment Details Grid */}
                        <div className="mt-6 grid gap-4 sm:grid-cols-12">
                            {/* Left: Bank Transfer Instructions */}
                            <div className="space-y-3 sm:col-span-7">
                                <div className="rounded-lg border border-slate-200/70 bg-slate-50/60 p-4 dark:border-white/[0.04] dark:bg-[#121418]">
                                    <div className="flex items-center justify-between border-b border-slate-200/50 pb-2 dark:border-white/[0.04]">
                                        <span className="text-[10px] font-semibold text-slate-500 uppercase dark:text-zinc-400">
                                            INSTRUKSI PEMBAYARAN REKENING RESMI
                                        </span>
                                        <button
                                            type="button"
                                            onClick={handleCopyAccount}
                                            className="inline-flex cursor-pointer items-center gap-1 text-[10px] font-semibold text-blue-600 hover:underline dark:text-blue-400"
                                        >
                                            {copiedAccount ? (
                                                <>
                                                    <Check className="size-2.5 text-emerald-600" />
                                                    Disalin
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="size-2.5" />
                                                    Salin Rekening
                                                </>
                                            )}
                                        </button>
                                    </div>
                                    <div className="mt-2.5 space-y-1.5 text-xs">
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">
                                                Bank:
                                            </span>
                                            <span className="font-semibold text-slate-900 dark:text-white">
                                                Bank Central Asia (BCA) KCU
                                                Sudirman
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">
                                                No. Rekening:
                                            </span>
                                            <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                                                872-009-8811
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">
                                                Atas Nama:
                                            </span>
                                            <span className="font-semibold text-slate-900 dark:text-white">
                                                RPK LAW FIRM &amp; PARTNERS
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">
                                                Berita Acara:
                                            </span>
                                            <span className="font-mono text-xs font-semibold text-slate-700 dark:text-zinc-300">
                                                {invoice.invoice_number}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Spelled Out Words (Terbilang) */}
                                <div className="rounded-lg border border-slate-200/70 bg-slate-50/60 p-3 text-xs dark:border-white/[0.04] dark:bg-[#121418]">
                                    <span className="text-[10px] font-semibold text-slate-500 uppercase dark:text-zinc-400">
                                        JUMLAH TERBILANG:
                                    </span>
                                    <p className="mt-0.5 font-medium text-slate-900 italic dark:text-white">
                                        "{terbilang(totalAmount)} Rupiah"
                                    </p>
                                </div>
                            </div>

                            {/* Right: Totals Table */}
                            <div className="sm:col-span-5">
                                <div className="rounded-lg border border-slate-200/70 bg-slate-50/60 p-4 dark:border-white/[0.04] dark:bg-[#121418]">
                                    <div className="space-y-2 text-xs">
                                        <div className="flex justify-between text-slate-600 dark:text-zinc-400">
                                            <span>Subtotal Jasa:</span>
                                            <span className="font-mono font-semibold text-slate-900 dark:text-white">
                                                {formatMoney(
                                                    subtotal,
                                                    invoice.currency,
                                                )}
                                            </span>
                                        </div>

                                        {discount > 0 && (
                                            <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                                                <span>Potongan / Diskon:</span>
                                                <span className="font-mono font-semibold">
                                                    -{' '}
                                                    {formatMoney(
                                                        discount,
                                                        invoice.currency,
                                                    )}
                                                </span>
                                            </div>
                                        )}

                                        {taxAmount > 0 && (
                                            <div className="flex justify-between text-slate-600 dark:text-zinc-400">
                                                <span>
                                                    PPN ({invoice.tax_rate ?? 0}
                                                    %):
                                                </span>
                                                <span className="font-mono font-semibold text-slate-900 dark:text-white">
                                                    {formatMoney(
                                                        taxAmount,
                                                        invoice.currency,
                                                    )}
                                                </span>
                                            </div>
                                        )}

                                        <div className="border-t border-slate-200 pt-2 dark:border-white/[0.06]">
                                            <div className="flex items-baseline justify-between">
                                                <span className="text-xs font-bold text-slate-900 uppercase dark:text-white">
                                                    Total Tagihan:
                                                </span>
                                                <span className="font-mono text-base font-bold text-slate-900 dark:text-white">
                                                    {formatMoney(
                                                        totalAmount,
                                                        invoice.currency,
                                                    )}
                                                </span>
                                            </div>
                                        </div>

                                        {invoice.paid_amount > 0 && (
                                            <div className="space-y-1.5 border-t border-dashed border-slate-200 pt-2 dark:border-white/[0.06]">
                                                <div className="flex justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                                    <span>Telah Dibayar:</span>
                                                    <span className="font-mono">
                                                        {formatMoney(
                                                            invoice.paid_amount,
                                                            invoice.currency,
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-xs font-bold text-rose-600 dark:text-rose-400">
                                                    <span>Sisa Tagihan:</span>
                                                    <span className="font-mono text-sm">
                                                        {formatMoney(
                                                            invoice.outstanding_amount,
                                                            invoice.currency,
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 5. Terms, QR Code & Signature Block */}
                        <div className="mt-8 border-t border-slate-100 pt-6 dark:border-white/[0.04]">
                            <div className="grid gap-4 sm:grid-cols-12 items-center">
                                <div className="space-y-1.5 text-xs text-slate-500 sm:col-span-5 dark:text-zinc-400">
                                    <p className="font-semibold text-slate-900 dark:text-white">
                                        Ketentuan &amp; Catatan Penagihan:
                                    </p>
                                    <ul className="list-inside list-disc space-y-0.5 text-[11px] leading-relaxed">
                                        <li>
                                            Pembayaran dianggap sah setelah dana
                                            efektif masuk ke rekening kantor
                                            hukum RPK.
                                        </li>
                                        <li>
                                            Harap mencantumkan nomor invoice
                                            pada berita acara transfer bank.
                                        </li>
                                        <li>
                                            Bukti transfer dapat dikirimkan ke
                                            email{' '}
                                            <span className="font-semibold text-slate-900 dark:text-white">
                                                contact@rpklawoffice.com
                                            </span>
                                            .
                                        </li>
                                    </ul>
                                </div>

                                <div className="flex items-center gap-2.5 rounded-lg border border-slate-200/80 bg-slate-50/70 p-2 sm:col-span-3 dark:border-white/10 dark:bg-[#121418]">
                                    <img
                                        src={`/verify/invoice/${invoice.invoice_number}/qr.svg`}
                                        alt="QR Verifikasi"
                                        className="size-12 rounded border border-slate-200 bg-white p-0.5 dark:border-white/10"
                                    />
                                    <div className="min-w-0 space-y-0.5">
                                        <p className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                                            QR Verifikasi
                                        </p>
                                        <p className="text-[9px] text-slate-500 dark:text-zinc-400 leading-tight">
                                            Pindai keaslian tagihan
                                        </p>
                                        <a
                                            href={`/verify/invoice/${invoice.invoice_number}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-0.5 font-mono text-[8.5px] font-semibold text-blue-600 hover:underline dark:text-blue-400"
                                        >
                                            Verifikasi
                                            <ExternalLink className="size-2" />
                                        </a>
                                    </div>
                                </div>

                                <div className="text-center sm:col-span-4 sm:text-right">
                                    <p className="text-[11px] text-slate-500">
                                        Bandung,{' '}
                                        {formatDate(
                                            invoice.issued_at ??
                                                new Date().toISOString(),
                                        )}
                                    </p>
                                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                                        RPK Law Firm &amp; Partners
                                    </p>
                                    <div className="my-5 hidden border-b border-slate-200 sm:block dark:border-white/10" />
                                    <p className="text-xs font-semibold text-slate-900 dark:text-white">
                                        Managing Partner / Finance Director
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 6. Payment Allocations Card */}
                    <div className="rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b] print:hidden">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-white/[0.04]">
                            <div className="flex items-center gap-2">
                                <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                                    <Banknote className="size-3.5" />
                                </div>
                                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                                    Riwayat Alokasi Pembayaran Masuk
                                </h3>
                            </div>
                            <span className="py-0.2 rounded bg-slate-100 px-1.5 font-mono text-[10px] font-semibold text-slate-600 dark:bg-zinc-800 dark:text-zinc-400">
                                {invoice.payment_allocations.length} Transaksi
                            </span>
                        </div>

                        <div className="divide-y divide-slate-100 pt-1 dark:divide-white/[0.04]">
                            {invoice.payment_allocations.length ? (
                                invoice.payment_allocations.map(
                                    (allocation) => (
                                        <div
                                            key={allocation.id}
                                            className="flex items-center justify-between py-2.5 text-xs"
                                        >
                                            <div className="space-y-0.5">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono font-semibold text-slate-900 dark:text-white">
                                                        {formatDate(
                                                            allocation.payment
                                                                .received_at,
                                                        )}
                                                    </span>
                                                    <span className="py-0.2 rounded bg-emerald-50 px-1.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                                                        Lunas Alokasi
                                                    </span>
                                                </div>
                                                <p className="text-[10px] text-slate-500 dark:text-zinc-400">
                                                    Ref:{' '}
                                                    {allocation.payment
                                                        .reference_number ??
                                                        'Transfer Bank BCA'}
                                                    {allocation.payment
                                                        .reversed_at
                                                        ? ' · (Dikoreksi)'
                                                        : ''}
                                                    {allocation.payment
                                                        .refunded_at
                                                        ? ' · (Direfund)'
                                                        : ''}
                                                </p>
                                            </div>
                                            <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                                {formatMoney(
                                                    allocation.amount,
                                                    invoice.currency,
                                                )}
                                            </span>
                                        </div>
                                    ),
                                )
                            ) : (
                                <p className="py-6 text-center text-xs font-medium text-slate-400 dark:text-zinc-500">
                                    Belum ada alokasi pembayaran untuk invoice
                                    ini.
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
    breadcrumbs: [{ title: 'Detail Invoice', href: financeRoutes.index.url() }],
};
