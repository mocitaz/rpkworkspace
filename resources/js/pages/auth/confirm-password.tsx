import { Form, Head } from '@inertiajs/react';
import {
    index as confirmOptions,
    store as confirmStore,
} from '@/actions/Laravel/Passkeys/Http/Controllers/PasskeyConfirmationController';
import InputError from '@/components/input-error';
import PasskeyVerify from '@/components/passkey-verify';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/password/confirm';

export default function ConfirmPassword() {
    return (
        <>
            <Head title="Konfirmasi Kata Sandi" />

            <PasskeyVerify
                routes={{
                    options: confirmOptions(),
                    submit: confirmStore(),
                }}
                label="Konfirmasi dengan passkey"
                loadingLabel="Mengonfirmasi..."
                separator="atau konfirmasi dengan kata sandi"
            />

            <Form
                action={store.url()}
                method="post"
                resetOnSuccess={['password']}
            >
                {({ processing, errors }) => (
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <Label
                                htmlFor="password"
                                className="text-xs font-semibold text-slate-700 dark:text-zinc-300"
                            >
                                Kata Sandi Advokat
                            </Label>
                            <PasswordInput
                                id="password"
                                name="password"
                                placeholder="Masukkan kata sandi Anda"
                                autoComplete="current-password"
                                autoFocus
                                className="h-9 rounded-lg border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 dark:border-white/10 dark:bg-zinc-800 dark:text-white"
                            />

                            <InputError message={errors.password} />
                        </div>

                        <div className="pt-1">
                            <Button
                                className="h-9 w-full rounded-lg bg-slate-900 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 active:scale-[0.99] dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                                disabled={processing}
                                data-test="confirm-password-button"
                            >
                                {processing ? (
                                    <>
                                        <Spinner className="mr-1.5 size-3.5" />
                                        Mengonfirmasi...
                                    </>
                                ) : (
                                    'Lanjutkan ke Pengaturan Keamanan'
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </Form>
        </>
    );
}

ConfirmPassword.layout = {
    title: 'Konfirmasi identitas Anda',
    description:
        'Area ini memerlukan verifikasi tambahan. Konfirmasikan kata sandi sebelum melanjutkan.',
};
