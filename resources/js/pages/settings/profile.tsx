import { useRef, useState } from 'react';
import { Form, Head, Link, usePage } from '@inertiajs/react';
import { Camera, Trash2, UploadCloud, User as UserIcon } from 'lucide-react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { edit } from '@/routes/profile';
import { send } from '@/routes/verification';
import type { Auth } from '@/types';

type PageProps = {
    auth: Auth;
};

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage<PageProps>().props;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(auth.user.avatar_url ?? null);
    const [isRemoved, setIsRemoved] = useState(false);

    const userInitials = (auth.user.name || 'User')
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            setIsRemoved(false);
        }
    };

    const handleRemovePhoto = () => {
        setPreviewUrl(null);
        setIsRemoved(true);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <>
            <Head title="Pengaturan Profil" />

            <h1 className="sr-only">Pengaturan Profil</h1>

            <div className="space-y-6">
                <div className="space-y-1 border-b border-black/[0.04] pb-3.5 dark:border-white/[0.04]">
                    <h2 className="text-sm font-bold text-[#111111] dark:text-white">
                        Profil &amp; Identitas Advokat
                    </h2>
                    <p className="text-xs text-[#787774] dark:text-zinc-400">
                        Perbarui informasi foto profil, nama lengkap, dan alamat email akun Anda.
                    </p>
                </div>

                <Form
                    {...ProfileController.update.form()}
                    options={{
                        preserveScroll: true,
                    }}
                    encType="multipart/form-data"
                    className="space-y-4"
                >
                    {({ processing, errors }) => (
                        <>
                            {/* Notion Avatar Section */}
                            <div className="rounded-xl border border-black/[0.08] bg-[#fafafa] p-4 dark:border-white/[0.08] dark:bg-zinc-800/40">
                                <Label className="text-xs font-semibold uppercase tracking-wider text-[#787774]">
                                    Foto Profil
                                </Label>

                                <div className="mt-3 flex flex-col gap-3.5 sm:flex-row sm:items-center">
                                    {/* Avatar Display */}
                                    <div className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-black/10 bg-white text-base font-semibold text-[#111111] shadow-2xs dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200">
                                        {previewUrl ? (
                                            <img
                                                src={previewUrl}
                                                alt={auth.user.name}
                                                className="size-full object-cover"
                                            />
                                        ) : (
                                            <span className="font-semibold">{userInitials}</span>
                                        )}
                                    </div>

                                    {/* Action Buttons & Helpers */}
                                    <div className="space-y-1.5">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                id="avatar"
                                                name="avatar"
                                                accept="image/png,image/jpeg,image/jpg,image/webp"
                                                onChange={handleFileChange}
                                                className="hidden"
                                            />
                                            <input
                                                type="hidden"
                                                name="remove_avatar"
                                                value={isRemoved ? '1' : '0'}
                                            />

                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="h-7.5 rounded-lg border-black/10 bg-white px-3 text-xs font-medium text-[#111111] hover:bg-black/[0.03] dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200"
                                            >
                                                <Camera className="mr-1.5 size-3.5 text-[#787774]" />
                                                Pilih Foto Baru
                                            </Button>

                                            {(previewUrl || auth.user.avatar_url) && !isRemoved && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={handleRemovePhoto}
                                                    className="h-7.5 rounded-lg px-2.5 text-xs font-medium text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-950/40"
                                                >
                                                    <Trash2 className="mr-1.5 size-3.5" />
                                                    Hapus Foto
                                                </Button>
                                            )}
                                        </div>

                                        <p className="text-[11px] text-[#787774] dark:text-zinc-400">
                                            Format JPG, PNG, atau WebP. Maksimal 2 MB.
                                        </p>

                                        <InputError
                                            className="mt-1"
                                            message={errors.avatar}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Name Input */}
                            <div className="grid gap-1.5">
                                <Label htmlFor="name" className="text-xs font-medium text-[#2f3437] dark:text-zinc-200">
                                    Nama Lengkap
                                </Label>

                                <Input
                                    id="name"
                                    className="h-8 rounded-lg border border-black/[0.08] bg-[#fbfbfa] text-xs text-[#111111] focus:border-black/20 focus:bg-white dark:border-white/10 dark:bg-[#121212] dark:text-white"
                                    defaultValue={auth.user.name}
                                    name="name"
                                    required
                                    autoComplete="name"
                                    placeholder="Nama lengkap"
                                />

                                <InputError
                                    className="mt-1"
                                    message={errors.name}
                                />
                            </div>

                            {/* Email Input */}
                            <div className="grid gap-1.5">
                                <Label htmlFor="email" className="text-xs font-medium text-[#2f3437] dark:text-zinc-200">
                                    Alamat Email
                                </Label>

                                <Input
                                    id="email"
                                    type="email"
                                    className="h-8 rounded-lg border border-black/[0.08] bg-[#fbfbfa] text-xs text-[#111111] focus:border-black/20 focus:bg-white dark:border-white/10 dark:bg-[#121212] dark:text-white"
                                    defaultValue={auth.user.email}
                                    name="email"
                                    required
                                    autoComplete="username"
                                    placeholder="Alamat email"
                                />

                                <InputError
                                    className="mt-1"
                                    message={errors.email}
                                />
                            </div>

                            {mustVerifyEmail &&
                                auth.user.email_verified_at === null && (
                                    <div>
                                        <p className="text-xs text-[#787774]">
                                            Alamat email Anda belum terverifikasi.{' '}
                                            <Link
                                                href={send()}
                                                as="button"
                                                className="text-blue-600 underline underline-offset-4 hover:text-blue-700"
                                            >
                                                Kirim ulang email verifikasi.
                                            </Link>
                                        </p>

                                        {status === 'verification-link-sent' && (
                                            <div className="mt-1 text-xs font-medium text-emerald-600">
                                                Tautan verifikasi baru telah dikirim ke alamat email Anda.
                                            </div>
                                        )}
                                    </div>
                                )}

                            <div className="flex items-center gap-3 pt-2">
                                <Button
                                    disabled={processing}
                                    className="h-8 rounded-lg bg-[#111111] px-4 text-xs font-semibold text-white shadow-2xs hover:bg-black active:scale-95 dark:bg-white dark:text-black"
                                    data-test="update-profile-button"
                                >
                                    Simpan Perubahan
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

Profile.layout = {
    breadcrumbs: [
        {
            title: 'Pengaturan Profil',
            href: edit(),
        },
    ],
};
