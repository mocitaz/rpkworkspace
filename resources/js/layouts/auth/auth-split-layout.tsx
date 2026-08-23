import { Link, usePage } from '@inertiajs/react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { name } = usePage().props;

    return (
        <div className="relative grid min-h-dvh flex-col items-center justify-center bg-background px-6 sm:px-0 lg:max-w-none lg:grid-cols-[1.08fr_0.92fr] lg:px-0">
            <div className="relative hidden h-full flex-col overflow-hidden bg-[#17191d] p-12 text-white lg:flex">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_14%,rgba(180,130,38,0.2),transparent_32%),linear-gradient(145deg,#16181d,#08090b)]" />
                <Link href={home()} className="relative z-20 flex items-center">
                    <img
                        src="/logo/raf-law-firm-transparent.png"
                        alt={name}
                        className="h-14 w-auto brightness-0 invert"
                    />
                </Link>
                <div className="relative z-20 mt-auto max-w-md pb-12">
                    <p className="text-xs font-semibold tracking-[0.18em] text-[#c9983c] uppercase">
                        Platform operasional legal
                    </p>
                    <p className="mt-5 text-3xl leading-tight font-medium tracking-[-0.035em]">
                        Workspace aman untuk pekerjaan legal yang terarah.
                    </p>
                    <p className="mt-5 text-sm leading-6 text-white/60">
                        Matter, dokumen terlindungi, tenggat, dan audit trail
                        dalam satu workspace yang tertata.
                    </p>
                </div>
            </div>
            <div className="w-full lg:p-12">
                <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[390px]">
                    <Link
                        href={home()}
                        className="relative z-20 flex items-center justify-center lg:hidden"
                    >
                        <img
                            src="/logo/raf-law-firm-transparent.png"
                            alt={name}
                            className="h-14 w-auto dark:brightness-0 dark:invert"
                        />
                    </Link>
                    <div className="flex flex-col items-start gap-2 text-left sm:items-center sm:text-center">
                        <h1 className="text-2xl font-semibold tracking-[-0.03em]">
                            {title}
                        </h1>
                        <p className="text-sm text-balance text-muted-foreground">
                            {description}
                        </p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
