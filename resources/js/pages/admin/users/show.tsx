import { Form, Head, Link, router } from '@inertiajs/react';
import { Can } from '@/components/can';
import {
    AlertTriangle,
    ArrowLeft,
    Briefcase,
    Building2,
    Calendar,
    Check,
    CheckCircle2,
    Copy,
    CreditCard,
    ExternalLink,
    FileBadge,
    FileCheck,
    FileText,
    GraduationCap,
    Mail,
    MapPin,
    MessageSquare,
    Pencil,
    Phone,
    Plus,
    Scale,
    Shield,
    ShieldCheck,
    Smartphone,
    Sparkles,
    Trash2,
    UserCheck,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import InputError from '@/components/input-error';
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
import { formatDate } from '@/lib/format';
import * as matterRoutes from '@/routes/matters';
import * as userRoutes from '@/routes/admin/users';

type Permission = { id: number; name: string; description?: string };
type Role = {
    id: number;
    name: string;
    slug: string;
    description?: string;
    permissions: Permission[];
};

type MatterBrief = {
    id: string;
    matter_number: string;
    title: string;
    status: string;
    priority: string;
    opened_at?: string;
};

type UserDetail = {
    id: number;
    name: string;
    email: string;
    position_title?: string | null;
    employee_code?: string | null;
    department?: string | null;
    avatar_url?: string | null;
    is_active: boolean;
    email_verified_at?: string | null;
    created_at?: string | null;
    last_seen_at?: string | null;
    phone?: string | null;
    address?: string | null;
    ktp_address?: string | null;
    birth_date?: string | null;
    advocate_license_no?: string | null;
    bas_number?: string | null;
    bas_date?: string | null;
    kta_expiry_date?: string | null;
    practice_areas?: string | null;
    education?: string | null;
    bank_name?: string | null;
    bank_account_number?: string | null;
    bank_account_holder?: string | null;
    npwp?: string | null;
    roles: Role[];
    matters?: MatterBrief[];
};

const tabs = [
    { id: 'Overview', label: 'Ringkasan', icon: Building2 },
    { id: 'Legalitas', label: 'Legalitas & Kredensial', icon: Scale },
    { id: 'Matters', label: 'Perkara Ditangani', icon: Briefcase },
    { id: 'Kontak', label: 'Kontak & Domisili', icon: Phone },
    { id: 'Rekening', label: 'Rekening & Pajak', icon: CreditCard },
    { id: 'Akses', label: 'Hak Akses & Peran', icon: ShieldCheck },
] as const;

export default function UserShow({
    staff,
    roles,
    metrics,
}: {
    staff: UserDetail;
    roles: Role[];
    metrics: {
        active_matters_count: number;
        total_matters_count: number;
    };
}) {
    const getInitials = useInitials();
    const [tab, setTab] = useState<(typeof tabs)[number]['id']>('Overview');
    const [isEditing, setIsEditing] = useState(false);
    const [initialEditTab, setInitialEditTab] = useState<
        'account' | 'advocate' | 'contact' | 'billing'
    >('account');
    const [isDeleting, setIsDeleting] = useState(false);
    const [copiedField, setCopiedField] = useState<string | null>(null);

    const displayId =
        staff.employee_code || `RPK-${staff.id.toString().padStart(3, '0')}`;

    const handleCopy = (text: string, fieldName: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(fieldName);
        setTimeout(() => setCopiedField(null), 2000);
    };

    const handleOpenChat = () => {
        window.dispatchEvent(
            new CustomEvent('open-floating-chat', {
                detail: {
                    userId: staff.id,
                    name: staff.name,
                    email: staff.email,
                    avatar_url: staff.avatar_url,
                    title: staff.position_title,
                },
            }),
        );
    };

    const openEditWithTab = (
        editTab: 'account' | 'advocate' | 'contact' | 'billing',
    ) => {
        setInitialEditTab(editTab);
        setIsEditing(true);
    };

    // Practice areas list
    const practiceAreasList = useMemo(() => {
        if (!staff.practice_areas) return [];
        return staff.practice_areas
            .split(/[\n,;]+/)
            .map((p) => p.trim())
            .filter(Boolean);
    }, [staff.practice_areas]);

    // KTA Expiry status check
    const ktaStatus = useMemo(() => {
        if (!staff.kta_expiry_date) return null;
        const expiry = new Date(staff.kta_expiry_date);
        const today = new Date();
        const diffDays = Math.ceil(
            (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
        );

        if (diffDays < 0) {
            return {
                label: 'Kadaluwarsa',
                color: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800',
            };
        }
        if (diffDays <= 60) {
            return {
                label: `Perlu Perpanjangan (${diffDays} hari)`,
                color: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
            };
        }
        return {
            label: 'Aktif Berlaku',
            color: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
        };
    }, [staff.kta_expiry_date]);

    return (
        <TooltipProvider>
            <Head title={`${staff.name} - Profil Staf & Advokat`} />

            <div className="min-h-screen bg-[#fafafc] pb-20 dark:bg-[#0c0d10]">
                <main className="mx-auto max-w-7xl space-y-4 px-4 py-5 sm:px-6 lg:px-8">
                    {/* 1. Executive Dossier Header Card (Unified 2-Tier Concept) */}
                    <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs sm:p-5 dark:border-white/[0.08] dark:bg-[#14161b]">
                        {/* Subtle Luxury Ambient Glow */}
                        <div className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-linear-to-br from-blue-500/8 via-indigo-500/5 to-purple-500/5 blur-3xl dark:from-blue-500/10 dark:to-indigo-500/5" />

                        {/* Top Tier: Utility Row, Identity & Actions */}
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3.5 dark:border-white/[0.04]">
                            <div className="flex flex-wrap items-center gap-2 text-xs">
                                <Button
                                    asChild
                                    variant="ghost"
                                    size="sm"
                                    className="h-7.5 -ml-1.5 rounded-lg px-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-white/[0.06] dark:hover:text-white"
                                >
                                    <Link
                                        href={
                                            userRoutes.index?.url
                                                ? userRoutes.index.url()
                                                : '/admin/users'
                                        }
                                    >
                                        <ArrowLeft className="mr-1.5 size-3.5" />
                                        Direktori Tim &amp; Staf
                                    </Link>
                                </Button>

                                <span className="h-3.5 w-px bg-slate-200 dark:bg-white/10" />

                                <span className="inline-flex items-center rounded-md border border-slate-200/80 bg-slate-50 px-2 py-0.5 font-mono text-[11px] font-bold text-slate-700 shadow-2xs dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-200">
                                    {displayId}
                                </span>

                                <span
                                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                                        staff.is_active
                                            ? 'border border-emerald-200/80 bg-emerald-50 text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/50 dark:text-emerald-300'
                                            : 'border border-slate-200/80 bg-slate-100 text-slate-600 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-400'
                                    }`}
                                >
                                    <span
                                        className={`size-1.5 rounded-full ${
                                            staff.is_active
                                                ? 'bg-emerald-500'
                                                : 'bg-slate-400'
                                        }`}
                                    />
                                    {staff.is_active ? 'Aktif' : 'Non-aktif'}
                                </span>

                                {staff.email_verified_at && (
                                    <span className="hidden items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-[10.5px] font-semibold text-blue-700 sm:inline-flex dark:bg-blue-950/50 dark:text-blue-300">
                                        <UserCheck className="size-3 text-blue-600 dark:text-blue-400" />
                                        Terverifikasi
                                    </span>
                                )}
                            </div>

                            {/* Right: Quick Action Buttons */}
                            <div className="flex shrink-0 flex-wrap items-center gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={handleOpenChat}
                                    className="h-7.5 rounded-lg border-slate-200/80 bg-white px-2.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-white/10 dark:bg-[#16181d] dark:text-zinc-200"
                                >
                                    <MessageSquare className="mr-1.5 size-3.5 text-blue-500" />
                                    Kirim Pesan
                                </Button>

                                {staff.phone && (
                                    <Button
                                        asChild
                                        variant="outline"
                                        size="sm"
                                        className="h-7.5 rounded-lg border-emerald-200/80 bg-emerald-50/70 px-2.5 text-xs font-semibold text-emerald-700 shadow-2xs hover:bg-emerald-100 dark:border-emerald-900/40 dark:bg-emerald-950/50 dark:text-emerald-300"
                                    >
                                        <a
                                            href={`https://wa.me/${staff.phone.replace(/[^0-9]/g, '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Smartphone className="mr-1.5 size-3.5" />
                                            WhatsApp
                                        </a>
                                    </Button>
                                )}

                                <Button
                                    asChild
                                    variant="outline"
                                    size="sm"
                                    className="h-7.5 rounded-lg border-slate-200/80 bg-white px-2.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-white/10 dark:bg-[#16181d] dark:text-zinc-200"
                                >
                                    <a href={`mailto:${staff.email}`}>
                                        <Mail className="mr-1.5 size-3.5 text-slate-400" />
                                        Email
                                    </a>
                                </Button>

                                <Can permission="admin.users.manage">
                                    <Button
                                        asChild
                                        size="sm"
                                        className="h-7.5 cursor-pointer rounded-lg bg-slate-900 px-3 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 active:scale-95 dark:bg-white dark:text-slate-900"
                                    >
                                        <Link
                                            href={
                                                userRoutes.edit?.url
                                                    ? userRoutes.edit.url(
                                                          staff.id,
                                                      )
                                                    : `/admin/users/${staff.id}/edit`
                                            }
                                        >
                                            <Pencil className="mr-1.5 size-3" />
                                            Edit Profil &amp; Akses
                                        </Link>
                                    </Button>
                                </Can>
                            </div>
                        </div>

                        {/* Bottom Tier: Full-Width Executive Profile Title & Metadata */}
                        <div className="flex flex-col gap-4 pt-1 sm:flex-row sm:items-center sm:gap-5">
                            {/* Profile Avatar with luxury border */}
                            <div className="relative shrink-0">
                                <Avatar className="size-16 rounded-2xl border-2 border-slate-200/80 shadow-xs sm:size-18 dark:border-white/10">
                                    <AvatarImage
                                        src={staff.avatar_url ?? undefined}
                                        className="rounded-2xl object-cover"
                                        alt={staff.name}
                                    />
                                    <AvatarFallback className="rounded-2xl bg-linear-to-br from-slate-900 via-slate-800 to-indigo-950 font-mono text-xl font-bold text-white shadow-inner sm:text-2xl">
                                        {getInitials(staff.name)}
                                    </AvatarFallback>
                                </Avatar>
                            </div>

                            {/* Identity, Titles & Metadata */}
                            <div className="min-w-0 flex-1 space-y-1.5">
                                <div className="flex flex-wrap items-center gap-2.5">
                                    <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl lg:text-[26px] lg:leading-snug dark:text-white">
                                        {staff.name}
                                    </h1>
                                    {staff.position_title && (
                                        <span className="inline-flex items-center gap-1 rounded-md border border-blue-200/70 bg-blue-50/80 px-2 py-0.5 text-[11px] font-semibold text-blue-700 dark:border-blue-900/40 dark:bg-blue-950/40 dark:text-blue-300">
                                            <Scale className="size-3 text-blue-600 dark:text-blue-400" />
                                            {staff.position_title}
                                        </span>
                                    )}
                                    {staff.department && (
                                        <span className="inline-flex items-center gap-1 rounded-md border border-slate-200/80 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300">
                                            <Building2 className="size-3 text-slate-400 dark:text-zinc-500" />
                                            {staff.department}
                                        </span>
                                    )}
                                    {staff.education && (
                                        <span className="hidden items-center gap-1 rounded-md border border-purple-200/70 bg-purple-50/80 px-2 py-0.5 text-[11px] font-medium text-purple-700 sm:inline-flex dark:border-purple-900/40 dark:bg-purple-950/40 dark:text-purple-300">
                                            <GraduationCap className="size-3 text-purple-600 dark:text-purple-400" />
                                            {staff.education}
                                        </span>
                                    )}
                                </div>

                                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-slate-500 dark:text-zinc-400">
                                    <a
                                        href={`mailto:${staff.email}`}
                                        className="inline-flex items-center gap-1 text-slate-600 hover:text-blue-600 dark:text-zinc-300 dark:hover:text-blue-400"
                                    >
                                        <Mail className="size-3 text-slate-400" />
                                        <span>{staff.email}</span>
                                    </a>
                                    {staff.phone && (
                                        <>
                                            <span className="text-slate-300 dark:text-zinc-700">
                                                •
                                            </span>
                                            <span className="inline-flex items-center gap-1 text-slate-600 dark:text-zinc-300">
                                                <Phone className="size-3 text-slate-400" />
                                                <span>{staff.phone}</span>
                                            </span>
                                        </>
                                    )}
                                    {staff.advocate_license_no && (
                                        <>
                                            <span className="text-slate-300 dark:text-zinc-700">
                                                •
                                            </span>
                                            <span className="inline-flex items-center gap-1">
                                                <Scale className="size-3 text-slate-400" />
                                                <span>
                                                    NIA:{' '}
                                                    <strong className="font-mono text-slate-700 dark:text-zinc-300">
                                                        {
                                                            staff.advocate_license_no
                                                        }
                                                    </strong>
                                                </span>
                                            </span>
                                        </>
                                    )}
                                    {staff.roles.length > 0 && (
                                        <>
                                            <span className="text-slate-300 dark:text-zinc-700">
                                                •
                                            </span>
                                            <span className="inline-flex items-center gap-1">
                                                <ShieldCheck className="size-3 text-slate-400" />
                                                <span>
                                                    Akses:{' '}
                                                    {staff.roles
                                                        .map((r) => r.name)
                                                        .join(', ')}
                                                </span>
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. Top 4 Compact Bento KPI Stat Cards */}
                    <section className="grid grid-cols-2 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
                        {/* 1. Hak Akses & Peran */}
                        <div className="group flex min-h-[96px] flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.08] dark:bg-[#14161b] dark:hover:border-white/15">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:text-zinc-400">
                                    HAK AKSES UTAMA
                                </span>
                                <div className="flex size-6 items-center justify-center rounded-md bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                                    <ShieldCheck className="size-3.5" />
                                </div>
                            </div>
                            <div className="mt-2 space-y-0.5">
                                <p className="truncate text-xs font-bold text-slate-900 dark:text-white">
                                    {staff.roles[0]?.name ?? 'Staf Internal'}
                                </p>
                                <p className="truncate text-[10.5px] text-slate-500 dark:text-zinc-400">
                                    {staff.position_title ?? 'Personel Firma'}
                                </p>
                            </div>
                            <div className="mt-2.5 border-t border-slate-100 pt-2 text-[10.5px] text-slate-500 dark:border-white/[0.04]">
                                <span>{staff.roles.length} Peran Sistem Aktif</span>
                            </div>
                        </div>

                        {/* 2. Perkara Ditangani */}
                        <div className="group flex min-h-[96px] flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.08] dark:bg-[#14161b] dark:hover:border-white/15">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:text-zinc-400">
                                    PORTOFOLIO PERKARA
                                </span>
                                <div className="flex size-6 items-center justify-center rounded-md bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                                    <Briefcase className="size-3.5" />
                                </div>
                            </div>
                            <div className="mt-2 flex items-baseline gap-1.5">
                                <span className="font-mono text-xl font-bold tracking-tight text-emerald-600 sm:text-2xl dark:text-emerald-400">
                                    {metrics.active_matters_count}
                                </span>
                                <span className="text-xs text-slate-500 dark:text-zinc-400">
                                    perkara aktif
                                </span>
                            </div>
                            <div className="mt-2.5 border-t border-slate-100 pt-2 text-[10.5px] text-slate-500 dark:border-white/[0.04]">
                                <span>Total {metrics.total_matters_count} perkara terhubung</span>
                            </div>
                        </div>

                        {/* 3. Status Advokat & Kredensial */}
                        <div className="group flex min-h-[96px] flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.08] dark:bg-[#14161b] dark:hover:border-white/15">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:text-zinc-400">
                                    STATUS ADVOKAT
                                </span>
                                <div className="flex size-6 items-center justify-center rounded-md bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
                                    <Scale className="size-3.5" />
                                </div>
                            </div>
                            <div className="mt-2 space-y-0.5">
                                <p className="truncate font-mono text-xs font-bold text-slate-900 dark:text-white">
                                    {staff.advocate_license_no || 'Non-Litigasi'}
                                </p>
                                <p className="truncate text-[10.5px] text-slate-500 dark:text-zinc-400">
                                    {ktaStatus ? ktaStatus.label : 'Staf Internal'}
                                </p>
                            </div>
                            <div className="mt-2.5 border-t border-slate-100 pt-2 text-[10.5px] text-slate-500 dark:border-white/[0.04]">
                                <span>{staff.advocate_license_no ? 'Izin Advokat Resmi' : 'Kredensial Non-Advokat'}</span>
                            </div>
                        </div>

                        {/* 4. Status Akun & Keamanan */}
                        <div className="group flex min-h-[96px] flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.08] dark:bg-[#14161b] dark:hover:border-white/15">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:text-zinc-400">
                                    STATUS SISTEM
                                </span>
                                <div className="flex size-6 items-center justify-center rounded-md bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
                                    <UserCheck className="size-3.5" />
                                </div>
                            </div>
                            <div className="mt-2 space-y-0.5">
                                <p className="truncate text-xs font-bold text-slate-900 dark:text-white">
                                    {staff.is_active ? 'Akun Aktif' : 'Non-aktif'}
                                </p>
                                <p className="truncate text-[10.5px] text-slate-500 dark:text-zinc-400">
                                    {staff.last_seen_at
                                        ? `Aktif ${formatDate(staff.last_seen_at, true)}`
                                        : 'Terdaftar di Sistem'}
                                </p>
                            </div>
                            <div className="mt-2.5 border-t border-slate-100 pt-2 text-[10.5px] text-slate-500 dark:border-white/[0.04]">
                                <span>{staff.email_verified_at ? 'Email Terverifikasi' : 'Belum Verifikasi'}</span>
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
                                    ? metrics.total_matters_count
                                    : item.id === 'Akses'
                                      ? staff.roles.length
                                      : null;

                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => setTab(item.id)}
                                    className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                                        isActive
                                            ? 'bg-white text-slate-900 shadow-2xs dark:bg-[#20232a] dark:text-white'
                                            : 'text-slate-600 hover:bg-white/60 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-white/[0.04] dark:hover:text-white'
                                    }`}
                                >
                                    <Icon
                                        className={`size-3.5 shrink-0 ${
                                            isActive
                                                ? 'text-blue-600 dark:text-blue-400'
                                                : 'text-slate-400 dark:text-zinc-500'
                                        }`}
                                    />
                                    <span>{item.label}</span>
                                    {count !== null && count > 0 && (
                                        <span
                                            className={`rounded-full px-1.5 py-0.2 font-mono text-[10px] font-bold ${
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

                    {/* 3. 2-Column Split Cockpit Workspace Layout */}
                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
                        {/* Sisi Kiri: Main Workspace (8 Columns) */}
                        <div className="space-y-4 lg:col-span-8">
                            {/* TAB 1: OVERVIEW */}
                            {tab === 'Overview' && (
                                <div className="space-y-4">
                                    {/* Kredensial & Legalitas Advokat Card */}
                                    <div className="rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                        <div className="mb-2 flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-white/[0.04]">
                                            <div className="flex items-center gap-1.5">
                                                <Scale className="size-3.5 text-slate-500 dark:text-zinc-400" />
                                                <span className="text-[11px] font-semibold text-slate-500 uppercase dark:text-zinc-400">
                                                    Legalitas &amp; Kredensial
                                                    Advokat
                                                </span>
                                            </div>
                                            <Link
                                                href={userRoutes.edit?.url ? userRoutes.edit.url(staff.id) : `/admin/users/${staff.id}/edit`}
                                                className="cursor-pointer text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
                                            >
                                                Edit Kredensial →
                                            </Link>
                                        </div>

                                        {/* Specification List */}
                                        <div className="divide-y divide-slate-100 text-xs dark:divide-white/[0.04]">
                                            <div className="flex items-center justify-between py-2">
                                                <span className="text-slate-500 dark:text-zinc-400">
                                                    Nomor Induk Advokat (NIA)
                                                </span>
                                                <span className="font-mono font-semibold text-slate-900 dark:text-white">
                                                    {staff.advocate_license_no || (
                                                        <span className="font-sans font-normal text-slate-400">
                                                            -
                                                        </span>
                                                    )}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between py-2">
                                                <span className="text-slate-500 dark:text-zinc-400">
                                                    No. BAS Pengadilan Tinggi
                                                </span>
                                                <span className="font-mono font-semibold text-slate-900 dark:text-white">
                                                    {staff.bas_number || (
                                                        <span className="font-sans font-normal text-slate-400">
                                                            -
                                                        </span>
                                                    )}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between py-2">
                                                <span className="text-slate-500 dark:text-zinc-400">
                                                    Tanggal Sumpah (BAS)
                                                </span>
                                                <span className="font-medium text-slate-900 dark:text-white">
                                                    {staff.bas_date ? (
                                                        formatDate(
                                                            staff.bas_date,
                                                        )
                                                    ) : (
                                                        <span className="font-normal text-slate-400">
                                                            -
                                                        </span>
                                                    )}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between py-2">
                                                <span className="text-slate-500 dark:text-zinc-400">
                                                    Masa Berlaku KTA Advokat
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    {ktaStatus && (
                                                        <span
                                                            className={`py-0.2 rounded px-1.5 font-mono text-[9px] font-bold ${ktaStatus.color}`}
                                                        >
                                                            {ktaStatus.label}
                                                        </span>
                                                    )}
                                                    <span className="font-medium text-slate-900 dark:text-white">
                                                        {staff.kta_expiry_date ? (
                                                            formatDate(
                                                                staff.kta_expiry_date,
                                                            )
                                                        ) : (
                                                            <span className="font-normal text-slate-400">
                                                                -
                                                            </span>
                                                        )}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between py-2">
                                                <span className="text-slate-500 dark:text-zinc-400">
                                                    Pendidikan &amp; Almamater
                                                </span>
                                                <span className="font-medium text-slate-900 dark:text-white">
                                                    {staff.education || (
                                                        <span className="font-normal text-slate-400">
                                                            -
                                                        </span>
                                                    )}
                                                </span>
                                            </div>

                                            <div className="pt-2.5 pb-0.5">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-slate-500 dark:text-zinc-400">
                                                        Bidang Spesialisasi
                                                        Hukum
                                                    </span>
                                                    {practiceAreasList.length ===
                                                        0 && (
                                                        <Link
                                                            href={userRoutes.edit?.url ? userRoutes.edit.url(staff.id) : `/admin/users/${staff.id}/edit`}
                                                            className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
                                                        >
                                                            + Tambah
                                                        </Link>
                                                    )}
                                                </div>
                                                <div className="mt-1.5 flex flex-wrap gap-1.5">
                                                    {practiceAreasList.length >
                                                    0 ? (
                                                        practiceAreasList.map(
                                                            (area, idx) => (
                                                                <span
                                                                    key={idx}
                                                                    className="inline-flex items-center gap-1 rounded-md border border-slate-200/80 bg-slate-50/70 px-2 py-0.5 text-xs font-medium text-slate-800 shadow-2xs dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200"
                                                                >
                                                                    <Sparkles className="size-3 text-amber-500" />
                                                                    {area}
                                                                </span>
                                                            ),
                                                        )
                                                    ) : (
                                                        <span className="text-slate-400">
                                                            -
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Matter Sedang Ditangani */}
                                    <div className="rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                        <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-white/[0.04]">
                                            <div className="flex items-center gap-1.5">
                                                <Briefcase className="size-3.5 text-slate-500 dark:text-zinc-400" />
                                                <span className="text-[11px] font-semibold text-slate-500 uppercase dark:text-zinc-400">
                                                    Perkara Sedang Ditangani (
                                                    {staff.matters?.length ?? 0}
                                                    )
                                                </span>
                                            </div>
                                            {staff.matters &&
                                                staff.matters.length > 0 && (
                                                    <button
                                                        onClick={() =>
                                                            setTab('Matters')
                                                        }
                                                        className="cursor-pointer text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
                                                    >
                                                        Lihat Semua →
                                                    </button>
                                                )}
                                        </div>

                                        {staff.matters &&
                                        staff.matters.length > 0 ? (
                                            <div className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                                                {staff.matters.map((matter) => (
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
                                                                {matter.priority && (
                                                                    <>
                                                                        <span>
                                                                            •
                                                                        </span>
                                                                        <span className="uppercase">
                                                                            {
                                                                                matter.priority
                                                                            }
                                                                        </span>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <StatusBadge
                                                            value={
                                                                matter.status
                                                            }
                                                        />
                                                    </Link>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-5 text-center">
                                                <div className="mb-2 flex size-9 items-center justify-center rounded-xl bg-slate-100 text-slate-400 dark:bg-zinc-800 dark:text-zinc-500">
                                                    <Briefcase className="size-4.5" />
                                                </div>
                                                <p className="text-xs font-medium text-slate-600 dark:text-zinc-400">
                                                    Belum ada penugasan perkara
                                                    aktif
                                                </p>
                                                <p className="mt-0.5 text-[11px] text-slate-400 dark:text-zinc-500">
                                                    Staf ini belum ditugaskan
                                                    pada perkara yang sedang
                                                    berjalan.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* TAB 2: LEGALITAS */}
                            {tab === 'Legalitas' && (
                                <div className="space-y-4 rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-white/[0.04]">
                                        <div className="flex items-center gap-2">
                                            <Scale className="size-4 text-slate-700 dark:text-zinc-300" />
                                            <div>
                                                <h2 className="text-xs font-bold text-slate-900 dark:text-white">
                                                    Legalitas &amp; Kredensial
                                                    Profesi Advokat
                                                </h2>
                                                <p className="mt-0.5 text-[11px] text-slate-500 dark:text-zinc-400">
                                                    Dokumen sumpah advokat,
                                                    nomor induk, masa berlaku
                                                    KTA, dan almamater.
                                                </p>
                                            </div>
                                        </div>

                                        <Button
                                            size="sm"
                                            asChild
                                            className="h-8 rounded-lg bg-slate-900 px-3 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 dark:bg-white dark:text-slate-900"
                                        >
                                            <Link href={userRoutes.edit?.url ? userRoutes.edit.url(staff.id) : `/admin/users/${staff.id}/edit`}>
                                                <Pencil className="mr-1 size-3" />
                                                Edit Kredensial
                                            </Link>
                                        </Button>
                                    </div>

                                    {/* Detailed Specification List */}
                                    <div className="divide-y divide-slate-100 text-xs dark:divide-white/[0.04]">
                                        <div className="flex items-center justify-between py-2.5">
                                            <span className="text-slate-500 dark:text-zinc-400">
                                                Nomor Induk Advokat (NIA)
                                            </span>
                                            <span className="font-mono font-semibold text-slate-900 dark:text-white">
                                                {staff.advocate_license_no ||
                                                    '-'}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between py-2.5">
                                            <span className="text-slate-500 dark:text-zinc-400">
                                                No. Berita Acara Sumpah (BAS)
                                            </span>
                                            <span className="font-mono font-semibold text-slate-900 dark:text-white">
                                                {staff.bas_number || '-'}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between py-2.5">
                                            <span className="text-slate-500 dark:text-zinc-400">
                                                Tanggal Sumpah Pengadilan (BAS)
                                            </span>
                                            <span className="font-medium text-slate-900 dark:text-white">
                                                {staff.bas_date
                                                    ? formatDate(staff.bas_date)
                                                    : '-'}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between py-2.5">
                                            <span className="text-slate-500 dark:text-zinc-400">
                                                Masa Berlaku KTA Advokat
                                            </span>
                                            <div className="flex items-center gap-2">
                                                {ktaStatus && (
                                                    <span
                                                        className={`py-0.2 rounded px-1.5 font-mono text-[9px] font-bold ${ktaStatus.color}`}
                                                    >
                                                        {ktaStatus.label}
                                                    </span>
                                                )}
                                                <span className="font-medium text-slate-900 dark:text-white">
                                                    {staff.kta_expiry_date
                                                        ? formatDate(
                                                              staff.kta_expiry_date,
                                                          )
                                                        : '-'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between py-2.5">
                                            <span className="text-slate-500 dark:text-zinc-400">
                                                Riwayat Pendidikan &amp;
                                                Almamater
                                            </span>
                                            <span className="font-medium text-slate-900 dark:text-white">
                                                {staff.education || '-'}
                                            </span>
                                        </div>

                                        <div className="pt-3 pb-1">
                                            <span className="text-slate-500 dark:text-zinc-400">
                                                Bidang Spesialisasi Hukum
                                                (Practice Areas)
                                            </span>
                                            <div className="mt-2 flex flex-wrap gap-1.5">
                                                {practiceAreasList.length >
                                                0 ? (
                                                    practiceAreasList.map(
                                                        (area, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="inline-flex items-center gap-1 rounded-md border border-slate-200/80 bg-slate-50/70 px-2 py-0.5 text-xs font-medium text-slate-800 shadow-2xs dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200"
                                                            >
                                                                <Sparkles className="size-3 text-amber-500" />
                                                                {area}
                                                            </span>
                                                        ),
                                                    )
                                                ) : (
                                                    <span className="text-slate-400">
                                                        -
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB 3: MATTERS */}
                            {tab === 'Matters' && (
                                <div className="space-y-3 rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-white/[0.04]">
                                        <div className="flex items-center gap-2">
                                            <Briefcase className="size-4 text-slate-700 dark:text-zinc-300" />
                                            <h2 className="text-xs font-bold text-slate-900 dark:text-white">
                                                Daftar Perkara Hukum (
                                                {staff.matters?.length ?? 0})
                                            </h2>
                                        </div>
                                    </div>

                                    {staff.matters &&
                                    staff.matters.length > 0 ? (
                                        <div className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                                            {staff.matters.map((matter) => (
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
                                                            {matter.priority && (
                                                                <>
                                                                    <span>
                                                                        •
                                                                    </span>
                                                                    <span className="uppercase">
                                                                        {
                                                                            matter.priority
                                                                        }
                                                                    </span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <StatusBadge
                                                        value={matter.status}
                                                    />
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-6 text-center">
                                            <div className="mb-2 flex size-9 items-center justify-center rounded-xl bg-slate-100 text-slate-400 dark:bg-zinc-800 dark:text-zinc-500">
                                                <Briefcase className="size-4.5" />
                                            </div>
                                            <p className="text-xs font-medium text-slate-600 dark:text-zinc-400">
                                                Belum ada perkara terkait staf
                                                ini
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* TAB 4: KONTAK */}
                            {tab === 'Kontak' && (
                                <div className="space-y-4 rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-white/[0.04]">
                                        <div className="flex items-center gap-2">
                                            <Phone className="size-4 text-slate-700 dark:text-zinc-300" />
                                            <h2 className="text-xs font-bold text-slate-900 dark:text-white">
                                                Kontak &amp; Alamat Domisili
                                            </h2>
                                        </div>
                                        <Button
                                            size="sm"
                                            asChild
                                            className="h-8 rounded-lg bg-slate-900 px-3 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 dark:bg-white dark:text-slate-900"
                                        >
                                            <Link href={userRoutes.edit?.url ? userRoutes.edit.url(staff.id) : `/admin/users/${staff.id}/edit`}>
                                                <Pencil className="mr-1 size-3" />
                                                Edit Kontak
                                            </Link>
                                        </Button>
                                    </div>

                                    <div className="divide-y divide-slate-100 text-xs dark:divide-white/[0.04]">
                                        <div className="flex items-center justify-between py-2.5">
                                            <span className="text-slate-500 dark:text-zinc-400">
                                                Email Kerja Resmi
                                            </span>
                                            <span className="font-mono font-medium text-slate-900 dark:text-white">
                                                {staff.email}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between py-2.5">
                                            <span className="text-slate-500 dark:text-zinc-400">
                                                WhatsApp / No. HP
                                            </span>
                                            <span className="font-mono font-medium text-slate-900 dark:text-white">
                                                {staff.phone || '-'}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between py-2.5">
                                            <span className="text-slate-500 dark:text-zinc-400">
                                                Tanggal Lahir
                                            </span>
                                            <span className="font-medium text-slate-900 dark:text-white">
                                                {staff.birth_date
                                                    ? formatDate(
                                                          staff.birth_date,
                                                      )
                                                    : '-'}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between py-2.5">
                                            <span className="text-slate-500 dark:text-zinc-400">
                                                Alamat Domisili Saat Ini
                                            </span>
                                            <span className="text-right font-medium text-slate-900 dark:text-white">
                                                {staff.address || '-'}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between py-2.5">
                                            <span className="text-slate-500 dark:text-zinc-400">
                                                Alamat Sesuai KTP
                                            </span>
                                            <span className="text-right font-medium text-slate-900 dark:text-white">
                                                {staff.ktp_address || '-'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB 5: REKENING & PAJAK */}
                            {tab === 'Rekening' && (
                                <div className="space-y-4 rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-white/[0.04]">
                                        <div className="flex items-center gap-2">
                                            <CreditCard className="size-4 text-slate-700 dark:text-zinc-300" />
                                            <h2 className="text-xs font-bold text-slate-900 dark:text-white">
                                                Rekening Bank &amp; Identitas
                                                Pajak
                                            </h2>
                                        </div>
                                        <Button
                                            size="sm"
                                            asChild
                                            className="h-8 rounded-lg bg-slate-900 px-3 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 dark:bg-white dark:text-slate-900"
                                        >
                                            <Link href={userRoutes.edit?.url ? userRoutes.edit.url(staff.id) : `/admin/users/${staff.id}/edit`}>
                                                <Pencil className="mr-1 size-3" />
                                                Edit Keuangan
                                            </Link>
                                        </Button>
                                    </div>

                                    <div className="divide-y divide-slate-100 text-xs dark:divide-white/[0.04]">
                                        <div className="flex items-center justify-between py-2.5">
                                            <span className="text-slate-500 dark:text-zinc-400">
                                                Nama Bank
                                            </span>
                                            <span className="font-medium text-slate-900 dark:text-white">
                                                {staff.bank_name || '-'}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between py-2.5">
                                            <span className="text-slate-500 dark:text-zinc-400">
                                                Nomor Rekening
                                            </span>
                                            <span className="font-mono font-medium text-slate-900 dark:text-white">
                                                {staff.bank_account_number ||
                                                    '-'}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between py-2.5">
                                            <span className="text-slate-500 dark:text-zinc-400">
                                                Atas Nama Rekening
                                            </span>
                                            <span className="font-medium text-slate-900 dark:text-white">
                                                {staff.bank_account_holder ||
                                                    '-'}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between py-2.5">
                                            <span className="text-slate-500 dark:text-zinc-400">
                                                Nomor Pokok Wajib Pajak (NPWP)
                                            </span>
                                            <span className="font-mono font-medium text-slate-900 dark:text-white">
                                                {staff.npwp || '-'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB 6: HAK AKSES & PERAN */}
                            {tab === 'Akses' && (
                                <div className="space-y-4 rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-white/[0.04]">
                                        <div className="flex items-center gap-2">
                                            <ShieldCheck className="size-4 text-slate-700 dark:text-zinc-300" />
                                            <h2 className="text-xs font-bold text-slate-900 dark:text-white">
                                                Peran &amp; Otorisasi Sistem (
                                                {staff.roles.length})
                                            </h2>
                                        </div>
                                        <Button
                                            size="sm"
                                            asChild
                                            className="h-8 rounded-lg bg-slate-900 px-3 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 dark:bg-white dark:text-slate-900"
                                        >
                                            <Link href={userRoutes.edit?.url ? userRoutes.edit.url(staff.id) : `/admin/users/${staff.id}/edit`}>
                                                <Pencil className="mr-1 size-3" />
                                                Kelola Role
                                            </Link>
                                        </Button>
                                    </div>

                                    <div className="divide-y divide-slate-100 text-xs dark:divide-white/[0.04]">
                                        {staff.roles.map((role) => (
                                            <div
                                                key={role.id}
                                                className="flex items-center justify-between py-3"
                                            >
                                                <div className="space-y-0.5">
                                                    <div className="flex items-center gap-2">
                                                        <Shield className="size-3.5 text-purple-600 dark:text-purple-400" />
                                                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                                                            {role.name}
                                                        </span>
                                                        <span className="py-0.2 rounded bg-slate-100 px-1.5 font-mono text-[9px] font-semibold text-slate-700 dark:bg-zinc-800 dark:text-zinc-300">
                                                            {role.slug}
                                                        </span>
                                                    </div>
                                                    {role.description && (
                                                        <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                                                            {role.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sisi Kanan: Sidebar Cards (4 Columns) */}
                        <div className="space-y-4 lg:col-span-4">
                            {/* Kontak Langsung */}
                            <div className="rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                <div className="mb-2 flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-white/[0.04]">
                                    <div className="flex items-center gap-1.5">
                                        <Phone className="size-3.5 text-slate-500 dark:text-zinc-400" />
                                        <span className="text-[11px] font-semibold text-slate-500 uppercase dark:text-zinc-400">
                                            Kontak Staf
                                        </span>
                                    </div>
                                    <Link
                                        href={userRoutes.edit?.url ? userRoutes.edit.url(staff.id) : `/admin/users/${staff.id}/edit`}
                                        className="cursor-pointer text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
                                    >
                                        Edit
                                    </Link>
                                </div>

                                <div className="divide-y divide-slate-100 text-xs dark:divide-white/[0.04]">
                                    <div className="flex items-center justify-between py-2">
                                        <span className="text-slate-500 dark:text-zinc-400">
                                            Email
                                        </span>
                                        <div className="flex items-center gap-1.5 overflow-hidden">
                                            <span
                                                className="truncate font-mono font-medium text-slate-900 dark:text-white"
                                                title={staff.email}
                                            >
                                                {staff.email}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleCopy(
                                                        staff.email,
                                                        'email',
                                                    )
                                                }
                                                className="shrink-0 text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200"
                                            >
                                                {copiedField === 'email' ? (
                                                    <Check className="size-3 text-emerald-600" />
                                                ) : (
                                                    <Copy className="size-3" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between py-2">
                                        <span className="text-slate-500 dark:text-zinc-400">
                                            WhatsApp
                                        </span>
                                        <span className="font-mono font-medium text-slate-900 dark:text-white">
                                            {staff.phone || (
                                                <span className="font-sans font-normal text-slate-400">
                                                    -
                                                </span>
                                            )}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between py-2">
                                        <span className="text-slate-500 dark:text-zinc-400">
                                            Tanggal Lahir
                                        </span>
                                        <span className="font-medium text-slate-900 dark:text-white">
                                            {staff.birth_date
                                                ? formatDate(staff.birth_date)
                                                : '-'}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between py-2">
                                        <span className="text-slate-500 dark:text-zinc-400">
                                            Domisili Saat Ini
                                        </span>
                                        <span className="text-right font-medium text-slate-900 dark:text-white">
                                            {staff.address || (
                                                <span className="font-normal text-slate-400">
                                                    -
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Rekening & Pajak */}
                            <div className="rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                <div className="mb-2 flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-white/[0.04]">
                                    <div className="flex items-center gap-1.5">
                                        <CreditCard className="size-3.5 text-slate-500 dark:text-zinc-400" />
                                        <span className="text-[11px] font-semibold text-slate-500 uppercase dark:text-zinc-400">
                                            Rekening &amp; Pajak
                                        </span>
                                    </div>
                                    <Link
                                        href={userRoutes.edit?.url ? userRoutes.edit.url(staff.id) : `/admin/users/${staff.id}/edit`}
                                        className="cursor-pointer text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
                                    >
                                        Edit
                                    </Link>
                                </div>

                                <div className="divide-y divide-slate-100 text-xs dark:divide-white/[0.04]">
                                    <div className="flex items-center justify-between py-2">
                                        <span className="text-slate-500 dark:text-zinc-400">
                                            Bank
                                        </span>
                                        <span className="font-medium text-slate-900 dark:text-white">
                                            {staff.bank_name || '-'}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between py-2">
                                        <span className="text-slate-500 dark:text-zinc-400">
                                            No. Rekening
                                        </span>
                                        <span className="font-mono font-medium text-slate-900 dark:text-white">
                                            {staff.bank_account_number || '-'}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between py-2">
                                        <span className="text-slate-500 dark:text-zinc-400">
                                            Atas Nama
                                        </span>
                                        <span className="font-medium text-slate-700 dark:text-zinc-300">
                                            {staff.bank_account_holder || '-'}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between py-2">
                                        <span className="text-slate-500 dark:text-zinc-400">
                                            NPWP
                                        </span>
                                        <span className="font-mono font-medium text-slate-900 dark:text-white">
                                            {staff.npwp || '-'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Otorisasi & Sistem */}
                            <div className="rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                <div className="mb-2 flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-white/[0.04]">
                                    <div className="flex items-center gap-1.5">
                                        <ShieldCheck className="size-3.5 text-slate-500 dark:text-zinc-400" />
                                        <span className="text-[11px] font-semibold text-slate-500 uppercase dark:text-zinc-400">
                                            Otorisasi Sistem
                                        </span>
                                    </div>
                                    <span className="font-mono text-[11px] font-semibold text-slate-700 dark:text-zinc-300">
                                        {staff.roles.length} Role
                                    </span>
                                </div>

                                <div className="space-y-2.5 text-xs">
                                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                                        {staff.roles.map((r) => (
                                            <span
                                                key={r.id}
                                                className="inline-flex items-center gap-1 rounded-md border border-slate-200/80 bg-slate-50/70 px-2 py-0.5 text-[10.5px] font-medium text-slate-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300"
                                            >
                                                <Shield className="size-2.5 text-purple-600 dark:text-purple-400" />
                                                {r.name}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="divide-y divide-slate-100 border-t border-slate-100 pt-1 text-[11px] text-slate-500 dark:divide-white/[0.04] dark:border-white/[0.04] dark:text-zinc-400">
                                        <div className="flex items-center justify-between py-1.5">
                                            <span>Email Terverifikasi</span>
                                            <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-zinc-300">
                                                {staff.email_verified_at ? (
                                                    <>
                                                        <CheckCircle2 className="size-3 text-emerald-600 dark:text-emerald-400" />
                                                        Terverifikasi
                                                    </>
                                                ) : (
                                                    'Belum'
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between py-1.5">
                                            <span>Terdaftar Sejak</span>
                                            <span className="font-medium text-slate-700 dark:text-zinc-300">
                                                {staff.created_at
                                                    ? formatDate(
                                                          staff.created_at,
                                                      )
                                                    : '-'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Modal: Edit User */}
            <EditUserDialog
                user={staff as any}
                roles={roles}
                open={isEditing}
                defaultTab={initialEditTab}
                onOpenChange={setIsEditing}
                onDeleteClick={() => {
                    setIsEditing(false);
                    setIsDeleting(true);
                }}
            />

            {/* Modal: Hapus User */}
            <DeleteUserDialog
                user={staff as any}
                open={isDeleting}
                onOpenChange={setIsDeleting}
                onDeleted={() => {
                    router.visit(userRoutes.index?.url ? userRoutes.index.url() : '/admin/users');
                }}
            />
        </TooltipProvider>
    );
}

function EditUserDialog({
    user,
    roles,
    open,
    defaultTab = 'account',
    onOpenChange,
    onDeleteClick,
}: {
    user: UserDetail | null;
    roles: Role[];
    open: boolean;
    defaultTab?: 'account' | 'advocate' | 'contact' | 'billing';
    onOpenChange: (open: boolean) => void;
    onDeleteClick?: () => void;
}) {
    const getInitials = useInitials();
    const [activeTab, setActiveTab] = useState<
        'account' | 'advocate' | 'contact' | 'billing'
    >(defaultTab);

    useMemo(() => {
        setActiveTab(defaultTab);
    }, [defaultTab, open]);

    if (!user) return null;

    const assignedRoleIds = new Set(user.roles.map((role) => role.id));

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="flex max-h-[90vh] max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-0 gap-0 shadow-2xl dark:border-white/10 dark:bg-[#14161b]">
                {/* 1. Modal Cockpit Header */}
                <div className="shrink-0 border-b border-slate-100 bg-slate-50/70 px-6 pt-5 pb-3.5 pr-12 dark:border-white/[0.06] dark:bg-[#121418]">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="relative size-10 shrink-0 rounded-full bg-linear-to-b from-slate-200 via-slate-100 to-slate-300 p-0.5 shadow-xs dark:from-white/20 dark:via-white/5 dark:to-white/15">
                                <Avatar className="size-full rounded-full bg-slate-900 shadow-inner dark:bg-zinc-800">
                                    <AvatarImage
                                        src={user.avatar_url ?? undefined}
                                        className="rounded-full object-cover"
                                    />
                                    <AvatarFallback className="rounded-full bg-linear-to-br from-slate-900 via-slate-800 to-indigo-950 text-xs font-bold text-white">
                                        {getInitials(user.name)}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                            <div className="min-w-0">
                                <DialogTitle className="truncate text-base font-bold text-slate-900 dark:text-white">
                                    Kelola Staf: {user.name}
                                </DialogTitle>
                                <DialogDescription className="truncate text-xs text-slate-500 dark:text-zinc-400">
                                    {user.email}
                                    {user.position_title
                                        ? ` · ${user.position_title}`
                                        : ''}
                                </DialogDescription>
                            </div>
                        </div>

                        <span className="hidden shrink-0 items-center rounded-lg border border-slate-200/80 bg-white px-2.5 py-1 font-mono text-[11px] font-bold text-slate-800 shadow-2xs sm:inline-flex dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200">
                            {user.employee_code ||
                                `RPK-${user.id.toString().padStart(3, '0')}`}
                        </span>
                    </div>

                    {/* 2. Segmented Navigation Tabs */}
                    <div className="mt-3.5 grid grid-cols-4 gap-1 rounded-xl border border-slate-200/70 bg-slate-200/50 p-1 dark:border-white/5 dark:bg-[#181a20]">
                        <button
                            type="button"
                            onClick={() => setActiveTab('account')}
                            className={`flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition-all ${
                                activeTab === 'account'
                                    ? 'bg-white text-slate-900 shadow-2xs dark:bg-[#22252c] dark:text-white'
                                    : 'text-slate-600 hover:bg-white/50 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white'
                            }`}
                        >
                            <UserCheck className="size-3.5 shrink-0" />
                            <span>Akun</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('advocate')}
                            className={`flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition-all ${
                                activeTab === 'advocate'
                                    ? 'bg-white text-slate-900 shadow-2xs dark:bg-[#22252c] dark:text-white'
                                    : 'text-slate-600 hover:bg-white/50 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white'
                            }`}
                        >
                            <Scale className="size-3.5 shrink-0" />
                            <span>Kredensial</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('contact')}
                            className={`flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition-all ${
                                activeTab === 'contact'
                                    ? 'bg-white text-slate-900 shadow-2xs dark:bg-[#22252c] dark:text-white'
                                    : 'text-slate-600 hover:bg-white/50 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white'
                            }`}
                        >
                            <Phone className="size-3.5 shrink-0" />
                            <span>Kontak</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('billing')}
                            className={`flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition-all ${
                                activeTab === 'billing'
                                    ? 'bg-white text-slate-900 shadow-2xs dark:bg-[#22252c] dark:text-white'
                                    : 'text-slate-600 hover:bg-white/50 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white'
                            }`}
                        >
                            <CreditCard className="size-3.5 shrink-0" />
                            <span>Rekening</span>
                        </button>
                    </div>
                </div>

                {/* 3. Form Body */}
                <Form
                    {...(userRoutes.update?.form ? userRoutes.update.form(user.id) : { action: `/admin/users/${user.id}`, method: 'put' as const })}
                    className="flex min-h-0 flex-1 flex-col"
                    onSuccess={() => onOpenChange(false)}
                >
                    {({ errors, processing }) => (
                        <>
                            <div className="max-h-[60vh] overflow-y-auto px-6 py-4.5">
                                {/* TAB 1: AKUN & PERAN */}
                                {activeTab === 'account' && (
                                    <div className="space-y-3.5">
                                        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                                            <Field
                                                name="name"
                                                label="Nama Lengkap"
                                                defaultValue={user.name}
                                                required
                                            />
                                            <Field
                                                name="email"
                                                label="Alamat Email"
                                                type="email"
                                                defaultValue={user.email}
                                                required
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                                            <Field
                                                name="position_title"
                                                label="Jabatan / Posisi"
                                                defaultValue={
                                                    user.position_title ?? ''
                                                }
                                                placeholder="Contoh: Senior Associate"
                                            />
                                            <Field
                                                name="employee_code"
                                                label="Nomor NIP / ID Staf"
                                                defaultValue={
                                                    user.employee_code ?? ''
                                                }
                                                placeholder="Contoh: RPK-2026-001"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                                            <Field
                                                name="department"
                                                label="Departemen / Divisi"
                                                defaultValue={user.department ?? ''}
                                                placeholder="Litigasi & Arbitrase"
                                            />
                                            <Field
                                                name="password"
                                                label="Ubah Password (Opsional)"
                                                type="password"
                                                placeholder="Kosongkan jika tidak ingin mengganti"
                                            />
                                        </div>

                                        {/* Role Selection Grid */}
                                        <div className="space-y-2 rounded-xl border border-slate-200/80 bg-slate-50/40 p-3.5 dark:border-white/[0.06] dark:bg-[#121418]">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-1.5">
                                                    <Shield className="size-3.5 text-purple-600 dark:text-purple-400" />
                                                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                                                        Hak Akses &amp; Role Sistem
                                                    </span>
                                                </div>
                                                <span className="text-[11px] font-medium text-slate-500 dark:text-zinc-400">
                                                    Pilih satu atau beberapa role
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 gap-2 pt-1 sm:grid-cols-2">
                                                {roles.map((role) => {
                                                    const isChecked =
                                                        assignedRoleIds.has(
                                                            role.id,
                                                        );
                                                    return (
                                                        <label
                                                            key={role.id}
                                                            className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200/80 bg-white p-2.5 shadow-2xs transition-all hover:border-slate-300 hover:bg-slate-50/80 dark:border-white/10 dark:bg-[#16181d] dark:hover:border-white/20"
                                                        >
                                                            <div className="flex items-center gap-2.5">
                                                                <input
                                                                    type="checkbox"
                                                                    name="role_ids[]"
                                                                    value={role.id}
                                                                    defaultChecked={
                                                                        isChecked
                                                                    }
                                                                    className="size-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 dark:border-white/20 dark:bg-zinc-800"
                                                                />
                                                                <span className="text-xs font-semibold text-slate-900 dark:text-white">
                                                                    {role.name}
                                                                </span>
                                                            </div>
                                                            <span className="font-mono text-[10px] font-medium text-slate-400 dark:text-zinc-500">
                                                                {role.slug}
                                                            </span>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                            <InputError message={errors.role_ids} />
                                        </div>

                                        {/* Status Card */}
                                        <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50/70 p-3 transition-colors hover:bg-slate-100/70 dark:border-white/10 dark:bg-[#16181d] dark:hover:bg-white/[0.04]">
                                            <div className="flex items-center gap-3">
                                                <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                                                    <UserCheck className="size-4" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                                                        Status Akun Aktif
                                                    </p>
                                                    <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                                                        Izinkan staf untuk login
                                                    </p>
                                                </div>
                                            </div>
                                            <input
                                                type="checkbox"
                                                id="is_active"
                                                name="is_active"
                                                value="1"
                                                defaultChecked={user.is_active}
                                                className="size-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 dark:border-white/20 dark:bg-zinc-800"
                                            />
                                        </label>
                                    </div>
                                )}

                                {/* TAB 2: KREDENSIAL ADVOKAT */}
                                {activeTab === 'advocate' && (
                                    <div className="space-y-3.5">
                                        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                                            <Field
                                                name="advocate_license_no"
                                                label="Nomor Induk Advokat (NIA)"
                                                defaultValue={
                                                    user.advocate_license_no ?? ''
                                                }
                                                placeholder="Contoh: 18.01234/PERADI"
                                            />
                                            <Field
                                                name="kta_expiry_date"
                                                label="Masa Berlaku KTA Advokat"
                                                type="date"
                                                defaultValue={
                                                    user.kta_expiry_date
                                                        ? user.kta_expiry_date.split(
                                                              'T',
                                                           )[0]
                                                        : ''
                                                }
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                                            <Field
                                                name="bas_number"
                                                label="Nomor Berita Acara Sumpah (BAS)"
                                                defaultValue={user.bas_number ?? ''}
                                                placeholder="No. Surat Pengadilan Tinggi"
                                            />
                                            <Field
                                                name="bas_date"
                                                label="Tanggal Sumpah Advokat (BAS)"
                                                type="date"
                                                defaultValue={
                                                    user.bas_date
                                                        ? user.bas_date.split(
                                                              'T',
                                                           )[0]
                                                        : ''
                                                }
                                            />
                                        </div>

                                        <Field
                                            name="education"
                                            label="Gelar &amp; Riwayat Pendidikan"
                                            defaultValue={user.education ?? ''}
                                            placeholder="Contoh: S.H. (UI), LL.M. (Leiden)"
                                        />

                                        <TextareaField
                                            name="practice_areas"
                                            label="Bidang Keahlian / Spesialisasi Hukum (Practice Areas)"
                                            defaultValue={user.practice_areas ?? ''}
                                            placeholder="Contoh: Corporate M&A, Commercial Litigation, Dispute Resolution, IPR, Employment Law"
                                            rows={2}
                                            helperText="Pisahkan beberapa keahlian dengan koma"
                                        />
                                    </div>
                                )}

                                {/* TAB 3: KONTAK & DOMISILI */}
                                {activeTab === 'contact' && (
                                    <div className="space-y-3.5">
                                        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                                            <Field
                                                name="phone"
                                                label="Nomor WhatsApp / HP Resmi"
                                                defaultValue={user.phone ?? ''}
                                                placeholder="Contoh: 081234567890"
                                            />
                                            <Field
                                                name="birth_date"
                                                label="Tanggal Lahir"
                                                type="date"
                                                defaultValue={
                                                    user.birth_date
                                                        ? user.birth_date.split(
                                                              'T',
                                                           )[0]
                                                        : ''
                                                }
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                                            <TextareaField
                                                name="address"
                                                label="Alamat Domisili Saat Ini"
                                                defaultValue={user.address ?? ''}
                                                placeholder="Alamat tempat tinggal lengkap saat ini..."
                                                rows={3}
                                            />

                                            <TextareaField
                                                name="ktp_address"
                                                label="Alamat Sesuai KTP"
                                                defaultValue={
                                                    user.ktp_address ?? ''
                                                }
                                                placeholder="Alamat resmi yang tertera pada kartu identitas KTP..."
                                                rows={3}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* TAB 4: REKENING & PAJAK */}
                                {activeTab === 'billing' && (
                                    <div className="space-y-3.5">
                                        <Field
                                            name="npwp"
                                            label="Nomor Pokok Wajib Pajak (NPWP)"
                                            defaultValue={user.npwp ?? ''}
                                            placeholder="Contoh: 01.234.567.8-901.000"
                                        />

                                        {/* Bank Details Container */}
                                        <div className="space-y-2.5 rounded-xl border border-slate-200/80 bg-slate-50/40 p-3.5 dark:border-white/[0.06] dark:bg-[#121418]">
                                            <div className="flex items-center gap-1.5">
                                                <CreditCard className="size-3.5 text-slate-600 dark:text-zinc-400" />
                                                <span className="text-xs font-bold text-slate-900 dark:text-white">
                                                    Informasi Rekening Bank (Payroll &amp; Fee Sharing)
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                                <Field
                                                    name="bank_name"
                                                    label="Nama Bank"
                                                    defaultValue={
                                                        user.bank_name ?? ''
                                                    }
                                                    placeholder="BCA / Mandiri"
                                                />
                                                <Field
                                                    name="bank_account_number"
                                                    label="Nomor Rekening"
                                                    defaultValue={
                                                        user.bank_account_number ??
                                                        ''
                                                    }
                                                    placeholder="1234567890"
                                                />
                                                <Field
                                                    name="bank_account_holder"
                                                    label="Atas Nama"
                                                    defaultValue={
                                                        user.bank_account_holder ??
                                                        ''
                                                    }
                                                    placeholder="Nama Pemilik"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* 4. Modal Action Footer */}
                            <div className="flex shrink-0 items-center justify-between border-t border-slate-100 bg-slate-50/70 px-6 py-3.5 dark:border-white/[0.06] dark:bg-[#121418]">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        onOpenChange(false);
                                        onDeleteClick?.();
                                    }}
                                    className="h-9 cursor-pointer rounded-xl px-3 text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-950/30"
                                >
                                    <Trash2 className="mr-1.5 size-3.5" />
                                    Hapus Akun
                                </Button>

                                <div className="flex items-center gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onOpenChange(false)}
                                        className="h-9 rounded-xl border-slate-200/80 px-4 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-100/80 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-300"
                                    >
                                        Batal
                                    </Button>
                                    <Button
                                        type="submit"
                                        size="sm"
                                        disabled={processing}
                                        className="h-9 cursor-pointer rounded-xl bg-slate-900 px-5 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 active:scale-95 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                                    >
                                        {processing
                                            ? 'Menyimpan...'
                                            : 'Simpan Perubahan'}
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}

function DeleteUserDialog({
    user,
    open,
    onOpenChange,
    onDeleted,
}: {
    user: UserDetail | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onDeleted?: () => void;
}) {
    const getInitials = useInitials();
    if (!user) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xl sm:max-w-md dark:border-white/10 dark:bg-[#14161b]">
                <DialogHeader className="border-b border-slate-100 pb-3 dark:border-white/[0.06]">
                    <div className="flex items-center gap-2.5">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
                            <AlertTriangle className="size-4" />
                        </div>
                        <div>
                            <DialogTitle className="text-sm font-bold text-slate-900 dark:text-white">
                                Hapus Akun Pengguna
                            </DialogTitle>
                            <DialogDescription className="text-xs text-slate-500">
                                Konfirmasi penghapusan akses akun staf.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-2.5 rounded-xl border border-slate-200/70 bg-slate-50/60 p-2.5 dark:border-white/5 dark:bg-[#121418]">
                        <Avatar className="size-9 shrink-0 rounded-lg border border-slate-200 dark:border-white/10">
                            <AvatarImage
                                src={user.avatar_url ?? undefined}
                                className="object-cover"
                            />
                            <AvatarFallback className="rounded-lg bg-rose-50 text-xs font-bold text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                                {getInitials(user.name)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 dark:text-white">
                                {user.name}
                            </p>
                            <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                                {user.email}
                                {user.position_title
                                    ? ` · ${user.position_title}`
                                    : ''}
                            </p>
                        </div>
                    </div>

                    <p className="text-xs leading-relaxed text-slate-600 dark:text-zinc-400">
                        Apakah Anda yakin ingin menghapus akun{' '}
                        <strong>{user.name}</strong> ({user.email})? Jika
                        pengguna memiliki riwayat perkara atau data keuangan
                        terkait, status akun akan dinonaktifkan secara aman
                        untuk melindungi integritas berkas.
                    </p>

                    <Form
                        {...(userRoutes.destroy?.form ? userRoutes.destroy.form(user.id) : { action: `/admin/users/${user.id}`, method: 'delete' as const })}
                        onSuccess={() => {
                            onOpenChange(false);
                            onDeleted?.();
                        }}
                        className="flex items-center justify-end gap-2 pt-2"
                    >
                        {({ processing }) => (
                            <>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onOpenChange(false)}
                                    className="h-8 rounded-lg border-slate-200 px-3.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    variant="destructive"
                                    size="sm"
                                    disabled={processing}
                                    className="h-8 rounded-lg bg-rose-600 px-4 text-xs font-semibold text-white shadow-2xs hover:bg-rose-700"
                                >
                                    {processing ? (
                                        <Spinner className="size-3.5" />
                                    ) : (
                                        <>
                                            <Trash2 className="mr-1.5 size-3.5" />
                                            Hapus Pengguna
                                        </>
                                    )}
                                </Button>
                            </>
                        )}
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function Field({
    name,
    label,
    type = 'text',
    placeholder,
    defaultValue,
    required = false,
    helperText,
}: {
    name: string;
    label: string;
    type?: string;
    placeholder?: string;
    defaultValue?: string | number;
    required?: boolean;
    helperText?: string;
}) {
    return (
        <div className="grid gap-1.5">
            <Label
                htmlFor={name}
                className="text-xs font-semibold text-slate-700 dark:text-zinc-200"
            >
                {label} {required && <span className="text-rose-500">*</span>}
            </Label>
            <Input
                id={name}
                name={name}
                type={type}
                placeholder={placeholder}
                defaultValue={
                    defaultValue !== null && defaultValue !== undefined
                        ? String(defaultValue)
                        : ''
                }
                required={required}
                className="h-9 rounded-xl border-slate-200/80 bg-slate-50/50 text-xs text-slate-900 shadow-2xs transition-colors focus:border-slate-400 focus:bg-white dark:border-white/10 dark:bg-[#16181d] dark:text-white dark:focus:bg-[#1a1d24]"
            />
            {helperText && (
                <p className="text-[11px] text-slate-400 dark:text-zinc-500">
                    {helperText}
                </p>
            )}
        </div>
    );
}

function TextareaField({
    name,
    label,
    placeholder,
    defaultValue,
    rows = 2,
    helperText,
}: {
    name: string;
    label: string;
    placeholder?: string;
    defaultValue?: string;
    rows?: number;
    helperText?: string;
}) {
    return (
        <div className="grid gap-1.5">
            <Label
                htmlFor={name}
                className="text-xs font-semibold text-slate-700 dark:text-zinc-200"
            >
                {label}
            </Label>
            <textarea
                id={name}
                name={name}
                rows={rows}
                placeholder={placeholder}
                defaultValue={defaultValue ?? ''}
                className="w-full resize-none rounded-xl border border-slate-200/80 bg-slate-50/50 p-2.5 text-xs text-slate-900 shadow-2xs transition-colors focus:border-slate-400 focus:bg-white focus:outline-none dark:border-white/10 dark:bg-[#16181d] dark:text-white dark:focus:bg-[#1a1d24]"
            />
            {helperText && (
                <p className="text-[11px] text-slate-400 dark:text-zinc-500">
                    {helperText}
                </p>
            )}
        </div>
    );
}

UserShow.layout = {
    breadcrumbs: [
        { title: 'Pengguna & Akses', href: userRoutes.index?.url ? userRoutes.index.url() : '/admin/users' },
        { title: 'Profil Staf', href: '' },
    ],
};
