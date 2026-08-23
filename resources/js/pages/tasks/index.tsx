import { Form, Head, Link, router } from '@inertiajs/react';
import {
    AlertCircle,
    CalendarClock,
    CheckCircle2,
    ChevronDown,
    Circle,
    Clock,
    Filter,
    FolderKanban,
    ListTodo,
    Plus,
    Search,
    UserCheck,
    Users,
} from 'lucide-react';
import { useState } from 'react';
import { EmptyState } from '@/components/empty-state';
import InputError from '@/components/input-error';
import { Pagination } from '@/components/pagination';
import { StatusBadge } from '@/components/status-badge';
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
    title: string;
    description?: string;
    status: string;
    priority: string;
    due_at?: string;
    assignee_id?: number;
    reviewer_id?: number;
    assignee?: Person;
    reviewer?: Person;
    matter?: { id: string; matter_number: string; title: string };
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
    can: { create: boolean };
}) {
    const [open, setOpen] = useState(() =>
        new URLSearchParams(window.location.search).has('create'),
    );

    const changeStatus = (task: Task, status: string) =>
        router.patch(
            taskRoutes.update(task.id),
            {
                title: task.title,
                description: task.description ?? '',
                assignee_id: task.assignee_id ?? '',
                reviewer_id: task.reviewer_id ?? '',
                priority: task.priority,
                due_at: task.due_at ?? '',
                status,
            },
            { preserveScroll: true },
        );

    const viewTabs = [
        { id: '', label: 'Semua Tugas' },
        { id: 'mine', label: 'Tugas Saya' },
        { id: 'created', label: 'Dibuat Saya' },
        { id: 'overdue', label: 'Lewat Tenggat' },
    ];

    return (
        <>
            <Head title="Tugas & Instruksi Kerja" />

            <div className="min-h-screen w-full bg-[#fbfbfa] text-[#111111] antialiased dark:bg-[#121212] dark:text-[#fbfbfa]">
                <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
                    {/* Notion Minimalist Page Header */}
                    <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div className="space-y-1">
                            <h1 className="text-2xl font-bold tracking-tight text-[#111111] dark:text-white">
                                Tugas & Instruksi Kerja
                            </h1>
                            <p className="text-xs text-[#787774] dark:text-zinc-400">
                                Pelacakan penugasan advokat, review partner, dan tenggat waktu seluruh perkara.
                            </p>
                        </div>

                        {/* Right: Actions */}
                        {can.create && (
                            <div className="flex shrink-0 items-center gap-2">
                                <Button
                                    onClick={() => setOpen(true)}
                                    className="h-8 rounded-lg bg-[#111111] px-3.5 text-xs font-semibold text-white shadow-2xs transition-colors hover:bg-black active:scale-95 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                                >
                                    <Plus className="mr-1.5 size-3.5" />
                                    Buat Tugas Baru
                                </Button>
                            </div>
                        )}
                    </header>

                    {/* Compact 4-Column Stat Strip (h-[76px]) */}
                    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {/* 1. Total Tugas */}
                        <div className="flex h-[76px] flex-col justify-between rounded-xl border border-black/[0.07] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                            <div className="flex items-center justify-between text-[11px] font-medium text-[#787774] dark:text-zinc-400">
                                <span>Total Tugas</span>
                                <ListTodo className="size-3.5 text-[#1f6c9f] dark:text-sky-400" />
                            </div>
                            <div className="flex items-baseline justify-between">
                                <span className="font-mono text-lg font-bold tracking-tight text-[#111111] dark:text-white">
                                    {metrics.total}
                                </span>
                                <span className="text-[10px] text-[#787774] dark:text-zinc-400">
                                    seluruh perkara
                                </span>
                            </div>
                        </div>

                        {/* 2. Tugas Saya */}
                        <div className="flex h-[76px] flex-col justify-between rounded-xl border border-black/[0.07] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                            <div className="flex items-center justify-between text-[11px] font-medium text-[#787774] dark:text-zinc-400">
                                <span>Tugas Saya</span>
                                <UserCheck className="size-3.5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div className="flex items-baseline justify-between">
                                <span className="font-mono text-lg font-bold tracking-tight text-purple-600 dark:text-purple-400">
                                    {metrics.mine}
                                </span>
                                <span className="text-[10px] text-[#787774] dark:text-zinc-400">
                                    perlu dikerjakan
                                </span>
                            </div>
                        </div>

                        {/* 3. Lewat Tenggat */}
                        <div className="flex h-[76px] flex-col justify-between rounded-xl border border-black/[0.07] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                            <div className="flex items-center justify-between text-[11px] font-medium text-[#787774] dark:text-zinc-400">
                                <span>Lewat Tenggat</span>
                                <AlertCircle className="size-3.5 text-rose-600 dark:text-rose-400" />
                            </div>
                            <div className="flex items-baseline justify-between">
                                <span className="font-mono text-lg font-bold tracking-tight text-rose-600 dark:text-rose-400">
                                    {metrics.overdue}
                                </span>
                                <span className="text-[10px] text-[#787774] dark:text-zinc-400">
                                    tenggat terlewat
                                </span>
                            </div>
                        </div>

                        {/* 4. Selesai */}
                        <div className="flex h-[76px] flex-col justify-between rounded-xl border border-black/[0.07] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                            <div className="flex items-center justify-between text-[11px] font-medium text-[#787774] dark:text-zinc-400">
                                <span>Selesai</span>
                                <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div className="flex items-baseline justify-between">
                                <span className="font-mono text-lg font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                                    {metrics.completed}
                                </span>
                                <span className="text-[10px] text-[#787774] dark:text-zinc-400">
                                    dituntaskan
                                </span>
                            </div>
                        </div>
                    </section>

                    {/* Filter & View Switcher Bar */}
                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                        {/* Segmented View Pills */}
                        <div className="inline-flex rounded-lg bg-black/[0.04] p-1 dark:bg-white/[0.06]">
                            {viewTabs.map((tab) => {
                                const isCurrent = (filters.view ?? '') === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        onClick={() =>
                                            router.get(
                                                taskRoutes.index(),
                                                { ...filters, view: tab.id || undefined },
                                                { preserveState: true },
                                            )
                                        }
                                        className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                                            isCurrent
                                                ? 'bg-white text-[#111111] shadow-2xs dark:bg-zinc-700 dark:text-white'
                                                : 'text-[#787774] hover:text-[#111111] dark:text-zinc-400 dark:hover:text-white'
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Dropdown Filters */}
                        <div className="flex items-center gap-2">
                            {/* Matter Filter */}
                            <div className="relative min-w-[180px]">
                                <select
                                    defaultValue={filters.matter_id ?? ''}
                                    onChange={(e) =>
                                        router.get(
                                            taskRoutes.index(),
                                            { ...filters, matter_id: e.target.value || undefined },
                                            { preserveState: true },
                                        )
                                    }
                                    className="h-7.5 w-full cursor-pointer appearance-none rounded-lg border border-black/[0.08] bg-white pl-3 pr-7 text-xs font-medium text-[#2f3437] outline-none transition-colors hover:bg-black/[0.02] focus:border-black/20 dark:border-white/[0.08] dark:bg-[#1a1a1c] dark:text-zinc-200"
                                >
                                    <option value="">Semua Perkara</option>
                                    {matters.map((matter) => (
                                        <option key={matter.id} value={matter.id}>
                                            {matter.matter_number} — {matter.title}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3 -translate-y-1/2 text-[#787774]" />
                            </div>

                            {/* Status Filter */}
                            <div className="relative min-w-[140px]">
                                <select
                                    defaultValue={filters.status ?? ''}
                                    onChange={(e) =>
                                        router.get(
                                            taskRoutes.index(),
                                            { ...filters, status: e.target.value || undefined },
                                            { preserveState: true },
                                        )
                                    }
                                    className="h-7.5 w-full cursor-pointer appearance-none rounded-lg border border-black/[0.08] bg-white pl-3 pr-7 text-xs font-medium text-[#2f3437] outline-none transition-colors hover:bg-black/[0.02] focus:border-black/20 dark:border-white/[0.08] dark:bg-[#1a1a1c] dark:text-zinc-200"
                                >
                                    <option value="">Semua Status</option>
                                    <option value="todo">Belum Dikerjakan</option>
                                    <option value="in_progress">Sedang Dikerjakan</option>
                                    <option value="waiting">Menunggu</option>
                                    <option value="review">Dalam Review</option>
                                    <option value="completed">Selesai</option>
                                    <option value="cancelled">Dibatalkan</option>
                                </select>
                                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3 -translate-y-1/2 text-[#787774]" />
                            </div>
                        </div>
                    </div>

                    {/* Task Table Surface */}
                    <div className="overflow-hidden rounded-xl border border-black/[0.08] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                        {tasks.data.length === 0 ? (
                            <div className="flex min-h-[380px] items-center justify-center p-12 text-center">
                                <EmptyState
                                    title="Tidak ada tugas pada filter ini"
                                    description="Seluruh instruksi kerja telah dituntaskan atau silakan sesuaikan filter pilihan Anda."
                                />
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead>
                                        <tr className="border-b border-black/[0.04] bg-[#fafafa] text-[10px] font-semibold uppercase tracking-wider text-[#787774] dark:border-white/[0.06] dark:bg-[#161618]">
                                            <th className="py-2.5 pl-4 pr-3 font-semibold">Tugas & Lingkup Perkara</th>
                                            <th className="px-3 py-2.5 text-center font-semibold">Assignee</th>
                                            <th className="px-3 py-2.5 text-center font-semibold">Reviewer</th>
                                            <th className="px-3 py-2.5 font-semibold">Tenggat</th>
                                            <th className="px-3 py-2.5 font-semibold">Prioritas</th>
                                            <th className="py-2.5 pl-3 pr-4 text-left font-semibold">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-black/[0.04] dark:divide-white/[0.05]">
                                        {tasks.data.map((task) => {
                                            const isOverdue =
                                                task.due_at &&
                                                new Date(task.due_at) < new Date() &&
                                                !['completed', 'cancelled'].includes(task.status);

                                            return (
                                                <tr
                                                    key={task.id}
                                                    className="group transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.03]"
                                                >
                                                    {/* Task Title & Matter Info */}
                                                    <td className="py-3 pl-4 pr-3">
                                                        <div className="space-y-1">
                                                            <p className={`font-semibold text-[#111111] dark:text-white ${task.status === 'completed' ? 'line-through opacity-50' : ''}`}>
                                                                {task.title}
                                                            </p>
                                                            {task.matter ? (
                                                                <Link
                                                                    href={matterRoutes.show(task.matter.id)}
                                                                    className="inline-flex items-center gap-1 font-mono text-[10px] text-blue-600 hover:underline dark:text-sky-400"
                                                                >
                                                                    <span className="rounded bg-[#e1f3fe] px-1.5 py-0.2 font-semibold text-[#1f6c9f] dark:bg-blue-950/50 dark:text-sky-300">
                                                                        {task.matter.matter_number}
                                                                    </span>
                                                                    <span className="truncate max-w-[260px] text-[#787774] dark:text-zinc-400">
                                                                        · {task.matter.title}
                                                                    </span>
                                                                </Link>
                                                            ) : (
                                                                <span className="font-mono text-[10px] text-[#787774] dark:text-zinc-500">
                                                                    Tugas Umum / Non-Perkara
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>

                                                    {/* Assignee Avatar */}
                                                    <td className="whitespace-nowrap px-3 py-3 text-center">
                                                        {task.assignee ? (
                                                            <TooltipProvider delayDuration={150}>
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <div className="inline-flex cursor-pointer items-center justify-center">
                                                                            <div className="relative flex size-6.5 shrink-0 items-center justify-center overflow-hidden rounded-full bg-black/[0.05] text-[10px] font-semibold text-zinc-700 dark:bg-white/[0.1] dark:text-zinc-300">
                                                                                {task.assignee.avatar_url ? (
                                                                                    <img
                                                                                        src={task.assignee.avatar_url}
                                                                                        alt={task.assignee.name}
                                                                                        className="size-full object-cover"
                                                                                    />
                                                                                ) : (
                                                                                    task.assignee.name
                                                                                        .split(' ')
                                                                                        .map((n) => n[0])
                                                                                        .slice(0, 2)
                                                                                        .join('')
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent className="rounded-lg border border-black/10 bg-[#111111] px-2.5 py-1 text-xs text-white shadow-lg dark:border-white/10 dark:bg-white dark:text-black">
                                                                        <p className="font-semibold">{task.assignee.name}</p>
                                                                        <p className="text-[10px] text-[#787774]">{task.assignee.position_title ?? 'Assignee'}</p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                        ) : (
                                                            <span className="text-[#787774] dark:text-zinc-500">—</span>
                                                        )}
                                                    </td>

                                                    {/* Reviewer Avatar */}
                                                    <td className="whitespace-nowrap px-3 py-3 text-center">
                                                        {task.reviewer ? (
                                                            <TooltipProvider delayDuration={150}>
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <div className="inline-flex cursor-pointer items-center justify-center">
                                                                            <div className="relative flex size-6.5 shrink-0 items-center justify-center overflow-hidden rounded-full bg-black/[0.05] text-[10px] font-semibold text-zinc-700 dark:bg-white/[0.1] dark:text-zinc-300">
                                                                                {task.reviewer.avatar_url ? (
                                                                                    <img
                                                                                        src={task.reviewer.avatar_url}
                                                                                        alt={task.reviewer.name}
                                                                                        className="size-full object-cover"
                                                                                    />
                                                                                ) : (
                                                                                    task.reviewer.name
                                                                                        .split(' ')
                                                                                        .map((n) => n[0])
                                                                                        .slice(0, 2)
                                                                                        .join('')
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent className="rounded-lg border border-black/10 bg-[#111111] px-2.5 py-1 text-xs text-white shadow-lg dark:border-white/10 dark:bg-white dark:text-black">
                                                                        <p className="font-semibold">{task.reviewer.name}</p>
                                                                        <p className="text-[10px] text-[#787774]">{task.reviewer.position_title ?? 'Reviewer Partner'}</p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                        ) : (
                                                            <span className="text-[#787774] dark:text-zinc-500">—</span>
                                                        )}
                                                    </td>

                                                    {/* Due Date */}
                                                    <td className="whitespace-nowrap px-3 py-3 font-mono text-[11px]">
                                                        {task.due_at ? (
                                                            <span
                                                                className={
                                                                    isOverdue
                                                                        ? 'inline-flex items-center gap-1 font-bold text-rose-600 dark:text-rose-400'
                                                                        : 'text-[#787774] dark:text-zinc-400'
                                                                }
                                                            >
                                                                {isOverdue && <AlertCircle className="size-3" />}
                                                                {formatDate(task.due_at)}
                                                            </span>
                                                        ) : (
                                                            <span className="text-[#787774] dark:text-zinc-500">—</span>
                                                        )}
                                                    </td>

                                                    {/* Priority */}
                                                    <td className="whitespace-nowrap px-3 py-3">
                                                        <StatusBadge value={task.priority} />
                                                    </td>

                                                    {/* Status Selector */}
                                                    <td className="whitespace-nowrap py-3 pl-3 pr-4 text-left">
                                                        <div className="relative inline-block">
                                                            <select
                                                                value={task.status}
                                                                onChange={(e) => changeStatus(task, e.target.value)}
                                                                className="h-7 cursor-pointer appearance-none rounded-md border border-black/[0.08] bg-[#fbfbfa] pl-2 pr-6 text-[11px] font-medium text-[#111111] outline-none transition-colors hover:bg-black/[0.02] focus:border-black/20 focus:bg-white dark:border-white/[0.1] dark:bg-[#121212] dark:text-zinc-200"
                                                            >
                                                                <option value="todo">Belum Mulai</option>
                                                                <option value="in_progress">Dikerjakan</option>
                                                                <option value="waiting">Menunggu</option>
                                                                <option value="review">Review</option>
                                                                <option value="completed">Selesai</option>
                                                                <option value="cancelled">Dibatalkan</option>
                                                            </select>
                                                            <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 size-3 -translate-y-1/2 text-[#787774]" />
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Unified Table Footer with Pagination */}
                        <div className="flex flex-col justify-between gap-3 border-t border-black/[0.04] bg-[#fafafa] px-4 py-2.5 sm:flex-row sm:items-center dark:border-white/[0.06] dark:bg-[#161618]">
                            <span className="text-xs text-[#787774] dark:text-zinc-400">
                                Menampilkan <span className="font-semibold text-[#111111] dark:text-white">{tasks.data.length}</span> dari{' '}
                                <span className="font-semibold text-[#111111] dark:text-white">{tasks.total}</span> tugas
                            </span>

                            <Pagination links={tasks.links} />
                        </div>
                    </div>
                </main>
            </div>

            {/* Modal Dialog: Buat Tugas Baru */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-h-[85vh] overflow-y-auto rounded-2xl border border-black/[0.08] bg-white p-5 shadow-2xl sm:max-w-xl dark:border-white/10 dark:bg-[#1c1c1e]">
                    <DialogHeader className="border-b border-black/[0.04] pb-3 dark:border-white/[0.06]">
                        <div className="flex items-center gap-2.5">
                            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-black/[0.04] text-[#111111] dark:bg-white/[0.06] dark:text-white">
                                <ListTodo className="size-4" />
                            </div>
                            <div>
                                <DialogTitle className="text-sm font-bold tracking-tight text-[#111111] dark:text-white">
                                    Buat Tugas & Instruksi Baru
                                </DialogTitle>
                                <DialogDescription className="text-xs text-[#787774] dark:text-zinc-400">
                                    Tetapkan penugasan kerja advokat, reviewer partner, dan tenggat waktu.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <Form
                        {...taskRoutes.store.form()}
                        className="space-y-3.5 pt-1"
                        resetOnSuccess
                        onSuccess={() => setOpen(false)}
                    >
                        {({ errors, processing }) => (
                            <>
                                <Field
                                    label="Judul Tugas"
                                    name="title"
                                    error={errors.title}
                                    placeholder="Contoh: Analisis Dokumen Kontrak EPC & Klausul Arbitrase"
                                    required
                                />

                                <div className="grid gap-1.5">
                                    <Label htmlFor="matter_id" className="text-xs font-medium text-[#2f3437] dark:text-zinc-200">
                                        Terkait Matter
                                    </Label>
                                    <div className="relative">
                                        <select
                                            id="matter_id"
                                            name="matter_id"
                                            className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-black/[0.08] bg-[#fbfbfa] pl-3 pr-8 text-xs font-medium text-[#111111] outline-none transition-colors hover:bg-black/[0.02] focus:border-black/20 focus:bg-white dark:border-white/[0.1] dark:bg-[#121212] dark:text-zinc-200"
                                        >
                                            <option value="">Tanpa matter (Tugas Umum)</option>
                                            {matters.map((matter) => (
                                                <option key={matter.id} value={matter.id}>
                                                    {matter.matter_number} — {matter.title}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3 -translate-y-1/2 text-[#787774]" />
                                    </div>
                                    <InputError message={errors.matter_id} />
                                </div>

                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div className="grid gap-1.5">
                                        <Label htmlFor="assignee_id" className="text-xs font-medium text-[#2f3437] dark:text-zinc-200">
                                            Ditugaskan ke (Assignee)
                                        </Label>
                                        <div className="relative">
                                            <select
                                                id="assignee_id"
                                                name="assignee_id"
                                                className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-black/[0.08] bg-[#fbfbfa] pl-3 pr-8 text-xs font-medium text-[#111111] outline-none transition-colors hover:bg-black/[0.02] focus:border-black/20 focus:bg-white dark:border-white/[0.1] dark:bg-[#121212] dark:text-zinc-200"
                                            >
                                                <option value="">Belum Ditugaskan</option>
                                                {users.map((user) => (
                                                    <option key={user.id} value={user.id}>
                                                        {user.name} {user.position_title ? `— ${user.position_title}` : ''}
                                                    </option>
                                                ))}
                                            </select>
                                            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3 -translate-y-1/2 text-[#787774]" />
                                        </div>
                                        <InputError message={errors.assignee_id} />
                                    </div>

                                    <div className="grid gap-1.5">
                                        <Label htmlFor="reviewer_id" className="text-xs font-medium text-[#2f3437] dark:text-zinc-200">
                                            Reviewer (Partner / Supervising)
                                        </Label>
                                        <div className="relative">
                                            <select
                                                id="reviewer_id"
                                                name="reviewer_id"
                                                className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-black/[0.08] bg-[#fbfbfa] pl-3 pr-8 text-xs font-medium text-[#111111] outline-none transition-colors hover:bg-black/[0.02] focus:border-black/20 focus:bg-white dark:border-white/[0.1] dark:bg-[#121212] dark:text-zinc-200"
                                            >
                                                <option value="">Tanpa Reviewer</option>
                                                {users.map((user) => (
                                                    <option key={user.id} value={user.id}>
                                                        {user.name} {user.position_title ? `— ${user.position_title}` : ''}
                                                    </option>
                                                ))}
                                            </select>
                                            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3 -translate-y-1/2 text-[#787774]" />
                                        </div>
                                        <InputError message={errors.reviewer_id} />
                                    </div>
                                </div>

                                <div className="grid gap-3 sm:grid-cols-3">
                                    <div className="grid gap-1.5">
                                        <Label htmlFor="priority" className="text-xs font-medium text-[#2f3437] dark:text-zinc-200">
                                            Prioritas
                                        </Label>
                                        <div className="relative">
                                            <select
                                                id="priority"
                                                name="priority"
                                                defaultValue="normal"
                                                className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-black/[0.08] bg-[#fbfbfa] pl-3 pr-8 text-xs font-medium text-[#111111] outline-none transition-colors hover:bg-black/[0.02] focus:border-black/20 focus:bg-white dark:border-white/[0.1] dark:bg-[#121212] dark:text-zinc-200"
                                            >
                                                <option value="low">Rendah</option>
                                                <option value="normal">Normal</option>
                                                <option value="high">Tinggi</option>
                                                <option value="critical">Kritis</option>
                                            </select>
                                            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3 -translate-y-1/2 text-[#787774]" />
                                        </div>
                                    </div>

                                    <div className="grid gap-1.5">
                                        <Label htmlFor="status" className="text-xs font-medium text-[#2f3437] dark:text-zinc-200">
                                            Status Awal
                                        </Label>
                                        <div className="relative">
                                            <select
                                                id="status"
                                                name="status"
                                                defaultValue="todo"
                                                className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-black/[0.08] bg-[#fbfbfa] pl-3 pr-8 text-xs font-medium text-[#111111] outline-none transition-colors hover:bg-black/[0.02] focus:border-black/20 focus:bg-white dark:border-white/[0.1] dark:bg-[#121212] dark:text-zinc-200"
                                            >
                                                <option value="todo">Belum Mulai</option>
                                                <option value="in_progress">Sedang Dikerjakan</option>
                                                <option value="waiting">Menunggu</option>
                                                <option value="review">Review</option>
                                            </select>
                                            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3 -translate-y-1/2 text-[#787774]" />
                                        </div>
                                    </div>

                                    <Field
                                        label="Batas Waktu (Tenggat)"
                                        name="due_at"
                                        type="date"
                                        error={errors.due_at}
                                    />
                                </div>

                                <div className="grid gap-1.5">
                                    <Label htmlFor="description" className="text-xs font-medium text-[#2f3437] dark:text-zinc-200">
                                        Deskripsi & Instruksi Kerja
                                    </Label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        rows={3}
                                        placeholder="Tuliskan petunjuk teknis, rincian deliverable, atau catatan instruksi..."
                                        className="w-full rounded-lg border border-black/[0.08] bg-[#fbfbfa] p-2.5 text-xs leading-relaxed text-[#111111] outline-none transition-colors placeholder:text-[#787774] focus:border-black/20 focus:bg-white dark:border-white/[0.1] dark:bg-[#121212] dark:text-white"
                                    />
                                    <InputError message={errors.description} />
                                </div>

                                <div className="flex items-center justify-end gap-2 border-t border-black/[0.04] pt-3 dark:border-white/[0.06]">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setOpen(false)}
                                        className="h-8 rounded-lg border-black/10 bg-white px-3 text-xs font-medium text-[#111111] hover:bg-black/[0.03] dark:border-white/10 dark:bg-[#1c1c1e] dark:text-zinc-200"
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
                                            'Simpan Tugas'
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
                className="h-8 rounded-lg border-black/[0.08] bg-[#fbfbfa] text-xs text-[#111111] transition-colors focus:border-black/20 focus:bg-white dark:border-white/[0.1] dark:bg-[#121212] dark:text-white"
            />
            <InputError message={error} />
        </div>
    );
}

TasksIndex.layout = {
    breadcrumbs: [{ title: 'Tugas', href: taskRoutes.index() }],
};
