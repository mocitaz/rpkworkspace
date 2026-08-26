import { Form, Head, Link, router } from '@inertiajs/react';
import { Can } from '@/components/can';
import {
    AlertTriangle,
    Award,
    Banknote,
    Briefcase,
    Building2,
    Calendar,
    Check,
    CheckCheck,
    CheckCircle2,
    ChevronDown,
    ChevronRight,
    ChevronUp,
    Contact,
    Copy,
    CreditCard,
    ExternalLink,
    FileText,
    GraduationCap,
    KeyRound,
    Layers,
    Mail,
    MapPin,
    MessageSquare,
    Pencil,
    Phone,
    RotateCcw,
    Scale,
    Search,
    Shield,
    ShieldAlert,
    ShieldCheck,
    Smartphone,
    Sparkles,
    Trash2,
    User as UserIcon,
    UserCheck,
    UserPlus,
    Users,
} from 'lucide-react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import { Pagination } from '@/components/pagination';
import { StatusBadge } from '@/components/status-badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useInitials } from '@/hooks/use-initials';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import * as roleRoutes from '@/routes/admin/roles';
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
    position_title?: string;
    employee_code?: string;
    department?: string;
    employment_type?: string;
    employment_status?: string;
    work_mode?: string;
    joined_at?: string;
    contract_end?: string;
    leave_balance?: number;
    utilization?: number;
    performance_score?: number;
    next_review?: string;
    avatar_url?: string | null;
    is_active: boolean;
    created_at?: string;
    phone?: string | null;
    address?: string | null;
    ktp_address?: string | null;
    birth_date?: string | null;
    advocate_license_no?: string | null;
    bas_number?: string | null;
    bas_date?: string | null;
    kta_expiry_date?: string | null;
    practice_areas?: string | null;
    education?: string | null;
    hourly_rate?: number | string | null;
    bank_name?: string | null;
    bank_account_number?: string | null;
    bank_account_holder?: string | null;
    npwp?: string | null;
    matter_capacity_limit?: number | null;
    supervisor_name?: string | null;
    roles: Role[];
};
type Page = {
    data: User[];
    links: { url: string | null; label: string; active: boolean }[];
    total: number;
};

export default function UsersIndex({
    users,
    roles,
    permissions,
    metrics,
    filters,
}: {
    users: Page;
    roles: Role[];
    permissions: Permission[];
    metrics: {
        total: number;
        active: number;
        roles_count: number;
        permissions_count: number;
    };
    filters: {
        search?: string;
        role_id?: string;
    };
}) {
    const getInitials = useInitials();
    const [tab, setTab] = useState<'cards' | 'users' | 'roles'>('cards');
    const [editing, setEditing] = useState<User | null>(null);
    const [deleting, setDeleting] = useState<User | null>(null);
    const [inviteOpen, setInviteOpen] = useState(false);
    const [createdCreds, setCreatedCreds] = useState<{
        name: string;
        email: string;
        password: string;
    } | null>(null);
    const [copied, setCopied] = useState(false);

    return (
        <>
            <Head title="Manajemen Pengguna & Hak Akses" />

            <div className="min-h-screen bg-[#fafafc] pb-20 dark:bg-[#0c0d10]">
                <main className="mx-auto max-w-7xl space-y-4 px-4 py-4 sm:px-6 lg:px-8">
                    {/* 1. Header Navigation & Action Bar */}
                    <div className="flex flex-col justify-between gap-4 border-b border-slate-200/60 pb-5 sm:flex-row sm:items-center dark:border-white/[0.06]">
                        <div className="space-y-1">
                            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                                Personel &amp; Hak Akses
                            </h1>
                            <p className="text-xs text-slate-500 dark:text-zinc-400">
                                Direktori staf firma, kartu identitas pegawai
                                digital, dan matriks hak akses perizinan.
                            </p>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex shrink-0 items-center gap-2">
                            <Can permission="admin.users.manage">
                                <Button
                                    size="sm"
                                    asChild
                                    className="h-7.5 rounded-lg bg-slate-900 px-3 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 active:scale-95 dark:bg-white dark:text-slate-900 dark:hover:bg-zinc-200"
                                >
                                    <Link href={userRoutes.create?.url ? userRoutes.create.url() : '/admin/users/create'}>
                                        <UserPlus className="mr-1.5 size-3.5" />
                                        Tambah Staf Baru
                                    </Link>
                                </Button>
                            </Can>
                        </div>
                    </div>

                    {/* 2. Top 4 Compact Bento KPI Cards */}
                    <section className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
                        {/* 1. Total Pengguna */}
                        <div className="group rounded-xl border border-slate-200/70 bg-white p-3 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[10px] font-bold tracking-wider uppercase">
                                    TOTAL PERSONEL
                                </span>
                                <Users className="size-3.5 text-slate-700 dark:text-zinc-300" />
                            </div>
                            <div className="mt-1.5 flex items-baseline gap-1.5">
                                <span className="font-mono text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    {metrics.total}
                                </span>
                                <span className="text-[10.5px] text-slate-500 dark:text-zinc-400">
                                    anggota tim
                                </span>
                            </div>
                            <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-1.5 text-[10px] text-slate-500 dark:border-white/[0.04]">
                                <span>Terdaftar Resmi</span>
                                <span className="font-semibold text-slate-800 dark:text-zinc-200">
                                    Firma Hukum
                                </span>
                            </div>
                        </div>

                        {/* 2. Pengguna Aktif */}
                        <div className="group rounded-xl border border-slate-200/70 bg-white p-3 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[10px] font-bold tracking-wider uppercase">
                                    PERSONEL AKTIF
                                </span>
                                <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div className="mt-1.5 flex items-baseline gap-1.5">
                                <span className="font-mono text-xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                                    {metrics.active}
                                </span>
                                <span className="text-[10.5px] text-slate-500 dark:text-zinc-400">
                                    aktif login
                                </span>
                            </div>
                            <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-1.5 text-[10px] text-slate-500 dark:border-white/[0.04]">
                                <span>Status Operasional</span>
                                <span className="font-semibold text-emerald-600">
                                    Aktif
                                </span>
                            </div>
                        </div>

                        {/* 3. Struktur Role */}
                        <div className="group rounded-xl border border-slate-200/70 bg-white p-3 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[10px] font-bold tracking-wider uppercase">
                                    STRUKTUR ROLE
                                </span>
                                <ShieldCheck className="size-3.5 text-slate-700 dark:text-zinc-300" />
                            </div>
                            <div className="mt-1.5 flex items-baseline gap-1.5">
                                <span className="font-mono text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    {metrics.roles_count}
                                </span>
                                <span className="text-[10.5px] text-slate-500 dark:text-zinc-400">
                                    tingkat akses
                                </span>
                            </div>
                            <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-1.5 text-[10px] text-slate-500 dark:border-white/[0.04]">
                                <span>Hirarki Posisi</span>
                                <span className="font-semibold text-slate-800 dark:text-zinc-200">
                                    Partner &amp; Staf
                                </span>
                            </div>
                        </div>

                        {/* 4. Hak Akses Terdefinisi */}
                        <div className="group rounded-xl border border-slate-200/70 bg-white p-3 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[10px] font-bold tracking-wider uppercase">
                                    MATRIKS PERMISSION
                                </span>
                                <KeyRound className="size-3.5 text-slate-700 dark:text-zinc-300" />
                            </div>
                            <div className="mt-1.5 flex items-baseline gap-1.5">
                                <span className="font-mono text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    {metrics.permissions_count}
                                </span>
                                <span className="text-[10.5px] text-slate-500 dark:text-zinc-400">
                                    izin sistem
                                </span>
                            </div>
                            <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-1.5 text-[10px] text-slate-500 dark:border-white/[0.04]">
                                <span>Hak Akses Fitur</span>
                                <span className="font-semibold text-slate-800 dark:text-zinc-200">
                                    Granular
                                </span>
                            </div>
                        </div>
                    </section>

                    {/* 3. Segmented View Switcher (Horizontal Swipeable on Mobile) */}
                    <div className="flex items-center gap-1.5 overflow-x-auto border-b border-slate-200/60 pb-2 [scrollbar-width:none] [-ms-overflow-style:none] dark:border-white/[0.06] [&::-webkit-scrollbar]:hidden">
                        <button
                            type="button"
                            onClick={() => setTab('cards')}
                            className={`flex h-7.5 shrink-0 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold whitespace-nowrap transition-all ${
                                tab === 'cards'
                                    ? 'bg-slate-900 text-white shadow-2xs dark:bg-white dark:text-slate-900'
                                    : 'border border-slate-200/70 bg-white text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-[#14161b] dark:text-zinc-300'
                            }`}
                        >
                            <Contact className="size-3.5" />
                            Kartu Pegawai ({users.total})
                        </button>
                        <button
                            type="button"
                            onClick={() => setTab('users')}
                            className={`flex h-7.5 shrink-0 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold whitespace-nowrap transition-all ${
                                tab === 'users'
                                    ? 'bg-slate-900 text-white shadow-2xs dark:bg-white dark:text-slate-900'
                                    : 'border border-slate-200/70 bg-white text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:bg-[#14161b] dark:text-zinc-300'
                            }`}
                        >
                            <Users className="size-3.5" />
                            Tabel Pengguna ({users.total})
                        </button>
                        <button
                            type="button"
                            onClick={() => setTab('roles')}
                            className={`flex h-7.5 shrink-0 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold whitespace-nowrap transition-all ${
                                tab === 'roles'
                                    ? 'bg-slate-900 text-white shadow-2xs dark:bg-white dark:text-slate-900'
                                    : 'border border-slate-200/70 bg-white text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-[#14161b] dark:text-zinc-300'
                            }`}
                        >
                            <KeyRound className="size-3.5" />
                            Role &amp; Matriks Permission ({roles.length})
                        </button>
                    </div>

                    {tab === 'cards' || tab === 'users' ? (
                        <>
                            {/* Search & Filter Bar */}
                            <Form
                                {...(userRoutes.index?.form ? userRoutes.index.form() : { action: '/admin/users', method: 'get' as const })}
                                className="space-y-2 rounded-xl border border-slate-200/60 bg-slate-50/50 p-2 dark:border-white/[0.04] dark:bg-[#121418]"
                            >
                                {/* Row 1: Search, Reset, Count */}
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                    <div className="relative flex-1">
                                        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-slate-400" />
                                        <Input
                                            name="search"
                                            defaultValue={filters.search}
                                            placeholder="Cari nama, NIP, email, jabatan, atau departemen..."
                                            className="h-7.5 w-full rounded-lg border-slate-200 bg-white pl-8 text-xs text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:ring-0 dark:border-white/10 dark:bg-zinc-800 dark:text-white"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {(filters.search || filters.role_id) && (
                                            <Button
                                                asChild
                                                variant="outline"
                                                size="sm"
                                                className="h-7.5 shrink-0 rounded-lg border-slate-200 bg-white px-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-300"
                                                title="Reset Semua Filter"
                                            >
                                                <Link href={userRoutes.index?.url ? userRoutes.index.url() : '/admin/users'}>
                                                    <RotateCcw className="size-3.5 text-slate-400" />
                                                </Link>
                                            </Button>
                                        )}
                                        <span className="shrink-0 rounded-md border border-slate-200/70 bg-white px-2.5 py-0.5 font-mono text-[10.5px] font-semibold text-slate-700 shadow-2xs dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-300">
                                            {users.total} personel
                                        </span>
                                    </div>
                                </div>

                                {/* Row 2: Select Role, Submit button */}
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                    <div className="relative w-full flex-1 sm:max-w-xs">
                                        <select
                                            name="role_id"
                                            defaultValue={filters.role_id ?? ''}
                                            className="h-7.5 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white pr-7 pl-2.5 text-xs text-slate-900 outline-none hover:bg-slate-50 focus:border-slate-400 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200"
                                        >
                                            <option value="">
                                                Semua Role / Kewenangan
                                            </option>
                                            {roles.map((r) => (
                                                <option key={r.id} value={r.id}>
                                                    {r.name}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="pointer-events-none absolute top-1/2 right-2 size-3.5 -translate-y-1/2 text-slate-400" />
                                    </div>

                                    <Button
                                        type="submit"
                                        size="sm"
                                        className="h-7.5 w-full shrink-0 rounded-lg bg-slate-900 px-3.5 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 sm:w-auto dark:bg-white dark:text-slate-900"
                                    >
                                        Terapkan Filter
                                    </Button>
                                </div>
                            </Form>

                            {/* TAB 1: KARTU PEGAWAI / STAFF DIRECTORY CARDS */}
                            {tab === 'cards' && (
                                <div>
                                    {users.data.length > 0 ? (
                                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                            {users.data.map((user) => (
                                                <StaffCard
                                                    key={user.id}
                                                    user={user}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200/70 bg-white px-4 py-12 text-center shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                            <div className="flex size-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-white/[0.06] dark:text-zinc-400">
                                                <Contact className="size-5" />
                                            </div>
                                            <p className="mt-3 text-xs font-bold text-slate-800 dark:text-zinc-200">
                                                Tidak Ada Data Personel
                                            </p>
                                            <p className="mt-1 max-w-xs text-[11px] text-slate-400 dark:text-zinc-500">
                                                {filters.search ||
                                                filters.role_id
                                                    ? 'Sesuaikan kata kunci pencarian atau filter role Anda.'
                                                    : 'Belum ada anggota staf yang terdaftar di workspace firma.'}
                                            </p>
                                            {!filters.search &&
                                                !filters.role_id && (
                                                    <Button
                                                        size="sm"
                                                        asChild
                                                        className="mt-3.5 h-7.5 rounded-lg bg-slate-900 px-3 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 dark:bg-white dark:text-slate-900"
                                                    >
                                                        <Link href={userRoutes.create?.url ? userRoutes.create.url() : '/admin/users/create'}>
                                                            <UserPlus className="mr-1 size-3" />{' '}
                                                            Tambah Staf Baru
                                                        </Link>
                                                    </Button>
                                                )}
                                        </div>
                                    )}

                                    {/* Pagination Footer */}
                                    <div className="mt-3 flex flex-col justify-between gap-2 rounded-xl border border-slate-200/70 bg-white px-3.5 py-2.5 shadow-2xs sm:flex-row sm:items-center dark:border-white/[0.06] dark:bg-[#14161b]">
                                        <span className="text-[11px] text-slate-500 dark:text-zinc-400">
                                            Menampilkan{' '}
                                            <span className="font-semibold text-slate-900 dark:text-white">
                                                {users.data.length}
                                            </span>{' '}
                                            dari{' '}
                                            <span className="font-semibold text-slate-900 dark:text-white">
                                                {users.total}
                                            </span>{' '}
                                            personel
                                        </span>
                                        <Pagination links={users.links} />
                                    </div>
                                </div>
                            )}

                            {/* TAB 2: TABEL PENGGUNA */}
                            {tab === 'users' && (
                                <div className="overflow-hidden rounded-xl border border-slate-200/70 bg-white shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-xs">
                                            <thead>
                                                <tr className="border-b border-slate-100 bg-slate-50/60 text-[10px] font-semibold text-slate-500 uppercase dark:border-white/[0.04] dark:bg-[#121418]">
                                                    <th className="py-2.5 pr-3 pl-4">
                                                        Pengguna / Identitas
                                                    </th>
                                                    <th className="px-3 py-2.5">
                                                        Departemen &amp; NIP
                                                    </th>
                                                    <th className="px-3 py-2.5">
                                                        Role Kewenangan
                                                    </th>
                                                    <th className="px-3 py-2.5 text-center">
                                                        Status
                                                    </th>
                                                    <th className="py-2.5 pr-4 pl-3 text-right">
                                                        Aksi
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                                                {users.data.map((user) => (
                                                    <tr
                                                        key={user.id}
                                                        className="group transition-colors hover:bg-slate-50/50 dark:hover:bg-white/[0.02]"
                                                    >
                                                        {/* Avatar & User Info */}
                                                        <td className="py-2.5 pr-3 pl-4">
                                                            <div className="flex items-center gap-2.5">
                                                                <Avatar className="size-8.5 shrink-0 rounded-lg border border-slate-200 shadow-2xs dark:border-white/10">
                                                                    <AvatarImage
                                                                        src={
                                                                            user.avatar_url ??
                                                                            undefined
                                                                        }
                                                                        className="object-cover"
                                                                    />
                                                                    <AvatarFallback className="rounded-lg bg-slate-100 text-[11px] font-bold text-slate-800 dark:bg-zinc-800 dark:text-zinc-200">
                                                                        {getInitials(
                                                                            user.name,
                                                                        )}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <div className="min-w-0">
                                                                    <Link
                                                                        href={userRoutes.show?.url ? userRoutes.show.url(
                                                                            user.id,
                                                                        ) : `/admin/users/${user.id}`}
                                                                        className="text-left font-semibold text-slate-900 transition-colors hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
                                                                    >
                                                                        {
                                                                            user.name
                                                                        }
                                                                    </Link>
                                                                    <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                                                                        {
                                                                            user.email
                                                                        }
                                                                        {user.position_title
                                                                            ? ` · ${user.position_title}`
                                                                            : ''}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        {/* Department & NIP */}
                                                        <td className="px-3 py-2.5 whitespace-nowrap">
                                                            <div className="space-y-0.5">
                                                                <span className="font-mono text-[10.5px] font-semibold text-slate-700 dark:text-zinc-300">
                                                                    {user.employee_code ||
                                                                        `RPK-${user.id.toString().padStart(3, '0')}`}
                                                                </span>
                                                                <p className="text-[10.5px] text-slate-500 dark:text-zinc-400">
                                                                    {user.department ||
                                                                        '-'}
                                                                </p>
                                                            </div>
                                                        </td>

                                                        {/* Roles */}
                                                        <td className="px-3 py-2.5 whitespace-nowrap">
                                                            <div className="flex flex-wrap gap-1">
                                                                {user.roles
                                                                    .length >
                                                                0 ? (
                                                                    user.roles.map(
                                                                        (r) => (
                                                                            <span
                                                                                key={
                                                                                    r.id
                                                                                }
                                                                                className="rounded border border-slate-200/60 bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-semibold text-slate-700 dark:border-white/5 dark:bg-zinc-800 dark:text-zinc-300"
                                                                            >
                                                                                {
                                                                                    r.name
                                                                                }
                                                                            </span>
                                                                        ),
                                                                    )
                                                                ) : (
                                                                    <span className="text-slate-400 dark:text-zinc-500">
                                                                        Tanpa
                                                                        Role
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>

                                                        {/* Status */}
                                                        <td className="px-3 py-2.5 text-center whitespace-nowrap">
                                                            <StatusBadge
                                                                value={
                                                                    user.is_active
                                                                        ? 'active'
                                                                        : 'inactive'
                                                                }
                                                            />
                                                        </td>

                                                        {/* Actions */}
                                                        <td className="py-2.5 pr-4 pl-3 text-right whitespace-nowrap">
                                                            <div className="flex items-center justify-end gap-1.5">
                                                                <Button
                                                                    asChild
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="h-7 rounded-lg border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200"
                                                                    title="Lihat Profil Staf & CV"
                                                                >
                                                                    <Link
                                                                        href={userRoutes.show?.url ? userRoutes.show.url(
                                                                            user.id,
                                                                        ) : `/admin/users/${user.id}`}
                                                                    >
                                                                        <UserIcon className="mr-1 size-3" />
                                                                        Profil
                                                                    </Link>
                                                                </Button>
                                                                <Can permission="admin.users.manage">
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        asChild
                                                                        className="h-7 rounded-lg border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200"
                                                                        title="Edit Profil & Hak Akses"
                                                                    >
                                                                        <Link
                                                                            href={userRoutes.edit?.url ? userRoutes.edit.url(user.id) : `/admin/users/${user.id}/edit`}
                                                                        >
                                                                            <Pencil className="mr-1 size-3 text-slate-400" />
                                                                            Edit
                                                                        </Link>
                                                                    </Button>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() =>
                                                                            setDeleting(
                                                                                user,
                                                                            )
                                                                        }
                                                                        className="h-7 rounded-lg border-slate-200 bg-white px-2 text-xs font-semibold text-rose-600 shadow-2xs hover:border-rose-200 hover:bg-rose-50 dark:border-white/10 dark:bg-zinc-800 dark:text-rose-400 dark:hover:bg-rose-950/30"
                                                                        title="Hapus Pengguna"
                                                                    >
                                                                        <Trash2 className="size-3" />
                                                                    </Button>
                                                                </Can>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="flex flex-col justify-between gap-2.5 border-t border-slate-100 bg-slate-50/60 px-4 py-2.5 sm:flex-row sm:items-center dark:border-white/[0.04] dark:bg-[#121418]">
                                        <span className="text-[11px] text-slate-500 dark:text-zinc-400">
                                            Menampilkan{' '}
                                            <span className="font-semibold text-slate-900 dark:text-white">
                                                {users.data.length}
                                            </span>{' '}
                                            dari{' '}
                                            <span className="font-semibold text-slate-900 dark:text-white">
                                                {users.total}
                                            </span>{' '}
                                            pengguna
                                        </span>
                                        <Pagination links={users.links} />
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <RolePermissions
                            roles={roles}
                            permissions={permissions}
                        />
                    )}
                </main>
            </div>

            {/* Modal: Tambah / Undang Pengguna Baru */}
            <InviteUserDialog
                open={inviteOpen}
                roles={roles}
                onOpenChange={setInviteOpen}
                onCreated={(creds) => setCreatedCreds(creds)}
            />

            {/* Modal: Kredensial Pengguna yang Baru Dibuat */}
            <Dialog
                open={!!createdCreds}
                onOpenChange={(open) => !open && setCreatedCreds(null)}
            >
                <DialogContent className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xl sm:max-w-md dark:border-white/10 dark:bg-[#14161b]">
                    <DialogHeader className="border-b border-slate-100 pb-3 dark:border-white/[0.06]">
                        <div className="flex items-center gap-3">
                            <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                                <CheckCircle2 className="size-5" />
                            </div>
                            <div>
                                <DialogTitle className="text-sm font-bold text-slate-900 dark:text-white">
                                    Akun Staf Berhasil Dibuat!
                                </DialogTitle>
                                <DialogDescription className="text-xs text-slate-500">
                                    Kredensial login untuk anggota tim baru
                                    telah aktif.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    {createdCreds && (
                        <div className="space-y-3.5 pt-2 text-xs">
                            <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50/70 p-3 dark:border-white/10 dark:bg-[#121418]">
                                <div className="flex items-center justify-between border-b border-slate-200/60 pb-2 dark:border-white/5">
                                    <span className="text-slate-500">
                                        Nama Pengguna
                                    </span>
                                    <span className="font-bold text-slate-900 dark:text-white">
                                        {createdCreds.name}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between border-b border-slate-200/60 pb-2 dark:border-white/5">
                                    <span className="text-slate-500">
                                        Email Login
                                    </span>
                                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                                        {createdCreds.email}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between border-b border-slate-200/60 pb-2 dark:border-white/5">
                                    <span className="text-slate-500">
                                        Password
                                    </span>
                                    <span className="rounded border border-slate-200 bg-white px-2 py-0.5 font-mono font-bold text-slate-900 shadow-2xs dark:border-white/10 dark:bg-zinc-800 dark:text-white">
                                        {createdCreds.password}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500">
                                        Portal Login
                                    </span>
                                    <span className="text-[11px] font-medium text-slate-700 dark:text-zinc-300">
                                        {typeof window !== 'undefined'
                                            ? `${window.location.origin}/login`
                                            : 'https://app.rpklawoffice.com/login'}
                                    </span>
                                </div>
                            </div>

                            <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                                Berikan rincian akun di atas kepada anggota tim
                                agar dapat langsung masuk ke sistem.
                            </p>

                            <div className="flex items-center gap-2 pt-1">
                                <Button
                                    type="button"
                                    onClick={() => {
                                        const origin =
                                            typeof window !== 'undefined'
                                                ? window.location.origin
                                                : 'https://app.rpklawoffice.com';
                                        const text = `Halo ${createdCreds.name},\nAkun RPK Law Firm Workspace Anda telah aktif:\n\n• Email: ${createdCreds.email}\n• Password: ${createdCreds.password}\n• Tautan Login: ${origin}/login\n\nSilakan login dan ganti password Anda jika diperlukan.`;
                                        navigator.clipboard.writeText(text);
                                        setCopied(true);
                                        setTimeout(
                                            () => setCopied(false),
                                            2500,
                                        );
                                    }}
                                    className="h-8.5 flex-1 rounded-lg bg-slate-900 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 active:scale-95 dark:bg-white dark:text-slate-900"
                                >
                                    {copied ? (
                                        <>
                                            <Check className="mr-1.5 size-3.5" />
                                            Tersalin ke Clipboard!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="mr-1.5 size-3.5" />
                                            Salin Rincian Login
                                        </>
                                    )}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setCreatedCreds(null)}
                                    className="h-8.5 rounded-lg border-slate-200 px-4 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                                >
                                    Tutup
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Modal: Edit User */}
            <EditUserDialog
                user={editing}
                roles={roles}
                onOpenChange={(open) => !open && setEditing(null)}
                onDeleteClick={(user) => {
                    setEditing(null);
                    setDeleting(user);
                }}
            />

            {/* Modal: Hapus User */}
            <DeleteUserDialog
                user={deleting}
                onOpenChange={(open) => !open && setDeleting(null)}
            />
        </>
    );
}

function StaffCard({
    user,
}: {
    user: User;
}) {
    const getInitials = useInitials();
    const [copied, setCopied] = useState(false);
    const displayId =
        user.employee_code || `RPK-${user.id.toString().padStart(3, '0')}`;

    const handleCopyEmail = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(user.email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleOpenChat = (e: React.MouseEvent) => {
        e.stopPropagation();
        window.dispatchEvent(
            new CustomEvent('open-floating-chat', {
                detail: {
                    userId: user.id,
                    name: user.name,
                    email: user.email,
                    avatar_url: user.avatar_url,
                    title: user.position_title,
                },
            }),
        );
    };

    return (
        <div
            onClick={() => router.visit(userRoutes.show?.url ? userRoutes.show.url(user.id) : `/admin/users/${user.id}`)}
            className="group relative flex cursor-pointer flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:border-white/[0.06] dark:bg-[#14161b] dark:hover:border-white/[0.12] dark:hover:shadow-none"
        >
            <div className="space-y-3">
                {/* Header: Employee ID & Status */}
                <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[11px] font-medium text-slate-500 dark:text-zinc-400">
                        {displayId}
                    </span>

                    <span
                        className={`inline-flex items-center gap-1.5 text-[11px] font-medium ${
                            user.is_active
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-slate-400 dark:text-zinc-500'
                        }`}
                    >
                        <span
                            className={`size-1.5 rounded-full ${
                                user.is_active
                                    ? 'bg-emerald-500'
                                    : 'bg-slate-400 dark:bg-zinc-600'
                            }`}
                        />
                        <span>{user.is_active ? 'Aktif' : 'Nonaktif'}</span>
                    </span>
                </div>

                {/* Profile Identity: Clean Circular Avatar & Info */}
                <div className="flex items-center gap-3">
                    <Avatar className="size-11 shrink-0 rounded-full border border-slate-200/80 shadow-2xs dark:border-white/10 dark:bg-zinc-800">
                        <AvatarImage
                            src={user.avatar_url ?? undefined}
                            className="rounded-full object-cover"
                        />
                        <AvatarFallback className="rounded-full bg-slate-900 text-xs font-bold text-white dark:bg-zinc-800 dark:text-zinc-200">
                            {getInitials(user.name)}
                        </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1 space-y-0.5">
                        <h4 className="truncate text-xs font-bold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                            {user.name}
                        </h4>
                        <p className="truncate text-[11px] font-medium text-slate-600 dark:text-zinc-300">
                            {user.position_title || 'Staf Kantor Hukum'}
                        </p>
                        <div className="flex items-center gap-1.5 truncate text-[10.5px] text-slate-400 dark:text-zinc-500">
                            {user.department && (
                                <span className="truncate">{user.department}</span>
                            )}
                            {user.department && user.practice_areas && <span>·</span>}
                            {user.practice_areas && (
                                <span className="truncate">{user.practice_areas}</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Email Pill with Copy Action */}
                <div
                    onClick={handleCopyEmail}
                    title="Klik untuk menyalin email"
                    className="flex items-center justify-between gap-2 rounded-lg border border-slate-100 bg-slate-50/70 px-2.5 py-1.5 text-[11px] text-slate-600 transition-colors hover:border-slate-200 hover:bg-slate-100/70 dark:border-white/[0.04] dark:bg-white/[0.02] dark:text-zinc-300 dark:hover:border-white/[0.08] dark:hover:bg-white/[0.05]"
                >
                    <div className="flex items-center gap-2 truncate">
                        <Mail className="size-3.5 shrink-0 text-slate-400 dark:text-zinc-500" />
                        <span className="truncate font-mono text-[10.5px] text-slate-600 dark:text-zinc-300">
                            {user.email}
                        </span>
                    </div>
                    <span className="flex shrink-0 items-center text-[10px] text-slate-400 dark:text-zinc-500">
                        {copied ? (
                            <span className="flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
                                <Check className="size-3" />
                                Disalin
                            </span>
                        ) : (
                            <Copy className="size-3 opacity-60 transition-opacity hover:opacity-100" />
                        )}
                    </span>
                </div>
            </div>

            {/* Footer Action Bar */}
            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5 dark:border-white/[0.04]">
                <Link
                    href={userRoutes.show?.url ? userRoutes.show.url(user.id) : `/admin/users/${user.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1 text-[11px] font-semibold text-slate-700 transition-colors group-hover:text-blue-600 dark:text-zinc-300 dark:group-hover:text-blue-400"
                >
                    <span>Lihat Profil &amp; CV</span>
                    <ChevronRight className="size-3 transition-transform duration-150 group-hover:translate-x-0.5" />
                </Link>

                <div className="flex items-center gap-1">
                    {user.phone && (
                        <a
                            href={`https://wa.me/${user.phone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            title={`Chat WhatsApp: ${user.phone}`}
                            className="flex size-7 items-center justify-center rounded-lg text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/40"
                        >
                            <Smartphone className="size-3.5" />
                        </a>
                    )}
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleOpenChat}
                        title="Kirim pesan langsung"
                        className="size-7 rounded-lg p-0 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:text-zinc-500 dark:hover:bg-white/[0.06] dark:hover:text-zinc-200"
                    >
                        <MessageSquare className="size-3.5" />
                    </Button>
                    <Can permission="admin.users.manage">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            asChild
                            className="h-7 rounded-lg px-2 text-[11px] font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-zinc-400 dark:hover:bg-white/[0.06] dark:hover:text-white"
                        >
                            <Link
                                href={userRoutes.edit?.url ? userRoutes.edit.url(user.id) : `/admin/users/${user.id}/edit`}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Pencil className="mr-1 size-3" />
                                Edit
                            </Link>
                        </Button>
                    </Can>
                </div>
            </div>
        </div>
    );
}

function EditUserDialog({
    user,
    roles,
    onOpenChange,
    onDeleteClick,
}: {
    user: User | null;
    roles: Role[];
    onOpenChange: (open: boolean) => void;
    onDeleteClick?: (user: User) => void;
}) {
    const getInitials = useInitials();
    const [activeTab, setActiveTab] = useState<
        'account' | 'advocate' | 'contact' | 'billing'
    >('account');

    if (!user) return null;

    const assignedRoleIds = new Set(user.roles.map((role) => role.id));

    return (
        <Dialog open={!!user} onOpenChange={onOpenChange}>
            <DialogContent className="flex max-h-[90vh] max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-0 gap-0 shadow-2xl dark:border-white/10 dark:bg-[#14161b]">
                {/* 1. Modal Cockpit Header */}
                <div className="shrink-0 border-b border-slate-100 bg-slate-50/70 px-6 pt-5 pb-3.5 pr-12 dark:border-white/[0.06] dark:bg-[#121418]">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="relative size-10 shrink-0 rounded-full bg-linear-to-b from-slate-200 via-slate-100 to-slate-300 p-0.5 shadow-xs dark:from-white/20 dark:via-white/5 dark:to-white/15">
                                <Avatar className="size-full rounded-full bg-slate-900 shadow-inner dark:bg-zinc-800">
                                    <AvatarImage
                                        src={user.avatar_url ?? undefined}
                                        className="rounded-full object-cover"
                                    />
                                    <AvatarFallback className="rounded-full bg-linear-to-br from-slate-900 via-slate-800 to-indigo-950 text-xs font-bold text-white">
                                        {getInitials(user.name)}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                            <div className="min-w-0">
                                <DialogTitle className="truncate text-base font-bold text-slate-900 dark:text-white">
                                    Kelola Staf: {user.name}
                                </DialogTitle>
                                <DialogDescription className="truncate text-xs text-slate-500 dark:text-zinc-400">
                                    {user.email}
                                    {user.position_title
                                        ? ` · ${user.position_title}`
                                        : ''}
                                </DialogDescription>
                            </div>
                        </div>

                        <span className="hidden shrink-0 items-center rounded-lg border border-slate-200/80 bg-white px-2.5 py-1 font-mono text-[11px] font-bold text-slate-800 shadow-2xs sm:inline-flex dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200">
                            {user.employee_code ||
                                `RPK-${user.id.toString().padStart(3, '0')}`}
                        </span>
                    </div>

                    {/* 2. Segmented Navigation Tabs */}
                    <div className="mt-3.5 grid grid-cols-4 gap-1 rounded-xl border border-slate-200/70 bg-slate-200/50 p-1 dark:border-white/5 dark:bg-[#181a20]">
                        <button
                            type="button"
                            onClick={() => setActiveTab('account')}
                            className={`flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition-all ${
                                activeTab === 'account'
                                    ? 'bg-white text-slate-900 shadow-2xs dark:bg-[#22252c] dark:text-white'
                                    : 'text-slate-600 hover:bg-white/50 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white'
                            }`}
                        >
                            <UserCheck className="size-3.5 shrink-0" />
                            <span>Akun &amp; Peran</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('advocate')}
                            className={`flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition-all ${
                                activeTab === 'advocate'
                                    ? 'bg-white text-slate-900 shadow-2xs dark:bg-[#22252c] dark:text-white'
                                    : 'text-slate-600 hover:bg-white/50 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white'
                            }`}
                        >
                            <Scale className="size-3.5 shrink-0" />
                            <span>Kredensial</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('contact')}
                            className={`flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition-all ${
                                activeTab === 'contact'
                                    ? 'bg-white text-slate-900 shadow-2xs dark:bg-[#22252c] dark:text-white'
                                    : 'text-slate-600 hover:bg-white/50 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white'
                            }`}
                        >
                            <Phone className="size-3.5 shrink-0" />
                            <span>Kontak</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('billing')}
                            className={`flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition-all ${
                                activeTab === 'billing'
                                    ? 'bg-white text-slate-900 shadow-2xs dark:bg-[#22252c] dark:text-white'
                                    : 'text-slate-600 hover:bg-white/50 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white'
                            }`}
                        >
                            <CreditCard className="size-3.5 shrink-0" />
                            <span>Rekening</span>
                        </button>
                    </div>
                </div>

                {/* 3. Form Body */}
                <Form
                    {...(userRoutes.update?.form ? userRoutes.update.form(user.id) : { action: `/admin/users/${user.id}`, method: 'put' as const })}
                    className="flex min-h-0 flex-1 flex-col"
                    onSuccess={() => onOpenChange(false)}
                >
                    {({ errors, processing }) => (
                        <>
                            <div className="max-h-[60vh] overflow-y-auto px-6 py-4.5">
                                {/* TAB 1: AKUN & PERAN */}
                                {activeTab === 'account' && (
                                    <div className="space-y-3.5">
                                        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                                            <Field
                                                name="name"
                                                label="Nama Lengkap"
                                                defaultValue={user.name}
                                                required
                                            />
                                            <Field
                                                name="email"
                                                label="Alamat Email"
                                                type="email"
                                                defaultValue={user.email}
                                                required
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                                            <Field
                                                name="position_title"
                                                label="Jabatan / Posisi"
                                                defaultValue={
                                                    user.position_title ?? ''
                                                }
                                                placeholder="Contoh: Senior Associate / Partner"
                                            />
                                            <Field
                                                name="employee_code"
                                                label="Nomor NIP / ID Staf"
                                                defaultValue={
                                                    user.employee_code ?? ''
                                                }
                                                placeholder="Contoh: RPK-2026-001"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                                            <Field
                                                name="department"
                                                label="Departemen / Divisi"
                                                defaultValue={user.department ?? ''}
                                                placeholder="Litigasi & Arbitrase / Corporate"
                                            />
                                            <Field
                                                name="password"
                                                label="Ubah Password (Opsional)"
                                                type="password"
                                                placeholder="Kosongkan jika tidak ingin mengganti"
                                            />
                                        </div>

                                        {/* Role Selection Grid */}
                                        <div className="space-y-2 rounded-xl border border-slate-200/80 bg-slate-50/40 p-3.5 dark:border-white/[0.06] dark:bg-[#121418]">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-1.5">
                                                    <Shield className="size-3.5 text-purple-600 dark:text-purple-400" />
                                                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                                                        Hak Akses &amp; Role Sistem
                                                    </span>
                                                </div>
                                                <span className="text-[11px] font-medium text-slate-500 dark:text-zinc-400">
                                                    Pilih satu atau beberapa role
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 gap-2 pt-1 sm:grid-cols-2">
                                                {roles.map((role) => {
                                                    const isChecked =
                                                        assignedRoleIds.has(
                                                            role.id,
                                                        );
                                                    return (
                                                        <label
                                                            key={role.id}
                                                            className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200/80 bg-white p-2.5 shadow-2xs transition-all hover:border-slate-300 hover:bg-slate-50/80 dark:border-white/10 dark:bg-[#16181d] dark:hover:border-white/20"
                                                        >
                                                            <div className="flex items-center gap-2.5">
                                                                <input
                                                                    type="checkbox"
                                                                    name="role_ids[]"
                                                                    value={role.id}
                                                                    defaultChecked={
                                                                        isChecked
                                                                    }
                                                                    className="size-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 dark:border-white/20 dark:bg-zinc-800"
                                                                />
                                                                <span className="text-xs font-semibold text-slate-900 dark:text-white">
                                                                    {role.name}
                                                                </span>
                                                            </div>
                                                            <span className="font-mono text-[10px] font-medium text-slate-400 dark:text-zinc-500">
                                                                {role.slug}
                                                            </span>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                            <InputError message={errors.role_ids} />
                                        </div>

                                        {/* Status Card */}
                                        <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50/70 p-3 transition-colors hover:bg-slate-100/70 dark:border-white/10 dark:bg-[#16181d] dark:hover:bg-white/[0.04]">
                                            <div className="flex items-center gap-3">
                                                <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                                                    <UserCheck className="size-4" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                                                        Status Akun Aktif
                                                    </p>
                                                    <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                                                        Izinkan staf untuk login dan mengakses modul aplikasi
                                                    </p>
                                                </div>
                                            </div>
                                            <input
                                                type="checkbox"
                                                id="is_active"
                                                name="is_active"
                                                value="1"
                                                defaultChecked={user.is_active}
                                                className="size-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 dark:border-white/20 dark:bg-zinc-800"
                                            />
                                        </label>
                                    </div>
                                )}

                                {/* TAB 2: KREDENSIAL ADVOKAT */}
                                {activeTab === 'advocate' && (
                                    <div className="space-y-3.5">
                                        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                                            <Field
                                                name="advocate_license_no"
                                                label="Nomor Induk Advokat (NIA)"
                                                defaultValue={
                                                    user.advocate_license_no ?? ''
                                                }
                                                placeholder="Contoh: 18.01234/PERADI"
                                            />
                                            <Field
                                                name="kta_expiry_date"
                                                label="Masa Berlaku KTA Advokat"
                                                type="date"
                                                defaultValue={
                                                    user.kta_expiry_date
                                                        ? user.kta_expiry_date.split(
                                                              'T',
                                                           )[0]
                                                        : ''
                                                }
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                                            <Field
                                                name="bas_number"
                                                label="Nomor Berita Acara Sumpah (BAS)"
                                                defaultValue={user.bas_number ?? ''}
                                                placeholder="No. Surat Pengadilan Tinggi"
                                            />
                                            <Field
                                                name="bas_date"
                                                label="Tanggal Sumpah Advokat (BAS)"
                                                type="date"
                                                defaultValue={
                                                    user.bas_date
                                                        ? user.bas_date.split(
                                                              'T',
                                                           )[0]
                                                        : ''
                                                }
                                            />
                                        </div>

                                        <Field
                                            name="education"
                                            label="Gelar &amp; Riwayat Pendidikan"
                                            defaultValue={user.education ?? ''}
                                            placeholder="Contoh: S.H. (UI), LL.M. (Leiden)"
                                        />

                                        <TextareaField
                                            name="practice_areas"
                                            label="Bidang Keahlian / Spesialisasi Hukum (Practice Areas)"
                                            defaultValue={user.practice_areas ?? ''}
                                            placeholder="Contoh: Corporate M&A, Commercial Litigation, Dispute Resolution, IPR, Employment Law"
                                            rows={2}
                                            helperText="Pisahkan beberapa keahlian dengan koma"
                                        />
                                    </div>
                                )}

                                {/* TAB 3: KONTAK & DOMISILI */}
                                {activeTab === 'contact' && (
                                    <div className="space-y-3.5">
                                        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                                            <Field
                                                name="phone"
                                                label="Nomor WhatsApp / HP Resmi"
                                                defaultValue={user.phone ?? ''}
                                                placeholder="Contoh: 081234567890"
                                            />
                                            <Field
                                                name="birth_date"
                                                label="Tanggal Lahir"
                                                type="date"
                                                defaultValue={
                                                    user.birth_date
                                                        ? user.birth_date.split(
                                                              'T',
                                                           )[0]
                                                        : ''
                                                }
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                                            <TextareaField
                                                name="address"
                                                label="Alamat Domisili Saat Ini"
                                                defaultValue={user.address ?? ''}
                                                placeholder="Alamat tempat tinggal lengkap saat ini..."
                                                rows={3}
                                            />

                                            <TextareaField
                                                name="ktp_address"
                                                label="Alamat Sesuai KTP"
                                                defaultValue={
                                                    user.ktp_address ?? ''
                                                }
                                                placeholder="Alamat resmi yang tertera pada kartu identitas KTP..."
                                                rows={3}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* TAB 4: REKENING & PAJAK */}
                                {activeTab === 'billing' && (
                                    <div className="space-y-3.5">
                                        <Field
                                            name="npwp"
                                            label="Nomor Pokok Wajib Pajak (NPWP)"
                                            defaultValue={user.npwp ?? ''}
                                            placeholder="Contoh: 01.234.567.8-901.000"
                                        />

                                        {/* Bank Details Container */}
                                        <div className="space-y-2.5 rounded-xl border border-slate-200/80 bg-slate-50/40 p-3.5 dark:border-white/[0.06] dark:bg-[#121418]">
                                            <div className="flex items-center gap-1.5">
                                                <CreditCard className="size-3.5 text-slate-600 dark:text-zinc-400" />
                                                <span className="text-xs font-bold text-slate-900 dark:text-white">
                                                    Informasi Rekening Bank (Payroll &amp; Fee Sharing)
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                                <Field
                                                    name="bank_name"
                                                    label="Nama Bank"
                                                    defaultValue={
                                                        user.bank_name ?? ''
                                                    }
                                                    placeholder="BCA / Mandiri / BNI"
                                                />
                                                <Field
                                                    name="bank_account_number"
                                                    label="Nomor Rekening"
                                                    defaultValue={
                                                        user.bank_account_number ??
                                                        ''
                                                    }
                                                    placeholder="Contoh: 1234567890"
                                                />
                                                <Field
                                                    name="bank_account_holder"
                                                    label="Atas Nama Rekening"
                                                    defaultValue={
                                                        user.bank_account_holder ??
                                                        ''
                                                    }
                                                    placeholder="Nama Pemilik Rekening"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* 4. Modal Action Footer */}
                            <div className="flex shrink-0 items-center justify-between border-t border-slate-100 bg-slate-50/70 px-6 py-3.5 dark:border-white/[0.06] dark:bg-[#121418]">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        const target = user;
                                        onOpenChange(false);
                                        onDeleteClick?.(target);
                                    }}
                                    className="h-9 cursor-pointer rounded-xl px-3 text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-950/30"
                                >
                                    <Trash2 className="mr-1.5 size-3.5" />
                                    Hapus Akun
                                </Button>

                                <div className="flex items-center gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onOpenChange(false)}
                                        className="h-9 rounded-xl border-slate-200/80 px-4 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-100/80 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-300"
                                    >
                                        Batal
                                    </Button>
                                    <Button
                                        type="submit"
                                        size="sm"
                                        disabled={processing}
                                        className="h-9 cursor-pointer rounded-xl bg-slate-900 px-5 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 active:scale-95 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                                    >
                                        {processing
                                            ? 'Menyimpan...'
                                            : 'Simpan Perubahan'}
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}

function DeleteUserDialog({
    user,
    onOpenChange,
}: {
    user: User | null;
    onOpenChange: (open: boolean) => void;
}) {
    const getInitials = useInitials();
    if (!user) return null;

    return (
        <Dialog open={!!user} onOpenChange={onOpenChange}>
            <DialogContent className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xl sm:max-w-md dark:border-white/10 dark:bg-[#14161b]">
                <DialogHeader className="border-b border-slate-100 pb-3 dark:border-white/[0.06]">
                    <div className="flex items-center gap-2.5">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
                            <AlertTriangle className="size-4" />
                        </div>
                        <div>
                            <DialogTitle className="text-sm font-bold text-slate-900 dark:text-white">
                                Hapus Akun Pengguna
                            </DialogTitle>
                            <DialogDescription className="text-xs text-slate-500">
                                Konfirmasi penghapusan akses akun staf.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-2.5 rounded-xl border border-slate-200/70 bg-slate-50/60 p-2.5 dark:border-white/5 dark:bg-[#121418]">
                        <Avatar className="size-9 shrink-0 rounded-lg border border-slate-200 dark:border-white/10">
                            <AvatarImage
                                src={user.avatar_url ?? undefined}
                                className="object-cover"
                            />
                            <AvatarFallback className="rounded-lg bg-rose-50 text-xs font-bold text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                                {getInitials(user.name)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 dark:text-white">
                                {user.name}
                            </p>
                            <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                                {user.email}
                                {user.position_title
                                    ? ` · ${user.position_title}`
                                    : ''}
                            </p>
                        </div>
                    </div>

                    <p className="text-xs leading-relaxed text-slate-600 dark:text-zinc-400">
                        Apakah Anda yakin ingin menghapus akun{' '}
                        <strong>{user.name}</strong> ({user.email})? Jika
                        pengguna memiliki riwayat perkara atau data keuangan
                        terkait, status akun akan dinonaktifkan secara aman
                        untuk melindungi integritas berkas.
                    </p>

                    <Form
                        {...(userRoutes.destroy?.form ? userRoutes.destroy.form(user.id) : { action: `/admin/users/${user.id}`, method: 'delete' as const })}
                        onSuccess={() => onOpenChange(false)}
                        className="flex items-center justify-end gap-2 pt-2"
                    >
                        {({ processing }) => (
                            <>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onOpenChange(false)}
                                    className="h-8 rounded-lg border-slate-200 px-3.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    variant="destructive"
                                    size="sm"
                                    disabled={processing}
                                    className="h-8 rounded-lg bg-rose-600 px-4 text-xs font-semibold text-white shadow-2xs hover:bg-rose-700"
                                >
                                    {processing ? (
                                        <Spinner className="size-3.5" />
                                    ) : (
                                        <>
                                            <Trash2 className="mr-1.5 size-3.5" />
                                            Hapus Pengguna
                                        </>
                                    )}
                                </Button>
                            </>
                        )}
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function Field({
    name,
    label,
    type = 'text',
    placeholder,
    defaultValue,
    required = false,
    helperText,
}: {
    name: string;
    label: string;
    type?: string;
    placeholder?: string;
    defaultValue?: string | number;
    required?: boolean;
    helperText?: string;
}) {
    return (
        <div className="grid gap-1.5">
            <Label
                htmlFor={name}
                className="text-xs font-semibold text-slate-700 dark:text-zinc-200"
            >
                {label} {required && <span className="text-rose-500">*</span>}
            </Label>
            <Input
                id={name}
                name={name}
                type={type}
                placeholder={placeholder}
                defaultValue={
                    defaultValue !== null && defaultValue !== undefined
                        ? String(defaultValue)
                        : ''
                }
                required={required}
                className="h-9 rounded-xl border-slate-200/80 bg-slate-50/50 text-xs text-slate-900 shadow-2xs transition-colors focus:border-slate-400 focus:bg-white dark:border-white/10 dark:bg-[#16181d] dark:text-white dark:focus:bg-[#1a1d24]"
            />
            {helperText && (
                <p className="text-[11px] text-slate-400 dark:text-zinc-500">
                    {helperText}
                </p>
            )}
        </div>
    );
}

function TextareaField({
    name,
    label,
    placeholder,
    defaultValue,
    rows = 2,
    helperText,
}: {
    name: string;
    label: string;
    placeholder?: string;
    defaultValue?: string;
    rows?: number;
    helperText?: string;
}) {
    return (
        <div className="grid gap-1.5">
            <Label
                htmlFor={name}
                className="text-xs font-semibold text-slate-700 dark:text-zinc-200"
            >
                {label}
            </Label>
            <textarea
                id={name}
                name={name}
                rows={rows}
                placeholder={placeholder}
                defaultValue={defaultValue ?? ''}
                className="w-full resize-none rounded-xl border border-slate-200/80 bg-slate-50/50 p-2.5 text-xs text-slate-900 shadow-2xs transition-colors focus:border-slate-400 focus:bg-white focus:outline-none dark:border-white/10 dark:bg-[#16181d] dark:text-white dark:focus:bg-[#1a1d24]"
            />
            {helperText && (
                <p className="text-[11px] text-slate-400 dark:text-zinc-500">
                    {helperText}
                </p>
            )}
        </div>
    );
}

UsersIndex.layout = {
    breadcrumbs: [{ title: 'Pengguna & Akses', href: userRoutes.index?.url ? userRoutes.index.url() : '/admin/users' }],
};

const PERMISSION_GROUPS = [
    {
        id: 'matters',
        title: 'Manajemen Perkara (Matters)',
        subtitle:
            'Pendaftaran perkara, tim penasihat, jadwal sidang, pihak perkara, & arsip',
        icon: Briefcase,
        color: 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 border-blue-200/60 dark:border-blue-900/40',
        match: (name: string) => name.startsWith('matter.'),
    },
    {
        id: 'clients_contacts',
        title: 'Klien & Direktori Kontak',
        subtitle:
            'Data profil klien, dokumen kepatuhan KYC/AML, dan buku alamat perwakilan',
        icon: Users,
        color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400 border-indigo-200/60 dark:border-indigo-900/40',
        match: (name: string) =>
            name.startsWith('client.') || name.startsWith('contact.'),
    },
    {
        id: 'tasks',
        title: 'Manajemen Tugas (Tasks)',
        subtitle:
            'Pendelegasian tugas, pelacakan progress, & tenggat waktu pekerjaan staf',
        icon: CheckCircle2,
        color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-900/40',
        match: (name: string) => name.startsWith('task.'),
    },
    {
        id: 'documents',
        title: 'Dokumen & E-Sign',
        subtitle:
            'Repositori berkas perkara, persetujuan review, & tanda tangan digital',
        icon: FileText,
        color: 'bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400 border-amber-200/60 dark:border-amber-900/40',
        match: (name: string) =>
            name.startsWith('document.') || name.startsWith('signature.'),
    },
    {
        id: 'finance',
        title: 'Keuangan & Penagihan (Finance & Billing)',
        subtitle:
            'Penerbitan invoice, biaya perkara / panjar, kas masuk, & penawaran fee quote',
        icon: Banknote,
        color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-900/40',
        match: (name: string) =>
            name.startsWith('billing.') ||
            name.startsWith('expense.') ||
            name.startsWith('payment.') ||
            name.startsWith('quotation.'),
    },
    {
        id: 'governance',
        title: 'Tata Kelola, Benturan Kepentingan & Arsip',
        subtitle:
            'Log surat masuk/keluar resmi, conflict check, & pembekuan Legal Hold',
        icon: ShieldCheck,
        color: 'bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 border-rose-200/60 dark:border-rose-900/40',
        match: (name: string) =>
            name.startsWith('correspondence.') ||
            name.startsWith('conflict.') ||
            name.startsWith('archive.'),
    },
    {
        id: 'administration',
        title: 'Administrasi & Audit Keamanan',
        subtitle:
            'Pengaturan akun pengguna, konfigurasi peran sistem, & rekaman log jejak audit',
        icon: ShieldAlert,
        color: 'bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400 border-purple-200/60 dark:border-purple-900/40',
        match: (name: string) =>
            name.startsWith('admin.') || name.startsWith('audit.'),
    },
];

function RolePermissions({
    roles,
    permissions,
}: {
    roles: Role[];
    permissions: Permission[];
}) {
    const [selectedRoleId, setSelectedRoleId] = useState<number>(
        roles[0]?.id ?? 0,
    );
    const selectedRole = roles.find((r) => r.id === selectedRoleId) ?? roles[0];

    if (!selectedRole) {
        return null;
    }

    return (
        <div className="space-y-4">
            {/* 1. Selector Peran / Role Tabs */}
            <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5 dark:border-white/[0.04]">
                    <div>
                        <h3 className="text-xs font-bold tracking-wider text-slate-800 uppercase dark:text-zinc-200">
                            Pilih Peran (Role) untuk Dikonfigurasi
                        </h3>
                        <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                            Klik salah satu peran di bawah untuk mengelola izin
                            akses dan otorisasi secara terfokus.
                        </p>
                    </div>
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[10.5px] font-bold text-slate-700 dark:bg-white/[0.06] dark:text-zinc-300">
                        {roles.length} Peran Tersedia
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
                    {roles.map((role) => {
                        const isSelected = role.id === selectedRole.id;
                        return (
                            <button
                                key={role.id}
                                type="button"
                                onClick={() => setSelectedRoleId(role.id)}
                                className={`flex flex-col items-start justify-between rounded-xl border p-2.5 text-left transition-all ${
                                    isSelected
                                        ? 'border-slate-900 bg-slate-900 text-white shadow-sm dark:border-white dark:bg-white dark:text-slate-900'
                                        : 'border-slate-200/70 bg-slate-50/50 text-slate-800 hover:border-slate-300 hover:bg-white dark:border-white/[0.04] dark:bg-[#101216] dark:text-zinc-200 dark:hover:bg-zinc-800/60'
                                }`}
                            >
                                <div className="w-full min-w-0">
                                    <p className="truncate text-xs font-bold">
                                        {role.name}
                                    </p>
                                    <span
                                        className={`mt-0.5 block truncate font-mono text-[9.5px] ${
                                            isSelected
                                                ? 'text-slate-300 dark:text-slate-600'
                                                : 'text-slate-400 dark:text-zinc-500'
                                        }`}
                                    >
                                        {role.slug}
                                    </span>
                                </div>
                                <div className="mt-2 flex w-full items-center justify-between border-t border-current/10 pt-1.5 text-[10px]">
                                    <span className="opacity-80">Izin:</span>
                                    <span className="font-mono font-bold">
                                        {role.permissions.length}/
                                        {permissions.length}
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* 2. Formulir Konfigurasi Izin untuk Peran Terpilih */}
            <div
                key={selectedRole.id}
                className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]"
            >
                {/* Header Role Terpilih */}
                <div className="flex flex-col gap-2 border-b border-slate-100 bg-slate-50/50 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/[0.04] dark:bg-white/[0.02]">
                    <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase dark:text-zinc-500">
                                Konfigurasi Matriks:
                            </span>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                {selectedRole.name}
                            </h3>
                            <span className="rounded-md bg-slate-200/70 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-700 dark:bg-zinc-800 dark:text-zinc-300">
                                {selectedRole.slug}
                            </span>
                            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                                · {selectedRole.permissions.length} dari{' '}
                                {permissions.length} izin aktif
                            </span>
                        </div>
                        {selectedRole.description && (
                            <p className="text-xs text-slate-500 dark:text-zinc-400">
                                {selectedRole.description}
                            </p>
                        )}
                    </div>
                </div>

                <Form
                    {...roleRoutes.update.form(selectedRole.id)}
                    className="space-y-4 p-4"
                >
                    {({ processing }) => (
                        <>
                            <div className="space-y-4">
                                {PERMISSION_GROUPS.map((group) => {
                                    const groupPermissions = permissions.filter(
                                        (p) => group.match(p.name),
                                    );
                                    if (groupPermissions.length === 0)
                                        return null;

                                    const activeInGroup =
                                        groupPermissions.filter((p) =>
                                            selectedRole.permissions.some(
                                                (rp) => rp.id === p.id,
                                            ),
                                        ).length;
                                    const IconComp = group.icon;

                                    return (
                                        <div
                                            key={group.id}
                                            className="rounded-xl border border-slate-200/60 bg-slate-50/30 p-3.5 dark:border-white/[0.04] dark:bg-[#101216]"
                                        >
                                            {/* Group Header */}
                                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/50 pb-2.5 dark:border-white/[0.04]">
                                                <div className="flex items-center gap-2.5">
                                                    <div
                                                        className={`flex size-7 shrink-0 items-center justify-center rounded-lg border shadow-2xs ${group.color}`}
                                                    >
                                                        <IconComp className="size-3.5" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                                                            {group.title}
                                                        </h4>
                                                        <p className="text-[10.5px] text-slate-500 dark:text-zinc-400">
                                                            {group.subtitle}
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[10.5px] font-semibold text-slate-600 dark:bg-white/[0.06] dark:text-zinc-300">
                                                    {activeInGroup} /{' '}
                                                    {groupPermissions.length}{' '}
                                                    Aktif
                                                </span>
                                            </div>

                                            {/* Permission Checkbox Grid */}
                                            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                                {groupPermissions.map(
                                                    (permission) => {
                                                        const isAssigned =
                                                            selectedRole.permissions.some(
                                                                (p) =>
                                                                    p.id ===
                                                                    permission.id,
                                                            );

                                                        return (
                                                            <label
                                                                key={
                                                                    permission.id
                                                                }
                                                                className={`group flex cursor-pointer items-start gap-2.5 rounded-lg border p-2.5 text-xs transition-all ${
                                                                    isAssigned
                                                                        ? 'border-slate-300/90 bg-white shadow-2xs dark:border-white/10 dark:bg-[#16181e]'
                                                                        : 'border-slate-200/60 bg-white/50 opacity-75 hover:border-slate-300 hover:bg-white hover:opacity-100 dark:border-white/[0.03] dark:bg-zinc-900/30 dark:hover:bg-zinc-900'
                                                                }`}
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    name="permission_ids[]"
                                                                    value={
                                                                        permission.id
                                                                    }
                                                                    defaultChecked={
                                                                        isAssigned
                                                                    }
                                                                    className="mt-0.5 size-3.5 rounded border-slate-300 text-slate-900 focus:ring-slate-900 dark:border-zinc-700 dark:bg-zinc-900"
                                                                />
                                                                <div className="min-w-0 flex-1 space-y-0.5">
                                                                    <p className="font-semibold text-slate-900 group-hover:text-blue-600 dark:text-zinc-100 dark:group-hover:text-blue-400">
                                                                        {permission.description ||
                                                                            permission.name}
                                                                    </p>
                                                                    <span className="inline-block font-mono text-[10px] text-slate-400 dark:text-zinc-500">
                                                                        {
                                                                            permission.name
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </label>
                                                        );
                                                    },
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="flex items-center justify-end border-t border-slate-100 pt-3 dark:border-white/[0.04]">
                                <Button
                                    size="sm"
                                    disabled={processing}
                                    className="h-8 rounded-lg bg-slate-900 px-4 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 active:scale-95 dark:bg-white dark:text-slate-900"
                                >
                                    {processing ? (
                                        <>
                                            <Spinner className="mr-1.5 size-3.5" />
                                            Menyimpan Izin...
                                        </>
                                    ) : (
                                        `Simpan Izin Peran ${selectedRole.name}`
                                    )}
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </div>
    );
}

function InviteUserDialog({
    open,
    roles,
    onOpenChange,
    onCreated,
}: {
    open: boolean;
    roles: Role[];
    onOpenChange: (open: boolean) => void;
    onCreated: (creds: {
        name: string;
        email: string;
        password: string;
    }) => void;
}) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <Dialog
            open={open}
            onOpenChange={(nextOpen) => {
                if (!nextOpen) {
                    setName('');
                    setEmail('');
                    setPassword('');
                }
                onOpenChange(nextOpen);
            }}
        >
            <DialogContent className="max-h-[85vh] overflow-y-auto rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xl sm:max-w-md dark:border-white/10 dark:bg-[#14161b]">
                <DialogHeader className="border-b border-slate-100 pb-3 dark:border-white/[0.06]">
                    <div className="flex items-center gap-2.5">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-200">
                            <UserPlus className="size-4" />
                        </div>
                        <div>
                            <DialogTitle className="text-sm font-bold text-slate-900 dark:text-white">
                                Tambah Anggota Tim / Staf Baru
                            </DialogTitle>
                            <DialogDescription className="text-xs text-slate-500 dark:text-zinc-400">
                                Akun staf akan langsung aktif dan dapat
                                digunakan untuk login.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <Form
                    {...(userRoutes.store?.form ? userRoutes.store.form() : { action: '/admin/users', method: 'post' as const })}
                    className="space-y-3 pt-1"
                    onSuccess={() => {
                        onCreated({
                            name,
                            email,
                            password: password || 'password',
                        });
                        setName('');
                        setEmail('');
                        setPassword('');
                        onOpenChange(false);
                    }}
                >
                    {({ errors, processing }) => (
                        <>
                            <div className="grid gap-1">
                                <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                                    Nama Lengkap{' '}
                                    <span className="text-rose-500">*</span>
                                </Label>
                                <Input
                                    name="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Contoh: Rian Anggara, S.H."
                                    required
                                    className="h-7.5 rounded-lg border-slate-200 bg-slate-50/60 text-xs text-slate-900 focus:border-slate-400 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-1">
                                <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                                    Alamat Email Resmi{' '}
                                    <span className="text-rose-500">*</span>
                                </Label>
                                <Input
                                    name="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="rian@rpklawoffice.com"
                                    required
                                    className="h-7.5 rounded-lg border-slate-200 bg-slate-50/60 text-xs text-slate-900 focus:border-slate-400 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <Field
                                    name="position_title"
                                    label="Jabatan / Posisi"
                                    placeholder="Senior Associate"
                                />
                                <Field
                                    name="employee_code"
                                    label="Nomor NIP / ID"
                                    placeholder="RPK-2026-001"
                                />
                            </div>

                            <div className="grid gap-1">
                                <Field
                                    name="department"
                                    label="Departemen / Divisi"
                                    placeholder="Litigasi & Arbitrase"
                                />
                            </div>

                            <div className="grid gap-1">
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                                        Password Akun
                                    </Label>
                                    <span className="font-mono text-[10px] font-medium text-slate-400">
                                        Default: password
                                    </span>
                                </div>
                                <Input
                                    name="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    placeholder="Kosongkan jika ingin default: password"
                                    className="h-7.5 rounded-lg border-slate-200 bg-slate-50/60 text-xs text-slate-900 focus:border-slate-400 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
                                />
                                <InputError message={errors.password} />
                            </div>

                            {/* Live Informative Auth Preview Box */}
                            <div className="space-y-1 rounded-xl border border-slate-200/80 bg-slate-50/80 p-2.5 text-xs dark:border-white/10 dark:bg-[#121418]">
                                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-800 dark:text-zinc-200">
                                    <KeyRound className="size-3 text-slate-600 dark:text-zinc-400" />
                                    <span>Informasi Akses Login Staf:</span>
                                </div>
                                <div className="space-y-0.5 text-[10.5px] text-slate-600 dark:text-zinc-400">
                                    <p className="flex items-center justify-between">
                                        <span>• Email Login:</span>
                                        <strong className="font-mono text-slate-900 dark:text-white">
                                            {email || '(isi email di atas)'}
                                        </strong>
                                    </p>
                                    <p className="flex items-center justify-between">
                                        <span>• Password Login:</span>
                                        <code className="py-0.2 rounded border border-slate-200 bg-white px-1.5 font-mono font-bold text-slate-900 shadow-2xs dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200">
                                            {password || 'password'}
                                        </code>
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2 rounded-xl border border-slate-200/70 bg-slate-50/60 p-2.5 dark:border-white/[0.06] dark:bg-[#121418]">
                                <Label className="text-xs font-semibold text-slate-900 dark:text-white">
                                    Pilih Role Kewenangan *
                                </Label>
                                <div className="space-y-1 pt-0.5">
                                    {roles.map((role) => (
                                        <label
                                            key={role.id}
                                            className="flex cursor-pointer items-center gap-2 rounded-md p-1 text-xs hover:bg-white dark:hover:bg-zinc-800"
                                        >
                                            <input
                                                type="checkbox"
                                                name="role_ids[]"
                                                value={role.id}
                                                className="size-3.5 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                                            />
                                            <span className="font-semibold text-slate-900 dark:text-white">
                                                {role.name}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                                <InputError message={errors.role_ids} />
                            </div>

                            <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3 dark:border-white/[0.06]">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onOpenChange(false)}
                                    className="h-7.5 rounded-lg border-slate-200 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                                >
                                    Batal
                                </Button>
                                <Button
                                    size="sm"
                                    disabled={processing}
                                    className="h-7.5 rounded-lg bg-slate-900 px-4 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 active:scale-95 dark:bg-white dark:text-slate-900"
                                >
                                    {processing ? (
                                        <>
                                            <Spinner className="mr-1.5 size-3.5" />
                                            Menyimpan...
                                        </>
                                    ) : (
                                        'Simpan & Buat Akun'
                                    )}
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
