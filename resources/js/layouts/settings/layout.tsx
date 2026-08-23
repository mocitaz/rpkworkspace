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
        <div className="min-h-screen w-full bg-[#fbfbfa] text-[#111111] antialiased dark:bg-[#121212] dark:text-[#fbfbfa]">
            <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
                {/* Header Minimalist Notion */}
                <header className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight text-[#111111] dark:text-white">
                        Pengaturan Workspace
                    </h1>
                    <p className="text-xs text-[#787774] dark:text-zinc-400">
                        Kelola profil advokat, keamanan otentikasi akun, dan preferensi tampilan antarmuka.
                    </p>
                </header>

                {/* Main Settings Body */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    {/* Left Sidebar Nav */}
                    <aside className="lg:col-span-4">
                        <nav className="flex flex-col gap-1.5" aria-label="Settings Navigation">
                            {sidebarNavItems.map((item, index) => {
                                const active = isCurrentOrParentUrl(item.href);
                                const Icon = item.icon;

                                return (
                                    <Link
                                        key={`${toUrl(item.href)}-${index}`}
                                        href={item.href}
                                        className={cn(
                                            'group flex items-start gap-3 rounded-xl p-3 text-xs transition-all',
                                            active
                                                ? 'border border-black/[0.08] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]'
                                                : 'hover:bg-black/[0.02] text-[#787774] hover:text-[#111111] dark:hover:bg-white/[0.02] dark:hover:text-white'
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                'flex size-7 shrink-0 items-center justify-center rounded-lg transition-colors',
                                                active
                                                    ? 'bg-[#111111] text-white shadow-2xs dark:bg-white dark:text-black'
                                                    : 'bg-black/[0.04] text-[#787774] group-hover:bg-black/[0.06] dark:bg-white/[0.06] dark:text-zinc-400'
                                            )}
                                        >
                                            <Icon className="size-3.5" />
                                        </div>
                                        <div>
                                            <span
                                                className={cn(
                                                    'block font-semibold',
                                                    active ? 'text-[#111111] dark:text-white' : 'text-[#787774] group-hover:text-[#111111] dark:text-zinc-400 dark:group-hover:text-white'
                                                )}
                                            >
                                                {item.title}
                                            </span>
                                            <span className="text-[11px] text-[#787774] dark:text-zinc-400">
                                                {item.description}
                                            </span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </nav>
                    </aside>

                    {/* Right Content Area */}
                    <div className="lg:col-span-8">
                        <div className="rounded-xl border border-black/[0.08] bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                            {children}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
