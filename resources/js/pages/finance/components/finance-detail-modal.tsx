import { Link } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowLeftRight,
    Banknote,
    Building2,
    Calendar,
    Check,
    CheckCircle2,
    ChevronRight,
    Clock,
    Copy,
    CreditCard,
    DollarSign,
    Download,
    ExternalLink,
    FileDown,
    FileImage,
    FilePlus2,
    FileText,
    FolderKanban,
    HandCoins,
    HardDrive,
    Lock,
    Paperclip,
    Pencil,
    Receipt,
    ReceiptText,
    Shield,
    Trash2,
    Undo2,
    UploadCloud,
    User,
    WalletCards,
    X,
} from 'lucide-react';
import { useState } from 'react';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { formatBytes, formatDate, formatMoney, terbilang } from '@/lib/format';
import * as invoiceRoutes from '@/routes/finance/invoices';
import * as paymentRoutes from '@/routes/finance/payments';
import type { FinanceEntityProofTarget, ProofDocumentData } from './finance-proof-dialog';

export type FinanceDetailTarget = {
    id: string;
    entity: 'expenses' | 'payments' | 'invoices' | 'quotations' | 'payrolls' | 'partner-transactions' | 'transfers' | 'client-trust-funds';
    reference_number?: string;
    title: string;
    subtitle?: string;
    category?: string;
    charge_to?: string;
    status: string;
    amount: number;
    currency: string;
    date?: string;
    due_date?: string;
    matter?: { id: string; matter_number: string; title: string };
    client?: { id?: string; display_name: string };
    account?: { id: string; name: string };
    partner?: { id: number; name: string };
    vendor?: string;
    description?: string;
    notes?: string;
    method?: string;
    allocations?: {
        id: string;
        amount: number;
        invoice: {
            id?: string;
            invoice_number: string;
            outstanding_amount?: number;
            currency: string;
            title?: string;
        };
    }[];
    proof_document?: ProofDocumentData | null;
    proofDocument?: ProofDocumentData | null;
    rawItem?: any;
};

type Props = {
    target: FinanceDetailTarget | null;
    isOpen: boolean;
    onClose: () => void;
    onEdit?: (item: any) => void;
    onDelete?: (item: any) => void;
    onOpenProof?: (proofTarget: FinanceEntityProofTarget) => void;
};

export function FinanceDetailModal({
    target,
    isOpen,
    onClose,
    onEdit,
    onDelete,
    onOpenProof,
}: Props) {
    const [copied, setCopied] = useState(false);
    const [activeTab, setActiveTab] = useState<'overview' | 'proof'>('overview');

    if (!target) return null;

    const proofDoc = target.proof_document || target.proofDocument;
    const version = proofDoc?.current_version || proofDoc?.currentVersion;
    const hasProof = Boolean(proofDoc && version);
    const mimeType = version?.mime_type || '';
    const isImage = mimeType.startsWith('image/');
    const isPdf = mimeType === 'application/pdf' || mimeType.includes('pdf');
    const previewUrl = hasProof && version
        ? `/documents/${proofDoc!.id}/versions/${version.id}/preview`
        : '';
    const downloadUrl = hasProof && version
        ? `/documents/${proofDoc!.id}/versions/${version.id}/download`
        : '';

    const handleCopyRef = () => {
        if (!target.reference_number) return;
        navigator.clipboard.writeText(target.reference_number);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const entityConfigs: Record<string, {
        label: string;
        icon: typeof Receipt;
        color: string;
        bg: string;
        badgeBg: string;
        amountLabel: string;
        isCredit: boolean;
    }> = {
        invoices: {
            label: 'Invoice Tagihan',
            icon: ReceiptText,
            color: 'text-blue-600 dark:text-blue-400',
            bg: 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400',
            badgeBg: 'bg-blue-50/80 border-blue-200/60 text-blue-700 dark:bg-blue-950/40 dark:border-blue-800/40 dark:text-blue-300',
            amountLabel: 'Total Tagihan Piutang',
            isCredit: true,
        },
        quotations: {
            label: 'Quotation Honorarium',
            icon: FilePlus2,
            color: 'text-slate-600 dark:text-slate-300',
            bg: 'bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300',
            badgeBg: 'bg-slate-100/80 border-slate-200/60 text-slate-700 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300',
            amountLabel: 'Estimasi Nilai Penawaran',
            isCredit: true,
        },
        expenses: {
            label: 'Beban Biaya Perkara / Operasional',
            icon: WalletCards,
            color: 'text-rose-600 dark:text-rose-400',
            bg: 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400',
            badgeBg: 'bg-rose-50/80 border-rose-200/60 text-rose-700 dark:bg-rose-950/40 dark:border-rose-800/40 dark:text-rose-300',
            amountLabel: 'Nominal Beban Pengeluaran',
            isCredit: false,
        },
        payments: {
            label: 'Penerimaan Kas Masuk',
            icon: Banknote,
            color: 'text-emerald-600 dark:text-emerald-400',
            bg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400',
            badgeBg: 'bg-emerald-50/80 border-emerald-200/60 text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-800/40 dark:text-emerald-300',
            amountLabel: 'Nominal Kas Diterima',
            isCredit: true,
        },
        payrolls: {
            label: 'Slip Gaji / Honorarium Pegawai',
            icon: Receipt,
            color: 'text-indigo-600 dark:text-indigo-400',
            bg: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400',
            badgeBg: 'bg-indigo-50/80 border-indigo-200/60 text-indigo-700 dark:bg-indigo-950/40 dark:border-indigo-800/40 dark:text-indigo-300',
            amountLabel: 'Take Home Pay (Penghasilan Bersih)',
            isCredit: false,
        },
        'partner-transactions': {
            label: 'Transaksi & Talangan Partner',
            icon: HandCoins,
            color: 'text-amber-600 dark:text-amber-400',
            bg: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400',
            badgeBg: 'bg-amber-50/80 border-amber-200/60 text-amber-700 dark:bg-amber-950/40 dark:border-amber-800/40 dark:text-amber-300',
            amountLabel: 'Nominal Transaksi Partner',
            isCredit: false,
        },
        transfers: {
            label: 'Mutasi Antar Kas & Bank',
            icon: ArrowLeftRight,
            color: 'text-purple-600 dark:text-purple-400',
            bg: 'bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400',
            badgeBg: 'bg-purple-50/80 border-purple-200/60 text-purple-700 dark:bg-purple-950/40 dark:border-purple-800/40 dark:text-purple-300',
            amountLabel: 'Nominal Pemindahan Dana',
            isCredit: true,
        },
        'client-trust-funds': {
            label: 'Dana Titipan Klien (Escrow)',
            icon: Lock,
            color: 'text-cyan-600 dark:text-cyan-400',
            bg: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400',
            badgeBg: 'bg-cyan-50/80 border-cyan-200/60 text-cyan-700 dark:bg-cyan-950/40 dark:border-cyan-800/40 dark:text-cyan-300',
            amountLabel: 'Nominal Mutasi Titipan',
            isCredit: true,
        },
    };

    const cfg = entityConfigs[target.entity] || {
        label: 'Transaksi Keuangan',
        icon: Receipt,
        color: 'text-slate-600 dark:text-slate-400',
        bg: 'bg-slate-100 dark:bg-zinc-800',
        badgeBg: 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300',
        amountLabel: 'Nominal Transaksi',
        isCredit: true,
    };

    const IconComp = cfg.icon;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-h-[92vh] flex flex-col p-0 gap-0 overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xl sm:max-w-2xl dark:border-white/10 dark:bg-[#14161b]">
                {/* 1. Header Bar */}
                <DialogHeader className="border-b border-slate-100 px-5 py-3.5 dark:border-white/[0.06] bg-slate-50/40 dark:bg-[#16181f]/40">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0 flex-1">
                            <div className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${cfg.bg}`}>
                                <IconComp className="size-4.5" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-1.5 mb-1">
                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${cfg.badgeBg}`}>
                                        {cfg.label}
                                    </span>
                                    {target.status && <StatusBadge value={target.status} />}
                                    {hasProof && (
                                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/70 dark:bg-emerald-950/40 dark:text-emerald-300">
                                            <Paperclip className="size-2.5 text-emerald-600" />
                                            Bukti Ada
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <DialogTitle className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                                        {target.reference_number || target.title}
                                    </DialogTitle>
                                    {target.reference_number && (
                                        <button
                                            type="button"
                                            onClick={handleCopyRef}
                                            className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium text-slate-500 hover:bg-slate-200/60 dark:text-zinc-400 dark:hover:bg-white/10"
                                            title="Salin Nomor Referensi"
                                        >
                                            {copied ? (
                                                <>
                                                    <Check className="size-3 text-emerald-600 dark:text-emerald-400" />
                                                    <span className="text-emerald-600 dark:text-emerald-400">Tersalin</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="size-3" />
                                                    <span>Salin</span>
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                                {target.subtitle && (
                                    <DialogDescription className="mt-0.5 text-xs text-slate-500 dark:text-zinc-400 truncate">
                                        {target.subtitle}
                                    </DialogDescription>
                                )}
                            </div>
                        </div>
                    </div>
                </DialogHeader>

                {/* 2. Hero Amount Strip */}
                <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50/80 via-white to-slate-50/40 px-5 py-3.5 dark:border-white/[0.06] dark:from-[#181a22] dark:via-[#14161b] dark:to-[#16181f]">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase dark:text-zinc-500">
                                {cfg.amountLabel}
                            </span>
                            <div className="flex items-baseline gap-2 mt-0.5">
                                <span className={`font-mono text-xl sm:text-2xl font-extrabold tracking-tight ${cfg.color}`}>
                                    {formatMoney(target.amount, target.currency || 'IDR')}
                                </span>
                            </div>
                            <p className="text-[10.5px] text-slate-400 dark:text-zinc-500 italic mt-0.5">
                                {target.amount > 0 ? `${terbilang(target.amount)} Rupiah` : 'Nol Rupiah'}
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5 sm:flex-col sm:items-end sm:gap-1 text-[11px]">
                            {target.date && (
                                <div className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/80 bg-white px-2.5 py-1 font-medium text-slate-700 shadow-2xs dark:border-white/10 dark:bg-[#121418] dark:text-zinc-300">
                                    <Calendar className="size-3 text-slate-400" />
                                    <span>Tgl: {formatDate(target.date)}</span>
                                </div>
                            )}
                            {target.due_date && (
                                <div className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200/80 bg-amber-50/70 px-2.5 py-1 font-medium text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-300">
                                    <Clock className="size-3 text-amber-600" />
                                    <span>Tempo: {formatDate(target.due_date)}</span>
                                </div>
                            )}
                            {target.account && (
                                <div className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/80 bg-white px-2.5 py-1 font-medium text-slate-700 shadow-2xs dark:border-white/10 dark:bg-[#121418] dark:text-zinc-300">
                                    <Building2 className="size-3 text-blue-500" />
                                    <span>{target.account.name}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 3. Navigation Tabs */}
                <div className="flex items-center border-b border-slate-100 px-5 pt-2 dark:border-white/[0.06] bg-slate-50/30 dark:bg-white/[0.02]">
                    <button
                        type="button"
                        onClick={() => setActiveTab('overview')}
                        className={`inline-flex items-center gap-1.5 border-b-2 px-3 py-2 text-xs font-semibold transition-all ${
                            activeTab === 'overview'
                                ? 'border-slate-900 text-slate-900 dark:border-white dark:text-white'
                                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200'
                        }`}
                    >
                        <FileText className="size-3.5" />
                        Rincian &amp; Alokasi
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('proof')}
                        className={`inline-flex items-center gap-1.5 border-b-2 px-3 py-2 text-xs font-semibold transition-all ${
                            activeTab === 'proof'
                                ? 'border-slate-900 text-slate-900 dark:border-white dark:text-white'
                                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200'
                        }`}
                    >
                        <Paperclip className="size-3.5" />
                        Dokumen Bukti {hasProof ? '(1)' : '(Belum Ada)'}
                    </button>
                </div>

                {/* 4. Tab Body Content */}
                <div className="p-5 overflow-y-auto flex-1 max-h-[50vh] text-xs">
                    {activeTab === 'overview' && (
                        <div className="space-y-4">
                            {/* 2-Column Info Grid */}
                            <div className="grid gap-3 sm:grid-cols-2">
                                {/* Left Card: Matter & Entity Info */}
                                <div className="space-y-2.5 rounded-xl border border-slate-200/80 bg-slate-50/40 p-3 dark:border-white/[0.06] dark:bg-[#16181f]">
                                    <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase dark:text-zinc-500">
                                        Informasi Perkara &amp; Klien
                                    </span>
                                    {target.matter ? (
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-slate-900 dark:text-white">
                                                <FolderKanban className="size-3.5 text-indigo-500" />
                                                <span>{target.matter.matter_number}</span>
                                            </div>
                                            <p className="text-xs font-semibold text-slate-800 dark:text-zinc-200">
                                                {target.matter.title}
                                            </p>
                                        </div>
                                    ) : (
                                        <p className="text-xs text-slate-500 italic">
                                            Non-Perkara / Biaya Operasional Umum Kantor
                                        </p>
                                    )}

                                    {target.client && (
                                        <div className="border-t border-slate-200/60 pt-2 dark:border-white/[0.06]">
                                            <span className="text-[10px] text-slate-400">Klien Terkait:</span>
                                            <p className="text-xs font-semibold text-slate-800 dark:text-zinc-200">
                                                {target.client.display_name}
                                            </p>
                                        </div>
                                    )}

                                    {target.vendor && (
                                        <div className="border-t border-slate-200/60 pt-2 dark:border-white/[0.06]">
                                            <span className="text-[10px] text-slate-400">Pihak Penerima / Vendor:</span>
                                            <p className="text-xs font-semibold text-slate-800 dark:text-zinc-200">
                                                {target.vendor}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Right Card: Classification & Financing */}
                                <div className="space-y-2.5 rounded-xl border border-slate-200/80 bg-slate-50/40 p-3 dark:border-white/[0.06] dark:bg-[#16181f]">
                                    <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase dark:text-zinc-500">
                                        Klasifikasi &amp; Pembukuan
                                    </span>

                                    {target.category && (
                                        <div>
                                            <span className="text-[10px] text-slate-400">Kategori Pos Beban:</span>
                                            <p className="text-xs font-semibold text-slate-800 dark:text-zinc-200 capitalize">
                                                {target.category.replace('_', ' ')}
                                            </p>
                                        </div>
                                    )}

                                    {target.charge_to && (
                                        <div className="border-t border-slate-200/60 pt-2 dark:border-white/[0.06]">
                                            <span className="text-[10px] text-slate-400">Beban Ditagihkan Ke:</span>
                                            <p className="text-xs font-semibold text-slate-800 dark:text-zinc-200">
                                                {target.charge_to === 'client' ? 'Klien (Disbursement Perkara)' : 'Kantor (Overhead Firma)'}
                                            </p>
                                        </div>
                                    )}

                                    {target.partner && (
                                        <div className="border-t border-slate-200/60 pt-2 dark:border-white/[0.06]">
                                            <span className="text-[10px] text-slate-400">Ditalangi oleh Partner:</span>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <User className="size-3 text-amber-500" />
                                                <span className="text-xs font-semibold text-amber-900 dark:text-amber-300">
                                                    {target.partner.name}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {target.method && (
                                        <div className="border-t border-slate-200/60 pt-2 dark:border-white/[0.06]">
                                            <span className="text-[10px] text-slate-400">Metode Bayar:</span>
                                            <p className="text-xs font-semibold text-slate-800 dark:text-zinc-200 uppercase">
                                                {target.method}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Description / Notes Box */}
                            {(target.description || target.notes) && (
                                <div className="rounded-xl border border-slate-200/80 bg-slate-50/40 p-3 dark:border-white/[0.06] dark:bg-[#16181f] space-y-1">
                                    <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase dark:text-zinc-500">
                                        Uraian &amp; Catatan Transaksi
                                    </span>
                                    <p className="text-xs text-slate-700 dark:text-zinc-300 whitespace-pre-wrap">
                                        {target.description || target.notes}
                                    </p>
                                </div>
                            )}

                            {/* Allocations Table if available (for payments) */}
                            {target.allocations && target.allocations.length > 0 && (
                                <div className="space-y-1.5">
                                    <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase dark:text-zinc-500">
                                        Alokasi Pembayaran ke Invoice
                                    </span>
                                    <div className="rounded-xl border border-slate-200/80 overflow-hidden dark:border-white/[0.06]">
                                        <table className="w-full text-left text-xs">
                                            <thead className="bg-slate-100/70 dark:bg-zinc-800/60 text-[10.5px] font-semibold text-slate-600 dark:text-zinc-400">
                                                <tr>
                                                    <th className="p-2 pl-3">Nomor Invoice</th>
                                                    <th className="p-2 text-right pr-3">Nominal Dialokasikan</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                                                {target.allocations.map((alloc) => (
                                                    <tr key={alloc.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02]">
                                                        <td className="p-2 pl-3 font-mono font-semibold text-slate-900 dark:text-white">
                                                            {alloc.invoice.invoice_number}
                                                        </td>
                                                        <td className="p-2 pr-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                                            {formatMoney(alloc.amount, alloc.invoice.currency || 'IDR')}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'proof' && (
                        <div>
                            {hasProof ? (
                                <div className="space-y-3">
                                    <div className="w-full h-[40vh] overflow-hidden flex items-center justify-center rounded-xl bg-slate-900/5 dark:bg-black/30 border border-slate-200/80 dark:border-white/10 p-1">
                                        {isImage ? (
                                            <img
                                                src={previewUrl}
                                                alt={target.title}
                                                className="max-h-[38vh] w-auto max-w-full object-contain rounded-lg shadow-xs"
                                            />
                                        ) : isPdf ? (
                                            <iframe
                                                src={`${previewUrl}#toolbar=1&navpanes=0`}
                                                title={target.title}
                                                className="w-full h-full rounded-lg border-0 bg-white shadow-xs"
                                            />
                                        ) : (
                                            <div className="text-center p-4 space-y-2">
                                                <FileText className="size-8 mx-auto text-slate-400" />
                                                <p className="text-xs text-slate-600 dark:text-zinc-300">
                                                    {version?.original_filename || 'Dokumen Bukti Transaksi'}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-zinc-400">
                                            <HardDrive className="size-3 text-purple-500" />
                                            <span>{version?.file_size ? formatBytes(version.file_size) : 'File'}</span>
                                            <span>•</span>
                                            <span>{version?.created_at ? formatDate(version.created_at) : ''}</span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {onOpenProof && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => onOpenProof({
                                                        id: target.id,
                                                        entity: target.entity,
                                                        title: target.title,
                                                        subtitle: target.subtitle,
                                                        proof_document: proofDoc,
                                                    })}
                                                    className="h-8 rounded-lg text-xs font-semibold"
                                                >
                                                    <UploadCloud className="size-3.5 mr-1" />
                                                    Ganti Bukti
                                                </Button>
                                            )}
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-8 rounded-lg text-xs font-semibold"
                                                asChild
                                            >
                                                <a href={downloadUrl} download>
                                                    <Download className="size-3.5 mr-1" />
                                                    Unduh Berkas
                                                </a>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-10 px-4 space-y-3 rounded-xl border-2 border-dashed border-slate-200/80 dark:border-white/10">
                                    <div className="flex size-11 mx-auto items-center justify-center rounded-xl bg-slate-100 text-slate-400 dark:bg-white/[0.04]">
                                        <UploadCloud className="size-5.5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-800 dark:text-zinc-200">
                                            Belum Ada Bukti Dokumen Terlampir
                                        </p>
                                        <p className="text-[11px] text-slate-400 mt-0.5">
                                            Unggah berkas invoice, struk belanja, atau bukti transfer untuk pencatatan rapi.
                                        </p>
                                    </div>
                                    {onOpenProof && (
                                        <Button
                                            type="button"
                                            size="sm"
                                            onClick={() => onOpenProof({
                                                id: target.id,
                                                entity: target.entity,
                                                title: target.title,
                                                subtitle: target.subtitle,
                                                proof_document: null,
                                            })}
                                            className="h-8 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs gap-1.5"
                                        >
                                            <UploadCloud className="size-3.5" />
                                            Unggah Bukti Sekarang
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* 5. Footer Action Bar */}
                <DialogFooter className="border-t border-slate-100 px-5 py-3 dark:border-white/[0.06] bg-slate-50/50 dark:bg-[#16181f]/60 flex flex-row items-center justify-between sm:justify-between">
                    <div>
                        {onDelete && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => onDelete(target.rawItem || target)}
                                className="h-8.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30 gap-1.5"
                            >
                                <Trash2 className="size-3.5" />
                                Hapus / Batalkan
                            </Button>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        {target.entity === 'invoices' && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8.5 rounded-lg border-slate-200 text-xs font-semibold text-blue-600 hover:bg-blue-50 dark:border-white/10 dark:text-blue-400 gap-1.5"
                                asChild
                            >
                                <a
                                    href={invoiceRoutes.pdf.url(target.id)}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <FileDown className="size-3.5" />
                                    PDF Invoice
                                </a>
                            </Button>
                        )}

                        {target.entity === 'payments' && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8.5 rounded-lg border-slate-200 text-xs font-semibold text-emerald-600 hover:bg-emerald-50 dark:border-white/10 dark:text-emerald-400 gap-1.5"
                                asChild
                            >
                                <a
                                    href={paymentRoutes.receipt.url(target.id)}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <Receipt className="size-3.5" />
                                    Kuitansi PDF
                                </a>
                            </Button>
                        )}

                        {onEdit && (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => onEdit(target.rawItem || target)}
                                className="h-8.5 rounded-lg border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:text-zinc-300 gap-1.5"
                            >
                                <Pencil className="size-3.5" />
                                Edit Data
                            </Button>
                        )}

                        <Button
                            type="button"
                            variant="default"
                            size="sm"
                            onClick={onClose}
                            className="h-8.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-zinc-100 text-xs font-semibold px-4"
                        >
                            Tutup
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
