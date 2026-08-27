import { router } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowLeftRight,
    Banknote,
    Building2,
    Calendar,
    Check,
    CheckCircle2,
    Clock,
    Copy,
    CreditCard,
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
    Paperclip,
    Pencil,
    Receipt,
    ReceiptText,
    ShieldCheck,
    Tag,
    Trash2,
    UploadCloud,
    User,
    WalletCards,
    X,
} from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
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
import * as quotationRoutes from '@/routes/finance/quotations';
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
    outstanding_amount?: number;
    paid_amount?: number;
    items?: {
        id?: string;
        description: string;
        quantity?: number;
        unit_amount?: number;
        unit_price?: number;
        amount?: number;
        total_amount?: number;
    }[];
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
    payroll_details?: {
        basic_salary: number;
        fixed_allowance: number;
        transport_meal_allowance: number;
        overtime_amount: number;
        bonus_amount: number;
        deductions_amount: number;
        tax_deduction_amount: number;
    };
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
        court_fee: 'Panjar Pengadilan (Court Fee)',
        travel: 'Transportasi & Akomodasi',
        office_supplies: 'Perlengkapan Kantor & ATK',
        legal_research: 'Riset Hukum & Berkas Resmi',
        expert_fee: 'Honorarium Saksi Ahli',
        notary_fee: 'Notaris & Legalisasi',
        meals: 'Konsumsi & Akomodasi',
        licensing: 'Perizinan & Registrasi',
        marketing: 'Pemasaran & Kemitraan',
        utilities: 'Listrik, Air & Internet',
        rent: 'Sewa Gedung / Kantor',
        salary: 'Gaji & Upah Tenaga Kerja',
        other: 'Biaya Operasional Lainnya',
        advance_incurred: 'Talangan Partner (+)',
        advance_reimbursed: 'Pengembalian Talangan (-)',
        profit_distribution: 'Bagi Hasil / Dividen',
        capital_injection: 'Setoran Modal (+)',
        draw_prive: 'Penarikan Prive (-)',
    };
    return dict[cat] || cat.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
}

export function FinanceDetailModal({
    target,
    isOpen,
    onClose,
    onEdit,
    onDelete,
}: Props) {
    const [copied, setCopied] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isReplacingProof, setIsReplacingProof] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [selectedFilePreview, setSelectedFilePreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
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
        toast.success(`Nomor referensi ${textToCopy} disalin.`);
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
        if (file.size > 20 * 1024 * 1024) {
            toast.error('Ukuran berkas melebihi batas maksimal 20 MB.');
            return;
        }
        setSelectedFile(file);
        if (file.type.startsWith('image/')) {
            setSelectedFilePreview(URL.createObjectURL(file));
        } else {
            setSelectedFilePreview(null);
        }
    };

    const handleUploadProof = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!selectedFile) {
            toast.error('Silakan pilih berkas bukti terlebih dahulu.');
            return;
        }
        const formData = new FormData();
        formData.append('proof', selectedFile);

        setIsUploading(true);
        router.post(`/finance/${target.entity}/${target.id}/proof`, formData, {
            preserveScroll: true,
            onSuccess: () => {
                setIsUploading(false);
                setIsReplacingProof(false);
                setSelectedFile(null);
                if (selectedFilePreview) {
                    URL.revokeObjectURL(selectedFilePreview);
                    setSelectedFilePreview(null);
                }
                toast.success('Berkas bukti transaksi berhasil diunggah!');
            },
            onError: (errors) => {
                setIsUploading(false);
                const firstErr = Object.values(errors)[0] as string;
                toast.error(firstErr || 'Gagal mengunggah berkas bukti.');
            },
        });
    };

    const handleDeleteProof = () => {
        if (!confirm('Apakah Anda yakin ingin menghapus lampiran berkas bukti ini?')) return;
        setIsDeleting(true);
        router.delete(`/finance/${target.entity}/${target.id}/proof`, {
            preserveScroll: true,
            onSuccess: () => {
                setIsDeleting(false);
                toast.success('Berkas bukti transaksi berhasil dihapus.');
            },
            onError: () => {
                setIsDeleting(false);
                toast.error('Gagal menghapus berkas bukti.');
            },
        });
    };

    const entityConfigs: Record<string, {
        badge: string;
        icon: typeof Receipt;
        iconBg: string;
        natureLabel: string;
        accentBorder: string;
    }> = {
        invoices: {
            badge: 'Invoice Tagihan',
            icon: ReceiptText,
            iconBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20',
            natureLabel: 'TOTAL TAGIHAN INVOICE',
            accentBorder: 'border-blue-500/30',
        },
        quotations: {
            badge: 'Quotation Penawaran',
            icon: FilePlus2,
            iconBg: 'bg-slate-500/10 text-slate-700 dark:text-zinc-300 border border-slate-500/20',
            natureLabel: 'ESTIMASI NILAI PENAWARAN',
            accentBorder: 'border-slate-500/30',
        },
        expenses: {
            badge: target.matter ? 'Disbursement Perkara' : 'Beban Operasional',
            icon: WalletCards,
            iconBg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20',
            natureLabel: 'PENGELUARAN KAS (DEBIT)',
            accentBorder: 'border-rose-500/30',
        },
        payments: {
            badge: 'Penerimaan Kas',
            icon: Banknote,
            iconBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
            natureLabel: 'PENERIMAAN KAS (KREDIT)',
            accentBorder: 'border-emerald-500/30',
        },
        payrolls: {
            badge: 'Slip Gaji Karyawan',
            icon: Receipt,
            iconBg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20',
            natureLabel: 'TOTAL TAKE HOME PAY (THP)',
            accentBorder: 'border-indigo-500/30',
        },
        'partner-transactions': {
            badge: 'Mutasi Hak Partner',
            icon: HandCoins,
            iconBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
            natureLabel: 'NOMINAL TRANSAKSI PARTNER',
            accentBorder: 'border-amber-500/30',
        },
        transfers: {
            badge: 'Transfer Antar Rekening',
            icon: ArrowLeftRight,
            iconBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20',
            natureLabel: 'PEMINDAHAN DANA BANK',
            accentBorder: 'border-purple-500/30',
        },
        'client-trust-funds': {
            badge: 'Titipan Escrow Klien',
            icon: Lock,
            iconBg: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20',
            natureLabel: 'MUTASI REKENING TITIPAN',
            accentBorder: 'border-cyan-500/30',
        },
    };

    const cfg = entityConfigs[target.entity] || {
        badge: 'Detail Keuangan',
        icon: Receipt,
        iconBg: 'bg-slate-500/10 text-slate-700 dark:text-zinc-300 border border-slate-500/20',
        natureLabel: 'NOMINAL TRANSAKSI',
        accentBorder: 'border-slate-500/30',
    };

    const IconComp = cfg.icon;
    const displayCategory = humanizeCategory(target.category);
    const displayTitle = target.title && target.title !== target.category
        ? target.title
        : displayCategory;

    const lineItems = target.items || target.rawItem?.items || target.rawItem?.line_items || [];
    const payrollDetails = target.payroll_details || (target.rawItem && {
        basic_salary: target.rawItem.basic_salary ?? 0,
        fixed_allowance: target.rawItem.fixed_allowance ?? 0,
        transport_meal_allowance: target.rawItem.transport_meal_allowance ?? 0,
        overtime_amount: target.rawItem.overtime_amount ?? 0,
        bonus_amount: target.rawItem.bonus_amount ?? 0,
        deductions_amount: target.rawItem.deductions_amount ?? 0,
        tax_deduction_amount: target.rawItem.tax_deduction_amount ?? 0,
    });

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) {
                    setIsReplacingProof(false);
                    setShowPreviewModal(false);
                    setSelectedFile(null);
                    if (selectedFilePreview) {
                        URL.revokeObjectURL(selectedFilePreview);
                        setSelectedFilePreview(null);
                    }
                    onClose();
                }
            }}
        >
            <DialogContent className="max-h-[92vh] flex flex-col p-0 gap-0 overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xl sm:max-w-xl dark:border-white/10 dark:bg-[#12141a]">
                {/* 1. Header: Executive, Clean & Structured */}
                <div className="border-b border-slate-100 px-5 pt-4.5 pb-3.5 dark:border-white/[0.06] bg-slate-50/50 dark:bg-[#151821]/60">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0 flex-1">
                            <div className={`flex size-9.5 shrink-0 items-center justify-center rounded-xl ${cfg.iconBg} shadow-2xs`}>
                                <IconComp className="size-5" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-1.5 mb-1">
                                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-200/70 text-slate-700 dark:bg-white/[0.08] dark:text-zinc-300">
                                        {cfg.badge}
                                    </span>
                                    {target.status && <StatusBadge value={target.status} />}
                                    {target.reference_number && (
                                        <button
                                            type="button"
                                            onClick={handleCopyRef}
                                            className="inline-flex items-center gap-1 rounded-md border border-slate-200/90 bg-white px-2 py-0.5 font-mono text-[10px] font-medium text-slate-700 shadow-2xs hover:bg-slate-50 hover:border-slate-300 dark:border-white/10 dark:bg-[#1a1d26] dark:text-zinc-300 transition-colors"
                                            title="Klik untuk menyalin nomor referensi"
                                        >
                                            {copied ? (
                                                <>
                                                    <Check className="size-2.5 text-emerald-600 dark:text-emerald-400" />
                                                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Tersalin</span>
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

                                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
                                    {displayTitle}
                                </h3>

                                {target.matter ? (
                                    <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-600 dark:text-zinc-400 truncate">
                                        <FolderKanban className="size-3.5 shrink-0 text-blue-600 dark:text-blue-400" />
                                        <span className="font-mono font-semibold text-slate-800 dark:text-zinc-200">
                                            {target.matter.matter_number}
                                        </span>
                                        <span>•</span>
                                        <span className="truncate font-medium">{target.matter.title}</span>
                                    </div>
                                ) : target.client ? (
                                    <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-600 dark:text-zinc-400 truncate">
                                        <User className="size-3.5 shrink-0 text-slate-400" />
                                        <span>Klien:</span>
                                        <span className="font-semibold text-slate-800 dark:text-zinc-200 truncate">{target.client.display_name}</span>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Executive Monetary Card (Dark Fintech Voucher Strip) */}
                <div className="px-5 pt-3.5 pb-2">
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-slate-800/80 p-4 text-white shadow-md">
                        {/* Background Watermark Pattern */}
                        <div className="absolute -right-6 -bottom-6 opacity-5 pointer-events-none">
                            <IconComp className="size-36 text-white" />
                        </div>

                        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                                <span className="text-[9.5px] font-bold tracking-wider text-slate-400 uppercase">
                                    {cfg.natureLabel}
                                </span>
                                <div className="mt-0.5 flex items-baseline gap-1.5">
                                    <span className="font-mono text-xl sm:text-2xl font-black tracking-tight text-white">
                                        {formatMoney(target.amount, target.currency || 'IDR')}
                                    </span>
                                </div>
                                <p className="mt-0.5 text-[10px] text-slate-400/90 italic line-clamp-1" title={terbilang(target.amount) + ' Rupiah'}>
                                    {target.amount > 0 ? `“${terbilang(target.amount)} Rupiah”` : 'Nol Rupiah'}
                                </p>
                            </div>

                            {/* Meta Tags Column */}
                            <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-1.5 shrink-0 pt-2 sm:pt-0 border-t border-slate-800/80 sm:border-t-0">
                                {target.date && (
                                    <div className="inline-flex items-center gap-1.5 rounded-lg bg-white/[0.07] border border-white/[0.08] px-2 py-0.5 text-[10.5px] font-medium text-slate-300">
                                        <Calendar className="size-3 text-slate-400" />
                                        <span>{formatDate(target.date)}</span>
                                    </div>
                                )}
                                {(target.account || target.partner) && (
                                    <div className="inline-flex items-center gap-1.5 rounded-lg bg-white/[0.07] border border-white/[0.08] px-2 py-0.5 text-[10.5px] font-medium text-slate-300 truncate max-w-[200px]">
                                        <Building2 className="size-3 text-blue-400 shrink-0" />
                                        <span className="truncate">{target.account?.name || (target.partner ? `Talangan ${target.partner.name}` : 'Kas Kantor')}</span>
                                    </div>
                                )}
                                {target.due_date && (
                                    <div className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[10.5px] font-medium text-amber-300">
                                        <Clock className="size-3 text-amber-400" />
                                        <span>Jatuh Tempo: {formatDate(target.due_date)}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Specifications & Dynamic Sections */}
                <div className="px-5 py-2 overflow-y-auto flex-1 max-h-[46vh] space-y-3 text-xs [scrollbar-width:thin]">
                    {/* Compact Specifications Grid */}
                    <div className="rounded-xl border border-slate-200/90 bg-slate-50/40 p-2.5 dark:border-white/[0.06] dark:bg-[#161822]/40 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                        {/* Kategori Pos */}
                        {target.category && (
                            <div className="flex flex-col gap-0.5">
                                <span className="text-[10px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                                    Kategori Pembukuan
                                </span>
                                <div className="flex items-center gap-1 text-slate-800 dark:text-zinc-200 font-medium">
                                    <Tag className="size-3 text-slate-400" />
                                    <span>{displayCategory}</span>
                                </div>
                            </div>
                        )}

                        {/* Penerima / Vendor */}
                        {target.vendor && (
                            <div className="flex flex-col gap-0.5">
                                <span className="text-[10px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                                    Pihak Penerima / Vendor
                                </span>
                                <span className="text-slate-900 dark:text-white font-semibold">
                                    {target.vendor}
                                </span>
                            </div>
                        )}

                        {/* Beban Ditagihkan Ke */}
                        {target.charge_to && (
                            <div className="flex flex-col gap-0.5">
                                <span className="text-[10px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                                    Alokasi Pembebanan
                                </span>
                                <span className="text-slate-800 dark:text-zinc-200 font-medium">
                                    {target.charge_to === 'client' ? 'Tagihan Klien (Disbursement)' : 'Overhead Firma Kantor'}
                                </span>
                            </div>
                        )}

                        {/* Ditalangi Partner */}
                        {target.partner && (
                            <div className="flex flex-col gap-0.5">
                                <span className="text-[10px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                                    Talangan Partner
                                </span>
                                <span className="text-amber-700 dark:text-amber-300 font-semibold flex items-center gap-1">
                                    <User className="size-3 text-amber-500" />
                                    {target.partner.name}
                                </span>
                            </div>
                        )}

                        {/* Metode Pembayaran */}
                        {target.method && (
                            <div className="flex flex-col gap-0.5">
                                <span className="text-[10px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                                    Metode Transaksi
                                </span>
                                <span className="text-slate-800 dark:text-zinc-200 font-medium uppercase">
                                    {target.method}
                                </span>
                            </div>
                        )}

                        {/* Status Piutang jika Invoice */}
                        {target.entity === 'invoices' && typeof target.outstanding_amount === 'number' && (
                            <div className="flex flex-col gap-0.5">
                                <span className="text-[10px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                                    Sisa Piutang Tagihan
                                </span>
                                <span className="font-mono font-bold">
                                    {target.outstanding_amount === 0 ? (
                                        <span className="text-emerald-600 dark:text-emerald-400">Lunas Penuh (Rp 0)</span>
                                    ) : (
                                        <span className="text-amber-600 dark:text-amber-400">
                                            {formatMoney(target.outstanding_amount, target.currency)}
                                        </span>
                                    )}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Line Items Table if Invoice or Quotation */}
                    {lineItems.length > 0 && (
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <span className="text-[10.5px] font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wider">
                                    Rincian Layanan &amp; Pos Tagihan ({lineItems.length} Item)
                                </span>
                            </div>
                            <div className="rounded-xl border border-slate-200/90 overflow-hidden dark:border-white/[0.06] shadow-2xs">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-slate-100/80 dark:bg-zinc-800/80 text-[10px] font-bold text-slate-600 dark:text-zinc-300 uppercase tracking-wider border-b border-slate-200/90 dark:border-white/[0.06]">
                                        <tr>
                                            <th className="py-2 px-3">Uraian Pekerjaan / Honorarium</th>
                                            <th className="py-2 px-2 text-center w-14">Qty</th>
                                            <th className="py-2 pr-3 text-right">Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04] bg-white dark:bg-[#14161f]">
                                        {lineItems.map((item: any, idx: number) => {
                                            const itemQty = Number(item.quantity) || 1;
                                            const itemPrice = Number(item.unit_amount ?? item.unit_price ?? item.amount ?? 0);
                                            const rowTotal = item.total_amount ? Number(item.total_amount) : itemQty * itemPrice;
                                            return (
                                                <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-white/[0.02] transition-colors">
                                                    <td className="py-2.5 px-3 text-slate-800 dark:text-zinc-200 font-medium leading-relaxed">
                                                        {item.description}
                                                    </td>
                                                    <td className="py-2.5 px-2 text-center font-mono text-slate-600 dark:text-zinc-400">
                                                        {itemQty}
                                                    </td>
                                                    <td className="py-2.5 pr-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                                                        {formatMoney(rowTotal, target.currency || 'IDR')}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                    <tfoot className="bg-slate-50 dark:bg-zinc-800/40 border-t border-slate-200/90 dark:border-white/[0.06]">
                                        <tr>
                                            <td colSpan={2} className="py-2 px-3 text-right text-[11px] font-bold text-slate-600 dark:text-zinc-300 uppercase">
                                                Total Akumulasi:
                                            </td>
                                            <td className="py-2 pr-3 text-right font-mono text-xs font-black text-slate-900 dark:text-white">
                                                {formatMoney(target.amount, target.currency || 'IDR')}
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Payroll Breakdown if payroll entity */}
                    {payrollDetails && target.entity === 'payrolls' && (
                        <div className="space-y-1.5">
                            <span className="text-[10.5px] font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wider">
                                Rincian Komponen Gaji &amp; Potongan
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/40 p-2.5 space-y-1 dark:border-emerald-900/40 dark:bg-emerald-950/20">
                                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase">Penghasilan (+)</span>
                                    <div className="flex justify-between text-slate-700 dark:text-zinc-300">
                                        <span>Gaji Pokok:</span>
                                        <span className="font-mono font-semibold">{formatMoney(payrollDetails.basic_salary)}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-700 dark:text-zinc-300">
                                        <span>Tunjangan Tetap:</span>
                                        <span className="font-mono">{formatMoney(payrollDetails.fixed_allowance)}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-700 dark:text-zinc-300">
                                        <span>Uang Makan &amp; Transport:</span>
                                        <span className="font-mono">{formatMoney(payrollDetails.transport_meal_allowance)}</span>
                                    </div>
                                    {payrollDetails.bonus_amount > 0 && (
                                        <div className="flex justify-between text-slate-700 dark:text-zinc-300">
                                            <span>Bonus Perkara:</span>
                                            <span className="font-mono">{formatMoney(payrollDetails.bonus_amount)}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="rounded-xl border border-rose-200/80 bg-rose-50/40 p-2.5 space-y-1 dark:border-rose-900/40 dark:bg-rose-950/20">
                                    <span className="text-[10px] font-bold text-rose-700 dark:text-rose-400 uppercase">Potongan (-)</span>
                                    <div className="flex justify-between text-slate-700 dark:text-zinc-300">
                                        <span>Potongan Kasbon / Lainnya:</span>
                                        <span className="font-mono">- {formatMoney(payrollDetails.deductions_amount)}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-700 dark:text-zinc-300">
                                        <span>PPh 21 Pajak:</span>
                                        <span className="font-mono">- {formatMoney(payrollDetails.tax_deduction_amount)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Payment Allocations Table */}
                    {target.allocations && target.allocations.length > 0 && (
                        <div className="space-y-1.5">
                            <span className="text-[10.5px] font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wider">
                                Alokasi Pembayaran ke Tagihan Invoice
                            </span>
                            <div className="rounded-xl border border-slate-200/90 overflow-hidden dark:border-white/[0.06]">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-slate-100/80 dark:bg-zinc-800/80 text-[10px] font-bold text-slate-600 dark:text-zinc-300 uppercase tracking-wider border-b border-slate-200/90 dark:border-white/[0.06]">
                                        <tr>
                                            <th className="py-2 px-3">Nomor Invoice</th>
                                            <th className="py-2 pr-3 text-right">Nominal Dialokasikan</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04] bg-white dark:bg-[#14161f]">
                                        {target.allocations.map((alloc) => (
                                            <tr key={alloc.id}>
                                                <td className="py-2 px-3 font-mono font-semibold text-slate-900 dark:text-white">
                                                    {alloc.invoice.invoice_number}
                                                </td>
                                                <td className="py-2 pr-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                                    {formatMoney(alloc.amount, alloc.invoice.currency || 'IDR')}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Description / Notes Box */}
                    {(target.description || target.notes) && (
                        <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-3 dark:border-white/[0.06] dark:bg-[#161822]/40 space-y-1">
                            <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                                Uraian &amp; Catatan Khusus
                            </span>
                            <p className="text-xs leading-relaxed text-slate-700 dark:text-zinc-300 whitespace-pre-wrap">
                                {target.description || target.notes}
                            </p>
                        </div>
                    )}

                    {/* 4. Streamlined Proof Document & Direct Upload Card */}
                    <div className="rounded-xl border border-slate-200/90 p-3 space-y-2.5 dark:border-white/[0.06] bg-white dark:bg-[#14161f]/60 shadow-2xs">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-zinc-200">
                                <Paperclip className="size-3.5 text-blue-600 dark:text-blue-400" />
                                <span>Dokumen Bukti Transaksi</span>
                            </div>
                            {hasProof && !isReplacingProof ? (
                                <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-emerald-600 dark:text-emerald-400">
                                    <FileCheck className="size-3.5" />
                                    Terlampir ({version?.file_size ? formatBytes(version.file_size) : 'File'})
                                </span>
                            ) : (
                                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                    <ShieldCheck className="size-3 text-emerald-500" />
                                    Terisolasi aman
                                </span>
                            )}
                        </div>

                        {hasProof && !isReplacingProof ? (
                            /* Already Attached Proof State */
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl bg-slate-50/90 p-2.5 dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/[0.06]">
                                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                                        {isImage ? (
                                            <FileImage className="size-4.5" />
                                        ) : (
                                            <FileText className="size-4.5" />
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs font-semibold text-slate-800 dark:text-zinc-200 truncate">
                                            {version?.original_filename || 'Dokumen Bukti Transaksi'}
                                        </p>
                                        <p className="text-[10px] text-slate-500 dark:text-zinc-400">
                                            {version?.created_at ? formatDate(version.created_at) : 'Tersimpan'} • {version?.file_size ? formatBytes(version.file_size) : 'PDF/Image'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1.5 shrink-0">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setShowPreviewModal(true)}
                                        className="h-7 px-2 text-[11px] font-semibold rounded-lg border-slate-200 dark:border-white/10"
                                    >
                                        <ExternalLink className="size-3 mr-1" />
                                        Lihat
                                    </Button>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-7 px-2 text-[11px] font-semibold rounded-lg border-slate-200 dark:border-white/10"
                                        asChild
                                    >
                                        <a href={downloadUrl} download>
                                            <Download className="size-3 mr-1" />
                                            Unduh
                                        </a>
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setIsReplacingProof(true)}
                                        className="h-7 px-2 text-[11px] font-medium text-slate-600 hover:text-slate-900 rounded-lg dark:text-zinc-400 dark:hover:text-white"
                                        title="Ganti Berkas Bukti"
                                    >
                                        Ganti
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        disabled={isDeleting}
                                        onClick={handleDeleteProof}
                                        className="h-7 size-7 p-0 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg"
                                        title="Hapus Berkas Bukti"
                                    >
                                        {isDeleting ? <Loader2 className="size-3 animate-spin" /> : <Trash2 className="size-3.5" />}
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            /* Direct Upload Dropzone */
                            <form onSubmit={handleUploadProof} className="space-y-2">
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
                                        }
                                    }}
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`cursor-pointer rounded-xl border-2 border-dashed p-3 text-center transition-all ${
                                        selectedFile
                                            ? 'border-emerald-400 bg-emerald-50/40 dark:bg-emerald-950/20'
                                            : isDragging
                                              ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/30 ring-2 ring-blue-500/20'
                                              : 'border-slate-200/90 bg-slate-50/50 hover:border-blue-400 hover:bg-slate-50/90 dark:border-white/10 dark:bg-white/[0.02]'
                                    }`}
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png,.webp,image/*,application/pdf"
                                        className="hidden"
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                                handleFileSelect(e.target.files[0]);
                                            }
                                        }}
                                    />

                                    <div className="flex items-center justify-center gap-2">
                                        <UploadCloud className={`size-4.5 ${selectedFile ? 'text-emerald-600' : 'text-slate-400'}`} />
                                        <span className="text-xs font-semibold text-slate-800 dark:text-zinc-200">
                                            {selectedFile ? selectedFile.name : 'Pilih atau seret berkas bukti ke sini'}
                                        </span>
                                        <span className="text-[10px] text-slate-500 dark:text-zinc-400">
                                            {selectedFile ? `(${formatBytes(selectedFile.size)})` : '(PDF, JPG, PNG maks 20MB)'}
                                        </span>
                                    </div>
                                </div>

                                {selectedFilePreview && (
                                    <div className="relative rounded-lg border border-slate-200/90 dark:border-white/10 overflow-hidden bg-slate-900/5 p-1 flex items-center justify-center h-20">
                                        <img
                                            src={selectedFilePreview}
                                            alt="Pratinjau"
                                            className="max-h-18 w-auto max-w-full object-contain rounded"
                                        />
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleFileSelect(null);
                                            }}
                                            className="absolute top-1.5 right-1.5 flex size-5 items-center justify-center rounded-full bg-slate-900/70 text-white hover:bg-rose-600 transition-colors"
                                        >
                                            <X className="size-3" />
                                        </button>
                                    </div>
                                )}

                                <div className="flex items-center justify-end gap-2 pt-0.5">
                                    {(hasProof || isReplacingProof) && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                setIsReplacingProof(false);
                                                handleFileSelect(null);
                                            }}
                                            className="h-7 text-xs font-semibold text-slate-500"
                                        >
                                            Batal
                                        </Button>
                                    )}
                                    <Button
                                        type="submit"
                                        size="sm"
                                        disabled={isUploading || !selectedFile}
                                        className="h-7.5 px-3.5 text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 rounded-lg shadow-2xs gap-1.5"
                                    >
                                        {isUploading ? (
                                            <>
                                                <Loader2 className="size-3.5 animate-spin" />
                                                <span>Mengunggah...</span>
                                            </>
                                        ) : (
                                            <>
                                                <UploadCloud className="size-3.5" />
                                                <span>Unggah Berkas</span>
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>

                {/* 4. Footer Bar: Minimal, Balanced & Clean */}
                <div className="border-t border-slate-100 px-5 py-3 dark:border-white/[0.06] bg-slate-50/60 dark:bg-[#151821]/60 flex flex-row items-center justify-between">
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

                        {target.entity === 'quotations' && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 rounded-lg border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:text-zinc-300 gap-1.5"
                                asChild
                            >
                                <a
                                    href={quotationRoutes.pdf.url(target.id)}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <FileDown className="size-3.5" />
                                    PDF Quotation
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
                                className="h-8 rounded-lg border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:text-zinc-300 gap-1.5 shadow-2xs"
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
                            className="h-8 rounded-lg bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-zinc-100 text-xs font-bold px-4 shadow-2xs"
                        >
                            Tutup
                        </Button>
                    </div>
                </div>

                {/* Sub-Dialog for Fullscreen Document Preview */}
                {showPreviewModal && hasProof && (
                    <Dialog open={showPreviewModal} onOpenChange={setShowPreviewModal}>
                        <DialogContent className="max-h-[92vh] sm:max-w-3xl flex flex-col p-0 gap-0 rounded-2xl overflow-hidden bg-white dark:bg-[#14161b] border border-slate-200 dark:border-white/10 shadow-2xl">
                            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-white/[0.06] bg-slate-50 dark:bg-[#161822]">
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-zinc-200">
                                    <FileText className="size-4 text-blue-500" />
                                    <span className="truncate">{version?.original_filename || 'Dokumen Bukti'}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Button size="sm" variant="outline" className="h-7 text-xs font-semibold" asChild>
                                        <a href={downloadUrl} download>
                                            <Download className="size-3 mr-1" />
                                            Unduh
                                        </a>
                                    </Button>
                                    <Button size="sm" variant="ghost" onClick={() => setShowPreviewModal(false)} className="size-7 p-0">
                                        <X className="size-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="h-[65vh] flex items-center justify-center p-2 bg-slate-900/5 dark:bg-black/40">
                                {isImage ? (
                                    <img
                                        src={previewUrl}
                                        alt="Bukti Transaksi"
                                        className="max-h-full max-w-full object-contain rounded-lg shadow-sm"
                                    />
                                ) : isPdf ? (
                                    <iframe
                                        src={`${previewUrl}#toolbar=1`}
                                        title="Bukti Transaksi"
                                        className="w-full h-full rounded-lg border-0 bg-white"
                                    />
                                ) : (
                                    <p className="text-xs text-slate-500">Pratinjau tidak tersedia untuk jenis berkas ini.</p>
                                )}
                            </div>
                        </DialogContent>
                    </Dialog>
                )}
            </DialogContent>
        </Dialog>
    );
}
