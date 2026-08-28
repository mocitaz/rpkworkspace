import {
    getDashboardDisplayName,
    getDashboardGreeting,
} from '@/lib/dashboard-welcome';

export function DashboardWelcomeHero({
    fullName,
    activeMatters,
    openTasks,
    urgentTasks,
}: {
    fullName: string;
    activeMatters: number;
    openTasks: number;
    urgentTasks: number;
}) {
    const displayName = getDashboardDisplayName(fullName);
    const greeting = getDashboardGreeting(new Date().getHours());

    return (
        <section className="group relative h-[188px] overflow-hidden rounded-[20px] border border-slate-200/80 bg-gradient-to-br from-[#f7f9ff] via-white to-[#eaf3ff] px-7 py-6 shadow-[0_10px_28px_rgba(71,85,105,0.075)] sm:px-9 dark:border-white/[0.08] dark:from-[#17191f] dark:via-[#17191f] dark:to-[#18202b]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_50%,rgba(147,197,253,0.32),transparent_30%),radial-gradient(circle_at_65%_115%,rgba(251,191,36,0.12),transparent_28%)]" />
            <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[47%] bg-gradient-to-r from-transparent via-blue-50/35 to-blue-100/25 sm:block dark:via-blue-500/[0.025] dark:to-blue-500/[0.04]" />
            <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[47%] [background-image:radial-gradient(rgba(59,130,246,0.26)_1px,transparent_1px)] [mask-image:linear-gradient(to_right,transparent,black_24%)] [background-size:18px_18px] opacity-30 sm:block dark:opacity-15" />
            <div className="pointer-events-none absolute -right-12 -bottom-28 hidden size-72 rounded-full border-[22px] border-white/55 sm:block dark:border-white/[0.04]" />
            <svg
                viewBox="0 0 520 180"
                aria-hidden="true"
                className="pointer-events-none absolute right-0 bottom-0 hidden h-full w-[47%] text-blue-300/40 sm:block"
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
            <div className="relative z-10 flex h-full max-w-[78%] flex-col justify-center sm:max-w-[53%]">
                <h1 className="text-2xl leading-[1.12] font-bold tracking-[-0.035em] text-slate-950 sm:text-[30px] dark:text-white">
                    {greeting}, {displayName}.
                </h1>
                <p className="mt-3 text-xs leading-[1.65] text-slate-500 sm:text-[13.5px] dark:text-zinc-400">
                    Hari ini terdapat{' '}
                    <strong className="font-semibold text-slate-900 dark:text-white">
                        {activeMatters} perkara aktif
                    </strong>{' '}
                    dan{' '}
                    <strong className="font-semibold text-slate-900 dark:text-white">
                        {openTasks} tugas berjalan
                    </strong>
                    .
                    {urgentTasks > 0 && (
                        <span className="mt-0.5 block font-semibold text-blue-600 dark:text-blue-400">
                            {urgentTasks} tugas membutuhkan perhatian prioritas
                            Anda.
                        </span>
                    )}
                </p>
            </div>
            <div className="dashboard-hero-team pointer-events-none absolute inset-y-0 right-0 hidden w-[47%] overflow-hidden rounded-r-[19px] [mask-image:linear-gradient(to_right,transparent_0%,black_22%,black_100%)] sm:block">
                <div className="absolute inset-y-0 left-0 z-10 w-40 bg-gradient-to-r from-[#f7f9ff] via-[#f1f6ff]/80 to-transparent dark:from-[#17191f] dark:via-[#17191f]/80" />
                <img
                    src="/images/dashboard-legal-team-hero.png"
                    alt=""
                    className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.01]"
                />
            </div>
        </section>
    );
}
