import { Form, Head, Link, router } from '@inertiajs/react';
import {
    Briefcase,
    Building2,
    Check,
    ChevronDown,
    ChevronRight,
    Copy,
    ExternalLink,
    Grid,
    LayoutList,
    Mail,
    Pencil,
    Phone,
    Plus,
    RotateCcw,
    Search,
    TrendingUp,
    User,
    UserCheck,
    UserPlus,
    Users,
} from 'lucide-react';
import { useMemo, useState } from 'react';
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
    can: { create: boolean; update?: boolean };
}) {
    const [openCreate, setOpenCreate] = useState(() =>
        new URLSearchParams(window.location.search).has('create'),
    );
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [editingContact, setEditingContact] = useState<Contact | null>(null);
    const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
    const [searchQuery, setSearchQuery] = useState(filters.search ?? '');
    const [copiedInfo, setCopiedInfo] = useState(false);

    const handleFilterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const queryParams = new URLSearchParams(window.location.search);
        if (searchQuery.trim()) {
            queryParams.set('search', searchQuery.trim());
        } else {
            queryParams.delete('search');
        }
        router.get(contactRoutes.index(), Object.fromEntries(queryParams.entries()), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleClientFilter = (clientId: string) => {
        const queryParams = new URLSearchParams(window.location.search);
        if (clientId) {
            queryParams.set('client_id', clientId);
        } else {
            queryParams.delete('client_id');
        }
        router.get(contactRoutes.index(), Object.fromEntries(queryParams.entries()), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleResetFilters = () => {
        setSearchQuery('');
        router.get(contactRoutes.index(), {}, { preserveState: true, preserveScroll: true });
    };

    const handleCopyContact = (contact: Contact) => {
        const text = [
            `Nama: ${contact.full_name}`,
            contact.job_title ? `Jabatan: ${contact.job_title}` : '',
            contact.client ? `Klien: ${contact.client.display_name}` : contact.organization_name ? `Organisasi: ${contact.organization_name}` : '',
            contact.email ? `Email: ${contact.email}` : '',
            contact.mobile ? `Ponsel: ${contact.mobile}` : '',
            contact.phone ? `Telepon: ${contact.phone}` : '',
        ].filter(Boolean).join('\n');

        navigator.clipboard.writeText(text);
        setCopiedInfo(true);
        setTimeout(() => setCopiedInfo(false), 2000);
    };

    return (
        <>
            <Head title="Direktori Kontak & Perwakilan Stakeholder" />

            <div className="min-h-screen bg-[#fafafc] pb-20 dark:bg-[#0c0d10]">
                <main className="mx-auto max-w-7xl space-y-5 px-4 py-5 sm:px-6 lg:px-8">
                    {/* 1. Header & Actions */}
                    <div className="flex flex-col justify-between gap-4 border-b border-slate-200/60 pb-5 sm:flex-row sm:items-center dark:border-white/[0.06]">
                        <div className="space-y-1">
                            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                                Direktori Kontak &amp; Perwakilan
                            </h1>
                            <p className="text-xs text-slate-500 dark:text-zinc-400">
                                PIC klien korporasi, saksi ahli, konsultan hukum luar, dan stakeholder perkara.
                            </p>
                        </div>

                        {can.create && (
                            <div className="flex shrink-0 items-center gap-2">
                                <Button
                                    onClick={() => setOpenCreate(true)}
                                    className="h-8 rounded-lg bg-slate-900 px-3.5 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 active:scale-95 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                                >
                                    <UserPlus className="mr-1 size-3.5" />
                                    Tambah Kontak Baru
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* 2. Top 4 KPI Metrics Bento Cards */}
                    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {/* 1. Total Kontak */}
                        <div className="group rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[11px] font-semibold">TOTAL KONTAK</span>
                                <Users className="size-3.5 text-slate-400 transition-colors group-hover:text-blue-600 dark:text-zinc-500" />
                            </div>
                            <div className="mt-2 flex items-baseline justify-between">
                                <span className="font-mono text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    {metrics.total}
                                </span>
                                <span className="text-[11px] font-medium text-slate-500 dark:text-zinc-400">
                                    personil tercatat
                                </span>
                            </div>
                            <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-500 dark:border-white/[0.04]">
                                <span>Arsip Kontak</span>
                                <span className="font-semibold text-slate-700 dark:text-zinc-300">{contacts.data.length} di halaman ini</span>
                            </div>
                        </div>

                        {/* 2. Perwakilan Klien */}
                        <div className="group rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[11px] font-semibold">PERWAKILAN KLIEN</span>
                                <Building2 className="size-3.5 text-slate-400 transition-colors group-hover:text-blue-600 dark:text-zinc-500" />
                            </div>
                            <div className="mt-2 flex items-baseline justify-between">
                                <span className="font-mono text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    {metrics.client_linked}
                                </span>
                                <span className="text-[11px] font-medium text-slate-500 dark:text-zinc-400">
                                    PIC resmi
                                </span>
                            </div>
                            <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-500 dark:border-white/[0.04]">
                                <span>Terhubung Klien</span>
                                <span className="font-semibold text-blue-600 dark:text-blue-400">Terdaftar</span>
                            </div>
                        </div>

                        {/* 3. Pihak Independen / Mitra */}
                        <div className="group rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[11px] font-semibold">EKSTERNAL / MITRA</span>
                                <Briefcase className="size-3.5 text-slate-400 transition-colors group-hover:text-slate-700 dark:text-zinc-500 dark:group-hover:text-white" />
                            </div>
                            <div className="mt-2 flex items-baseline justify-between">
                                <span className="font-mono text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    {metrics.independent}
                                </span>
                                <span className="text-[11px] font-medium text-slate-500 dark:text-zinc-400">
                                    independen
                                </span>
                            </div>
                            <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-500 dark:border-white/[0.04]">
                                <span>Saksi &amp; Konsultan</span>
                                <span className="font-semibold text-slate-700 dark:text-zinc-300">Eksternal</span>
                            </div>
                        </div>

                        {/* 4. Cakupan Klien */}
                        <div className="group rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[11px] font-semibold">CAKUPAN KLIEN</span>
                                <UserCheck className="size-3.5 text-slate-400 transition-colors group-hover:text-emerald-600 dark:text-zinc-500" />
                            </div>
                            <div className="mt-2 flex items-baseline justify-between">
                                <span className="font-mono text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    {metrics.connected_clients}
                                </span>
                                <span className="text-[11px] font-medium text-slate-500 dark:text-zinc-400">
                                    entitas terlayani
                                </span>
                            </div>
                            <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-500 dark:border-white/[0.04]">
                                <span>Klien Memiliki PIC</span>
                                <span className="font-semibold text-emerald-600 dark:text-emerald-400">Aktif</span>
                            </div>
                        </div>
                    </section>

                    {/* 3. Filter Bar & View Toggle */}
                    <div className="rounded-xl border border-slate-200/60 bg-slate-50/50 p-2.5 space-y-2 dark:border-white/[0.04] dark:bg-[#121418]">
                        {/* Row 1: Search + View Switcher + Reset + Count Badge */}
                        <div className="flex items-center gap-2">
                            <div className="relative flex-1">
                                <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-slate-400" />
                                <Input
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cari nama personil, jabatan, email, no HP/telepon..."
                                    className="h-8 w-full rounded-lg border-slate-200 bg-white pl-8 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 dark:border-white/10 dark:bg-zinc-800 dark:text-white"
                                />
                            </div>

                            {/* View Switcher */}
                            <div className="flex items-center gap-0.5 rounded-lg border border-slate-200/70 bg-white p-0.5 dark:border-white/10 dark:bg-zinc-800">
                                <button
                                    type="button"
                                    onClick={() => setViewMode('table')}
                                    className={`flex size-7 items-center justify-center rounded-md transition-all ${
                                        viewMode === 'table'
                                            ? 'bg-slate-900 text-white shadow-2xs dark:bg-white dark:text-slate-900'
                                            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-400'
                                    }`}
                                    title="Tampilan Tabel"
                                >
                                    <LayoutList className="size-3.5" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setViewMode('cards')}
                                    className={`flex size-7 items-center justify-center rounded-md transition-all ${
                                        viewMode === 'cards'
                                            ? 'bg-slate-900 text-white shadow-2xs dark:bg-white dark:text-slate-900'
                                            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-400'
                                    }`}
                                    title="Tampilan Grid"
                                >
                                    <Grid className="size-3.5" />
                                </button>
                            </div>

                            {(filters.search || filters.client_id) && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={handleResetFilters}
                                    className="h-8 shrink-0 rounded-lg border-slate-200 bg-white px-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-300"
                                    title="Reset Semua Filter"
                                >
                                    <RotateCcw className="size-3.5 text-slate-400" />
                                </Button>
                            )}

                            <span className="shrink-0 rounded-md bg-white px-2 py-1 font-mono text-[11px] font-semibold text-slate-700 border border-slate-200/70 shadow-2xs dark:bg-zinc-800 dark:border-white/10 dark:text-zinc-300">
                                {contacts.total} kontak
                            </span>
                        </div>

                        {/* Row 2: Select Client + Submit button */}
                        <form
                            onSubmit={handleFilterSubmit}
                            className="flex flex-wrap items-center gap-2"
                        >
                            <div className="relative min-w-[200px] flex-1">
                                <select
                                    defaultValue={filters.client_id ?? ''}
                                    onChange={(e) => handleClientFilter(e.target.value)}
                                    className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white pr-7 pl-2.5 text-xs text-slate-900 outline-none hover:bg-slate-50 focus:border-blue-500 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200"
                                >
                                    <option value="">Semua Klien &amp; Entitas Terkait</option>
                                    {clients.map((client) => (
                                        <option key={client.id} value={client.id}>
                                            {client.display_name}
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
                                Terapkan Filter
                            </Button>
                        </form>
                    </div>

                    {/* 4. Contacts Content */}
                    {contacts.data.length === 0 ? (
                        <div className="flex min-h-[340px] items-center justify-center rounded-xl border border-slate-200/70 bg-white p-8 text-center shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                            <EmptyState
                                icon={UserPlus}
                                title={
                                    filters.search || filters.client_id
                                        ? 'Belum ada kontak yang sesuai pencarian'
                                        : 'Buku Kontak Kosong'
                                }
                                description={
                                    filters.search || filters.client_id
                                        ? 'Coba sesuaikan kata kunci pencarian atau reset filter untuk melihat semua kontak.'
                                        : 'Simpan data kontak PIC, pengacara eksternal, saksi, dan perwakilan hukum di sini.'
                                }
                                action={
                                    <div className="flex flex-wrap items-center justify-center gap-2">
                                        {can.create && (
                                            <Button
                                                type="button"
                                                onClick={() => setOpenCreate(true)}
                                                className="h-8 rounded-lg bg-blue-600 px-3.5 text-xs font-semibold text-white shadow-2xs hover:bg-blue-700 cursor-pointer"
                                            >
                                                <Plus className="mr-1 size-3.5" /> Tambah Kontak Baru
                                            </Button>
                                        )}
                                        {(filters.search || filters.client_id) && (
                                            <Button
                                                asChild
                                                variant="outline"
                                                className="h-8 rounded-lg border-slate-200 px-3.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-zinc-300"
                                            >
                                                <Link href={contactRoutes.index.url()}>
                                                    Reset Filter
                                                </Link>
                                            </Button>
                                        )}
                                    </div>
                                }
                            />
                        </div>
                    ) : viewMode === 'table' ? (
                        /* Precision Data Table View */
                        <div className="overflow-hidden rounded-xl border border-slate-200/70 bg-white shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead>
                                        <tr className="border-b border-slate-100 bg-slate-50/60 text-[10px] font-semibold text-slate-500 uppercase dark:border-white/[0.04] dark:bg-[#121418]">
                                            <th className="py-2.5 pr-3 pl-4 font-semibold">Kontak &amp; Jabatan</th>
                                            <th className="px-3 py-2.5 font-semibold">Entitas / Klien</th>
                                            <th className="px-3 py-2.5 font-semibold">Email</th>
                                            <th className="px-3 py-2.5 font-semibold">No. Telepon / HP</th>
                                            <th className="px-3 py-2.5 font-semibold">Catatan</th>
                                            <th className="py-2.5 pr-4 pl-1 text-right font-semibold"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                                        {contacts.data.map((contact) => (
                                            <tr
                                                key={contact.id}
                                                className="group transition-colors hover:bg-slate-50/50 dark:hover:bg-white/[0.02]"
                                            >
                                                {/* Contact Name & Title with Clean User Icon */}
                                                <td className="py-2.5 pr-3 pl-4">
                                                    <div
                                                        onClick={() => setSelectedContact(contact)}
                                                        className="flex cursor-pointer items-center gap-2.5"
                                                    >
                                                        <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition-colors group-hover:bg-slate-900 group-hover:text-white dark:bg-white/[0.06] dark:text-zinc-300 dark:group-hover:bg-white dark:group-hover:text-slate-900">
                                                            <User className="size-3.5" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <span className="truncate text-xs font-semibold text-slate-900 group-hover:text-blue-600 transition-colors dark:text-white dark:group-hover:text-blue-400">
                                                                {contact.full_name}
                                                            </span>
                                                            <p className="truncate text-[10px] text-slate-500 dark:text-zinc-400">
                                                                {contact.job_title ?? 'Perwakilan'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Client Entity Pill */}
                                                <td className="px-3 py-2.5 whitespace-nowrap">
                                                    {contact.client ? (
                                                        <Link
                                                            href={clientRoutes.show(contact.client.id)}
                                                            className="inline-flex max-w-[200px] items-center gap-1 truncate rounded-md bg-blue-50/80 px-2 py-0.5 text-[10px] font-semibold text-blue-700 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-300"
                                                        >
                                                            <Building2 className="size-3 shrink-0" />
                                                            <span className="truncate">{contact.client.display_name}</span>
                                                        </Link>
                                                    ) : contact.organization_name ? (
                                                        <span className="inline-flex max-w-[200px] items-center gap-1 truncate rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700 dark:bg-white/[0.06] dark:text-zinc-300">
                                                            <Building2 className="size-3 shrink-0" />
                                                            <span className="truncate">{contact.organization_name}</span>
                                                        </span>
                                                    ) : (
                                                        <span className="text-[10px] text-slate-400">
                                                            Independen
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Email */}
                                                <td className="px-3 py-2.5 whitespace-nowrap">
                                                    {contact.email ? (
                                                        <a
                                                            href={`mailto:${contact.email}`}
                                                            className="flex items-center gap-1 text-[11px] text-slate-600 hover:text-blue-600 dark:text-zinc-300 dark:hover:text-blue-400"
                                                        >
                                                            <Mail className="size-3 shrink-0 text-slate-400" />
                                                            <span>{contact.email}</span>
                                                        </a>
                                                    ) : (
                                                        <span className="font-mono text-slate-400">-</span>
                                                    )}
                                                </td>

                                                {/* Phone */}
                                                <td className="px-3 py-2.5 font-mono text-[11px] whitespace-nowrap text-slate-700 dark:text-zinc-300">
                                                    {contact.mobile || contact.phone ? (
                                                        <a
                                                            href={`tel:${contact.mobile || contact.phone}`}
                                                            className="flex items-center gap-1 hover:text-emerald-600 dark:hover:text-emerald-400"
                                                        >
                                                            <Phone className="size-3 shrink-0 text-slate-400" />
                                                            <span>{contact.mobile || contact.phone}</span>
                                                        </a>
                                                    ) : (
                                                        <span className="text-slate-400">-</span>
                                                    )}
                                                </td>

                                                {/* Notes */}
                                                <td className="max-w-xs truncate px-3 py-2.5 text-[11px] text-slate-500 dark:text-zinc-400">
                                                    {contact.notes || '-'}
                                                </td>

                                                {/* Action */}
                                                <td className="py-2.5 pr-4 pl-1 text-right whitespace-nowrap">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => setSelectedContact(contact)}
                                                        className="h-7 px-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-300 dark:hover:bg-white/[0.06]"
                                                    >
                                                        Detail
                                                        <ChevronRight className="ml-0.5 size-3 text-slate-400" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination Footer */}
                            <div className="flex flex-col justify-between gap-3 border-t border-slate-100 bg-slate-50/50 px-4 py-2.5 sm:flex-row sm:items-center dark:border-white/[0.04] dark:bg-[#121418]">
                                <span className="text-xs text-slate-500 dark:text-zinc-400">
                                    Menampilkan <span className="font-semibold text-slate-900 dark:text-white">{contacts.data.length}</span> dari <span className="font-semibold text-slate-900 dark:text-white">{contacts.total}</span> kontak
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
                                        onClick={() => setSelectedContact(contact)}
                                        className="group flex cursor-pointer flex-col justify-between rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#14161b]"
                                    >
                                        <div className="space-y-2.5">
                                            {/* User Icon & Name */}
                                            <div className="flex items-start gap-2.5">
                                                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition-colors group-hover:bg-slate-900 group-hover:text-white dark:bg-white/[0.06] dark:text-zinc-300 dark:group-hover:bg-white dark:group-hover:text-slate-900">
                                                    <User className="size-4" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <h3 className="truncate text-xs font-semibold text-slate-900 group-hover:text-blue-600 transition-colors dark:text-white dark:group-hover:text-blue-400">
                                                        {contact.full_name}
                                                    </h3>
                                                    <p className="truncate text-[10px] text-slate-500 dark:text-zinc-400">
                                                        {contact.job_title ?? 'Perwakilan'}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Entity Tag */}
                                            <div>
                                                {contact.client ? (
                                                    <span className="inline-flex max-w-full items-center gap-1 truncate rounded-md bg-blue-50/80 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                                                        <Building2 className="size-2.5 shrink-0" />
                                                        <span className="truncate">{contact.client.display_name}</span>
                                                    </span>
                                                ) : contact.organization_name ? (
                                                    <span className="inline-flex max-w-full items-center gap-1 truncate rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700 dark:bg-white/[0.06] dark:text-zinc-300">
                                                        <Building2 className="size-2.5 shrink-0" />
                                                        <span className="truncate">{contact.organization_name}</span>
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-1.5 py-0.2 text-[10px] text-slate-500 dark:bg-white/[0.06] dark:text-zinc-400">
                                                        Independen
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Communication Details */}
                                        <div className="mt-3 space-y-1 border-t border-slate-100 pt-2 text-[11px] dark:border-white/[0.04]">
                                            {contact.email ? (
                                                <div className="flex items-center gap-1.5 text-slate-600 dark:text-zinc-300">
                                                    <Mail className="size-3 shrink-0 text-slate-400" />
                                                    <span className="truncate font-mono text-[10px]">{contact.email}</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
                                                    <Mail className="size-3 shrink-0 text-slate-400" />
                                                    <span>Email tidak tercatat</span>
                                                </div>
                                            )}

                                            {contact.mobile || contact.phone ? (
                                                <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-700 dark:text-zinc-300">
                                                    <Phone className="size-3 shrink-0 text-slate-400" />
                                                    <span>{contact.mobile || contact.phone}</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
                                                    <Phone className="size-3 shrink-0 text-slate-400" />
                                                    <span>Telepon tidak tercatat</span>
                                                </div>
                                            )}
                                        </div>
                                    </article>
                                ))}
                            </div>

                            {/* Pagination */}
                            <div className="border-t border-slate-100 p-3 dark:border-white/[0.04]">
                                <Pagination links={contacts.links} />
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* Modal Dialog: Detail Ringkasan Kontak */}
            <Dialog open={!!selectedContact} onOpenChange={(open) => !open && setSelectedContact(null)}>
                {selectedContact && (
                    <DialogContent className="max-h-[85vh] overflow-y-auto rounded-xl border border-slate-200/80 bg-white p-5 shadow-xl sm:max-w-md dark:border-white/10 dark:bg-[#14161b]">
                        <DialogHeader className="border-b border-slate-100 pb-3 dark:border-white/[0.06]">
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center gap-2.5">
                                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-white/[0.08] dark:text-zinc-300">
                                        <User className="size-4.5" />
                                    </div>
                                    <div className="min-w-0">
                                        <DialogTitle className="text-sm font-bold text-slate-900 dark:text-white">
                                            {selectedContact.full_name}
                                        </DialogTitle>
                                        <DialogDescription className="text-xs text-slate-500 dark:text-zinc-400">
                                            {selectedContact.job_title ?? 'Kontak Perwakilan'}
                                        </DialogDescription>
                                    </div>
                                </div>

                                <div>
                                    {selectedContact.client ? (
                                        <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                                            PIC Klien
                                        </span>
                                    ) : (
                                        <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-white/[0.06] dark:text-zinc-400">
                                            Mitra Eksternal
                                        </span>
                                    )}
                                </div>
                            </div>
                        </DialogHeader>

                        <div className="space-y-4 pt-1">
                            {/* Quick Action Toolbar */}
                            <div className="flex flex-wrap items-center gap-1.5">
                                {selectedContact.email && (
                                    <Button
                                        size="sm"
                                        className="h-7.5 rounded-lg bg-slate-900 px-2.5 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 dark:bg-white dark:text-slate-900"
                                        asChild
                                    >
                                        <a href={`mailto:${selectedContact.email}`}>
                                            <Mail className="mr-1 size-3" />
                                            Kirim Email
                                        </a>
                                    </Button>
                                )}

                                {(selectedContact.mobile || selectedContact.phone) && (
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-7.5 rounded-lg border-slate-200 bg-white px-2.5 text-xs text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-[#16181d] dark:text-zinc-200"
                                        asChild
                                    >
                                        <a href={`tel:${selectedContact.mobile || selectedContact.phone}`}>
                                            <Phone className="mr-1 size-3 text-slate-400" />
                                            Telepon
                                        </a>
                                    </Button>
                                )}

                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleCopyContact(selectedContact)}
                                    className="h-7.5 rounded-lg border-slate-200 bg-white px-2.5 text-xs text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-[#16181d] dark:text-zinc-200"
                                >
                                    {copiedInfo ? (
                                        <>
                                            <Check className="mr-1 size-3 text-emerald-600" />
                                            Tersalin
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="mr-1 size-3 text-slate-400" />
                                            Salin
                                        </>
                                    )}
                                </Button>

                                {can.update && (
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                            const c = selectedContact;
                                            setSelectedContact(null);
                                            setEditingContact(c);
                                        }}
                                        className="h-7.5 rounded-lg border-slate-200 bg-white px-2.5 text-xs text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-[#16181d] dark:text-zinc-200"
                                    >
                                        <Pencil className="mr-1 size-3 text-slate-400" />
                                        Edit
                                    </Button>
                                )}
                            </div>

                            {/* Contact Details List */}
                            <div className="rounded-lg border border-slate-200/70 bg-slate-50/60 p-3 space-y-2 text-xs dark:border-white/[0.04] dark:bg-[#121418]">
                                <div className="flex items-center justify-between gap-2 border-b border-slate-200/50 pb-1.5 dark:border-white/[0.04]">
                                    <span className="text-slate-500 dark:text-zinc-400">Entitas / Klien</span>
                                    {selectedContact.client ? (
                                        <Link
                                            href={clientRoutes.show(selectedContact.client.id)}
                                            className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:underline dark:text-blue-400"
                                        >
                                            <Building2 className="size-3" />
                                            <span>{selectedContact.client.display_name}</span>
                                            <ExternalLink className="size-2.5" />
                                        </Link>
                                    ) : (
                                        <span className="font-semibold text-slate-800 dark:text-zinc-200">
                                            {selectedContact.organization_name || 'Pihak Independen'}
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center justify-between gap-2 border-b border-slate-200/50 pb-1.5 dark:border-white/[0.04]">
                                    <span className="text-slate-500 dark:text-zinc-400">Email</span>
                                    <span className="font-mono text-slate-900 dark:text-white">
                                        {selectedContact.email || '-'}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between gap-2 border-b border-slate-200/50 pb-1.5 dark:border-white/[0.04]">
                                    <span className="text-slate-500 dark:text-zinc-400">Handphone</span>
                                    <span className="font-mono text-slate-900 dark:text-white">
                                        {selectedContact.mobile || '-'}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-slate-500 dark:text-zinc-400">Telepon Kantor</span>
                                    <span className="font-mono text-slate-900 dark:text-white">
                                        {selectedContact.phone || '-'}
                                    </span>
                                </div>
                            </div>

                            {/* Catatan */}
                            <div className="space-y-1">
                                <span className="text-[11px] font-semibold text-slate-600 dark:text-zinc-400">
                                    Catatan / Ringkasan Keterangan
                                </span>
                                <div className="rounded-lg border border-slate-200/70 bg-white p-2.5 text-xs leading-relaxed text-slate-700 dark:border-white/[0.06] dark:bg-[#121418] dark:text-zinc-300">
                                    {selectedContact.notes || 'Tidak ada catatan tambahan.'}
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                )}
            </Dialog>

            {/* Modal Dialog: Tambah Kontak Baru */}
            <Dialog open={openCreate} onOpenChange={setOpenCreate}>
                <DialogContent className="max-h-[85vh] overflow-y-auto rounded-xl border border-slate-200/80 bg-white p-5 shadow-xl sm:max-w-md dark:border-white/10 dark:bg-[#14161b]">
                    <DialogHeader className="border-b border-slate-100 pb-3 dark:border-white/[0.06]">
                        <div className="flex items-center gap-2.5">
                            <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                                <UserPlus className="size-3.5" />
                            </div>
                            <div>
                                <DialogTitle className="text-sm font-bold text-slate-900 dark:text-white">
                                    Tambah Kontak Baru
                                </DialogTitle>
                                <DialogDescription className="text-xs text-slate-500 dark:text-zinc-400">
                                    Daftarkan representasi klien, saksi ahli, atau stakeholder.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <Form
                        {...contactRoutes.store.form()}
                        className="space-y-3 pt-1"
                        resetOnSuccess
                        onSuccess={() => setOpenCreate(false)}
                    >
                        {({ errors, processing }) => (
                            <>
                                <div className="grid gap-2.5 sm:grid-cols-2">
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

                                <div className="grid gap-1">
                                    <Label
                                        htmlFor="client_id"
                                        className="text-xs font-semibold text-slate-700 dark:text-zinc-300"
                                    >
                                        Terhubung ke Klien (Opsional)
                                    </Label>
                                    <div className="relative">
                                        <select
                                            id="client_id"
                                            name="client_id"
                                            className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-slate-50/70 pr-7 pl-2.5 text-xs font-medium text-slate-900 transition-colors outline-hidden hover:bg-slate-100 focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-zinc-200"
                                        >
                                            <option value="">
                                                Independen / Tanpa Relasi Klien Khusus
                                            </option>
                                            {clients.map((client) => (
                                                <option key={client.id} value={client.id}>
                                                    {client.display_name}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="pointer-events-none absolute top-1/2 right-2 size-3 -translate-y-1/2 text-slate-400" />
                                    </div>
                                    <InputError message={errors.client_id} />
                                </div>

                                <div className="grid gap-2.5 sm:grid-cols-2">
                                    <Field
                                        label="Jabatan / Posisi"
                                        name="job_title"
                                        error={errors.job_title}
                                        placeholder="Contoh: Legal Manager"
                                    />
                                    <Field
                                        label="Organisasi / Lembaga"
                                        name="organization_name"
                                        error={errors.organization_name}
                                        placeholder="Jika non-klien"
                                    />
                                </div>

                                <div className="grid gap-2.5 sm:grid-cols-2">
                                    <Field
                                        label="Email"
                                        name="email"
                                        type="email"
                                        error={errors.email}
                                        placeholder="nama@email.com"
                                    />
                                    <Field
                                        label="No. HP / Ponsel"
                                        name="mobile"
                                        error={errors.mobile}
                                        placeholder="+62 812-xxxx"
                                    />
                                </div>

                                <div className="grid gap-1">
                                    <Label
                                        htmlFor="notes"
                                        className="text-xs font-semibold text-slate-700 dark:text-zinc-300"
                                    >
                                        Catatan Tambahan
                                    </Label>
                                    <textarea
                                        id="notes"
                                        name="notes"
                                        rows={2}
                                        placeholder="Keterangan preferensi komunikasi..."
                                        className="w-full rounded-lg border border-slate-200 bg-slate-50/70 p-2 text-xs leading-relaxed text-slate-900 transition-colors outline-hidden focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
                                    />
                                    <InputError message={errors.notes} />
                                </div>

                                <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3 dark:border-white/[0.06]">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setOpenCreate(false)}
                                        className="h-8 rounded-lg border-slate-200 px-3 text-xs text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-zinc-300"
                                    >
                                        Batal
                                    </Button>
                                    <Button
                                        size="sm"
                                        disabled={processing}
                                        className="h-8 rounded-lg bg-slate-900 px-4 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 active:scale-95 disabled:opacity-50 dark:bg-white dark:text-slate-900"
                                    >
                                        {processing ? (
                                            <>
                                                <Spinner className="mr-1.5 size-3" />
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

            {/* Modal Dialog: Edit Kontak In-Place */}
            <Dialog open={!!editingContact} onOpenChange={(open) => !open && setEditingContact(null)}>
                {editingContact && (
                    <DialogContent className="max-h-[85vh] overflow-y-auto rounded-xl border border-slate-200/80 bg-white p-5 shadow-xl sm:max-w-md dark:border-white/10 dark:bg-[#14161b]">
                        <DialogHeader className="border-b border-slate-100 pb-3 dark:border-white/[0.06]">
                            <div className="flex items-center gap-2.5">
                                <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                                    <Pencil className="size-3.5" />
                                </div>
                                <div>
                                    <DialogTitle className="text-sm font-bold text-slate-900 dark:text-white">
                                        Edit Data Kontak
                                    </DialogTitle>
                                    <DialogDescription className="text-xs text-slate-500 dark:text-zinc-400">
                                        Perbarui profil perwakilan atau stakeholder.
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>

                        <Form
                            {...contactRoutes.update.form(editingContact.id)}
                            className="space-y-3 pt-1"
                            onSuccess={() => setEditingContact(null)}
                        >
                            {({ errors, processing }) => (
                                <>
                                    <div className="grid gap-2.5 sm:grid-cols-2">
                                        <Field
                                            label="Nama Depan"
                                            name="first_name"
                                            defaultValue={editingContact.first_name}
                                            error={errors.first_name}
                                            required
                                        />
                                        <Field
                                            label="Nama Belakang"
                                            name="last_name"
                                            defaultValue={editingContact.last_name}
                                            error={errors.last_name}
                                        />
                                    </div>

                                    <div className="grid gap-1">
                                        <Label
                                            htmlFor="client_id_edit"
                                            className="text-xs font-semibold text-slate-700 dark:text-zinc-300"
                                        >
                                            Terhubung ke Klien
                                        </Label>
                                        <div className="relative">
                                            <select
                                                id="client_id_edit"
                                                name="client_id"
                                                defaultValue={editingContact.client?.id ?? ''}
                                                className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-slate-50/70 pr-7 pl-2.5 text-xs font-medium text-slate-900 transition-colors outline-hidden hover:bg-slate-100 focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-zinc-200"
                                            >
                                                <option value="">
                                                    Independen / Tanpa Relasi Klien Khusus
                                                </option>
                                                {clients.map((client) => (
                                                    <option key={client.id} value={client.id}>
                                                        {client.display_name}
                                                    </option>
                                                ))}
                                            </select>
                                            <ChevronDown className="pointer-events-none absolute top-1/2 right-2 size-3 -translate-y-1/2 text-slate-400" />
                                        </div>
                                        <InputError message={errors.client_id} />
                                    </div>

                                    <div className="grid gap-2.5 sm:grid-cols-2">
                                        <Field
                                            label="Jabatan / Posisi"
                                            name="job_title"
                                            defaultValue={editingContact.job_title}
                                            error={errors.job_title}
                                        />
                                        <Field
                                            label="Organisasi / Lembaga"
                                            name="organization_name"
                                            defaultValue={editingContact.organization_name}
                                            error={errors.organization_name}
                                        />
                                    </div>

                                    <div className="grid gap-2.5 sm:grid-cols-2">
                                        <Field
                                            label="Email"
                                            name="email"
                                            type="email"
                                            defaultValue={editingContact.email}
                                            error={errors.email}
                                        />
                                        <Field
                                            label="No. HP / Ponsel"
                                            name="mobile"
                                            defaultValue={editingContact.mobile}
                                            error={errors.mobile}
                                        />
                                    </div>

                                    <div className="grid gap-1">
                                        <Label
                                            htmlFor="notes_edit"
                                            className="text-xs font-semibold text-slate-700 dark:text-zinc-300"
                                        >
                                            Catatan Tambahan
                                        </Label>
                                        <textarea
                                            id="notes_edit"
                                            name="notes"
                                            rows={2}
                                            defaultValue={editingContact.notes}
                                            placeholder="Keterangan preferensi komunikasi..."
                                            className="w-full rounded-lg border border-slate-200 bg-slate-50/70 p-2 text-xs leading-relaxed text-slate-900 transition-colors outline-hidden focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
                                        />
                                        <InputError message={errors.notes} />
                                    </div>

                                    <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3 dark:border-white/[0.06]">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setEditingContact(null)}
                                            className="h-8 rounded-lg border-slate-200 px-3 text-xs text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-zinc-300"
                                        >
                                            Batal
                                        </Button>
                                        <Button
                                            size="sm"
                                            disabled={processing}
                                            className="h-8 rounded-lg bg-slate-900 px-4 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 active:scale-95 disabled:opacity-50 dark:bg-white dark:text-slate-900"
                                        >
                                            {processing ? (
                                                <>
                                                    <Spinner className="mr-1.5 size-3" />
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
                    </DialogContent>
                )}
            </Dialog>
        </>
    );
}

function Field({
    label,
    name,
    defaultValue,
    error,
    className,
    type = 'text',
    placeholder,
    required = false,
}: {
    label: string;
    name: string;
    defaultValue?: string;
    error?: string;
    className?: string;
    type?: string;
    placeholder?: string;
    required?: boolean;
}) {
    return (
        <div className={`grid gap-1 ${className ?? ''}`}>
            <Label
                htmlFor={name}
                className="text-xs font-semibold text-slate-700 dark:text-zinc-300"
            >
                {label} {required && <span className="text-rose-500">*</span>}
            </Label>
            <Input
                id={name}
                name={name}
                type={type}
                defaultValue={defaultValue}
                required={required}
                placeholder={placeholder}
                className="h-8 rounded-lg border-slate-200 bg-slate-50/70 text-xs text-slate-900 placeholder:text-slate-400 transition-colors focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
            />
            <InputError message={error} />
        </div>
    );
}

ContactsIndex.layout = {
    breadcrumbs: [{ title: 'Kontak', href: contactRoutes.index() }],
};
