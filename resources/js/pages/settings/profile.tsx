import { useRef, useState } from 'react';
import { Form, Head, Link, usePage } from '@inertiajs/react';
import {
    Camera,
    CheckCircle2,
    Scissors,
    Trash2,
    User as UserIcon,
} from 'lucide-react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import { AvatarCropperModal } from '@/components/avatar-cropper-modal';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
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
    const [previewUrl, setPreviewUrl] = useState<string | null>(
        auth.user.avatar_url ?? null,
    );
    const [isRemoved, setIsRemoved] = useState(false);
    const [rawImageSrc, setRawImageSrc] = useState<string | null>(null);
    const [originalFileName, setOriginalFileName] =
        useState<string>('avatar.jpg');
    const [isCropperOpen, setIsCropperOpen] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setOriginalFileName(file.name);
            const reader = new FileReader();
            reader.onload = () => {
                setRawImageSrc(reader.result as string);
                setIsCropperOpen(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCropComplete = (
        croppedFile: File,
        croppedPreviewUrl: string,
    ) => {
        // Set the cropped file into the file input using DataTransfer
        if (fileInputRef.current) {
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(croppedFile);
            fileInputRef.current.files = dataTransfer.files;
        }
        setPreviewUrl(croppedPreviewUrl);
        setIsRemoved(false);
    };

    const handleRemovePhoto = () => {
        setPreviewUrl(null);
        setRawImageSrc(null);
        setIsRemoved(true);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <>
            <Head title="Pengaturan Profil - Identitas Advokat" />

            {/* Avatar Cropper Modal */}
            <AvatarCropperModal
                isOpen={isCropperOpen}
                imageSrc={rawImageSrc}
                originalFileName={originalFileName}
                onClose={() => setIsCropperOpen(false)}
                onCropComplete={handleCropComplete}
            />

            <div className="space-y-5">
                <div className="space-y-0.5 border-b border-slate-100 pb-3.5 dark:border-white/[0.06]">
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                        Profil &amp; Identitas Advokat
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">
                        Perbarui informasi foto profil, nama lengkap, dan alamat
                        email akun Anda.
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
                            {/* Avatar Section */}
                            <div className="rounded-lg border border-slate-200/70 bg-slate-50/60 p-4 dark:border-white/[0.06] dark:bg-[#121418]">
                                <Label className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase dark:text-zinc-400">
                                    FOTO PROFIL ADVOKAT
                                </Label>

                                <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
                                    {/* Avatar Display */}
                                    <div className="group relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white shadow-2xs dark:border-white/10 dark:bg-zinc-800">
                                        <img
                                            src={
                                                previewUrl ||
                                                '/images/default-avatar.svg'
                                            }
                                            alt={auth.user.name}
                                            className="size-full object-cover transition-transform group-hover:scale-105"
                                        />
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
                                                onClick={() => {
                                                    if (fileInputRef.current) {
                                                        fileInputRef.current.value =
                                                            '';
                                                    }
                                                    fileInputRef.current?.click();
                                                }}
                                                className="h-8 rounded-lg border-slate-200 bg-white px-3 text-xs font-semibold text-slate-800 shadow-2xs hover:bg-slate-50 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200"
                                            >
                                                <Camera className="mr-1.5 size-3.5 text-slate-500" />
                                                Pilih Foto Baru
                                            </Button>

                                            {rawImageSrc && !isRemoved && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        setIsCropperOpen(true)
                                                    }
                                                    className="h-8 rounded-lg border-slate-200 bg-white px-3 text-xs font-semibold text-blue-600 shadow-2xs hover:bg-blue-50 dark:border-white/10 dark:bg-zinc-800 dark:text-blue-400"
                                                >
                                                    <Scissors className="mr-1.5 size-3.5" />
                                                    Sesuaikan / Crop
                                                </Button>
                                            )}

                                            {(previewUrl ||
                                                auth.user.avatar_url) &&
                                                !isRemoved && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={
                                                            handleRemovePhoto
                                                        }
                                                        className="h-8 rounded-lg px-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-950/40"
                                                    >
                                                        <Trash2 className="mr-1.5 size-3.5" />
                                                        Hapus Foto
                                                    </Button>
                                                )}
                                        </div>

                                        <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                                            Format JPG, PNG, atau WebP. Anda
                                            dapat memposisikan &amp; memotong
                                            foto sebelum disimpan.
                                        </p>

                                        <InputError
                                            className="mt-1"
                                            message={errors.avatar}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Name Input */}
                            <div className="grid gap-1">
                                <Label
                                    htmlFor="name"
                                    className="text-xs font-semibold text-slate-700 dark:text-zinc-200"
                                >
                                    Nama Lengkap
                                </Label>

                                <Input
                                    id="name"
                                    className="h-8 rounded-lg border border-slate-200 bg-slate-50/60 text-xs text-slate-900 focus:border-blue-500 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
                                    defaultValue={auth.user.name}
                                    name="name"
                                    required
                                    autoComplete="name"
                                    placeholder="Nama lengkap advokat"
                                />

                                <InputError
                                    className="mt-0.5"
                                    message={errors.name}
                                />
                            </div>

                            {/* Email Input */}
                            <div className="grid gap-1">
                                <Label
                                    htmlFor="email"
                                    className="text-xs font-semibold text-slate-700 dark:text-zinc-200"
                                >
                                    Alamat Email
                                </Label>

                                <Input
                                    id="email"
                                    type="email"
                                    className="h-8 rounded-lg border border-slate-200 bg-slate-50/60 text-xs text-slate-900 focus:border-blue-500 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
                                    defaultValue={auth.user.email}
                                    name="email"
                                    required
                                    autoComplete="username"
                                    placeholder="nama@rpklawoffice.com"
                                />

                                <InputError
                                    className="mt-0.5"
                                    message={errors.email}
                                />
                            </div>

                            {mustVerifyEmail &&
                                auth.user.email_verified_at === null && (
                                    <div className="rounded-lg border border-amber-200 bg-amber-50/90 p-3 text-xs text-amber-900">
                                        <p>
                                            Alamat email Anda belum
                                            terverifikasi.{' '}
                                            <Link
                                                href={send()}
                                                as="button"
                                                className="font-semibold text-blue-600 underline underline-offset-4 hover:text-blue-700"
                                            >
                                                Kirim ulang email verifikasi.
                                            </Link>
                                        </p>

                                        {status ===
                                            'verification-link-sent' && (
                                            <div className="mt-1 flex items-center gap-1 font-semibold text-emerald-700">
                                                <CheckCircle2 className="size-3.5" />
                                                Tautan verifikasi baru telah
                                                dikirim ke alamat email Anda.
                                            </div>
                                        )}
                                    </div>
                                )}

                            <div className="flex items-center gap-2 border-t border-slate-100 pt-3 dark:border-white/[0.06]">
                                <Button
                                    size="sm"
                                    disabled={processing}
                                    className="h-8 rounded-lg bg-blue-600 px-4 text-xs font-semibold text-white shadow-2xs hover:bg-blue-700 active:scale-95"
                                    data-test="update-profile-button"
                                >
                                    {processing ? (
                                        <>
                                            <Spinner className="mr-1.5 size-3.5" />
                                            Menyimpan...
                                        </>
                                    ) : (
                                        'Simpan Perubahan'
                                    )}
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
