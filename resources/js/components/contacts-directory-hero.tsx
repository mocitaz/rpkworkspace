import { ArrowUpRight, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

type ContactsDirectoryHeroProps = {
    totalContacts: number;
    visibleContacts: number;
    clientRepresentatives: number;
    independentContacts: number;
    connectedClients: number;
    canCreate: boolean;
    onCreate: () => void;
};

const metricClasses = [
    'text-slate-950 dark:text-white',
    'text-slate-950 dark:text-white',
    'text-slate-950 dark:text-white',
    'text-slate-950 dark:text-white',
];

export function ContactsDirectoryHero({
    totalContacts,
    visibleContacts,
    clientRepresentatives,
    independentContacts,
    connectedClients,
    canCreate,
    onCreate,
}: ContactsDirectoryHeroProps) {
    const metrics = [
        {
            label: 'Total kontak',
            value: totalContacts,
            detail: `${visibleContacts} di halaman ini`,
        },
        {
            label: 'Perwakilan klien',
            value: clientRepresentatives,
            detail: 'PIC resmi',
        },
        {
            label: 'Eksternal / mitra',
            value: independentContacts,
            detail: 'saksi & konsultan',
        },
        {
            label: 'Cakupan klien',
            value: connectedClients,
            detail: 'entitas terlayani',
        },
    ];

    return (
        <section className="group relative min-h-[250px] overflow-hidden rounded-[20px] border border-slate-200/80 bg-gradient-to-br from-[#f7faff] via-white to-[#edf5ff] px-6 py-6 shadow-[0_10px_28px_rgba(71,85,105,0.075)] sm:px-8 dark:border-white/[0.08] dark:from-[#17191f] dark:via-[#17191f] dark:to-[#19212a]">
            <div className="contacts-hero-glow pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_84%_38%,rgba(96,165,250,0.27),transparent_30%),radial-gradient(circle_at_66%_112%,rgba(251,191,36,0.12),transparent_28%)]" />
            <div className="contacts-hero-dots pointer-events-none absolute inset-y-0 right-0 hidden w-[43%] [background-image:radial-gradient(rgba(59,130,246,0.23)_1px,transparent_1px)] [mask-image:linear-gradient(to_right,transparent,black_28%)] [background-size:18px_18px] opacity-30 md:block" />
            <svg
                viewBox="0 0 560 250"
                aria-hidden="true"
                className="pointer-events-none absolute right-0 bottom-0 hidden h-full w-[48%] text-white/90 drop-shadow-[0_0_8px_rgba(96,165,250,0.34)] md:block"
            >
                <path
                    d="M8 205 C98 126 184 219 276 136 S433 70 556 94"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="contacts-hero-line"
                    pathLength="1"
                />
                <circle cx="276" cy="136" r="4" fill="currentColor" />
                <circle cx="435" cy="82" r="3" fill="currentColor" />
            </svg>

            <div className="relative z-10 max-w-[760px] md:max-w-[62%]">
                <h1 className="text-2xl leading-tight font-bold tracking-[-0.035em] text-slate-950 sm:text-[30px] dark:text-white">
                    Direktori Kontak &amp; Perwakilan
                </h1>
                <p className="mt-2 max-w-lg text-xs leading-relaxed text-slate-500 sm:text-[13px] dark:text-zinc-400">
                    Kelola PIC, saksi ahli, konsultan, dan stakeholder perkara
                    dalam satu direktori.
                </p>
                {canCreate && (
                    <Button
                        type="button"
                        onClick={onCreate}
                        className="mt-4 h-8 rounded-lg bg-slate-900 px-3.5 text-[11px] font-semibold text-white shadow-sm hover:bg-slate-800 active:scale-[0.98] dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                    >
                        <UserPlus className="mr-1 size-3.5" />
                        Tambah Kontak Baru
                        <ArrowUpRight className="ml-1.5 size-3" />
                    </Button>
                )}
            </div>

            <div className="relative z-10 mt-5 grid max-w-[760px] grid-cols-2 border-t border-slate-200/70 pt-3 md:max-w-[62%] md:grid-cols-4 dark:border-white/[0.08]">
                {metrics.map((metric, index) => (
                    <div
                        key={metric.label}
                        className="min-w-0 py-1 pr-3 odd:border-r odd:border-slate-200/70 even:pl-3 md:border-r md:border-slate-200/70 md:px-3 md:first:pl-0 md:last:border-r-0 dark:odd:border-white/[0.08] dark:md:border-white/[0.08]"
                    >
                        <p className="truncate text-[9px] font-bold tracking-[0.11em] text-slate-400 uppercase dark:text-zinc-500">
                            {metric.label}
                        </p>
                        <div className="mt-0.5 flex items-baseline gap-1.5">
                            <strong
                                className={`font-mono text-xl font-bold tracking-tight ${metricClasses[index]}`}
                            >
                                {metric.value}
                            </strong>
                            <span className="truncate text-[9px] text-slate-500 dark:text-zinc-400">
                                {metric.detail}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="contacts-hero-person pointer-events-none absolute right-[1%] bottom-0 hidden h-[242px] w-[420px] md:block lg:right-[2.5%]">
                <img
                    src="/images/contacts-directory-hero.png"
                    alt=""
                    className="h-full w-full object-contain object-bottom"
                />
            </div>
        </section>
    );
}
