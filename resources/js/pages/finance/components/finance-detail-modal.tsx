import { Form, router } from '@inertiajs/react';
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
    onOpenProof,
}: Props) {
    const [copied, setCopied] = useState(false);
    const [isUploadingInline, setIsUploadingInline] = useState(false);
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
        iconBg: string;
        color: string;
        natureLabel: string;
    }> = {
        invoices: {
            badge: 'Invoice Tagihan',
            icon: ReceiptText,
            iconBg: 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400',
            color: 'text-blue-600 dark:text-blue-400',
            natureLabel: 'Piutang Tagihan Klien',
        },
        quotations: {
            badge: 'Quotation',
            icon: FilePlus2,
            iconBg: 'bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300',
            color: 'text-slate-700 dark:text-zinc-300',
            natureLabel: 'Estimasi Nilai Penawaran',
        },
        expenses: {
            badge: target.matter ? 'Disbursement Perkara' : 'Biaya Kantor',
            icon: WalletCards,
            iconBg: 'bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400',
            color: 'text-rose-600 dark:text-rose-400',
            natureLabel: 'Pengeluaran Beban Biaya',
        },
        payments: {
            badge: 'Penerimaan Kas',
            icon: Banknote,
            iconBg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400',
            color: 'text-emerald-600 dark:text-emerald-400',
            natureLabel: 'Penerimaan Pembayaran',
        },
        payrolls: {
            badge: 'Slip Gaji Pegawai',
            icon: Receipt,
            iconBg: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400',
            color: 'text-indigo-600 dark:text-indigo-400',
            natureLabel: 'Penghasilan Bersih (THP)',
        },
        'partner-transactions': {
            badge: 'Transaksi Partner',
            icon: HandCoins,
            iconBg: 'bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400',
            color: 'text-amber-600 dark:text-amber-400',
            natureLabel: 'Mutasi Hak Partner',
        },
        transfers: {
            badge: 'Mutasi Rekening',
            icon: ArrowLeftRight,
            iconBg: 'bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400',
            color: 'text-purple-600 dark:text-purple-400',
            natureLabel: 'Pemindahan Dana Bank',
        },
        'client-trust-funds': {
            badge: 'Dana Titipan Escrow',
            icon: Lock,
            iconBg: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-950/50 dark:text-cyan-400',
            color: 'text-cyan-600 dark:text-cyan-400',
            natureLabel: 'Mutasi Rekening Titipan',
        },
    };

    const cfg = entityConfigs[target.entity] || {
        badge: 'Transaksi Keuangan',
        icon: Receipt,
        iconBg: 'bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300',
        color: 'text-slate-700 dark:text-zinc-300',
        natureLabel: 'Nominal Transaksi',
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
                    setIsUploadingInline(false);
                    setShowPreviewModal(false);
                    setSelectedFile(null);
                    onClose();
                }
            }}
        >
            <DialogContent className="max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xl sm:max-w-xl dark:border-white/10 dark:bg-[#14161b]">
                {/* 1. Header: Clean, Compact, Professional */}
                <div className="border-b border-slate-100 px-5 pt-4 pb-3.5 dark:border-white/[0.06]">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0 flex-1">
                            <div className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${cfg.iconBg}`}>
                                <IconComp className="size-4.5" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-1.5 mb-1">
                                    <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 dark:bg-white/[0.06] dark:text-zinc-300">
                                        {cfg.badge}
                                    </span>
                                    {target.status && <StatusBadge value={target.status} />}
                                    {target.reference_number && (
                                        <button
                                            type="button"
                                            onClick={handleCopyRef}
                                            className="inline-flex items-center gap-1 rounded-md border border-slate-200/80 bg-white px-1.5 py-0.5 font-mono text-[10px] font-medium text-slate-600 shadow-2xs hover:bg-slate-50 dark:border-white/10 dark:bg-[#1a1d26] dark:text-zinc-300"
                                            title="Salin Nomor Referensi"
                                        >
                                            {copied ? (
                                                <>
                                                    <Check className="size-2.5 text-emerald-600" />
                                                    <span className="text-emerald-600">Tersalin</span>
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

                                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-tight">
                                    {displayTitle}
                                </h3>

                                {target.matter ? (
                                    <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-zinc-400 truncate">
                                        <FolderKanban className="size-3.5 shrink-0 text-blue-600 dark:text-blue-400" />
                                        <span className="font-mono font-semibold text-slate-700 dark:text-zinc-300">
                                            {target.matter.matter_number}
                                        </span>
                                        <span>•</span>
                                        <span className="truncate">{target.matter.title}</span>
                                    </div>
                                ) : target.client ? (
                                    <p className="mt-0.5 text-xs text-slate-500 dark:text-zinc-400">
                                        Klien: <span className="font-semibold text-slate-700 dark:text-zinc-300">{target.client.display_name}</span>
                                    </p>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Key Metrics Summary: Clean 3-Column Strip */}
                <div className="border-b border-slate-100 bg-slate-50/60 px-5 py-3 dark:border-white/[0.06] dark:bg-[#16181f]/50">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {/* Col 1: Nominal */}
                        <div className="col-span-2 sm:col-span-1">
                            <span className="text-[10px] font-medium text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                                {cfg.natureLabel}
                            </span>
                            <div className="font-mono text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                                {formatMoney(target.amount, target.currency || 'IDR')}
                            </div>
                            <p className="text-[10px] text-slate-500 dark:text-zinc-400 italic truncate" title={terbilang(target.amount) + ' Rupiah'}>
                                {target.amount > 0 ? `${terbilang(target.amount)} Rupiah` : 'Nol Rupiah'}
                            </p>
                        </div>

                        {/* Col 2: Tanggal & Jatuh Tempo */}
                        <div>
                            <span className="text-[10px] font-medium text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                                Tanggal / Periode
                            </span>
                            <div className="flex items-center gap-1 text-xs font-semibold text-slate-800 dark:text-zinc-200 mt-0.5">
                                <Calendar className="size-3.5 text-slate-400" />
                                <span>{target.date ? formatDate(target.date) : '-'}</span>
                            </div>
                            {target.due_date && (
                                <p className="text-[10.5px] text-amber-600 dark:text-amber-400 mt-0.5">
                                    Tempo: {formatDate(target.due_date)}
                                </p>
                            )}
                        </div>

                        {/* Col 3: Sumber Rekening / Bank */}
                        <div>
                            <span className="text-[10px] font-medium text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                                Rekening / Kas
                            </span>
                            <div className="flex items-center gap-1 text-xs font-semibold text-slate-800 dark:text-zinc-200 mt-0.5 truncate">
                                <Building2 className="size-3.5 text-blue-500 shrink-0" />
                                <span className="truncate">{target.account?.name || (target.partner ? `Talangan ${target.partner.name}` : 'Kas Kantor')}</span>
                            </div>
                            {target.method && (
                                <p className="text-[10.5px] text-slate-500 dark:text-zinc-400 uppercase mt-0.5">
                                    Metode: {target.method}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* 3. Detailed Specifications Body */}
                <div className="p-5 overflow-y-auto flex-1 max-h-[48vh] space-y-3.5 text-xs [scrollbar-width:thin]">
                    {/* Key-Value Breakdown */}
                    <div className="rounded-xl border border-slate-200/80 bg-white dark:border-white/[0.06] dark:bg-[#16181f]/40 divide-y divide-slate-100 dark:divide-white/[0.04]">
                        {/* Perkara & Klien */}
                        {target.matter && (
                            <div className="grid grid-cols-3 p-2.5 px-3 items-center">
                                <span className="text-slate-500 dark:text-zinc-400 text-[11px]">Perkara</span>
                                <span className="col-span-2 font-medium text-slate-800 dark:text-zinc-200">
                                    {target.matter.title} ({target.matter.matter_number})
                                </span>
                            </div>
                        )}

                        {/* Kategori Pos */}
                        {target.category && (
                            <div className="grid grid-cols-3 p-2.5 px-3 items-center">
                                <span className="text-slate-500 dark:text-zinc-400 text-[11px]">Kategori Pos</span>
                                <span className="col-span-2">
                                    <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 font-medium text-slate-700 dark:bg-white/[0.06] dark:text-zinc-300">
                                        <Tag className="size-2.5 text-slate-400" />
                                        {displayCategory}
                                    </span>
                                </span>
                            </div>
                        )}

                        {/* Pihak Penerima / Vendor */}
                        {target.vendor && (
                            <div className="grid grid-cols-3 p-2.5 px-3 items-center">
                                <span className="text-slate-500 dark:text-zinc-400 text-[11px]">Penerima / Vendor</span>
                                <span className="col-span-2 font-semibold text-slate-900 dark:text-white">
                                    {target.vendor}
                                </span>
                            </div>
                        )}

                        {/* Beban Ditagihkan Ke */}
                        {target.charge_to && (
                            <div className="grid grid-cols-3 p-2.5 px-3 items-center">
                                <span className="text-slate-500 dark:text-zinc-400 text-[11px]">Pembebanan</span>
                                <span className="col-span-2 font-medium text-slate-800 dark:text-zinc-200">
                                    {target.charge_to === 'client' ? 'Klien (Disbursement Tagihan Perkara)' : 'Kantor (Overhead Firma)'}
                                </span>
                            </div>
                        )}

                        {/* Ditalangi Partner */}
                        {target.partner && (
                            <div className="grid grid-cols-3 p-2.5 px-3 items-center">
                                <span className="text-slate-500 dark:text-zinc-400 text-[11px]">Talangan Partner</span>
                                <span className="col-span-2 font-semibold text-amber-700 dark:text-amber-300 flex items-center gap-1">
                                    <User className="size-3 text-amber-500" />
                                    {target.partner.name}
                                </span>
                            </div>
                        )}

                        {/* Sisa Piutang / Terbayar jika Invoice */}
                        {target.entity === 'invoices' && typeof target.outstanding_amount === 'number' && (
                            <div className="grid grid-cols-3 p-2.5 px-3 items-center">
                                <span className="text-slate-500 dark:text-zinc-400 text-[11px]">Status Piutang</span>
                                <span className="col-span-2 font-mono font-semibold">
                                    {target.outstanding_amount === 0 ? (
                                        <span className="text-emerald-600 dark:text-emerald-400">Lunas Penuh (Rp 0 sisa)</span>
                                    ) : (
                                        <span className="text-amber-600 dark:text-amber-400">
                                            Sisa: {formatMoney(target.outstanding_amount, target.currency)}
                                        </span>
                                    )}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Line Items Table if Invoice or Quotation */}
                    {lineItems.length > 0 && (
                        <div className="space-y-1.5">
                            <span className="text-[10.5px] font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                                Rincian Pos Tagihan / Line Items
                            </span>
                            <div className="rounded-xl border border-slate-200/80 overflow-hidden dark:border-white/[0.06]">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-slate-50 dark:bg-zinc-800/60 text-[10.5px] font-semibold text-slate-600 dark:text-zinc-400 border-b border-slate-200/80 dark:border-white/[0.06]">
                                        <tr>
                                            <th className="p-2 pl-3">Uraian Layanan / Pekerjaan</th>
                                            <th className="p-2 text-center w-16">Qty</th>
                                            <th className="p-2 text-right pr-3">Jumlah</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                                        {lineItems.map((item: any, idx: number) => {
                                            const itemQty = Number(item.quantity) || 1;
                                            const itemPrice = Number(item.unit_amount ?? item.unit_price ?? item.amount ?? 0);
                                            const rowTotal = item.total_amount ? Number(item.total_amount) : itemQty * itemPrice;
                                            return (
                                                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02]">
                                                    <td className="p-2 pl-3 text-slate-800 dark:text-zinc-200 font-medium">
                                                        {item.description}
                                                    </td>
                                                    <td className="p-2 text-center font-mono text-slate-600 dark:text-zinc-400">
                                                        {itemQty}
                                                    </td>
                                                    <td className="p-2 pr-3 text-right font-mono font-semibold text-slate-900 dark:text-white">
                                                        {formatMoney(rowTotal, target.currency)}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Payroll Breakdown if payroll entity */}
                    {payrollDetails && target.entity === 'payrolls' && (
                        <div className="space-y-1.5">
                            <span className="text-[10.5px] font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                                Rincian Komponen Gaji &amp; Potongan
                            </span>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="rounded-xl border border-emerald-100 bg-emerald-50/30 p-2.5 space-y-1 dark:border-emerald-950/40 dark:bg-emerald-950/10">
                                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase">Penghasilan (+)</span>
                                    <div className="flex justify-between text-slate-700 dark:text-zinc-300">
                                        <span>Gaji Pokok:</span>
                                        <span className="font-mono">{formatMoney(payrollDetails.basic_salary)}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-700 dark:text-zinc-300">
                                        <span>Tunjangan Tetap:</span>
                                        <span className="font-mono">{formatMoney(payrollDetails.fixed_allowance)}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-700 dark:text-zinc-300">
                                        <span>Uang Makan/Transport:</span>
                                        <span className="font-mono">{formatMoney(payrollDetails.transport_meal_allowance)}</span>
                                    </div>
                                    {payrollDetails.bonus_amount > 0 && (
                                        <div className="flex justify-between text-slate-700 dark:text-zinc-300">
                                            <span>Bonus Perkara:</span>
                                            <span className="font-mono">{formatMoney(payrollDetails.bonus_amount)}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="rounded-xl border border-rose-100 bg-rose-50/30 p-2.5 space-y-1 dark:border-rose-950/40 dark:bg-rose-950/10">
                                    <span className="text-[10px] font-bold text-rose-700 dark:text-rose-400 uppercase">Potongan (-)</span>
                                    <div className="flex justify-between text-slate-700 dark:text-zinc-300">
                                        <span>Potongan Lainnya:</span>
                                        <span className="font-mono">- {formatMoney(payrollDetails.deductions_amount)}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-700 dark:text-zinc-300">
                                        <span>PPh 21:</span>
                                        <span className="font-mono">- {formatMoney(payrollDetails.tax_deduction_amount)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Description / Notes Box */}
                    {(target.description || target.notes) && (
                        <div className="rounded-xl border border-slate-200/80 bg-slate-50/40 p-3 dark:border-white/[0.06] dark:bg-[#16181f]/40 space-y-1">
                            <span className="text-[10px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                                Uraian &amp; Catatan Transaksi
                            </span>
                            <p className="text-xs leading-relaxed text-slate-700 dark:text-zinc-300 whitespace-pre-wrap">
                                {target.description || target.notes}
                            </p>
                        </div>
                    )}

                    {/* Payment Allocations Table */}
                    {target.allocations && target.allocations.length > 0 && (
                        <div className="space-y-1.5">
                            <span className="text-[10.5px] font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                                Alokasi Pembayaran ke Invoice
                            </span>
                            <div className="rounded-xl border border-slate-200/80 overflow-hidden dark:border-white/[0.06]">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-slate-50 dark:bg-zinc-800/60 text-[10.5px] font-semibold text-slate-600 dark:text-zinc-400 border-b border-slate-200/80 dark:border-white/[0.06]">
                                        <tr>
                                            <th className="p-2 pl-3">Nomor Invoice</th>
                                            <th className="p-2 text-right pr-3">Nominal Dialokasikan</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                                        {target.allocations.map((alloc) => (
                                            <tr key={alloc.id}>
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

                    {/* 4. Integrated Document Attachment Strip */}
                    <div className="rounded-xl border border-slate-200/80 p-3 space-y-2 dark:border-white/[0.06] bg-white dark:bg-[#16181f]/40">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 dark:text-zinc-200">
                                <Paperclip className="size-3.5 text-slate-400" />
                                <span>Dokumen Bukti Transaksi</span>
                            </div>
                            {hasProof && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                                    <FileCheck className="size-3" />
                                    Terlampir ({version?.file_size ? formatBytes(version.file_size) : 'File'})
                                </span>
                            )}
                        </div>

                        {hasProof && !isUploadingInline ? (
                            <div className="flex items-center justify-between rounded-lg bg-slate-50 p-2.5 dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.04]">
                                <div className="flex items-center gap-2 min-w-0 flex-1 pr-2">
                                    {isImage ? (
                                        <FileImage className="size-5 text-blue-500 shrink-0" />
                                    ) : (
                                        <FileText className="size-5 text-purple-500 shrink-0" />
                                    )}
                                    <div className="min-w-0">
                                        <p className="text-xs font-medium text-slate-800 dark:text-zinc-200 truncate">
                                            {version?.original_filename || 'Dokumen Bukti Transaksi'}
                                        </p>
                                        <p className="text-[10px] text-slate-400">
                                            {version?.created_at ? formatDate(version.created_at) : 'Terverifikasi'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1.5 shrink-0">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setShowPreviewModal(true)}
                                        className="h-7 px-2 text-[11px] font-medium rounded-lg"
                                    >
                                        <ExternalLink className="size-3 mr-1" />
                                        Pratinjau
                                    </Button>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-7 px-2 text-[11px] font-medium rounded-lg"
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
                                        onClick={() => setIsUploadingInline(true)}
                                        className="h-7 px-1.5 text-[11px] text-slate-500 hover:text-slate-900 rounded-lg"
                                        title="Ganti Berkas"
                                    >
                                        Ganti
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            /* Inline Compact Uploader */
                            <Form
                                action={`/finance/${target.entity}/${target.id}/proof`}
                                method="post"
                                encType="multipart/form-data"
                                className="space-y-2"
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
                                    <div className="space-y-2">
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
                                            className={`cursor-pointer rounded-lg border border-dashed p-3 text-center transition-all ${
                                                selectedFile
                                                    ? 'border-emerald-400 bg-emerald-50/40 dark:bg-emerald-950/20'
                                                    : isDragging
                                                      ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20'
                                                      : 'border-slate-300 bg-slate-50/50 hover:border-slate-400 hover:bg-slate-100/50 dark:border-white/10 dark:bg-white/[0.02]'
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

                                            <div className="flex items-center justify-center gap-2">
                                                <UploadCloud className="size-4 text-slate-400" />
                                                <span className="text-xs font-medium text-slate-700 dark:text-zinc-200">
                                                    {selectedFile ? selectedFile.name : 'Klik atau seret berkas bukti ke sini'}
                                                </span>
                                                <span className="text-[10px] text-slate-400">
                                                    {selectedFile ? `(${formatBytes(selectedFile.size)})` : '(PDF, JPG, PNG maks 20MB)'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                                <ShieldCheck className="size-3 text-emerald-500" />
                                                Terisolasi aman
                                            </span>

                                            <div className="flex items-center gap-1.5">
                                                {hasProof && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            setIsUploadingInline(false);
                                                            setSelectedFile(null);
                                                        }}
                                                        className="h-7 text-xs"
                                                    >
                                                        Batal
                                                    </Button>
                                                )}
                                                <Button
                                                    type="submit"
                                                    size="sm"
                                                    disabled={processing || !selectedFile}
                                                    className="h-7 px-3 text-xs font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 rounded-lg"
                                                >
                                                    {processing ? (
                                                        <>
                                                            <Loader2 className="size-3 animate-spin mr-1" />
                                                            Mengunggah...
                                                        </>
                                                    ) : (
                                                        'Simpan Bukti'
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </Form>
                        )}
                    </div>
                </div>

                {/* 5. Footer Bar: Minimal & Balanced */}
                <div className="border-t border-slate-100 px-5 py-3 dark:border-white/[0.06] bg-slate-50/50 dark:bg-[#16181f]/60 flex flex-row items-center justify-between">
                    <div>
                        {onDelete && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => onDelete(target.rawItem || target)}
                                className="h-8 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30 gap-1.5"
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
                                className="h-8 rounded-lg border-slate-200 text-xs font-medium text-blue-600 hover:bg-blue-50 dark:border-white/10 dark:text-blue-400 gap-1.5"
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
                                className="h-8 rounded-lg border-slate-200 text-xs font-medium text-emerald-600 hover:bg-emerald-50 dark:border-white/10 dark:text-emerald-400 gap-1.5"
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
                                className="h-8 rounded-lg border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:text-zinc-300 gap-1.5"
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

                {/* Sub-Dialog for Fullscreen Document Preview */}
                {showPreviewModal && hasProof && (
                    <Dialog open={showPreviewModal} onOpenChange={setShowPreviewModal}>
                        <DialogContent className="max-h-[92vh] sm:max-w-3xl flex flex-col p-0 gap-0 rounded-2xl overflow-hidden bg-white dark:bg-[#14161b]">
                            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-white/[0.06]">
                                <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-zinc-200">
                                    <FileText className="size-4 text-blue-500" />
                                    <span className="truncate">{version?.original_filename || 'Dokumen Bukti'}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Button size="sm" variant="outline" className="h-7 text-xs" asChild>
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

                            <div className="h-[60vh] flex items-center justify-center p-2 bg-slate-900/5 dark:bg-black/40">
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
