import { Form } from '@inertiajs/react';
import {
    Download,
    ExternalLink,
    FileCheck,
    FileText,
    Loader2,
    Paperclip,
    RefreshCw,
    RotateCw,
    ShieldCheck,
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
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { formatBytes, formatDate } from '@/lib/format';
import { financeDialogPanelClass } from './finance-dialog-design';

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
    entity:
        | 'expenses'
        | 'payments'
        | 'invoices'
        | 'payrolls'
        | 'partner-transactions'
        | 'transfers'
        | 'client-trust-funds';
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
    const [selectedFilePreview, setSelectedFilePreview] = useState<
        string | null
    >(null);
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

    const previewUrl =
        hasProof && version
            ? `/documents/${proofDoc!.id}/versions/${version.id}/preview`
            : '';
    const downloadUrl =
        hasProof && version
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

    const showUploader = !hasProof || isUploadingNew;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent
                className={financeDialogPanelClass(
                    showUploader ? 'compact' : 'wide',
                )}
            >
                {/* Header */}
                <DialogHeader className="border-b border-slate-100 bg-slate-50/40 px-5 py-3.5 dark:border-white/[0.06] dark:bg-[#16181f]/40">
                    <div className="grid grid-cols-[36px_minmax(0,1fr)] items-center gap-3 pr-6">
                        <div className="flex size-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-slate-500 dark:border-white/10 dark:bg-white/[0.06] dark:text-zinc-400">
                            <Paperclip className="size-4.5" strokeWidth={1.8} />
                        </div>
                        <div className="min-w-0 self-center">
                            <DialogTitle className="truncate text-sm leading-5 font-bold text-slate-900 sm:text-base dark:text-white">{target.title}</DialogTitle>
                            <p className="truncate text-[11px] leading-4 text-slate-500 dark:text-zinc-400">Pratinjau dan kelola bukti keuangan.</p>
                        </div>
                    </div>
                </DialogHeader>

                {/* Body Content */}
                {showUploader ? (
                    <Form
                        action={`/finance/${target.entity}/${target.id}/proof`}
                        method="post"
                        encType="multipart/form-data"
                        className="flex flex-1 flex-col"
                        onSuccess={() => {
                            setIsUploadingNew(false);
                            toast.success(
                                'Berkas bukti transaksi berhasil diunggah!',
                            );
                            handleClose();
                        }}
                        onError={() => {
                            toast.error('Gagal mengunggah berkas bukti.');
                        }}
                    >
                        {({ processing }) => (
                            <>
                                <div className="flex-1 space-y-4 p-5">
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
                                            if (
                                                e.dataTransfer.files &&
                                                e.dataTransfer.files[0]
                                            ) {
                                                handleFileSelect(
                                                    e.dataTransfer.files[0],
                                                );
                                                if (fileInputRef.current) {
                                                    const dt =
                                                        new DataTransfer();
                                                    dt.items.add(
                                                        e.dataTransfer.files[0],
                                                    );
                                                    fileInputRef.current.files =
                                                        dt.files;
                                                }
                                            }
                                        }}
                                        onClick={() =>
                                            fileInputRef.current?.click()
                                        }
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
                                                {[
                                                    'PDF',
                                                    'JPG',
                                                    'PNG',
                                                    'WEBP',
                                                ].map((fmt) => (
                                                    <span
                                                        key={fmt}
                                                        className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-slate-600 dark:bg-white/10 dark:text-zinc-300"
                                                    >
                                                        {fmt}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Preview selected image if any */}
                                    {selectedFilePreview && (
                                        <div className="relative flex h-28 items-center justify-center overflow-hidden rounded-xl border border-slate-200/80 bg-slate-900/5 p-1 dark:border-white/10 dark:bg-black/30">
                                            <img
                                                src={selectedFilePreview}
                                                alt="Preview"
                                                className="max-h-24 w-auto max-w-full rounded-lg object-contain shadow-xs"
                                            />
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleFileSelect(null);
                                                }}
                                                className="absolute top-2 right-2 flex size-5.5 items-center justify-center rounded-full bg-slate-900/70 text-white transition-colors hover:bg-rose-600"
                                                title="Hapus pilihan berkas"
                                            >
                                                <X className="size-3" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <DialogFooter className="flex flex-row items-center justify-between border-t border-slate-100 bg-slate-50/50 px-5 py-3 sm:justify-between dark:border-white/[0.06] dark:bg-[#16181f]/60">
                                    <div className="flex items-center gap-1 text-[10.5px] text-slate-400">
                                        <ShieldCheck className="size-3 text-emerald-500" />
                                        <span>
                                            Terisolasi dari berkas perkara
                                        </span>
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
                                            disabled={
                                                processing || !selectedFile
                                            }
                                            className="h-8.5 gap-1.5 rounded-lg bg-blue-600 px-4 text-xs font-semibold text-white shadow-2xs hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-700"
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
                    <div className="flex flex-1 flex-col">
                        <div className="space-y-3 p-4 sm:p-5">
                            {/* Toolbar for Image */}
                            {isImage && (
                                <div className="flex items-center justify-center">
                                    <div className="flex items-center gap-1 rounded-lg border border-slate-200/80 bg-slate-100/90 p-1 shadow-2xs dark:border-white/10 dark:bg-[#16181f]/90">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="size-7 rounded-md text-slate-600 hover:bg-white dark:text-zinc-300 dark:hover:bg-white/10"
                                            onClick={() =>
                                                setZoomLevel((z) =>
                                                    Math.min(z + 0.25, 3),
                                                )
                                            }
                                            title="Zoom In"
                                        >
                                            <ZoomIn className="size-3.5" />
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="size-7 rounded-md text-slate-600 hover:bg-white dark:text-zinc-300 dark:hover:bg-white/10"
                                            onClick={() =>
                                                setZoomLevel((z) =>
                                                    Math.max(z - 0.25, 0.5),
                                                )
                                            }
                                            title="Zoom Out"
                                        >
                                            <ZoomOut className="size-3.5" />
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="size-7 rounded-md text-slate-600 hover:bg-white dark:text-zinc-300 dark:hover:bg-white/10"
                                            onClick={() =>
                                                setRotation(
                                                    (r) => (r + 90) % 360,
                                                )
                                            }
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
                            <div className="relative flex h-[50vh] w-full items-center justify-center overflow-hidden rounded-xl border border-slate-200/80 bg-slate-900/5 p-1 sm:h-[54vh] dark:border-white/10 dark:bg-black/30">
                                {isImage ? (
                                    <div className="flex h-full w-full items-center justify-center overflow-auto p-2">
                                        <img
                                            src={previewUrl}
                                            alt={target.title}
                                            style={{
                                                transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                                                transition:
                                                    'transform 0.15s ease-out',
                                            }}
                                            className="max-h-full max-w-full rounded-lg object-contain shadow-sm"
                                        />
                                    </div>
                                ) : isPdf ? (
                                    <iframe
                                        src={`${previewUrl}#toolbar=1&navpanes=0`}
                                        title={target.title}
                                        className="h-full w-full rounded-lg border-0 bg-white shadow-xs"
                                    />
                                ) : (
                                    <div className="space-y-2 p-6 text-center">
                                        <FileText className="mx-auto size-12 text-slate-400" />
                                        <p className="text-xs font-semibold text-slate-800 dark:text-white">
                                            {version?.original_filename ||
                                                'Dokumen Bukti'}
                                        </p>
                                        <p className="text-[11px] text-slate-500">
                                            Format berkas tidak mendukung
                                            pratinjau langsung.
                                        </p>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="mt-2 h-7.5 rounded-lg text-xs"
                                            asChild
                                        >
                                            <a href={downloadUrl} download>
                                                <Download className="mr-1 size-3" />
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
                                    <span className="max-w-xs truncate font-medium text-slate-800 dark:text-zinc-200">
                                        {version?.original_filename ||
                                            'Dokumen'}
                                    </span>
                                    <span>•</span>
                                    <span>
                                        {version?.file_size
                                            ? formatBytes(version.file_size)
                                            : 'File'}
                                    </span>
                                    <span>•</span>
                                    <span>
                                        {version?.created_at
                                            ? formatDate(version.created_at)
                                            : ''}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <DialogFooter className="flex flex-row items-center justify-between border-t border-slate-100 bg-slate-50/50 px-5 py-3 sm:justify-between dark:border-white/[0.06] dark:bg-[#16181f]/60">
                            <div className="flex items-center gap-1.5">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setIsUploadingNew(true)}
                                    className="h-8.5 rounded-lg text-xs font-semibold"
                                >
                                    <UploadCloud className="mr-1 size-3.5" />
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
                                        <Download className="mr-1 size-3.5" />
                                        Unduh
                                    </a>
                                </Button>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8.5 rounded-lg text-xs font-semibold"
                                    asChild
                                >
                                    <a
                                        href={previewUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <ExternalLink className="mr-1 size-3.5" />
                                        Fullscreen
                                    </a>
                                </Button>

                                <Button
                                    type="button"
                                    variant="default"
                                    size="sm"
                                    onClick={handleClose}
                                    className="h-8.5 rounded-lg bg-slate-900 px-4 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-zinc-100"
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
