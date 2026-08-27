import { Form, router } from '@inertiajs/react';
import {
    Download,
    Eye,
    FileCheck,
    FileText,
    ImageIcon,
    Loader2,
    Maximize2,
    RefreshCw,
    RotateCw,
    Trash2,
    UploadCloud,
    X,
    ZoomIn,
    ZoomOut,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { FileInput } from '@/components/ui/file-input';
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
        onClose();
    };

    const handleDeleteProof = () => {
        if (!confirm('Apakah Anda yakin ingin menghapus bukti transaksi ini?')) {
            return;
        }
        router.delete(`/finance/${target.entity}/${target.id}/proof`, {
            preserveScroll: true,
            onSuccess: () => {
                handleClose();
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="max-w-4xl max-h-[92vh] flex flex-col p-0 gap-0 overflow-hidden bg-background border shadow-2xl">
                {/* Header */}
                <DialogHeader className="p-4 sm:p-5 border-b bg-muted/20 flex flex-row items-center justify-between space-y-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            {isImage ? <ImageIcon className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                        </div>
                        <div>
                            <DialogTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
                                <span>{target.title}</span>
                                {hasProof && (
                                    <span className="inline-flex items-center gap-1 text-xs font-normal px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                        <FileCheck className="w-3 h-3" /> Bukti Terlampir
                                    </span>
                                )}
                            </DialogTitle>
                            <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                                {target.subtitle || 'Lampiran Bukti Transaksi Keuangan'}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {/* Body Content */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 min-h-[300px] flex flex-col items-center justify-center bg-muted/10">
                    {!hasProof || isUploadingNew ? (
                        <div className="w-full max-w-md bg-card p-6 rounded-2xl border shadow-sm space-y-4 text-center">
                            <div className="w-14 h-14 mx-auto rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                                <UploadCloud className="w-7 h-7" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-sm font-semibold">
                                    {hasProof ? 'Ganti / Unggah Ulang Bukti' : 'Unggah Bukti Transaksi'}
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                    Format yang didukung: PDF, JPG, JPEG, PNG, WEBP (Maks. 20 MB)
                                </p>
                            </div>

                            <Form
                                action={`/finance/${target.entity}/${target.id}/proof`}
                                method="post"
                                encType="multipart/form-data"
                                className="space-y-4 text-left"
                                onSuccess={() => {
                                    setIsUploadingNew(false);
                                    handleClose();
                                }}
                            >
                                {({ processing }) => (
                                    <>
                                        <div className="space-y-2">
                                            <FileInput
                                                name="proof"
                                                accept=".pdf,.jpg,.jpeg,.png,.webp,image/*,application/pdf"
                                                required
                                            />
                                        </div>

                                        <div className="flex items-center justify-end gap-2 pt-2">
                                            {hasProof && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setIsUploadingNew(false)}
                                                    disabled={processing}
                                                >
                                                    Batal
                                                </Button>
                                            )}
                                            <Button
                                                type="submit"
                                                size="sm"
                                                disabled={processing}
                                                className="gap-2"
                                            >
                                                {processing && <Loader2 className="w-4 h-4 animate-spin" />}
                                                Simpan Bukti
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </Form>
                        </div>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
                            {/* Toolbar for image */}
                            {isImage && (
                                <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-card/90 backdrop-blur border shadow-sm">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon-sm"
                                        onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 3))}
                                        title="Perbesar"
                                    >
                                        <ZoomIn className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon-sm"
                                        onClick={() => setZoomLevel((z) => Math.max(z - 0.25, 0.5))}
                                        title="Perkecil"
                                    >
                                        <ZoomOut className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon-sm"
                                        onClick={() => setRotation((r) => (r + 90) % 360)}
                                        title="Putar"
                                    >
                                        <RotateCw className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon-sm"
                                        onClick={() => {
                                            setZoomLevel(1);
                                            setRotation(0);
                                        }}
                                        title="Reset"
                                    >
                                        <RefreshCw className="w-3.5 h-3.5" />
                                    </Button>
                                    <div className="h-4 w-px bg-border mx-1" />
                                    <a
                                        href={previewUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center h-8 w-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
                                        title="Buka Tab Baru"
                                    >
                                        <Maximize2 className="w-4 h-4" />
                                    </a>
                                </div>
                            )}

                            {/* Viewer */}
                            <div className="w-full flex-1 max-h-[58vh] overflow-auto flex items-center justify-center rounded-xl bg-background/50 border p-2">
                                {isImage ? (
                                    <div className="overflow-hidden flex items-center justify-center p-2">
                                        <img
                                            src={previewUrl}
                                            alt={target.title}
                                            style={{
                                                transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                                                transition: 'transform 0.2s ease-in-out',
                                            }}
                                            className="max-h-[52vh] w-auto max-w-full object-contain rounded-lg shadow-sm"
                                        />
                                    </div>
                                ) : isPdf ? (
                                    <iframe
                                        src={`${previewUrl}#toolbar=1&navpanes=0`}
                                        title={target.title}
                                        className="w-full h-[52vh] rounded-lg border-0 bg-white"
                                    />
                                ) : (
                                    <div className="text-center p-8 space-y-3">
                                        <FileText className="w-12 h-12 mx-auto text-muted-foreground/60" />
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium">Pratinjau langsung tidak tersedia untuk format file ini.</p>
                                            <p className="text-xs text-muted-foreground">{version?.original_filename || 'Dokumen Bukti'}</p>
                                        </div>
                                        <a
                                            href={downloadUrl}
                                            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition shadow-sm"
                                        >
                                            <Download className="w-4 h-4" /> Unduh Dokumen
                                        </a>
                                    </div>
                                )}
                            </div>

                            {/* File Meta */}
                            {version && (
                                <div className="text-xs text-muted-foreground flex flex-wrap items-center justify-center gap-3">
                                    <span>Tipe: <strong className="text-foreground">{version.mime_type || 'Unknown'}</strong></span>
                                    {version.file_size && <span>Ukuran: <strong className="text-foreground">{formatBytes(version.file_size)}</strong></span>}
                                    {version.created_at && <span>Diunggah: <strong className="text-foreground">{formatDate(version.created_at)}</strong></span>}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <DialogFooter className="p-4 border-t bg-muted/20 flex flex-row items-center justify-between sm:justify-between">
                    <div className="flex items-center gap-2">
                        {hasProof && !isUploadingNew && (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setIsUploadingNew(true)}
                                className="gap-1.5 text-xs"
                            >
                                <UploadCloud className="w-3.5 h-3.5" /> Ganti Bukti
                            </Button>
                        )}
                        {hasProof && !isUploadingNew && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={handleDeleteProof}
                                className="gap-1.5 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                                <Trash2 className="w-3.5 h-3.5" /> Hapus
                            </Button>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        {hasProof && (
                            <a
                                href={downloadUrl}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium bg-background hover:bg-muted text-foreground transition"
                                download
                            >
                                <Download className="w-3.5 h-3.5" /> Unduh
                            </a>
                        )}
                        <Button type="button" variant="ghost" size="sm" onClick={handleClose}>
                            Tutup
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
