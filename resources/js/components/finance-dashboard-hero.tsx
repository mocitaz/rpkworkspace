import { BarChart3, Building2, FolderKanban, Scale } from 'lucide-react';

export type FinanceScope =
    | 'client_matters'
    | 'office_operations'
    | 'financial_reports'
    | 'analytics_insights';

type Props = {
    scope: FinanceScope;
    onScopeChange: (scope: FinanceScope) => void;
};

const scopes = [
    {
        id: 'client_matters',
        number: '01',
        title: 'Perkara & Klien',
        detail: 'Billing & profitabilitas',
        icon: FolderKanban,
    },
    {
        id: 'office_operations',
        number: '02',
        title: 'Operasional Firma',
        detail: 'Kas, bank & payroll',
        icon: Building2,
    },
    {
        id: 'financial_reports',
        number: '03',
        title: 'Laporan & Neraca',
        detail: 'Arus kas & laba rugi',
        icon: Scale,
    },
    {
        id: 'analytics_insights',
        number: '04',
        title: 'Analisis Keuangan',
        detail: 'Tren & visualisasi',
        icon: BarChart3,
    },
] satisfies Array<{
    id: FinanceScope;
    number: string;
    title: string;
    detail: string;
    icon: typeof FolderKanban;
}>;

export function FinanceDashboardHero({ scope, onScopeChange }: Props) {
    return (
        <section className="relative isolate min-h-[280px] overflow-hidden rounded-[26px] border border-blue-100/90 bg-gradient-to-br from-white via-[#f8fbff] to-[#e9f2ff] shadow-[0_18px_55px_-35px_rgba(37,99,235,0.38)] dark:border-white/10 dark:from-[#151922] dark:via-[#121722] dark:to-[#111827]">
            <div className="finance-hero-glow absolute -top-32 right-[4%] size-[430px] rounded-full bg-blue-300/25 blur-3xl dark:bg-blue-500/10" />
            <div className="finance-hero-dots absolute inset-0 [background-image:radial-gradient(circle,#bfdbfe_1.2px,transparent_1.2px)] [mask-image:linear-gradient(to_left,black,transparent_68%)] [background-size:25px_25px] opacity-55" />
            <svg
                className="pointer-events-none absolute inset-y-0 right-0 h-full w-[55%] opacity-65"
                viewBox="0 0 700 280"
                fill="none"
                preserveAspectRatio="none"
                aria-hidden="true"
            >
                <path
                    className="finance-hero-line"
                    pathLength="1"
                    d="M42 225C166 122 260 248 382 140C474 59 564 48 690 82"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                />
            </svg>

            <div className="relative z-10 flex min-h-[280px] flex-col justify-between px-6 py-6 sm:px-8 lg:w-[61%] lg:px-10">
                <div>
                    <h1 className="max-w-2xl text-2xl font-bold tracking-[-0.035em] text-slate-950 sm:text-[30px] dark:text-white">
                        Keuangan Firma Hukum RPK
                    </h1>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                        Kelola penagihan klien, operasional firma, dan laporan
                        keuangan dalam satu pusat kendali.
                    </p>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-x-5 gap-y-2">
                    {scopes.map((item) => {
                        const Icon = item.icon;
                        const active = scope === item.id;

                        return (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => onScopeChange(item.id)}
                                className={`group flex min-w-0 items-center gap-2.5 border-t pt-2.5 text-left transition ${active ? 'border-blue-600' : 'border-slate-200 hover:border-blue-300 dark:border-white/10'}`}
                            >
                                <span
                                    className={`flex size-8 shrink-0 items-center justify-center rounded-xl transition ${active ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25' : 'bg-white/80 text-slate-500 group-hover:text-blue-600 dark:bg-white/5 dark:text-slate-400'}`}
                                >
                                    <Icon className="size-4" />
                                </span>
                                <span className="min-w-0">
                                    <span className="block text-[9px] font-bold tracking-[0.14em] text-slate-950 dark:text-white">
                                        {item.number}
                                    </span>
                                    <span className="block truncate text-[11px] font-bold text-slate-800 dark:text-slate-100">
                                        {item.title}
                                    </span>
                                    <span className="hidden truncate text-[9px] text-slate-400 xl:block">
                                        {item.detail}
                                    </span>
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="pointer-events-none absolute right-[5%] bottom-0 z-[2] hidden h-[252px] w-[340px] lg:block xl:right-[8%]">
                <img
                    src="/images/finance-dashboard-hero-v3.png"
                    alt="Ilustrasi pengelolaan keuangan firma hukum"
                    className="finance-hero-person h-full w-full object-contain object-bottom"
                />
            </div>
        </section>
    );
}
