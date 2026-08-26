import { Link } from '@inertiajs/react';
import {
    ArrowRight,
    Briefcase,
    Calendar,
    CalendarClock,
    CalendarDays,
    CheckCircle2,
    FileCheck2,
    ShieldCheck,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
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

    // Dynamic greeting based on current local hour
    const greeting = useMemo(() => {
        const hour = new Date().getHours();
        if (hour >= 4 && hour < 11) return 'Selamat Pagi';
        if (hour >= 11 && hour < 15) return 'Selamat Siang';
        if (hour >= 15 && hour < 18) return 'Selamat Sore';
        return 'Selamat Malam';
    }, []);

    useEffect(() => {
        if (!user?.id) return;
        const sessionKey = `rpk_welcome_shown_${user.id}`;
        const hasShown = sessionStorage.getItem(sessionKey);
        const justLoggedIn = sessionStorage.getItem('rpk_just_logged_in');

        // Always show if just logged in or not yet shown in this browser session
        if (justLoggedIn === 'true' || !hasShown) {
            sessionStorage.removeItem('rpk_just_logged_in');
            const timer = setTimeout(() => {
                setIsOpen(true);
            }, 350);

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
            <DialogContent className="max-w-[450px] overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-0 gap-0 shadow-2xl sm:max-w-[450px] dark:border-white/10 dark:bg-[#14161b]">
                {/* 1. Modal Content Body with Tight Harmonious Spacing */}
                <div className="p-5 sm:p-6 space-y-3">
                    {/* Header: Logo + Greeting */}
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-slate-200/80 bg-white p-1 shadow-2xs dark:border-white/15 dark:bg-zinc-900">
                            <img
                                src="/logo/logo.png"
                                alt="RPK Law Firm"
                                className="size-full object-contain"
                            />
                        </div>

                        <div className="min-w-0 flex-1">
                            <DialogTitle className="truncate text-base font-bold tracking-tight text-slate-900 dark:text-white">
                                {greeting}, {user?.name}
                            </DialogTitle>
                            <DialogDescription className="mt-0.5 truncate text-xs text-slate-500 dark:text-zinc-400">
                                Selamat datang kembali di RPK App.
                            </DialogDescription>
                        </div>
                    </div>

                    {/* Compact 3-Column Symmetrical Status Track */}
                    <div className="grid grid-cols-3 divide-x divide-slate-200/80 rounded-xl border border-slate-200/70 bg-slate-50/70 py-2 px-1 dark:divide-white/10 dark:border-white/[0.06] dark:bg-white/[0.02]">
                        <div className="flex items-center justify-center gap-1.5 px-2">
                            <Briefcase className="size-3.5 shrink-0 text-blue-600 dark:text-blue-400" />
                            <div className="flex items-baseline gap-1">
                                <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                                    {activeMattersCount}
                                </span>
                                <span className="text-[10.5px] font-medium text-slate-500 dark:text-zinc-400">
                                    Perkara
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-center gap-1.5 px-2">
                            <CheckCircle2 className="size-3.5 shrink-0 text-indigo-600 dark:text-indigo-400" />
                            <div className="flex items-baseline gap-1">
                                <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                                    {openTasksCount}
                                </span>
                                <span className="text-[10.5px] font-medium text-slate-500 dark:text-zinc-400">
                                    Tugas
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-center gap-1.5 px-2">
                            <CalendarClock
                                className={`size-3.5 shrink-0 ${
                                    todayDeadlinesCount > 0
                                        ? 'text-rose-600 dark:text-rose-400'
                                        : 'text-amber-600 dark:text-amber-400'
                                }`}
                            />
                            <div className="flex items-baseline gap-1">
                                <span
                                    className={`font-mono text-xs font-bold ${
                                        todayDeadlinesCount > 0
                                            ? 'text-rose-600 dark:text-rose-400'
                                            : 'text-slate-900 dark:text-white'
                                    }`}
                                >
                                    {todayDeadlinesCount}
                                </span>
                                <span className="text-[10.5px] font-medium text-slate-500 dark:text-zinc-400">
                                    Deadline
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Unified Grouped Operational Guidance Box */}
                    <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-2xs divide-y divide-slate-100 dark:divide-white/[0.05] dark:border-white/10 dark:bg-[#16181d]">
                        <div className="flex items-center gap-3 p-2.5 sm:p-3 transition-colors hover:bg-slate-50/60 dark:hover:bg-white/[0.02]">
                            <div className="flex size-7.5 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                                <FileCheck2 className="size-3.5" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-bold text-slate-900 dark:text-white">
                                    Verifikasi Berkas &amp; Dokumen
                                </p>
                                <p className="mt-0.5 text-[11px] text-slate-500 dark:text-zinc-400">
                                    Periksa draf advice hukum &amp; berkas perkara menunggu review.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-2.5 sm:p-3 transition-colors hover:bg-slate-50/60 dark:hover:bg-white/[0.02]">
                            <div className="flex size-7.5 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
                                <CalendarDays className="size-3.5" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-bold text-slate-900 dark:text-white">
                                    Agenda Sidang &amp; Tenggat Kritis
                                </p>
                                <p className="mt-0.5 text-[11px] text-slate-500 dark:text-zinc-400">
                                    Pantau jadwal sidang peradilan &amp; deadline perkara minggu ini.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-2.5 sm:p-3 transition-colors hover:bg-slate-50/60 dark:hover:bg-white/[0.02]">
                            <div className="flex size-7.5 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                                <ShieldCheck className="size-3.5" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-bold text-slate-900 dark:text-white">
                                    Kerahasiaan Advokat &amp; Kepatuhan
                                </p>
                                <p className="mt-0.5 text-[11px] text-slate-500 dark:text-zinc-400">
                                    Seluruh komunikasi klien &amp; berkas bersifat konfidensial.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Modal Actions Footer (Flush border-t without stray grid gap) */}
                <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/60 px-5 py-3.5 sm:px-6 dark:border-white/[0.06] dark:bg-[#121418]">
                    <Button
                        asChild
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleClose(false)}
                        className="h-8.5 rounded-xl border-slate-200/80 px-3.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-100/80 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                    >
                        <Link
                            href={calendarRoutes.index()}
                            className="flex items-center gap-1.5"
                        >
                            <Calendar className="size-3.5 text-slate-500" />
                            Buka Kalender
                        </Link>
                    </Button>

                    <Button
                        type="button"
                        onClick={() => handleClose(false)}
                        className="h-8.5 cursor-pointer rounded-xl bg-slate-900 px-4.5 text-xs font-bold text-white shadow-xs hover:bg-slate-800 active:scale-98 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                    >
                        <span>Lanjutkan ke Workspace</span>
                        <ArrowRight className="ml-1.5 size-3.5" />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
