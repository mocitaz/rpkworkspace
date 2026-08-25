import { Form, Head } from '@inertiajs/react';
import {
    AlertCircle,
    AlertTriangle,
    CheckCircle2,
    Fingerprint,
    Lock,
    Mail,
} from 'lucide-react';
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

function formatAuthErrorMessage(msg?: string): string {
    if (!msg) {
        return 'Email atau kata sandi yang Anda masukkan salah. Silakan periksa kembali.';
    }
    if (
        msg.includes('credentials do not match') ||
        msg.includes('tidak cocok') ||
        msg.includes('These credentials')
    ) {
        return 'Email atau kata sandi yang Anda masukkan tidak sesuai. Pastikan alamat email dan kata sandi sudah benar.';
    }
    if (
        msg.includes('Too many login attempts') ||
        msg.includes('terlalu banyak')
    ) {
        return 'Terlalu banyak percobaan masuk yang gagal. Demi keamanan akun, silakan tunggu beberapa saat sebelum mencoba kembali.';
    }
    if (msg.includes('email field is required') || msg.includes('email wajib')) {
        return 'Alamat email wajib diisi.';
    }
    if (
        msg.includes('password field is required') ||
        msg.includes('password wajib')
    ) {
        return 'Kata sandi wajib diisi.';
    }
    return msg;
}

function getEmailFormatWarning(val: string): string | null {
    const trimmed = val.trim();
    if (!trimmed) {
        return null;
    }
    if (/\s/.test(trimmed)) {
        return 'Email tidak boleh mengandung spasi.';
    }
    if (!trimmed.includes('@')) {
        return 'Format email harus menyertakan simbol "@" (contoh: nama@perusahaan.com).';
    }
    const [local, domain] = trimmed.split('@');
    if (!local) {
        return 'Ketik nama akun sebelum tanda "@".';
    }
    if (!domain) {
        return 'Sertakan domain email setelah tanda "@" (contoh: @gmail.com atau @rpklawoffice.com).';
    }
    if (!domain.includes('.')) {
        return 'Domain harus menyertakan tanda titik "." dan ekstensi (contoh: .com, .id).';
    }
    const parts = domain.split('.');
    const ext = parts[parts.length - 1];
    if (ext.length < 2) {
        return 'Ekstensi domain belum lengkap (contoh: .com, .co.id, .id).';
    }
    if (!emailRegex.test(trimmed)) {
        return 'Format email belum valid (contoh: nama@perusahaan.com).';
    }
    return null;
}

export default function Login({ status, canResetPassword }: Props) {
    const [email, setEmail] = useState('');
    const [emailTouched, setEmailTouched] = useState(false);

    const emailWarning = useMemo(() => {
        if (!emailTouched || !email) {
            return null;
        }
        return getEmailFormatWarning(email);
    }, [email, emailTouched]);

    const isEmailValid = useMemo(() => {
        if (!email) {
            return false;
        }
        return emailRegex.test(email.trim());
    }, [email]);

    return (
        <>
            <Head title="Login to account - RPK Law Workspace" />

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="space-y-4"
            >
                {({ processing, errors }) => {
                    const hasAuthError = Boolean(errors.email || errors.password);
                    const authErrorMessage = formatAuthErrorMessage(
                        errors.email || errors.password,
                    );

                    return (
                        <>
                            {/* Alert Banner Autentikasi Gagal */}
                            {hasAuthError && (
                                <div className="flex items-start gap-2.5 rounded-xl border border-rose-200/90 bg-rose-50/90 p-3 text-xs text-rose-900 shadow-2xs dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-200">
                                    <AlertTriangle className="mt-0.5 size-4 shrink-0 text-rose-600 dark:text-rose-400" />
                                    <div className="flex-1 space-y-0.5">
                                        <p className="font-bold text-rose-950 dark:text-rose-200">
                                            Autentikasi Gagal
                                        </p>
                                        <p className="text-[11px] leading-relaxed text-rose-700 dark:text-rose-300/90">
                                            {authErrorMessage}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Email Input with Prepended Icon & Format Detection */}
                            <div className="space-y-1.5">
                                <div className="relative flex items-center">
                                    <Mail
                                        className={`pointer-events-none absolute left-3.5 size-4 transition-colors ${
                                            errors.email
                                                ? 'text-rose-500'
                                                : emailWarning
                                                  ? 'text-amber-500'
                                                  : isEmailValid && emailTouched
                                                    ? 'text-emerald-500'
                                                    : 'text-slate-400 dark:text-zinc-500'
                                        }`}
                                    />
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            if (!emailTouched) {
                                                setEmailTouched(true);
                                            }
                                        }}
                                        onBlur={() => setEmailTouched(true)}
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="email"
                                        placeholder="Email Address"
                                        className={`h-11 rounded-xl bg-[#f8fafc] pl-10 pr-10 text-xs font-medium text-slate-900 placeholder:text-slate-400 transition-all dark:bg-white/[0.03] dark:text-white ${
                                            errors.email
                                                ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20 dark:border-rose-800'
                                                : emailWarning
                                                  ? 'border-amber-300 focus:border-amber-500 focus:ring-amber-500/20 dark:border-amber-700'
                                                  : isEmailValid && emailTouched
                                                    ? 'border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500/20 dark:border-emerald-800'
                                                    : 'border-slate-200/80 focus:border-blue-600 focus:bg-white dark:border-white/10'
                                        }`}
                                    />
                                    {isEmailValid && emailTouched && !errors.email && (
                                        <CheckCircle2 className="pointer-events-none absolute right-3.5 size-4 text-emerald-500" />
                                    )}
                                    {emailWarning && !errors.email && (
                                        <AlertCircle className="pointer-events-none absolute right-3.5 size-4 text-amber-500" />
                                    )}
                                </div>

                                {/* Peringatan Format Email Saat Mengetik */}
                                {emailWarning && !errors.email && (
                                    <div className="flex items-center gap-1.5 rounded-lg border border-amber-200/80 bg-amber-50/90 px-2.5 py-1 text-[11px] font-medium text-amber-700 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-300">
                                        <AlertCircle className="size-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
                                        <span>{emailWarning}</span>
                                    </div>
                                )}

                                {isEmailValid && emailTouched && !errors.email && !hasAuthError && (
                                    <div className="flex items-center gap-1 text-[10.5px] font-medium text-emerald-600 dark:text-emerald-400">
                                        <CheckCircle2 className="size-3" />
                                        <span>Format email siap digunakan</span>
                                    </div>
                                )}

                                <InputError message={errors.email} />
                            </div>

                            {/* Password Input with Prepended Icon */}
                            <div className="space-y-1.5">
                                <div className="relative w-full">
                                    <Lock
                                        className={`pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 size-4 z-10 transition-colors ${
                                            errors.password || (hasAuthError && !errors.email)
                                                ? 'text-rose-500'
                                                : 'text-slate-400 dark:text-zinc-500'
                                        }`}
                                    />
                                    <PasswordInput
                                        id="password"
                                        name="password"
                                        required
                                        tabIndex={2}
                                        autoComplete="current-password"
                                        placeholder="Password"
                                        className={`h-11 w-full rounded-xl bg-[#f8fafc] pl-10 pr-10 text-xs font-medium text-slate-900 placeholder:text-slate-400 transition-all dark:bg-white/[0.03] dark:text-white ${
                                            errors.password || (hasAuthError && !errors.email)
                                                ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20 dark:border-rose-800'
                                                : 'border-slate-200/80 focus:border-blue-600 focus:bg-white dark:border-white/10'
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
                                className="h-11 w-full rounded-xl bg-[#3b41e2] text-xs font-bold tracking-wide text-white shadow-lg shadow-indigo-500/25 hover:bg-[#3237c5] active:scale-[0.98] transition-all dark:bg-blue-600 dark:hover:bg-blue-500"
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
                                <span className="font-semibold text-blue-600 hover:underline cursor-pointer dark:text-blue-400">
                                    Contact Administrator
                                </span>
                            </div>
                        </>
                    );
                }}
            </Form>

            {status && (
                <div className="mt-4 rounded-xl bg-emerald-50 p-2.5 text-center text-xs font-medium text-emerald-700 border border-emerald-200">
                    {status}
                </div>
            )}
        </>
    );
}

Login.layout = {
    title: 'Login to account',
};
