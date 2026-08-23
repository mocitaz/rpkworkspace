import { Form, Head, Link } from '@inertiajs/react';
import {
    Briefcase,
    Building2,
    ChevronDown,
    ExternalLink,
    Grid,
    LayoutList,
    Mail,
    Phone,
    Plus,
    Search,
    UserCheck,
    UserPlus,
    Users,
} from 'lucide-react';
import { useState } from 'react';
import { EmptyState } from '@/components/empty-state';
import InputError from '@/components/input-error';
import { Pagination } from '@/components/pagination';
import { Button } from '@/components/ui/button';
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
import * as clientRoutes from '@/routes/clients';
import * as contactRoutes from '@/routes/contacts';

type Contact = {
    id: string;
    full_name: string;
    first_name: string;
    last_name?: string;
    job_title?: string;
    organization_name?: string;
    email?: string;
    phone?: string;
    mobile?: string;
    notes?: string;
    client?: { id: string; display_name: string };
};

type Page = {
    data: Contact[];
    links: { url: string | null; label: string; active: boolean }[];
    total: number;
};

export default function ContactsIndex({
    contacts,
    clients,
    metrics,
    filters,
    can,
}: {
    contacts: Page;
    clients: { id: string; display_name: string }[];
    metrics: {
        total: number;
        client_linked: number;
        independent: number;
        connected_clients: number;
    };
    filters: { search?: string; client_id?: string };
    can: { create: boolean };
}) {
    const [open, setOpen] = useState(() =>
        new URLSearchParams(window.location.search).has('create'),
    );
    const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

    return (
        <>
            <Head title="Kontak Profesional & Perwakilan" />

            <div className="min-h-screen w-full bg-[#fbfbfa] text-[#111111] antialiased dark:bg-[#121212] dark:text-[#fbfbfa]">
                <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
                    {/* Header Minimalist Notion */}
                    <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div className="space-y-1">
                            <h1 className="text-2xl font-bold tracking-tight text-[#111111] dark:text-white">
                                Kontak Profesional &amp; Perwakilan
                            </h1>
                            <p className="text-xs text-[#787774] dark:text-zinc-400">
                                Direktori buku telepon resmi: PIC klien korporasi, saksi ahli, konsultan luar, dan stakeholder perkara.
                            </p>
                        </div>

                        {/* Right: Actions */}
                        {can.create && (
                            <div className="flex shrink-0 items-center gap-2">
                                <Button
                                    onClick={() => setOpen(true)}
                                    className="h-8 rounded-lg bg-[#111111] px-3.5 text-xs font-semibold text-white shadow-2xs transition-colors hover:bg-black active:scale-95 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                                >
                                    <UserPlus className="mr-1.5 size-3.5" />
                                    Tambah Kontak Baru
                                </Button>
                            </div>
                        )}
                    </header>

                    {/* Compact 4-Column Stat Strips (h-[76px]) */}
                    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {/* 1. Total Kontak */}
                        <div className="flex h-[76px] flex-col justify-between rounded-xl border border-black/[0.07] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                            <div className="flex items-center justify-between text-[11px] font-medium text-[#787774] dark:text-zinc-400">
                                <span>Total Direktori</span>
                                <Users className="size-3.5 text-[#1f6c9f] dark:text-sky-400" />
                            </div>
                            <div className="flex items-baseline justify-between">
                                <span className="font-mono text-base font-bold tracking-tight text-[#111111] dark:text-white">
                                    {metrics.total} Kontak
                                </span>
                                <span className="text-[10px] text-[#787774] dark:text-zinc-400">
                                    tercatat di firma
                                </span>
                            </div>
                        </div>

                        {/* 2. Perwakilan Klien */}
                        <div className="flex h-[76px] flex-col justify-between rounded-xl border border-black/[0.07] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                            <div className="flex items-center justify-between text-[11px] font-medium text-[#787774] dark:text-zinc-400">
                                <span>Perwakilan Klien</span>
                                <Building2 className="size-3.5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div className="flex items-baseline justify-between">
                                <span className="font-mono text-base font-bold tracking-tight text-purple-600 dark:text-purple-400">
                                    {metrics.client_linked} PIC
                                </span>
                                <span className="text-[10px] text-[#787774] dark:text-zinc-400">
                                    terhubung klien
                                </span>
                            </div>
                        </div>

                        {/* 3. Pihak Independen / Mitra */}
                        <div className="flex h-[76px] flex-col justify-between rounded-xl border border-black/[0.07] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                            <div className="flex items-center justify-between text-[11px] font-medium text-[#787774] dark:text-zinc-400">
                                <span>Eksternal / Mitra</span>
                                <Briefcase className="size-3.5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div className="flex items-baseline justify-between">
                                <span className="font-mono text-base font-bold tracking-tight text-amber-600 dark:text-amber-400">
                                    {metrics.independent} Pihak
                                </span>
                                <span className="text-[10px] text-[#787774] dark:text-zinc-400">
                                    saksi, ahli, mitra
                                </span>
                            </div>
                        </div>

                        {/* 4. Entitas Terwakili */}
                        <div className="flex h-[76px] flex-col justify-between rounded-xl border border-black/[0.07] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                            <div className="flex items-center justify-between text-[11px] font-medium text-[#787774] dark:text-zinc-400">
                                <span>Cakupan Klien</span>
                                <UserCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div className="flex items-baseline justify-between">
                                <span className="font-mono text-base font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                                    {metrics.connected_clients} Entitas
                                </span>
                                <span className="text-[10px] text-[#787774] dark:text-zinc-400">
                                    memiliki kontak PIC
                                </span>
                            </div>
                        </div>
                    </section>

                    {/* Filter Bar & View Toggle */}
                    <div className="flex flex-col gap-2 rounded-xl border border-black/[0.08] bg-white p-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] sm:flex-row sm:items-center dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                        <Form
                            {...contactRoutes.index.form()}
                            className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center"
                        >
                            <div className="relative flex-1">
                                <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-[#787774]" />
                                <Input
                                    name="search"
                                    defaultValue={filters.search}
                                    placeholder="Cari nama kontak, jabatan, organisasi, atau email..."
                                    className="h-8 w-full rounded-lg border border-black/[0.08] bg-[#fbfbfa] pl-8 text-xs text-[#111111] outline-none placeholder:text-[#787774] focus:border-black/20 focus:bg-white dark:border-white/[0.1] dark:bg-[#121212] dark:text-white"
                                />
                            </div>

                            <div className="relative min-w-[200px]">
                                <select
                                    name="client_id"
                                    defaultValue={filters.client_id ?? ''}
                                    className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-black/[0.08] bg-[#fbfbfa] pl-3 pr-8 text-xs font-medium text-[#111111] outline-none transition-colors hover:bg-black/[0.02] focus:border-black/20 focus:bg-white dark:border-white/[0.1] dark:bg-[#121212] dark:text-zinc-200"
                                >
                                    <option value="">Semua Klien &amp; Entitas</option>
                                    {clients.map((client) => (
                                        <option key={client.id} value={client.id}>
                                            {client.display_name}
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

                        {/* View Switcher */}
                        <div className="flex items-center gap-1 border-t border-black/[0.04] pt-2 sm:border-t-0 sm:border-l sm:pl-2 sm:pt-0 dark:border-white/[0.06]">
                            <button
                                type="button"
                                onClick={() => setViewMode('table')}
                                className={`flex size-7 items-center justify-center rounded-md text-xs transition-colors ${
                                    viewMode === 'table'
                                        ? 'bg-black/[0.06] text-[#111111] dark:bg-white/[0.1] dark:text-white'
                                        : 'text-[#787774] hover:bg-black/[0.03] hover:text-[#111111]'
                                }`}
                                title="Tampilan Tabel Database"
                            >
                                <LayoutList className="size-3.5" />
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode('cards')}
                                className={`flex size-7 items-center justify-center rounded-md text-xs transition-colors ${
                                    viewMode === 'cards'
                                        ? 'bg-black/[0.06] text-[#111111] dark:bg-white/[0.1] dark:text-white'
                                        : 'text-[#787774] hover:bg-black/[0.03] hover:text-[#111111]'
                                }`}
                                title="Tampilan Kartu Grid"
                            >
                                <Grid className="size-3.5" />
                            </button>
                        </div>
                    </div>

                    {/* Contacts Content */}
                    {contacts.data.length === 0 ? (
                        <div className="flex min-h-[380px] items-center justify-center rounded-xl border border-black/[0.08] bg-white p-12 text-center shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                            <EmptyState
                                title="Belum ada kontak yang sesuai pencarian"
                                description="Tambahkan kontak perwakilan baru atau sesuaikan kata kunci filter pencarian Anda."
                            />
                        </div>
                    ) : viewMode === 'table' ? (
                        /* Notion Database Table View */
                        <div className="overflow-hidden rounded-xl border border-black/[0.08] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead>
                                        <tr className="border-b border-black/[0.04] bg-[#fafafa] text-[10px] font-semibold uppercase tracking-wider text-[#787774] dark:border-white/[0.06] dark:bg-[#161618]">
                                            <th className="py-2.5 pl-4 pr-3">Kontak &amp; Identitas</th>
                                            <th className="py-2.5 px-3">Entitas / Klien Terkait</th>
                                            <th className="py-2.5 px-3">Email Resmi</th>
                                            <th className="py-2.5 px-3">Nomor Telepon / HP</th>
                                            <th className="py-2.5 pl-3 pr-4 text-right">Catatan</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-black/[0.04] dark:divide-white/[0.05]">
                                        {contacts.data.map((contact) => {
                                            const initials = contact.full_name
                                                .split(' ')
                                                .map((n) => n[0])
                                                .slice(0, 2)
                                                .join('')
                                                .toUpperCase();

                                            return (
                                                <tr
                                                    key={contact.id}
                                                    className="group transition-colors hover:bg-black/[0.01] dark:hover:bg-white/[0.02]"
                                                >
                                                    {/* Contact Name & Title */}
                                                    <td className="py-3 pl-4 pr-3">
                                                        <div className="flex items-center gap-2.5">
                                                            <div className="flex size-7.5 shrink-0 items-center justify-center rounded-full border border-black/10 bg-[#fafafa] font-semibold text-[11px] text-[#111111] dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200">
                                                                {initials}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <span className="font-semibold text-[#111111] dark:text-white">
                                                                    {contact.full_name}
                                                                </span>
                                                                <p className="text-[11px] text-[#787774] dark:text-zinc-400">
                                                                    {contact.job_title ?? 'Kontak Perwakilan'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Client Entity Pill */}
                                                    <td className="py-3 px-3 whitespace-nowrap">
                                                        {contact.client ? (
                                                            <Link
                                                                href={clientRoutes.show(contact.client.id)}
                                                                className="inline-flex max-w-[240px] items-center gap-1.5 truncate rounded bg-[#e1f3fe] px-2 py-0.5 text-[11px] font-medium text-[#1f6c9f] hover:underline dark:bg-blue-950/40 dark:text-sky-300"
                                                            >
                                                                <Building2 className="size-3 shrink-0" />
                                                                <span className="truncate">{contact.client.display_name}</span>
                                                                <ExternalLink className="size-2.5 shrink-0 opacity-60" />
                                                            </Link>
                                                        ) : contact.organization_name ? (
                                                            <span className="inline-flex max-w-[240px] items-center gap-1.5 truncate rounded bg-black/[0.04] px-2 py-0.5 text-[11px] font-medium text-[#787774] dark:bg-white/[0.06] dark:text-zinc-300">
                                                                <Building2 className="size-3 shrink-0" />
                                                                <span className="truncate">{contact.organization_name}</span>
                                                            </span>
                                                        ) : (
                                                            <span className="text-[11px] text-[#787774]">
                                                                Pihak Independen
                                                            </span>
                                                        )}
                                                    </td>

                                                    {/* Email */}
                                                    <td className="py-3 px-3 whitespace-nowrap">
                                                        {contact.email ? (
                                                            <a
                                                                href={`mailto:${contact.email}`}
                                                                className="flex items-center gap-1.5 text-xs text-[#787774] hover:text-blue-600 dark:hover:text-sky-400"
                                                            >
                                                                <Mail className="size-3.5 shrink-0 text-[#787774]" />
                                                                <span className="font-mono text-[11px]">{contact.email}</span>
                                                            </a>
                                                        ) : (
                                                            <span className="text-[11px] text-[#787774]">
                                                                —
                                                            </span>
                                                        )}
                                                    </td>

                                                    {/* Phone */}
                                                    <td className="py-3 px-3 whitespace-nowrap font-mono text-[11px] text-[#787774] dark:text-zinc-300">
                                                        {contact.mobile || contact.phone ? (
                                                            <a
                                                                href={`tel:${contact.mobile || contact.phone}`}
                                                                className="flex items-center gap-1.5 text-xs text-[#787774] hover:text-emerald-600 dark:hover:text-emerald-400"
                                                            >
                                                                <Phone className="size-3.5 shrink-0 text-[#787774]" />
                                                                <span>{contact.mobile || contact.phone}</span>
                                                            </a>
                                                        ) : (
                                                            <span>—</span>
                                                        )}
                                                    </td>

                                                    {/* Notes */}
                                                    <td className="py-3 pl-3 pr-4 text-right max-w-xs truncate text-[11px] text-[#787774]">
                                                        {contact.notes ? contact.notes : '—'}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination Footer */}
                            <div className="flex flex-col justify-between gap-3 border-t border-black/[0.04] bg-[#fafafa] px-4 py-2.5 sm:flex-row sm:items-center dark:border-white/[0.06] dark:bg-[#161618]">
                                <span className="text-xs text-[#787774] dark:text-zinc-400">
                                    Menampilkan <span className="font-semibold text-[#111111] dark:text-white">{contacts.data.length}</span> dari{' '}
                                    <span className="font-semibold text-[#111111] dark:text-white">{contacts.total}</span> kontak
                                </span>
                                <Pagination links={contacts.links} />
                            </div>
                        </div>
                    ) : (
                        /* Grid Cards View */
                        <div className="space-y-4">
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                {contacts.data.map((contact) => (
                                    <article
                                        key={contact.id}
                                        className="flex flex-col justify-between rounded-xl border border-black/[0.08] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all hover:border-black/20 dark:border-white/[0.08] dark:bg-[#1a1a1c] dark:hover:border-white/20"
                                    >
                                        <div className="space-y-3">
                                            {/* Avatar & Name */}
                                            <div className="flex items-start gap-2.5">
                                                <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-black/10 bg-[#fafafa] text-xs font-bold text-[#111111] dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-300">
                                                    {contact.full_name
                                                        .split(' ')
                                                        .map((n) => n[0])
                                                        .slice(0, 2)
                                                        .join('')}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <h3 className="truncate text-xs font-bold text-[#111111] dark:text-white">
                                                        {contact.full_name}
                                                    </h3>
                                                    <p className="truncate text-[11px] text-[#787774] dark:text-zinc-400">
                                                        {contact.job_title ?? 'Kontak Perwakilan'}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Entity Tag */}
                                            <div>
                                                {contact.client ? (
                                                    <Link
                                                        href={clientRoutes.show(contact.client.id)}
                                                        className="inline-flex max-w-full items-center gap-1.5 truncate rounded bg-[#e1f3fe] px-2 py-0.5 text-[10px] font-medium text-[#1f6c9f] hover:underline dark:bg-blue-950/40 dark:text-sky-300"
                                                    >
                                                        <Building2 className="size-3 shrink-0" />
                                                        <span className="truncate">{contact.client.display_name}</span>
                                                        <ExternalLink className="size-2.5 shrink-0 opacity-60" />
                                                    </Link>
                                                ) : contact.organization_name ? (
                                                    <span className="inline-flex max-w-full items-center gap-1.5 truncate rounded bg-black/[0.04] px-2 py-0.5 text-[10px] font-medium text-[#787774] dark:bg-white/[0.06] dark:text-zinc-300">
                                                        <Building2 className="size-3 shrink-0" />
                                                        <span className="truncate">{contact.organization_name}</span>
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 rounded bg-black/[0.04] px-2 py-0.5 text-[10px] font-medium text-[#787774] dark:bg-white/[0.06] dark:text-zinc-400">
                                                        Pihak Independen
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Communication Details */}
                                        <div className="mt-3.5 space-y-1.5 border-t border-black/[0.04] pt-3 text-xs dark:border-white/[0.04]">
                                            {contact.email ? (
                                                <a
                                                    href={`mailto:${contact.email}`}
                                                    className="flex items-center gap-2 text-[11px] text-[#787774] hover:text-blue-600 dark:text-zinc-400 dark:hover:text-sky-300"
                                                >
                                                    <Mail className="size-3.5 shrink-0" />
                                                    <span className="truncate font-mono">{contact.email}</span>
                                                </a>
                                            ) : (
                                                <div className="flex items-center gap-2 text-[11px] text-[#787774]/60">
                                                    <Mail className="size-3.5 shrink-0" />
                                                    <span>Email tidak tercatat</span>
                                                </div>
                                            )}

                                            {contact.mobile || contact.phone ? (
                                                <a
                                                    href={`tel:${contact.mobile || contact.phone}`}
                                                    className="flex items-center gap-2 font-mono text-[11px] text-[#111111] hover:text-emerald-600 dark:text-zinc-200 dark:hover:text-emerald-400"
                                                >
                                                    <Phone className="size-3.5 shrink-0 text-[#787774]" />
                                                    <span>{contact.mobile || contact.phone}</span>
                                                </a>
                                            ) : (
                                                <div className="flex items-center gap-2 text-[11px] text-[#787774]/60">
                                                    <Phone className="size-3.5 shrink-0" />
                                                    <span>Telepon tidak tercatat</span>
                                                </div>
                                            )}
                                        </div>
                                    </article>
                                ))}
                            </div>

                            <Pagination links={contacts.links} />
                        </div>
                    )}
                </main>
            </div>

            {/* Modal Dialog: Tambah Kontak */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-h-[85vh] overflow-y-auto rounded-2xl border border-black/[0.08] bg-white p-5 shadow-2xl sm:max-w-lg dark:border-white/10 dark:bg-[#1c1c1e]">
                    <DialogHeader className="border-b border-black/[0.04] pb-3 dark:border-white/[0.04]">
                        <div className="flex items-center gap-2.5">
                            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-black/[0.04] text-[#111111] dark:bg-white/[0.06] dark:text-white">
                                <UserPlus className="size-4" />
                            </div>
                            <div>
                                <DialogTitle className="text-sm font-bold tracking-tight text-[#111111] dark:text-white">
                                    Tambah Kontak Baru
                                </DialogTitle>
                                <DialogDescription className="text-xs text-[#787774] dark:text-zinc-400">
                                    Daftarkan representasi klien, saksi, penasihat luar, atau pemangku kepentingan.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <Form
                        {...contactRoutes.store.form()}
                        className="space-y-3.5 pt-1"
                        resetOnSuccess
                        onSuccess={() => setOpen(false)}
                    >
                        {({ errors, processing }) => (
                            <>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <Field
                                        label="Nama Depan"
                                        name="first_name"
                                        error={errors.first_name}
                                        placeholder="Nama depan"
                                        required
                                    />
                                    <Field
                                        label="Nama Belakang"
                                        name="last_name"
                                        error={errors.last_name}
                                        placeholder="Nama belakang"
                                    />
                                </div>

                                <div className="grid gap-1.5">
                                    <Label htmlFor="client_id" className="text-xs font-medium text-[#2f3437] dark:text-zinc-200">
                                        Terhubung ke Klien (Opsional)
                                    </Label>
                                    <div className="relative">
                                        <select
                                            id="client_id"
                                            name="client_id"
                                            className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-black/[0.08] bg-[#fbfbfa] pl-3 pr-8 text-xs font-medium text-[#111111] outline-none transition-colors hover:bg-black/[0.02] focus:border-black/20 focus:bg-white dark:border-white/10 dark:bg-[#121212] dark:text-zinc-200"
                                        >
                                            <option value="">Independen / Tanpa Relasi Klien Khusus</option>
                                            {clients.map((client) => (
                                                <option key={client.id} value={client.id}>
                                                    {client.display_name}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3 -translate-y-1/2 text-[#787774]" />
                                    </div>
                                    <InputError message={errors.client_id} />
                                </div>

                                <div className="grid gap-3 sm:grid-cols-2">
                                    <Field
                                        label="Jabatan / Posisi"
                                        name="job_title"
                                        error={errors.job_title}
                                        placeholder="Contoh: Direktur Legal, Manager"
                                    />
                                    <Field
                                        label="Nama Organisasi / Lembaga"
                                        name="organization_name"
                                        error={errors.organization_name}
                                        placeholder="Jika bukan klien terdaftar"
                                    />
                                </div>

                                <div className="grid gap-3 sm:grid-cols-2">
                                    <Field
                                        label="Email Resmi"
                                        name="email"
                                        type="email"
                                        error={errors.email}
                                        placeholder="nama@email.com"
                                    />
                                    <Field
                                        label="Nomor Handphone / Ponsel"
                                        name="mobile"
                                        error={errors.mobile}
                                        placeholder="+62 812-xxxx-xxxx"
                                    />
                                </div>

                                <div className="grid gap-1.5">
                                    <Label htmlFor="notes" className="text-xs font-medium text-[#2f3437] dark:text-zinc-200">
                                        Catatan Tambahan
                                    </Label>
                                    <textarea
                                        id="notes"
                                        name="notes"
                                        rows={2}
                                        placeholder="Keterangan relasi, preferensi kontak, atau catatan khusus..."
                                        className="w-full rounded-lg border border-black/[0.08] bg-[#fbfbfa] p-2.5 text-xs leading-relaxed text-[#111111] outline-none transition-colors placeholder:text-[#787774] focus:border-black/20 focus:bg-white dark:border-white/10 dark:bg-[#121212] dark:text-white"
                                    />
                                    <InputError message={errors.notes} />
                                </div>

                                <div className="flex items-center justify-end gap-2 border-t border-black/[0.04] pt-3 dark:border-white/[0.04]">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setOpen(false)}
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
                                                Menyimpan...
                                            </>
                                        ) : (
                                            'Simpan Kontak'
                                        )}
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                </DialogContent>
            </Dialog>
        </>
    );
}

function Field({
    label,
    name,
    error,
    className,
    type = 'text',
    placeholder,
    required = false,
}: {
    label: string;
    name: string;
    error?: string;
    className?: string;
    type?: string;
    placeholder?: string;
    required?: boolean;
}) {
    return (
        <div className={`grid gap-1.5 ${className ?? ''}`}>
            <Label htmlFor={name} className="text-xs font-medium text-[#2f3437] dark:text-zinc-200">
                {label} {required && <span className="text-rose-500">*</span>}
            </Label>
            <Input
                id={name}
                name={name}
                type={type}
                required={required}
                placeholder={placeholder}
                className="h-8 rounded-lg border border-black/[0.08] bg-[#fbfbfa] text-xs text-[#111111] transition-colors focus:border-black/20 focus:bg-white dark:border-white/10 dark:bg-[#121212] dark:text-white"
            />
            <InputError message={error} />
        </div>
    );
}

ContactsIndex.layout = {
    breadcrumbs: [{ title: 'Kontak', href: contactRoutes.index() }],
};
