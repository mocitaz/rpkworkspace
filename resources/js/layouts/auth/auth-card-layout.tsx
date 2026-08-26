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
                    className="inline-flex items-center justify-center gap-3.5 self-center font-medium"
                >
                    <img
                        src="/logo/raf-law-firm-transparent.png"
                        alt="RPK Law Firm"
                        className="h-9 w-auto max-w-[130px] object-contain dark:brightness-0 dark:invert"
                    />
                    <div className="h-6 w-px bg-slate-200 dark:bg-white/15" />
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
