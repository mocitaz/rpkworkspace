import { Link } from '@inertiajs/react';
import {
    ChevronLeft,
    ChevronRight,
    Grid3X3,
    List,
    Smartphone,
} from 'lucide-react';

type CalendarView = 'month' | 'list';

type Props = {
    formattedMonthTitle: string;
    timezone: string;
    view: CalendarView;
    onViewChange: (view: CalendarView) => void;
    previousMonthHref: string;
    todayHref: string;
    nextMonthHref: string;
    onOpenSubscription: () => void;
    events: number;
    deadlines: number;
    tasks: number;
    total: number;
};

const metrics = [
    {
        key: 'events',
        label: 'Sidang & Agenda',
        detail: 'jadwal sidang',
    },
    {
        key: 'deadlines',
        label: 'Tenggat kritis',
        detail: 'batas waktu',
    },
    {
        key: 'tasks',
        label: 'Tugas terkait',
        detail: 'jatuh tempo',
    },
    { key: 'total', label: 'Total jadwal', detail: 'aktivitas' },
] as const;

const metricClasses = [
    'text-slate-950 dark:text-white',
    'text-slate-950 dark:text-white',
    'text-slate-950 dark:text-white',
    'text-slate-950 dark:text-white',
];

export function CalendarDashboardHero({
    formattedMonthTitle,
    timezone,
    view,
    onViewChange,
    previousMonthHref,
    todayHref,
    nextMonthHref,
    onOpenSubscription,
    events,
    deadlines,
    tasks,
    total,
}: Props) {
    const values = { events, deadlines, tasks, total };

    return (
        <section className="group relative min-h-[250px] overflow-hidden rounded-[20px] border border-slate-200/80 bg-gradient-to-br from-[#f7f9ff] via-white to-[#eaf3ff] px-6 py-6 shadow-[0_10px_28px_rgba(71,85,105,0.075)] sm:px-8 dark:border-white/[0.08] dark:from-[#17191f] dark:via-[#17191f] dark:to-[#18202b]">
            <div className="calendar-hero-glow pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_84%_38%,rgba(96,165,250,0.22),transparent_30%),radial-gradient(circle_at_66%_112%,rgba(147,197,253,0.14),transparent_28%)]" />
            <div className="calendar-hero-dots pointer-events-none absolute inset-y-0 right-0 hidden w-[44%] [background-image:radial-gradient(rgba(59,130,246,0.22)_1px,transparent_1px)] [mask-image:linear-gradient(to_right,transparent,black_28%)] [background-size:18px_18px] opacity-30 md:block" />

            <div className="relative z-10 max-w-[760px] md:max-w-[62%]">
                <h1 className="text-2xl leading-tight font-bold tracking-[-0.035em] text-slate-950 capitalize sm:text-[30px] dark:text-white">
                    {formattedMonthTitle}
                </h1>
                <p className="mt-1.5 max-w-xl text-xs leading-relaxed text-slate-500 sm:text-[13px] dark:text-zinc-400">
                    Pantau sidang, mediasi, tenggat, dan tugas perkara dalam
                    zona waktu {timezone}.
                </p>

                <div className="mt-3.5 flex flex-wrap items-center gap-2">
                    <div className="flex items-center rounded-lg border border-slate-200/80 bg-white/80 p-0.5 shadow-xs backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.05]">
                        <Link
                            href={previousMonthHref}
                            aria-label="Bulan sebelumnya"
                            className="calendar-hero-control"
                        >
                            <ChevronLeft className="size-3.5" />
                        </Link>
                        <Link
                            href={todayHref}
                            className="calendar-hero-control px-2.5 text-[11px] font-bold"
                        >
                            Hari Ini
                        </Link>
                        <Link
                            href={nextMonthHref}
                            aria-label="Bulan berikutnya"
                            className="calendar-hero-control"
                        >
                            <ChevronRight className="size-3.5" />
                        </Link>
                    </div>

                    <div className="flex items-center rounded-lg border border-slate-200/80 bg-white/80 p-0.5 shadow-xs backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.05]">
                        <button
                            type="button"
                            onClick={() => onViewChange('month')}
                            className={`calendar-hero-view ${view === 'month' ? 'calendar-hero-view-active' : ''}`}
                        >
                            <Grid3X3 className="size-3" />
                            Bulan
                        </button>
                        <button
                            type="button"
                            onClick={() => onViewChange('list')}
                            className={`calendar-hero-view ${view === 'list' ? 'calendar-hero-view-active' : ''}`}
                        >
                            <List className="size-3" />
                            Daftar
                        </button>
                    </div>

                    <button
                        type="button"
                        onClick={onOpenSubscription}
                        className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-slate-900 px-3 text-[11px] font-bold text-white shadow-sm transition hover:bg-slate-800 active:scale-[0.98] dark:bg-white dark:text-slate-900"
                    >
                        <Smartphone className="size-3.5" />
                        Langganan Kalender
                    </button>
                </div>
            </div>

            <div className="relative z-10 mt-4 grid max-w-[760px] grid-cols-2 border-t border-slate-200/70 pt-3 md:max-w-[62%] md:grid-cols-4 dark:border-white/[0.08]">
                {metrics.map((metric, index) => {
                    return (
                        <div
                            key={metric.key}
                            className="min-w-0 py-1 pr-3 odd:border-r odd:border-slate-200/70 even:pl-3 md:border-r md:border-slate-200/70 md:px-3 md:first:pl-0 md:last:border-r-0 dark:odd:border-white/[0.08] dark:md:border-white/[0.08]"
                        >
                            <p className="truncate text-[9px] font-bold tracking-[0.11em] text-slate-400 uppercase dark:text-zinc-500">
                                {metric.label}
                            </p>
                            <div className="mt-0.5 flex items-baseline gap-1.5">
                                <strong
                                    className={`font-mono text-xl font-bold tracking-tight ${metricClasses[index]}`}
                                >
                                    {values[metric.key]}
                                </strong>
                                <span className="truncate text-[9px] text-slate-500 dark:text-zinc-400">
                                    {metric.detail}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="pointer-events-none absolute right-[2%] bottom-0 z-[2] hidden h-[240px] w-[340px] translate-y-[7%] md:block lg:right-[5%]">
                <img
                    src="/images/calendar-legal-hero-v3.png"
                    alt=""
                    className="calendar-hero-person h-full w-full object-contain object-bottom transition-transform duration-700 group-hover:scale-[1.01]"
                />
            </div>
        </section>
    );
}
