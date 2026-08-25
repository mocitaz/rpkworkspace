import { Link } from '@inertiajs/react';
import {
    Check,
    Copy,
    Download,
    ExternalLink,
    Eye,
    FileCode,
    FileText,
    FolderKanban,
    Maximize2,
    Minimize2,
    Printer,
    RotateCcw,
    Search,
    ShieldCheck,
    X,
    ZoomIn,
    ZoomOut,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { formatBytes, formatDate } from '@/lib/format';
import * as documentRoutes from '@/routes/documents';
import * as versionRoutes from '@/routes/documents/versions';

export interface PreviewableDocumentVersion {
    id?: string;
    version_number: number;
    original_filename?: string;
    mime_type: string;
    file_size: number;
    scan_status?: string;
    ocr_status?: string;
    extracted_text?: string | null;
    created_at?: string;
}

export interface PreviewableDocument {
    id: string;
    title: string;
    document_type?: string;
    confidentiality_level?: string;
    status?: string;
    matter?: {
        id: string;
        matter_number: string;
        title: string;
    } | null;
    client?: {
        id: string;
        display_name: string;
    } | null;
    current_version?: PreviewableDocumentVersion | null;
    versions?: PreviewableDocumentVersion[];
}

interface DocumentPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    document: PreviewableDocument | null;
}

export function DocumentPreviewModal({
    isOpen,
    onClose,
    document,
}: DocumentPreviewModalProps) {
    if (!document) return null;

    const versions = document.versions && document.versions.length > 0
        ? document.versions
        : document.current_version
          ? [document.current_version]
          : [];

    const [selectedVersionId, setSelectedVersionId] = useState<string>(
        document.current_version?.id || versions[0]?.id || '',
    );
    const [zoomLevel, setZoomLevel] = useState<number>(100);
    const [copied, setCopied] = useState<boolean>(false);
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        if (document) {
            setSelectedVersionId(document.current_version?.id || versions[0]?.id || '');
            setZoomLevel(100);
        }
    }, [document]);

    const currentVersion = versions.find((v) => v.id === selectedVersionId) || versions[0] || document.current_version;

    const previewUrl = currentVersion?.id
        ? versionRoutes.preview.url({
              document: document.id,
              version: currentVersion.id,
          })
        : '';

    const downloadUrl = currentVersion?.id
        ? versionRoutes.download.url({
              document: document.id,
              version: currentVersion.id,
          })
        : '';

    const handlePrint = () => {
        if (iframeRef.current && iframeRef.current.contentWindow) {
            try {
                iframeRef.current.contentWindow.focus();
                iframeRef.current.contentWindow.print();
            } catch (err) {
                window.open(previewUrl, '_blank')?.print();
            }
        } else {
            window.open(previewUrl, '_blank')?.print();
        }
    };

    const handleCopyText = () => {
        const textToCopy = `${document.title} - ${window.location.origin}/documents/${document.id}`;
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 20, 200));
    const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 20, 60));
    const handleZoomReset = () => setZoomLevel(100);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent
                className={`flex flex-col gap-0 border-slate-200/80 bg-white p-0 shadow-2xl transition-all dark:border-white/10 dark:bg-[#14161b] ${
                    isFullscreen
                        ? 'fixed inset-0 h-screen max-h-screen w-screen max-w-screen rounded-none'
                        : 'max-h-[92vh] w-[95vw] max-w-5xl rounded-2xl'
                }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5 dark:border-white/[0.06]">
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                            <Eye className="size-4.5" />
                        </div>

                        <div className="min-w-0">
                            <DialogTitle className="truncate text-sm font-bold text-slate-900 dark:text-white">
                                {document.title}
                            </DialogTitle>
                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-400">
                                {document.matter && (
                                    <span className="truncate font-mono font-medium">
                                        {document.matter.matter_number}
                                    </span>
                                )}
                                {document.client && (
                                    <>
                                        <span>•</span>
                                        <span className="truncate">
                                            {document.client.display_name}
                                        </span>
                                    </>
                                )}
                                {currentVersion?.file_size && (
                                    <>
                                        <span>•</span>
                                        <span className="font-mono">
                                            {formatBytes(currentVersion.file_size)}
                                        </span>
                                    </>
                                )}
                                <span className="inline-flex items-center gap-0.5 rounded bg-emerald-50 px-1.5 py-0.2 font-mono text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                                    <ShieldCheck className="size-2.5" />
                                    Terenkripsi
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Window Controls */}
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsFullscreen(!isFullscreen)}
                            className="size-8 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-white/[0.06] dark:hover:text-white"
                        >
                            {isFullscreen ? (
                                <Minimize2 className="size-4" />
                            ) : (
                                <Maximize2 className="size-4" />
                            )}
                        </Button>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 bg-slate-50/60 px-4 py-2 dark:border-white/[0.04] dark:bg-[#14161b]">
                    {/* Versions */}
                    <div className="flex flex-wrap items-center gap-1.5">
                        {versions.length > 1 && (
                            <div className="flex items-center gap-1">
                                <span className="text-[10px] text-slate-400 uppercase font-mono">
                                    Versi Berkas:
                                </span>
                                <div className="flex items-center gap-0.5">
                                    {versions.map((ver) => (
                                        <button
                                            key={ver.id ?? ver.version_number}
                                            type="button"
                                            onClick={() => ver.id && setSelectedVersionId(ver.id)}
                                            className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold transition-all ${
                                                selectedVersionId === ver.id
                                                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                                                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-300'
                                            }`}
                                        >
                                            v{ver.version_number}.0
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-1.5">
                        <div className="flex items-center gap-0.5 rounded-lg border border-slate-200/80 bg-white px-1 py-0.5 dark:border-white/10 dark:bg-[#121418]">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleZoomOut}
                                className="size-6 rounded text-slate-500 hover:bg-slate-100 dark:text-zinc-400"
                                title="Perkecil"
                            >
                                <ZoomOut className="size-3" />
                            </Button>
                            <span className="px-1 font-mono text-[10px] font-semibold text-slate-600 dark:text-zinc-300">
                                {zoomLevel}%
                            </span>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleZoomIn}
                                className="size-6 rounded text-slate-500 hover:bg-slate-100 dark:text-zinc-400"
                                title="Perbesar"
                            >
                                <ZoomIn className="size-3" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleZoomReset}
                                className="size-6 rounded text-slate-500 hover:bg-slate-100 dark:text-zinc-400"
                                title="Reset Zoom"
                            >
                                <RotateCcw className="size-2.5" />
                            </Button>
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCopyText}
                            className="h-7 rounded-lg border-slate-200 bg-white px-2.5 text-xs text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-[#121418] dark:text-zinc-300"
                        >
                            {copied ? (
                                <>
                                    <Check className="mr-1 size-3 text-emerald-600" />
                                    Tautan Tersalin
                                </>
                            ) : (
                                <>
                                    <Copy className="mr-1 size-3 text-slate-400" />
                                    Salin Tautan
                                </>
                            )}
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handlePrint}
                            className="h-7 rounded-lg border-slate-200 bg-white px-2.5 text-xs text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-[#121418] dark:text-zinc-300"
                        >
                            <Printer className="mr-1 size-3 text-slate-400" />
                            Cetak
                        </Button>

                        {downloadUrl && (
                            <a
                                href={downloadUrl}
                                download={currentVersion?.original_filename || 'document'}
                                className="inline-flex h-7 items-center rounded-lg bg-slate-900 px-2.5 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 active:scale-95 dark:bg-white dark:text-slate-900"
                            >
                                <Download className="mr-1 size-3" />
                                Unduh
                            </a>
                        )}

                        <Link
                            href={documentRoutes.show(document.id)}
                            className="inline-flex h-7 items-center rounded-lg border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-[#121418] dark:text-zinc-300"
                        >
                            <ExternalLink className="mr-1 size-3 text-slate-400" />
                            Detail
                        </Link>
                    </div>
                </div>

                {/* Viewport */}
                <div className="relative flex-1 overflow-hidden bg-slate-50 p-3 dark:bg-[#0c0d10]">
                    <div className="flex h-full min-h-[420px] w-full items-center justify-center overflow-auto rounded-lg border border-slate-200/80 bg-white dark:border-white/[0.06] dark:bg-[#14161b]">
                        {previewUrl ? (
                            <iframe
                                ref={iframeRef}
                                src={previewUrl}
                                title={`Preview ${document.title}`}
                                style={{
                                    transform: `scale(${zoomLevel / 100})`,
                                    transformOrigin: 'top center',
                                    width: `${(100 / zoomLevel) * 100}%`,
                                    height: `${(100 / zoomLevel) * 100}%`,
                                    minHeight: '420px',
                                }}
                                className="h-full w-full border-0 transition-transform duration-150"
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center p-8 text-center">
                                <FileText className="size-8 text-slate-300 dark:text-zinc-600" />
                                <p className="mt-2 text-xs font-semibold text-slate-700 dark:text-zinc-300">
                                    Pratinjau visual difokuskan pada format PDF dan gambar
                                </p>
                                <p className="mt-0.5 text-[11px] text-slate-400">
                                    Gunakan tombol Unduh untuk membuka berkas ini di perangkat Anda.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
