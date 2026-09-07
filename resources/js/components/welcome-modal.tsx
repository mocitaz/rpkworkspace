import { Link } from '@inertiajs/react';
import {
    ArrowRight,
    Calendar,
    CalendarDays,
    ChevronRight,
    FileCheck2,
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
import * as mattersRoutes from '@/routes/matters';
import * as tasksRoutes from '@/routes/tasks';

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
            <DialogContent className="w-[calc(100vw-1.5rem)] max-w-[390px] gap-0 overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-0 shadow-xl dark:border-white/10 dark:bg-[#14161b]">
                {/* 1. Header (Clean, minimal, no badge) */}
                <div className="p-5 pb-3.5">
                    <div className="flex items-center gap-3 pr-6">
                        <div className="flex size-9.5 shrink-0 items-center justify-center rounded-xl border border-slate-200/80 bg-white p-1.5 shadow-2xs dark:border-white/10 dark:bg-zinc-900">
                            <img
                                src="/logo/logo.png"
                                alt="RPK Law Firm"
                                className="size-full object-contain"
                            />
                        </div>

                        <div className="min-w-0 flex-1">
                            <DialogTitle className="truncate text-[15px] font-bold tracking-tight text-slate-900 dark:text-white">
                                {greeting}, {user?.name}
                            </DialogTitle>
                            <DialogDescription className="mt-0.5 truncate text-xs text-slate-500 dark:text-zinc-400">
                                Selamat datang kembali di RPK Practice OS
                            </DialogDescription>
                        </div>
                    </div>
                </div>

                {/* 2. Metrics (No container cards, pure clean numbers & labels) */}
                <div className="px-5">
                    <div className="grid grid-cols-3 divide-x divide-slate-100 border-y border-slate-100 py-3 dark:divide-white/[0.06] dark:border-white/[0.06]">
                        <Link
                            href={mattersRoutes.index.url()}
                            onClick={() => handleClose(false)}
                            className="group text-center transition-colors"
                        >
                            <span className="block font-mono text-lg font-bold text-slate-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                                {activeMattersCount}
                            </span>
                            <span className="mt-0.5 block text-[11px] font-medium text-slate-500 dark:text-zinc-400">
                                Perkara Aktif
                            </span>
                        </Link>

                        <Link
                            href={tasksRoutes.index.url()}
                            onClick={() => handleClose(false)}
                            className="group text-center transition-colors"
                        >
                            <span className="block font-mono text-lg font-bold text-slate-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                                {openTasksCount}
                            </span>
                            <span className="mt-0.5 block text-[11px] font-medium text-slate-500 dark:text-zinc-400">
                                Tugas Terbuka
                            </span>
                        </Link>

                        <Link
                            href={calendarRoutes.index.url()}
                            onClick={() => handleClose(false)}
                            className="group text-center transition-colors"
                        >
                            <span className="block font-mono text-lg font-bold text-slate-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                                {todayDeadlinesCount}
                            </span>
                            <span className="mt-0.5 block text-[11px] font-medium text-slate-500 dark:text-zinc-400">
                                Deadline Hari Ini
                            </span>
                        </Link>
                    </div>
                </div>

                {/* 3. Action Shortcuts (Clean borderless list, simple neutral styling) */}
                <div className="px-3 py-2">
                    <Link
                        href={calendarRoutes.index.url()}
                        onClick={() => handleClose(false)}
                        className="group flex items-center justify-between rounded-lg px-2.5 py-2 transition-colors hover:bg-slate-50 dark:hover:bg-white/[0.04]"
                    >
                        <div className="flex min-w-0 items-center gap-2.5">
                            <CalendarDays className="size-4 text-slate-400 transition-colors group-hover:text-slate-700 dark:text-zinc-500 dark:group-hover:text-zinc-300" />
                            <div className="min-w-0">
                                <p className="text-xs font-semibold text-slate-800 dark:text-zinc-200">
                                    Agenda Sidang &amp; Kalender
                                </p>
                                <p className="truncate text-[11px] text-slate-400 dark:text-zinc-500">
                                    Pantau jadwal persidangan &amp; tenggat
                                    minggu ini
                                </p>
                            </div>
                        </div>
                        <ChevronRight className="size-3.5 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-600 dark:text-zinc-600 dark:group-hover:text-zinc-300" />
                    </Link>

                    <Link
                        href={mattersRoutes.index.url()}
                        onClick={() => handleClose(false)}
                        className="group flex items-center justify-between rounded-lg px-2.5 py-2 transition-colors hover:bg-slate-50 dark:hover:bg-white/[0.04]"
                    >
                        <div className="flex min-w-0 items-center gap-2.5">
                            <FileCheck2 className="size-4 text-slate-400 transition-colors group-hover:text-slate-700 dark:text-zinc-500 dark:group-hover:text-zinc-300" />
                            <div className="min-w-0">
                                <p className="text-xs font-semibold text-slate-800 dark:text-zinc-200">
                                    Draf &amp; Dokumen Perkara
                                </p>
                                <p className="truncate text-[11px] text-slate-400 dark:text-zinc-500">
                                    Periksa legal advice &amp; berkas perkara
                                    review
                                </p>
                            </div>
                        </div>
                        <ChevronRight className="size-3.5 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-600 dark:text-zinc-600 dark:group-hover:text-zinc-300" />
                    </Link>
                </div>

                {/* 4. Footer Actions (Compact & Clean) */}
                <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-5 py-3 dark:border-white/[0.06] dark:bg-[#111317]">
                    <Button
                        asChild
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleClose(false)}
                        className="h-8.5 rounded-lg px-2.5 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-white/[0.06] dark:hover:text-white"
                    >
                        <Link
                            href={calendarRoutes.index.url()}
                            className="flex items-center gap-1.5"
                        >
                            <Calendar className="size-3.5 text-slate-400" />
                            <span>Buka Kalender</span>
                        </Link>
                    </Button>

                    <Button
                        type="button"
                        onClick={() => handleClose(false)}
                        className="group h-8.5 cursor-pointer rounded-lg bg-slate-900 px-3.5 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 active:scale-[0.98] dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                    >
                        <span>Lanjutkan</span>
                        <ArrowRight className="ml-1.5 size-3.5 transition-transform group-hover:translate-x-0.5" />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
