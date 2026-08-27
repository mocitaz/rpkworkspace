import { Form, router } from '@inertiajs/react';
import {
    CheckCircle2,
    Clock,
    Download,
    Eye,
    FileCheck,
    FileImage,
    FileText,
    HardDrive,
    Loader2,
    Maximize2,
    Paperclip,
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

    const handleDeleteProof = () => {
        if (!confirm('Apakah Anda yakin ingin menghapus bukti transaksi ini? Dokumen bukti akan dihapus permanen.')) {
            return;
        }
        router.delete(`/finance/${target.entity}/${target.id}/proof`, {
            preserveScroll: true,
            onSuccess: () => {
                handleClose();
            },
        });
    };

    const entityLabels: Record<string, { label: string; color: string; bg: string }> = {
        invoices: { label: 'Invoice', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300' },
        payments: { label: 'Penerimaan', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300' },
        expenses: { label: 'Beban Biaya', color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300' },
        payrolls: { label: 'Gaji / Slip', color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300' },
        transfers: { label: 'Mutasi Bank', color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300' },
        'partner-transactions': { label: 'Talangan Partner', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300' },
        'client-trust-funds': { label: 'Dana Titipan', color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300' },
    };

    const entityMeta = entityLabels[target.entity] || {
        label: 'Transaksi',
        color: 'text-slate-600 dark:text-slate-400',
        bg: 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300',
    };

    const showUploader = !hasProof || isUploadingNew;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className={`max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xl dark:border-white/10 dark:bg-[#14161b] ${
                showUploader ? 'sm:max-w-lg' : 'sm:max-w-3xl'
            }`}>
                {/* Header */}
                <DialogHeader className="border-b border-slate-100 px-5 py-3.5 dark:border-white/[0.06] bg-slate-50/50 dark:bg-[#16181f]/60">
                    <div className="flex items-center gap-3">
                        <div className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${entityMeta.bg}`}>
                            {hasProof ? (
                                isImage ? <FileImage className="size-4.5" /> : <FileText className="size-4.5" />
                            ) : (
                                <Paperclip className="size-4.5" />
                            )}
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${entityMeta.bg}`}>
                                    {entityMeta.label}
                                </span>
                                {hasProof ? (
                                    <span className="inline-flex items-center gap-1 text-[10.5px] font-medium px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40">
                                        <FileCheck className="size-3 text-emerald-600 dark:text-emerald-400" />
                                        Bukti Terlampir
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 text-[10.5px] font-medium px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/40">
                                        <Clock className="size-3 text-amber-600 dark:text-amber-400" />
                                        Belum Ada Bukti
                                    </span>
                                )}
                            </div>
                            <DialogTitle className="mt-1 text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                                {target.title}
                            </DialogTitle>
                            <DialogDescription className="text-[11px] text-slate-500 dark:text-zinc-400 truncate">
                                {target.subtitle || 'Lampiran Dokumen Bukti Transaksi Keuangan Terisolasi'}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-5">
                    {showUploader ? (
                        <Form
                            action={`/finance/${target.entity}/${target.id}/proof`}
                            method="post"
                            encType="multipart/form-data"
                            className="space-y-3.5"
                            onSuccess={() => {
                                setIsUploadingNew(false);
                                handleClose();
                            }}
                        >
                            {({ processing }) => (
                                <div className="space-y-3.5">
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
                                                  ? 'border-emerald-400/80 bg-emerald-50/20 dark:border-emerald-500/30 dark:bg-emerald-950/10'
                                                  : 'border-slate-200/90 hover:border-blue-400 hover:bg-slate-50/60 dark:border-white/10 dark:hover:border-blue-400/40 dark:hover:bg-white/[0.02]'
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
                                            <div className={`flex size-10 items-center justify-center rounded-xl transition-transform duration-150 group-hover:scale-105 ${
                                                selectedFile
                                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                                                    : 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400'
                                            }`}>
                                                {selectedFile ? (
                                                    <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400" />
                                                ) : (
                                                    <UploadCloud className="size-5" />
                                                )}
                                            </div>

                                            <div>
                                                <p className="text-xs font-bold text-slate-800 dark:text-zinc-100">
                                                    {selectedFile
                                                        ? 'Berkas Siap Diunggah'
                                                        : isDragging
                                                          ? 'Lepaskan berkas di sini...'
                                                          : 'Pilih Berkas atau Seret ke Sini'}
                                                </p>
                                                <p className="mt-0.5 text-[11px] text-slate-400 dark:text-zinc-500">
                                                    PDF, JPG, JPEG, PNG, WEBP (Maks. 20 MB)
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Selected File Card */}
                                    {selectedFile && (
                                        <div className="flex items-center justify-between rounded-xl border border-emerald-200/80 bg-emerald-50/40 p-2.5 dark:border-emerald-900/30 dark:bg-emerald-950/20 animate-in fade-in duration-150">
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                {selectedFilePreview ? (
                                                    <img
                                                        src={selectedFilePreview}
                                                        alt="Preview"
                                                        className="size-9 rounded-lg object-cover border border-emerald-300 dark:border-emerald-700 shrink-0"
                                                    />
                                                ) : (
                                                    <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 shrink-0">
                                                        <FileText className="size-4.5" />
                                                    </div>
                                                )}
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                                        {selectedFile.name}
                                                    </p>
                                                    <p className="text-[10.5px] text-emerald-700 dark:text-emerald-400 font-mono">
                                                        {formatBytes(selectedFile.size)} • {selectedFile.type || 'Dokumen'}
                                                    </p>
                                                </div>
                                            </div>

                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleFileSelect(null);
                                                    if (fileInputRef.current) {
                                                        fileInputRef.current.value = '';
                                                    }
                                                }}
                                                className="size-7 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30"
                                                title="Hapus pilihan"
                                            >
                                                <X className="size-3.5" />
                                            </Button>
                                        </div>
                                    )}

                                    {/* Action Bar */}
                                    <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-white/[0.06]">
                                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                                            <ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                                            <span>Terisolasi dari dokumen perkara</span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {hasProof && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {
                                                        setIsUploadingNew(false);
                                                        handleFileSelect(null);
                                                    }}
                                                    disabled={processing}
                                                    className="h-8 rounded-lg text-xs font-semibold"
                                                >
                                                    Batal
                                                </Button>
                                            )}
                                            <Button
                                                type="submit"
                                                size="sm"
                                                disabled={processing || !selectedFile}
                                                className="h-8 px-3.5 rounded-lg bg-slate-900 text-xs font-bold text-white shadow-2xs hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-zinc-100 gap-1.5"
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
                                    </div>
                                </div>
                            )}
                        </Form>
                    ) : (
                        <div className="space-y-3">
                            {/* Floating Toolbar for Image */}
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
                                            title="Rotate"
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
                                            title="Reset"
                                        >
                                            <RefreshCw className="size-3" />
                                        </Button>
                                        <div className="h-3.5 w-px bg-slate-300 dark:bg-white/10 mx-0.5" />
                                        <a
                                            href={previewUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex size-7 items-center justify-center rounded-md text-slate-600 hover:bg-white hover:text-slate-900 dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-white"
                                            title="Buka Layar Penuh"
                                        >
                                            <Maximize2 className="size-3.5" />
                                        </a>
                                    </div>
                                </div>
                            )}

                            {/* Viewer Container */}
                            <div className="w-full h-[45vh] sm:h-[48vh] overflow-auto flex items-center justify-center rounded-xl bg-slate-900/5 dark:bg-black/30 border border-slate-200/80 dark:border-white/10 p-2">
                                {isImage ? (
                                    <div className="overflow-hidden flex items-center justify-center p-1">
                                        <img
                                            src={previewUrl}
                                            alt={target.title}
                                            style={{
                                                transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                                                transition: 'transform 0.15s ease-in-out',
                                            }}
                                            className="max-h-[42vh] w-auto max-w-full object-contain rounded-lg shadow-xs"
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
                                        <div className="flex size-11 mx-auto items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-white/[0.06] dark:text-zinc-300">
                                            <FileText className="size-5.5" />
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="text-xs font-bold text-slate-800 dark:text-zinc-200">
                                                Pratinjau langsung tidak tersedia untuk format ini.
                                            </p>
                                            <p className="text-[11px] text-slate-400">
                                                {version?.original_filename || 'Dokumen Bukti'}
                                            </p>
                                        </div>
                                        <a
                                            href={downloadUrl}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 transition shadow-2xs"
                                        >
                                            <Download className="size-3.5" /> Unduh Dokumen
                                        </a>
                                    </div>
                                )}
                            </div>

                            {/* Meta Pills */}
                            {version && (
                                <div className="flex flex-wrap items-center justify-center gap-2 text-[11px]">
                                    <span className="inline-flex items-center gap-1 rounded-md border border-slate-200/80 bg-slate-50/80 px-2 py-0.5 font-medium text-slate-600 dark:border-white/10 dark:bg-[#16181f] dark:text-zinc-300">
                                        <FileText className="size-3 text-blue-500" />
                                        <span className="font-semibold text-slate-800 dark:text-zinc-200 truncate max-w-[200px]">{version.original_filename || version.mime_type}</span>
                                    </span>
                                    {version.file_size && (
                                        <span className="inline-flex items-center gap-1 rounded-md border border-slate-200/80 bg-slate-50/80 px-2 py-0.5 font-medium text-slate-600 dark:border-white/10 dark:bg-[#16181f] dark:text-zinc-300">
                                            <HardDrive className="size-3 text-purple-500" />
                                            <span>{formatBytes(version.file_size)}</span>
                                        </span>
                                    )}
                                    {version.created_at && (
                                        <span className="inline-flex items-center gap-1 rounded-md border border-slate-200/80 bg-slate-50/80 px-2 py-0.5 font-medium text-slate-600 dark:border-white/10 dark:bg-[#16181f] dark:text-zinc-300">
                                            <Clock className="size-3 text-emerald-500" />
                                            <span>{formatDate(version.created_at)}</span>
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <DialogFooter className="border-t border-slate-100 px-5 py-3 dark:border-white/[0.06] bg-slate-50/50 dark:bg-[#16181f]/60 flex flex-row items-center justify-between sm:justify-between">
                    <div className="flex items-center gap-2">
                        {hasProof && !isUploadingNew && (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setIsUploadingNew(true)}
                                className="h-8 rounded-lg border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:text-zinc-300 gap-1.5"
                            >
                                <UploadCloud className="size-3.5" /> Ganti Berkas
                            </Button>
                        )}
                        {hasProof && !isUploadingNew && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={handleDeleteProof}
                                className="h-8 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30 gap-1.5"
                            >
                                <Trash2 className="size-3.5" /> Hapus
                            </Button>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        {hasProof && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 rounded-lg border-slate-200 text-xs font-semibold text-slate-800 hover:bg-slate-100 dark:border-white/10 dark:text-zinc-200 gap-1.5"
                                asChild
                            >
                                <a href={downloadUrl} download>
                                    <Download className="size-3.5" /> Unduh Asli
                                </a>
                            </Button>
                        )}
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={handleClose}
                            className="h-8 rounded-lg text-xs font-semibold"
                        >
                            Tutup
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
