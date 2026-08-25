import { Head, Link, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowRight,
    Briefcase,
    Calendar as CalendarIcon,
    CheckCircle2,
    CheckSquare,
    ChevronLeft,
    ChevronRight,
    Clock,
    CreditCard,
    FileCheck2,
    FileEdit,
    FilePlus2,
    FileText,
    FolderKanban,
    Gavel,
    Plus,
    Receipt,
    Scale,
    ShieldAlert,
    ShieldCheck,
    Sparkles,
    TrendingUp,
    UploadCloud,
    User,
    UserPlus,
    Users,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { WelcomeModal } from '@/components/welcome-modal';
import { useInitials } from '@/hooks/use-initials';
import { formatBytes, formatDate } from '@/lib/format';
import { dashboard } from '@/routes';
import * as auditRoutes from '@/routes/admin/audit';
import * as calendarRoutes from '@/routes/calendar';
import * as clientsRoutes from '@/routes/clients';
import * as documentsRoutes from '@/routes/documents';
import * as financeRoutes from '@/routes/finance';
import * as mattersRoutes from '@/routes/matters';
import * as tasksRoutes from '@/routes/tasks';

type MetricData = {
    active_matters: number;
    corporate_matters: number;
    litigation_matters: number;
    open_tasks: number;
    my_tasks: number;
    urgent_tasks: number;
    critical_deadlines: number;
    today_deadlines: number;
    total_documents: number;
    review_documents: number;
    recent_documents: number;
    doc_approved_count?: number;
    doc_filed_count?: number;
};

type ExecutiveActionItem = {
    id: string | number;
    title: string;
    matter: string;
    matter_number?: string;
    priority?: string;
    status?: string;
    badge_label: string;
    badge_color: 'rose' | 'amber' | 'blue';
    due_text: string;
    assignee_name: string;
    assignee_avatar?: string | null;
};

type PriorityCenterData = {
    high_priority?: {
        id: string;
        title: string;
        matter: string;
        matter_number: string;
        deadline_text: string;
        assignee_name: string;
        assignee_avatar?: string | null;
    } | null;
    waiting_approval?: {
        id: string;
        title: string;
        matter: string;
        matter_number: string;
        assignee_name: string;
        assignee_avatar?: string | null;
    } | null;
    completed_today_count: number;
    team_members: Array<{ id: string; name: string; avatar?: string | null }>;
};

type BriefingItem = {
    id: string;
    time: string;
    type: string;
    title: string;
    matter: string;
    matter_number?: string;
    tag: string;
    assignee_name: string;
    assignee_avatar?: string;
};

type UpcomingEventItem = {
    id: string;
    time: string;
    title: string;
    subtitle: string;
    category: string;
    date: string;
    full_date?: string;
};

type MatterHealthItem = {
    id: string;
    title: string;
    code: string;
    status: string;
    progress: number;
    next_action: string;
    risk: string;
};

type ActivityItem = {
    id: string;
    event: string;
    badge?: string;
    badge_color?: string;
    title: string;
    detail?: string;
    subject: string;
    actor: string;
    actor_avatar?: string;
    icon_type?: string;
    color?: string;
    time: string;
    created_at?: string;
    url?: string | null;
};

type Task = {
    id: string;
    title: string;
    priority: string;
    status: string;
    due_at?: string;
    updated_at?: string;
    matter?: {
        id: string;
        matter_number: string;
        title: string;
        client?: { id: string; display_name: string };
    };
    assignee?: {
        id: string;
        name: string;
        avatar_url?: string;
        avatar_path?: string;
    };
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

type WorkQueueTabs = 'pending' | 'in_progress' | 'completed';

export default function Dashboard({
    metrics,
    priority_center,
    executive_actions,
    completed_today_count,
    briefings = [],
    upcoming_events = [],
    work_queue,
    matter_health = [],
    activities = [],
    tasks = [],
    deadlines = [],
    events = [],
    matters = [],
    documents = [],
}: {
    metrics?: MetricData;
    priority_center?: PriorityCenterData;
    executive_actions?: ExecutiveActionItem[];
    completed_today_count?: number;
    briefings?: BriefingItem[];
    upcoming_events?: UpcomingEventItem[];
    work_queue?: {
        pending?: Task[];
        in_progress?: Task[];
        completed?: Task[];
    };
    matter_health?: MatterHealthItem[];
    activities?: ActivityItem[];
    tasks?: Task[];
    deadlines?: Deadline[];
    events?: Event[];
    matters?: Matter[];
    documents?: Document[];
}) {
    const { auth } = usePage().props;
    const getInitials = useInitials();

    const fullName = auth.user?.name ?? 'Advokat & Partner';

    const todayFormatted = useMemo(() => {
        return new Intl.DateTimeFormat('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        }).format(new Date());
    }, []);

    // Metric Counters from Real DB Props
    const activeMattersCount = metrics?.active_matters ?? matters.length ?? 0;
    const corporateCount = metrics?.corporate_matters ?? 0;
    const litigationCount = metrics?.litigation_matters ?? 0;
    const openTasksCount = metrics?.open_tasks ?? tasks.length ?? 0;
    const urgentTasksCount = metrics?.urgent_tasks ?? 0;
    const criticalDeadlinesCount =
        metrics?.critical_deadlines ?? deadlines.length ?? 0;
    const todayDeadlinesCount = metrics?.today_deadlines ?? 0;
    const totalDocsCount = metrics?.total_documents ?? documents.length ?? 0;
    const reviewDocsCount = metrics?.review_documents ?? 0;
    const docApprovedCount = metrics?.doc_approved_count ?? 0;
    const docFiledCount = metrics?.doc_filed_count ?? 0;

    // Interactive State
    const [queueTab, setQueueTab] = useState<WorkQueueTabs>('pending');
    const [selectedDateIndex, setSelectedDateIndex] = useState<number>(6); // Default: today
    const [weekOffset, setWeekOffset] = useState<number>(0);

    // Dynamic 7-day strip
    const weekDays = useMemo(() => {
        const list = [];
        const now = new Date();
        const todayString = now.toISOString().slice(0, 10);
        const dayOfWeek = now.getDay();
        const monday = new Date(now);
        monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7) + weekOffset * 7);

        for (let i = 0; i < 7; i++) {
            const d = new Date(monday);
            d.setDate(monday.getDate() + i);
            const dateString = d.toISOString().slice(0, 10);
            const dayName = new Intl.DateTimeFormat('id-ID', {
                weekday: 'short',
            }).format(d);
            const dayNum = d.getDate();
            list.push({
                dayName,
                dayNum,
                dateObj: d,
                dateString,
                isToday: dateString === todayString,
            });
        }
        return list;
    }, [weekOffset]);

    const activeDay =
        weekDays[selectedDateIndex] ?? weekDays[weekDays.length - 1];

    const activeDayFormatted = useMemo(() => {
        if (!activeDay?.dateObj) return todayFormatted;
        const formatted = new Intl.DateTimeFormat('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        }).format(activeDay.dateObj);
        return activeDay.isToday ? `Hari ini, ${formatted}` : formatted;
    }, [activeDay, todayFormatted]);

    // Dynamic filtered events for the chosen calendar day
    const filteredDayEvents = useMemo(() => {
        if (!activeDay?.dateString) return upcoming_events;
        const found = upcoming_events.filter(
            (ev) => ev.date === activeDay.dateString,
        );
        return found.length > 0
            ? found
            : activeDay.isToday
              ? upcoming_events.slice(0, 3)
              : [];
    }, [upcoming_events, activeDay]);

    // Current Work Queue items from real DB
    const currentQueueItems = useMemo(() => {
        if (!work_queue) return [];
        return work_queue[queueTab] ?? [];
    }, [work_queue, queueTab]);

    const pendingCount = work_queue?.pending?.length ?? 0;
    const reviewCount = work_queue?.in_progress?.length ?? 0;
    const completedCount = work_queue?.completed?.length ?? 0;

    return (
        <>
            <Head title="Workspace Dashboard" />

            <WelcomeModal
                user={auth.user}
                activeMattersCount={activeMattersCount}
                openTasksCount={openTasksCount}
                todayDeadlinesCount={todayDeadlinesCount}
            />

            <div className="min-h-screen bg-[#fafafc] pb-20 dark:bg-[#0c0d10]">
                <main className="mx-auto max-w-7xl space-y-6 px-4 py-5 sm:px-6 lg:px-8">
                    {/* 1. Sleek Notion-Style Header */}
                    <div className="flex flex-col justify-between gap-4 border-b border-slate-200/60 pb-5 sm:flex-row sm:items-center dark:border-white/[0.06]">
                        <div className="space-y-1">
                            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                                Halo, {fullName}
                            </h1>
                            <p className="text-xs text-slate-500 dark:text-zinc-400">
                                {todayFormatted} ·{' '}
                                <span className="font-semibold text-slate-700 dark:text-zinc-300">
                                    {activeMattersCount}
                                </span>{' '}
                                perkara aktif ·{' '}
                                <span className="font-semibold text-slate-700 dark:text-zinc-300">
                                    {openTasksCount}
                                </span>{' '}
                                tugas berjalan
                            </p>
                        </div>

                        {/* Top Action Cluster */}
                        <div className="flex shrink-0 items-center gap-2">
                            <Button
                                asChild
                                variant="outline"
                                className="h-8 rounded-lg border-slate-200/80 bg-white px-3 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 active:scale-[0.98] dark:border-white/10 dark:bg-[#16181d] dark:text-zinc-300"
                            >
                                <Link
                                    href={tasksRoutes.index({
                                        query: { create: 1 },
                                    })}
                                >
                                    <Plus className="mr-1 size-3.5 text-slate-400" />
                                    Tugas Baru
                                </Link>
                            </Button>
                            <Button
                                asChild
                                className="h-8 rounded-lg bg-slate-900 px-3.5 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 active:scale-[0.98] dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                            >
                                <Link href={mattersRoutes.create()}>
                                    <Plus className="mr-1 size-3.5" />
                                    Perkara Baru
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* 2. Streamlined KPI Bento Cards (Compact & Slim) */}
                    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {/* Card 1: Perkara Aktif */}
                        <div className="group rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[11px] font-semibold">
                                    PERKARA AKTIF
                                </span>
                                <Briefcase className="size-3.5 text-slate-400 transition-colors group-hover:text-blue-600 dark:text-zinc-500" />
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
                                <span className="truncate">
                                    Portofolio Berjalan
                                </span>
                                <Link
                                    href={mattersRoutes.index()}
                                    className="font-semibold text-blue-600 hover:underline dark:text-blue-400"
                                >
                                    Lihat →
                                </Link>
                            </div>
                        </div>

                        {/* Card 2: Tugas Terbuka */}
                        <div className="group rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[11px] font-semibold">
                                    TUGAS TERBUKA
                                </span>
                                <CheckCircle2 className="size-3.5 text-slate-400 transition-colors group-hover:text-emerald-600 dark:text-zinc-500" />
                            </div>
                            <div className="mt-2 flex items-baseline justify-between">
                                <span className="font-mono text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    {openTasksCount}
                                </span>
                                <span className="text-[11px] font-medium text-rose-600 dark:text-rose-400">
                                    {urgentTasksCount} prioritas tinggi
                                </span>
                            </div>
                            <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-500 dark:border-white/[0.04]">
                                <span className="truncate">Distribusi Tim</span>
                                <Link
                                    href={tasksRoutes.index()}
                                    className="font-semibold text-emerald-600 hover:underline dark:text-emerald-400"
                                >
                                    Kelola →
                                </Link>
                            </div>
                        </div>

                        {/* Card 3: Tenggat & Sidang */}
                        <div className="group rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[11px] font-semibold">
                                    TENGGAT &amp; SIDANG
                                </span>
                                <Clock className="size-3.5 text-slate-400 transition-colors group-hover:text-amber-600 dark:text-zinc-500" />
                            </div>
                            <div className="mt-2 flex items-baseline justify-between">
                                <span className="font-mono text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    {criticalDeadlinesCount}
                                </span>
                                <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400">
                                    {todayDeadlinesCount > 0
                                        ? `${todayDeadlinesCount} hari ini`
                                        : 'minggu ini'}
                                </span>
                            </div>
                            <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-500 dark:border-white/[0.04]">
                                <span className="truncate">
                                    Jadwal Sidang &amp; Deadline
                                </span>
                                <Link
                                    href={calendarRoutes.index()}
                                    className="font-semibold text-amber-600 hover:underline dark:text-amber-400"
                                >
                                    Kalender →
                                </Link>
                            </div>
                        </div>

                        {/* Card 4: Dokumen Menunggu Review */}
                        <div className="group rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[11px] font-semibold">
                                    DOKUMEN &amp; REVIEW
                                </span>
                                <FileText className="size-3.5 text-slate-400 transition-colors group-hover:text-purple-600 dark:text-zinc-500" />
                            </div>
                            <div className="mt-2 flex items-baseline justify-between">
                                <span className="font-mono text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    {reviewDocsCount}
                                </span>
                                <span className="text-[11px] font-medium text-slate-500 dark:text-zinc-400">
                                    dari {totalDocsCount} berkas
                                </span>
                            </div>
                            <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-500 dark:border-white/[0.04]">
                                <span className="truncate">
                                    {docApprovedCount} Approved ·{' '}
                                    {docFiledCount} Filed
                                </span>
                                <Link
                                    href={documentsRoutes.index()}
                                    className="font-semibold text-purple-600 hover:underline dark:text-purple-400"
                                >
                                    Arsip →
                                </Link>
                            </div>
                        </div>
                    </section>

                    {/* 3. Main Bento Hub: Symmetrical 2x2 Grid (Equal Heights & Internal Scroll on Overflow) */}
                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                        {/* [Row 1, Col 1] Widget 1: Work Queue & Tugas */}
                        <div className="flex h-[390px] flex-col rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex shrink-0 items-center justify-between border-b border-slate-100 pb-3 dark:border-white/[0.05]">
                                <div className="flex items-center gap-2">
                                    <h2 className="text-xs font-bold text-slate-900 dark:text-white">
                                        Work Queue &amp; Tugas
                                    </h2>
                                    <span className="font-mono text-[10px] text-slate-400">
                                        ({currentQueueItems.length})
                                    </span>
                                </div>
                                {/* Sleek Segmented Switch */}
                                <div className="flex items-center rounded-lg bg-slate-100 p-0.5 text-xs dark:bg-white/[0.04]">
                                    <button
                                        type="button"
                                        onClick={() => setQueueTab('pending')}
                                        className={`cursor-pointer rounded-md px-2 py-0.5 text-[11px] font-semibold transition-all ${
                                            queueTab === 'pending'
                                                ? 'bg-white text-slate-900 shadow-2xs dark:bg-zinc-800 dark:text-white'
                                                : 'text-slate-500 hover:text-slate-900 dark:text-zinc-400'
                                        }`}
                                    >
                                        Menunggu ({pendingCount})
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setQueueTab('in_progress')
                                        }
                                        className={`cursor-pointer rounded-md px-2 py-0.5 text-[11px] font-semibold transition-all ${
                                            queueTab === 'in_progress'
                                                ? 'bg-white text-slate-900 shadow-2xs dark:bg-zinc-800 dark:text-white'
                                                : 'text-slate-500 hover:text-slate-900 dark:text-zinc-400'
                                        }`}
                                    >
                                        Review ({reviewCount})
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setQueueTab('completed')}
                                        className={`cursor-pointer rounded-md px-2 py-0.5 text-[11px] font-semibold transition-all ${
                                            queueTab === 'completed'
                                                ? 'bg-white text-slate-900 shadow-2xs dark:bg-zinc-800 dark:text-white'
                                                : 'text-slate-500 hover:text-slate-900 dark:text-zinc-400'
                                        }`}
                                    >
                                        Selesai ({completedCount})
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-1 flex-col overflow-hidden py-1">
                                {currentQueueItems.length === 0 ? (
                                    <div className="flex flex-1 flex-col items-center justify-center px-4 py-4 text-center">
                                        <div className="flex size-9 items-center justify-center rounded-xl bg-slate-100 text-slate-400 dark:bg-white/[0.04] dark:text-zinc-500">
                                            <CheckCircle2 className="size-4.5 text-slate-400 dark:text-zinc-500" />
                                        </div>
                                        <p className="mt-2 text-xs font-bold text-slate-800 dark:text-zinc-200">
                                            Antrean Tugas Bersih
                                        </p>
                                        <p className="mt-0.5 max-w-xs text-[11px] text-slate-400 dark:text-zinc-500">
                                            {queueTab === 'completed'
                                                ? 'Belum ada tugas yang selesai tercatat.'
                                                : queueTab === 'in_progress'
                                                  ? 'Tidak ada tugas yang sedang dalam tahap review.'
                                                  : 'Tidak ada tugas yang menunggu pengerjaan saat ini.'}
                                        </p>
                                        {queueTab === 'pending' && (
                                            <Button
                                                asChild
                                                variant="ghost"
                                                size="sm"
                                                className="mt-2.5 h-7 rounded-lg text-[11px] font-bold text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/40"
                                            >
                                                <Link
                                                    href={tasksRoutes.index({
                                                        query: { create: 1 },
                                                    })}
                                                >
                                                    <Plus className="mr-1 size-3" />{' '}
                                                    Buat Tugas Baru
                                                </Link>
                                            </Button>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex-1 [scrollbar-width:thin] divide-y divide-slate-100 overflow-y-auto pr-1 dark:divide-white/[0.04]">
                                        {currentQueueItems.map((item, idx) => {
                                            const isUrgent =
                                                item.priority === 'high';

                                            return (
                                                <div
                                                    key={item.id || idx}
                                                    className="group flex items-center justify-between gap-3 py-2.5 transition-colors hover:bg-slate-50/50 dark:hover:bg-white/[0.02]"
                                                >
                                                    <div className="min-w-0 flex-1 space-y-0.5">
                                                        <div className="flex items-center gap-2">
                                                            <span
                                                                className={`size-1.5 shrink-0 rounded-full ${
                                                                    isUrgent
                                                                        ? 'bg-rose-500'
                                                                        : queueTab ===
                                                                            'completed'
                                                                          ? 'bg-emerald-500'
                                                                          : 'bg-blue-500'
                                                                }`}
                                                            />
                                                            <p
                                                                className="truncate text-xs font-semibold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400"
                                                                title={
                                                                    item.title
                                                                }
                                                            >
                                                                {item.title}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 pl-3.5 text-[11px] text-slate-500 dark:text-zinc-400">
                                                            <span className="font-mono text-slate-700 dark:text-zinc-300">
                                                                {item.matter
                                                                    ?.matter_number ??
                                                                    'RPK-TASK'}
                                                            </span>
                                                            <span>·</span>
                                                            <span className="truncate">
                                                                {item.matter
                                                                    ?.client
                                                                    ?.display_name ??
                                                                    item.matter
                                                                        ?.title ??
                                                                    'Internal'}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="flex shrink-0 items-center gap-2.5 text-right">
                                                        <span
                                                            className={`rounded-md px-1.5 py-0.5 font-mono text-[10px] font-semibold ${
                                                                isUrgent
                                                                    ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300'
                                                                    : 'bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-300'
                                                            }`}
                                                        >
                                                            {item.due_at
                                                                ? formatDate(
                                                                      item.due_at,
                                                                  )
                                                                : 'Hari ini'}
                                                        </span>
                                                        <TooltipProvider
                                                            delayDuration={100}
                                                        >
                                                            <Tooltip>
                                                                <TooltipTrigger
                                                                    asChild
                                                                >
                                                                    <Avatar className="size-5 shrink-0 rounded-full border border-slate-200/80 dark:border-white/10">
                                                                        <AvatarImage
                                                                            src={
                                                                                item
                                                                                    .assignee
                                                                                    ?.avatar_url
                                                                            }
                                                                        />
                                                                        <AvatarFallback className="text-[8px] font-bold">
                                                                            {getInitials(
                                                                                item
                                                                                    .assignee
                                                                                    ?.name ??
                                                                                    'FR',
                                                                            )}
                                                                        </AvatarFallback>
                                                                    </Avatar>
                                                                </TooltipTrigger>
                                                                <TooltipContent
                                                                    side="top"
                                                                    className="bg-slate-900 px-2 py-0.5 text-[10px] font-medium text-white shadow-md dark:bg-zinc-800"
                                                                >
                                                                    {item
                                                                        .assignee
                                                                        ?.name ??
                                                                        'Fajar Roni'}
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            <div className="mt-auto shrink-0 border-t border-slate-100 pt-2.5 text-right dark:border-white/[0.04]">
                                <Link
                                    href={tasksRoutes.index()}
                                    className="text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white"
                                >
                                    Buka Seluruh Daftar Tugas →
                                </Link>
                            </div>
                        </div>

                        {/* [Row 1, Col 2] Widget 2: Jadwal Sidang & Agenda */}
                        <div className="flex h-[390px] flex-col rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex shrink-0 items-center justify-between border-b border-slate-100 pb-3 dark:border-white/[0.05]">
                                <h2 className="text-xs font-bold text-slate-900 dark:text-white">
                                    Jadwal Sidang &amp; Agenda
                                </h2>
                                <Link
                                    href={calendarRoutes.index()}
                                    className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white"
                                >
                                    Buka Kalender →
                                </Link>
                            </div>

                            {/* Mini 7-Day Clean Strip */}
                            <div className="mt-3 grid shrink-0 grid-cols-7 gap-1 rounded-lg bg-slate-50 p-1 text-center dark:bg-white/[0.03]">
                                {weekDays.map((d, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() =>
                                            setSelectedDateIndex(index)
                                        }
                                        className={`flex cursor-pointer flex-col items-center justify-center rounded-md py-1 text-xs transition-all ${
                                            selectedDateIndex === index
                                                ? 'bg-slate-900 font-bold text-white shadow-2xs dark:bg-white dark:text-slate-900'
                                                : 'text-slate-600 hover:bg-white hover:text-slate-900 dark:text-zinc-300 dark:hover:bg-white/[0.06]'
                                        }`}
                                    >
                                        <span className="text-[9px] uppercase opacity-75">
                                            {d.dayName}
                                        </span>
                                        <span className="font-mono text-xs font-semibold">
                                            {d.dayNum}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            <div className="mt-2.5 flex shrink-0 items-center justify-between border-b border-slate-100 pb-1.5 text-[11px] dark:border-white/[0.04]">
                                <span className="font-semibold text-slate-800 dark:text-zinc-200">
                                    {activeDayFormatted}
                                </span>
                                <span className="font-mono text-[10px] text-slate-400">
                                    {filteredDayEvents.length} Agenda
                                </span>
                            </div>

                            <div className="flex flex-1 flex-col overflow-hidden py-1">
                                {filteredDayEvents.length === 0 ? (
                                    <div className="flex flex-1 flex-col items-center justify-center px-4 py-2 text-center">
                                        <div className="flex size-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                                            <CalendarIcon className="size-4.5" />
                                        </div>
                                        <p className="mt-2 text-xs font-bold text-slate-800 dark:text-zinc-200">
                                            Agenda Lengang
                                        </p>
                                        <p className="mt-0.5 max-w-xs text-[11px] text-slate-400 dark:text-zinc-500">
                                            Tidak ada jadwal sidang pengadilan
                                            atau agenda pada tanggal ini.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="flex-1 [scrollbar-width:thin] space-y-2 overflow-y-auto py-1.5 pr-1">
                                        {filteredDayEvents.map((ev, idx) => (
                                            <div
                                                key={ev.id || idx}
                                                className="flex items-center justify-between gap-2 text-xs"
                                            >
                                                <div className="flex min-w-0 items-center gap-2">
                                                    <span className="size-1.5 shrink-0 rounded-full bg-blue-600" />
                                                    <span className="font-mono text-[11px] font-semibold text-slate-700 dark:text-zinc-300">
                                                        {ev.time}
                                                    </span>
                                                    <div className="min-w-0 truncate">
                                                        <p
                                                            className="truncate font-medium text-slate-900 dark:text-white"
                                                            title={ev.title}
                                                        >
                                                            {ev.title}
                                                        </p>
                                                        <p className="truncate text-[10px] text-slate-400">
                                                            {ev.subtitle}
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className="shrink-0 rounded-md bg-slate-100 px-1.5 py-0.5 text-[9px] font-semibold text-slate-600 dark:bg-white/[0.06] dark:text-zinc-300">
                                                    {ev.category}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="mt-auto shrink-0 border-t border-slate-100 pt-2.5 text-right dark:border-white/[0.04]">
                                <Link
                                    href={calendarRoutes.index()}
                                    className="text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white"
                                >
                                    Buka Kalender &amp; Agenda →
                                </Link>
                            </div>
                        </div>

                        {/* [Row 2, Col 1] Widget 3: Prioritas & Tindakan Kemitraan */}
                        <div className="flex h-[390px] flex-col rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex shrink-0 items-center justify-between border-b border-slate-100 pb-3 dark:border-white/[0.05]">
                                <div className="flex items-center gap-2">
                                    <h2 className="text-xs font-bold text-slate-900 dark:text-white">
                                        Prioritas &amp; Tindakan Kemitraan
                                    </h2>
                                    <span className="rounded-full bg-rose-50 px-2 py-0.5 font-mono text-[9px] font-bold text-rose-700 dark:bg-rose-950/50 dark:text-rose-300">
                                        {executive_actions?.length ?? 0}{' '}
                                        MENDESAK
                                    </span>
                                </div>
                                <Link
                                    href={tasksRoutes.index({
                                        query: { priority: 'high' },
                                    })}
                                    className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white"
                                >
                                    Semua →
                                </Link>
                            </div>

                            <div className="flex flex-1 flex-col overflow-hidden py-1">
                                {!executive_actions ||
                                executive_actions.length === 0 ? (
                                    <div className="flex flex-1 flex-col items-center justify-center px-4 py-4 text-center">
                                        <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                                            <ShieldCheck className="size-4.5" />
                                        </div>
                                        <p className="mt-2 text-xs font-bold text-slate-800 dark:text-zinc-200">
                                            Kondisi Operasional Aman
                                        </p>
                                        <p className="mt-0.5 max-w-xs text-[11px] text-slate-400 dark:text-zinc-500">
                                            Tidak ada perkara atau tenggat
                                            kritis yang memerlukan tindakan
                                            darurat saat ini.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="flex-1 [scrollbar-width:thin] divide-y divide-slate-100 overflow-y-auto pr-1 dark:divide-white/[0.04]">
                                        {executive_actions.map(
                                            (action, idx) => {
                                                return (
                                                    <div
                                                        key={action.id || idx}
                                                        className="group flex items-start justify-between gap-3 py-2.5 transition-colors hover:bg-slate-50/50 dark:hover:bg-white/[0.02]"
                                                    >
                                                        <div className="min-w-0 flex-1 space-y-1">
                                                            <div className="flex items-center gap-2">
                                                                <span
                                                                    className={`rounded-md px-1.5 py-0.5 text-[9px] font-bold ${
                                                                        action.badge_color ===
                                                                        'rose'
                                                                            ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                                                                            : action.badge_color ===
                                                                                'amber'
                                                                              ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                                                                              : 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                                                                    }`}
                                                                >
                                                                    {
                                                                        action.badge_label
                                                                    }
                                                                </span>
                                                                <span className="font-mono text-[10px] text-slate-500 dark:text-zinc-400">
                                                                    {
                                                                        action.due_text
                                                                    }
                                                                </span>
                                                            </div>
                                                            <p
                                                                className="truncate text-xs font-semibold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400"
                                                                title={
                                                                    action.title
                                                                }
                                                            >
                                                                {action.title}
                                                            </p>
                                                            <p className="truncate text-[11px] text-slate-500 dark:text-zinc-400">
                                                                {action.matter}
                                                            </p>
                                                        </div>

                                                        <div className="flex shrink-0 items-center gap-1.5 pt-1">
                                                            <TooltipProvider
                                                                delayDuration={
                                                                    100
                                                                }
                                                            >
                                                                <Tooltip>
                                                                    <TooltipTrigger
                                                                        asChild
                                                                    >
                                                                        <Avatar className="size-5 shrink-0 rounded-full border border-slate-200/80 dark:border-white/10">
                                                                            <AvatarImage
                                                                                src={
                                                                                    action.assignee_avatar ??
                                                                                    undefined
                                                                                }
                                                                            />
                                                                            <AvatarFallback className="text-[7px] font-bold">
                                                                                {getInitials(
                                                                                    action.assignee_name,
                                                                                )}
                                                                            </AvatarFallback>
                                                                        </Avatar>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent
                                                                        side="top"
                                                                        className="bg-slate-900 px-2 py-0.5 text-[10px] font-medium text-white shadow-md dark:bg-zinc-800"
                                                                    >
                                                                        {
                                                                            action.assignee_name
                                                                        }
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                        </div>
                                                    </div>
                                                );
                                            },
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="mt-auto shrink-0 border-t border-slate-100 pt-2.5 text-right dark:border-white/[0.04]">
                                <Link
                                    href={tasksRoutes.index({
                                        query: { priority: 'high' },
                                    })}
                                    className="text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white"
                                >
                                    Buka Daftar Prioritas →
                                </Link>
                            </div>
                        </div>

                        {/* [Row 2, Col 2] Widget 4: Recent Audit Activity */}
                        <div className="flex h-[390px] flex-col rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex shrink-0 items-center justify-between border-b border-slate-100 pb-3 dark:border-white/[0.05]">
                                <div className="flex items-center gap-2">
                                    <h2 className="text-xs font-bold text-slate-900 dark:text-white">
                                        Aktivitas &amp; Log Terkini
                                    </h2>
                                    <span className="rounded-full bg-slate-100 px-2 py-0.5 font-mono text-[9px] font-semibold text-slate-600 dark:bg-white/[0.06] dark:text-zinc-400">
                                        Audit Trail
                                    </span>
                                </div>
                                <Link
                                    href={auditRoutes.index()}
                                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                >
                                    Semua Log →
                                </Link>
                            </div>

                            <div className="flex flex-1 flex-col overflow-hidden py-1">
                                {!activities || activities.length === 0 ? (
                                    <div className="flex flex-1 flex-col items-center justify-center px-4 py-4 text-center">
                                        <div className="flex size-9 items-center justify-center rounded-xl bg-slate-100 text-slate-400 dark:bg-white/[0.04] dark:text-zinc-500">
                                            <Clock className="size-4.5" />
                                        </div>
                                        <p className="mt-2 text-xs font-bold text-slate-800 dark:text-zinc-200">
                                            Log Siap Merekam
                                        </p>
                                        <p className="mt-0.5 max-w-xs text-[11px] text-slate-400 dark:text-zinc-500">
                                            Setiap aktivitas tim pada perkara,
                                            berkas, dan penagihan akan otomatis
                                            tercatat di sini.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="flex-1 [scrollbar-width:thin] divide-y divide-slate-100 overflow-y-auto pr-1 dark:divide-white/[0.04]">
                                        {activities.map((act, idx) => {
                                            const badgeColorClass =
                                                act.badge_color === 'blue'
                                                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                                                    : act.badge_color ===
                                                        'purple'
                                                      ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300'
                                                      : act.badge_color ===
                                                          'emerald'
                                                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                                                        : act.badge_color ===
                                                            'amber'
                                                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                                                          : act.badge_color ===
                                                              'indigo'
                                                            ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                                                            : act.badge_color ===
                                                                'cyan'
                                                              ? 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300'
                                                              : act.badge_color ===
                                                                  'teal'
                                                                ? 'bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300'
                                                                : 'bg-slate-100 text-slate-700 dark:bg-white/[0.06] dark:text-zinc-300';

                                            const content = (
                                                <div className="min-w-0 flex-1 space-y-1">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <div className="flex min-w-0 items-center gap-1.5">
                                                            <span
                                                                className={`shrink-0 rounded-md px-1.5 py-0.5 text-[9px] font-bold ${badgeColorClass}`}
                                                            >
                                                                {act.badge ||
                                                                    'Aktivitas'}
                                                            </span>
                                                            <span className="truncate text-xs font-semibold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                                                                {act.title}
                                                            </span>
                                                        </div>
                                                        <span className="shrink-0 font-mono text-[10px] whitespace-nowrap text-slate-400">
                                                            {act.time}
                                                        </span>
                                                    </div>
                                                    <p
                                                        className="truncate text-[11px] text-slate-500 dark:text-zinc-400"
                                                        title={
                                                            act.detail ||
                                                            act.subject
                                                        }
                                                    >
                                                        {act.detail ||
                                                            act.subject}
                                                    </p>
                                                    <div className="flex items-center gap-1.5 pt-0.5">
                                                        <Avatar className="size-4 shrink-0 rounded-full border border-slate-200/80 dark:border-white/10">
                                                            <AvatarImage
                                                                src={
                                                                    act.actor_avatar
                                                                }
                                                            />
                                                            <AvatarFallback className="text-[6.5px] font-bold">
                                                                {getInitials(
                                                                    act.actor,
                                                                )}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <span className="truncate text-[10px] font-medium text-slate-600 dark:text-zinc-400">
                                                            {act.actor}
                                                        </span>
                                                    </div>
                                                </div>
                                            );

                                            return act.url ? (
                                                <Link
                                                    key={act.id || idx}
                                                    href={act.url}
                                                    className="group -mx-1.5 flex items-start gap-2.5 rounded-lg px-1.5 py-2.5 transition-colors hover:bg-slate-50/70 dark:hover:bg-white/[0.02]"
                                                >
                                                    {content}
                                                </Link>
                                            ) : (
                                                <div
                                                    key={act.id || idx}
                                                    className="group -mx-1.5 flex items-start gap-2.5 px-1.5 py-2.5"
                                                >
                                                    {content}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            <div className="mt-auto shrink-0 border-t border-slate-100 pt-2.5 text-right dark:border-white/[0.04]">
                                <Link
                                    href={auditRoutes.index()}
                                    className="text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white"
                                >
                                    Buka Audit Trail Lengkap →
                                </Link>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
