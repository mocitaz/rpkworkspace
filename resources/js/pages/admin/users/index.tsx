import { Form, Head } from '@inertiajs/react';
import {
    CheckCircle2,
    ChevronDown,
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
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
    const [tab, setTab] = useState<'users' | 'roles'>('users');
    const [editing, setEditing] = useState<User | null>(null);
    const [inviteOpen, setInviteOpen] = useState(false);

    return (
        <>
            <Head title="Manajemen Pengguna & Hak Akses" />

            <div className="min-h-screen w-full bg-[#fbfbfa] text-[#111111] antialiased dark:bg-[#121212] dark:text-[#fbfbfa]">
                <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
                    {/* Header Minimalist Notion */}
                    <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div className="space-y-1">
                            <h1 className="text-2xl font-bold tracking-tight text-[#111111] dark:text-white">
                                Pengguna &amp; Hak Akses
                            </h1>
                            <p className="text-xs text-[#787774] dark:text-zinc-400">
                                Undang anggota tim kantor hukum, atur jabatan, dan konfigurasi matriks perizinan (permissions).
                            </p>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex shrink-0 items-center gap-2">
                            <Button
                                onClick={() => setInviteOpen(true)}
                                className="h-8 rounded-lg bg-[#111111] px-3.5 text-xs font-semibold text-white shadow-2xs transition-colors hover:bg-black active:scale-95 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                            >
                                <UserPlus className="mr-1.5 size-3.5" />
                                Undang Pengguna Baru
                            </Button>
                        </div>
                    </header>

                    {/* Compact 4-Column Stat Strips (h-[76px]) */}
                    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {/* 1. Total Pengguna */}
                        <div className="flex h-[76px] flex-col justify-between rounded-xl border border-black/[0.07] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                            <div className="flex items-center justify-between text-[11px] font-medium text-[#787774] dark:text-zinc-400">
                                <span>Total Pengguna</span>
                                <Users className="size-3.5 text-[#1f6c9f] dark:text-sky-400" />
                            </div>
                            <div className="flex items-baseline justify-between">
                                <span className="font-mono text-base font-bold tracking-tight text-[#111111] dark:text-white">
                                    {metrics.total} Anggota
                                </span>
                                <span className="text-[10px] text-[#787774] dark:text-zinc-400">
                                    terdaftar
                                </span>
                            </div>
                        </div>

                        {/* 2. Pengguna Aktif */}
                        <div className="flex h-[76px] flex-col justify-between rounded-xl border border-black/[0.07] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                            <div className="flex items-center justify-between text-[11px] font-medium text-[#787774] dark:text-zinc-400">
                                <span>Pengguna Aktif</span>
                                <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div className="flex items-baseline justify-between">
                                <span className="font-mono text-base font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                                    {metrics.active} Aktif
                                </span>
                                <span className="text-[10px] text-[#787774] dark:text-zinc-400">
                                    dapat bertugas
                                </span>
                            </div>
                        </div>

                        {/* 3. Struktur Role */}
                        <div className="flex h-[76px] flex-col justify-between rounded-xl border border-black/[0.07] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                            <div className="flex items-center justify-between text-[11px] font-medium text-[#787774] dark:text-zinc-400">
                                <span>Struktur Role</span>
                                <ShieldCheck className="size-3.5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div className="flex items-baseline justify-between">
                                <span className="font-mono text-base font-bold tracking-tight text-purple-600 dark:text-purple-400">
                                    {metrics.roles_count} Role
                                </span>
                                <span className="text-[10px] text-[#787774] dark:text-zinc-400">
                                    partner &amp; staf
                                </span>
                            </div>
                        </div>

                        {/* 4. Hak Akses Terdefinisi */}
                        <div className="flex h-[76px] flex-col justify-between rounded-xl border border-black/[0.07] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                            <div className="flex items-center justify-between text-[11px] font-medium text-[#787774] dark:text-zinc-400">
                                <span>Matriks Permission</span>
                                <KeyRound className="size-3.5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div className="flex items-baseline justify-between">
                                <span className="font-mono text-base font-bold tracking-tight text-amber-600 dark:text-amber-400">
                                    {metrics.permissions_count} Izin
                                </span>
                                <span className="text-[10px] text-[#787774] dark:text-zinc-400">
                                    hak akses granular
                                </span>
                            </div>
                        </div>
                    </section>

                    {/* Segmented View Pills (Notion Style) */}
                    <div className="flex items-center gap-1 rounded-lg border border-black/[0.06] bg-[#f0f0ef] p-1 w-fit dark:border-white/[0.06] dark:bg-zinc-800">
                        <button
                            type="button"
                            onClick={() => setTab('users')}
                            className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-semibold transition-all ${
                                tab === 'users'
                                    ? 'bg-white text-[#111111] shadow-2xs dark:bg-[#1c1c1e] dark:text-white'
                                    : 'text-[#787774] hover:text-[#111111] dark:hover:text-white'
                            }`}
                        >
                            <Users className="size-3.5" />
                            Daftar Pengguna ({users.total})
                        </button>
                        <button
                            type="button"
                            onClick={() => setTab('roles')}
                            className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-semibold transition-all ${
                                tab === 'roles'
                                    ? 'bg-white text-[#111111] shadow-2xs dark:bg-[#1c1c1e] dark:text-white'
                                    : 'text-[#787774] hover:text-[#111111] dark:hover:text-white'
                            }`}
                        >
                            <KeyRound className="size-3.5" />
                            Role &amp; Matriks Permission
                        </button>
                    </div>

                    {tab === 'users' ? (
                        <>
                            {/* Search & Filter Bar */}
                            <Form
                                {...userRoutes.index.form()}
                                className="flex flex-col gap-2 rounded-xl border border-black/[0.08] bg-white p-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] sm:flex-row sm:items-center dark:border-white/[0.08] dark:bg-[#1a1a1c]"
                            >
                                <div className="relative flex-1">
                                    <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-[#787774]" />
                                    <Input
                                        name="search"
                                        defaultValue={filters.search}
                                        placeholder="Cari nama, email, atau jabatan..."
                                        className="h-8 w-full rounded-lg border border-black/[0.08] bg-[#fbfbfa] pl-8 text-xs text-[#111111] outline-none placeholder:text-[#787774] focus:border-black/20 focus:bg-white dark:border-white/[0.1] dark:bg-[#121212] dark:text-white"
                                    />
                                </div>

                                <div className="relative min-w-[180px]">
                                    <select
                                        name="role_id"
                                        defaultValue={filters.role_id ?? ''}
                                        className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-black/[0.08] bg-[#fbfbfa] pl-3 pr-8 text-xs font-medium text-[#111111] outline-none transition-colors hover:bg-black/[0.02] focus:border-black/20 focus:bg-white dark:border-white/[0.1] dark:bg-[#121212] dark:text-zinc-200"
                                    >
                                        <option value="">Semua Role</option>
                                        {roles.map((r) => (
                                            <option key={r.id} value={r.id}>
                                                {r.name}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3 -translate-y-1/2 text-[#787774]" />
                                </div>

                                <Button
                                    type="submit"
                                    variant="outline"
                                    className="h-8 shrink-0 rounded-lg border-black/10 bg-white px-3.5 text-xs font-medium text-[#111111] hover:bg-black/[0.03] dark:border-white/10 dark:bg-[#1c1c1e] dark:text-zinc-200"
                                >
                                    Filter
                                </Button>
                            </Form>

                            {/* Users Table Card */}
                            <div className="overflow-hidden rounded-xl border border-black/[0.08] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs">
                                        <thead>
                                            <tr className="border-b border-black/[0.04] bg-[#fafafa] text-[10px] font-semibold uppercase tracking-wider text-[#787774] dark:border-white/[0.06] dark:bg-[#161618]">
                                                <th className="py-2.5 pl-4 pr-3">Pengguna / Identitas</th>
                                                <th className="py-2.5 px-3">Role Kewenangan</th>
                                                <th className="py-2.5 px-3 text-center">Status</th>
                                                <th className="py-2.5 pl-3 pr-4 text-right">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-black/[0.04] dark:divide-white/[0.05]">
                                            {users.data.map((user) => {
                                                const initials = user.name
                                                    .split(' ')
                                                    .map((n) => n[0])
                                                    .slice(0, 2)
                                                    .join('')
                                                    .toUpperCase();

                                                return (
                                                    <tr
                                                        key={user.id}
                                                        className="group transition-colors hover:bg-black/[0.01] dark:hover:bg-white/[0.02]"
                                                    >
                                                        {/* Avatar & User Info */}
                                                        <td className="py-3 pl-4 pr-3">
                                                            <div className="flex items-center gap-2.5">
                                                                <div className="relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-black/10 bg-[#fafafa] font-semibold text-[#111111] shadow-2xs dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200">
                                                                    {user.avatar_url ? (
                                                                        <img
                                                                            src={user.avatar_url}
                                                                            alt={user.name}
                                                                            className="size-full object-cover"
                                                                        />
                                                                    ) : (
                                                                        <span className="text-[11px]">{initials}</span>
                                                                    )}
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <span className="font-semibold text-[#111111] dark:text-white">
                                                                        {user.name}
                                                                    </span>
                                                                    <p className="text-[11px] text-[#787774] dark:text-zinc-400">
                                                                        {user.email}
                                                                        {user.position_title ? ` · ${user.position_title}` : ''}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        {/* Roles */}
                                                        <td className="py-3 px-3 whitespace-nowrap">
                                                            <div className="flex flex-wrap gap-1">
                                                                {user.roles.length > 0 ? (
                                                                    user.roles.map((r) => (
                                                                        <span
                                                                            key={r.id}
                                                                            className="rounded bg-black/[0.04] px-1.5 py-0.2 text-[10px] font-medium text-[#787774] dark:bg-white/[0.06] dark:text-zinc-300"
                                                                        >
                                                                            {r.name}
                                                                        </span>
                                                                    ))
                                                                ) : (
                                                                    <span className="text-[11px] text-[#787774]">
                                                                        Tanpa Role
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>

                                                        {/* Status */}
                                                        <td className="py-3 px-3 text-center whitespace-nowrap">
                                                            <StatusBadge
                                                                value={user.is_active ? 'active' : 'inactive'}
                                                            />
                                                        </td>

                                                        {/* Actions */}
                                                        <td className="py-3 pl-3 pr-4 text-right whitespace-nowrap">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => setEditing(user)}
                                                                className="h-7 rounded-md border-black/10 bg-white px-2.5 text-xs font-medium text-[#111111] hover:bg-black/[0.03] dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200"
                                                            >
                                                                <Pencil className="mr-1 size-3 text-[#787774]" />
                                                                Kelola
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="flex flex-col justify-between gap-3 border-t border-black/[0.04] bg-[#fafafa] px-4 py-2.5 sm:flex-row sm:items-center dark:border-white/[0.06] dark:bg-[#161618]">
                                    <span className="text-xs text-[#787774] dark:text-zinc-400">
                                        Menampilkan <span className="font-semibold text-[#111111] dark:text-white">{users.data.length}</span> dari{' '}
                                        <span className="font-semibold text-[#111111] dark:text-white">{users.total}</span> pengguna
                                    </span>
                                    <Pagination links={users.links} />
                                </div>
                            </div>
                        </>
                    ) : (
                        <RolePermissions roles={roles} permissions={permissions} />
                    )}
                </main>
            </div>

            {/* Modal: Undang Pengguna Baru */}
            <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
                <DialogContent className="max-h-[85vh] overflow-y-auto rounded-2xl border border-black/[0.08] bg-white p-5 shadow-2xl sm:max-w-md dark:border-white/10 dark:bg-[#1c1c1e]">
                    <DialogHeader className="border-b border-black/[0.04] pb-3 dark:border-white/[0.04]">
                        <div className="flex items-center gap-2.5">
                            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-black/[0.04] text-[#111111] dark:bg-white/[0.06] dark:text-white">
                                <UserPlus className="size-4" />
                            </div>
                            <div>
                                <DialogTitle className="text-sm font-bold tracking-tight text-[#111111] dark:text-white">
                                    Undang Anggota Tim Baru
                                </DialogTitle>
                                <DialogDescription className="text-xs text-[#787774] dark:text-zinc-400">
                                    Tautan pengaturan kata sandi akan dikirim langsung ke email anggota.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <Form
                        {...userRoutes.store.form()}
                        className="space-y-3.5 pt-1"
                        onSuccess={() => setInviteOpen(false)}
                    >
                        {({ errors, processing }) => (
                            <>
                                <Field name="name" label="Nama Lengkap" placeholder="Contoh: Rian Anggara, S.H." required />
                                <Field name="email" label="Alamat Email Resmi" type="email" placeholder="rian@raflaw.co.id" required />
                                <Field name="position_title" label="Jabatan / Posisi" placeholder="Contoh: Senior Associate" />

                                <div className="space-y-2 rounded-xl border border-black/[0.08] bg-[#fafafa] p-3 dark:border-white/[0.08] dark:bg-zinc-800/40">
                                    <Label className="text-xs font-bold text-[#111111] dark:text-white">
                                        Pilih Role Kewenangan *
                                    </Label>
                                    <div className="space-y-1.5 pt-1">
                                        {roles.map((role) => (
                                            <label
                                                key={role.id}
                                                className="flex items-center gap-2 text-xs font-medium cursor-pointer hover:text-blue-600"
                                            >
                                                <input
                                                    type="checkbox"
                                                    name="role_ids[]"
                                                    value={role.id}
                                                    className="size-3.5 rounded border-zinc-300 text-black focus:ring-black"
                                                />
                                                <span>{role.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                    <InputError message={errors.role_ids} />
                                </div>

                                <div className="flex items-center justify-end gap-2 border-t border-black/[0.04] pt-3 dark:border-white/[0.04]">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setInviteOpen(false)}
                                        className="h-8 rounded-lg border-black/10 bg-white px-3 text-xs font-medium text-[#111111] hover:bg-black/[0.03]"
                                    >
                                        Batal
                                    </Button>
                                    <Button
                                        disabled={processing}
                                        className="h-8 rounded-lg bg-[#111111] px-4 text-xs font-semibold text-white shadow-2xs hover:bg-black active:scale-95 dark:bg-white dark:text-black"
                                    >
                                        {processing ? (
                                            <>
                                                <Spinner className="mr-1.5 size-3.5" />
                                                Mengirim Undangan...
                                            </>
                                        ) : (
                                            'Kirim Undangan'
                                        )}
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
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
        <div className="space-y-4">
            {roles.map((role) => (
                <div
                    key={role.id}
                    className="rounded-xl border border-black/[0.08] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]"
                >
                    <div className="flex items-center justify-between border-b border-black/[0.04] pb-3 dark:border-white/[0.04]">
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-xs font-bold text-[#111111] dark:text-white">
                                    {role.name}
                                </h3>
                                <span className="font-mono text-[10px] text-[#787774]">
                                    ({role.slug})
                                </span>
                            </div>
                            <p className="mt-0.5 text-[11px] text-[#787774]">
                                Role memiliki {role.permissions.length} dari {permissions.length} hak akses aktif.
                            </p>
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
                                                className="flex items-start gap-2 rounded-lg border border-black/[0.06] bg-[#fafafa] p-2 text-xs transition-colors hover:bg-black/[0.02] dark:border-white/5 dark:bg-zinc-800/40"
                                            >
                                                <input
                                                    type="checkbox"
                                                    name="permission_ids[]"
                                                    value={permission.id}
                                                    defaultChecked={isAssigned}
                                                    className="mt-0.5 size-3.5 rounded border-zinc-300 text-black focus:ring-black"
                                                />
                                                <div className="min-w-0">
                                                    <span className="font-mono text-[11px] font-semibold text-[#111111] dark:text-white">
                                                        {permission.name}
                                                    </span>
                                                    {permission.description && (
                                                        <p className="text-[10px] text-[#787774] truncate">
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
                                        disabled={processing}
                                        className="h-7.5 rounded-lg bg-[#111111] px-3.5 text-xs font-semibold text-white hover:bg-black dark:bg-white dark:text-black"
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

function EditUserDialog({
    user,
    roles,
    onOpenChange,
}: {
    user: User | null;
    roles: Role[];
    onOpenChange: (open: boolean) => void;
}) {
    if (!user) return null;

    const assignedRoleIds = new Set(user.roles.map((role) => role.id));

    return (
        <Dialog open={!!user} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[85vh] overflow-y-auto rounded-2xl border border-black/[0.08] bg-white p-5 shadow-2xl sm:max-w-md dark:border-white/10 dark:bg-[#1c1c1e]">
                <DialogHeader className="border-b border-black/[0.04] pb-3 dark:border-white/[0.04]">
                    <DialogTitle className="text-sm font-bold text-[#111111] dark:text-white">
                        Kelola Pengguna: {user.name}
                    </DialogTitle>
                    <DialogDescription className="text-xs text-[#787774]">
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
                            <div className="flex items-center gap-2.5 rounded-lg border border-black/[0.06] bg-[#fafafa] p-2.5 dark:border-white/5 dark:bg-zinc-800/40">
                                <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-black/10 bg-white font-semibold text-[#111111] shadow-2xs dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200">
                                    {user.avatar_url ? (
                                        <img
                                            src={user.avatar_url}
                                            alt={user.name}
                                            className="size-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-xs font-semibold">
                                            {user.name
                                                .split(' ')
                                                .map((n) => n[0])
                                                .slice(0, 2)
                                                .join('')
                                                .toUpperCase()}
                                        </span>
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-bold text-[#111111] dark:text-white">{user.name}</p>
                                    <p className="text-[11px] text-[#787774]">{user.email}</p>
                                </div>
                            </div>

                            <Field name="name" label="Nama Lengkap" defaultValue={user.name} required />
                            <Field name="email" label="Alamat Email" type="email" defaultValue={user.email} required />
                            <Field name="position_title" label="Jabatan / Posisi" defaultValue={user.position_title ?? ''} />

                            <div className="space-y-2 rounded-xl border border-black/[0.08] bg-[#fafafa] p-3 dark:border-white/[0.08] dark:bg-zinc-800/40">
                                <Label className="text-xs font-bold text-[#111111] dark:text-white">
                                    Role Kewenangan
                                </Label>
                                <div className="space-y-1.5 pt-1">
                                    {roles.map((role) => (
                                        <label
                                            key={role.id}
                                            className="flex items-center gap-2 text-xs font-medium cursor-pointer"
                                        >
                                            <input
                                                type="checkbox"
                                                name="role_ids[]"
                                                value={role.id}
                                                defaultChecked={assignedRoleIds.has(role.id)}
                                                className="size-3.5 rounded border-zinc-300 text-black focus:ring-black"
                                            />
                                            <span>{role.name}</span>
                                        </label>
                                    ))}
                                </div>
                                <InputError message={errors.role_ids} />
                            </div>

                            <div className="flex items-center gap-2 rounded-lg border border-black/[0.06] bg-[#fafafa] p-2.5 dark:border-white/5 dark:bg-zinc-800/40">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    name="is_active"
                                    value="1"
                                    defaultChecked={user.is_active}
                                    className="size-3.5 rounded border-zinc-300 text-black"
                                />
                                <Label htmlFor="is_active" className="text-xs font-medium cursor-pointer">
                                    Akun Aktif (Dapat Login &amp; Mengakses Sistem)
                                </Label>
                            </div>

                            <div className="flex items-center justify-end gap-2 border-t border-black/[0.04] pt-3 dark:border-white/[0.04]">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => onOpenChange(false)}
                                    className="h-8 rounded-lg border-black/10 bg-white px-3 text-xs font-medium text-[#111111] hover:bg-black/[0.03]"
                                >
                                    Batal
                                </Button>
                                <Button
                                    disabled={processing}
                                    className="h-8 rounded-lg bg-[#111111] px-4 text-xs font-semibold text-white shadow-2xs hover:bg-black active:scale-95 dark:bg-white dark:text-black"
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
        <div className="grid gap-1.5">
            <Label htmlFor={name} className="text-xs font-medium text-[#2f3437] dark:text-zinc-200">
                {label} {required && <span className="text-rose-500">*</span>}
            </Label>
            <Input
                id={name}
                name={name}
                type={type}
                placeholder={placeholder}
                defaultValue={defaultValue}
                required={required}
                className="h-8 rounded-lg border border-black/[0.08] bg-[#fbfbfa] text-xs text-[#111111] transition-colors focus:border-black/20 focus:bg-white dark:border-white/10 dark:bg-[#121212] dark:text-white"
            />
        </div>
    );
}

UsersIndex.layout = {
    breadcrumbs: [{ title: 'Pengguna & Akses', href: userRoutes.index() }],
};
