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
            <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#e6ebf0] select-none dark:bg-[#0c0d12]">
                <img
                    src="/images/rpk-login-vector-bg.jpg"
                    alt="RPK Legal Workspace Scenic Backdrop"
                    className="size-full object-cover object-bottom opacity-95 dark:opacity-35"
                />
                <div className="absolute inset-0 bg-white/5 backdrop-blur-[0.5px] dark:bg-black/30" />
            </div>

            {/* Center Floating Auth Card */}
            <main className="relative z-10 flex flex-1 items-center justify-center p-3 sm:p-6 lg:p-8">
                <div className="w-full max-w-[420px]">
                    <div className="rounded-3xl border border-slate-200/80 bg-white/95 p-5 shadow-2xl shadow-slate-900/10 backdrop-blur-xl sm:p-9 dark:border-white/10 dark:bg-[#14161b]/95 dark:shadow-2xl">
                        {/* Brand Logo & Header (Side-by-side with divider) */}
                        <div className="mb-5 flex flex-col items-center text-center">
                            <Link
                                href={home()}
                                className="group mb-4 inline-flex items-center justify-center gap-3.5 transition-transform hover:scale-[1.02]"
                            >
                                {/* Kiri: Logo RPK Law Firm */}
                                <img
                                    src="/logo/raf-law-firm-transparent.png"
                                    alt="RPK Law Firm"
                                    className="h-9 w-auto max-w-[130px] object-contain drop-shadow-xs dark:brightness-0 dark:invert"
                                />

                                {/* Pembatas / Divider */}
                                <div className="h-6 w-px bg-slate-200 dark:bg-white/15" />

                                {/* Kanan: Logo RPK App + Teks */}
                                <div className="flex items-center gap-2">
                                    <img
                                        src="/images/rpkapp.png"
                                        alt="RPK App"
                                        className="size-6 object-contain"
                                    />
                                    <span className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-white">
                                        RPK App
                                    </span>
                                </div>
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
                    &copy; {new Date().getFullYear()} RPK LawApp — Integrated
                    Legal Practice System. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
