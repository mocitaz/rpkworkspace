import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowLeft,
    Briefcase,
    Building2,
    Calendar,
    CalendarClock,
    Check,
    CheckCircle2,
    ChevronRight,
    Clock,
    Copy,
    DollarSign,
    Edit3,
    Eye,
    FileCheck,
    FileText,
    Gavel,
    History,
    Layers,
    ListChecks,
    MessageSquare,
    Play,
    Plus,
    RotateCcw,
    Scale,
    Send,
    Shield,
    Sparkles,
    Trash2,
    TrendingUp,
    User,
    UserCheck,
    Users,
    XCircle,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import {
    DiscussionBox,
    type DiscussionComment,
    type DiscussionStaff,
} from '@/components/comments/discussion-box';
import { ConfirmDialog } from '@/components/confirm-dialog';
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
import { useInitials } from '@/hooks/use-initials';
import { formatDate } from '@/lib/format';
import * as clientRoutes from '@/routes/clients';
import * as documentRoutes from '@/routes/documents';
import * as matterRoutes from '@/routes/matters';
import * as taskRoutes from '@/routes/tasks';

type TaskDetail = {
    id: string;
    task_number: string;
    matter_id?: string | null;
    title: string;
    category?: string | null;
    stage?: string | null;
    description?: string | null;
    assignee_id?: number | null;
    reporter_id: number;
    reviewer_id?: number | null;
    status: 'todo' | 'in_progress' | 'waiting' | 'review' | 'completed' | 'cancelled';
    priority: 'low' | 'normal' | 'high' | 'critical';
    start_date?: string | null;
    due_at?: string | null;
    completed_at?: string | null;
    is_billable: boolean;
    estimated_hours?: number | null;
    actual_hours?: number | null;
    checklists?: Array<{
        id: string;
        title: string;
        is_completed: boolean;
        completed_at?: string | null;
    }> | null;
    completion_notes?: string | null;
    created_at: string;
    updated_at: string;
    matter?: {
        id: string;
        matter_number: string;
        title: string;
        status: string;
        client_id?: string;
        client?: {
            id: string;
            client_number: string;
            name: string;
            type: string;
        };
        practiceArea?: {
            id: string;
            name: string;
        };
    } | null;
    assignee?: DiscussionStaff | null;
    reporter?: DiscussionStaff | null;
    reviewer?: DiscussionStaff | null;
    comments?: DiscussionComment[];
};

type RelatedDocument = {
    id: string;
    document_number: string;
    title: string;
    category: string;
    status: string;
    created_at: string;
};

type AuditEntry = {
    id: string;
    event: string;
    actor?: {
        id: number;
        name: string;
        position_title?: string;
        avatar_path?: string | null;
    } | null;
    metadata?: Record<string, unknown> | null;
    created_at: string;
};

export default function TaskShow({
    task,
    documents = [],
    auditLogs = [],
    staffList = [],
    categories = [],
    stages = [],
    can,
}: {
    task: TaskDetail;
    documents?: RelatedDocument[];
    auditLogs?: AuditEntry[];
    staffList?: DiscussionStaff[];
    categories: Array<{ id: string; name: string }>;
    stages: Array<{ id: string; name: string }>;
    can: {
        update: boolean;
        delete: boolean;
    };
}) {
    const initials = useInitials();
    const { auth } = usePage().props as { auth: { user: { id: number; name: string } } };
    const [activeTab, setActiveTab] = useState<'summary' | 'documents' | 'discussion' | 'history'>('summary');
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    // Checklist progress calculation
    const checklists = task.checklists || [];
    const completedCount = checklists.filter((c) => c.is_completed).length;
    const totalChecklists = checklists.length;
    const progressPercent = totalChecklists > 0 ? Math.round((completedCount / totalChecklists) * 100) : 0;

    // Overdue calculation
    const isOverdue = useMemo(() => {
        if (!task.due_at || task.status === 'completed' || task.status === 'cancelled') return false;
        return new Date(task.due_at).getTime() < Date.now();
    }, [task.due_at, task.status]);

    const copyTaskNumber = () => {
        navigator.clipboard.writeText(task.task_number || task.id);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleToggleChecklist = (checklistId: string) => {
        router.patch(
            `/tasks/${task.id}/checklists/${checklistId}/toggle`,
            {},
            { preserveScroll: true }
        );
    };

    const handleStatusChange = (newStatus: string) => {
        router.put(
            taskRoutes.update?.url ? taskRoutes.update.url(task.id) : `/tasks/${task.id}`,
            {
                title: task.title,
                status: newStatus,
                priority: task.priority,
                assignee_id: task.assignee_id,
                reviewer_id: task.reviewer_id,
            },
            { preserveScroll: true }
        );
    };

    // Edit form
    const editForm = useForm({
        title: task.title || '',
        category: task.category || 'general',
        stage: task.stage || 'general',
        description: task.description || '',
        assignee_id: task.assignee_id || '',
        reviewer_id: task.reviewer_id || '',
        priority: task.priority || 'normal',
        status: task.status || 'todo',
        start_date: task.start_date || '',
        due_at: task.due_at ? task.due_at.substring(0, 16) : '',
        is_billable: task.is_billable ?? false,
        estimated_hours: task.estimated_hours ?? '',
        actual_hours: task.actual_hours ?? '',
        completion_notes: task.completion_notes || '',
    });

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        editForm.put(taskRoutes.update?.url ? taskRoutes.update.url(task.id) : `/tasks/${task.id}`, {
            onSuccess: () => setIsEditOpen(false),
            preserveScroll: true,
        });
    };

    // Completion modal form
    const completeForm = useForm({
        title: task.title,
        status: 'completed',
        priority: task.priority,
        actual_hours: task.actual_hours ?? task.estimated_hours ?? '',
        completion_notes: task.completion_notes || '',
    });

    const handleCompleteSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        completeForm.put(taskRoutes.update?.url ? taskRoutes.update.url(task.id) : `/tasks/${task.id}`, {
            onSuccess: () => setIsCompleteModalOpen(false),
            preserveScroll: true,
        });
    };

    const categoryName = categories.find((c) => c.id === task.category)?.name || task.category || 'Umum';
    const stageName = stages.find((s) => s.id === task.stage)?.name || task.stage || 'Umum';

    return (
        <>
            <Head title={`${task.task_number || 'Tugas'}: ${task.title}`} />

            <div className="min-h-screen bg-[#fafafc] pb-24 dark:bg-[#0c0d10]">
                <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
                    {/* Top Breadcrumb Navigation */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/70 pb-4 dark:border-white/[0.06]">
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-400">
                            <Link
                                href={taskRoutes.index?.url ? taskRoutes.index.url() : '/tasks'}
                                className="flex items-center gap-1 font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            >
                                <ArrowLeft className="size-3.5" />
                                Daftar Tugas
                            </Link>
                            <ChevronRight className="size-3 text-slate-300 dark:text-zinc-600" />
                            {task.matter && (
                                <>
                                    <Link
                                        href={matterRoutes.show?.url ? matterRoutes.show.url(task.matter.id) : `/matters/${task.matter.id}`}
                                        className="font-mono text-slate-700 hover:text-blue-600 dark:text-zinc-300 dark:hover:text-blue-400 transition-colors"
                                    >
                                        {task.matter.matter_number}
                                    </Link>
                                    <ChevronRight className="size-3 text-slate-300 dark:text-zinc-600" />
                                </>
                            )}
                            <span className="font-mono font-bold text-slate-900 dark:text-white">
                                {task.task_number}
                            </span>
                        </div>

                        {/* Top Quick Actions */}
                        <div className="flex items-center gap-2">
                            {can.update && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setIsEditOpen(true)}
                                    className="h-8 text-xs font-semibold gap-1.5 border-slate-200/80 bg-white hover:bg-slate-50 dark:border-white/10 dark:bg-[#16181d] dark:text-zinc-300 shadow-2xs"
                                >
                                    <Edit3 className="size-3.5 text-slate-500" />
                                    Edit Tugas
                                </Button>
                            )}
                            {can.delete && (
                                <ConfirmDialog
                                    title="Hapus Tugas Ini?"
                                    description={`Tugas ${task.task_number} (${task.title}) akan dihapus secara permanen beserta riwayat checklist dan komentarnya.`}
                                    confirmText="Ya, Hapus Tugas"
                                    variant="destructive"
                                    onConfirm={() => router.delete(taskRoutes.destroy?.url ? taskRoutes.destroy.url(task.id) : `/tasks/${task.id}`)}
                                >
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 border-rose-200/60 dark:border-rose-900/30 dark:bg-rose-950/20 dark:text-rose-400 dark:hover:bg-rose-950/40"
                                    >
                                        <Trash2 className="size-3.5 mr-1" />
                                        Hapus
                                    </Button>
                                </ConfirmDialog>
                            )}
                        </div>
                    </div>

                    {/* Header Banner */}
                    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-white/[0.07] dark:bg-[#13151a]">
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                            <div className="space-y-3 max-w-3xl">
                                <div className="flex flex-wrap items-center gap-2.5">
                                    <button
                                        type="button"
                                        onClick={copyTaskNumber}
                                        title="Salin Nomor Tugas"
                                        className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 font-mono text-xs font-bold text-slate-800 hover:bg-slate-200 dark:bg-white/10 dark:text-zinc-200 transition-colors"
                                    >
                                        <Sparkles className="size-3 text-amber-500" />
                                        {task.task_number}
                                        {isCopied ? (
                                            <Check className="size-3 text-emerald-600" />
                                        ) : (
                                            <Copy className="size-3 text-slate-400" />
                                        )}
                                    </button>

                                    <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                                        {categoryName}
                                    </span>

                                    {task.stage && (
                                        <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300">
                                            {stageName}
                                        </span>
                                    )}

                                    <StatusBadge status={task.status} />

                                    <span
                                        className={`rounded-md px-2 py-0.5 text-xs font-bold ${
                                            task.priority === 'critical'
                                                ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                                                : task.priority === 'high'
                                                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                                                  : task.priority === 'normal'
                                                    ? 'bg-blue-50 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300'
                                                    : 'bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300'
                                        }`}
                                    >
                                        Prioritas: {task.priority.toUpperCase()}
                                    </span>

                                    {task.is_billable && (
                                        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                                            <DollarSign className="size-3" />
                                            Billable
                                        </span>
                                    )}

                                    {isOverdue && (
                                        <span className="inline-flex items-center gap-1 rounded-md bg-rose-500 px-2 py-0.5 text-xs font-bold text-white shadow-xs animate-pulse">
                                            <AlertCircle className="size-3" />
                                            Terlewat (Overdue)
                                        </span>
                                    )}
                                </div>

                                <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl lg:text-3xl dark:text-white leading-tight">
                                    {task.title}
                                </h1>

                                {task.matter && (
                                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-zinc-400">
                                        <Briefcase className="size-3.5 text-blue-600 dark:text-blue-400" />
                                        <span>Perkara Terkait:</span>
                                        <Link
                                            href={matterRoutes.show.url(task.matter.id)}
                                            className="font-bold text-blue-600 hover:underline dark:text-blue-400"
                                        >
                                            {task.matter.title} ({task.matter.matter_number})
                                        </Link>
                                        {task.matter.client && (
                                            <>
                                                <span className="text-slate-300 dark:text-zinc-700">•</span>
                                                <Building2 className="size-3.5 text-slate-400" />
                                                <Link
                                                    href={clientRoutes.show.url(
                                                        task.matter.client.id,
                                                    )}
                                                    className="font-medium text-slate-700 hover:text-blue-600 dark:text-zinc-300 dark:hover:text-blue-400"
                                                >
                                                    {task.matter.client.name}
                                                </Link>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Dynamic Status Workflow Action Buttons */}
                            {can.update && (
                                <div className="flex flex-wrap items-center gap-2 shrink-0 pt-2 lg:pt-0">
                                    {task.status === 'todo' && (
                                        <Button
                                            onClick={() => handleStatusChange('in_progress')}
                                            className="h-9 bg-blue-600 text-xs font-semibold text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 shadow-sm gap-1.5"
                                        >
                                            <Play className="size-3.5" />
                                            Mulai Kerjakan
                                        </Button>
                                    )}

                                    {task.status === 'in_progress' && (
                                        <Button
                                            onClick={() => handleStatusChange('review')}
                                            className="h-9 bg-purple-600 text-xs font-semibold text-white hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-500 shadow-sm gap-1.5"
                                        >
                                            <Send className="size-3.5" />
                                            Minta Review Partner
                                        </Button>
                                    )}

                                    {task.status !== 'completed' && task.status !== 'cancelled' && (
                                        <Button
                                            onClick={() => setIsCompleteModalOpen(true)}
                                            className="h-9 bg-emerald-600 text-xs font-semibold text-white hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 shadow-sm gap-1.5"
                                        >
                                            <CheckCircle2 className="size-3.5" />
                                            Tandai Selesai
                                        </Button>
                                    )}

                                    {task.status === 'completed' && (
                                        <Button
                                            onClick={() => handleStatusChange('in_progress')}
                                            variant="outline"
                                            className="h-9 text-xs font-semibold gap-1.5 border-slate-200 bg-white hover:bg-slate-50 dark:border-white/10 dark:bg-[#16181d] dark:text-zinc-300 shadow-2xs"
                                        >
                                            <RotateCcw className="size-3.5" />
                                            Buka Kembali Tugas
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Layout Grid: Content Tabs (Left) & Sidebar Metadata (Right) */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Left 2-Columns: Tabbed Area */}
                        <div className="space-y-6 lg:col-span-2">
                            {/* Tab Switcher */}
                            <div className="flex border-b border-slate-200/80 bg-white px-2 rounded-xl shadow-2xs dark:border-white/[0.06] dark:bg-[#13151a]">
                                {[
                                    { id: 'summary', label: 'Ringkasan & Checklist', icon: ListChecks, badge: totalChecklists > 0 ? `${completedCount}/${totalChecklists}` : null },
                                    { id: 'documents', label: 'Dokumen Terkait', icon: FileText, badge: documents.length > 0 ? documents.length : null },
                                    { id: 'discussion', label: 'Diskusi Tim', icon: MessageSquare, badge: task.comments?.length || null },
                                    { id: 'history', label: 'Riwayat Audit', icon: History },
                                ].map((t) => {
                                    const Icon = t.icon;
                                    const isActive = activeTab === t.id;
                                    return (
                                        <button
                                            key={t.id}
                                            type="button"
                                            onClick={() => setActiveTab(t.id as any)}
                                            className={`flex items-center gap-2 border-b-2 px-4 py-3.5 text-xs font-bold transition-colors ${
                                                isActive
                                                    ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-400'
                                                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white'
                                            }`}
                                        >
                                            <Icon className="size-3.5" />
                                            <span>{t.label}</span>
                                            {t.badge !== null && (
                                                <span
                                                    className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                                                        isActive
                                                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                                                            : 'bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-zinc-400'
                                                    }`}
                                                >
                                                    {t.badge}
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* TAB 1: RINGKASAN & CHECKLIST */}
                            {activeTab === 'summary' && (
                                <div className="space-y-6">
                                    {/* 1.1 Deskripsi Tugas */}
                                    <section className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-white/[0.07] dark:bg-[#13151a] space-y-3">
                                        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-white/[0.06]">
                                            <FileText className="size-4 text-purple-600 dark:text-purple-400" />
                                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                                Instruksi & Panduan Pengerjaan
                                            </h3>
                                        </div>

                                        {task.description ? (
                                            <div className="prose prose-sm dark:prose-invert max-w-none text-xs leading-relaxed text-slate-700 dark:text-zinc-300 whitespace-pre-wrap">
                                                {task.description}
                                            </div>
                                        ) : (
                                            <p className="text-xs italic text-slate-400 dark:text-zinc-500">
                                                Tidak ada petunjuk tertulis khusus. Silakan koordinasikan melalui tab Diskusi Tim.
                                            </p>
                                        )}
                                    </section>

                                    {/* 1.2 Interactive Checklist Sub-Tasks */}
                                    <section className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-white/[0.07] dark:bg-[#13151a] space-y-4">
                                        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-white/[0.06]">
                                            <div className="flex items-center gap-2">
                                                <ListChecks className="size-4 text-amber-600 dark:text-amber-400" />
                                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                                    Checklist Butir Pekerjaan ({completedCount}/{totalChecklists})
                                                </h3>
                                            </div>
                                            {totalChecklists > 0 && (
                                                <span className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                                                    {progressPercent}% Selesai
                                                </span>
                                            )}
                                        </div>

                                        {totalChecklists > 0 && (
                                            <div className="space-y-1.5">
                                                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                                                    <div
                                                        className={`h-full transition-all duration-300 ${
                                                            progressPercent === 100
                                                                ? 'bg-emerald-500'
                                                                : 'bg-blue-600'
                                                        }`}
                                                        style={{ width: `${progressPercent}%` }}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        <div className="space-y-2">
                                            {checklists.map((item, idx) => (
                                                <div
                                                    key={item.id || idx}
                                                    onClick={() => can.update && handleToggleChecklist(item.id)}
                                                    className={`flex items-start gap-3 rounded-lg border p-3 transition-all ${
                                                        item.is_completed
                                                            ? 'border-emerald-500/20 bg-emerald-50/40 dark:border-emerald-500/30 dark:bg-emerald-950/20'
                                                            : 'border-slate-200/70 bg-white hover:bg-slate-50/80 dark:border-white/[0.06] dark:bg-[#181a20] dark:hover:bg-[#1c1f26]'
                                                    } ${can.update ? 'cursor-pointer' : ''}`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={item.is_completed}
                                                        onChange={() => {}} // Handled by parent div
                                                        disabled={!can.update}
                                                        className="mt-0.5 size-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 dark:border-white/20 dark:bg-zinc-800"
                                                    />
                                                    <div className="flex-1 space-y-0.5">
                                                        <p
                                                            className={`text-xs font-medium ${
                                                                item.is_completed
                                                                    ? 'line-through text-slate-500 dark:text-zinc-500'
                                                                    : 'text-slate-800 dark:text-zinc-200'
                                                            }`}
                                                        >
                                                            {item.title}
                                                        </p>
                                                        {item.completed_at && (
                                                            <p className="text-[10px] text-emerald-600 dark:text-emerald-400">
                                                                Selesai: {formatDate(item.completed_at)}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}

                                            {totalChecklists === 0 && (
                                                <div className="rounded-lg border border-dashed border-slate-200 p-6 text-center dark:border-white/10">
                                                    <ListChecks className="mx-auto size-6 text-slate-400 dark:text-zinc-600" />
                                                    <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">
                                                        Belum ada checklist butir pekerjaan. Edit tugas untuk menambahkan sub-tasks.
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </section>

                                    {/* 1.3 Catatan Hasil Pengerjaan / Completion Notes */}
                                    {task.completion_notes && (
                                        <section className="rounded-xl border border-emerald-500/20 bg-emerald-50/50 p-5 shadow-2xs dark:border-emerald-500/30 dark:bg-emerald-950/20 space-y-2">
                                            <div className="flex items-center gap-2 border-b border-emerald-500/10 pb-2.5">
                                                <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
                                                <h3 className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                                                    Catatan Hasil / Resume Penyelesaian Tugas
                                                </h3>
                                            </div>
                                            <p className="text-xs leading-relaxed text-emerald-950 dark:text-emerald-100 whitespace-pre-wrap">
                                                {task.completion_notes}
                                            </p>
                                        </section>
                                    )}
                                </div>
                            )}

                            {/* TAB 2: DOKUMEN TERKAIT */}
                            {activeTab === 'documents' && (
                                <section className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-white/[0.07] dark:bg-[#13151a] space-y-4">
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-white/[0.06]">
                                        <div className="flex items-center gap-2">
                                            <FileText className="size-4 text-blue-600 dark:text-blue-400" />
                                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                                Berkas Kerja & Dokumen Perkara
                                            </h3>
                                        </div>
                                        {task.matter_id && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-7 text-xs"
                                                asChild
                                            >
                                                <Link href={documentRoutes.index.url({ query: task.matter_id ? { matter_id: task.matter_id } : undefined })}>
                                                    Lihat Semua Dokumen
                                                </Link>
                                            </Button>
                                        )}
                                    </div>

                                    {documents.length > 0 ? (
                                        <div className="divide-y divide-slate-100 dark:divide-white/[0.05]">
                                            {documents.map((doc) => (
                                                <div
                                                    key={doc.id}
                                                    className="flex items-center justify-between py-3 hover:bg-slate-50/50 dark:hover:bg-white/[0.02] px-2 rounded-lg transition-colors"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex size-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                                                            <FileText className="size-4" />
                                                        </div>
                                                        <div>
                                                            <Link
                                                                href={documentRoutes.show.url(doc.id)}
                                                                className="text-xs font-bold text-slate-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
                                                            >
                                                                {doc.title}
                                                            </Link>
                                                            <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-zinc-400">
                                                                <span className="font-mono">{doc.document_number}</span>
                                                                <span>•</span>
                                                                <span>{doc.category}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-7 text-xs"
                                                        asChild
                                                    >
                                                        <Link href={documentRoutes.show.url(doc.id)}>
                                                            <Eye className="size-3.5 mr-1" />
                                                            Buka
                                                        </Link>
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="rounded-lg border border-dashed border-slate-200 p-8 text-center dark:border-white/10">
                                            <FileText className="mx-auto size-7 text-slate-400 dark:text-zinc-600" />
                                            <p className="mt-2 text-xs font-semibold text-slate-700 dark:text-zinc-300">
                                                Belum Ada Dokumen Terlampir
                                            </p>
                                            <p className="text-[11px] text-slate-500 dark:text-zinc-500">
                                                Dokumen yang diunggah ke perkara terkait akan otomatis muncul di sini.
                                            </p>
                                        </div>
                                    )}
                                </section>
                            )}

                            {/* TAB 3: DISKUSI TIM */}
                            {activeTab === 'discussion' && (
                                <section className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-white/[0.07] dark:bg-[#13151a]">
                                    <DiscussionBox
                                        commentableType="task"
                                        commentableId={task.id}
                                        comments={task.comments || []}
                                        staffList={staffList}
                                        currentUserId={auth.user.id}
                                        headerTitle={`Diskusi Internal Tugas: ${task.task_number}`}
                                    />
                                </section>
                            )}

                            {/* TAB 4: RIWAYAT AUDIT */}
                            {activeTab === 'history' && (
                                <section className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-white/[0.07] dark:bg-[#13151a] space-y-4">
                                    <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-white/[0.06]">
                                        <History className="size-4 text-slate-600 dark:text-zinc-400" />
                                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                            Jejak Audit & Log Aktivitas Tugas
                                        </h3>
                                    </div>

                                    {auditLogs.length > 0 ? (
                                        <div className="relative border-l border-slate-200 ml-3.5 space-y-4 dark:border-white/10">
                                            {auditLogs.map((log) => (
                                                <div key={log.id} className="relative pl-6">
                                                    <div className="absolute -left-1.5 top-1.5 size-3 rounded-full border-2 border-white bg-blue-600 dark:border-[#13151a]" />
                                                    <div className="flex flex-wrap items-center justify-between gap-1">
                                                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                                                            {log.actor?.name || 'Sistem'}
                                                        </span>
                                                        <span className="text-[10px] text-slate-500 dark:text-zinc-400">
                                                            {formatDate(log.created_at)}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-slate-600 dark:text-zinc-300 font-mono mt-0.5">
                                                        {log.event}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-xs italic text-slate-400 dark:text-zinc-500">
                                            Belum ada log aktivitas tambahan yang tercatat.
                                        </p>
                                    )}
                                </section>
                            )}
                        </div>

                        {/* Right 1-Column: Sidebar Metadata */}
                        <div className="space-y-6">
                            {/* Card 1: Penugasan & Tim */}
                            <section className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-white/[0.07] dark:bg-[#13151a] space-y-4">
                                <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-white/[0.06]">
                                    <Users className="size-4 text-indigo-600 dark:text-indigo-400" />
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                                        Tim & Penanggung Jawab
                                    </h3>
                                </div>

                                <div className="space-y-3.5">
                                    {/* Pelaksana */}
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                                            Pelaksana Utama (Assignee)
                                        </span>
                                        {task.assignee ? (
                                            <div className="flex items-center gap-2.5 pt-0.5">
                                                <Avatar className="size-7 ring-1 ring-slate-200 dark:ring-white/10">
                                                    {task.assignee.avatar_path && (
                                                        <AvatarImage src={`/storage/${task.assignee.avatar_path}`} />
                                                    )}
                                                    <AvatarFallback className="bg-indigo-600 text-[10px] font-bold text-white">
                                                        {initials(task.assignee.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                                                        {task.assignee.name}
                                                    </p>
                                                    <p className="text-[10px] text-slate-500 dark:text-zinc-400">
                                                        {task.assignee.position_title || 'Staf Hukum'}
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-xs italic text-slate-400 dark:text-zinc-500">
                                                Belum didelegasikan
                                            </p>
                                        )}
                                    </div>

                                    {/* Reviewer */}
                                    {task.reviewer && (
                                        <div className="space-y-1 border-t border-slate-100 pt-3 dark:border-white/[0.05]">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                                                Pemeriksa Hasil (Reviewer)
                                            </span>
                                            <div className="flex items-center gap-2.5 pt-0.5">
                                                <Avatar className="size-7 ring-1 ring-slate-200 dark:ring-white/10">
                                                    {task.reviewer.avatar_path && (
                                                        <AvatarImage src={`/storage/${task.reviewer.avatar_path}`} />
                                                    )}
                                                    <AvatarFallback className="bg-purple-600 text-[10px] font-bold text-white">
                                                        {initials(task.reviewer.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                                                        {task.reviewer.name}
                                                    </p>
                                                    <p className="text-[10px] text-slate-500 dark:text-zinc-400">
                                                        {task.reviewer.position_title || 'Partner'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Reporter */}
                                    {task.reporter && (
                                        <div className="space-y-1 border-t border-slate-100 pt-3 dark:border-white/[0.05]">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                                                Pemberi Tugas (Reporter)
                                            </span>
                                            <div className="flex items-center gap-2.5 pt-0.5">
                                                <Avatar className="size-6 ring-1 ring-slate-200 dark:ring-white/10">
                                                    {task.reporter.avatar_path && (
                                                        <AvatarImage src={`/storage/${task.reporter.avatar_path}`} />
                                                    )}
                                                    <AvatarFallback className="bg-slate-700 text-[9px] font-bold text-white">
                                                        {initials(task.reporter.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="text-xs font-semibold text-slate-800 dark:text-zinc-200">
                                                        {task.reporter.name}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* Card 2: Jadwal & Waktu */}
                            <section className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-white/[0.07] dark:bg-[#13151a] space-y-4">
                                <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-white/[0.06]">
                                    <Clock className="size-4 text-emerald-600 dark:text-emerald-400" />
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                                        Jadwal & Waktu
                                    </h3>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-slate-500 dark:text-zinc-400">Tanggal Mulai:</span>
                                        <span className="font-semibold text-slate-900 dark:text-white">
                                            {task.start_date ? formatDate(task.start_date) : '-'}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-slate-500 dark:text-zinc-400">Tenggat Waktu:</span>
                                        <span className={`font-semibold ${isOverdue ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-slate-900 dark:text-white'}`}>
                                            {task.due_at ? formatDate(task.due_at) : 'Tidak Terbatas'}
                                        </span>
                                    </div>

                                    {task.completed_at && (
                                        <div className="flex items-center justify-between text-xs border-t border-slate-100 pt-2 dark:border-white/[0.05]">
                                            <span className="text-slate-500 dark:text-zinc-400">Diselesaikan Pada:</span>
                                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                                {formatDate(task.completed_at)}
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between text-xs border-t border-slate-100 pt-2 dark:border-white/[0.05]">
                                        <span className="text-slate-500 dark:text-zinc-400">Dibuat Pada:</span>
                                        <span className="text-slate-700 dark:text-zinc-300">
                                            {formatDate(task.created_at)}
                                        </span>
                                    </div>
                                </div>
                            </section>

                            {/* Card 3: Finansial & Jam Kerja */}
                            <section className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-white/[0.07] dark:bg-[#13151a] space-y-4">
                                <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-white/[0.06]">
                                    <DollarSign className="size-4 text-blue-600 dark:text-blue-400" />
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                                        Finansial & Jam Kerja
                                    </h3>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-slate-500 dark:text-zinc-400">Status Tagihan:</span>
                                        <span className={`font-bold ${task.is_billable ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-zinc-400'}`}>
                                            {task.is_billable ? 'Billable to Client' : 'Non-Billable (Internal)'}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-slate-500 dark:text-zinc-400">Estimasi Jam:</span>
                                        <span className="font-semibold text-slate-900 dark:text-white">
                                            {task.estimated_hours ? `${task.estimated_hours} Jam` : '-'}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-slate-500 dark:text-zinc-400">Realisasi Jam:</span>
                                        <span className="font-semibold text-slate-900 dark:text-white">
                                            {task.actual_hours ? `${task.actual_hours} Jam` : '-'}
                                        </span>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </main>
            </div>

            {/* EDIT TASK DIALOG */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-base font-bold">
                            Edit Tugas: {task.task_number}
                        </DialogTitle>
                        <DialogDescription className="text-xs">
                            Perbarui detail instruksi, penanggung jawab, jadwal, dan estimasi waktu.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleEditSubmit} className="space-y-4 pt-2">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold">Judul Tugas</Label>
                            <Input
                                value={editForm.data.title}
                                onChange={(e) => editForm.setData('title', e.target.value)}
                                className="h-9 text-xs"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold">Kategori Tugas</Label>
                                <select
                                    value={editForm.data.category}
                                    onChange={(e) => editForm.setData('category', e.target.value)}
                                    className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs dark:border-white/10 dark:bg-[#191c22]"
                                >
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold">Tahapan Perkara</Label>
                                <select
                                    value={editForm.data.stage}
                                    onChange={(e) => editForm.setData('stage', e.target.value)}
                                    className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs dark:border-white/10 dark:bg-[#191c22]"
                                >
                                    {stages.map((s) => (
                                        <option key={s.id} value={s.id}>
                                            {s.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold">Pelaksana (Assignee)</Label>
                                <select
                                    value={editForm.data.assignee_id}
                                    onChange={(e) => editForm.setData('assignee_id', e.target.value)}
                                    className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs dark:border-white/10 dark:bg-[#191c22]"
                                >
                                    <option value="">-- Pilih Pelaksana --</option>
                                    {staffList.map((u) => (
                                        <option key={u.id} value={u.id}>
                                            {u.name} ({u.position_title || 'Staf'})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold">Pemeriksa (Reviewer)</Label>
                                <select
                                    value={editForm.data.reviewer_id}
                                    onChange={(e) => editForm.setData('reviewer_id', e.target.value)}
                                    className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs dark:border-white/10 dark:bg-[#191c22]"
                                >
                                    <option value="">-- Tanpa Reviewer --</option>
                                    {staffList.map((u) => (
                                        <option key={u.id} value={u.id}>
                                            {u.name} ({u.position_title || 'Partner'})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold">Status</Label>
                                <select
                                    value={editForm.data.status}
                                    onChange={(e) => editForm.setData('status', e.target.value as any)}
                                    className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs dark:border-white/10 dark:bg-[#191c22]"
                                >
                                    <option value="todo">Belum Mulai (Todo)</option>
                                    <option value="in_progress">Sedang Dikerjakan</option>
                                    <option value="waiting">Menunggu Respon</option>
                                    <option value="review">Menunggu Review</option>
                                    <option value="completed">Selesai (Completed)</option>
                                    <option value="cancelled">Dibatalkan</option>
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold">Prioritas</Label>
                                <select
                                    value={editForm.data.priority}
                                    onChange={(e) => editForm.setData('priority', e.target.value as any)}
                                    className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs dark:border-white/10 dark:bg-[#191c22]"
                                >
                                    <option value="low">Rendah (Low)</option>
                                    <option value="normal">Normal</option>
                                    <option value="high">Tinggi (High)</option>
                                    <option value="critical">Mendesak (Critical)</option>
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold">Tanggal Mulai</Label>
                                <Input
                                    type="date"
                                    value={editForm.data.start_date}
                                    onChange={(e) => editForm.setData('start_date', e.target.value)}
                                    className="h-9 text-xs"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold">Tenggat Waktu</Label>
                                <Input
                                    type="datetime-local"
                                    value={editForm.data.due_at}
                                    onChange={(e) => editForm.setData('due_at', e.target.value)}
                                    className="h-9 text-xs"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold">Estimasi Jam</Label>
                                <Input
                                    type="number"
                                    step="0.25"
                                    value={editForm.data.estimated_hours}
                                    onChange={(e) => editForm.setData('estimated_hours', e.target.value)}
                                    className="h-9 text-xs"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold">Realisasi Jam</Label>
                                <Input
                                    type="number"
                                    step="0.25"
                                    value={editForm.data.actual_hours}
                                    onChange={(e) => editForm.setData('actual_hours', e.target.value)}
                                    className="h-9 text-xs"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold">Instruksi / Deskripsi</Label>
                            <textarea
                                rows={4}
                                value={editForm.data.description}
                                onChange={(e) => editForm.setData('description', e.target.value)}
                                className="w-full rounded-lg border border-slate-200 bg-white p-3 text-xs dark:border-white/10 dark:bg-[#191c22]"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold">Catatan Penyelesaian</Label>
                            <textarea
                                rows={2}
                                value={editForm.data.completion_notes}
                                onChange={(e) => editForm.setData('completion_notes', e.target.value)}
                                placeholder="Resume hasil pekerjaan..."
                                className="w-full rounded-lg border border-slate-200 bg-white p-3 text-xs dark:border-white/10 dark:bg-[#191c22]"
                            />
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-white/10">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setIsEditOpen(false)}
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                size="sm"
                                disabled={editForm.processing}
                                className="bg-blue-600 text-white hover:bg-blue-700"
                            >
                                {editForm.processing ? <Spinner className="size-3.5 mr-1" /> : null}
                                Simpan Perubahan
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* COMPLETE TASK MODAL */}
            <Dialog open={isCompleteModalOpen} onOpenChange={setIsCompleteModalOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-base font-bold flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                            <CheckCircle2 className="size-5" />
                            Selesaikan Tugas: {task.task_number}
                        </DialogTitle>
                        <DialogDescription className="text-xs">
                            Masukkan realisasi jam kerja dan catatan resume hasil penyelesaian tugas ini.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleCompleteSubmit} className="space-y-3.5 pt-2">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold">Realisasi Jam Kerja (Jam)</Label>
                            <Input
                                type="number"
                                step="0.25"
                                placeholder="Contoh: 3.5"
                                value={completeForm.data.actual_hours}
                                onChange={(e) => completeForm.setData('actual_hours', e.target.value)}
                                className="h-9 text-xs"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold">Catatan / Resume Hasil Penyelesaian</Label>
                            <textarea
                                rows={3}
                                placeholder="Contoh: Draf gugatan telah diselesaikan dan dikirim ke klien untuk ditandatangani..."
                                value={completeForm.data.completion_notes}
                                onChange={(e) => completeForm.setData('completion_notes', e.target.value)}
                                className="w-full rounded-lg border border-slate-200 bg-white p-3 text-xs dark:border-white/10 dark:bg-[#191c22]"
                            />
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-white/10">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setIsCompleteModalOpen(false)}
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                size="sm"
                                disabled={completeForm.processing}
                                className="bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-600"
                            >
                                {completeForm.processing ? <Spinner className="size-3.5 mr-1" /> : null}
                                Konfirmasi Selesai
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
