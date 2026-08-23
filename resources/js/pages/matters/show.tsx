import { Form, Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Briefcase,
    CalendarClock,
    CheckCircle2,
    ChevronDown,
    ChevronRight,
    FileText,
    FileUp,
    FolderKanban,
    Gavel,
    Lock,
    MessageSquare,
    Plus,
    Scale,
    ShieldAlert,
    ShieldCheck,
    UserCheck,
    Users,
} from 'lucide-react';
import { useState } from 'react';
import { EmptyState } from '@/components/empty-state';
import { MatterEditDialog } from '@/components/matter-edit-dialog';
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
import { formatBytes, formatDate } from '@/lib/format';
import * as clientRoutes from '@/routes/clients';
import * as documentRoutes from '@/routes/documents';
import * as matterRoutes from '@/routes/matters';
import * as deadlineRoutes from '@/routes/matters/deadlines';
import * as eventRoutes from '@/routes/matters/events';
import * as noteRoutes from '@/routes/matters/notes';
import * as partyRoutes from '@/routes/matters/parties';

type Person = {
    id: number;
    name: string;
    position_title?: string;
    avatar_url?: string | null;
};

type Matter = {
    id: string;
    matter_number: string;
    title: string;
    summary?: string;
    status: string;
    priority: string;
    confidentiality_level: string;
    matter_type?: string;
    opened_at?: string;
    jurisdiction?: string;
    client: { id: string; client_number: string; display_name: string };
    practice_area?: { name: string };
    responsible_partner: Person;
    responsible_partner_id: number;
    supervising_lawyer?: Person;
    supervising_lawyer_id?: number;
    practice_area_id?: number;
    closed_at?: string;
    court?: string;
    external_case_number?: string;
    members: Person[];
    deadlines: {
        id: string;
        title: string;
        due_at: string;
        is_critical: boolean;
        status: string;
    }[];
    tasks: {
        id: string;
        title: string;
        status: string;
        priority: string;
        due_at?: string;
        assignee?: Person;
    }[];
    events: {
        id: string;
        title: string;
        event_type: string;
        starts_at: string;
        description?: string;
    }[];
    documents: {
        id: string;
        title: string;
        status: string;
        updated_at: string;
        current_version?: {
            version_number: number;
            file_size: number;
            mime_type: string;
        };
    }[];
    notes: {
        id: string;
        title?: string;
        body: string;
        classification: string;
        created_at: string;
    }[];
    parties: {
        id: string;
        name: string;
        organization_name?: string;
        party_type: string;
    }[];
};

const tabs = [
    { id: 'Overview', label: 'Ringkasan' },
    { id: 'Tugas', label: 'Tugas' },
    { id: 'Timeline', label: 'Timeline & Sidang' },
    { id: 'Dokumen', label: 'Dokumen' },
    { id: 'Catatan', label: 'Catatan' },
] as const;

const partyTypeLabels: Record<string, string> = {
    client_contact: 'Kontak Klien',
    client_representative: 'Perwakilan Klien',
    opposing_party: 'Pihak Lawan',
    opposing_counsel: 'Kuasa Hukum Lawan',
    witness: 'Saksi',
    expert_witness: 'Saksi Ahli',
    court_official: 'Aparatur Pengadilan',
    other: 'Pihak Terkait',
};

const eventTypeMeta: Record<string, { label: string; icon: any; color: string }> = {
    partner_review: {
        label: 'Review Partner',
        icon: UserCheck,
        color: 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300',
    },
    client_meeting: {
        label: 'Pertemuan Klien',
        icon: Users,
        color: 'bg-[#e1f3fe] text-[#1f6c9f] dark:bg-blue-950/40 dark:text-sky-300',
    },
    court: {
        label: 'Sidang Pengadilan',
        icon: Gavel,
        color: 'bg-[#fbf3db] text-[#956400] dark:bg-amber-950/40 dark:text-amber-300',
    },
    hearing: {
        label: 'Pemeriksaan / Mediasi',
        icon: Scale,
        color: 'bg-[#edf3ec] text-[#2d5530] dark:bg-emerald-950/40 dark:text-emerald-300',
    },
    internal: {
        label: 'Rapat Internal',
        icon: Briefcase,
        color: 'bg-black/[0.04] text-[#787774] dark:bg-white/[0.06] dark:text-zinc-300',
    },
};

export default function MatterShow({
    matter,
    can,
    editOptions,
}: {
    matter: Matter;
    can: { update: boolean; uploadDocument: boolean };
    editOptions?: {
        practiceAreas: { id: number; name: string }[];
        users: Person[];
    };
}) {
    const [tab, setTab] = useState<(typeof tabs)[number]['id']>('Overview');
    const [operation, setOperation] = useState<'party' | 'deadline' | 'event' | 'note' | null>(null);
    const nextDeadline = matter.deadlines[0];

    return (
        <>
            <Head title={`${matter.matter_number} — ${matter.title}`} />

            <div className="min-h-screen w-full bg-[#fbfbfa] text-[#111111] antialiased dark:bg-[#121212] dark:text-[#fbfbfa]">
                <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
                    {/* Notion Minimalist Header */}
                    <header className="space-y-2.5">
                        <Link
                            href={matterRoutes.index()}
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#787774] transition-colors hover:text-[#111111] dark:text-zinc-400 dark:hover:text-white"
                        >
                            <ArrowLeft className="size-3.5" />
                            Matters
                        </Link>

                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                            <div className="min-w-0 space-y-1.5">
                                <h1 className="text-2xl font-bold tracking-tight text-[#111111] sm:text-3xl dark:text-white">
                                    {matter.title}
                                </h1>

                                <div className="flex flex-wrap items-center gap-2 text-xs text-[#787774] dark:text-zinc-400">
                                    <span className="inline-block rounded bg-[#e1f3fe] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#1f6c9f] dark:bg-blue-950/50 dark:text-sky-300">
                                        {matter.matter_number}
                                    </span>
                                    <span>·</span>
                                    <Link
                                        href={clientRoutes.show(matter.client.id)}
                                        className="font-medium text-[#2f3437] hover:underline dark:text-zinc-200"
                                    >
                                        {matter.client.display_name}
                                    </Link>
                                    <span>·</span>
                                    <span>{matter.practice_area?.name ?? 'Umum'}</span>
                                    <span>·</span>
                                    <StatusBadge value={matter.status} />
                                    <StatusBadge value={matter.priority} />
                                    {matter.confidentiality_level !== 'standard' && (
                                        <StatusBadge value={matter.confidentiality_level} />
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex shrink-0 items-center gap-2">
                                {can.update && editOptions && (
                                    <MatterEditDialog
                                        matter={matter}
                                        practiceAreas={editOptions.practiceAreas}
                                        users={editOptions.users}
                                    />
                                )}

                                {can.update && (
                                    <Button
                                        variant="outline"
                                        onClick={() => setOperation('party')}
                                        className="h-8 rounded-lg border-black/10 bg-white px-3 text-xs font-medium text-[#111111] shadow-2xs hover:bg-black/[0.03] dark:border-white/10 dark:bg-[#1c1c1e] dark:text-zinc-200 dark:hover:bg-white/[0.06]"
                                    >
                                        <Plus className="mr-1 size-3.5 text-[#787774]" />
                                        Tambah Aktivitas
                                    </Button>
                                )}

                                {can.uploadDocument && (
                                    <Button
                                        className="h-8 rounded-lg bg-[#111111] px-3.5 text-xs font-semibold text-white shadow-2xs transition-colors hover:bg-black active:scale-95 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                                        asChild
                                    >
                                        <Link
                                            href={documentRoutes.index({
                                                query: {
                                                    upload: 1,
                                                    matter_id: matter.id,
                                                },
                                            })}
                                        >
                                            <FileUp className="mr-1.5 size-3.5" />
                                            Unggah Dokumen
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </header>

                    {/* Compact 4-Column Stat Strip (h-[76px]) */}
                    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {/* 1. Responsible Partner */}
                        <div className="flex h-[76px] flex-col justify-between rounded-xl border border-black/[0.07] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#787774]">
                                Responsible Partner
                            </span>
                            <div className="flex min-w-0 items-center gap-2.5">
                                <div className="relative flex size-6.5 shrink-0 items-center justify-center overflow-hidden rounded-full bg-black/[0.05] text-[10px] font-semibold text-zinc-700 dark:bg-white/[0.1] dark:text-zinc-300">
                                    {matter.responsible_partner.avatar_url ? (
                                        <img
                                            src={matter.responsible_partner.avatar_url}
                                            alt={matter.responsible_partner.name}
                                            className="size-full object-cover"
                                        />
                                    ) : (
                                        matter.responsible_partner.name
                                            .split(' ')
                                            .map((n) => n[0])
                                            .slice(0, 2)
                                            .join('')
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate text-xs font-semibold text-[#111111] dark:text-white">
                                        {matter.responsible_partner.name}
                                    </p>
                                    <p className="truncate text-[10px] text-[#787774] dark:text-zinc-400">
                                        {matter.responsible_partner.position_title ?? 'Partner'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* 2. Practice Area */}
                        <div className="flex h-[76px] flex-col justify-between rounded-xl border border-black/[0.07] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#787774]">
                                Area Praktik
                            </span>
                            <div className="min-w-0">
                                <p className="truncate text-xs font-semibold text-[#111111] dark:text-white">
                                    {matter.practice_area?.name ?? 'Umum'}
                                </p>
                                <p className="truncate text-[10px] text-[#787774] dark:text-zinc-400">
                                    {matter.matter_type ?? 'Legal Advisory'}
                                </p>
                            </div>
                        </div>

                        {/* 3. Tim Advokat */}
                        <div className="flex h-[76px] flex-col justify-between rounded-xl border border-black/[0.07] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#787774]">
                                Tim Advokat
                            </span>
                            <div className="flex items-center justify-between">
                                <div className="flex -space-x-1.5 overflow-hidden">
                                    {matter.members.slice(0, 4).map((member) => (
                                        <div
                                            key={member.id}
                                            title={member.name}
                                            className="relative flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white bg-black/[0.06] text-[9px] font-semibold text-zinc-700 dark:border-[#1a1a1c] dark:bg-zinc-700 dark:text-zinc-200"
                                        >
                                            {member.avatar_url ? (
                                                <img
                                                    src={member.avatar_url}
                                                    alt={member.name}
                                                    className="size-full object-cover"
                                                />
                                            ) : (
                                                member.name
                                                    .split(' ')
                                                    .map((n) => n[0])
                                                    .slice(0, 2)
                                                    .join('')
                                            )}
                                        </div>
                                    ))}
                                    {matter.members.length > 4 && (
                                        <span className="flex size-6 items-center justify-center rounded-full border border-white bg-black/[0.04] text-[9px] font-semibold text-[#787774] dark:border-[#1a1a1c] dark:bg-zinc-800 dark:text-zinc-300">
                                            +{matter.members.length - 4}
                                        </span>
                                    )}
                                </div>
                                <span className="font-mono text-xs font-semibold text-[#111111] dark:text-white">
                                    {matter.members.length} Anggota
                                </span>
                            </div>
                        </div>

                        {/* 4. Tenggat Terdekat */}
                        <div className="flex h-[76px] flex-col justify-between rounded-xl border border-black/[0.07] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#787774]">
                                Tenggat Terdekat
                            </span>
                            <div className="min-w-0">
                                {nextDeadline ? (
                                    <>
                                        <p className="truncate text-xs font-semibold text-[#111111] dark:text-white">
                                            {nextDeadline.title}
                                        </p>
                                        <p className="font-mono text-[10px] font-medium text-amber-600 dark:text-amber-400">
                                            {formatDate(nextDeadline.due_at, true)}
                                        </p>
                                    </>
                                ) : (
                                    <p className="text-xs text-[#787774] dark:text-zinc-500">
                                        Tidak ada tenggat aktif
                                    </p>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Notion Pill Tab Bar */}
                    <div className="space-y-4">
                        <div className="flex border-b border-black/[0.08] dark:border-white/[0.08]">
                            {tabs.map((item) => {
                                const isActive = tab === item.id;
                                const count =
                                    item.id === 'Tugas'
                                        ? matter.tasks.length
                                        : item.id === 'Dokumen'
                                          ? matter.documents.length
                                          : item.id === 'Catatan'
                                            ? matter.notes.length
                                            : item.id === 'Timeline'
                                              ? matter.events.length
                                              : null;

                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => setTab(item.id)}
                                        className={`relative flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-medium transition-colors ${
                                            isActive
                                                ? 'text-[#111111] dark:text-white'
                                                : 'text-[#787774] hover:text-[#111111] dark:text-zinc-400 dark:hover:text-white'
                                        }`}
                                    >
                                        <span>{item.label}</span>
                                        {count !== null && count > 0 && (
                                            <span className="font-mono text-[10px] text-[#787774] dark:text-zinc-500">
                                                ({count})
                                            </span>
                                        )}
                                        {isActive && (
                                            <span className="absolute bottom-0 left-0 h-[2px] w-full bg-[#111111] dark:bg-white" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* TAB 1: OVERVIEW */}
                        {tab === 'Overview' && (
                            <div className="overflow-hidden rounded-xl border border-black/[0.08] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                                {/* Ringkasan Perkara */}
                                <div className="border-b border-black/[0.06] bg-[#fafafa] p-5 dark:border-white/[0.06] dark:bg-zinc-900/30">
                                    <div className="mb-2 flex items-center gap-2">
                                        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#787774]">
                                            Ringkasan & Lingkup Perkara
                                        </span>
                                    </div>
                                    {matter.summary ? (
                                        <p className="text-xs leading-relaxed text-[#2f3437] whitespace-pre-wrap dark:text-zinc-200">
                                            {matter.summary}
                                        </p>
                                    ) : (
                                        <p className="text-xs italic text-[#787774] dark:text-zinc-500">
                                            Belum ada ringkasan yang dicatat untuk perkara ini.
                                        </p>
                                    )}
                                </div>

                                {/* 2 Columns Split */}
                                <div className="grid divide-y divide-black/[0.06] lg:grid-cols-[1.4fr_1fr] lg:divide-x lg:divide-y-0 dark:divide-white/[0.06]">
                                    {/* Left Column: Tasks & Parties */}
                                    <div className="flex flex-col divide-y divide-black/[0.06] dark:divide-white/[0.06]">
                                        {/* Tugas Berjalan */}
                                        <div className="p-5">
                                            <div className="mb-3 flex items-center justify-between">
                                                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#787774]">
                                                    Tugas Berjalan ({matter.tasks.length})
                                                </span>
                                                {matter.tasks.length > 3 && (
                                                    <button
                                                        onClick={() => setTab('Tugas')}
                                                        className="text-xs font-medium text-blue-600 hover:underline dark:text-sky-400"
                                                    >
                                                        Lihat Semua
                                                    </button>
                                                )}
                                            </div>
                                            <TaskList tasks={matter.tasks.slice(0, 4)} />
                                        </div>

                                        {/* Pihak Terkait & Lawan */}
                                        <div className="p-5">
                                            <div className="mb-3 flex items-center justify-between">
                                                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#787774]">
                                                    Pihak Terkait & Lawan ({matter.parties.length})
                                                </span>
                                                {can.update && (
                                                    <button
                                                        onClick={() => setOperation('party')}
                                                        className="text-xs font-medium text-blue-600 hover:underline dark:text-sky-400"
                                                    >
                                                        + Tambah Pihak
                                                    </button>
                                                )}
                                            </div>

                                            {matter.parties.length ? (
                                                <div className="divide-y divide-black/[0.04] dark:divide-white/[0.04]">
                                                    {matter.parties.map((party) => (
                                                        <div
                                                            key={party.id}
                                                            className="flex items-center justify-between py-2.5 text-xs"
                                                        >
                                                            <div className="min-w-0 pr-3">
                                                                <p className="truncate font-semibold text-[#111111] dark:text-white">
                                                                    {party.name}
                                                                </p>
                                                                {party.organization_name && (
                                                                    <p className="truncate text-[11px] text-[#787774] dark:text-zinc-400">
                                                                        {party.organization_name}
                                                                    </p>
                                                                )}
                                                            </div>
                                                            <span className="shrink-0 rounded-md bg-black/[0.04] px-2 py-0.5 text-[10px] font-medium text-[#787774] dark:bg-white/[0.06] dark:text-zinc-400">
                                                                {partyTypeLabels[party.party_type] ?? party.party_type.replace('_', ' ')}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-xs text-[#787774] dark:text-zinc-500">
                                                    Belum ada pihak terkait terdaftar.
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right Column: Deadlines, Team, Parameters */}
                                    <div className="flex flex-col divide-y divide-black/[0.06] dark:divide-white/[0.06]">
                                        {/* Tenggat & Jadwal */}
                                        <div className="p-5">
                                            <div className="mb-3 flex items-center justify-between">
                                                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#787774]">
                                                    Tenggat & Jadwal ({matter.deadlines.length})
                                                </span>
                                                {can.update && (
                                                    <button
                                                        onClick={() => setOperation('deadline')}
                                                        className="text-xs font-medium text-blue-600 hover:underline dark:text-sky-400"
                                                    >
                                                        + Tenggat
                                                    </button>
                                                )}
                                            </div>
                                            <DeadlineList deadlines={matter.deadlines} />
                                        </div>

                                        {/* Parameter Perkara */}
                                        <div className="p-5 text-xs">
                                            <span className="mb-3 block text-[10px] font-semibold uppercase tracking-wider text-[#787774]">
                                                Parameter Perkara
                                            </span>
                                            <div className="divide-y divide-black/[0.04] dark:divide-white/[0.04]">
                                                <div className="flex items-center justify-between py-2">
                                                    <span className="text-[#787774] dark:text-zinc-400">Yurisdiksi</span>
                                                    <span className="font-semibold text-[#111111] dark:text-white">
                                                        {matter.jurisdiction ?? 'Indonesia'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between py-2">
                                                    <span className="text-[#787774] dark:text-zinc-400">Pengadilan</span>
                                                    <span className="font-semibold text-[#111111] dark:text-white">
                                                        {matter.court ?? 'Non-litigasi'}
                                                    </span>
                                                </div>
                                                {matter.external_case_number && (
                                                    <div className="flex items-center justify-between py-2">
                                                        <span className="text-[#787774] dark:text-zinc-400">Nomor Perkara Luar</span>
                                                        <span className="font-mono font-semibold text-[#111111] dark:text-white">
                                                            {matter.external_case_number}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 2: TUGAS */}
                        {tab === 'Tugas' && (
                            <div className="overflow-hidden rounded-xl border border-black/[0.08] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c] space-y-4">
                                <div className="flex items-center justify-between border-b border-black/[0.04] pb-3 dark:border-white/[0.06]">
                                    <div>
                                        <h2 className="text-xs font-bold uppercase tracking-wider text-[#111111] dark:text-white">
                                            Daftar Tugas Perkara ({matter.tasks.length})
                                        </h2>
                                        <p className="text-[11px] text-[#787774] dark:text-zinc-400">
                                            Daftar seluruh item pekerjaan hukum dan tenggat penugasan advokat.
                                        </p>
                                    </div>
                                </div>

                                {matter.tasks.length ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-xs">
                                            <thead>
                                                <tr className="border-b border-black/[0.04] text-[10px] font-semibold uppercase tracking-wider text-[#787774] dark:border-white/[0.06]">
                                                    <th className="pb-2.5 pr-4 font-semibold">Tugas</th>
                                                    <th className="pb-2.5 px-3 font-semibold">PIC / Penugasan</th>
                                                    <th className="pb-2.5 px-3 font-semibold">Tenggat</th>
                                                    <th className="pb-2.5 px-3 font-semibold">Prioritas</th>
                                                    <th className="pb-2.5 pl-3 text-right font-semibold">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-black/[0.04] dark:divide-white/[0.05]">
                                                {matter.tasks.map((task) => (
                                                    <tr key={task.id} className="group transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.03]">
                                                        <td className="py-3 pr-4">
                                                            <p className="font-semibold text-[#111111] dark:text-white">
                                                                {task.title}
                                                            </p>
                                                        </td>
                                                        <td className="py-3 px-3 whitespace-nowrap">
                                                            <div className="flex items-center gap-2">
                                                                <div className="relative flex size-5.5 shrink-0 items-center justify-center overflow-hidden rounded-full bg-black/[0.05] text-[9px] font-semibold text-zinc-700 dark:bg-white/[0.1] dark:text-zinc-300">
                                                                    {task.assignee?.avatar_url ? (
                                                                        <img
                                                                            src={task.assignee.avatar_url}
                                                                            alt={task.assignee.name}
                                                                            className="size-full object-cover"
                                                                        />
                                                                    ) : (
                                                                        (task.assignee?.name || 'T')
                                                                            .split(' ')
                                                                            .map((n) => n[0])
                                                                            .slice(0, 2)
                                                                            .join('')
                                                                    )}
                                                                </div>
                                                                <span className="font-medium text-[#2f3437] dark:text-zinc-200">
                                                                    {task.assignee?.name ?? 'Belum ditugaskan'}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="py-3 px-3 whitespace-nowrap font-mono text-[11px] text-[#787774] dark:text-zinc-400">
                                                            {formatDate(task.due_at)}
                                                        </td>
                                                        <td className="py-3 px-3 whitespace-nowrap">
                                                            <StatusBadge value={task.priority} />
                                                        </td>
                                                        <td className="py-3 pl-3 text-right whitespace-nowrap">
                                                            <StatusBadge value={task.status} />
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="flex min-h-[240px] items-center justify-center p-8 text-center">
                                        <EmptyState title="Tidak ada tugas aktif" />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* TAB 3: TIMELINE */}
                        {tab === 'Timeline' && (
                            <div className="overflow-hidden rounded-xl border border-black/[0.08] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c] space-y-5">
                                <div className="flex items-center justify-between border-b border-black/[0.04] pb-3 dark:border-white/[0.06]">
                                    <div>
                                        <h2 className="text-xs font-bold uppercase tracking-wider text-[#111111] dark:text-white">
                                            Agenda, Sidang & Timeline ({matter.events.length})
                                        </h2>
                                        <p className="text-[11px] text-[#787774] dark:text-zinc-400">
                                            Jadwal pertemuan, proses peradilan, dan riwayat aktivitas perkara.
                                        </p>
                                    </div>
                                    {can.update && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => setOperation('event')}
                                            className="h-7.5 rounded-lg text-xs"
                                        >
                                            <Plus className="mr-1 size-3.5" />
                                            Tambah Agenda
                                        </Button>
                                    )}
                                </div>

                                {matter.events.length ? (
                                    <div className="relative space-y-3 before:absolute before:left-[17px] before:top-3 before:bottom-3 before:w-[2px] before:bg-black/[0.06] dark:before:bg-white/[0.08]">
                                        {matter.events.map((event) => {
                                            const meta = eventTypeMeta[event.event_type] ?? {
                                                label: event.event_type.replace('_', ' '),
                                                icon: CalendarClock,
                                                color: 'bg-black/[0.04] text-[#787774] dark:bg-white/[0.06] dark:text-zinc-300',
                                            };
                                            const IconComponent = meta.icon;

                                            return (
                                                <div key={event.id} className="relative flex items-start gap-3.5">
                                                    {/* Node Icon Circle */}
                                                    <div className="relative z-10 flex size-9 shrink-0 items-center justify-center rounded-xl border border-black/[0.08] bg-white shadow-2xs dark:border-white/[0.1] dark:bg-[#1c1c1e]">
                                                        <IconComponent className="size-4 text-[#111111] dark:text-white" />
                                                    </div>

                                                    {/* Event Content Card */}
                                                    <div className="flex-1 rounded-xl border border-black/[0.06] bg-[#fafafa] p-3.5 transition-colors hover:bg-black/[0.02] dark:border-white/[0.06] dark:bg-zinc-900/40">
                                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                                            <span className="font-mono text-[11px] font-semibold text-[#111111] dark:text-white">
                                                                {formatDate(event.starts_at, true)}
                                                            </span>
                                                            <span className={`rounded-md px-2 py-0.5 text-[10px] font-medium capitalize ${meta.color}`}>
                                                                {meta.label}
                                                            </span>
                                                        </div>

                                                        <h4 className="mt-1 text-xs font-semibold text-[#111111] dark:text-white">
                                                            {event.title}
                                                        </h4>

                                                        {event.description && (
                                                            <p className="mt-1 text-xs leading-relaxed text-[#787774] dark:text-zinc-400">
                                                                {event.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="flex min-h-[240px] items-center justify-center p-8 text-center">
                                        <EmptyState title="Belum ada agenda atau sidang tercatat" />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* TAB 4: DOKUMEN */}
                        {tab === 'Dokumen' && (
                            <div className="overflow-hidden rounded-xl border border-black/[0.08] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c] space-y-4">
                                <div className="flex items-center justify-between border-b border-black/[0.04] pb-3 dark:border-white/[0.06]">
                                    <div>
                                        <h2 className="text-xs font-bold uppercase tracking-wider text-[#111111] dark:text-white">
                                            Berkas & Dokumen Perkara ({matter.documents.length})
                                        </h2>
                                        <p className="text-[11px] text-[#787774] dark:text-zinc-400">
                                            Seluruh arsip surat kuasa, berkas perkara, dan draft kontrak hukum.
                                        </p>
                                    </div>
                                    {can.uploadDocument && (
                                        <Button
                                            size="sm"
                                            className="h-7.5 rounded-lg bg-[#111111] px-3 text-xs font-semibold text-white shadow-2xs transition-colors hover:bg-black dark:bg-white dark:text-black"
                                            asChild
                                        >
                                            <Link
                                                href={documentRoutes.index({
                                                    query: {
                                                        upload: 1,
                                                        matter_id: matter.id,
                                                    },
                                                })}
                                            >
                                                <FileUp className="mr-1.5 size-3.5" />
                                                Unggah Dokumen
                                            </Link>
                                        </Button>
                                    )}
                                </div>

                                {matter.documents.length ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-xs">
                                            <thead>
                                                <tr className="border-b border-black/[0.04] text-[10px] font-semibold uppercase tracking-wider text-[#787774] dark:border-white/[0.06]">
                                                    <th className="pb-2.5 pr-4 font-semibold">Nama Dokumen</th>
                                                    <th className="pb-2.5 px-3 font-semibold">Versi</th>
                                                    <th className="pb-2.5 px-3 font-semibold">Ukuran</th>
                                                    <th className="pb-2.5 px-3 font-semibold">Diperbarui</th>
                                                    <th className="pb-2.5 px-3 font-semibold">Status</th>
                                                    <th className="pb-2.5 pl-3 text-right font-semibold">Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-black/[0.04] dark:divide-white/[0.05]">
                                                {matter.documents.map((doc) => (
                                                    <tr key={doc.id} className="group transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.03]">
                                                        <td className="py-3 pr-4">
                                                            <div className="flex items-center gap-2.5">
                                                                <FileText className="size-3.5 shrink-0 text-[#787774]" />
                                                                <div>
                                                                    <p className="font-semibold text-[#111111] group-hover:text-blue-600 dark:text-white dark:group-hover:text-sky-400">
                                                                        {doc.title}
                                                                    </p>
                                                                    <p className="text-[10px] text-[#787774] dark:text-zinc-400">
                                                                        {doc.current_version?.mime_type ?? 'Dokumen Hukum'}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="py-3 px-3 whitespace-nowrap">
                                                            <span className="font-mono text-[10px] text-[#787774] dark:text-zinc-400">
                                                                v{doc.current_version?.version_number ?? 1}.0
                                                            </span>
                                                        </td>
                                                        <td className="py-3 px-3 whitespace-nowrap font-mono text-[11px] text-[#787774] dark:text-zinc-400">
                                                            {formatBytes(doc.current_version?.file_size)}
                                                        </td>
                                                        <td className="py-3 px-3 whitespace-nowrap font-mono text-[11px] text-[#787774] dark:text-zinc-400">
                                                            {formatDate(doc.updated_at)}
                                                        </td>
                                                        <td className="py-3 px-3 whitespace-nowrap">
                                                            <StatusBadge value={doc.status} />
                                                        </td>
                                                        <td className="py-3 pl-3 text-right whitespace-nowrap">
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                className="h-6.5 rounded px-2 text-xs text-blue-600 hover:bg-blue-50 dark:text-sky-400 dark:hover:bg-blue-950/40"
                                                                asChild
                                                            >
                                                                <Link href={documentRoutes.show(doc.id)}>
                                                                    Buka
                                                                    <ChevronRight className="ml-1 size-3" />
                                                                </Link>
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="flex min-h-[240px] items-center justify-center p-8 text-center">
                                        <EmptyState title="Belum ada dokumen terunggah" />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* TAB 5: CATATAN */}
                        {tab === 'Catatan' && (
                            <div className="overflow-hidden rounded-xl border border-black/[0.08] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c] space-y-4">
                                <div className="flex items-center justify-between border-b border-black/[0.04] pb-3 dark:border-white/[0.06]">
                                    <div>
                                        <h2 className="text-xs font-bold uppercase tracking-wider text-[#111111] dark:text-white">
                                            Catatan Internal ({matter.notes.length})
                                        </h2>
                                        <p className="text-[11px] text-[#787774] dark:text-zinc-400">
                                            Memorandum rahasia, strategi perkara, dan catatan rapat privat advokat.
                                        </p>
                                    </div>
                                    {can.update && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => setOperation('note')}
                                            className="h-7.5 rounded-lg border-black/10 bg-white px-3 text-xs font-medium text-[#111111] shadow-2xs hover:bg-black/[0.03] dark:border-white/10 dark:bg-[#1c1c1e] dark:text-zinc-200"
                                        >
                                            <Plus className="mr-1 size-3.5 text-[#787774]" />
                                            Tambah Catatan
                                        </Button>
                                    )}
                                </div>

                                {matter.notes.length ? (
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        {matter.notes.map((note) => (
                                            <div
                                                key={note.id}
                                                className="flex flex-col justify-between rounded-xl border border-black/[0.06] bg-[#fafafa] p-4 text-xs transition-colors hover:bg-black/[0.02] dark:border-white/[0.06] dark:bg-zinc-900/40"
                                            >
                                                <div>
                                                    <div className="flex items-center justify-between gap-2 border-b border-black/[0.04] pb-2 dark:border-white/[0.06]">
                                                        <h4 className="font-semibold text-[#111111] dark:text-white">
                                                            {note.title || 'Catatan Internal'}
                                                        </h4>
                                                        <StatusBadge value={note.classification} />
                                                    </div>
                                                    <p className="mt-2.5 leading-relaxed text-[#2f3437] whitespace-pre-wrap dark:text-zinc-300">
                                                        {note.body}
                                                    </p>
                                                </div>
                                                <div className="mt-3 flex items-center justify-between border-t border-black/[0.04] pt-2 font-mono text-[10px] text-[#787774] dark:border-white/[0.06] dark:text-zinc-500">
                                                    <span>{formatDate(note.created_at, true)}</span>
                                                    {note.classification !== 'internal' && (
                                                        <span className="flex items-center gap-1 font-sans text-amber-600 dark:text-amber-400">
                                                            <Lock className="size-2.5" />
                                                            Privat
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex min-h-[240px] items-center justify-center p-8 text-center">
                                        <EmptyState title="Belum ada catatan internal" />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Operations Modal Dialog */}
            <MatterOperationDialog
                matterId={matter.id}
                operation={operation}
                onSelect={setOperation}
                onClose={() => setOperation(null)}
            />
        </>
    );
}

function MatterOperationDialog({
    matterId,
    operation,
    onSelect,
    onClose,
}: {
    matterId: string;
    operation: 'party' | 'deadline' | 'event' | 'note' | null;
    onSelect: (operation: 'party' | 'deadline' | 'event' | 'note') => void;
    onClose: () => void;
}) {
    const route =
        operation === 'party'
            ? partyRoutes.store
            : operation === 'deadline'
              ? deadlineRoutes.store
              : operation === 'event'
                ? eventRoutes.store
                : noteRoutes.store;

    const opConfig = {
        party: {
            title: 'Tambah Pihak Terkait',
            desc: 'Tambahkan pihak lawan, saksi, ahli, atau pihak terafiliasi perkara.',
            icon: Users,
            color: 'text-blue-600 bg-blue-50 dark:text-sky-300 dark:bg-blue-950/40',
        },
        deadline: {
            title: 'Tambah Tenggat Waktu',
            desc: 'Atur batas waktu kritis pengajuan bukti, memori, atau tenggat hukum.',
            icon: CalendarClock,
            color: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/40',
        },
        event: {
            title: 'Tambah Agenda / Sidang',
            desc: 'Jadwalkan sidang pengadilan, mediasi, atau rapat negosiasi klien.',
            icon: Gavel,
            color: 'text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-950/40',
        },
        note: {
            title: 'Tambah Catatan Internal',
            desc: 'Simpan resume perkara, arahan partner, atau catatan strategi berhak istimewa.',
            icon: MessageSquare,
            color: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/40',
        },
    };

    const currentConfig = operation ? opConfig[operation] : opConfig.party;
    const IconComp = currentConfig.icon;

    return (
        <Dialog open={operation !== null} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-h-[85vh] overflow-y-auto rounded-2xl border border-black/[0.08] bg-white p-5 shadow-2xl sm:max-w-lg dark:border-white/10 dark:bg-[#1c1c1e]">
                <DialogHeader className="border-b border-black/[0.04] pb-3 dark:border-white/[0.06]">
                    <div className="flex items-center gap-2.5">
                        <div className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${currentConfig.color}`}>
                            <IconComp className="size-4" />
                        </div>
                        <div>
                            <DialogTitle className="text-sm font-bold tracking-tight text-[#111111] dark:text-white">
                                {currentConfig.title}
                            </DialogTitle>
                            <DialogDescription className="text-xs text-[#787774] dark:text-zinc-400">
                                {currentConfig.desc}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {/* Operation Pill Switcher */}
                <div className="flex rounded-lg bg-black/[0.04] p-1 dark:bg-white/[0.06]">
                    {(['party', 'deadline', 'event', 'note'] as const).map((opKey) => {
                        const isSelected = operation === opKey;
                        const labels = {
                            party: 'Pihak',
                            deadline: 'Tenggat',
                            event: 'Agenda',
                            note: 'Catatan',
                        };
                        return (
                            <button
                                key={opKey}
                                type="button"
                                onClick={() => onSelect(opKey)}
                                className={`flex-1 rounded-md py-1 text-center text-xs font-medium transition-colors ${
                                    isSelected
                                        ? 'bg-white text-[#111111] shadow-2xs dark:bg-zinc-700 dark:text-white'
                                        : 'text-[#787774] hover:text-[#111111] dark:text-zinc-400 dark:hover:text-white'
                                }`}
                            >
                                {labels[opKey]}
                            </button>
                        );
                    })}
                </div>

                {operation && (
                    <Form {...route.form(matterId)} className="space-y-3.5 pt-1" onSuccess={onClose}>
                        {({ processing, errors }) => (
                            <>
                                {operation === 'party' && (
                                    <>
                                        <Field
                                            name="party_type"
                                            label="Peran / Jenis Pihak"
                                            required
                                            placeholder="Contoh: Lawan, Penggugat, Tergugat, Saksi Ahli"
                                        />
                                        <Field
                                            name="name"
                                            label="Nama Lengkap / Entitas Perusahaan"
                                            required
                                            placeholder="Nama pihak terkait"
                                        />
                                    </>
                                )}

                                {operation === 'deadline' && (
                                    <>
                                        <Field
                                            name="title"
                                            label="Judul Tenggat"
                                            required
                                            placeholder="Contoh: Penyerahan Bukti Dokumen Tambahan"
                                        />
                                        <Field
                                            name="due_at"
                                            label="Batas Waktu & Jam"
                                            type="datetime-local"
                                            required
                                        />
                                        <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-black/[0.08] bg-[#fbfbfa] p-2.5 text-xs font-medium text-[#2f3437] transition-colors hover:bg-black/[0.02] dark:border-white/[0.1] dark:bg-[#121212] dark:text-zinc-200">
                                            <input
                                                name="is_critical"
                                                type="checkbox"
                                                value="1"
                                                className="size-3.5 rounded border-zinc-300 text-[#111111]"
                                            />
                                            <span>Tandai sebagai tenggat waktu kritis / berisiko tinggi</span>
                                        </label>
                                    </>
                                )}

                                {operation === 'event' && (
                                    <>
                                        <Field
                                            name="title"
                                            label="Judul Agenda / Sidang"
                                            required
                                            placeholder="Contoh: Sidang Pemeriksaan Saksi Ahli"
                                        />
                                        <div className="grid gap-1.5">
                                            <Label htmlFor="event_type" className="text-xs font-medium text-[#2f3437] dark:text-zinc-200">
                                                Jenis Agenda
                                            </Label>
                                            <div className="relative">
                                                <select
                                                    name="event_type"
                                                    id="event_type"
                                                    defaultValue="court"
                                                    className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-black/[0.08] bg-[#fbfbfa] pl-3 pr-8 text-xs font-medium text-[#111111] outline-none transition-colors hover:bg-black/[0.02] focus:border-black/20 focus:bg-white dark:border-white/[0.1] dark:bg-[#121212] dark:text-zinc-200"
                                                >
                                                    <option value="court">Sidang Pengadilan</option>
                                                    <option value="meeting">Pertemuan Klien / Negosiasi</option>
                                                    <option value="hearing">Pemeriksaan / Mediasi</option>
                                                    <option value="internal">Rapat Internal Tim</option>
                                                </select>
                                                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3 -translate-y-1/2 text-[#787774]" />
                                            </div>
                                        </div>
                                        <div className="grid gap-3 sm:grid-cols-2">
                                            <Field name="starts_at" label="Waktu Mulai" type="datetime-local" required />
                                            <Field name="ends_at" label="Waktu Selesai (Opsional)" type="datetime-local" />
                                        </div>
                                    </>
                                )}

                                {operation === 'note' && (
                                    <>
                                        <Field name="title" label="Judul Catatan" placeholder="Contoh: Resume Rapat & Arahan Litigasi" />
                                        <div className="grid gap-1.5">
                                            <Label htmlFor="note-body" className="text-xs font-medium text-[#2f3437] dark:text-zinc-200">
                                                Isi Catatan Hukum
                                            </Label>
                                            <textarea
                                                className="min-h-20 rounded-lg border border-black/[0.08] bg-[#fbfbfa] p-2.5 text-xs leading-relaxed text-[#111111] outline-none transition-colors focus:border-black/20 focus:bg-white dark:border-white/[0.1] dark:bg-[#121212] dark:text-white"
                                                id="note-body"
                                                name="body"
                                                required
                                                placeholder="Tuliskan ringkasan perkara, poin negosiasi, atau instruksi..."
                                            />
                                        </div>
                                        <div className="grid gap-1.5">
                                            <Label htmlFor="classification" className="text-xs font-medium text-[#2f3437] dark:text-zinc-200">
                                                Klasifikasi Hak Akses
                                            </Label>
                                            <div className="relative">
                                                <select
                                                    className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-black/[0.08] bg-[#fbfbfa] pl-3 pr-8 text-xs font-medium text-[#111111] outline-none transition-colors hover:bg-black/[0.02] focus:border-black/20 focus:bg-white dark:border-white/[0.1] dark:bg-[#121212] dark:text-zinc-200"
                                                    name="classification"
                                                    id="classification"
                                                    defaultValue="internal"
                                                >
                                                    <option value="internal">Internal (Dapat diakses tim perkara)</option>
                                                    <option value="privileged">Advocate-Client Privileged (Kerahasiaan Advokat-Klien)</option>
                                                    <option value="confidential">Confidential (Sangat Rahasia)</option>
                                                </select>
                                                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3 -translate-y-1/2 text-[#787774]" />
                                            </div>
                                        </div>
                                    </>
                                )}

                                {Object.keys(errors).length > 0 && (
                                    <p className="text-xs text-rose-600">{Object.values(errors).join(' ')}</p>
                                )}

                                <div className="flex items-center justify-end gap-2 border-t border-black/[0.04] pt-3 dark:border-white/[0.06]">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={onClose}
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
                                            'Simpan Aktivitas'
                                        )}
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                )}
            </DialogContent>
        </Dialog>
    );
}

function Field({
    name,
    label,
    type = 'text',
    defaultValue,
    required = false,
    placeholder,
}: {
    name: string;
    label: string;
    type?: string;
    defaultValue?: string;
    required?: boolean;
    placeholder?: string;
}) {
    return (
        <div className="grid gap-1.5">
            <Label htmlFor={name} className="text-xs font-medium text-[#2f3437] dark:text-zinc-200">
                {label}
            </Label>
            <Input
                id={name}
                name={name}
                type={type}
                defaultValue={defaultValue}
                required={required}
                placeholder={placeholder}
                className="h-8 rounded-lg border-black/[0.08] bg-[#fbfbfa] text-xs text-[#111111] transition-colors focus:border-black/20 focus:bg-white dark:border-white/[0.1] dark:bg-[#121212] dark:text-white"
            />
        </div>
    );
}

function TaskList({ tasks }: { tasks: Matter['tasks'] }) {
    return tasks.length ? (
        <div className="divide-y divide-black/[0.04] dark:divide-white/[0.05]">
            {tasks.map((task) => (
                <div
                    key={task.id}
                    className="flex flex-col justify-between gap-2 py-2.5 sm:flex-row sm:items-center"
                >
                    <div className="flex min-w-0 items-center gap-2.5">
                        <div className="relative flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-full bg-black/[0.05] text-[9px] font-semibold text-zinc-700 dark:bg-white/[0.1] dark:text-zinc-300">
                            {task.assignee?.avatar_url ? (
                                <img
                                    src={task.assignee.avatar_url}
                                    alt={task.assignee.name}
                                    className="size-full object-cover"
                                />
                            ) : (
                                (task.assignee?.name || 'T')
                                    .split(' ')
                                    .map((n) => n[0])
                                    .slice(0, 2)
                                    .join('')
                            )}
                        </div>
                        <div className="min-w-0">
                            <p className="truncate text-xs font-semibold text-[#111111] dark:text-white">
                                {task.title}
                            </p>
                            <p className="text-[10px] text-[#787774] dark:text-zinc-400">
                                {task.assignee?.name ?? 'Belum ditugaskan'} · {formatDate(task.due_at)}
                            </p>
                        </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5">
                        <StatusBadge value={task.priority} />
                        <StatusBadge value={task.status} />
                    </div>
                </div>
            ))}
        </div>
    ) : (
        <p className="text-xs text-[#787774] dark:text-zinc-500">Tidak ada tugas aktif.</p>
    );
}

function DeadlineList({ deadlines }: { deadlines: Matter['deadlines'] }) {
    return deadlines.length ? (
        <div className="divide-y divide-black/[0.04] dark:divide-white/[0.05]">
            {deadlines.map((deadline) => {
                const dateObj = new Date(deadline.due_at);
                const day = isNaN(dateObj.getTime()) ? '' : dateObj.getDate();
                const month = isNaN(dateObj.getTime())
                    ? ''
                    : new Intl.DateTimeFormat('id-ID', { month: 'short' }).format(dateObj);

                return (
                    <div
                        key={deadline.id}
                        className="flex items-center justify-between gap-3 py-2"
                    >
                        <div className="flex min-w-0 items-center gap-2.5">
                            <div className="flex size-8 shrink-0 flex-col items-center justify-center rounded-lg bg-[#fbf3db] text-[#956400] dark:bg-amber-950/40 dark:text-amber-300">
                                <span className="font-mono text-xs font-bold leading-none">{day}</span>
                                <span className="text-[8px] font-semibold uppercase leading-none">{month}</span>
                            </div>
                            <div className="min-w-0">
                                <p className="truncate text-xs font-semibold text-[#111111] dark:text-white">
                                    {deadline.title}
                                </p>
                                <p className="text-[10px] text-[#787774] dark:text-zinc-400">
                                    {formatDate(deadline.due_at, true)}
                                </p>
                            </div>
                        </div>
                        {deadline.is_critical && (
                            <span className="shrink-0 rounded bg-[#fdebec] px-1.5 py-0.2 font-mono text-[9px] font-bold text-[#9f2f2d] uppercase dark:bg-rose-950/40 dark:text-rose-300">
                                Kritis
                            </span>
                        )}
                    </div>
                );
            })}
        </div>
    ) : (
        <p className="text-xs text-[#787774] dark:text-zinc-500">Tidak ada tenggat aktif.</p>
    );
}

MatterShow.layout = {
    breadcrumbs: [
        { title: 'Matters', href: matterRoutes.index() },
        { title: 'Detail Matter', href: '#' },
    ],
};
