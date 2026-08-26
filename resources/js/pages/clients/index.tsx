import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowRight,
    Briefcase,
    Building2,
    ChevronDown,
    ChevronRight,
    ExternalLink,
    Filter,
    Plus,
    RotateCcw,
    Search,
    TrendingUp,
    ContactRound,
    User,
    Users,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { EmptyState } from '@/components/empty-state';
import { Pagination } from '@/components/pagination';
import { StatusBadge } from '@/components/status-badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useInitials } from '@/hooks/use-initials';
import * as clientRoutes from '@/routes/clients';
import * as matterRoutes from '@/routes/matters';

type Client = {
    id: string;
    client_number: string;
    display_name: string;
    type: string;
    industry?: string;
    status: string;
    contacts_count: number;
    matters_count: number;
    relationship_partner?: {
        id?: number;
        name: string;
        position_title?: string;
        avatar_url?: string | null;
    };
};

type Page = {
    data: Client[];
    links: { url: string | null; label: string; active: boolean }[];
    total: number;
};

export default function ClientsIndex({
    clients,
    filters,
    can,
}: {
    clients: Page;
    filters: Record<string, string>;
    can: { create: boolean };
}) {
    const getInitials = useInitials();
    const [searchQuery, setSearchQuery] = useState(filters.search ?? '');

    const activeClientsCount = useMemo(
        () => clients.data.filter((c) => c.status === 'active').length,
        [clients.data],
    );

    const totalMattersCount = useMemo(
        () => clients.data.reduce((acc, c) => acc + (c.matters_count || 0), 0),
        [clients.data],
    );

    const totalContactsCount = useMemo(
        () => clients.data.reduce((acc, c) => acc + (c.contacts_count || 0), 0),
        [clients.data],
    );

    const handleFilterStatus = (statusValue: string) => {
        const queryParams = new URLSearchParams(window.location.search);
        if (statusValue) {
            queryParams.set('status', statusValue);
        } else {
            queryParams.delete('status');
        }
        router.get(
            clientRoutes.index.url(),
            Object.fromEntries(queryParams.entries()),
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const queryParams = new URLSearchParams(window.location.search);
        if (searchQuery.trim()) {
            queryParams.set('search', searchQuery.trim());
        } else {
            queryParams.delete('search');
        }
        router.get(
            clientRoutes.index.url(),
            Object.fromEntries(queryParams.entries()),
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleResetFilters = () => {
        setSearchQuery('');
        router.get(
            clientRoutes.index.url(),
            {},
            { preserveState: true, preserveScroll: true },
        );
    };

    return (
        <>
            <Head title="Direktori Klien & Entitas Hukum" />

            <div className="min-h-screen bg-[#fafafc] pb-20 dark:bg-[#0c0d10]">
                <main className="mx-auto max-w-7xl space-y-5 px-4 py-5 sm:px-6 lg:px-8">
                    {/* 1. Header & Actions */}
                    <div className="flex flex-col justify-between gap-4 border-b border-slate-200/60 pb-5 sm:flex-row sm:items-center dark:border-white/[0.06]">
                        <div className="space-y-1">
                            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                                Direktori Klien
                            </h1>
                            <p className="text-xs text-slate-500 dark:text-zinc-400">
                                Profil korporasi &amp; perorangan, perwakilan
                                hukum, portofolio perkara, dan kepatuhan KYC.
                            </p>
                        </div>

                        <div className="flex shrink-0 items-center gap-2">
                            {can.create && (
                                <Button
                                    asChild
                                    className="h-8 rounded-lg bg-slate-900 px-3.5 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 active:scale-[0.98] dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                                >
                                    <Link href={clientRoutes.create.url()}>
                                        <Plus className="mr-1 size-3.5" />
                                        Registrasi Klien Baru
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* 2. Top 4 KPI Metrics Bento Cards */}
                    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {/* 1. Total Portofolio */}
                        <div className="group rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[11px] font-semibold">
                                    TOTAL PORTOFOLIO
                                </span>
                                <Building2 className="size-3.5 text-slate-400 transition-colors group-hover:text-blue-600 dark:text-zinc-500" />
                            </div>
                            <div className="mt-2 flex items-baseline justify-between">
                                <span className="font-mono text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    {clients.total}
                                </span>
                                <span className="text-[11px] font-medium text-slate-500 dark:text-zinc-400">
                                    entitas terdaftar
                                </span>
                            </div>
                            <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-500 dark:border-white/[0.04]">
                                <span>Arsip Portofolio Klien</span>
                                <span className="font-semibold text-slate-700 dark:text-zinc-300">
                                    {clients.data.length} di halaman ini
                                </span>
                            </div>
                        </div>

                        {/* 2. Klien Aktif */}
                        <div className="group rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[11px] font-semibold">
                                    KLIEN AKTIF
                                </span>
                                <Users className="size-3.5 text-slate-400 transition-colors group-hover:text-emerald-600 dark:text-zinc-500" />
                            </div>
                            <div className="mt-2 flex items-baseline justify-between">
                                <span className="font-mono text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    {activeClientsCount}
                                </span>
                                <span className="text-[11px] font-medium text-slate-500 dark:text-zinc-400">
                                    kerjasama berjalan
                                </span>
                            </div>
                            <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-500 dark:border-white/[0.04]">
                                <span>Retainer &amp; Kasus</span>
                                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                    Aktif
                                </span>
                            </div>
                        </div>

                        {/* 3. Perkara Terkait */}
                        <div className="group rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[11px] font-semibold">
                                    PERKARA TERKAIT
                                </span>
                                <Briefcase className="size-3.5 text-slate-400 transition-colors group-hover:text-amber-600 dark:text-zinc-500" />
                            </div>
                            <div className="mt-2 flex items-baseline justify-between">
                                <span className="font-mono text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    {totalMattersCount}
                                </span>
                                <span className="text-[11px] font-medium text-slate-500 dark:text-zinc-400">
                                    total matter
                                </span>
                            </div>
                            <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-500 dark:border-white/[0.04]">
                                <span>Akumulasi Kasus</span>
                                <span className="font-semibold text-amber-600 dark:text-amber-400">
                                    Terhubung
                                </span>
                            </div>
                        </div>

                        {/* 4. Kontak Person */}
                        <div className="group rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[11px] font-semibold">
                                    KONTAK PERSON
                                </span>
                                <ContactRound className="size-3.5 text-slate-400 transition-colors group-hover:text-blue-600 dark:text-zinc-500" />
                            </div>
                            <div className="mt-2 flex items-baseline justify-between">
                                <span className="font-mono text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    {totalContactsCount}
                                </span>
                                <span className="text-[11px] font-medium text-slate-500 dark:text-zinc-400">
                                    perwakilan resmi
                                </span>
                            </div>
                            <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-500 dark:border-white/[0.04]">
                                <span>Personil Terdaftar</span>
                                <span className="font-semibold text-purple-600 dark:text-purple-400">
                                    Terotorisasi
                                </span>
                            </div>
                        </div>
                    </section>

                    {/* 3. Filter Controls & Segmented Quick Filter Bar */}
                    <div className="space-y-2 rounded-xl border border-slate-200/60 bg-slate-50/50 p-2.5 dark:border-white/[0.04] dark:bg-[#121418]">
                        {/* Row 1: Search Form + Reset + Count Badge */}
                        <form
                            onSubmit={handleSearchSubmit}
                            className="flex items-center gap-2"
                        >
                            <div className="relative flex-1">
                                <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-slate-400" />
                                <Input
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    placeholder="Cari nama klien, nomor registrasi, sektor industri..."
                                    className="h-8 w-full rounded-lg border-slate-200 bg-white pl-8 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 dark:border-white/10 dark:bg-zinc-800 dark:text-white"
                                />
                            </div>

                            <Button
                                type="submit"
                                size="sm"
                                className="h-8 shrink-0 rounded-lg bg-slate-900 px-3.5 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 dark:bg-white dark:text-slate-900"
                            >
                                Cari
                            </Button>

                            {(filters.search || filters.status) && (
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

                            <span className="shrink-0 rounded-md border border-slate-200/70 bg-white px-2 py-1 font-mono text-[11px] font-semibold text-slate-700 shadow-2xs dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-300">
                                {clients.total} klien
                            </span>
                        </form>

                        {/* Row 2: Segmented Quick Status Pills */}
                        <div className="flex flex-wrap items-center gap-1 border-t border-slate-200/40 pt-2 dark:border-white/[0.04]">
                            <button
                                type="button"
                                onClick={() => handleFilterStatus('')}
                                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                                    !filters.status
                                        ? 'bg-slate-900 text-white shadow-2xs dark:bg-white dark:text-slate-900'
                                        : 'text-slate-600 hover:bg-white dark:text-zinc-400 dark:hover:bg-zinc-800'
                                }`}
                            >
                                Semua ({clients.total})
                            </button>
                            <button
                                type="button"
                                onClick={() => handleFilterStatus('active')}
                                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                                    filters.status === 'active'
                                        ? 'bg-emerald-600 text-white shadow-2xs'
                                        : 'text-slate-600 hover:bg-white hover:text-emerald-700 dark:text-zinc-400 dark:hover:bg-zinc-800'
                                }`}
                            >
                                Aktif ({activeClientsCount})
                            </button>
                            <button
                                type="button"
                                onClick={() => handleFilterStatus('inactive')}
                                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                                    filters.status === 'inactive'
                                        ? 'bg-amber-600 text-white shadow-2xs'
                                        : 'text-slate-600 hover:bg-white hover:text-amber-700 dark:text-zinc-400 dark:hover:bg-zinc-800'
                                }`}
                            >
                                Tidak Aktif
                            </button>
                            <button
                                type="button"
                                onClick={() => handleFilterStatus('closed')}
                                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                                    filters.status === 'closed'
                                        ? 'bg-slate-700 text-white shadow-2xs dark:bg-zinc-700'
                                        : 'text-slate-600 hover:bg-white dark:text-zinc-400 dark:hover:bg-zinc-800'
                                }`}
                            >
                                Ditutup
                            </button>
                        </div>
                    </div>

                    {/* 4. Precision Data Table */}
                    <div className="overflow-hidden rounded-xl border border-slate-200/70 bg-white shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                        {clients.data.length === 0 ? (
                            <div className="flex min-h-[340px] items-center justify-center p-8 text-center">
                                <EmptyState
                                    icon={Users}
                                    title={
                                        filters.search ||
                                        filters.type ||
                                        filters.status
                                            ? 'Belum ada data klien yang cocok'
                                            : 'Belum Ada Klien Terdaftar'
                                    }
                                    description={
                                        filters.search ||
                                        filters.type ||
                                        filters.status
                                            ? 'Coba sesuaikan kata kunci pencarian atau reset filter untuk menampilkan semua klien.'
                                            : 'Simpan data profil klien perusahaan, individu, atau perwakilan hukum Anda di sini.'
                                    }
                                    action={
                                        <div className="flex flex-wrap items-center justify-center gap-2">
                                            {can.create && (
                                                <Button
                                                    asChild
                                                    className="h-8 cursor-pointer rounded-lg bg-blue-600 px-3.5 text-xs font-semibold text-white shadow-2xs hover:bg-blue-700"
                                                >
                                                    <Link
                                                        href={clientRoutes.create.url()}
                                                    >
                                                        <Plus className="mr-1 size-3.5" />{' '}
                                                        Tambah Klien Baru
                                                    </Link>
                                                </Button>
                                            )}
                                            {(filters.search ||
                                                filters.type ||
                                                filters.status) && (
                                                <Button
                                                    asChild
                                                    variant="outline"
                                                    className="h-8 rounded-lg border-slate-200 px-3.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-zinc-300"
                                                >
                                                    <Link
                                                        href={clientRoutes.index.url()}
                                                    >
                                                        Reset Filter
                                                    </Link>
                                                </Button>
                                            )}
                                        </div>
                                    }
                                />
                            </div>
                        ) : (
                            <>
                                {/* Mobile Cards (sm:hidden) */}
                                <div className="divide-y divide-slate-100 sm:hidden dark:divide-white/[0.04]">
                                    {clients.data.map((client) => (
                                        <Link
                                            key={client.id}
                                            href={clientRoutes.show.url(client.id)}
                                            className="block p-3.5 transition-colors hover:bg-slate-50 active:bg-slate-100 dark:hover:bg-white/[0.02]"
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-1.5 font-mono text-[10px] font-semibold text-slate-500 dark:text-zinc-400">
                                                        <span>
                                                            {
                                                                client.client_number
                                                            }
                                                        </span>
                                                        <span>·</span>
                                                        <span className="truncate">
                                                            {client.industry ??
                                                                'Umum'}
                                                        </span>
                                                    </div>
                                                    <p className="mt-0.5 truncate text-xs font-bold text-slate-900 dark:text-white">
                                                        {client.display_name}
                                                    </p>
                                                </div>
                                                <ChevronRight className="size-4 shrink-0 text-slate-400" />
                                            </div>
                                            <div className="mt-2.5 flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-2 text-[10px] dark:border-white/[0.04]">
                                                <StatusBadge
                                                    value={client.status}
                                                />
                                                <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[9.5px] font-semibold text-slate-600 dark:bg-white/[0.06] dark:text-zinc-300">
                                                    {client.matters_count ?? 0}{' '}
                                                    Perkara
                                                </span>
                                                <span className="inline-flex items-center gap-1 rounded bg-blue-50 px-1.5 py-0.5 font-mono text-[9.5px] font-semibold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                                                    {client.contacts_count ?? 0}{' '}
                                                    Kontak
                                                </span>
                                                {client.relationship_partner && (
                                                    <span className="ml-auto truncate text-slate-500 dark:text-zinc-400">
                                                        Partner:{' '}
                                                        {
                                                            client
                                                                .relationship_partner
                                                                .name
                                                        }
                                                    </span>
                                                )}
                                            </div>
                                        </Link>
                                    ))}
                                </div>

                                {/* Desktop Table (hidden sm:block) */}
                                <div className="hidden overflow-x-auto sm:block">
                                    <table className="w-full text-left text-xs">
                                        <thead>
                                            <tr className="border-b border-slate-100 bg-slate-50/60 text-[10px] font-semibold text-slate-500 uppercase dark:border-white/[0.04] dark:bg-[#121418]">
                                                <th className="py-2.5 pr-3 pl-4 font-semibold">
                                                    Klien &amp; Nomor
                                                </th>
                                                <th className="px-3 py-2.5 font-semibold">
                                                    Sektor Industri
                                                </th>
                                                <th className="px-3 py-2.5 text-center font-semibold">
                                                    Partner Relasi
                                                </th>
                                                <th className="px-3 py-2.5 text-center font-semibold">
                                                    Matter
                                                </th>
                                                <th className="px-3 py-2.5 text-center font-semibold">
                                                    Kontak
                                                </th>
                                                <th className="px-3 py-2.5 font-semibold">
                                                    Status
                                                </th>
                                                <th className="py-2.5 pr-4 pl-1 text-right font-semibold"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                                            {clients.data.map((client) => (
                                                <tr
                                                    key={client.id}
                                                    className="group transition-colors hover:bg-slate-50/50 dark:hover:bg-white/[0.02]"
                                                >
                                                    {/* 1. Client Info */}
                                                    <td className="py-2.5 pr-3 pl-4">
                                                        <Link
                                                            href={clientRoutes.show.url(
                                                                client.id,
                                                            )}
                                                            className="flex items-center gap-2.5"
                                                        >
                                                            {client.type ===
                                                                'individual' ||
                                                            client.type ===
                                                                'person' ? (
                                                                <div className="flex size-7.5 shrink-0 items-center justify-center rounded-xl border border-emerald-200/60 bg-emerald-50 text-emerald-700 shadow-2xs transition-colors group-hover:bg-emerald-600 group-hover:text-white dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-300">
                                                                    <User className="size-3.5" />
                                                                </div>
                                                            ) : (
                                                                <div className="flex size-7.5 shrink-0 items-center justify-center rounded-xl border border-blue-200/60 bg-blue-50 text-blue-700 shadow-2xs transition-colors group-hover:bg-blue-600 group-hover:text-white dark:border-blue-900/40 dark:bg-blue-950/40 dark:text-blue-300">
                                                                    <Building2 className="size-3.5" />
                                                                </div>
                                                            )}
                                                            <div className="min-w-0 space-y-0.5">
                                                                <div className="flex items-center gap-1.5">
                                                                    <p className="truncate text-xs font-semibold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                                                                        {
                                                                            client.display_name
                                                                        }
                                                                    </p>
                                                                    <span
                                                                        className={`py-0.2 inline-block rounded px-1.5 text-[9px] font-bold ${
                                                                            client.type ===
                                                                                'individual' ||
                                                                            client.type ===
                                                                                'person'
                                                                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                                                                                : 'bg-slate-100 text-slate-600 dark:bg-white/[0.06] dark:text-zinc-300'
                                                                        }`}
                                                                    >
                                                                        {client.type ===
                                                                            'individual' ||
                                                                        client.type ===
                                                                            'person'
                                                                            ? 'Individu'
                                                                            : 'Badan Hukum'}
                                                                    </span>
                                                                </div>
                                                                <span className="inline-block font-mono text-[10px] font-semibold text-slate-500 dark:text-zinc-400">
                                                                    {
                                                                        client.client_number
                                                                    }
                                                                </span>
                                                            </div>
                                                        </Link>
                                                    </td>

                                                    {/* 2. Industry */}
                                                    <td className="px-3 py-2.5 whitespace-nowrap">
                                                        <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-white/[0.06] dark:text-zinc-300">
                                                            {client.industry ??
                                                                'Umum'}
                                                        </span>
                                                    </td>

                                                    {/* 3. Relationship Partner */}
                                                    <td className="px-3 py-2.5 text-center whitespace-nowrap">
                                                        {client.relationship_partner ? (
                                                            <TooltipProvider
                                                                delayDuration={
                                                                    100
                                                                }
                                                            >
                                                                <Tooltip>
                                                                    <TooltipTrigger
                                                                        asChild
                                                                    >
                                                                        <div className="inline-flex cursor-pointer items-center justify-center">
                                                                            <Avatar className="size-6 rounded-full border border-slate-200/80 dark:border-white/10">
                                                                                <AvatarImage
                                                                                    src={
                                                                                        client
                                                                                            .relationship_partner
                                                                                            .avatar_url ??
                                                                                        undefined
                                                                                    }
                                                                                />
                                                                                <AvatarFallback className="text-[8px] font-bold">
                                                                                    {getInitials(
                                                                                        client
                                                                                            .relationship_partner
                                                                                            .name,
                                                                                    )}
                                                                                </AvatarFallback>
                                                                            </Avatar>
                                                                        </div>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent
                                                                        side="top"
                                                                        className="bg-slate-900 px-2.5 py-1 text-[10px] font-medium text-white shadow-md dark:bg-zinc-800"
                                                                    >
                                                                        {
                                                                            client
                                                                                .relationship_partner
                                                                                .name
                                                                        }
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                        ) : (
                                                            <span className="font-mono text-slate-400">
                                                                -
                                                            </span>
                                                        )}
                                                    </td>

                                                    {/* 4. Matters Count */}
                                                    <td className="px-3 py-2.5 text-center whitespace-nowrap">
                                                        <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-semibold text-slate-700 dark:bg-white/[0.06] dark:text-zinc-300">
                                                            <Briefcase className="size-3 text-slate-400" />
                                                            {client.matters_count ??
                                                                0}
                                                        </span>
                                                    </td>

                                                    {/* 5. Contacts Count */}
                                                    <td className="px-3 py-2.5 text-center whitespace-nowrap">
                                                        <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                                                            <ContactRound className="size-3 text-blue-500" />
                                                            {client.contacts_count ??
                                                                0}
                                                        </span>
                                                    </td>

                                                    {/* 6. Status */}
                                                    <td className="px-3 py-2.5 whitespace-nowrap">
                                                        <StatusBadge
                                                            value={
                                                                client.status
                                                            }
                                                        />
                                                    </td>

                                                    {/* 7. Action */}
                                                    <td className="py-2.5 pr-4 pl-1 text-right whitespace-nowrap">
                                                        <Link
                                                            href={clientRoutes.show.url(
                                                                client.id,
                                                            )}
                                                            className="inline-flex size-7 items-center justify-center rounded-lg text-slate-400 opacity-0 transition-all group-hover:opacity-100 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-white/[0.06] dark:hover:text-white"
                                                        >
                                                            <ChevronRight className="size-4" />
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}

                        {/* Pagination Footer */}
                        <div className="flex flex-col justify-between gap-3 border-t border-slate-100 bg-slate-50/50 px-4 py-2.5 sm:flex-row sm:items-center dark:border-white/[0.04] dark:bg-[#121418]">
                            <span className="text-xs text-slate-500 dark:text-zinc-400">
                                Menampilkan{' '}
                                <span className="font-semibold text-slate-900 dark:text-white">
                                    {clients.data.length}
                                </span>{' '}
                                dari{' '}
                                <span className="font-semibold text-slate-900 dark:text-white">
                                    {clients.total}
                                </span>{' '}
                                klien
                            </span>

                            <Pagination links={clients.links} />
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}

ClientsIndex.layout = {
    breadcrumbs: [{ title: 'Klien', href: clientRoutes.index.url() }],
};
