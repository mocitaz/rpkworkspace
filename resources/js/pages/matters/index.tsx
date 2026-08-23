import { Form, Head, Link } from '@inertiajs/react';
import {
    Briefcase,
    ChevronDown,
    ChevronRight,
    FolderKanban,
    Layers,
    Plus,
    Search,
    ShieldAlert,
} from 'lucide-react';
import { EmptyState } from '@/components/empty-state';
import { Pagination } from '@/components/pagination';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { formatDate } from '@/lib/format';
import * as matterRoutes from '@/routes/matters';

type Matter = {
    id: string;
    matter_number: string;
    title: string;
    status: string;
    priority: string;
    next_deadline?: string;
    updated_at: string;
    client: { display_name: string };
    practice_area?: { name: string };
    responsible_partner: { id?: number; name: string; avatar_url?: string | null };
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
    const activeMattersCount = matters.data.filter((m) => m.status === 'active').length;
    const highPriorityCount = matters.data.filter(
        (m) => m.priority === 'critical' || m.priority === 'high',
    ).length;

    return (
        <>
            <Head title="Matters" />

            <div className="min-h-screen w-full bg-[#fbfbfa] text-[#111111] antialiased dark:bg-[#121212] dark:text-[#fbfbfa]">
                <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
                    {/* Notion Minimalist Header */}
                    <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div className="space-y-1">
                            <h1 className="text-2xl font-bold tracking-tight text-[#111111] dark:text-white">
                                Matters
                            </h1>
                            <p className="text-xs text-[#787774] dark:text-zinc-400">
                                Direktori penanganan perkara hukum, klien, dan penugasan tim advokat.
                            </p>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex shrink-0 items-center gap-2">
                            {can.create && (
                                <Button
                                    className="h-8 rounded-lg bg-[#111111] px-3.5 text-xs font-semibold text-white shadow-2xs transition-colors hover:bg-black active:scale-95 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                                    asChild
                                >
                                    <Link href={matterRoutes.create()}>
                                        <Plus className="mr-1.5 size-3.5" />
                                        Buat Matter
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </header>

                    {/* Compact 4-Column Stat Strip (h-[76px]) */}
                    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {/* 1. Total Matters */}
                        <div className="flex h-[76px] flex-col justify-between rounded-xl border border-black/[0.07] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                            <div className="flex items-center justify-between text-[11px] font-medium text-[#787774] dark:text-zinc-400">
                                <span>Total Portofolio</span>
                                <FolderKanban className="size-3.5 text-[#1f6c9f] dark:text-sky-400" />
                            </div>
                            <div className="flex items-baseline justify-between">
                                <span className="font-mono text-lg font-bold tracking-tight text-[#111111] dark:text-white">
                                    {matters.total}
                                </span>
                                <span className="text-[10px] text-[#787774] dark:text-zinc-400">
                                    perkara terdaftar
                                </span>
                            </div>
                        </div>

                        {/* 2. Active Matters */}
                        <div className="flex h-[76px] flex-col justify-between rounded-xl border border-black/[0.07] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                            <div className="flex items-center justify-between text-[11px] font-medium text-[#787774] dark:text-zinc-400">
                                <span>Perkara Berjalan</span>
                                <span className="size-2 rounded-full bg-emerald-500" />
                            </div>
                            <div className="flex items-baseline justify-between">
                                <span className="font-mono text-lg font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                                    {activeMattersCount}
                                </span>
                                <span className="text-[10px] text-[#787774] dark:text-zinc-400">
                                    status aktif
                                </span>
                            </div>
                        </div>

                        {/* 3. High/Critical Priority */}
                        <div className="flex h-[76px] flex-col justify-between rounded-xl border border-black/[0.07] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                            <div className="flex items-center justify-between text-[11px] font-medium text-[#787774] dark:text-zinc-400">
                                <span>Prioritas Tinggi</span>
                                <ShieldAlert className="size-3.5 text-[#956400] dark:text-amber-400" />
                            </div>
                            <div className="flex items-baseline justify-between">
                                <span className="font-mono text-lg font-bold tracking-tight text-amber-600 dark:text-amber-400">
                                    {highPriorityCount}
                                </span>
                                <span className="text-[10px] text-[#787774] dark:text-zinc-400">
                                    kritis & tinggi
                                </span>
                            </div>
                        </div>

                        {/* 4. Area Praktik */}
                        <div className="flex h-[76px] flex-col justify-between rounded-xl border border-black/[0.07] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                            <div className="flex items-center justify-between text-[11px] font-medium text-[#787774] dark:text-zinc-400">
                                <span>Area Praktik</span>
                                <Layers className="size-3.5 text-[#787774] dark:text-zinc-300" />
                            </div>
                            <div className="flex items-baseline justify-between">
                                <span className="font-mono text-lg font-bold tracking-tight text-[#111111] dark:text-white">
                                    {practiceAreas.length}
                                </span>
                                <span className="text-[10px] text-[#787774] dark:text-zinc-400">
                                    bidang keahlian
                                </span>
                            </div>
                        </div>
                    </section>

                    {/* Notion Inline Filter Toolbar */}
                    <Form
                        {...matterRoutes.index.form()}
                        className="flex flex-col gap-2 rounded-xl border border-black/[0.08] bg-white p-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] sm:flex-row sm:items-center sm:justify-between dark:border-white/[0.08] dark:bg-[#1a1a1c]"
                    >
                        {/* Search Input */}
                        <div className="relative flex-1 min-w-[240px]">
                            <Search className="pointer-events-none absolute left-3 top-2 size-3.5 text-[#787774]" />
                            <Input
                                name="search"
                                defaultValue={filters.search}
                                placeholder="Cari nomor perkara atau judul matter…"
                                className="h-7.5 w-full rounded-lg border-black/[0.08] bg-[#fbfbfa] pl-8.5 pr-3 text-xs text-[#2f3437] placeholder:text-[#787774] focus:border-black/20 focus:bg-white focus:outline-none dark:border-white/[0.1] dark:bg-[#121212] dark:text-zinc-200 dark:focus:border-white/20"
                            />
                        </div>

                        {/* Filter Selects and Toggles */}
                        <div className="flex flex-wrap items-center gap-2">
                            {/* Status Filter */}
                            <div className="relative">
                                <select
                                    name="status"
                                    defaultValue={filters.status ?? ''}
                                    className="h-7.5 cursor-pointer appearance-none rounded-lg border border-black/[0.08] bg-[#fbfbfa] pl-3 pr-7 text-xs font-medium text-[#2f3437] outline-none transition-colors hover:bg-black/[0.02] focus:border-black/20 focus:bg-white dark:border-white/[0.1] dark:bg-[#121212] dark:text-zinc-200 dark:hover:bg-white/[0.04]"
                                >
                                    <option value="">Semua Status</option>
                                    <option value="active">Aktif</option>
                                    <option value="on_hold">Ditunda</option>
                                    <option value="closed">Ditutup</option>
                                </select>
                                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3 -translate-y-1/2 text-[#787774]" />
                            </div>

                            {/* Practice Area Filter */}
                            <div className="relative">
                                <select
                                    name="practice_area_id"
                                    defaultValue={filters.practice_area_id ?? ''}
                                    className="h-7.5 cursor-pointer appearance-none rounded-lg border border-black/[0.08] bg-[#fbfbfa] pl-3 pr-7 text-xs font-medium text-[#2f3437] outline-none transition-colors hover:bg-black/[0.02] focus:border-black/20 focus:bg-white dark:border-white/[0.1] dark:bg-[#121212] dark:text-zinc-200 dark:hover:bg-white/[0.04]"
                                >
                                    <option value="">Semua Area Praktik</option>
                                    {practiceAreas.map((area) => (
                                        <option key={area.id} value={area.id}>
                                            {area.name}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3 -translate-y-1/2 text-[#787774]" />
                            </div>

                            {/* Mine Toggle */}
                            <label className="flex h-7.5 cursor-pointer items-center gap-2 rounded-lg border border-black/[0.08] bg-[#fbfbfa] px-3 text-xs font-medium text-[#2f3437] transition-colors hover:bg-black/[0.02] dark:border-white/[0.1] dark:bg-[#121212] dark:text-zinc-200 dark:hover:bg-white/[0.04]">
                                <input
                                    type="checkbox"
                                    name="mine"
                                    value="1"
                                    defaultChecked={filters.mine === '1'}
                                    className="size-3.5 rounded border-zinc-300 text-[#111111] focus:ring-0 dark:border-zinc-700"
                                />
                                Ditugaskan ke saya
                            </label>

                            {/* Submit Filter Button */}
                            <Button
                                type="submit"
                                variant="outline"
                                className="h-7.5 rounded-lg border-black/10 bg-white px-3 text-xs font-medium text-[#111111] shadow-2xs hover:bg-black/[0.03] dark:border-white/10 dark:bg-[#1c1c1e] dark:text-zinc-200 dark:hover:bg-white/[0.06]"
                            >
                                Terapkan
                            </Button>
                        </div>
                    </Form>

                    {/* Notion Database Table View */}
                    <div className="overflow-hidden rounded-xl border border-black/[0.08] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                        {matters.data.length === 0 ? (
                            <div className="flex min-h-[380px] items-center justify-center p-12 text-center">
                                <EmptyState
                                    title="Tidak ada matter yang sesuai"
                                    description="Ubah filter pencarian atau buat perkara baru untuk menambah portofolio."
                                />
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead>
                                        <tr className="border-b border-black/[0.04] bg-[#fafafa] text-[10px] font-semibold tracking-wider text-[#787774] uppercase dark:border-white/[0.06] dark:bg-[#161618]">
                                            <th className="py-2.5 pl-4 pr-3 font-semibold">Perkara</th>
                                            <th className="px-3 py-2.5 font-semibold">Klien</th>
                                            <th className="px-3 py-2.5 font-semibold">Area Praktik</th>
                                            <th className="px-3 py-2.5 text-center font-semibold">Partner</th>
                                            <th className="px-3 py-2.5 font-semibold">Status</th>
                                            <th className="px-3 py-2.5 font-semibold">Prioritas</th>
                                            <th className="px-3 py-2.5 font-semibold">Tenggat</th>
                                            <th className="py-2.5 pl-1 pr-4 text-right font-semibold"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-black/[0.04] dark:divide-white/[0.05]">
                                        {matters.data.map((matter) => (
                                            <tr
                                                key={matter.id}
                                                className="group transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.03]"
                                            >
                                                {/* 1. Matter Title & Number */}
                                                <td className="py-3 pl-4 pr-3">
                                                    <Link
                                                        href={matterRoutes.show(matter.id)}
                                                        className="flex items-center gap-2.5"
                                                    >
                                                        <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-black/[0.04] text-[#787774] dark:bg-white/[0.06] dark:text-zinc-300">
                                                            <Briefcase className="size-3.5" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="truncate text-xs font-semibold text-[#111111] group-hover:text-blue-600 dark:text-zinc-100 dark:group-hover:text-sky-400">
                                                                {matter.title}
                                                            </p>
                                                            <span className="inline-block rounded bg-[#e1f3fe] px-1.5 py-0.2 font-mono text-[10px] font-medium text-[#1f6c9f] dark:bg-blue-950/50 dark:text-sky-300">
                                                                {matter.matter_number}
                                                            </span>
                                                        </div>
                                                    </Link>
                                                </td>

                                                {/* 2. Client */}
                                                <td className="whitespace-nowrap px-3 py-3 font-medium text-[#2f3437] dark:text-zinc-300">
                                                    {matter.client.display_name}
                                                </td>

                                                {/* 3. Practice Area */}
                                                <td className="whitespace-nowrap px-3 py-3">
                                                    <span className="inline-flex items-center rounded-md bg-black/[0.04] px-2 py-0.5 text-[10px] font-medium text-[#787774] dark:bg-white/[0.06] dark:text-zinc-400">
                                                        {matter.practice_area?.name ?? 'Umum'}
                                                    </span>
                                                </td>

                                                {/* 4. Responsible Partner (Avatar with Tooltip) */}
                                                <td className="whitespace-nowrap px-3 py-3 text-center">
                                                    <TooltipProvider delayDuration={150}>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <div className="inline-flex cursor-pointer items-center justify-center">
                                                                    <div className="relative flex size-6.5 shrink-0 items-center justify-center overflow-hidden rounded-full bg-black/[0.05] text-[10px] font-semibold text-zinc-700 dark:bg-white/[0.1] dark:text-zinc-300">
                                                                        {matter.responsible_partner.avatar_url ? (
                                                                            <img
                                                                                src={matter.responsible_partner.avatar_url}
                                                                                alt={matter.responsible_partner.name}
                                                                                className="size-full object-cover"
                                                                            />
                                                                        ) : (
                                                                            matter.responsible_partner.name
                                                                                .split(' ')
                                                                                .map((n) => n[0])
                                                                                .slice(0, 2)
                                                                                .join('')
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </TooltipTrigger>
                                                            <TooltipContent
                                                                side="top"
                                                                className="rounded-lg border border-black/10 bg-[#111111] px-2.5 py-1 text-xs text-white shadow-lg dark:border-white/10 dark:bg-white dark:text-black"
                                                            >
                                                                <div className="flex flex-col text-left">
                                                                    <span className="font-semibold">{matter.responsible_partner.name}</span>
                                                                    <span className="text-[10px] text-[#787774] dark:text-zinc-400">Partner Penanggung Jawab</span>
                                                                </div>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </td>

                                                {/* 5. Status */}
                                                <td className="whitespace-nowrap px-3 py-3">
                                                    <StatusBadge value={matter.status} />
                                                </td>

                                                {/* 6. Priority */}
                                                <td className="whitespace-nowrap px-3 py-3">
                                                    <StatusBadge value={matter.priority} />
                                                </td>

                                                {/* 7. Next Deadline */}
                                                <td className="whitespace-nowrap px-3 py-3 font-mono text-[11px] text-[#787774] dark:text-zinc-400">
                                                    {matter.next_deadline ? formatDate(matter.next_deadline) : '—'}
                                                </td>

                                                {/* 8. Action Arrow */}
                                                <td className="py-3 pl-1 pr-4 text-right">
                                                    <Link
                                                        href={matterRoutes.show(matter.id)}
                                                        className="inline-flex size-6 items-center justify-center text-[#787774] opacity-0 transition-opacity group-hover:opacity-100 hover:text-[#111111] dark:hover:text-white"
                                                    >
                                                        <ChevronRight className="size-3.5" />
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Unified Table Footer with Pagination */}
                        <div className="flex flex-col justify-between gap-3 border-t border-black/[0.04] bg-[#fafafa] px-4 py-2.5 sm:flex-row sm:items-center dark:border-white/[0.06] dark:bg-[#161618]">
                            <span className="text-xs text-[#787774] dark:text-zinc-400">
                                Menampilkan <span className="font-semibold text-[#111111] dark:text-white">{matters.data.length}</span> dari{' '}
                                <span className="font-semibold text-[#111111] dark:text-white">{matters.total}</span> perkara
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
    breadcrumbs: [{ title: 'Matters', href: matterRoutes.index() }],
};
