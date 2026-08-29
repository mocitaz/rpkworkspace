import { Link } from '@inertiajs/react';
import {
    getDashboardDisplayName,
    getDashboardGreeting,
} from '@/lib/dashboard-welcome';

export function DashboardWelcomeHero({
    fullName,
    activeMatters,
    openTasks,
    urgentTasks,
    todayFormatted,
}: {
    fullName: string;
    activeMatters: number;
    openTasks: number;
    urgentTasks: number;
    todayFormatted?: string;
}) {
    const displayName = getDashboardDisplayName(fullName);
    const greeting = getDashboardGreeting(new Date().getHours());

    const currentDateText =
        todayFormatted ??
        new Intl.DateTimeFormat('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        }).format(new Date());

    return (
        <section className="group relative flex min-h-[195px] items-center overflow-hidden rounded-[22px] border border-slate-200/80 bg-gradient-to-br from-white via-[#f8faff] to-[#e9f2ff] px-6 py-6 shadow-[0_16px_40px_-24px_rgba(30,64,175,0.3)] sm:h-[195px] sm:px-11 sm:py-0 dark:border-white/[0.08] dark:from-[#17191f] dark:via-[#171a21] dark:to-[#182331]">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-300/70 to-transparent" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_83%_48%,rgba(147,197,253,0.38),transparent_28%),radial-gradient(circle_at_61%_118%,rgba(245,158,11,0.1),transparent_27%)]" />
            <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[520px] bg-gradient-to-r from-transparent via-blue-50/35 to-blue-100/35 sm:block dark:via-blue-500/[0.025] dark:to-blue-500/[0.05]" />
            <div className="pointer-events-none absolute top-1/2 right-16 hidden size-72 -translate-y-1/2 rounded-full border-[20px] border-white/65 sm:block dark:border-white/[0.04]" />
            <svg
                viewBox="0 0 520 180"
                aria-hidden="true"
                className="pointer-events-none absolute right-0 bottom-0 hidden h-full w-[520px] text-blue-300/45 sm:block"
            >
                <path
                    d="M18 149 C112 76 205 164 286 88 S421 41 516 61"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray="7 10"
                    className="dashboard-stat-line"
                    pathLength="1"
                />
            </svg>

            <div className="relative z-10 flex w-full max-w-full flex-col justify-center sm:max-w-[50%] lg:max-w-[55%]">
                <p className="text-[13px] font-medium text-slate-500 dark:text-zinc-400">
                    {currentDateText}
                </p>

                <h1 className="mt-1 text-[27px] font-bold tracking-tight text-slate-950 sm:text-[31px] dark:text-white">
                    {greeting}, {displayName}.
                </h1>

                <div className="mt-2.5 space-y-1 text-[13.5px] leading-relaxed sm:text-[14px]">
                    <p className="text-slate-600 dark:text-zinc-300">
                        Hari ini terdapat{' '}
                        <strong className="font-semibold text-slate-950 dark:text-white">
                            {activeMatters} perkara aktif
                        </strong>{' '}
                        <span className="text-slate-400 dark:text-zinc-500">
                            dan
                        </span>{' '}
                        <strong className="font-semibold text-slate-950 dark:text-white">
                            {openTasks} tugas berjalan
                        </strong>
                        .
                    </p>

                    {urgentTasks > 0 ? (
                        <p className="text-slate-600 dark:text-zinc-300">
                            <strong className="font-semibold text-rose-600 dark:text-rose-400">
                                {urgentTasks} tugas
                            </strong>{' '}
                            membutuhkan perhatian prioritas Anda.{' '}
                            <Link
                                href="/tasks"
                                className="inline-flex items-center gap-1 font-semibold text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                                <span>Tinjau sekarang</span>
                                <span aria-hidden="true">→</span>
                            </Link>
                        </p>
                    ) : (
                        <p className="text-slate-500 dark:text-zinc-400">
                            Seluruh agenda perkara dan berkas dalam monitoring
                            terkendali.
                        </p>
                    )}
                </div>
            </div>

            <div className="dashboard-hero-team pointer-events-none absolute inset-y-0 right-0 hidden w-[520px] overflow-hidden rounded-r-[21px] [mask-image:linear-gradient(to_right,transparent_0%,black_20%,black_100%)] sm:block">
                <div className="absolute inset-y-0 left-0 z-10 w-28 bg-gradient-to-r from-[#f9faff] via-[#f2f7ff]/80 to-transparent dark:from-[#171a21] dark:via-[#171a21]/80" />
                <div className="absolute inset-x-0 bottom-0 z-10 h-8 bg-gradient-to-t from-blue-100/35 to-transparent dark:from-[#182331]/40" />
                <img
                    src="/images/dashboard-legal-team-hero.png"
                    alt=""
                    className="h-full w-full object-cover object-top saturate-[0.96] transition duration-700 group-hover:scale-[1.015] group-hover:saturate-100 dark:hidden"
                />
                <img
                    src="/images/dashboard-legal-team-hero-dark.png"
                    alt=""
                    className="hidden h-full w-full object-cover object-top saturate-[0.94] transition duration-700 group-hover:scale-[1.015] group-hover:saturate-100 dark:block"
                />
            </div>
        </section>
    );
}
