import { Form, Head } from '@inertiajs/react';
import {
    Check,
    CheckCircle2,
    ChevronDown,
    Copy,
    KeyRound,
    Pencil,
    Plus,
    Search,
    Shield,
    ShieldCheck,
    UserPlus,
    Users,
} from 'lucide-react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import { Pagination } from '@/components/pagination';
import { StatusBadge } from '@/components/status-badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
    permissions: Permission[];
};
type User = {
    id: number;
    name: string;
    email: string;
    position_title?: string;
    avatar_url?: string | null;
    is_active: boolean;
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
    const [tab, setTab] = useState<'users' | 'roles'>('users');
    const [editing, setEditing] = useState<User | null>(null);
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
                <main className="mx-auto max-w-7xl space-y-5 px-4 py-5 sm:px-6 lg:px-8">
                    {/* 1. Header Navigation & Action Bar */}
                    <div className="flex flex-col justify-between gap-4 border-b border-slate-200/60 pb-5 sm:flex-row sm:items-center dark:border-white/[0.06]">
                        <div className="space-y-1">
                            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                                Pengguna &amp; Hak Akses
                            </h1>
                            <p className="text-xs text-slate-500 dark:text-zinc-400">
                                Undang anggota tim kantor hukum, atur jabatan, dan konfigurasi matriks perizinan (permissions).
                            </p>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex shrink-0 items-center gap-2">
                            <Button
                                size="sm"
                                onClick={() => setInviteOpen(true)}
                                className="h-8 rounded-lg bg-blue-600 px-3.5 text-xs font-semibold text-white shadow-2xs hover:bg-blue-700 active:scale-95"
                            >
                                <UserPlus className="mr-1.5 size-3.5" />
                                + Undang Pengguna Baru
                            </Button>
                        </div>
                    </div>

                    {/* 2. Top 4 Compact Bento KPI Cards */}
                    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {/* 1. Total Pengguna */}
                        <div className="group rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[11px] font-semibold">TOTAL PENGGUNA</span>
                                <Users className="size-3.5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="mt-2 flex items-baseline gap-1.5">
                                <span className="font-mono text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    {metrics.total}
                                </span>
                                <span className="text-[11px] text-slate-500 dark:text-zinc-400">
                                    anggota
                                </span>
                            </div>
                            <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-500 dark:border-white/[0.04]">
                                <span>Terdaftar Sistem</span>
                                <span className="font-semibold text-blue-600 dark:text-blue-400">Personel</span>
                            </div>
                        </div>

                        {/* 2. Pengguna Aktif */}
                        <div className="group rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[11px] font-semibold">PENGGUNA AKTIF</span>
                                <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div className="mt-2 flex items-baseline gap-1.5">
                                <span className="font-mono text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                                    {metrics.active}
                                </span>
                                <span className="text-[11px] text-slate-500 dark:text-zinc-400">
                                    aktif
                                </span>
                            </div>
                            <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-500 dark:border-white/[0.04]">
                                <span>Dapat Login</span>
                                <span className="font-semibold text-emerald-600">Operasional</span>
                            </div>
                        </div>

                        {/* 3. Struktur Role */}
                        <div className="group rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[11px] font-semibold">STRUKTUR ROLE</span>
                                <ShieldCheck className="size-3.5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div className="mt-2 flex items-baseline gap-1.5">
                                <span className="font-mono text-2xl font-bold tracking-tight text-purple-600 dark:text-purple-400">
                                    {metrics.roles_count}
                                </span>
                                <span className="text-[11px] text-slate-500 dark:text-zinc-400">
                                    role
                                </span>
                            </div>
                            <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-500 dark:border-white/[0.04]">
                                <span>Hirarki Posisi</span>
                                <span className="font-semibold text-purple-600">Partner &amp; Staf</span>
                            </div>
                        </div>

                        {/* 4. Hak Akses Terdefinisi */}
                        <div className="group rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[11px] font-semibold">MATRIKS PERMISSION</span>
                                <KeyRound className="size-3.5 text-amber-500" />
                            </div>
                            <div className="mt-2 flex items-baseline gap-1.5">
                                <span className="font-mono text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
                                    {metrics.permissions_count}
                                </span>
                                <span className="text-[11px] text-slate-500 dark:text-zinc-400">
                                    izin
                                </span>
                            </div>
                            <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-500 dark:border-white/[0.04]">
                                <span>Hak Akses Fitur</span>
                                <span className="font-semibold text-amber-600">Granular</span>
                            </div>
                        </div>
                    </section>

                    {/* 3. Segmented View Switcher */}
                    <div className="flex items-center gap-1 border-b border-slate-200/60 pb-2 dark:border-white/[0.06]">
                        <button
                            type="button"
                            onClick={() => setTab('users')}
                            className={`flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition-colors ${
                                tab === 'users'
                                    ? 'bg-slate-900 text-white shadow-2xs dark:bg-white dark:text-slate-900'
                                    : 'border border-slate-200/70 bg-white text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:bg-[#14161b] dark:text-zinc-300'
                            }`}
                        >
                            <Users className="size-3.5" />
                            Daftar Pengguna ({users.total})
                        </button>
                        <button
                            type="button"
                            onClick={() => setTab('roles')}
                            className={`flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition-colors ${
                                tab === 'roles'
                                    ? 'bg-purple-600 text-white shadow-2xs'
                                    : 'border border-slate-200/70 bg-white text-purple-700 hover:bg-purple-50 dark:border-white/10 dark:bg-[#14161b] dark:text-purple-300'
                            }`}
                        >
                            <KeyRound className="size-3.5" />
                            Role &amp; Matriks Permission ({roles.length})
                        </button>
                    </div>

                    {tab === 'users' ? (
                        <>
                            {/* Search & Filter Bar */}
                            <Form
                                {...userRoutes.index.form()}
                                className="flex flex-col gap-2 rounded-xl border border-slate-200/70 bg-white p-2.5 shadow-2xs sm:flex-row sm:items-center dark:border-white/[0.06] dark:bg-[#14161b]"
                            >
                                <div className="relative flex-1">
                                    <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-slate-400" />
                                    <Input
                                        name="search"
                                        defaultValue={filters.search}
                                        placeholder="Cari nama, email, atau jabatan..."
                                        className="h-8 w-full rounded-lg border-slate-200 bg-white pl-8 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 dark:border-white/10 dark:bg-zinc-800 dark:text-white"
                                    />
                                </div>

                                <div className="relative min-w-[200px]">
                                    <select
                                        name="role_id"
                                        defaultValue={filters.role_id ?? ''}
                                        className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white pr-7 pl-2.5 text-xs text-slate-900 outline-none hover:bg-slate-50 focus:border-blue-500 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200"
                                    >
                                        <option value="">Semua Role</option>
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
                                    className="h-8 shrink-0 rounded-lg bg-slate-900 px-4 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 dark:bg-white dark:text-slate-900"
                                >
                                    Filter
                                </Button>
                            </Form>

                            {/* Users Table Card */}
                            <div className="overflow-hidden rounded-xl border border-slate-200/70 bg-white shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs">
                                        <thead>
                                            <tr className="border-b border-slate-100 bg-slate-50/60 text-[10px] font-semibold text-slate-500 uppercase dark:border-white/[0.04] dark:bg-[#121418]">
                                                <th className="py-2.5 pr-3 pl-4">Pengguna / Identitas</th>
                                                <th className="px-3 py-2.5">Role Kewenangan</th>
                                                <th className="px-3 py-2.5 text-center">Status</th>
                                                <th className="py-2.5 pr-4 pl-3 text-right">Aksi</th>
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
                                                            <Avatar className="size-8 shrink-0 rounded-lg border border-slate-200 shadow-2xs dark:border-white/10">
                                                                <AvatarImage src={user.avatar_url ?? undefined} />
                                                                <AvatarFallback className="rounded-lg bg-blue-50 text-[11px] font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                                                                    {getInitials(user.name)}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div className="min-w-0">
                                                                <span className="font-semibold text-slate-900 dark:text-white">
                                                                    {user.name}
                                                                </span>
                                                                <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                                                                    {user.email}
                                                                    {user.position_title ? ` · ${user.position_title}` : ''}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Roles */}
                                                    <td className="px-3 py-2.5 whitespace-nowrap">
                                                        <div className="flex flex-wrap gap-1">
                                                            {user.roles.length > 0 ? (
                                                                user.roles.map((r) => (
                                                                    <span
                                                                        key={r.id}
                                                                        className="rounded bg-purple-50 px-1.5 py-0.2 font-mono text-[10px] font-semibold text-purple-700 dark:bg-purple-950/40 dark:text-purple-300"
                                                                    >
                                                                        {r.name}
                                                                    </span>
                                                                ))
                                                            ) : (
                                                                <span className="text-slate-400 dark:text-zinc-500">Tanpa Role</span>
                                                            )}
                                                        </div>
                                                    </td>

                                                    {/* Status */}
                                                    <td className="px-3 py-2.5 text-center whitespace-nowrap">
                                                        <StatusBadge value={user.is_active ? 'active' : 'inactive'} />
                                                    </td>

                                                    {/* Actions */}
                                                    <td className="py-2.5 pr-4 pl-3 text-right whitespace-nowrap">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => setEditing(user)}
                                                            className="h-7 rounded-lg border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200"
                                                        >
                                                            <Pencil className="mr-1 size-3 text-slate-400" />
                                                            Kelola
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="flex flex-col justify-between gap-2.5 border-t border-slate-100 bg-slate-50/60 px-4 py-3 sm:flex-row sm:items-center dark:border-white/[0.04] dark:bg-[#121418]">
                                    <span className="text-xs text-slate-500 dark:text-zinc-400">
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
            <Dialog open={!!createdCreds} onOpenChange={(open) => !open && setCreatedCreds(null)}>
                <DialogContent className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xl sm:max-w-md dark:border-white/10 dark:bg-[#14161b]">
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
                                    Kredensial login untuk anggota tim baru telah aktif.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    {createdCreds && (
                        <div className="space-y-3.5 pt-2 text-xs">
                            <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-[#121418]">
                                <div className="flex items-center justify-between border-b border-slate-200/60 pb-2 dark:border-white/5">
                                    <span className="text-slate-500">Nama Pengguna</span>
                                    <span className="font-bold text-slate-900 dark:text-white">{createdCreds.name}</span>
                                </div>
                                <div className="flex items-center justify-between border-b border-slate-200/60 pb-2 dark:border-white/5">
                                    <span className="text-slate-500">Email Login</span>
                                    <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{createdCreds.email}</span>
                                </div>
                                <div className="flex items-center justify-between border-b border-slate-200/60 pb-2 dark:border-white/5">
                                    <span className="text-slate-500">Password</span>
                                    <span className="rounded bg-white px-2 py-0.5 font-mono font-bold text-slate-900 border border-slate-200 shadow-2xs dark:bg-zinc-800 dark:border-white/10 dark:text-white">
                                        {createdCreds.password}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500">Portal Login</span>
                                    <span className="text-[11px] font-medium text-slate-700 dark:text-zinc-300">
                                        {typeof window !== 'undefined' ? `${window.location.origin}/login` : 'https://lmis.teknalogi.id/login'}
                                    </span>
                                </div>
                            </div>

                            <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                                Berikan rincian akun di atas kepada anggota tim agar dapat langsung masuk ke sistem.
                            </p>

                            <div className="flex items-center gap-2 pt-1">
                                <Button
                                    type="button"
                                    onClick={() => {
                                        const origin = typeof window !== 'undefined' ? window.location.origin : 'https://lmis.teknalogi.id';
                                        const text = `Halo ${createdCreds.name},\nAkun RPK Law Firm Workspace Anda telah aktif:\n\n• Email: ${createdCreds.email}\n• Password: ${createdCreds.password}\n• Tautan Login: ${origin}/login\n\nSilakan login dan ganti password Anda jika diperlukan.`;
                                        navigator.clipboard.writeText(text);
                                        setCopied(true);
                                        setTimeout(() => setCopied(false), 2500);
                                    }}
                                    className="flex-1 h-8.5 rounded-lg bg-blue-600 text-xs font-semibold text-white shadow-2xs hover:bg-blue-700 active:scale-95"
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
            />
        </>
    );
}

function RolePermissions({
    roles,
    permissions,
}: {
    roles: Role[];
    permissions: Permission[];
}) {
    return (
        <div className="space-y-3.5">
            {roles.map((role) => (
                <div
                    key={role.id}
                    className="rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]"
                >
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-white/[0.04]">
                        <div className="flex items-center gap-2">
                            <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                                {role.name}
                            </h3>
                            <span className="rounded bg-slate-100 px-1.5 py-0.2 font-mono text-[10px] font-semibold text-slate-600 dark:bg-zinc-800 dark:text-zinc-400">
                                {role.slug}
                            </span>
                            <span className="text-[11px] text-slate-500">
                                · {role.permissions.length} dari {permissions.length} izin aktif
                            </span>
                        </div>
                    </div>

                    <Form
                        {...roleRoutes.update.form(role.id)}
                        className="space-y-3 pt-3"
                    >
                        {({ processing }) => (
                            <>
                                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                    {permissions.map((permission) => {
                                        const isAssigned = role.permissions.some(
                                            (p) => p.id === permission.id,
                                        );

                                        return (
                                            <label
                                                key={permission.id}
                                                className="flex items-start gap-2 rounded-lg border border-slate-200/70 bg-slate-50/60 p-2.5 text-xs transition-colors hover:border-slate-300 hover:bg-white dark:border-white/5 dark:bg-zinc-800/40 dark:hover:bg-zinc-800"
                                            >
                                                <input
                                                    type="checkbox"
                                                    name="permission_ids[]"
                                                    value={permission.id}
                                                    defaultChecked={isAssigned}
                                                    className="mt-0.5 size-3.5 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                                                />
                                                <div className="min-w-0">
                                                    <span className="font-mono text-xs font-semibold text-slate-900 dark:text-white">
                                                        {permission.name}
                                                    </span>
                                                    {permission.description && (
                                                        <p className="truncate text-[10.5px] text-slate-500">
                                                            {permission.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </label>
                                        );
                                    })}
                                </div>

                                <div className="flex justify-end pt-1">
                                    <Button
                                        size="sm"
                                        disabled={processing}
                                        className="h-8 rounded-lg bg-purple-600 px-4 text-xs font-semibold text-white shadow-2xs hover:bg-purple-700"
                                    >
                                        Simpan Izin Role {role.name}
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                </div>
            ))}
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
    onCreated: (creds: { name: string; email: string; password: string }) => void;
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
            <DialogContent className="max-h-[85vh] overflow-y-auto rounded-xl border border-slate-200/80 bg-white p-5 shadow-xl sm:max-w-md dark:border-white/10 dark:bg-[#14161b]">
                <DialogHeader className="border-b border-slate-100 pb-3 dark:border-white/[0.06]">
                    <div className="flex items-center gap-2.5">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                            <UserPlus className="size-4" />
                        </div>
                        <div>
                            <DialogTitle className="text-sm font-bold text-slate-900 dark:text-white">
                                Tambah Anggota Tim / Staf Baru
                            </DialogTitle>
                            <DialogDescription className="text-xs text-slate-500 dark:text-zinc-400">
                                Akun staf akan langsung aktif dan dapat digunakan untuk login.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <Form
                    {...userRoutes.store.form()}
                    className="space-y-3.5 pt-1"
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
                                    Nama Lengkap <span className="text-rose-500">*</span>
                                </Label>
                                <Input
                                    name="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Contoh: Rian Anggara, S.H."
                                    required
                                    className="h-8 rounded-lg border-slate-200 bg-slate-50/60 text-xs text-slate-900 focus:border-blue-500 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-1">
                                <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                                    Alamat Email Resmi <span className="text-rose-500">*</span>
                                </Label>
                                <Input
                                    name="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="rian@rpklawoffice.com"
                                    required
                                    className="h-8 rounded-lg border-slate-200 bg-slate-50/60 text-xs text-slate-900 focus:border-blue-500 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <Field
                                name="position_title"
                                label="Jabatan / Posisi"
                                placeholder="Contoh: Senior Associate"
                            />

                            <div className="grid gap-1">
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                                        Password Akun
                                    </Label>
                                    <span className="text-[10.5px] font-mono font-medium text-slate-400">
                                        Default: password
                                    </span>
                                </div>
                                <Input
                                    name="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Kosongkan jika ingin default: password"
                                    className="h-8 rounded-lg border-slate-200 bg-slate-50/60 text-xs text-slate-900 focus:border-blue-500 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
                                />
                                <InputError message={errors.password} />
                            </div>

                            {/* Live Informative Auth Preview Box */}
                            <div className="rounded-lg border border-blue-100 bg-blue-50/80 p-3 text-xs dark:border-blue-900/40 dark:bg-blue-950/30 space-y-1.5">
                                <div className="flex items-center gap-1.5 font-bold text-blue-900 dark:text-blue-200 text-[11.5px]">
                                    <KeyRound className="size-3.5 text-blue-600 dark:text-blue-400" />
                                    <span>Informasi Akses Login Staf:</span>
                                </div>
                                <div className="space-y-1 text-[11px] text-blue-800/90 dark:text-blue-300">
                                    <p className="flex items-center justify-between">
                                        <span>• Email Login:</span>
                                        <strong className="font-mono text-blue-950 dark:text-blue-100">{email || '(isi email di atas)'}</strong>
                                    </p>
                                    <p className="flex items-center justify-between">
                                        <span>• Password Login:</span>
                                        <code className="rounded bg-white px-1.5 py-0.2 font-mono font-bold text-blue-900 border border-blue-200/60 dark:bg-zinc-800 dark:text-blue-200 dark:border-white/10">
                                            {password || 'password'}
                                        </code>
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2 rounded-lg border border-slate-200/70 bg-slate-50/60 p-3 dark:border-white/[0.06] dark:bg-[#121418]">
                                <Label className="text-xs font-semibold text-slate-900 dark:text-white">
                                    Pilih Role Kewenangan *
                                </Label>
                                <div className="space-y-1.5 pt-0.5">
                                    {roles.map((role) => (
                                        <label
                                            key={role.id}
                                            className="flex cursor-pointer items-center gap-2 rounded-md p-1 text-xs hover:bg-white dark:hover:bg-zinc-800"
                                        >
                                            <input
                                                type="checkbox"
                                                name="role_ids[]"
                                                value={role.id}
                                                className="size-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="font-semibold text-slate-900 dark:text-white">{role.name}</span>
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
                                    className="h-8 rounded-lg border-slate-200 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                                >
                                    Batal
                                </Button>
                                <Button
                                    size="sm"
                                    disabled={processing}
                                    className="h-8 rounded-lg bg-blue-600 px-4 text-xs font-semibold text-white shadow-2xs hover:bg-blue-700 active:scale-95"
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
}: {
    user: User | null;
    roles: Role[];
    onOpenChange: (open: boolean) => void;
}) {
    const getInitials = useInitials();
    if (!user) return null;

    const assignedRoleIds = new Set(user.roles.map((role) => role.id));

    return (
        <Dialog open={!!user} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[85vh] overflow-y-auto rounded-xl border border-slate-200/80 bg-white p-5 shadow-xl sm:max-w-md dark:border-white/10 dark:bg-[#14161b]">
                <DialogHeader className="border-b border-slate-100 pb-3 dark:border-white/[0.06]">
                    <DialogTitle className="text-sm font-bold text-slate-900 dark:text-white">
                        Kelola Pengguna: {user.name}
                    </DialogTitle>
                    <DialogDescription className="text-xs text-slate-500">
                        Perbarui role kewenangan, jabatan, dan status aktif akun.
                    </DialogDescription>
                </DialogHeader>

                <Form
                    {...userRoutes.update.form(user.id)}
                    className="space-y-3.5 pt-1"
                    onSuccess={() => onOpenChange(false)}
                >
                    {({ errors, processing }) => (
                        <>
                            {/* Avatar Display */}
                            <div className="flex items-center gap-2.5 rounded-lg border border-slate-200/70 bg-slate-50/60 p-2.5 dark:border-white/5 dark:bg-[#121418]">
                                <Avatar className="size-10 shrink-0 rounded-lg border border-slate-200 shadow-2xs dark:border-white/10">
                                    <AvatarImage src={user.avatar_url ?? undefined} />
                                    <AvatarFallback className="rounded-lg bg-blue-50 text-xs font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
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
                                        <span className="mt-0.5 inline-block rounded bg-blue-50 px-1.5 py-0.2 font-mono text-[9.5px] font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
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
                            <Field
                                name="position_title"
                                label="Jabatan / Posisi"
                                defaultValue={user.position_title ?? ''}
                            />
                            <Field
                                name="password"
                                label="Ubah Password (Opsional)"
                                type="password"
                                placeholder="Kosongkan jika tidak ingin mengubah password saat ini"
                            />

                            <div className="space-y-2 rounded-lg border border-slate-200/70 bg-slate-50/60 p-3 dark:border-white/[0.06] dark:bg-[#121418]">
                                <Label className="text-xs font-semibold text-slate-900 dark:text-white">
                                    Role Kewenangan
                                </Label>
                                <div className="space-y-1.5 pt-0.5">
                                    {roles.map((role) => (
                                        <label
                                            key={role.id}
                                            className="flex cursor-pointer items-center gap-2 rounded-md p-1 text-xs hover:bg-white dark:hover:bg-zinc-800"
                                        >
                                            <input
                                                type="checkbox"
                                                name="role_ids[]"
                                                value={role.id}
                                                defaultChecked={assignedRoleIds.has(role.id)}
                                                className="size-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="font-semibold text-slate-900 dark:text-white">{role.name}</span>
                                        </label>
                                    ))}
                                </div>
                                <InputError message={errors.role_ids} />
                            </div>

                            <div className="flex items-center gap-2 rounded-lg border border-slate-200/70 bg-slate-50/60 p-2.5 dark:border-white/5 dark:bg-zinc-800/40">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    name="is_active"
                                    value="1"
                                    defaultChecked={user.is_active}
                                    className="size-3.5 rounded border-slate-300 text-blue-600"
                                />
                                <Label
                                    htmlFor="is_active"
                                    className="cursor-pointer text-xs font-semibold text-slate-800 dark:text-zinc-200"
                                >
                                    Akun Aktif (Dapat Login &amp; Mengakses Sistem)
                                </Label>
                            </div>

                            <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3 dark:border-white/[0.06]">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onOpenChange(false)}
                                    className="h-8 rounded-lg border-slate-200 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                                >
                                    Batal
                                </Button>
                                <Button
                                    size="sm"
                                    disabled={processing}
                                    className="h-8 rounded-lg bg-blue-600 px-4 text-xs font-semibold text-white shadow-2xs hover:bg-blue-700"
                                >
                                    Simpan Perubahan
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
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
                className="h-8 rounded-lg border-slate-200 bg-slate-50/60 text-xs text-slate-900 focus:border-blue-500 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
            />
        </div>
    );
}

UsersIndex.layout = {
    breadcrumbs: [{ title: 'Pengguna & Akses', href: userRoutes.index() }],
};
