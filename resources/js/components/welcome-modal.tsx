import { Link } from '@inertiajs/react';
import { Briefcase, Calendar, CheckCircle2, FileText, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import * as calendarRoutes from '@/routes/calendar';

interface WelcomeModalProps {
    user: {
        id: string | number;
        name: string;
        email?: string;
    };
    activeMattersCount?: number;
    openTasksCount?: number;
    todayDeadlinesCount?: number;
}

export function WelcomeModal({
    user,
    activeMattersCount = 0,
    openTasksCount = 0,
    todayDeadlinesCount = 0,
}: WelcomeModalProps) {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (!user?.id) return;
        const sessionKey = `rpk_welcome_shown_${user.id}`;
        const hasShown = sessionStorage.getItem(sessionKey);

        if (!hasShown) {
            // Small delay for smooth entry after page load
            const timer = setTimeout(() => {
                setIsOpen(true);
            }, 600);

            return () => clearTimeout(timer);
        }
    }, [user?.id]);

    const handleClose = (open: boolean) => {
        setIsOpen(open);
        if (!open && user?.id) {
            sessionStorage.setItem(`rpk_welcome_shown_${user.id}`, 'true');
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-md overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-0 shadow-2xl dark:border-white/10 dark:bg-[#16181d]">
                {/* Top Subtle Header Decoration */}
                <div className="relative border-b border-slate-100 bg-gradient-to-b from-slate-50 to-white px-6 pt-6 pb-5 dark:border-white/[0.06] dark:from-white/[0.03] dark:to-transparent">
                    <div className="flex items-center gap-3">
                        <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200/80 bg-white p-1 shadow-2xs dark:border-white/15 dark:bg-zinc-900">
                            <img
                                src="/logo/logo.png"
                                alt="RPK Law Firm"
                                className="size-full object-contain"
                            />
                        </div>
                        <div className="min-w-0">
                            <span className="font-mono text-[9px] font-bold tracking-widest text-slate-400 uppercase dark:text-zinc-500">
                                RPK LAW FIRM · WORKSPACE
                            </span>
                            <DialogTitle className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white">
                                Selamat Datang, {user?.name}
                            </DialogTitle>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 px-6 py-4">
                    <DialogDescription className="text-xs leading-relaxed text-slate-600 dark:text-zinc-400">
                        Selamat bekerja. Berikut rangkuman hal-hal penting untuk memastikan kelancaran administrasi perkara dan kepatuhan standar kerja hari ini:
                    </DialogDescription>

                    {/* Quick Checklist Reminders */}
                    <div className="space-y-2.5">
                        <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3 dark:border-white/[0.04] dark:bg-white/[0.02]">
                            <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                                <FileText className="size-3.5" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-bold text-slate-900 dark:text-white">
                                    Verifikasi Berkas & Dokumen
                                </p>
                                <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                                    Periksa draft advice hukum dan dokumen perkara yang menunggu review.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3 dark:border-white/[0.04] dark:bg-white/[0.02]">
                            <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
                                <Calendar className="size-3.5" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-bold text-slate-900 dark:text-white">
                                    Agenda & Tenggat Kritis
                                </p>
                                <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                                    Pastikan jadwal sidang, rapat koordinasi, dan deadline minggu ini terpantau.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3 dark:border-white/[0.04] dark:bg-white/[0.02]">
                            <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                                <ShieldCheck className="size-3.5" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-bold text-slate-900 dark:text-white">
                                    Kerahasiaan & Kepatuhan
                                </p>
                                <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                                    Seluruh data perkara dan komunikasi klien bersifat konfidensial.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Mini Status Footer Strip */}
                    <div className="flex items-center justify-between rounded-lg bg-slate-100/80 px-3 py-2 text-[11px] text-slate-600 dark:bg-white/[0.04] dark:text-zinc-400">
                        <span className="flex items-center gap-1">
                            <Briefcase className="size-3 text-slate-400" />
                            <strong>{activeMattersCount}</strong> Perkara Aktif
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                            <CheckCircle2 className="size-3 text-slate-400" />
                            <strong>{openTasksCount}</strong> Tugas Terbuka
                        </span>
                        <span>•</span>
                        <span>
                            <strong>{todayDeadlinesCount}</strong> Deadline Hari Ini
                        </span>
                    </div>
                </div>

                {/* Actions Footer */}
                <DialogFooter className="flex-row items-center justify-between border-t border-slate-100 bg-slate-50/50 px-6 py-3.5 dark:border-white/[0.06] dark:bg-[#16181d]">
                    <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        onClick={() => handleClose(false)}
                        className="text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white"
                    >
                        <Link href={calendarRoutes.index()}>
                            Buka Kalender
                        </Link>
                    </Button>

                    <Button
                        onClick={() => handleClose(false)}
                        className="rounded-xl bg-blue-600 px-5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 active:scale-98 dark:bg-blue-600 dark:hover:bg-blue-500"
                    >
                        Lanjutkan ke Workspace
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
