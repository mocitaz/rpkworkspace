import { Form, router } from '@inertiajs/react';
import {
    CheckCircle2,
    Clock,
    Download,
    ExternalLink,
    FileCheck,
    FileImage,
    FileText,
    HardDrive,
    Loader2,
    Maximize2,
    Paperclip,
    Receipt,
    RefreshCw,
    RotateCw,
    ShieldCheck,
    Trash2,
    UploadCloud,
    X,
    ZoomIn,
    ZoomOut,
} from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { formatBytes, formatDate } from '@/lib/format';

export type DocumentVersionData = {
    id: string;
    document_id: string;
    version_number: number;
    mime_type?: string;
    file_size?: number;
    original_filename?: string;
    created_at?: string;
};

export type ProofDocumentData = {
    id: string;
    title?: string;
    document_type?: string;
    created_at?: string;
    current_version?: DocumentVersionData;
    currentVersion?: DocumentVersionData;
};

export type FinanceEntityProofTarget = {
    id: string;
    entity: 'expenses' | 'payments' | 'invoices' | 'payrolls' | 'partner-transactions' | 'transfers' | 'client-trust-funds';
    title: string;
    subtitle?: string;
    proof_document?: ProofDocumentData | null;
    proofDocument?: ProofDocumentData | null;
};

type Props = {
    target: FinanceEntityProofTarget | null;
    isOpen: boolean;
    onClose: () => void;
};

export function FinanceProofDialog({ target, isOpen, onClose }: Props) {
    const [isUploadingNew, setIsUploadingNew] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [selectedFilePreview, setSelectedFilePreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    if (!target) {
        return null;
    }

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

    const handleClose = () => {
        setIsUploadingNew(false);
        setZoomLevel(1);
        setRotation(0);
        setSelectedFile(null);
        if (selectedFilePreview) {
            URL.revokeObjectURL(selectedFilePreview);
            setSelectedFilePreview(null);
        }
        onClose();
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
            const url = URL.createObjectURL(file);
            setSelectedFilePreview(url);
        } else {
            setSelectedFilePreview(null);
        }
    };

    const entityLabels: Record<string, { label: string; bg: string; text: string; iconBg: string }> = {
        invoices: {
            label: 'Invoice Klien',
            bg: 'bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/40 text-blue-700 dark:text-blue-300',
            text: 'text-blue-600 dark:text-blue-400',
            iconBg: 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400',
        },
        payments: {
            label: 'Pembayaran Kas',
            bg: 'bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-300',
            text: 'text-emerald-600 dark:text-emerald-400',
            iconBg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400',
        },
        expenses: {
            label: 'Beban Biaya',
            bg: 'bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-800/40 text-rose-700 dark:text-rose-300',
            text: 'text-rose-600 dark:text-rose-400',
            iconBg: 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400',
        },
        payrolls: {
            label: 'Gaji / Slip',
            bg: 'bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/40 text-indigo-700 dark:text-indigo-300',
            text: 'text-indigo-600 dark:text-indigo-400',
            iconBg: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400',
        },
        transfers: {
            label: 'Mutasi Bank',
            bg: 'bg-purple-50/80 dark:bg-purple-950/40 border border-purple-200/60 dark:border-purple-800/40 text-purple-700 dark:text-purple-300',
            text: 'text-purple-600 dark:text-purple-400',
            iconBg: 'bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400',
        },
        'partner-transactions': {
            label: 'Talangan Partner',
            bg: 'bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/40 text-amber-700 dark:text-amber-300',
            text: 'text-amber-600 dark:text-amber-400',
            iconBg: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400',
        },
        'client-trust-funds': {
            label: 'Dana Titipan',
            bg: 'bg-cyan-50/80 dark:bg-cyan-950/40 border border-cyan-200/60 dark:border-cyan-800/40 text-cyan-700 dark:text-cyan-300',
            text: 'text-cyan-600 dark:text-cyan-400',
            iconBg: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400',
        },
    };

    const entityMeta = entityLabels[target.entity] || {
        label: 'Transaksi',
        bg: 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300',
        text: 'text-slate-600 dark:text-slate-400',
        iconBg: 'bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300',
    };

    const showUploader = !hasProof || isUploadingNew;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent
                className={`max-h-[92vh] flex flex-col p-0 gap-0 overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xl dark:border-white/10 dark:bg-[#14161b] ${
                    showUploader ? 'sm:max-w-md' : 'sm:max-w-3xl'
                }`}
            >
                {/* Header */}
                <DialogHeader className="border-b border-slate-100 px-5 py-3.5 dark:border-white/[0.06] bg-slate-50/40 dark:bg-[#16181f]/40">
                    <div className="flex items-start gap-3">
                        <div className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${entityMeta.iconBg}`}>
                            {hasProof ? (
                                isImage ? <FileImage className="size-4.5" /> : <FileText className="size-4.5" />
                            ) : (
                                <Paperclip className="size-4.5" />
                            )}
                        </div>
                        <div className="min-w-0 flex-1 pr-6">
                            <div className="flex flex-wrap items-center gap-1.5 mb-1">
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${entityMeta.bg}`}>
                                    {entityMeta.label}
                                </span>
                                {hasProof ? (
                                    <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/70 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40">
                                        <FileCheck className="size-3 text-emerald-600 dark:text-emerald-400" />
                                        Bukti Terlampir
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200/70 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/40">
                                        <Clock className="size-3 text-amber-600 dark:text-amber-400" />
                                        Belum Ada Bukti
                                    </span>
                                )}
                            </div>
                            <DialogTitle className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-tight">
                                {target.title}
                            </DialogTitle>
                            {target.subtitle && (
                                <DialogDescription className="mt-0.5 text-xs text-slate-500 dark:text-zinc-400">
                                    {target.subtitle}
                                </DialogDescription>
                            )}
                        </div>
                    </div>
                </DialogHeader>

                {/* Body Content */}
                {showUploader ? (
                    <Form
                        action={`/finance/${target.entity}/${target.id}/proof`}
                        method="post"
                        encType="multipart/form-data"
                        className="flex flex-col flex-1"
                        onSuccess={() => {
                            setIsUploadingNew(false);
                            toast.success('Berkas bukti transaksi berhasil diunggah!');
                            handleClose();
                        }}
                        onError={() => {
                            toast.error('Gagal mengunggah berkas bukti.');
                        }}
                    >
                        {({ processing }) => (
                            <>
                                <div className="p-5 space-y-4 flex-1">
                                    {/* Dropzone Area */}
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
                                            <div
                                                className={`flex size-11 items-center justify-center rounded-xl transition-transform duration-150 group-hover:scale-105 ${
                                                    selectedFile
                                                        ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                                                        : 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400'
                                                }`}
                                            >
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
                                                        : 'Pilih Berkas atau Seret ke Sini'}
                                                </p>
                                                <p className="mt-0.5 text-[11px] text-slate-400 dark:text-zinc-500">
                                                    {selectedFile
                                                        ? `${formatBytes(selectedFile.size)} • Siap diunggah`
                                                        : 'PDF, JPG, JPEG, PNG, WEBP (Maksimal 20 MB)'}
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

                                    {/* Preview selected image if any */}
                                    {selectedFilePreview && (
                                        <div className="relative rounded-xl border border-slate-200/80 dark:border-white/10 overflow-hidden bg-slate-900/5 dark:bg-black/30 p-1 flex items-center justify-center h-28">
                                            <img
                                                src={selectedFilePreview}
                                                alt="Preview"
                                                className="max-h-24 w-auto max-w-full object-contain rounded-lg shadow-xs"
                                            />
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleFileSelect(null);
                                                }}
                                                className="absolute top-2 right-2 flex size-5.5 items-center justify-center rounded-full bg-slate-900/70 text-white hover:bg-rose-600 transition-colors"
                                                title="Hapus pilihan berkas"
                                            >
                                                <X className="size-3" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <DialogFooter className="border-t border-slate-100 px-5 py-3 dark:border-white/[0.06] bg-slate-50/50 dark:bg-[#16181f]/60 flex flex-row items-center justify-between sm:justify-between">
                                    <div className="flex items-center gap-1 text-[10.5px] text-slate-400">
                                        <ShieldCheck className="size-3 text-emerald-500" />
                                        <span>Terisolasi dari berkas perkara</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                if (isUploadingNew) {
                                                    setIsUploadingNew(false);
                                                    handleFileSelect(null);
                                                } else {
                                                    handleClose();
                                                }
                                            }}
                                            disabled={processing}
                                            className="h-8.5 rounded-lg text-xs font-semibold"
                                        >
                                            {isUploadingNew ? 'Batal' : 'Tutup'}
                                        </Button>

                                        <Button
                                            type="submit"
                                            size="sm"
                                            disabled={processing || !selectedFile}
                                            className="h-8.5 px-4 rounded-lg bg-blue-600 text-xs font-semibold text-white shadow-2xs hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 gap-1.5 disabled:opacity-50"
                                        >
                                            {processing ? (
                                                <>
                                                    <Loader2 className="size-3.5 animate-spin" />
                                                    Mengunggah...
                                                </>
                                            ) : (
                                                <>
                                                    <UploadCloud className="size-3.5" />
                                                    Simpan Bukti
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </DialogFooter>
                            </>
                        )}
                    </Form>
                ) : (
                    <div className="flex flex-col flex-1">
                        <div className="p-4 sm:p-5 space-y-3">
                            {/* Toolbar for Image */}
                            {isImage && (
                                <div className="flex items-center justify-center">
                                    <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-100/90 dark:bg-[#16181f]/90 border border-slate-200/80 dark:border-white/10 shadow-2xs">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="size-7 rounded-md text-slate-600 hover:bg-white dark:text-zinc-300 dark:hover:bg-white/10"
                                            onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 3))}
                                            title="Zoom In"
                                        >
                                            <ZoomIn className="size-3.5" />
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="size-7 rounded-md text-slate-600 hover:bg-white dark:text-zinc-300 dark:hover:bg-white/10"
                                            onClick={() => setZoomLevel((z) => Math.max(z - 0.25, 0.5))}
                                            title="Zoom Out"
                                        >
                                            <ZoomOut className="size-3.5" />
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="size-7 rounded-md text-slate-600 hover:bg-white dark:text-zinc-300 dark:hover:bg-white/10"
                                            onClick={() => setRotation((r) => (r + 90) % 360)}
                                            title="Putar 90 Derajat"
                                        >
                                            <RotateCw className="size-3.5" />
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="size-7 rounded-md text-slate-600 hover:bg-white dark:text-zinc-300 dark:hover:bg-white/10"
                                            onClick={() => {
                                                setZoomLevel(1);
                                                setRotation(0);
                                            }}
                                            title="Reset Tampilan"
                                        >
                                            <RefreshCw className="size-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Viewer Frame */}
                            <div className="relative w-full h-[50vh] sm:h-[54vh] overflow-hidden flex items-center justify-center rounded-xl bg-slate-900/5 dark:bg-black/30 border border-slate-200/80 dark:border-white/10 p-1">
                                {isImage ? (
                                    <div className="w-full h-full flex items-center justify-center overflow-auto p-2">
                                        <img
                                            src={previewUrl}
                                            alt={target.title}
                                            style={{
                                                transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                                                transition: 'transform 0.15s ease-out',
                                            }}
                                            className="max-h-full max-w-full object-contain rounded-lg shadow-sm"
                                        />
                                    </div>
                                ) : isPdf ? (
                                    <iframe
                                        src={`${previewUrl}#toolbar=1&navpanes=0`}
                                        title={target.title}
                                        className="w-full h-full rounded-lg border-0 bg-white shadow-xs"
                                    />
                                ) : (
                                    <div className="text-center p-6 space-y-2">
                                        <FileText className="size-12 mx-auto text-slate-400" />
                                        <p className="text-xs font-semibold text-slate-800 dark:text-white">
                                            {version?.original_filename || 'Dokumen Bukti'}
                                        </p>
                                        <p className="text-[11px] text-slate-500">
                                            Format berkas tidak mendukung pratinjau langsung.
                                        </p>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="mt-2 h-7.5 rounded-lg text-xs"
                                            asChild
                                        >
                                            <a href={downloadUrl} download>
                                                <Download className="size-3 mr-1" />
                                                Unduh untuk Membuka
                                            </a>
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {/* File Meta Pill */}
                            <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2 text-[11px] text-slate-600 dark:bg-white/[0.02] dark:text-zinc-400">
                                <div className="flex items-center gap-2">
                                    <HardDrive className="size-3.5 text-purple-500" />
                                    <span className="font-medium text-slate-800 dark:text-zinc-200 truncate max-w-xs">
                                        {version?.original_filename || 'Dokumen'}
                                    </span>
                                    <span>•</span>
                                    <span>{version?.file_size ? formatBytes(version.file_size) : 'File'}</span>
                                    <span>•</span>
                                    <span>{version?.created_at ? formatDate(version.created_at) : ''}</span>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <DialogFooter className="border-t border-slate-100 px-5 py-3 dark:border-white/[0.06] bg-slate-50/50 dark:bg-[#16181f]/60 flex flex-row items-center justify-between sm:justify-between">
                            <div className="flex items-center gap-1.5">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setIsUploadingNew(true)}
                                    className="h-8.5 rounded-lg text-xs font-semibold"
                                >
                                    <UploadCloud className="size-3.5 mr-1" />
                                    Ganti Bukti Baru
                                </Button>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8.5 rounded-lg text-xs font-semibold"
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
                                    className="h-8.5 rounded-lg text-xs font-semibold"
                                    asChild
                                >
                                    <a href={previewUrl} target="_blank" rel="noreferrer">
                                        <ExternalLink className="size-3.5 mr-1" />
                                        Fullscreen
                                    </a>
                                </Button>

                                <Button
                                    type="button"
                                    variant="default"
                                    size="sm"
                                    onClick={handleClose}
                                    className="h-8.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-zinc-100 text-xs font-semibold px-4"
                                >
                                    Tutup
                                </Button>
                            </div>
                        </DialogFooter>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
