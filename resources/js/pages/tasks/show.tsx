import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowRight,
    Briefcase,
    Building2,
    Calendar,
    CalendarClock,
    Check,
    CheckCircle2,
    ChevronRight,
    Clock,
    Download,
    Eye,
    FileCheck,
    FileText,
    FolderKanban,
    Gavel,
    History,
    Info,
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
import { StatusText } from '@/components/status-text';
import { useInitials } from '@/hooks/use-initials';
import { getDetailHeaderMetadata } from '@/lib/detail-header-meta';
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
    status:
        | 'todo'
        | 'in_progress'
        | 'waiting'
        | 'review'
        | 'completed'
        | 'cancelled';
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
    title: string;
    document_type?: string | null;
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
        avatar_url?: string | null;
    } | null;
    metadata?: Record<string, unknown> | null;
    created_at: string;
};

function getAvatarUrl(
    user?: {
        avatar_url?: string | null;
        avatar_path?: string | null;
        avatar?: string | null;
    } | null,
) {
    if (!user) return '/images/default-avatar.svg';
    if (user.avatar_url) return user.avatar_url;
    if (user.avatar) return user.avatar;
    if (user.avatar_path) {
        if (
            user.avatar_path.startsWith('/') ||
            user.avatar_path.startsWith('http')
        ) {
            return user.avatar_path;
        }
        return `/storage/${user.avatar_path}`;
    }
    return '/images/default-avatar.svg';
}

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
    const page = usePage<{ auth?: { user?: { id: number; name: string } } }>();
    const authUser = page.props.auth?.user;
    const isAssignee = Boolean(
        authUser?.id && task.assignee?.id && authUser.id === task.assignee.id,
    );
    const isReviewer = Boolean(
        authUser?.id &&
        ((task.reviewer?.id && authUser.id === task.reviewer.id) ||
            (task.reporter?.id && authUser.id === task.reporter.id)),
    );

    const initials = useInitials();
    const [activeTab, setActiveTab] = useState<
        'summary' | 'instructions' | 'documents' | 'discussion' | 'history'
    >('summary');
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
    const [isSubmitReviewOpen, setIsSubmitReviewOpen] = useState(false);
    const [isApproveOpen, setIsApproveOpen] = useState(false);
    const [isRevisionOpen, setIsRevisionOpen] = useState(false);
    const [previewDoc, setPreviewDoc] = useState<PreviewableDocument | null>(
        null,
    );

    // Checklist progress calculation
    const checklists = task.checklists || [];
    const completedCount = checklists.filter((c) => c.is_completed).length;
    const totalChecklists = checklists.length;
    const progressPercent =
        totalChecklists > 0
            ? Math.round((completedCount / totalChecklists) * 100)
            : task.status === 'completed'
              ? 100
              : 0;

    // Overdue calculation
    const isOverdue = useMemo(() => {
        if (
            !task.due_at ||
            task.status === 'completed' ||
            task.status === 'cancelled'
        )
            return false;
        return new Date(task.due_at).getTime() < Date.now();
    }, [task.due_at, task.status]);

    const handleToggleChecklist = (checklistId: string) => {
        router.patch(
            `/tasks/${task.id}/checklists/${checklistId}/toggle`,
            {},
            { preserveScroll: true },
        );
    };

    const handleStatusChange = (newStatus: string) => {
        router.put(
            taskRoutes.update?.url
                ? taskRoutes.update.url(task.id)
                : `/tasks/${task.id}`,
            {
                title: task.title,
                status: newStatus,
                priority: task.priority,
                assignee_id: task.assignee_id,
                reviewer_id: task.reviewer_id,
            },
            { preserveScroll: true },
        );
    };

    // Review form
    const reviewForm = useForm({
        notes: '',
    });

    const handleSubmitReview = (e: React.FormEvent) => {
        e.preventDefault();
        reviewForm.post(
            taskRoutes.submitReview
                ? taskRoutes.submitReview.url(task.id)
                : `/tasks/${task.id}/submit-review`,
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsSubmitReviewOpen(false);
                    reviewForm.reset();
                },
            },
        );
    };

    // Approve form
    const approveForm = useForm({
        remarks: '',
    });

    const handleApprove = (e: React.FormEvent) => {
        e.preventDefault();
        approveForm.post(
            taskRoutes.approve
                ? taskRoutes.approve.url(task.id)
                : `/tasks/${task.id}/approve`,
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsApproveOpen(false);
                    approveForm.reset();
                },
            },
        );
    };

    // Revision form
    const revisionForm = useForm({
        feedback: '',
    });

    const handleRequestRevision = (e: React.FormEvent) => {
        e.preventDefault();
        revisionForm.post(
            taskRoutes.requestRevision
                ? taskRoutes.requestRevision.url(task.id)
                : `/tasks/${task.id}/request-revision`,
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsRevisionOpen(false);
                    revisionForm.reset();
                },
            },
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
        editForm.put(
            taskRoutes.update?.url
                ? taskRoutes.update.url(task.id)
                : `/tasks/${task.id}`,
            {
                onSuccess: () => setIsEditOpen(false),
                preserveScroll: true,
            },
        );
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
        completeForm.put(
            taskRoutes.update?.url
                ? taskRoutes.update.url(task.id)
                : `/tasks/${task.id}`,
            {
                onSuccess: () => setIsCompleteModalOpen(false),
                preserveScroll: true,
            },
        );
    };

    const categoryName =
        categories.find((c) => c.id === task.category)?.name ||
        task.category ||
        'Umum';
    const clientName =
        task.matter?.client?.display_name ||
        task.matter?.client?.legal_name ||
        task.matter?.client?.name ||
        'Klien';

    const tabsList: Array<{
        id: 'summary' | 'instructions' | 'documents' | 'discussion' | 'history';
        label: string;
    }> = [
        {
            id: 'summary',
            label: `Checklist · ${totalChecklists}`,
        },
        {
            id: 'instructions',
            label: 'Instruksi',
        },
        {
            id: 'documents',
            label: `Dokumen · ${documents.length}`,
        },
        {
            id: 'discussion',
            label: `Diskusi · ${task.comments?.length || 0}`,
        },
        {
            id: 'history',
            label: `Riwayat · ${auditLogs.length}`,
        },
    ];

    return (
        <>
            <Head title={`${task.task_number || 'Tugas'}: ${task.title}`} />

            <div className="min-h-screen bg-[#fafafc] pb-24 dark:bg-[#0c0d10]">
                <main className="mx-auto max-w-7xl space-y-4 px-4 py-4 sm:px-6 lg:px-8">
                    {/* 1. Executive Task Cockpit Hero (Matching document show / sign.blade.php) */}
                    <section className="group relative overflow-hidden rounded-[20px] border border-slate-200/80 bg-gradient-to-br from-[#f7f9ff] via-white to-[#eaf3ff] p-5 shadow-[0_10px_28px_rgba(71,85,105,0.075)] sm:p-6 dark:border-white/[0.08] dark:from-[#17191f] dark:via-[#17191f] dark:to-[#18202b]">
                        {/* 1. Ambient Breathing Radial Glow */}
                        <div className="matters-hero-glow pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_83%_38%,rgba(147,197,253,0.34),transparent_30%),radial-gradient(circle_at_65%_115%,rgba(251,191,36,0.12),transparent_27%)]" />

                        {/* 2. Drifting Micro-Dot Matrix Pattern */}
                        <div className="matters-hero-dots pointer-events-none absolute inset-y-0 right-0 hidden w-[480px] [background-image:radial-gradient(rgba(59,130,246,0.24)_1px,transparent_1px)] [mask-image:linear-gradient(to_right,transparent,black_28%)] [background-size:18px_18px] opacity-30 md:block" />

                        {/* 3. Animated Vector Wave Lines with Drop Shadow */}
                        <svg
                            viewBox="0 0 560 200"
                            aria-hidden="true"
                            className="pointer-events-none absolute right-0 bottom-0 hidden h-full w-[480px] text-white/90 drop-shadow-[0_0_8px_rgba(96,165,250,0.35)] md:block"
                        >
                            <path
                                d="M8 165 C95 94 176 178 270 108 S430 49 554 72"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                className="matters-hero-line"
                                pathLength={1}
                            />
                            <path
                                d="M55 192 C138 136 213 187 302 128 S442 84 558 99"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                className="matters-hero-line matters-hero-line-secondary opacity-55"
                                pathLength={1}
                            />
                            <circle
                                cx="270"
                                cy="108"
                                r="3.5"
                                fill="currentColor"
                            />
                            <circle
                                cx="430"
                                cy="49"
                                r="2.5"
                                fill="currentColor"
                            />
                        </svg>

                        {/* 4. Content Area: Official Task Dossier */}
                        <div className="relative z-10 space-y-4">
                            {/* Top Navigation & Action Buttons */}
                            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                                {/* Left: Back Link & Task Number */}
                                <div className="flex flex-wrap items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        asChild
                                        className="-ml-2 h-7.5 px-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-200/50 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white"
                                    >
                                        <Link
                                            href={
                                                taskRoutes.index?.url
                                                    ? taskRoutes.index.url()
                                                    : '/tasks'
                                            }
                                        >
                                            <ArrowLeft className="mr-1.5 size-3.5 text-slate-400" />
                                            Manajemen Tugas
                                        </Link>
                                    </Button>
                                    <span className="text-slate-300 dark:text-zinc-700">
                                        /
                                    </span>
                                    {getDetailHeaderMetadata(
                                        task.task_number,
                                    ).map((item) => (
                                        <span
                                            key={item.testId}
                                            data-testid={item.testId}
                                            className={`font-mono text-xs font-bold tracking-wider uppercase ${item.className}`}
                                        >
                                            {item.label}
                                        </span>
                                    ))}
                                    <span className="text-slate-300 dark:text-zinc-700">
                                        ·
                                    </span>
                                    <StatusText
                                        value={task.status}
                                        className="text-xs font-semibold"
                                    />
                                    {task.priority && (
                                        <>
                                            <span className="text-slate-300 dark:text-zinc-700">
                                                ·
                                            </span>
                                            <StatusText
                                                value={task.priority}
                                                className="text-xs font-semibold"
                                            />
                                        </>
                                    )}
                                </div>

                                {/* Right: Action Buttons */}
                                <div className="flex shrink-0 flex-wrap items-center gap-1.5">
                                    {can.update && (
                                        <>
                                            {task.status === 'todo' && (
                                                <Button
                                                    size="sm"
                                                    onClick={() =>
                                                        handleStatusChange(
                                                            'in_progress',
                                                        )
                                                    }
                                                    className="h-7.5 gap-1.5 rounded-lg bg-blue-600 px-3 text-xs font-semibold text-white shadow-2xs hover:bg-blue-700 active:scale-98"
                                                >
                                                    <Play className="size-3.5" />
                                                    Mulai Kerjakan
                                                </Button>
                                            )}

                                            {task.status === 'in_progress' && (
                                                <>
                                                    <Button
                                                        size="sm"
                                                        onClick={() =>
                                                            setIsSubmitReviewOpen(
                                                                true,
                                                            )
                                                        }
                                                        className="h-7.5 gap-1.5 rounded-lg bg-blue-600 px-3 text-xs font-semibold text-white shadow-2xs hover:bg-blue-700 active:scale-98"
                                                    >
                                                        <Send className="size-3.5" />
                                                        Ajukan Review
                                                    </Button>

                                                    {!task.reviewer && (
                                                        <Button
                                                            size="sm"
                                                            onClick={() =>
                                                                setIsCompleteModalOpen(
                                                                    true,
                                                                )
                                                            }
                                                            className="h-7.5 gap-1.5 rounded-lg bg-emerald-600 px-3 text-xs font-semibold text-white shadow-2xs hover:bg-emerald-700 active:scale-98"
                                                        >
                                                            <CheckCircle2 className="size-3.5" />
                                                            Tandai Selesai
                                                        </Button>
                                                    )}
                                                </>
                                            )}

                                            {task.status === 'review' && (
                                                <>
                                                    <Button
                                                        size="sm"
                                                        onClick={() =>
                                                            setIsRevisionOpen(
                                                                true,
                                                            )
                                                        }
                                                        className="h-7.5 gap-1.5 rounded-lg border border-amber-300 bg-amber-50 px-2.5 text-xs font-semibold text-amber-800 shadow-2xs hover:bg-amber-100 dark:border-amber-700/50 dark:bg-amber-950/40 dark:text-amber-300"
                                                    >
                                                        <RotateCcw className="size-3.5" />
                                                        Minta Revisi
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        onClick={() =>
                                                            setIsApproveOpen(
                                                                true,
                                                            )
                                                        }
                                                        className="h-7.5 gap-1.5 rounded-lg bg-emerald-600 px-3 text-xs font-semibold text-white shadow-2xs hover:bg-emerald-700 active:scale-98"
                                                    >
                                                        <CheckCircle2 className="size-3.5" />
                                                        Setujui &amp; Selesaikan
                                                    </Button>
                                                </>
                                            )}

                                            {task.status === 'completed' && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() =>
                                                        handleStatusChange(
                                                            'in_progress',
                                                        )
                                                    }
                                                    className="h-7.5 gap-1.5 rounded-lg border-slate-200/80 bg-white/90 px-2.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-white dark:border-white/10 dark:bg-zinc-800/80 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                                >
                                                    <RotateCcw className="size-3.5" />
                                                    Buka Kembali
                                                </Button>
                                            )}

                                            <Button
                                                variant="outline"
                                                size="sm"
                                                asChild
                                                className="h-7.5 rounded-lg border-slate-200/80 bg-white/90 px-2.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-white dark:border-white/10 dark:bg-zinc-800/80 dark:text-zinc-200 dark:hover:bg-zinc-800"
                                            >
                                                <Link
                                                    href={taskRoutes.edit.url(
                                                        task.id,
                                                    )}
                                                >
                                                    <Pencil className="mr-1.5 size-3 text-slate-400" />
                                                    Edit Tugas
                                                </Link>
                                            </Button>
                                        </>
                                    )}

                                    {can.delete && (
                                        <ConfirmDialog
                                            title="Hapus Tugas Ini?"
                                            description={`Tugas ${task.task_number} (${task.title}) akan dihapus secara permanen beserta riwayat checklist dan diskusinya.`}
                                            confirmText="Ya, Hapus Tugas"
                                            variant="destructive"
                                            onConfirm={() =>
                                                router.delete(
                                                    taskRoutes.destroy?.url
                                                        ? taskRoutes.destroy.url(
                                                              task.id,
                                                          )
                                                        : `/tasks/${task.id}`,
                                                )
                                            }
                                        >
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-7.5 rounded-lg border-slate-200/80 bg-white/90 px-2 text-xs font-semibold text-rose-600 shadow-2xs hover:border-rose-200 hover:bg-rose-50 dark:border-white/10 dark:bg-zinc-800/80 dark:text-rose-400 dark:hover:bg-rose-950/20"
                                                title="Hapus Tugas"
                                            >
                                                <Trash2 className="size-3.5" />
                                            </Button>
                                        </ConfirmDialog>
                                    )}
                                </div>
                            </div>

                            {/* Hairline Divider */}
                            <div className="border-t border-slate-200/70 dark:border-white/[0.08]" />
                            {/* Official Task Context & Title */}
                            <div className="max-w-5xl">
                                {/* Task Title */}
                                <h1 className="text-xl leading-snug font-black tracking-tight text-slate-950 sm:text-2xl lg:text-[26px] dark:text-white">
                                    {task.title}
                                </h1>

                                {/* Compact Metadata Strip (Pelaksana, Tenggat, Klasifikasi) */}
                                <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs sm:gap-x-6">

                                    {/* Pelaksana */}
                                    <div className="inline-flex items-center gap-1.5 leading-none">
                                        <span className="text-[10.5px] font-bold tracking-wider text-slate-400 uppercase dark:text-zinc-500">
                                            Pelaksana:
                                        </span>
                                        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-zinc-200">
                                            <Avatar className="size-4 shrink-0 rounded-full border border-slate-200/80 shadow-2xs dark:border-white/10">
                                                <AvatarImage
                                                    src={getAvatarUrl(
                                                        task.assignee,
                                                    )}
                                                    alt={
                                                        task.assignee?.name ||
                                                        'Pelaksana'
                                                    }
                                                />
                                                <AvatarFallback className="bg-blue-600 text-[6px] font-bold text-white">
                                                    {task.assignee
                                                        ? initials(
                                                              task.assignee
                                                                  .name,
                                                          )
                                                        : '?'}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span>
                                                {task.assignee?.name ||
                                                    'Belum Ditugaskan'}
                                            </span>
                                            {task.reviewer && (
                                                <span className="font-normal text-slate-400 dark:text-zinc-500">
                                                    (Pemeriksa:{' '}
                                                    {task.reviewer.name})
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Tenggat Waktu */}
                                    <div className="inline-flex items-center gap-1.5 leading-none">
                                        <span className="text-[10.5px] font-bold tracking-wider text-slate-400 uppercase dark:text-zinc-500">
                                            Tenggat:
                                        </span>
                                        <span
                                            className={`text-xs font-semibold ${
                                                isOverdue
                                                    ? 'text-rose-600 dark:text-rose-400'
                                                    : 'text-slate-800 dark:text-zinc-200'
                                            }`}
                                        >
                                            {task.due_at
                                                ? formatDate(task.due_at)
                                                : 'Tanpa Tenggat'}
                                            {task.completed_at ? (
                                                <span className="ml-1 font-normal text-emerald-600 dark:text-emerald-400">
                                                    (Selesai)
                                                </span>
                                            ) : isOverdue ? (
                                                <span className="ml-1 font-normal text-rose-600 dark:text-rose-400">
                                                    (Terlambat)
                                                </span>
                                            ) : null}
                                        </span>
                                    </div>

                                    {/* Klasifikasi & Tagihan */}
                                    <div className="inline-flex items-center gap-1.5 leading-none">
                                        <span className="text-[10.5px] font-bold tracking-wider text-slate-400 uppercase dark:text-zinc-500">
                                            Klasifikasi:
                                        </span>
                                        <span className="text-xs font-semibold text-slate-800 dark:text-zinc-200">
                                            {task.is_billable
                                                ? 'Billable'
                                                : 'Non-Billable'}
                                            <span className="mx-1 font-normal text-slate-300 dark:text-zinc-700">
                                                ·
                                            </span>
                                            <span className="font-medium text-slate-600 dark:text-zinc-400">
                                                {categoryName}
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Notification Banner when in review status */}
                    {task.status === 'review' && (
                        <div className="rounded-xl border border-blue-200/80 bg-blue-50/60 p-4 dark:border-blue-900/50 dark:bg-blue-950/20">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-start gap-3">
                                    <div className="rounded-lg bg-blue-600 p-2 text-white shadow-2xs">
                                        <Clock className="size-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-blue-950 dark:text-blue-200">
                                            Tugas Sedang Menunggu Penelaahan
                                            &amp; Persetujuan (Review)
                                        </h3>
                                        <p className="mt-0.5 text-xs text-blue-800 dark:text-blue-300">
                                            {task.reviewer
                                                ? `Tugas telah diajukan oleh ${task.assignee?.name || 'Pelaksana'} dan menunggu penelaahan dari ${task.reviewer.name}.`
                                                : `Tugas telah diajukan dan menunggu penelaahan dari Partner.`}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-2">
                                    {(isReviewer || can.update) && (
                                        <>
                                            <Button
                                                size="sm"
                                                onClick={() =>
                                                    setIsRevisionOpen(true)
                                                }
                                                className="h-8 gap-1.5 rounded-lg border border-amber-300 bg-amber-50 px-3 text-xs font-semibold text-amber-800 shadow-2xs hover:bg-amber-100 dark:border-amber-700/50 dark:bg-amber-950/40 dark:text-amber-300"
                                            >
                                                <RotateCcw className="size-3.5" />
                                                Minta Revisi
                                            </Button>
                                            <Button
                                                size="sm"
                                                onClick={() =>
                                                    setIsApproveOpen(true)
                                                }
                                                className="h-8 gap-1.5 rounded-lg bg-emerald-600 px-3.5 text-xs font-semibold text-white shadow-2xs hover:bg-emerald-700"
                                            >
                                                <CheckCircle2 className="size-3.5" />
                                                Setujui &amp; Selesaikan
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 3. Navigation Tabs (Clean text-only border-b style matching Finance) */}
                    <div
                        role="tablist"
                        className="flex [scrollbar-width:none] items-center gap-6 overflow-x-auto border-b border-slate-200/70 [-ms-overflow-style:none] dark:border-white/[0.07] [&::-webkit-scrollbar]:hidden"
                    >
                        {tabsList.map((item) => {
                            const isActive = activeTab === item.id;

                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => setActiveTab(item.id)}
                                    className={`relative shrink-0 border-b-2 px-1 pb-2.5 pt-1 text-xs font-semibold transition-colors ${
                                        isActive
                                            ? 'border-slate-950 text-slate-950 dark:border-white dark:text-white'
                                            : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white'
                                    }`}
                                >
                                    {item.label}
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
                                        <div className="space-y-2 rounded-xl border border-emerald-500/20 bg-emerald-50/50 p-4 shadow-2xs dark:border-emerald-500/30 dark:bg-emerald-950/20">
                                            <div className="flex items-center gap-2 border-b border-emerald-500/10 pb-2">
                                                <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
                                                <h3 className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                                                    Resume Hasil Penyelesaian
                                                    Tugas
                                                </h3>
                                            </div>
                                            <p className="text-xs leading-relaxed whitespace-pre-wrap text-emerald-950 dark:text-emerald-100">
                                                {task.completion_notes}
                                            </p>
                                        </div>
                                    )}

                                    {/* Interactive Checklist Butir Pekerjaan */}
                                    <div className="space-y-4 rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-white/[0.04]">
                                            <div className="flex items-center gap-1.5">
                                                <ListChecks className="size-3.5 text-amber-600 dark:text-amber-400" />
                                                <span className="text-[11px] font-semibold text-slate-500 uppercase dark:text-zinc-400">
                                                    Checklist Butir Pekerjaan (
                                                    {completedCount}/
                                                    {totalChecklists})
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
                                                    onClick={() =>
                                                        can.update &&
                                                        handleToggleChecklist(
                                                            item.id,
                                                        )
                                                    }
                                                    className={`flex items-start gap-3 rounded-lg border p-3 transition-all ${
                                                        item.is_completed
                                                            ? 'border-emerald-500/20 bg-emerald-50/40 dark:border-emerald-500/30 dark:bg-emerald-950/20'
                                                            : 'border-slate-200/70 bg-white hover:bg-slate-50/80 dark:border-white/[0.06] dark:bg-[#181a20] dark:hover:bg-[#1c1f26]'
                                                    } ${can.update ? 'cursor-pointer' : ''}`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            item.is_completed
                                                        }
                                                        onChange={() => {}}
                                                        disabled={!can.update}
                                                        className="mt-0.5 size-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 dark:border-white/20 dark:bg-zinc-800"
                                                    />
                                                    <div className="flex-1 space-y-0.5">
                                                        <p
                                                            className={`text-xs font-medium ${
                                                                item.is_completed
                                                                    ? 'text-slate-500 line-through dark:text-zinc-500'
                                                                    : 'text-slate-800 dark:text-zinc-200'
                                                            }`}
                                                        >
                                                            {item.title}
                                                        </p>
                                                        {item.completed_at && (
                                                            <p className="text-[10px] text-emerald-600 dark:text-emerald-400">
                                                                Selesai:{' '}
                                                                {formatDate(
                                                                    item.completed_at,
                                                                )}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}

                                            {totalChecklists === 0 && (
                                                <div className="rounded-lg border border-dashed border-slate-200 p-6 text-center dark:border-white/10">
                                                    <ListChecks className="mx-auto size-6 text-slate-400 dark:text-zinc-600" />
                                                    <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">
                                                        Belum ada checklist
                                                        butir pekerjaan. Klik
                                                        "Edit Tugas" untuk
                                                        menambahkan sub-tasks.
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
                                                onClick={() =>
                                                    setActiveTab('instructions')
                                                }
                                                className="cursor-pointer text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
                                            >
                                                Buka Tampilan Penuh →
                                            </button>
                                        </div>
                                        <p className="text-xs leading-relaxed whitespace-pre-wrap text-slate-700 dark:text-zinc-300">
                                            {task.description ||
                                                'Tidak ada instruksi tertulis khusus. Gunakan tab Diskusi Tim untuk koordinasi pekerjaan.'}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* TAB 2: INSTRUKSI KERJA LENGKAP */}
                            {activeTab === 'instructions' && (
                                <div className="space-y-4 rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-white/[0.04]">
                                        <div className="flex items-center gap-1.5">
                                            <FileText className="size-3.5 text-slate-600 dark:text-zinc-400" />
                                            <span className="text-[11px] font-semibold text-slate-500 uppercase dark:text-zinc-400">
                                                Instruksi & Panduan Pengerjaan
                                                Lengkap
                                            </span>
                                        </div>
                                        {can.update && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    setIsEditOpen(true)
                                                }
                                                className="h-7 text-xs font-semibold"
                                            >
                                                <Pencil className="mr-1 size-3" />
                                                Edit Instruksi
                                            </Button>
                                        )}
                                    </div>

                                    {task.description ? (
                                        <div className="prose prose-sm dark:prose-invert max-w-none font-sans text-xs leading-relaxed whitespace-pre-wrap text-slate-700 dark:text-zinc-300">
                                            {task.description}
                                        </div>
                                    ) : (
                                        <div className="rounded-lg border border-dashed border-slate-200 p-8 text-center dark:border-white/10">
                                            <FileText className="mx-auto size-7 text-slate-400 dark:text-zinc-600" />
                                            <p className="mt-2 text-xs font-medium text-slate-600 dark:text-zinc-400">
                                                Belum ada instruksi tertulis
                                                yang dimasukkan.
                                            </p>
                                            <p className="mt-0.5 text-[11px] text-slate-400 dark:text-zinc-500">
                                                Gunakan tombol Edit Tugas di
                                                atas untuk menambahkan catatan
                                                teknis atau panduan hukum.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* TAB 3: DOKUMEN TERKAIT */}
                            {activeTab === 'documents' && (
                                <div className="space-y-4 rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-white/[0.04]">
                                        <div className="flex items-center gap-1.5">
                                            <FolderKanban className="size-3.5 text-blue-600 dark:text-blue-400" />
                                            <span className="text-[11px] font-semibold text-slate-500 uppercase dark:text-zinc-400">
                                                Berkas & Dokumen Perkara (
                                                {documents.length})
                                            </span>
                                        </div>
                                        {task.matter_id && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-7 text-xs"
                                                asChild
                                            >
                                                <Link
                                                    href={
                                                        documentRoutes.index
                                                            ?.url
                                                            ? documentRoutes.index.url(
                                                                  {
                                                                      query: {
                                                                          matter_id:
                                                                              task.matter_id,
                                                                      },
                                                                  },
                                                              )
                                                            : `/documents?matter_id=${task.matter_id}`
                                                    }
                                                >
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
                                                    className="flex items-center justify-between rounded-lg px-2 py-2.5 transition-colors hover:bg-slate-50/50 dark:hover:bg-white/[0.02]"
                                                >
                                                    <div className="flex min-w-0 items-center gap-2.5">
                                                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                                                            <FileText className="size-4" />
                                                        </div>
                                                        <div className="min-w-0 space-y-0.5">
                                                            <p className="truncate text-xs font-bold text-slate-900 dark:text-white">
                                                                {doc.title}
                                                            </p>
                                                            <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-zinc-400">
                                                                <span className="capitalize">
                                                                    {doc.document_type?.replaceAll(
                                                                        '_',
                                                                        ' ',
                                                                    ) ||
                                                                        'Dokumen umum'}
                                                                </span>
                                                                <span>•</span>
                                                                <span>
                                                                    {formatDate(
                                                                        doc.created_at,
                                                                    )}
                                                                </span>
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
                                                            <Link
                                                                href={
                                                                    documentRoutes
                                                                        .show
                                                                        ?.url
                                                                        ? documentRoutes.show.url(
                                                                              doc.id,
                                                                          )
                                                                        : `/documents/${doc.id}`
                                                                }
                                                            >
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
                                                Belum ada dokumen yang terhubung
                                                dengan perkara tugas ini.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* TAB 4: DISKUSI TIM */}
                            {activeTab === 'discussion' && (
                                <DiscussionBox
                                    commentableType="task"
                                    commentableId={task.id}
                                    comments={task.comments || []}
                                    staffList={staffList}
                                    title={`Diskusi Internal Tugas: ${task.task_number}`}
                                    variant="compact"
                                />
                            )}

                            {/* TAB 5: RIWAYAT AUDIT */}
                            {activeTab === 'history' && (
                                <div className="space-y-4 rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                    <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2.5 dark:border-white/[0.04]">
                                        <History className="size-3.5 text-slate-600 dark:text-zinc-400" />
                                        <span className="text-[11px] font-semibold text-slate-500 uppercase dark:text-zinc-400">
                                            Jejak Audit &amp; Log Aktivitas (
                                            {auditLogs.length})
                                        </span>
                                    </div>

                                    {auditLogs.length > 0 ? (
                                        <div className="relative space-y-4 before:absolute before:inset-0 before:left-4 before:w-0.5 before:bg-slate-200 dark:before:bg-white/10">
                                            {auditLogs.map((log) => (
                                                <div
                                                    key={log.id}
                                                    className="relative flex items-start gap-3 pl-9"
                                                >
                                                    <span className="absolute top-3 left-3 size-2.5 rounded-full bg-blue-600 ring-4 ring-white dark:ring-[#14161b]" />
                                                    <div className="min-w-0 flex-1 space-y-1.5 rounded-lg border border-slate-100 bg-slate-50/60 p-3 dark:border-white/[0.04] dark:bg-[#181a20]">
                                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                                            <div className="flex items-center gap-2">
                                                                <Avatar className="size-6 shrink-0 rounded-full border border-slate-200 dark:border-white/10">
                                                                    <AvatarImage
                                                                        src={getAvatarUrl(
                                                                            log.actor,
                                                                        )}
                                                                        alt={
                                                                            log
                                                                                .actor
                                                                                ?.name ||
                                                                            'Sistem'
                                                                        }
                                                                    />
                                                                    <AvatarFallback className="bg-blue-600 text-[8px] font-bold text-white">
                                                                        {initials(
                                                                            log
                                                                                .actor
                                                                                ?.name ||
                                                                                'Sistem',
                                                                        )}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <div>
                                                                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                                                                        {log
                                                                            .actor
                                                                            ?.name ||
                                                                            'Sistem'}
                                                                    </span>
                                                                    {log.actor
                                                                        ?.position_title && (
                                                                        <span className="ml-1.5 text-[10px] text-slate-500 dark:text-zinc-400">
                                                                            ·{' '}
                                                                            {
                                                                                log
                                                                                    .actor
                                                                                    .position_title
                                                                            }
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <span className="font-mono text-[10px] text-slate-400 dark:text-zinc-500">
                                                                {formatDate(
                                                                    log.created_at,
                                                                )}
                                                            </span>
                                                        </div>
                                                        <p className="font-mono text-xs text-slate-600 dark:text-zinc-300">
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
                                                Belum ada catatan log aktivitas
                                                untuk tugas ini.
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
                                    <div className="flex items-center justify-between py-2.5">
                                        <span className="text-slate-500 dark:text-zinc-400">
                                            Pelaksana Utama
                                        </span>
                                        {task.assignee ? (
                                            <div className="flex items-center gap-2.5">
                                                <Avatar className="size-7 shrink-0 rounded-full border border-slate-200 shadow-2xs dark:border-white/10">
                                                    <AvatarImage
                                                        src={getAvatarUrl(
                                                            task.assignee,
                                                        )}
                                                    />
                                                    <AvatarFallback className="bg-blue-600 text-[9px] font-bold text-white">
                                                        {initials(
                                                            task.assignee.name,
                                                        )}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="min-w-0">
                                                    <p className="max-w-[150px] truncate font-semibold text-slate-900 dark:text-white">
                                                        {task.assignee.name}
                                                    </p>
                                                    <p className="max-w-[150px] truncate text-[10px] text-slate-500 dark:text-zinc-400">
                                                        {task.assignee
                                                            .position_title ||
                                                            'Staf Pelaksana'}
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <Avatar className="size-6 shrink-0 rounded-full border border-slate-200 dark:border-white/10">
                                                    <AvatarImage src="/images/default-avatar.svg" />
                                                    <AvatarFallback className="bg-slate-200 text-[8px] font-bold text-slate-600">
                                                        -
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="font-normal text-slate-400 italic">
                                                    Belum Ditugaskan
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Reviewer */}
                                    <div className="flex items-center justify-between py-2.5">
                                        <span className="text-slate-500 dark:text-zinc-400">
                                            Pemeriksa (Reviewer)
                                        </span>
                                        {task.reviewer ? (
                                            <div className="flex items-center gap-2.5">
                                                <Avatar className="size-7 shrink-0 rounded-full border border-slate-200 shadow-2xs dark:border-white/10">
                                                    <AvatarImage
                                                        src={getAvatarUrl(
                                                            task.reviewer,
                                                        )}
                                                    />
                                                    <AvatarFallback className="bg-blue-600 text-[9px] font-bold text-white">
                                                        {initials(
                                                            task.reviewer.name,
                                                        )}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="min-w-0">
                                                    <p className="max-w-[150px] truncate font-semibold text-slate-900 dark:text-white">
                                                        {task.reviewer.name}
                                                    </p>
                                                    <p className="max-w-[150px] truncate text-[10px] text-slate-500 dark:text-zinc-400">
                                                        {task.reviewer
                                                            .position_title ||
                                                            'Supervising Partner'}
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <Avatar className="size-6 shrink-0 rounded-full border border-slate-200 dark:border-white/10">
                                                    <AvatarImage src="/images/default-avatar.svg" />
                                                    <AvatarFallback className="bg-slate-200 text-[8px] font-bold text-slate-600">
                                                        -
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="font-normal text-slate-400">
                                                    -
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Reporter */}
                                    <div className="flex items-center justify-between py-2.5">
                                        <span className="text-slate-500 dark:text-zinc-400">
                                            Pemberi Tugas
                                        </span>
                                        {task.reporter ? (
                                            <div className="flex items-center gap-2.5">
                                                <Avatar className="size-7 shrink-0 rounded-full border border-slate-200 shadow-2xs dark:border-white/10">
                                                    <AvatarImage
                                                        src={getAvatarUrl(
                                                            task.reporter,
                                                        )}
                                                    />
                                                    <AvatarFallback className="bg-slate-700 text-[9px] font-bold text-white">
                                                        {initials(
                                                            task.reporter.name,
                                                        )}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="min-w-0">
                                                    <p className="max-w-[150px] truncate font-medium text-slate-800 dark:text-zinc-200">
                                                        {task.reporter.name}
                                                    </p>
                                                    <p className="max-w-[150px] truncate text-[10px] text-slate-500 dark:text-zinc-400">
                                                        {task.reporter
                                                            .position_title ||
                                                            'Partner / Delegator'}
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <Avatar className="size-6 shrink-0 rounded-full border border-slate-200 dark:border-white/10">
                                                    <AvatarImage src="/images/default-avatar.svg" />
                                                    <AvatarFallback className="bg-slate-700 text-[8px] font-bold text-white">
                                                        S
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="font-medium text-slate-800 dark:text-zinc-200">
                                                    Sistem
                                                </span>
                                            </div>
                                        )}
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
                                            <span className="text-slate-500 dark:text-zinc-400">
                                                Nomor Perkara
                                            </span>
                                            <Link
                                                href={
                                                    matterRoutes.show?.url
                                                        ? matterRoutes.show.url(
                                                              task.matter.id,
                                                          )
                                                        : `/matters/${task.matter.id}`
                                                }
                                                className="font-mono font-bold text-blue-600 hover:underline dark:text-blue-400"
                                            >
                                                {task.matter.matter_number}
                                            </Link>
                                        </div>

                                        <div className="flex items-center justify-between py-2">
                                            <span className="text-slate-500 dark:text-zinc-400">
                                                Judul Perkara
                                            </span>
                                            <span
                                                className="max-w-[170px] truncate font-medium text-slate-900 dark:text-white"
                                                title={task.matter.title}
                                            >
                                                {task.matter.title}
                                            </span>
                                        </div>

                                        {task.matter.client && (
                                            <div className="flex items-center justify-between py-2">
                                                <span className="text-slate-500 dark:text-zinc-400">
                                                    Klien
                                                </span>
                                                <Link
                                                    href={
                                                        clientRoutes.show?.url
                                                            ? clientRoutes.show.url(
                                                                  task.matter
                                                                      .client
                                                                      .id,
                                                              )
                                                            : `/clients/${task.matter.client.id}`
                                                    }
                                                    className="max-w-[170px] truncate font-medium text-slate-800 hover:text-blue-600 dark:text-zinc-200"
                                                >
                                                    {clientName}
                                                </Link>
                                            </div>
                                        )}

                                        {task.matter.practiceArea && (
                                            <div className="flex items-center justify-between py-2">
                                                <span className="text-slate-500 dark:text-zinc-400">
                                                    Area Praktik
                                                </span>
                                                <span className="font-semibold text-slate-700 dark:text-zinc-300">
                                                    {
                                                        task.matter.practiceArea
                                                            .name
                                                    }
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <p className="py-2 text-xs text-slate-400 italic">
                                        Tugas ini tidak dikaitkan dengan berkas
                                        perkara tertentu.
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
                                        <span className="text-slate-500 dark:text-zinc-400">
                                            Tanggal Mulai
                                        </span>
                                        <span className="font-medium text-slate-900 dark:text-white">
                                            {task.start_date
                                                ? formatDate(task.start_date)
                                                : '-'}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between py-2">
                                        <span className="text-slate-500 dark:text-zinc-400">
                                            Tenggat Waktu
                                        </span>
                                        <span
                                            className={`font-semibold ${isOverdue ? 'font-bold text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'}`}
                                        >
                                            {task.due_at
                                                ? formatDate(task.due_at)
                                                : 'Tidak Terbatas'}
                                        </span>
                                    </div>

                                    {task.completed_at && (
                                        <div className="flex items-center justify-between py-2">
                                            <span className="text-slate-500 dark:text-zinc-400">
                                                Diselesaikan Pada
                                            </span>
                                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                                {formatDate(task.completed_at)}
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between py-2">
                                        <span className="text-slate-500 dark:text-zinc-400">
                                            Dibuat Pada
                                        </span>
                                        <span className="text-slate-700 dark:text-zinc-300">
                                            {formatDate(task.created_at)}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between py-2">
                                        <span className="text-slate-500 dark:text-zinc-400">
                                            Status Tagihan
                                        </span>
                                        <span
                                            className={`font-bold ${task.is_billable ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-zinc-400'}`}
                                        >
                                            {task.is_billable
                                                ? 'Billable to Client'
                                                : 'Non-Billable (Internal)'}
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
                <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-base font-bold">
                            Edit Tugas: {task.task_number}
                        </DialogTitle>
                        <DialogDescription className="text-xs">
                            Perbarui detail instruksi, penanggung jawab, jadwal,
                            dan status pekerjaan.
                        </DialogDescription>
                    </DialogHeader>

                    <form
                        onSubmit={handleEditSubmit}
                        className="space-y-4 pt-2"
                    >
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold">
                                Judul Tugas
                            </Label>
                            <Input
                                value={editForm.data.title}
                                onChange={(e) =>
                                    editForm.setData('title', e.target.value)
                                }
                                className="h-9 text-xs"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold">
                                    Kategori Tugas
                                </Label>
                                <select
                                    value={editForm.data.category}
                                    onChange={(e) =>
                                        editForm.setData(
                                            'category',
                                            e.target.value,
                                        )
                                    }
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
                                <Label className="text-xs font-semibold">
                                    Tahapan Perkara
                                </Label>
                                <select
                                    value={editForm.data.stage}
                                    onChange={(e) =>
                                        editForm.setData(
                                            'stage',
                                            e.target.value,
                                        )
                                    }
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
                                <Label className="text-xs font-semibold">
                                    Pelaksana (Assignee)
                                </Label>
                                <select
                                    value={editForm.data.assignee_id}
                                    onChange={(e) =>
                                        editForm.setData(
                                            'assignee_id',
                                            e.target.value,
                                        )
                                    }
                                    className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs dark:border-white/10 dark:bg-[#191c22]"
                                >
                                    <option value="">
                                        -- Pilih Pelaksana --
                                    </option>
                                    {staffList.map((u) => (
                                        <option key={u.id} value={u.id}>
                                            {u.name} (
                                            {u.position_title || 'Staf'})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold">
                                    Pemeriksa (Reviewer)
                                </Label>
                                <select
                                    value={editForm.data.reviewer_id}
                                    onChange={(e) =>
                                        editForm.setData(
                                            'reviewer_id',
                                            e.target.value,
                                        )
                                    }
                                    className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs dark:border-white/10 dark:bg-[#191c22]"
                                >
                                    <option value="">
                                        -- Tanpa Reviewer --
                                    </option>
                                    {staffList.map((u) => (
                                        <option key={u.id} value={u.id}>
                                            {u.name} (
                                            {u.position_title || 'Partner'})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold">
                                    Status
                                </Label>
                                <select
                                    value={editForm.data.status}
                                    onChange={(e) =>
                                        editForm.setData(
                                            'status',
                                            e.target.value as any,
                                        )
                                    }
                                    className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs dark:border-white/10 dark:bg-[#191c22]"
                                >
                                    <option value="todo">
                                        Belum Mulai (Todo)
                                    </option>
                                    <option value="in_progress">
                                        Sedang Dikerjakan
                                    </option>
                                    <option value="waiting">
                                        Menunggu Respon
                                    </option>
                                    <option value="review">
                                        Menunggu Review
                                    </option>
                                    <option value="completed">
                                        Selesai (Completed)
                                    </option>
                                    <option value="cancelled">
                                        Dibatalkan
                                    </option>
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold">
                                    Prioritas
                                </Label>
                                <select
                                    value={editForm.data.priority}
                                    onChange={(e) =>
                                        editForm.setData(
                                            'priority',
                                            e.target.value as any,
                                        )
                                    }
                                    className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs dark:border-white/10 dark:bg-[#191c22]"
                                >
                                    <option value="low">Rendah (Low)</option>
                                    <option value="normal">Normal</option>
                                    <option value="high">Tinggi (High)</option>
                                    <option value="critical">
                                        Mendesak (Critical)
                                    </option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold">
                                    Tanggal Mulai
                                </Label>
                                <Input
                                    type="date"
                                    value={editForm.data.start_date}
                                    onChange={(e) =>
                                        editForm.setData(
                                            'start_date',
                                            e.target.value,
                                        )
                                    }
                                    className="h-9 text-xs"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold">
                                    Tenggat Waktu
                                </Label>
                                <Input
                                    type="datetime-local"
                                    value={editForm.data.due_at}
                                    onChange={(e) =>
                                        editForm.setData(
                                            'due_at',
                                            e.target.value,
                                        )
                                    }
                                    className="h-9 text-xs"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold">
                                Instruksi / Deskripsi
                            </Label>
                            <textarea
                                rows={4}
                                value={editForm.data.description}
                                onChange={(e) =>
                                    editForm.setData(
                                        'description',
                                        e.target.value,
                                    )
                                }
                                className="w-full rounded-lg border border-slate-200 bg-white p-3 text-xs dark:border-white/10 dark:bg-[#191c22]"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold">
                                Catatan Penyelesaian
                            </Label>
                            <textarea
                                rows={2}
                                value={editForm.data.completion_notes}
                                onChange={(e) =>
                                    editForm.setData(
                                        'completion_notes',
                                        e.target.value,
                                    )
                                }
                                placeholder="Resume hasil pekerjaan..."
                                className="w-full rounded-lg border border-slate-200 bg-white p-3 text-xs dark:border-white/10 dark:bg-[#191c22]"
                            />
                        </div>

                        <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3 dark:border-white/10">
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
                                {editForm.processing ? (
                                    <Spinner className="mr-1 size-3.5" />
                                ) : null}
                                Simpan Perubahan
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* COMPLETE TASK MODAL */}
            <Dialog
                open={isCompleteModalOpen}
                onOpenChange={setIsCompleteModalOpen}
            >
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-base font-bold text-emerald-700 dark:text-emerald-400">
                            <CheckCircle2 className="size-5" />
                            Selesaikan Tugas: {task.task_number}
                        </DialogTitle>
                        <DialogDescription className="text-xs">
                            Masukkan catatan resume hasil penyelesaian tugas
                            ini.
                        </DialogDescription>
                    </DialogHeader>

                    <form
                        onSubmit={handleCompleteSubmit}
                        className="space-y-3.5 pt-2"
                    >
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold">
                                Catatan / Resume Hasil Penyelesaian
                            </Label>
                            <textarea
                                rows={3}
                                placeholder="Contoh: Draf gugatan telah diselesaikan dan dikirim ke klien untuk ditandatangani..."
                                value={completeForm.data.completion_notes}
                                onChange={(e) =>
                                    completeForm.setData(
                                        'completion_notes',
                                        e.target.value,
                                    )
                                }
                                className="w-full rounded-lg border border-slate-200 bg-white p-3 text-xs dark:border-white/10 dark:bg-[#191c22]"
                            />
                        </div>

                        <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-2 dark:border-white/10">
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
                                {completeForm.processing ? (
                                    <Spinner className="mr-1 size-3.5" />
                                ) : null}
                                Konfirmasi Selesai
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* SUBMIT REVIEW MODAL */}
            <Dialog
                open={isSubmitReviewOpen}
                onOpenChange={setIsSubmitReviewOpen}
            >
                <DialogContent className="max-h-[90vh] w-full max-w-[calc(100vw-2rem)] min-w-0 overflow-x-hidden overflow-y-auto rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xl sm:max-w-2xl sm:p-6 dark:border-white/10 dark:bg-[#14161b]">
                    <DialogHeader className="w-full min-w-0 border-b border-slate-100 pb-3.5 dark:border-white/[0.06]">
                        <div className="flex w-full min-w-0 items-start gap-3">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-blue-200/70 bg-blue-50 text-blue-600 shadow-2xs dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-400">
                                <Send className="size-4.5" />
                            </div>
                            <div className="min-w-0 flex-1 space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
                                        Ajukan Review Tugas
                                    </DialogTitle>
                                    <span className="inline-flex shrink-0 items-center rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[11px] font-semibold text-slate-700 dark:bg-zinc-800 dark:text-zinc-300">
                                        {task.task_number}
                                    </span>
                                </div>
                                <DialogDescription className="text-xs text-slate-500 dark:text-zinc-400">
                                    Kirimkan tugas ini kepada Pemeriksa untuk
                                    ditelaah, dievaluasi, dan disetujui.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <form
                        onSubmit={handleSubmitReview}
                        className="flex w-full max-w-full min-w-0 flex-col space-y-4 pt-1"
                    >
                        {/* Reviewer / Target Destination Card */}
                        {(() => {
                            const targetReviewer =
                                task.reviewer || task.reporter;
                            const avatarSrc = getAvatarUrl(targetReviewer);

                            return (
                                <div className="box-border w-full max-w-full min-w-0 rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5 sm:p-4 dark:border-white/10 dark:bg-[#191c22]">
                                    <div className="mb-2.5 flex w-full min-w-0 flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 pb-2 dark:border-white/[0.06]">
                                        <div className="flex shrink-0 items-center gap-1.5 text-[11px] font-bold tracking-wider text-blue-600 uppercase dark:text-blue-400">
                                            <UserCheck className="size-3.5" />
                                            <span>
                                                Pemeriksa (Reviewer) Dituju
                                            </span>
                                        </div>
                                        <span className="shrink-0 text-[10px] font-medium text-slate-400 dark:text-zinc-500">
                                            Penerima Pengajuan
                                        </span>
                                    </div>

                                    <div className="flex w-full min-w-0 items-start gap-3.5 sm:items-center">
                                        <div className="relative shrink-0">
                                            <Avatar className="size-11 shrink-0 overflow-hidden rounded-full border-2 border-white bg-slate-100 shadow-xs sm:size-12 dark:border-zinc-800 dark:bg-zinc-800">
                                                <AvatarImage
                                                    src={avatarSrc}
                                                    alt={
                                                        targetReviewer?.name ||
                                                        'Reviewer'
                                                    }
                                                    className="size-full object-cover"
                                                />
                                                <AvatarFallback className="overflow-hidden bg-slate-100 p-0 dark:bg-zinc-800">
                                                    <img
                                                        src="/images/default-avatar.svg"
                                                        alt={
                                                            targetReviewer?.name ||
                                                            'Default Avatar'
                                                        }
                                                        className="size-full object-cover"
                                                    />
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="absolute -right-0.5 -bottom-0.5 flex size-4 items-center justify-center rounded-full bg-blue-600 text-white ring-2 ring-white dark:ring-[#191c22]">
                                                <UserCheck className="size-2.5" />
                                            </div>
                                        </div>

                                        <div className="min-w-0 flex-1 space-y-0.5">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h4 className="min-w-0 truncate text-sm font-bold text-slate-900 dark:text-white">
                                                    {targetReviewer?.name ||
                                                        'Partner / Supervising Partner'}
                                                </h4>
                                                {!task.reviewer &&
                                                task.reporter ? (
                                                    <span className="py-0.2 inline-flex shrink-0 rounded border border-amber-200/60 bg-amber-50 px-1.5 text-[9px] font-semibold text-amber-700 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-300">
                                                        Pembuat Tugas (Reviewer)
                                                    </span>
                                                ) : (
                                                    <span className="py-0.2 inline-flex shrink-0 rounded border border-blue-200/60 bg-blue-50 px-1.5 text-[9px] font-semibold text-blue-700 dark:border-blue-900/40 dark:bg-blue-950/40 dark:text-blue-300">
                                                        Pemeriksa Berkas
                                                    </span>
                                                )}
                                            </div>
                                            <p className="min-w-0 truncate text-xs text-slate-500 dark:text-zinc-400">
                                                {targetReviewer?.position_title ||
                                                    'Managing Partner / Advokat Senior'}
                                                {targetReviewer?.department
                                                    ? ` · ${targetReviewer.department}`
                                                    : ''}
                                            </p>
                                            {targetReviewer?.email && (
                                                <p className="min-w-0 truncate text-[11px] text-slate-400 dark:text-zinc-500">
                                                    {targetReviewer.email}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Task Context Snippet */}
                                    <div className="mt-3 box-border w-full max-w-full min-w-0 space-y-1 rounded-lg border border-slate-200/60 bg-white/90 p-3 text-xs dark:border-white/[0.04] dark:bg-[#121418]">
                                        <div className="flex w-full min-w-0 items-center gap-2 font-semibold text-slate-700 dark:text-zinc-200">
                                            <FileText className="size-3.5 shrink-0 text-slate-400" />
                                            <span className="min-w-0 flex-1 truncate">
                                                {task.title}
                                            </span>
                                        </div>
                                        {task.matter && (
                                            <div className="flex w-full min-w-0 items-center gap-2 text-[11px] text-slate-500 dark:text-zinc-400">
                                                <Scale className="size-3 shrink-0 text-slate-400" />
                                                <span className="min-w-0 flex-1 truncate">
                                                    Perkara:{' '}
                                                    {task.matter.matter_number}{' '}
                                                    · {task.matter.title}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })()}

                        {/* Status workflow transition */}
                        <div className="box-border flex w-full max-w-full min-w-0 flex-wrap items-center justify-between gap-2 rounded-lg border border-blue-100/80 bg-blue-50/50 px-3.5 py-2.5 text-xs text-blue-900 dark:border-blue-900/40 dark:bg-blue-950/20 dark:text-blue-300">
                            <div className="flex shrink-0 items-center gap-2">
                                <span className="inline-flex items-center rounded bg-blue-100/80 px-2 py-0.5 text-[10.5px] font-bold text-blue-800 dark:bg-blue-900/60 dark:text-blue-200">
                                    Dikerjakan
                                </span>
                                <ArrowRight className="size-3 text-blue-400" />
                                <span className="inline-flex items-center rounded bg-amber-100/80 px-2 py-0.5 text-[10.5px] font-bold text-amber-800 dark:bg-amber-900/60 dark:text-amber-200">
                                    Menunggu Review
                                </span>
                            </div>
                            <span className="shrink-0 text-[10px] font-medium text-slate-500 dark:text-zinc-400">
                                Status otomatis diperbarui
                            </span>
                        </div>

                        {/* Catatan / Notes Textarea */}
                        <div className="w-full max-w-full min-w-0 space-y-2">
                            <div className="flex w-full min-w-0 items-center justify-between">
                                <Label
                                    htmlFor="review_notes"
                                    className="text-xs font-semibold text-slate-700 dark:text-zinc-200"
                                >
                                    Catatan Hasil Pengerjaan / Resume{' '}
                                    <span className="text-[11px] font-normal text-slate-400">
                                        (Opsional)
                                    </span>
                                </Label>
                                <span className="font-mono text-[10.5px] text-slate-400">
                                    {reviewForm.data.notes.length}/2000
                                </span>
                            </div>

                            {/* Quick Note Snippets in structured wrap */}
                            <div className="w-full min-w-0 space-y-1">
                                <span className="text-[10px] font-medium text-slate-400 dark:text-zinc-500">
                                    Pilihan Cepat:
                                </span>
                                <div className="flex w-full min-w-0 flex-wrap gap-1.5">
                                    {[
                                        'Draf dokumen telah selesai dibuat & diunggah',
                                        'Seluruh checklist tugas telah diselesaikan',
                                        'Mohon review dan arahan koreksi posita',
                                    ].map((template) => (
                                        <button
                                            key={template}
                                            type="button"
                                            onClick={() => {
                                                const current =
                                                    reviewForm.data.notes;
                                                const updated = current
                                                    ? `${current}\n${template}`
                                                    : template;
                                                reviewForm.setData(
                                                    'notes',
                                                    updated,
                                                );
                                            }}
                                            className="inline-flex max-w-full items-center rounded-md border border-slate-200 bg-white px-2.5 py-1 text-left text-[10.5px] font-medium break-words whitespace-normal text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:border-white/10 dark:bg-[#14161b] dark:text-zinc-400 dark:hover:bg-zinc-800"
                                        >
                                            + {template}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <textarea
                                id="review_notes"
                                rows={3}
                                maxLength={2000}
                                placeholder="Contoh: Draf gugatan dan somasi termin 1 telah selesai dibuat dan diunggah pada tab Dokumen. Mohon review dan arahan koreksi..."
                                value={reviewForm.data.notes}
                                onChange={(e) =>
                                    reviewForm.setData('notes', e.target.value)
                                }
                                className="box-border w-full max-w-full min-w-0 resize-none rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-white/10 dark:bg-[#191c22] dark:text-white dark:placeholder:text-zinc-500"
                            />
                        </div>

                        {/* Info Note */}
                        <div className="box-border flex w-full max-w-full min-w-0 items-start gap-2.5 rounded-lg border border-slate-200/60 bg-slate-50 px-3.5 py-2.5 text-[11px] text-slate-600 dark:border-white/[0.06] dark:bg-zinc-900/40 dark:text-zinc-400">
                            <Info className="mt-0.5 size-3.5 shrink-0 text-blue-600 dark:text-blue-400" />
                            <span className="min-w-0 flex-1 leading-relaxed">
                                {task.reviewer?.name || task.reporter?.name
                                    ? `${task.reviewer?.name || task.reporter?.name} akan menerima notifikasi pengajuan review dan catatan ini akan tercatat pada aktivitas tugas.`
                                    : 'Pemeriksa akan menerima notifikasi dan catatan ini akan otomatis dicatat pada riwayat tugas.'}
                            </span>
                        </div>

                        {/* Actions */}
                        <div className="flex w-full min-w-0 items-center justify-end gap-2.5 border-t border-slate-100 pt-3 dark:border-white/10">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setIsSubmitReviewOpen(false)}
                                className="h-9 px-4 text-xs font-semibold"
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                size="sm"
                                disabled={reviewForm.processing}
                                className="h-9 shrink-0 gap-1.5 rounded-lg bg-blue-600 px-4.5 text-xs font-semibold text-white shadow-2xs transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-500"
                            >
                                {reviewForm.processing ? (
                                    <Spinner className="size-3.5" />
                                ) : (
                                    <Send className="size-3.5" />
                                )}
                                Kirim Pengajuan Review
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* APPROVE TASK MODAL */}
            <Dialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-base font-bold text-emerald-700 dark:text-emerald-400">
                            <CheckCircle2 className="size-5" />
                            Setujui &amp; Selesaikan Tugas: {task.task_number}
                        </DialogTitle>
                        <DialogDescription className="text-xs">
                            Konfirmasi bahwa hasil pengerjaan telah diperiksa
                            dan disetujui. Tugas akan ditandai selesai.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleApprove} className="space-y-3.5 pt-2">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold">
                                Catatan Persetujuan / Evaluasi (Opsional)
                            </Label>
                            <textarea
                                rows={3}
                                placeholder="Contoh: Draf sangat baik dan sesuai instruksi. Silakan diproses untuk pengiriman ke klien..."
                                value={approveForm.data.remarks}
                                onChange={(e) =>
                                    approveForm.setData(
                                        'remarks',
                                        e.target.value,
                                    )
                                }
                                className="w-full rounded-lg border border-slate-200 bg-white p-3 text-xs dark:border-white/10 dark:bg-[#191c22]"
                            />
                        </div>

                        <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-2 dark:border-white/10">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setIsApproveOpen(false)}
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                size="sm"
                                disabled={approveForm.processing}
                                className="bg-emerald-600 text-white hover:bg-emerald-700"
                            >
                                {approveForm.processing ? (
                                    <Spinner className="mr-1 size-3.5" />
                                ) : null}
                                Setujui &amp; Selesaikan
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* REQUEST REVISION MODAL */}
            <Dialog open={isRevisionOpen} onOpenChange={setIsRevisionOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-base font-bold text-amber-700 dark:text-amber-400">
                            <RotateCcw className="size-5" />
                            Instruksi Revisi: {task.task_number}
                        </DialogTitle>
                        <DialogDescription className="text-xs">
                            Masukkan poin-poin perbaikan yang harus direvisi
                            oleh pelaksana tugas.
                        </DialogDescription>
                    </DialogHeader>

                    <form
                        onSubmit={handleRequestRevision}
                        className="space-y-3.5 pt-2"
                    >
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold">
                                Catatan / Poin Perbaikan{' '}
                                <span className="text-rose-500">*</span>
                            </Label>
                            <textarea
                                rows={4}
                                required
                                placeholder="Contoh: Tolong lengkapi dasar hukum pada posita gugatan nomor 4 dan sesuaikan petitum ganti kerugian immateriel..."
                                value={revisionForm.data.feedback}
                                onChange={(e) =>
                                    revisionForm.setData(
                                        'feedback',
                                        e.target.value,
                                    )
                                }
                                className="w-full rounded-lg border border-slate-200 bg-white p-3 text-xs dark:border-white/10 dark:bg-[#191c22]"
                            />
                        </div>

                        <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-2 dark:border-white/10">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setIsRevisionOpen(false)}
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                size="sm"
                                disabled={
                                    revisionForm.processing ||
                                    !revisionForm.data.feedback.trim()
                                }
                                className="bg-amber-600 text-white hover:bg-amber-700"
                            >
                                {revisionForm.processing ? (
                                    <Spinner className="mr-1 size-3.5" />
                                ) : null}
                                Kirim Permintaan Revisi
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
        {
            title: 'Daftar Tugas',
            href: taskRoutes.index?.url ? taskRoutes.index.url() : '/tasks',
        },
        { title: 'Detail Tugas', href: '#' },
    ],
};
