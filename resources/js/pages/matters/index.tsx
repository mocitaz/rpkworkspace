import { Form, Head, Link, router } from '@inertiajs/react';
import {
    Briefcase,
    Building2,
    Calendar,
    ChevronDown,
    ChevronRight,
    Clock,
    FileText,
    Filter,
    FolderKanban,
    Layers,
    Plus,
    RotateCcw,
    Scale,
    Search,
    ShieldAlert,
    TrendingUp,
    User,
    UserCheck,
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
import { formatDate } from '@/lib/format';
import * as clientRoutes from '@/routes/clients';
import * as matterRoutes from '@/routes/matters';

type Matter = {
    id: string;
    matter_number: string;
    title: string;
    status: string;
    priority: string;
    next_deadline?: string;
    updated_at: string;
    client: {
        id?: string;
        display_name: string;
        type?: string;
        client_number?: string;
    };
    practice_area?: { name: string };
    responsible_partner: {
        id?: number;
        name: string;
        avatar_url?: string | null;
    };
};

type Page<T> = {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
    total: number;
};

export default function MattersIndex({
    matters,
    practiceAreas,
    filters,
    can,
}: {
    matters: Page<Matter>;
    practiceAreas: { id: number; name: string }[];
    filters: Record<string, string>;
    can: { create: boolean };
}) {
    const getInitials = useInitials();
    const [searchQuery, setSearchQuery] = useState(filters.search ?? '');

    const activeMattersCount = useMemo(
        () => matters.data.filter((m) => m.status === 'active').length,
        [matters.data],
    );

    const highPriorityCount = useMemo(
        () =>
            matters.data.filter(
                (m) => m.priority === 'critical' || m.priority === 'high',
            ).length,
        [matters.data],
    );

    const corporateCount = useMemo(
        () =>
            matters.data.filter((m) => {
                const pa = m.practice_area?.name?.toLowerCase() ?? '';
                return (
                    pa.includes('corporate') ||
                    pa.includes('bisnis') ||
                    pa.includes('komersial')
                );
            }).length,
        [matters.data],
    );

    const litigationCount = Math.max(0, activeMattersCount - corporateCount);

    const handleFilterStatus = (statusValue: string) => {
        const queryParams = new URLSearchParams(window.location.search);
        if (statusValue) {
            queryParams.set('status', statusValue);
        } else {
            queryParams.delete('status');
        }
        router.get(
            matterRoutes.index(),
            Object.fromEntries(queryParams.entries()),
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    return (
        <>
            <Head title="Portofolio Perkara" />

            <div className="min-h-screen bg-[#fafafc] pb-20 dark:bg-[#0c0d10]">
                <main className="mx-auto max-w-7xl space-y-5 px-4 py-5 sm:px-6 lg:px-8">
                    {/* 1. Header Navigation & Action Bar */}
                    <div className="flex flex-col justify-between gap-4 border-b border-slate-200/60 pb-5 sm:flex-row sm:items-center dark:border-white/[0.06]">
                        <div className="space-y-1">
                            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                                Portofolio Perkara
                            </h1>
                            <p className="text-xs text-slate-500 dark:text-zinc-400">
                                Seluruh registrasi perkara hukum, penugasan
                                partner, jadwal sidang, dan monitoring tenggat
                                perkara.
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex shrink-0 items-center gap-2">
                            {can.create && (
                                <Button
                                    asChild
                                    className="h-8 rounded-lg bg-slate-900 px-3.5 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 active:scale-[0.98] dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                                >
                                    <Link href={matterRoutes.create()}>
                                        <Plus className="mr-1 size-3.5" />
                                        Registrasi Perkara Baru
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* 2. Streamlined KPI Bento Cards (Compact & Slim) */}
                    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {/* 1. Total Matters */}
                        <div className="group rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[11px] font-semibold">
                                    TOTAL PERKARA
                                </span>
                                <FolderKanban className="size-3.5 text-slate-400 transition-colors group-hover:text-blue-600 dark:text-zinc-500" />
                            </div>
                            <div className="mt-2 flex items-baseline justify-between">
                                <span className="font-mono text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    {matters.total}
                                </span>
                                <span className="text-[11px] font-medium text-slate-500 dark:text-zinc-400">
                                    {matters.data.length} di halaman ini
                                </span>
                            </div>
                            <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-500 dark:border-white/[0.04]">
                                <span>Arsip Portofolio Firma</span>
                                <span className="font-mono font-semibold text-slate-700 dark:text-zinc-300">
                                    100% Tercatat
                                </span>
                            </div>
                        </div>

                        {/* 2. Active Matters */}
                        <div className="group rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[11px] font-semibold">
                                    PERKARA AKTIF
                                </span>
                                <Briefcase className="size-3.5 text-slate-400 transition-colors group-hover:text-emerald-600 dark:text-zinc-500" />
                            </div>
                            <div className="mt-2 flex items-baseline justify-between">
                                <span className="font-mono text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    {activeMattersCount}
                                </span>
                                <span className="text-[11px] font-medium text-slate-500 dark:text-zinc-400">
                                    {corporateCount} Corp · {litigationCount}{' '}
                                    Litigasi
                                </span>
                            </div>
                            <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-500 dark:border-white/[0.04]">
                                <span>Dalam Penanganan</span>
                                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                    Aktif
                                </span>
                            </div>
                        </div>

                        {/* 3. High/Critical Priority */}
                        <div className="group rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[11px] font-semibold">
                                    PRIORITAS TINGGI
                                </span>
                                <ShieldAlert className="size-3.5 text-slate-400 transition-colors group-hover:text-rose-600 dark:text-zinc-500" />
                            </div>
                            <div className="mt-2 flex items-baseline justify-between">
                                <span className="font-mono text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    {highPriorityCount}
                                </span>
                                <span className="text-[11px] font-medium text-rose-600 dark:text-rose-400">
                                    kasus atensi
                                </span>
                            </div>
                            <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-500 dark:border-white/[0.04]">
                                <span>Tenggat Terpantau</span>
                                <span className="font-semibold text-rose-600 dark:text-rose-400">
                                    Atensi Partner
                                </span>
                            </div>
                        </div>

                        {/* 4. Practice Area */}
                        <div className="group rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[11px] font-semibold">
                                    AREA PRAKTIK
                                </span>
                                <Scale className="size-3.5 text-slate-400 transition-colors group-hover:text-purple-600 dark:text-zinc-500" />
                            </div>
                            <div className="mt-2 flex items-baseline justify-between">
                                <span className="font-mono text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    {practiceAreas.length}
                                </span>
                                <span className="text-[11px] font-medium text-slate-500 dark:text-zinc-400">
                                    bidang keahlian
                                </span>
                            </div>
                            <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-500 dark:border-white/[0.04]">
                                <span>Spesialisasi Hukum</span>
                                <span className="font-semibold text-purple-600 dark:text-purple-400">
                                    Terdistribusi
                                </span>
                            </div>
                        </div>
                    </section>

                    {/* 3. Filter Controls & Segmented Quick Filter Bar */}
                    <div className="space-y-2 rounded-xl border border-slate-200/60 bg-slate-50/50 p-2.5 dark:border-white/[0.04] dark:bg-[#121418]">
                        {/* Row 1: Search Form + Reset + Count Badge */}
                        <Form
                            {...matterRoutes.index.form()}
                            className="flex items-center gap-2"
                        >
                            <div className="relative flex-1">
                                <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-slate-400" />
                                <Input
                                    name="search"
                                    defaultValue={filters.search}
                                    placeholder="Cari judul perkara, nomor matter, nama klien…"
                                    className="h-8 w-full rounded-lg border-slate-200 bg-white pl-8 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 dark:border-white/10 dark:bg-zinc-800 dark:text-white"
                                />
                            </div>

                            <div className="relative min-w-[160px]">
                                <select
                                    name="practice_area_id"
                                    defaultValue={
                                        filters.practice_area_id ?? ''
                                    }
                                    className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white pr-7 pl-2.5 text-xs text-slate-900 outline-none hover:bg-slate-50 focus:border-blue-500 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200"
                                >
                                    <option value="">Semua Area Praktik</option>
                                    {practiceAreas.map((area) => (
                                        <option key={area.id} value={area.id}>
                                            {area.name}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="pointer-events-none absolute top-1/2 right-2 size-3.5 -translate-y-1/2 text-slate-400" />
                            </div>

                            <Button
                                type="submit"
                                size="sm"
                                className="h-8 shrink-0 rounded-lg bg-slate-900 px-3.5 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 dark:bg-white dark:text-slate-900"
                            >
                                Cari
                            </Button>

                            {(filters.search ||
                                filters.practice_area_id ||
                                filters.mine ||
                                filters.status) && (
                                <Button
                                    asChild
                                    variant="outline"
                                    size="sm"
                                    className="h-8 shrink-0 rounded-lg border-slate-200 bg-white px-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-300"
                                    title="Reset Semua Filter"
                                >
                                    <Link href={matterRoutes.index()}>
                                        <RotateCcw className="size-3.5 text-slate-400" />
                                    </Link>
                                </Button>
                            )}

                            <span className="shrink-0 rounded-md border border-slate-200/70 bg-white px-2 py-1 font-mono text-[11px] font-semibold text-slate-700 shadow-2xs dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-300">
                                {matters.total} perkara
                            </span>
                        </Form>

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
                                Semua ({matters.total})
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
                                Aktif ({activeMattersCount})
                            </button>
                            <button
                                type="button"
                                onClick={() => handleFilterStatus('on_hold')}
                                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                                    filters.status === 'on_hold'
                                        ? 'bg-amber-600 text-white shadow-2xs'
                                        : 'text-slate-600 hover:bg-white hover:text-amber-700 dark:text-zinc-400 dark:hover:bg-zinc-800'
                                }`}
                            >
                                Ditunda
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

                    {/* 4. Precision Data Table (Notion Minimalist Style) */}
                    <div className="overflow-hidden rounded-xl border border-slate-200/70 bg-white shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                        {matters.data.length === 0 ? (
                            <div className="flex min-h-[340px] items-center justify-center p-8 text-center">
                                <EmptyState
                                    icon={Briefcase}
                                    title={
                                        filters.search ||
                                        filters.practice_area ||
                                        filters.status ||
                                        filters.stage
                                            ? 'Tidak ada perkara yang sesuai filter'
                                            : 'Belum Ada Perkara Terdaftar'
                                    }
                                    description={
                                        filters.search ||
                                        filters.practice_area ||
                                        filters.status ||
                                        filters.stage
                                            ? 'Coba sesuaikan kata kunci filter pencarian atau reset filter untuk melihat semua perkara.'
                                            : 'Mulai dengan membuka berkas perkara Litigasi atau Non-Litigasi / Korporasi baru.'
                                    }
                                    action={
                                        <div className="flex flex-wrap items-center justify-center gap-2">
                                            {can.create && (
                                                <Button
                                                    asChild
                                                    className="h-8 cursor-pointer rounded-lg bg-blue-600 px-3.5 text-xs font-semibold text-white shadow-2xs hover:bg-blue-700"
                                                >
                                                    <Link
                                                        href={matterRoutes.create()}
                                                    >
                                                        <Plus className="mr-1 size-3.5" />{' '}
                                                        Buka Perkara Baru
                                                    </Link>
                                                </Button>
                                            )}
                                            {(filters.search ||
                                                filters.practice_area ||
                                                filters.status ||
                                                filters.stage) && (
                                                <Button
                                                    asChild
                                                    variant="outline"
                                                    className="h-8 rounded-lg border-slate-200 px-3.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-zinc-300"
                                                >
                                                    <Link
                                                        href={matterRoutes.index.url()}
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
                                    {matters.data.map((matter) => (
                                        <Link
                                            key={matter.id}
                                            href={matterRoutes.show(matter.id)}
                                            className="block p-3.5 transition-colors hover:bg-slate-50 active:bg-slate-100 dark:hover:bg-white/[0.02]"
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-1.5 font-mono text-[10px] font-semibold text-slate-500 dark:text-zinc-400">
                                                        <span>
                                                            {
                                                                matter.matter_number
                                                            }
                                                        </span>
                                                        <span>·</span>
                                                        <span className="truncate">
                                                            {matter
                                                                .practice_area
                                                                ?.name ??
                                                                'Umum'}
                                                        </span>
                                                    </div>
                                                    <p className="mt-0.5 line-clamp-2 text-xs font-bold text-slate-900 dark:text-white">
                                                        {matter.title}
                                                    </p>
                                                    <p className="mt-1 truncate text-[11px] font-medium text-slate-600 dark:text-zinc-300">
                                                        {
                                                            matter.client
                                                                .display_name
                                                        }
                                                    </p>
                                                </div>
                                                <ChevronRight className="size-4 shrink-0 text-slate-400" />
                                            </div>
                                            <div className="mt-2.5 flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-2 text-[10px] dark:border-white/[0.04]">
                                                <StatusBadge
                                                    value={matter.status}
                                                />
                                                <StatusBadge
                                                    value={matter.priority}
                                                />
                                                {matter.next_deadline && (
                                                    <span className="ml-auto font-mono text-slate-500 dark:text-zinc-400">
                                                        {formatDate(
                                                            matter.next_deadline,
                                                        )}
                                                    </span>
                                                )}
                                            </div>
                                        </Link>
                                    ))}
                                </div>

                                {/* Desktop Data Table (hidden sm:block) */}
                                <div className="hidden overflow-x-auto sm:block">
                                    <table className="w-full text-left text-xs">
                                        <thead>
                                            <tr className="border-b border-slate-100 bg-slate-50/60 text-[10px] font-semibold text-slate-500 uppercase dark:border-white/[0.04] dark:bg-[#121418]">
                                                <th className="py-2.5 pr-3 pl-4 font-semibold">
                                                    Perkara &amp; Nomor
                                                </th>
                                                <th className="px-3 py-2.5 font-semibold">
                                                    Klien
                                                </th>
                                                <th className="px-3 py-2.5 font-semibold">
                                                    Area Praktik
                                                </th>
                                                <th className="px-3 py-2.5 text-center font-semibold">
                                                    Lead Partner
                                                </th>
                                                <th className="px-3 py-2.5 font-semibold">
                                                    Status
                                                </th>
                                                <th className="px-3 py-2.5 font-semibold">
                                                    Prioritas
                                                </th>
                                                <th className="px-3 py-2.5 font-semibold">
                                                    Tenggat
                                                </th>
                                                <th className="py-2.5 pr-4 pl-1 text-right font-semibold"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                                            {matters.data.map((matter) => (
                                                <tr
                                                    key={matter.id}
                                                    className="group transition-colors hover:bg-slate-50/50 dark:hover:bg-white/[0.02]"
                                                >
                                                    {/* 1. Title & Number */}
                                                    <td className="py-2.5 pr-3 pl-4">
                                                        <Link
                                                            href={matterRoutes.show(
                                                                matter.id,
                                                            )}
                                                            className="flex items-center gap-2.5"
                                                        >
                                                            <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white dark:bg-blue-950/40 dark:text-blue-400">
                                                                <Briefcase className="size-3.5" />
                                                            </div>
                                                            <div className="min-w-0 space-y-0.5">
                                                                <p className="truncate text-xs font-semibold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                                                                    {
                                                                        matter.title
                                                                    }
                                                                </p>
                                                                <span className="inline-block font-mono text-[10px] font-semibold text-slate-500 dark:text-zinc-400">
                                                                    {
                                                                        matter.matter_number
                                                                    }
                                                                </span>
                                                            </div>
                                                        </Link>
                                                    </td>

                                                    {/* 2. Client */}
                                                    <td className="px-3 py-2.5 font-medium whitespace-nowrap">
                                                        {matter.client.id ? (
                                                            <Link
                                                                href={clientRoutes.show(
                                                                    matter
                                                                        .client
                                                                        .id,
                                                                )}
                                                                className="inline-flex items-center gap-1.5 text-slate-700 hover:text-blue-600 dark:text-zinc-300 dark:hover:text-blue-400"
                                                            >
                                                                {matter.client
                                                                    .type ===
                                                                    'individual' ||
                                                                matter.client
                                                                    .type ===
                                                                    'person' ? (
                                                                    <User className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                                                                ) : (
                                                                    <Building2 className="size-3.5 text-blue-600 dark:text-blue-400" />
                                                                )}
                                                                <span className="hover:underline">
                                                                    {
                                                                        matter
                                                                            .client
                                                                            .display_name
                                                                    }
                                                                </span>
                                                            </Link>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1.5 text-slate-700 dark:text-zinc-300">
                                                                {matter.client
                                                                    .type ===
                                                                    'individual' ||
                                                                matter.client
                                                                    .type ===
                                                                    'person' ? (
                                                                    <User className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                                                                ) : (
                                                                    <Building2 className="size-3.5 text-blue-600 dark:text-blue-400" />
                                                                )}
                                                                <span>
                                                                    {
                                                                        matter
                                                                            .client
                                                                            .display_name
                                                                    }
                                                                </span>
                                                            </span>
                                                        )}
                                                    </td>

                                                    {/* 3. Practice Area */}
                                                    <td className="px-3 py-2.5 whitespace-nowrap">
                                                        <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-white/[0.06] dark:text-zinc-300">
                                                            {matter
                                                                .practice_area
                                                                ?.name ??
                                                                'Umum'}
                                                        </span>
                                                    </td>

                                                    {/* 4. Responsible Partner */}
                                                    <td className="px-3 py-2.5 text-center whitespace-nowrap">
                                                        <TooltipProvider
                                                            delayDuration={100}
                                                        >
                                                            <Tooltip>
                                                                <TooltipTrigger
                                                                    asChild
                                                                >
                                                                    <div className="inline-flex cursor-pointer items-center justify-center">
                                                                        <Avatar className="size-6 rounded-full border border-slate-200/80 dark:border-white/10">
                                                                            <AvatarImage
                                                                                src={
                                                                                    matter
                                                                                        .responsible_partner
                                                                                        .avatar_url ??
                                                                                    undefined
                                                                                }
                                                                            />
                                                                            <AvatarFallback className="text-[8px] font-bold">
                                                                                {getInitials(
                                                                                    matter
                                                                                        .responsible_partner
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
                                                                        matter
                                                                            .responsible_partner
                                                                            .name
                                                                    }
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    </td>

                                                    {/* 5. Status */}
                                                    <td className="px-3 py-2.5 whitespace-nowrap">
                                                        <StatusBadge
                                                            value={
                                                                matter.status
                                                            }
                                                        />
                                                    </td>

                                                    {/* 6. Priority */}
                                                    <td className="px-3 py-2.5 whitespace-nowrap">
                                                        <StatusBadge
                                                            value={
                                                                matter.priority
                                                            }
                                                        />
                                                    </td>

                                                    {/* 7. Next Deadline */}
                                                    <td className="px-3 py-2.5 font-mono text-[11px] whitespace-nowrap text-slate-500 dark:text-zinc-400">
                                                        {matter.next_deadline
                                                            ? formatDate(
                                                                  matter.next_deadline,
                                                              )
                                                            : '-'}
                                                    </td>

                                                    {/* 8. Action Arrow */}
                                                    <td className="py-2.5 pr-4 pl-1 text-right">
                                                        <Link
                                                            href={matterRoutes.show(
                                                                matter.id,
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

                        {/* Table Footer with Pagination */}
                        <div className="flex flex-col justify-between gap-3 border-t border-slate-100 bg-slate-50/50 px-4 py-2.5 sm:flex-row sm:items-center dark:border-white/[0.04] dark:bg-[#121418]">
                            <span className="text-xs text-slate-500 dark:text-zinc-400">
                                Menampilkan{' '}
                                <span className="font-semibold text-slate-900 dark:text-white">
                                    {matters.data.length}
                                </span>{' '}
                                dari{' '}
                                <span className="font-semibold text-slate-900 dark:text-white">
                                    {matters.total}
                                </span>{' '}
                                perkara
                            </span>

                            <Pagination links={matters.links} />
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}

MattersIndex.layout = {
    breadcrumbs: [{ title: 'Perkara', href: matterRoutes.index() }],
};
