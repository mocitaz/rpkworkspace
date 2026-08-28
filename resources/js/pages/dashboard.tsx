import { Head, Link, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowRight,
    Calendar as CalendarIcon,
    CheckCircle2,
    CheckSquare,
    ChevronLeft,
    ChevronRight,
    CreditCard,
    FileCheck2,
    FileEdit,
    FilePlus2,
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
import {
    DashboardStatCard,
    DeadlineRadarVisual,
    DocumentReviewVisual,
    dashboardStatIcons,
    MatterPortfolioVisual,
    TaskLoadVisual,
} from '@/components/dashboard-stat-card';
import { DashboardWelcomeHero } from '@/components/dashboard-welcome-hero';
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

type CaseMilestoneItem = {
    id: string | number;
    title: string;
    description?: string | null;
    event_date: string | null;
    date_raw?: string | null;
    relative_time?: string | null;
    importance_level?: string;
    badge_label: string;
    badge_color: 'rose' | 'amber' | 'blue' | 'slate' | 'emerald';
    evidence_reference?: string | null;
    witness_name?: string | null;
    matter_id: string | number;
    matter_number?: string;
    matter_title?: string;
    client_name?: string;
    creator_name: string;
    creator_avatar?: string | null;
    url?: string | null;
};

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
    case_milestones = [],
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
    case_milestones?: CaseMilestoneItem[];
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

            <div className="min-h-screen bg-[#fafafc] pb-24 md:pb-10 dark:bg-[#0c0d10]">
                <main className="w-full space-y-6 px-4 pt-2.5 pb-8 sm:px-6 sm:pt-3.5 lg:px-8">
                    <DashboardWelcomeHero
                        fullName={fullName}
                        activeMatters={activeMattersCount}
                        openTasks={openTasksCount}
                        urgentTasks={urgentTasksCount}
                        todayFormatted={todayFormatted}
                    />

                    {/* 2. Animated KPI cards driven by real workspace metrics */}
                    <section className="grid grid-cols-2 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
                        <DashboardStatCard
                            title="Perkara Aktif"
                            value={activeMattersCount}
                            meta={
                                <>
                                    <span className="text-blue-600 dark:text-blue-400">
                                        {corporateCount} korporasi
                                    </span>{' '}
                                    · {litigationCount} litigasi
                                </>
                            }
                            href={mattersRoutes.index.url()}
                            tone="blue"
                            icon={dashboardStatIcons.matters}
                            illustration={
                                <MatterPortfolioVisual
                                    corporate={corporateCount}
                                    litigation={litigationCount}
                                />
                            }
                        />

                        <DashboardStatCard
                            title="Tugas Terbuka"
                            value={openTasksCount}
                            meta={
                                <span
                                    className={
                                        urgentTasksCount > 0
                                            ? 'text-rose-600 dark:text-rose-400'
                                            : 'text-emerald-600 dark:text-emerald-400'
                                    }
                                >
                                    {urgentTasksCount} tugas prioritas
                                </span>
                            }
                            href={tasksRoutes.index.url()}
                            tone="emerald"
                            icon={dashboardStatIcons.tasks}
                            illustration={
                                <TaskLoadVisual
                                    urgent={urgentTasksCount}
                                    total={openTasksCount}
                                />
                            }
                        />

                        <DashboardStatCard
                            title="Tenggat & Sidang"
                            value={criticalDeadlinesCount}
                            meta={
                                <span className="text-amber-600 dark:text-amber-400">
                                    {todayDeadlinesCount > 0
                                        ? `${todayDeadlinesCount} jatuh tempo hari ini`
                                        : 'Tidak ada tenggat hari ini'}
                                </span>
                            }
                            href={calendarRoutes.index.url()}
                            tone="amber"
                            icon={dashboardStatIcons.deadlines}
                            illustration={
                                <DeadlineRadarVisual
                                    critical={criticalDeadlinesCount}
                                    today={todayDeadlinesCount}
                                />
                            }
                        />

                        <DashboardStatCard
                            title="Dokumen & Review"
                            value={reviewDocsCount}
                            meta={
                                <>
                                    <span className="text-violet-600 dark:text-violet-400">
                                        {docApprovedCount} disetujui
                                    </span>{' '}
                                    dari {totalDocsCount} berkas
                                </>
                            }
                            href={documentsRoutes.index.url()}
                            tone="violet"
                            icon={dashboardStatIcons.documents}
                            illustration={
                                <DocumentReviewVisual
                                    approved={docApprovedCount}
                                    review={reviewDocsCount}
                                    total={totalDocsCount}
                                />
                            }
                        />
                    </section>

                    {/* 3. Compact operational overview */}
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        {/* [Row 1, Col 1] Widget 1: Work Queue & Tugas */}
                        <div className="flex h-[320px] flex-col rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex flex-col gap-2 border-b border-slate-100 pb-2.5 sm:flex-row sm:items-center sm:justify-between dark:border-white/[0.05]">
                                <div className="flex items-center gap-2">
                                    <h2 className="text-xs font-bold text-slate-900 dark:text-white">
                                        Work Queue &amp; Tugas
                                    </h2>
                                    <span className="font-mono text-[10px] text-slate-400">
                                        ({currentQueueItems.length})
                                    </span>
                                    <Link
                                        href={tasksRoutes.index.url()}
                                        className="ml-1 text-[10px] font-semibold text-slate-400 transition-colors hover:text-slate-900 dark:text-zinc-500 dark:hover:text-white"
                                    >
                                        Semua →
                                    </Link>
                                </div>
                                <div className="flex [scrollbar-width:none] items-center gap-3 overflow-x-auto text-xs [&::-webkit-scrollbar]:hidden">
                                    <button
                                        type="button"
                                        onClick={() => setQueueTab('pending')}
                                        className={`relative shrink-0 cursor-pointer py-1 text-[11px] font-semibold whitespace-nowrap transition-colors after:absolute after:right-0 after:-bottom-0.5 after:left-0 after:h-px after:origin-left after:bg-slate-900 after:transition-transform dark:after:bg-white ${
                                            queueTab === 'pending'
                                                ? 'text-slate-900 after:scale-x-100 dark:text-white'
                                                : 'text-slate-400 after:scale-x-0 hover:text-slate-700 dark:text-zinc-500 dark:hover:text-zinc-300'
                                        }`}
                                    >
                                        Menunggu ({pendingCount})
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setQueueTab('in_progress')
                                        }
                                        className={`relative shrink-0 cursor-pointer py-1 text-[11px] font-semibold whitespace-nowrap transition-colors after:absolute after:right-0 after:-bottom-0.5 after:left-0 after:h-px after:origin-left after:bg-slate-900 after:transition-transform dark:after:bg-white ${
                                            queueTab === 'in_progress'
                                                ? 'text-slate-900 after:scale-x-100 dark:text-white'
                                                : 'text-slate-400 after:scale-x-0 hover:text-slate-700 dark:text-zinc-500 dark:hover:text-zinc-300'
                                        }`}
                                    >
                                        Review ({reviewCount})
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setQueueTab('completed')}
                                        className={`relative shrink-0 cursor-pointer py-1 text-[11px] font-semibold whitespace-nowrap transition-colors after:absolute after:right-0 after:-bottom-0.5 after:left-0 after:h-px after:origin-left after:bg-slate-900 after:transition-transform dark:after:bg-white ${
                                            queueTab === 'completed'
                                                ? 'text-slate-900 after:scale-x-100 dark:text-white'
                                                : 'text-slate-400 after:scale-x-0 hover:text-slate-700 dark:text-zinc-500 dark:hover:text-zinc-300'
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
                                                    href={tasksRoutes.index.url(
                                                        {
                                                            query: {
                                                                create: 1,
                                                            },
                                                        },
                                                    )}
                                                >
                                                    <Plus className="mr-1 size-3" />{' '}
                                                    Buat Tugas Baru
                                                </Link>
                                            </Button>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex-1 divide-y divide-slate-100 overflow-hidden dark:divide-white/[0.04]">
                                        {currentQueueItems
                                            .slice(0, 4)
                                            .map((item, idx) => {
                                                const isUrgent =
                                                    item.priority === 'high' ||
                                                    item.priority ===
                                                        'critical';
                                                const taskUrl = tasksRoutes.show
                                                    ?.url
                                                    ? tasksRoutes.show.url(
                                                          item.id,
                                                      )
                                                    : `/tasks/${item.id}`;

                                                return (
                                                    <Link
                                                        key={item.id || idx}
                                                        href={taskUrl}
                                                        className="group -mx-1.5 flex items-center justify-between gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-slate-50/80 dark:hover:bg-white/[0.03]"
                                                    >
                                                        <div className="min-w-0 flex-1 space-y-0.5">
                                                            <div className="flex items-center gap-2">
                                                                <p
                                                                    className="truncate text-xs font-semibold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400"
                                                                    title={
                                                                        item.title
                                                                    }
                                                                >
                                                                    {item.title}
                                                                </p>
                                                            </div>
                                                            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-zinc-400">
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
                                                                        item
                                                                            .matter
                                                                            ?.title ??
                                                                        'Internal'}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="flex shrink-0 items-center gap-2.5 text-right">
                                                            <span
                                                                className={`font-mono text-[10px] font-semibold ${
                                                                    isUrgent
                                                                        ? 'text-rose-600 dark:text-rose-400'
                                                                        : 'text-slate-500 dark:text-zinc-400'
                                                                }`}
                                                            >
                                                                {item.due_at
                                                                    ? formatDate(
                                                                          item.due_at,
                                                                      )
                                                                    : 'Hari ini'}
                                                            </span>
                                                            <Avatar
                                                                className="size-5 shrink-0 rounded-full border border-slate-200/80 dark:border-white/10"
                                                                title={
                                                                    item
                                                                        .assignee
                                                                        ?.name ??
                                                                    'Staf Pelaksana'
                                                                }
                                                            >
                                                                <AvatarImage
                                                                    src={
                                                                        item
                                                                            .assignee
                                                                            ?.avatar_url ||
                                                                        item
                                                                            .assignee
                                                                            ?.avatar_path ||
                                                                        '/images/default-avatar.svg'
                                                                    }
                                                                    alt={
                                                                        item
                                                                            .assignee
                                                                            ?.name ||
                                                                        'Assignee'
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
                                                        </div>
                                                    </Link>
                                                );
                                            })}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* [Row 1, Col 2] Widget 2: Jadwal Sidang & Agenda */}
                        <div className="flex h-[320px] flex-col rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex shrink-0 items-center justify-between border-b border-slate-100 pb-2.5 dark:border-white/[0.05]">
                                <h2 className="text-xs font-bold text-slate-900 dark:text-white">
                                    Jadwal Sidang &amp; Agenda
                                </h2>
                                <Link
                                    href={calendarRoutes.index.url()}
                                    className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white"
                                >
                                    Kalender →
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
                                    <div className="flex flex-1 items-center justify-center gap-3 px-4 py-4 text-left">
                                        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                                            <CalendarIcon className="size-4.5" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-800 dark:text-zinc-200">
                                                Belum ada agenda
                                            </p>
                                            <p className="mt-0.5 text-[11px] text-slate-400 dark:text-zinc-500">
                                                Tidak ada sidang atau agenda
                                                pada tanggal ini.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex-1 divide-y divide-slate-100 overflow-hidden py-1 dark:divide-white/[0.04]">
                                        {filteredDayEvents
                                            .slice(0, 4)
                                            .map((ev, idx) => (
                                                <div
                                                    key={ev.id || idx}
                                                    className="flex items-center justify-between gap-2 text-xs"
                                                >
                                                    <div className="flex min-w-0 items-center gap-2">
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
                                                    <span className="shrink-0 text-[9px] font-semibold text-blue-600 dark:text-blue-400">
                                                        {ev.category}
                                                    </span>
                                                </div>
                                            ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* [Row 2, Col 1] Widget 3: Prioritas & Tindakan Kemitraan */}
                        <div className="flex h-[320px] flex-col rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex shrink-0 items-center justify-between border-b border-slate-100 pb-2.5 dark:border-white/[0.05]">
                                <div className="flex items-center gap-2">
                                    <h2 className="text-xs font-bold text-slate-900 dark:text-white">
                                        Prioritas &amp; Tindakan Kemitraan
                                    </h2>
                                    <span className="font-mono text-[9px] font-bold text-rose-600 dark:text-rose-400">
                                        {executive_actions?.length ?? 0}{' '}
                                        MENDESAK
                                    </span>
                                </div>
                                <Link
                                    href={tasksRoutes.index.url({
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
                                    <div className="flex-1 divide-y divide-slate-100 overflow-hidden dark:divide-white/[0.04]">
                                        {executive_actions
                                            .slice(0, 4)
                                            .map((action, idx) => {
                                                const actionUrl = tasksRoutes
                                                    .show?.url
                                                    ? tasksRoutes.show.url(
                                                          action.id,
                                                      )
                                                    : `/tasks/${action.id}`;

                                                return (
                                                    <Link
                                                        key={action.id || idx}
                                                        href={actionUrl}
                                                        className="group -mx-1.5 flex items-start justify-between gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-slate-50/80 dark:hover:bg-white/[0.03]"
                                                    >
                                                        <div className="min-w-0 flex-1 space-y-1">
                                                            <div className="flex items-center gap-2">
                                                                <span
                                                                    className={`text-[9px] font-bold ${
                                                                        action.badge_color ===
                                                                        'rose'
                                                                            ? 'text-rose-600 dark:text-rose-400'
                                                                            : action.badge_color ===
                                                                                'amber'
                                                                              ? 'text-amber-600 dark:text-amber-400'
                                                                              : 'text-blue-600 dark:text-blue-400'
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
                                                            <Avatar
                                                                className="size-5 shrink-0 rounded-full border border-slate-200/80 dark:border-white/10"
                                                                title={
                                                                    action.assignee_name
                                                                }
                                                            >
                                                                <AvatarImage
                                                                    src={
                                                                        action.assignee_avatar ||
                                                                        '/images/default-avatar.svg'
                                                                    }
                                                                    alt={
                                                                        action.assignee_name ||
                                                                        'Assignee'
                                                                    }
                                                                />
                                                                <AvatarFallback className="text-[7px] font-bold">
                                                                    {getInitials(
                                                                        action.assignee_name,
                                                                    )}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                        </div>
                                                    </Link>
                                                );
                                            })}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* [Row 2, Col 2] Widget 4: Recent Case Milestones (Perkembangan Perkara Terkini) */}
                        <div className="flex h-[320px] flex-col rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex shrink-0 items-center justify-between border-b border-slate-100 pb-2.5 dark:border-white/[0.05]">
                                <div className="flex items-center gap-2">
                                    <h2 className="text-xs font-bold text-slate-900 dark:text-white">
                                        Milestone &amp; Perkembangan Perkara
                                    </h2>
                                </div>
                                <Link
                                    href={mattersRoutes.index.url()}
                                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                >
                                    Semua Perkara →
                                </Link>
                            </div>

                            <div className="flex flex-1 flex-col overflow-hidden py-1">
                                {!case_milestones ||
                                case_milestones.length === 0 ? (
                                    <div className="flex flex-1 flex-col items-center justify-center px-4 py-4 text-center">
                                        <div className="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                                            <Scale className="size-4.5" />
                                        </div>
                                        <p className="mt-2 text-xs font-bold text-slate-800 dark:text-zinc-200">
                                            Belum Ada Milestone Baru
                                        </p>
                                        <p className="mt-0.5 max-w-xs text-[11px] text-slate-400 dark:text-zinc-500">
                                            Setiap peristiwa penting, mediasi,
                                            replik/duplik, atau putusan perkara
                                            akan otomatis tercatat di sini.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="flex-1 divide-y divide-slate-100 overflow-hidden dark:divide-white/[0.04]">
                                        {case_milestones
                                            .slice(0, 4)
                                            .map((ms, idx) => {
                                                const statusColorClass =
                                                    ms.badge_color === 'rose'
                                                        ? 'text-rose-600 dark:text-rose-400'
                                                        : ms.badge_color ===
                                                            'amber'
                                                          ? 'text-amber-600 dark:text-amber-400'
                                                          : ms.badge_color ===
                                                              'emerald'
                                                            ? 'text-emerald-600 dark:text-emerald-400'
                                                            : ms.badge_color ===
                                                                'slate'
                                                              ? 'text-slate-500 dark:text-zinc-400'
                                                              : 'text-blue-600 dark:text-blue-400';

                                                const content = (
                                                    <div className="min-w-0 flex-1 space-y-1">
                                                        <div className="flex items-center justify-between gap-2">
                                                            <div className="flex min-w-0 items-center gap-1.5">
                                                                <span
                                                                    className={`shrink-0 text-[9px] font-bold ${statusColorClass}`}
                                                                >
                                                                    {ms.badge_label ||
                                                                        'Milestone'}
                                                                </span>
                                                                <span className="truncate text-xs font-semibold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                                                                    {ms.title}
                                                                </span>
                                                            </div>
                                                            <span className="shrink-0 font-mono text-[10px] whitespace-nowrap text-slate-400">
                                                                {ms.event_date ||
                                                                    ms.relative_time}
                                                            </span>
                                                        </div>

                                                        <p
                                                            className="truncate text-[11px] text-slate-500 dark:text-zinc-400"
                                                            title={
                                                                ms.description ||
                                                                `${ms.matter_number} · ${ms.matter_title}`
                                                            }
                                                        >
                                                            {ms.matter_number ? (
                                                                <span className="font-mono font-semibold text-slate-700 dark:text-zinc-300">
                                                                    {
                                                                        ms.matter_number
                                                                    }{' '}
                                                                    ·{' '}
                                                                </span>
                                                            ) : null}
                                                            <span>
                                                                {ms.description ||
                                                                    ms.matter_title}
                                                            </span>
                                                        </p>

                                                        <div className="flex items-center justify-between gap-2 pt-0.5 text-[10px]">
                                                            <div className="flex min-w-0 items-center gap-1.5">
                                                                <Avatar className="size-4 shrink-0 rounded-full border border-slate-200/80 dark:border-white/10">
                                                                    <AvatarImage
                                                                        src={
                                                                            ms.creator_avatar ||
                                                                            undefined
                                                                        }
                                                                    />
                                                                    <AvatarFallback className="text-[6.5px] font-bold">
                                                                        {getInitials(
                                                                            ms.creator_name,
                                                                        )}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <span className="truncate font-medium text-slate-600 dark:text-zinc-400">
                                                                    {
                                                                        ms.creator_name
                                                                    }
                                                                </span>
                                                            </div>

                                                            {ms.client_name && (
                                                                <span className="max-w-[130px] shrink-0 truncate font-medium text-slate-400">
                                                                    {
                                                                        ms.client_name
                                                                    }
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                );

                                                return ms.url ? (
                                                    <Link
                                                        key={ms.id || idx}
                                                        href={ms.url}
                                                        className="group -mx-1.5 flex items-start gap-2.5 rounded-lg px-1.5 py-2.5 transition-colors hover:bg-slate-50/80 dark:hover:bg-white/[0.03]"
                                                    >
                                                        {content}
                                                    </Link>
                                                ) : (
                                                    <div
                                                        key={ms.id || idx}
                                                        className="group -mx-1.5 flex items-start gap-2.5 px-1.5 py-2.5"
                                                    >
                                                        {content}
                                                    </div>
                                                );
                                            })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
