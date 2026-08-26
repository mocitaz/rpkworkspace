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
    Sparkles,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
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

    // Compute dynamic time-of-day greeting
    const greeting = useMemo(() => {
        const hour = new Date().getHours();
        if (hour >= 4 && hour < 11) return 'Selamat Pagi';
        if (hour >= 11 && hour < 15) return 'Selamat Siang';
        if (hour >= 15 && hour < 18) return 'Selamat Sore';
        return 'Selamat Malam';
    }, []);

    const todayFormatted = useMemo(() => {
        return new Intl.DateTimeFormat('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        }).format(new Date());
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
            <DialogContent className="max-w-[540px] overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-0 shadow-2xl sm:max-w-[540px] dark:border-white/10 dark:bg-[#14161b]">
                {/* 1. Modal Cockpit Header */}
                <div className="relative border-b border-slate-100 bg-linear-to-b from-slate-50 via-slate-50/50 to-white px-6 pt-6 pb-5 dark:border-white/[0.06] dark:from-[#181a20] dark:via-[#14161b] dark:to-[#14161b]">
                    <div className="flex items-center gap-3.5">
                        <div className="relative size-12 shrink-0 rounded-xl border border-slate-200/90 bg-white p-1.5 shadow-2xs dark:border-white/15 dark:bg-zinc-900">
                            <img
                                src="/logo/logo.png"
                                alt="RPK Law Firm"
                                className="size-full object-contain"
                            />
                        </div>

                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200/80 bg-white px-2 py-0.5 font-mono text-[9.5px] font-bold tracking-wider text-slate-700 uppercase shadow-2xs dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-300">
                                    <span className="size-1.5 rounded-full bg-emerald-500" />
                                    RPK LAW FIRM · WORKSPACE
                                </span>
                                <span className="hidden text-[11px] font-medium text-slate-400 sm:inline dark:text-zinc-500">
                                    {todayFormatted}
                                </span>
                            </div>

                            <DialogTitle className="mt-1 truncate text-base font-bold tracking-tight text-slate-900 sm:text-lg dark:text-white">
                                {greeting}, {user?.name}
                            </DialogTitle>
                            <DialogDescription className="text-xs text-slate-500 dark:text-zinc-400">
                                Sesi kerja aktif · Pantau ringkasan perkara &amp;
                                agenda penting hari ini
                            </DialogDescription>
                        </div>
                    </div>
                </div>

                {/* 2. Modal Body */}
                <div className="space-y-4 px-6 py-5">
                    {/* 3-Column Symmetrical Metric Grid */}
                    <div className="grid grid-cols-3 gap-2.5">
                        <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200/80 bg-slate-50/60 p-3 text-center transition-all hover:bg-slate-100/60 dark:border-white/10 dark:bg-white/[0.02] dark:hover:bg-white/[0.04]">
                            <div className="mb-1.5 flex size-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                                <Briefcase className="size-3.5" />
                            </div>
                            <span className="font-mono text-xl font-extrabold text-slate-900 dark:text-white">
                                {activeMattersCount}
                            </span>
                            <span className="text-[11px] font-medium text-slate-500 dark:text-zinc-400">
                                Perkara Aktif
                            </span>
                        </div>

                        <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200/80 bg-slate-50/60 p-3 text-center transition-all hover:bg-slate-100/60 dark:border-white/10 dark:bg-white/[0.02] dark:hover:bg-white/[0.04]">
                            <div className="mb-1.5 flex size-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                                <CheckCircle2 className="size-3.5" />
                            </div>
                            <span className="font-mono text-xl font-extrabold text-slate-900 dark:text-white">
                                {openTasksCount}
                            </span>
                            <span className="text-[11px] font-medium text-slate-500 dark:text-zinc-400">
                                Tugas Terbuka
                            </span>
                        </div>

                        <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200/80 bg-slate-50/60 p-3 text-center transition-all hover:bg-slate-100/60 dark:border-white/10 dark:bg-white/[0.02] dark:hover:bg-white/[0.04]">
                            <div
                                className={`mb-1.5 flex size-7 items-center justify-center rounded-lg ${
                                    todayDeadlinesCount > 0
                                        ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'
                                        : 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400'
                                }`}
                            >
                                <CalendarClock className="size-3.5" />
                            </div>
                            <span
                                className={`font-mono text-xl font-extrabold ${
                                    todayDeadlinesCount > 0
                                        ? 'text-rose-600 dark:text-rose-400'
                                        : 'text-slate-900 dark:text-white'
                                }`}
                            >
                                {todayDeadlinesCount}
                            </span>
                            <span className="text-[11px] font-medium text-slate-500 dark:text-zinc-400">
                                Deadline Hari Ini
                            </span>
                        </div>
                    </div>

                    {/* Operational Guidance Cards */}
                    <div className="space-y-2.5">
                        <div className="flex items-center gap-1.5 px-0.5">
                            <Sparkles className="size-3 text-amber-500" />
                            <span className="font-mono text-[10px] font-bold tracking-wider text-slate-400 uppercase dark:text-zinc-500">
                                PANDUAN KERJA &amp; KEPATUHAN STANDAR
                            </span>
                        </div>

                        <div className="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-white p-3 shadow-2xs transition-all hover:border-slate-300 dark:border-white/10 dark:bg-[#16181d] dark:hover:border-white/20">
                            <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                                <FileCheck2 className="size-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-bold text-slate-900 dark:text-white">
                                    Verifikasi Berkas &amp; Dokumen
                                </p>
                                <p className="text-[11px] leading-relaxed text-slate-500 dark:text-zinc-400">
                                    Periksa draf legal advice, berkas perkara,
                                    dan dokumen yang menunggu telaah atau
                                    persetujuan.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-white p-3 shadow-2xs transition-all hover:border-slate-300 dark:border-white/10 dark:bg-[#16181d] dark:hover:border-white/20">
                            <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
                                <CalendarDays className="size-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-bold text-slate-900 dark:text-white">
                                    Agenda Sidang &amp; Tenggat Kritis
                                </p>
                                <p className="text-[11px] leading-relaxed text-slate-500 dark:text-zinc-400">
                                    Pastikan jadwal sidang peradilan, rapat
                                    koordinasi klien, dan deadline minggu ini
                                    terpantau.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-white p-3 shadow-2xs transition-all hover:border-slate-300 dark:border-white/10 dark:bg-[#16181d] dark:hover:border-white/20">
                            <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                                <ShieldCheck className="size-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-bold text-slate-900 dark:text-white">
                                    Kerahasiaan Advokat &amp; Integritas Klien
                                </p>
                                <p className="text-[11px] leading-relaxed text-slate-500 dark:text-zinc-400">
                                    Seluruh informasi perkara dan komunikasi
                                    klien bersifat konfidensial di bawah kode
                                    etik advokat.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Modal Actions Footer */}
                <DialogFooter className="flex-row items-center justify-between border-t border-slate-100 bg-slate-50/60 px-6 py-4 dark:border-white/[0.06] dark:bg-[#121418]">
                    <Button
                        asChild
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleClose(false)}
                        className="h-9 rounded-xl border-slate-200/80 px-4 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-100/80 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
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
                        className="h-9 cursor-pointer rounded-xl bg-slate-900 px-5 text-xs font-bold text-white shadow-xs hover:bg-slate-800 active:scale-98 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                    >
                        <span>Lanjutkan ke Workspace</span>
                        <ArrowRight className="ml-1.5 size-3.5" />
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
