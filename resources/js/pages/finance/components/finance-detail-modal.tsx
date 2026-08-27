import { Form, Link, router } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowDownLeft,
    ArrowLeftRight,
    ArrowUpRight,
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
    FileCheck,
    FileDown,
    FileImage,
    FilePlus2,
    FileText,
    FolderKanban,
    HandCoins,
    HardDrive,
    Loader2,
    Lock,
    Maximize2,
    Paperclip,
    Pencil,
    Receipt,
    ReceiptText,
    RotateCw,
    ShieldCheck,
    Tag,
    Trash2,
    Undo2,
    UploadCloud,
    User,
    WalletCards,
    X,
    ZoomIn,
    ZoomOut,
} from 'lucide-react';
import { useRef, useState } from 'react';
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

export function humanizeCategory(cat?: string): string {
    if (!cat) return 'Operasional Umum';
    const dict: Record<string, string> = {
        court_fee: 'Biaya Panjar Pengadilan (Court Fee)',
        travel: 'Transportasi & Perjalanan Dinas',
        office_supplies: 'Perlengkapan Kantor & ATK',
        legal_research: 'Riset Hukum & Dokumen Resmi',
        expert_fee: 'Honorarium Saksi Ahli',
        notary_fee: 'Jasa Notaris & Legalisasi',
        meals: 'Konsumsi & Akomodasi Tim',
        licensing: 'Perizinan & Registrasi Lembaga',
        marketing: 'Pemasaran & Pengembangan Usaha',
        utilities: 'Listrik, Air & Internet',
        rent: 'Sewa Gedung / Kantor',
        salary: 'Gaji & Upah Karyawan',
        other: 'Beban Operasional Lainnya',
        advance_incurred: 'Talangan Pribadi Partner (+)',
        advance_reimbursed: 'Pengembalian Talangan (-)',
        profit_distribution: 'Pembagian Bagi Hasil / Dividen',
        capital_injection: 'Setoran Modal Firma (+)',
        draw_prive: 'Penarikan Prive Partner (-)',
    };
    return dict[cat] || cat.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
}

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
    const [isUploadingInline, setIsUploadingInline] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [selectedFilePreview, setSelectedFilePreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(1);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

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
        const textToCopy = target.reference_number || target.id;
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleFileSelect = (file: File | null) => {
        if (!file) {
            setSelectedFile(null);
            if (selectedFilePreview) {
                URL.revokeObjectURL(selectedFilePreview);
                setSelectedFilePreview(null);
            }
            return;
        }
        setSelectedFile(file);
        if (file.type.startsWith('image/')) {
            setSelectedFilePreview(URL.createObjectURL(file));
        } else {
            setSelectedFilePreview(null);
        }
    };

    const entityConfigs: Record<string, {
        badge: string;
        icon: typeof Receipt;
        headerGlow: string;
        iconClass: string;
        nature: 'debit' | 'credit' | 'neutral';
        natureLabel: string;
    }> = {
        invoices: {
            badge: 'Invoice Tagihan Klien',
            icon: ReceiptText,
            headerGlow: 'from-blue-500/10 via-blue-500/5 to-transparent',
            iconClass: 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/50',
            nature: 'credit',
            natureLabel: 'PIUTANG PENDAPATAN JASA',
        },
        quotations: {
            badge: 'Penawaran Quotation',
            icon: FilePlus2,
            headerGlow: 'from-slate-500/10 via-slate-500/5 to-transparent',
            iconClass: 'bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300 border border-slate-200/60 dark:border-zinc-700',
            nature: 'neutral',
            natureLabel: 'ESTIMASI ANGGARAN PERKARA',
        },
        expenses: {
            badge: target.matter ? 'Disbursement Perkara' : 'Biaya Operasional Kantor',
            icon: WalletCards,
            headerGlow: 'from-rose-500/10 via-rose-500/5 to-transparent',
            iconClass: 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200/60 dark:border-rose-800/50',
            nature: 'debit',
            natureLabel: 'DEBIT: PENGELUARAN KAS',
        },
        payments: {
            badge: 'Penerimaan Pembayaran Kas',
            icon: Banknote,
            headerGlow: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
            iconClass: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/50',
            nature: 'credit',
            natureLabel: 'KREDIT: KAS MASUK',
        },
        payrolls: {
            badge: 'Slip Gaji Pegawai',
            icon: Receipt,
            headerGlow: 'from-indigo-500/10 via-indigo-500/5 to-transparent',
            iconClass: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/50',
            nature: 'debit',
            natureLabel: 'PENGGAJIAN & HONORARIUM',
        },
        'partner-transactions': {
            badge: 'Transaksi Hak Partner',
            icon: HandCoins,
            headerGlow: 'from-amber-500/10 via-amber-500/5 to-transparent',
            iconClass: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/50',
            nature: 'neutral',
            natureLabel: 'MUTASI BUKU BESAR PARTNER',
        },
        transfers: {
            badge: 'Mutasi Kas Antar Bank',
            icon: ArrowLeftRight,
            headerGlow: 'from-purple-500/10 via-purple-500/5 to-transparent',
            iconClass: 'bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400 border border-purple-200/60 dark:border-purple-800/50',
            nature: 'neutral',
            natureLabel: 'PEMINDAHBUKUAN REKENING',
        },
        'client-trust-funds': {
            badge: 'Dana Titipan Escrow',
            icon: Lock,
            headerGlow: 'from-cyan-500/10 via-cyan-500/5 to-transparent',
            iconClass: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-950/60 dark:text-cyan-400 border border-cyan-200/60 dark:border-cyan-800/50',
            nature: 'neutral',
            natureLabel: 'TITIPAN KLIEN TERISOLASI',
        },
    };

    const cfg = entityConfigs[target.entity] || {
        badge: 'Transaksi Keuangan',
        icon: Receipt,
        headerGlow: 'from-slate-500/10 via-slate-500/5 to-transparent',
        iconClass: 'bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300',
        nature: 'neutral',
        natureLabel: 'CATATAN TRANSAKSI',
    };

    const IconComp = cfg.icon;

    // Display title & category formatting
    const displayCategory = humanizeCategory(target.category);
    const displayTitle = target.title && target.title !== target.category
        ? target.title
        : displayCategory;

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) {
                    setIsUploadingInline(false);
                    setSelectedFile(null);
                    onClose();
                }
            }}
        >
            <DialogContent className="max-h-[92vh] flex flex-col p-0 gap-0 overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xl sm:max-w-2xl dark:border-white/10 dark:bg-[#12141a]">
                {/* 1. Header Bar: Clean Luxury Identity */}
                <div className={`relative border-b border-slate-100 bg-gradient-to-r ${cfg.headerGlow} px-5 pt-4.5 pb-3.5 dark:border-white/[0.06]`}>
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0 flex-1">
                            <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl shadow-2xs ${cfg.iconClass}`}>
                                <IconComp className="size-5" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-1.5 mb-1">
                                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 dark:bg-white/[0.08] dark:text-zinc-300">
                                        {cfg.badge}
                                    </span>
                                    {target.status && <StatusBadge value={target.status} />}
                                    {hasProof ? (
                                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/80 dark:bg-emerald-950/40 dark:border-emerald-800/40 dark:text-emerald-300">
                                            <FileCheck className="size-3 text-emerald-600" />
                                            Bukti Terverifikasi
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200/80 dark:bg-amber-950/30 dark:border-amber-800/40 dark:text-amber-300">
                                            <Clock className="size-3 text-amber-600" />
                                            Belum Ada Bukti
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center gap-2">
                                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                                        {displayTitle}
                                    </h3>
                                    {target.reference_number && (
                                        <button
                                            type="button"
                                            onClick={handleCopyRef}
                                            className="inline-flex items-center gap-1 rounded-md border border-slate-200/80 bg-white/80 px-1.5 py-0.5 font-mono text-[10px] font-medium text-slate-600 shadow-2xs hover:bg-slate-50 dark:border-white/10 dark:bg-[#16181f] dark:text-zinc-300 dark:hover:bg-white/10"
                                            title="Salin Nomor Referensi"
                                        >
                                            {copied ? (
                                                <>
                                                    <Check className="size-2.5 text-emerald-600 dark:text-emerald-400" />
                                                    <span className="text-emerald-600 dark:text-emerald-400">Tersalin</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="size-2.5 text-slate-400" />
                                                    <span>{target.reference_number}</span>
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>

                                {target.matter && (
                                    <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-zinc-400 truncate">
                                        <FolderKanban className="size-3.5 shrink-0 text-blue-600 dark:text-blue-400" />
                                        <span className="font-mono font-semibold text-slate-700 dark:text-zinc-300">
                                            {target.matter.matter_number}
                                        </span>
                                        <span>•</span>
                                        <span className="truncate">{target.matter.title}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Fintech Luxury Receipt Strip */}
                <div className="px-5 pt-3.5 pb-2">
                    <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 text-white shadow-sm dark:border-white/10 dark:from-[#0d0f14] dark:via-[#14161f] dark:to-[#0d0f14]">
                        {/* Decorative subtle background pattern */}
                        <div className="pointer-events-none absolute top-0 right-0 h-full w-1/3 bg-gradient-to-l from-white/[0.03] to-transparent" />

                        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-mono text-[9.5px] font-bold tracking-widest uppercase text-slate-400">
                                        {cfg.natureLabel}
                                    </span>
                                    <span className="rounded bg-white/10 px-1.5 py-0.2 font-mono text-[9px] font-medium text-slate-300">
                                        {target.currency || 'IDR'}
                                    </span>
                                </div>

                                <div className="mt-1 flex items-baseline gap-2">
                                    <span className={`font-mono text-2xl sm:text-3xl font-extrabold tracking-tight ${
                                        cfg.nature === 'debit'
                                            ? 'text-rose-400'
                                            : cfg.nature === 'credit'
                                              ? 'text-emerald-400'
                                              : 'text-white'
                                    }`}>
                                        {formatMoney(target.amount, target.currency || 'IDR')}
                                    </span>
                                </div>

                                <p className="mt-1 font-mono text-[10.5px] text-slate-400 italic">
                                    {target.amount > 0 ? `Terbilang: ${terbilang(target.amount)} Rupiah` : 'Nol Rupiah'}
                                </p>
                            </div>

                            {/* Meta Tags Column */}
                            <div className="flex flex-wrap items-center gap-1.5 sm:flex-col sm:items-end sm:gap-1.5 text-xs">
                                {target.date && (
                                    <div className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[11px] text-slate-300">
                                        <Calendar className="size-3 text-slate-400" />
                                        <span>{formatDate(target.date)}</span>
                                    </div>
                                )}
                                {target.account && (
                                    <div className="inline-flex items-center gap-1.5 rounded-lg border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-[11px] font-medium text-blue-300">
                                        <Building2 className="size-3 text-blue-400" />
                                        <span>{target.account.name}</span>
                                    </div>
                                )}
                                {target.method && (
                                    <div className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[10px] text-slate-400 uppercase">
                                        <CreditCard className="size-3 text-slate-400" />
                                        <span>{target.method}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Apple-style Segmented Switcher */}
                <div className="px-5 pt-2 pb-1">
                    <div className="flex rounded-lg border border-slate-200/80 bg-slate-100/70 p-0.5 dark:border-white/10 dark:bg-white/[0.04]">
                        <button
                            type="button"
                            onClick={() => setActiveTab('overview')}
                            className={`flex-1 flex items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-semibold transition-all ${
                                activeTab === 'overview'
                                    ? 'bg-white text-slate-900 shadow-2xs dark:bg-[#1a1d26] dark:text-white'
                                    : 'text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-200'
                            }`}
                        >
                            <FileText className="size-3.5" />
                            Rincian &amp; Klasifikasi
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('proof')}
                            className={`flex-1 flex items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-semibold transition-all ${
                                activeTab === 'proof'
                                    ? 'bg-white text-slate-900 shadow-2xs dark:bg-[#1a1d26] dark:text-white'
                                    : 'text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-200'
                            }`}
                        >
                            <Paperclip className="size-3.5" />
                            Berkas Bukti {hasProof ? '(1 Lampiran)' : '(0 Lampiran)'}
                        </button>
                    </div>
                </div>

                {/* 4. Tab Body Content */}
                <div className="p-5 overflow-y-auto flex-1 max-h-[46vh] text-xs [scrollbar-width:thin]">
                    {activeTab === 'overview' && (
                        <div className="space-y-3.5">
                            {/* Key-Value Specifications List */}
                            <div className="divide-y divide-slate-100 rounded-xl border border-slate-200/80 bg-slate-50/40 dark:divide-white/[0.04] dark:border-white/[0.06] dark:bg-[#16181f]/40">
                                {/* Row 1: Perkara & Klien */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 p-3 gap-1">
                                    <span className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400">
                                        Perkara / Klien
                                    </span>
                                    <div className="sm:col-span-2 space-y-0.5">
                                        {target.matter ? (
                                            <>
                                                <p className="font-semibold text-slate-900 dark:text-white">
                                                    {target.matter.title}
                                                </p>
                                                <p className="font-mono text-[11px] text-blue-600 dark:text-blue-400">
                                                    No: {target.matter.matter_number}
                                                </p>
                                            </>
                                        ) : target.client ? (
                                            <p className="font-semibold text-slate-900 dark:text-white">
                                                {target.client.display_name}
                                            </p>
                                        ) : (
                                            <p className="text-slate-500 italic">
                                                Operasional Umum Firma (Non-Perkara)
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Row 2: Pos Beban & Klasifikasi */}
                                {target.category && (
                                    <div className="grid grid-cols-1 sm:grid-cols-3 p-3 gap-1">
                                        <span className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400">
                                            Pos Akun / Kategori
                                        </span>
                                        <div className="sm:col-span-2">
                                            <span className="inline-flex items-center gap-1 rounded-md bg-slate-200/70 px-2 py-0.5 font-medium text-slate-800 dark:bg-white/[0.08] dark:text-zinc-200">
                                                <Tag className="size-3 text-slate-500" />
                                                {displayCategory}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Row 3: Pihak Penerima / Vendor */}
                                {target.vendor && (
                                    <div className="grid grid-cols-1 sm:grid-cols-3 p-3 gap-1">
                                        <span className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400">
                                            Pihak Penerima / Vendor
                                        </span>
                                        <div className="sm:col-span-2 font-semibold text-slate-900 dark:text-white">
                                            {target.vendor}
                                        </div>
                                    </div>
                                )}

                                {/* Row 4: Beban Ditagihkan Ke */}
                                {target.charge_to && (
                                    <div className="grid grid-cols-1 sm:grid-cols-3 p-3 gap-1">
                                        <span className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400">
                                            Beban Ditagihkan Ke
                                        </span>
                                        <div className="sm:col-span-2">
                                            <span className={`inline-flex items-center rounded-md px-2 py-0.5 font-semibold text-[11px] ${
                                                target.charge_to === 'client'
                                                    ? 'bg-blue-50 text-blue-700 border border-blue-200/60 dark:bg-blue-950/40 dark:text-blue-300'
                                                    : 'bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300'
                                            }`}>
                                                {target.charge_to === 'client' ? 'Klien (Disbursement Tagihan Perkara)' : 'Kantor (Overhead Operasional Firma)'}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Row 5: Talangan Partner */}
                                {target.partner && (
                                    <div className="grid grid-cols-1 sm:grid-cols-3 p-3 gap-1">
                                        <span className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400">
                                            Ditalangi Partner
                                        </span>
                                        <div className="sm:col-span-2 flex items-center gap-1.5 font-semibold text-amber-800 dark:text-amber-300">
                                            <User className="size-3.5 text-amber-600" />
                                            {target.partner.name}
                                        </div>
                                    </div>
                                )}

                                {/* Row 6: Rekening Kas/Bank */}
                                {target.account && (
                                    <div className="grid grid-cols-1 sm:grid-cols-3 p-3 gap-1">
                                        <span className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400">
                                            Rekening Kas / Bank
                                        </span>
                                        <div className="sm:col-span-2 font-medium text-slate-800 dark:text-zinc-200">
                                            {target.account.name}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Description / Notes Box */}
                            {(target.description || target.notes) && (
                                <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b] space-y-1">
                                    <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase dark:text-zinc-500">
                                        Uraian &amp; Catatan Transaksi
                                    </span>
                                    <p className="text-xs leading-relaxed text-slate-700 dark:text-zinc-300 whitespace-pre-wrap">
                                        {target.description || target.notes}
                                    </p>
                                </div>
                            )}

                            {/* Allocations Table if available (for payments) */}
                            {target.allocations && target.allocations.length > 0 && (
                                <div className="space-y-1.5">
                                    <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase dark:text-zinc-500">
                                        Alokasi Penerimaan ke Invoice
                                    </span>
                                    <div className="rounded-xl border border-slate-200/80 overflow-hidden dark:border-white/[0.06]">
                                        <table className="w-full text-left text-xs">
                                            <thead className="bg-slate-100/70 dark:bg-zinc-800/60 text-[10.5px] font-semibold text-slate-600 dark:text-zinc-400">
                                                <tr>
                                                    <th className="p-2 pl-3">Nomor Invoice Tagihan</th>
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
                            {hasProof && !isUploadingInline ? (
                                <div className="space-y-3">
                                    {/* Embedded Document Frame */}
                                    <div className="relative w-full h-[36vh] overflow-hidden flex items-center justify-center rounded-xl bg-slate-950/5 dark:bg-black/40 border border-slate-200/80 dark:border-white/10 p-1">
                                        {isImage ? (
                                            <img
                                                src={previewUrl}
                                                alt={target.title}
                                                style={{ transform: `scale(${zoomLevel})` }}
                                                className="max-h-[34vh] w-auto max-w-full object-contain rounded-lg shadow-xs transition-transform duration-150"
                                            />
                                        ) : isPdf ? (
                                            <iframe
                                                src={`${previewUrl}#toolbar=1&navpanes=0`}
                                                title={target.title}
                                                className="w-full h-full rounded-lg border-0 bg-white shadow-xs"
                                            />
                                        ) : (
                                            <div className="text-center p-4 space-y-2">
                                                <FileText className="size-10 mx-auto text-slate-400" />
                                                <p className="text-xs font-medium text-slate-700 dark:text-zinc-200">
                                                    {version?.original_filename || 'Dokumen Bukti Transaksi'}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* File Metadata & Actions */}
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-t border-slate-100 pt-2 dark:border-white/[0.06]">
                                        <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-zinc-400">
                                            <HardDrive className="size-3 text-purple-500" />
                                            <span className="font-mono">{version?.file_size ? formatBytes(version.file_size) : 'File'}</span>
                                            <span>•</span>
                                            <span>{version?.created_at ? formatDate(version.created_at) : ''}</span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setIsUploadingInline(true)}
                                                className="h-7.5 rounded-lg text-xs font-semibold"
                                            >
                                                <UploadCloud className="size-3.5 mr-1" />
                                                Ganti Berkas
                                            </Button>

                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-7.5 rounded-lg text-xs font-semibold"
                                                asChild
                                            >
                                                <a href={downloadUrl} download>
                                                    <Download className="size-3.5 mr-1" />
                                                    Unduh
                                                </a>
                                            </Button>

                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-7.5 rounded-lg text-xs font-semibold"
                                                asChild
                                            >
                                                <a href={previewUrl} target="_blank" rel="noreferrer">
                                                    <ExternalLink className="size-3.5 mr-1" />
                                                    Fullscreen
                                                </a>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                /* Direct Integrated Dropzone Uploader (NEW CONCEPT) */
                                <Form
                                    action={`/finance/${target.entity}/${target.id}/proof`}
                                    method="post"
                                    encType="multipart/form-data"
                                    className="space-y-3"
                                    onSuccess={() => {
                                        setIsUploadingInline(false);
                                        setSelectedFile(null);
                                        if (selectedFilePreview) {
                                            URL.revokeObjectURL(selectedFilePreview);
                                            setSelectedFilePreview(null);
                                        }
                                    }}
                                >
                                    {({ processing }) => (
                                        <div className="space-y-3">
                                            <div
                                                onDragOver={(e) => {
                                                    e.preventDefault();
                                                    setIsDragging(true);
                                                }}
                                                onDragLeave={() => setIsDragging(false)}
                                                onDrop={(e) => {
                                                    e.preventDefault();
                                                    setIsDragging(false);
                                                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                                        handleFileSelect(e.dataTransfer.files[0]);
                                                        if (fileInputRef.current) {
                                                            const dt = new DataTransfer();
                                                            dt.items.add(e.dataTransfer.files[0]);
                                                            fileInputRef.current.files = dt.files;
                                                        }
                                                    }
                                                }}
                                                onClick={() => fileInputRef.current?.click()}
                                                className={`group relative cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-all duration-150 ${
                                                    isDragging
                                                        ? 'border-blue-500 bg-blue-50/50 dark:border-blue-400 dark:bg-blue-950/20'
                                                        : selectedFile
                                                          ? 'border-emerald-400/80 bg-emerald-50/30 dark:border-emerald-500/30 dark:bg-emerald-950/10'
                                                          : 'border-slate-200/90 bg-slate-50/40 hover:border-blue-400 hover:bg-slate-50/90 dark:border-white/10 dark:bg-white/[0.02] dark:hover:border-blue-400/40 dark:hover:bg-white/[0.04]'
                                                }`}
                                            >
                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    name="proof"
                                                    accept=".pdf,.jpg,.jpeg,.png,.webp,image/*,application/pdf"
                                                    required
                                                    className="hidden"
                                                    onChange={(e) => {
                                                        if (e.target.files && e.target.files[0]) {
                                                            handleFileSelect(e.target.files[0]);
                                                        }
                                                    }}
                                                />

                                                <div className="flex flex-col items-center justify-center space-y-2">
                                                    <div className={`flex size-11 items-center justify-center rounded-xl transition-transform duration-150 group-hover:scale-105 ${
                                                        selectedFile
                                                            ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                                                            : 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400'
                                                    }`}>
                                                        {selectedFile ? (
                                                            <FileCheck className="size-5.5" />
                                                        ) : (
                                                            <UploadCloud className="size-5.5" />
                                                        )}
                                                    </div>

                                                    <div>
                                                        <p className="text-xs font-bold text-slate-800 dark:text-zinc-100">
                                                            {selectedFile
                                                                ? selectedFile.name
                                                                : 'Seret Berkas ke Sini atau Klik untuk Memilih'}
                                                        </p>
                                                        <p className="mt-0.5 text-[11px] text-slate-400 dark:text-zinc-500">
                                                            {selectedFile
                                                                ? `${formatBytes(selectedFile.size)} • Siap diunggah`
                                                                : 'Format PDF, JPG, PNG, WEBP (Maksimal 20 MB)'}
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center gap-1.5 pt-1">
                                                        {['PDF', 'JPG', 'PNG', 'WEBP'].map((fmt) => (
                                                            <span key={fmt} className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-slate-600 dark:bg-white/10 dark:text-zinc-300">
                                                                {fmt}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action bar for inline upload */}
                                            <div className="flex items-center justify-between pt-1">
                                                <div className="flex items-center gap-1 text-[10.5px] text-slate-400">
                                                    <ShieldCheck className="size-3 text-emerald-500" />
                                                    <span>Terisolasi aman dari berkas perkara</span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    {hasProof && (
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => {
                                                                setIsUploadingInline(false);
                                                                setSelectedFile(null);
                                                            }}
                                                            className="h-7.5 rounded-lg text-xs"
                                                        >
                                                            Batal
                                                        </Button>
                                                    )}
                                                    <Button
                                                        type="submit"
                                                        size="sm"
                                                        disabled={processing || !selectedFile}
                                                        className="h-7.5 px-3.5 rounded-lg bg-blue-600 text-xs font-semibold text-white hover:bg-blue-700 gap-1.5 disabled:opacity-50"
                                                    >
                                                        {processing ? (
                                                            <>
                                                                <Loader2 className="size-3 animate-spin" />
                                                                Mengunggah...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <UploadCloud className="size-3" />
                                                                Simpan Bukti Sekarang
                                                            </>
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </Form>
                            )}
                        </div>
                    )}
                </div>

                {/* 5. Footer Action Bar: Perfectly Balanced */}
                <div className="border-t border-slate-100 px-5 py-3 dark:border-white/[0.06] bg-slate-50/50 dark:bg-[#16181f]/60 flex flex-row items-center justify-between">
                    <div>
                        {onDelete && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => onDelete(target.rawItem || target)}
                                className="h-8 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30 gap-1.5"
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
                                className="h-8 rounded-lg border-slate-200 text-xs font-semibold text-blue-600 hover:bg-blue-50 dark:border-white/10 dark:text-blue-400 gap-1.5"
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
                                className="h-8 rounded-lg border-slate-200 text-xs font-semibold text-emerald-600 hover:bg-emerald-50 dark:border-white/10 dark:text-emerald-400 gap-1.5"
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
                                className="h-8 rounded-lg border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:text-zinc-300 gap-1.5"
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
                            className="h-8 rounded-lg bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-zinc-100 text-xs font-semibold px-4"
                        >
                            Tutup
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
