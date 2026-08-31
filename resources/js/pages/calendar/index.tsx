import { Form, Head, Link } from '@inertiajs/react';
import {
    ArrowUpRight,
    Calendar as CalendarIcon,
    CalendarClock,
    Check,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Copy,
    Download,
    ExternalLink,
    Gavel,
    Grid3X3,
    Info,
    Link2,
    List,
    ListTodo,
    Lock,
    Radio,
    RefreshCw,
    Smartphone,
    Trash2,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { CalendarDashboardHero } from '@/components/calendar-dashboard-hero';
import { AppleLogo } from '@/components/apple-logo';
import { EmptyState } from '@/components/empty-state';
import { GoogleLogo } from '@/components/google-logo';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { formatDate } from '@/lib/format';
import { financeDialogPanelClass } from '@/pages/finance/components/finance-dialog-design';
import {
    FinanceDialogBody,
    FinanceDialogHeader,
} from '@/pages/finance/components/finance-dialog-ui';
import * as calendarRoutes from '@/routes/calendar';
import * as calendarExportRoutes from '@/routes/calendar/export';
import * as calendarFeedRoutes from '@/routes/calendar/feed';
import * as calendarGoogleRoutes from '@/routes/calendar/google';
import * as matterRoutes from '@/routes/matters';

type Item = {
    id: string;
    title: string;
    due_at?: string;
    starts_at?: string;
    location?: string;
    description?: string;
    is_critical?: boolean;
    status?: string;
    outcome?: string;
    judge_notes?: string;
    attended_by?: number;
    attendee?: { id: number; name: string };
    next_event_id?: string;
    next_event?: {
        id: string;
        title: string;
        starts_at: string;
        location?: string;
    };
    matter?: { id: string; matter_number: string; title: string };
};

type CalendarItem = Item & {
    date: string;
    kind: 'Tenggat' | 'Agenda' | 'Tugas';
    icon: typeof Gavel;
};

type Holiday = {
    date: string;
    name: string;
    type: string;
    is_joint_leave: boolean;
};

type CalendarFeed = {
    token: string;
    url: string;
    webcal_url: string;
    google_url: string;
};

type GoogleCalendarStatus = {
    configured: boolean;
    connection: {
        google_account_email?: string | null;
        calendar_name: string;
        privacy_mode: 'full' | 'limited' | 'private';
        sync_events: boolean;
        sync_deadlines: boolean;
        sync_tasks: boolean;
        is_active: boolean;
        last_synced_at?: string | null;
        last_error?: string | null;
    } | null;
};

export default function CalendarIndex({
    deadlines,
    events,
    tasks,
    range,
    month,
    timezone,
    holidays,
    feed,
    googleCalendar,
}: {
    deadlines: Item[];
    events: Item[];
    tasks: Item[];
    range: { from: string; until: string };
    month: string;
    timezone: string;
    holidays: Holiday[];
    feed?: CalendarFeed;
    googleCalendar: GoogleCalendarStatus;
}) {
    const [view, setView] = useState<'month' | 'list'>('month');
    const [selectedCategory, setSelectedCategory] = useState<
        'all' | 'Agenda' | 'Tenggat' | 'Tugas'
    >('all');
    const [selectedItem, setSelectedItem] = useState<CalendarItem | null>(null);
    const [liveSyncOpen, setLiveSyncOpen] = useState(false);

    const allItems: CalendarItem[] = useMemo(() => {
        return [
            ...deadlines.map((item) => ({
                ...item,
                date: item.due_at!,
                kind: 'Tenggat' as const,
                icon: CalendarClock,
            })),
            ...events.map((item) => ({
                ...item,
                date: item.starts_at!,
                kind: 'Agenda' as const,
                icon: Gavel,
            })),
            ...tasks.map((item) => ({
                ...item,
                date: item.due_at!,
                kind: 'Tugas' as const,
                icon: ListTodo,
            })),
        ].sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        );
    }, [deadlines, events, tasks]);

    const filteredItems = useMemo(() => {
        if (selectedCategory === 'all') {
            return allItems;
        }

        return allItems.filter((i) => i.kind === selectedCategory);
    }, [allItems, selectedCategory]);

    const categoryTabClass = (
        category: 'all' | 'Agenda' | 'Tenggat' | 'Tugas',
    ): string =>
        `relative shrink-0 border-b-2 px-1 pt-1 pb-2 text-[11px] font-semibold transition-colors ${
            selectedCategory === category
                ? 'border-slate-950 text-slate-950 dark:border-white dark:text-white'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white'
        }`;

    const days = dateRange(range.from, range.until);
    const [year, monthNumber] = month.split('-').map(Number);
    const formattedMonthTitle = new Intl.DateTimeFormat('id-ID', {
        month: 'long',
        year: 'numeric',
        timeZone: timezone,
    }).format(new Date(Date.UTC(year, monthNumber - 1, 1)));

    return (
        <>
            <Head title={`Kalender & Jadwal Agenda - ${formattedMonthTitle}`} />

            <div className="min-h-screen bg-[#fafafc] pb-24 md:pb-10 dark:bg-[#0c0d10]">
                <main className="w-full space-y-5 px-4 pt-2.5 pb-8 sm:px-6 sm:pt-3.5 lg:px-8">
                    <CalendarDashboardHero
                        formattedMonthTitle={formattedMonthTitle}
                        timezone={timezone}
                        view={view}
                        onViewChange={setView}
                        previousMonthHref={calendarRoutes.index.url({
                            query: { month: shiftMonth(month, -1) },
                        })}
                        todayHref={calendarRoutes.index.url()}
                        nextMonthHref={calendarRoutes.index.url({
                            query: { month: shiftMonth(month, 1) },
                        })}
                        onOpenSubscription={() => setLiveSyncOpen(true)}
                        googleConnected={Boolean(googleCalendar.connection)}
                        events={events.length}
                        deadlines={deadlines.length}
                        tasks={tasks.length}
                        total={allItems.length}
                    />
                    {/* 1. Header Navigation & Top Control Bar */}
                    <div className="hidden">
                        <div className="space-y-1">
                            <h1 className="text-xl font-bold tracking-tight text-slate-900 capitalize sm:text-2xl dark:text-white">
                                {formattedMonthTitle}
                            </h1>
                            <p className="text-xs text-slate-500 dark:text-zinc-400">
                                Jadwal sidang pengadilan, mediasi, batas waktu
                                pembuktian (tenggat), dan tugas perkara (
                                {timezone}).
                            </p>
                        </div>

                        {/* Month Navigation & View Controls */}
                        <div className="flex flex-wrap items-center gap-2">
                            {/* Previous / Today / Next Month Controls */}
                            <div className="flex items-center gap-0.5 rounded-lg border border-slate-200/70 bg-white p-0.5 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-7 rounded text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-white/[0.06] dark:hover:text-white"
                                    asChild
                                >
                                    <Link
                                        href={calendarRoutes.index.url({
                                            query: {
                                                month: shiftMonth(month, -1),
                                            },
                                        })}
                                        aria-label="Bulan sebelumnya"
                                    >
                                        <ChevronLeft className="size-3.5" />
                                    </Link>
                                </Button>

                                <Button
                                    variant="ghost"
                                    className="h-7 rounded px-2.5 text-xs font-semibold text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-white/[0.06]"
                                    asChild
                                >
                                    <Link href={calendarRoutes.index.url()}>
                                        Hari Ini
                                    </Link>
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-7 rounded text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-white/[0.06] dark:hover:text-white"
                                    asChild
                                >
                                    <Link
                                        href={calendarRoutes.index.url({
                                            query: {
                                                month: shiftMonth(month, 1),
                                            },
                                        })}
                                        aria-label="Bulan berikutnya"
                                    >
                                        <ChevronRight className="size-3.5" />
                                    </Link>
                                </Button>
                            </div>

                            {/* View Segmented Switcher */}
                            <div className="flex items-center gap-0.5 rounded-lg border border-slate-200/70 bg-white p-0.5 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                <button
                                    type="button"
                                    onClick={() => setView('month')}
                                    className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
                                        view === 'month'
                                            ? 'bg-slate-900 text-white shadow-2xs dark:bg-white dark:text-slate-900'
                                            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-400'
                                    }`}
                                >
                                    <Grid3X3 className="size-3" />
                                    Bulan
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setView('list')}
                                    className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
                                        view === 'list'
                                            ? 'bg-slate-900 text-white shadow-2xs dark:bg-white dark:text-slate-900'
                                            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-400'
                                    }`}
                                >
                                    <List className="size-3" />
                                    Daftar
                                </button>
                            </div>

                            {/* Live Calendar Subscription (WebCal) Button */}
                            <Button
                                size="sm"
                                onClick={() => setLiveSyncOpen(true)}
                                className="h-8 rounded-lg bg-blue-600 px-3 text-xs font-semibold text-white shadow-2xs hover:bg-blue-700"
                            >
                                <Smartphone className="mr-1.5 size-3.5 text-blue-200" />
                                Langganan di HP / Google
                            </Button>

                            {/* iCal .ics Download Button */}
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 rounded-lg border-slate-200/70 bg-white px-2.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-white/[0.06] dark:bg-[#14161b] dark:text-zinc-200"
                                asChild
                            >
                                <a
                                    href={calendarExportRoutes.ics.url()}
                                    download="RPK-Law-Firm-Calendar.ics"
                                    title="Unduh file kalender (.ics) secara manual"
                                >
                                    <Download className="mr-1 size-3 text-slate-400" />
                                    Unduh .ics
                                </a>
                            </Button>
                        </div>
                    </div>

                    {/* 2. Top 4 KPI Metrics Bento Cards */}
                    <section className="hidden">
                        {/* 1. Sidang & Agenda */}
                        <div className="group rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[11px] font-semibold">
                                    SIDANG &amp; AGENDA
                                </span>
                                <Gavel className="size-3.5 text-slate-400 transition-colors group-hover:text-blue-600 dark:text-zinc-500" />
                            </div>
                            <div className="mt-2 flex items-baseline justify-between">
                                <span className="font-mono text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    {events.length}
                                </span>
                                <span className="text-[11px] font-medium text-slate-500 dark:text-zinc-400">
                                    jadwal sidang
                                </span>
                            </div>
                            <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-500 dark:border-white/[0.04]">
                                <span>Pengadilan &amp; Mediasi</span>
                                <span className="font-semibold text-blue-600 dark:text-blue-400">
                                    Terjadwal
                                </span>
                            </div>
                        </div>

                        {/* 2. Tenggat Kritis */}
                        <div className="group rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[11px] font-semibold">
                                    TENGGAT KRITIS
                                </span>
                                <CalendarClock className="size-3.5 text-rose-500 dark:text-rose-400" />
                            </div>
                            <div className="mt-2 flex items-baseline justify-between">
                                <span className="font-mono text-2xl font-bold tracking-tight text-rose-600 dark:text-rose-400">
                                    {deadlines.length}
                                </span>
                                <span className="text-[11px] font-medium text-rose-600 dark:text-rose-400">
                                    batas waktu
                                </span>
                            </div>
                            <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-500 dark:border-white/[0.04]">
                                <span>Batas Waktu Berkas</span>
                                <span className="font-semibold text-rose-600 dark:text-rose-400">
                                    Prioritas
                                </span>
                            </div>
                        </div>

                        {/* 3. Tugas Terkait */}
                        <div className="group rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[11px] font-semibold">
                                    TUGAS TERKAIT
                                </span>
                                <ListTodo className="size-3.5 text-slate-400 transition-colors group-hover:text-blue-600 dark:text-zinc-500" />
                            </div>
                            <div className="mt-2 flex items-baseline justify-between">
                                <span className="font-mono text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    {tasks.length}
                                </span>
                                <span className="text-[11px] font-medium text-slate-500 dark:text-zinc-400">
                                    tugas jatuh tempo
                                </span>
                            </div>
                            <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-500 dark:border-white/[0.04]">
                                <span>Instruksi Advokat</span>
                                <span className="font-semibold text-blue-600 dark:text-blue-400">
                                    Aktif
                                </span>
                            </div>
                        </div>

                        {/* 4. Total Aktivitas */}
                        <div className="group rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[11px] font-semibold">
                                    TOTAL JADWAL
                                </span>
                                <CalendarIcon className="size-3.5 text-slate-400 transition-colors group-hover:text-emerald-600 dark:text-zinc-500" />
                            </div>
                            <div className="mt-2 flex items-baseline justify-between">
                                <span className="font-mono text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    {allItems.length}
                                </span>
                                <span className="text-[11px] font-medium text-slate-500 dark:text-zinc-400">
                                    aktivitas kalender
                                </span>
                            </div>
                            <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-500 dark:border-white/[0.04]">
                                <span>Kalender Kantor</span>
                                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                    Tercatat
                                </span>
                            </div>
                        </div>
                    </section>

                    {/* 3. Category Filter Tabs */}
                    <div
                        aria-label="Filter aktivitas kalender"
                        role="tablist"
                        className="flex [scrollbar-width:none] items-center gap-5 overflow-x-auto border-b border-slate-200/70 [-ms-overflow-style:none] dark:border-white/[0.07] [&::-webkit-scrollbar]:hidden"
                    >
                        <button
                            type="button"
                            role="tab"
                            aria-selected={selectedCategory === 'all'}
                            onClick={() => setSelectedCategory('all')}
                            className={categoryTabClass('all')}
                        >
                            Semua Aktivitas · {allItems.length}
                        </button>
                        <button
                            type="button"
                            role="tab"
                            aria-selected={selectedCategory === 'Agenda'}
                            onClick={() => setSelectedCategory('Agenda')}
                            className={categoryTabClass('Agenda')}
                        >
                            Sidang &amp; Agenda · {events.length}
                        </button>
                        <button
                            type="button"
                            role="tab"
                            aria-selected={selectedCategory === 'Tenggat'}
                            onClick={() => setSelectedCategory('Tenggat')}
                            className={categoryTabClass('Tenggat')}
                        >
                            Tenggat Waktu · {deadlines.length}
                        </button>
                        <button
                            type="button"
                            role="tab"
                            aria-selected={selectedCategory === 'Tugas'}
                            onClick={() => setSelectedCategory('Tugas')}
                            className={categoryTabClass('Tugas')}
                        >
                            Tugas Terkait · {tasks.length}
                        </button>
                    </div>

                    {/* 4. View Switch: Month Grid or List View */}
                    {view === 'month' ? (
                        <MonthGrid
                            days={days}
                            month={month}
                            items={filteredItems}
                            holidays={holidays}
                            timezone={timezone}
                            onSelectItem={setSelectedItem}
                        />
                    ) : (
                        <ListView
                            items={filteredItems}
                            onSelectItem={setSelectedItem}
                        />
                    )}
                </main>
            </div>

            {/* Modal Dialog: Detail Ringkasan Agenda / Jadwal */}
            <Dialog
                open={!!selectedItem}
                onOpenChange={(open) => !open && setSelectedItem(null)}
            >
                {selectedItem && (
                    <DialogContent
                        className={financeDialogPanelClass('default')}
                    >
                        <FinanceDialogHeader
                            icon={selectedItem.icon}
                            eyebrow="Detail Aktivitas Kalender"
                            title={selectedItem.title}
                            description="Ringkasan jadwal, keterkaitan perkara, dan informasi pelaksanaan aktivitas."
                        />

                        <FinanceDialogBody className="space-y-4">
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 border-b border-slate-100 pb-3 text-[10px] font-semibold tracking-[0.08em] uppercase dark:border-white/[0.06]">
                                <span
                                    className={
                                        selectedItem.kind === 'Agenda'
                                            ? 'text-blue-600 dark:text-blue-400'
                                            : selectedItem.kind === 'Tenggat'
                                              ? 'text-rose-600 dark:text-rose-400'
                                              : 'text-slate-600 dark:text-zinc-300'
                                    }
                                >
                                    {selectedItem.kind === 'Agenda'
                                        ? 'Sidang & Agenda'
                                        : selectedItem.kind === 'Tenggat'
                                          ? 'Batas Waktu Tenggat'
                                          : 'Instruksi Tugas'}
                                </span>
                                {selectedItem.is_critical && (
                                    <>
                                        <span className="text-slate-300 dark:text-zinc-700">
                                            ·
                                        </span>
                                        <span className="text-rose-600 dark:text-rose-400">
                                            Prioritas Kritis
                                        </span>
                                    </>
                                )}
                                {selectedItem.status && (
                                    <>
                                        <span className="text-slate-300 dark:text-zinc-700">
                                            ·
                                        </span>
                                        <span className="text-emerald-600 dark:text-emerald-400">
                                            {selectedItem.status.replaceAll(
                                                '_',
                                                ' ',
                                            )}
                                        </span>
                                    </>
                                )}
                            </div>
                            {/* Linked Matter Card */}
                            {selectedItem.matter ? (
                                <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-4 dark:border-white/[0.07] dark:bg-white/[0.025]">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <span className="text-[10px] font-semibold tracking-[0.1em] text-slate-400 uppercase dark:text-zinc-500">
                                                PERKARA HUKUM TERKAIT
                                            </span>
                                            <p className="text-xs font-semibold text-slate-900 dark:text-white">
                                                {
                                                    selectedItem.matter
                                                        .matter_number
                                                }{' '}
                                                · {selectedItem.matter.title}
                                            </p>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="h-8 rounded-lg border-slate-200 bg-white px-3 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-200"
                                            asChild
                                        >
                                            <Link
                                                href={matterRoutes.show.url(
                                                    selectedItem.matter.id,
                                                )}
                                            >
                                                Buka Perkara
                                                <ArrowUpRight className="ml-0.5 size-3" />
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-4 text-xs text-slate-500 dark:border-white/[0.07] dark:bg-white/[0.025]">
                                    Agenda operasional umum kantor firma RPK.
                                </div>
                            )}

                            {/* Hearing Outcome Summary (if recorded) */}
                            {selectedItem.outcome && (
                                <div className="space-y-2 rounded-xl border border-emerald-200/80 bg-emerald-50/50 p-3 text-xs dark:border-emerald-900/40 dark:bg-emerald-950/20">
                                    <div className="flex items-center justify-between border-b border-emerald-200/50 pb-1.5 dark:border-emerald-900/30">
                                        <div className="flex items-center gap-1.5 font-bold text-emerald-900 dark:text-emerald-200">
                                            <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                                            <span>
                                                Hasil &amp; Resume Sidang
                                            </span>
                                        </div>
                                        {selectedItem.attendee && (
                                            <span className="text-[10px] font-semibold text-slate-600 dark:text-zinc-300">
                                                {selectedItem.attendee.name}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs leading-relaxed whitespace-pre-line text-slate-800 dark:text-zinc-200">
                                        {selectedItem.outcome}
                                    </p>
                                    {selectedItem.judge_notes && (
                                        <div className="mt-1.5 rounded-md border border-amber-200/70 bg-amber-50/60 p-2 text-[11px] text-amber-950 dark:border-amber-900/30 dark:bg-amber-950/30 dark:text-amber-200">
                                            <strong className="block text-[9px] font-bold tracking-wider text-amber-800 uppercase dark:text-amber-400">
                                                Arahan Majelis Hakim:
                                            </strong>
                                            <span>
                                                {selectedItem.judge_notes}
                                            </span>
                                        </div>
                                    )}
                                    {selectedItem.next_event && (
                                        <div className="mt-2 flex items-center justify-between rounded-md border border-blue-200/70 bg-blue-50/60 p-2 text-[11px] text-blue-950 dark:border-blue-900/30 dark:bg-blue-950/20 dark:text-blue-200">
                                            <div className="flex items-center gap-1.5">
                                                <CalendarClock className="size-3.5 shrink-0 text-blue-600 dark:text-blue-400" />
                                                <span className="font-semibold">
                                                    {
                                                        selectedItem.next_event
                                                            .title
                                                    }
                                                </span>
                                            </div>
                                            <span className="font-mono text-[10px] text-slate-600 dark:text-zinc-400">
                                                {formatDate(
                                                    selectedItem.next_event
                                                        .starts_at,
                                                    true,
                                                )}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Schedule & Timing Box */}
                            <div className="space-y-2.5 rounded-xl border border-slate-200/80 bg-slate-50/60 p-4 text-xs dark:border-white/[0.07] dark:bg-white/[0.025]">
                                <div className="flex items-center justify-between gap-2 border-b border-slate-200/50 pb-1.5 dark:border-white/[0.04]">
                                    <span className="text-slate-500 dark:text-zinc-400">
                                        Waktu Pelaksanaan
                                    </span>
                                    <span className="font-mono font-semibold text-slate-900 dark:text-white">
                                        {formatDate(selectedItem.date, true)} (
                                        {timezone})
                                    </span>
                                </div>
                                {selectedItem.location && (
                                    <div className="flex items-center justify-between gap-2 border-b border-slate-200/50 pb-1.5 dark:border-white/[0.04]">
                                        <span className="text-slate-500 dark:text-zinc-400">
                                            Lokasi / Pengadilan
                                        </span>
                                        <span className="font-semibold text-slate-800 dark:text-zinc-200">
                                            {selectedItem.location}
                                        </span>
                                    </div>
                                )}
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-slate-500 dark:text-zinc-400">
                                        Kategori Kegiatan
                                    </span>
                                    <span className="font-semibold text-slate-800 dark:text-zinc-200">
                                        {selectedItem.kind === 'Agenda'
                                            ? 'Sidang / Mediasi Resmi'
                                            : selectedItem.kind === 'Tenggat'
                                              ? 'Batas Waktu Dokumen Perkara'
                                              : 'Tugas Eksekusi Advokat'}
                                    </span>
                                </div>
                            </div>
                        </FinanceDialogBody>
                    </DialogContent>
                )}
            </Dialog>

            {/* Live Calendar Subscription (WebCal) Modal */}
            <LiveCalendarSyncModal
                open={liveSyncOpen}
                onOpenChange={setLiveSyncOpen}
                feed={feed}
                googleCalendar={googleCalendar}
                exportHref={calendarExportRoutes.ics.url()}
            />
        </>
    );
}

function LiveCalendarSyncModal({
    open,
    onOpenChange,
    feed,
    googleCalendar,
    exportHref,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    feed?: CalendarFeed;
    googleCalendar: GoogleCalendarStatus;
    exportHref: string;
}) {
    const [copied, setCopied] = useState(false);
    const connection = googleCalendar.connection;

    if (!feed) {
        return null;
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(feed.url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={financeDialogPanelClass('default')}>
                <FinanceDialogHeader
                    icon={Radio}
                    eyebrow="Sinkronisasi Kalender"
                    title="Langganan Kalender Otomatis"
                    description="Sinkronkan jadwal sidang, mediasi, tenggat, dan tugas secara otomatis ke perangkat Anda."
                />

                <FinanceDialogBody className="space-y-4 text-xs">
                    <section className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-4 dark:border-white/[0.07] dark:bg-white/[0.025]">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex min-w-0 items-start gap-3">
                                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white shadow-xs dark:border-white/10 dark:bg-white/[0.06]">
                                    <GoogleLogo className="size-5" />
                                </div>
                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                                        <h3 className="font-semibold text-slate-900 dark:text-white">
                                            Google Calendar
                                        </h3>
                                        <span
                                            className={`text-[10px] font-semibold ${
                                                connection
                                                    ? 'text-emerald-600 dark:text-emerald-400'
                                                    : 'text-slate-400 dark:text-zinc-500'
                                            }`}
                                        >
                                            {connection
                                                ? 'Terhubung'
                                                : 'Belum terhubung'}
                                        </span>
                                    </div>
                                    <p className="mt-0.5 truncate text-[11px] text-slate-500 dark:text-zinc-400">
                                        {connection?.google_account_email ??
                                            'Buat kalender RPK khusus di akun Google Anda.'}
                                    </p>
                                    {connection?.last_synced_at && (
                                        <p className="mt-1 text-[10px] text-slate-400 dark:text-zinc-500">
                                            Terakhir sinkron{' '}
                                            {formatDate(
                                                connection.last_synced_at,
                                                true,
                                            )}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {!connection && googleCalendar.configured && (
                                <Button
                                    size="sm"
                                    className="h-8 shrink-0 rounded-lg bg-blue-600 px-3 text-[11px] font-semibold text-white hover:bg-blue-700"
                                    asChild
                                >
                                    <a
                                        href={calendarGoogleRoutes.redirect.url()}
                                    >
                                        Hubungkan Google
                                    </a>
                                </Button>
                            )}
                        </div>

                        {!googleCalendar.configured && (
                            <p className="mt-3 border-t border-slate-200/70 pt-3 text-[11px] leading-4 text-amber-700 dark:border-white/[0.06] dark:text-amber-400">
                                Integrasi OAuth Google belum dikonfigurasi oleh
                                administrator.
                            </p>
                        )}

                        {connection && (
                            <>
                                <Form
                                    action={calendarGoogleRoutes.update.url()}
                                    method="put"
                                    className="mt-4 space-y-4 border-t border-slate-200/70 pt-4 dark:border-white/[0.06]"
                                >
                                    {({ processing }) => (
                                        <>
                                            <div>
                                                <label
                                                    htmlFor="google-calendar-privacy"
                                                    className="text-[10px] font-semibold tracking-[0.08em] text-slate-400 uppercase dark:text-zinc-500"
                                                >
                                                    Privasi Judul Event
                                                </label>
                                                <select
                                                    id="google-calendar-privacy"
                                                    name="privacy_mode"
                                                    defaultValue={
                                                        connection.privacy_mode
                                                    }
                                                    className="mt-1.5 h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 outline-none focus:border-blue-400 dark:border-white/10 dark:bg-[#14161b] dark:text-zinc-200"
                                                >
                                                    <option value="limited">
                                                        Terbatas — jenis
                                                        aktivitas saja
                                                    </option>
                                                    <option value="full">
                                                        Lengkap — nomor perkara
                                                        dan judul
                                                    </option>
                                                    <option value="private">
                                                        Privat — tampil sebagai
                                                        sibuk
                                                    </option>
                                                </select>
                                            </div>

                                            <div className="grid gap-2 sm:grid-cols-3">
                                                {[
                                                    [
                                                        'sync_events',
                                                        'Sidang & Agenda',
                                                        connection.sync_events,
                                                    ],
                                                    [
                                                        'sync_deadlines',
                                                        'Tenggat Perkara',
                                                        connection.sync_deadlines,
                                                    ],
                                                    [
                                                        'sync_tasks',
                                                        'Tugas Saya',
                                                        connection.sync_tasks,
                                                    ],
                                                ].map(
                                                    ([
                                                        name,
                                                        label,
                                                        checked,
                                                    ]) => (
                                                        <label
                                                            key={String(name)}
                                                            className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200/80 bg-white px-3 py-2.5 text-[11px] font-medium text-slate-700 dark:border-white/[0.07] dark:bg-white/[0.03] dark:text-zinc-300"
                                                        >
                                                            <input
                                                                type="hidden"
                                                                name={String(
                                                                    name,
                                                                )}
                                                                value="0"
                                                            />
                                                            <input
                                                                type="checkbox"
                                                                name={String(
                                                                    name,
                                                                )}
                                                                value="1"
                                                                defaultChecked={Boolean(
                                                                    checked,
                                                                )}
                                                                className="size-3.5 rounded border-slate-300 text-blue-600"
                                                            />
                                                            {String(label)}
                                                        </label>
                                                    ),
                                                )}
                                            </div>

                                            <div className="flex justify-end">
                                                <Button
                                                    type="submit"
                                                    size="sm"
                                                    disabled={processing}
                                                    className="h-8 rounded-lg bg-blue-600 px-3 text-[11px] font-semibold text-white hover:bg-blue-700"
                                                >
                                                    Simpan Pengaturan
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                </Form>

                                {connection.last_error && (
                                    <p className="mt-3 text-[11px] leading-4 text-rose-600 dark:text-rose-400">
                                        Sinkronisasi terakhir gagal:{' '}
                                        {connection.last_error}
                                    </p>
                                )}

                                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200/70 pt-3 dark:border-white/[0.06]">
                                    <Form
                                        action={calendarGoogleRoutes.destroy.url()}
                                        method="delete"
                                        onBefore={() =>
                                            window.confirm(
                                                'Putuskan Google Calendar dan hapus kalender RPK dari akun Google Anda?',
                                            )
                                        }
                                    >
                                        {({ processing }) => (
                                            <Button
                                                type="submit"
                                                variant="ghost"
                                                size="sm"
                                                disabled={processing}
                                                className="h-8 rounded-lg px-2.5 text-[11px] font-semibold text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/25"
                                            >
                                                <Trash2 className="mr-1.5 size-3.5" />
                                                Putuskan
                                            </Button>
                                        )}
                                    </Form>
                                    <Form
                                        action={calendarGoogleRoutes.sync.url()}
                                        method="post"
                                    >
                                        {({ processing }) => (
                                            <Button
                                                type="submit"
                                                variant="outline"
                                                size="sm"
                                                disabled={processing}
                                                className="h-8 rounded-lg px-3 text-[11px] font-semibold"
                                            >
                                                <RefreshCw className="mr-1.5 size-3.5" />
                                                Sinkronkan Sekarang
                                            </Button>
                                        )}
                                    </Form>
                                </div>
                            </>
                        )}
                    </section>

                    <div className="flex items-center gap-3">
                        <div className="h-px flex-1 bg-slate-100 dark:bg-white/[0.06]" />
                        <span className="text-[9px] font-semibold tracking-[0.12em] text-slate-400 uppercase dark:text-zinc-500">
                            Pilihan Langganan Manual
                        </span>
                        <div className="h-px flex-1 bg-slate-100 dark:bg-white/[0.06]" />
                    </div>

                    <a
                        href={exportHref}
                        download="RPK-Law-Firm-Calendar.ics"
                        className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-[11px] font-semibold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-200"
                    >
                        <Download className="size-3.5" />
                        Unduh kalender manual (.ics)
                    </a>
                    {/* Opsi 1: Apple Calendar (iPhone / Mac / iPad) */}
                    <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-4 transition-colors hover:border-slate-300 dark:border-white/[0.07] dark:bg-white/[0.025] dark:hover:border-white/15">
                        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-start gap-3">
                                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-950 shadow-xs dark:border-white/10 dark:bg-white/[0.06] dark:text-white">
                                    <AppleLogo className="size-5" />
                                </div>
                                <div className="min-w-0 space-y-0.5">
                                    <div className="flex items-center gap-1.5">
                                        <span className="font-bold text-slate-900 dark:text-white">
                                            Apple Calendar
                                        </span>
                                        <span className="text-[10px] font-semibold text-slate-400 dark:text-zinc-500">
                                            iOS · macOS
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                                        Buka aplikasi Kalender resmi iPhone,
                                        iPad, atau Mac.
                                    </p>
                                </div>
                            </div>
                            <Button
                                size="sm"
                                className="h-8 shrink-0 rounded-lg bg-slate-900 px-3 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 dark:bg-white dark:text-slate-900"
                                asChild
                            >
                                <a href={feed.webcal_url}>
                                    <ExternalLink className="mr-1.5 size-3.5" />
                                    Buka di Apple
                                </a>
                            </Button>
                        </div>
                    </div>

                    {/* Opsi 2: Google Calendar (Android / Web) */}
                    <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-4 transition-colors hover:border-slate-300 dark:border-white/[0.07] dark:bg-white/[0.025] dark:hover:border-white/15">
                        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-start gap-3">
                                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white shadow-xs dark:border-white/10 dark:bg-white/[0.06]">
                                    <GoogleLogo className="size-5" />
                                </div>
                                <div className="min-w-0 space-y-0.5">
                                    <div className="flex items-center gap-1.5">
                                        <span className="font-bold text-slate-900 dark:text-white">
                                            Google Calendar
                                        </span>
                                        <span className="text-[10px] font-semibold text-slate-400 dark:text-zinc-500">
                                            Android · Web
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                                        Tambahkan ke Google Calendar untuk
                                        sinkron ke Android.
                                    </p>
                                </div>
                            </div>
                            <Button
                                size="sm"
                                variant="outline"
                                className="h-8 shrink-0 rounded-lg border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200"
                                asChild
                            >
                                <a
                                    href={feed.google_url}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <ExternalLink className="mr-1.5 size-3.5 text-blue-600 dark:text-blue-400" />
                                    Buka di Google
                                </a>
                            </Button>
                        </div>
                    </div>

                    {/* Opsi 3: Tautan Langganan Langsung (iCal / WebCal URL) */}
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white">
                            <Link2 className="size-3.5 text-slate-400" />
                            <span>
                                Tautan Langganan Kalender Pribadi (URL Feed):
                            </span>
                        </div>
                        <div className="flex gap-1.5">
                            <input
                                type="text"
                                readOnly
                                value={feed.url}
                                className="h-8 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 font-mono text-[11px] text-slate-700 select-all dark:border-white/10 dark:bg-[#121418] dark:text-zinc-300"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleCopy}
                                className="h-8 shrink-0 rounded-lg border-slate-200 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200"
                            >
                                {copied ? (
                                    <>
                                        <Check className="mr-1 size-3.5 text-emerald-600" />
                                        Tersalin!
                                    </>
                                ) : (
                                    <>
                                        <Copy className="mr-1 size-3.5" />
                                        Salin URL
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Panduan Singkat */}
                    <div className="space-y-1.5 rounded-xl border border-slate-200/80 bg-slate-50/60 p-4 text-[11px] text-slate-600 dark:border-white/[0.07] dark:bg-white/[0.025] dark:text-zinc-400">
                        <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-zinc-200">
                            <Info className="size-3.5 text-blue-600 dark:text-blue-400" />
                            <span>
                                Panduan Pengaturan Manual (Google Calendar &amp;
                                Outlook):
                            </span>
                        </div>
                        <ol className="list-decimal space-y-1 pl-4 leading-relaxed">
                            <li>
                                <strong>Google Calendar (Browser):</strong> Buka{' '}
                                <em>calendar.google.com</em>, di bilah kiri klik{' '}
                                <strong>Kalender lainnya (+)</strong> &rarr;
                                pilih <strong>Dari URL</strong> &rarr; tempel
                                tautan di atas &rarr; klik{' '}
                                <strong>Tambahkan Kalender</strong>.
                            </li>
                            <li>
                                <strong>Microsoft Outlook:</strong> Klik{' '}
                                <strong>Tambah Kalender</strong> &rarr; pilih{' '}
                                <strong>Berlangganan dari web</strong> &rarr;
                                tempel tautan di atas &rarr; Simpan.
                            </li>
                        </ol>
                    </div>

                    {/* Keamanan & Rotate Token */}
                    <div className="flex flex-col gap-2 border-t border-slate-100 pt-3 sm:flex-row sm:items-center sm:justify-between dark:border-white/[0.06]">
                        <div className="flex items-center gap-1.5 text-[10.5px] text-slate-400 dark:text-zinc-500">
                            <Lock className="size-3 text-slate-400" />
                            <span>
                                Tautan feed bersifat rahasia dan unik per akun.
                            </span>
                        </div>
                        <Form
                            action={calendarFeedRoutes.rotate.url()}
                            method="post"
                            onSuccess={() => {}}
                        >
                            {({ processing }) => (
                                <Button
                                    type="submit"
                                    variant="ghost"
                                    size="sm"
                                    disabled={processing}
                                    className="h-7 rounded text-[11px] font-semibold text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30"
                                >
                                    <RefreshCw className="mr-1 size-3" />
                                    Buat Ulang Token Kalender
                                </Button>
                            )}
                        </Form>
                    </div>
                </FinanceDialogBody>
            </DialogContent>
        </Dialog>
    );
}

function MonthGrid({
    days,
    month,
    items,
    holidays,
    timezone,
    onSelectItem,
}: {
    days: string[];
    month: string;
    items: CalendarItem[];
    holidays: Holiday[];
    timezone: string;
    onSelectItem: (item: CalendarItem) => void;
}) {
    const todayKey = dateKey(new Date().toISOString(), timezone);
    const holidayByDate = useMemo(
        () => new Map(holidays.map((holiday) => [holiday.date, holiday])),
        [holidays],
    );

    return (
        <div className="overflow-hidden rounded-xl border border-slate-200/70 bg-white shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
            <div className="overflow-x-auto">
                <div className="min-w-[840px]">
                    {/* Days of the Week Header */}
                    <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/60 text-center dark:border-white/[0.04] dark:bg-[#121418]">
                        {[
                            'Senin',
                            'Selasa',
                            'Rabu',
                            'Kamis',
                            'Jumat',
                            'Sabtu',
                            'Minggu',
                        ].map((day, index) => (
                            <div
                                key={day}
                                className={`py-2 text-[10px] font-semibold uppercase ${
                                    index >= 5
                                        ? 'text-rose-600 dark:text-rose-400'
                                        : 'text-slate-500 dark:text-zinc-400'
                                }`}
                            >
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Day Grid Matrix */}
                    <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 dark:divide-white/[0.04]">
                        {days.map((day) => {
                            const dayItems = items.filter(
                                (item) => dateKey(item.date, timezone) === day,
                            );
                            const isCurrentMonth = day.startsWith(month);
                            const isToday = day === todayKey;
                            const dayOfWeek = new Date(
                                `${day}T00:00:00Z`,
                            ).getUTCDay();
                            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                            const holiday = holidayByDate.get(day);
                            const isDayOff = isWeekend || Boolean(holiday);

                            return (
                                <div
                                    key={day}
                                    className={`flex min-h-[132px] flex-col p-2.5 transition-colors ${
                                        isCurrentMonth
                                            ? holiday
                                                ? 'bg-rose-50/70 dark:bg-rose-950/15'
                                                : isWeekend
                                                  ? 'bg-rose-50/30 dark:bg-rose-950/[0.07]'
                                                  : 'bg-white dark:bg-[#14161b]'
                                            : 'bg-slate-50/30 text-slate-400 dark:bg-zinc-900/10 dark:text-zinc-600'
                                    }`}
                                >
                                    {/* Top: Date Number */}
                                    <div className="flex items-center justify-between">
                                        {isToday ? (
                                            <span
                                                className={`flex size-5 items-center justify-center rounded-full text-[10px] font-bold text-white ${
                                                    isDayOff
                                                        ? 'bg-rose-600 dark:bg-rose-500'
                                                        : 'bg-slate-900 dark:bg-white dark:text-slate-900'
                                                }`}
                                            >
                                                {Number(day.slice(-2))}
                                            </span>
                                        ) : (
                                            <span
                                                className={`text-xs font-semibold ${
                                                    isCurrentMonth
                                                        ? isDayOff
                                                            ? 'text-rose-600 dark:text-rose-400'
                                                            : 'text-slate-900 dark:text-white'
                                                        : 'text-slate-400 dark:text-zinc-600'
                                                }`}
                                            >
                                                {Number(day.slice(-2))}
                                            </span>
                                        )}

                                        {dayItems.length > 0 && (
                                            <span className="text-[9px] font-medium text-slate-400 dark:text-zinc-500">
                                                {dayItems.length} aktivitas
                                            </span>
                                        )}
                                    </div>

                                    {holiday && (
                                        <p
                                            className="mt-1 line-clamp-2 text-[8.5px] leading-3 font-semibold text-rose-600 dark:text-rose-400"
                                            title={holiday.name}
                                        >
                                            {holiday.name}
                                        </p>
                                    )}

                                    {/* Events Chip Container */}
                                    <div className="mt-1.5 flex-1 space-y-1">
                                        {dayItems.slice(0, 3).map((item) => {
                                            const chipStyle =
                                                item.kind === 'Tenggat'
                                                    ? 'border-rose-200/80 bg-rose-50/75 text-rose-800 hover:border-rose-300 hover:bg-rose-50 dark:border-rose-900/40 dark:bg-rose-950/25 dark:text-rose-200 dark:hover:border-rose-800/60'
                                                    : item.kind === 'Agenda'
                                                      ? 'border-blue-200/80 bg-blue-50/75 text-blue-800 hover:border-blue-300 hover:bg-blue-50 dark:border-blue-900/40 dark:bg-blue-950/25 dark:text-blue-200 dark:hover:border-blue-800/60'
                                                      : 'border-slate-200 bg-slate-50/90 text-slate-700 hover:border-slate-300 hover:bg-slate-100/70 dark:border-white/10 dark:bg-white/[0.045] dark:text-zinc-200 dark:hover:border-white/20';
                                            return (
                                                <button
                                                    type="button"
                                                    key={`${item.kind}-${item.id}`}
                                                    onClick={() =>
                                                        onSelectItem(item)
                                                    }
                                                    title={`${item.kind}: ${item.title}`}
                                                    aria-label={`${item.kind}: ${item.title}, pukul ${formatTime(item.date, timezone)}`}
                                                    className={`group grid w-full cursor-pointer grid-cols-[minmax(0,1fr)_auto] items-center gap-1.5 overflow-hidden rounded-md border px-2 py-1.5 text-left shadow-[0_1px_1px_rgba(15,23,42,0.03)] transition-all duration-150 hover:-translate-y-px hover:shadow-sm focus-visible:ring-2 focus-visible:ring-slate-400/40 focus-visible:outline-none ${chipStyle}`}
                                                >
                                                    <span className="truncate text-[9.5px] leading-3 font-semibold">
                                                        {item.title}
                                                    </span>
                                                    <span className="shrink-0 border-l border-current/15 pl-1.5 font-mono text-[8.5px] leading-3 font-semibold tabular-nums opacity-70">
                                                        {formatTime(
                                                            item.date,
                                                            timezone,
                                                        )}
                                                    </span>
                                                </button>
                                            );
                                        })}

                                        {dayItems.length > 3 && (
                                            <span className="block border-t border-dashed border-slate-200/80 pt-1 text-center text-[9px] font-semibold text-slate-400 dark:border-white/[0.07] dark:text-zinc-500">
                                                +{dayItems.length - 3} lainnya
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

function ListView({
    items,
    onSelectItem,
}: {
    items: CalendarItem[];
    onSelectItem: (item: CalendarItem) => void;
}) {
    if (!items.length) {
        return (
            <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-slate-200/70 bg-white p-8 text-center shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                <EmptyState
                    title="Tidak ada agenda pada bulan ini"
                    description="Seluruh tenggat, sidang, atau tugas perkara akan otomatis terdaftar di sini."
                />
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-xl border border-slate-200/70 bg-white shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
            <div className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                {items.map((item) => {
                    const iconStyle =
                        item.kind === 'Tenggat'
                            ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400'
                            : item.kind === 'Agenda'
                              ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400'
                              : 'bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400';

                    const IconComp = item.icon;

                    return (
                        <div
                            key={`${item.kind}-${item.id}`}
                            onClick={() => onSelectItem(item)}
                            className="group flex cursor-pointer flex-col justify-between gap-2.5 p-3.5 transition-colors hover:bg-slate-50/50 sm:flex-row sm:items-center dark:hover:bg-white/[0.02]"
                        >
                            <div className="flex min-w-0 items-center gap-2.5">
                                <div
                                    className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${iconStyle}`}
                                >
                                    <IconComp className="size-3.5" />
                                </div>
                                <div className="min-w-0">
                                    <h4 className="truncate text-xs font-semibold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                                        {item.title}
                                    </h4>
                                    <p className="font-mono text-[10px] text-slate-500 dark:text-zinc-400">
                                        {item.matter ? (
                                            <span>
                                                <span className="font-semibold text-slate-700 dark:text-zinc-300">
                                                    {item.matter.matter_number}
                                                </span>{' '}
                                                · {item.matter.title}
                                            </span>
                                        ) : (
                                            'Agenda Operasional Umum'
                                        )}
                                    </p>
                                </div>
                            </div>

                            <div className="flex shrink-0 items-center gap-2.5">
                                <time className="font-mono text-xs text-slate-700 dark:text-zinc-300">
                                    {formatDate(item.date, true)}
                                </time>
                                {item.is_critical ? (
                                    <StatusBadge value="critical" />
                                ) : item.status ? (
                                    <StatusBadge value={item.status} />
                                ) : (
                                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700 dark:bg-white/[0.06] dark:text-zinc-300">
                                        {item.kind}
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function dateRange(from: string, until: string): string[] {
    const days: string[] = [];
    const cursor = new Date(`${from}T00:00:00Z`);
    const last = new Date(`${until}T00:00:00Z`);

    while (cursor <= last) {
        days.push(cursor.toISOString().slice(0, 10));
        cursor.setUTCDate(cursor.getUTCDate() + 1);
    }

    return days;
}

function dateKey(value: string, timezone: string): string {
    const parts = new Intl.DateTimeFormat('en-CA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        timeZone: timezone,
    }).formatToParts(new Date(value));
    const get = (type: string) =>
        parts.find((part) => part.type === type)?.value;

    return `${get('year')}-${get('month')}-${get('day')}`;
}

function formatTime(value: string, timezone: string): string {
    return new Intl.DateTimeFormat('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: timezone,
    }).format(new Date(value));
}

function shiftMonth(month: string, amount: number): string {
    const [year, monthNumber] = month.split('-').map(Number);
    const date = new Date(Date.UTC(year, monthNumber - 1 + amount, 1));

    return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
}

CalendarIndex.layout = {
    breadcrumbs: [{ title: 'Kalender', href: calendarRoutes.index.url() }],
};
