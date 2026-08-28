import { Link } from '@inertiajs/react';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as userRoutes from '@/routes/admin/users';

export function PersonnelAccessHero({
    metrics,
}: {
    metrics: {
        total: number;
        active: number;
        roles_count: number;
        permissions_count: number;
    };
}) {
    const items = [
        [
            'Total personel',
            metrics.total,
            'anggota tim',
            'text-slate-950 dark:text-white',
        ],
        [
            'Personel aktif',
            metrics.active,
            'aktif login',
            'text-slate-950 dark:text-white',
        ],
        [
            'Struktur role',
            metrics.roles_count,
            'tingkat akses',
            'text-slate-950 dark:text-white',
        ],
        [
            'Matriks permission',
            metrics.permissions_count,
            'izin sistem',
            'text-slate-950 dark:text-white',
        ],
    ] as const;

    return (
        <section className="group relative min-h-[250px] overflow-hidden rounded-[20px] border border-slate-200/80 bg-gradient-to-br from-[#f7f9ff] via-white to-[#eaf2ff] px-6 py-6 shadow-[0_10px_28px_rgba(71,85,105,0.075)] sm:px-8 dark:border-white/[0.08] dark:from-[#17191f] dark:via-[#17191f] dark:to-[#18212c]">
            <div className="personnel-hero-glow pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_84%_38%,rgba(96,165,250,0.28),transparent_30%),radial-gradient(circle_at_66%_112%,rgba(251,191,36,0.12),transparent_28%)]" />
            <div className="personnel-hero-dots pointer-events-none absolute inset-y-0 right-0 hidden w-[43%] [background-image:radial-gradient(rgba(59,130,246,0.23)_1px,transparent_1px)] [mask-image:linear-gradient(to_right,transparent,black_28%)] [background-size:18px_18px] opacity-30 md:block" />
            <svg
                viewBox="0 0 560 250"
                aria-hidden="true"
                className="pointer-events-none absolute right-0 bottom-0 hidden h-full w-[48%] text-white/90 md:block"
            >
                <path
                    d="M8 205 C98 126 184 219 276 136 S433 70 556 94"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="personnel-hero-line"
                    pathLength="1"
                />
            </svg>
            <div className="relative z-10 max-w-[760px] md:max-w-[62%]">
                <h1 className="text-2xl font-bold tracking-[-0.035em] text-slate-950 sm:text-[30px] dark:text-white">
                    Personel &amp; Hak Akses
                </h1>
                <p className="mt-2 max-w-lg text-xs text-slate-500 sm:text-[13px] dark:text-zinc-400">
                    Kelola staf, identitas pegawai, role, dan izin sistem secara
                    terpusat.
                </p>
                <Button
                    asChild
                    className="mt-4 h-8 rounded-lg bg-slate-900 px-3.5 text-[11px] font-semibold text-white dark:bg-white dark:text-slate-900"
                >
                    <Link
                        href={
                            userRoutes.create?.url
                                ? userRoutes.create.url()
                                : '/admin/users/create'
                        }
                    >
                        <UserPlus className="mr-1.5 size-3.5" />
                        Tambah Staf Baru
                    </Link>
                </Button>
            </div>
            <div className="relative z-10 mt-5 grid max-w-[760px] grid-cols-2 border-t border-slate-200/70 pt-3 md:max-w-[62%] md:grid-cols-4">
                {items.map(([label, value, detail, color]) => (
                    <div
                        key={label}
                        className="min-w-0 py-1 pr-3 odd:border-r odd:border-slate-200/70 even:pl-3 md:border-r md:px-3 md:first:pl-0 md:last:border-r-0"
                    >
                        <p className="truncate text-[9px] font-bold tracking-[0.11em] text-slate-400 uppercase">
                            {label}
                        </p>
                        <div className="mt-0.5 flex items-baseline gap-1.5">
                            <strong
                                className={`font-mono text-xl font-bold ${color}`}
                            >
                                {value}
                            </strong>
                            <span className="truncate text-[9px] text-slate-500">
                                {detail}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
            <div className="personnel-hero-people pointer-events-none absolute right-[1%] bottom-0 hidden h-[255px] w-[465px] translate-y-[3%] md:block lg:right-[2.5%]">
                <img
                    src="/images/personnel-access-hero.png"
                    alt=""
                    className="h-full w-full object-contain object-bottom"
                />
            </div>
        </section>
    );
}
