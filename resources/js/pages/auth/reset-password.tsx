import { Form, Head } from '@inertiajs/react';
import { AlertCircle, CheckCircle2, Lock, Mail } from 'lucide-react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { PasswordStrengthIndicator } from '@/components/password-strength-indicator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { update } from '@/routes/password';

type Props = {
    token: string;
    email: string;
    passwordRules: string;
};

export default function ResetPassword({ token, email, passwordRules }: Props) {
    const [newPassword, setNewPassword] = useState('');
    const [confirmationPassword, setConfirmationPassword] = useState('');

    const hasConfirmation = confirmationPassword.length > 0;
    const isConfirmationMatching = hasConfirmation && newPassword.length > 0 && confirmationPassword === newPassword;
    const isConfirmationMismatch = hasConfirmation && (!newPassword.length || confirmationPassword !== newPassword);

    return (
        <>
            <Head title="Reset Password - RPK Law Workspace" />

            <Form
                {...update.form()}
                transform={(data) => ({ ...data, token, email })}
                resetOnSuccess={['password', 'password_confirmation']}
                className="space-y-4"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="space-y-1">
                            <Label htmlFor="email" className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                                Email
                            </Label>
                            <div className="relative flex items-center">
                                <Mail className="pointer-events-none absolute left-3.5 size-4 text-slate-400 dark:text-zinc-500" />
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    autoComplete="email"
                                    value={email}
                                    className="h-11 rounded-xl border-slate-200/80 bg-slate-100/70 pl-10 text-xs font-medium text-slate-900 placeholder:text-slate-400 dark:border-white/10 dark:bg-white/[0.03] dark:text-white"
                                    readOnly
                                />
                            </div>
                            <InputError message={errors.email} />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="password" className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                                Kata Sandi Baru
                            </Label>
                            <div className="relative w-full">
                                <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 dark:text-zinc-500 z-10" />
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    autoComplete="new-password"
                                    autoFocus
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Masukkan kata sandi baru"
                                    passwordrules={passwordRules}
                                    className="h-11 w-full rounded-xl border-slate-200/80 bg-[#f8fafc] pl-10 pr-10 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-white/[0.03] dark:text-white"
                                />
                            </div>
                            <InputError message={errors.password} />
                        </div>

                        {/* Password Criteria & Strength Detection */}
                        <PasswordStrengthIndicator password={newPassword} />

                        <div className="space-y-1">
                            <Label htmlFor="password_confirmation" className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                                Konfirmasi Kata Sandi Baru
                            </Label>
                            <div className="relative w-full">
                                <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 dark:text-zinc-500 z-10" />
                                <PasswordInput
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    value={confirmationPassword}
                                    onChange={(e) => setConfirmationPassword(e.target.value)}
                                    autoComplete="new-password"
                                    placeholder="Ulangi kata sandi baru"
                                    passwordrules={passwordRules}
                                    className="h-11 w-full rounded-xl border-slate-200/80 bg-[#f8fafc] pl-10 pr-10 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-white/[0.03] dark:text-white"
                                />
                            </div>
                            {isConfirmationMatching && (
                                <div className="mt-0.5 inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50/80 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:border-emerald-800/40 dark:bg-emerald-950/30 dark:text-emerald-300">
                                    <CheckCircle2 className="size-3 text-emerald-600 dark:text-emerald-400" />
                                    <span>Konfirmasi kata sandi cocok</span>
                                </div>
                            )}
                            {isConfirmationMismatch && (
                                <div className="mt-0.5 inline-flex items-center gap-1 rounded-md border border-rose-200 bg-rose-50/80 px-2 py-0.5 text-[11px] font-semibold text-rose-700 dark:border-rose-800/40 dark:bg-rose-950/30 dark:text-rose-300">
                                    <AlertCircle className="size-3 text-rose-600 dark:text-rose-400" />
                                    <span>Konfirmasi kata sandi belum sama</span>
                                </div>
                            )}
                            <InputError message={errors.password_confirmation} />
                        </div>

                        <div className="pt-2">
                            <Button
                                type="submit"
                                className="h-11 w-full rounded-xl bg-[#3b41e2] text-xs font-bold tracking-wide text-white shadow-lg shadow-indigo-500/25 hover:bg-[#3237c5] active:scale-[0.98] transition-all dark:bg-blue-600 dark:hover:bg-blue-500"
                                disabled={processing}
                                data-test="reset-password-button"
                            >
                                {processing ? (
                                    <>
                                        <Spinner className="mr-1.5 size-4" />
                                        Menyimpan...
                                    </>
                                ) : (
                                    'Simpan Kata Sandi Baru'
                                )}
                            </Button>
                        </div>
                    </>
                )}
            </Form>
        </>
    );
}

ResetPassword.layout = {
    title: 'Reset Password',
    description: 'Masukkan kata sandi baru untuk kembali mengakses workspace.',
};
