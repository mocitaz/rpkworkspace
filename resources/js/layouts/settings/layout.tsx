import { Link } from '@inertiajs/react';
import { Palette, ShieldCheck, User } from 'lucide-react';
import type { PropsWithChildren } from 'react';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn, toUrl } from '@/lib/utils';
import { edit as editAppearance } from '@/routes/appearance';
import { edit } from '@/routes/profile';
import { edit as editSecurity } from '@/routes/security';

const sidebarNavItems = [
    {
        title: 'Profil & Identitas',
        description: 'Informasi personal, foto, dan kontak',
        href: edit(),
        icon: User,
    },
    {
        title: 'Keamanan & Autentikasi',
        description: 'Kata sandi, 2FA, dan Passkey',
        href: editSecurity(),
        icon: ShieldCheck,
    },
    {
        title: 'Tema & Tampilan',
        description: 'Mode gelap, terang, atau sistem',
        href: editAppearance(),
        icon: Palette,
    },
];

const settingsHeroItems = [
    ['Profil & Identitas', '01', 'data akun'],
    ['Keamanan & Autentikasi', '02', 'proteksi akun'],
    ['Tema & Tampilan', '03', 'preferensi visual'],
] as const;

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { isCurrentOrParentUrl } = useCurrentUrl();

    return (
        <div className="min-h-screen bg-[#fafafc] pb-20 dark:bg-[#0c0d10]">
            <main className="w-full space-y-5 px-4 pt-2.5 pb-8 sm:px-6 sm:pt-3.5 lg:px-8">
                <section className="group relative flex min-h-[220px] flex-col justify-center overflow-hidden rounded-[20px] border border-slate-200/80 bg-gradient-to-br from-[#f7f9ff] via-white to-[#eaf2ff] px-6 py-6 shadow-[0_10px_28px_rgba(71,85,105,0.075)] sm:h-[220px] sm:px-8 dark:border-white/[0.08] dark:from-[#17191f] dark:via-[#17191f] dark:to-[#18212c]">
                    <div className="personnel-hero-glow pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_84%_38%,rgba(96,165,250,0.28),transparent_30%),radial-gradient(circle_at_66%_112%,rgba(251,191,36,0.12),transparent_28%)]" />
                    <div className="personnel-hero-dots pointer-events-none absolute inset-y-0 right-0 hidden w-[43%] [background-image:radial-gradient(rgba(59,130,246,0.23)_1px,transparent_1px)] [mask-image:linear-gradient(to_right,transparent,black_28%)] [background-size:18px_18px] opacity-30 md:block" />
                    <svg
                        viewBox="0 0 560 220"
                        aria-hidden="true"
                        className="pointer-events-none absolute right-0 bottom-0 hidden h-full w-[48%] text-white/90 md:block"
                    >
                        <path
                            d="M8 184 C98 112 184 195 276 119 S433 62 556 82"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            className="personnel-hero-line"
                            pathLength="1"
                        />
                    </svg>

                    <div className="relative z-10 max-w-full md:max-w-[62%]">
                        <div>
                            <h1 className="text-2xl font-bold tracking-[-0.035em] text-slate-950 sm:text-[30px] dark:text-white">
                                Pengaturan Akun
                            </h1>
                            <p className="mt-2 max-w-lg text-xs leading-5 text-slate-500 sm:text-[13px] dark:text-zinc-400">
                                Kelola identitas, perlindungan akun, dan
                                tampilan workspace Anda dalam satu pusat
                                pengaturan.
                            </p>
                        </div>

                        <div className="mt-5 grid grid-cols-3 border-t border-slate-200/70 pt-3 dark:border-white/[0.07]">
                            {settingsHeroItems.map(([label, value, detail]) => (
                                <div
                                    key={label}
                                    className="min-w-0 border-r border-slate-200/70 px-3 py-1 first:pl-0 last:border-r-0 dark:border-white/[0.07]"
                                >
                                    <p className="truncate text-[9px] font-bold tracking-[0.11em] text-slate-400 uppercase">
                                        {label}
                                    </p>
                                    <div className="mt-0.5 flex items-baseline gap-1.5">
                                        <strong className="font-mono text-xl font-bold text-slate-950 dark:text-white">
                                            {value}
                                        </strong>
                                        <span className="truncate text-[9px] text-slate-500 dark:text-zinc-400">
                                            {detail}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="personnel-hero-people pointer-events-none absolute right-[1%] bottom-0 hidden h-[230px] w-[430px] translate-y-[7%] md:block lg:right-[2.5%]">
                        <img
                            src="/images/settings-account-hero.png"
                            alt=""
                            className="h-full w-full object-contain object-bottom transition-transform duration-700 ease-out group-hover:translate-y-[-3px]"
                        />
                    </div>
                </section>

                {/* Main Settings Body */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
                    {/* Left Settings Sidebar / Mobile Horizontal Swipe Bar */}
                    <aside className="lg:col-span-3">
                        <nav
                            className="flex [scrollbar-width:none] flex-row gap-1.5 overflow-x-auto rounded-xl border border-slate-200/70 bg-white p-1.5 shadow-2xs [-ms-overflow-style:none] lg:flex-col lg:overflow-visible dark:border-white/[0.06] dark:bg-[#14161b] [&::-webkit-scrollbar]:hidden"
                            aria-label="Settings Navigation"
                        >
                            {sidebarNavItems.map((item, index) => {
                                const active = isCurrentOrParentUrl(item.href);
                                const Icon = item.icon;

                                return (
                                    <Link
                                        key={`${toUrl(item.href)}-${index}`}
                                        href={item.href}
                                        className={cn(
                                            'group flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs transition-colors lg:items-start lg:p-2.5',
                                            active
                                                ? 'bg-slate-900 text-white shadow-2xs lg:bg-slate-100/90 lg:text-slate-900 dark:bg-white dark:text-slate-900 lg:dark:bg-white/[0.06] lg:dark:text-white'
                                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-white/[0.02] dark:hover:text-white',
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                'flex size-6 shrink-0 items-center justify-center rounded-md transition-colors lg:size-7',
                                                active
                                                    ? 'bg-white/20 text-white lg:bg-blue-600 lg:text-white'
                                                    : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200 dark:bg-zinc-800 dark:text-zinc-400',
                                            )}
                                        >
                                            <Icon className="size-3.5" />
                                        </div>
                                        <div className="min-w-0">
                                            <span className="block text-xs leading-snug font-semibold whitespace-nowrap">
                                                {item.title}
                                            </span>
                                            <span className="hidden truncate text-[11px] text-slate-500 lg:block dark:text-zinc-400">
                                                {item.description}
                                            </span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </nav>
                    </aside>

                    {/* Right Content Area */}
                    <div className="lg:col-span-9">
                        <div className="rounded-xl border border-slate-200/70 bg-white p-5 shadow-2xs sm:p-6 dark:border-white/[0.06] dark:bg-[#14161b]">
                            {children}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
