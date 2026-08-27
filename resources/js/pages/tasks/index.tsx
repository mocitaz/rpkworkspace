import { Form, Head, Link, router } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowLeft,
    ArrowUpRight,
    Briefcase,
    Calendar,
    CalendarClock,
    Check,
    CheckCircle2,
    CheckSquare,
    ChevronDown,
    ChevronRight,
    Clock,
    Columns2,
    Copy,
    DollarSign,
    ExternalLink,
    Eye,
    FileText,
    Filter,
    FolderKanban,
    Grid,
    Layers,
    LayoutList,
    ListTodo,
    MessageSquare,
    Pencil,
    Play,
    Plus,
    RotateCcw,
    Scale,
    Search,
    ShieldCheck,
    Sparkles,
    TrendingUp,
    Trash2,
    User,
    UserCheck,
    UserPlus,
    Users,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import {
    DiscussionBox,
    type DiscussionComment,
} from '@/components/comments/discussion-box';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { EmptyState } from '@/components/empty-state';
import InputError from '@/components/input-error';
import { Pagination } from '@/components/pagination';
import { StatusBadge } from '@/components/status-badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useInitials } from '@/hooks/use-initials';
import { formatDate } from '@/lib/format';
import * as matterRoutes from '@/routes/matters';
import * as taskRoutes from '@/routes/tasks';

type Person = {
    id: number;
    name: string;
    position_title?: string;
    avatar_path?: string | null;
    avatar_url?: string | null;
};

type Task = {
    id: string;
    task_number?: string;
    title: string;
    category?: string;
    stage?: string;
    description?: string;
    status: string;
    priority: string;
    due_at?: string;
    start_date?: string;
    is_billable?: boolean;
    estimated_hours?: number;
    actual_hours?: number;
    checklists?: Array<{ id: string; title: string; is_completed: boolean }>;
    assignee_id?: number;
    reviewer_id?: number;
    matter_id?: string;
    assignee?: Person;
    reviewer?: Person;
    matter?: { id: string; matter_number: string; title: string };
    comments?: DiscussionComment[];
};

type Page = {
    data: Task[];
    links: { url: string | null; label: string; active: boolean }[];
    total: number;
};

export default function TasksIndex({
    tasks,
    matters,
    users,
    metrics,
    filters,
    can,
}: {
    tasks: Page;
    matters: { id: string; matter_number: string; title: string }[];
    users: Person[];
    metrics: {
        total: number;
        mine: number;
        overdue: number;
        completed: number;
    };
    filters: { view?: string; status?: string; matter_id?: string };
    can: { create: boolean; update?: boolean; delete?: boolean };
}) {
    const getInitials = useInitials();
    const [openCreate, setOpenCreate] = useState(() =>
        new URLSearchParams(window.location.search).has('create'),
    );
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
    const [isDeletingTask, setIsDeletingTask] = useState(false);
    const [viewMode, setViewMode] = useState<'split' | 'table' | 'cards'>('split');
    const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);

    // Split View dedicated state
    const [splitSearch, setSplitSearch] = useState('');
    const [splitTab, setSplitTab] = useState<'all' | 'overdue'>('all');
    const [splitSelectedId, setSplitSelectedId] = useState<string | null>(
        tasks.data[0]?.id ?? null,
    );
    const [splitMobileOpen, setSplitMobileOpen] = useState(false);
    const [copiedTaskId, setCopiedTaskId] = useState<string | null>(null);
    const [activeDetailTab, setActiveDetailTab] = useState<'details' | 'discussion'>('details');

    const isTaskOverdue = (task: Task) =>
        task.due_at &&
        new Date(task.due_at) < new Date() &&
        !['completed', 'cancelled'].includes(task.status);

    const getDueCountdownBadge = (due_at?: string, status?: string) => {
        if (!due_at) return null;
        if (status === 'completed') {
            return (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                    <CheckCircle2 className="size-3 text-emerald-600" />
                    Tuntas
                </span>
            );
        }
        const dueDate = new Date(due_at);
        const now = new Date();
        const d1 = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
        const d2 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const diffDays = Math.round((d1.getTime() - d2.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
            return (
                <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-0.5 text-[11px] font-bold text-rose-700 ring-1 ring-rose-500/20 dark:bg-rose-950/60 dark:text-rose-300">
                    <AlertCircle className="size-3 text-rose-600 dark:text-rose-400" />
                    Lewat {Math.abs(diffDays)} Hari
                </span>
            );
        }
        if (diffDays === 0) {
            return (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold text-amber-800 ring-1 ring-amber-500/20 dark:bg-amber-950/60 dark:text-amber-300">
                    <Clock className="size-3 text-amber-600 dark:text-amber-400" />
                    Jatuh Tempo Hari Ini
                </span>
            );
        }
        if (diffDays === 1) {
            return (
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-blue-700 ring-1 ring-blue-500/20 dark:bg-blue-950/60 dark:text-blue-300">
                    <Clock className="size-3 text-blue-600 dark:text-blue-400" />
                    Besok
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-700 dark:bg-zinc-800 dark:text-zinc-300">
                <Clock className="size-3 text-slate-400" />
                Sisa {diffDays} Hari
            </span>
        );
    };

    const activeSplitTask = useMemo(() => {
        if (!tasks.data.length) return null;
        if (splitSelectedId) {
            const found = tasks.data.find((t) => t.id === splitSelectedId);
            if (found) return found;
        }
        return tasks.data[0] ?? null;
    }, [tasks.data, splitSelectedId]);

    const filteredSplitTasks = useMemo(() => {
        return tasks.data.filter((task) => {
            if (splitTab === 'overdue' && !isTaskOverdue(task)) {
                return false;
            }
            if (splitSearch.trim() !== '') {
                const q = splitSearch.toLowerCase();
                const titleMatch = task.title?.toLowerCase().includes(q);
                const matterMatch =
                    task.matter?.title?.toLowerCase().includes(q) ||
                    task.matter?.matter_number?.toLowerCase().includes(q);
                const assigneeMatch = task.assignee?.name
                    ?.toLowerCase()
                    .includes(q);
                if (!titleMatch && !matterMatch && !assigneeMatch) return false;
            }
            return true;
        });
    }, [tasks.data, splitTab, splitSearch]);

    const handleCopyTask = (task: Task) => {
        const text = `[${task.task_number || task.id}] ${task.title}\nPerkara: ${
            task.matter
                ? `${task.matter.matter_number} - ${task.matter.title}`
                : 'Umum'
        }\nStatus: ${task.status} | Prioritas: ${task.priority}\nAssignee: ${
            task.assignee?.name || 'Unassigned'
        }\nTenggat: ${task.due_at ? formatDate(task.due_at) : '-'}`;
        navigator.clipboard.writeText(text);
        setCopiedTaskId(task.id);
        setTimeout(() => setCopiedTaskId(null), 2000);
    };

    const changeStatus = (task: Task, status: string) => {
        setUpdatingTaskId(task.id);
        router.patch(
            taskRoutes.update?.url
                ? taskRoutes.update.url(task.id)
                : `/tasks/${task.id}`,
            {
                title: task.title,
                description: task.description ?? '',
                assignee_id: task.assignee_id ?? '',
                reviewer_id: task.reviewer_id ?? '',
                priority: task.priority,
                due_at: task.due_at ?? '',
                status,
            },
            {
                preserveScroll: true,
                onFinish: () => {
                    setUpdatingTaskId(null);
                    if (selectedTask?.id === task.id) {
                        setSelectedTask({ ...selectedTask, status });
                    }
                },
            },
        );
    };

    const viewTabs = [
        { id: '', label: 'Semua Tugas' },
        { id: 'mine', label: 'Tugas Saya' },
        { id: 'created', label: 'Dibuat Saya' },
        { id: 'overdue', label: 'Lewat Tenggat' },
    ];

    return (
        <>
            <Head title="Manajemen Tugas & Instruksi Kerja" />

            <div className="min-h-screen bg-[#fafafc] pb-20 dark:bg-[#0c0d10]">
                <main className="mx-auto max-w-7xl space-y-5 px-4 py-5 sm:px-6 lg:px-8">
                    {/* 1. Header & Actions */}
                    <div className="flex flex-col justify-between gap-4 border-b border-slate-200/60 pb-5 sm:flex-row sm:items-center dark:border-white/[0.06]">
                        <div className="space-y-1">
                            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                                Tugas &amp; Instruksi Kerja
                            </h1>
                            <p className="text-xs text-slate-500 dark:text-zinc-400">
                                Delegasi penugasan advokat, supervisi partner,
                                dan kontrol batas waktu deliverable perkara.
                            </p>
                        </div>

                        {can.create && (
                            <div className="flex shrink-0 items-center gap-2">
                                <Button
                                    asChild
                                    className="h-8 rounded-lg bg-slate-900 px-3.5 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 active:scale-95 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                                >
                                    <Link href={taskRoutes.create?.url ? taskRoutes.create.url() : '/tasks/create'}>
                                        <Plus className="mr-1 size-3.5" />
                                        Buat Tugas Baru
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* 2. Top 4 KPI Metrics Bento Cards */}
                    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {/* 1. Total Tugas */}
                        <div className="group rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[11px] font-semibold">
                                    TOTAL INSTRUKSI
                                </span>
                                <ListTodo className="size-3.5 text-slate-400 transition-colors group-hover:text-blue-600 dark:text-zinc-500" />
                            </div>
                            <div className="mt-2 flex items-baseline justify-between">
                                <span className="font-mono text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    {metrics.total}
                                </span>
                                <span className="text-[11px] font-medium text-slate-500 dark:text-zinc-400">
                                    tugas kolektif
                                </span>
                            </div>
                            <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-500 dark:border-white/[0.04]">
                                <span>Arsip Kantor</span>
                                <span className="font-semibold text-slate-700 dark:text-zinc-300">
                                    {tasks.data.length} di halaman ini
                                </span>
                            </div>
                        </div>

                        {/* 2. Tugas Saya */}
                        <div className="group rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[11px] font-semibold">
                                    TUGAS SAYA
                                </span>
                                <UserCheck className="size-3.5 text-slate-400 transition-colors group-hover:text-blue-600 dark:text-zinc-500" />
                            </div>
                            <div className="mt-2 flex items-baseline justify-between">
                                <span className="font-mono text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    {metrics.mine}
                                </span>
                                <span className="text-[11px] font-medium text-slate-500 dark:text-zinc-400">
                                    tanggung jawab Anda
                                </span>
                            </div>
                            <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-500 dark:border-white/[0.04]">
                                <span>Personal Assignment</span>
                                <span className="font-semibold text-blue-600 dark:text-blue-400">
                                    Aktif
                                </span>
                            </div>
                        </div>

                        {/* 3. Lewat Tenggat */}
                        <div className="group rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[11px] font-semibold">
                                    LEWAT TENGGAT
                                </span>
                                <AlertCircle className="size-3.5 text-rose-500 transition-colors dark:text-rose-400" />
                            </div>
                            <div className="mt-2 flex items-baseline justify-between">
                                <span className="font-mono text-2xl font-bold tracking-tight text-rose-600 dark:text-rose-400">
                                    {metrics.overdue}
                                </span>
                                <span className="text-[11px] font-medium text-rose-600 dark:text-rose-400">
                                    melewati batas
                                </span>
                            </div>
                            <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-500 dark:border-white/[0.04]">
                                <span>Perlu Tindak Lanjut</span>
                                <span className="font-semibold text-rose-600 dark:text-rose-400">
                                    Atensi Kritis
                                </span>
                            </div>
                        </div>

                        {/* 4. Selesai */}
                        <div className="group rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[11px] font-semibold">
                                    SELESAI
                                </span>
                                <CheckCircle2 className="size-3.5 text-emerald-600 transition-colors dark:text-emerald-400" />
                            </div>
                            <div className="mt-2 flex items-baseline justify-between">
                                <span className="font-mono text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                                    {metrics.completed}
                                </span>
                                <span className="text-[11px] font-medium text-slate-500 dark:text-zinc-400">
                                    tuntas
                                </span>
                            </div>
                            <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-500 dark:border-white/[0.04]">
                                <span>Deliverable Tuntas</span>
                                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                    Selesai
                                </span>
                            </div>
                        </div>
                    </section>

                    {/* 3. Filter Controls & Segmented Quick Filter Bar */}
                    <div className="space-y-3">
                        {/* Segmented Quick Status Pills with Smooth Mobile Scroll */}
                        <div className="flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                            {viewTabs.map((tab) => {
                                const isCurrent =
                                    (filters.view ?? '') === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        onClick={() =>
                                            router.get(
                                                taskRoutes.index?.url ? taskRoutes.index.url() : '/tasks',
                                                {
                                                    ...filters,
                                                    view: tab.id || undefined,
                                                },
                                                { preserveState: true },
                                            )
                                        }
                                        className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                                            isCurrent
                                                ? 'bg-slate-900 text-white shadow-2xs dark:bg-white dark:text-slate-900'
                                                : 'border border-slate-200/70 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:border-white/[0.06] dark:bg-[#14161b] dark:text-zinc-400 dark:hover:bg-white/[0.04] dark:hover:text-white'
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Dropdown Filters & View Switcher */}
                        <div className="flex flex-col gap-3 rounded-xl border border-slate-200/70 bg-white p-3 shadow-2xs sm:flex-row sm:items-center sm:justify-between dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
                                {/* Matter Filter */}
                                <div className="relative w-full flex-1 sm:max-w-xs">
                                    <select
                                        defaultValue={filters.matter_id ?? ''}
                                        onChange={(e) =>
                                            router.get(
                                                taskRoutes.index?.url ? taskRoutes.index.url() : '/tasks',
                                                {
                                                    ...filters,
                                                    matter_id:
                                                        e.target.value ||
                                                        undefined,
                                                },
                                                { preserveState: true },
                                            )
                                        }
                                        className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-slate-50/70 pr-7 pl-2.5 text-xs font-medium text-slate-800 outline-hidden transition-colors hover:bg-slate-100 focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-zinc-200"
                                    >
                                        <option value="">
                                            Semua Perkara Hukum
                                        </option>
                                        {matters.map((matter) => (
                                            <option
                                                key={matter.id}
                                                value={matter.id}
                                            >
                                                {matter.matter_number} -{' '}
                                                {matter.title}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="pointer-events-none absolute top-1/2 right-2 size-3 -translate-y-1/2 text-slate-400" />
                                </div>

                                {/* Status Filter */}
                                <div className="relative w-full sm:w-44">
                                    <select
                                        defaultValue={filters.status ?? ''}
                                        onChange={(e) =>
                                            router.get(
                                                taskRoutes.index?.url ? taskRoutes.index.url() : '/tasks',
                                                {
                                                    ...filters,
                                                    status:
                                                        e.target.value ||
                                                        undefined,
                                                },
                                                { preserveState: true },
                                            )
                                        }
                                        className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-slate-50/70 pr-7 pl-2.5 text-xs font-medium text-slate-800 outline-hidden transition-colors hover:bg-slate-100 focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-zinc-200"
                                    >
                                        <option value="">Semua Status</option>
                                        <option value="todo">
                                            Belum Mulai
                                        </option>
                                        <option value="in_progress">
                                            Sedang Dikerjakan
                                        </option>
                                        <option value="waiting">
                                            Menunggu
                                        </option>
                                        <option value="review">
                                            Review Partner
                                        </option>
                                        <option value="completed">
                                            Selesai
                                        </option>
                                        <option value="cancelled">
                                            Dibatalkan
                                        </option>
                                    </select>
                                    <ChevronDown className="pointer-events-none absolute top-1/2 right-2 size-3 -translate-y-1/2 text-slate-400" />
                                </div>

                                {(filters.view ||
                                    filters.matter_id ||
                                    filters.status) && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            router.get(
                                                taskRoutes.index?.url ? taskRoutes.index.url() : '/tasks',
                                                {},
                                                { preserveState: true },
                                            )
                                        }
                                        className="h-8 w-full rounded-lg border-slate-200 px-2.5 text-xs text-slate-600 hover:bg-slate-50 sm:w-auto dark:border-white/10 dark:text-zinc-300"
                                    >
                                        <RotateCcw className="mr-1 size-3 text-slate-400" />
                                        Reset
                                    </Button>
                                )}
                            </div>

                            {/* View Switcher: Split Pane (Default), Table & Cards */}
                            <div className="flex items-center gap-0.5 rounded-lg border border-slate-200/70 bg-white p-0.5 dark:border-white/10 dark:bg-zinc-800">
                                <button
                                    type="button"
                                    onClick={() => setViewMode('split')}
                                    className={`flex h-7.5 items-center gap-1.5 rounded-md px-2.5 text-xs font-semibold transition-all ${
                                        viewMode === 'split'
                                            ? 'bg-slate-900 text-white shadow-2xs dark:bg-white dark:text-slate-900'
                                            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-400'
                                    }`}
                                    title="Tampilan Split Master-Detail"
                                >
                                    <Columns2 className="size-3.5" />
                                    <span>Split View</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setViewMode('table')}
                                    className={`flex h-7.5 items-center gap-1.5 rounded-md px-2.5 text-xs font-semibold transition-all ${
                                        viewMode === 'table'
                                            ? 'bg-slate-900 text-white shadow-2xs dark:bg-white dark:text-slate-900'
                                            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-400'
                                    }`}
                                    title="Tampilan Tabel Data"
                                >
                                    <LayoutList className="size-3.5" />
                                    <span>Tabel</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setViewMode('cards')}
                                    className={`flex h-7.5 items-center gap-1.5 rounded-md px-2.5 text-xs font-semibold transition-all ${
                                        viewMode === 'cards'
                                            ? 'bg-slate-900 text-white shadow-2xs dark:bg-white dark:text-slate-900'
                                            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-400'
                                    }`}
                                    title="Tampilan Grid Kartu"
                                >
                                    <Grid className="size-3.5" />
                                    <span>Kartu</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 4. Tasks Content */}
                    {tasks.data.length === 0 ? (
                        <div className="flex min-h-[340px] items-center justify-center rounded-xl border border-slate-200/70 bg-white p-8 text-center shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                            <EmptyState
                                icon={CheckSquare}
                                title={
                                    filters.status ||
                                    filters.matter_id ||
                                    filters.view
                                        ? 'Tidak ada tugas pada filter ini'
                                        : 'Belum Ada Tugas Terdaftar'
                                }
                                description={
                                    filters.status ||
                                    filters.matter_id ||
                                    filters.view
                                        ? 'Seluruh instruksi kerja pada filter ini telah dituntaskan atau silakan sesuaikan filter pilihan Anda.'
                                        : 'Delegasikan tugas baru kepada staf atau associate untuk memulai alur kerja perkara.'
                                }
                                action={
                                    <div className="flex flex-wrap items-center justify-center gap-2">
                                        {can.create && (
                                            <Button
                                                asChild
                                                className="h-8 cursor-pointer rounded-lg bg-blue-600 px-3.5 text-xs font-semibold text-white shadow-2xs hover:bg-blue-700"
                                            >
                                                <Link href={taskRoutes.create?.url ? taskRoutes.create.url() : '/tasks/create'}>
                                                    <Plus className="mr-1 size-3.5" />{' '}
                                                    Buat Tugas Baru
                                                </Link>
                                            </Button>
                                        )}
                                        {(filters.status ||
                                            filters.matter_id ||
                                            filters.view) && (
                                            <Button
                                                asChild
                                                variant="outline"
                                                className="h-8 rounded-lg border-slate-200 px-3.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-zinc-300"
                                            >
                                                <Link
                                                    href={taskRoutes.index?.url ? taskRoutes.index.url() : '/tasks'}
                                                >
                                                    Reset Filter
                                                </Link>
                                            </Button>
                                        )}
                                    </div>
                                }
                            />
                        </div>
                    ) : viewMode === 'split' ? (
                        /* ========================================================================= */
                        /* MASTER-DETAIL SPLIT PANE VIEW FOR TASKS                                   */
                        /* ========================================================================= */
                        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xs dark:border-white/10 dark:bg-[#14161b]">
                            <div className="flex flex-col lg:flex-row min-h-[640px] lg:h-[calc(100vh-270px)]">
                                
                                {/* LEFT MASTER LIST PANE */}
                                <div
                                    className={`w-full lg:w-[380px] xl:w-[420px] shrink-0 border-r border-slate-200/70 dark:border-white/[0.08] flex flex-col bg-slate-50/40 dark:bg-[#111317] ${
                                        activeSplitTask && splitMobileOpen ? 'hidden lg:flex' : 'flex'
                                    }`}
                                >
                                    {/* Left Pane Search & Quick Filter Pills */}
                                    <div className="border-b border-slate-200/70 p-3 bg-white dark:border-white/[0.08] dark:bg-[#14161b] space-y-2">
                                        <div className="relative">
                                            <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-slate-400" />
                                            <Input
                                                value={splitSearch}
                                                onChange={(e) => setSplitSearch(e.target.value)}
                                                placeholder="Cari tugas, perkara, atau assignee..."
                                                className="h-8.5 w-full rounded-xl border-slate-200 bg-slate-50/60 pl-9 pr-8 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white dark:border-white/10 dark:bg-zinc-800/80 dark:text-white"
                                            />
                                            {splitSearch && (
                                                <button
                                                    type="button"
                                                    onClick={() => setSplitSearch('')}
                                                    className="absolute top-1/2 right-2.5 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                                >
                                                    <RotateCcw className="size-3" />
                                                </button>
                                            )}
                                        </div>

                                        {/* Filter Tabs */}
                                        <div className="flex items-center gap-1">
                                            <button
                                                type="button"
                                                onClick={() => setSplitTab('all')}
                                                className={`flex-1 rounded-lg py-1 text-center text-[11px] font-semibold transition-all ${
                                                    splitTab === 'all'
                                                        ? 'bg-slate-900 text-white shadow-2xs dark:bg-white dark:text-slate-900'
                                                        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-zinc-800'
                                                }`}
                                            >
                                                Semua ({tasks.data.length})
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setSplitTab('overdue')}
                                                className={`flex-1 flex items-center justify-center gap-1 rounded-lg py-1 text-center text-[11px] font-semibold transition-all ${
                                                    splitTab === 'overdue'
                                                        ? 'bg-rose-600 text-white shadow-2xs'
                                                        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-zinc-800'
                                                }`}
                                            >
                                                <AlertCircle className="size-3 text-rose-500 group-hover:text-white" />
                                                Mendesak ({tasks.data.filter((t) => isTaskOverdue(t)).length})
                                            </button>
                                        </div>
                                    </div>

                                    {/* Left Pane Tasks List */}
                                    <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-white/[0.04]">
                                        {filteredSplitTasks.length === 0 ? (
                                            <div className="p-8 text-center text-xs text-slate-400 dark:text-zinc-500">
                                                {splitTab === 'overdue'
                                                    ? 'Tidak ada tugas yang lewat tenggat.'
                                                    : 'Tidak ada tugas yang sesuai filter.'}
                                            </div>
                                        ) : (
                                            filteredSplitTasks.map((task) => {
                                                const isSelected = activeSplitTask?.id === task.id;
                                                const overdue = isTaskOverdue(task);

                                                return (
                                                    <div
                                                        key={task.id}
                                                        onClick={() => {
                                                            setSplitSelectedId(task.id);
                                                            setSplitMobileOpen(true);
                                                        }}
                                                        className={`group relative flex cursor-pointer flex-col gap-2 p-3 transition-all ${
                                                            isSelected
                                                                ? 'bg-blue-50/80 dark:bg-blue-950/40 border-l-4 border-blue-600 dark:border-blue-500 pl-2.5'
                                                                : 'hover:bg-white dark:hover:bg-zinc-800/60'
                                                        }`}
                                                    >
                                                        <div className="flex items-start justify-between gap-2">
                                                            <h4
                                                                className={`text-xs font-bold leading-snug line-clamp-2 ${
                                                                    task.status === 'completed'
                                                                        ? 'line-through opacity-60'
                                                                        : isSelected
                                                                        ? 'text-blue-900 dark:text-blue-200'
                                                                        : 'text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400'
                                                                }`}
                                                            >
                                                                {task.title}
                                                            </h4>
                                                            <StatusBadge value={task.priority} />
                                                        </div>

                                                        {task.matter ? (
                                                            <p className="truncate font-mono text-[10px] font-semibold text-blue-600 dark:text-blue-400">
                                                                {task.matter.matter_number} · {task.matter.title}
                                                            </p>
                                                        ) : (
                                                            <p className="text-[10px] text-slate-400">Umum / Internal Kantor</p>
                                                        )}

                                                        <div className="flex items-center justify-between pt-1 text-[11px] border-t border-slate-100/70 dark:border-white/[0.04]">
                                                            {/* Assignee */}
                                                            <div className="flex items-center gap-1.5 min-w-0 pr-2">
                                                                {task.assignee ? (
                                                                    <>
                                                                        <Avatar className="size-4.5 shrink-0 rounded-full border border-slate-200 dark:border-white/10">
                                                                            <AvatarImage src={task.assignee.avatar_url ?? undefined} />
                                                                            <AvatarFallback className="text-[7px] font-bold">
                                                                                {getInitials(task.assignee.name)}
                                                                            </AvatarFallback>
                                                                        </Avatar>
                                                                        <span className="truncate text-[10px] font-medium text-slate-700 dark:text-zinc-300">
                                                                            {task.assignee.name}
                                                                        </span>
                                                                    </>
                                                                ) : (
                                                                    <span className="text-[10px] text-slate-400">Unassigned</span>
                                                                )}
                                                            </div>

                                                            {/* Status and Due Date */}
                                                            <div className="flex items-center gap-1.5 shrink-0">
                                                                <StatusBadge value={task.status} />
                                                                {task.due_at && (
                                                                    <span
                                                                        className={`font-mono text-[10px] ${
                                                                            overdue
                                                                                ? 'font-bold text-rose-600 dark:text-rose-400'
                                                                                : 'text-slate-400'
                                                                        }`}
                                                                    >
                                                                        {formatDate(task.due_at)}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>

                                    {/* Left Pane Pagination */}
                                    <div className="border-t border-slate-200/70 p-2.5 bg-white dark:border-white/[0.08] dark:bg-[#14161b]">
                                        <Pagination links={tasks.links} />
                                    </div>
                                </div>

                                {/* RIGHT DETAILS PANE */}
                                <div
                                    className={`flex-1 flex flex-col bg-slate-50/30 dark:bg-[#14161b] overflow-y-auto ${
                                        activeSplitTask && splitMobileOpen ? 'flex' : 'hidden lg:flex'
                                    }`}
                                >
                                    {activeSplitTask ? (
                                        <div className="flex flex-col h-full">
                                            {/* 1. Header Toolbar Bar */}
                                            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200/80 bg-white/95 px-5 py-3 backdrop-blur-md dark:border-white/[0.08] dark:bg-[#14161b]/95">
                                                <div className="flex items-center gap-2 min-w-0 pr-3">
                                                    {/* Mobile Back Button */}
                                                    <button
                                                        type="button"
                                                        onClick={() => setSplitMobileOpen(false)}
                                                        className="lg:hidden flex size-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-white/10 dark:text-zinc-300"
                                                    >
                                                        <ArrowLeft className="size-4" />
                                                    </button>

                                                    {/* Task ID Pill */}
                                                    <div className="flex items-center gap-1.5 rounded-lg border border-slate-200/80 bg-slate-50 px-2.5 py-1 text-xs font-mono font-bold text-slate-700 dark:border-white/10 dark:bg-zinc-800/80 dark:text-zinc-200">
                                                        <span>#{activeSplitTask.task_number || activeSplitTask.id.slice(0, 8)}</span>
                                                    </div>

                                                    {/* Urgency / Due Countdown Badge */}
                                                    {getDueCountdownBadge(activeSplitTask.due_at, activeSplitTask.status)}

                                                    {/* Priority Badge */}
                                                    <StatusBadge value={activeSplitTask.priority} />
                                                </div>

                                                {/* Top Right Action Icons */}
                                                <div className="flex items-center gap-1.5 shrink-0">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleCopyTask(activeSplitTask)}
                                                        className="flex h-8 items-center gap-1.5 rounded-lg border border-slate-200/80 bg-white px-2.5 text-xs font-semibold text-slate-600 shadow-2xs hover:bg-slate-50 hover:text-slate-900 dark:border-white/10 dark:bg-[#16181d] dark:text-zinc-300 dark:hover:bg-zinc-800 transition-all"
                                                        title="Salin Rincian Tugas"
                                                    >
                                                        {copiedTaskId === activeSplitTask.id ? (
                                                            <>
                                                                <Check className="size-3.5 text-emerald-600" />
                                                                <span className="text-emerald-600">Disalin!</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Copy className="size-3.5 text-slate-400" />
                                                                <span className="hidden sm:inline">Salin</span>
                                                            </>
                                                        )}
                                                    </button>

                                                    {can.update && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            asChild
                                                            className="h-8 rounded-lg border-slate-200/80 bg-white px-2.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-white/10 dark:bg-[#16181d] dark:text-zinc-200"
                                                        >
                                                            <Link href={taskRoutes.edit.url(activeSplitTask.id)}>
                                                                <Pencil className="mr-1.5 size-3.5 text-slate-400" />
                                                                Edit
                                                            </Link>
                                                        </Button>
                                                    )}

                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        asChild
                                                        className="h-8 rounded-lg border-blue-200/60 bg-blue-50/50 px-2.5 text-xs font-semibold text-blue-700 shadow-2xs hover:bg-blue-100/70 dark:border-blue-500/20 dark:bg-blue-950/40 dark:text-blue-300"
                                                    >
                                                        <Link href={taskRoutes.show?.url ? taskRoutes.show.url(activeSplitTask.id) : `/tasks/${activeSplitTask.id}`}>
                                                            <ExternalLink className="mr-1.5 size-3.5" />
                                                            Halaman Penuh
                                                        </Link>
                                                    </Button>

                                                    {can.delete && (
                                                        <button
                                                            type="button"
                                                            onClick={() => setTaskToDelete(activeSplitTask)}
                                                            className="flex size-8 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30 dark:hover:text-rose-400 transition-all"
                                                            title="Hapus Tugas"
                                                        >
                                                            <Trash2 className="size-3.5" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Scrollable Container */}
                                            <div className="flex-1 p-5 sm:p-6 space-y-6 overflow-y-auto">
                                                
                                                {/* 2. Hero Title & Matter Banner */}
                                                <div className="space-y-3">
                                                    <h1 className={`text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-snug ${
                                                        activeSplitTask.status === 'completed' ? 'line-through text-slate-400 dark:text-zinc-500' : ''
                                                    }`}>
                                                        {activeSplitTask.title}
                                                    </h1>

                                                    {/* Connected Matter Hero Card */}
                                                    {activeSplitTask.matter ? (
                                                        <div className="group relative overflow-hidden rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50/80 via-indigo-50/40 to-slate-50 p-3.5 transition-all hover:border-blue-300 dark:border-blue-900/40 dark:from-blue-950/30 dark:via-zinc-900/50 dark:to-zinc-900">
                                                            <div className="flex items-center justify-between gap-3">
                                                                <div className="flex items-center gap-3 min-w-0">
                                                                    <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
                                                                        <Briefcase className="size-4.5" />
                                                                    </div>
                                                                    <div className="min-w-0">
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="font-mono text-xs font-bold text-blue-700 dark:text-blue-300">
                                                                                {activeSplitTask.matter.matter_number}
                                                                            </span>
                                                                            <span className="text-[10px] font-semibold text-slate-400 dark:text-zinc-500">
                                                                                · Perkara Aktif
                                                                            </span>
                                                                        </div>
                                                                        <p className="truncate text-xs font-bold text-slate-900 dark:text-white">
                                                                            {activeSplitTask.matter.title}
                                                                        </p>
                                                                    </div>
                                                                </div>

                                                                <Link
                                                                    href={matterRoutes.show?.url ? matterRoutes.show.url(activeSplitTask.matter.id) : `/matters/${activeSplitTask.matter.id}`}
                                                                    className="flex shrink-0 items-center gap-1 rounded-lg bg-white px-2.5 py-1.5 text-xs font-bold text-blue-600 shadow-2xs ring-1 ring-slate-200/70 hover:bg-blue-50 dark:bg-zinc-800 dark:text-blue-400 dark:ring-white/10"
                                                                >
                                                                    <span>Buka Perkara</span>
                                                                    <ArrowUpRight className="size-3.5" />
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/70 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 dark:border-white/10 dark:bg-zinc-800/60 dark:text-zinc-400">
                                                            <Sparkles className="size-3.5 text-slate-400" />
                                                            <span>Tugas Internal / Kantor (Non-Perkara Klien)</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* 3. Interactive Workflow Pipeline & Progress Meter */}
                                                <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs dark:border-white/10 dark:bg-[#16181d]">
                                                    <div className="flex items-center justify-between pb-3">
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex size-6 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                                                                <TrendingUp className="size-3.5" />
                                                            </div>
                                                            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider dark:text-white">
                                                                Alur Pengerjaan Tugas
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="text-[11px] font-semibold text-slate-400 dark:text-zinc-500">
                                                                Kemajuan:
                                                            </span>
                                                            <span className="font-mono text-xs font-extrabold text-blue-600 dark:text-blue-400">
                                                                {activeSplitTask.status === 'completed'
                                                                    ? '100%'
                                                                    : activeSplitTask.status === 'review'
                                                                    ? '75%'
                                                                    : activeSplitTask.status === 'in_progress'
                                                                    ? '50%'
                                                                    : '25%'}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Visual Progress Track */}
                                                    <div className="relative mb-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-zinc-800">
                                                        <div
                                                            className={`h-full rounded-full transition-all duration-500 ${
                                                                activeSplitTask.status === 'completed'
                                                                    ? 'w-full bg-emerald-500'
                                                                    : activeSplitTask.status === 'review'
                                                                    ? 'w-3/4 bg-amber-500'
                                                                    : activeSplitTask.status === 'in_progress'
                                                                    ? 'w-1/2 bg-blue-600'
                                                                    : 'w-1/4 bg-slate-600'
                                                            }`}
                                                        />
                                                    </div>

                                                    {/* Step Pods (Clickable) */}
                                                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                                                        {[
                                                            {
                                                                key: 'pending',
                                                                num: '1',
                                                                label: 'To Do',
                                                                sub: 'Antrean Kerja',
                                                                icon: ListTodo,
                                                                activeClass: 'bg-slate-900 text-white shadow-md ring-2 ring-slate-900/20 dark:bg-white dark:text-slate-900',
                                                            },
                                                            {
                                                                key: 'in_progress',
                                                                num: '2',
                                                                label: 'Dikerjakan',
                                                                sub: 'Proses Advokat',
                                                                icon: Play,
                                                                activeClass: 'bg-blue-600 text-white shadow-md ring-2 ring-blue-600/30',
                                                            },
                                                            {
                                                                key: 'review',
                                                                num: '3',
                                                                label: 'Review',
                                                                sub: 'Uji Partner',
                                                                icon: Eye,
                                                                activeClass: 'bg-amber-600 text-white shadow-md ring-2 ring-amber-600/30',
                                                            },
                                                            {
                                                                key: 'completed',
                                                                num: '4',
                                                                label: 'Selesai',
                                                                sub: 'Tuntas & Arsip',
                                                                icon: CheckCircle2,
                                                                activeClass: 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-600/30',
                                                            },
                                                        ].map((step) => {
                                                            const isActive = activeSplitTask.status === step.key;
                                                            const StepIcon = step.icon;

                                                            return (
                                                                <button
                                                                    key={step.key}
                                                                    type="button"
                                                                    onClick={() => changeStatus(activeSplitTask, step.key)}
                                                                    className={`group relative flex flex-col items-start rounded-xl p-2.5 text-left transition-all ${
                                                                        isActive
                                                                            ? step.activeClass
                                                                            : 'border border-slate-200/70 bg-slate-50/60 hover:bg-slate-100 hover:border-slate-300 dark:border-white/[0.08] dark:bg-zinc-800/40 dark:hover:bg-zinc-800'
                                                                    }`}
                                                                >
                                                                    <div className="flex w-full items-center justify-between">
                                                                        <div
                                                                            className={`flex size-5 items-center justify-center rounded-md text-[10px] font-bold ${
                                                                                isActive
                                                                                    ? 'bg-white/20 text-current'
                                                                                    : 'bg-slate-200/80 text-slate-700 dark:bg-white/10 dark:text-zinc-300'
                                                                            }`}
                                                                        >
                                                                            {step.num}
                                                                        </div>
                                                                        <StepIcon className={`size-3.5 ${isActive ? 'text-current' : 'text-slate-400 group-hover:text-slate-600'}`} />
                                                                    </div>
                                                                    <p className={`mt-1.5 text-xs font-bold ${isActive ? 'text-current' : 'text-slate-900 dark:text-white'}`}>
                                                                        {step.label}
                                                                    </p>
                                                                    <p className={`text-[10px] ${isActive ? 'opacity-80' : 'text-slate-500 dark:text-zinc-400'}`}>
                                                                        {step.sub}
                                                                    </p>
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>

                                                {/* 4. Bento Grid of Core Task Properties */}
                                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                                    
                                                    {/* Card 1: Assignee */}
                                                    <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs dark:border-white/10 dark:bg-[#16181d]">
                                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider dark:text-zinc-500">
                                                            <User className="size-3 text-blue-600" />
                                                            <span>Advokat Pelaksana</span>
                                                        </div>
                                                        <div className="mt-2 flex items-center gap-2.5">
                                                            <Avatar className="size-8 shrink-0 rounded-full border border-blue-200 ring-2 ring-blue-50 dark:border-blue-900/50 dark:ring-blue-950/50">
                                                                <AvatarImage src={activeSplitTask.assignee?.avatar_url ?? undefined} />
                                                                <AvatarFallback className="bg-blue-100 text-xs font-bold text-blue-700">
                                                                    {getInitials(activeSplitTask.assignee?.name || 'Unassigned')}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div className="min-w-0">
                                                                <p className="truncate text-xs font-bold text-slate-900 dark:text-white">
                                                                    {activeSplitTask.assignee?.name || 'Belum Ditugaskan'}
                                                                </p>
                                                                <p className="truncate text-[10px] text-slate-500 dark:text-zinc-400">
                                                                    {activeSplitTask.assignee?.position_title || 'Associate'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Card 2: Reviewer */}
                                                    <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs dark:border-white/10 dark:bg-[#16181d]">
                                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider dark:text-zinc-500">
                                                            <Users className="size-3 text-amber-600" />
                                                            <span>Partner Peninjau</span>
                                                        </div>
                                                        <div className="mt-2 flex items-center gap-2.5">
                                                            <Avatar className="size-8 shrink-0 rounded-full border border-amber-200 ring-2 ring-amber-50 dark:border-amber-900/50 dark:ring-amber-950/50">
                                                                <AvatarImage src={activeSplitTask.reviewer?.avatar_url ?? undefined} />
                                                                <AvatarFallback className="bg-amber-100 text-xs font-bold text-amber-800">
                                                                    {getInitials(activeSplitTask.reviewer?.name || 'None')}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div className="min-w-0">
                                                                <p className="truncate text-xs font-bold text-slate-900 dark:text-white">
                                                                    {activeSplitTask.reviewer?.name || 'Tanpa Reviewer'}
                                                                </p>
                                                                <p className="truncate text-[10px] text-slate-500 dark:text-zinc-400">
                                                                    {activeSplitTask.reviewer?.position_title || 'Partner in Charge'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Card 3: Due Date */}
                                                    <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs dark:border-white/10 dark:bg-[#16181d]">
                                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider dark:text-zinc-500">
                                                            <Calendar className="size-3 text-indigo-600" />
                                                            <span>Tenggat Waktu</span>
                                                        </div>
                                                        <div className="mt-2">
                                                            <p className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                                                                {activeSplitTask.due_at ? formatDate(activeSplitTask.due_at) : 'Tidak ditentukan'}
                                                            </p>
                                                            <p className="pt-0.5 text-[10px] font-semibold text-slate-500 dark:text-zinc-400">
                                                                {activeSplitTask.due_at && isTaskOverdue(activeSplitTask)
                                                                    ? '⚠️ Melewati batas waktu'
                                                                    : 'Target penyelesaian'}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Card 4: Priority & Category */}
                                                    <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs dark:border-white/10 dark:bg-[#16181d]">
                                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider dark:text-zinc-500">
                                                            <Layers className="size-3 text-emerald-600" />
                                                            <span>Tingkat Prioritas</span>
                                                        </div>
                                                        <div className="mt-2 flex items-center justify-between">
                                                            <StatusBadge value={activeSplitTask.priority} />
                                                            <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                                                                Billable
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* 5. Tabbed Details Section */}
                                                <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xs dark:border-white/10 dark:bg-[#16181d]">
                                                    {/* Tab Headers */}
                                                    <div className="flex items-center border-b border-slate-200/80 bg-slate-50/60 px-4 pt-2 dark:border-white/10 dark:bg-zinc-900/60">
                                                        <button
                                                            type="button"
                                                            onClick={() => setActiveDetailTab('details')}
                                                            className={`relative flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-bold transition-all ${
                                                                activeDetailTab === 'details'
                                                                    ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                                                                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white'
                                                            }`}
                                                        >
                                                            <FileText className="size-3.5" />
                                                            <span>Instruksi &amp; Checklist</span>
                                                            {activeSplitTask.checklists && activeSplitTask.checklists.length > 0 && (
                                                                <span className="rounded-full bg-blue-100 px-1.5 py-0.2 text-[10px] font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                                                                    {activeSplitTask.checklists.length}
                                                                </span>
                                                            )}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setActiveDetailTab('discussion')}
                                                            className={`relative flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-bold transition-all ${
                                                                activeDetailTab === 'discussion'
                                                                    ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                                                                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white'
                                                            }`}
                                                        >
                                                            <MessageSquare className="size-3.5" />
                                                            <span>Diskusi Tim &amp; Catatan</span>
                                                            {activeSplitTask.comments && activeSplitTask.comments.length > 0 && (
                                                                <span className="rounded-full bg-slate-200 px-1.5 py-0.2 text-[10px] font-bold text-slate-700 dark:bg-zinc-700 dark:text-zinc-200">
                                                                    {activeSplitTask.comments.length}
                                                                </span>
                                                            )}
                                                        </button>
                                                    </div>

                                                    {/* Tab Body */}
                                                    <div className="p-5">
                                                        {activeDetailTab === 'details' ? (
                                                            <div className="space-y-6">
                                                                {/* Deskripsi & Instruksi Kerja */}
                                                                <div className="space-y-2">
                                                                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                                                                        <FileText className="size-3.5 text-blue-600" />
                                                                        <span>Instruksi Kerja &amp; Catatan Khusus:</span>
                                                                    </div>
                                                                    <div className="rounded-xl border border-slate-200/70 bg-slate-50/70 p-4 text-xs leading-relaxed text-slate-800 whitespace-pre-wrap dark:border-white/[0.06] dark:bg-[#121418] dark:text-zinc-200">
                                                                        {activeSplitTask.description || 'Tidak ada deskripsi detail tambahan untuk tugas ini.'}
                                                                    </div>
                                                                </div>

                                                                {/* Checklist Sub-Tugas (Interactive) */}
                                                                {activeSplitTask.checklists && activeSplitTask.checklists.length > 0 && (
                                                                    <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-white/[0.06]">
                                                                        <div className="flex items-center justify-between">
                                                                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                                                                                <CheckSquare className="size-3.5 text-emerald-600" />
                                                                                <span>Deliverable &amp; Checklist Sub-Tugas</span>
                                                                            </div>
                                                                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-mono font-bold text-slate-700 dark:bg-zinc-800 dark:text-zinc-300">
                                                                                {activeSplitTask.checklists.filter((c) => c.is_completed).length} / {activeSplitTask.checklists.length} Selesai
                                                                            </span>
                                                                        </div>

                                                                        <div className="space-y-2">
                                                                            {activeSplitTask.checklists.map((chk) => (
                                                                                <label
                                                                                    key={chk.id}
                                                                                    className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200/70 bg-slate-50/50 p-3 text-xs transition-all hover:bg-slate-100/70 dark:border-white/[0.06] dark:bg-[#121418] dark:hover:bg-zinc-800"
                                                                                >
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        checked={chk.is_completed}
                                                                                        readOnly
                                                                                        className="size-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-zinc-600"
                                                                                    />
                                                                                    <span
                                                                                        className={
                                                                                            chk.is_completed
                                                                                                ? 'line-through text-slate-400 dark:text-zinc-500'
                                                                                                : 'font-medium text-slate-800 dark:text-zinc-200'
                                                                                        }
                                                                                    >
                                                                                        {chk.title}
                                                                                    </span>
                                                                                </label>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            /* Tab Diskusi Tim */
                                                            <div>
                                                                <DiscussionBox
                                                                    commentableType="task"
                                                                    commentableId={activeSplitTask.id}
                                                                    comments={activeSplitTask.comments || []}
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-1 items-center justify-center p-8 text-center">
                                            <EmptyState
                                                icon={ListTodo}
                                                title="Pilih Tugas"
                                                description="Pilih salah satu instruksi kerja dari daftar di sebelah kiri untuk melihat rincian alur tugas."
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : viewMode === 'table' ? (
                        /* Precision Data Table View */
                        <div className="overflow-hidden rounded-xl border border-slate-200/70 bg-white shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                            {/* Mobile Cards (sm:hidden) */}
                            <div className="divide-y divide-slate-100 sm:hidden dark:divide-white/[0.04]">
                                {tasks.data.map((task) => {
                                    const overdue = isTaskOverdue(task);
                                    return (
                                        <Link
                                            key={task.id}
                                            href={taskRoutes.show?.url ? taskRoutes.show.url(task.id) : `/tasks/${task.id}`}
                                            className="block cursor-pointer space-y-2 p-3.5 transition-colors hover:bg-slate-50 active:bg-slate-100 dark:hover:bg-white/[0.02]"
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="min-w-0 flex-1">
                                                    <p
                                                        className={`text-xs font-bold text-slate-900 dark:text-white ${
                                                            task.status ===
                                                            'completed'
                                                                ? 'line-through opacity-50'
                                                                : ''
                                                        }`}
                                                    >
                                                        {task.title}
                                                    </p>
                                                    {task.matter && (
                                                        <p className="mt-0.5 truncate font-mono text-[10px] font-semibold text-blue-600 dark:text-blue-400">
                                                            {
                                                                task.matter
                                                                    .matter_number
                                                            }{' '}
                                                            ·{' '}
                                                            {task.matter.title}
                                                        </p>
                                                    )}
                                                </div>
                                                <ChevronRight className="size-4 shrink-0 text-slate-400" />
                                            </div>
                                            <div className="flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-2 text-[10px] dark:border-white/[0.04]">
                                                <StatusBadge
                                                    value={task.status}
                                                />
                                                <StatusBadge
                                                    value={task.priority}
                                                />
                                                {task.due_at && (
                                                    <span
                                                        className={`ml-auto font-mono ${
                                                            overdue
                                                                ? 'font-bold text-rose-600 dark:text-rose-400'
                                                                : 'text-slate-500 dark:text-zinc-400'
                                                        }`}
                                                    >
                                                        {formatDate(
                                                            task.due_at,
                                                        )}
                                                    </span>
                                                )}
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>

                            {/* Desktop Table (hidden sm:block) */}
                            <div className="hidden overflow-x-auto sm:block">
                                <table className="w-full text-left text-xs">
                                    <thead>
                                        <tr className="border-b border-slate-100 bg-slate-50/60 text-[10px] font-semibold text-slate-500 uppercase dark:border-white/[0.04] dark:bg-[#121418]">
                                            <th className="py-2.5 pr-3 pl-4 font-semibold">
                                                Tugas &amp; Kasus
                                            </th>
                                            <th className="px-3 py-2.5 text-center font-semibold">
                                                Assignee
                                            </th>
                                            <th className="px-3 py-2.5 text-center font-semibold">
                                                Reviewer
                                            </th>
                                            <th className="px-3 py-2.5 font-semibold">
                                                Tenggat
                                            </th>
                                            <th className="px-3 py-2.5 font-semibold">
                                                Prioritas
                                            </th>
                                            <th className="px-3 py-2.5 font-semibold">
                                                Status
                                            </th>
                                            <th className="py-2.5 pr-4 pl-1 text-right font-semibold"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                                        {tasks.data.map((task) => {
                                            const overdue = isTaskOverdue(task);

                                            return (
                                                <tr
                                                    key={task.id}
                                                    className="group transition-colors hover:bg-slate-50/50 dark:hover:bg-white/[0.02]"
                                                >
                                                    {/* Task Title & Matter Info */}
                                                    <td className="py-2.5 pr-3 pl-4">
                                                        <div className="flex flex-col space-y-1">
                                                            <div className="flex items-center gap-1.5">
                                                                <Link
                                                                    href={taskRoutes.show?.url ? taskRoutes.show.url(task.id) : `/tasks/${task.id}`}
                                                                    className={`block text-left text-xs font-semibold text-slate-900 transition-colors hover:text-blue-600 dark:text-white dark:hover:text-blue-400 ${
                                                                        task.status ===
                                                                        'completed'
                                                                            ? 'line-through opacity-50'
                                                                            : ''
                                                                    }`}
                                                                >
                                                                    {task.title}
                                                                </Link>
                                                            </div>

                                                            {task.matter ? (
                                                                <div className="flex items-center">
                                                                    <Link
                                                                        href={matterRoutes.show?.url ? matterRoutes.show.url(
                                                                            task
                                                                                .matter
                                                                                .id,
                                                                        ) : `/matters/${task.matter.id}`}
                                                                        className="inline-flex items-center gap-1 font-mono text-[10px] font-medium text-slate-500 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400"
                                                                    >
                                                                        <span className="rounded bg-blue-50/80 px-1 py-0.5 font-semibold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                                                                            {
                                                                                task
                                                                                    .matter
                                                                                    .matter_number
                                                                            }
                                                                        </span>
                                                                        <span className="max-w-[240px] truncate">
                                                                            ·{' '}
                                                                            {
                                                                                task
                                                                                    .matter
                                                                                    .title
                                                                            }
                                                                        </span>
                                                                    </Link>
                                                                </div>
                                                            ) : (
                                                                <div>
                                                                    <span className="inline-flex items-center rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[9.5px] font-medium text-slate-500 dark:bg-white/[0.06] dark:text-zinc-400">
                                                                        Umum / Non-Perkara
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>

                                                    {/* Assignee Avatar */}
                                                    <td className="px-3 py-2.5 text-center whitespace-nowrap">
                                                        {task.assignee ? (
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
                                                                            <Avatar className="size-6 rounded-full border border-slate-200 dark:border-white/10">
                                                                                <AvatarImage
                                                                                    src={
                                                                                        task
                                                                                            .assignee
                                                                                            .avatar_url ??
                                                                                        undefined
                                                                                    }
                                                                                />
                                                                                <AvatarFallback className="text-[8px] font-bold">
                                                                                    {getInitials(
                                                                                        task
                                                                                            .assignee
                                                                                            .name,
                                                                                    )}
                                                                                </AvatarFallback>
                                                                            </Avatar>
                                                                        </div>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent
                                                                        side="top"
                                                                        className="rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-xs text-white shadow-xl dark:border-white/10 dark:bg-white dark:text-slate-900"
                                                                    >
                                                                        <p className="font-semibold">
                                                                            {
                                                                                task
                                                                                    .assignee
                                                                                    .name
                                                                            }
                                                                        </p>
                                                                        <p className="text-[10px] text-slate-400 dark:text-zinc-500">
                                                                            {task
                                                                                .assignee
                                                                                .position_title ??
                                                                                'Assignee'}
                                                                        </p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                        ) : (
                                                            <span className="font-mono text-slate-400">
                                                                -
                                                            </span>
                                                        )}
                                                    </td>

                                                    {/* Reviewer Avatar */}
                                                    <td className="px-3 py-2.5 text-center whitespace-nowrap">
                                                        {task.reviewer ? (
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
                                                                            <Avatar className="size-6 rounded-full border border-slate-200 dark:border-white/10">
                                                                                <AvatarImage
                                                                                    src={
                                                                                        task
                                                                                            .reviewer
                                                                                            .avatar_url ??
                                                                                        undefined
                                                                                    }
                                                                                />
                                                                                <AvatarFallback className="text-[8px] font-bold">
                                                                                    {getInitials(
                                                                                        task
                                                                                            .reviewer
                                                                                            .name,
                                                                                    )}
                                                                                </AvatarFallback>
                                                                            </Avatar>
                                                                        </div>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent
                                                                        side="top"
                                                                        className="rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-xs text-white shadow-xl dark:border-white/10 dark:bg-white dark:text-slate-900"
                                                                    >
                                                                        <p className="font-semibold">
                                                                            {
                                                                                task
                                                                                    .reviewer
                                                                                    .name
                                                                            }
                                                                        </p>
                                                                        <p className="text-[10px] text-slate-400 dark:text-zinc-500">
                                                                            {task
                                                                                .reviewer
                                                                                .position_title ??
                                                                                'Reviewer'}
                                                                        </p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                        ) : (
                                                            <span className="font-mono text-slate-400">
                                                                -
                                                            </span>
                                                        )}
                                                    </td>

                                                    {/* Due Date */}
                                                    <td className="px-3 py-2.5 font-mono text-[11px] whitespace-nowrap">
                                                        {task.due_at ? (
                                                            <span
                                                                className={
                                                                    overdue
                                                                        ? 'inline-flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400'
                                                                        : 'font-medium text-slate-700 dark:text-zinc-300'
                                                                }
                                                            >
                                                                {overdue && (
                                                                    <AlertCircle className="size-3 shrink-0 text-rose-500" />
                                                                )}
                                                                {formatDate(
                                                                    task.due_at,
                                                                )}
                                                            </span>
                                                        ) : (
                                                            <span className="font-mono text-slate-400">
                                                                -
                                                            </span>
                                                        )}
                                                    </td>

                                                    {/* Priority */}
                                                    <td className="px-3 py-2.5 whitespace-nowrap">
                                                        <StatusBadge
                                                            value={
                                                                task.priority
                                                            }
                                                        />
                                                    </td>

                                                    {/* Status Selector */}
                                                    <td className="px-3 py-2.5 whitespace-nowrap">
                                                        <div className="relative inline-block">
                                                            <select
                                                                value={
                                                                    task.status
                                                                }
                                                                disabled={
                                                                    updatingTaskId ===
                                                                    task.id
                                                                }
                                                                onChange={(e) =>
                                                                    changeStatus(
                                                                        task,
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                className="h-7 cursor-pointer appearance-none rounded-lg border border-slate-200 bg-slate-50/70 pr-6 pl-2 text-[10.5px] font-medium text-slate-800 outline-hidden transition-colors hover:bg-slate-100 focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-zinc-200"
                                                            >
                                                                <option value="todo">
                                                                    Belum Mulai
                                                                </option>
                                                                <option value="in_progress">
                                                                    Dikerjakan
                                                                </option>
                                                                <option value="waiting">
                                                                    Menunggu
                                                                </option>
                                                                <option value="review">
                                                                    Review
                                                                </option>
                                                                <option value="completed">
                                                                    Selesai
                                                                </option>
                                                                <option value="cancelled">
                                                                    Dibatalkan
                                                                </option>
                                                            </select>
                                                            <ChevronDown className="pointer-events-none absolute top-1/2 right-1.5 size-2.5 -translate-y-1/2 text-slate-400" />
                                                        </div>
                                                    </td>

                                                    {/* Action */}
                                                    <td className="py-2.5 pr-4 pl-1 text-right whitespace-nowrap">
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            asChild
                                                            className="h-7 px-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-300 dark:hover:bg-white/[0.06]"
                                                        >
                                                            <Link href={taskRoutes.show?.url ? taskRoutes.show.url(task.id) : `/tasks/${task.id}`}>
                                                                Detail
                                                                <ChevronRight className="ml-0.5 size-3 text-slate-400" />
                                                            </Link>
                                                        </Button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination Footer */}
                            <div className="flex flex-col justify-between gap-3 border-t border-slate-100 bg-slate-50/50 px-4 py-2.5 sm:flex-row sm:items-center dark:border-white/[0.04] dark:bg-[#121418]">
                                <span className="text-xs text-slate-500 dark:text-zinc-400">
                                    Menampilkan{' '}
                                    <span className="font-semibold text-slate-900 dark:text-white">
                                        {tasks.data.length}
                                    </span>{' '}
                                    dari{' '}
                                    <span className="font-semibold text-slate-900 dark:text-white">
                                        {tasks.total}
                                    </span>{' '}
                                    tugas
                                </span>
                                <Pagination links={tasks.links} />
                            </div>
                        </div>
                    ) : (
                        /* Grid Cards View */
                        <div className="space-y-4">
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                {tasks.data.map((task) => {
                                    const overdue = isTaskOverdue(task);

                                    return (
                                        <Link
                                            key={task.id}
                                            href={taskRoutes.show?.url ? taskRoutes.show.url(task.id) : `/tasks/${task.id}`}
                                            className="group flex cursor-pointer flex-col justify-between rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#14161b]"
                                        >
                                            <div className="space-y-2.5">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="flex items-center gap-1.5">
                                                        {task.task_number && (
                                                            <span className="inline-block rounded-md bg-blue-600 px-2 py-0.5 font-mono text-[10px] font-bold text-white shadow-2xs">
                                                                {task.task_number}
                                                            </span>
                                                        )}
                                                        <StatusBadge
                                                            value={task.priority}
                                                        />
                                                    </div>
                                                    <StatusBadge
                                                        value={task.status}
                                                    />
                                                </div>

                                                <div>
                                                    <h3
                                                        className={`text-xs font-semibold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400 ${
                                                            task.status ===
                                                            'completed'
                                                                ? 'line-through opacity-50'
                                                                : ''
                                                        }`}
                                                    >
                                                        {task.title}
                                                    </h3>
                                                    {task.description && (
                                                        <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-slate-500 dark:text-zinc-400">
                                                            {task.description}
                                                        </p>
                                                    )}
                                                </div>

                                                {task.matter ? (
                                                    <div className="flex max-w-full items-center gap-1.5 overflow-hidden rounded-md bg-blue-50/80 px-2 py-1 text-[10px] font-semibold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                                                        <Scale className="size-2.5 shrink-0" />
                                                        <span className="shrink-0 font-mono whitespace-nowrap">
                                                            {
                                                                task.matter
                                                                    .matter_number
                                                            }
                                                        </span>
                                                        <span className="truncate font-normal text-slate-600 dark:text-zinc-300">
                                                            ·{' '}
                                                            {task.matter.title}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <span className="inline-flex items-center rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[9.5px] font-medium text-slate-500 dark:bg-white/[0.06] dark:text-zinc-400">
                                                            Umum / Non-Perkara
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-xs dark:border-white/[0.04]">
                                                {/* Personnel */}
                                                <div className="flex min-w-0 items-center gap-1.5 pr-2">
                                                    {task.assignee ? (
                                                        <>
                                                            <Avatar className="size-5 shrink-0 rounded-full border border-slate-200 dark:border-white/10">
                                                                <AvatarImage
                                                                    src={
                                                                        task
                                                                            .assignee
                                                                            .avatar_url ??
                                                                        undefined
                                                                    }
                                                                />
                                                                <AvatarFallback className="text-[7px] font-bold">
                                                                    {getInitials(
                                                                        task
                                                                            .assignee
                                                                            .name,
                                                                    )}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <span
                                                                className="truncate text-[10px] font-medium text-slate-700 dark:text-zinc-300"
                                                                title={
                                                                    task.assignee
                                                                        .name
                                                                }
                                                            >
                                                                {
                                                                    task.assignee
                                                                        .name
                                                                }
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <span className="text-[10px] text-slate-400">
                                                            Unassigned
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Due Date */}
                                                <div className="shrink-0">
                                                    {task.due_at ? (
                                                        <span
                                                            className={`font-mono text-[10px] font-medium whitespace-nowrap ${
                                                                overdue
                                                                    ? 'font-bold text-rose-600 dark:text-rose-400'
                                                                    : 'text-slate-500 dark:text-zinc-400'
                                                            }`}
                                                        >
                                                            {formatDate(
                                                                task.due_at,
                                                            )}
                                                        </span>
                                                    ) : (
                                                        <span className="font-mono text-[10px] text-slate-400 whitespace-nowrap">
                                                            Tanpa tenggat
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>

                            {/* Pagination */}
                            <div className="border-t border-slate-100 p-3 dark:border-white/[0.04]">
                                <Pagination links={tasks.links} />
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* Modal Dialog: Detail Ringkasan Tugas & Kolaborasi */}
            <Dialog
                open={!!selectedTask}
                onOpenChange={(open) => !open && setSelectedTask(null)}
            >
                {selectedTask && (
                    <DialogContent className="flex max-h-[92vh] flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-0 shadow-2xl sm:max-w-2xl lg:max-w-3xl dark:border-white/10 dark:bg-[#14161b]">
                        {/* Header: Title, Badges & Action Controls */}
                        <div className="shrink-0 border-b border-slate-100 bg-white px-6 pt-5 pr-14 pb-4 dark:border-white/[0.06] dark:bg-[#14161b]">
                            {/* Top Meta Line: Badges & Matter Pill */}
                            <div className="mb-2.5 flex flex-wrap items-center gap-2">
                                <StatusBadge value={selectedTask.priority} />
                                <StatusBadge value={selectedTask.status} />

                                {selectedTask.matter && (
                                    <Link
                                        href={matterRoutes.show?.url ? matterRoutes.show.url(
                                            selectedTask.matter.id,
                                        ) : `/matters/${selectedTask.matter.id}`}
                                        className="inline-flex items-center gap-1.5 rounded-md bg-blue-50 px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap text-blue-700 transition-colors hover:bg-blue-100 hover:text-blue-800 dark:bg-blue-950/60 dark:text-blue-300"
                                    >
                                        <Briefcase className="size-3 shrink-0 text-blue-600 dark:text-blue-400" />
                                        <span className="font-mono font-bold">
                                            {selectedTask.matter.matter_number}
                                        </span>
                                        <span className="max-w-[260px] truncate sm:max-w-[360px]">
                                            · {selectedTask.matter.title}
                                        </span>
                                        <ArrowUpRight className="size-3 shrink-0 text-blue-500" />
                                    </Link>
                                )}

                                {selectedTask.due_at &&
                                    isTaskOverdue(selectedTask) && (
                                        <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-2 py-0.5 text-xs font-bold whitespace-nowrap text-rose-700 uppercase dark:bg-rose-950/60 dark:text-rose-300">
                                            <AlertCircle className="size-3 shrink-0" />
                                            Lewat Tenggat
                                        </span>
                                    )}
                            </div>

                            {/* Task Title + Edit Button Row */}
                            <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0 flex-1 space-y-1">
                                    <DialogTitle className="text-lg leading-snug font-bold break-words text-slate-900 sm:text-xl dark:text-white">
                                        {selectedTask.title}
                                    </DialogTitle>
                                    <DialogDescription className="text-xs text-slate-500 dark:text-zinc-400">
                                        {selectedTask.matter
                                            ? `Tugas operasional dalam penanganan ${selectedTask.matter.matter_number}`
                                            : 'Tugas internal & instruksi umum kantor hukum'}
                                    </DialogDescription>
                                </div>

                                <div className="flex shrink-0 items-center gap-2">
                                    {can.update && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            asChild
                                            className="h-8 rounded-lg border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-white/10 dark:bg-[#16181d] dark:text-zinc-200"
                                        >
                                            <Link href={taskRoutes.edit.url(selectedTask.id)}>
                                                <Pencil className="mr-1.5 size-3.5 text-slate-400" />
                                                Edit Tugas
                                            </Link>
                                        </Button>
                                    )}
                                    {can.delete && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                                setTaskToDelete(selectedTask)
                                            }
                                            className="h-8 rounded-lg border-rose-200 bg-rose-50/50 px-2.5 text-xs font-semibold text-rose-700 shadow-2xs hover:bg-rose-100 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300"
                                            title="Hapus Tugas"
                                        >
                                            <Trash2 className="size-3.5 text-rose-600 dark:text-rose-400" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Interactive Workflow Status Pipeline - 4-Column Balanced Grid */}
                        <div className="shrink-0 border-b border-slate-100 bg-slate-50/80 px-6 py-2.5 dark:border-white/[0.06] dark:bg-white/[0.02]">
                            <div className="grid w-full grid-cols-4 gap-2">
                                {[
                                    {
                                        key: 'pending',
                                        num: '1',
                                        label: 'To Do',
                                        activeBg:
                                            'bg-slate-900 text-white font-bold shadow-xs dark:bg-white dark:text-slate-900',
                                    },
                                    {
                                        key: 'in_progress',
                                        num: '2',
                                        label: 'Dikerjakan',
                                        activeBg:
                                            'bg-blue-600 text-white font-bold shadow-xs',
                                    },
                                    {
                                        key: 'review',
                                        num: '3',
                                        label: 'Review',
                                        activeBg:
                                            'bg-amber-600 text-white font-bold shadow-xs',
                                    },
                                    {
                                        key: 'completed',
                                        num: '4',
                                        label: 'Selesai',
                                        activeBg:
                                            'bg-emerald-600 text-white font-bold shadow-xs',
                                    },
                                ].map((step) => {
                                    const isActive =
                                        selectedTask.status === step.key;
                                    return (
                                        <button
                                            key={step.key}
                                            type="button"
                                            onClick={() =>
                                                changeStatus(
                                                    selectedTask,
                                                    step.key,
                                                )
                                            }
                                            className={`flex cursor-pointer items-center justify-center gap-1.5 rounded-lg py-1.5 text-center text-xs transition-all ${
                                                isActive
                                                    ? step.activeBg
                                                    : 'border border-slate-200/60 bg-white font-medium text-slate-600 hover:bg-slate-200/70 dark:border-white/10 dark:bg-[#16181d] dark:text-zinc-300 dark:hover:bg-white/[0.08]'
                                            }`}
                                        >
                                            {step.key === 'completed' &&
                                            isActive ? (
                                                <Check className="size-3 shrink-0 stroke-[3]" />
                                            ) : (
                                                <span
                                                    className={`flex size-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                                                        isActive
                                                            ? 'bg-white/20 text-current'
                                                            : 'bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-zinc-300'
                                                    }`}
                                                >
                                                    {step.num}
                                                </span>
                                            )}
                                            <span className="truncate">
                                                {step.label}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Scrollable Content Body */}
                        <div className="flex-1 space-y-4 overflow-y-auto p-6">
                            {/* Symmetric 4-Card Metadata Grid */}
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                {/* 1. Perkara Terkait */}
                                <div className="flex flex-col justify-between space-y-2 rounded-xl border border-slate-200/70 bg-slate-50/50 p-3.5 dark:border-white/[0.06] dark:bg-white/[0.02]">
                                    <div className="flex items-center gap-2 text-slate-500 dark:text-zinc-400">
                                        <div className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                                            <Briefcase className="size-3.5" />
                                        </div>
                                        <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:text-zinc-400">
                                            Perkara Terkait
                                        </span>
                                    </div>
                                    <div className="min-w-0">
                                        {selectedTask.matter ? (
                                            <Link
                                                href={matterRoutes.show?.url ? matterRoutes.show.url(
                                                    selectedTask.matter.id,
                                                ) : `/matters/${selectedTask.matter.id}`}
                                                className="group block"
                                            >
                                                <p className="flex items-center gap-1 font-mono text-xs font-bold text-blue-600 group-hover:underline dark:text-blue-400">
                                                    {
                                                        selectedTask.matter
                                                            .matter_number
                                                    }
                                                    <ArrowUpRight className="inline size-3 text-slate-400" />
                                                </p>
                                                <p className="truncate pt-0.5 text-xs font-semibold text-slate-900 group-hover:text-blue-600 dark:text-white">
                                                    {selectedTask.matter.title}
                                                </p>
                                            </Link>
                                        ) : (
                                            <p className="text-xs text-slate-400 italic">
                                                Tugas independen (tanpa perkara)
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* 2. Batas Waktu (Tenggat) */}
                                <div className="flex flex-col justify-between space-y-2 rounded-xl border border-slate-200/70 bg-slate-50/50 p-3.5 dark:border-white/[0.06] dark:bg-white/[0.02]">
                                    <div className="flex items-center gap-2 text-slate-500 dark:text-zinc-400">
                                        <div className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
                                            <Clock className="size-3.5" />
                                        </div>
                                        <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:text-zinc-400">
                                            Batas Waktu (Tenggat WIB)
                                        </span>
                                    </div>
                                    <div>
                                        {selectedTask.due_at ? (
                                            <div>
                                                <p className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                                                    {formatDate(
                                                        selectedTask.due_at,
                                                        true,
                                                    )}
                                                </p>
                                                <p className="pt-0.5 text-[10.5px] text-slate-500 dark:text-zinc-400">
                                                    {isTaskOverdue(
                                                        selectedTask,
                                                    ) ? (
                                                        <span className="inline-flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400">
                                                            <AlertCircle className="size-3 text-rose-500" />
                                                            Melewati batas waktu
                                                        </span>
                                                    ) : (
                                                        <span>
                                                            Jadwal deliverable
                                                            perkara
                                                        </span>
                                                    )}
                                                </p>
                                            </div>
                                        ) : (
                                            <p className="text-xs text-slate-400 italic">
                                                Tidak ditentukan (fleksibel)
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* 3. Pelaksana (Assignee) */}
                                <div className="flex flex-col justify-between space-y-2 rounded-xl border border-slate-200/70 bg-slate-50/50 p-3.5 dark:border-white/[0.06] dark:bg-white/[0.02]">
                                    <div className="flex items-center gap-2 text-slate-500 dark:text-zinc-400">
                                        <div className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                                            <UserCheck className="size-3.5" />
                                        </div>
                                        <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:text-zinc-400">
                                            Pelaksana (Assignee)
                                        </span>
                                    </div>
                                    <div>
                                        {selectedTask.assignee ? (
                                            <div className="flex items-center gap-2.5">
                                                <Avatar className="size-7 shrink-0 rounded-full border border-slate-200 dark:border-white/10">
                                                    <AvatarImage
                                                        src={
                                                            selectedTask
                                                                .assignee
                                                                .avatar_url ??
                                                            undefined
                                                        }
                                                    />
                                                    <AvatarFallback className="text-[9px] font-bold">
                                                        {getInitials(
                                                            selectedTask
                                                                .assignee.name,
                                                        )}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="min-w-0">
                                                    <p className="truncate text-xs font-bold text-slate-900 dark:text-white">
                                                        {
                                                            selectedTask
                                                                .assignee.name
                                                        }
                                                    </p>
                                                    <p className="truncate text-[10px] text-slate-500 dark:text-zinc-400">
                                                        {selectedTask.assignee
                                                            .position_title ??
                                                            'Advokat Pelaksana'}
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-xs text-slate-400 italic">
                                                Belum ditugaskan
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* 4. Reviewer (Partner) */}
                                <div className="flex flex-col justify-between space-y-2 rounded-xl border border-slate-200/70 bg-slate-50/50 p-3.5 dark:border-white/[0.06] dark:bg-white/[0.02]">
                                    <div className="flex items-center gap-2 text-slate-500 dark:text-zinc-400">
                                        <div className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                                            <User className="size-3.5" />
                                        </div>
                                        <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:text-zinc-400">
                                            Reviewer (Partner)
                                        </span>
                                    </div>
                                    <div>
                                        {selectedTask.reviewer ? (
                                            <div className="flex items-center gap-2.5">
                                                <Avatar className="size-7 shrink-0 rounded-full border border-slate-200 dark:border-white/10">
                                                    <AvatarImage
                                                        src={
                                                            selectedTask
                                                                .reviewer
                                                                .avatar_url ??
                                                            undefined
                                                        }
                                                    />
                                                    <AvatarFallback className="text-[9px] font-bold">
                                                        {getInitials(
                                                            selectedTask
                                                                .reviewer.name,
                                                        )}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="min-w-0">
                                                    <p className="truncate text-xs font-bold text-slate-900 dark:text-white">
                                                        {
                                                            selectedTask
                                                                .reviewer.name
                                                        }
                                                    </p>
                                                    <p className="truncate text-[10px] text-slate-500 dark:text-zinc-400">
                                                        {selectedTask.reviewer
                                                            .position_title ??
                                                            'Supervising Partner'}
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-xs text-slate-400 italic">
                                                Tanpa reviewer
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Instruksi Kerja & Catatan Teknis */}
                            <div className="space-y-1.5 rounded-xl border border-slate-200/70 bg-slate-50/50 p-4 dark:border-white/[0.06] dark:bg-white/[0.02]">
                                <div className="flex items-center gap-2 text-slate-600 dark:text-zinc-300">
                                    <div className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-zinc-300">
                                        <FileText className="size-3.5" />
                                    </div>
                                    <span className="text-[10px] font-bold tracking-wider text-slate-700 uppercase dark:text-zinc-300">
                                        Instruksi Kerja &amp; Catatan Teknis
                                    </span>
                                </div>
                                <div className="pt-1 pl-8 text-xs leading-relaxed whitespace-pre-wrap text-slate-800 dark:text-zinc-200">
                                    {selectedTask.description ||
                                        'Tidak ada instruksi kerja tambahan. Kerjakan tugas sesuai SOP dan arahan Partner penanggung jawab.'}
                                </div>
                            </div>

                            {/* Task Collaboration Discussion Box */}
                            <div className="pb-2">
                                <DiscussionBox
                                    commentableType="task"
                                    commentableId={selectedTask.id}
                                    comments={selectedTask.comments || []}
                                    staffList={users || []}
                                    title="Klarifikasi & Catatan Diskusi Tugas"
                                    subtitle="Tanyakan kendala atau konfirmasi arahan riset."
                                />
                            </div>
                        </div>
                    </DialogContent>
                )}
            </Dialog>

            {/* Modal Dialog: Buat Tugas Baru */}
            <Dialog open={openCreate} onOpenChange={setOpenCreate}>
                <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200/90 bg-white p-6 pr-10 shadow-2xl sm:max-w-2xl lg:max-w-3xl dark:border-white/10 dark:bg-[#14161b]">
                    <DialogHeader className="border-b border-slate-100 pb-3.5 dark:border-white/[0.06]">
                        <div className="flex items-center gap-3">
                            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                                <ListTodo className="size-4.5" />
                            </div>
                            <div>
                                <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
                                    Buat Tugas &amp; Instruksi Baru
                                </DialogTitle>
                                <DialogDescription className="text-xs text-slate-500 dark:text-zinc-400">
                                    Tetapkan penugasan advokat, reviewer, dan
                                    tenggat waktu.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <Form
                        {...(taskRoutes.store?.form ? taskRoutes.store.form() : { action: '/tasks', method: 'post' as const })}
                        className="space-y-4 pt-1"
                        resetOnSuccess
                        onSuccess={() => setOpenCreate(false)}
                    >
                        {({ errors, processing }) => (
                            <>
                                <Field
                                    label="Judul Tugas"
                                    name="title"
                                    error={errors.title}
                                    placeholder="Contoh: Analisis Dokumen Kontrak & Klausul Arbitrase"
                                    required
                                />

                                <div className="grid gap-1">
                                    <Label
                                        htmlFor="matter_id"
                                        className="text-xs font-semibold text-slate-700 dark:text-zinc-300"
                                    >
                                        Terkait Matter / Perkara
                                    </Label>
                                    <div className="relative">
                                        <select
                                            id="matter_id"
                                            name="matter_id"
                                            className="h-8.5 w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-slate-50/70 pr-7 pl-2.5 text-xs font-medium text-slate-900 outline-hidden transition-colors hover:bg-slate-100 focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-zinc-200"
                                        >
                                            <option value="">
                                                Tanpa matter (Tugas Umum)
                                            </option>
                                            {matters.map((matter) => (
                                                <option
                                                    key={matter.id}
                                                    value={matter.id}
                                                >
                                                    {matter.matter_number} -{' '}
                                                    {matter.title}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3 -translate-y-1/2 text-slate-400" />
                                    </div>
                                    <InputError message={errors.matter_id} />
                                </div>

                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div className="grid gap-1">
                                        <Label
                                            htmlFor="assignee_id"
                                            className="text-xs font-semibold text-slate-700 dark:text-zinc-300"
                                        >
                                            Ditugaskan ke (Assignee)
                                        </Label>
                                        <div className="relative">
                                            <select
                                                id="assignee_id"
                                                name="assignee_id"
                                                className="h-8.5 w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-slate-50/70 pr-7 pl-2.5 text-xs font-medium text-slate-900 outline-hidden transition-colors hover:bg-slate-100 focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-zinc-200"
                                            >
                                                <option value="">
                                                    Belum Ditugaskan
                                                </option>
                                                {users.map((user) => (
                                                    <option
                                                        key={user.id}
                                                        value={user.id}
                                                    >
                                                        {user.name}{' '}
                                                        {user.position_title
                                                            ? `- ${user.position_title}`
                                                            : ''}
                                                    </option>
                                                ))}
                                            </select>
                                            <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3 -translate-y-1/2 text-slate-400" />
                                        </div>
                                        <InputError
                                            message={errors.assignee_id}
                                        />
                                    </div>

                                    <div className="grid gap-1">
                                        <Label
                                            htmlFor="reviewer_id"
                                            className="text-xs font-semibold text-slate-700 dark:text-zinc-300"
                                        >
                                            Reviewer (Partner)
                                        </Label>
                                        <div className="relative">
                                            <select
                                                id="reviewer_id"
                                                name="reviewer_id"
                                                className="h-8.5 w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-slate-50/70 pr-7 pl-2.5 text-xs font-medium text-slate-900 outline-hidden transition-colors hover:bg-slate-100 focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-zinc-200"
                                            >
                                                <option value="">
                                                    Tanpa Reviewer
                                                </option>
                                                {users.map((user) => (
                                                    <option
                                                        key={user.id}
                                                        value={user.id}
                                                    >
                                                        {user.name}{' '}
                                                        {user.position_title
                                                            ? `- ${user.position_title}`
                                                            : ''}
                                                    </option>
                                                ))}
                                            </select>
                                            <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3 -translate-y-1/2 text-slate-400" />
                                        </div>
                                        <InputError
                                            message={errors.reviewer_id}
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-3 sm:grid-cols-3">
                                    <div className="grid gap-1">
                                        <Label
                                            htmlFor="priority"
                                            className="text-xs font-semibold text-slate-700 dark:text-zinc-300"
                                        >
                                            Prioritas
                                        </Label>
                                        <div className="relative">
                                            <select
                                                id="priority"
                                                name="priority"
                                                defaultValue="normal"
                                                className="h-8.5 w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-slate-50/70 pr-7 pl-2.5 text-xs font-medium text-slate-900 outline-hidden transition-colors hover:bg-slate-100 focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-zinc-200"
                                            >
                                                <option value="low">
                                                    Rendah
                                                </option>
                                                <option value="normal">
                                                    Normal
                                                </option>
                                                <option value="high">
                                                    Tinggi
                                                </option>
                                                <option value="critical">
                                                    Kritis
                                                </option>
                                            </select>
                                            <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3 -translate-y-1/2 text-slate-400" />
                                        </div>
                                    </div>

                                    <div className="grid gap-1">
                                        <Label
                                            htmlFor="status"
                                            className="text-xs font-semibold text-slate-700 dark:text-zinc-300"
                                        >
                                            Status Awal
                                        </Label>
                                        <div className="relative">
                                            <select
                                                id="status"
                                                name="status"
                                                defaultValue="todo"
                                                className="h-8.5 w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-slate-50/70 pr-7 pl-2.5 text-xs font-medium text-slate-900 outline-hidden transition-colors hover:bg-slate-100 focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-zinc-200"
                                            >
                                                <option value="todo">
                                                    Belum Mulai
                                                </option>
                                                <option value="in_progress">
                                                    Dikerjakan
                                                </option>
                                                <option value="waiting">
                                                    Menunggu
                                                </option>
                                                <option value="review">
                                                    Review
                                                </option>
                                            </select>
                                            <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3 -translate-y-1/2 text-slate-400" />
                                        </div>
                                    </div>

                                    <Field
                                        label="Tenggat Waktu"
                                        name="due_at"
                                        type="date"
                                        error={errors.due_at}
                                    />
                                </div>

                                <div className="grid gap-1">
                                    <Label
                                        htmlFor="description"
                                        className="text-xs font-semibold text-slate-700 dark:text-zinc-300"
                                    >
                                        Instruksi Kerja
                                    </Label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        rows={3}
                                        placeholder="Petunjuk teknis, rincian deliverable, atau catatan instruksi..."
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 text-xs leading-relaxed text-slate-900 outline-hidden transition-colors focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
                                    />
                                    <InputError message={errors.description} />
                                </div>

                                <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3 dark:border-white/[0.06]">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setOpenCreate(false)}
                                        className="h-8.5 rounded-xl border-slate-200 px-3.5 text-xs text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-zinc-300"
                                    >
                                        Batal
                                    </Button>
                                    <Button
                                        size="sm"
                                        disabled={processing}
                                        className="h-8.5 rounded-xl bg-slate-900 px-4 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 active:scale-95 disabled:opacity-50 dark:bg-white dark:text-slate-900"
                                    >
                                        {processing ? (
                                            <>
                                                <Spinner className="mr-1.5 size-3" />
                                                Menyimpan...
                                            </>
                                        ) : (
                                            'Simpan Tugas'
                                        )}
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                </DialogContent>
            </Dialog>

            {/* Modal Dialog: Edit Tugas In-Place */}
            <Dialog
                open={!!editingTask}
                onOpenChange={(open) => !open && setEditingTask(null)}
            >
                {editingTask && (
                    <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200/90 bg-white p-6 pr-10 shadow-2xl sm:max-w-2xl lg:max-w-3xl dark:border-white/10 dark:bg-[#14161b]">
                        <DialogHeader className="border-b border-slate-100 pb-3.5 dark:border-white/[0.06]">
                            <div className="flex items-center gap-3">
                                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                                    <Pencil className="size-4.5" />
                                </div>
                                <div>
                                    <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
                                        Edit Detail Tugas
                                    </DialogTitle>
                                    <DialogDescription className="text-xs text-slate-500 dark:text-zinc-400">
                                        Perbarui penugasan, instruksi, dan
                                        tenggat waktu.
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>

                        <Form
                            {...(taskRoutes.update?.form ? taskRoutes.update.form(editingTask.id) : { action: `/tasks/${editingTask.id}`, method: 'put' as const })}
                            className="space-y-4 pt-1"
                            onSuccess={() => setEditingTask(null)}
                        >
                            {({ errors, processing }) => (
                                <>
                                    <Field
                                        label="Judul Tugas"
                                        name="title"
                                        defaultValue={editingTask.title}
                                        error={errors.title}
                                        required
                                    />

                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <div className="grid gap-1">
                                            <Label
                                                htmlFor="assignee_id_edit"
                                                className="text-xs font-semibold text-slate-700 dark:text-zinc-300"
                                            >
                                                Ditugaskan ke (Assignee)
                                            </Label>
                                            <div className="relative">
                                                <select
                                                    id="assignee_id_edit"
                                                    name="assignee_id"
                                                    defaultValue={
                                                        editingTask.assignee_id ??
                                                        ''
                                                    }
                                                    className="h-8.5 w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-slate-50/70 pr-7 pl-2.5 text-xs font-medium text-slate-900 outline-hidden transition-colors hover:bg-slate-100 focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-zinc-200"
                                                >
                                                    <option value="">
                                                        Belum Ditugaskan
                                                    </option>
                                                    {users.map((user) => (
                                                        <option
                                                            key={user.id}
                                                            value={user.id}
                                                        >
                                                            {user.name}{' '}
                                                            {user.position_title
                                                                ? `- ${user.position_title}`
                                                                : ''}
                                                        </option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3 -translate-y-1/2 text-slate-400" />
                                            </div>
                                            <InputError
                                                message={errors.assignee_id}
                                            />
                                        </div>

                                        <div className="grid gap-1">
                                            <Label
                                                htmlFor="reviewer_id_edit"
                                                className="text-xs font-semibold text-slate-700 dark:text-zinc-300"
                                            >
                                                Reviewer (Partner)
                                            </Label>
                                            <div className="relative">
                                                <select
                                                    id="reviewer_id_edit"
                                                    name="reviewer_id"
                                                    defaultValue={
                                                        editingTask.reviewer_id ??
                                                        ''
                                                    }
                                                    className="h-8.5 w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-slate-50/70 pr-7 pl-2.5 text-xs font-medium text-slate-900 outline-hidden transition-colors hover:bg-slate-100 focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-zinc-200"
                                                >
                                                    <option value="">
                                                        Tanpa Reviewer
                                                    </option>
                                                    {users.map((user) => (
                                                        <option
                                                            key={user.id}
                                                            value={user.id}
                                                        >
                                                            {user.name}{' '}
                                                            {user.position_title
                                                                ? `- ${user.position_title}`
                                                                : ''}
                                                        </option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3 -translate-y-1/2 text-slate-400" />
                                            </div>
                                            <InputError
                                                message={errors.reviewer_id}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid gap-3 sm:grid-cols-3">
                                        <div className="grid gap-1">
                                            <Label
                                                htmlFor="priority_edit"
                                                className="text-xs font-semibold text-slate-700 dark:text-zinc-300"
                                            >
                                                Prioritas
                                            </Label>
                                            <div className="relative">
                                                <select
                                                    id="priority_edit"
                                                    name="priority"
                                                    defaultValue={
                                                        editingTask.priority
                                                    }
                                                    className="h-8.5 w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-slate-50/70 pr-7 pl-2.5 text-xs font-medium text-slate-900 outline-hidden transition-colors hover:bg-slate-100 focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-zinc-200"
                                                >
                                                    <option value="low">
                                                        Rendah
                                                    </option>
                                                    <option value="normal">
                                                        Normal
                                                    </option>
                                                    <option value="high">
                                                        Tinggi
                                                    </option>
                                                    <option value="critical">
                                                        Kritis
                                                    </option>
                                                </select>
                                                <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3 -translate-y-1/2 text-slate-400" />
                                            </div>
                                        </div>

                                        <div className="grid gap-1">
                                            <Label
                                                htmlFor="status_edit"
                                                className="text-xs font-semibold text-slate-700 dark:text-zinc-300"
                                            >
                                                Status
                                            </Label>
                                            <div className="relative">
                                                <select
                                                    id="status_edit"
                                                    name="status"
                                                    defaultValue={
                                                        editingTask.status
                                                    }
                                                    className="h-8.5 w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-slate-50/70 pr-7 pl-2.5 text-xs font-medium text-slate-900 outline-hidden transition-colors hover:bg-slate-100 focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-zinc-200"
                                                >
                                                    <option value="todo">
                                                        Belum Mulai
                                                    </option>
                                                    <option value="in_progress">
                                                        Dikerjakan
                                                    </option>
                                                    <option value="waiting">
                                                        Menunggu
                                                    </option>
                                                    <option value="review">
                                                        Review
                                                    </option>
                                                    <option value="completed">
                                                        Selesai
                                                    </option>
                                                </select>
                                                <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3 -translate-y-1/2 text-slate-400" />
                                            </div>
                                        </div>

                                        <Field
                                            label="Tenggat Waktu"
                                            name="due_at"
                                            type="date"
                                            defaultValue={
                                                editingTask.due_at
                                                    ? editingTask.due_at.split(
                                                          'T',
                                                      )[0]
                                                    : undefined
                                            }
                                            error={errors.due_at}
                                        />
                                    </div>

                                    <div className="grid gap-1">
                                        <Label
                                            htmlFor="description_edit"
                                            className="text-xs font-semibold text-slate-700 dark:text-zinc-300"
                                        >
                                            Instruksi Kerja
                                        </Label>
                                        <textarea
                                            id="description_edit"
                                            name="description"
                                            rows={3}
                                            defaultValue={
                                                editingTask.description ?? ''
                                            }
                                            placeholder="Petunjuk teknis, rincian deliverable, atau catatan instruksi..."
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 text-xs leading-relaxed text-slate-900 outline-hidden transition-colors focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
                                        />
                                        <InputError
                                            message={errors.description}
                                        />
                                    </div>

                                    <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3 dark:border-white/[0.06]">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setEditingTask(null)}
                                            className="h-8.5 rounded-xl border-slate-200 px-3.5 text-xs text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-zinc-300"
                                        >
                                            Batal
                                        </Button>
                                        <Button
                                            size="sm"
                                            disabled={processing}
                                            className="h-8.5 rounded-xl bg-slate-900 px-4 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 active:scale-95 disabled:opacity-50 dark:bg-white dark:text-slate-900"
                                        >
                                            {processing ? (
                                                <>
                                                    <Spinner className="mr-1.5 size-3" />
                                                    Menyimpan...
                                                </>
                                            ) : (
                                                'Perbarui Tugas'
                                            )}
                                        </Button>
                                    </div>
                                </>
                            )}
                        </Form>
                    </DialogContent>
                )}
            </Dialog>

            {/* Modal Konfirmasi Hapus Tugas */}
            <ConfirmDialog
                open={!!taskToDelete}
                onOpenChange={(open) => !open && setTaskToDelete(null)}
                title="Hapus Tugas Delegasi"
                description={
                    taskToDelete
                        ? `Apakah Anda yakin ingin menghapus tugas "${taskToDelete.title}"? Seluruh riwayat komentar terkait tugas ini juga akan dihapus.`
                        : ''
                }
                confirmLabel="Hapus Tugas"
                variant="danger"
                processing={isDeletingTask}
                onConfirm={() => {
                    if (!taskToDelete) return;
                    setIsDeletingTask(true);
                    router.delete(`/tasks/${taskToDelete.id}`, {
                        onFinish: () => {
                            setIsDeletingTask(false);
                            setTaskToDelete(null);
                            setSelectedTask(null);
                        },
                    });
                }}
            />
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
                className="h-8 rounded-lg border-slate-200 bg-slate-50/70 text-xs text-slate-900 transition-colors placeholder:text-slate-400 focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
            />
            <InputError message={error} />
        </div>
    );
}

TasksIndex.layout = {
    breadcrumbs: [{ title: 'Tugas', href: taskRoutes.index?.url ? taskRoutes.index.url() : '/tasks' }],
};
