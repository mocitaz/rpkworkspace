import { Form, Head } from '@inertiajs/react';
import { Lock, Mail } from 'lucide-react';
import { useMemo, useState } from 'react';
import InputError from '@/components/input-error';
import PasskeyVerify from '@/components/passkey-verify';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export default function Login({ status, canResetPassword }: Props) {
    const [email, setEmail] = useState('');
    const [emailTouched, setEmailTouched] = useState(false);

    const emailFormatError = useMemo(() => {
        if (!emailTouched || !email) {
            return null;
        }
        const trimmed = email.trim();
        if (/\s/.test(trimmed)) {
            return 'Email tidak boleh mengandung spasi.';
        }
        if (!trimmed.includes('@') || !emailRegex.test(trimmed)) {
            return 'Format email tidak valid (contoh: nama@perusahaan.com).';
        }
        return null;
    }, [email, emailTouched]);

    return (
        <>
            <Head title="Login to account - RPK LawApp" />

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="space-y-4"
            >
                {({ processing, errors }) => {
                    const emailErrorMessage = errors.email || emailFormatError;

                    return (
                        <>
                            {/* Email Input */}
                            <div className="space-y-1">
                                <div className="relative flex items-center">
                                    <Mail className="pointer-events-none absolute left-3.5 size-4 text-slate-400 dark:text-zinc-500" />
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                        }}
                                        onBlur={() => {
                                            if (email.length > 0) {
                                                setEmailTouched(true);
                                            }
                                        }}
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="email"
                                        placeholder="Email Address"
                                        className={`h-11 rounded-xl bg-[#f8fafc] pl-10 text-xs font-medium text-slate-900 transition-colors placeholder:text-slate-400 focus:bg-white dark:bg-white/[0.03] dark:text-white ${
                                            emailErrorMessage
                                                ? 'border-red-300 focus:border-red-500 dark:border-red-800'
                                                : 'border-slate-200/80 focus:border-blue-600 dark:border-white/10'
                                        }`}
                                    />
                                </div>
                                <InputError
                                    message={emailErrorMessage ?? undefined}
                                />
                            </div>

                            {/* Password Input */}
                            <div className="space-y-1">
                                <div className="relative w-full">
                                    <Lock className="pointer-events-none absolute top-1/2 left-3.5 z-10 size-4 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
                                    <PasswordInput
                                        id="password"
                                        name="password"
                                        required
                                        tabIndex={2}
                                        autoComplete="current-password"
                                        placeholder="Password"
                                        className={`h-11 w-full rounded-xl bg-[#f8fafc] pr-10 pl-10 text-xs font-medium text-slate-900 transition-colors placeholder:text-slate-400 focus:bg-white dark:bg-white/[0.03] dark:text-white ${
                                            errors.password
                                                ? 'border-red-300 focus:border-red-500 dark:border-red-800'
                                                : 'border-slate-200/80 focus:border-blue-600 dark:border-white/10'
                                        }`}
                                    />
                                </div>
                                <InputError message={errors.password} />
                            </div>

                            {/* Remember Me & Forgot Password Row */}
                            <div className="flex items-center justify-between pt-0.5 text-xs">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="remember"
                                        name="remember"
                                        tabIndex={3}
                                        className="rounded-full border-slate-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <Label
                                        htmlFor="remember"
                                        className="cursor-pointer text-xs font-normal text-slate-500 dark:text-zinc-400"
                                    >
                                        Remember me
                                    </Label>
                                </div>

                                {canResetPassword && (
                                    <TextLink
                                        href={request()}
                                        className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400"
                                        tabIndex={5}
                                    >
                                        Forgot password?
                                    </TextLink>
                                )}
                            </div>

                            {/* Primary Action Button */}
                            <Button
                                type="submit"
                                className="h-11 w-full rounded-xl bg-[#3b41e2] text-xs font-bold tracking-wide text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-[#3237c5] active:scale-[0.98] dark:bg-blue-600 dark:hover:bg-blue-500"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing ? (
                                    <>
                                        <Spinner className="mr-1.5 size-4" />
                                        Logging in...
                                    </>
                                ) : (
                                    'Login'
                                )}
                            </Button>

                            {/* Passkey Biometric Fast-Login Alternative */}
                            <div className="pt-1">
                                <PasskeyVerify
                                    label="Masuk Cepat dengan Passkey (Biometrik)"
                                    loadingLabel="Memverifikasi autentikasi..."
                                    separator="OR LOGIN WITH:"
                                    separatorPosition="top"
                                />
                            </div>

                            {/* Bottom Help Note */}
                            <div className="pt-1 text-center text-xs text-slate-500 dark:text-zinc-400">
                                Don't have an account?{' '}
                                <span className="cursor-pointer font-semibold text-blue-600 hover:underline dark:text-blue-400">
                                    Contact Administrator
                                </span>
                            </div>
                        </>
                    );
                }}
            </Form>

            {status && (
                <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-2.5 text-center text-xs font-medium text-emerald-700">
                    {status}
                </div>
            )}
        </>
    );
}

Login.layout = {
    title: 'Login to account',
};
