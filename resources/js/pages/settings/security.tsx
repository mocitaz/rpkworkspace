import { Form, Head } from '@inertiajs/react';
import {
    AlertCircle,
    CheckCircle2,
    KeyRound,
    Lock,
    Shield,
    ShieldCheck,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import SecurityController from '@/actions/App/Http/Controllers/Settings/SecurityController';
import InputError from '@/components/input-error';
import type { Props as ManagePasskeysProps } from '@/components/manage-passkeys';
import ManagePasskeys from '@/components/manage-passkeys';
import type { Props as ManageTwoFactorProps } from '@/components/manage-two-factor';
import ManageTwoFactor from '@/components/manage-two-factor';
import PasswordInput from '@/components/password-input';
import { PasswordStrengthIndicator } from '@/components/password-strength-indicator';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import SettingsLayout from '@/layouts/settings/layout';
import { edit } from '@/routes/security';

type Props = {
    passwordRules: string;
} & ManagePasskeysProps &
    ManageTwoFactorProps;

export default function Security(props: Props) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);
    const [currentPassword, setCurrentPassword] = useState('');
    const [currentPasswordStatus, setCurrentPasswordStatus] = useState<
        'idle' | 'checking' | 'valid' | 'invalid'
    >('idle');
    const [newPassword, setNewPassword] = useState('');
    const [confirmationPassword, setConfirmationPassword] = useState('');
    const verifyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => {
            if (verifyTimeoutRef.current) {
                clearTimeout(verifyTimeoutRef.current);
            }
        };
    }, []);

    const handleCurrentPasswordChange = (val: string) => {
        setCurrentPassword(val);
        if (!val.trim()) {
            setCurrentPasswordStatus('idle');
            if (verifyTimeoutRef.current) {
                clearTimeout(verifyTimeoutRef.current);
            }
            return;
        }

        setCurrentPasswordStatus('checking');
        if (verifyTimeoutRef.current) {
            clearTimeout(verifyTimeoutRef.current);
        }

        verifyTimeoutRef.current = setTimeout(async () => {
            try {
                const res = await fetch(
                    '/settings/security/verify-current-password',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Accept: 'application/json',
                            'X-Requested-With': 'XMLHttpRequest',
                            'X-CSRF-TOKEN':
                                (
                                    document.querySelector(
                                        'meta[name="csrf-token"]',
                                    ) as HTMLMetaElement
                                )?.content || '',
                        },
                        body: JSON.stringify({ current_password: val }),
                    },
                );

                if (res.ok) {
                    const data = await res.json();
                    setCurrentPasswordStatus(data.valid ? 'valid' : 'invalid');
                } else {
                    setCurrentPasswordStatus('idle');
                }
            } catch {
                setCurrentPasswordStatus('idle');
            }
        }, 400);
    };

    const hasConfirmation = confirmationPassword.length > 0;
    const isConfirmationMatching =
        hasConfirmation &&
        newPassword.length > 0 &&
        confirmationPassword === newPassword;
    const isConfirmationMismatch =
        hasConfirmation &&
        (!newPassword.length || confirmationPassword !== newPassword);

    return (
        <>
            <Head title="Keamanan Akun & Autentikasi" />

            <div className="space-y-6">
                {/* 1. Password Section */}
                <div className="space-y-4">
                    <div className="space-y-0.5 border-b border-slate-100 pb-3.5 dark:border-white/[0.06]">
                        <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                            Keamanan Akun &amp; Kata Sandi
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-zinc-400">
                            Perbarui kata sandi, kelola otentikasi dua faktor
                            (2FA), dan kunci akses biometrik (Passkeys).
                        </p>
                    </div>

                    <Form
                        action={SecurityController.update.url()}
                        method="put"
                        options={{
                            preserveScroll: true,
                        }}
                        resetOnError={[
                            'password',
                            'password_confirmation',
                            'current_password',
                        ]}
                        resetOnSuccess
                        onError={(errors) => {
                            if (errors.password) {
                                passwordInput.current?.focus();
                            }

                            if (errors.current_password) {
                                currentPasswordInput.current?.focus();
                            }
                        }}
                        className="space-y-3.5"
                    >
                        {({ errors, processing }) => (
                            <>
                                <div className="grid gap-1">
                                    <Label
                                        htmlFor="current_password"
                                        className="text-xs font-semibold text-slate-700 dark:text-zinc-200"
                                    >
                                        Kata Sandi Saat Ini *
                                    </Label>

                                    <PasswordInput
                                        id="current_password"
                                        ref={currentPasswordInput}
                                        name="current_password"
                                        value={currentPassword}
                                        onChange={(e) =>
                                            handleCurrentPasswordChange(
                                                e.target.value,
                                            )
                                        }
                                        className="h-8 rounded-lg border border-slate-200 bg-slate-50/60 text-xs text-slate-900 focus:border-blue-500 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
                                        autoComplete="current-password"
                                        placeholder="Masukkan kata sandi saat ini"
                                    />

                                    {currentPasswordStatus === 'checking' && (
                                        <div className="mt-0.5 inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-zinc-400">
                                            <Spinner className="size-3" />
                                            <span>
                                                Memeriksa kata sandi saat ini...
                                            </span>
                                        </div>
                                    )}
                                    {currentPasswordStatus === 'valid' && (
                                        <div className="mt-0.5 inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50/80 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:border-emerald-800/40 dark:bg-emerald-950/30 dark:text-emerald-300">
                                            <CheckCircle2 className="size-3 text-emerald-600 dark:text-emerald-400" />
                                            <span>
                                                Kata sandi saat ini sesuai
                                            </span>
                                        </div>
                                    )}
                                    {currentPasswordStatus === 'invalid' && (
                                        <div className="mt-0.5 inline-flex items-center gap-1 rounded-md border border-rose-200 bg-rose-50/80 px-2 py-0.5 text-[11px] font-semibold text-rose-700 dark:border-rose-800/40 dark:bg-rose-950/30 dark:text-rose-300">
                                            <AlertCircle className="size-3 text-rose-600 dark:text-rose-400" />
                                            <span>
                                                Kata sandi saat ini tidak cocok
                                            </span>
                                        </div>
                                    )}

                                    <InputError
                                        message={errors.current_password}
                                    />
                                </div>

                                <div className="grid gap-2.5 sm:grid-cols-2">
                                    <div className="grid gap-1">
                                        <Label
                                            htmlFor="password"
                                            className="text-xs font-semibold text-slate-700 dark:text-zinc-200"
                                        >
                                            Kata Sandi Baru *
                                        </Label>

                                        <PasswordInput
                                            id="password"
                                            ref={passwordInput}
                                            name="password"
                                            value={newPassword}
                                            onChange={(e) =>
                                                setNewPassword(e.target.value)
                                            }
                                            className="h-8 rounded-lg border border-slate-200 bg-slate-50/60 text-xs text-slate-900 focus:border-blue-500 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
                                            autoComplete="new-password"
                                            placeholder="Minimal 8 karakter"
                                            passwordrules={props.passwordRules}
                                        />

                                        <InputError message={errors.password} />
                                    </div>

                                    <div className="grid gap-1">
                                        <Label
                                            htmlFor="password_confirmation"
                                            className="text-xs font-semibold text-slate-700 dark:text-zinc-200"
                                        >
                                            Konfirmasi Kata Sandi Baru *
                                        </Label>

                                        <PasswordInput
                                            id="password_confirmation"
                                            name="password_confirmation"
                                            value={confirmationPassword}
                                            onChange={(e) =>
                                                setConfirmationPassword(
                                                    e.target.value,
                                                )
                                            }
                                            className="h-8 rounded-lg border border-slate-200 bg-slate-50/60 text-xs text-slate-900 focus:border-blue-500 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
                                            autoComplete="new-password"
                                            placeholder="Ketik ulang kata sandi baru"
                                            passwordrules={props.passwordRules}
                                        />

                                        {isConfirmationMatching && (
                                            <div className="mt-0.5 inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50/80 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:border-emerald-800/40 dark:bg-emerald-950/30 dark:text-emerald-300">
                                                <CheckCircle2 className="size-3 text-emerald-600 dark:text-emerald-400" />
                                                <span>
                                                    Konfirmasi kata sandi cocok
                                                </span>
                                            </div>
                                        )}
                                        {isConfirmationMismatch && (
                                            <div className="mt-0.5 inline-flex items-center gap-1 rounded-md border border-rose-200 bg-rose-50/80 px-2 py-0.5 text-[11px] font-semibold text-rose-700 dark:border-rose-800/40 dark:bg-rose-950/30 dark:text-rose-300">
                                                <AlertCircle className="size-3 text-rose-600 dark:text-rose-400" />
                                                <span>
                                                    Konfirmasi kata sandi belum
                                                    sama
                                                </span>
                                            </div>
                                        )}

                                        <InputError
                                            message={
                                                errors.password_confirmation
                                            }
                                        />
                                    </div>
                                </div>

                                {/* Password Criteria & Strength Detection */}
                                <PasswordStrengthIndicator
                                    password={newPassword}
                                />

                                <div className="flex items-center justify-end pt-1">
                                    <Button
                                        size="sm"
                                        disabled={processing}
                                        data-test="update-password-button"
                                        className="h-8 rounded-lg bg-blue-600 px-4 text-xs font-semibold text-white shadow-2xs hover:bg-blue-700 active:scale-95"
                                    >
                                        {processing ? (
                                            <>
                                                <Spinner className="mr-1.5 size-3.5" />
                                                Menyimpan...
                                            </>
                                        ) : (
                                            'Simpan Kata Sandi'
                                        )}
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                </div>

                {/* 2. Two-Factor Authentication Section */}
                <div className="border-t border-slate-100 pt-4 dark:border-white/[0.06]">
                    <ManageTwoFactor
                        canManageTwoFactor={props.canManageTwoFactor}
                        requiresConfirmation={props.requiresConfirmation}
                        twoFactorEnabled={props.twoFactorEnabled}
                    />
                </div>

                {/* 3. Passkeys Section */}
                <div className="border-t border-slate-100 pt-4 dark:border-white/[0.06]">
                    <ManagePasskeys
                        canManagePasskeys={props.canManagePasskeys}
                        passkeys={props.passkeys}
                    />
                </div>
            </div>
        </>
    );
}

Security.layout = {
    breadcrumbs: [
        {
            title: 'Pengaturan Keamanan',
            href: edit(),
        },
    ],
};
