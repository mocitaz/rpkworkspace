import { Form, Head } from '@inertiajs/react';
import { Mail } from 'lucide-react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { email } from '@/routes/password';

export default function ForgotPassword({ status }: { status?: string }) {
    return (
        <>
            <Head title="Forgot Password - RPK Law Workspace" />

            {status && (
                <div className="mb-4 rounded-xl bg-emerald-50 p-3 text-center text-xs font-medium text-emerald-700 border border-emerald-200">
                    {status}
                </div>
            )}

            <div className="space-y-4">
                <Form {...email.form()}>
                    {({ processing, errors }) => (
                        <>
                            <div className="space-y-1">
                                <div className="relative flex items-center">
                                    <Mail className="pointer-events-none absolute left-3.5 size-4 text-slate-400 dark:text-zinc-500" />
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        autoComplete="email"
                                        autoFocus
                                        placeholder="Email Address"
                                        className="h-11 rounded-xl border-slate-200/80 bg-[#f8fafc] pl-10 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-white/[0.03] dark:text-white"
                                    />
                                </div>
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
