import { Form, Head, Link, router, useForm } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowLeft,
    Briefcase,
    Building2,
    Calendar,
    Camera,
    Check,
    CheckCircle2,
    ChevronDown,
    ChevronRight,
    Clock,
    ContactRound,
    Copy,
    ExternalLink,
    FileBadge,
    FileText,
    FileUp,
    Globe,
    Mail,
    MapPin,
    Pencil,
    Phone,
    Plus,
    Scale,
    Shield,
    ShieldAlert,
    ShieldCheck,
    Trash2,
    User,
    Users,
} from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { ClientEditDialog } from '@/components/client-edit-dialog';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { EmptyState } from '@/components/empty-state';
import { StatusText } from '@/components/status-text';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { FileInput } from '@/components/ui/file-input';
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
import { getDetailHeaderMetadata } from '@/lib/detail-header-meta';
import { formatBytes, formatDate } from '@/lib/format';
import * as clientRoutes from '@/routes/clients';
import * as documentRoutes from '@/routes/documents';
import * as matterRoutes from '@/routes/matters';

type Person = {
    id?: number;
    name: string;
    position_title?: string;
    avatar_url?: string | null;
};

type Matter = {
    id: string;
    matter_number: string;
    title: string;
    status: string;
    updated_at: string;
    practice_area?: { name: string };
    responsible_partner?: Person;
};

type ComplianceDocument = {
    id: string;
    client_id: string;
    document_type: string;
    document_number: string;
    title: string;
    issued_at?: string;
    expires_at?: string;
    issuer?: string;
    notes?: string;
    compliance_status: 'expired' | 'expiring_soon' | 'active' | 'no_expiry';
    creator?: { id: number; name: string };
};

type Client = {
    id: string;
    client_number: string;
    display_name: string;
    legal_name: string;
    type: string;
    status: string;
    industry?: string;
    email?: string;
    phone?: string;
    address_line_1?: string;
    city?: string;
    province?: string;
    tax_identifier?: string;
    registration_identifier?: string;
    website?: string;
    address_line_2?: string;
    postal_code?: string;
    country_code: string;
    notes?: string;
    kyc_risk_level?: string;
    kyc_status?: string;
    kyc_checklist?: Record<string, boolean> | null;
    kyc_assessed_at?: string;
    kyc_assessed_by?: number;
    kyc_notes?: string;
    kyc_assessed_by_user?: Person;
    relationship_partner_id?: number;
    opened_at?: string;
    closed_at?: string;
    relationship_partner?: Person;
    contacts: Contact[];
    compliance_documents?: ComplianceDocument[];
};

type Contact = {
    id: string;
    full_name: string;
    job_title?: string;
    email?: string;
    mobile?: string;
    avatar_url?: string | null;
};

const AVAILABLE_AVATARS = Array.from({ length: 15 }, (_, i) => ({
    id: `avatar-${i + 1}`,
    url: `/images/avatars/avatar-${i + 1}.svg`,
    label: `Avatar 3D ${i + 1}`,
}));

function getContactAvatarUrl(contact?: { id?: string; full_name?: string; avatar_url?: string | null } | null): string {
    if (!contact) return '/images/avatars/avatar-1.svg';
    if (contact.avatar_url && contact.avatar_url.trim() !== '') {
        return contact.avatar_url;
    }
    let hash = 0;
    const str = (contact.id || '') + (contact.full_name || '');
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = (Math.abs(hash) % 15) + 1;
    return `/images/avatars/avatar-${index}.svg`;
}

type Document = {
    id: string;
    title: string;
    status: string;
    updated_at: string;
    current_version?: {
        version_number: number;
        file_size: number;
        mime_type?: string;
    };
};

const tabs = [
    { id: 'Overview', label: 'Ringkasan', icon: Building2 },
    { id: 'Matters', label: 'Matters', icon: Briefcase },
    { id: 'Legalitas', label: 'Legalitas & Kepatuhan', icon: Scale },
    { id: 'Kontak', label: 'Kontak Person', icon: ContactRound },
    { id: 'KYC', label: 'Kepatuhan KYC & AML', icon: ShieldCheck },
    { id: 'Dokumen', label: 'Dokumen', icon: FileText },
] as const;

const complianceTypeLabels: Record<string, string> = {
    deed_establishment: 'Akta Pendirian Perusahaan',
    deed_amendment_directors: 'Akta Perubahan Direksi / Saham',
    nib: 'Nomor Induk Berusaha (NIB)',
    sk_menkumham: 'SK Pengesahan Kemenkumham',
    kbli_license: 'Izin Usaha KBLI / Sektoral',
    amdal_environmental: 'AMDAL / Izin Lingkungan',
    trademark_ip: 'Sertifikat Merek & HKI',
    tax_id: 'Surat Keterangan Pajak (SKT)',
    other: 'Dokumen Legalitas Lainnya',
};

export default function ClientShow({
    client,
    activeMatters,
    closedMatters,
    documents,
    partners,
    can,
}: {
    client: Client;
    activeMatters: Matter[];
    closedMatters: Matter[];
    documents: Document[];
    partners: {
        id: number;
        name: string;
        position_title?: string;
        avatar_path?: string | null;
    }[];
    can: { update: boolean };
}) {
    const getInitials = useInitials();
    const [tab, setTab] = useState<(typeof tabs)[number]['id']>('Overview');
    const [copiedTax, setCopiedTax] = useState(false);
    const [isAddingCompliance, setIsAddingCompliance] = useState(false);
    const [editingCompliance, setEditingCompliance] =
        useState<ComplianceDocument | null>(null);
    const [isAddingContact, setIsAddingContact] = useState(false);
    const [isUploadingDocument, setIsUploadingDocument] = useState(false);
    const [complianceToDelete, setComplianceToDelete] =
        useState<ComplianceDocument | null>(null);
    const [isDeletingCompliance, setIsDeletingCompliance] = useState(false);
    const [contactToDelete, setContactToDelete] = useState<Contact | null>(
        null,
    );
    const [isDeletingContact, setIsDeletingContact] = useState(false);
    const allMatters = useMemo(
        () => [...activeMatters, ...closedMatters],
        [activeMatters, closedMatters],
    );

    const handleCopyTax = () => {
        if (client.tax_identifier) {
            navigator.clipboard.writeText(client.tax_identifier);
            setCopiedTax(true);
            setTimeout(() => setCopiedTax(false), 2000);
        }
    };

    return (
        <>
            <Head title={`${client.client_number} - ${client.display_name}`} />

            <div className="min-h-screen bg-[#fafafc] pb-20 dark:bg-[#0c0d10]">
                <main className="mx-auto max-w-7xl space-y-5 px-4 py-5 sm:px-6 lg:px-8">
                    {/* 1. Header Navigation & Client Cockpit Bar */}
                    <div className="space-y-3 border-b border-slate-200/60 pb-5 dark:border-white/[0.06]">
                        {/* Top Tier: Breadcrumbs / Client Code + Action Buttons */}
                        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                            {/* Left: Breadcrumbs & Client Number */}
                            <div className="flex flex-wrap items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="-ml-2 h-7 px-2 text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white"
                                    asChild
                                >
                                    <Link href={clientRoutes.index.url()}>
                                        <ArrowLeft className="mr-1 size-3.5 text-slate-400" />
                                        Daftar Klien
                                    </Link>
                                </Button>
                                <span className="text-slate-300 dark:text-zinc-600">/</span>
                                {getDetailHeaderMetadata(
                                    client.client_number,
                                ).map((item) => (
                                    <span
                                        key={item.testId}
                                        data-testid={item.testId}
                                        className={`text-[11px] font-bold tracking-tight whitespace-nowrap ${item.className}`}
                                    >
                                        {item.label}
                                    </span>
                                ))}
                            </div>

                            {/* Right: Action Buttons */}
                            <div className="flex shrink-0 flex-wrap items-center gap-1.5">
                                {can.update && (
                                    <ClientEditDialog
                                        client={client}
                                        partners={partners}
                                        trigger={
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-7.5 cursor-pointer rounded-lg border-slate-200/80 bg-white px-2.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-white/10 dark:bg-[#16181d] dark:text-zinc-200"
                                            >
                                                <Pencil className="mr-1 size-3 text-slate-400" />
                                                Edit Profil
                                            </Button>
                                        }
                                    />
                                )}

                                <Button
                                    size="sm"
                                    className="h-7.5 rounded-lg bg-slate-900 px-3 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 active:scale-95 dark:bg-white dark:text-slate-900"
                                    asChild
                                >
                                    <Link href={matterRoutes.create.url()}>
                                        <Plus className="mr-1 size-3.5" />
                                        Buat Matter Baru
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        {/* Bottom Tier: Full-Width Client Title & Metadata */}
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2.5">
                                {client.type === 'individual' ||
                                client.type === 'person' ? (
                                    <div className="flex size-7.5 shrink-0 items-center justify-center rounded-lg border border-emerald-200/60 bg-emerald-50 text-emerald-700 shadow-2xs dark:border-emerald-900/40 dark:bg-emerald-950/60 dark:text-emerald-300">
                                        <User className="size-4" />
                                    </div>
                                ) : (
                                    <div className="flex size-7.5 shrink-0 items-center justify-center rounded-lg border border-blue-200/60 bg-blue-50 text-blue-700 shadow-2xs dark:border-blue-900/40 dark:bg-blue-950/60 dark:text-blue-300">
                                        <Building2 className="size-4" />
                                    </div>
                                )}
                                <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl lg:text-[26px] lg:leading-snug dark:text-white">
                                    {client.display_name}
                                </h1>
                            </div>

                            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-slate-500 dark:text-zinc-400">
                                <span className="font-medium text-slate-700 dark:text-zinc-200">
                                    {client.legal_name}
                                </span>
                                <span className="text-slate-300 dark:text-zinc-700">
                                    •
                                </span>
                                <span>Industri: {client.industry ?? 'Umum'}</span>
                                {client.city && (
                                    <>
                                        <span className="text-slate-300 dark:text-zinc-700">
                                            •
                                        </span>
                                        <span>
                                            Lokasi:{' '}
                                            {[client.city, client.country_code]
                                                .filter(Boolean)
                                                .join(', ')}
                                        </span>
                                    </>
                                )}
                                {client.tax_identifier && (
                                    <>
                                        <span className="text-slate-300 dark:text-zinc-700">
                                            •
                                        </span>
                                        <span>
                                            NPWP:{' '}
                                            <span className="font-mono">
                                                {client.tax_identifier}
                                            </span>
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 2. Top 4 Overview Stat Cards */}
                    <section className="grid grid-cols-2 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
                        {/* 1. Relationship Partner */}
                        <div className="group rounded-xl border border-slate-200/70 bg-white p-3 shadow-2xs transition-all hover:border-slate-300 sm:p-3.5 dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[10px] font-bold tracking-wider uppercase sm:text-[11px]">
                                    RELATIONSHIP PARTNER
                                </span>
                                <ShieldCheck className="size-3.5 text-slate-400 transition-colors group-hover:text-blue-600 dark:text-zinc-500" />
                            </div>
                            <div className="mt-2 flex items-center gap-2">
                                <Avatar className="size-6 rounded-full border border-slate-200/80 dark:border-white/10">
                                    <AvatarImage
                                        src={
                                            client.relationship_partner
                                                ?.avatar_url ?? undefined
                                        }
                                    />
                                    <AvatarFallback className="text-[8px] font-bold">
                                        {client.relationship_partner
                                            ? getInitials(
                                                  client.relationship_partner
                                                      .name,
                                              )
                                            : '-'}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0">
                                    <p className="truncate text-xs font-bold text-slate-900 dark:text-white">
                                        {client.relationship_partner?.name ??
                                            'Belum ditentukan'}
                                    </p>
                                    <p className="truncate text-[10px] text-slate-400 dark:text-zinc-500">
                                        {client.relationship_partner
                                            ?.position_title ?? 'Partner'}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[10px] text-slate-500 sm:text-[11px] dark:border-white/[0.04]">
                                <span>Penanggung Jawab</span>
                            </div>
                        </div>

                        {/* 2. Sektor & Entitas */}
                        <div className="group rounded-xl border border-slate-200/70 bg-white p-3 shadow-2xs transition-all hover:border-slate-300 sm:p-3.5 dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[10px] font-bold tracking-wider uppercase sm:text-[11px]">
                                    SEKTOR &amp; ENTITAS
                                </span>
                                <Building2 className="size-3.5 text-slate-400 transition-colors group-hover:text-emerald-600 dark:text-zinc-500" />
                            </div>
                            <div className="mt-2">
                                <p className="truncate text-xs font-bold text-slate-900 dark:text-white">
                                    {client.industry ?? 'Umum / Korporasi'}
                                </p>
                                <p className="truncate text-[10px] text-slate-500 sm:text-[11px] dark:text-zinc-400">
                                    {client.type === 'corporate'
                                        ? 'Badan Hukum'
                                        : 'Perorangan'}
                                </p>
                            </div>
                            <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[10px] text-slate-500 sm:text-[11px] dark:border-white/[0.04]">
                                <span>Profil Usaha</span>
                            </div>
                        </div>

                        {/* 3. Portofolio Perkara */}
                        <div className="group rounded-xl border border-slate-200/70 bg-white p-3 shadow-2xs transition-all hover:border-slate-300 sm:p-3.5 dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[10px] font-bold tracking-wider uppercase sm:text-[11px]">
                                    PORTOFOLIO PERKARA
                                </span>
                                <Briefcase className="size-3.5 text-slate-400 transition-colors group-hover:text-amber-600 dark:text-zinc-500" />
                            </div>
                            <div className="mt-2 flex items-baseline justify-between">
                                <span className="font-mono text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                                    {activeMatters.length}
                                </span>
                                <span className="text-[10px] font-medium text-slate-500 sm:text-[11px] dark:text-zinc-400">
                                    matter aktif
                                </span>
                            </div>
                            <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[10px] text-slate-500 sm:text-[11px] dark:border-white/[0.04]">
                                <span>Total: {allMatters.length}</span>
                            </div>
                        </div>

                        {/* 4. Kontak Person */}
                        <div className="group rounded-xl border border-slate-200/70 bg-white p-3 shadow-2xs transition-all hover:border-slate-300 sm:p-3.5 dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[10px] font-bold tracking-wider uppercase sm:text-[11px]">
                                    KONTAK PERSON
                                </span>
                                <ContactRound className="size-3.5 text-slate-400 transition-colors group-hover:text-blue-600 dark:text-zinc-500" />
                            </div>
                            <div className="mt-2 flex items-baseline justify-between">
                                <span className="font-mono text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                                    {client.contacts.length}
                                </span>
                                <span className="text-[10px] font-medium text-slate-500 sm:text-[11px] dark:text-zinc-400">
                                    perwakilan
                                </span>
                            </div>
                            <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[10px] text-slate-500 sm:text-[11px] dark:border-white/[0.04]">
                                <span>Personil Resmi</span>
                            </div>
                        </div>
                    </section>

                    {/* 3. Segmented Navigation Tabs (Horizontal Swipeable on Mobile) */}
                    <div className="flex items-center gap-1 overflow-x-auto rounded-xl border border-slate-200/70 bg-slate-100/70 p-1 shadow-2xs [scrollbar-width:none] [-ms-overflow-style:none] dark:border-white/[0.06] dark:bg-[#14161b] [&::-webkit-scrollbar]:hidden">
                        {tabs.map((item) => {
                            const isActive = tab === item.id;
                            const Icon = item.icon;
                            const count =
                                item.id === 'Matters'
                                    ? allMatters.length
                                    : item.id === 'Legalitas'
                                      ? client.compliance_documents?.length || 0
                                      : item.id === 'Kontak'
                                        ? client.contacts.length
                                        : item.id === 'Dokumen'
                                          ? documents.length
                                          : null;

                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => setTab(item.id)}
                                    className={`flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                                        isActive
                                            ? 'bg-white text-slate-900 shadow-2xs dark:bg-[#20232a] dark:text-white'
                                            : 'text-slate-600 hover:bg-white/60 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-white/[0.04] dark:hover:text-white'
                                    }`}
                                >
                                    <Icon
                                        className={`size-3.5 shrink-0 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-zinc-500'}`}
                                    />
                                    <span>{item.label}</span>
                                    {count !== null && count > 0 && (
                                        <span
                                            className={`py-0.2 rounded-full px-1.5 font-mono text-[10px] font-bold ${
                                                isActive
                                                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                                                    : 'bg-slate-200/80 text-slate-700 dark:bg-zinc-800 dark:text-zinc-400'
                                            }`}
                                        >
                                            {count}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* 4. 2-Column Split Cockpit Workspace Layout */}
                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
                        {/* Sisi Kiri: Main Workspace (8 Columns) */}
                        <div className="space-y-4 lg:col-span-8">
                            {/* TAB 1: OVERVIEW */}
                            {tab === 'Overview' && (
                                <div className="space-y-4">
                                    {/* Catatan & Ikhtisar Klien */}
                                    <div className="rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                        <div className="mb-2.5 flex items-center justify-between border-b border-slate-100 pb-2 dark:border-white/[0.04]">
                                            <div className="flex items-center gap-1.5">
                                                <Building2 className="size-3.5 text-slate-500 dark:text-zinc-400" />
                                                <span className="text-[11px] font-semibold text-slate-500 uppercase dark:text-zinc-400">
                                                    Catatan &amp; Ikhtisar Klien
                                                </span>
                                            </div>
                                            <span className="text-[11px] text-slate-400">
                                                Profil Entitas
                                            </span>
                                        </div>
                                        <p className="text-xs leading-relaxed whitespace-pre-wrap text-slate-700 dark:text-zinc-300">
                                            {client.notes ||
                                                'Klien terverifikasi. Dokumen KYC, beneficial ownership, dan surat penunjukan telah ditelaah saat pembukaan hubungan profesional.'}
                                        </p>
                                    </div>

                                    {/* Matter Berjalan */}
                                    <div className="rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                        <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-white/[0.04]">
                                            <div className="flex items-center gap-1.5">
                                                <Briefcase className="size-3.5 text-slate-500 dark:text-zinc-400" />
                                                <span className="text-[11px] font-semibold text-slate-500 uppercase dark:text-zinc-400">
                                                    Matter Berjalan (
                                                    {activeMatters.length})
                                                </span>
                                            </div>
                                            {allMatters.length > 0 && (
                                                <button
                                                    onClick={() =>
                                                        setTab('Matters')
                                                    }
                                                    className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
                                                >
                                                    Lihat Semua →
                                                </button>
                                            )}
                                        </div>

                                        {activeMatters.length ? (
                                            <div className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                                                {activeMatters.map((matter) => (
                                                    <Link
                                                        key={matter.id}
                                                        href={matterRoutes.show.url(
                                                            matter.id,
                                                        )}
                                                        className="group flex items-center justify-between py-2.5 transition-colors hover:bg-slate-50/50 dark:hover:bg-white/[0.02]"
                                                    >
                                                        <div className="min-w-0 pr-3">
                                                            <p className="truncate text-xs font-semibold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                                                                {matter.title}
                                                            </p>
                                                            <div className="mt-0.5 flex items-center gap-2 font-mono text-[10px] text-slate-500 dark:text-zinc-400">
                                                                <span className="font-semibold text-blue-600 dark:text-blue-400">
                                                                    {
                                                                        matter.matter_number
                                                                    }
                                                                </span>
                                                                <span>•</span>
                                                                <span>
                                                                    {matter
                                                                        .practice_area
                                                                        ?.name ??
                                                                        'Umum'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <StatusText
                                                            value={
                                                                matter.status
                                                            }
                                                        />
                                                    </Link>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-xs text-slate-400">
                                                Tidak ada matter yang sedang
                                                berjalan saat ini.
                                            </p>
                                        )}
                                    </div>

                                    {/* Kontak Preview */}
                                    <div className="rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                        <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-white/[0.04]">
                                            <div className="flex items-center gap-1.5">
                                                <ContactRound className="size-3.5 text-slate-500 dark:text-zinc-400" />
                                                <span className="text-[11px] font-semibold text-slate-500 uppercase dark:text-zinc-400">
                                                    Kontak Person (
                                                    {client.contacts.length})
                                                </span>
                                            </div>
                                            {client.contacts.length > 2 && (
                                                <button
                                                    onClick={() =>
                                                        setTab('Kontak')
                                                    }
                                                    className="cursor-pointer text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
                                                >
                                                    Lihat Semua →
                                                </button>
                                            )}
                                        </div>

                                        {client.contacts.length ? (
                                            <div className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                                                {client.contacts
                                                    .slice(0, 3)
                                                    .map((contact) => (
                                                        <div
                                                            key={contact.id}
                                                            className="flex items-center justify-between py-2.5 text-xs"
                                                        >
                                                            <div className="flex min-w-0 items-center gap-2.5 pr-3">
                                                                <Avatar className="size-8 shrink-0 overflow-hidden rounded-full border border-white bg-white shadow-2xs dark:border-zinc-800 dark:bg-zinc-800">
                                                                    <AvatarImage
                                                                        src={getContactAvatarUrl(
                                                                            contact,
                                                                        )}
                                                                        alt={
                                                                            contact.full_name
                                                                        }
                                                                        className="size-full object-cover"
                                                                    />
                                                                    <AvatarFallback className="bg-blue-50 text-[10px] font-bold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                                                                        {getInitials(
                                                                            contact.full_name,
                                                                        )}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <div className="min-w-0">
                                                                    <p className="truncate font-semibold text-slate-900 dark:text-white">
                                                                        {
                                                                            contact.full_name
                                                                        }
                                                                    </p>
                                                                    <p className="truncate text-[10px] text-slate-500 dark:text-zinc-400">
                                                                        {contact.job_title ??
                                                                            'Perwakilan Resmi Klien'}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="shrink-0 text-right text-xs">
                                                                <p className="text-slate-700 dark:text-zinc-300">
                                                                    {contact.email ??
                                                                        '-'}
                                                                </p>
                                                                <p className="font-mono text-[10px] text-slate-400">
                                                                    {contact.mobile ??
                                                                        ''}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        ) : (
                                            <p className="text-xs text-slate-400">
                                                Belum ada kontak perwakilan yang
                                                didaftarkan.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* TAB 2: MATTERS */}
                            {tab === 'Matters' && (
                                <div className="space-y-3 rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-white/[0.04]">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <Briefcase className="size-4 text-slate-700 dark:text-zinc-300" />
                                                <h2 className="text-xs font-bold text-slate-900 dark:text-white">
                                                    Daftar Perkara Hukum (
                                                    {allMatters.length})
                                                </h2>
                                            </div>
                                            <p className="mt-0.5 text-[11px] text-slate-500 dark:text-zinc-400">
                                                Seluruh riwayat penanganan
                                                perkara aktif maupun selesai.
                                            </p>
                                        </div>
                                        <Button
                                            size="sm"
                                            className="h-8 rounded-lg bg-slate-900 px-3 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 dark:bg-white dark:text-slate-900"
                                            asChild
                                        >
                                            <Link href={matterRoutes.create.url()}>
                                                <Plus className="mr-1 size-3" />
                                                Buat Matter
                                            </Link>
                                        </Button>
                                    </div>

                                    {allMatters.length ? (
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left text-xs">
                                                <thead>
                                                    <tr className="border-b border-slate-100 bg-slate-50/60 text-[10px] font-semibold text-slate-500 uppercase dark:border-white/[0.04] dark:bg-[#121418]">
                                                        <th className="py-2.5 pr-3 pl-3 font-semibold">
                                                            Perkara
                                                        </th>
                                                        <th className="px-3 py-2.5 font-semibold">
                                                            Area Praktik
                                                        </th>
                                                        <th className="px-3 py-2.5 text-center font-semibold">
                                                            Partner
                                                        </th>
                                                        <th className="px-3 py-2.5 font-semibold">
                                                            Diperbarui
                                                        </th>
                                                        <th className="px-3 py-2.5 font-semibold">
                                                            Status
                                                        </th>
                                                        <th className="py-2.5 pr-3 pl-1 text-right font-semibold"></th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                                                    {allMatters.map(
                                                        (matter) => (
                                                            <tr
                                                                key={matter.id}
                                                                className="group transition-colors hover:bg-slate-50/50 dark:hover:bg-white/[0.02]"
                                                            >
                                                                <td className="py-2.5 pr-3 pl-3">
                                                                    <Link
                                                                        href={matterRoutes.show.url(
                                                                            matter.id,
                                                                        )}
                                                                        className="font-semibold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400"
                                                                    >
                                                                        {
                                                                            matter.title
                                                                        }
                                                                        <span className="mt-0.5 block font-mono text-[10px] text-blue-600 dark:text-blue-400">
                                                                            {
                                                                                matter.matter_number
                                                                            }
                                                                        </span>
                                                                    </Link>
                                                                </td>
                                                                <td className="px-3 py-2.5 whitespace-nowrap">
                                                                    <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700 dark:bg-white/[0.06] dark:text-zinc-300">
                                                                        {matter
                                                                            .practice_area
                                                                            ?.name ??
                                                                            'Umum'}
                                                                    </span>
                                                                </td>
                                                                <td className="px-3 py-2.5 text-center whitespace-nowrap">
                                                                    {matter.responsible_partner ? (
                                                                        <TooltipProvider
                                                                            delayDuration={
                                                                                100
                                                                            }
                                                                        >
                                                                            <Tooltip>
                                                                                <TooltipTrigger
                                                                                    asChild
                                                                                >
                                                                                    <div className="inline-flex cursor-pointer items-center justify-center">
                                                                                        <Avatar className="size-6 rounded-full border border-slate-200/80 dark:border-white/10">
                                                                                            <AvatarImage
                                                                                                src={
                                                                                                    matter
                                                                                                        .responsible_partner
                                                                                                        .avatar_url ??
                                                                                                    undefined
                                                                                                }
                                                                                            />
                                                                                            <AvatarFallback className="text-[8px] font-bold">
                                                                                                {getInitials(
                                                                                                    matter
                                                                                                        .responsible_partner
                                                                                                        .name,
                                                                                                )}
                                                                                            </AvatarFallback>
                                                                                        </Avatar>
                                                                                    </div>
                                                                                </TooltipTrigger>
                                                                                <TooltipContent
                                                                                    side="top"
                                                                                    className="bg-slate-900 px-2.5 py-1 text-[10px] font-medium text-white shadow-md dark:bg-zinc-800"
                                                                                >
                                                                                    {
                                                                                        matter
                                                                                            .responsible_partner
                                                                                            .name
                                                                                    }
                                                                                </TooltipContent>
                                                                            </Tooltip>
                                                                        </TooltipProvider>
                                                                    ) : (
                                                                        <span className="text-slate-400">
                                                                            -
                                                                        </span>
                                                                    )}
                                                                </td>
                                                                <td className="px-3 py-2.5 font-mono text-[10px] whitespace-nowrap text-slate-500 dark:text-zinc-400">
                                                                    {formatDate(
                                                                        matter.updated_at,
                                                                    )}
                                                                </td>
                                                                <td className="px-3 py-2.5 whitespace-nowrap">
                                                                    <StatusText
                                                                        value={
                                                                            matter.status
                                                                        }
                                                                    />
                                                                </td>
                                                                <td className="py-2.5 pr-3 pl-1 text-right whitespace-nowrap">
                                                                    <Link
                                                                        href={matterRoutes.show.url(
                                                                            matter.id,
                                                                        )}
                                                                        className="inline-flex size-7 items-center justify-center rounded-lg text-slate-400 opacity-0 transition-all group-hover:opacity-100 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-white/[0.06] dark:hover:text-white"
                                                                    >
                                                                        <ChevronRight className="size-4" />
                                                                    </Link>
                                                                </td>
                                                            </tr>
                                                        ),
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="flex min-h-[200px] items-center justify-center p-6 text-center">
                                            <EmptyState title="Belum ada perkara terkait klien ini" />
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* TAB: LEGALITAS & KEPATUHAN KORPORASI */}
                            {tab === 'Legalitas' && (
                                <div className="space-y-4 rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                    <div className="flex flex-col justify-between gap-3 border-b border-slate-100 pb-3 sm:flex-row sm:items-center dark:border-white/[0.04]">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <Scale className="size-4 text-slate-700 dark:text-zinc-300" />
                                                <h2 className="text-xs font-bold text-slate-900 dark:text-white">
                                                    Legalitas Korporasi &amp;
                                                    Kepatuhan Izin (
                                                    {client.compliance_documents
                                                        ?.length ?? 0}
                                                    )
                                                </h2>
                                            </div>
                                            <p className="mt-0.5 text-[11px] text-slate-500 dark:text-zinc-400">
                                                Monitoring masa berlaku akta
                                                pendirian, susunan direksi, SK
                                                Menkumham, NIB OSS, dan izin
                                                operasional klien.
                                            </p>
                                        </div>

                                        {can.update && (
                                            <Button
                                                size="sm"
                                                onClick={() =>
                                                    setIsAddingCompliance(true)
                                                }
                                                className="h-8 rounded-lg bg-slate-900 px-3.5 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 active:scale-95 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                                            >
                                                <Plus className="mr-1.5 size-3.5" />
                                                Tambah Dokumen Legalitas
                                            </Button>
                                        )}
                                    </div>

                                    {/* 4 Symmetrical Metric Cards */}
                                    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                                        {/* 1. Total Dokumen */}
                                        <div className="group flex min-h-[88px] flex-col justify-between rounded-xl border border-slate-200/80 bg-slate-50/50 p-3 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.08] dark:bg-[#121418] dark:hover:border-white/15">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:text-zinc-400">
                                                    TOTAL DOKUMEN
                                                </span>
                                                <div className="flex size-6 items-center justify-center rounded-md bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                                                    <FileText className="size-3.5" />
                                                </div>
                                            </div>
                                            <div className="mt-2 flex items-baseline justify-between">
                                                <p className="font-mono text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                                                    {client.compliance_documents
                                                        ?.length ?? 0}
                                                </p>
                                                <span className="text-[10.5px] font-medium text-slate-400 dark:text-zinc-500">
                                                    berkas
                                                </span>
                                            </div>
                                        </div>

                                        {/* 2. Berlaku Aktif */}
                                        <div className="group flex min-h-[88px] flex-col justify-between rounded-xl border border-slate-200/80 bg-slate-50/50 p-3 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.08] dark:bg-[#121418] dark:hover:border-white/15">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:text-zinc-400">
                                                    BERLAKU AKTIF
                                                </span>
                                                <div className="flex size-6 items-center justify-center rounded-md bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                                                    <CheckCircle2 className="size-3.5" />
                                                </div>
                                            </div>
                                            <div className="mt-2 flex items-baseline justify-between">
                                                <p className="font-mono text-lg font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                                                    {client.compliance_documents?.filter(
                                                        (d) =>
                                                            d.compliance_status ===
                                                                'active' ||
                                                            d.compliance_status ===
                                                                'no_expiry',
                                                    ).length ?? 0}
                                                </p>
                                                <span className="text-[10.5px] font-medium text-slate-400 dark:text-zinc-500">
                                                    valid
                                                </span>
                                            </div>
                                        </div>

                                        {/* 3. Tenggat H-60 */}
                                        <div className="group flex min-h-[88px] flex-col justify-between rounded-xl border border-slate-200/80 bg-slate-50/50 p-3 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.08] dark:bg-[#121418] dark:hover:border-white/15">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:text-zinc-400">
                                                    TENGGAT H-60
                                                </span>
                                                <div className="flex size-6 items-center justify-center rounded-md bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
                                                    <Clock className="size-3.5" />
                                                </div>
                                            </div>
                                            <div className="mt-2 flex items-baseline justify-between">
                                                <p className="font-mono text-lg font-bold tracking-tight text-amber-600 dark:text-amber-400">
                                                    {client.compliance_documents?.filter(
                                                        (d) =>
                                                            d.compliance_status ===
                                                            'expiring_soon',
                                                    ).length ?? 0}
                                                </p>
                                                <span className="text-[10.5px] font-medium text-slate-400 dark:text-zinc-500">
                                                    perpanjang
                                                </span>
                                            </div>
                                        </div>

                                        {/* 4. Kedaluwarsa */}
                                        <div className="group flex min-h-[88px] flex-col justify-between rounded-xl border border-slate-200/80 bg-slate-50/50 p-3 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.08] dark:bg-[#121418] dark:hover:border-white/15">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:text-zinc-400">
                                                    KEDALUWARSA
                                                </span>
                                                <div className="flex size-6 items-center justify-center rounded-md bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
                                                    <AlertTriangle className="size-3.5" />
                                                </div>
                                            </div>
                                            <div className="mt-2 flex items-baseline justify-between">
                                                <p className="font-mono text-lg font-bold tracking-tight text-rose-600 dark:text-rose-400">
                                                    {client.compliance_documents?.filter(
                                                        (d) =>
                                                            d.compliance_status ===
                                                            'expired',
                                                    ).length ?? 0}
                                                </p>
                                                <span className="text-[10.5px] font-medium text-slate-400 dark:text-zinc-500">
                                                    expired
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {client.compliance_documents &&
                                    client.compliance_documents.length > 0 ? (
                                        <div className="space-y-2.5 pt-1">
                                            {client.compliance_documents.map(
                                                (doc) => {
                                                    return (
                                                        <div
                                                            key={doc.id}
                                                            className="group rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#16181d] dark:hover:border-white/10"
                                                        >
                                                            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                                                                <div className="min-w-0 flex-1 space-y-1.5">
                                                                    <div className="flex flex-wrap items-center gap-1.5">
                                                                        <span className="rounded-md bg-slate-900 px-2 py-0.5 font-mono text-[10px] font-bold text-white shadow-2xs dark:bg-white dark:text-slate-900">
                                                                            {complianceTypeLabels[
                                                                                doc
                                                                                    .document_type
                                                                            ] ??
                                                                                doc.document_type}
                                                                        </span>
                                                                        {doc.document_number && (
                                                                            <span className="rounded-md border border-slate-200/70 bg-slate-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-slate-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300">
                                                                                No:{' '}
                                                                                {
                                                                                    doc.document_number
                                                                                }
                                                                            </span>
                                                                        )}
                                                                        <StatusText
                                                                            value={
                                                                                doc.compliance_status
                                                                            }
                                                                            className="text-[10px]"
                                                                        />
                                                                    </div>

                                                                    <h4 className="text-xs leading-snug font-bold text-slate-900 dark:text-white">
                                                                        {
                                                                            doc.title
                                                                        }
                                                                    </h4>

                                                                    {doc.notes && (
                                                                        <p className="text-[11px] leading-relaxed text-slate-600 dark:text-zinc-400">
                                                                            {
                                                                                doc.notes
                                                                            }
                                                                        </p>
                                                                    )}

                                                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-[11px] text-slate-500 dark:text-zinc-400">
                                                                        {doc.issuer && (
                                                                            <span className="flex items-center gap-1.5 text-slate-700 dark:text-zinc-300">
                                                                                <Building2 className="size-3.5 text-slate-400" />
                                                                                <span>
                                                                                    Penerbit:{' '}
                                                                                    <strong>
                                                                                        {
                                                                                            doc.issuer
                                                                                        }
                                                                                    </strong>
                                                                                </span>
                                                                            </span>
                                                                        )}
                                                                        {doc.issued_at && (
                                                                            <span className="flex items-center gap-1.5 text-slate-700 dark:text-zinc-300">
                                                                                <Calendar className="size-3.5 text-slate-400" />
                                                                                <span>
                                                                                    Terbit:{' '}
                                                                                    <strong>
                                                                                        {formatDate(
                                                                                            doc.issued_at,
                                                                                        )}
                                                                                    </strong>
                                                                                </span>
                                                                            </span>
                                                                        )}
                                                                        {doc.expires_at && (
                                                                            <span
                                                                                className={`flex items-center gap-1.5 ${isExpired ? 'text-rose-700 dark:text-rose-400' : isExpiring ? 'text-amber-700 dark:text-amber-400' : 'text-slate-700 dark:text-zinc-300'}`}
                                                                            >
                                                                                <Clock className="size-3.5 text-slate-400" />
                                                                                <span>
                                                                                    Masa
                                                                                    Berlaku:{' '}
                                                                                    <strong>
                                                                                        {formatDate(
                                                                                            doc.expires_at,
                                                                                        )}
                                                                                    </strong>
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
                                                                                setEditingCompliance(
                                                                                    doc,
                                                                                )
                                                                            }
                                                                            className="h-7.5 cursor-pointer rounded-lg border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-[#121418] dark:text-zinc-300 dark:hover:bg-zinc-800"
                                                                        >
                                                                            Ubah
                                                                        </Button>
                                                                        <Button
                                                                            type="button"
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() =>
                                                                                setComplianceToDelete(
                                                                                    doc,
                                                                                )
                                                                            }
                                                                            className="size-7.5 p-0 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30 dark:hover:text-rose-400"
                                                                            title="Hapus Dokumen Legalitas"
                                                                        >
                                                                            <Trash2 className="size-3.5" />
                                                                        </Button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                },
                                            )}
                                        </div>
                                    ) : (
                                        <div className="flex min-h-[180px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-200/80 p-6 text-center dark:border-white/10">
                                            <FileBadge className="size-7 text-slate-300 dark:text-zinc-600" />
                                            <p className="mt-2 text-xs font-semibold text-slate-700 dark:text-zinc-300">
                                                Belum ada dokumen legalitas
                                                korporasi yang dicatat
                                            </p>
                                            <p className="mt-0.5 text-[11px] text-slate-400">
                                                Daftarkan Akta Pendirian, Akta
                                                Perubahan Direksi, NIB, atau SK
                                                Menkumham untuk memantau masa
                                                berlakunya.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* TAB 3: KONTAK */}
                            {tab === 'Kontak' && (
                                <div className="space-y-3 rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-white/[0.04]">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <ContactRound className="size-4 text-slate-700 dark:text-zinc-300" />
                                                <h2 className="text-xs font-bold text-slate-900 dark:text-white">
                                                    Daftar Kontak Perwakilan (
                                                    {client.contacts.length})
                                                </h2>
                                            </div>
                                            <p className="mt-0.5 text-[11px] text-slate-500 dark:text-zinc-400">
                                                Personil yang dapat dihubungi
                                                terkait administrasi dan
                                                komunikasi perkara.
                                            </p>
                                        </div>
                                        <Button
                                            type="button"
                                            size="sm"
                                            onClick={() =>
                                                setIsAddingContact(true)
                                            }
                                            className="h-8 cursor-pointer rounded-lg bg-slate-900 px-3 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 dark:bg-white dark:text-slate-900"
                                        >
                                            <Plus className="mr-1.5 size-3.5" />
                                            Tambah Kontak
                                        </Button>
                                    </div>

                                    {client.contacts.length ? (
                                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                            {client.contacts.map((contact) => (
                                                <div
                                                    key={contact.id}
                                                    className="flex flex-col justify-between rounded-xl border border-slate-200/70 bg-slate-50/60 p-3 text-xs transition-all hover:border-slate-300 hover:bg-white dark:border-white/[0.06] dark:bg-[#121418] dark:hover:bg-[#16181d]"
                                                >
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div className="flex min-w-0 items-start gap-2.5">
                                                            <Avatar className="size-9 shrink-0 overflow-hidden rounded-full border-2 border-white bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-800">
                                                                <AvatarImage
                                                                    src={getContactAvatarUrl(
                                                                        contact,
                                                                    )}
                                                                    alt={
                                                                        contact.full_name
                                                                    }
                                                                    className="size-full object-cover"
                                                                />
                                                                <AvatarFallback className="bg-blue-50 text-[10px] font-bold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                                                                    {getInitials(
                                                                        contact.full_name,
                                                                    )}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div className="min-w-0">
                                                                <h4 className="truncate font-semibold text-slate-900 dark:text-white">
                                                                    {
                                                                        contact.full_name
                                                                    }
                                                                </h4>
                                                                <p className="truncate text-[10px] text-slate-500 dark:text-zinc-400">
                                                                    {contact.job_title ??
                                                                        'Perwakilan Klien'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        {can.update && (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setContactToDelete(
                                                                        contact,
                                                                    )
                                                                }
                                                                className="shrink-0 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400"
                                                                title="Hapus Kontak"
                                                            >
                                                                <Trash2 className="size-3.5" />
                                                            </button>
                                                        )}
                                                    </div>

                                                    <div className="mt-3 space-y-1 border-t border-slate-100 pt-2 text-[10px] dark:border-white/[0.04]">
                                                        {contact.email && (
                                                            <a
                                                                href={`mailto:${contact.email}`}
                                                                className="flex items-center gap-1.5 text-blue-600 hover:underline dark:text-blue-400"
                                                            >
                                                                <Mail className="size-3 shrink-0" />
                                                                <span className="truncate">
                                                                    {
                                                                        contact.email
                                                                    }
                                                                </span>
                                                            </a>
                                                        )}
                                                        {contact.mobile && (
                                                            <a
                                                                href={`tel:${contact.mobile}`}
                                                                className="flex items-center gap-1.5 font-mono text-slate-600 hover:text-slate-900 dark:text-zinc-300 dark:hover:text-white"
                                                            >
                                                                <Phone className="size-3 shrink-0 text-slate-400" />
                                                                <span>
                                                                    {
                                                                        contact.mobile
                                                                    }
                                                                </span>
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex min-h-[220px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-200/80 bg-slate-50/50 p-8 text-center dark:border-white/10 dark:bg-white/[0.01]">
                                            <div className="mb-3 flex size-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                                                <Users className="size-5.5" />
                                            </div>
                                            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                                                Belum Ada Kontak Perwakilan
                                                Terdaftar
                                            </h4>
                                            <p className="mt-1 max-w-sm text-[11px] text-slate-500 dark:text-zinc-400">
                                                Tambahkan kontak personil
                                                perwakilan seperti Direksi,
                                                Legal Counsel, Finance, atau PIC
                                                operasional klien.
                                            </p>
                                            <Button
                                                type="button"
                                                size="sm"
                                                onClick={() =>
                                                    setIsAddingContact(true)
                                                }
                                                className="mt-4 h-8 cursor-pointer rounded-lg bg-slate-900 px-3.5 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 dark:bg-white dark:text-slate-900"
                                            >
                                                <Plus className="mr-1.5 size-3.5" />
                                                Tambah Kontak Person Baru
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* TAB 4: KEPATUHAN KYC & AML */}
                            {tab === 'KYC' && (
                                <div className="space-y-4 rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3 dark:border-white/[0.04]">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <ShieldCheck className="size-4 text-slate-700 dark:text-zinc-300" />
                                                <h2 className="text-xs font-bold text-slate-900 dark:text-white">
                                                    Kepatuhan KYC &amp;
                                                    Anti-Money Laundering (PMPJ)
                                                </h2>
                                            </div>
                                            <p className="mt-0.5 text-[11px] text-slate-500 dark:text-zinc-400">
                                                Prinsip Mengenali Pengguna Jasa
                                                (PMPJ) dan penilaian risiko
                                                kepatuhan hukum.
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <StatusText
                                                value={
                                                    client.kyc_status ??
                                                    'verified'
                                                }
                                                className="text-[10px]"
                                            />

                                            {can.update && (
                                                <ClientEditDialog
                                                    client={client}
                                                    partners={partners}
                                                    trigger={
                                                        <Button
                                                            size="sm"
                                                            className="h-8 cursor-pointer rounded-lg bg-slate-900 px-3 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 active:scale-95 dark:bg-white dark:text-slate-900"
                                                        >
                                                            <Pencil className="mr-1 size-3" />
                                                            Perbarui KYC
                                                        </Button>
                                                    }
                                                />
                                            )}
                                        </div>
                                    </div>

                                    {/* AML Risk & Verification Summary Card */}
                                    <div className="grid gap-2.5 sm:grid-cols-3">
                                        <div className="flex min-h-[84px] flex-col justify-between rounded-xl border border-slate-200/80 bg-slate-50/50 p-3 shadow-2xs dark:border-white/[0.08] dark:bg-[#121418]">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:text-zinc-400">
                                                    PROFIL RISIKO AML
                                                </span>
                                                <Shield className="size-3.5 text-slate-400 dark:text-zinc-500" />
                                            </div>
                                            <p
                                                className={`mt-2 text-xs font-bold ${
                                                    client.kyc_risk_level ===
                                                    'high'
                                                        ? 'text-rose-600 dark:text-rose-400'
                                                        : client.kyc_risk_level ===
                                                            'medium'
                                                          ? 'text-amber-600 dark:text-amber-400'
                                                          : 'text-emerald-600 dark:text-emerald-400'
                                                }`}
                                            >
                                                {client.kyc_risk_level ===
                                                'high'
                                                    ? 'Risiko Tinggi (EDD)'
                                                    : client.kyc_risk_level ===
                                                        'medium'
                                                      ? 'Risiko Menengah'
                                                      : 'Risiko Rendah (Standar)'}
                                            </p>
                                        </div>
                                        <div className="flex min-h-[84px] flex-col justify-between rounded-xl border border-slate-200/80 bg-slate-50/50 p-3 shadow-2xs dark:border-white/[0.08] dark:bg-[#121418]">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:text-zinc-400">
                                                    PARTNER PENILAI KYC
                                                </span>
                                                <ShieldCheck className="size-3.5 text-slate-400 dark:text-zinc-500" />
                                            </div>
                                            <p className="mt-2 truncate text-xs font-bold text-slate-900 dark:text-white">
                                                {client.kyc_assessed_by_user
                                                    ?.name ??
                                                    client.relationship_partner
                                                        ?.name ??
                                                    'Managing Partner'}
                                            </p>
                                        </div>
                                        <div className="flex min-h-[84px] flex-col justify-between rounded-xl border border-slate-200/80 bg-slate-50/50 p-3 shadow-2xs dark:border-white/[0.08] dark:bg-[#121418]">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:text-zinc-400">
                                                    YURISDIKSI
                                                </span>
                                                <Globe className="size-3.5 text-slate-400 dark:text-zinc-500" />
                                            </div>
                                            <p className="mt-2 font-mono text-xs font-bold text-slate-900 dark:text-white">
                                                {client.country_code} (
                                                {client.city ?? 'Indonesia'})
                                            </p>
                                        </div>
                                    </div>

                                    {/* KYC Assessment Notes */}
                                    <div className="rounded-lg border border-slate-200/70 bg-slate-50/60 p-3 dark:border-white/[0.04] dark:bg-[#121418]">
                                        <span className="text-[10px] font-semibold text-slate-500 uppercase dark:text-zinc-400">
                                            CATATAN UJI TUNTAS &amp; BENEFICIAL
                                            OWNERSHIP
                                        </span>
                                        <p className="mt-1 text-xs leading-relaxed text-slate-800 dark:text-zinc-200">
                                            {client.kyc_notes ??
                                                client.notes ??
                                                'Klien terverifikasi resmi. Berkas KYC dan Beneficial Ownership telah ditelaah manual.'}
                                        </p>
                                    </div>

                                    {/* Statutory Documents Checklist */}
                                    <div className="space-y-2 pt-1">
                                        <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                                            Kelengkapan Berkas Legalitas &amp;
                                            Dokumen Korporasi
                                        </h3>
                                        <div className="space-y-1.5">
                                            {[
                                                {
                                                    key: 'director_id',
                                                    label: 'Kartu Identitas Direksi & Penanggung Jawab (KTP / Paspor)',
                                                },
                                                {
                                                    key: 'tax_id',
                                                    label: 'Nomor Pokok Wajib Pajak (NPWP Korporasi / Perorangan)',
                                                },
                                                {
                                                    key: 'business_license',
                                                    label: 'Nomor Induk Berusaha (NIB) / Izin Usaha Sektoral',
                                                },
                                                {
                                                    key: 'incorporation_deed',
                                                    label: 'Akta Pendirian Perusahaan & SK Kemenkumham',
                                                },
                                                {
                                                    key: 'articles_amendment',
                                                    label: 'Akta Perubahan Anggaran Dasar (Beneficial Ownership)',
                                                },
                                                {
                                                    key: 'aml_declaration',
                                                    label: 'Formulir Deklarasi Kepatuhan AML (AML Statement)',
                                                },
                                            ].map((doc) => {
                                                const isChecked =
                                                    client.kyc_checklist
                                                        ? Boolean(
                                                              client
                                                                  .kyc_checklist[
                                                                  doc.key
                                                              ],
                                                          )
                                                        : true;

                                                return (
                                                    <div
                                                        key={doc.key}
                                                        className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/50 px-3 py-2 text-xs dark:border-white/[0.04] dark:bg-white/[0.02]"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            {isChecked ? (
                                                                <ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                                                            ) : (
                                                                <ShieldAlert className="size-3.5 text-amber-500" />
                                                            )}
                                                            <span
                                                                className={`text-xs ${
                                                                    isChecked
                                                                        ? 'text-slate-800 dark:text-zinc-200'
                                                                        : 'text-slate-500 dark:text-zinc-400'
                                                                }`}
                                                            >
                                                                {doc.label}
                                                            </span>
                                                        </div>
                                                        <StatusText
                                                            value={
                                                                isChecked
                                                                    ? 'complete'
                                                                    : 'incomplete'
                                                            }
                                                            className="font-mono text-[10px]"
                                                        />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB 5: DOKUMEN */}
                            {tab === 'Dokumen' && (
                                <div className="space-y-3 rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-white/[0.04]">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <FileText className="size-4 text-slate-700 dark:text-zinc-300" />
                                                <h2 className="text-xs font-bold text-slate-900 dark:text-white">
                                                    Dokumen Terkait Klien (
                                                    {documents.length})
                                                </h2>
                                            </div>
                                            <p className="mt-0.5 text-[11px] text-slate-500 dark:text-zinc-400">
                                                Arsip legalitas, surat kuasa,
                                                dan dokumen perkara terkait.
                                            </p>
                                        </div>
                                        <Button
                                            type="button"
                                            size="sm"
                                            onClick={() =>
                                                setIsUploadingDocument(true)
                                            }
                                            className="h-8 cursor-pointer rounded-lg bg-slate-900 px-3 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 dark:bg-white dark:text-slate-900"
                                        >
                                            <FileUp className="mr-1.5 size-3.5" />
                                            Unggah Dokumen
                                        </Button>
                                    </div>

                                    {documents.length ? (
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
                                                        <th className="py-2.5 pr-3 pl-1 text-right font-semibold"></th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                                                    {documents.map((doc) => (
                                                        <tr
                                                            key={doc.id}
                                                            className="group transition-colors hover:bg-slate-50/50 dark:hover:bg-white/[0.02]"
                                                        >
                                                            <td className="py-2.5 pr-3 pl-3">
                                                                <div className="flex items-center gap-2.5">
                                                                    <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                                                                        <FileText className="size-3.5" />
                                                                    </div>
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
                                                                                'Dokumen Legalitas'}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-3 py-2.5 whitespace-nowrap">
                                                                <span className="font-mono text-[10px] font-semibold text-slate-700 dark:text-zinc-300">
                                                                    v
                                                                    {doc
                                                                        .current_version
                                                                        ?.version_number ??
                                                                        1}
                                                                    .0
                                                                </span>
                                                            </td>
                                                            <td className="px-3 py-2.5 font-mono text-[10px] whitespace-nowrap text-slate-500 dark:text-zinc-400">
                                                                {formatBytes(
                                                                    doc
                                                                        .current_version
                                                                        ?.file_size,
                                                                )}
                                                            </td>
                                                            <td className="px-3 py-2.5 font-mono text-[10px] whitespace-nowrap text-slate-500 dark:text-zinc-400">
                                                                {formatDate(
                                                                    doc.updated_at,
                                                                )}
                                                            </td>
                                                            <td className="px-3 py-2.5 whitespace-nowrap">
                                                                <StatusText
                                                                    value={
                                                                        doc.status
                                                                    }
                                                                />
                                                            </td>
                                                            <td className="py-2.5 pr-3 pl-1 text-right whitespace-nowrap">
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    className="h-7 px-2 text-xs font-semibold text-blue-600 hover:bg-blue-50 dark:text-blue-400"
                                                                    asChild
                                                                >
                                                                    <Link
                                                                        href={documentRoutes.show.url(
                                                                            doc.id,
                                                                        )}
                                                                    >
                                                                        Buka
                                                                        <ChevronRight className="ml-0.5 size-3" />
                                                                    </Link>
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="flex min-h-[220px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-200/80 bg-slate-50/50 p-8 text-center dark:border-white/10 dark:bg-white/[0.01]">
                                            <div className="mb-3 flex size-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                                                <FileText className="size-5.5" />
                                            </div>
                                            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                                                Belum Ada Dokumen Terkait Klien
                                            </h4>
                                            <p className="mt-1 max-w-sm text-[11px] text-slate-500 dark:text-zinc-400">
                                                Unggah berkas perjanjian, surat
                                                kuasa, berkas permohonan, atau
                                                dokumen perkara yang terafiliasi
                                                dengan klien ini.
                                            </p>
                                            <Button
                                                type="button"
                                                size="sm"
                                                onClick={() =>
                                                    setIsUploadingDocument(true)
                                                }
                                                className="mt-4 h-8 cursor-pointer rounded-lg bg-slate-900 px-3.5 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 dark:bg-white dark:text-slate-900"
                                            >
                                                <FileUp className="mr-1.5 size-3.5" />
                                                Unggah Dokumen Klien
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Sisi Kanan: Inspector Panel (4 Columns) */}
                        <div className="space-y-4 lg:col-span-4">
                            {/* Legalitas & Kontak Perusahaan */}
                            <div className="rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                <div className="mb-3 flex items-center gap-1.5 text-slate-500 dark:text-zinc-400">
                                    <Building2 className="size-3.5 text-slate-400" />
                                    <span className="text-[11px] font-semibold uppercase">
                                        Legalitas &amp; Kontak Perusahaan
                                    </span>
                                </div>
                                <div className="space-y-2.5 text-xs">
                                    {client.tax_identifier && (
                                        <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2 dark:border-white/[0.04]">
                                            <span className="text-slate-500 dark:text-zinc-400">
                                                NPWP / Tax ID
                                            </span>
                                            <button
                                                type="button"
                                                onClick={handleCopyTax}
                                                className="group inline-flex items-center gap-1 font-mono font-semibold text-slate-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
                                            >
                                                <span>
                                                    {client.tax_identifier}
                                                </span>
                                                <Copy className="size-3 text-slate-400 group-hover:text-blue-600" />
                                            </button>
                                        </div>
                                    )}

                                    {client.registration_identifier && (
                                        <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2 dark:border-white/[0.04]">
                                            <span className="text-slate-500 dark:text-zinc-400">
                                                No. NIB / AHU
                                            </span>
                                            <span className="font-mono font-semibold text-slate-900 dark:text-white">
                                                {client.registration_identifier}
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2 dark:border-white/[0.04]">
                                        <span className="text-slate-500 dark:text-zinc-400">
                                            Email Resmi
                                        </span>
                                        {client.email ? (
                                            <a
                                                href={`mailto:${client.email}`}
                                                className="font-semibold text-blue-600 hover:underline dark:text-blue-400"
                                            >
                                                {client.email}
                                            </a>
                                        ) : (
                                            <span className="text-slate-400">
                                                -
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2 dark:border-white/[0.04]">
                                        <span className="text-slate-500 dark:text-zinc-400">
                                            Telepon
                                        </span>
                                        {client.phone ? (
                                            <a
                                                href={`tel:${client.phone}`}
                                                className="font-mono font-semibold text-slate-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
                                            >
                                                {client.phone}
                                            </a>
                                        ) : (
                                            <span className="text-slate-400">
                                                -
                                            </span>
                                        )}
                                    </div>

                                    {client.website && (
                                        <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2 dark:border-white/[0.04]">
                                            <span className="text-slate-500 dark:text-zinc-400">
                                                Website
                                            </span>
                                            <a
                                                href={
                                                    client.website.startsWith(
                                                        'http',
                                                    )
                                                        ? client.website
                                                        : `https://${client.website}`
                                                }
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:underline dark:text-blue-400"
                                            >
                                                {client.website.replace(
                                                    /^https?:\/\//,
                                                    '',
                                                )}
                                                <ExternalLink className="size-3" />
                                            </a>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between gap-2 pt-0.5">
                                        <span className="text-slate-500 dark:text-zinc-400">
                                            Status Klien
                                        </span>
                                        <StatusText value={client.status} />
                                    </div>
                                </div>
                            </div>

                            {/* Alamat & Domisili */}
                            <div className="rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                <div className="mb-2 flex items-center gap-1.5 text-slate-500 dark:text-zinc-400">
                                    <MapPin className="size-3.5 text-slate-400" />
                                    <span className="text-[11px] font-semibold uppercase">
                                        Alamat &amp; Domisili
                                    </span>
                                </div>
                                <div className="space-y-1 text-xs text-slate-700 dark:text-zinc-200">
                                    <p className="font-semibold text-slate-900 dark:text-white">
                                        {client.address_line_1 || '-'}
                                    </p>
                                    {client.address_line_2 && (
                                        <p className="text-slate-500 dark:text-zinc-400">
                                            {client.address_line_2}
                                        </p>
                                    )}
                                    <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                                        {[
                                            client.city,
                                            client.province,
                                            client.postal_code,
                                            client.country_code,
                                        ]
                                            .filter(Boolean)
                                            .join(', ')}
                                    </p>
                                </div>
                            </div>

                            {/* Berkas Legalitas Terkini */}
                            <div className="rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                <div className="mb-3 flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-zinc-400">
                                        <FileText className="size-3.5 text-slate-400" />
                                        <span className="text-[11px] font-semibold uppercase">
                                            Berkas Legalitas ({documents.length}
                                            )
                                        </span>
                                    </div>
                                    {documents.length > 0 && (
                                        <button
                                            onClick={() => setTab('Dokumen')}
                                            className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
                                        >
                                            Semua Berkas
                                        </button>
                                    )}
                                </div>

                                {documents.length > 0 ? (
                                    <div className="space-y-1.5">
                                        {documents.slice(0, 3).map((doc) => (
                                            <Link
                                                key={doc.id}
                                                href={documentRoutes.show.url(
                                                    doc.id,
                                                )}
                                                className="group flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/50 p-2.5 transition-all hover:border-slate-200 hover:bg-white dark:border-white/[0.04] dark:bg-[#121418] dark:hover:bg-[#16181d]"
                                            >
                                                <div className="flex min-w-0 items-center gap-2">
                                                    <FileText className="size-3.5 shrink-0 text-blue-600 dark:text-blue-400" />
                                                    <span className="truncate text-xs font-medium text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
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
                                    <p className="text-xs text-slate-400">
                                        Belum ada dokumen legalitas terlampir.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Modal Tambah Kontak Perwakilan */}
            <AddContactModal
                isOpen={isAddingContact}
                onClose={() => setIsAddingContact(false)}
                clientId={client.id}
                clientName={client.display_name}
            />

            {/* Modal Unggah Dokumen Terkait Klien */}
            <UploadClientDocModal
                isOpen={isUploadingDocument}
                onClose={() => setIsUploadingDocument(false)}
                clientId={client.id}
                clientName={client.display_name}
                matters={allMatters}
            />

            {/* Modal Tambah Dokumen Legalitas */}
            {isAddingCompliance && (
                <ComplianceDocumentDialog
                    clientId={client.id}
                    onClose={() => setIsAddingCompliance(false)}
                />
            )}

            {/* Modal Edit Dokumen Legalitas */}
            {editingCompliance && (
                <ComplianceDocumentDialog
                    clientId={client.id}
                    document={editingCompliance}
                    onClose={() => setEditingCompliance(null)}
                />
            )}

            {/* Modal Konfirmasi Hapus Dokumen Legalitas */}
            <ConfirmDialog
                open={!!complianceToDelete}
                onOpenChange={(open) => !open && setComplianceToDelete(null)}
                title="Hapus Dokumen Legalitas"
                description={
                    complianceToDelete
                        ? `Apakah Anda yakin ingin menghapus pencatatan dokumen "${complianceToDelete.title}"? Tindakan ini akan dicatat dalam riwayat audit kepatuhan.`
                        : ''
                }
                confirmLabel="Hapus Dokumen"
                variant="danger"
                processing={isDeletingCompliance}
                onConfirm={() => {
                    if (!complianceToDelete) return;
                    setIsDeletingCompliance(true);
                    router.delete(
                        `/clients/${client.id}/compliance-documents/${complianceToDelete.id}`,
                        {
                            onFinish: () => {
                                setIsDeletingCompliance(false);
                                setComplianceToDelete(null);
                            },
                        },
                    );
                }}
            />

            {/* Modal Konfirmasi Hapus Kontak Perwakilan */}
            <ConfirmDialog
                open={!!contactToDelete}
                onOpenChange={(open) => !open && setContactToDelete(null)}
                title="Hapus Kontak Perwakilan"
                description={
                    contactToDelete
                        ? `Apakah Anda yakin ingin menghapus kontak "${contactToDelete.full_name}" dari daftar kontak perwakilan klien ini?`
                        : ''
                }
                confirmLabel="Hapus Kontak"
                variant="danger"
                processing={isDeletingContact}
                onConfirm={() => {
                    if (!contactToDelete) return;
                    setIsDeletingContact(true);
                    router.delete(`/contacts/${contactToDelete.id}`, {
                        onFinish: () => {
                            setIsDeletingContact(false);
                            setContactToDelete(null);
                        },
                    });
                }}
            />
        </>
    );
}

function ComplianceDocumentDialog({
    clientId,
    document,
    onClose,
}: {
    clientId: string;
    document?: ComplianceDocument;
    onClose: () => void;
}) {
    const isEdit = !!document;
    const action = isEdit
        ? `/clients/${clientId}/compliance-documents/${document.id}`
        : `/clients/${clientId}/compliance-documents`;
    const method = isEdit ? ('put' as const) : ('post' as const);

    return (
        <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-h-[85vh] overflow-y-auto rounded-xl border border-slate-200/80 bg-white p-4 shadow-xl sm:max-w-lg dark:border-white/10 dark:bg-[#16181d]">
                <DialogHeader className="border-b border-slate-100 pb-2.5 dark:border-white/[0.04]">
                    <div className="flex items-center gap-2.5">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                            <FileBadge className="size-4" />
                        </div>
                        <div>
                            <DialogTitle className="text-sm font-bold text-slate-900 dark:text-white">
                                {isEdit
                                    ? 'Ubah Dokumen Legalitas'
                                    : 'Catat Dokumen Legalitas Baru'}
                            </DialogTitle>
                            <DialogDescription className="text-xs text-slate-500 dark:text-zinc-400">
                                {isEdit
                                    ? `Perbarui rincian atau masa berlaku ${document.document_number}`
                                    : 'Daftarkan akta pendirian, izin usaha, NIB, atau SK Kemenkumham'}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <Form
                    action={action}
                    method={method}
                    className="space-y-3 pt-1"
                    onSuccess={onClose}
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-1">
                                <Label
                                    htmlFor="document_type"
                                    className="text-xs font-semibold text-slate-700 dark:text-zinc-300"
                                >
                                    Jenis Dokumen Legalitas
                                </Label>
                                <div className="relative">
                                    <select
                                        name="document_type"
                                        id="document_type"
                                        defaultValue={
                                            document?.document_type ??
                                            'deed_establishment'
                                        }
                                        className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-slate-50/70 pr-7 pl-2.5 text-xs font-medium text-slate-900 outline-hidden hover:bg-slate-100 focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-zinc-200"
                                    >
                                        <option value="deed_establishment">
                                            Akta Pendirian Perusahaan
                                        </option>
                                        <option value="deed_amendment_directors">
                                            Akta Perubahan Direksi / Saham
                                        </option>
                                        <option value="nib">
                                            Nomor Induk Berusaha (NIB OSS)
                                        </option>
                                        <option value="sk_menkumham">
                                            SK Pengesahan Kemenkumham
                                        </option>
                                        <option value="kbli_license">
                                            Izin Usaha KBLI / Sektoral
                                        </option>
                                        <option value="amdal_environmental">
                                            AMDAL / Izin Lingkungan
                                        </option>
                                        <option value="trademark_ip">
                                            Sertifikat Merek & HKI
                                        </option>
                                        <option value="tax_id">
                                            Surat Keterangan Pajak (SKT)
                                        </option>
                                        <option value="other">
                                            Dokumen Legalitas Lainnya
                                        </option>
                                    </select>
                                    <ChevronDown className="pointer-events-none absolute top-1/2 right-2 size-3 -translate-y-1/2 text-slate-400" />
                                </div>
                            </div>

                            <div className="grid gap-2 sm:grid-cols-2">
                                <div className="grid gap-1">
                                    <Label
                                        htmlFor="document_number"
                                        className="text-xs font-semibold text-slate-700 dark:text-zinc-300"
                                    >
                                        Nomor Dokumen / Akta
                                    </Label>
                                    <Input
                                        id="document_number"
                                        name="document_number"
                                        defaultValue={
                                            document?.document_number ?? ''
                                        }
                                        required
                                        placeholder="Contoh: No. 14 Tanggal 05-01-2024"
                                        className="h-8 rounded-lg border-slate-200 bg-slate-50/70 text-xs text-slate-900 focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
                                    />
                                </div>
                                <div className="grid gap-1">
                                    <Label
                                        htmlFor="issuer"
                                        className="text-xs font-semibold text-slate-700 dark:text-zinc-300"
                                    >
                                        Instansi / Notaris Penerbit
                                    </Label>
                                    <Input
                                        id="issuer"
                                        name="issuer"
                                        defaultValue={document?.issuer ?? ''}
                                        placeholder="Contoh: Notaris Sugeng, S.H. / BKPM"
                                        className="h-8 rounded-lg border-slate-200 bg-slate-50/70 text-xs text-slate-900 focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-1">
                                <Label
                                    htmlFor="title"
                                    className="text-xs font-semibold text-slate-700 dark:text-zinc-300"
                                >
                                    Judul / Nama Dokumen
                                </Label>
                                <Input
                                    id="title"
                                    name="title"
                                    defaultValue={document?.title ?? ''}
                                    required
                                    placeholder="Contoh: Akta Perubahan Masa Jabatan Direksi & Komisaris"
                                    className="h-8 rounded-lg border-slate-200 bg-slate-50/70 text-xs text-slate-900 focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
                                />
                            </div>

                            <div className="grid gap-2 sm:grid-cols-2">
                                <div className="grid gap-1">
                                    <Label
                                        htmlFor="issued_at"
                                        className="text-xs font-semibold text-slate-700 dark:text-zinc-300"
                                    >
                                        Tanggal Diterbitkan
                                    </Label>
                                    <Input
                                        id="issued_at"
                                        name="issued_at"
                                        type="date"
                                        defaultValue={
                                            document?.issued_at
                                                ? document.issued_at.slice(
                                                      0,
                                                      10,
                                                  )
                                                : ''
                                        }
                                        className="h-8 rounded-lg border-slate-200 bg-slate-50/70 text-xs text-slate-900 focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
                                    />
                                </div>
                                <div className="grid gap-1">
                                    <Label
                                        htmlFor="expires_at"
                                        className="text-xs font-semibold text-slate-700 dark:text-zinc-300"
                                    >
                                        Tanggal Kedaluwarsa (Masa Berlaku)
                                    </Label>
                                    <Input
                                        id="expires_at"
                                        name="expires_at"
                                        type="date"
                                        defaultValue={
                                            document?.expires_at
                                                ? document.expires_at.slice(
                                                      0,
                                                      10,
                                                  )
                                                : ''
                                        }
                                        className="h-8 rounded-lg border-slate-200 bg-slate-50/70 text-xs text-slate-900 focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-1">
                                <Label
                                    htmlFor="notes"
                                    className="text-xs font-semibold text-slate-700 dark:text-zinc-300"
                                >
                                    Catatan / Keterangan Legalitas
                                </Label>
                                <textarea
                                    id="notes"
                                    name="notes"
                                    defaultValue={document?.notes ?? ''}
                                    rows={2}
                                    className="rounded-lg border border-slate-200 bg-slate-50/70 p-2 text-xs leading-relaxed text-slate-900 outline-hidden focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
                                    placeholder="Keterangan pasal penting, klausula pembatasan direksi..."
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
                                    ) : isEdit ? (
                                        'Perbarui Dokumen'
                                    ) : (
                                        'Simpan Dokumen'
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

function AvatarPicker({
    value,
    onChange,
    contactName = 'Kontak',
}: {
    value: string;
    onChange: (url: string) => void;
    contactName?: string;
}) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-3 transition-all dark:border-white/10 dark:bg-[#121418]">
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div
                        className="group relative cursor-pointer"
                        onClick={() => setIsOpen(!isOpen)}
                        title="Klik untuk membuka pilihan avatar"
                    >
                        <Avatar className="size-11 shrink-0 overflow-hidden rounded-full border-2 border-white bg-white shadow-xs ring-1 ring-slate-200/80 transition-transform group-hover:scale-105 dark:border-zinc-800 dark:bg-zinc-800 dark:ring-white/10">
                            <AvatarImage
                                src={value || '/images/avatars/avatar-1.svg'}
                                alt={contactName}
                                className="size-full object-cover"
                            />
                            <AvatarFallback className="bg-blue-50 text-xs font-bold text-blue-700">
                                {getInitials(contactName)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                            <Pencil className="size-3 text-white" />
                        </div>
                    </div>
                    <div>
                        <Label
                            className="cursor-pointer text-xs font-bold text-slate-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            Foto Profil Kontak
                        </Label>
                        <p className="mt-0.5 text-[11px] text-slate-500 dark:text-zinc-400">
                            {isOpen
                                ? 'Pilih salah satu karakter di bawah'
                                : 'Avatar 3D aktif · Klik untuk mengganti'}
                        </p>
                    </div>
                </div>

                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsOpen(!isOpen)}
                    className={`h-7.5 gap-1.5 rounded-lg border-slate-200 px-2.5 text-xs font-medium transition-colors hover:bg-slate-100 dark:border-white/10 dark:hover:bg-zinc-800 ${
                        isOpen
                            ? 'border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-400'
                            : 'text-slate-700 dark:text-zinc-300'
                    }`}
                >
                    <Camera className="size-3.5 text-blue-600 dark:text-blue-400" />
                    <span>{isOpen ? 'Tutup' : 'Pilih Avatar'}</span>
                    <ChevronDown
                        className={`size-3 text-slate-400 transition-transform duration-200 ${
                            isOpen ? 'rotate-180 text-blue-500' : ''
                        }`}
                    />
                </Button>
            </div>

            {isOpen && (
                <div className="mt-2.5 border-t border-slate-200/70 pt-2.5 dark:border-white/[0.06]">
                    <div className="mb-2 flex items-center justify-between px-0.5">
                        <span className="text-[11px] font-semibold text-slate-600 dark:text-zinc-300">
                            Koleksi Karakter 3D (1 - 15):
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-zinc-500">
                            Klik untuk memilih
                        </span>
                    </div>
                    <div className="grid grid-cols-5 gap-1.5 rounded-lg bg-slate-100/60 p-1.5 sm:grid-cols-8 dark:bg-zinc-900/60">
                        {AVAILABLE_AVATARS.map((avatar, idx) => {
                            const isSelected =
                                value === avatar.url || (!value && idx === 0);
                            return (
                                <button
                                    key={avatar.id}
                                    type="button"
                                    onClick={() => {
                                        onChange(avatar.url);
                                    }}
                                    className={`group relative flex size-9 items-center justify-center rounded-full p-0.5 transition-all sm:size-9.5 ${
                                        isSelected
                                            ? 'scale-105 bg-white shadow-xs ring-2 ring-blue-600 ring-offset-2 dark:bg-blue-950 dark:ring-offset-[#121418]'
                                            : 'opacity-75 hover:scale-105 hover:bg-white/80 hover:opacity-100 dark:hover:bg-zinc-800'
                                    }`}
                                    title={`Avatar ${idx + 1}`}
                                >
                                    <img
                                        src={avatar.url}
                                        alt={avatar.label}
                                        className="size-full rounded-full object-cover shadow-2xs"
                                    />
                                    {isSelected && (
                                        <span className="absolute -right-0.5 -bottom-0.5 flex size-3.5 items-center justify-center rounded-full bg-blue-600 text-white shadow-xs">
                                            <Check className="size-2.5 stroke-[3]" />
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

function AddContactModal({
    isOpen,
    onClose,
    clientId,
    clientName,
}: {
    isOpen: boolean;
    onClose: () => void;
    clientId: string;
    clientName: string;
}) {
    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            client_id: clientId,
            first_name: '',
            last_name: '',
            job_title: '',
            organization_name: clientName,
            email: '',
            phone: '',
            mobile: '',
            avatar_url: '/images/avatars/avatar-1.svg',
            notes: '',
        });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/contacts', {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) {
                    reset();
                    clearErrors();
                    onClose();
                }
            }}
        >
            <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xl sm:max-w-lg dark:border-white/10 dark:bg-[#14161b]">
                <DialogHeader className="border-b border-slate-100 pb-3.5 dark:border-white/[0.06]">
                    <div className="flex items-center gap-2.5">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                            <ContactRound className="size-4.5" />
                        </div>
                        <div>
                            <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
                                Tambah Kontak Perwakilan
                            </DialogTitle>
                            <DialogDescription className="text-xs text-slate-500 dark:text-zinc-400">
                                Daftarkan PIC, Direksi, Legal Officer, atau
                                Perwakilan Resmi untuk {clientName}.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-3.5 pt-1">
                    {/* Avatar Selector */}
                    <AvatarPicker
                        value={data.avatar_url}
                        onChange={(url) => setData('avatar_url', url)}
                        contactName={
                            data.first_name
                                ? `${data.first_name} ${data.last_name}`
                                : 'Kontak Perwakilan'
                        }
                    />

                    <div className="grid gap-2.5 sm:grid-cols-2">
                        <div className="grid gap-1">
                            <Label
                                htmlFor="first_name"
                                className="text-xs font-semibold text-slate-700 dark:text-zinc-200"
                            >
                                Nama Depan{' '}
                                <span className="text-rose-500">*</span>
                            </Label>
                            <Input
                                id="first_name"
                                value={data.first_name}
                                onChange={(e) =>
                                    setData('first_name', e.target.value)
                                }
                                placeholder="Contoh: Hendra / Siti"
                                required
                                className="h-8 rounded-lg border-slate-200 bg-slate-50/70 text-xs text-slate-900 focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
                            />
                            {errors.first_name && (
                                <p className="text-[11px] text-rose-500">
                                    {errors.first_name}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-1">
                            <Label
                                htmlFor="last_name"
                                className="text-xs font-semibold text-slate-700 dark:text-zinc-200"
                            >
                                Nama Belakang
                            </Label>
                            <Input
                                id="last_name"
                                value={data.last_name}
                                onChange={(e) =>
                                    setData('last_name', e.target.value)
                                }
                                placeholder="Contoh: Wijaya / Rahmawati"
                                className="h-8 rounded-lg border-slate-200 bg-slate-50/70 text-xs text-slate-900 focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
                            />
                            {errors.last_name && (
                                <p className="text-[11px] text-rose-500">
                                    {errors.last_name}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-2.5 sm:grid-cols-2">
                        <div className="grid gap-1">
                            <Label
                                htmlFor="job_title"
                                className="text-xs font-semibold text-slate-700 dark:text-zinc-200"
                            >
                                Jabatan / Posisi
                            </Label>
                            <Input
                                id="job_title"
                                value={data.job_title}
                                onChange={(e) =>
                                    setData('job_title', e.target.value)
                                }
                                placeholder="Contoh: Direktur Utama / Legal Counsel"
                                className="h-8 rounded-lg border-slate-200 bg-slate-50/70 text-xs text-slate-900 focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
                            />
                            {errors.job_title && (
                                <p className="text-[11px] text-rose-500">
                                    {errors.job_title}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-1">
                            <Label
                                htmlFor="organization_name"
                                className="text-xs font-semibold text-slate-700 dark:text-zinc-200"
                            >
                                Nama Instansi / Perusahaan
                            </Label>
                            <Input
                                id="organization_name"
                                value={data.organization_name}
                                onChange={(e) =>
                                    setData('organization_name', e.target.value)
                                }
                                placeholder="Nama perusahaan"
                                className="h-8 rounded-lg border-slate-200 bg-slate-50/70 text-xs text-slate-900 focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
                            />
                            {errors.organization_name && (
                                <p className="text-[11px] text-rose-500">
                                    {errors.organization_name}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-2.5 sm:grid-cols-2">
                        <div className="grid gap-1">
                            <Label
                                htmlFor="email"
                                className="text-xs font-semibold text-slate-700 dark:text-zinc-200"
                            >
                                Alamat Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                                placeholder="nama@perusahaan.co.id"
                                className="h-8 rounded-lg border-slate-200 bg-slate-50/70 text-xs text-slate-900 focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
                            />
                            {errors.email && (
                                <p className="text-[11px] text-rose-500">
                                    {errors.email}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-1">
                            <Label
                                htmlFor="mobile"
                                className="text-xs font-semibold text-slate-700 dark:text-zinc-200"
                            >
                                Nomor Handphone / WhatsApp
                            </Label>
                            <Input
                                id="mobile"
                                value={data.mobile}
                                onChange={(e) =>
                                    setData('mobile', e.target.value)
                                }
                                placeholder="0812-xxxx-xxxx"
                                className="h-8 rounded-lg border-slate-200 bg-slate-50/70 text-xs text-slate-900 focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
                            />
                            {errors.mobile && (
                                <p className="text-[11px] text-rose-500">
                                    {errors.mobile}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-1">
                        <Label
                            htmlFor="notes"
                            className="text-xs font-semibold text-slate-700 dark:text-zinc-200"
                        >
                            Catatan Narahubung
                        </Label>
                        <textarea
                            id="notes"
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            rows={2}
                            placeholder="Catatan wewenang, kuasa penandatanganan, waktu hubungi..."
                            className="rounded-lg border border-slate-200 bg-slate-50/70 p-2 text-xs leading-relaxed text-slate-900 outline-hidden focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
                        />
                        {errors.notes && (
                            <p className="text-[11px] text-rose-500">
                                {errors.notes}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3 dark:border-white/[0.04]">
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
                            type="submit"
                            size="sm"
                            disabled={processing}
                            className="h-8 cursor-pointer rounded-lg bg-slate-900 px-4 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 active:scale-95 dark:bg-white dark:text-slate-900"
                        >
                            {processing ? (
                                <>
                                    <Spinner className="mr-1.5 size-3" />
                                    Menyimpan...
                                </>
                            ) : (
                                'Simpan Kontak'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function UploadClientDocModal({
    isOpen,
    onClose,
    clientId,
    clientName,
    matters,
}: {
    isOpen: boolean;
    onClose: () => void;
    clientId: string;
    clientName: string;
    matters: Matter[];
}) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm<{
            title: string;
            client_id: string;
            matter_id: string;
            document_type: string;
            confidentiality_level: string;
            status: string;
            file: File | null;
            notes: string;
        }>({
            title: '',
            client_id: clientId,
            matter_id: '',
            document_type: 'Dokumen Legalitas Klien',
            confidentiality_level: 'standard',
            status: 'draft',
            file: null,
            notes: '',
        });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/documents', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) {
                    reset();
                    clearErrors();
                    onClose();
                }
            }}
        >
            <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xl sm:max-w-lg dark:border-white/10 dark:bg-[#14161b]">
                <DialogHeader className="border-b border-slate-100 pb-3.5 dark:border-white/[0.06]">
                    <div className="flex items-center gap-2.5">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                            <FileUp className="size-4.5" />
                        </div>
                        <div>
                            <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
                                Unggah Dokumen Terkait Klien
                            </DialogTitle>
                            <DialogDescription className="text-xs text-slate-500 dark:text-zinc-400">
                                Berkas legalitas, surat kuasa, atau dokumen
                                perkara untuk {clientName}.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-3.5 pt-1">
                    <div className="grid gap-1">
                        <Label
                            htmlFor="doc_title"
                            className="text-xs font-semibold text-slate-700 dark:text-zinc-200"
                        >
                            Judul / Nama Dokumen{' '}
                            <span className="text-rose-500">*</span>
                        </Label>
                        <Input
                            id="doc_title"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            placeholder="Contoh: Surat Kuasa Khusus Litigasi / Perjanjian Kerjasama"
                            required
                            className="h-8 rounded-lg border-slate-200 bg-slate-50/70 text-xs text-slate-900 focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
                        />
                        {errors.title && (
                            <p className="text-[11px] text-rose-500">
                                {errors.title}
                            </p>
                        )}
                    </div>

                    <div className="grid gap-2.5 sm:grid-cols-2">
                        <div className="grid gap-1">
                            <Label
                                htmlFor="doc_matter"
                                className="text-xs font-semibold text-slate-700 dark:text-zinc-200"
                            >
                                Terkait Perkara (Matter)
                            </Label>
                            <div className="relative">
                                <select
                                    id="doc_matter"
                                    value={data.matter_id}
                                    onChange={(e) =>
                                        setData('matter_id', e.target.value)
                                    }
                                    className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-slate-50/70 pr-7 pl-2.5 text-xs text-slate-900 outline-hidden hover:bg-slate-100 focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-zinc-200"
                                >
                                    <option value="">
                                        Dokumen Umum Klien (Tanpa Perkara)
                                    </option>
                                    {matters.map((m) => (
                                        <option key={m.id} value={m.id}>
                                            {m.matter_number} - {m.title}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="pointer-events-none absolute top-1/2 right-2 size-3 -translate-y-1/2 text-slate-400" />
                            </div>
                        </div>

                        <div className="grid gap-1">
                            <Label
                                htmlFor="doc_type"
                                className="text-xs font-semibold text-slate-700 dark:text-zinc-200"
                            >
                                Kategori / Tipe Dokumen
                            </Label>
                            <Input
                                id="doc_type"
                                value={data.document_type}
                                onChange={(e) =>
                                    setData('document_type', e.target.value)
                                }
                                placeholder="Surat Kuasa, Kontrak, Salinan Akta"
                                className="h-8 rounded-lg border-slate-200 bg-slate-50/70 text-xs text-slate-900 focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
                            />
                        </div>
                    </div>

                    <div className="grid gap-2.5 sm:grid-cols-2">
                        <div className="grid gap-1">
                            <Label
                                htmlFor="doc_confidentiality"
                                className="text-xs font-semibold text-slate-700 dark:text-zinc-200"
                            >
                                Tingkat Kerahasiaan
                            </Label>
                            <div className="relative">
                                <select
                                    id="doc_confidentiality"
                                    value={data.confidentiality_level}
                                    onChange={(e) =>
                                        setData(
                                            'confidentiality_level',
                                            e.target.value,
                                        )
                                    }
                                    className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-slate-50/70 pr-7 pl-2.5 text-xs text-slate-900 outline-hidden hover:bg-slate-100 focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-zinc-200"
                                >
                                    <option value="standard">
                                        Standar Internal
                                    </option>
                                    <option value="confidential">
                                        Confidential (Rahasia)
                                    </option>
                                    <option value="restricted">
                                        Restricted (Terbatas)
                                    </option>
                                    <option value="strictly_confidential">
                                        Strictly Confidential (Sangat Rahasia)
                                    </option>
                                </select>
                                <ChevronDown className="pointer-events-none absolute top-1/2 right-2 size-3 -translate-y-1/2 text-slate-400" />
                            </div>
                        </div>

                        <div className="grid gap-1">
                            <Label
                                htmlFor="doc_status"
                                className="text-xs font-semibold text-slate-700 dark:text-zinc-200"
                            >
                                Status Dokumen
                            </Label>
                            <div className="relative">
                                <select
                                    id="doc_status"
                                    value={data.status}
                                    onChange={(e) =>
                                        setData('status', e.target.value)
                                    }
                                    className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-slate-50/70 pr-7 pl-2.5 text-xs text-slate-900 outline-hidden hover:bg-slate-100 focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-zinc-200"
                                >
                                    <option value="draft">Draft Awal</option>
                                    <option value="under_review">
                                        Dalam Telaah (Review)
                                    </option>
                                    <option value="final">Final / Sah</option>
                                    <option value="signed">
                                        Ditandatangani (Signed)
                                    </option>
                                </select>
                                <ChevronDown className="pointer-events-none absolute top-1/2 right-2 size-3 -translate-y-1/2 text-slate-400" />
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-1">
                        <Label
                            htmlFor="doc_file"
                            className="text-xs font-semibold text-slate-700 dark:text-zinc-200"
                        >
                            Pilih Berkas File (PDF, DOCX, XLSX, max 50MB){' '}
                            <span className="text-rose-500">*</span>
                        </Label>
                        <FileInput
                            id="doc_file"
                            ref={fileInputRef}
                            required
                            accept=".pdf,.docx,.doc,.xlsx,.xls,.png,.jpg,.jpeg"
                            buttonText="Pilih Berkas"
                            placeholder="Klik atau seret berkas dokumen ke sini..."
                            value={data.file}
                            onFileSelect={(file) => setData('file', file)}
                        />
                        {errors.file && (
                            <p className="text-[11px] text-rose-500">
                                {errors.file}
                            </p>
                        )}
                    </div>

                    <div className="grid gap-1">
                        <Label
                            htmlFor="doc_notes"
                            className="text-xs font-semibold text-slate-700 dark:text-zinc-200"
                        >
                            Catatan Dokumen / Versi
                        </Label>
                        <textarea
                            id="doc_notes"
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            rows={2}
                            placeholder="Keterangan singkat berkas..."
                            className="rounded-lg border border-slate-200 bg-slate-50/70 p-2 text-xs leading-relaxed text-slate-900 outline-hidden focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
                        />
                    </div>

                    <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3 dark:border-white/[0.04]">
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
                            type="submit"
                            size="sm"
                            disabled={processing}
                            className="h-8 cursor-pointer rounded-lg bg-slate-900 px-4 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 active:scale-95 dark:bg-white dark:text-slate-900"
                        >
                            {processing ? (
                                <>
                                    <Spinner className="mr-1.5 size-3" />
                                    Mengunggah...
                                </>
                            ) : (
                                'Unggah Dokumen'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

ClientShow.layout = {
    breadcrumbs: [
        { title: 'Klien', href: clientRoutes.index.url() },
        { title: 'Detail Klien', href: '#' },
    ],
};
