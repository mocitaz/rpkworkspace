import { Download, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AuditLogHero({
    metrics,
    exportUrl,
    onClean,
}: {
    metrics: {
        total: number;
        today: number;
        actors_count: number;
        events_count: number;
    };
    exportUrl: string;
    onClean: () => void;
}) {
    const items = [
        [
            'Total rekaman',
            metrics.total,
            'ledger permanen',
            'text-slate-950 dark:text-white',
        ],
        [
            'Hari ini',
            metrics.today,
            '24 jam terakhir',
            'text-slate-950 dark:text-white',
        ],
        [
            'Pelaku aktif',
            metrics.actors_count,
            'user tercatat',
            'text-slate-950 dark:text-white',
        ],
        [
            'Ragam event',
            metrics.events_count,
            'tipe aktivitas',
            'text-slate-950 dark:text-white',
        ],
    ] as const;

    return (
        <section className="group relative min-h-[250px] overflow-hidden rounded-[20px] border border-slate-200/80 bg-gradient-to-br from-[#f7f9ff] via-white to-[#eaf2ff] px-6 py-6 shadow-[0_10px_28px_rgba(71,85,105,0.075)] sm:px-8 dark:border-white/[0.08] dark:from-[#17191f] dark:via-[#17191f] dark:to-[#18212c]">
            <div className="audit-hero-glow pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_84%_38%,rgba(96,165,250,0.28),transparent_30%),radial-gradient(circle_at_66%_112%,rgba(251,191,36,0.12),transparent_28%)]" />
            <div className="audit-hero-dots pointer-events-none absolute inset-y-0 right-0 hidden w-[43%] [background-image:radial-gradient(rgba(59,130,246,0.23)_1px,transparent_1px)] [background-size:18px_18px] opacity-30 md:block" />
            <svg
                viewBox="0 0 560 250"
                className="pointer-events-none absolute right-0 bottom-0 hidden h-full w-[48%] text-white/90 md:block"
            >
                <path
                    d="M8 205 C98 126 184 219 276 136 S433 70 556 94"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="audit-hero-line"
                    pathLength="1"
                />
            </svg>
            <div className="relative z-10 max-w-[760px] md:max-w-[62%]">
                <h1 className="text-2xl font-bold tracking-[-0.035em] text-slate-950 sm:text-[30px] dark:text-white">
                    Audit Log &amp; Jejak Aktivitas
                </h1>
                <p className="mt-2 max-w-lg text-xs text-slate-500 sm:text-[13px] dark:text-zinc-400">
                    Pantau aktivitas, perubahan data, akses finansial, dan
                    kepatuhan firma.
                </p>
                <div className="mt-4 flex gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClean}
                        className="h-8 border-rose-200 text-[11px] text-rose-600"
                    >
                        <Trash2 className="mr-1.5 size-3.5" />
                        Bersihkan Log
                    </Button>
                    <Button
                        asChild
                        variant="outline"
                        className="h-8 text-[11px]"
                    >
                        <a href={exportUrl} download>
                            <Download className="mr-1.5 size-3.5" />
                            Ekspor CSV Kepatuhan
                        </a>
                    </Button>
                </div>
            </div>
            <div className="relative z-10 mt-5 grid max-w-[760px] grid-cols-2 border-t border-slate-200/70 pt-3 md:max-w-[62%] md:grid-cols-4">
                {items.map(([label, value, detail, color]) => (
                    <div
                        key={label}
                        className="min-w-0 py-1 pr-3 odd:border-r even:pl-3 md:border-r md:px-3 md:first:pl-0 md:last:border-r-0"
                    >
                        <p className="truncate text-[9px] font-bold text-slate-400 uppercase">
                            {label}
                        </p>
                        <strong className={`font-mono text-xl ${color}`}>
                            {value}
                        </strong>
                        <span className="ml-1.5 text-[9px] text-slate-500">
                            {detail}
                        </span>
                    </div>
                ))}
            </div>
            <div className="audit-hero-person pointer-events-none absolute right-[1%] bottom-0 hidden h-[255px] w-[455px] md:block lg:right-[2.5%]">
                <img
                    src="/images/audit-log-hero.png"
                    alt=""
                    className="h-full w-full translate-y-[12%] object-contain object-bottom"
                />
            </div>
        </section>
    );
}
