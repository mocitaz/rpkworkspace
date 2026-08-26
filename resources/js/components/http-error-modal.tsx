import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import {
    AlertTriangle,
    Check,
    Copy,
    HardDriveUpload,
    HelpCircle,
    RefreshCw,
    Server,
    ShieldAlert,
    X,
} from 'lucide-react';
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
    status: number;
    title: string;
    description: string;
    details?: string;
    isPayloadTooLarge?: boolean;
}

const SERVER_CONFIG_GUIDE = `# 1. Ubah batasan upload Nginx (/etc/nginx/nginx.conf):
client_max_body_size 25M;

# 2. Ubah batasan upload PHP (/etc/php/8.4/fpm/php.ini):
upload_max_filesize = 25M
post_max_size = 25M

# 3. Reload Nginx & Restart PHP-FPM:
sudo nginx -t && sudo systemctl reload nginx && sudo systemctl restart php8.4-fpm`;

export function HttpErrorModal() {
    const [open, setOpen] = useState(false);
    const [errorInfo, setErrorInfo] = useState<HttpErrorInfo | null>(null);
    const [copied, setCopied] = useState(false);
    const [activeTab, setActiveTab] = useState<'user' | 'admin'>('user');

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
                    status: 413,
                    title: 'Ukuran Berkas Terlalu Besar (HTTP 413)',
                    description:
                        'Berkas atau foto yang Anda unggah melebihi batas kapasitas maksimal yang diizinkan oleh web server (Nginx). Permintaan ditolak sebelum mencapai sistem.',
                    details: '413 Request Entity Too Large (nginx/1.24.0)',
                    isPayloadTooLarge: true,
                });
                setOpen(true);
                toast.error('Gagal Mengunggah: Ukuran berkas melebihi batas server (Error 413).');
            }
        });

        // Custom window event listener for manual triggering from client-side file upload validators
        const handleCustom413 = (e: CustomEvent) => {
            const detail = e.detail || {};
            setErrorInfo({
                status: 413,
                title: detail.title || 'Ukuran Berkas Terlalu Besar (Maksimal 5MB)',
                description:
                    detail.description ||
                    'Berkas yang Anda pilih melebihi kapasitas yang dianjurkan (5MB) dan berisiko ditolak oleh server web.',
                details: detail.fileInfo || 'Ukuran file melebihi batas 5MB.',
                isPayloadTooLarge: true,
            });
            setOpen(true);
        };

        window.addEventListener('app:entity-too-large', handleCustom413 as EventListener);

        return () => {
            unbindHttpException();
            window.removeEventListener('app:entity-too-large', handleCustom413 as EventListener);
        };
    }, []);

    const handleCopyGuide = () => {
        navigator.clipboard.writeText(SERVER_CONFIG_GUIDE);
        setCopied(true);
        toast.success('Panduan konfigurasi server berhasil disalin ke clipboard.');
        setTimeout(() => setCopied(false), 3000);
    };

    if (!errorInfo) return null;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-lg overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-0 shadow-2xl sm:max-w-xl dark:border-white/10 dark:bg-[#14161b]">
                {/* Header with Visual Badge */}
                <div className="border-b border-slate-100 bg-rose-50/50 p-5 dark:border-white/5 dark:bg-rose-950/20">
                    <DialogHeader>
                        <div className="flex items-start gap-3.5">
                            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-rose-200 bg-rose-100 text-rose-600 shadow-2xs dark:border-rose-900/40 dark:bg-rose-900/30 dark:text-rose-400">
                                <HardDriveUpload className="size-5.5" />
                            </div>
                            <div className="space-y-1 text-left">
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center rounded-md bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold tracking-wide text-rose-700 uppercase dark:bg-rose-500/20 dark:text-rose-300">
                                        Error 413 Payload Too Large
                                    </span>
                                    <span className="text-[11px] text-slate-400 dark:text-zinc-500">
                                        Nginx / Web Server
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

                {/* Body Content with Tabs */}
                <div className="space-y-4 p-5">
                    {/* Mode Toggle: Staf / User vs Server Admin */}
                    <div className="flex rounded-lg border border-slate-200/80 bg-slate-100/70 p-1 dark:border-white/10 dark:bg-[#181a20]">
                        <button
                            type="button"
                            onClick={() => setActiveTab('user')}
                            className={`flex-1 rounded-md py-1.5 text-xs font-semibold transition-all ${
                                activeTab === 'user'
                                    ? 'bg-white text-slate-900 shadow-2xs dark:bg-zinc-800 dark:text-white'
                                    : 'text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200'
                            }`}
                        >
                            Panduan Pengguna (Staf)
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('admin')}
                            className={`flex-1 rounded-md py-1.5 text-xs font-semibold transition-all ${
                                activeTab === 'admin'
                                    ? 'bg-white text-slate-900 shadow-2xs dark:bg-zinc-800 dark:text-white'
                                    : 'text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200'
                            }`}
                        >
                            Konfigurasi Server (VPS Admin)
                        </button>
                    </div>

                    {activeTab === 'user' ? (
                        <div className="space-y-3 rounded-xl border border-slate-100 bg-slate-50/70 p-4 text-xs dark:border-white/5 dark:bg-[#181a20]/60">
                            <h4 className="font-bold text-slate-800 dark:text-zinc-200">
                                Solusi Cepat untuk Pengguna:
                            </h4>
                            <ul className="space-y-2 text-slate-600 dark:text-zinc-300">
                                <li className="flex items-start gap-2">
                                    <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                                        1
                                    </span>
                                    <span>
                                        <strong>Gunakan berkas di bawah 5MB:</strong> Kompres foto profil
                                        atau dokumen Anda menggunakan kompresor gambar online atau aplikasi foto.
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                                        2
                                    </span>
                                    <span>
                                        <strong>Format yang disarankan:</strong> Gunakan format <code>.jpg</code>,{' '}
                                        <code>.png</code>, atau <code>.webp</code> untuk foto resolusi wajar (1000x1000 px).
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                                        3
                                    </span>
                                    <span>
                                        Tutup jendela peringatan ini dan pilih file foto yang lebih kecil.
                                    </span>
                                </li>
                            </ul>
                        </div>
                    ) : (
                        <div className="space-y-2.5">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                                    Perbesar Batas Upload Nginx &amp; PHP:
                                </span>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleCopyGuide}
                                    className="h-6 px-2 text-[11px] font-semibold text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/40"
                                >
                                    {copied ? (
                                        <>
                                            <Check className="mr-1 size-3 text-emerald-600" />
                                            Tersalin!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="mr-1 size-3" />
                                            Salin Panduan
                                        </>
                                    )}
                                </Button>
                            </div>

                            <pre className="overflow-x-auto rounded-xl border border-slate-200 bg-slate-900 p-3 font-mono text-[11px] leading-relaxed text-slate-200 shadow-inner dark:border-white/10 dark:bg-black/60">
                                <code>{SERVER_CONFIG_GUIDE}</code>
                            </pre>
                            <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                                Jalankan perintah di atas via terminal SSH pada server VPS Ubuntu agar batas unggah server ditingkatkan menjadi 25MB.
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50/50 p-4 dark:border-white/5 dark:bg-zinc-900/30">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => window.location.reload()}
                        className="h-8.5 rounded-lg border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-300"
                    >
                        <RefreshCw className="mr-1.5 size-3.5 text-slate-400" />
                        Muat Ulang Halaman
                    </Button>
                    <Button
                        type="button"
                        size="sm"
                        onClick={() => setOpen(false)}
                        className="h-8.5 rounded-lg bg-blue-600 px-4 text-xs font-bold text-white shadow-2xs hover:bg-blue-700 active:scale-[0.98] dark:bg-blue-600 dark:hover:bg-blue-500"
                    >
                        Tutup &amp; Pilih File Lain
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
