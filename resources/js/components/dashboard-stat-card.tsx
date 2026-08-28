import { Link } from '@inertiajs/react';
import {
    BriefcaseBusiness,
    CalendarClock,
    FileCheck2,
    ListChecks,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { getMetricProgress } from '@/lib/dashboard-stat-visual';
import { cn } from '@/lib/utils';

type StatTone = 'blue' | 'emerald' | 'amber' | 'violet';

const toneStyles: Record<
    StatTone,
    {
        icon: string;
    }
> = {
    blue: {
        icon: 'bg-blue-50/80 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400',
    },
    emerald: {
        icon: 'bg-emerald-50/80 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400',
    },
    amber: {
        icon: 'bg-amber-50/80 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400',
    },
    violet: {
        icon: 'bg-violet-50/80 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400',
    },
};

export function DashboardStatCard({
    title,
    value,
    meta,
    href,
    tone,
    icon,
    illustration,
}: {
    title: string;
    value: number;
    meta: ReactNode;
    href: string;
    tone: StatTone;
    icon: ReactNode;
    illustration: ReactNode;
}) {
    const styles = toneStyles[tone];

    return (
        <Link
            href={href}
            className="group block rounded-2xl focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
            <article className="relative flex min-h-[140px] flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-[18px] shadow-[0_1px_3px_rgba(15,23,42,0.05)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-slate-300 group-hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)] dark:border-white/[0.08] dark:bg-[#14161b] dark:group-hover:border-white/15 dark:group-hover:shadow-black/20">
                <header className="relative z-10 flex items-center gap-3.5">
                    <div
                        className={cn(
                            'flex size-10 shrink-0 items-center justify-center rounded-full ring-1 ring-current/5 transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3',
                            styles.icon,
                        )}
                    >
                        {icon}
                    </div>
                    <div className="min-w-0 -translate-y-px">
                        <h2 className="truncate text-sm leading-[18px] font-bold text-slate-800 dark:text-zinc-100">
                            {title}
                        </h2>
                        <div className="mt-0.5 truncate text-[10px] leading-[14px] font-medium text-slate-400 sm:text-[11px] dark:text-zinc-500">
                            {meta}
                        </div>
                    </div>
                </header>

                <div className="relative z-10 mt-auto min-h-[64px] pt-3">
                    <p className="absolute bottom-2 left-0 z-10 max-w-[50%] text-2xl leading-none font-extrabold tracking-tight text-slate-950 sm:text-[30px] dark:text-white">
                        {value.toLocaleString('id-ID')}
                    </p>
                    <div className="absolute right-0 -bottom-0.5 flex h-16 w-20 items-end justify-center sm:h-[72px] sm:w-24">
                        {illustration}
                    </div>
                </div>
            </article>
        </Link>
    );
}

export function MatterPortfolioVisual({
    corporate,
    litigation,
}: {
    corporate: number;
    litigation: number;
}) {
    const corporateProgress = getMetricProgress(
        corporate,
        corporate + litigation,
    );

    return (
        <svg
            viewBox="0 0 112 76"
            className="h-full w-full overflow-visible"
            aria-hidden="true"
        >
            <defs>
                <linearGradient id="matter-line" x1="0" x2="1">
                    <stop offset="0" stopColor="#60a5fa" />
                    <stop offset="0.55" stopColor="#22d3ee" />
                    <stop offset="1" stopColor="#34d399" />
                </linearGradient>
            </defs>
            <path
                d="M5 61 C20 58, 21 42, 34 45 S51 59, 62 38 S80 31, 88 17 S101 16, 107 7"
                fill="none"
                stroke="url(#matter-line)"
                strokeWidth="3"
                strokeLinecap="round"
                pathLength="1"
                className="dashboard-stat-line"
            />
            {[
                { x: 6, y: 61 },
                { x: 35, y: 45 },
                { x: 63, y: 38 },
                { x: 88, y: 17 },
                { x: 107, y: 7 },
            ].map((point, index) => (
                <circle
                    key={point.x}
                    cx={point.x}
                    cy={point.y}
                    r={index === 4 ? 4 : 2.5}
                    fill={index === 4 ? '#34d399' : '#fff'}
                    stroke={index === 4 ? '#34d399' : '#60a5fa'}
                    strokeWidth="2"
                    className="dashboard-stat-float"
                    style={{ animationDelay: `${index * 140}ms` }}
                />
            ))}
            <text
                x="6"
                y="14"
                className="fill-slate-400 text-[8px] font-bold dark:fill-zinc-500"
            >
                {corporateProgress}% CORP
            </text>
        </svg>
    );
}

export function TaskLoadVisual({
    urgent,
    total,
}: {
    urgent: number;
    total: number;
}) {
    const urgentProgress = getMetricProgress(urgent, total);
    const heights = [30, 52, 39, 65, 47, 58];

    return (
        <svg viewBox="0 0 112 76" className="h-full w-full" aria-hidden="true">
            {heights.map((height, index) => {
                const isUrgent =
                    index < Math.ceil((urgentProgress / 100) * heights.length);

                return (
                    <g
                        key={index}
                        className="dashboard-stat-bar"
                        style={{ animationDelay: `${index * 90}ms` }}
                    >
                        <rect
                            x={8 + index * 17}
                            y={68 - height}
                            width="7"
                            height={height}
                            rx="3.5"
                            fill={isUrgent ? '#fb7185' : '#34d399'}
                            opacity="0.2"
                        />
                        <rect
                            x={8 + index * 17}
                            y={68 - height / 1.7}
                            width="7"
                            height={height / 1.7}
                            rx="3.5"
                            fill={isUrgent ? '#f43f5e' : '#10b981'}
                        />
                    </g>
                );
            })}
        </svg>
    );
}

export function DeadlineRadarVisual({
    critical,
    today,
}: {
    critical: number;
    today: number;
}) {
    const progress = getMetricProgress(today, Math.max(critical, 1));

    return (
        <svg viewBox="0 0 96 80" className="h-full w-full" aria-hidden="true">
            {[29, 21, 13].map((radius, index) => (
                <circle
                    key={radius}
                    cx="48"
                    cy="40"
                    r={radius}
                    fill="none"
                    stroke={
                        index === 0
                            ? '#fdba74'
                            : index === 1
                              ? '#f59e0b'
                              : '#fb7185'
                    }
                    strokeWidth="4"
                    strokeDasharray={`${Math.max(progress, 18) + index * 16} 100`}
                    pathLength="100"
                    strokeLinecap="round"
                    className="dashboard-stat-ring"
                    style={{ animationDelay: `${index * 180}ms` }}
                />
            ))}
            <circle
                cx="48"
                cy="40"
                r="5"
                fill="#f43f5e"
                className="dashboard-stat-pulse"
            />
        </svg>
    );
}

export function DocumentReviewVisual({
    approved,
    review,
    total,
}: {
    approved: number;
    review: number;
    total: number;
}) {
    const approvedProgress = getMetricProgress(approved, total);

    return (
        <svg viewBox="0 0 112 78" className="h-full w-full" aria-hidden="true">
            {[0, 1, 2].map((index) => (
                <g
                    key={index}
                    transform={`translate(${12 + index * 13} ${17 - index * 5})`}
                >
                    <g
                        className="dashboard-stat-float"
                        style={{ animationDelay: `${index * 160}ms` }}
                    >
                        <rect
                            width="40"
                            height="49"
                            rx="7"
                            fill={index === 2 ? '#8b5cf6' : '#ede9fe'}
                            opacity={index === 2 ? 0.95 : 0.8}
                        />
                        {index === 2 && (
                            <>
                                <rect
                                    x="9"
                                    y="12"
                                    width="22"
                                    height="3"
                                    rx="1.5"
                                    fill="#ddd6fe"
                                />
                                <rect
                                    x="9"
                                    y="20"
                                    width="17"
                                    height="3"
                                    rx="1.5"
                                    fill="#ddd6fe"
                                />
                                <rect
                                    x="9"
                                    y="28"
                                    width="20"
                                    height="3"
                                    rx="1.5"
                                    fill="#ddd6fe"
                                />
                            </>
                        )}
                    </g>
                </g>
            ))}
            <circle
                cx="91"
                cy="48"
                r="15"
                fill="#fff"
                stroke="#ede9fe"
                strokeWidth="6"
                className="dark:fill-[#14161b]"
            />
            <circle
                cx="91"
                cy="48"
                r="15"
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="6"
                strokeDasharray={`${approvedProgress} 100`}
                pathLength="100"
                strokeLinecap="round"
                transform="rotate(-90 91 48)"
                className="dashboard-stat-ring"
            />
            <text
                x="91"
                y="51"
                textAnchor="middle"
                className="fill-violet-700 text-[8px] font-black dark:fill-violet-300"
            >
                {review}
            </text>
        </svg>
    );
}

export const dashboardStatIcons = {
    matters: <BriefcaseBusiness className="size-[18px]" strokeWidth={1.8} />,
    tasks: <ListChecks className="size-[18px]" strokeWidth={1.8} />,
    deadlines: <CalendarClock className="size-[18px]" strokeWidth={1.8} />,
    documents: <FileCheck2 className="size-[18px]" strokeWidth={1.8} />,
};
