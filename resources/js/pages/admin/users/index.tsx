import { Form, Head, Link } from '@inertiajs/react';
import {
    AlertTriangle,
    Banknote,
    Briefcase,
    Building2,
    Check,
    CheckCheck,
    CheckCircle2,
    ChevronDown,
    ChevronRight,
    ChevronUp,
    Contact,
    Copy,
    FileText,
    KeyRound,
    Layers,
    Mail,
    MessageSquare,
    Pencil,
    RotateCcw,
    Search,
    Shield,
    ShieldAlert,
    ShieldCheck,
    Trash2,
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
    const [selectedStaff, setSelectedStaff] = useState<User | null>(null);
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
                    <div className="flex flex-col justify-between gap-3 border-b border-slate-200/60 pb-3 sm:flex-row sm:items-center dark:border-white/[0.06]">
                        <div className="space-y-0.5">
                            <h1 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl dark:text-white">
                                Personel &amp; Hak Akses
                            </h1>
                            <p className="text-[11px] text-slate-500 sm:text-xs dark:text-zinc-400">
                                Direktori staf firma, kartu identitas pegawai
                                digital, dan matriks hak akses perizinan.
                            </p>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex shrink-0 items-center gap-2">
                            <Button
                                size="sm"
                                onClick={() => setInviteOpen(true)}
                                className="h-7.5 rounded-lg bg-slate-900 px-3 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 active:scale-95 dark:bg-white dark:text-slate-900 dark:hover:bg-zinc-200"
                            >
                                <UserPlus className="mr-1.5 size-3.5" />
                                Tambah Staf Baru
                            </Button>
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

                    {/* 3. Segmented View Switcher */}
                    <div className="flex items-center gap-1 border-b border-slate-200/60 pb-2 dark:border-white/[0.06]">
                        <button
                            type="button"
                            onClick={() => setTab('cards')}
                            className={`flex h-7.5 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition-all ${
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
                            className={`flex h-7.5 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition-all ${
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
                            className={`flex h-7.5 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition-all ${
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
                                {...userRoutes.index.form()}
                                className="space-y-2 rounded-xl border border-slate-200/60 bg-slate-50/50 p-2 dark:border-white/[0.04] dark:bg-[#121418]"
                            >
                                {/* Row 1: Search, Reset, Count */}
                                <div className="flex items-center gap-2">
                                    <div className="relative flex-1">
                                        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-slate-400" />
                                        <Input
                                            name="search"
                                            defaultValue={filters.search}
                                            placeholder="Cari nama, NIP, email, jabatan, atau departemen..."
                                            className="h-7.5 w-full rounded-lg border-slate-200 bg-white pl-8 text-xs text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:ring-0 dark:border-white/10 dark:bg-zinc-800 dark:text-white"
                                        />
                                    </div>
                                    {(filters.search || filters.role_id) && (
                                        <Button
                                            asChild
                                            variant="outline"
                                            size="sm"
                                            className="h-7.5 shrink-0 rounded-lg border-slate-200 bg-white px-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-300"
                                            title="Reset Semua Filter"
                                        >
                                            <Link href={userRoutes.index.url()}>
                                                <RotateCcw className="size-3.5 text-slate-400" />
                                            </Link>
                                        </Button>
                                    )}
                                    <span className="shrink-0 rounded-md border border-slate-200/70 bg-white px-2.5 py-0.5 font-mono text-[10.5px] font-semibold text-slate-700 shadow-2xs dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-300">
                                        {users.total} personel
                                    </span>
                                </div>

                                {/* Row 2: Select Role, Submit button */}
                                <div className="flex flex-wrap items-center gap-2">
                                    <div className="relative min-w-[200px] flex-1">
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
                                        className="h-7.5 shrink-0 rounded-lg bg-slate-900 px-3.5 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 dark:bg-white dark:text-slate-900"
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
                                                    onViewDetail={(u) =>
                                                        setSelectedStaff(u)
                                                    }
                                                    onEdit={(u) =>
                                                        setEditing(u)
                                                    }
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
                                                        onClick={() =>
                                                            setInviteOpen(true)
                                                        }
                                                        className="mt-3.5 h-7.5 rounded-lg bg-slate-900 px-3 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 dark:bg-white dark:text-slate-900"
                                                    >
                                                        <UserPlus className="mr-1 size-3" />{' '}
                                                        Tambah Staf Baru
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
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            setSelectedStaff(
                                                                                user,
                                                                            )
                                                                        }
                                                                        className="text-left font-semibold text-slate-900 transition-colors hover:text-slate-600 dark:text-white dark:hover:text-zinc-300"
                                                                    >
                                                                        {
                                                                            user.name
                                                                        }
                                                                    </button>
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
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        setSelectedStaff(
                                                                            user,
                                                                        )
                                                                    }
                                                                    className="h-7 rounded-lg border-slate-200 bg-white px-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200"
                                                                    title="Lihat Kartu Pegawai Digital"
                                                                >
                                                                    <Contact className="size-3" />
                                                                </Button>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        setEditing(
                                                                            user,
                                                                        )
                                                                    }
                                                                    className="h-7 rounded-lg border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200"
                                                                >
                                                                    <Pencil className="mr-1 size-3 text-slate-400" />
                                                                    Kelola
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

            {/* Modal: Detail ID Card Staf Interaktif */}
            <StaffDetailModal
                user={selectedStaff}
                onClose={() => setSelectedStaff(null)}
                onEdit={(user) => {
                    setSelectedStaff(null);
                    setEditing(user);
                }}
            />

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
    onViewDetail,
    onEdit,
}: {
    user: User;
    onViewDetail: (user: User) => void;
    onEdit: (user: User) => void;
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
            onClick={() => onViewDetail(user)}
            className="group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/50 dark:border-white/[0.08] dark:bg-[#13151b] dark:hover:border-white/20 dark:hover:shadow-[0_12px_24px_-4px_rgba(0,0,0,0.5)]"
        >
            {/* Top subtle ambient highlight */}
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-slate-300 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:via-white/20" />

            <div className="space-y-3">
                {/* 1. Header: NIP Monospace Badge & Live Status */}
                <div className="flex items-center justify-between gap-2">
                    <div className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/70 bg-slate-50/90 px-2.5 py-0.5 font-mono text-[10px] font-bold text-slate-700 shadow-2xs dark:border-white/5 dark:bg-zinc-800/80 dark:text-zinc-300">
                        <Shield className="size-3 text-slate-400 dark:text-zinc-400" />
                        <span>{displayId}</span>
                    </div>

                    <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold tracking-wide ${
                            user.is_active
                                ? 'border border-emerald-200/70 bg-emerald-50 text-emerald-700 dark:border-emerald-800/50 dark:bg-emerald-950/40 dark:text-emerald-300'
                                : 'border border-rose-200/70 bg-rose-50 text-rose-700 dark:border-rose-800/50 dark:bg-rose-950/40 dark:text-rose-300'
                        }`}
                    >
                        <span className="relative flex size-1.5">
                            {user.is_active && (
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                            )}
                            <span
                                className={`relative inline-flex size-1.5 rounded-full ${
                                    user.is_active
                                        ? 'bg-emerald-500'
                                        : 'bg-rose-500'
                                }`}
                            />
                        </span>
                        {user.is_active ? 'Aktif' : 'Nonaktif'}
                    </span>
                </div>

                {/* 2. Profile Persona: Avatar & Details */}
                <div className="flex items-center gap-3 pt-0.5">
                    <div className="relative shrink-0">
                        <div className="rounded-2xl bg-gradient-to-b from-slate-200/80 to-slate-100 p-0.5 shadow-2xs transition-all duration-300 group-hover:from-blue-500/40 group-hover:to-indigo-500/20 dark:from-white/15 dark:to-white/5">
                            <Avatar className="size-12 rounded-[14px] bg-slate-50 dark:bg-zinc-800">
                                <AvatarImage
                                    src={user.avatar_url ?? undefined}
                                    className="object-cover"
                                />
                                <AvatarFallback className="rounded-[14px] bg-gradient-to-br from-slate-800 to-slate-950 text-xs font-extrabold text-white dark:from-zinc-700 dark:to-zinc-900 dark:text-zinc-100">
                                    {getInitials(user.name)}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                        {user.is_active && (
                            <span
                                className="absolute -right-1 -bottom-1 flex size-4 items-center justify-center rounded-full bg-emerald-500 shadow-xs ring-2 ring-white dark:ring-[#13151b]"
                                title="Terverifikasi & Aktif"
                            >
                                <Check className="size-2.5 stroke-[3.5] text-white" />
                            </span>
                        )}
                    </div>

                    <div className="min-w-0 flex-1 space-y-0.5">
                        <h4 className="line-clamp-1 text-[13px] font-bold tracking-tight text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                            {user.name}
                        </h4>
                        <p className="line-clamp-1 text-[11px] font-semibold text-slate-600 dark:text-zinc-300">
                            {user.position_title || 'Staf Kantor Hukum'}
                        </p>
                        {user.department && (
                            <div className="flex items-center gap-1 truncate text-[10.5px] text-slate-400 dark:text-zinc-400">
                                <Building2 className="size-3 shrink-0 text-slate-400 dark:text-zinc-500" />
                                <span className="truncate">
                                    {user.department}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* 3. Interactive Email Pill Box with Instant Copy */}
                <div
                    onClick={handleCopyEmail}
                    title="Klik untuk menyalin email"
                    className="group/email flex items-center justify-between gap-2 rounded-xl border border-slate-200/70 bg-slate-50/60 px-3 py-1.5 text-[11px] text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-100/90 dark:border-white/[0.05] dark:bg-[#101217] dark:text-zinc-300 dark:hover:border-white/10 dark:hover:bg-zinc-800/60"
                >
                    <div className="flex items-center gap-2 truncate">
                        <Mail className="size-3.5 shrink-0 text-slate-400 group-hover/email:text-slate-600 dark:text-zinc-400 dark:group-hover/email:text-zinc-200" />
                        <span className="truncate font-mono text-[10.5px] font-medium text-slate-700 dark:text-zinc-300">
                            {user.email}
                        </span>
                    </div>
                    <span className="flex shrink-0 items-center text-[10px] font-medium text-slate-400 group-hover/email:text-slate-700 dark:text-zinc-500 dark:group-hover/email:text-zinc-200">
                        {copied ? (
                            <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                                <Check className="size-3" />
                                Disalin
                            </span>
                        ) : (
                            <Copy className="size-3 opacity-60 transition-opacity group-hover/email:opacity-100" />
                        )}
                    </span>
                </div>
            </div>

            {/* 4. Bottom Action Bar */}
            <div className="mt-3.5 flex items-center justify-between border-t border-slate-100 pt-2.5 dark:border-white/[0.05]">
                <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-zinc-200 dark:group-hover:text-blue-400">
                    <Contact className="size-3.5 text-slate-400 transition-colors group-hover:text-blue-600 dark:text-zinc-400 dark:group-hover:text-blue-400" />
                    <span>Buka Kartu ID</span>
                    <ChevronRight className="size-3 text-slate-400 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-blue-600 dark:text-zinc-400 dark:group-hover:text-blue-400" />
                </div>

                <div className="flex items-center gap-1">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleOpenChat}
                        title="Kirim pesan langsung"
                        className="h-7 w-7 rounded-lg p-0 text-slate-500 hover:bg-blue-50 hover:text-blue-600 dark:text-zinc-400 dark:hover:bg-blue-950/40 dark:hover:text-blue-300"
                    >
                        <MessageSquare className="size-3.5" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(user);
                        }}
                        className="h-7 rounded-lg px-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
                    >
                        <Pencil className="mr-1 size-2.5" />
                        Kelola
                    </Button>
                </div>
            </div>
        </div>
    );
}

function StaffDetailModal({
    user,
    onClose,
    onEdit,
}: {
    user: User | null;
    onClose: () => void;
    onEdit: (user: User) => void;
}) {
    const getInitials = useInitials();
    const [copiedEmail, setCopiedEmail] = useState(false);
    const [copiedId, setCopiedId] = useState(false);

    if (!user) return null;

    const displayId =
        user.employee_code || `RPK-${user.id.toString().padStart(3, '0')}`;

    const handleCopy = (text: string, type: 'email' | 'id') => {
        navigator.clipboard.writeText(text);
        if (type === 'email') {
            setCopiedEmail(true);
            setTimeout(() => setCopiedEmail(false), 2000);
        } else {
            setCopiedId(true);
            setTimeout(() => setCopiedId(false), 2000);
        }
    };

    return (
        <Dialog open={!!user} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-h-[92vh] overflow-y-auto rounded-3xl border border-slate-200/80 bg-white p-0 shadow-2xl sm:max-w-md dark:border-white/10 dark:bg-[#12141a]">
                {/* 1. Luxury Executive Digital ID Pass Header */}
                <div className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-[#0d111c] to-[#121727] p-6 pb-6 text-center text-white">
                    {/* Ambient Glows */}
                    <div className="pointer-events-none absolute -top-12 -left-12 size-40 rounded-full bg-blue-500/15 blur-2xl" />
                    <div className="pointer-events-none absolute -right-10 -bottom-10 size-44 rounded-full bg-indigo-500/15 blur-2xl" />

                    {/* Top Seal & Holographic Monospace ID */}
                    <div className="relative z-10 mb-4 flex items-center justify-between pr-8 text-[10px] font-bold tracking-wider uppercase">
                        <span className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-slate-200 backdrop-blur-md">
                            <Shield className="size-3 text-blue-400" />
                            RPK DIGITAL CREDENTIAL
                        </span>
                        <span className="flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 font-mono text-[10px] font-bold text-white shadow-2xs backdrop-blur-md">
                            {displayId}
                        </span>
                    </div>

                    {/* Centered Avatar Persona with Glow & Ring */}
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="relative">
                            <div className="rounded-2xl bg-gradient-to-b from-white/30 via-white/10 to-white/5 p-1 shadow-2xl backdrop-blur-md">
                                <Avatar className="size-20 rounded-[14px] bg-slate-900 ring-2 ring-white/20">
                                    <AvatarImage
                                        src={user.avatar_url ?? undefined}
                                        className="object-cover"
                                    />
                                    <AvatarFallback className="rounded-[14px] bg-gradient-to-br from-slate-800 to-slate-950 text-base font-extrabold text-white">
                                        {getInitials(user.name)}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                            {user.is_active && (
                                <span
                                    className="absolute -right-1 -bottom-1 flex size-5.5 items-center justify-center rounded-full bg-emerald-500 shadow-md ring-3 ring-[#0d111c]"
                                    title="Staf Aktif & Terverifikasi"
                                >
                                    <Check className="size-3 stroke-[3.5] text-white" />
                                </span>
                            )}
                        </div>

                        <h3 className="mt-3.5 text-base font-extrabold tracking-tight text-white sm:text-lg">
                            {user.name}
                        </h3>

                        <div className="mt-1 flex flex-wrap items-center justify-center gap-1.5">
                            <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-2.5 py-0.5 text-[11px] font-medium text-slate-200 backdrop-blur-md">
                                <Briefcase className="size-3 text-slate-300" />
                                {user.position_title || 'Staf Kantor Hukum'}
                            </span>
                            {user.department && (
                                <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-2.5 py-0.5 text-[11px] font-medium text-slate-300 backdrop-blur-md">
                                    <Building2 className="size-3 text-slate-300" />
                                    {user.department}
                                </span>
                            )}
                        </div>

                        {/* Roles Badges if any */}
                        {user.roles && user.roles.length > 0 && (
                            <div className="mt-2.5 flex flex-wrap items-center justify-center gap-1">
                                {user.roles.map((role) => (
                                    <span
                                        key={role.id}
                                        className="inline-flex items-center gap-1 rounded-md border border-blue-400/30 bg-blue-500/20 px-2 py-0.5 text-[9.5px] font-semibold text-blue-200 backdrop-blur-xs"
                                    >
                                        <ShieldCheck className="size-2.5 text-blue-300" />
                                        {role.name}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. Structured Credential Body (Bento Style) */}
                <div className="space-y-3 p-5 text-xs">
                    {/* Box 1: Kontak & Kredensial Login */}
                    <div className="space-y-2 rounded-2xl border border-slate-200/70 bg-slate-50/60 p-3.5 dark:border-white/[0.06] dark:bg-[#0f1117]">
                        <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:text-zinc-400">
                                <KeyRound className="size-3 text-slate-400 dark:text-zinc-500" />
                                Kontak &amp; Kredensial Resmi
                            </span>
                            <span
                                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                    user.is_active
                                        ? 'border border-emerald-200/60 bg-emerald-50 text-emerald-700 dark:border-emerald-800/40 dark:bg-emerald-950/50 dark:text-emerald-300'
                                        : 'border border-rose-200/60 bg-rose-50 text-rose-700 dark:border-rose-800/40 dark:bg-rose-950/50 dark:text-rose-300'
                                }`}
                            >
                                <span className="size-1.5 rounded-full bg-current" />
                                {user.is_active
                                    ? 'Aktif (Dapat Login)'
                                    : 'Akses Dinonaktifkan'}
                            </span>
                        </div>

                        <div className="flex items-center justify-between gap-2 rounded-xl border border-slate-200/80 bg-white p-2.5 shadow-2xs dark:border-white/10 dark:bg-zinc-800/80">
                            <div className="flex min-w-0 items-center gap-2">
                                <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-zinc-700 dark:text-zinc-300">
                                    <Mail className="size-3.5" />
                                </div>
                                <div className="min-w-0">
                                    <span className="block text-[9.5px] font-medium text-slate-400 dark:text-zinc-400">
                                        Email Kerja Resmi
                                    </span>
                                    <span className="block truncate font-mono text-xs font-semibold text-slate-900 dark:text-white">
                                        {user.email}
                                    </span>
                                </div>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCopy(user.email, 'email')}
                                className="h-7 shrink-0 rounded-lg px-2 text-[11px] font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-300 dark:hover:bg-zinc-700"
                                title="Salin Email"
                            >
                                {copiedEmail ? (
                                    <>
                                        <Check className="mr-1 size-3 text-emerald-600" />
                                        Disalin!
                                    </>
                                ) : (
                                    <>
                                        <Copy className="mr-1 size-3 text-slate-400" />
                                        Salin
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Box 2: Informasi Identitas Pegawai (2-Col Grid) */}
                    <div className="space-y-2 rounded-2xl border border-slate-200/70 bg-slate-50/60 p-3.5 dark:border-white/[0.06] dark:bg-[#0f1117]">
                        <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:text-zinc-400">
                            <ShieldCheck className="size-3 text-slate-400 dark:text-zinc-500" />
                            Informasi Identitas Pegawai
                        </span>

                        <div className="grid grid-cols-2 gap-2">
                            <div className="rounded-xl border border-slate-200/80 bg-white p-2.5 shadow-2xs dark:border-white/10 dark:bg-zinc-800/80">
                                <span className="block text-[10px] font-medium text-slate-400 dark:text-zinc-400">
                                    Nomor NIP / ID
                                </span>
                                <div className="mt-0.5 flex items-center justify-between">
                                    <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                                        {displayId}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleCopy(displayId, 'id')
                                        }
                                        className="cursor-pointer text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200"
                                        title="Salin NIP"
                                    >
                                        {copiedId ? (
                                            <Check className="size-3 text-emerald-600" />
                                        ) : (
                                            <Copy className="size-3" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="rounded-xl border border-slate-200/80 bg-white p-2.5 shadow-2xs dark:border-white/10 dark:bg-zinc-800/80">
                                <span className="block text-[10px] font-medium text-slate-400 dark:text-zinc-400">
                                    Departemen / Divisi
                                </span>
                                <span className="mt-0.5 block truncate text-xs font-semibold text-slate-900 dark:text-white">
                                    {user.department || '-'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Minimal Verification Watermark */}
                    <div className="flex items-center justify-between rounded-xl border border-dashed border-slate-200 px-3 py-1.5 text-[10px] text-slate-400 dark:border-white/10 dark:text-zinc-500">
                        <span className="flex items-center gap-1 font-medium">
                            <CheckCheck className="size-3 text-emerald-500" />
                            Terverifikasi Digital Record
                        </span>
                        <span className="font-mono font-medium">
                            ID: #{user.id.toString().padStart(4, '0')}
                        </span>
                    </div>

                    {/* 3. Footer Action Buttons */}
                    <div className="flex flex-col items-center justify-between gap-2 border-t border-slate-100 pt-3 sm:flex-row dark:border-white/[0.06]">
                        <div className="flex w-full items-center gap-1.5 sm:w-auto">
                            <Button
                                type="button"
                                size="sm"
                                onClick={() => {
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
                                    onClose();
                                }}
                                className="h-8 flex-1 cursor-pointer rounded-xl bg-slate-900 px-3.5 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 sm:flex-initial dark:bg-white dark:text-slate-900 dark:hover:bg-zinc-200"
                            >
                                <MessageSquare className="mr-1.5 size-3.5" />
                                Kirim Pesan
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                size="sm"
                                className="h-8 flex-1 rounded-xl border-slate-200 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 sm:flex-initial dark:border-white/10 dark:text-zinc-300"
                            >
                                <a href={`mailto:${user.email}`}>
                                    <Mail className="mr-1.5 size-3.5" />
                                    Email
                                </a>
                            </Button>
                        </div>

                        <div className="flex w-full items-center justify-end gap-1.5 sm:w-auto">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    onClose();
                                    onEdit(user);
                                }}
                                className="h-8 rounded-xl border-slate-200 px-3 text-xs font-semibold text-slate-800 hover:bg-slate-50 dark:border-white/10 dark:text-zinc-200"
                            >
                                <Pencil className="mr-1.5 size-3 text-slate-400" />
                                Edit Staf
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={onClose}
                                className="h-8 rounded-xl px-3 text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-800"
                            >
                                Tutup
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

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
                    {...userRoutes.store.form()}
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
    if (!user) return null;

    const assignedRoleIds = new Set(user.roles.map((role) => role.id));

    return (
        <Dialog open={!!user} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[85vh] overflow-y-auto rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xl sm:max-w-md dark:border-white/10 dark:bg-[#14161b]">
                <DialogHeader className="border-b border-slate-100 pb-3 dark:border-white/[0.06]">
                    <DialogTitle className="text-sm font-bold text-slate-900 dark:text-white">
                        Kelola Pengguna: {user.name}
                    </DialogTitle>
                    <DialogDescription className="text-xs text-slate-500">
                        Perbarui role kewenangan, jabatan, departemen, dan
                        status aktif akun.
                    </DialogDescription>
                </DialogHeader>

                <Form
                    {...userRoutes.update.form(user.id)}
                    className="space-y-3 pt-1"
                    onSuccess={() => onOpenChange(false)}
                >
                    {({ errors, processing }) => (
                        <>
                            {/* Avatar Display */}
                            <div className="flex items-center gap-2.5 rounded-xl border border-slate-200/70 bg-slate-50/60 p-2.5 dark:border-white/5 dark:bg-[#121418]">
                                <Avatar className="size-10 shrink-0 rounded-lg border border-slate-200 shadow-2xs dark:border-white/10">
                                    <AvatarImage
                                        src={user.avatar_url ?? undefined}
                                        className="object-cover"
                                    />
                                    <AvatarFallback className="rounded-lg bg-slate-100 text-xs font-bold text-slate-800 dark:bg-zinc-800 dark:text-zinc-200">
                                        {getInitials(user.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0">
                                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                                        {user.name}
                                    </p>
                                    <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                                        {user.email}
                                    </p>
                                    {user.position_title && (
                                        <span className="mt-0.5 inline-block rounded bg-slate-100 px-2 py-0.5 font-mono text-[9.5px] font-semibold text-slate-700 dark:bg-zinc-800 dark:text-zinc-300">
                                            {user.position_title}
                                        </span>
                                    )}
                                </div>
                            </div>

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

                            <div className="grid grid-cols-2 gap-2">
                                <Field
                                    name="position_title"
                                    label="Jabatan / Posisi"
                                    defaultValue={user.position_title ?? ''}
                                />
                                <Field
                                    name="employee_code"
                                    label="Nomor NIP / ID"
                                    defaultValue={user.employee_code ?? ''}
                                />
                            </div>

                            <div className="grid gap-1">
                                <Field
                                    name="department"
                                    label="Departemen / Divisi"
                                    defaultValue={user.department ?? ''}
                                />
                            </div>

                            <Field
                                name="password"
                                label="Ubah Password (Opsional)"
                                type="password"
                                placeholder="Kosongkan jika tidak ingin mengubah password saat ini"
                            />

                            <div className="space-y-2 rounded-xl border border-slate-200/70 bg-slate-50/60 p-2.5 dark:border-white/[0.06] dark:bg-[#121418]">
                                <Label className="text-xs font-semibold text-slate-900 dark:text-white">
                                    Role Kewenangan
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
                                                defaultChecked={assignedRoleIds.has(
                                                    role.id,
                                                )}
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

                            <div className="flex items-center gap-2 rounded-xl border border-slate-200/70 bg-slate-50/60 p-2.5 dark:border-white/5 dark:bg-zinc-800/40">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    name="is_active"
                                    value="1"
                                    defaultChecked={user.is_active}
                                    className="size-3.5 rounded border-slate-300 text-slate-900"
                                />
                                <Label
                                    htmlFor="is_active"
                                    className="cursor-pointer text-xs font-semibold text-slate-800 dark:text-zinc-200"
                                >
                                    Akun Aktif (Dapat Login &amp; Mengakses
                                    Sistem)
                                </Label>
                            </div>

                            <div className="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-white/[0.06]">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        const target = user;
                                        onOpenChange(false);
                                        onDeleteClick?.(target);
                                    }}
                                    className="h-7.5 rounded-lg px-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-950/30"
                                >
                                    <Trash2 className="mr-1 size-3.5" />
                                    Hapus
                                </Button>
                                <div className="flex items-center gap-2">
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
                                        className="h-7.5 rounded-lg bg-slate-900 px-4 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 dark:bg-white dark:text-slate-900"
                                    >
                                        Simpan Perubahan
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
                        {...userRoutes.destroy.form(user.id)}
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
                                    className="h-7.5 rounded-lg border-slate-200 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    variant="destructive"
                                    size="sm"
                                    disabled={processing}
                                    className="h-7.5 rounded-lg bg-rose-600 px-4 text-xs font-semibold text-white shadow-2xs hover:bg-rose-700"
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
}: {
    name: string;
    label: string;
    type?: string;
    placeholder?: string;
    defaultValue?: string;
    required?: boolean;
}) {
    return (
        <div className="grid gap-1">
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
                defaultValue={defaultValue}
                required={required}
                className="h-7.5 rounded-lg border-slate-200 bg-slate-50/60 text-xs text-slate-900 focus:border-slate-400 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
            />
        </div>
    );
}

UsersIndex.layout = {
    breadcrumbs: [{ title: 'Pengguna & Akses', href: userRoutes.index() }],
};
