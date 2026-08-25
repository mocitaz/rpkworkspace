import type { UrlMethodPair } from '@inertiajs/core';
import { router } from '@inertiajs/react';
import { usePasskeyVerify } from '@laravel/passkeys/react';
import { AlertCircle, KeyRound } from 'lucide-react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';

type Props = {
    routes?: {
        options: UrlMethodPair;
        submit: UrlMethodPair;
    };
    label?: string;
    loadingLabel?: string;
    separator?: string;
    separatorPosition?: 'top' | 'bottom';
};

function formatPasskeyErrorMessage(err?: string): string {
    if (!err) {
        return '';
    }
    if (err.includes('RP ID') && err.includes('invalid')) {
        return 'Konfigurasi Domain Passkey (RP ID) tidak cocok dengan domain saat ini. Pastikan APP_URL di server adalah https://app.rpklawoffice.com.';
    }
    if (
        err.includes('not allowed') ||
        err.includes('cancelled') ||
        err.includes('NotAllowedError') ||
        err.includes('abort')
    ) {
        return 'Proses autentikasi biometrik/passkey dibatalkan atau waktu habis.';
    }
    if (err.includes('timed out') || err.includes('TimeoutError')) {
        return 'Waktu verifikasi biometrik telah habis. Silakan coba kembali.';
    }
    if (
        err.includes('no credentials') ||
        err.includes('not found') ||
        err.includes('No available authenticator')
    ) {
        return 'Tidak ditemukan kunci sandi (passkey) yang terdaftar untuk perangkat ini.';
    }
    return err;
}

export default function PasskeyVerify({
    routes,
    label,
    loadingLabel,
    separator,
    separatorPosition = 'bottom',
}: Props = {}) {
    const { verify, isLoading, error, isSupported } = usePasskeyVerify({
        ...(routes && {
            routes: {
                options: routes.options.url,
                submit: routes.submit.url,
            },
        }),
        onSuccess: (response) => {
            router.visit(response.redirect ?? '/dashboard');
        },
    });

    if (!isSupported) {
        return null;
    }

    const separatorElement = (
        <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-[10.5px] uppercase">
                <span className="bg-white px-2.5 font-bold tracking-wider text-slate-400 dark:bg-[#14161b] dark:text-zinc-500">
                    {separator ?? 'Or continue with email'}
                </span>
            </div>
        </div>
    );

    const friendlyError = formatPasskeyErrorMessage(error);

    return (
        <>
            {separatorPosition === 'top' && separatorElement}

            <div className="grid gap-2">
                <Button
                    type="button"
                    variant="outline"
                    className="h-11 w-full rounded-xl border-slate-200/90 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-300 dark:hover:bg-white/[0.06]"
                    onClick={verify}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <Spinner className="mr-1.5 size-4" />
                    ) : (
                        <KeyRound className="mr-1.5 size-4 text-slate-400" />
                    )}
                    {isLoading
                        ? (loadingLabel ?? 'Authenticating...')
                        : (label ?? 'Sign in with a passkey')}
                </Button>
                {friendlyError && (
                    <div className="flex items-start gap-2 rounded-lg border border-rose-200/80 bg-rose-50/80 p-2.5 text-left text-[11px] font-medium text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-300 animate-in fade-in duration-150">
                        <AlertCircle className="mt-0.5 size-3.5 shrink-0 text-rose-600 dark:text-rose-400" />
                        <span>{friendlyError}</span>
                    </div>
                )}
            </div>

            {separatorPosition === 'bottom' && separatorElement}
        </>
    );
}
