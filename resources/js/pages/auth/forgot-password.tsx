import { Form, Head } from '@inertiajs/react';
import {
    AlertCircle,
    AlertTriangle,
    CheckCircle2,
    Mail,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { email as emailRoute } from '@/routes/password';

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

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

export default function ForgotPassword({ status }: { status?: string }) {
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
            <Head title="Forgot Password - RPK Law Workspace" />

            {status && (
                <div className="mb-4 rounded-xl bg-emerald-50 p-3 text-center text-xs font-medium text-emerald-700 border border-emerald-200">
                    {status}
                </div>
            )}

            <div className="space-y-4">
                <Form {...emailRoute.form()}>
                    {({ processing, errors }) => (
                        <>
                            {errors.email && (
                                <div className="flex items-start gap-2.5 rounded-xl border border-rose-200/90 bg-rose-50/90 p-3 text-xs text-rose-900 shadow-2xs dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-200">
                                    <AlertTriangle className="mt-0.5 size-4 shrink-0 text-rose-600 dark:text-rose-400" />
                                    <div className="flex-1 space-y-0.5">
                                        <p className="font-bold text-rose-950 dark:text-rose-200">
                                            Pengiriman Gagal
                                        </p>
                                        <p className="text-[11px] leading-relaxed text-rose-700 dark:text-rose-300/90">
                                            {errors.email}
                                        </p>
                                    </div>
                                </div>
                            )}

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
                                        autoComplete="email"
                                        autoFocus
                                        placeholder="Email Address (contoh: nama@perusahaan.com)"
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

                                {emailWarning && !errors.email && (
                                    <div className="flex items-center gap-1.5 rounded-lg border border-amber-200/80 bg-amber-50/90 px-2.5 py-1 text-[11px] font-medium text-amber-700 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-300">
                                        <AlertCircle className="size-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
                                        <span>{emailWarning}</span>
                                    </div>
                                )}

                                <InputError message={errors.email} />
                            </div>

                            <div className="pt-2">
                                <Button
                                    type="submit"
                                    className="h-11 w-full rounded-xl bg-[#3b41e2] text-xs font-bold tracking-wide text-white shadow-lg shadow-indigo-500/25 hover:bg-[#3237c5] active:scale-[0.98] transition-all dark:bg-blue-600 dark:hover:bg-blue-500"
                                    disabled={processing}
                                    data-test="email-password-reset-link-button"
                                >
                                    {processing ? (
                                        <>
                                            <Spinner className="mr-1.5 size-4" />
                                            Mengirim Tautan...
                                        </>
                                    ) : (
                                        'Kirim Tautan Reset Kata Sandi'
                                    )}
                                </Button>
                            </div>
                        </>
                    )}
                </Form>

                <div className="border-t border-slate-100 pt-3 text-center text-xs text-slate-500 dark:border-white/[0.06] dark:text-zinc-400">
                    <span>Sudah ingat kata sandi?</span>{' '}
                    <TextLink href={login()} className="font-semibold text-blue-600 hover:underline dark:text-blue-400">
                        Masuk ke workspace
                    </TextLink>
                </div>
            </div>
        </>
    );
}

ForgotPassword.layout = {
    title: 'Forgot Password',
    description:
        'Masukkan email Anda untuk menerima tautan pengaturan ulang kata sandi.',
};
