import { Head, Link, usePage } from '@inertiajs/react';
import {
    Briefcase,
    Calendar as CalendarIcon,
    CheckCircle2,
    ChevronRight,
    Clock,
    FileText,
    Gavel,
    Layers,
    ListTodo,
    Plus,
    Search,
    ShieldCheck,
    X,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { EmptyState } from '@/components/empty-state';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { formatBytes, formatDate } from '@/lib/format';
import { dashboard } from '@/routes';
import * as calendarRoutes from '@/routes/calendar';
import * as documentsRoutes from '@/routes/documents';
import * as mattersRoutes from '@/routes/matters';
import * as tasksRoutes from '@/routes/tasks';

type Task = {
    id: string;
    title: string;
    priority: string;
    status: string;
    due_at?: string;
    matter?: { id: string; matter_number: string; title: string };
};

type Deadline = {
    id: string;
    title: string;
    due_at: string;
    is_critical: boolean;
    matter: { id: string; matter_number: string; title: string };
};

type Event = {
    id: string;
    title: string;
    event_type: string;
    starts_at: string;
    matter: { id: string; matter_number: string; title: string };
};

type Matter = {
    id: string;
    matter_number: string;
    title: string;
    status: string;
    client: { id: string; display_name: string };
    practice_area?: { name: string };
};

type Document = {
    id: string;
    title: string;
    status: string;
    confidentiality_level: string;
    updated_at: string;
    matter?: { id: string; matter_number: string };
    current_version?: { version_number: number; file_size?: number };
};

type DatabaseTab = 'tasks' | 'matters' | 'documents';

function getDaysRemaining(dateString: string): { label: string; urgency: 'urgent' | 'warning' | 'normal' } {
    const target = new Date(dateString);
    const now = new Date();
    const diffTime = target.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { label: `${Math.abs(diffDays)}h lalu`, urgency: 'urgent' };
    if (diffDays === 0) return { label: 'Hari ini', urgency: 'urgent' };
    if (diffDays === 1) return { label: 'Besok', urgency: 'warning' };
    return { label: `${diffDays} hari`, urgency: 'normal' };
}

function formatTimeOnly(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Jakarta',
    }).format(date);
}

export default function Dashboard({
    tasks,
    deadlines,
    events,
    matters,
    documents,
}: {
    tasks: Task[];
    deadlines: Deadline[];
    events: Event[];
    matters: Matter[];
    documents: Document[];
}) {
    const { auth } = usePage().props;
    const [activeTab, setActiveTab] = useState<DatabaseTab>('tasks');
    const [searchQuery, setSearchQuery] = useState('');

    const overdueTasks = useMemo(
        () => tasks.filter((t) => t.due_at && new Date(t.due_at) < new Date()),
        [tasks],
    );
    const criticalDeadlines = useMemo(
        () => deadlines.filter((d) => d.is_critical),
        [deadlines],
    );

    const userName = auth.user.name ?? 'Administrator';

    // Filtered data for active Notion Database
    const filteredTasks = useMemo(() => {
        if (!searchQuery) return tasks;
        const q = searchQuery.toLowerCase();
        return tasks.filter(
            (t) =>
                t.title.toLowerCase().includes(q) ||
                (t.matter?.title && t.matter.title.toLowerCase().includes(q)) ||
                (t.matter?.matter_number && t.matter.matter_number.toLowerCase().includes(q)),
        );
    }, [tasks, searchQuery]);

    const filteredMatters = useMemo(() => {
        if (!searchQuery) return matters;
        const q = searchQuery.toLowerCase();
        return matters.filter(
            (m) =>
                m.title.toLowerCase().includes(q) ||
                m.matter_number.toLowerCase().includes(q) ||
                m.client.display_name.toLowerCase().includes(q),
        );
    }, [matters, searchQuery]);

    const filteredDocuments = useMemo(() => {
        if (!searchQuery) return documents;
        const q = searchQuery.toLowerCase();
        return documents.filter(
            (d) =>
                d.title.toLowerCase().includes(q) ||
                (d.matter?.matter_number && d.matter.matter_number.toLowerCase().includes(q)),
        );
    }, [documents, searchQuery]);

    // Combined timeline for Radar (Deadlines + Events)
    const timelineItems = useMemo(() => {
        const list: Array<{
            id: string;
            type: 'deadline' | 'event';
            title: string;
            date: string;
            matter: { id: string; matter_number: string; title: string };
            isCritical?: boolean;
        }> = [];

        deadlines.forEach((d) => {
            list.push({
                id: `d-${d.id}`,
                type: 'deadline',
                title: d.title,
                date: d.due_at,
                matter: d.matter,
                isCritical: d.is_critical,
            });
        });

        events.forEach((e) => {
            list.push({
                id: `e-${e.id}`,
                type: 'event',
                title: e.title,
                date: e.starts_at,
                matter: e.matter,
                isCritical: false,
            });
        });

        return list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [deadlines, events]);

    return (
        <>
            <Head title="Dashboard — RPK Law Firm" />

            <div className="min-h-screen w-full bg-[#fbfbfa] pb-24 text-[#2f3437] antialiased dark:bg-[#121212] dark:text-[#d4d4d4]">
                <main className="mx-auto flex w-full max-w-[1240px] flex-col gap-5 px-4 pt-6 sm:px-6 lg:px-8">
                    {/* Notion Minimalist Header */}
                    <header className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-[#111111] sm:text-2xl dark:text-white">
                                Dashboard
                            </h1>
                            <p className="text-xs text-[#787774] dark:text-zinc-400">
                                Ruang kerja operasional kantor hukum · Selamat datang kembali, {userName}.
                            </p>
                        </div>

                        {/* Notion-style Action Pills */}
                        <div className="flex shrink-0 items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 rounded-lg border-black/[0.08] bg-white px-3 text-xs font-medium text-[#2f3437] shadow-2xs hover:bg-black/[0.03] dark:border-white/[0.1] dark:bg-[#1c1c1e] dark:text-zinc-200"
                                asChild
                            >
                                <Link href={tasksRoutes.index()}>
                                    <Plus className="mr-1.5 size-3.5 text-[#787774]" />
                                    Tugas Baru
                                </Link>
                            </Button>

                            <Button
                                size="sm"
                                className="h-8 rounded-lg bg-[#111111] px-3.5 text-xs font-medium text-white shadow-2xs hover:bg-black active:scale-[0.98] dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                                asChild
                            >
                                <Link href={mattersRoutes.create()}>
                                    <Plus className="mr-1.5 size-3.5" />
                                    Matter Baru
                                </Link>
                            </Button>
                        </div>
                    </header>

                    {/* Compact Notion KPI Strip (4 Tiles) */}
                    <section className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                        {/* 1. Matters */}
                        <div
                            onClick={() => setActiveTab('matters')}
                            className="group flex h-[76px] cursor-pointer flex-col justify-between rounded-xl border border-black/[0.07] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all hover:border-black/20 hover:shadow-xs dark:border-white/[0.08] dark:bg-[#1a1a1c] dark:hover:border-white/20"
                        >
                            <div className="flex items-center justify-between text-[11px] font-medium text-[#787774] dark:text-zinc-400">
                                <span>Perkara Aktif</span>
                                <Briefcase className="size-3.5 text-[#1f6c9f] dark:text-[#38bdf8]" />
                            </div>
                            <div className="flex items-baseline justify-between">
                                <span className="font-mono text-lg font-bold tracking-tight text-[#111111] dark:text-white">
                                    {matters.length}
                                </span>
                                <span className="text-[10px] text-[#787774] dark:text-zinc-400">
                                    perkara dipantau
                                </span>
                            </div>
                        </div>

                        {/* 2. Tasks */}
                        <div
                            onClick={() => setActiveTab('tasks')}
                            className="group flex h-[76px] cursor-pointer flex-col justify-between rounded-xl border border-black/[0.07] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all hover:border-black/20 hover:shadow-xs dark:border-white/[0.08] dark:bg-[#1a1a1c] dark:hover:border-white/20"
                        >
                            <div className="flex items-center justify-between text-[11px] font-medium text-[#787774] dark:text-zinc-400">
                                <span>Tugas Terbuka</span>
                                <ListTodo className="size-3.5 text-[#346538] dark:text-[#4ade80]" />
                            </div>
                            <div className="flex items-baseline justify-between">
                                <span className="font-mono text-lg font-bold tracking-tight text-[#111111] dark:text-white">
                                    {tasks.length}
                                </span>
                                <span
                                    className={`text-[10px] font-medium ${
                                        overdueTasks.length > 0
                                            ? 'text-rose-600 dark:text-rose-400'
                                            : 'text-[#787774] dark:text-zinc-400'
                                    }`}
                                >
                                    {overdueTasks.length > 0 ? `${overdueTasks.length} terlewat` : 'terkendali'}
                                </span>
                            </div>
                        </div>

                        {/* 3. Deadlines */}
                        <div
                            onClick={() => setActiveTab('tasks')}
                            className="group flex h-[76px] cursor-pointer flex-col justify-between rounded-xl border border-black/[0.07] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all hover:border-black/20 hover:shadow-xs dark:border-white/[0.08] dark:bg-[#1a1a1c] dark:hover:border-white/20"
                        >
                            <div className="flex items-center justify-between text-[11px] font-medium text-[#787774] dark:text-zinc-400">
                                <span>Tenggat Kritis</span>
                                <Clock className="size-3.5 text-[#956400] dark:text-[#fbbf24]" />
                            </div>
                            <div className="flex items-baseline justify-between">
                                <span className="font-mono text-lg font-bold tracking-tight text-[#111111] dark:text-white">
                                    {deadlines.length}
                                </span>
                                <span
                                    className={`text-[10px] font-medium ${
                                        criticalDeadlines.length > 0
                                            ? 'text-amber-600 dark:text-amber-400'
                                            : 'text-[#787774] dark:text-zinc-400'
                                    }`}
                                >
                                    {criticalDeadlines.length > 0 ? `${criticalDeadlines.length} mendesak` : 'terjadwal'}
                                </span>
                            </div>
                        </div>

                        {/* 4. Documents */}
                        <div
                            onClick={() => setActiveTab('documents')}
                            className="group flex h-[76px] cursor-pointer flex-col justify-between rounded-xl border border-black/[0.07] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all hover:border-black/20 hover:shadow-xs dark:border-white/[0.08] dark:bg-[#1a1a1c] dark:hover:border-white/20"
                        >
                            <div className="flex items-center justify-between text-[11px] font-medium text-[#787774] dark:text-zinc-400">
                                <span>Arsip Berkas</span>
                                <FileText className="size-3.5 text-[#787774] dark:text-zinc-300" />
                            </div>
                            <div className="flex items-baseline justify-between">
                                <span className="font-mono text-lg font-bold tracking-tight text-[#111111] dark:text-white">
                                    {documents.length}
                                </span>
                                <span className="text-[10px] text-[#787774] dark:text-zinc-400">
                                    berkas aman
                                </span>
                            </div>
                        </div>
                    </section>

                    {/* Dual Cockpit Grid: 65% Database | 35% Timeline Radar */}
                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
                        {/* Left: Notion Database Workspace (8 Cols on LG) */}
                        <div className="flex flex-col justify-between overflow-hidden rounded-xl border border-black/[0.08] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.02)] lg:col-span-8 dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                            {/* Database View Tabs + Search Bar */}
                            <div className="flex flex-col justify-between gap-2.5 border-b border-black/[0.06] p-3 sm:flex-row sm:items-center dark:border-white/[0.08]">
                                <div className="flex items-center gap-1">
                                    <NotionTabButton
                                        active={activeTab === 'tasks'}
                                        onClick={() => setActiveTab('tasks')}
                                        icon={ListTodo}
                                        label="Tugas"
                                        count={tasks.length}
                                    />
                                    <NotionTabButton
                                        active={activeTab === 'matters'}
                                        onClick={() => setActiveTab('matters')}
                                        icon={Briefcase}
                                        label="Matter"
                                        count={matters.length}
                                    />
                                    <NotionTabButton
                                        active={activeTab === 'documents'}
                                        onClick={() => setActiveTab('documents')}
                                        icon={FileText}
                                        label="Dokumen"
                                        count={documents.length}
                                    />
                                </div>

                                {/* Instant Filter Input */}
                                <div className="relative flex items-center">
                                    <Search className="pointer-events-none absolute left-2.5 size-3.5 text-[#787774]" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Cari dalam tampilan..."
                                        className="h-7.5 w-full rounded-lg border border-black/[0.08] bg-[#fbfbfa] pl-8 pr-7 text-xs text-[#2f3437] placeholder:text-[#787774] focus:border-black/20 focus:bg-white focus:outline-none sm:w-48 dark:border-white/[0.1] dark:bg-[#121212] dark:text-zinc-200 dark:focus:border-white/20"
                                    />
                                    {searchQuery && (
                                        <button
                                            type="button"
                                            onClick={() => setSearchQuery('')}
                                            className="absolute right-2 text-[#787774] hover:text-[#111111] dark:hover:text-white"
                                        >
                                            <X className="size-3" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Database Body with Fixed Compact Height (h-[440px]) */}
                            <div className="h-[440px] overflow-y-auto">
                                {/* TAB 1: TUGAS */}
                                {activeTab === 'tasks' && (
                                    <div className="min-h-full flex flex-col">
                                        {filteredTasks.length > 0 ? (
                                            <div>
                                                <div className="sticky top-0 z-10 grid grid-cols-[2fr_1.1fr_120px_100px_32px] items-center gap-2 border-b border-black/[0.04] bg-[#fafafa] px-4 py-2 text-[10px] font-semibold text-[#787774] uppercase tracking-wider dark:border-white/[0.06] dark:bg-[#161618]">
                                                    <span>Tugas</span>
                                                    <span>Perkara</span>
                                                    <span>Tenggat</span>
                                                    <span>Prioritas</span>
                                                    <span></span>
                                                </div>
                                                <div className="divide-y divide-black/[0.04] dark:divide-white/[0.05]">
                                                    {filteredTasks.map((task) => {
                                                        const isOverdue = Boolean(
                                                            task.due_at && new Date(task.due_at) < new Date(),
                                                        );

                                                        return (
                                                            <Link
                                                                key={task.id}
                                                                href={tasksRoutes.index()}
                                                                className="group grid grid-cols-[2fr_1.1fr_120px_100px_32px] items-center gap-2 px-4 py-2.5 transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.03]"
                                                            >
                                                                <div className="flex min-w-0 items-center gap-2.5">
                                                                    <span
                                                                        className={`flex size-4 shrink-0 items-center justify-center rounded border transition-colors ${
                                                                            isOverdue
                                                                                ? 'border-rose-400 bg-rose-50 text-rose-600 dark:border-rose-600 dark:bg-rose-950/40'
                                                                                : 'border-zinc-300 group-hover:border-zinc-500 dark:border-zinc-600'
                                                                        }`}
                                                                    />
                                                                    <span className="truncate text-xs font-medium text-[#111111] group-hover:underline dark:text-zinc-200">
                                                                        {task.title}
                                                                    </span>
                                                                </div>

                                                                <div className="min-w-0">
                                                                    {task.matter ? (
                                                                        <span className="inline-block truncate rounded-md bg-[#e1f3fe] px-2 py-0.5 font-mono text-[10px] font-medium text-[#1f6c9f] dark:bg-blue-950/50 dark:text-sky-300">
                                                                            {task.matter.matter_number}
                                                                        </span>
                                                                    ) : (
                                                                        <span className="text-[11px] text-[#787774] dark:text-zinc-500">
                                                                            Umum
                                                                        </span>
                                                                    )}
                                                                </div>

                                                                <div className="min-w-0">
                                                                    <span className="font-mono text-[11px] text-[#787774] dark:text-zinc-400">
                                                                        {task.due_at ? formatDate(task.due_at) : '—'}
                                                                    </span>
                                                                </div>

                                                                <div>
                                                                    <StatusBadge value={task.priority} />
                                                                </div>

                                                                <div className="flex justify-end">
                                                                    <ChevronRight className="size-3.5 text-[#787774] opacity-0 transition-opacity group-hover:opacity-100" />
                                                                </div>
                                                            </Link>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-1 min-h-[380px] items-center justify-center p-8 text-center">
                                                <EmptyState title="Tidak ada tugas ditemukan" />
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* TAB 2: MATTERS */}
                                {activeTab === 'matters' && (
                                    <div className="min-h-full flex flex-col">
                                        {filteredMatters.length > 0 ? (
                                            <div>
                                                <div className="sticky top-0 z-10 grid grid-cols-[1.8fr_1.1fr_1.1fr_120px_32px] items-center gap-2 border-b border-black/[0.04] bg-[#fafafa] px-4 py-2 text-[10px] font-semibold text-[#787774] uppercase tracking-wider dark:border-white/[0.06] dark:bg-[#161618]">
                                                    <span>Perkara</span>
                                                    <span>Klien</span>
                                                    <span>Area Praktik</span>
                                                    <span>Status</span>
                                                    <span></span>
                                                </div>
                                                <div className="divide-y divide-black/[0.04] dark:divide-white/[0.05]">
                                                    {filteredMatters.map((matter) => (
                                                        <Link
                                                            key={matter.id}
                                                            href={mattersRoutes.show(matter.id)}
                                                            className="group grid grid-cols-[1.8fr_1.1fr_1.1fr_120px_32px] items-center gap-2 px-4 py-2.5 transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.03]"
                                                        >
                                                            <div className="min-w-0">
                                                                <p className="truncate text-xs font-semibold text-[#111111] group-hover:text-blue-600 dark:text-zinc-100 dark:group-hover:text-sky-400">
                                                                    {matter.title}
                                                                </p>
                                                                <span className="font-mono text-[10px] text-[#787774] dark:text-zinc-500">
                                                                    {matter.matter_number}
                                                                </span>
                                                            </div>

                                                            <div className="min-w-0">
                                                                <span className="truncate text-xs text-[#2f3437] dark:text-zinc-300">
                                                                    {matter.client.display_name}
                                                                </span>
                                                            </div>

                                                            <div className="min-w-0">
                                                                <span className="inline-block truncate rounded-md bg-black/[0.04] px-2 py-0.5 text-[10px] text-[#787774] dark:bg-white/[0.06] dark:text-zinc-400">
                                                                    {matter.practice_area?.name ?? 'Umum'}
                                                                </span>
                                                            </div>

                                                            <div>
                                                                <StatusBadge value={matter.status} />
                                                            </div>

                                                            <div className="flex justify-end">
                                                                <ChevronRight className="size-3.5 text-[#787774] opacity-0 transition-opacity group-hover:opacity-100" />
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-1 min-h-[380px] items-center justify-center p-8 text-center">
                                                <EmptyState title="Tidak ada matter ditemukan" />
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* TAB 3: DOKUMEN */}
                                {activeTab === 'documents' && (
                                    <div className="min-h-full flex flex-col">
                                        {filteredDocuments.length > 0 ? (
                                            <div>
                                                <div className="sticky top-0 z-10 grid grid-cols-[2fr_1.1fr_70px_80px_110px_32px] items-center gap-2 border-b border-black/[0.04] bg-[#fafafa] px-4 py-2 text-[10px] font-semibold text-[#787774] uppercase tracking-wider dark:border-white/[0.06] dark:bg-[#161618]">
                                                    <span>Nama Dokumen</span>
                                                    <span>Perkara</span>
                                                    <span>Versi</span>
                                                    <span>Ukuran</span>
                                                    <span>Status</span>
                                                    <span></span>
                                                </div>
                                                <div className="divide-y divide-black/[0.04] dark:divide-white/[0.05]">
                                                    {filteredDocuments.map((doc) => (
                                                        <Link
                                                            key={doc.id}
                                                            href={documentsRoutes.show(doc.id)}
                                                            className="group grid grid-cols-[2fr_1.1fr_70px_80px_110px_32px] items-center gap-2 px-4 py-2.5 transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.03]"
                                                        >
                                                            <div className="flex min-w-0 items-center gap-2">
                                                                <FileText className="size-3.5 shrink-0 text-[#787774]" />
                                                                <span className="truncate text-xs font-medium text-[#111111] group-hover:text-blue-600 dark:text-zinc-100 dark:group-hover:text-sky-400">
                                                                    {doc.title}
                                                                </span>
                                                            </div>

                                                            <div className="min-w-0">
                                                                <span className="font-mono text-xs text-[#787774] dark:text-zinc-400">
                                                                    {doc.matter?.matter_number ?? '—'}
                                                                </span>
                                                            </div>

                                                            <div>
                                                                <span className="font-mono text-[10px] text-[#787774] dark:text-zinc-400">
                                                                    v{doc.current_version?.version_number ?? 1}.0
                                                                </span>
                                                            </div>

                                                            <div>
                                                                <span className="font-mono text-[10px] text-[#787774] dark:text-zinc-400">
                                                                    {formatBytes(doc.current_version?.file_size)}
                                                                </span>
                                                            </div>

                                                            <div>
                                                                <StatusBadge value={doc.status} />
                                                            </div>

                                                            <div className="flex justify-end">
                                                                <ChevronRight className="size-3.5 text-[#787774] opacity-0 transition-opacity group-hover:opacity-100" />
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-1 min-h-[380px] items-center justify-center p-8 text-center">
                                                <EmptyState title="Tidak ada dokumen ditemukan" />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Database Bottom Action Strip */}
                            <div className="flex h-9 shrink-0 items-center justify-between border-t border-black/[0.06] bg-[#fafafa] px-4 text-[11px] text-[#787774] dark:border-white/[0.08] dark:bg-[#161618]">
                                <span>
                                    {activeTab === 'tasks' && `${filteredTasks.length} tugas dalam antrean`}
                                    {activeTab === 'matters' && `${filteredMatters.length} perkara aktif`}
                                    {activeTab === 'documents' && `${filteredDocuments.length} berkas terindeks`}
                                </span>
                                <Link
                                    href={
                                        activeTab === 'tasks'
                                            ? tasksRoutes.index()
                                            : activeTab === 'matters'
                                              ? mattersRoutes.index()
                                              : documentsRoutes.index()
                                    }
                                    className="inline-flex items-center gap-1 font-medium text-[#111111] hover:underline dark:text-white"
                                >
                                    <span>Buka Halaman Lengkap</span>
                                    <ChevronRight className="size-3" />
                                </Link>
                            </div>
                        </div>

                        {/* Right: Radar & Quick Context (4 Cols on LG) */}
                        <div className="space-y-4 lg:col-span-4">
                            {/* Card 1: Radar Tenggat & Agenda */}
                            <div className="overflow-hidden rounded-xl border border-black/[0.08] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                                <div className="flex items-center justify-between border-b border-black/[0.06] px-4 py-2.5 dark:border-white/[0.08]">
                                    <span className="text-[10px] font-bold tracking-wider text-[#787774] uppercase">
                                        Radar Tenggat & Sidang
                                    </span>
                                    <Link
                                        href={calendarRoutes.index()}
                                        className="text-[10px] font-semibold text-blue-600 hover:underline dark:text-sky-400"
                                    >
                                        Kalender →
                                    </Link>
                                </div>

                                <div className="divide-y divide-black/[0.04] dark:divide-white/[0.05]">
                                    {timelineItems.slice(0, 4).map((item) => {
                                        const { label, urgency } = getDaysRemaining(item.date);

                                        return (
                                            <Link
                                                key={item.id}
                                                href={mattersRoutes.show(item.matter.id)}
                                                className="group flex items-center justify-between gap-2.5 px-4 py-2.5 transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.03]"
                                            >
                                                <div className="flex min-w-0 items-center gap-2.5">
                                                    {item.type === 'event' ? (
                                                        <Gavel className="size-3.5 shrink-0 text-blue-600 dark:text-sky-400" />
                                                    ) : (
                                                        <Clock className={`size-3.5 shrink-0 ${
                                                            item.isCritical ? 'text-rose-500' : 'text-[#787774]'
                                                        }`} />
                                                    )}
                                                    <div className="min-w-0">
                                                        <p className="truncate text-xs font-semibold text-[#111111] group-hover:underline dark:text-white">
                                                            {item.title}
                                                        </p>
                                                        <p className="truncate font-mono text-[10px] text-[#787774] dark:text-zinc-400">
                                                            {item.matter.matter_number} · {formatDate(item.date)}
                                                        </p>
                                                    </div>
                                                </div>

                                                <span
                                                    className={`shrink-0 rounded-md px-2 py-0.5 font-mono text-[10px] font-semibold ${
                                                        urgency === 'urgent'
                                                            ? 'bg-[#fdebec] text-[#9f2f2d] dark:bg-rose-950/60 dark:text-rose-300'
                                                            : urgency === 'warning'
                                                              ? 'bg-[#fbf3db] text-[#956400] dark:bg-amber-950/60 dark:text-amber-300'
                                                              : 'bg-[#edf3ec] text-[#346538] dark:bg-emerald-950/60 dark:text-emerald-300'
                                                    }`}
                                                >
                                                    {label}
                                                </span>
                                            </Link>
                                        );
                                    })}

                                    {timelineItems.length === 0 && (
                                        <p className="p-4 text-center text-xs text-[#787774]">
                                            Tidak ada tenggat batas waktu terdekat.
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Card 2: Recent Matters Pulse */}
                            <div className="overflow-hidden rounded-xl border border-black/[0.08] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                                <div className="flex items-center justify-between border-b border-black/[0.06] px-4 py-2.5 dark:border-white/[0.08]">
                                    <span className="text-[10px] font-bold tracking-wider text-[#787774] uppercase">
                                        Perkara Terkini
                                    </span>
                                    <Link
                                        href={mattersRoutes.index()}
                                        className="text-[10px] font-semibold text-blue-600 hover:underline dark:text-sky-400"
                                    >
                                        Semua →
                                    </Link>
                                </div>

                                <div className="divide-y divide-black/[0.04] dark:divide-white/[0.05]">
                                    {matters.slice(0, 3).map((matter) => (
                                        <Link
                                            key={matter.id}
                                            href={mattersRoutes.show(matter.id)}
                                            className="group flex items-center justify-between gap-2 px-4 py-2.5 transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.03]"
                                        >
                                            <div className="min-w-0">
                                                <p className="truncate text-xs font-semibold text-[#111111] group-hover:underline dark:text-white">
                                                    {matter.title}
                                                </p>
                                                <p className="truncate text-[10px] text-[#787774] dark:text-zinc-400">
                                                    <span className="font-mono">{matter.matter_number}</span> · {matter.client.display_name}
                                                </p>
                                            </div>
                                            <StatusBadge value={matter.status} />
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}

function NotionTabButton({
    active,
    onClick,
    icon: Icon,
    label,
    count,
}: {
    active: boolean;
    onClick: () => void;
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    count?: number;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                active
                    ? 'bg-black/[0.06] text-[#111111] dark:bg-white/[0.1] dark:text-white'
                    : 'text-[#787774] hover:bg-black/[0.03] hover:text-[#111111] dark:text-zinc-400 dark:hover:bg-white/[0.04] dark:hover:text-white'
            }`}
        >
            <Icon className="size-3.5" />
            <span>{label}</span>
            {typeof count === 'number' && (
                <span className="font-mono text-[10px] opacity-70">
                    ({count})
                </span>
            )}
        </button>
    );
}

Dashboard.layout = { breadcrumbs: [{ title: 'Dashboard', href: dashboard() }] };
