import { Form, Head, Link, usePage } from '@inertiajs/react';
import {
    Camera,
    CheckCircle2,
    Scissors,
    Trash2,
    User as UserIcon,
} from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import { AvatarCropperModal } from '@/components/avatar-cropper-modal';
import { showEntityTooLargeAlert } from '@/components/http-error-modal';
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
            if (file.size > 5 * 1024 * 1024) {
                const fileSizeMb = (file.size / (1024 * 1024)).toFixed(1);
                toast.error(
                    `Ukuran foto (${fileSizeMb} MB) melebihi batas maksimal 5MB.`,
                );
                showEntityTooLargeAlert({
                    title: 'Ukuran Foto Terlalu Besar (Maksimal 5MB)',
                    description: `Foto "${file.name}" berukuran ${fileSizeMb} MB. Batas kapasitas maksimal foto profil adalah 5MB agar tidak ditolak oleh server.`,
                    fileInfo: `${file.name} (${fileSizeMb} MB)`,
                });
                e.target.value = '';

                return;
            }

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
                <div className="border-b border-slate-100 pb-4 dark:border-white/[0.06]">
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                        Profil &amp; Identitas
                    </h2>
                    <p className="mt-0.5 text-[11px] text-slate-500 dark:text-zinc-400">
                        Perbarui foto dan informasi utama akun Anda.
                    </p>
                </div>

                <Form
                    action={ProfileController.update.url()}
                    method="patch"
                    options={{
                        preserveScroll: true,
                    }}
                    encType="multipart/form-data"
                    className="grid gap-4 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.35fr)]"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="rounded-xl border border-slate-200/70 bg-slate-50/55 p-4 sm:p-5 dark:border-white/[0.06] dark:bg-[#121418]">
                                <div className="flex items-center gap-2.5">
                                    <div className="flex size-8 items-center justify-center rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                                        <Camera className="size-3.5" />
                                    </div>
                                    <div>
                                        <h2 className="text-xs font-bold text-slate-900 dark:text-white">
                                            Foto Profil
                                        </h2>
                                        <p className="text-[10px] text-slate-500 dark:text-zinc-400">
                                            Tampilan identitas akun Anda
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-5 flex flex-col items-center text-center">
                                    <div className="group relative flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-white shadow-[0_8px_24px_rgba(15,23,42,0.13)] ring-1 ring-slate-200 dark:border-[#1b1e24] dark:bg-zinc-800 dark:ring-white/10">
                                        <img
                                            src={
                                                previewUrl ||
                                                '/images/default-avatar.svg'
                                            }
                                            alt={auth.user.name}
                                            className="size-full object-cover transition-transform group-hover:scale-105"
                                        />
                                    </div>

                                    <div className="mt-4 w-full space-y-2">
                                        <div className="flex flex-wrap items-center justify-center gap-2">
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

                                        <p className="mx-auto max-w-xs text-[10px] leading-4 text-slate-500 dark:text-zinc-400">
                                            JPG, PNG, atau WebP maksimal 5 MB.
                                            Foto dapat diposisikan sebelum
                                            disimpan.
                                        </p>

                                        <InputError
                                            className="mt-1"
                                            message={errors.avatar}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-xl border border-slate-200/70 bg-white p-4 sm:p-5 dark:border-white/[0.06] dark:bg-[#14161b]">
                                <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4 dark:border-white/[0.06]">
                                    <div className="flex size-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300">
                                        <UserIcon className="size-3.5" />
                                    </div>
                                    <div>
                                        <h2 className="text-xs font-bold text-slate-900 dark:text-white">
                                            Informasi Utama
                                        </h2>
                                        <p className="text-[10px] text-slate-500 dark:text-zinc-400">
                                            Data resmi untuk akun dan dokumen
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-4 grid gap-4">
                                    <div className="grid gap-1.5">
                                        <Label
                                            htmlFor="name"
                                            className="text-xs font-semibold text-slate-700 dark:text-zinc-200"
                                        >
                                            Nama Lengkap
                                        </Label>

                                        <Input
                                            id="name"
                                            className="h-10 rounded-lg border border-slate-200 bg-slate-50/60 px-3 text-xs text-slate-900 focus:border-blue-500 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
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

                                    <div className="grid gap-1.5">
                                        <Label
                                            htmlFor="email"
                                            className="text-xs font-semibold text-slate-700 dark:text-zinc-200"
                                        >
                                            Alamat Email
                                        </Label>

                                        <Input
                                            id="email"
                                            type="email"
                                            className="h-10 rounded-lg border border-slate-200 bg-slate-50/60 px-3 text-xs text-slate-900 focus:border-blue-500 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
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
                                        auth.user.email_verified_at ===
                                            null && (
                                            <div className="rounded-lg border border-amber-200 bg-amber-50/90 p-3 text-xs text-amber-900 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200">
                                                <p>
                                                    Alamat email Anda belum
                                                    terverifikasi.{' '}
                                                    <Link
                                                        href={send()}
                                                        as="button"
                                                        className="font-semibold text-blue-600 underline underline-offset-4 hover:text-blue-700"
                                                    >
                                                        Kirim ulang email
                                                        verifikasi.
                                                    </Link>
                                                </p>

                                                {status ===
                                                    'verification-link-sent' && (
                                                    <div className="mt-1 flex items-center gap-1 font-semibold text-emerald-700">
                                                        <CheckCircle2 className="size-3.5" />
                                                        Tautan verifikasi baru
                                                        telah dikirim ke alamat
                                                        email Anda.
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                    <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4 dark:border-white/[0.06]">
                                        <Button
                                            size="sm"
                                            disabled={processing}
                                            className="h-9 rounded-lg bg-slate-900 px-4 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 active:scale-95 dark:bg-white dark:text-slate-900 dark:hover:bg-zinc-100"
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
                                </div>
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
