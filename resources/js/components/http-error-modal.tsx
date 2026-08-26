import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import { HardDriveUpload } from 'lucide-react';
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

interface HttpErrorInfo {
    title: string;
    description: string;
    fileInfo?: string;
}

export function HttpErrorModal() {
    const [open, setOpen] = useState(false);
    const [errorInfo, setErrorInfo] = useState<HttpErrorInfo | null>(null);

    useEffect(() => {
        // Listener for Inertia v3 httpException
        const unbindHttpException = router.on('httpException', (event) => {
            const response = event.detail.response;
            const status = response?.status;
            const responseText = typeof response?.data === 'string' ? response.data : '';

            const is413 =
                status === 413 ||
                responseText.includes('413 Request Entity Too Large') ||
                responseText.includes('Request Entity Too Large');

            if (is413) {
                // Prevent the default Inertia unhandled modal
                event.preventDefault();

                setErrorInfo({
                    title: 'Ukuran Berkas Terlalu Besar',
                    description:
                        'Berkas yang Anda unggah melebihi batas maksimal ukuran yang diizinkan oleh server. Silakan pilih berkas yang lebih kecil atau kompres terlebih dahulu.',
                });
                setOpen(true);
                toast.error('Gagal Mengunggah: Ukuran berkas melebihi batas server (Error 413).');
            }
        });

        // Custom window event listener for manual triggering from client-side file upload validators
        const handleCustom413 = (e: CustomEvent) => {
            const detail = e.detail || {};
            setErrorInfo({
                title: detail.title || 'Ukuran Berkas Terlalu Besar',
                description:
                    detail.description ||
                    'Berkas yang Anda pilih melebihi batas maksimal ukuran (5MB). Silakan pilih berkas dengan ukuran yang lebih kecil.',
                fileInfo: detail.fileInfo,
            });
            setOpen(true);
        };

        window.addEventListener('app:entity-too-large', handleCustom413 as EventListener);

        return () => {
            unbindHttpException();
            window.removeEventListener('app:entity-too-large', handleCustom413 as EventListener);
        };
    }, []);

    if (!errorInfo) return null;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-md overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-0 shadow-2xl dark:border-white/10 dark:bg-[#14161b]">
                {/* Header with Visual Badge & Alert Icon */}
                <div className="border-b border-slate-100 bg-rose-50/60 p-5 dark:border-white/5 dark:bg-rose-950/20">
                    <DialogHeader>
                        <div className="flex items-start gap-3.5">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-rose-200 bg-rose-100 text-rose-600 shadow-2xs dark:border-rose-900/40 dark:bg-rose-900/30 dark:text-rose-400">
                                <HardDriveUpload className="size-5" />
                            </div>
                            <div className="space-y-1 text-left">
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center rounded-md bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold tracking-wide text-rose-700 uppercase dark:bg-rose-500/20 dark:text-rose-300">
                                        Peringatan Unggahan
                                    </span>
                                </div>
                                <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
                                    {errorInfo.title}
                                </DialogTitle>
                                <DialogDescription className="text-xs leading-relaxed text-slate-600 dark:text-zinc-400">
                                    {errorInfo.description}
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                </div>

                {/* Optional File Detail */}
                {errorInfo.fileInfo && (
                    <div className="px-5 pt-4">
                        <div className="flex items-center gap-2 rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-2 text-xs text-slate-700 dark:border-white/10 dark:bg-[#181a20] dark:text-zinc-300">
                            <span className="font-semibold text-slate-500 dark:text-zinc-400">Berkas:</span>
                            <span className="truncate font-medium">{errorInfo.fileInfo}</span>
                        </div>
                    </div>
                )}

                {/* Footer Action */}
                <div className="flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50/50 p-4 dark:border-white/5 dark:bg-zinc-900/30">
                    <Button
                        type="button"
                        size="sm"
                        onClick={() => setOpen(false)}
                        className="h-8.5 rounded-lg bg-blue-600 px-4 text-xs font-bold text-white shadow-2xs hover:bg-blue-700 active:scale-[0.98] dark:bg-blue-600 dark:hover:bg-blue-500"
                    >
                        Tutup &amp; Pilih Berkas Lain
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

/**
 * Helper function to trigger the 413 entity-too-large modal from any client-side component.
 */
export function showEntityTooLargeAlert(options?: {
    title?: string;
    description?: string;
    fileInfo?: string;
}) {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(
            new CustomEvent('app:entity-too-large', {
                detail: options || {},
            })
        );
    }
}
