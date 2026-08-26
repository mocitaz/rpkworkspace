import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { home } from '@/routes';

export default function AuthCardLayout({
    children,
    title,
    description,
}: PropsWithChildren<{
    name?: string;
    title?: string;
    description?: string;
}>) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-4 sm:p-6 md:p-10">
            <div className="flex w-full max-w-md flex-col gap-6">
                <Link
                    href={home()}
                    className="flex flex-col items-center gap-2 self-center font-medium"
                >
                    <img
                        src="/logo/raf-law-firm-transparent.png"
                        alt="RPK Law Firm"
                        className="h-10 w-auto dark:brightness-0 dark:invert"
                    />
                    <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-slate-50/90 px-3 py-1 shadow-2xs dark:border-white/10 dark:bg-white/[0.04]">
                        <img
                            src="/images/rpkapp.png"
                            alt="RPK App"
                            className="size-4.5 rounded-full object-contain"
                        />
                        <span className="text-xs font-bold tracking-tight text-slate-800 dark:text-zinc-200">
                            RPK App
                        </span>
                    </div>
                </Link>

                <div className="flex flex-col gap-6">
                    <Card className="rounded-2xl border-border/90 shadow-[0_20px_50px_rgb(15_23_42/0.08)]">
                        <CardHeader className="px-5 pt-6 pb-0 text-center sm:px-10 sm:pt-8">
                            <CardTitle className="text-xl">{title}</CardTitle>
                            <CardDescription>{description}</CardDescription>
                        </CardHeader>
                        <CardContent className="px-5 py-6 sm:px-10 sm:py-8">
                            {children}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
