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

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { isCurrentOrParentUrl } = useCurrentUrl();

    return (
        <div className="min-h-screen bg-[#fafafc] pb-20 dark:bg-[#0c0d10]">
            <main className="mx-auto max-w-7xl space-y-5 px-4 py-5 sm:px-6 lg:px-8">
                {/* 1. Header Navigation & Action Bar */}
                <div className="flex flex-col justify-between gap-4 border-b border-slate-200/60 pb-5 sm:flex-row sm:items-center dark:border-white/[0.06]">
                    <div className="space-y-1">
                        <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                            Pengaturan Akun
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-zinc-400">
                            Kelola profil advokat, keamanan otentikasi akun, dan
                            preferensi tampilan antarmuka firma hukum RPK.
                        </p>
                    </div>
                </div>

                {/* Main Settings Body */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
                    {/* Left Settings Sidebar */}
                    <aside className="lg:col-span-3">
                        <nav
                            className="flex flex-col gap-1 rounded-xl border border-slate-200/70 bg-white p-1.5 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]"
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
                                            'group flex items-start gap-2.5 rounded-lg p-2.5 text-xs transition-colors',
                                            active
                                                ? 'bg-slate-100/90 text-slate-900 dark:bg-white/[0.06] dark:text-white'
                                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-white/[0.02] dark:hover:text-white',
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                'flex size-7 shrink-0 items-center justify-center rounded-md transition-colors',
                                                active
                                                    ? 'bg-blue-600 text-white dark:bg-blue-600'
                                                    : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200 dark:bg-zinc-800 dark:text-zinc-400',
                                            )}
                                        >
                                            <Icon className="size-3.5" />
                                        </div>
                                        <div className="min-w-0">
                                            <span className="block text-xs leading-snug font-semibold">
                                                {item.title}
                                            </span>
                                            <span className="block truncate text-[11px] text-slate-500 dark:text-zinc-400">
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
