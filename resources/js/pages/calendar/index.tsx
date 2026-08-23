import { Head, Link } from '@inertiajs/react';
import {
    AlertCircle,
    Calendar as CalendarIcon,
    CalendarClock,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Gavel,
    Grid3X3,
    List,
    ListTodo,
    Scale,
    Users,
} from 'lucide-react';
import { useState } from 'react';
import { EmptyState } from '@/components/empty-state';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/format';
import * as calendarRoutes from '@/routes/calendar';
import * as matterRoutes from '@/routes/matters';

type Item = {
    id: string;
    title: string;
    due_at?: string;
    starts_at?: string;
    is_critical?: boolean;
    status?: string;
    matter?: { id: string; matter_number: string; title: string };
};

type CalendarItem = Item & {
    date: string;
    kind: 'Tenggat' | 'Agenda' | 'Tugas';
    icon: typeof Gavel;
};

export default function CalendarIndex({
    deadlines,
    events,
    tasks,
    range,
    month,
    timezone,
}: {
    deadlines: Item[];
    events: Item[];
    tasks: Item[];
    range: { from: string; until: string };
    month: string;
    timezone: string;
}) {
    const [view, setView] = useState<'month' | 'list'>('month');

    const items: CalendarItem[] = [
        ...deadlines.map((item) => ({
            ...item,
            date: item.due_at!,
            kind: 'Tenggat' as const,
            icon: Gavel,
        })),
        ...events.map((item) => ({
            ...item,
            date: item.starts_at!,
            kind: 'Agenda' as const,
            icon: CalendarClock,
        })),
        ...tasks.map((item) => ({
            ...item,
            date: item.due_at!,
            kind: 'Tugas' as const,
            icon: ListTodo,
        })),
    ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const days = dateRange(range.from, range.until);
    const [year, monthNumber] = month.split('-').map(Number);
    const title = new Intl.DateTimeFormat('id-ID', {
        month: 'long',
        year: 'numeric',
        timeZone: timezone,
    }).format(new Date(Date.UTC(year, monthNumber - 1, 1)));

    return (
        <>
            <Head title={`Kalender & Jadwal — ${title}`} />

            <div className="min-h-screen w-full bg-[#fbfbfa] text-[#111111] antialiased dark:bg-[#121212] dark:text-[#fbfbfa]">
                <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
                    {/* Notion Minimalist Header */}
                    <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div className="space-y-1">
                            <h1 className="text-2xl font-bold tracking-tight text-[#111111] capitalize dark:text-white">
                                {title}
                            </h1>
                            <p className="text-xs text-[#787774] dark:text-zinc-400">
                                Agenda terpadu jadwal sidang pengadilan, tenggat waktu bukti, dan tugas perkara ({timezone}).
                            </p>
                        </div>

                        {/* Month Navigation & View Toggle */}
                        <div className="flex flex-wrap items-center gap-2">
                            {/* Previous / Today / Next Month Controls */}
                            <div className="flex items-center gap-1 rounded-lg border border-black/[0.08] bg-white p-1 shadow-2xs dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-7 rounded-md text-[#787774] hover:bg-black/[0.04] hover:text-[#111111] dark:text-zinc-400 dark:hover:bg-white/[0.06] dark:hover:text-white"
                                    asChild
                                >
                                    <Link
                                        href={calendarRoutes.index({
                                            query: { month: shiftMonth(month, -1) },
                                        })}
                                        aria-label="Bulan sebelumnya"
                                    >
                                        <ChevronLeft className="size-4" />
                                    </Link>
                                </Button>

                                <Button
                                    variant="ghost"
                                    className="h-7 rounded-md px-2.5 text-xs font-medium text-[#111111] hover:bg-black/[0.04] dark:text-zinc-200 dark:hover:bg-white/[0.06]"
                                    asChild
                                >
                                    <Link href={calendarRoutes.index()}>
                                        Hari Ini
                                    </Link>
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-7 rounded-md text-[#787774] hover:bg-black/[0.04] hover:text-[#111111] dark:text-zinc-400 dark:hover:bg-white/[0.06] dark:hover:text-white"
                                    asChild
                                >
                                    <Link
                                        href={calendarRoutes.index({
                                            query: { month: shiftMonth(month, 1) },
                                        })}
                                        aria-label="Bulan berikutnya"
                                    >
                                        <ChevronRight className="size-4" />
                                    </Link>
                                </Button>
                            </div>

                            {/* View Segmented Pill Switcher */}
                            <div className="inline-flex rounded-lg bg-black/[0.04] p-1 dark:bg-white/[0.06]">
                                <button
                                    type="button"
                                    onClick={() => setView('month')}
                                    className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                                        view === 'month'
                                            ? 'bg-white text-[#111111] shadow-2xs dark:bg-zinc-700 dark:text-white'
                                            : 'text-[#787774] hover:text-[#111111] dark:text-zinc-400 dark:hover:text-white'
                                    }`}
                                >
                                    <Grid3X3 className="size-3.5" />
                                    Bulan
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setView('list')}
                                    className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                                        view === 'list'
                                            ? 'bg-white text-[#111111] shadow-2xs dark:bg-zinc-700 dark:text-white'
                                            : 'text-[#787774] hover:text-[#111111] dark:text-zinc-400 dark:hover:text-white'
                                    }`}
                                >
                                    <List className="size-3.5" />
                                    Daftar Agenda
                                </button>
                            </div>
                        </div>
                    </header>

                    {/* Compact 4-Column Stat Strip (h-[76px]) */}
                    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {/* 1. Sidang & Agenda */}
                        <div className="flex h-[76px] flex-col justify-between rounded-xl border border-black/[0.07] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                            <div className="flex items-center justify-between text-[11px] font-medium text-[#787774] dark:text-zinc-400">
                                <span>Sidang & Agenda</span>
                                <Gavel className="size-3.5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div className="flex items-baseline justify-between">
                                <span className="font-mono text-lg font-bold tracking-tight text-purple-600 dark:text-purple-400">
                                    {events.length}
                                </span>
                                <span className="text-[10px] text-[#787774] dark:text-zinc-400">
                                    pengadilan & mediasi
                                </span>
                            </div>
                        </div>

                        {/* 2. Tenggat Waktu */}
                        <div className="flex h-[76px] flex-col justify-between rounded-xl border border-black/[0.07] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                            <div className="flex items-center justify-between text-[11px] font-medium text-[#787774] dark:text-zinc-400">
                                <span>Tenggat Kritis</span>
                                <CalendarClock className="size-3.5 text-rose-600 dark:text-rose-400" />
                            </div>
                            <div className="flex items-baseline justify-between">
                                <span className="font-mono text-lg font-bold tracking-tight text-rose-600 dark:text-rose-400">
                                    {deadlines.length}
                                </span>
                                <span className="text-[10px] text-[#787774] dark:text-zinc-400">
                                    batas waktu berkas
                                </span>
                            </div>
                        </div>

                        {/* 3. Tugas Terkait */}
                        <div className="flex h-[76px] flex-col justify-between rounded-xl border border-black/[0.07] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                            <div className="flex items-center justify-between text-[11px] font-medium text-[#787774] dark:text-zinc-400">
                                <span>Tugas Terkait</span>
                                <ListTodo className="size-3.5 text-[#1f6c9f] dark:text-sky-400" />
                            </div>
                            <div className="flex items-baseline justify-between">
                                <span className="font-mono text-lg font-bold tracking-tight text-[#111111] dark:text-white">
                                    {tasks.length}
                                </span>
                                <span className="text-[10px] text-[#787774] dark:text-zinc-400">
                                    jatuh tempo
                                </span>
                            </div>
                        </div>

                        {/* 4. Total Aktivitas */}
                        <div className="flex h-[76px] flex-col justify-between rounded-xl border border-black/[0.07] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                            <div className="flex items-center justify-between text-[11px] font-medium text-[#787774] dark:text-zinc-400">
                                <span>Total Jadwal</span>
                                <CalendarIcon className="size-3.5 text-[#2d5530] dark:text-emerald-400" />
                            </div>
                            <div className="flex items-baseline justify-between">
                                <span className="font-mono text-lg font-bold tracking-tight text-[#111111] dark:text-white">
                                    {items.length}
                                </span>
                                <span className="text-[10px] text-[#787774] dark:text-zinc-400">
                                    aktivitas kalender
                                </span>
                            </div>
                        </div>
                    </section>

                    {/* View Switch: Month Grid or List View */}
                    {view === 'month' ? (
                        <MonthGrid
                            days={days}
                            month={month}
                            items={items}
                            timezone={timezone}
                        />
                    ) : (
                        <ListView items={items} />
                    )}
                </main>
            </div>
        </>
    );
}

function MonthGrid({
    days,
    month,
    items,
    timezone,
}: {
    days: string[];
    month: string;
    items: CalendarItem[];
    timezone: string;
}) {
    const todayKey = dateKey(new Date().toISOString(), timezone);

    return (
        <div className="overflow-hidden rounded-xl border border-black/[0.08] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
            <div className="overflow-x-auto">
                <div className="min-w-[900px]">
                    {/* Days of the Week Header */}
                    <div className="grid grid-cols-7 border-b border-black/[0.05] bg-[#fafafa] text-center dark:border-white/[0.05] dark:bg-[#161618]">
                        {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'].map((day) => (
                            <div
                                key={day}
                                className="py-2.5 text-[10px] font-semibold uppercase tracking-wider text-[#787774]"
                            >
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Day Grid Matrix */}
                    <div className="grid grid-cols-7 divide-x divide-y divide-black/[0.04] dark:divide-white/[0.04]">
                        {days.map((day) => {
                            const dayItems = items.filter(
                                (item) => dateKey(item.date, timezone) === day,
                            );
                            const isCurrentMonth = day.startsWith(month);
                            const isToday = day === todayKey;

                            return (
                                <div
                                    key={day}
                                    className={`flex min-h-[125px] flex-col justify-between p-2 transition-colors ${
                                        isCurrentMonth
                                            ? 'bg-white dark:bg-[#1a1a1c]'
                                            : 'bg-[#fafafa]/50 text-[#787774]/50 dark:bg-zinc-900/20 dark:text-zinc-600'
                                    }`}
                                >
                                    {/* Top: Date Number */}
                                    <div className="flex items-center justify-between">
                                        {isToday ? (
                                            <span className="flex size-5.5 items-center justify-center rounded-full bg-[#111111] text-[11px] font-bold text-white shadow-2xs dark:bg-white dark:text-black">
                                                {Number(day.slice(-2))}
                                            </span>
                                        ) : (
                                            <span
                                                className={`text-xs font-semibold ${
                                                    isCurrentMonth
                                                        ? 'text-[#111111] dark:text-white'
                                                        : 'text-[#787774]/60 dark:text-zinc-600'
                                                }`}
                                            >
                                                {Number(day.slice(-2))}
                                            </span>
                                        )}

                                        {dayItems.length > 0 && (
                                            <span className="font-mono text-[9px] text-[#787774] dark:text-zinc-500">
                                                {dayItems.length} agenda
                                            </span>
                                        )}
                                    </div>

                                    {/* Events Chip Container */}
                                    <div className="mt-1.5 flex-1 space-y-1">
                                        {dayItems.slice(0, 3).map((item) => {
                                            const chipStyle =
                                                item.kind === 'Tenggat'
                                                    ? 'bg-[#fdebec] text-[#9f2f2d] dark:bg-rose-950/40 dark:text-rose-300'
                                                    : item.kind === 'Agenda'
                                                      ? 'bg-purple-50 text-purple-800 dark:bg-purple-950/40 dark:text-purple-300'
                                                      : 'bg-[#e1f3fe] text-[#1f6c9f] dark:bg-blue-950/40 dark:text-blue-300';

                                            return (
                                                <Link
                                                    key={`${item.kind}-${item.id}`}
                                                    href={
                                                        item.matter
                                                            ? matterRoutes.show(item.matter.id)
                                                            : calendarRoutes.index()
                                                    }
                                                    title={`${item.kind}: ${item.title}`}
                                                    className={`group block truncate rounded-md px-1.5 py-0.5 text-[10px] font-medium transition-colors hover:opacity-80 ${chipStyle}`}
                                                >
                                                    <div className="flex items-center gap-1 truncate">
                                                        <span className="font-mono text-[9px] opacity-75">
                                                            {formatTime(item.date, timezone)}
                                                        </span>
                                                        <span className="truncate">{item.title}</span>
                                                    </div>
                                                </Link>
                                            );
                                        })}

                                        {dayItems.length > 3 && (
                                            <span className="block text-center text-[9px] font-medium text-[#787774] dark:text-zinc-500">
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

function ListView({ items }: { items: CalendarItem[] }) {
    if (!items.length) {
        return (
            <div className="flex min-h-[380px] items-center justify-center rounded-xl border border-black/[0.08] bg-white p-12 text-center shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                <EmptyState
                    title="Tidak ada agenda pada bulan ini"
                    description="Seluruh tenggat, sidang, atau tugas perkara akan otomatis terdaftar di sini."
                />
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-xl border border-black/[0.08] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
            <div className="divide-y divide-black/[0.04] dark:divide-white/[0.04]">
                {items.map((item) => {
                    const iconStyle =
                        item.kind === 'Tenggat'
                            ? 'bg-[#fdebec] text-[#9f2f2d] dark:bg-rose-950/40 dark:text-rose-400'
                            : item.kind === 'Agenda'
                              ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400'
                              : 'bg-[#e1f3fe] text-[#1f6c9f] dark:bg-blue-950/40 dark:text-sky-400';

                    const IconComp = item.icon;

                    return (
                        <Link
                            key={`${item.kind}-${item.id}`}
                            href={
                                item.matter
                                    ? matterRoutes.show(item.matter.id)
                                    : calendarRoutes.index()
                            }
                            className="group flex flex-col justify-between gap-3 p-3.5 transition-colors hover:bg-black/[0.02] sm:flex-row sm:items-center dark:hover:bg-white/[0.03]"
                        >
                            <div className="flex min-w-0 items-center gap-3">
                                <div className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${iconStyle}`}>
                                    <IconComp className="size-4" />
                                </div>
                                <div className="min-w-0">
                                    <h4 className="truncate text-xs font-semibold text-[#111111] group-hover:text-blue-600 dark:text-white dark:group-hover:text-sky-400">
                                        {item.title}
                                    </h4>
                                    <p className="font-mono text-[10px] text-[#787774] dark:text-zinc-400">
                                        {item.matter ? (
                                            <span>
                                                {item.matter.matter_number} · {item.matter.title}
                                            </span>
                                        ) : (
                                            'Tugas Personal'
                                        )}
                                    </p>
                                </div>
                            </div>

                            <div className="flex shrink-0 items-center gap-3">
                                <time className="font-mono text-xs text-[#787774] dark:text-zinc-400">
                                    {formatDate(item.date, true)}
                                </time>
                                {item.is_critical ? (
                                    <StatusBadge value="critical" />
                                ) : item.status ? (
                                    <StatusBadge value={item.status} />
                                ) : (
                                    <span className="rounded-md bg-black/[0.04] px-2 py-0.5 text-[10px] font-medium text-[#787774] dark:bg-white/[0.06] dark:text-zinc-300">
                                        {item.kind}
                                    </span>
                                )}
                            </div>
                        </Link>
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
    const get = (type: string) => parts.find((part) => part.type === type)?.value;

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
    breadcrumbs: [{ title: 'Kalender', href: calendarRoutes.index() }],
};
