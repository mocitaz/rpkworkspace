import { Form, Head, Link } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowUpRight,
    Calendar as CalendarIcon,
    CalendarClock,
    Check,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Clock,
    Copy,
    Download,
    ExternalLink,
    Gavel,
    Globe,
    Grid3X3,
    Info,
    Laptop,
    Link2,
    List,
    ListTodo,
    Lock,
    MapPin,
    Radio,
    RefreshCw,
    Scale,
    ShieldCheck,
    Smartphone,
    TrendingUp,
    Users,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { EmptyState } from '@/components/empty-state';
import { CalendarDashboardHero } from '@/components/calendar-dashboard-hero';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { formatDate } from '@/lib/format';
import * as calendarRoutes from '@/routes/calendar';
import * as calendarExportRoutes from '@/routes/calendar/export';
import * as calendarFeedRoutes from '@/routes/calendar/feed';
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

type CalendarFeed = {
    token: string;
    url: string;
    webcal_url: string;
    google_url: string;
};

export default function CalendarIndex({
    deadlines,
    events,
    tasks,
    range,
    month,
    timezone,
    feed,
}: {
    deadlines: Item[];
    events: Item[];
    tasks: Item[];
    range: { from: string; until: string };
    month: string;
    timezone: string;
    feed?: CalendarFeed;
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
        if (selectedCategory === 'all') return allItems;
        return allItems.filter((i) => i.kind === selectedCategory);
    }, [allItems, selectedCategory]);

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

            <div className="min-h-screen bg-[#fafafc] pb-20 dark:bg-[#0c0d10]">
                <main className="mx-auto max-w-7xl space-y-5 px-4 py-5 sm:px-6 lg:px-8">
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
                    <div className="flex flex-wrap items-center gap-1.5">
                        <button
                            type="button"
                            onClick={() => setSelectedCategory('all')}
                            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                                selectedCategory === 'all'
                                    ? 'bg-slate-900 text-white shadow-2xs dark:bg-white dark:text-slate-900'
                                    : 'border border-slate-200/70 bg-white text-slate-600 hover:bg-slate-50 dark:border-white/[0.06] dark:bg-[#14161b] dark:text-zinc-400'
                            }`}
                        >
                            Semua Aktivitas ({allItems.length})
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedCategory('Agenda')}
                            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                                selectedCategory === 'Agenda'
                                    ? 'bg-blue-600 text-white shadow-2xs'
                                    : 'border border-slate-200/70 bg-white text-blue-700 hover:bg-blue-50/50 dark:border-white/[0.06] dark:bg-[#14161b] dark:text-blue-400'
                            }`}
                        >
                            Sidang &amp; Agenda ({events.length})
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedCategory('Tenggat')}
                            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                                selectedCategory === 'Tenggat'
                                    ? 'bg-rose-600 text-white shadow-2xs'
                                    : 'border border-slate-200/70 bg-white text-rose-700 hover:bg-rose-50/50 dark:border-white/[0.06] dark:bg-[#14161b] dark:text-rose-400'
                            }`}
                        >
                            Tenggat Waktu ({deadlines.length})
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedCategory('Tugas')}
                            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                                selectedCategory === 'Tugas'
                                    ? 'bg-slate-800 text-white shadow-2xs dark:bg-zinc-200 dark:text-slate-900'
                                    : 'border border-slate-200/70 bg-white text-slate-700 hover:bg-slate-50 dark:border-white/[0.06] dark:bg-[#14161b] dark:text-zinc-300'
                            }`}
                        >
                            Tugas Terkait ({tasks.length})
                        </button>
                    </div>

                    {/* 4. View Switch: Month Grid or List View */}
                    {view === 'month' ? (
                        <MonthGrid
                            days={days}
                            month={month}
                            items={filteredItems}
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
                    <DialogContent className="max-h-[85vh] overflow-y-auto rounded-xl border border-slate-200/80 bg-white p-5 shadow-xl sm:max-w-md dark:border-white/10 dark:bg-[#14161b]">
                        <DialogHeader className="border-b border-slate-100 pb-3 dark:border-white/[0.06]">
                            <div className="flex items-start justify-between gap-3">
                                <div className="space-y-1">
                                    <div className="flex flex-wrap items-center gap-1.5">
                                        {selectedItem.kind === 'Agenda' && (
                                            <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                                                Sidang &amp; Agenda
                                            </span>
                                        )}
                                        {selectedItem.kind === 'Tenggat' && (
                                            <span className="rounded bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
                                                Batas Waktu Tenggat
                                            </span>
                                        )}
                                        {selectedItem.kind === 'Tugas' && (
                                            <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700 dark:bg-white/[0.06] dark:text-zinc-300">
                                                Instruksi Tugas
                                            </span>
                                        )}
                                        {selectedItem.is_critical && (
                                            <span className="rounded bg-rose-600 px-2 py-0.5 text-[10px] font-semibold text-white uppercase">
                                                Prioritas Kritis
                                            </span>
                                        )}
                                        {selectedItem.status && (
                                            <StatusBadge
                                                value={selectedItem.status}
                                            />
                                        )}
                                    </div>
                                    <DialogTitle className="pt-0.5 text-sm font-bold text-slate-900 dark:text-white">
                                        {selectedItem.title}
                                    </DialogTitle>
                                </div>
                            </div>
                        </DialogHeader>

                        <div className="space-y-4 pt-1">
                            {/* Linked Matter Card */}
                            {selectedItem.matter ? (
                                <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-3 dark:border-blue-900/30 dark:bg-blue-950/20">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <span className="text-[10px] font-semibold text-blue-600 uppercase dark:text-blue-400">
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
                                            className="h-7 rounded-lg border-blue-200 bg-white px-2.5 text-xs font-semibold text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300"
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
                                <div className="rounded-lg border border-slate-200/70 bg-slate-50/60 p-2.5 text-xs text-slate-500 dark:border-white/[0.04] dark:bg-[#121418]">
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
                            <div className="space-y-2 rounded-lg border border-slate-200/70 bg-slate-50/60 p-3 text-xs dark:border-white/[0.04] dark:bg-[#121418]">
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
                        </div>
                    </DialogContent>
                )}
            </Dialog>

            {/* Live Calendar Subscription (WebCal) Modal */}
            <LiveCalendarSyncModal
                open={liveSyncOpen}
                onOpenChange={setLiveSyncOpen}
                feed={feed}
                exportHref={calendarExportRoutes.ics.url()}
            />
        </>
    );
}

function LiveCalendarSyncModal({
    open,
    onOpenChange,
    feed,
    exportHref,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    feed?: CalendarFeed;
    exportHref: string;
}) {
    const [copied, setCopied] = useState(false);
    if (!feed) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(feed.url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xl sm:max-w-lg dark:border-white/10 dark:bg-[#14161b]">
                <DialogHeader className="border-b border-slate-100 pb-3.5 dark:border-white/[0.06]">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                            <Radio className="size-5" />
                        </div>
                        <div>
                            <DialogTitle className="text-sm font-bold text-slate-900 dark:text-white">
                                Langganan Kalender Otomatis (Live Sync)
                            </DialogTitle>
                            <DialogDescription className="text-xs text-slate-500 dark:text-zinc-400">
                                Jadwal sidang, mediasi, dan tenggat perkara akan
                                otomatis tersinkronisasi langsung ke HP Anda.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-3.5 pt-2 text-xs">
                    <a
                        href={exportHref}
                        download="RPK-Law-Firm-Calendar.ics"
                        className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-[11px] font-semibold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-200"
                    >
                        <Download className="size-3.5" />
                        Unduh kalender manual (.ics)
                    </a>
                    {/* Opsi 1: Apple Calendar (iPhone / Mac / iPad) */}
                    <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5 transition-all hover:border-slate-400 hover:bg-white dark:border-white/[0.06] dark:bg-[#121418] dark:hover:border-zinc-700">
                        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-start gap-3">
                                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                                    <Laptop className="size-4" />
                                </div>
                                <div className="min-w-0 space-y-0.5">
                                    <div className="flex items-center gap-1.5">
                                        <span className="font-bold text-slate-900 dark:text-white">
                                            Apple Calendar
                                        </span>
                                        <span className="rounded bg-slate-200/70 px-1.5 py-0.5 text-[9.5px] font-semibold text-slate-700 dark:bg-white/10 dark:text-zinc-300">
                                            iOS • Mac
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
                    <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5 transition-all hover:border-blue-400 hover:bg-white dark:border-white/[0.06] dark:bg-[#121418] dark:hover:border-blue-700">
                        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-start gap-3">
                                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                                    <Globe className="size-4" />
                                </div>
                                <div className="min-w-0 space-y-0.5">
                                    <div className="flex items-center gap-1.5">
                                        <span className="font-bold text-slate-900 dark:text-white">
                                            Google Calendar
                                        </span>
                                        <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[9.5px] font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                                            Android • Web
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
                    <div className="space-y-1.5 rounded-xl border border-slate-200/60 bg-slate-50/70 p-3 text-[11px] text-slate-600 dark:border-white/[0.04] dark:bg-[#121418] dark:text-zinc-400">
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
                </div>
            </DialogContent>
        </Dialog>
    );
}

function MonthGrid({
    days,
    month,
    items,
    timezone,
    onSelectItem,
}: {
    days: string[];
    month: string;
    items: CalendarItem[];
    timezone: string;
    onSelectItem: (item: CalendarItem) => void;
}) {
    const todayKey = dateKey(new Date().toISOString(), timezone);

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
                        ].map((day) => (
                            <div
                                key={day}
                                className="py-2 text-[10px] font-semibold text-slate-500 uppercase dark:text-zinc-400"
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

                            return (
                                <div
                                    key={day}
                                    className={`flex min-h-[110px] flex-col justify-between p-2 transition-colors ${
                                        isCurrentMonth
                                            ? 'bg-white dark:bg-[#14161b]'
                                            : 'bg-slate-50/30 text-slate-400 dark:bg-zinc-900/10 dark:text-zinc-600'
                                    }`}
                                >
                                    {/* Top: Date Number */}
                                    <div className="flex items-center justify-between">
                                        {isToday ? (
                                            <span className="flex size-5 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white dark:bg-white dark:text-slate-900">
                                                {Number(day.slice(-2))}
                                            </span>
                                        ) : (
                                            <span
                                                className={`text-xs font-semibold ${
                                                    isCurrentMonth
                                                        ? 'text-slate-900 dark:text-white'
                                                        : 'text-slate-400 dark:text-zinc-600'
                                                }`}
                                            >
                                                {Number(day.slice(-2))}
                                            </span>
                                        )}

                                        {dayItems.length > 0 && (
                                            <span className="py-0.2 rounded bg-slate-100 px-1 font-mono text-[9px] font-medium text-slate-600 dark:bg-zinc-800 dark:text-zinc-400">
                                                {dayItems.length}
                                            </span>
                                        )}
                                    </div>

                                    {/* Events Chip Container */}
                                    <div className="mt-1.5 flex-1 space-y-1">
                                        {dayItems.slice(0, 3).map((item) => {
                                            const chipStyle =
                                                item.kind === 'Tenggat'
                                                    ? 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/30'
                                                    : item.kind === 'Agenda'
                                                      ? 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900/30'
                                                      : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-zinc-800/80 dark:text-zinc-300 dark:border-white/10';

                                            return (
                                                <button
                                                    type="button"
                                                    key={`${item.kind}-${item.id}`}
                                                    onClick={() =>
                                                        onSelectItem(item)
                                                    }
                                                    title={`${item.kind}: ${item.title}`}
                                                    className={`group flex w-full cursor-pointer items-center justify-between gap-1 truncate rounded border px-1.5 py-0.5 text-left text-[9.5px] font-medium transition-all hover:shadow-2xs ${chipStyle}`}
                                                >
                                                    <span className="truncate">
                                                        {item.title}
                                                    </span>
                                                    <span className="shrink-0 font-mono text-[8.5px] opacity-75">
                                                        {formatTime(
                                                            item.date,
                                                            timezone,
                                                        )}
                                                    </span>
                                                </button>
                                            );
                                        })}

                                        {dayItems.length > 3 && (
                                            <span className="block text-center text-[9px] font-medium text-slate-400 dark:text-zinc-500">
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
