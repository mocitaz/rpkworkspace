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
    Download,
    Eye,
    FileCheck,
    FileText,
    FolderKanban,
    Gavel,
    History,
    Layers,
    ListChecks,
    MessageSquare,
    Pencil,
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
import {
    DocumentPreviewModal,
    type PreviewableDocument,
} from '@/components/documents/document-preview-modal';
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
            display_name?: string;
            legal_name?: string;
            name?: string;
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
    latest_version?: {
        version_number: number;
        file_size: number;
        mime_type?: string;
    } | null;
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
    const [activeTab, setActiveTab] = useState<'summary' | 'instructions' | 'documents' | 'discussion' | 'history'>('summary');
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [previewDoc, setPreviewDoc] = useState<PreviewableDocument | null>(null);

    // Checklist progress calculation
    const checklists = task.checklists || [];
    const completedCount = checklists.filter((c) => c.is_completed).length;
    const totalChecklists = checklists.length;
    const progressPercent = totalChecklists > 0 ? Math.round((completedCount / totalChecklists) * 100) : (task.status === 'completed' ? 100 : 0);

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
    const clientName = task.matter?.client?.display_name || task.matter?.client?.legal_name || task.matter?.client?.name || 'Klien';

    const tabsList = [
        { id: 'summary', label: 'Ringkasan & Checklist', icon: ListChecks, badge: totalChecklists > 0 ? `${completedCount}/${totalChecklists}` : null },
        { id: 'instructions', label: 'Instruksi Kerja', icon: FileText, badge: null },
        { id: 'documents', label: 'Dokumen Terkait', icon: FolderKanban, badge: documents.length > 0 ? documents.length : null },
        { id: 'discussion', label: 'Diskusi Tim', icon: MessageSquare, badge: task.comments?.length || null },
        { id: 'history', label: 'Riwayat Audit', icon: History, badge: auditLogs.length > 0 ? auditLogs.length : null },
    ] as const;

    return (
        <>
            <Head title={`${task.task_number || 'Tugas'}: ${task.title}`} />

            <div className="min-h-screen bg-[#fafafc] pb-24 dark:bg-[#0c0d10]">
                <main className="mx-auto max-w-7xl space-y-4 px-4 py-4 sm:px-6 lg:px-8">
                    {/* 1. Header Navigation & Task Cockpit Bar */}
                    <div className="flex flex-col justify-between gap-4 border-b border-slate-200/60 pb-4 lg:flex-row lg:items-center dark:border-white/[0.06]">
                        <div className="space-y-1.5">
                            {/* Badges and tags */}
                            <div className="flex flex-wrap items-center gap-2">
                                <button
                                    type="button"
                                    onClick={copyTaskNumber}
                                    title="Salin Nomor Tugas"
                                    className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-2 py-0.5 font-mono text-[11px] font-bold text-white shadow-2xs hover:bg-blue-700 transition-colors"
                                >
                                    <Sparkles className="size-3 text-amber-300" />
                                    {task.task_number}
                                    {isCopied ? (
                                        <Check className="size-3 text-emerald-300" />
                                    ) : (
                                        <Copy className="size-3 text-blue-200" />
                                    )}
                                </button>

                                <StatusBadge value={task.status} />
                                <StatusBadge value={task.priority} />

                                <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                                    {categoryName}
                                </span>

                                {task.stage && (
                                    <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300">
                                        {stageName}
                                    </span>
                                )}

                                {task.is_billable && (
                                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                                        <DollarSign className="size-3" />
                                        Billable
                                    </span>
                                )}

                                {isOverdue && (
                                    <span className="inline-flex items-center gap-1 rounded-md bg-rose-500 px-2 py-0.5 text-[11px] font-bold text-white shadow-xs animate-pulse">
                                        <AlertCircle className="size-3" />
                                        Terlewat (Overdue)
                                    </span>
                                )}
                            </div>

                            {/* Main Task Title */}
                            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white leading-tight">
                                {task.title}
                            </h1>

                            {/* Subtitle Metadata */}
                            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-zinc-400">
                                {task.matter ? (
                                    <>
                                        <Briefcase className="size-3.5 text-blue-600 dark:text-blue-400" />
                                        <span>Perkara:</span>
                                        <Link
                                            href={matterRoutes.show?.url ? matterRoutes.show.url(task.matter.id) : `/matters/${task.matter.id}`}
                                            className="font-semibold text-blue-600 hover:underline dark:text-blue-400"
                                        >
                                            {task.matter.title} ({task.matter.matter_number})
                                        </Link>

                                        {task.matter.client && (
                                            <>
                                                <span>·</span>
                                                {task.matter.client.type === 'corporate' ? (
                                                    <Building2 className="size-3.5 text-slate-400 dark:text-zinc-500" />
                                                ) : (
                                                    <User className="size-3.5 text-slate-400 dark:text-zinc-500" />
                                                )}
                                                <span>Klien:</span>
                                                <Link
                                                    href={clientRoutes.show?.url ? clientRoutes.show.url(task.matter.client.id) : `/clients/${task.matter.client.id}`}
                                                    className="font-medium text-slate-700 hover:text-blue-600 dark:text-zinc-300 dark:hover:text-blue-400"
                                                >
                                                    {clientName}
                                                </Link>
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <Layers className="size-3.5 text-slate-400" />
                                        <span>Tugas Operasional Internal</span>
                                    </>
                                )}

                                <span>·</span>
                                <span>
                                    Pelaksana:{' '}
                                    <strong className="font-semibold text-slate-800 dark:text-zinc-200">
                                        {task.assignee?.name || 'Belum Ditugaskan'}
                                    </strong>
                                </span>
                            </div>
                        </div>

                        {/* Cockpit Actions */}
                        <div className="flex shrink-0 flex-wrap items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 rounded-lg border-slate-200/80 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-[#16181d] dark:text-zinc-300 shadow-2xs"
                                asChild
                            >
                                <Link href={taskRoutes.index?.url ? taskRoutes.index.url() : '/tasks'}>
                                    <ArrowLeft className="mr-1 size-3.5 text-slate-400" />
                                    Kembali
                                </Link>
                            </Button>

                            {/* Workflow Status Actions */}
                            {can.update && (
                                <>
                                    {task.status === 'todo' && (
                                        <Button
                                            size="sm"
                                            onClick={() => handleStatusChange('in_progress')}
                                            className="h-8 rounded-lg bg-blue-600 px-3 text-xs font-semibold text-white hover:bg-blue-700 shadow-2xs gap-1.5"
                                        >
                                            <Play className="size-3.5" />
                                            Mulai Kerjakan
                                        </Button>
                                    )}

                                    {task.status === 'in_progress' && (
                                        <Button
                                            size="sm"
                                            onClick={() => handleStatusChange('review')}
                                            className="h-8 rounded-lg bg-purple-600 px-3 text-xs font-semibold text-white hover:bg-purple-700 shadow-2xs gap-1.5"
                                        >
                                            <Send className="size-3.5" />
                                            Minta Review Partner
                                        </Button>
                                    )}

                                    {task.status !== 'completed' && task.status !== 'cancelled' && (
                                        <Button
                                            size="sm"
                                            onClick={() => setIsCompleteModalOpen(true)}
                                            className="h-8 rounded-lg bg-emerald-600 px-3 text-xs font-semibold text-white hover:bg-emerald-700 shadow-2xs gap-1.5"
                                        >
                                            <CheckCircle2 className="size-3.5" />
                                            Tandai Selesai
                                        </Button>
                                    )}

                                    {task.status === 'completed' && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleStatusChange('in_progress')}
                                            className="h-8 rounded-lg border-slate-200/80 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-[#16181d] dark:text-zinc-300 shadow-2xs gap-1.5"
                                        >
                                            <RotateCcw className="size-3.5" />
                                            Buka Kembali
                                        </Button>
                                    )}

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setIsEditOpen(true)}
                                        className="h-8 rounded-lg border-slate-200/80 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-[#16181d] dark:text-zinc-300 shadow-2xs"
                                    >
                                        <Pencil className="mr-1 size-3.5 text-slate-400" />
                                        Edit Tugas
                                    </Button>
                                </>
                            )}

                            {can.delete && (
                                <ConfirmDialog
                                    title="Hapus Tugas Ini?"
                                    description={`Tugas ${task.task_number} (${task.title}) akan dihapus secara permanen beserta riwayat checklist dan diskusinya.`}
                                    confirmText="Ya, Hapus Tugas"
                                    variant="destructive"
                                    onConfirm={() => router.delete(taskRoutes.destroy?.url ? taskRoutes.destroy.url(task.id) : `/tasks/${task.id}`)}
                                >
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 rounded-lg border-slate-200/80 bg-white px-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:border-white/10 dark:bg-[#16181d] dark:text-rose-400 dark:hover:bg-rose-950/40 shadow-2xs"
                                        title="Hapus Tugas"
                                    >
                                        <Trash2 className="size-3.5" />
                                    </Button>
                                </ConfirmDialog>
                            )}
                        </div>
                    </div>

                    {/* 2. Key Metric KPI Summary Cards (4-Column Layout) */}
                    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {/* 1. Status & Progres Checklist */}
                        <div className="group rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[11px] font-semibold tracking-wider uppercase">
                                    PROGRES PENYELESAIAN
                                </span>
                                <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div className="mt-2 flex items-baseline justify-between">
                                <span className="font-mono text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    {progressPercent}%
                                </span>
                                <span className="text-[11px] font-medium text-slate-500 dark:text-zinc-400">
                                    {completedCount}/{totalChecklists} checklist
                                </span>
                            </div>
                            <div className="mt-2.5 space-y-1 border-t border-slate-100 pt-2 dark:border-white/[0.04]">
                                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                                    <div
                                        className={`h-full transition-all duration-300 ${
                                            progressPercent === 100 ? 'bg-emerald-500' : 'bg-blue-600'
                                        }`}
                                        style={{ width: `${progressPercent}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 2. Pelaksana & Penanggung Jawab */}
                        <div className="group rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[11px] font-semibold tracking-wider uppercase">
                                    PELAKSANA UTAMA
                                </span>
                                <UserCheck className="size-3.5 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div className="mt-2">
                                <p className="truncate text-xs font-bold text-slate-900 dark:text-white">
                                    {task.assignee?.name || 'Belum Ditugaskan'}
                                </p>
                                <p className="text-[11px] text-slate-500 dark:text-zinc-400 truncate">
                                    {task.assignee?.position_title || 'Staf Hukum'}
                                </p>
                            </div>
                            <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-500 dark:border-white/[0.04]">
                                <span>Pemeriksa (Reviewer)</span>
                                <span className="font-semibold text-slate-700 dark:text-zinc-300 truncate max-w-[120px]">
                                    {task.reviewer?.name || '-'}
                                </span>
                            </div>
                        </div>

                        {/* 3. Jadwal & Tenggat Waktu */}
                        <div className="group rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[11px] font-semibold tracking-wider uppercase">
                                    TENGGAT WAKTU
                                </span>
                                <CalendarClock className={`size-3.5 ${isOverdue ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400'}`} />
                            </div>
                            <div className="mt-2">
                                <p className={`truncate text-xs font-bold ${isOverdue ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'}`}>
                                    {task.due_at ? formatDate(task.due_at) : 'Tanpa Tenggat'}
                                </p>
                                <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                                    {isOverdue ? '⚠️ Melewati batas waktu' : task.start_date ? `Mulai: ${formatDate(task.start_date)}` : 'Jadwal Normal'}
                                </p>
                            </div>
                            <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-500 dark:border-white/[0.04]">
                                <span>Status Jadwal</span>
                                <span className={`font-semibold ${isOverdue ? 'text-rose-600 dark:text-rose-400' : 'text-slate-700 dark:text-zinc-300'}`}>
                                    {task.completed_at ? 'Selesai' : isOverdue ? 'Overdue' : 'Tepat Waktu'}
                                </span>
                            </div>
                        </div>

                        {/* 4. Finansial & Klasifikasi */}
                        <div className="group rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[11px] font-semibold tracking-wider uppercase">
                                    KLASIFIKASI & TAGIHAN
                                </span>
                                <Scale className="size-3.5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="mt-2">
                                <p className="truncate text-xs font-bold text-slate-900 dark:text-white">
                                    {task.is_billable ? 'Billable to Client' : 'Non-Billable (Internal)'}
                                </p>
                                <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                                    {task.is_billable ? 'Dapat ditagihkan' : 'Operasional kantor'}
                                </p>
                            </div>
                            <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-500 dark:border-white/[0.04]">
                                <span>Kategori</span>
                                <span className="font-semibold text-slate-700 dark:text-zinc-300">
                                    {categoryName}
                                </span>
                            </div>
                        </div>
                    </section>

                    {/* 3. Segmented Navigation Tabs */}
                    <div className="flex flex-wrap items-center gap-1 rounded-xl border border-slate-200/70 bg-slate-100/70 p-1 dark:border-white/[0.06] dark:bg-[#14161b]">
                        {tabsList.map((item) => {
                            const isActive = activeTab === item.id;
                            const Icon = item.icon;

                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => setActiveTab(item.id)}
                                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                                        isActive
                                            ? 'bg-white text-slate-900 shadow-2xs dark:bg-[#20232a] dark:text-white'
                                            : 'text-slate-600 hover:bg-white/60 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-white/[0.04] dark:hover:text-white'
                                    }`}
                                >
                                    <Icon
                                        className={`size-3.5 shrink-0 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-zinc-500'}`}
                                    />
                                    <span>{item.label}</span>
                                    {item.badge !== null && (
                                        <span
                                            className={`rounded-full px-1.5 py-0.2 font-mono text-[10px] font-bold ${
                                                isActive
                                                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                                                    : 'bg-slate-200/80 text-slate-700 dark:bg-zinc-800 dark:text-zinc-400'
                                            }`}
                                        >
                                            {item.badge}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* 4. 2-Column Split Cockpit Workspace Layout */}
                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
                        {/* Sisi Kiri: Main Workspace Content (8 Columns) */}
                        <div className="space-y-4 lg:col-span-8">
                            {/* TAB 1: RINGKASAN & CHECKLIST */}
                            {activeTab === 'summary' && (
                                <div className="space-y-4">
                                    {/* Catatan Hasil / Resume Penyelesaian (Jika Selesai) */}
                                    {task.completion_notes && (
                                        <div className="rounded-xl border border-emerald-500/20 bg-emerald-50/50 p-4 shadow-2xs dark:border-emerald-500/30 dark:bg-emerald-950/20 space-y-2">
                                            <div className="flex items-center gap-2 border-b border-emerald-500/10 pb-2">
                                                <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
                                                <h3 className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                                                    Resume Hasil Penyelesaian Tugas
                                                </h3>
                                            </div>
                                            <p className="text-xs leading-relaxed text-emerald-950 dark:text-emerald-100 whitespace-pre-wrap">
                                                {task.completion_notes}
                                            </p>
                                        </div>
                                    )}

                                    {/* Interactive Checklist Butir Pekerjaan */}
                                    <div className="rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b] space-y-4">
                                        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-white/[0.04]">
                                            <div className="flex items-center gap-1.5">
                                                <ListChecks className="size-3.5 text-amber-600 dark:text-amber-400" />
                                                <span className="text-[11px] font-semibold text-slate-500 uppercase dark:text-zinc-400">
                                                    Checklist Butir Pekerjaan ({completedCount}/{totalChecklists})
                                                </span>
                                            </div>
                                            {totalChecklists > 0 && (
                                                <span className="text-[11px] font-bold text-slate-700 dark:text-zinc-300">
                                                    {progressPercent}% Selesai
                                                </span>
                                            )}
                                        </div>

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
                                                        onChange={() => {}}
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
                                                        Belum ada checklist butir pekerjaan. Klik "Edit Tugas" untuk menambahkan sub-tasks.
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Instruksi Ringkas */}
                                    <div className="rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                        <div className="mb-2 flex items-center justify-between border-b border-slate-100 pb-2 dark:border-white/[0.04]">
                                            <div className="flex items-center gap-1.5">
                                                <FileText className="size-3.5 text-slate-500 dark:text-zinc-400" />
                                                <span className="text-[11px] font-semibold text-slate-500 uppercase dark:text-zinc-400">
                                                    Instruksi & Panduan
                                                </span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setActiveTab('instructions')}
                                                className="cursor-pointer text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
                                            >
                                                Buka Tampilan Penuh →
                                            </button>
                                        </div>
                                        <p className="text-xs leading-relaxed whitespace-pre-wrap text-slate-700 dark:text-zinc-300">
                                            {task.description || 'Tidak ada instruksi tertulis khusus. Gunakan tab Diskusi Tim untuk koordinasi pekerjaan.'}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* TAB 2: INSTRUKSI KERJA LENGKAP */}
                            {activeTab === 'instructions' && (
                                <div className="rounded-xl border border-slate-200/70 bg-white p-5 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b] space-y-4">
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-white/[0.04]">
                                        <div className="flex items-center gap-2">
                                            <FileText className="size-4 text-purple-600 dark:text-purple-400" />
                                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                                                Instruksi & Panduan Pengerjaan Lengkap
                                            </h3>
                                        </div>
                                        {can.update && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setIsEditOpen(true)}
                                                className="h-7 text-xs font-semibold"
                                            >
                                                <Pencil className="mr-1 size-3" />
                                                Edit Instruksi
                                            </Button>
                                        )}
                                    </div>

                                    {task.description ? (
                                        <div className="prose prose-sm dark:prose-invert max-w-none text-xs leading-relaxed text-slate-700 dark:text-zinc-300 whitespace-pre-wrap font-sans">
                                            {task.description}
                                        </div>
                                    ) : (
                                        <div className="rounded-lg border border-dashed border-slate-200 p-8 text-center dark:border-white/10">
                                            <FileText className="mx-auto size-7 text-slate-400 dark:text-zinc-600" />
                                            <p className="mt-2 text-xs font-medium text-slate-600 dark:text-zinc-400">
                                                Belum ada instruksi tertulis yang dimasukkan.
                                            </p>
                                            <p className="mt-0.5 text-[11px] text-slate-400 dark:text-zinc-500">
                                                Gunakan tombol Edit Tugas di atas untuk menambahkan catatan teknis atau panduan hukum.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* TAB 3: DOKUMEN TERKAIT */}
                            {activeTab === 'documents' && (
                                <div className="rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b] space-y-4">
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-white/[0.04]">
                                        <div className="flex items-center gap-1.5">
                                            <FolderKanban className="size-3.5 text-blue-600 dark:text-blue-400" />
                                            <span className="text-[11px] font-semibold text-slate-500 uppercase dark:text-zinc-400">
                                                Berkas & Dokumen Perkara ({documents.length})
                                            </span>
                                        </div>
                                        {task.matter_id && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-7 text-xs"
                                                asChild
                                            >
                                                <Link href={documentRoutes.index?.url ? documentRoutes.index.url({ query: { matter_id: task.matter_id } }) : `/documents?matter_id=${task.matter_id}`}>
                                                    Lihat Repositori Dokumen
                                                </Link>
                                            </Button>
                                        )}
                                    </div>

                                    {documents.length > 0 ? (
                                        <div className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                                            {documents.map((doc) => (
                                                <div
                                                    key={doc.id}
                                                    className="flex items-center justify-between py-2.5 hover:bg-slate-50/50 dark:hover:bg-white/[0.02] px-2 rounded-lg transition-colors"
                                                >
                                                    <div className="flex items-center gap-2.5 min-w-0">
                                                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                                                            <FileText className="size-4" />
                                                        </div>
                                                        <div className="min-w-0 space-y-0.5">
                                                            <p className="truncate text-xs font-bold text-slate-900 dark:text-white">
                                                                {doc.title}
                                                            </p>
                                                            <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-zinc-400">
                                                                <span className="font-mono">{doc.document_number}</span>
                                                                <span>•</span>
                                                                <span>{formatDate(doc.created_at)}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            asChild
                                                            className="h-7 rounded-lg px-2.5 text-xs font-semibold"
                                                        >
                                                            <Link href={documentRoutes.show?.url ? documentRoutes.show.url(doc.id) : `/documents/${doc.id}`}>
                                                                <Eye className="mr-1 size-3" />
                                                                Buka
                                                            </Link>
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="rounded-lg border border-dashed border-slate-200 p-8 text-center dark:border-white/10">
                                            <FolderKanban className="mx-auto size-7 text-slate-400 dark:text-zinc-600" />
                                            <p className="mt-2 text-xs font-medium text-slate-600 dark:text-zinc-400">
                                                Belum ada dokumen yang terhubung dengan perkara tugas ini.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* TAB 4: DISKUSI TIM */}
                            {activeTab === 'discussion' && (
                                <div className="rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                    <DiscussionBox
                                        commentableType="task"
                                        commentableId={task.id}
                                        comments={task.comments || []}
                                        staffList={staffList}
                                        title={`Diskusi Internal Tugas: ${task.task_number}`}
                                        subtitle="Koordinasikan instruksi, telaah bukti, dan catatan hasil kerja dengan tim advokat."
                                    />
                                </div>
                            )}

                            {/* TAB 5: RIWAYAT AUDIT */}
                            {activeTab === 'history' && (
                                <div className="rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b] space-y-4">
                                    <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2.5 dark:border-white/[0.04]">
                                        <History className="size-3.5 text-slate-600 dark:text-zinc-400" />
                                        <span className="text-[11px] font-semibold text-slate-500 uppercase dark:text-zinc-400">
                                            Jejak Audit &amp; Log Aktivitas ({auditLogs.length})
                                        </span>
                                    </div>

                                    {auditLogs.length > 0 ? (
                                        <div className="relative space-y-4 before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200 dark:before:bg-white/10">
                                            {auditLogs.map((log) => (
                                                <div key={log.id} className="relative flex items-start gap-3 pl-8">
                                                    <span className="absolute left-2.5 top-1 size-2 rounded-full bg-blue-600 ring-4 ring-white dark:ring-[#14161b]" />
                                                    <div className="min-w-0 flex-1 space-y-1">
                                                        <div className="flex flex-wrap items-center justify-between gap-1 text-xs">
                                                            <span className="font-bold text-slate-900 dark:text-white">
                                                                {log.actor?.name || 'Sistem'}
                                                            </span>
                                                            <span className="text-[10px] text-slate-400 dark:text-zinc-500">
                                                                {formatDate(log.created_at)}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-slate-600 dark:text-zinc-400 font-mono">
                                                            {log.event}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="rounded-lg border border-dashed border-slate-200 p-6 text-center dark:border-white/10">
                                            <History className="mx-auto size-6 text-slate-400 dark:text-zinc-600" />
                                            <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">
                                                Belum ada catatan log aktivitas untuk tugas ini.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Sisi Kanan: Metadata Sidebar Cockpit (4 Columns) */}
                        <div className="space-y-4 lg:col-span-4">
                            {/* Card 1: Tim & Penanggung Jawab */}
                            <div className="rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                <div className="mb-2 flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-white/[0.04]">
                                    <div className="flex items-center gap-1.5">
                                        <Users className="size-3.5 text-slate-500 dark:text-zinc-400" />
                                        <span className="text-[11px] font-semibold text-slate-500 uppercase dark:text-zinc-400">
                                            Tim Penugasan
                                        </span>
                                    </div>
                                    {can.update && (
                                        <button
                                            type="button"
                                            onClick={() => setIsEditOpen(true)}
                                            className="cursor-pointer text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
                                        >
                                            Ubah
                                        </button>
                                    )}
                                </div>

                                <div className="divide-y divide-slate-100 text-xs dark:divide-white/[0.04]">
                                    {/* Pelaksana */}
                                    <div className="flex items-center justify-between py-2">
                                        <span className="text-slate-500 dark:text-zinc-400">
                                            Pelaksana Utama
                                        </span>
                                        {task.assignee ? (
                                            <div className="flex items-center gap-2">
                                                <Avatar className="size-5.5 ring-1 ring-slate-200 dark:ring-white/10">
                                                    {task.assignee.avatar_path && (
                                                        <AvatarImage src={`/storage/${task.assignee.avatar_path}`} />
                                                    )}
                                                    <AvatarFallback className="bg-blue-600 text-[8px] font-bold text-white">
                                                        {initials(task.assignee.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="font-semibold text-slate-900 dark:text-white">
                                                    {task.assignee.name}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="font-normal italic text-slate-400">-</span>
                                        )}
                                    </div>

                                    {/* Reviewer */}
                                    <div className="flex items-center justify-between py-2">
                                        <span className="text-slate-500 dark:text-zinc-400">
                                            Pemeriksa (Reviewer)
                                        </span>
                                        {task.reviewer ? (
                                            <div className="flex items-center gap-2">
                                                <Avatar className="size-5.5 ring-1 ring-slate-200 dark:ring-white/10">
                                                    {task.reviewer.avatar_path && (
                                                        <AvatarImage src={`/storage/${task.reviewer.avatar_path}`} />
                                                    )}
                                                    <AvatarFallback className="bg-purple-600 text-[8px] font-bold text-white">
                                                        {initials(task.reviewer.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="font-semibold text-slate-900 dark:text-white">
                                                    {task.reviewer.name}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="font-normal text-slate-400">-</span>
                                        )}
                                    </div>

                                    {/* Reporter */}
                                    <div className="flex items-center justify-between py-2">
                                        <span className="text-slate-500 dark:text-zinc-400">
                                            Pemberi Tugas
                                        </span>
                                        <span className="font-medium text-slate-800 dark:text-zinc-200">
                                            {task.reporter?.name || 'Sistem'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Card 2: Perkara & Klien Terkait */}
                            <div className="rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                <div className="mb-2 flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-white/[0.04]">
                                    <div className="flex items-center gap-1.5">
                                        <Briefcase className="size-3.5 text-slate-500 dark:text-zinc-400" />
                                        <span className="text-[11px] font-semibold text-slate-500 uppercase dark:text-zinc-400">
                                            Konteks Perkara
                                        </span>
                                    </div>
                                </div>

                                {task.matter ? (
                                    <div className="divide-y divide-slate-100 text-xs dark:divide-white/[0.04]">
                                        <div className="flex items-center justify-between py-2">
                                            <span className="text-slate-500 dark:text-zinc-400">Nomor Perkara</span>
                                            <Link
                                                href={matterRoutes.show?.url ? matterRoutes.show.url(task.matter.id) : `/matters/${task.matter.id}`}
                                                className="font-mono font-bold text-blue-600 hover:underline dark:text-blue-400"
                                            >
                                                {task.matter.matter_number}
                                            </Link>
                                        </div>

                                        <div className="flex items-center justify-between py-2">
                                            <span className="text-slate-500 dark:text-zinc-400">Judul Perkara</span>
                                            <span className="font-medium text-slate-900 dark:text-white truncate max-w-[170px]" title={task.matter.title}>
                                                {task.matter.title}
                                            </span>
                                        </div>

                                        {task.matter.client && (
                                            <div className="flex items-center justify-between py-2">
                                                <span className="text-slate-500 dark:text-zinc-400">Klien</span>
                                                <Link
                                                    href={clientRoutes.show?.url ? clientRoutes.show.url(task.matter.client.id) : `/clients/${task.matter.client.id}`}
                                                    className="font-medium text-slate-800 hover:text-blue-600 dark:text-zinc-200 truncate max-w-[170px]"
                                                >
                                                    {clientName}
                                                </Link>
                                            </div>
                                        )}

                                        {task.matter.practiceArea && (
                                            <div className="flex items-center justify-between py-2">
                                                <span className="text-slate-500 dark:text-zinc-400">Area Praktik</span>
                                                <span className="font-semibold text-slate-700 dark:text-zinc-300">
                                                    {task.matter.practiceArea.name}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <p className="py-2 text-xs italic text-slate-400">
                                        Tugas ini tidak dikaitkan dengan berkas perkara tertentu.
                                    </p>
                                )}
                            </div>

                            {/* Card 3: Jadwal & Parameter Pengerjaan */}
                            <div className="rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                <div className="mb-2 flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-white/[0.04]">
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="size-3.5 text-slate-500 dark:text-zinc-400" />
                                        <span className="text-[11px] font-semibold text-slate-500 uppercase dark:text-zinc-400">
                                            Jadwal &amp; Parameter
                                        </span>
                                    </div>
                                    {can.update && (
                                        <button
                                            type="button"
                                            onClick={() => setIsEditOpen(true)}
                                            className="cursor-pointer text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
                                        >
                                            Edit
                                        </button>
                                    )}
                                </div>

                                <div className="divide-y divide-slate-100 text-xs dark:divide-white/[0.04]">
                                    <div className="flex items-center justify-between py-2">
                                        <span className="text-slate-500 dark:text-zinc-400">Tanggal Mulai</span>
                                        <span className="font-medium text-slate-900 dark:text-white">
                                            {task.start_date ? formatDate(task.start_date) : '-'}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between py-2">
                                        <span className="text-slate-500 dark:text-zinc-400">Tenggat Waktu</span>
                                        <span className={`font-semibold ${isOverdue ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-slate-900 dark:text-white'}`}>
                                            {task.due_at ? formatDate(task.due_at) : 'Tidak Terbatas'}
                                        </span>
                                    </div>

                                    {task.completed_at && (
                                        <div className="flex items-center justify-between py-2">
                                            <span className="text-slate-500 dark:text-zinc-400">Diselesaikan Pada</span>
                                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                                {formatDate(task.completed_at)}
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between py-2">
                                        <span className="text-slate-500 dark:text-zinc-400">Dibuat Pada</span>
                                        <span className="text-slate-700 dark:text-zinc-300">
                                            {formatDate(task.created_at)}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between py-2">
                                        <span className="text-slate-500 dark:text-zinc-400">Status Tagihan</span>
                                        <span className={`font-bold ${task.is_billable ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-zinc-400'}`}>
                                            {task.is_billable ? 'Billable to Client' : 'Non-Billable (Internal)'}
                                        </span>
                                    </div>
                                </div>
                            </div>
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
                            Perbarui detail instruksi, penanggung jawab, jadwal, dan status pekerjaan.
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
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                            Masukkan catatan resume hasil penyelesaian tugas ini.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleCompleteSubmit} className="space-y-3.5 pt-2">
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

            {/* Document Preview Modal */}
            <DocumentPreviewModal
                document={previewDoc}
                isOpen={!!previewDoc}
                onClose={() => setPreviewDoc(null)}
            />
        </>
    );
}

TaskShow.layout = {
    breadcrumbs: [
        { title: 'Daftar Tugas', href: taskRoutes.index?.url ? taskRoutes.index.url() : '/tasks' },
        { title: 'Detail Tugas', href: '#' },
    ],
};
