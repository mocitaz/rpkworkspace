import { Form, Head } from '@inertiajs/react';
import { Lock, Shield, ShieldCheck } from 'lucide-react';
import { useRef } from 'react';
import SecurityController from '@/actions/App/Http/Controllers/Settings/SecurityController';
import InputError from '@/components/input-error';
import type { Props as ManagePasskeysProps } from '@/components/manage-passkeys';
import ManagePasskeys from '@/components/manage-passkeys';
import type { Props as ManageTwoFactorProps } from '@/components/manage-two-factor';
import ManageTwoFactor from '@/components/manage-two-factor';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { edit } from '@/routes/security';

type Props = {
    passwordRules: string;
} & ManagePasskeysProps &
    ManageTwoFactorProps;

export default function Security(props: Props) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    return (
        <>
            <Head title="Keamanan Akun & Autentikasi" />

            <div className="space-y-6">
                {/* Header Sub-section */}
                <div className="space-y-1 border-b border-black/[0.04] pb-3.5 dark:border-white/[0.04]">
                    <div className="flex items-center gap-2">
                        <div className="flex size-6 items-center justify-center rounded-md bg-black/[0.04] text-[#111111] dark:bg-white/[0.06] dark:text-white">
                            <Lock className="size-3.5" />
                        </div>
                        <h2 className="text-sm font-bold text-[#111111] dark:text-white">
                            Perbarui Kata Sandi
                        </h2>
                    </div>
                    <p className="text-xs text-[#787774] dark:text-zinc-400">
                        Pastikan akun Anda menggunakan kata sandi yang panjang dan aman.
                    </p>
                </div>

                <Form
                    {...SecurityController.update.form()}
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
                            <div className="grid gap-1.5">
                                <Label htmlFor="current_password" className="text-xs font-medium text-[#2f3437] dark:text-zinc-200">
                                    Kata Sandi Saat Ini *
                                </Label>

                                <PasswordInput
                                    id="current_password"
                                    ref={currentPasswordInput}
                                    name="current_password"
                                    className="h-8 rounded-lg border border-black/[0.08] bg-[#fbfbfa] text-xs focus:border-black/20 focus:bg-white dark:border-white/10 dark:bg-[#121212]"
                                    autoComplete="current-password"
                                    placeholder="Masukkan kata sandi saat ini"
                                />

                                <InputError message={errors.current_password} />
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="grid gap-1.5">
                                    <Label htmlFor="password" className="text-xs font-medium text-[#2f3437] dark:text-zinc-200">
                                        Kata Sandi Baru *
                                    </Label>

                                    <PasswordInput
                                        id="password"
                                        ref={passwordInput}
                                        name="password"
                                        className="h-8 rounded-lg border border-black/[0.08] bg-[#fbfbfa] text-xs focus:border-black/20 focus:bg-white dark:border-white/10 dark:bg-[#121212]"
                                        autoComplete="new-password"
                                        placeholder="Minimal 8 karakter"
                                        passwordrules={props.passwordRules}
                                    />

                                    <InputError message={errors.password} />
                                </div>

                                <div className="grid gap-1.5">
                                    <Label htmlFor="password_confirmation" className="text-xs font-medium text-[#2f3437] dark:text-zinc-200">
                                        Konfirmasi Kata Sandi Baru *
                                    </Label>

                                    <PasswordInput
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        className="h-8 rounded-lg border border-black/[0.08] bg-[#fbfbfa] text-xs focus:border-black/20 focus:bg-white dark:border-white/10 dark:bg-[#121212]"
                                        autoComplete="new-password"
                                        placeholder="Ketik ulang kata sandi baru"
                                        passwordrules={props.passwordRules}
                                    />

                                    <InputError message={errors.password_confirmation} />
                                </div>
                            </div>

                            <div className="flex items-center justify-end pt-1">
                                <Button
                                    disabled={processing}
                                    data-test="update-password-button"
                                    className="h-8 rounded-lg bg-[#111111] px-4 text-xs font-semibold text-white shadow-2xs hover:bg-black active:scale-95 dark:bg-white dark:text-black"
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

                <div className="border-t border-black/[0.04] pt-5 dark:border-white/[0.04]">
                    <ManageTwoFactor
                        canManageTwoFactor={props.canManageTwoFactor}
                        requiresConfirmation={props.requiresConfirmation}
                        twoFactorEnabled={props.twoFactorEnabled}
                    />
                </div>

                <div className="border-t border-black/[0.04] pt-5 dark:border-white/[0.04]">
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
