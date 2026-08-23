import { Form, Head } from '@inertiajs/react';
import {
    Activity,
    ChevronDown,
    Filter,
    Layers,
    RotateCcw,
    ShieldAlert,
    ShieldCheck,
    Users,
} from 'lucide-react';
import { EmptyState } from '@/components/empty-state';
import { Pagination } from '@/components/pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatDate } from '@/lib/format';
import * as auditRoutes from '@/routes/admin/audit';

type Log = {
    id: string;
    event: string;
    actor?: { name: string; email: string };
    subject_type?: string;
    subject_id?: string;
    metadata?: Record<string, unknown>;
    ip_address?: string;
    created_at: string;
};

type Page = {
    data: Log[];
    links: { url: string | null; label: string; active: boolean }[];
    total: number;
};

export default function AuditIndex({
    auditLogs,
    events,
    actors,
    metrics,
    filters,
}: {
    auditLogs: Page;
    events: string[];
    actors: { id: number; name: string }[];
    metrics: {
        total: number;
        today: number;
        actors_count: number;
        events_count: number;
    };
    filters: {
        event?: string;
        actor_id?: string;
        from?: string;
        until?: string;
    };
}) {
    return (
        <>
            <Head title="Audit Log & Jejak Aktivitas" />

            <div className="min-h-screen w-full bg-[#fbfbfa] text-[#111111] antialiased dark:bg-[#121212] dark:text-[#fbfbfa]">
                <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
                    {/* Header Minimalist Notion */}
                    <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div className="space-y-1">
                            <h1 className="text-2xl font-bold tracking-tight text-[#111111] dark:text-white">
                                Audit Log &amp; Jejak Aktivitas
                            </h1>
                            <p className="text-xs text-[#787774] dark:text-zinc-400">
                                Pelacakan riwayat aktivitas, modifikasi berkas perkara, akses finansial, dan audit trail kepatuhan hukum.
                            </p>
                        </div>
                    </header>

                    {/* Compact 4-Column Stat Strips (h-[76px]) */}
                    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {/* 1. Total Log */}
                        <div className="flex h-[76px] flex-col justify-between rounded-xl border border-black/[0.07] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                            <div className="flex items-center justify-between text-[11px] font-medium text-[#787774] dark:text-zinc-400">
                                <span>Total Rekaman Audit</span>
                                <ShieldCheck className="size-3.5 text-[#1f6c9f] dark:text-sky-400" />
                            </div>
                            <div className="flex items-baseline justify-between">
                                <span className="font-mono text-base font-bold tracking-tight text-[#111111] dark:text-white">
                                    {metrics.total} Log
                                </span>
                                <span className="text-[10px] text-[#787774] dark:text-zinc-400">
                                    immutable
                                </span>
                            </div>
                        </div>

                        {/* 2. Hari Ini */}
                        <div className="flex h-[76px] flex-col justify-between rounded-xl border border-black/[0.07] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                            <div className="flex items-center justify-between text-[11px] font-medium text-[#787774] dark:text-zinc-400">
                                <span>Aktivitas Hari Ini</span>
                                <Activity className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div className="flex items-baseline justify-between">
                                <span className="font-mono text-base font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                                    {metrics.today} Event
                                </span>
                                <span className="text-[10px] text-[#787774] dark:text-zinc-400">
                                    24 jam terakhir
                                </span>
                            </div>
                        </div>

                        {/* 3. Pelaku Aktif */}
                        <div className="flex h-[76px] flex-col justify-between rounded-xl border border-black/[0.07] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                            <div className="flex items-center justify-between text-[11px] font-medium text-[#787774] dark:text-zinc-400">
                                <span>Pelaku Teridentifikasi</span>
                                <Users className="size-3.5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div className="flex items-baseline justify-between">
                                <span className="font-mono text-base font-bold tracking-tight text-purple-600 dark:text-purple-400">
                                    {metrics.actors_count} Anggota
                                </span>
                                <span className="text-[10px] text-[#787774] dark:text-zinc-400">
                                    tercatat beraksi
                                </span>
                            </div>
                        </div>

                        {/* 4. Variasi Event */}
                        <div className="flex h-[76px] flex-col justify-between rounded-xl border border-black/[0.07] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                            <div className="flex items-center justify-between text-[11px] font-medium text-[#787774] dark:text-zinc-400">
                                <span>Ragam Event</span>
                                <Layers className="size-3.5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div className="flex items-baseline justify-between">
                                <span className="font-mono text-base font-bold tracking-tight text-[#111111] dark:text-white">
                                    {metrics.events_count} Tipe Event
                                </span>
                                <span className="text-[10px] text-[#787774] dark:text-zinc-400">
                                    auth, berkas, finance
                                </span>
                            </div>
                        </div>
                    </section>

                    {/* Filter Bar */}
                    <Form
                        {...auditRoutes.index.form()}
                        className="grid grid-cols-1 gap-2 rounded-xl border border-black/[0.08] bg-white p-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] sm:grid-cols-2 md:grid-cols-[1fr_1fr_140px_140px_auto] md:items-end dark:border-white/[0.08] dark:bg-[#1a1a1c]"
                    >
                        {/* Event Dropdown */}
                        <div className="space-y-1">
                            <Label className="text-[10px] font-semibold uppercase text-[#787774]">Jenis Event</Label>
                            <div className="relative">
                                <select
                                    name="event"
                                    defaultValue={filters.event ?? ''}
                                    className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-black/[0.08] bg-[#fbfbfa] pl-3 pr-8 text-xs font-medium text-[#111111] outline-none transition-colors hover:bg-black/[0.02] focus:border-black/20 focus:bg-white dark:border-white/[0.1] dark:bg-[#121212] dark:text-zinc-200"
                                >
                                    <option value="">Semua Event</option>
                                    {events.map((ev) => (
                                        <option key={ev} value={ev}>
                                            {ev}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3 -translate-y-1/2 text-[#787774]" />
                            </div>
                        </div>

                        {/* Actor Dropdown */}
                        <div className="space-y-1">
                            <Label className="text-[10px] font-semibold uppercase text-[#787774]">Pelaku / Aktor</Label>
                            <div className="relative">
                                <select
                                    name="actor_id"
                                    defaultValue={filters.actor_id ?? ''}
                                    className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-black/[0.08] bg-[#fbfbfa] pl-3 pr-8 text-xs font-medium text-[#111111] outline-none transition-colors hover:bg-black/[0.02] focus:border-black/20 focus:bg-white dark:border-white/[0.1] dark:bg-[#121212] dark:text-zinc-200"
                                >
                                    <option value="">Semua Pelaku</option>
                                    {actors.map((actor) => (
                                        <option key={actor.id} value={actor.id}>
                                            {actor.name}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3 -translate-y-1/2 text-[#787774]" />
                            </div>
                        </div>

                        {/* From Date */}
                        <div className="space-y-1">
                            <Label className="text-[10px] font-semibold uppercase text-[#787774]">Dari Tanggal</Label>
                            <Input
                                name="from"
                                type="date"
                                defaultValue={filters.from}
                                className="h-8 rounded-lg border border-black/[0.08] bg-[#fbfbfa] text-xs text-[#111111] dark:border-white/[0.1] dark:bg-[#121212]"
                            />
                        </div>

                        {/* Until Date */}
                        <div className="space-y-1">
                            <Label className="text-[10px] font-semibold uppercase text-[#787774]">Sampai Tanggal</Label>
                            <Input
                                name="until"
                                type="date"
                                defaultValue={filters.until}
                                className="h-8 rounded-lg border border-black/[0.08] bg-[#fbfbfa] text-xs text-[#111111] dark:border-white/[0.1] dark:bg-[#121212]"
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex items-center gap-1.5 pt-2 sm:pt-0">
                            <Button
                                type="submit"
                                className="h-8 rounded-lg bg-[#111111] px-3.5 text-xs font-semibold text-white shadow-2xs hover:bg-black active:scale-95 dark:bg-white dark:text-black"
                            >
                                <Filter className="mr-1 size-3" /> Filter
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="h-8 rounded-lg border-black/10 px-2.5 text-xs hover:bg-black/[0.03]"
                                asChild
                            >
                                <a href={auditRoutes.index.url()} title="Reset Filter">
                                    <RotateCcw className="size-3 text-[#787774]" />
                                </a>
                            </Button>
                        </div>
                    </Form>

                    {/* Audit Logs Table Card */}
                    <div className="overflow-hidden rounded-xl border border-black/[0.08] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                        {auditLogs.data.length === 0 ? (
                            <div className="flex min-h-[380px] items-center justify-center p-12 text-center">
                                <EmptyState
                                    title="Tidak ada log audit ditemukan"
                                    description="Tidak ada rekaman aktivitas yang sesuai dengan kriteria filter yang Anda pilih."
                                />
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead>
                                        <tr className="border-b border-black/[0.04] bg-[#fafafa] text-[10px] font-semibold uppercase tracking-wider text-[#787774] dark:border-white/[0.06] dark:bg-[#161618]">
                                            <th className="py-2.5 pl-4 pr-3">Waktu (WIB)</th>
                                            <th className="py-2.5 px-3">Event &amp; Objek</th>
                                            <th className="py-2.5 px-3">Pelaku / Aktor</th>
                                            <th className="py-2.5 px-3">Detail Perubahan</th>
                                            <th className="py-2.5 pl-3 pr-4 text-right">IP Address</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-black/[0.04] dark:divide-white/[0.05]">
                                        {auditLogs.data.map((log) => (
                                            <tr
                                                key={log.id}
                                                className="group transition-colors hover:bg-black/[0.01] dark:hover:bg-white/[0.02]"
                                            >
                                                {/* Timestamp */}
                                                <td className="py-3 pl-4 pr-3 whitespace-nowrap font-mono text-[11px] text-[#787774] dark:text-zinc-400">
                                                    {formatDate(log.created_at, true)}
                                                </td>

                                                {/* Event & Target Object */}
                                                <td className="py-3 px-3 whitespace-nowrap">
                                                    <div className="space-y-0.5">
                                                        <span className="rounded bg-[#e1f3fe] px-1.5 py-0.2 font-mono text-[10px] font-semibold text-[#1f6c9f] dark:bg-blue-950/40 dark:text-sky-300">
                                                            {log.event}
                                                        </span>
                                                        <p className="font-mono text-[10px] text-[#787774] dark:text-zinc-400">
                                                            {log.subject_type ? log.subject_type.split('\\').pop() : 'System'}
                                                            {log.subject_id ? ` · #${log.subject_id.slice(-8)}` : ''}
                                                        </p>
                                                    </div>
                                                </td>

                                                {/* Actor */}
                                                <td className="py-3 px-3 whitespace-nowrap">
                                                    <div>
                                                        <span className="font-semibold text-[#111111] dark:text-white">
                                                            {log.actor?.name ?? 'Sistem Otomatis'}
                                                        </span>
                                                        <p className="text-[10px] text-[#787774]">
                                                            {log.actor?.email ?? 'system@internal'}
                                                        </p>
                                                    </div>
                                                </td>

                                                {/* JSON Metadata Details */}
                                                <td className="py-3 px-3 max-w-sm">
                                                    <pre className="max-h-20 overflow-auto rounded-md bg-[#fafafa] p-2 font-mono text-[10px] leading-relaxed text-[#111111] border border-black/[0.06] dark:border-white/5 dark:bg-zinc-800/40 dark:text-zinc-300">
                                                        {JSON.stringify(log.metadata ?? {}, null, 2)}
                                                    </pre>
                                                </td>

                                                {/* IP Address */}
                                                <td className="py-3 pl-3 pr-4 text-right whitespace-nowrap font-mono text-[11px] text-[#787774] dark:text-zinc-400">
                                                    {log.ip_address ?? '—'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        <div className="flex flex-col justify-between gap-3 border-t border-black/[0.04] bg-[#fafafa] px-4 py-2.5 sm:flex-row sm:items-center dark:border-white/[0.06] dark:bg-[#161618]">
                            <span className="text-xs text-[#787774] dark:text-zinc-400">
                                Menampilkan <span className="font-semibold text-[#111111] dark:text-white">{auditLogs.data.length}</span> dari{' '}
                                <span className="font-semibold text-[#111111] dark:text-white">{auditLogs.total}</span> rekaman log
                            </span>
                            <Pagination links={auditLogs.links} />
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}

AuditIndex.layout = {
    breadcrumbs: [{ title: 'Audit Log', href: auditRoutes.index() }],
};
