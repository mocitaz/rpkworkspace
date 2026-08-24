import { Link } from '@inertiajs/react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="relative flex min-h-screen w-full flex-col justify-between overflow-hidden text-slate-900 selection:bg-blue-600 selection:text-white dark:text-zinc-100">
            {/* Seamless Full-Bleed Illustrated Scenery Canvas Background */}
            <div className="pointer-events-none fixed inset-0 z-0 select-none overflow-hidden bg-[#e6ebf0] dark:bg-[#0c0d12]">
                <img
                    src="/images/rpk-login-vector-bg.jpg"
                    alt="RPK Legal Workspace Scenic Backdrop"
                    className="size-full object-cover object-bottom opacity-95 dark:opacity-35"
                />
                <div className="absolute inset-0 bg-white/5 backdrop-blur-[0.5px] dark:bg-black/30" />
            </div>

            {/* Center Floating Auth Card */}
            <main className="relative z-10 flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-8">
                <div className="w-full max-w-[420px]">
                    <div className="rounded-3xl border border-slate-200/80 bg-white/95 p-7 shadow-2xl shadow-slate-900/10 backdrop-blur-xl sm:p-9 dark:border-white/10 dark:bg-[#14161b]/95 dark:shadow-2xl">
                        {/* Brand Logo & Header */}
                        <div className="mb-5 flex flex-col items-center text-center">
                            <Link
                                href={home()}
                                className="group mb-4 inline-flex items-center justify-center transition-transform hover:scale-105"
                            >
                                <img
                                    src="/logo/raf-law-firm-transparent.png"
                                    alt="RPK Law Firm"
                                    className="h-14 w-auto max-w-[170px] object-contain drop-shadow-xs"
                                />
                            </Link>

                            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                                {title || 'Login to account'}
                            </h1>
                            {description && (
                                <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">
                                    {description}
                                </p>
                            )}
                        </div>

                        {children}
                    </div>
                </div>
            </main>

            {/* Subtle Clean Footer */}
            <footer className="relative z-10 py-3 text-center text-xs font-medium text-slate-500/90 drop-shadow-xs dark:text-zinc-400">
                <div className="mx-auto max-w-5xl px-4">
                    &copy; {new Date().getFullYear()} RPK-LMIS (Legal Matter Information System). All rights reserved.
                </div>
            </footer>
        </div>
    );
}
