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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { formatBytes, formatDate, formatMoney, terbilang } from '@/lib/format';
import * as invoiceRoutes from '@/routes/finance/invoices';
import * as paymentRoutes from '@/routes/finance/payments';
import * as quotationRoutes from '@/routes/finance/quotations';
import type {
    FinanceEntityProofTarget,
    ProofDocumentData,
} from './finance-proof-dialog';
import { financeDialogPanelClass } from './finance-dialog-design';
import { FinanceDialogHeader } from './finance-dialog-ui';

export type FinanceDetailTarget = {
    id: string;
    entity:
        | 'expenses'
        | 'payments'
        | 'invoices'
        | 'quotations'
        | 'payrolls'
        | 'partner-transactions'
        | 'transfers'
        | 'client-trust-funds';
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
    client?: { id?: string; display_name: string; avatar_path?: string | null };
    account?: { id: string; name: string };
    partner?: {
        id: number;
        name: string;
        avatar_path?: string | null;
        avatar_url?: string | null;
    };
    user?: {
        id?: number | string;
        name: string;
        email?: string;
        avatar_path?: string | null;
        avatar_url?: string | null;
        position_title?: string;
        department?: string;
        employee_code?: string;
        bank_name?: string;
        bank_account_number?: string;
        bank_account_holder?: string;
    };
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

export const CATEGORY_LABELS: Record<string, string> = {
    court_fee: 'Panjar Biaya Pengadilan (Court Fee)',
    expert_witness: 'Honorarium Saksi Ahli',
    travel: 'Transportasi & Perjalanan Dinas Perkara',
    courier: 'Jasa Kurir & Pengiriman Dokumen',
    printing: 'Pencetakan & Penggandaan Berkas Perkara',
    notary_fee: 'Biaya Notaris / Legalisasi',
    police_investigation: 'Biaya Pendampingan Kepolisian',
    tax_consultant: 'Konsultan Pajak & Audit',
    translator: 'Penerjemah Tersumpah (Sworn Translator)',
    office_supplies: 'Perlengkapan Alat Tulis Kantor (ATK)',
    utilities: 'Tagihan Utilitas (Listrik, Air & Internet)',
    rent: 'Sewa Gedung / Ruang Kantor',
    salary: 'Beban Gaji Karyawan',
    marketing: 'Pemasaran & Hubungan Masyarakat',
    software_subscription: 'Langganan Software & Lisensi Cloud',
    meals_entertainment: 'Konsumsi & Jamuan Klien',
    advance_incurred: 'Talangan Biaya oleh Partner (+)',
    advance_reimbursed: 'Pengembalian Talangan Partner (-)',
    profit_distribution: 'Bagi Hasil / Dividen Partner',
    capital_injection: 'Setoran Modal Partner (+)',
    draw_prive: 'Penarikan Dana Prive Partner (-)',
    deposit_in: 'Penerimaan Dana Titipan Escrow (+)',
    deposit_out: 'Penyaluran / Pengembalian Titipan (-)',
    bank_transfer: 'Transfer Antar Rekening Bank',
    other: 'Biaya Operasional Lainnya',
};

export function humanizeCategory(category?: string): string {
    if (!category) return 'Transaksi Umum';
    if (CATEGORY_LABELS[category]) return CATEGORY_LABELS[category];
    return category
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

function getAvatarUrl(avatarPath?: string | null): string {
    if (!avatarPath || avatarPath.trim() === '') return '';
    if (avatarPath.startsWith('http') || avatarPath.startsWith('/'))
        return avatarPath;
    return `/storage/${avatarPath}`;
}

function getInitials(name?: string): string {
    if (!name) return 'U';
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((n) => n[0].toUpperCase())
        .join('');
}

export function FinanceDetailModal({
    target,
    isOpen,
    onClose,
    onEdit,
    onDelete,
    onOpenProof,
}: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [copied, setCopied] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [selectedFilePreview, setSelectedFilePreview] = useState<
        string | null
    >(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isReplacingProof, setIsReplacingProof] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    if (!target) return null;

    const proof = target.proof_document || target.proofDocument;
    const version = proof?.current_version;
    const hasProof = Boolean(proof && version?.file_path);
    const isImage = Boolean(version?.mime_type?.startsWith('image/'));
    const isPdf = Boolean(
        version?.mime_type?.includes('pdf') ||
        version?.file_path?.endsWith('.pdf'),
    );
    const previewUrl = version?.file_path
        ? `/storage/${version.file_path}`
        : '';
    const downloadUrl =
        proof && target.id
            ? `/finance/${target.entity}/${target.id}/proof/download`
            : previewUrl;

    const handleCopyRef = () => {
        if (!target.reference_number) return;
        navigator.clipboard.writeText(target.reference_number);
        setCopied(true);
        toast.success(
            `Nomor referensi ${target.reference_number} disalin ke clipboard`,
        );
        setTimeout(() => setCopied(false), 2000);
    };

    const handleFileSelect = (file: File | null) => {
        setSelectedFile(file);
        if (selectedFilePreview) {
            URL.revokeObjectURL(selectedFilePreview);
            setSelectedFilePreview(null);
        }
        if (file && file.type.startsWith('image/')) {
            setSelectedFilePreview(URL.createObjectURL(file));
        }
    };

    const handleUploadProof = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('proof', selectedFile);

        router.post(`/finance/${target.entity}/${target.id}/proof`, formData, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setIsUploading(false);
                setSelectedFile(null);
                setIsReplacingProof(false);
                if (selectedFilePreview) {
                    URL.revokeObjectURL(selectedFilePreview);
                    setSelectedFilePreview(null);
                }
                toast.success('Berkas bukti transaksi berhasil diunggah!');
            },
            onError: (errors) => {
                setIsUploading(false);
                const errMsg =
                    (Object.values(errors)[0] as string) ||
                    'Gagal mengunggah berkas bukti.';
                toast.error(errMsg);
            },
        });
    };

    const handleDeleteProof = () => {
        if (
            !confirm(
                'Apakah Anda yakin ingin menghapus berkas bukti transaksi ini?',
            )
        )
            return;

        setIsDeleting(true);
        router.delete(`/finance/${target.entity}/${target.id}/proof`, {
            preserveScroll: true,
            onSuccess: () => {
                setIsDeleting(false);
                setIsReplacingProof(false);
                toast.success('Berkas bukti transaksi berhasil dihapus.');
            },
            onError: () => {
                setIsDeleting(false);
                toast.error('Gagal menghapus berkas bukti transaksi.');
            },
        });
    };

    const entityConfigs: Record<
        string,
        {
            badge: string;
            icon: typeof Receipt;
            iconBg: string;
            natureLabel: string;
            chipBg: string;
        }
    > = {
        invoices: {
            badge: 'Invoice Tagihan',
            icon: ReceiptText,
            iconBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20',
            natureLabel: 'TOTAL TAGIHAN INVOICE',
            chipBg: 'bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/40',
        },
        quotations: {
            badge: 'Quotation Penawaran',
            icon: FilePlus2,
            iconBg: 'bg-slate-500/10 text-slate-700 dark:text-zinc-300 border border-slate-500/20',
            natureLabel: 'ESTIMASI NILAI PENAWARAN',
            chipBg: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700',
        },
        expenses: {
            badge: target.matter ? 'Disbursement Perkara' : 'Beban Operasional',
            icon: WalletCards,
            iconBg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20',
            natureLabel: 'PENGELUARAN KAS (DEBIT)',
            chipBg: 'bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/40',
        },
        payments: {
            badge: 'Penerimaan Kas',
            icon: Banknote,
            iconBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
            natureLabel: 'PENERIMAAN KAS (KREDIT)',
            chipBg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40',
        },
        payrolls: {
            badge: 'Slip Gaji Karyawan',
            icon: Receipt,
            iconBg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20',
            natureLabel: 'TOTAL TAKE HOME PAY (THP)',
            chipBg: 'bg-indigo-50 text-indigo-700 border-indigo-200/80 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/40',
        },
        'partner-transactions': {
            badge: 'Mutasi Hak Partner',
            icon: HandCoins,
            iconBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
            natureLabel: 'NOMINAL TRANSAKSI PARTNER',
            chipBg: 'bg-amber-50 text-amber-800 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/40',
        },
        transfers: {
            badge: 'Transfer Antar Rekening',
            icon: ArrowLeftRight,
            iconBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20',
            natureLabel: 'PEMINDAHAN DANA BANK',
            chipBg: 'bg-purple-50 text-purple-700 border-purple-200/80 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/40',
        },
        'client-trust-funds': {
            badge: 'Titipan Escrow Klien',
            icon: Lock,
            iconBg: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20',
            natureLabel: 'MUTASI REKENING TITIPAN',
            chipBg: 'bg-cyan-50 text-cyan-700 border-cyan-200/80 dark:bg-cyan-950/40 dark:text-cyan-300 dark:border-cyan-800/40',
        },
    };

    const cfg = entityConfigs[target.entity] || {
        badge: 'Detail Keuangan',
        icon: Receipt,
        iconBg: 'bg-slate-500/10 text-slate-700 dark:text-zinc-300 border border-slate-500/20',
        natureLabel: 'NOMINAL TRANSAKSI',
        chipBg: 'bg-slate-100 text-slate-700 border-slate-200',
    };
    const IconComp = cfg.icon;

    const displayCategory = humanizeCategory(target.category);
    const displayTitle =
        target.title && target.title !== target.category
            ? target.title
            : displayCategory;

    const lineItems =
        target.items ||
        target.rawItem?.items ||
        target.rawItem?.line_items ||
        [];
    const payrollDetails =
        target.payroll_details ||
        (target.rawItem && {
            basic_salary: target.rawItem.basic_salary ?? 0,
            fixed_allowance: target.rawItem.fixed_allowance ?? 0,
            transport_meal_allowance:
                target.rawItem.transport_meal_allowance ?? 0,
            overtime_amount: target.rawItem.overtime_amount ?? 0,
            bonus_amount: target.rawItem.bonus_amount ?? 0,
            deductions_amount: target.rawItem.deductions_amount ?? 0,
            tax_deduction_amount: target.rawItem.tax_deduction_amount ?? 0,
        });

    // Determine if general specs exist so we never render an empty container
    const hasGeneralSpecs = Boolean(
        target.category ||
        target.vendor ||
        target.charge_to ||
        (target.partner && target.entity !== 'partner-transactions') ||
        target.method ||
        (target.entity === 'invoices' &&
            typeof target.outstanding_amount === 'number'),
    );

    // Filter out redundant notes identical to the title or reference code
    const rawNote = (target.notes || target.description || '').trim();
    const isDuplicateNote = Boolean(
        !rawNote ||
        rawNote === target.title ||
        rawNote === target.reference_number ||
        rawNote === `${target.title} (${target.reference_number})` ||
        (target.reference_number && rawNote === `(${target.reference_number})`),
    );

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
            <DialogContent className={financeDialogPanelClass('default')}>
                {/* 1. Header: Clean, Crisp & High-Density */}
                <div className="border-b border-slate-100 bg-slate-50/40 px-5 py-3.5 sm:px-6 dark:border-white/[0.06] dark:bg-[#151821]/40">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 flex-1 items-start gap-3.5">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-slate-500 dark:border-white/10 dark:bg-white/[0.06] dark:text-zinc-400">
                                <IconComp className="size-[18px]" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="mb-1 flex flex-wrap items-center gap-1.5">
                                    <span className="rounded-md bg-slate-200/70 px-2 py-0.5 text-[10px] font-bold tracking-wider text-slate-700 uppercase dark:bg-white/[0.08] dark:text-zinc-300">
                                        {cfg.badge}
                                    </span>
                                    {target.status && (
                                        <StatusBadge value={target.status} />
                                    )}
                                    {target.reference_number && (
                                        <button
                                            type="button"
                                            onClick={handleCopyRef}
                                            className="inline-flex items-center gap-1 rounded-md border border-slate-200/90 bg-white px-2 py-0.5 font-mono text-[10px] font-medium text-slate-700 shadow-2xs transition-colors hover:border-slate-300 hover:bg-slate-50 dark:border-white/10 dark:bg-[#1a1d26] dark:text-zinc-300"
                                            title="Klik untuk menyalin nomor referensi"
                                        >
                                            {copied ? (
                                                <>
                                                    <Check className="size-2.5 text-emerald-600 dark:text-emerald-400" />
                                                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                                        Tersalin
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="size-2.5 text-slate-400" />
                                                    <span>
                                                        {
                                                            target.reference_number
                                                        }
                                                    </span>
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>

                                <h3 className="line-clamp-2 text-sm leading-[18px] font-semibold text-slate-900 dark:text-white">
                                    {displayTitle}
                                </h3>

                                {target.matter ? (
                                    <div className="mt-1 flex items-center gap-1.5 truncate text-xs text-slate-600 dark:text-zinc-400">
                                        <FolderKanban className="size-3.5 shrink-0 text-blue-600 dark:text-blue-400" />
                                        <span className="font-mono font-semibold text-slate-800 dark:text-zinc-200">
                                            {target.matter.matter_number}
                                        </span>
                                        <span>•</span>
                                        <span className="truncate font-medium">
                                            {target.matter.title}
                                        </span>
                                    </div>
                                ) : target.client ? (
                                    <div className="mt-1 flex items-center gap-1.5 truncate text-xs text-slate-600 dark:text-zinc-400">
                                        <User className="size-3.5 shrink-0 text-slate-400" />
                                        <span>Klien:</span>
                                        <span className="truncate font-semibold text-slate-800 dark:text-zinc-200">
                                            {target.client.display_name}
                                        </span>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Light & Crisp Executive Monetary Voucher Card (Pewarnaan Terang, Bersih & Elegan) */}
                <div className="px-5 pt-3.5 pb-2">
                    <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-gradient-to-br from-slate-50/90 via-white to-slate-50/70 p-4 text-slate-900 shadow-2xs dark:border-white/10 dark:from-[#181a24] dark:via-[#14161f] dark:to-[#181a24] dark:text-white">
                        <div className="relative z-10 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[9.5px] font-bold tracking-wider text-slate-500 uppercase dark:text-zinc-400">
                                        {cfg.natureLabel}
                                    </span>
                                </div>
                                <div className="mt-0.5 flex items-baseline gap-1.5">
                                    <span className="font-mono text-2xl font-black tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                                        {formatMoney(
                                            target.amount,
                                            target.currency || 'IDR',
                                        )}
                                    </span>
                                </div>
                                <p
                                    className="mt-0.5 line-clamp-1 text-[10.5px] text-slate-500 italic dark:text-zinc-400"
                                    title={terbilang(target.amount) + ' Rupiah'}
                                >
                                    {target.amount > 0
                                        ? `“${terbilang(target.amount)} Rupiah”`
                                        : 'Nol Rupiah'}
                                </p>
                            </div>

                            {/* Meta Tags Column (Crisp Light Badges) */}
                            <div className="flex shrink-0 flex-wrap items-start gap-1.5 border-t border-slate-100 pt-2 sm:flex-col sm:items-end sm:border-t-0 sm:pt-0 dark:border-white/[0.06]">
                                {target.date && (
                                    <div className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/80 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 shadow-2xs dark:border-white/10 dark:bg-white/[0.06] dark:text-zinc-200">
                                        <Calendar className="size-3 text-slate-400" />
                                        <span>{formatDate(target.date)}</span>
                                    </div>
                                )}
                                {(target.account ||
                                    (target.partner &&
                                        target.entity !==
                                            'partner-transactions')) && (
                                    <div className="inline-flex max-w-[200px] items-center gap-1.5 truncate rounded-lg border border-slate-200/80 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 shadow-2xs dark:border-white/10 dark:bg-white/[0.06] dark:text-zinc-200">
                                        <Building2 className="size-3 shrink-0 text-blue-500" />
                                        <span className="truncate">
                                            {target.account?.name ||
                                                (target.partner
                                                    ? `Talangan ${target.partner.name}`
                                                    : 'Kas Kantor')}
                                        </span>
                                    </div>
                                )}
                                {target.due_date && (
                                    <div className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200/80 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-800 shadow-2xs dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-300">
                                        <Clock className="size-3 text-amber-600 dark:text-amber-400" />
                                        <span>
                                            Jatuh Tempo:{' '}
                                            {formatDate(target.due_date)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Specifications & Dynamic Sections (Scrollable) */}
                <div className="max-h-[46vh] flex-1 [scrollbar-width:thin] space-y-3 overflow-y-auto px-5 py-2 text-xs">
                    {/* User Profile Card for Payroll (Kalo ada penamaan user panggil photo profile) */}
                    {target.user && target.entity === 'payrolls' && (
                        <div className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-slate-50/80 p-3 shadow-2xs dark:border-white/10 dark:bg-white/[0.03]">
                            <Avatar className="size-10 shrink-0 rounded-xl border border-slate-200 shadow-2xs dark:border-white/10">
                                <AvatarImage
                                    src={getAvatarUrl(
                                        target.user.avatar_path ||
                                            target.user.avatar_url,
                                    )}
                                    alt={target.user.name}
                                />
                                <AvatarFallback className="rounded-xl bg-indigo-600 text-xs font-bold text-white">
                                    {getInitials(target.user.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                    <h4 className="truncate text-xs font-bold text-slate-900 dark:text-white">
                                        {target.user.name}
                                    </h4>
                                    {target.user.employee_code && (
                                        <span className="py-0.2 rounded bg-slate-200/80 px-1.5 font-mono text-[9.5px] font-semibold text-slate-700 dark:bg-white/10 dark:text-zinc-300">
                                            {target.user.employee_code}
                                        </span>
                                    )}
                                </div>
                                <p className="mt-0.5 truncate text-[11px] text-slate-500 dark:text-zinc-400">
                                    {target.user.position_title ||
                                        'Staf Pegawai'}{' '}
                                    {target.user.department
                                        ? `• ${target.user.department}`
                                        : ''}
                                </p>
                            </div>
                            {(target.user.bank_name ||
                                target.user.bank_account_number) && (
                                <div className="hidden shrink-0 text-right text-[10px] text-slate-500 sm:block dark:text-zinc-400">
                                    <span className="font-semibold text-slate-700 dark:text-zinc-200">
                                        {target.user.bank_name || 'Rekening'}
                                    </span>
                                    <span className="block font-mono">
                                        {target.user.bank_account_number}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Partner Profile Card for Partner Transactions */}
                    {target.partner &&
                        target.entity === 'partner-transactions' && (
                            <div className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-slate-50/80 p-3 shadow-2xs dark:border-white/10 dark:bg-white/[0.03]">
                                <Avatar className="size-10 shrink-0 rounded-full border border-slate-200 shadow-2xs dark:border-white/10">
                                    <AvatarImage
                                        src={getAvatarUrl(
                                            target.partner.avatar_path ||
                                                (target.partner as any)
                                                    .avatar_url ||
                                                target.user?.avatar_path,
                                        )}
                                        alt={target.partner.name}
                                    />
                                    <AvatarFallback className="rounded-full bg-amber-600 text-xs font-bold text-white">
                                        {getInitials(target.partner.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className="truncate text-xs font-bold text-slate-900 dark:text-white">
                                            {target.partner.name}
                                        </h4>
                                        <span className="py-0.2 rounded border border-amber-200/60 bg-amber-50 px-1.5 text-[9.5px] font-bold text-amber-700 dark:border-amber-800/40 dark:bg-amber-950/40 dark:text-amber-300">
                                            Partner
                                        </span>
                                    </div>
                                    <p className="mt-0.5 truncate text-[11px] text-slate-500 dark:text-zinc-400">
                                        {displayCategory}
                                    </p>
                                </div>
                            </div>
                        )}

                    {/* Compact Specifications Grid (Hanya dirender bila field tersedia, TIDAK AKAN PERNAH KOSONG) */}
                    {hasGeneralSpecs && (
                        <div className="grid grid-cols-1 gap-x-4 gap-y-2 rounded-xl border border-slate-200/90 bg-slate-50/40 p-2.5 sm:grid-cols-2 dark:border-white/[0.06] dark:bg-[#161822]/40">
                            {/* Kategori Pos */}
                            {target.category &&
                                target.entity !== 'partner-transactions' && (
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase dark:text-zinc-500">
                                            Kategori Pembukuan
                                        </span>
                                        <div className="flex items-center gap-1 font-medium text-slate-800 dark:text-zinc-200">
                                            <Tag className="size-3 text-slate-400" />
                                            <span>{displayCategory}</span>
                                        </div>
                                    </div>
                                )}

                            {/* Penerima / Vendor */}
                            {target.vendor && (
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase dark:text-zinc-500">
                                        Pihak Penerima / Vendor
                                    </span>
                                    <span className="font-semibold text-slate-900 dark:text-white">
                                        {target.vendor}
                                    </span>
                                </div>
                            )}

                            {/* Beban Ditagihkan Ke */}
                            {target.charge_to && (
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase dark:text-zinc-500">
                                        Alokasi Pembebanan
                                    </span>
                                    <span className="font-medium text-slate-800 dark:text-zinc-200">
                                        {target.charge_to === 'client'
                                            ? 'Tagihan Klien (Disbursement)'
                                            : 'Overhead Firma Kantor'}
                                    </span>
                                </div>
                            )}

                            {/* Ditalangi Partner (dengan Photo Profile Avatar) */}
                            {target.partner &&
                                target.entity !== 'partner-transactions' && (
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase dark:text-zinc-500">
                                            Talangan Partner
                                        </span>
                                        <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white">
                                            <Avatar className="size-5 shrink-0 rounded-full border border-slate-200">
                                                <AvatarImage
                                                    src={getAvatarUrl(
                                                        target.partner
                                                            .avatar_path ||
                                                            (
                                                                target.partner as any
                                                            ).avatar_url,
                                                    )}
                                                    alt={target.partner.name}
                                                />
                                                <AvatarFallback className="bg-amber-100 text-[8px] font-bold text-amber-800">
                                                    {getInitials(
                                                        target.partner.name,
                                                    )}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="truncate">
                                                {target.partner.name}
                                            </span>
                                        </div>
                                    </div>
                                )}

                            {/* Metode Pembayaran */}
                            {target.method && (
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase dark:text-zinc-500">
                                        Metode Transaksi
                                    </span>
                                    <span className="font-medium text-slate-800 uppercase dark:text-zinc-200">
                                        {target.method}
                                    </span>
                                </div>
                            )}

                            {/* Status Piutang jika Invoice */}
                            {target.entity === 'invoices' &&
                                typeof target.outstanding_amount ===
                                    'number' && (
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase dark:text-zinc-500">
                                            Sisa Piutang Tagihan
                                        </span>
                                        <span className="font-mono font-bold">
                                            {target.outstanding_amount === 0 ? (
                                                <span className="text-emerald-600 dark:text-emerald-400">
                                                    Lunas Penuh (Rp 0)
                                                </span>
                                            ) : (
                                                <span className="text-amber-600 dark:text-amber-400">
                                                    {formatMoney(
                                                        target.outstanding_amount,
                                                        target.currency,
                                                    )}
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                )}
                        </div>
                    )}

                    {/* Line Items Table if Invoice or Quotation */}
                    {lineItems.length > 0 && (
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <span className="text-[10.5px] font-bold tracking-wider text-slate-600 uppercase dark:text-zinc-400">
                                    Rincian Layanan &amp; Pos Tagihan (
                                    {lineItems.length} Item)
                                </span>
                            </div>
                            <div className="overflow-hidden rounded-xl border border-slate-200/90 shadow-2xs dark:border-white/[0.06]">
                                <table className="w-full text-left text-xs">
                                    <thead className="border-b border-slate-200/90 bg-slate-100/80 text-[10px] font-bold tracking-wider text-slate-600 uppercase dark:border-white/[0.06] dark:bg-zinc-800/80 dark:text-zinc-300">
                                        <tr>
                                            <th className="px-3 py-2">
                                                Uraian Pekerjaan / Honorarium
                                            </th>
                                            <th className="w-14 px-2 py-2 text-center">
                                                Qty
                                            </th>
                                            <th className="py-2 pr-3 text-right">
                                                Subtotal
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 bg-white dark:divide-white/[0.04] dark:bg-[#14161f]">
                                        {lineItems.map(
                                            (item: any, idx: number) => {
                                                const itemQty =
                                                    Number(item.quantity) || 1;
                                                const itemPrice = Number(
                                                    item.unit_amount ??
                                                        item.unit_price ??
                                                        item.amount ??
                                                        0,
                                                );
                                                const rowTotal =
                                                    item.total_amount
                                                        ? Number(
                                                              item.total_amount,
                                                          )
                                                        : itemQty * itemPrice;
                                                return (
                                                    <tr
                                                        key={idx}
                                                        className="transition-colors hover:bg-slate-50/60 dark:hover:bg-white/[0.02]"
                                                    >
                                                        <td className="px-3 py-2.5 leading-relaxed font-medium text-slate-800 dark:text-zinc-200">
                                                            {item.description}
                                                        </td>
                                                        <td className="px-2 py-2.5 text-center font-mono text-slate-600 dark:text-zinc-400">
                                                            {itemQty}
                                                        </td>
                                                        <td className="py-2.5 pr-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                                                            {formatMoney(
                                                                rowTotal,
                                                                target.currency ||
                                                                    'IDR',
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            },
                                        )}
                                    </tbody>
                                    <tfoot className="border-t border-slate-200/90 bg-slate-50 dark:border-white/[0.06] dark:bg-zinc-800/40">
                                        <tr>
                                            <td
                                                colSpan={2}
                                                className="px-3 py-2 text-right text-[11px] font-bold text-slate-600 uppercase dark:text-zinc-300"
                                            >
                                                Total Akumulasi:
                                            </td>
                                            <td className="py-2 pr-3 text-right font-mono text-xs font-black text-slate-900 dark:text-white">
                                                {formatMoney(
                                                    target.amount,
                                                    target.currency || 'IDR',
                                                )}
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
                            <span className="text-[10.5px] font-bold tracking-wider text-slate-600 uppercase dark:text-zinc-400">
                                Rincian Komponen Gaji &amp; Potongan
                            </span>
                            <div className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
                                <div className="space-y-1 rounded-xl border border-emerald-200/80 bg-emerald-50/40 p-2.5 dark:border-emerald-900/40 dark:bg-emerald-950/20">
                                    <span className="text-[10px] font-bold text-emerald-700 uppercase dark:text-emerald-400">
                                        Penghasilan (+)
                                    </span>
                                    <div className="flex justify-between text-slate-700 dark:text-zinc-300">
                                        <span>Gaji Pokok:</span>
                                        <span className="font-mono font-semibold">
                                            {formatMoney(
                                                payrollDetails.basic_salary,
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-slate-700 dark:text-zinc-300">
                                        <span>Tunjangan Tetap:</span>
                                        <span className="font-mono">
                                            {formatMoney(
                                                payrollDetails.fixed_allowance,
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-slate-700 dark:text-zinc-300">
                                        <span>Uang Makan &amp; Transport:</span>
                                        <span className="font-mono">
                                            {formatMoney(
                                                payrollDetails.transport_meal_allowance,
                                            )}
                                        </span>
                                    </div>
                                    {payrollDetails.bonus_amount > 0 && (
                                        <div className="flex justify-between text-slate-700 dark:text-zinc-300">
                                            <span>Bonus Perkara:</span>
                                            <span className="font-mono">
                                                {formatMoney(
                                                    payrollDetails.bonus_amount,
                                                )}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-1 rounded-xl border border-rose-200/80 bg-rose-50/40 p-2.5 dark:border-rose-900/40 dark:bg-rose-950/20">
                                    <span className="text-[10px] font-bold text-rose-700 uppercase dark:text-rose-400">
                                        Potongan (-)
                                    </span>
                                    <div className="flex justify-between text-slate-700 dark:text-zinc-300">
                                        <span>Potongan Kasbon / Lainnya:</span>
                                        <span className="font-mono">
                                            -{' '}
                                            {formatMoney(
                                                payrollDetails.deductions_amount,
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-slate-700 dark:text-zinc-300">
                                        <span>PPh 21 Pajak:</span>
                                        <span className="font-mono">
                                            -{' '}
                                            {formatMoney(
                                                payrollDetails.tax_deduction_amount,
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Payment Allocations Table */}
                    {target.allocations && target.allocations.length > 0 && (
                        <div className="space-y-1.5">
                            <span className="text-[10.5px] font-bold tracking-wider text-slate-600 uppercase dark:text-zinc-400">
                                Alokasi Pembayaran ke Tagihan Invoice
                            </span>
                            <div className="overflow-hidden rounded-xl border border-slate-200/90 dark:border-white/[0.06]">
                                <table className="w-full text-left text-xs">
                                    <thead className="border-b border-slate-200/90 bg-slate-100/80 text-[10px] font-bold tracking-wider text-slate-600 uppercase dark:border-white/[0.06] dark:bg-zinc-800/80 dark:text-zinc-300">
                                        <tr>
                                            <th className="px-3 py-2">
                                                Nomor Invoice
                                            </th>
                                            <th className="py-2 pr-3 text-right">
                                                Nominal Dialokasikan
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 bg-white dark:divide-white/[0.04] dark:bg-[#14161f]">
                                        {target.allocations.map((alloc) => (
                                            <tr key={alloc.id}>
                                                <td className="px-3 py-2 font-mono font-semibold text-slate-900 dark:text-white">
                                                    {
                                                        alloc.invoice
                                                            .invoice_number
                                                    }
                                                </td>
                                                <td className="py-2 pr-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                                    {formatMoney(
                                                        alloc.amount,
                                                        alloc.invoice
                                                            .currency || 'IDR',
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Description / Notes Box (Hanya dirender jika bukan duplikasi dari judul) */}
                    {!isDuplicateNote && rawNote && (
                        <div className="space-y-0.5 rounded-xl border border-slate-200/80 bg-slate-50/50 p-2.5 dark:border-white/[0.06] dark:bg-[#161822]/40">
                            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase dark:text-zinc-500">
                                Catatan Khusus
                            </span>
                            <p className="text-xs leading-relaxed whitespace-pre-wrap text-slate-700 dark:text-zinc-300">
                                {rawNote}
                            </p>
                        </div>
                    )}

                    {/* 4. Streamlined Proof Document & Direct Upload Card */}
                    <div className="space-y-2 rounded-xl border border-slate-200/90 bg-white p-3 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161f]/60">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-zinc-200">
                                <Paperclip className="size-3.5 text-blue-600 dark:text-blue-400" />
                                <span>Dokumen Bukti Transaksi</span>
                            </div>
                            {hasProof && !isReplacingProof ? (
                                <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-emerald-600 dark:text-emerald-400">
                                    <FileCheck className="size-3.5" />
                                    Terlampir (
                                    {version?.file_size
                                        ? formatBytes(version.file_size)
                                        : 'File'}
                                    )
                                </span>
                            ) : (
                                <span className="flex items-center gap-1 text-[10px] text-slate-400">
                                    <ShieldCheck className="size-3 text-emerald-500" />
                                    Terisolasi aman
                                </span>
                            )}
                        </div>

                        {hasProof && !isReplacingProof ? (
                            /* Already Attached Proof State */
                            <div className="flex flex-col justify-between gap-2 rounded-xl border border-slate-200/70 bg-slate-50/90 p-2.5 sm:flex-row sm:items-center dark:border-white/[0.06] dark:bg-white/[0.03]">
                                <div className="flex min-w-0 flex-1 items-center gap-2.5">
                                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                                        {isImage ? (
                                            <FileImage className="size-4.5" />
                                        ) : (
                                            <FileText className="size-4.5" />
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-xs font-semibold text-slate-800 dark:text-zinc-200">
                                            {version?.original_filename ||
                                                'Dokumen Bukti Transaksi'}
                                        </p>
                                        <p className="text-[10px] text-slate-500 dark:text-zinc-400">
                                            {version?.created_at
                                                ? formatDate(version.created_at)
                                                : 'Tersimpan'}{' '}
                                            •{' '}
                                            {version?.file_size
                                                ? formatBytes(version.file_size)
                                                : 'PDF/Image'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex shrink-0 items-center gap-1.5">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            setShowPreviewModal(true)
                                        }
                                        className="h-7 rounded-lg border-slate-200 px-2 text-[11px] font-semibold dark:border-white/10"
                                    >
                                        <ExternalLink className="mr-1 size-3" />
                                        Lihat
                                    </Button>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-7 rounded-lg border-slate-200 px-2 text-[11px] font-semibold dark:border-white/10"
                                        asChild
                                    >
                                        <a href={downloadUrl} download>
                                            <Download className="mr-1 size-3" />
                                            Unduh
                                        </a>
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            setIsReplacingProof(true)
                                        }
                                        className="h-7 rounded-lg px-2 text-[11px] font-medium text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white"
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
                                        className="size-7 h-7 rounded-lg p-0 text-rose-500 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/30"
                                        title="Hapus Berkas Bukti"
                                    >
                                        {isDeleting ? (
                                            <Loader2 className="size-3 animate-spin" />
                                        ) : (
                                            <Trash2 className="size-3.5" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            /* Direct Upload Dropzone (Compact) */
                            <form
                                onSubmit={handleUploadProof}
                                className="space-y-2"
                            >
                                <div
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                        setIsDragging(true);
                                    }}
                                    onDragLeave={() => setIsDragging(false)}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        setIsDragging(false);
                                        if (
                                            e.dataTransfer.files &&
                                            e.dataTransfer.files[0]
                                        ) {
                                            handleFileSelect(
                                                e.dataTransfer.files[0],
                                            );
                                        }
                                    }}
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                    className={`cursor-pointer rounded-xl border-2 border-dashed p-2.5 text-center transition-all ${
                                        selectedFile
                                            ? 'border-emerald-400 bg-emerald-50/40 dark:bg-emerald-950/20'
                                            : isDragging
                                              ? 'border-blue-500 bg-blue-50/60 ring-2 ring-blue-500/20 dark:bg-blue-950/30'
                                              : 'border-slate-200/90 bg-slate-50/50 hover:border-blue-400 hover:bg-slate-50/90 dark:border-white/10 dark:bg-white/[0.02]'
                                    }`}
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png,.webp,image/*,application/pdf"
                                        className="hidden"
                                        onChange={(e) => {
                                            if (
                                                e.target.files &&
                                                e.target.files[0]
                                            ) {
                                                handleFileSelect(
                                                    e.target.files[0],
                                                );
                                            }
                                        }}
                                    />

                                    <div className="flex items-center justify-center gap-2">
                                        <UploadCloud
                                            className={`size-4 ${selectedFile ? 'text-emerald-600' : 'text-slate-400'}`}
                                        />
                                        <span className="text-xs font-semibold text-slate-800 dark:text-zinc-200">
                                            {selectedFile
                                                ? selectedFile.name
                                                : 'Pilih atau seret berkas bukti ke sini'}
                                        </span>
                                        <span className="text-[10px] text-slate-500 dark:text-zinc-400">
                                            {selectedFile
                                                ? `(${formatBytes(selectedFile.size)})`
                                                : '(PDF, JPG, PNG maks 20MB)'}
                                        </span>
                                    </div>
                                </div>

                                {selectedFilePreview && (
                                    <div className="relative flex h-18 items-center justify-center overflow-hidden rounded-lg border border-slate-200/90 bg-slate-900/5 p-1 dark:border-white/10">
                                        <img
                                            src={selectedFilePreview}
                                            alt="Pratinjau"
                                            className="max-h-16 w-auto max-w-full rounded object-contain"
                                        />
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleFileSelect(null);
                                            }}
                                            className="absolute top-1.5 right-1.5 flex size-5 items-center justify-center rounded-full bg-slate-900/70 text-white transition-colors hover:bg-rose-600"
                                        >
                                            <X className="size-3" />
                                        </button>
                                    </div>
                                )}

                                {selectedFile && (
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
                                            disabled={
                                                isUploading || !selectedFile
                                            }
                                            className="h-7.5 gap-1.5 rounded-lg bg-blue-600 px-3.5 text-xs font-semibold text-white shadow-2xs hover:bg-blue-700 disabled:opacity-40"
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
                                )}
                            </form>
                        )}
                    </div>
                </div>

                {/* 4. Footer Bar: Minimal, Balanced & Clean */}
                <div className="flex flex-row items-center justify-between border-t border-slate-100 bg-slate-50/60 px-5 py-3 dark:border-white/[0.06] dark:bg-[#151821]/60">
                    <div>
                        {onDelete && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                    onDelete(target.rawItem || target)
                                }
                                className="h-8 gap-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30"
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
                                className="h-8 gap-1.5 rounded-lg border-slate-200 text-xs font-semibold text-blue-600 hover:bg-blue-50 dark:border-white/10 dark:text-blue-400"
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
                                className="h-8 gap-1.5 rounded-lg border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:text-zinc-300"
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

                        {onEdit && (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    onClose();
                                    onEdit(target.rawItem || target);
                                }}
                                className="h-8 gap-1.5 rounded-lg border-slate-200 text-xs font-semibold text-slate-800 hover:bg-slate-100 dark:border-white/10 dark:text-zinc-200"
                            >
                                <Pencil className="size-3.5" />
                                Edit Data
                            </Button>
                        )}

                        <Button
                            type="button"
                            size="sm"
                            onClick={onClose}
                            className="h-8 rounded-lg bg-slate-900 px-4 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-zinc-200"
                        >
                            Tutup
                        </Button>
                    </div>
                </div>
            </DialogContent>

            {/* Document Preview Sub-Modal */}
            {hasProof && version && (
                <Dialog
                    open={showPreviewModal}
                    onOpenChange={setShowPreviewModal}
                >
                    <DialogContent
                        className={`${financeDialogPanelClass('preview')} h-[88dvh]`}
                    >
                        <FinanceDialogHeader
                            icon={FileText}
                            eyebrow="Pratinjau Bukti Keuangan"
                            title={version.original_filename}
                            description={`${formatBytes(version.file_size)} • Diunggah ${formatDate(version.created_at)}`}
                            tone="neutral"
                            actions={
                                <Button
                                    variant="outline"
                                    size="sm"
                                    asChild
                                    className="h-8 text-xs font-semibold"
                                >
                                    <a href={downloadUrl} download>
                                        <Download className="mr-1.5 size-3.5" />
                                        Unduh Berkas
                                    </a>
                                </Button>
                            }
                        />

                        <div className="flex flex-1 items-center justify-center overflow-auto bg-slate-100 p-4 dark:bg-black/40">
                            {isImage ? (
                                <img
                                    src={previewUrl}
                                    alt={version.original_filename}
                                    className="max-h-full max-w-full rounded-lg object-contain shadow-md"
                                />
                            ) : isPdf ? (
                                <iframe
                                    src={`${previewUrl}#toolbar=1`}
                                    title={version.original_filename}
                                    className="h-full w-full rounded-lg border border-slate-200 bg-white dark:border-white/10"
                                />
                            ) : (
                                <div className="p-8 text-center">
                                    <FileText className="mx-auto mb-3 size-16 text-slate-400" />
                                    <p className="text-sm font-medium text-slate-700 dark:text-zinc-300">
                                        Pratinjau langsung tidak didukung untuk
                                        tipe berkas ini.
                                    </p>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        asChild
                                        className="mt-4"
                                    >
                                        <a href={downloadUrl} download>
                                            <Download className="mr-2 size-4" />
                                            Unduh untuk Membuka
                                        </a>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </Dialog>
    );
}
