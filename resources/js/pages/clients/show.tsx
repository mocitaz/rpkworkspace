import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Briefcase,
    Building2,
    Calendar,
    ChevronRight,
    ExternalLink,
    FileText,
    Globe,
    Mail,
    MapPin,
    Pencil,
    Phone,
    Plus,
    ShieldCheck,
    UserCheck,
    Users,
} from 'lucide-react';
import { useState } from 'react';
import { EmptyState } from '@/components/empty-state';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
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
    relationship_partner_id?: number;
    opened_at?: string;
    closed_at?: string;
    relationship_partner?: Person;
    contacts: {
        id: string;
        full_name: string;
        job_title?: string;
        email?: string;
        mobile?: string;
    }[];
};

type Document = {
    id: string;
    title: string;
    status: string;
    updated_at: string;
    current_version?: { version_number: number; file_size: number; mime_type?: string };
};

const tabs = [
    { id: 'Overview', label: 'Ringkasan' },
    { id: 'Matters', label: 'Matters' },
    { id: 'Kontak', label: 'Kontak Person' },
    { id: 'Dokumen', label: 'Dokumen' },
] as const;

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
    partners: { id: number; name: string; position_title?: string; avatar_path?: string | null }[];
    can: { update: boolean };
}) {
    const [tab, setTab] = useState<(typeof tabs)[number]['id']>('Overview');
    const allMatters = [...activeMatters, ...closedMatters];

    return (
        <>
            <Head title={`${client.client_number} — ${client.display_name}`} />

            <div className="min-h-screen w-full bg-[#fbfbfa] text-[#111111] antialiased dark:bg-[#121212] dark:text-[#fbfbfa]">
                <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
                    {/* Notion Minimalist Header */}
                    <header className="space-y-2.5">
                        <Link
                            href={clientRoutes.index()}
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#787774] transition-colors hover:text-[#111111] dark:text-zinc-400 dark:hover:text-white"
                        >
                            <ArrowLeft className="size-3.5" />
                            Klien
                        </Link>

                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                            <div className="space-y-1.5 min-w-0">
                                <h1 className="text-2xl font-bold tracking-tight text-[#111111] sm:text-3xl dark:text-white">
                                    {client.display_name}
                                </h1>

                                <div className="flex flex-wrap items-center gap-2 text-xs text-[#787774] dark:text-zinc-400">
                                    <span className="inline-block rounded bg-[#e1f3fe] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#1f6c9f] dark:bg-blue-950/50 dark:text-sky-300">
                                        {client.client_number}
                                    </span>
                                    <span>·</span>
                                    <span className="font-medium text-[#2f3437] dark:text-zinc-200">{client.legal_name}</span>
                                    <span>·</span>
                                    <span>{client.industry ?? 'Umum'}</span>
                                    <span>·</span>
                                    <StatusBadge value={client.status} />
                                    <span className="rounded-md bg-black/[0.04] px-2 py-0.5 text-[10px] font-medium capitalize text-[#787774] dark:bg-white/[0.06] dark:text-zinc-300">
                                        {client.type === 'corporate' ? 'Korporasi' : 'Individu'}
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex shrink-0 items-center gap-2">
                                {can.update && (
                                    <Button
                                        variant="outline"
                                        className="h-8 rounded-lg border-black/10 bg-white px-3 text-xs font-medium text-[#111111] shadow-2xs hover:bg-black/[0.03] dark:border-white/10 dark:bg-[#1c1c1e] dark:text-zinc-200 dark:hover:bg-white/[0.06]"
                                        asChild
                                    >
                                        <Link href={clientRoutes.edit(client.id)}>
                                            <Pencil className="mr-1.5 size-3.5 text-[#787774]" />
                                            Edit Klien
                                        </Link>
                                    </Button>
                                )}

                                <Button
                                    className="h-8 rounded-lg bg-[#111111] px-3.5 text-xs font-semibold text-white shadow-2xs transition-colors hover:bg-black active:scale-95 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                                    asChild
                                >
                                    <Link href={matterRoutes.create()}>
                                        <Plus className="mr-1.5 size-3.5" />
                                        Buat Matter Baru
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </header>

                    {/* Compact 4-Column Stat Strip (h-[76px]) */}
                    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {/* 1. Partner */}
                        <div className="flex h-[76px] flex-col justify-between rounded-xl border border-black/[0.07] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#787774]">
                                Relationship Partner
                            </span>
                            <div className="flex min-w-0 items-center gap-2.5">
                                <div className="relative flex size-6.5 shrink-0 items-center justify-center overflow-hidden rounded-full bg-black/[0.05] text-[10px] font-semibold text-zinc-700 dark:bg-white/[0.1] dark:text-zinc-300">
                                    {client.relationship_partner?.avatar_url ? (
                                        <img
                                            src={client.relationship_partner.avatar_url}
                                            alt={client.relationship_partner.name}
                                            className="size-full object-cover"
                                        />
                                    ) : (
                                        (client.relationship_partner?.name || 'P')
                                            .split(' ')
                                            .map((n) => n[0])
                                            .slice(0, 2)
                                            .join('')
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate text-xs font-semibold text-[#111111] dark:text-white">
                                        {client.relationship_partner?.name ?? 'Belum ditentukan'}
                                    </p>
                                    <p className="truncate text-[10px] text-[#787774] dark:text-zinc-400">
                                        {client.relationship_partner?.position_title ?? 'Partner'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* 2. Industri & Tipe */}
                        <div className="flex h-[76px] flex-col justify-between rounded-xl border border-black/[0.07] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#787774]">
                                Sektor & Entitas
                            </span>
                            <div className="min-w-0">
                                <p className="truncate text-xs font-semibold text-[#111111] dark:text-white">
                                    {client.industry ?? 'Umum'}
                                </p>
                                <p className="truncate text-[10px] text-[#787774] dark:text-zinc-400">
                                    {client.type === 'corporate' ? 'Badan Hukum / Korporasi' : 'Individu'}
                                </p>
                            </div>
                        </div>

                        {/* 3. Matter Aktif */}
                        <div className="flex h-[76px] flex-col justify-between rounded-xl border border-black/[0.07] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#787774]">
                                Portofolio Perkara
                            </span>
                            <div className="flex items-baseline justify-between">
                                <span className="font-mono text-sm font-bold text-[#111111] dark:text-white">
                                    {activeMatters.length} Aktif
                                </span>
                                <span className="text-[10px] text-[#787774] dark:text-zinc-400">
                                    {allMatters.length} total perkara
                                </span>
                            </div>
                        </div>

                        {/* 4. Kontak Perwakilan */}
                        <div className="flex h-[76px] flex-col justify-between rounded-xl border border-black/[0.07] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#787774]">
                                Kontak Person
                            </span>
                            <div className="flex items-baseline justify-between">
                                <span className="font-mono text-sm font-bold text-[#111111] dark:text-white">
                                    {client.contacts.length} Kontak
                                </span>
                                <span className="text-[10px] text-[#787774] dark:text-zinc-400">
                                    perwakilan terdaftar
                                </span>
                            </div>
                        </div>
                    </section>

                    {/* Notion Pill Tab Bar */}
                    <div className="space-y-4">
                        <div className="flex border-b border-black/[0.08] dark:border-white/[0.08]">
                            {tabs.map((item) => {
                                const isActive = tab === item.id;
                                const count =
                                    item.id === 'Matters'
                                        ? allMatters.length
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
                                {/* 1. Full-Width Top Section: Catatan / Ikhtisar Klien */}
                                <div className="border-b border-black/[0.06] bg-[#fafafa] p-5 dark:border-white/[0.06] dark:bg-zinc-900/30">
                                    <div className="mb-2 flex items-center gap-2">
                                        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#787774]">
                                            Catatan & Ikhtisar Klien
                                        </span>
                                    </div>
                                    <p className="text-xs leading-relaxed text-[#2f3437] whitespace-pre-wrap dark:text-zinc-200">
                                        {client.notes ||
                                            'Profil klien terdaftar dalam database firma hukum RPK dengan tata kelola hak akses dan kerahasiaan dokumen terverifikasi.'}
                                    </p>
                                </div>

                                {/* 2. Bottom Grid: 2 Columns Split */}
                                <div className="grid divide-y divide-black/[0.06] lg:grid-cols-[1.4fr_1fr] lg:divide-x lg:divide-y-0 dark:divide-white/[0.06]">
                                    {/* Left Column: Active Matters & Key Contacts */}
                                    <div className="flex flex-col divide-y divide-black/[0.06] dark:divide-white/[0.06]">
                                        {/* Section: Matter Berjalan */}
                                        <div className="p-5">
                                            <div className="mb-3 flex items-center justify-between">
                                                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#787774]">
                                                    Matter Berjalan ({activeMatters.length})
                                                </span>
                                                {allMatters.length > 0 && (
                                                    <button
                                                        onClick={() => setTab('Matters')}
                                                        className="text-xs font-medium text-blue-600 hover:underline dark:text-sky-400"
                                                    >
                                                        Lihat Semua
                                                    </button>
                                                )}
                                            </div>

                                            {activeMatters.length ? (
                                                <div className="divide-y divide-black/[0.04] dark:divide-white/[0.04]">
                                                    {activeMatters.map((matter) => (
                                                        <Link
                                                            key={matter.id}
                                                            href={matterRoutes.show(matter.id)}
                                                            className="group flex items-center justify-between py-2.5 transition-colors"
                                                        >
                                                            <div className="min-w-0 pr-3">
                                                                <p className="truncate text-xs font-semibold text-[#111111] group-hover:text-blue-600 dark:text-white dark:group-hover:text-sky-400">
                                                                    {matter.title}
                                                                </p>
                                                                <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#787774] dark:text-zinc-400">
                                                                    <span className="rounded bg-[#e1f3fe] px-1.5 py-0.2 font-semibold text-[#1f6c9f] dark:bg-blue-950/50 dark:text-sky-300">
                                                                        {matter.matter_number}
                                                                    </span>
                                                                    <span>·</span>
                                                                    <span>{matter.practice_area?.name ?? 'Umum'}</span>
                                                                </div>
                                                            </div>
                                                            <StatusBadge value={matter.status} />
                                                        </Link>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-xs text-[#787774] dark:text-zinc-500">
                                                    Tidak ada matter yang sedang berjalan.
                                                </p>
                                            )}
                                        </div>

                                        {/* Section: Kontak Perwakilan */}
                                        <div className="p-5">
                                            <div className="mb-3 flex items-center justify-between">
                                                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#787774]">
                                                    Kontak Person ({client.contacts.length})
                                                </span>
                                                {client.contacts.length > 2 && (
                                                    <button
                                                        onClick={() => setTab('Kontak')}
                                                        className="text-xs font-medium text-blue-600 hover:underline dark:text-sky-400"
                                                    >
                                                        Lihat Semua
                                                    </button>
                                                )}
                                            </div>

                                            {client.contacts.length ? (
                                                <div className="divide-y divide-black/[0.04] dark:divide-white/[0.04]">
                                                    {client.contacts.map((contact) => (
                                                        <div
                                                            key={contact.id}
                                                            className="flex items-center justify-between py-2.5 text-xs"
                                                        >
                                                            <div className="flex min-w-0 items-center gap-2.5 pr-3">
                                                                <div className="flex size-6.5 shrink-0 items-center justify-center rounded-full bg-black/[0.05] text-[10px] font-semibold text-zinc-700 dark:bg-white/[0.1] dark:text-zinc-300">
                                                                    {contact.full_name
                                                                        .split(' ')
                                                                        .map((n) => n[0])
                                                                        .slice(0, 2)
                                                                        .join('')}
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <p className="truncate font-semibold text-[#111111] dark:text-white">
                                                                        {contact.full_name}
                                                                    </p>
                                                                    <p className="truncate text-[10px] text-[#787774] dark:text-zinc-400">
                                                                        {contact.job_title ?? 'Kontak Perwakilan'}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="shrink-0 text-right text-[11px] text-[#787774] dark:text-zinc-400">
                                                                <p>{contact.email ?? '—'}</p>
                                                                <p className="font-mono text-[10px]">{contact.mobile ?? ''}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-xs text-[#787774] dark:text-zinc-500">
                                                    Belum ada kontak perwakilan terdaftar.
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right Column: Legalitas, Domisili & Partner */}
                                    <div className="flex flex-col divide-y divide-black/[0.06] dark:divide-white/[0.06]">
                                        {/* Section: Legalitas & Kontak Resmi */}
                                        <div className="p-5 text-xs">
                                            <span className="mb-3 block text-[10px] font-semibold uppercase tracking-wider text-[#787774]">
                                                Legalitas & Kontak Perusahaan
                                            </span>
                                            <div className="divide-y divide-black/[0.04] dark:divide-white/[0.04]">
                                                {client.tax_identifier && (
                                                    <div className="flex items-center justify-between py-2">
                                                        <span className="text-[#787774] dark:text-zinc-400">NPWP / Tax ID</span>
                                                        <span className="font-mono font-semibold text-[#111111] dark:text-white">
                                                            {client.tax_identifier}
                                                        </span>
                                                    </div>
                                                )}
                                                {client.registration_identifier && (
                                                    <div className="flex items-center justify-between py-2">
                                                        <span className="text-[#787774] dark:text-zinc-400">No. Registrasi / NIB</span>
                                                        <span className="font-mono font-semibold text-[#111111] dark:text-white">
                                                            {client.registration_identifier}
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="flex items-center justify-between py-2">
                                                    <span className="text-[#787774] dark:text-zinc-400">Email Resmi</span>
                                                    <span className="font-medium text-[#111111] dark:text-white">
                                                        {client.email || '—'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between py-2">
                                                    <span className="text-[#787774] dark:text-zinc-400">Telepon</span>
                                                    <span className="font-mono font-medium text-[#111111] dark:text-white">
                                                        {client.phone || '—'}
                                                    </span>
                                                </div>
                                                {client.website && (
                                                    <div className="flex items-center justify-between py-2">
                                                        <span className="text-[#787774] dark:text-zinc-400">Website</span>
                                                        <a
                                                            href={client.website.startsWith('http') ? client.website : `https://${client.website}`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="inline-flex items-center gap-1 font-medium text-blue-600 hover:underline dark:text-sky-400"
                                                        >
                                                            {client.website.replace(/^https?:\/\//, '')}
                                                            <ExternalLink className="size-3" />
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Section: Alamat & Domisili */}
                                        <div className="p-5 text-xs">
                                            <span className="mb-3 block text-[10px] font-semibold uppercase tracking-wider text-[#787774]">
                                                Alamat & Domisili
                                            </span>
                                            <div className="space-y-1 text-xs text-[#2f3437] dark:text-zinc-200">
                                                <p className="font-semibold text-[#111111] dark:text-white">{client.address_line_1 || '—'}</p>
                                                {client.address_line_2 && (
                                                    <p className="text-[#787774] dark:text-zinc-400">{client.address_line_2}</p>
                                                )}
                                                <p className="text-[11px] text-[#787774] dark:text-zinc-400">
                                                    {[client.city, client.province, client.postal_code, client.country_code]
                                                        .filter(Boolean)
                                                        .join(', ')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 2: MATTERS */}
                        {tab === 'Matters' && (
                            <div className="overflow-hidden rounded-xl border border-black/[0.08] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c] space-y-4">
                                <div className="flex items-center justify-between border-b border-black/[0.04] pb-3 dark:border-white/[0.06]">
                                    <div>
                                        <h2 className="text-xs font-bold uppercase tracking-wider text-[#111111] dark:text-white">
                                            Daftar Perkara Hukum ({allMatters.length})
                                        </h2>
                                        <p className="text-[11px] text-[#787774] dark:text-zinc-400">
                                            Seluruh riwayat penanganan perkara aktif maupun selesai untuk klien ini.
                                        </p>
                                    </div>
                                    <Button
                                        size="sm"
                                        className="h-7.5 rounded-lg bg-[#111111] px-3 text-xs font-semibold text-white shadow-2xs hover:bg-black dark:bg-white dark:text-black"
                                        asChild
                                    >
                                        <Link href={matterRoutes.create()}>
                                            <Plus className="mr-1 size-3.5" />
                                            Buat Matter
                                        </Link>
                                    </Button>
                                </div>

                                {allMatters.length ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-xs">
                                            <thead>
                                                <tr className="border-b border-black/[0.04] text-[10px] font-semibold uppercase tracking-wider text-[#787774] dark:border-white/[0.06]">
                                                    <th className="pb-2.5 pr-4 font-semibold">Perkara</th>
                                                    <th className="pb-2.5 px-3 font-semibold">Area Praktik</th>
                                                    <th className="pb-2.5 px-3 text-center font-semibold">Partner</th>
                                                    <th className="pb-2.5 px-3 font-semibold">Diperbarui</th>
                                                    <th className="pb-2.5 px-3 font-semibold">Status</th>
                                                    <th className="pb-2.5 pl-3 text-right font-semibold"></th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-black/[0.04] dark:divide-white/[0.05]">
                                                {allMatters.map((matter) => (
                                                    <tr key={matter.id} className="group transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.03]">
                                                        <td className="py-3 pr-4">
                                                            <Link
                                                                href={matterRoutes.show(matter.id)}
                                                                className="font-semibold text-[#111111] group-hover:text-blue-600 dark:text-white dark:group-hover:text-sky-400"
                                                            >
                                                                {matter.title}
                                                                <span className="mt-0.5 block font-mono text-[10px] text-[#787774] dark:text-zinc-400">
                                                                    {matter.matter_number}
                                                                </span>
                                                            </Link>
                                                        </td>
                                                        <td className="py-3 px-3 whitespace-nowrap">
                                                            <span className="rounded-md bg-black/[0.04] px-2 py-0.5 text-[10px] font-medium text-[#787774] dark:bg-white/[0.06] dark:text-zinc-400">
                                                                {matter.practice_area?.name ?? 'Umum'}
                                                            </span>
                                                        </td>
                                                        <td className="py-3 px-3 text-center whitespace-nowrap">
                                                            {matter.responsible_partner ? (
                                                                <TooltipProvider delayDuration={150}>
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <div className="inline-flex cursor-pointer items-center justify-center">
                                                                                <div className="relative flex size-6.5 shrink-0 items-center justify-center overflow-hidden rounded-full bg-black/[0.05] text-[9px] font-semibold text-zinc-700 dark:bg-white/[0.1] dark:text-zinc-300">
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
                                                                            </div>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent className="rounded-lg border border-black/10 bg-[#111111] px-2.5 py-1 text-xs text-white shadow-lg dark:border-white/10 dark:bg-zinc-800">
                                                                            <p className="font-semibold">{matter.responsible_partner.name}</p>
                                                                            <p className="text-[10px] text-zinc-400">{matter.responsible_partner.position_title ?? 'Partner'}</p>
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                </TooltipProvider>
                                                            ) : (
                                                                <span className="text-[#787774]">—</span>
                                                            )}
                                                        </td>
                                                        <td className="py-3 px-3 whitespace-nowrap font-mono text-[11px] text-[#787774] dark:text-zinc-400">
                                                            {formatDate(matter.updated_at)}
                                                        </td>
                                                        <td className="py-3 px-3 whitespace-nowrap">
                                                            <StatusBadge value={matter.status} />
                                                        </td>
                                                        <td className="py-3 pl-3 text-right whitespace-nowrap">
                                                            <Link
                                                                href={matterRoutes.show(matter.id)}
                                                                className="inline-flex size-6 items-center justify-center text-[#787774] opacity-0 transition-opacity group-hover:opacity-100 hover:text-[#111111] dark:hover:text-white"
                                                            >
                                                                <ChevronRight className="size-3.5" />
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="flex min-h-[240px] items-center justify-center p-8 text-center">
                                        <EmptyState title="Belum ada matter terkait klien ini" />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* TAB 3: KONTAK */}
                        {tab === 'Kontak' && (
                            <div className="overflow-hidden rounded-xl border border-black/[0.08] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c] space-y-4">
                                <div className="flex items-center justify-between border-b border-black/[0.04] pb-3 dark:border-white/[0.06]">
                                    <div>
                                        <h2 className="text-xs font-bold uppercase tracking-wider text-[#111111] dark:text-white">
                                            Daftar Kontak Perwakilan ({client.contacts.length})
                                        </h2>
                                        <p className="text-[11px] text-[#787774] dark:text-zinc-400">
                                            Orang yang dapat dihubungi terkait administrasi dan komunikasi perkara.
                                        </p>
                                    </div>
                                </div>

                                {client.contacts.length ? (
                                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                        {client.contacts.map((contact) => (
                                            <div
                                                key={contact.id}
                                                className="flex flex-col justify-between rounded-xl border border-black/[0.06] bg-[#fafafa] p-4 text-xs transition-colors hover:bg-black/[0.02] dark:border-white/[0.06] dark:bg-zinc-900/40"
                                            >
                                                <div className="flex items-start gap-2.5">
                                                    <div className="flex size-7.5 shrink-0 items-center justify-center rounded-lg bg-black/[0.05] text-[10px] font-semibold text-zinc-700 dark:bg-white/[0.1] dark:text-zinc-300">
                                                        {contact.full_name
                                                            .split(' ')
                                                            .map((n) => n[0])
                                                            .slice(0, 2)
                                                            .join('')}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h4 className="truncate font-semibold text-[#111111] dark:text-white">
                                                            {contact.full_name}
                                                        </h4>
                                                        <p className="truncate text-[10px] text-[#787774] dark:text-zinc-400">
                                                            {contact.job_title ?? 'Kontak Klien'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="mt-3 space-y-1 border-t border-black/[0.04] pt-2.5 text-[11px] dark:border-white/[0.04]">
                                                    {contact.email && (
                                                        <div className="flex items-center gap-2 text-[#787774] dark:text-zinc-400">
                                                            <Mail className="size-3 shrink-0" />
                                                            <span className="truncate text-[#2f3437] dark:text-zinc-200">{contact.email}</span>
                                                        </div>
                                                    )}
                                                    {contact.mobile && (
                                                        <div className="flex items-center gap-2 text-[#787774] dark:text-zinc-400">
                                                            <Phone className="size-3 shrink-0" />
                                                            <span className="font-mono text-[#2f3437] dark:text-zinc-200">{contact.mobile}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex min-h-[240px] items-center justify-center p-8 text-center">
                                        <EmptyState title="Belum ada kontak perwakilan" />
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
                                            Dokumen Terkait Klien ({documents.length})
                                        </h2>
                                        <p className="text-[11px] text-[#787774] dark:text-zinc-400">
                                            Seluruh arsip legalitas, surat kuasa, dan dokumen yang terhubung dengan klien ini.
                                        </p>
                                    </div>
                                </div>

                                {documents.length ? (
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
                                                {documents.map((doc) => (
                                                    <tr key={doc.id} className="group transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.03]">
                                                        <td className="py-3 pr-4">
                                                            <div className="flex items-center gap-2.5">
                                                                <FileText className="size-3.5 shrink-0 text-[#787774]" />
                                                                <div>
                                                                    <p className="font-semibold text-[#111111] group-hover:text-blue-600 dark:text-white dark:group-hover:text-sky-400">
                                                                        {doc.title}
                                                                    </p>
                                                                    <p className="text-[10px] text-[#787774] dark:text-zinc-400">
                                                                        {doc.current_version?.mime_type ?? 'Dokumen Legalitas'}
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
                                        <EmptyState title="Belum ada dokumen yang dapat diakses" />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
}

ClientShow.layout = {
    breadcrumbs: [
        { title: 'Klien', href: clientRoutes.index() },
        { title: 'Detail Klien', href: '#' },
    ],
};
