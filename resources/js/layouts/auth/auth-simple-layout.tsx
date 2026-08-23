import { Link } from '@inertiajs/react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="min-h-dvh bg-background xl:grid xl:grid-cols-[minmax(0,1.12fr)_minmax(460px,0.88fr)]">
            <aside className="relative hidden min-h-dvh overflow-hidden bg-[#111214] text-white xl:block">
                <img
                    src="/images/raf-legal-workspace-login-hero.png"
                    alt="Ruang kerja legal RPK Law Firm"
                    className="absolute inset-0 size-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,9,11,0.72)_0%,rgba(8,9,11,0.2)_48%,rgba(8,9,11,0.9)_100%)]" />
                <div className="relative flex min-h-dvh flex-col p-10 2xl:p-14">
                    <Link
                        href={home()}
                        className="inline-flex w-fit items-center"
                    >
                        <img
                            src="/logo/raf-law-firm-transparent.png"
                            alt="RPK Law Firm"
                            className="h-12 w-auto brightness-0 invert"
                        />
                    </Link>
                    <div className="mt-auto max-w-lg">
                        <p className="text-[11px] font-semibold tracking-[0.18em] text-[#d4aa64] uppercase">
                            RPK Law Firm · Jakarta
                        </p>
                        <h2 className="mt-4 text-3xl leading-[1.12] font-medium tracking-[-0.04em] text-balance 2xl:text-4xl">
                            Ketelitian hukum, dalam satu workspace yang tenang.
                        </h2>
                        <p className="mt-4 max-w-md text-sm leading-6 text-white/65">
                            Kelola matter, dokumen rahasia, tenggat, dan jejak
                            audit dengan kontrol yang jelas untuk setiap tim.
                        </p>
                    </div>
                    <p className="mt-10 text-[11px] tracking-[0.06em] text-white/40 uppercase">
                        Confidential legal operations
                    </p>
                </div>
            </aside>
            <main className="relative flex min-h-dvh items-center justify-center bg-white px-6 py-10 sm:px-10 xl:px-14 dark:bg-background">
                <div className="w-full max-w-[390px]">
                    <div className="text-center">
                        <h1 className="text-2xl font-semibold tracking-[-0.035em] text-foreground">
                            {title}
                        </h1>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                            {description}
                        </p>
                    </div>
                    <div className="mt-9">{children}</div>
                </div>
            </main>
        </div>
    );
}
