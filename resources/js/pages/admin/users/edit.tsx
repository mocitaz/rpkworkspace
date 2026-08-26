import { Form, Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Briefcase,
    Building2,
    Calendar,
    Camera,
    CreditCard,
    FileBadge,
    FileCheck,
    GraduationCap,
    Info,
    Lock,
    Mail,
    MapPin,
    Phone,
    Plus,
    Scale,
    Shield,
    ShieldCheck,
    Sparkles,
    Trash2,
    UserCheck,
    Users,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { showEntityTooLargeAlert } from '@/components/http-error-modal';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import * as userRoutes from '@/routes/admin/users';

type Permission = { id: number; name: string; description?: string };
type Role = {
    id: number;
    name: string;
    slug: string;
    description?: string;
    permissions: Permission[];
};

type User = {
    id: number;
    name: string;
    email: string;
    position_title: string;
    employee_code?: string;
    department?: string;
    employment_type?: string;
    employment_status?: string;
    work_mode?: string;
    joined_at?: string;
    contract_end?: string;
    supervisor_name?: string;
    phone?: string;
    address?: string;
    ktp_address?: string;
    birth_date?: string;
    advocate_license_no?: string;
    bas_number?: string;
    bas_date?: string;
    kta_expiry_date?: string;
    practice_areas?: string;
    education?: string;
    hourly_rate?: number;
    bank_name?: string;
    bank_account_number?: string;
    bank_account_holder?: string;
    npwp?: string;
    avatar_url?: string;
    is_active: boolean;
    roles?: Role[];
};

type PageProps = {
    staff: User;
    roles: Role[];
    departments: string[];
    positions: string[];
    employmentTypes: string[];
    workModes: string[];
};

export default function UserEdit({
    staff,
    roles,
    departments,
    positions,
    employmentTypes,
    workModes,
}: PageProps) {
    const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>(() =>
        staff.roles ? staff.roles.map((r) => r.id) : [],
    );

    const [avatarPreview, setAvatarPreview] = useState<string | null>(
        staff.avatar_url && !staff.avatar_url.includes('default-avatar.svg')
            ? staff.avatar_url
            : null,
    );
    const [removeAvatar, setRemoveAvatar] = useState(false);
    const [isActive, setIsActive] = useState<boolean>(Boolean(staff.is_active));

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                const fileSizeMb = (file.size / (1024 * 1024)).toFixed(1);
                toast.error(`Ukuran foto (${fileSizeMb} MB) melebihi batas maksimal 5MB.`);
                showEntityTooLargeAlert({
                    title: 'Ukuran Foto Terlalu Besar (Maksimal 5MB)',
                    description: `Foto "${file.name}" berukuran ${fileSizeMb} MB. Batas kapasitas maksimal foto profil adalah 5MB agar tidak ditolak oleh server.`,
                    fileInfo: `${file.name} (${fileSizeMb} MB)`,
                });
                e.target.value = '';
                return;
            }

            setRemoveAvatar(false);
            const reader = new FileReader();
            reader.onload = (event) => {
                setAvatarPreview(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveAvatar = () => {
        setAvatarPreview(null);
        setRemoveAvatar(true);
    };

    const toggleRole = (roleId: number) => {
        setSelectedRoleIds((prev) =>
            prev.includes(roleId)
                ? prev.filter((id) => id !== roleId)
                : [...prev, roleId],
        );
    };

    return (
        <>
            <Head title={`Edit Profil: ${staff.name} - RPK Law Office`} />

            <div className="min-h-screen bg-[#fafafc] pb-24 dark:bg-[#0c0d10]">
                <main className="mx-auto max-w-4xl space-y-5 px-4 py-5 sm:px-6 lg:px-8">
                    {/* 1. Header Navigation */}
                    <div className="flex flex-col justify-between gap-4 border-b border-slate-200/60 pb-5 sm:flex-row sm:items-center dark:border-white/[0.06]">
                        <div className="space-y-1">
                            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                                Edit Profil: {staff.name}
                            </h1>
                            <p className="text-xs text-slate-500 dark:text-zinc-400">
                                Perbarui data identitas staf, jabatan struktural, nomor KTA/BAS advokat, nomor rekening, dan hak akses.
                            </p>
                        </div>

                        <div className="flex shrink-0 items-center gap-2">
                            <Button
                                variant="outline"
                                className="h-8 rounded-lg border-slate-200/80 bg-white px-3 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-white/10 dark:bg-[#16181d] dark:text-zinc-300"
                                asChild
                            >
                                <Link href={userRoutes.show.url(staff.id)}>
                                    <ArrowLeft className="mr-1 size-3.5 text-slate-400" />
                                    Kembali ke Profil
                                </Link>
                            </Button>
                        </div>
                    </div>

                    <Form
                        action={userRoutes.update.url(staff.id)}
                        method="post"
                        encType="multipart/form-data"
                        className="space-y-5"
                    >
                        {({ processing, errors }) => (
                            <>
                                {/* Method spoofing for PUT/PATCH via Inertia Form */}
                                <input type="hidden" name="_method" value="PUT" />

                                {removeAvatar && (
                                    <input type="hidden" name="remove_avatar" value="1" />
                                )}

                                <input
                                    type="hidden"
                                    name="is_active"
                                    value={isActive ? '1' : '0'}
                                />

                                {/* Hidden role IDs array */}
                                {selectedRoleIds.map((id) => (
                                    <input
                                        key={id}
                                        type="hidden"
                                        name="role_ids[]"
                                        value={id}
                                    />
                                ))}

                                {/* Card 1: Identitas & Akun Login */}
                                <section className="rounded-xl border border-slate-200/70 bg-white p-5 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-white/[0.05]">
                                        <div className="flex items-center gap-2">
                                            <Users className="size-4 text-blue-600 dark:text-blue-400" />
                                            <h2 className="text-xs font-bold text-slate-900 dark:text-white">
                                                1. Identitas Pribadi &amp; Akun Login
                                            </h2>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Label htmlFor="is_active_toggle" className="text-xs font-medium text-slate-600 dark:text-zinc-400">
                                                Status Akun:
                                            </Label>
                                            <button
                                                type="button"
                                                id="is_active_toggle"
                                                onClick={() => setIsActive(!isActive)}
                                                className={`inline-flex h-6 items-center rounded-full px-2.5 text-[11px] font-bold transition-colors ${
                                                    isActive
                                                        ? 'bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
                                                        : 'bg-rose-500/10 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300'
                                                }`}
                                            >
                                                <span
                                                    className={`mr-1.5 size-1.5 rounded-full ${
                                                        isActive ? 'bg-emerald-500' : 'bg-rose-500'
                                                    }`}
                                                />
                                                {isActive ? 'Aktif' : 'Non-Aktif'}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mt-4 space-y-4">
                                        {/* Avatar Upload */}
                                        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                                            <div className="relative size-20 shrink-0 overflow-hidden rounded-full border-2 border-slate-200 bg-slate-100 dark:border-white/10 dark:bg-white/[0.04]">
                                                {avatarPreview ? (
                                                    <img
                                                        src={avatarPreview}
                                                        alt="Preview"
                                                        className="size-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex size-full items-center justify-center text-slate-400 dark:text-zinc-500">
                                                        <Camera className="size-6" />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-1.5">
                                                <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                                                    Foto Profil Staf
                                                </Label>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <label className="cursor-pointer">
                                                        <input
                                                            type="file"
                                                            name="avatar"
                                                            accept="image/png,image/jpeg,image/webp"
                                                            onChange={handleAvatarChange}
                                                            className="sr-only"
                                                        />
                                                        <span className="inline-flex h-7 items-center rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-white/10 dark:bg-[#181a20] dark:text-zinc-200">
                                                            <Camera className="mr-1.5 size-3 text-slate-500" />
                                                            Ganti Foto
                                                        </span>
                                                    </label>
                                                    {avatarPreview && (
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={handleRemoveAvatar}
                                                            className="h-7 text-xs text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-950/40"
                                                        >
                                                            <Trash2 className="mr-1 size-3" />
                                                            Hapus Foto
                                                        </Button>
                                                    )}
                                                </div>
                                                <p className="text-[11px] text-slate-400 dark:text-zinc-500">
                                                    Format JPG, PNG, atau WEBP. Maksimal 5MB.
                                                </p>
                                                <InputError message={errors.avatar} />
                                            </div>
                                        </div>

                                        <div className="grid gap-4 sm:grid-cols-2">
                                            {/* Nama Lengkap */}
                                            <div className="space-y-1 sm:col-span-2">
                                                <Label htmlFor="name" className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                                                    Nama Lengkap &amp; Gelar <span className="text-rose-500">*</span>
                                                </Label>
                                                <Input
                                                    id="name"
                                                    name="name"
                                                    defaultValue={staff.name}
                                                    placeholder="Contoh: Muhamad Fajar Roni, S.H."
                                                    required
                                                    className="h-9 text-xs"
                                                />
                                                <InputError message={errors.name} />
                                            </div>

                                            {/* Kode Pegawai / NIP */}
                                            <div className="space-y-1">
                                                <Label htmlFor="employee_code" className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                                                    Nomor Induk Pegawai (NIP / Kode Staf)
                                                </Label>
                                                <Input
                                                    id="employee_code"
                                                    name="employee_code"
                                                    defaultValue={staff.employee_code ?? ''}
                                                    placeholder="Contoh: RPK-001"
                                                    className="h-9 font-mono text-xs font-semibold"
                                                />
                                                <InputError message={errors.employee_code} />
                                            </div>

                                            {/* Email Login */}
                                            <div className="space-y-1">
                                                <Label htmlFor="email" className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                                                    Alamat Email Kantor (Login) <span className="text-rose-500">*</span>
                                                </Label>
                                                <Input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    defaultValue={staff.email}
                                                    placeholder="staf@rpklawoffice.com"
                                                    required
                                                    className="h-9 text-xs"
                                                />
                                                <InputError message={errors.email} />
                                            </div>

                                            {/* Password */}
                                            <div className="space-y-1">
                                                <Label htmlFor="password" className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                                                    Ubah Kata Sandi (Opsional)
                                                </Label>
                                                <Input
                                                    id="password"
                                                    name="password"
                                                    type="password"
                                                    placeholder="Biarkan kosong jika tidak ingin mengubah"
                                                    className="h-9 text-xs"
                                                />
                                                <p className="text-[10.5px] text-slate-400 dark:text-zinc-500">
                                                    Minimal 8 karakter jika ingin mengatur ulang kata sandi.
                                                </p>
                                                <InputError message={errors.password} />
                                            </div>

                                            {/* Nomor HP / WA */}
                                            <div className="space-y-1">
                                                <Label htmlFor="phone" className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                                                    Nomor Telepon / WhatsApp
                                                </Label>
                                                <Input
                                                    id="phone"
                                                    name="phone"
                                                    defaultValue={staff.phone ?? ''}
                                                    placeholder="Contoh: +62 812-3456-7890"
                                                    className="h-9 text-xs"
                                                />
                                                <InputError message={errors.phone} />
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Card 2: Jabatan Struktural & Kepegawaian */}
                                <section className="rounded-xl border border-slate-200/70 bg-white p-5 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                    <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-white/[0.05]">
                                        <Briefcase className="size-4 text-indigo-600 dark:text-indigo-400" />
                                        <h2 className="text-xs font-bold text-slate-900 dark:text-white">
                                            2. Posisi Struktural &amp; Status Kepegawaian
                                        </h2>
                                    </div>

                                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                        {/* Jabatan / Position Title */}
                                        <div className="space-y-1">
                                            <Label htmlFor="position_title" className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                                                Jabatan Resmi (Position Title) <span className="text-rose-500">*</span>
                                            </Label>
                                            <input
                                                list="position-options"
                                                id="position_title"
                                                name="position_title"
                                                defaultValue={staff.position_title ?? ''}
                                                required
                                                placeholder="Pilih atau ketik jabatan (contoh: Partner, Associate, Staf)..."
                                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-2xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                            />
                                            <datalist id="position-options">
                                                {positions.map((pos) => (
                                                    <option key={pos} value={pos} />
                                                ))}
                                            </datalist>
                                            <InputError message={errors.position_title} />
                                        </div>

                                        {/* Departemen / Divisi */}
                                        <div className="space-y-1">
                                            <Label htmlFor="department" className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                                                Divisi / Departemen
                                            </Label>
                                            <input
                                                list="department-options"
                                                id="department"
                                                name="department"
                                                defaultValue={staff.department ?? ''}
                                                placeholder="Pilih atau ketik divisi..."
                                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-2xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                            />
                                            <datalist id="department-options">
                                                {departments.map((dept) => (
                                                    <option key={dept} value={dept} />
                                                ))}
                                            </datalist>
                                            <InputError message={errors.department} />
                                        </div>

                                        {/* Tipe Ikatan Kerja */}
                                        <div className="space-y-1">
                                            <Label htmlFor="employment_type" className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                                                Tipe Ikatan Kerja
                                            </Label>
                                            <select
                                                id="employment_type"
                                                name="employment_type"
                                                defaultValue={staff.employment_type ?? 'Permanent'}
                                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-2xs transition-colors focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                                            >
                                                {employmentTypes.map((type) => (
                                                    <option key={type} value={type} className="dark:bg-[#14161b]">
                                                        {type === 'Permanent' ? 'Tetap (Permanent)' : type === 'Contract' ? 'Kontrak (Contract)' : type === 'Internship' ? 'Magang (Internship)' : type === 'Of Counsel' ? 'Of Counsel (Konsultan Ahli)' : 'Partner / Sekutu'}
                                                    </option>
                                                ))}
                                            </select>
                                            <InputError message={errors.employment_type} />
                                        </div>

                                        {/* Mode Kerja */}
                                        <div className="space-y-1">
                                            <Label htmlFor="work_mode" className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                                                Mode Kerja
                                            </Label>
                                            <select
                                                id="work_mode"
                                                name="work_mode"
                                                defaultValue={staff.work_mode ?? 'WFO'}
                                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-2xs transition-colors focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                                            >
                                                {workModes.map((mode) => (
                                                    <option key={mode} value={mode} className="dark:bg-[#14161b]">
                                                        {mode === 'WFO' ? 'WFO (On-Site Kantor)' : mode === 'Hybrid' ? 'Hybrid (Kantor & Remote)' : 'Remote (Work From Anywhere)'}
                                                    </option>
                                                ))}
                                            </select>
                                            <InputError message={errors.work_mode} />
                                        </div>

                                        {/* Tanggal Bergabung */}
                                        <div className="space-y-1">
                                            <Label htmlFor="joined_at" className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                                                Tanggal Bergabung (Joined Date)
                                            </Label>
                                            <Input
                                                id="joined_at"
                                                name="joined_at"
                                                type="date"
                                                defaultValue={staff.joined_at ? staff.joined_at.substring(0, 10) : ''}
                                                className="h-9 text-xs"
                                            />
                                            <InputError message={errors.joined_at} />
                                        </div>

                                        {/* Tanggal Berakhir Kontrak */}
                                        <div className="space-y-1">
                                            <Label htmlFor="contract_end" className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                                                Tanggal Berakhir Kontrak (Opsional)
                                            </Label>
                                            <Input
                                                id="contract_end"
                                                name="contract_end"
                                                type="date"
                                                defaultValue={staff.contract_end ? staff.contract_end.substring(0, 10) : ''}
                                                className="h-9 text-xs"
                                            />
                                            <InputError message={errors.contract_end} />
                                        </div>

                                        {/* Nama Atasan Langsung */}
                                        <div className="space-y-1 sm:col-span-2">
                                            <Label htmlFor="supervisor_name" className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                                                Nama Atasan Langsung / Supervising Partner
                                            </Label>
                                            <Input
                                                id="supervisor_name"
                                                name="supervisor_name"
                                                defaultValue={staff.supervisor_name ?? ''}
                                                placeholder="Contoh: M. Anggara Putra, S.H., M.H."
                                                className="h-9 text-xs"
                                            />
                                            <InputError message={errors.supervisor_name} />
                                        </div>
                                    </div>
                                </section>

                                {/* Card 3: Kredensial Advokat & Legalitas Profesi */}
                                <section className="rounded-xl border border-slate-200/70 bg-white p-5 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                    <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-white/[0.05]">
                                        <Scale className="size-4 text-amber-600 dark:text-amber-400" />
                                        <h2 className="text-xs font-bold text-slate-900 dark:text-white">
                                            3. Kredensial Advokat &amp; Legalitas Profesi (Khusus Advokat)
                                        </h2>
                                    </div>

                                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                        {/* Nomor KTA Advokat */}
                                        <div className="space-y-1">
                                            <Label htmlFor="advocate_license_no" className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                                                Nomor Induk Advokat / KTA
                                            </Label>
                                            <Input
                                                id="advocate_license_no"
                                                name="advocate_license_no"
                                                defaultValue={staff.advocate_license_no ?? ''}
                                                placeholder="Contoh: 01.12345/PERADI/2021"
                                                className="h-9 font-mono text-xs"
                                            />
                                            <InputError message={errors.advocate_license_no} />
                                        </div>

                                        {/* Tanggal Kadaluwarsa KTA */}
                                        <div className="space-y-1">
                                            <Label htmlFor="kta_expiry_date" className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                                                Tanggal Kedaluwarsa KTA
                                            </Label>
                                            <Input
                                                id="kta_expiry_date"
                                                name="kta_expiry_date"
                                                type="date"
                                                defaultValue={staff.kta_expiry_date ? staff.kta_expiry_date.substring(0, 10) : ''}
                                                className="h-9 text-xs"
                                            />
                                            <InputError message={errors.kta_expiry_date} />
                                        </div>

                                        {/* Nomor BAS Pengadilan Tinggi */}
                                        <div className="space-y-1">
                                            <Label htmlFor="bas_number" className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                                                Nomor Berita Acara Sumpah (BAS) PT
                                            </Label>
                                            <Input
                                                id="bas_number"
                                                name="bas_number"
                                                defaultValue={staff.bas_number ?? ''}
                                                placeholder="Contoh: W10.U/123/HK.02/2021"
                                                className="h-9 font-mono text-xs"
                                            />
                                            <InputError message={errors.bas_number} />
                                        </div>

                                        {/* Tanggal Sumpah BAS */}
                                        <div className="space-y-1">
                                            <Label htmlFor="bas_date" className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                                                Tanggal Sumpah BAS
                                            </Label>
                                            <Input
                                                id="bas_date"
                                                name="bas_date"
                                                type="date"
                                                defaultValue={staff.bas_date ? staff.bas_date.substring(0, 10) : ''}
                                                className="h-9 text-xs"
                                            />
                                            <InputError message={errors.bas_date} />
                                        </div>

                                        {/* Bidang Keahlian */}
                                        <div className="space-y-1 sm:col-span-2">
                                            <Label htmlFor="practice_areas" className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                                                Fokus Keahlian Hukum (Practice Areas)
                                            </Label>
                                            <Input
                                                id="practice_areas"
                                                name="practice_areas"
                                                defaultValue={staff.practice_areas ?? ''}
                                                placeholder="Contoh: Hukum Kepailitan & PKPU, Sengketa Kontrak Bisnis, Hukum Ketenagakerjaan"
                                                className="h-9 text-xs"
                                            />
                                            <InputError message={errors.practice_areas} />
                                        </div>

                                        {/* Riwayat Pendidikan */}
                                        <div className="space-y-1 sm:col-span-2">
                                            <Label htmlFor="education" className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                                                Riwayat Pendidikan &amp; Almamater
                                            </Label>
                                            <Input
                                                id="education"
                                                name="education"
                                                defaultValue={staff.education ?? ''}
                                                placeholder="Contoh: S1 Ilmu Hukum (Universitas Indonesia), S2 Magister Hukum (UGM)"
                                                className="h-9 text-xs"
                                            />
                                            <InputError message={errors.education} />
                                        </div>
                                    </div>
                                </section>

                                {/* Card 4: Finansial & Rekening Penggajian */}
                                <section className="rounded-xl border border-slate-200/70 bg-white p-5 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                    <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-white/[0.05]">
                                        <CreditCard className="size-4 text-emerald-600 dark:text-emerald-400" />
                                        <h2 className="text-xs font-bold text-slate-900 dark:text-white">
                                            4. Informasi Finansial, Rekening Bank &amp; Pajak
                                        </h2>
                                    </div>

                                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                        {/* Nama Bank */}
                                        <div className="space-y-1">
                                            <Label htmlFor="bank_name" className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                                                Nama Bank
                                            </Label>
                                            <Input
                                                id="bank_name"
                                                name="bank_name"
                                                defaultValue={staff.bank_name ?? ''}
                                                placeholder="Contoh: BCA / Bank Mandiri / BSI"
                                                className="h-9 text-xs"
                                            />
                                            <InputError message={errors.bank_name} />
                                        </div>

                                        {/* Nomor Rekening */}
                                        <div className="space-y-1">
                                            <Label htmlFor="bank_account_number" className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                                                Nomor Rekening
                                            </Label>
                                            <Input
                                                id="bank_account_number"
                                                name="bank_account_number"
                                                defaultValue={staff.bank_account_number ?? ''}
                                                placeholder="Contoh: 1234567890"
                                                className="h-9 font-mono text-xs"
                                            />
                                            <InputError message={errors.bank_account_number} />
                                        </div>

                                        {/* Nama Pemilik Rekening */}
                                        <div className="space-y-1">
                                            <Label htmlFor="bank_account_holder" className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                                                Nama Pemilik Rekening
                                            </Label>
                                            <Input
                                                id="bank_account_holder"
                                                name="bank_account_holder"
                                                defaultValue={staff.bank_account_holder ?? ''}
                                                placeholder="Nama sesuai buku tabungan"
                                                className="h-9 text-xs"
                                            />
                                            <InputError message={errors.bank_account_holder} />
                                        </div>

                                        {/* NPWP */}
                                        <div className="space-y-1">
                                            <Label htmlFor="npwp" className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                                                Nomor Pokok Wajib Pajak (NPWP)
                                            </Label>
                                            <Input
                                                id="npwp"
                                                name="npwp"
                                                defaultValue={staff.npwp ?? ''}
                                                placeholder="Contoh: 01.234.567.8-901.000"
                                                className="h-9 font-mono text-xs"
                                            />
                                            <InputError message={errors.npwp} />
                                        </div>

                                        {/* Tarif Jam Kerja */}
                                        <div className="space-y-1">
                                            <Label htmlFor="hourly_rate" className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                                                Tarif Billable Jam Kerja (IDR / Jam)
                                            </Label>
                                            <Input
                                                id="hourly_rate"
                                                name="hourly_rate"
                                                type="number"
                                                step="10000"
                                                defaultValue={staff.hourly_rate ?? ''}
                                                placeholder="Contoh: 1500000"
                                                className="h-9 font-mono text-xs"
                                            />
                                            <InputError message={errors.hourly_rate} />
                                        </div>
                                    </div>
                                </section>

                                {/* Card 5: Data Pribadi & Domisili */}
                                <section className="rounded-xl border border-slate-200/70 bg-white p-5 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                    <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-white/[0.05]">
                                        <MapPin className="size-4 text-teal-600 dark:text-teal-400" />
                                        <h2 className="text-xs font-bold text-slate-900 dark:text-white">
                                            5. Data Pribadi &amp; Alamat Domisili
                                        </h2>
                                    </div>

                                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                        {/* Tanggal Lahir */}
                                        <div className="space-y-1 sm:col-span-2">
                                            <Label htmlFor="birth_date" className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                                                Tanggal Lahir
                                            </Label>
                                            <Input
                                                id="birth_date"
                                                name="birth_date"
                                                type="date"
                                                defaultValue={staff.birth_date ? staff.birth_date.substring(0, 10) : ''}
                                                className="h-9 text-xs sm:w-1/2"
                                            />
                                            <InputError message={errors.birth_date} />
                                        </div>

                                        {/* Alamat KTP */}
                                        <div className="space-y-1">
                                            <Label htmlFor="ktp_address" className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                                                Alamat Sesuai KTP
                                            </Label>
                                            <textarea
                                                id="ktp_address"
                                                name="ktp_address"
                                                rows={2}
                                                defaultValue={staff.ktp_address ?? ''}
                                                placeholder="Alamat lengkap sesuai identitas KTP..."
                                                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs shadow-2xs focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                                            />
                                            <InputError message={errors.ktp_address} />
                                        </div>

                                        {/* Alamat Domisili */}
                                        <div className="space-y-1">
                                            <Label htmlFor="address" className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                                                Alamat Domisili Saat Ini
                                            </Label>
                                            <textarea
                                                id="address"
                                                name="address"
                                                rows={2}
                                                defaultValue={staff.address ?? ''}
                                                placeholder="Alamat tempat tinggal saat ini jika berbeda..."
                                                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs shadow-2xs focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                                            />
                                            <InputError message={errors.address} />
                                        </div>
                                    </div>
                                </section>

                                {/* Card 6: Penetapan Hak Akses & Peran (RBAC) */}
                                <section className="rounded-xl border border-slate-200/70 bg-white p-5 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-white/[0.05]">
                                        <div className="flex items-center gap-2">
                                            <Shield className="size-4 text-purple-600 dark:text-purple-400" />
                                            <h2 className="text-xs font-bold text-slate-900 dark:text-white">
                                                6. Penetapan Peran &amp; Hak Akses Sistem <span className="text-rose-500">*</span>
                                            </h2>
                                        </div>
                                        <span className="text-[11px] text-slate-500 dark:text-zinc-400">
                                            Pilih minimal 1 role
                                        </span>
                                    </div>

                                    <div className="mt-4 space-y-3">
                                        <div className="grid gap-3 sm:grid-cols-2">
                                            {roles.map((role) => {
                                                const isChecked = selectedRoleIds.includes(role.id);
                                                return (
                                                    <div
                                                        key={role.id}
                                                        onClick={() => toggleRole(role.id)}
                                                        className={`flex cursor-pointer flex-col justify-between rounded-xl border p-3.5 transition-all ${
                                                            isChecked
                                                                ? 'border-blue-500/50 bg-blue-50/50 dark:border-blue-500/30 dark:bg-blue-950/20'
                                                                : 'border-slate-200/80 bg-white hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#16181d]'
                                                        }`}
                                                    >
                                                        <div className="flex items-start justify-between gap-2">
                                                            <div>
                                                                <div className="flex items-center gap-1.5">
                                                                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                                                                        {role.name}
                                                                    </p>
                                                                    <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[9.5px] font-semibold text-slate-600 dark:bg-white/[0.06] dark:text-zinc-400">
                                                                        {role.slug}
                                                                    </span>
                                                                </div>
                                                                {role.description && (
                                                                    <p className="mt-1 text-[11px] text-slate-500 dark:text-zinc-400">
                                                                        {role.description}
                                                                    </p>
                                                                )}
                                                            </div>
                                                            <input
                                                                type="checkbox"
                                                                checked={isChecked}
                                                                onChange={() => {}} // controlled via card click
                                                                className="size-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-white/10 dark:bg-zinc-800"
                                                            />
                                                        </div>

                                                        {role.permissions && role.permissions.length > 0 && (
                                                            <div className="mt-2.5 flex flex-wrap gap-1 border-t border-slate-100 pt-2 dark:border-white/[0.04]">
                                                                {role.permissions.slice(0, 4).map((p) => (
                                                                    <span
                                                                        key={p.id}
                                                                        className="rounded bg-slate-100 px-1 py-0.5 text-[9px] font-medium text-slate-600 dark:bg-white/[0.06] dark:text-zinc-400"
                                                                    >
                                                                        {p.name}
                                                                    </span>
                                                                ))}
                                                                {role.permissions.length > 4 && (
                                                                    <span className="rounded bg-slate-100 px-1 py-0.5 text-[9px] font-medium text-slate-500 dark:bg-white/[0.06] dark:text-zinc-400">
                                                                        +{role.permissions.length - 4} lainnya
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <InputError message={errors.role_ids} />
                                    </div>
                                </section>

                                {/* Action Buttons Footer */}
                                <div className="flex flex-col-reverse items-center justify-between gap-3 border-t border-slate-200/60 pt-5 sm:flex-row dark:border-white/[0.06]">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        asChild
                                        className="h-9 w-full rounded-lg border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 sm:w-auto dark:border-white/10 dark:bg-[#16181d] dark:text-zinc-300"
                                    >
                                        <Link href={userRoutes.show.url(staff.id)}>Batal</Link>
                                    </Button>

                                    <div className="flex w-full items-center justify-end gap-2 sm:w-auto">
                                        <Button
                                            type="submit"
                                            disabled={processing || selectedRoleIds.length === 0}
                                            className="h-9 w-full rounded-lg bg-blue-600 px-5 text-xs font-semibold text-white shadow-2xs hover:bg-blue-700 disabled:opacity-50 sm:w-auto"
                                        >
                                            {processing ? (
                                                <>
                                                    <Spinner className="mr-1.5 size-3.5" />
                                                    Menyimpan Perubahan...
                                                </>
                                            ) : (
                                                <>
                                                    <UserCheck className="mr-1.5 size-3.5" />
                                                    Simpan Perubahan Profil
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </>
                        )}
                    </Form>
                </main>
            </div>
        </>
    );
}
