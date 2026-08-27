import { Form, Head, Link, router } from '@inertiajs/react';
import {
    Archive,
    ArrowLeft,
    Box,
    Briefcase,
    Building2,
    Calendar,
    CalendarClock,
    Check,
    CheckCircle2,
    ChevronDown,
    ChevronRight,
    Clock,
    Download,
    Eye,
    FileText,
    FileUp,
    FolderKanban,
    Gavel,
    History,
    ListChecks,
    Lock,
    MapPin,
    MessageSquare,
    Package,
    Pencil,
    Plus,
    Printer,
    Scale,
    Shield,
    ShieldAlert,
    ShieldCheck,
    Trash2,
    TrendingUp,
    User,
    UserCheck,
    Users,
    Zap,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import {
    DiscussionBox,
    type DiscussionComment,
    type DiscussionStaff,
} from '@/components/comments/discussion-box';
import { ConfirmDialog } from '@/components/confirm-dialog';
import InputError from '@/components/input-error';
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
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useInitials } from '@/hooks/use-initials';
import { formatBytes, formatDate } from '@/lib/format';
import * as clientRoutes from '@/routes/clients';
import * as documentRoutes from '@/routes/documents';
import * as matterRoutes from '@/routes/matters';
import * as chronologyRoutes from '@/routes/matters/chronologies';
import * as deadlineRoutes from '@/routes/matters/deadlines';
import * as eventRoutes from '@/routes/matters/events';
import * as eventChecklistRoutes from '@/routes/matters/events/checklist';
import * as noteRoutes from '@/routes/matters/notes';
import * as partyRoutes from '@/routes/matters/parties';
import * as reportRoutes from '@/routes/matters/status-report';
import * as governanceConflictRoutes from '@/routes/governance/conflict-checks';

type Person = {
    id: number;
    name: string;
    position_title?: string;
    avatar_url?: string | null;
};

type MatterEvidence = {
    id: string;
    matter_id: string;
    evidence_code: string;
    title: string;
    description?: string;
    originality: 'original' | 'legalized_copy' | 'photocopy' | 'digital';
    vault_location?: string;
    status:
        | 'in_vault'
        | 'borrowed_for_hearing'
        | 'submitted_to_court'
        | 'returned_to_client';
    custodian_name?: string;
    custody_notes?: string;
    created_at: string;
    creator?: { id: number; name: string };
};

type MatterChronologyItem = {
    id: string;
    event_date: string;
    title: string;
    description?: string;
    evidence_reference?: string;
    witness_name?: string;
    importance_level: string;
    created_at: string;
};

type Matter = {
    id: string;
    matter_number: string;
    title: string;
    summary?: string;
    parent_matter_id?: string | null;
    relationship_type?: string;
    parent_matter?: {
        id: string;
        matter_number: string;
        title: string;
        relationship_type?: string;
        status: string;
    };
    child_matters?: {
        id: string;
        matter_number: string;
        title: string;
        relationship_type?: string;
        status: string;
        opened_at?: string;
    }[];
    status: string;
    priority: string;
    confidentiality_level: string;
    matter_type?: string;
    opened_at?: string;
    jurisdiction?: string;
    client: {
        id: string;
        client_number: string;
        display_name: string;
        type?: string;
        legal_name?: string;
    };
    practice_area?: { name: string };
    responsible_partner: Person;
    responsible_partner_id: number;
    supervising_lawyer?: Person;
    supervising_lawyer_id?: number;
    practice_area_id?: number;
    closed_at?: string;
    legal_hold_at?: string | null;
    legal_hold_reason?: string | null;
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
        status?: string;
        outcome?: string;
        judge_notes?: string;
        starts_at: string;
        ends_at?: string;
        description?: string;
        location?: string;
        attended_by?: number;
        attendee?: Person;
        owner?: Person;
        next_event_id?: string;
        next_event?: {
            id: string;
            title: string;
            starts_at: string;
            location?: string;
        };
        checklist?: { text: string; checked: boolean }[];
    }[];
    chronologies?: MatterChronologyItem[];
    evidences?: MatterEvidence[];
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
    comments?: DiscussionComment[];
    parties: {
        id: string;
        name: string;
        organization_name?: string;
        party_type: string;
    }[];
};

const tabs = [
    { id: 'Overview', label: 'Ringkasan', icon: Briefcase },
    { id: 'Diskusi', label: 'Diskusi Tim', icon: MessageSquare },
    { id: 'Tugas', label: 'Tugas', icon: ListChecks },
    { id: 'Timeline', label: 'Timeline & Sidang', icon: CalendarClock },
    { id: 'Kronologi', label: 'Kronologi Fakta', icon: History },
    { id: 'BuktiFisik', label: 'Brankas Alat Bukti', icon: Archive },
    { id: 'Dokumen', label: 'Dokumen', icon: FileText },
    { id: 'Catatan', label: 'Catatan', icon: FileText },
] as const;

const relationshipTypeLabels: Record<string, string> = {
    appeal_pt: 'Tingkat Banding (Pengadilan Tinggi)',
    cassation_ma: 'Tingkat Kasasi (Mahkamah Agung)',
    judicial_review_pk: 'Peninjauan Kembali (PK)',
    execution: 'Permohonan Eksekusi Putusan',
    counterclaim_reconvention: 'Gugatan Rekonvensi',
    related_dispute: 'Perkara Terkait / Turunan',
};

const evidenceStatusMeta: Record<string, { label: string; color: string }> = {
    in_vault: {
        label: 'Di Brankas Firma',
        color: 'bg-emerald-50/70 text-emerald-800 border border-emerald-200/60 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-900/30',
    },
    borrowed_for_hearing: {
        label: 'Dipinjam Advokat Sidang',
        color: 'bg-slate-100 text-slate-700 border border-slate-200/80 dark:bg-white/[0.08] dark:text-zinc-300 dark:border-white/10',
    },
    submitted_to_court: {
        label: 'Diserahkan ke Majelis Hakim',
        color: 'bg-blue-50/70 text-blue-700 border border-blue-200/60 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-900/30',
    },
    returned_to_client: {
        label: 'Dikembalikan ke Klien',
        color: 'bg-slate-100/60 text-slate-600 border border-slate-200/50 dark:bg-zinc-800/60 dark:text-zinc-400 dark:border-white/[0.06]',
    },
};

const originalityLabels: Record<string, string> = {
    original: 'Asli (Original)',
    legalized_copy: 'Salinan Legalisir',
    photocopy: 'Fotokopi',
    digital: 'Bukti Elektronik / Digital',
};

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

const eventTypeMeta: Record<
    string,
    { label: string; icon: any; color: string }
> = {
    partner_review: {
        label: 'Review Partner',
        icon: UserCheck,
        color: 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300',
    },
    client_meeting: {
        label: 'Pertemuan Klien',
        icon: Users,
        color: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300',
    },
    court: {
        label: 'Sidang Pengadilan',
        icon: Gavel,
        color: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
    },
    hearing: {
        label: 'Pemeriksaan / Mediasi',
        icon: Scale,
        color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
    },
    internal: {
        label: 'Rapat Internal',
        icon: Briefcase,
        color: 'bg-slate-100 text-slate-700 dark:bg-white/[0.06] dark:text-zinc-300',
    },
};

export default function MatterShow({
    matter,
    firmStaff = [],
    can,
    editOptions,
}: {
    matter: Matter;
    firmStaff?: DiscussionStaff[];
    can: { update: boolean; uploadDocument: boolean };
    editOptions?: {
        practiceAreas: { id: number; name: string }[];
        users: Person[];
        parentMatters?: { id: string; matter_number: string; title: string }[];
    };
}) {
    const getInitials = useInitials();
    const [tab, setTab] = useState<(typeof tabs)[number]['id']>('Overview');
    const [previewDoc, setPreviewDoc] = useState<PreviewableDocument | null>(
        null,
    );
    const [operation, setOperation] = useState<
        | 'party'
        | 'deadline'
        | 'event'
        | 'note'
        | 'chronology'
        | 'evidence'
        | null
    >(null);
    const [editingEvidence, setEditingEvidence] =
        useState<MatterEvidence | null>(null);
    const [chronologyToDelete, setChronologyToDelete] =
        useState<MatterChronologyItem | null>(null);
    const [evidenceToDelete, setEvidenceToDelete] =
        useState<MatterEvidence | null>(null);
    const [partyToDelete, setPartyToDelete] = useState<
        Matter['parties'][number] | null
    >(null);
    const [eventToDelete, setEventToDelete] = useState<
        Matter['events'][number] | null
    >(null);
    const [editingEvent, setEditingEvent] = useState<
        Matter['events'][number] | null
    >(null);
    const [recordingOutcomeEvent, setRecordingOutcomeEvent] = useState<
        Matter['events'][number] | null
    >(null);
    const [noteToDelete, setNoteToDelete] = useState<
        Matter['notes'][number] | null
    >(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const nextDeadline = matter.deadlines[0];

    const upcomingHearing = useMemo(() => {
        const now = new Date();
        return matter.events
            .filter((e) => new Date(e.starts_at) >= now)
            .sort(
                (a, b) =>
                    new Date(a.starts_at).getTime() -
                    new Date(b.starts_at).getTime(),
            )[0];
    }, [matter.events]);

    const completedTasksCount = useMemo(
        () => matter.tasks.filter((t) => t.status === 'completed').length,
        [matter.tasks],
    );

    const taskProgressPercent = useMemo(() => {
        if (!matter.tasks.length) return 50;
        return Math.round((completedTasksCount / matter.tasks.length) * 100);
    }, [matter.tasks.length, completedTasksCount]);

    return (
        <>
            <Head title={`${matter.matter_number} - ${matter.title}`} />

            <div className="min-h-screen bg-[#fafafc] pb-20 dark:bg-[#0c0d10]">
                <main className="mx-auto max-w-7xl space-y-5 px-4 py-5 sm:px-6 lg:px-8">
                    {/* 1. Header Navigation & Matter Cockpit Bar */}
                    <div className="space-y-3 border-b border-slate-200/60 pb-5 dark:border-white/[0.06]">
                        {/* Top Tier: Breadcrumbs / Matter Code + Action Buttons */}
                        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                            {/* Left: Breadcrumbs & Status Badges */}
                            <div className="flex flex-wrap items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="-ml-2 h-7 px-2 text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white"
                                    asChild
                                >
                                    <Link href={matterRoutes.index.url()}>
                                        <ArrowLeft className="mr-1 size-3.5 text-slate-400" />
                                        Portofolio Perkara
                                    </Link>
                                </Button>
                                <span className="text-slate-300 dark:text-zinc-600">/</span>
                                <span className="inline-block rounded-md bg-blue-600 px-2 py-0.5 font-mono text-[11px] font-bold text-white shadow-2xs">
                                    {matter.matter_number}
                                </span>
                                <StatusBadge value={matter.status} />
                                <StatusBadge value={matter.priority} />
                                {matter.confidentiality_level !==
                                    'standard' && (
                                    <StatusBadge
                                        value={matter.confidentiality_level}
                                    />
                                )}
                            </div>

                            {/* Right: Actions */}
                            <div className="flex shrink-0 flex-wrap items-center gap-1.5">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-7.5 rounded-lg border-slate-200/80 bg-white px-2.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-white/10 dark:bg-[#16181d] dark:text-zinc-300"
                                    asChild
                                >
                                    <a
                                        href={reportRoutes.pdf.url({
                                            matter: matter.id,
                                        })}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <Printer className="mr-1 size-3.5 text-emerald-600 dark:text-emerald-400" />
                                        PDF Progres
                                    </a>
                                </Button>

                                {can.update && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-7.5 rounded-lg border-slate-200/80 bg-white px-2.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-white/10 dark:bg-[#16181d] dark:text-zinc-200"
                                        asChild
                                    >
                                        <Link
                                            href={
                                                matterRoutes.edit?.url
                                                    ? matterRoutes.edit.url(
                                                          matter.id,
                                                      )
                                                    : `/matters/${matter.id}/edit`
                                            }
                                        >
                                            <Pencil className="mr-1 size-3 text-slate-400" />
                                            Edit Perkara
                                        </Link>
                                    </Button>
                                )}

                                {can.update && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setOperation('party')}
                                        className="h-7.5 rounded-lg border-slate-200/80 bg-white px-2.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-white/10 dark:bg-[#16181d] dark:text-zinc-300"
                                    >
                                        <Plus className="mr-1 size-3.5 text-slate-400" />
                                        Aktivitas
                                    </Button>
                                )}

                                {can.uploadDocument && (
                                    <Button
                                        size="sm"
                                        className="h-7.5 rounded-lg bg-slate-900 px-3 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 active:scale-95 dark:bg-white dark:text-slate-900"
                                        asChild
                                    >
                                        <Link
                                            href={documentRoutes.index.url({
                                                query: {
                                                    upload: 1,
                                                    matter_id: matter.id,
                                                },
                                            })}
                                        >
                                            <FileUp className="mr-1 size-3.5" />
                                            Unggah Dokumen
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Bottom Tier: Full-Width Title & Client Context */}
                        <div className="space-y-1.5">
                            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl lg:text-[26px] lg:leading-snug dark:text-white">
                                {matter.title}
                            </h1>

                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-zinc-400">
                                <div className="flex items-center gap-1.5">
                                    <span>Klien:</span>
                                    <Link
                                        href={clientRoutes.show.url(
                                            matter.client.id,
                                        )}
                                        className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:underline dark:text-blue-400"
                                    >
                                        {matter.client.type === 'individual' ||
                                        matter.client.type === 'person' ? (
                                            <User className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                                        ) : (
                                            <Building2 className="size-3.5 text-blue-600 dark:text-blue-400" />
                                        )}
                                        <span>
                                            {matter.client.display_name}
                                        </span>
                                    </Link>
                                    <span
                                        className={`rounded px-1.5 py-0.5 text-[9.5px] font-bold ${
                                            matter.client.type ===
                                                'individual' ||
                                            matter.client.type === 'person'
                                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                                                : 'bg-slate-100 text-slate-600 dark:bg-white/[0.06] dark:text-zinc-300'
                                        }`}
                                    >
                                        {matter.client.type === 'individual' ||
                                        matter.client.type === 'person'
                                            ? 'Individu'
                                            : 'Badan Hukum'}
                                    </span>
                                </div>
                                <span>·</span>
                                <div>
                                    Area Praktik:{' '}
                                    <strong className="font-semibold text-slate-700 dark:text-zinc-300">
                                        {matter.practice_area?.name ?? 'Umum'}
                                    </strong>
                                </div>
                                {matter.jurisdiction && (
                                    <>
                                        <span>·</span>
                                        <div>
                                            Yurisdiksi:{' '}
                                            <span className="font-medium text-slate-700 dark:text-zinc-300">
                                                {matter.jurisdiction}
                                            </span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {matter.legal_hold_at && (
                        <div className="flex items-start gap-2.5 rounded-xl border border-amber-300 bg-amber-50 px-3.5 py-3 text-amber-950 dark:border-amber-700/60 dark:bg-amber-950/30 dark:text-amber-100">
                            <Lock className="mt-0.5 size-4 shrink-0 text-amber-700 dark:text-amber-400" />
                            <div>
                                <p className="text-xs font-bold">
                                    Legal Hold aktif — penghapusan bukti,
                                    dokumen, dan korespondensi dikunci.
                                </p>
                                {matter.legal_hold_reason && (
                                    <p className="mt-0.5 text-[11px] text-amber-800 dark:text-amber-300">
                                        {matter.legal_hold_reason}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* 2. Top 4 Bento Stat Cards */}
                    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {/* 1. Responsible Partner */}
                        <div className="group flex min-h-[96px] flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.08] dark:bg-[#14161b] dark:hover:border-white/15">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:text-zinc-400">
                                    LEAD PARTNER
                                </span>
                                <div className="flex size-6 items-center justify-center rounded-md bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                                    <UserCheck className="size-3.5" />
                                </div>
                            </div>
                            <div className="mt-2 flex items-center gap-2.5">
                                <Avatar className="size-7 rounded-full border border-slate-200/80 dark:border-white/10">
                                    <AvatarImage
                                        src={
                                            matter.responsible_partner
                                                .avatar_url ?? undefined
                                        }
                                    />
                                    <AvatarFallback className="text-[9px] font-bold">
                                        {getInitials(
                                            matter.responsible_partner.name,
                                        )}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0">
                                    <p
                                        className="truncate text-xs font-bold text-slate-900 dark:text-white"
                                        title={matter.responsible_partner.name}
                                    >
                                        {matter.responsible_partner.name}
                                    </p>
                                    <p className="truncate text-[10px] text-slate-500 dark:text-zinc-400">
                                        {matter.responsible_partner
                                            .position_title ?? 'Lead Partner'}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-2.5 border-t border-slate-100 pt-2 text-[11px] text-slate-500 dark:border-white/[0.04]">
                                <span>Penanggung jawab utama</span>
                            </div>
                        </div>

                        {/* 2. Area Praktik */}
                        <div className="group flex min-h-[96px] flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.08] dark:bg-[#14161b] dark:hover:border-white/15">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:text-zinc-400">
                                    AREA PRAKTIK
                                </span>
                                <div className="flex size-6 items-center justify-center rounded-md bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
                                    <Scale className="size-3.5" />
                                </div>
                            </div>
                            <div className="mt-2 space-y-0.5">
                                <p className="truncate text-xs font-bold text-slate-900 dark:text-white">
                                    {matter.practice_area?.name ?? 'Umum'}
                                </p>
                                <p className="truncate text-[10px] text-slate-500 dark:text-zinc-400">
                                    {matter.matter_type ??
                                        'Advisory & Litigation'}
                                </p>
                            </div>
                            <div className="mt-2.5 border-t border-slate-100 pt-2 text-[11px] text-slate-500 dark:border-white/[0.04]">
                                <span>Klasifikasi perkara hukum</span>
                            </div>
                        </div>

                        {/* 3. Tim Advokat */}
                        <div className="group flex min-h-[96px] flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.08] dark:bg-[#14161b] dark:hover:border-white/15">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:text-zinc-400">
                                    TIM ADVOKAT
                                </span>
                                <div className="flex size-6 items-center justify-center rounded-md bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                                    <Users className="size-3.5" />
                                </div>
                            </div>
                            <div className="mt-2 flex items-center justify-between">
                                <div className="flex -space-x-1.5 overflow-hidden">
                                    {matter.members
                                        .slice(0, 4)
                                        .map((member) => (
                                            <Avatar
                                                key={member.id}
                                                className="size-6 rounded-full border-2 border-white dark:border-[#14161b]"
                                            >
                                                <AvatarImage
                                                    src={
                                                        member.avatar_url ??
                                                        undefined
                                                    }
                                                />
                                                <AvatarFallback className="text-[8px] font-bold">
                                                    {getInitials(member.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                        ))}
                                    {matter.members.length > 4 && (
                                        <span className="flex size-6 items-center justify-center rounded-full border-2 border-white bg-slate-200 text-[8px] font-bold text-slate-700 dark:border-[#14161b] dark:bg-zinc-800 dark:text-zinc-300">
                                            +{matter.members.length - 4}
                                        </span>
                                    )}
                                </div>
                                <span className="font-mono text-xs font-semibold text-slate-900 dark:text-white">
                                    {matter.members.length} Advokat
                                </span>
                            </div>
                            <div className="mt-2.5 border-t border-slate-100 pt-2 text-[11px] text-slate-500 dark:border-white/[0.04]">
                                <span>Tim penanganan aktif</span>
                            </div>
                        </div>

                        {/* 4. Tenggat Terdekat */}
                        <div className="group flex min-h-[96px] flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.08] dark:bg-[#14161b] dark:hover:border-white/15">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:text-zinc-400">
                                    TENGGAT TERDEKAT
                                </span>
                                <div className="flex size-6 items-center justify-center rounded-md bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
                                    <Clock className="size-3.5" />
                                </div>
                            </div>
                            <div className="mt-2 min-w-0">
                                {nextDeadline ? (
                                    <>
                                        <p
                                            className="truncate text-xs font-semibold text-slate-900 dark:text-white"
                                            title={nextDeadline.title}
                                        >
                                            {nextDeadline.title}
                                        </p>
                                        <p className="font-mono text-[11px] font-bold text-amber-600 dark:text-amber-400">
                                            {formatDate(
                                                nextDeadline.due_at,
                                                true,
                                            )}
                                        </p>
                                    </>
                                ) : (
                                    <p className="text-xs text-slate-400 dark:text-zinc-500">
                                        Tidak ada tenggat aktif
                                    </p>
                                )}
                            </div>
                            <div className="mt-2.5 border-t border-slate-100 pt-2 text-[11px] text-slate-500 dark:border-white/[0.04]">
                                <span>Batas waktu dokumen &amp; sidang</span>
                            </div>
                        </div>
                    </section>

                    {/* 3. Segmented Navigation Tabs (Horizontal Swipeable on Mobile) */}
                    <div className="flex items-center gap-1 overflow-x-auto rounded-xl border border-slate-200/70 bg-white p-1 shadow-2xs [scrollbar-width:none] [-ms-overflow-style:none] dark:border-white/[0.06] dark:bg-[#14161b] [&::-webkit-scrollbar]:hidden">
                        {tabs.map((item) => {
                            const isActive = tab === item.id;
                            const count =
                                item.id === 'Diskusi'
                                    ? (matter.comments?.length ?? 0)
                                    : item.id === 'Tugas'
                                      ? matter.tasks.length
                                      : item.id === 'Dokumen'
                                        ? matter.documents.length
                                        : item.id === 'Catatan'
                                          ? matter.notes.length
                                          : item.id === 'Timeline'
                                            ? matter.events.length
                                            : item.id === 'Kronologi'
                                              ? (matter.chronologies?.length ??
                                                0)
                                              : item.id === 'BuktiFisik'
                                                ? (matter.evidences?.length ??
                                                  0)
                                                : null;

                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => setTab(item.id)}
                                    className={`flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                                        isActive
                                            ? 'bg-slate-900 text-white shadow-2xs dark:bg-white dark:text-slate-900'
                                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-white/[0.04] dark:hover:text-white'
                                    }`}
                                >
                                    <item.icon
                                        className={`size-3.5 shrink-0 ${
                                            isActive
                                                ? 'text-white dark:text-slate-900'
                                                : 'text-slate-500 group-hover:text-slate-700 dark:text-zinc-400'
                                        }`}
                                    />
                                    <span>{item.label}</span>
                                    {count !== null && count > 0 && (
                                        <span
                                            className={`py-0.2 rounded-full px-1.5 font-mono text-[10px] font-bold ${
                                                isActive
                                                    ? 'bg-white/20 text-white dark:bg-slate-900/20 dark:text-slate-900'
                                                    : 'bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-300'
                                            }`}
                                        >
                                            {count}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* 4. 2-Column Split Workspace Cockpit */}
                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
                        {/* Left Main Cockpit Content (8 Cols) */}
                        <div className="space-y-5 lg:col-span-8">
                            {/* TAB 1: OVERVIEW */}
                            {tab === 'Overview' && (
                                <div className="space-y-5">
                                    {/* Ringkasan & Lingkup Perkara */}
                                    <div className="rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                        <div className="mb-2.5 flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-white/[0.04]">
                                            <div className="flex items-center gap-2">
                                                <Briefcase className="size-4 text-slate-700 dark:text-zinc-300" />
                                                <h2 className="text-xs font-bold text-slate-900 dark:text-white">
                                                    Ringkasan &amp; Lingkup
                                                    Perkara
                                                </h2>
                                            </div>
                                            <span className="text-[11px] text-slate-400">
                                                Latar Belakang Kasus
                                            </span>
                                        </div>
                                        {matter.summary ? (
                                            <p className="text-xs leading-relaxed whitespace-pre-wrap text-slate-700 dark:text-zinc-300">
                                                {matter.summary}
                                            </p>
                                        ) : (
                                            <p className="text-xs text-slate-400 italic">
                                                Belum ada uraian ringkasan
                                                perkara yang dicatat.
                                            </p>
                                        )}
                                    </div>

                                    {/* Hierarki & Silsilah Perkara (Parent-Child Matters) */}
                                    <div className="rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                        <div className="mb-2.5 flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-white/[0.04]">
                                            <div className="flex items-center gap-2">
                                                <FolderKanban className="size-4 text-slate-700 dark:text-zinc-300" />
                                                <h2 className="text-xs font-bold text-slate-900 dark:text-white">
                                                    Hierarki &amp; Perkara
                                                    Terkait
                                                </h2>
                                            </div>
                                            <span className="text-[11px] text-slate-400">
                                                Banding / Kasasi / PK
                                            </span>
                                        </div>

                                        {matter.parent_matter && (
                                            <div className="mb-2.5 border-b border-slate-100 pb-2.5 dark:border-white/[0.04]">
                                                <div className="flex items-center justify-between text-[11px]">
                                                    <span className="font-semibold text-slate-500 dark:text-zinc-400">
                                                        Perkara Induk
                                                    </span>
                                                    <span className="text-slate-400">
                                                        {relationshipTypeLabels[
                                                            matter.relationship_type ??
                                                                ''
                                                        ] ?? 'Induk'}
                                                    </span>
                                                </div>
                                                <Link
                                                    href={matterRoutes.show.url(
                                                        matter.parent_matter.id,
                                                    )}
                                                    className="mt-1 flex items-center justify-between text-xs hover:text-blue-600 dark:hover:text-blue-400"
                                                >
                                                    <div className="min-w-0 pr-2">
                                                        <span className="font-mono font-bold text-slate-900 dark:text-white">
                                                            {
                                                                matter
                                                                    .parent_matter
                                                                    .matter_number
                                                            }
                                                        </span>
                                                        <span className="ml-1.5 font-medium text-slate-700 dark:text-zinc-300">
                                                            —{' '}
                                                            {
                                                                matter
                                                                    .parent_matter
                                                                    .title
                                                            }
                                                        </span>
                                                    </div>
                                                    <span className="shrink-0 text-xs font-semibold text-blue-600 dark:text-blue-400">
                                                        Buka →
                                                    </span>
                                                </Link>
                                            </div>
                                        )}

                                        {matter.child_matters &&
                                        matter.child_matters.length > 0 ? (
                                            <div className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                                                {matter.child_matters.map(
                                                    (child) => (
                                                        <div
                                                            key={child.id}
                                                            className="flex items-center justify-between py-2 text-xs"
                                                        >
                                                            <div className="min-w-0 pr-3">
                                                                <div className="flex items-center gap-2">
                                                                    <Link
                                                                        href={matterRoutes.show.url(
                                                                            child.id,
                                                                        )}
                                                                        className="font-mono font-bold text-slate-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
                                                                    >
                                                                        {
                                                                            child.matter_number
                                                                        }
                                                                    </Link>
                                                                    <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-white/[0.06] dark:text-zinc-300">
                                                                        {relationshipTypeLabels[
                                                                            child.relationship_type ??
                                                                                ''
                                                                        ] ??
                                                                            'Turunan'}
                                                                    </span>
                                                                    <StatusBadge
                                                                        value={
                                                                            child.status
                                                                        }
                                                                    />
                                                                </div>
                                                                <Link
                                                                    href={matterRoutes.show.url(
                                                                        child.id,
                                                                    )}
                                                                    className="mt-0.5 block truncate text-[11px] text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white"
                                                                >
                                                                    {
                                                                        child.title
                                                                    }
                                                                </Link>
                                                            </div>
                                                            <Link
                                                                href={matterRoutes.show.url(
                                                                    child.id,
                                                                )}
                                                                className="shrink-0 text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
                                                            >
                                                                Buka →
                                                            </Link>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        ) : !matter.parent_matter ? (
                                            <p className="text-xs text-slate-400">
                                                Perkara mandiri (Tingkat
                                                Pertama). Belum ada relasi
                                                perkara banding, kasasi, atau
                                                perkara turunan.
                                            </p>
                                        ) : null}
                                    </div>

                                    {/* Tugas Berjalan */}
                                    <div className="rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                        <div className="mb-2.5 flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-white/[0.04]">
                                            <div className="flex items-center gap-2">
                                                <ListChecks className="size-4 text-slate-700 dark:text-zinc-300" />
                                                <h2 className="text-xs font-bold text-slate-900 dark:text-white">
                                                    Tugas Berjalan (
                                                    {matter.tasks.length})
                                                </h2>
                                            </div>
                                            {matter.tasks.length > 3 && (
                                                <button
                                                    onClick={() =>
                                                        setTab('Tugas')
                                                    }
                                                    className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
                                                >
                                                    Lihat Semua →
                                                </button>
                                            )}
                                        </div>
                                        <TaskList
                                            tasks={matter.tasks.slice(0, 4)}
                                            getInitials={getInitials}
                                        />
                                    </div>

                                    {/* Pihak Terkait & Lawan */}
                                    <div className="rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                        <div className="mb-2.5 flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-white/[0.04]">
                                            <div className="flex items-center gap-2">
                                                <Users className="size-4 text-slate-700 dark:text-zinc-300" />
                                                <h2 className="text-xs font-bold text-slate-900 dark:text-white">
                                                    Pihak Terkait &amp; Lawan (
                                                    {matter.parties.length})
                                                </h2>
                                            </div>
                                            {can.update && (
                                                <button
                                                    onClick={() =>
                                                        setOperation('party')
                                                    }
                                                    className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
                                                >
                                                    + Tambah Pihak
                                                </button>
                                            )}
                                        </div>

                                        {matter.parties.length ? (
                                            <div className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                                                {matter.parties.map((party) => (
                                                    <div
                                                        key={party.id}
                                                        className="flex items-center justify-between py-2 text-xs"
                                                    >
                                                        <div className="min-w-0 pr-3">
                                                            <p className="truncate font-semibold text-slate-900 dark:text-white">
                                                                {party.name}
                                                            </p>
                                                            {party.organization_name && (
                                                                <p className="truncate text-[11px] text-slate-500 dark:text-zinc-400">
                                                                    {
                                                                        party.organization_name
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>
                                                        <div className="flex shrink-0 items-center gap-1.5">
                                                            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-white/[0.06] dark:text-zinc-300">
                                                                {partyTypeLabels[
                                                                    party
                                                                        .party_type
                                                                ] ??
                                                                    party.party_type.replace(
                                                                        '_',
                                                                        ' ',
                                                                    )}
                                                            </span>
                                                            {can.update && (
                                                                <button
                                                                    type="button"
                                                                    disabled={Boolean(
                                                                        matter.legal_hold_at,
                                                                    )}
                                                                    onClick={() => {
                                                                        if (
                                                                            matter.legal_hold_at
                                                                        )
                                                                            return;
                                                                        setPartyToDelete(
                                                                            party,
                                                                        );
                                                                    }}
                                                                    className="text-slate-400 hover:text-rose-600 disabled:cursor-not-allowed disabled:text-amber-500 disabled:opacity-60 dark:hover:text-rose-400"
                                                                    title={
                                                                        matter.legal_hold_at
                                                                            ? 'Dikunci karena Legal Hold aktif'
                                                                            : 'Hapus Pihak Terkait'
                                                                    }
                                                                >
                                                                    <Trash2 className="size-3" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-xs text-slate-400">
                                                Belum ada pihak terkait atau
                                                pihak lawan yang didaftarkan.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* TAB: DISKUSI STRATEGI PERKARA */}
                            {tab === 'Diskusi' && (
                                <DiscussionBox
                                    commentableType="matter"
                                    commentableId={matter.id}
                                    comments={matter.comments || []}
                                    staffList={firmStaff || []}
                                    title="Diskusi Strategi Perkara"
                                    subtitle="Kolaborasi strategi pembuktian, pembagian tugas, dan catatan instruksi tim perkara."
                                />
                            )}

                            {/* TAB 2: TUGAS */}
                            {tab === 'Tugas' && (
                                <div className="space-y-4 rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-white/[0.04]">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <ListChecks className="size-4 text-slate-700 dark:text-zinc-300" />
                                                <h2 className="text-xs font-bold text-slate-900 dark:text-white">
                                                    Daftar Tugas Perkara (
                                                    {matter.tasks.length})
                                                </h2>
                                            </div>
                                            <p className="mt-0.5 text-[11px] text-slate-500 dark:text-zinc-400">
                                                Item pekerjaan hukum, riset
                                                berkas, dan penugasan advokat.
                                            </p>
                                        </div>
                                    </div>

                                    {matter.tasks.length ? (
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left text-xs">
                                                <thead>
                                                    <tr className="border-b border-slate-100 bg-slate-50/60 text-[10px] font-semibold text-slate-500 uppercase dark:border-white/[0.04] dark:bg-[#121418]">
                                                        <th className="py-2.5 pr-3 pl-3 font-semibold">
                                                            Tugas
                                                        </th>
                                                        <th className="px-3 py-2.5 font-semibold">
                                                            Penanggung Jawab
                                                        </th>
                                                        <th className="px-3 py-2.5 font-semibold">
                                                            Tenggat
                                                        </th>
                                                        <th className="px-3 py-2.5 font-semibold">
                                                            Prioritas
                                                        </th>
                                                        <th className="py-2.5 pr-3 pl-3 text-right font-semibold">
                                                            Status
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                                                    {matter.tasks.map(
                                                        (task) => (
                                                            <tr
                                                                key={task.id}
                                                                className="group transition-colors hover:bg-slate-50/50 dark:hover:bg-white/[0.02]"
                                                            >
                                                                <td className="py-2.5 pr-3 pl-3">
                                                                    <p className="font-semibold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                                                                        {
                                                                            task.title
                                                                        }
                                                                    </p>
                                                                </td>
                                                                <td className="px-3 py-2.5 whitespace-nowrap">
                                                                    <div className="flex items-center gap-1.5">
                                                                        <Avatar className="size-5 rounded-full border border-slate-200/80 dark:border-white/10">
                                                                            <AvatarImage
                                                                                src={
                                                                                    task
                                                                                        .assignee
                                                                                        ?.avatar_url ??
                                                                                    undefined
                                                                                }
                                                                            />
                                                                            <AvatarFallback className="text-[7px] font-bold">
                                                                                {getInitials(
                                                                                    task
                                                                                        .assignee
                                                                                        ?.name ??
                                                                                        'T',
                                                                                )}
                                                                            </AvatarFallback>
                                                                        </Avatar>
                                                                        <span className="font-medium text-slate-700 dark:text-zinc-200">
                                                                            {task
                                                                                .assignee
                                                                                ?.name ??
                                                                                'Belum ditugaskan'}
                                                                        </span>
                                                                    </div>
                                                                </td>
                                                                <td className="px-3 py-2.5 font-mono text-[11px] whitespace-nowrap text-slate-500 dark:text-zinc-400">
                                                                    {task.due_at
                                                                        ? formatDate(
                                                                              task.due_at,
                                                                          )
                                                                        : '-'}
                                                                </td>
                                                                <td className="px-3 py-2.5 whitespace-nowrap">
                                                                    <StatusBadge
                                                                        value={
                                                                            task.priority
                                                                        }
                                                                    />
                                                                </td>
                                                                <td className="py-2.5 pr-3 pl-3 text-right whitespace-nowrap">
                                                                    <StatusBadge
                                                                        value={
                                                                            task.status
                                                                        }
                                                                    />
                                                                </td>
                                                            </tr>
                                                        ),
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="flex min-h-[180px] items-center justify-center p-6 text-center">
                                            <EmptyState title="Tidak ada tugas aktif untuk perkara ini" />
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* TAB 3: TIMELINE & SIDANG */}
                            {tab === 'Timeline' && (
                                <div className="space-y-4 rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-white/[0.04]">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <CalendarClock className="size-4 text-slate-700 dark:text-zinc-300" />
                                                <h2 className="text-xs font-bold text-slate-900 dark:text-white">
                                                    Agenda, Sidang &amp;
                                                    Timeline (
                                                    {matter.events.length})
                                                </h2>
                                            </div>
                                            <p className="mt-0.5 text-[11px] text-slate-500 dark:text-zinc-400">
                                                Jadwal pertemuan, proses
                                                peradilan, dan hitung mundur
                                                sidang pengadilan.
                                            </p>
                                        </div>
                                        {can.update && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() =>
                                                    setOperation('event')
                                                }
                                                className="h-8 rounded-lg border-slate-200/80 px-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-zinc-200"
                                            >
                                                <Plus className="mr-1 size-3.5 text-slate-400" />
                                                Tambah Agenda
                                            </Button>
                                        )}
                                    </div>

                                    {/* Upcoming Hearing Countdown Banner */}
                                    {upcomingHearing &&
                                        (() => {
                                            const daysRemaining = Math.max(
                                                0,
                                                Math.ceil(
                                                    (new Date(
                                                        upcomingHearing.starts_at,
                                                    ).getTime() -
                                                        new Date().getTime()) /
                                                        (1000 * 60 * 60 * 24),
                                                ),
                                            );

                                            return (
                                                <div className="rounded-xl border border-amber-200/90 bg-amber-50/50 p-3 shadow-2xs dark:border-amber-900/40 dark:bg-amber-950/20">
                                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                                        <div className="flex min-w-0 items-start gap-2.5">
                                                            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-500 text-white">
                                                                <Gavel className="size-4" />
                                                            </div>
                                                            <div className="min-w-0 space-y-0.5">
                                                                <h3 className="truncate text-xs font-bold text-slate-900 dark:text-white">
                                                                    {
                                                                        upcomingHearing.title
                                                                    }
                                                                </h3>
                                                                <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-600 dark:text-zinc-400">
                                                                    <span className="font-mono">
                                                                        {formatDate(
                                                                            upcomingHearing.starts_at,
                                                                            true,
                                                                        )}
                                                                    </span>
                                                                    <span>
                                                                        ·
                                                                    </span>
                                                                    <span>
                                                                        {upcomingHearing.location ??
                                                                            'Pengadilan'}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-1.5 rounded-lg border border-amber-300/80 bg-white/90 px-2.5 py-1 text-xs shadow-2xs dark:border-amber-800/50 dark:bg-[#1c1f24]">
                                                            <Clock className="size-3 text-amber-600 dark:text-amber-400" />
                                                            <span className="font-mono font-bold text-amber-950 dark:text-amber-200">
                                                                {daysRemaining ===
                                                                0
                                                                    ? 'Hari Ini'
                                                                    : daysRemaining ===
                                                                        1
                                                                      ? 'Besok'
                                                                      : `${daysRemaining} Hari Lagi`}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })()}

                                    {matter.events.length ? (
                                        <div className="relative space-y-3.5 before:absolute before:top-2.5 before:bottom-2.5 before:left-3.5 before:w-px before:bg-slate-200 dark:before:bg-zinc-800">
                                            {matter.events.map((event) => {
                                                const meta = eventTypeMeta[
                                                    event.event_type
                                                ] ?? {
                                                    label: event.event_type.replace(
                                                        '_',
                                                        ' ',
                                                    ),
                                                    icon: CalendarClock,
                                                    color: 'bg-slate-100 text-slate-700 dark:bg-white/[0.06] dark:text-zinc-300',
                                                };
                                                const IconComponent = meta.icon;
                                                const defaultChecklist = [
                                                    {
                                                        text: 'Surat Kuasa Khusus Asli bermaterai',
                                                        checked: false,
                                                    },
                                                    {
                                                        text: 'Daftar Alat Bukti Surat (P-1 s/d selesai)',
                                                        checked: false,
                                                    },
                                                    {
                                                        text: 'Daftar Saksi Fakta / Saksi Ahli',
                                                        checked: false,
                                                    },
                                                    {
                                                        text: 'Berita Acara Sumpah (BAS) & KTA Advokat',
                                                        checked: false,
                                                    },
                                                ];
                                                const currentChecklist =
                                                    event.checklist &&
                                                    event.checklist.length
                                                        ? event.checklist
                                                        : defaultChecklist;

                                                return (
                                                    <div
                                                        key={event.id}
                                                        className="relative flex items-start gap-3 pl-1"
                                                    >
                                                        <div className="relative z-10 flex size-6 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white shadow-2xs dark:border-white/[0.1] dark:bg-[#1c1f24]">
                                                            <IconComponent className="size-3 text-slate-700 dark:text-white" />
                                                        </div>

                                                        <div className="flex-1 rounded-lg border border-slate-100 bg-slate-50/70 p-3 text-xs dark:border-white/[0.04] dark:bg-[#121418]">
                                                            <div className="flex flex-wrap items-center justify-between gap-2">
                                                                <span className="font-mono text-[11px] font-semibold text-slate-900 dark:text-white">
                                                                    {formatDate(
                                                                        event.starts_at,
                                                                        true,
                                                                    )}
                                                                </span>
                                                                <div className="flex flex-wrap items-center gap-1.5">
                                                                    <span
                                                                        className={`py-0.2 rounded px-1.5 text-[9px] font-bold capitalize ${meta.color}`}
                                                                    >
                                                                        {
                                                                            meta.label
                                                                        }
                                                                    </span>

                                                                    {/* Event Status Badges */}
                                                                    {event.status === 'completed' && (
                                                                        <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                                                                            Sidang Selesai
                                                                        </span>
                                                                    )}
                                                                    {event.status === 'postponed' && (
                                                                        <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                                                                            Ditunda / Lanjutan
                                                                        </span>
                                                                    )}
                                                                    {event.status === 'cancelled' && (
                                                                        <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[9px] font-bold text-rose-800 dark:bg-rose-950/60 dark:text-rose-300">
                                                                            Dibatalkan
                                                                        </span>
                                                                    )}
                                                                    {(!event.status || event.status === 'scheduled') && (
                                                                        <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[9px] font-bold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                                                                            Terjadwal
                                                                        </span>
                                                                    )}

                                                                    {/* Action: Edit Agenda & Notes */}
                                                                    {can.update && (
                                                                        <button
                                                                            type="button"
                                                                            disabled={Boolean(
                                                                                matter.legal_hold_at,
                                                                            )}
                                                                            onClick={() =>
                                                                                setEditingEvent(
                                                                                    event,
                                                                                )
                                                                            }
                                                                            className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-bold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-white/10 dark:bg-[#16181d] dark:text-zinc-200"
                                                                            title="Edit Agenda & Catatan"
                                                                        >
                                                                            <Pencil className="size-3 text-slate-400" />
                                                                            Edit / Catatan
                                                                        </button>
                                                                    )}

                                                                    {/* Action: Record Hearing Outcome Button */}
                                                                    {can.update && (
                                                                        <button
                                                                            type="button"
                                                                            disabled={Boolean(
                                                                                matter.legal_hold_at,
                                                                            )}
                                                                            onClick={() =>
                                                                                setRecordingOutcomeEvent(
                                                                                    event,
                                                                                )
                                                                            }
                                                                            className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold shadow-2xs transition-all ${
                                                                                event.outcome
                                                                                    ? 'border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                                                                                    : 'border border-blue-300 bg-blue-50 text-blue-800 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300'
                                                                            }`}
                                                                            title={
                                                                                event.outcome
                                                                                    ? 'Ubah Ringkasan Hasil Sidang'
                                                                                    : 'Catat Hasil Jalannya Persidangan'
                                                                            }
                                                                        >
                                                                            <Scale className="size-3" />
                                                                            {event.outcome
                                                                                ? 'Ubah Hasil'
                                                                                : 'Catat Hasil Sidang'}
                                                                        </button>
                                                                    )}

                                                                    {can.update && (
                                                                        <button
                                                                            type="button"
                                                                            disabled={Boolean(
                                                                                matter.legal_hold_at,
                                                                            )}
                                                                            onClick={() => {
                                                                                if (
                                                                                    matter.legal_hold_at
                                                                                )
                                                                                    return;
                                                                                setEventToDelete(
                                                                                    event,
                                                                                );
                                                                            }}
                                                                            className="text-slate-400 hover:text-rose-600 disabled:cursor-not-allowed disabled:text-amber-500 disabled:opacity-60 dark:hover:text-rose-400"
                                                                            title={
                                                                                matter.legal_hold_at
                                                                                    ? 'Dikunci karena Legal Hold aktif'
                                                                                    : 'Hapus Agenda'
                                                                            }
                                                                        >
                                                                            <Trash2 className="size-3" />
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            <h4 className="mt-1 font-semibold text-slate-900 dark:text-white">
                                                                {event.title}
                                                            </h4>

                                                            {event.location && (
                                                                <p className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-500 dark:text-zinc-400">
                                                                    <MapPin className="size-3 text-slate-400" />
                                                                    {event.location}
                                                                </p>
                                                            )}

                                                            {event.description && (
                                                                <p className="mt-1 text-[11px] text-slate-600 dark:text-zinc-400">
                                                                    {
                                                                        event.description
                                                                    }
                                                                </p>
                                                            )}

                                                            {/* Recorded Outcome & Judge Notes Display Box */}
                                                            {event.outcome && (
                                                                <div className="mt-3 space-y-2 rounded-xl border border-emerald-200/80 bg-emerald-50/40 p-3 text-xs shadow-2xs dark:border-emerald-900/40 dark:bg-emerald-950/20">
                                                                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-200/60 pb-1.5 dark:border-emerald-900/30">
                                                                        <div className="flex items-center gap-1.5 font-bold text-emerald-900 dark:text-emerald-200">
                                                                            <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                                                                            <span>Resume &amp; Berita Acara Sidang</span>
                                                                        </div>
                                                                        {event.attendee && (
                                                                            <div className="flex items-center gap-1.5 text-[10.5px] text-slate-600 dark:text-zinc-300">
                                                                                <span className="text-slate-400 dark:text-zinc-500">Advokat:</span>
                                                                                <span className="font-semibold text-slate-900 dark:text-white">{event.attendee.name}</span>
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                    <p className="whitespace-pre-line text-xs leading-relaxed text-slate-800 dark:text-zinc-200">
                                                                        {event.outcome}
                                                                    </p>

                                                                    {event.judge_notes && (
                                                                        <div className="mt-2 rounded-lg border border-amber-200/80 bg-amber-50/70 p-2 text-[11px] text-amber-950 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200">
                                                                            <strong className="block font-bold uppercase tracking-wider text-[9.5px] text-amber-800 dark:text-amber-400">
                                                                                Arahan / Perintah Majelis Hakim:
                                                                            </strong>
                                                                            <span className="whitespace-pre-line text-amber-900 dark:text-amber-200">{event.judge_notes}</span>
                                                                        </div>
                                                                    )}

                                                                    {event.next_event && (
                                                                        <div className="mt-2.5 flex items-center justify-between rounded-lg border border-blue-200/80 bg-blue-50/70 p-2 text-xs text-blue-950 dark:border-blue-900/40 dark:bg-blue-950/30 dark:text-blue-200">
                                                                            <div className="flex items-center gap-2">
                                                                                <CalendarClock className="size-4 shrink-0 text-blue-600 dark:text-blue-400" />
                                                                                <div>
                                                                                    <span className="block font-bold text-slate-900 dark:text-white">
                                                                                        Sidang Lanjutan: {event.next_event.title}
                                                                                    </span>
                                                                                    <span className="font-mono text-[10.5px] text-slate-600 dark:text-zinc-400">
                                                                                        {formatDate(event.next_event.starts_at, true)} {event.next_event.location ? `• ${event.next_event.location}` : ''}
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                            <span className="rounded bg-blue-200/70 px-2 py-0.5 text-[9px] font-bold text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
                                                                                Terjadwal
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}

                                                            {(event.event_type ===
                                                                'court' ||
                                                                event.event_type ===
                                                                    'hearing' ||
                                                                event.event_type ===
                                                                    'court_hearing') && (
                                                                <div className="mt-2.5 rounded-lg border border-slate-200/80 bg-white p-2.5 dark:border-white/[0.08] dark:bg-[#16181d]">
                                                                    <div className="mb-1.5 flex items-center justify-between text-[10px]">
                                                                        <span className="flex items-center gap-1 font-semibold text-slate-900 dark:text-white">
                                                                            <ListChecks className="size-3 text-blue-600 dark:text-blue-400" />
                                                                            Checklist
                                                                            Berkas
                                                                            Sidang
                                                                        </span>
                                                                        <span className="font-mono text-slate-500">
                                                                            {
                                                                                currentChecklist.filter(
                                                                                    (
                                                                                        c,
                                                                                    ) =>
                                                                                        c.checked,
                                                                                )
                                                                                    .length
                                                                            }
                                                                            /
                                                                            {
                                                                                currentChecklist.length
                                                                            }{' '}
                                                                            Siap
                                                                        </span>
                                                                    </div>
                                                                    <div className="grid gap-1 sm:grid-cols-2">
                                                                        {currentChecklist.map(
                                                                            (
                                                                                chk,
                                                                                idx,
                                                                            ) => (
                                                                                <label
                                                                                    key={
                                                                                        idx
                                                                                    }
                                                                                    className="flex cursor-pointer items-center gap-1.5 rounded-md border border-slate-100 bg-slate-50/60 px-2 py-1 text-[10px] text-slate-700 hover:bg-slate-100 dark:border-white/[0.04] dark:bg-white/[0.02] dark:text-zinc-300"
                                                                                >
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        checked={
                                                                                            chk.checked
                                                                                        }
                                                                                        onChange={(
                                                                                            e,
                                                                                        ) => {
                                                                                            const nextList =
                                                                                                [
                                                                                                    ...currentChecklist,
                                                                                                ];
                                                                                            nextList[
                                                                                                idx
                                                                                            ] =
                                                                                                {
                                                                                                    ...nextList[
                                                                                                        idx
                                                                                                    ],
                                                                                                    checked:
                                                                                                        e
                                                                                                            .target
                                                                                                            .checked,
                                                                                                };
                                                                                            router.put(
                                                                                                eventChecklistRoutes.update.url(
                                                                                                    {
                                                                                                        matter: matter.id,
                                                                                                        event: event.id,
                                                                                                    },
                                                                                                ),
                                                                                                {
                                                                                                    checklist:
                                                                                                        nextList,
                                                                                                },
                                                                                                {
                                                                                                    preserveScroll: true,
                                                                                                },
                                                                                            );
                                                                                        }}
                                                                                        className="size-3 rounded border-zinc-300 text-blue-600"
                                                                                    />
                                                                                    <span
                                                                                        className={
                                                                                            chk.checked
                                                                                                ? 'text-slate-400 line-through'
                                                                                                : ''
                                                                                        }
                                                                                    >
                                                                                        {
                                                                                            chk.text
                                                                                        }
                                                                                    </span>
                                                                                </label>
                                                                            ),
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="flex min-h-[180px] items-center justify-center p-6 text-center">
                                            <EmptyState title="Belum ada agenda atau jadwal sidang yang dicatat" />
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* TAB: KRONOLOGI FAKTA PERKARA */}
                            {tab === 'Kronologi' && (
                                <div className="space-y-4 rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3 dark:border-white/[0.04]">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <History className="size-4 text-slate-700 dark:text-zinc-300" />
                                                <h2 className="text-xs font-bold text-slate-900 dark:text-white">
                                                    Kronologi &amp; Rekaman
                                                    Fakta Hukum (
                                                    {matter.chronologies
                                                        ?.length ?? 0}
                                                    )
                                                </h2>
                                            </div>
                                            <p className="mt-0.5 text-[11px] text-slate-500 dark:text-zinc-400">
                                                Garis waktu peristiwa faktual
                                                perkara, referensi alat bukti
                                                surat, dan saksi terkait.
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-8 rounded-lg border-slate-200/80 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-zinc-200"
                                                asChild
                                            >
                                                <a
                                                    href={chronologyRoutes.pdf.url(
                                                        { matter: matter.id },
                                                    )}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    <Download className="mr-1 size-3 text-blue-600 dark:text-blue-400" />
                                                    PDF
                                                </a>
                                            </Button>

                                            {can.update && (
                                                <Button
                                                    size="sm"
                                                    onClick={() =>
                                                        setOperation(
                                                            'chronology',
                                                        )
                                                    }
                                                    className="h-8 rounded-lg bg-slate-900 px-3 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 dark:bg-white dark:text-slate-900"
                                                >
                                                    <Plus className="mr-1 size-3.5" />
                                                    Tambah Fakta
                                                </Button>
                                            )}
                                        </div>
                                    </div>

                                    {matter.chronologies &&
                                    matter.chronologies.length > 0 ? (
                                        <div className="relative space-y-3.5 before:absolute before:top-2.5 before:bottom-2.5 before:left-3.5 before:w-px before:bg-slate-200 dark:before:bg-zinc-800">
                                            {matter.chronologies.map((item) => {
                                                const isCritical =
                                                    item.importance_level ===
                                                    'critical';
                                                const isHigh =
                                                    item.importance_level ===
                                                    'high';

                                                return (
                                                    <div
                                                        key={item.id}
                                                        className="relative flex items-start gap-3 pl-1"
                                                    >
                                                        <div
                                                            className={`relative z-10 flex size-6 shrink-0 items-center justify-center rounded-lg border shadow-2xs ${
                                                                isCritical
                                                                    ? 'border-red-300 bg-red-500 text-white'
                                                                    : isHigh
                                                                      ? 'border-amber-300 bg-amber-500 text-white'
                                                                      : 'border-slate-200 bg-slate-900 text-white dark:border-zinc-700'
                                                            }`}
                                                        >
                                                            <History className="size-3" />
                                                        </div>

                                                        <div className="flex-1 rounded-lg border border-slate-100 bg-slate-50/70 p-3 text-xs dark:border-white/[0.04] dark:bg-[#121418]">
                                                            <div className="flex flex-wrap items-center justify-between gap-2">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="font-mono text-[11px] font-bold text-blue-600 dark:text-blue-400">
                                                                        {formatDate(
                                                                            item.event_date,
                                                                        )}
                                                                    </span>
                                                                    <span
                                                                        className={`py-0.2 rounded px-1.5 text-[9px] font-bold uppercase ${
                                                                            isCritical
                                                                                ? 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300'
                                                                                : isHigh
                                                                                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300'
                                                                                  : 'bg-slate-100 text-slate-700 dark:bg-white/[0.06] dark:text-zinc-300'
                                                                        }`}
                                                                    >
                                                                        {isCritical
                                                                            ? 'Krusial'
                                                                            : isHigh
                                                                              ? 'Tinggi'
                                                                              : 'Faktual'}
                                                                    </span>
                                                                </div>

                                                                {can.update && (
                                                                    <button
                                                                        type="button"
                                                                        disabled={Boolean(
                                                                            matter.legal_hold_at,
                                                                        )}
                                                                        onClick={() => {
                                                                            if (
                                                                                matter.legal_hold_at
                                                                            ) {
                                                                                return;
                                                                            }
                                                                            setChronologyToDelete(
                                                                                item,
                                                                            );
                                                                        }}
                                                                        className="text-slate-400 hover:text-red-600 disabled:cursor-not-allowed disabled:text-amber-500 disabled:opacity-60 dark:hover:text-red-400"
                                                                        title={
                                                                            matter.legal_hold_at
                                                                                ? 'Dikunci karena Legal Hold aktif'
                                                                                : 'Hapus Fakta'
                                                                        }
                                                                    >
                                                                        <Trash2 className="size-3" />
                                                                    </button>
                                                                )}
                                                            </div>

                                                            <h4 className="mt-1 font-semibold text-slate-900 dark:text-white">
                                                                {item.title}
                                                            </h4>

                                                            {item.description && (
                                                                <p className="mt-1 text-[11px] text-slate-600 dark:text-zinc-400">
                                                                    {
                                                                        item.description
                                                                    }
                                                                </p>
                                                            )}

                                                            {(item.evidence_reference ||
                                                                item.witness_name) && (
                                                                <div className="mt-2 flex flex-wrap items-center gap-2 border-t border-slate-200/50 pt-1.5 dark:border-white/[0.04]">
                                                                    {item.evidence_reference && (
                                                                        <span className="py-0.2 inline-flex items-center gap-1 rounded bg-blue-50 px-1.5 text-[9px] font-bold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                                                                            <FileText className="size-2.5" />
                                                                            {
                                                                                item.evidence_reference
                                                                            }
                                                                        </span>
                                                                    )}
                                                                    {item.witness_name && (
                                                                        <span className="py-0.2 inline-flex items-center gap-1 rounded bg-purple-50 px-1.5 text-[9px] font-bold text-purple-700 dark:bg-purple-950/40 dark:text-purple-300">
                                                                            <Users className="size-2.5" />
                                                                            {
                                                                                item.witness_name
                                                                            }
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="flex min-h-[180px] items-center justify-center p-6 text-center">
                                            <EmptyState title="Belum ada kronologi fakta yang dicatat untuk perkara ini" />
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* TAB: BRANKAS ALAT BUKTI FISIK */}
                            {tab === 'BuktiFisik' && (
                                <div className="space-y-4 rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                    <div className="flex flex-col justify-between gap-3 border-b border-slate-100 pb-3.5 sm:flex-row sm:items-center dark:border-white/[0.04]">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <Archive className="size-4 text-slate-700 dark:text-zinc-300" />
                                                <h2 className="text-xs font-bold text-slate-900 dark:text-white">
                                                    Brankas &amp; Posisi Fisik
                                                    Alat Bukti (
                                                    {matter.evidences?.length ??
                                                        0}
                                                    )
                                                </h2>
                                            </div>
                                            <p className="mt-0.5 text-[11px] text-slate-500 dark:text-zinc-400">
                                                Pelacakan dokumen asli, salinan
                                                legalisir, lokasi lemari/bantex,
                                                dan rantai peminjaman sidang /
                                                majelis hakim.
                                            </p>
                                        </div>

                                        {can.update && (
                                            <Button
                                                size="sm"
                                                onClick={() =>
                                                    setOperation('evidence')
                                                }
                                                className="h-8 rounded-lg bg-slate-900 px-3.5 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 active:scale-95 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                                            >
                                                <Plus className="mr-1.5 size-3.5" />
                                                Catat Bukti Fisik
                                            </Button>
                                        )}
                                    </div>

                                    {/* 4 Symmetrical Metric Cards */}
                                    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                                        {/* 1. Total Bukti */}
                                        <div className="group flex min-h-[88px] flex-col justify-between rounded-xl border border-slate-200/80 bg-slate-50/50 p-3 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.08] dark:bg-[#121418] dark:hover:border-white/15">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:text-zinc-400">
                                                    TOTAL BUKTI
                                                </span>
                                                <div className="flex size-6 items-center justify-center rounded-md bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                                                    <Archive className="size-3.5" />
                                                </div>
                                            </div>
                                            <div className="mt-2 flex items-baseline justify-between">
                                                <p className="font-mono text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                                                    {matter.evidences?.length ?? 0}
                                                </p>
                                                <span className="text-[10.5px] font-medium text-slate-400 dark:text-zinc-500">
                                                    berkas
                                                </span>
                                            </div>
                                        </div>

                                        {/* 2. Di Brankas Firma */}
                                        <div className="group flex min-h-[88px] flex-col justify-between rounded-xl border border-slate-200/80 bg-slate-50/50 p-3 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.08] dark:bg-[#121418] dark:hover:border-white/15">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:text-zinc-400">
                                                    DI BRANKAS FIRMA
                                                </span>
                                                <div className="flex size-6 items-center justify-center rounded-md bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                                                    <ShieldCheck className="size-3.5" />
                                                </div>
                                            </div>
                                            <div className="mt-2 flex items-baseline justify-between">
                                                <p className="font-mono text-lg font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                                                    {matter.evidences?.filter(
                                                        (e) =>
                                                            e.status === 'in_vault',
                                                    ).length ?? 0}
                                                </p>
                                                <span className="text-[10.5px] font-medium text-slate-400 dark:text-zinc-500">
                                                    tersimpan
                                                </span>
                                            </div>
                                        </div>

                                        {/* 3. Dokumen Asli */}
                                        <div className="group flex min-h-[88px] flex-col justify-between rounded-xl border border-slate-200/80 bg-slate-50/50 p-3 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.08] dark:bg-[#121418] dark:hover:border-white/15">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:text-zinc-400">
                                                    DOKUMEN ASLI
                                                </span>
                                                <div className="flex size-6 items-center justify-center rounded-md bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                                                    <FileText className="size-3.5" />
                                                </div>
                                            </div>
                                            <div className="mt-2 flex items-baseline justify-between">
                                                <p className="font-mono text-lg font-bold tracking-tight text-indigo-600 dark:text-indigo-400">
                                                    {matter.evidences?.filter(
                                                        (e) =>
                                                            e.originality ===
                                                            'original',
                                                    ).length ?? 0}
                                                </p>
                                                <span className="text-[10.5px] font-medium text-slate-400 dark:text-zinc-500">
                                                    orisinil
                                                </span>
                                            </div>
                                        </div>

                                        {/* 4. Dipinjam / Sidang */}
                                        <div className="group flex min-h-[88px] flex-col justify-between rounded-xl border border-slate-200/80 bg-slate-50/50 p-3 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.08] dark:bg-[#121418] dark:hover:border-white/15">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:text-zinc-400">
                                                    DIPINJAM / SIDANG
                                                </span>
                                                <div className="flex size-6 items-center justify-center rounded-md bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
                                                    <Scale className="size-3.5" />
                                                </div>
                                            </div>
                                            <div className="mt-2 flex items-baseline justify-between">
                                                <p className="font-mono text-lg font-bold tracking-tight text-amber-600 dark:text-amber-400">
                                                    {matter.evidences?.filter(
                                                        (e) =>
                                                            e.status !==
                                                                'in_vault' &&
                                                            e.status !==
                                                                'returned_to_client',
                                                    ).length ?? 0}
                                                </p>
                                                <span className="text-[10.5px] font-medium text-slate-400 dark:text-zinc-500">
                                                    aktif
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {matter.evidences &&
                                    matter.evidences.length > 0 ? (
                                        <div className="space-y-2.5 pt-1">
                                            {matter.evidences.map((ev) => {
                                                const statusInfo =
                                                    evidenceStatusMeta[
                                                        ev.status
                                                    ] ?? {
                                                        label: ev.status,
                                                        color: 'bg-slate-100 text-slate-700 border border-slate-200',
                                                    };
                                                return (
                                                    <div
                                                        key={ev.id}
                                                        className="group rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#16181d] dark:hover:border-white/10"
                                                    >
                                                        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                                                            <div className="min-w-0 flex-1 space-y-1.5">
                                                                <div className="flex flex-wrap items-center gap-1.5">
                                                                    <span className="rounded-md bg-slate-900 px-2 py-0.5 font-mono text-[10px] font-bold text-white shadow-2xs dark:bg-white dark:text-slate-900">
                                                                        {
                                                                            ev.evidence_code
                                                                        }
                                                                    </span>
                                                                    <span className="rounded-md border border-slate-200/70 bg-slate-50 px-2 py-0.5 text-[10px] font-semibold text-slate-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300">
                                                                        {originalityLabels[
                                                                            ev
                                                                                .originality
                                                                        ] ??
                                                                            ev.originality}
                                                                    </span>
                                                                    <span
                                                                        className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${statusInfo.color}`}
                                                                    >
                                                                        {
                                                                            statusInfo.label
                                                                        }
                                                                    </span>
                                                                </div>

                                                                <h4 className="text-xs leading-snug font-bold text-slate-900 dark:text-white">
                                                                    {ev.title}
                                                                </h4>

                                                                {ev.description && (
                                                                    <p className="text-[11px] leading-relaxed text-slate-600 dark:text-zinc-400">
                                                                        {
                                                                            ev.description
                                                                        }
                                                                    </p>
                                                                )}

                                                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-[11px] text-slate-500 dark:text-zinc-400">
                                                                    {ev.vault_location && (
                                                                        <span className="flex items-center gap-1.5 text-slate-700 dark:text-zinc-300">
                                                                            <Box className="size-3.5 text-slate-400" />
                                                                            <span>
                                                                                Lokasi:{' '}
                                                                                <strong>
                                                                                    {
                                                                                        ev.vault_location
                                                                                    }
                                                                                </strong>
                                                                            </span>
                                                                        </span>
                                                                    )}
                                                                    {ev.custodian_name && (
                                                                        <span className="flex items-center gap-1.5 text-slate-700 dark:text-zinc-300">
                                                                            <Users className="size-3.5 text-slate-400" />
                                                                            <span>
                                                                                Pemegang:{' '}
                                                                                <strong>
                                                                                    {
                                                                                        ev.custodian_name
                                                                                    }
                                                                                </strong>
                                                                            </span>
                                                                        </span>
                                                                    )}
                                                                    {ev.custody_notes && (
                                                                        <span className="flex items-center gap-1.5 text-slate-500 italic dark:text-zinc-400">
                                                                            <span>
                                                                                Catatan:{' '}
                                                                                {
                                                                                    ev.custody_notes
                                                                                }
                                                                            </span>
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {can.update && (
                                                                <div className="flex shrink-0 items-center gap-1.5 self-start pt-1 sm:pt-0">
                                                                    <Button
                                                                        type="button"
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() =>
                                                                            setEditingEvidence(
                                                                                ev,
                                                                            )
                                                                        }
                                                                        className="h-7.5 cursor-pointer rounded-lg border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-[#121418] dark:text-zinc-300 dark:hover:bg-zinc-800"
                                                                    >
                                                                        Ubah
                                                                        Status /
                                                                        Lokasi
                                                                    </Button>
                                                                    <Button
                                                                        type="button"
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        disabled={Boolean(
                                                                            matter.legal_hold_at,
                                                                        )}
                                                                        onClick={() => {
                                                                            if (
                                                                                matter.legal_hold_at
                                                                            ) {
                                                                                return;
                                                                            }
                                                                            setEvidenceToDelete(
                                                                                ev,
                                                                            );
                                                                        }}
                                                                        className="size-7.5 p-0 text-slate-400 hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:bg-amber-50 disabled:text-amber-600 disabled:opacity-70 dark:hover:bg-rose-950/30 dark:hover:text-rose-400 dark:disabled:bg-amber-950/30"
                                                                        title={
                                                                            matter.legal_hold_at
                                                                                ? 'Dikunci karena Legal Hold aktif'
                                                                                : 'Hapus Bukti'
                                                                        }
                                                                    >
                                                                        <Trash2 className="size-3.5" />
                                                                    </Button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="flex min-h-[180px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-200/80 p-6 text-center dark:border-white/10">
                                            <Archive className="size-7 text-slate-300 dark:text-zinc-600" />
                                            <p className="mt-2 text-xs font-semibold text-slate-700 dark:text-zinc-300">
                                                Belum ada alat bukti fisik yang
                                                dicatat
                                            </p>
                                            <p className="mt-0.5 text-[11px] text-slate-400">
                                                Gunakan tombol di atas untuk
                                                mendaftarkan dokumen bukti fisik
                                                asli, fotokopi, atau legalisir.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* TAB 4: DOKUMEN */}
                            {tab === 'Dokumen' && (
                                <div className="space-y-4 rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-white/[0.04]">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <FileText className="size-4 text-slate-700 dark:text-zinc-300" />
                                                <h2 className="text-xs font-bold text-slate-900 dark:text-white">
                                                    Berkas &amp; Dokumen Perkara
                                                    ({matter.documents.length})
                                                </h2>
                                            </div>
                                            <p className="mt-0.5 text-[11px] text-slate-500 dark:text-zinc-400">
                                                Arsip surat kuasa, bukti dokumen
                                                perkara, dan draft perjanjian.
                                            </p>
                                        </div>
                                        {can.uploadDocument && (
                                            <Button
                                                size="sm"
                                                className="h-8 rounded-lg bg-slate-900 px-3 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 dark:bg-white dark:text-slate-900"
                                                asChild
                                            >
                                                <Link
                                                    href={documentRoutes.index.url({
                                                        query: {
                                                            upload: 1,
                                                            matter_id:
                                                                matter.id,
                                                        },
                                                    })}
                                                >
                                                    <FileUp className="mr-1 size-3.5" />
                                                    Unggah Dokumen
                                                </Link>
                                            </Button>
                                        )}
                                    </div>

                                    {matter.documents.length ? (
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left text-xs">
                                                <thead>
                                                    <tr className="border-b border-slate-100 bg-slate-50/60 text-[10px] font-semibold text-slate-500 uppercase dark:border-white/[0.04] dark:bg-[#121418]">
                                                        <th className="py-2.5 pr-3 pl-3 font-semibold">
                                                            Nama Dokumen
                                                        </th>
                                                        <th className="px-3 py-2.5 font-semibold">
                                                            Versi
                                                        </th>
                                                        <th className="px-3 py-2.5 font-semibold">
                                                            Ukuran
                                                        </th>
                                                        <th className="px-3 py-2.5 font-semibold">
                                                            Diperbarui
                                                        </th>
                                                        <th className="px-3 py-2.5 font-semibold">
                                                            Status
                                                        </th>
                                                        <th className="py-2.5 pr-3 pl-3 text-right font-semibold">
                                                            Aksi
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                                                    {matter.documents.map(
                                                        (doc) => (
                                                            <tr
                                                                key={doc.id}
                                                                className="group transition-colors hover:bg-slate-50/50 dark:hover:bg-white/[0.02]"
                                                            >
                                                                <td className="py-2.5 pr-3 pl-3">
                                                                    <div className="flex items-center gap-2">
                                                                        <FileText className="size-4 shrink-0 text-blue-600 dark:text-blue-400" />
                                                                        <div className="min-w-0">
                                                                            <p className="truncate font-semibold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                                                                                {
                                                                                    doc.title
                                                                                }
                                                                            </p>
                                                                            <p className="text-[10px] text-slate-400">
                                                                                {doc
                                                                                    .current_version
                                                                                    ?.mime_type ??
                                                                                    'Dokumen Hukum'}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="px-3 py-2.5 whitespace-nowrap">
                                                                    <span className="font-mono text-[10px] font-semibold text-slate-600 dark:text-zinc-400">
                                                                        v
                                                                        {doc
                                                                            .current_version
                                                                            ?.version_number ??
                                                                            1}
                                                                        .0
                                                                    </span>
                                                                </td>
                                                                <td className="px-3 py-2.5 font-mono text-[11px] whitespace-nowrap text-slate-500 dark:text-zinc-400">
                                                                    {formatBytes(
                                                                        doc
                                                                            .current_version
                                                                            ?.file_size,
                                                                    )}
                                                                </td>
                                                                <td className="px-3 py-2.5 font-mono text-[11px] whitespace-nowrap text-slate-500 dark:text-zinc-400">
                                                                    {formatDate(
                                                                        doc.updated_at,
                                                                    )}
                                                                </td>
                                                                <td className="px-3 py-2.5 whitespace-nowrap">
                                                                    <StatusBadge
                                                                        value={
                                                                            doc.status
                                                                        }
                                                                    />
                                                                </td>
                                                                <td className="py-2.5 pr-3 pl-3 text-right whitespace-nowrap">
                                                                    <div className="flex items-center justify-end gap-1">
                                                                        <Button
                                                                            type="button"
                                                                            variant="outline"
                                                                            size="sm"
                                                                            onClick={() =>
                                                                                setPreviewDoc(
                                                                                    doc,
                                                                                )
                                                                            }
                                                                            className="h-7 cursor-pointer rounded-md border-slate-200 bg-white px-2 text-xs font-semibold text-blue-600 hover:bg-blue-50 dark:border-white/10 dark:bg-[#1c1f24] dark:text-blue-400"
                                                                        >
                                                                            <Eye className="mr-1 size-3" />
                                                                            Pratinjau
                                                                        </Button>
                                                                        <Button
                                                                            size="sm"
                                                                            variant="ghost"
                                                                            className="h-7 rounded-md px-1.5 text-xs text-slate-700 hover:bg-slate-100 dark:text-zinc-300 dark:hover:bg-white/[0.06]"
                                                                            asChild
                                                                        >
                                                                            <Link
                                                                                href={documentRoutes.show.url(
                                                                                    doc.id,
                                                                                )}
                                                                            >
                                                                                <ChevronRight className="size-3.5" />
                                                                            </Link>
                                                                        </Button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ),
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="flex min-h-[180px] items-center justify-center p-6 text-center">
                                            <EmptyState title="Belum ada dokumen terunggah" />
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* TAB 5: CATATAN */}
                            {tab === 'Catatan' && (
                                <div className="space-y-4 rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-white/[0.04]">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <FileText className="size-4 text-slate-700 dark:text-zinc-300" />
                                                <h2 className="text-xs font-bold text-slate-900 dark:text-white">
                                                    Catatan Internal (
                                                    {matter.notes.length})
                                                </h2>
                                            </div>
                                            <p className="mt-0.5 text-[11px] text-slate-500 dark:text-zinc-400">
                                                Memorandum rahasia, arahan
                                                partner, dan catatan strategi
                                                perkara.
                                            </p>
                                        </div>
                                        {can.update && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() =>
                                                    setOperation('note')
                                                }
                                                className="h-8 rounded-lg border-slate-200/80 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-zinc-200"
                                            >
                                                <Plus className="mr-1 size-3.5 text-slate-400" />
                                                Tambah Catatan
                                            </Button>
                                        )}
                                    </div>

                                    {matter.notes.length ? (
                                        <div className="grid gap-3 sm:grid-cols-2">
                                            {matter.notes.map((note) => (
                                                <div
                                                    key={note.id}
                                                    className="flex flex-col justify-between rounded-lg border border-slate-100 bg-slate-50/70 p-3 text-xs transition-colors hover:bg-slate-50 dark:border-white/[0.04] dark:bg-[#121418]"
                                                >
                                                    <div>
                                                        <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-1.5 dark:border-white/[0.04]">
                                                            <h4 className="font-semibold text-slate-900 dark:text-white">
                                                                {note.title ||
                                                                    'Catatan Internal'}
                                                            </h4>
                                                            <div className="flex items-center gap-1.5">
                                                                <StatusBadge
                                                                    value={
                                                                        note.classification
                                                                    }
                                                                />
                                                                {can.update && (
                                                                    <button
                                                                        type="button"
                                                                        disabled={Boolean(
                                                                            matter.legal_hold_at,
                                                                        )}
                                                                        onClick={() => {
                                                                            if (
                                                                                matter.legal_hold_at
                                                                            )
                                                                                return;
                                                                            setNoteToDelete(
                                                                                note,
                                                                            );
                                                                        }}
                                                                        className="text-slate-400 hover:text-rose-600 disabled:cursor-not-allowed disabled:text-amber-500 disabled:opacity-60 dark:hover:text-rose-400"
                                                                        title={
                                                                            matter.legal_hold_at
                                                                                ? 'Dikunci karena Legal Hold aktif'
                                                                                : 'Hapus Catatan'
                                                                        }
                                                                    >
                                                                        <Trash2 className="size-3" />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <p className="mt-2 leading-relaxed whitespace-pre-wrap text-slate-700 dark:text-zinc-300">
                                                            {note.body}
                                                        </p>
                                                    </div>
                                                    <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-1.5 font-mono text-[10px] text-slate-400 dark:border-white/[0.04] dark:text-zinc-500">
                                                        <span>
                                                            {formatDate(
                                                                note.created_at,
                                                                true,
                                                            )}
                                                        </span>
                                                        {note.classification !==
                                                            'internal' && (
                                                            <span className="flex items-center gap-1 font-sans font-bold text-amber-600 dark:text-amber-400">
                                                                <Lock className="size-2.5" />
                                                                Privat
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex min-h-[180px] items-center justify-center p-6 text-center">
                                            <EmptyState title="Belum ada catatan internal tersimpan" />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Right Sticky Cockpit Inspector (4 Cols) */}
                        <div className="space-y-3.5 lg:col-span-4">
                            {/* Client Profile Card */}
                            <div className="rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                <div className="mb-2 flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-zinc-400">
                                        <Building2 className="size-3.5 text-slate-400" />
                                        <span className="text-[11px] font-semibold uppercase">
                                            Profil Klien
                                        </span>
                                    </div>
                                    <Link
                                        href={clientRoutes.show.url(
                                            matter.client.id,
                                        )}
                                        className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
                                    >
                                        Detail Klien →
                                    </Link>
                                </div>

                                <div className="flex items-center gap-2.5 rounded-lg bg-slate-50 p-2.5 dark:bg-[#121418]">
                                    {matter.client.type === 'individual' ||
                                    matter.client.type === 'person' ? (
                                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-emerald-200/60 bg-emerald-50 text-emerald-700 shadow-2xs dark:border-emerald-900/40 dark:bg-emerald-950/60 dark:text-emerald-300">
                                            <User className="size-4" />
                                        </div>
                                    ) : (
                                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-blue-200/60 bg-blue-50 text-blue-700 shadow-2xs dark:border-blue-900/40 dark:bg-blue-950/60 dark:text-blue-300">
                                            <Building2 className="size-4" />
                                        </div>
                                    )}
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-1.5">
                                            <h3 className="truncate text-xs font-semibold text-slate-900 dark:text-white">
                                                {matter.client.display_name}
                                            </h3>
                                            <span
                                                className={`py-0.2 shrink-0 rounded px-1.5 text-[8.5px] font-bold ${
                                                    matter.client.type ===
                                                        'individual' ||
                                                    matter.client.type ===
                                                        'person'
                                                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                                                        : 'bg-slate-200/70 text-slate-700 dark:bg-white/[0.08] dark:text-zinc-300'
                                                }`}
                                            >
                                                {matter.client.type ===
                                                    'individual' ||
                                                matter.client.type === 'person'
                                                    ? 'Individu'
                                                    : 'Badan Hukum'}
                                            </span>
                                        </div>
                                        <p className="font-mono text-[10px] text-slate-400">
                                            {matter.client.client_number}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Parameter & Metadata Cockpit */}
                            <div className="rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                <div className="mb-2.5 flex items-center gap-1.5 text-slate-500 dark:text-zinc-400">
                                    <Scale className="size-3.5 text-slate-400" />
                                    <span className="text-[11px] font-semibold uppercase">
                                        Parameter Perkara
                                    </span>
                                </div>
                                <div className="space-y-2 text-xs">
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-500 dark:text-zinc-400">
                                            Yurisdiksi
                                        </span>
                                        <span className="font-semibold text-slate-900 dark:text-white">
                                            {matter.jurisdiction ?? 'Indonesia'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-500 dark:text-zinc-400">
                                            Pengadilan
                                        </span>
                                        <span className="font-semibold text-slate-900 dark:text-white">
                                            {matter.court ?? 'Non-litigasi'}
                                        </span>
                                    </div>
                                    {matter.external_case_number && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-500 dark:text-zinc-400">
                                                No. Eksternal
                                            </span>
                                            <span className="font-mono font-semibold text-slate-900 dark:text-white">
                                                {matter.external_case_number}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-500 dark:text-zinc-400">
                                            Kerahasiaan
                                        </span>
                                        <span className="font-semibold text-slate-900 capitalize dark:text-white">
                                            {matter.confidentiality_level}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-500 dark:text-zinc-400">
                                            Status
                                        </span>
                                        <StatusBadge value={matter.status} />
                                    </div>
                                </div>
                            </div>

                            {/* Progres & Kesehatan Perkara */}
                            <div className="rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                <div className="mb-2 flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-zinc-400">
                                        <TrendingUp className="size-3.5 text-slate-400" />
                                        <span className="text-[11px] font-semibold uppercase">
                                            Progres Tugas
                                        </span>
                                    </div>
                                    <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                                        {taskProgressPercent}% Selesai
                                    </span>
                                </div>

                                <div className="space-y-1.5">
                                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-zinc-800">
                                        <div
                                            className="h-full rounded-full bg-emerald-500 transition-all"
                                            style={{
                                                width: `${taskProgressPercent}%`,
                                            }}
                                        />
                                    </div>
                                    <p className="text-[10px] text-slate-500 dark:text-zinc-400">
                                        {completedTasksCount} dari{' '}
                                        {matter.tasks.length} tugas telah
                                        diselesaikan.
                                    </p>
                                </div>
                            </div>

                            {/* Lampiran Dokumen Terkini */}
                            <div className="rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                <div className="mb-2 flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-zinc-400">
                                        <FileText className="size-3.5 text-slate-400" />
                                        <span className="text-[11px] font-semibold uppercase">
                                            Lampiran Terkini (
                                            {matter.documents.length})
                                        </span>
                                    </div>
                                    {matter.documents.length > 0 && (
                                        <button
                                            onClick={() => setTab('Dokumen')}
                                            className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
                                        >
                                            Semua
                                        </button>
                                    )}
                                </div>

                                {matter.documents.length > 0 ? (
                                    <div className="space-y-1.5">
                                        {matter.documents
                                            .slice(0, 3)
                                            .map((doc) => (
                                                <Link
                                                    key={doc.id}
                                                    href={documentRoutes.show.url(
                                                        doc.id,
                                                    )}
                                                    className="group flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/70 p-2 transition-all hover:bg-white dark:border-white/[0.04] dark:bg-[#121418] dark:hover:bg-white/[0.04]"
                                                >
                                                    <div className="flex min-w-0 items-center gap-1.5">
                                                        <FileText className="size-3.5 shrink-0 text-blue-600 dark:text-blue-400" />
                                                        <span className="truncate text-xs font-medium text-slate-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                                                            {doc.title}
                                                        </span>
                                                    </div>
                                                    <span className="shrink-0 font-mono text-[10px] text-slate-400">
                                                        {formatBytes(
                                                            doc.current_version
                                                                ?.file_size,
                                                        )}
                                                    </span>
                                                </Link>
                                            ))}
                                    </div>
                                ) : (
                                    <p className="text-xs text-slate-400 italic">
                                        Belum ada lampiran berkas.
                                    </p>
                                )}
                            </div>
                        </div>
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

            {/* Evidence Update Modal */}
            {editingEvidence && (
                <UpdateEvidenceDialog
                    matterId={matter.id}
                    evidence={editingEvidence}
                    onClose={() => setEditingEvidence(null)}
                />
            )}

            {/* Instant Document & PDF Modal Previewer */}
            <DocumentPreviewModal
                isOpen={!!previewDoc}
                onClose={() => setPreviewDoc(null)}
                document={previewDoc}
            />

            {/* Delete Chronology Confirmation Dialog */}
            <ConfirmDialog
                open={!!chronologyToDelete}
                onOpenChange={(open) => !open && setChronologyToDelete(null)}
                title="Hapus Kronologi Fakta"
                description={
                    chronologyToDelete
                        ? `Apakah Anda yakin ingin menghapus catatan peristiwa "${chronologyToDelete.title}"? Tindakan ini akan dicatat dalam riwayat audit.`
                        : ''
                }
                confirmLabel="Hapus Fakta"
                variant="danger"
                processing={isDeleting}
                onConfirm={() => {
                    if (!chronologyToDelete) return;
                    setIsDeleting(true);
                    router.delete(
                        chronologyRoutes.destroy.url({
                            matter: matter.id,
                            chronology: chronologyToDelete.id,
                        }),
                        {
                            onFinish: () => {
                                setIsDeleting(false);
                                setChronologyToDelete(null);
                            },
                        },
                    );
                }}
            />

            {/* Delete Evidence Confirmation Dialog */}
            <ConfirmDialog
                open={!!evidenceToDelete}
                onOpenChange={(open) => !open && setEvidenceToDelete(null)}
                title="Hapus Pencatatan Alat Bukti"
                description={
                    evidenceToDelete
                        ? `Apakah Anda yakin ingin menghapus alat bukti "${evidenceToDelete.evidence_code} - ${evidenceToDelete.title}"? Tindakan ini akan dicatat dalam riwayat audit.`
                        : ''
                }
                confirmLabel="Hapus Bukti"
                variant="danger"
                processing={isDeleting}
                onConfirm={() => {
                    if (!evidenceToDelete) return;
                    setIsDeleting(true);
                    router.delete(
                        `/matters/${matter.id}/evidences/${evidenceToDelete.id}`,
                        {
                            onFinish: () => {
                                setIsDeleting(false);
                                setEvidenceToDelete(null);
                            },
                        },
                    );
                }}
            />

            {/* Delete Party Confirmation Dialog */}
            <ConfirmDialog
                open={!!partyToDelete}
                onOpenChange={(open) => !open && setPartyToDelete(null)}
                title="Hapus Pihak Terkait"
                description={
                    partyToDelete
                        ? `Apakah Anda yakin ingin menghapus pihak "${partyToDelete.name}" dari berkas perkara ini?`
                        : ''
                }
                confirmLabel="Hapus Pihak"
                variant="danger"
                processing={isDeleting}
                onConfirm={() => {
                    if (!partyToDelete) return;
                    setIsDeleting(true);
                    router.delete(
                        partyRoutes.destroy.url({
                            matter: matter.id,
                            party: partyToDelete.id,
                        }),
                        {
                            onFinish: () => {
                                setIsDeleting(false);
                                setPartyToDelete(null);
                            },
                        },
                    );
                }}
            />

            {/* Delete Event Confirmation Dialog */}
            <ConfirmDialog
                open={!!eventToDelete}
                onOpenChange={(open) => !open && setEventToDelete(null)}
                title="Hapus Agenda / Sidang"
                description={
                    eventToDelete
                        ? `Apakah Anda yakin ingin menghapus agenda "${eventToDelete.title}"?`
                        : ''
                }
                confirmLabel="Hapus Agenda"
                variant="danger"
                processing={isDeleting}
                onConfirm={() => {
                    if (!eventToDelete) return;
                    setIsDeleting(true);
                    router.delete(
                        eventRoutes.destroy.url({
                            matter: matter.id,
                            event: eventToDelete.id,
                        }),
                        {
                            onFinish: () => {
                                setIsDeleting(false);
                                setEventToDelete(null);
                            },
                        },
                    );
                }}
            />

            {/* Delete Note Confirmation Dialog */}
            <ConfirmDialog
                open={!!noteToDelete}
                onOpenChange={(open) => !open && setNoteToDelete(null)}
                title="Hapus Catatan Internal"
                description={
                    noteToDelete
                        ? `Apakah Anda yakin ingin menghapus catatan internal "${noteToDelete.title || 'Catatan Internal'}"?`
                        : ''
                }
                confirmLabel="Hapus Catatan"
                variant="danger"
                processing={isDeleting}
                onConfirm={() => {
                    if (!noteToDelete) return;
                    setIsDeleting(true);
                    router.delete(
                        noteRoutes.destroy.url({
                            matter: matter.id,
                            note: noteToDelete.id,
                        }),
                        {
                            onFinish: () => {
                                setIsDeleting(false);
                                setNoteToDelete(null);
                            },
                        },
                    );
                }}
            />

            {/* Record Hearing Outcome Dialog */}
            {recordingOutcomeEvent && (
                <RecordHearingOutcomeModal
                    matterId={matter.id}
                    event={recordingOutcomeEvent}
                    firmStaff={firmStaff}
                    onClose={() => setRecordingOutcomeEvent(null)}
                />
            )}

            {/* Edit Event & Notes Dialog */}
            {editingEvent && (
                <EditEventDialog
                    matterId={matter.id}
                    event={editingEvent}
                    onClose={() => setEditingEvent(null)}
                />
            )}
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
    operation:
        | 'party'
        | 'deadline'
        | 'event'
        | 'note'
        | 'chronology'
        | 'evidence'
        | null;
    onSelect: (
        operation:
            'party' | 'deadline' | 'event' | 'note' | 'chronology' | 'evidence',
    ) => void;
    onClose: () => void;
}) {
    const route =
        operation === 'party'
            ? partyRoutes.store
            : operation === 'deadline'
              ? deadlineRoutes.store
              : operation === 'event'
                ? eventRoutes.store
                : operation === 'chronology'
                  ? chronologyRoutes.store
                  : operation === 'evidence'
                    ? {
                          form: (id: string) => ({
                              action: `/matters/${id}/evidences`,
                              method: 'post' as const,
                          }),
                      }
                    : noteRoutes.store;

    const opConfig = {
        party: {
            title: 'Tambah Pihak Terkait',
            desc: 'Tambahkan pihak lawan, saksi, ahli, atau pihak terafiliasi perkara.',
            icon: Users,
            color: 'text-blue-600 bg-blue-50 dark:text-sky-300 dark:bg-blue-950/40',
        },
        evidence: {
            title: 'Catat Alat Bukti Fisik',
            desc: 'Daftarkan alat bukti surat/asli, lokasi brankas/bantex, dan status peminjaman.',
            icon: Archive,
            color: 'text-slate-800 bg-slate-100 dark:text-zinc-200 dark:bg-white/10',
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
        chronology: {
            title: 'Tambah Fakta Kronologi',
            desc: 'Catat peristiwa hukum faktual, referensi bukti surat, dan saksi perkara.',
            icon: History,
            color: 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/40',
        },
        note: {
            title: 'Tambah Catatan Internal',
            desc: 'Simpan resume perkara, arahan partner, atau catatan strategi.',
            icon: MessageSquare,
            color: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/40',
        },
    };

    const currentConfig = operation ? opConfig[operation] : opConfig.party;
    const IconComp = currentConfig.icon;

    return (
        <Dialog
            open={operation !== null}
            onOpenChange={(open) => !open && onClose()}
        >
            <DialogContent className="max-h-[85vh] overflow-y-auto rounded-xl border border-slate-200/80 bg-white p-4 shadow-xl sm:max-w-lg dark:border-white/10 dark:bg-[#16181d]">
                <DialogHeader className="border-b border-slate-100 pb-2.5 dark:border-white/[0.04]">
                    <div className="flex items-center gap-2.5">
                        <div
                            className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${currentConfig.color}`}
                        >
                            <IconComp className="size-4" />
                        </div>
                        <div>
                            <DialogTitle className="text-sm font-bold text-slate-900 dark:text-white">
                                {currentConfig.title}
                            </DialogTitle>
                            <DialogDescription className="text-xs text-slate-500 dark:text-zinc-400">
                                {currentConfig.desc}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {/* Operation Pill Switcher */}
                <div className="flex rounded-lg bg-slate-100 p-0.5 dark:bg-white/[0.04]">
                    {(
                        [
                            'party',
                            'evidence',
                            'deadline',
                            'event',
                            'chronology',
                            'note',
                        ] as const
                    ).map((opKey) => {
                        const isSelected = operation === opKey;
                        const labels = {
                            party: 'Pihak',
                            evidence: 'Bukti Fisik',
                            deadline: 'Tenggat',
                            event: 'Agenda',
                            chronology: 'Fakta',
                            note: 'Catatan',
                        };
                        return (
                            <button
                                key={opKey}
                                type="button"
                                onClick={() => onSelect(opKey)}
                                className={`flex-1 rounded-md py-1 text-center text-xs font-semibold transition-all ${
                                    isSelected
                                        ? 'bg-white text-slate-900 shadow-2xs dark:bg-zinc-800 dark:text-white'
                                        : 'text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white'
                                }`}
                            >
                                {labels[opKey]}
                            </button>
                        );
                    })}
                </div>

                {operation && (
                    <Form
                        {...route.form(matterId)}
                        className="space-y-3 pt-1"
                        onSuccess={onClose}
                    >
                        {({ processing, errors }) => (
                            <>
                                {operation === 'party' && (
                                    <PartyOperationFields matterId={matterId} />
                                )}

                                {operation === 'evidence' && (
                                    <>
                                        <div className="grid gap-2 sm:grid-cols-2">
                                            <Field
                                                name="evidence_code"
                                                label="Kode Bukti (e.g. P-1 / T-1)"
                                                required
                                                placeholder="Contoh: Bukti P-1"
                                            />
                                            <div className="grid gap-1">
                                                <Label
                                                    htmlFor="originality"
                                                    className="text-xs font-semibold text-slate-700 dark:text-zinc-300"
                                                >
                                                    Sifat / Keaslian Dokumen
                                                </Label>
                                                <div className="relative">
                                                    <select
                                                        name="originality"
                                                        id="originality"
                                                        defaultValue="original"
                                                        className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-slate-50/70 pr-7 pl-2.5 text-xs font-medium text-slate-900 outline-hidden hover:bg-slate-100 focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-zinc-200"
                                                    >
                                                        <option value="original">
                                                            Asli (Original)
                                                        </option>
                                                        <option value="legalized_copy">
                                                            Salinan Legalisir
                                                        </option>
                                                        <option value="photocopy">
                                                            Fotokopi
                                                        </option>
                                                        <option value="digital">
                                                            Bukti Elektronik /
                                                            Digital
                                                        </option>
                                                    </select>
                                                    <ChevronDown className="pointer-events-none absolute top-1/2 right-2 size-3 -translate-y-1/2 text-slate-400" />
                                                </div>
                                            </div>
                                        </div>

                                        <Field
                                            name="title"
                                            label="Nama / Judul Alat Bukti"
                                            required
                                            placeholder="Contoh: Asli Perjanjian Kerjasama Pengadaan No. 042/PKS/2025"
                                        />

                                        <div className="grid gap-2 sm:grid-cols-2">
                                            <Field
                                                name="vault_location"
                                                label="Lokasi Penyimpanan Fisik (Brankas/Lemari)"
                                                placeholder="Contoh: Brankas Litigasi Lt.2 / Bantex 04"
                                            />
                                            <div className="grid gap-1">
                                                <Label
                                                    htmlFor="status"
                                                    className="text-xs font-semibold text-slate-700 dark:text-zinc-300"
                                                >
                                                    Status Fisik Dokumen
                                                </Label>
                                                <div className="relative">
                                                    <select
                                                        name="status"
                                                        id="status"
                                                        defaultValue="in_vault"
                                                        className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-slate-50/70 pr-7 pl-2.5 text-xs font-medium text-slate-900 outline-hidden hover:bg-slate-100 focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-zinc-200"
                                                    >
                                                        <option value="in_vault">
                                                            Di Brankas Firma
                                                        </option>
                                                        <option value="borrowed_for_hearing">
                                                            Dipinjam Advokat
                                                            Sidang
                                                        </option>
                                                        <option value="submitted_to_court">
                                                            Diserahkan ke
                                                            Majelis Hakim
                                                        </option>
                                                        <option value="returned_to_client">
                                                            Dikembalikan ke
                                                            Klien
                                                        </option>
                                                    </select>
                                                    <ChevronDown className="pointer-events-none absolute top-1/2 right-2 size-3 -translate-y-1/2 text-slate-400" />
                                                </div>
                                            </div>
                                        </div>

                                        <Field
                                            name="custodian_name"
                                            label="Penanggung Jawab / Advokat Pemegang"
                                            placeholder="Contoh: Adv. Roni, S.H. (Lead Counsel)"
                                        />

                                        <div className="grid gap-1">
                                            <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                                                Uraian Isi / Pokok Pembuktian
                                            </Label>
                                            <textarea
                                                name="description"
                                                rows={2}
                                                className="rounded-lg border border-slate-200 bg-slate-50/70 p-2 text-xs leading-relaxed text-slate-900 outline-hidden focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
                                                placeholder="Membuktikan adanya kesepakatan klausula pembayaran pada Pasal 4..."
                                            />
                                        </div>

                                        <div className="grid gap-1">
                                            <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                                                Catatan Rantai Bukti (Chain of
                                                Custody)
                                            </Label>
                                            <textarea
                                                name="custody_notes"
                                                rows={1}
                                                className="rounded-lg border border-slate-200 bg-slate-50/70 p-2 text-xs leading-relaxed text-slate-900 outline-hidden focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
                                                placeholder="Diserahkan oleh Direktur Keuangan klien pada 12 Agustus 2026..."
                                            />
                                        </div>
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
                                        <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/70 p-2.5 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:bg-[#121418] dark:text-zinc-200">
                                            <input
                                                name="is_critical"
                                                type="checkbox"
                                                value="1"
                                                className="size-3.5 rounded border-zinc-300 text-blue-600"
                                            />
                                            <span>
                                                Tandai sebagai tenggat waktu
                                                kritis / berisiko tinggi
                                            </span>
                                        </label>
                                    </>
                                )}

                                {operation === 'chronology' && (
                                    <>
                                        <Field
                                            name="event_date"
                                            label="Tanggal Peristiwa / Fakta Hukum"
                                            type="date"
                                            required
                                        />
                                        <Field
                                            name="title"
                                            label="Judul Peristiwa / Kejadian Hukum"
                                            required
                                            placeholder="Contoh: Penandatanganan Perjanjian & Pembayaran Termin 1"
                                        />
                                        <div className="grid gap-1">
                                            <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                                                Uraian Fakta Kejadian
                                            </Label>
                                            <textarea
                                                name="description"
                                                rows={2}
                                                className="rounded-lg border border-slate-200 bg-slate-50/70 p-2 text-xs leading-relaxed text-slate-900 outline-hidden focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
                                                placeholder="Rincian kronologi, fakta peristiwa..."
                                            />
                                        </div>
                                        <div className="grid gap-2 sm:grid-cols-2">
                                            <Field
                                                name="evidence_reference"
                                                label="Alat Bukti Surat Terkait"
                                                placeholder="Contoh: Bukti P-1 / Email Notifikasi"
                                            />
                                            <Field
                                                name="witness_name"
                                                label="Saksi Fakta / Saksi Ahli"
                                                placeholder="Contoh: Ir. Budi Santoso"
                                            />
                                        </div>
                                        <div className="grid gap-1">
                                            <Label
                                                htmlFor="importance_level"
                                                className="text-xs font-semibold text-slate-700 dark:text-zinc-300"
                                            >
                                                Tingkat Urgensi Pembuktian
                                            </Label>
                                            <div className="relative">
                                                <select
                                                    name="importance_level"
                                                    id="importance_level"
                                                    defaultValue="normal"
                                                    className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-slate-50/70 pr-7 pl-2.5 text-xs font-medium text-slate-900 outline-hidden hover:bg-slate-100 focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-zinc-200"
                                                >
                                                    <option value="normal">
                                                        Faktual / Standar
                                                    </option>
                                                    <option value="high">
                                                        Tinggi (High Priority)
                                                    </option>
                                                    <option value="critical">
                                                        Krusial / Fakta Utama
                                                        (Critical)
                                                    </option>
                                                </select>
                                                <ChevronDown className="pointer-events-none absolute top-1/2 right-2 size-3 -translate-y-1/2 text-slate-400" />
                                            </div>
                                        </div>
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
                                        <div className="grid gap-1">
                                            <Label
                                                htmlFor="event_type"
                                                className="text-xs font-semibold text-slate-700 dark:text-zinc-300"
                                            >
                                                Jenis Agenda
                                            </Label>
                                            <div className="relative">
                                                <select
                                                    name="event_type"
                                                    id="event_type"
                                                    defaultValue="court"
                                                    className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-slate-50/70 pr-7 pl-2.5 text-xs font-medium text-slate-900 outline-hidden hover:bg-slate-100 focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-zinc-200"
                                                >
                                                    <option value="court">
                                                        Sidang Pengadilan
                                                    </option>
                                                    <option value="meeting">
                                                        Pertemuan Klien /
                                                        Negosiasi
                                                    </option>
                                                    <option value="hearing">
                                                        Pemeriksaan / Mediasi
                                                    </option>
                                                    <option value="internal">
                                                        Rapat Internal Tim
                                                    </option>
                                                </select>
                                                <ChevronDown className="pointer-events-none absolute top-1/2 right-2 size-3 -translate-y-1/2 text-slate-400" />
                                            </div>
                                        </div>
                                        <div className="grid gap-2 sm:grid-cols-2">
                                            <Field
                                                name="starts_at"
                                                label="Waktu Mulai"
                                                type="datetime-local"
                                                required
                                            />
                                            <Field
                                                name="ends_at"
                                                label="Waktu Selesai"
                                                type="datetime-local"
                                            />
                                        </div>
                                        <Field
                                            name="location"
                                            label="Lokasi / Ruang Sidang"
                                            placeholder="Contoh: Ruang Sidang Utama PN Bandung"
                                        />
                                        <div className="grid gap-1">
                                            <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                                                Catatan / Rincian Agenda (Opsional)
                                            </Label>
                                            <textarea
                                                name="description"
                                                rows={3}
                                                className="rounded-lg border border-slate-200 bg-slate-50/70 p-2 text-xs leading-relaxed text-slate-900 outline-hidden focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
                                                placeholder="Tuliskan catatan, persiapan sidang, agenda pembahasan, atau instruksi..."
                                            />
                                        </div>
                                    </>
                                )}

                                {operation === 'note' && (
                                    <>
                                        <Field
                                            name="title"
                                            label="Judul Catatan (Opsional)"
                                            placeholder="Contoh: Analisis Eksepsi Pihak Lawan"
                                        />
                                        <div className="grid gap-1">
                                            <Label
                                                htmlFor="note-body"
                                                className="text-xs font-semibold text-slate-700 dark:text-zinc-300"
                                            >
                                                Isi Catatan Hukum
                                            </Label>
                                            <textarea
                                                className="min-h-20 rounded-lg border border-slate-200 bg-slate-50/70 p-2 text-xs leading-relaxed text-slate-900 outline-hidden focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
                                                id="note-body"
                                                name="body"
                                                required
                                                placeholder="Tuliskan ringkasan perkara, poin negosiasi..."
                                            />
                                        </div>
                                        <div className="grid gap-1">
                                            <Label
                                                htmlFor="classification"
                                                className="text-xs font-semibold text-slate-700 dark:text-zinc-300"
                                            >
                                                Klasifikasi Hak Akses
                                            </Label>
                                            <div className="relative">
                                                <select
                                                    className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-slate-50/70 pr-7 pl-2.5 text-xs font-medium text-slate-900 outline-hidden hover:bg-slate-100 focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-zinc-200"
                                                    name="classification"
                                                    id="classification"
                                                    defaultValue="internal"
                                                >
                                                    <option value="internal">
                                                        Internal (Tim perkara)
                                                    </option>
                                                    <option value="privileged">
                                                        Advocate-Client
                                                        Privileged
                                                    </option>
                                                    <option value="confidential">
                                                        Confidential (Sangat
                                                        Rahasia)
                                                    </option>
                                                </select>
                                                <ChevronDown className="pointer-events-none absolute top-1/2 right-2 size-3 -translate-y-1/2 text-slate-400" />
                                            </div>
                                        </div>
                                    </>
                                )}

                                {Object.keys(errors).length > 0 && (
                                    <p className="text-xs font-medium text-rose-600">
                                        {Object.values(errors).join(' ')}
                                    </p>
                                )}

                                <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-2.5 dark:border-white/[0.04]">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={onClose}
                                        className="h-8 rounded-lg border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-[#16181d] dark:text-zinc-300"
                                    >
                                        Batal
                                    </Button>
                                    <Button
                                        size="sm"
                                        disabled={processing}
                                        className="h-8 rounded-lg bg-slate-900 px-4 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 active:scale-95 dark:bg-white dark:text-slate-900"
                                    >
                                        {processing ? (
                                            <>
                                                <Spinner className="mr-1.5 size-3" />
                                                Menyimpan...
                                            </>
                                        ) : (
                                            'Simpan'
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

function UpdateEvidenceDialog({
    matterId,
    evidence,
    onClose,
}: {
    matterId: string;
    evidence: MatterEvidence;
    onClose: () => void;
}) {
    return (
        <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-h-[85vh] overflow-y-auto rounded-xl border border-slate-200/80 bg-white p-4 shadow-xl sm:max-w-lg dark:border-white/10 dark:bg-[#16181d]">
                <DialogHeader className="border-b border-slate-100 pb-2.5 dark:border-white/[0.04]">
                    <div className="flex items-center gap-2.5">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-800 dark:bg-white/10 dark:text-zinc-200">
                            <Archive className="size-4" />
                        </div>
                        <div>
                            <DialogTitle className="text-sm font-bold text-slate-900 dark:text-white">
                                Perbarui Posisi &amp; Status Alat Bukti
                            </DialogTitle>
                            <DialogDescription className="text-xs text-slate-500 dark:text-zinc-400">
                                {evidence.evidence_code} — {evidence.title}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <Form
                    action={`/matters/${matterId}/evidences/${evidence.id}`}
                    method="put"
                    className="space-y-3 pt-1"
                    onSuccess={onClose}
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2 sm:grid-cols-2">
                                <Field
                                    name="evidence_code"
                                    label="Kode Bukti"
                                    defaultValue={evidence.evidence_code}
                                    required
                                />
                                <div className="grid gap-1">
                                    <Label
                                        htmlFor="originality"
                                        className="text-xs font-semibold text-slate-700 dark:text-zinc-300"
                                    >
                                        Sifat / Keaslian Dokumen
                                    </Label>
                                    <div className="relative">
                                        <select
                                            name="originality"
                                            id="originality"
                                            defaultValue={evidence.originality}
                                            className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-slate-50/70 pr-7 pl-2.5 text-xs font-medium text-slate-900 outline-hidden hover:bg-slate-100 focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-zinc-200"
                                        >
                                            <option value="original">
                                                Asli (Original)
                                            </option>
                                            <option value="legalized_copy">
                                                Salinan Legalisir
                                            </option>
                                            <option value="photocopy">
                                                Fotokopi
                                            </option>
                                            <option value="digital">
                                                Bukti Elektronik / Digital
                                            </option>
                                        </select>
                                        <ChevronDown className="pointer-events-none absolute top-1/2 right-2 size-3 -translate-y-1/2 text-slate-400" />
                                    </div>
                                </div>
                            </div>

                            <Field
                                name="title"
                                label="Nama / Judul Alat Bukti"
                                defaultValue={evidence.title}
                                required
                            />

                            <div className="grid gap-2 sm:grid-cols-2">
                                <Field
                                    name="vault_location"
                                    label="Lokasi Fisik (Brankas/Lemari)"
                                    defaultValue={evidence.vault_location ?? ''}
                                    placeholder="Contoh: Brankas Litigasi Lt.2 / Bantex 04"
                                />
                                <div className="grid gap-1">
                                    <Label
                                        htmlFor="status"
                                        className="text-xs font-semibold text-slate-700 dark:text-zinc-300"
                                    >
                                        Status Fisik Dokumen
                                    </Label>
                                    <div className="relative">
                                        <select
                                            name="status"
                                            id="status"
                                            defaultValue={evidence.status}
                                            className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-slate-50/70 pr-7 pl-2.5 text-xs font-medium text-slate-900 outline-hidden hover:bg-slate-100 focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-zinc-200"
                                        >
                                            <option value="in_vault">
                                                Di Brankas Firma
                                            </option>
                                            <option value="borrowed_for_hearing">
                                                Dipinjam Advokat Sidang
                                            </option>
                                            <option value="submitted_to_court">
                                                Diserahkan ke Majelis Hakim
                                            </option>
                                            <option value="returned_to_client">
                                                Dikembalikan ke Klien
                                            </option>
                                        </select>
                                        <ChevronDown className="pointer-events-none absolute top-1/2 right-2 size-3 -translate-y-1/2 text-slate-400" />
                                    </div>
                                </div>
                            </div>

                            <Field
                                name="custodian_name"
                                label="Penanggung Jawab / Advokat Pemegang"
                                defaultValue={evidence.custodian_name ?? ''}
                                placeholder="Contoh: Adv. Roni, S.H."
                            />

                            <div className="grid gap-1">
                                <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                                    Uraian Isi / Pokok Pembuktian
                                </Label>
                                <textarea
                                    name="description"
                                    defaultValue={evidence.description ?? ''}
                                    rows={2}
                                    className="rounded-lg border border-slate-200 bg-slate-50/70 p-2 text-xs leading-relaxed text-slate-900 outline-hidden focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
                                />
                            </div>

                            <div className="grid gap-1">
                                <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                                    Catatan Rantai Bukti (Chain of Custody)
                                </Label>
                                <textarea
                                    name="custody_notes"
                                    defaultValue={evidence.custody_notes ?? ''}
                                    rows={1}
                                    className="rounded-lg border border-slate-200 bg-slate-50/70 p-2 text-xs leading-relaxed text-slate-900 outline-hidden focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
                                />
                            </div>

                            {Object.keys(errors).length > 0 && (
                                <p className="text-xs font-medium text-rose-600">
                                    {Object.values(errors).join(' ')}
                                </p>
                            )}

                            <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-2.5 dark:border-white/[0.04]">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={onClose}
                                    className="h-8 rounded-lg border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-[#16181d] dark:text-zinc-300"
                                >
                                    Batal
                                </Button>
                                <Button
                                    size="sm"
                                    disabled={processing}
                                    className="h-8 rounded-lg bg-slate-900 px-4 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 active:scale-95 dark:bg-white dark:text-slate-900"
                                >
                                    {processing ? (
                                        <>
                                            <Spinner className="mr-1.5 size-3" />
                                            Menyimpan...
                                        </>
                                    ) : (
                                        'Perbarui Bukti'
                                    )}
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}

function PartyOperationFields({ matterId }: { matterId: string }) {
    const [partyName, setPartyName] = useState('');
    const [previewLoading, setPreviewLoading] = useState(false);
    const [previewResult, setPreviewResult] = useState<{
        status: string;
        match_count: number;
        matches: Array<{
            name: string;
            type: string;
            role_label?: string;
            risk: string;
            similarity?: number;
            details?: string;
            matter_title?: string;
        }>;
    } | null>(null);

    const runScan = async () => {
        if (!partyName.trim()) return;
        setPreviewLoading(true);
        try {
            const res = await fetch(governanceConflictRoutes.preview.url(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN':
                        (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
                body: JSON.stringify({
                    matter_id: matterId,
                    names: [partyName.trim()],
                }),
            });
            if (res.ok) {
                const data = await res.json();
                setPreviewResult(data);
            }
        } catch (e) {
            console.error('Error running party conflict scan:', e);
        } finally {
            setPreviewLoading(false);
        }
    };

    return (
        <div className="space-y-3">
            <div className="grid gap-1">
                <Label htmlFor="party_type" className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                    Peran / Jenis Pihak <span className="text-rose-500">*</span>
                </Label>
                <div className="relative">
                    <select
                        id="party_type"
                        name="party_type"
                        defaultValue="opposing_party"
                        required
                        className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-slate-50/70 pr-8 pl-2.5 text-xs text-slate-900 focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-zinc-200"
                    >
                        <option value="opposing_party">Pihak Lawan (Adverse / Opponent)</option>
                        <option value="opposing_counsel">Kuasa Hukum Lawan (Opposing Counsel)</option>
                        <option value="co_defendant">Turut Tergugat / Pihak Ketiga</option>
                        <option value="witness">Saksi / Saksi Ahli</option>
                        <option value="related_party">Pihak Terafiliasi / Terkait Lainnya</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-slate-400" />
                </div>
            </div>

            <div className="grid gap-1">
                <div className="flex items-center justify-between">
                    <Label htmlFor="party_name" className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                        Nama Lengkap / Entitas Perusahaan <span className="text-rose-500">*</span>
                    </Label>
                    <span className="text-[10px] text-slate-400">Pindai benturan etik otomatis</span>
                </div>
                <div className="flex gap-1.5">
                    <Input
                        id="party_name"
                        name="name"
                        value={partyName}
                        onChange={(e) => {
                            setPartyName(e.target.value);
                            if (previewResult) setPreviewResult(null);
                        }}
                        required
                        placeholder="Contoh: PT Sumber Rezeki / John Doe"
                        className="h-8 rounded-lg border-slate-200 bg-slate-50/70 text-xs text-slate-900 focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-zinc-200"
                    />
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={previewLoading || !partyName.trim()}
                        onClick={runScan}
                        className="h-8 shrink-0 rounded-lg border-amber-300 bg-amber-50/80 px-2.5 text-xs font-semibold text-amber-800 hover:bg-amber-100 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300"
                    >
                        {previewLoading ? (
                            <Spinner className="size-3" />
                        ) : (
                            <>
                                <Zap className="mr-1 size-3" />
                                Pindai
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Live Scan Results & Conflict Warnings */}
            {previewResult && (
                <div className={`rounded-lg border p-2.5 text-xs ${
                    previewResult.status === 'clear'
                        ? 'border-emerald-500/30 bg-emerald-50/80 text-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300'
                        : previewResult.status === 'blocked'
                          ? 'border-rose-500/40 bg-rose-50/90 text-rose-900 dark:bg-rose-950/40 dark:text-rose-200'
                          : 'border-amber-500/30 bg-amber-50/80 text-amber-900 dark:bg-amber-950/30 dark:text-amber-300'
                }`}>
                    <div className="flex items-center gap-1.5 font-bold">
                        {previewResult.status === 'clear' ? (
                            <>
                                <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                                <span>Bebas Benturan Kepentingan</span>
                            </>
                        ) : previewResult.status === 'blocked' ? (
                            <>
                                <ShieldAlert className="size-3.5 text-rose-600 dark:text-rose-400" />
                                <span>Peringatan Benturan Kepentingan Langsung</span>
                            </>
                        ) : (
                            <>
                                <ShieldAlert className="size-3.5 text-amber-600 dark:text-amber-400" />
                                <span>Potensi Benturan Kepentingan Terdeteksi</span>
                            </>
                        )}
                    </div>

                    {previewResult.matches.length > 0 && (
                        <div className="mt-1.5 space-y-1">
                            {previewResult.matches.map((m, idx) => (
                                <p key={idx} className="text-[11px] leading-relaxed">
                                    • Cocok dengan <strong>{m.name}</strong> ({m.role_label ?? m.type}{m.similarity ? ` - ${m.similarity}%` : ''})
                                    {m.details && <span className="opacity-80"> — {m.details}</span>}
                                </p>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
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
        <div className="grid gap-1">
            <Label
                htmlFor={name}
                className="text-xs font-semibold text-slate-700 dark:text-zinc-300"
            >
                {label}
            </Label>
            <Input
                id={name}
                name={name}
                type={type}
                defaultValue={defaultValue}
                required={required}
                placeholder={placeholder}
                className="h-8 rounded-lg border-slate-200 bg-slate-50/70 text-xs text-slate-900 transition-colors focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
            />
        </div>
    );
}

function TaskList({
    tasks,
    getInitials,
}: {
    tasks: Matter['tasks'];
    getInitials: (name: string) => string;
}) {
    return tasks.length ? (
        <div className="divide-y divide-slate-100 dark:divide-white/[0.04]">
            {tasks.map((task) => (
                <div
                    key={task.id}
                    className="flex flex-col justify-between gap-2 py-2.5 sm:flex-row sm:items-center"
                >
                    <div className="flex min-w-0 items-center gap-2">
                        <Avatar className="size-5 rounded-full border border-slate-200/80 dark:border-white/10">
                            <AvatarImage
                                src={task.assignee?.avatar_url ?? undefined}
                            />
                            <AvatarFallback className="text-[7px] font-bold">
                                {getInitials(task.assignee?.name ?? 'T')}
                            </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                            <p className="truncate text-xs font-semibold text-slate-900 dark:text-white">
                                {task.title}
                            </p>
                            <p className="text-[10px] text-slate-500 dark:text-zinc-400">
                                {task.assignee?.name ?? 'Belum ditugaskan'} ·{' '}
                                {task.due_at ? formatDate(task.due_at) : '-'}
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
        <p className="text-xs text-slate-400">Tidak ada tugas aktif.</p>
    );
}

function EmptyState({
    title,
    description,
}: {
    title: string;
    description?: string;
}) {
    return (
        <div className="flex flex-col items-center justify-center p-6 text-center">
            <div className="flex size-10 items-center justify-center rounded-xl bg-slate-100 text-slate-400 dark:bg-zinc-800 dark:text-zinc-500">
                <FolderKanban className="size-5" />
            </div>
            <p className="mt-3 text-xs font-semibold text-slate-700 dark:text-zinc-300">
                {title}
            </p>
            {description && (
                <p className="mt-1 text-[11px] text-slate-400 dark:text-zinc-500">
                    {description}
                </p>
            )}
        </div>
    );
}

function RecordHearingOutcomeModal({
    matterId,
    event,
    firmStaff,
    onClose,
}: {
    matterId: string;
    event: Matter['events'][number];
    firmStaff: DiscussionStaff[];
    onClose: () => void;
}) {
    const [status, setStatus] = useState<string>(
        event.status === 'completed' ||
            event.status === 'postponed' ||
            event.status === 'cancelled'
            ? event.status
            : 'completed',
    );
    const [scheduleNext, setScheduleNext] = useState<boolean>(
        event.status === 'postponed' || !event.outcome,
    );

    return (
        <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xl sm:max-w-xl dark:border-white/10 dark:bg-[#14161b]">
                <DialogHeader className="border-b border-slate-100 pb-3 dark:border-white/[0.04]">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                            <Scale className="size-5" />
                        </div>
                        <div>
                            <DialogTitle className="text-sm font-bold text-slate-900 dark:text-white">
                                Catat Hasil Sidang / Persidangan
                            </DialogTitle>
                            <DialogDescription className="text-xs text-slate-500 dark:text-zinc-400">
                                {event.title} • {formatDate(event.starts_at, true)}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <Form
                    action={eventRoutes.outcome.url({
                        matter: matterId,
                        event: event.id,
                    })}
                    method="post"
                    className="space-y-4 pt-1"
                    onSuccess={onClose}
                >
                    {({ processing, errors }) => (
                        <>
                            {/* 1. Status Hasil Sidang */}
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                                    Status Hasil Sidang <span className="text-rose-500">*</span>
                                </Label>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        {
                                            key: 'completed',
                                            label: 'Selesai Sesuai Agenda',
                                            desc: 'Sidang terlaksana tuntas',
                                        },
                                        {
                                            key: 'postponed',
                                            label: 'Ditunda / Lanjutan',
                                            desc: 'Ada sidang berikutnya',
                                        },
                                        {
                                            key: 'cancelled',
                                            label: 'Dibatalkan / Gugur',
                                            desc: 'Sidang tidak berjalan',
                                        },
                                    ].map((opt) => (
                                        <label
                                            key={opt.key}
                                            className={`flex cursor-pointer flex-col justify-between rounded-xl border p-2.5 text-xs transition-all ${
                                                status === opt.key
                                                    ? 'border-emerald-500 bg-emerald-50/50 text-emerald-900 shadow-2xs dark:border-emerald-500/50 dark:bg-emerald-950/30 dark:text-emerald-300'
                                                    : 'border-slate-200/80 bg-white text-slate-700 hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#16181d] dark:text-zinc-300'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="font-bold text-[11px]">
                                                    {opt.label}
                                                </span>
                                                <input
                                                    type="radio"
                                                    name="status"
                                                    value={opt.key}
                                                    checked={status === opt.key}
                                                    onChange={(e) => {
                                                        setStatus(e.target.value);
                                                        if (e.target.value === 'postponed') {
                                                            setScheduleNext(true);
                                                        }
                                                    }}
                                                    className="size-3 text-emerald-600"
                                                />
                                            </div>
                                            <span className="mt-1 text-[10px] text-slate-500 dark:text-zinc-400">
                                                {opt.desc}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                                <InputError message={errors.status} />
                            </div>

                            {/* 2. Advokat yang Menghadiri Sidang */}
                            <div className="space-y-1">
                                <Label
                                    htmlFor="attended_by"
                                    className="text-xs font-semibold text-slate-700 dark:text-zinc-300"
                                >
                                    Advokat / Staf Pendamping Sidang
                                </Label>
                                <div className="relative">
                                    <select
                                        name="attended_by"
                                        id="attended_by"
                                        defaultValue={event.attended_by ?? ''}
                                        className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs text-slate-900 shadow-2xs dark:border-white/10 dark:bg-[#14161b] dark:text-white"
                                    >
                                        <option value="">
                                            Pilih advokat yang menghadiri sidang...
                                        </option>
                                        {firmStaff.map((staff) => (
                                            <option key={staff.id} value={staff.id}>
                                                {staff.name}{' '}
                                                {staff.position_title
                                                    ? `(${staff.position_title})`
                                                    : ''}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <InputError message={errors.attended_by} />
                            </div>

                            {/* 3. Resume / Ringkasan Jalannya Sidang */}
                            <div className="space-y-1">
                                <Label
                                    htmlFor="outcome"
                                    className="text-xs font-semibold text-slate-700 dark:text-zinc-300"
                                >
                                    Ringkasan &amp; Resume Jalannya Persidangan{' '}
                                    <span className="text-rose-500">*</span>
                                </Label>
                                <textarea
                                    name="outcome"
                                    id="outcome"
                                    rows={4}
                                    required
                                    defaultValue={event.outcome ?? ''}
                                    placeholder="Contoh: Pemeriksaan saksi fakta Penggugat (Saksi A & Saksi B). Tergugat mengajukan 2 bukti surat tandingan. Seluruh alat bukti P-1 s/d P-5 telah dicocokkan dengan aslinya di hadapan Majelis Hakim."
                                    className="w-full rounded-lg border border-slate-200 bg-transparent px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:border-white/10 dark:text-white dark:placeholder:text-zinc-500 dark:focus:ring-white"
                                />
                                <InputError message={errors.outcome} />
                            </div>

                            {/* 4. Catatan / Arahan Majelis Hakim */}
                            <div className="space-y-1">
                                <Label
                                    htmlFor="judge_notes"
                                    className="text-xs font-semibold text-slate-700 dark:text-zinc-300"
                                >
                                    Catatan / Perintah Majelis Hakim (Opsional)
                                </Label>
                                <textarea
                                    name="judge_notes"
                                    id="judge_notes"
                                    rows={2}
                                    defaultValue={event.judge_notes ?? ''}
                                    placeholder="Contoh: Hakim memerintahkan Kuasa Penggugat untuk menyiapkan Kesimpulan paling lambat 1 minggu sebelum sidang putusan."
                                    className="w-full rounded-lg border border-slate-200 bg-transparent px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:border-white/10 dark:text-white dark:placeholder:text-zinc-500 dark:focus:ring-white"
                                />
                                <InputError message={errors.judge_notes} />
                            </div>

                            {/* 5. Switch: Jadwalkan Sidang Lanjutan Berikutnya */}
                            <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5 dark:border-white/[0.06] dark:bg-[#121418]">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <div className="flex items-center gap-1.5">
                                            <CalendarClock className="size-4 text-blue-600 dark:text-blue-400" />
                                            <span className="text-xs font-bold text-slate-900 dark:text-white">
                                                Jadwalkan Sidang Lanjutan Berikutnya
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                                            Otomatis buat agenda baru di Kalender &amp; kirim notifikasi ke tim.
                                        </p>
                                    </div>
                                    <label className="relative inline-flex cursor-pointer items-center">
                                        <input
                                            type="checkbox"
                                            name="schedule_next"
                                            value="1"
                                            checked={scheduleNext}
                                            onChange={(e) =>
                                                setScheduleNext(e.target.checked)
                                            }
                                            className="sr-only"
                                        />
                                        <div
                                            className={`h-5 w-9 rounded-full transition-colors ${
                                                scheduleNext
                                                    ? 'bg-blue-600'
                                                    : 'bg-slate-300 dark:bg-zinc-700'
                                            }`}
                                        >
                                            <div
                                                className={`size-4 rounded-full bg-white transition-transform ${
                                                    scheduleNext
                                                        ? 'translate-x-4'
                                                        : 'translate-x-0.5'
                                                } mt-0.5`}
                                            />
                                        </div>
                                    </label>
                                </div>

                                {scheduleNext && (
                                    <div className="mt-3.5 space-y-3 border-t border-slate-200/60 pt-3 dark:border-white/[0.04]">
                                        <div className="grid gap-3 sm:grid-cols-2">
                                            <div className="space-y-1 sm:col-span-2">
                                                <Label
                                                    htmlFor="next_title"
                                                    className="text-xs font-semibold text-slate-700 dark:text-zinc-300"
                                                >
                                                    Agenda Sidang Lanjutan{' '}
                                                    <span className="text-rose-500">
                                                        *
                                                    </span>
                                                </Label>
                                                <Input
                                                    id="next_title"
                                                    name="next_title"
                                                    required={scheduleNext}
                                                    placeholder="Contoh: Sidang Pembuktian & Saksi Tergugat"
                                                    className="h-8 text-xs"
                                                />
                                                <InputError
                                                    message={errors.next_title}
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <Label
                                                    htmlFor="next_starts_at"
                                                    className="text-xs font-semibold text-slate-700 dark:text-zinc-300"
                                                >
                                                    Tanggal &amp; Waktu Sidang{' '}
                                                    <span className="text-rose-500">
                                                        *
                                                    </span>
                                                </Label>
                                                <Input
                                                    id="next_starts_at"
                                                    name="next_starts_at"
                                                    type="datetime-local"
                                                    required={scheduleNext}
                                                    className="h-8 font-mono text-xs"
                                                />
                                                <InputError
                                                    message={
                                                        errors.next_starts_at
                                                    }
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <Label
                                                    htmlFor="next_location"
                                                    className="text-xs font-semibold text-slate-700 dark:text-zinc-300"
                                                >
                                                    Ruang / Lokasi Pengadilan
                                                </Label>
                                                <Input
                                                    id="next_location"
                                                    name="next_location"
                                                    defaultValue={
                                                        event.location ??
                                                        'Pengadilan Negeri'
                                                    }
                                                    placeholder="Contoh: Ruang Sidang Utama (Prof. Oemar Seno Adji)"
                                                    className="h-8 text-xs"
                                                />
                                                <InputError
                                                    message={
                                                        errors.next_location
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3 dark:border-white/[0.04]">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={onClose}
                                    className="h-8 rounded-lg text-xs"
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    size="sm"
                                    disabled={processing}
                                    className="h-8 rounded-lg bg-emerald-600 px-4 text-xs font-bold text-white shadow-2xs hover:bg-emerald-700"
                                >
                                    {processing ? (
                                        <>
                                            <Spinner className="mr-1.5 size-3.5" />
                                            Menyimpan...
                                        </>
                                    ) : (
                                        <>
                                            <Check className="mr-1.5 size-3.5" />
                                            Simpan Hasil Sidang
                                        </>
                                    )}
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}

function EditEventDialog({
    matterId,
    event,
    onClose,
}: {
    matterId: string;
    event: Matter['events'][number];
    onClose: () => void;
}) {
    return (
        <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-h-[85vh] overflow-y-auto rounded-xl border border-slate-200/80 bg-white p-4 shadow-xl sm:max-w-lg dark:border-white/10 dark:bg-[#16181d]">
                <DialogHeader className="border-b border-slate-100 pb-2.5 dark:border-white/[0.04]">
                    <div className="flex items-center gap-2.5">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400">
                            <Gavel className="size-4" />
                        </div>
                        <div>
                            <DialogTitle className="text-sm font-bold text-slate-900 dark:text-white">
                                Edit Agenda &amp; Catatan
                            </DialogTitle>
                            <DialogDescription className="text-xs text-slate-500 dark:text-zinc-400">
                                Perbarui jadwal, lokasi, dan rincian catatan agenda perkara.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <Form
                    action={eventRoutes.update.url({
                        matter: matterId,
                        event: event.id,
                    })}
                    method="put"
                    className="space-y-3 pt-1"
                    onSuccess={onClose}
                >
                    {({ processing, errors }) => (
                        <>
                            <Field
                                name="title"
                                label="Judul Agenda / Sidang"
                                required
                                defaultValue={event.title}
                                placeholder="Contoh: Sidang Pemeriksaan Saksi Ahli"
                            />
                            <div className="grid gap-1">
                                <Label
                                    htmlFor="edit_event_type"
                                    className="text-xs font-semibold text-slate-700 dark:text-zinc-300"
                                >
                                    Jenis Agenda
                                </Label>
                                <div className="relative">
                                    <select
                                        name="event_type"
                                        id="edit_event_type"
                                        defaultValue={event.event_type}
                                        className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-slate-50/70 pr-7 pl-2.5 text-xs font-medium text-slate-900 outline-hidden hover:bg-slate-100 focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-zinc-200"
                                    >
                                        <option value="court">
                                            Sidang Pengadilan
                                        </option>
                                        <option value="meeting">
                                            Pertemuan Klien / Negosiasi
                                        </option>
                                        <option value="hearing">
                                            Pemeriksaan / Mediasi
                                        </option>
                                        <option value="internal">
                                            Rapat Internal Tim
                                        </option>
                                    </select>
                                    <ChevronDown className="pointer-events-none absolute top-1/2 right-2 size-3 -translate-y-1/2 text-slate-400" />
                                </div>
                            </div>
                            <div className="grid gap-2 sm:grid-cols-2">
                                <Field
                                    name="starts_at"
                                    label="Waktu Mulai"
                                    type="datetime-local"
                                    required
                                    defaultValue={
                                        event.starts_at
                                            ? new Date(event.starts_at)
                                                  .toISOString()
                                                  .slice(0, 16)
                                            : ''
                                    }
                                />
                                <Field
                                    name="ends_at"
                                    label="Waktu Selesai"
                                    type="datetime-local"
                                    defaultValue={
                                        event.ends_at
                                            ? new Date(event.ends_at)
                                                  .toISOString()
                                                  .slice(0, 16)
                                            : ''
                                    }
                                />
                            </div>
                            <Field
                                name="location"
                                label="Lokasi / Ruang Sidang"
                                defaultValue={event.location ?? ''}
                                placeholder="Contoh: Ruang Sidang Utama PN Bandung"
                            />
                            <div className="grid gap-1">
                                <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                                    Catatan / Rincian Agenda (Opsional)
                                </Label>
                                <textarea
                                    name="description"
                                    rows={3}
                                    defaultValue={event.description ?? ''}
                                    className="rounded-lg border border-slate-200 bg-slate-50/70 p-2 text-xs leading-relaxed text-slate-900 outline-hidden focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
                                    placeholder="Tuliskan catatan, persiapan sidang, saksi yang dihadirkan, atau instruksi khusus..."
                                />
                            </div>

                            {Object.keys(errors).length > 0 && (
                                <p className="text-xs font-medium text-rose-600">
                                    {Object.values(errors).join(' ')}
                                </p>
                            )}

                            <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-2.5 dark:border-white/[0.04]">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={onClose}
                                    className="h-8 rounded-lg border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-[#16181d] dark:text-zinc-300"
                                >
                                    Batal
                                </Button>
                                <Button
                                    size="sm"
                                    disabled={processing}
                                    className="h-8 rounded-lg bg-slate-900 px-4 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 active:scale-95 dark:bg-white dark:text-slate-900"
                                >
                                    {processing ? (
                                        <>
                                            <Spinner className="mr-1.5 size-3" />
                                            Menyimpan...
                                        </>
                                    ) : (
                                        'Simpan Perubahan'
                                    )}
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}

MatterShow.layout = {
    breadcrumbs: [
        { title: 'Perkara', href: matterRoutes.index.url() },
        { title: 'Detail Perkara', href: '#' },
    ],
};
