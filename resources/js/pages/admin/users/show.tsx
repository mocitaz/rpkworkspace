import { Form, Head, Link, router } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowLeft,
    Award,
    Banknote,
    Briefcase,
    Building2,
    Calendar,
    CalendarCheck,
    Check,
    CheckCircle2,
    Copy,
    CreditCard,
    ExternalLink,
    FileBadge,
    FileCheck2,
    FileText,
    GraduationCap,
    Info,
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
    User,
    UserCheck,
    Users,
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

const navigationTabs = [
    { id: 'Overview', label: 'Ringkasan Eksekutif', icon: Building2 },
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
    const [tab, setTab] =
        useState<(typeof navigationTabs)[number]['id']>('Overview');
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

    // Practice areas list parser
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
                label: `Perlu Perpanjangan (${diffDays} hari lagi)`,
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

            <div className="min-h-screen bg-[#fafafc] pb-24 text-slate-900 dark:bg-[#0c0d10] dark:text-zinc-100">
                <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
                    {/* 1. Header Navigation & Cockpit Bar */}
                    <div className="flex flex-col justify-between gap-4 border-b border-slate-200/60 pb-5 sm:flex-row sm:items-center dark:border-white/[0.06]">
                        <div className="flex flex-wrap items-center gap-2.5">
                            <Button
                                asChild
                                variant="outline"
                                size="sm"
                                className="h-8.5 rounded-xl border-slate-200/80 bg-white px-3 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-white/10 dark:bg-[#14161b] dark:text-zinc-300 dark:hover:bg-zinc-800"
                            >
                                <Link href={userRoutes.index()}>
                                    <ArrowLeft className="mr-1.5 size-3.5 text-slate-400" />
                                    Kembali ke Pengguna &amp; Akses
                                </Link>
                            </Button>

                            <span className="hidden text-slate-300 sm:inline dark:text-zinc-700">
                                |
                            </span>

                            <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/70 bg-white px-2.5 py-1 font-mono text-xs font-bold text-slate-800 shadow-2xs dark:border-white/5 dark:bg-[#14161b] dark:text-zinc-300">
                                <Shield className="size-3 text-slate-400" />
                                {displayId}
                            </span>

                            <span
                                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                                    staff.is_active
                                        ? 'border border-emerald-200/70 bg-emerald-50 text-emerald-700 dark:border-emerald-800/50 dark:bg-emerald-950/40 dark:text-emerald-300'
                                        : 'border border-rose-200/70 bg-rose-50 text-rose-700 dark:border-rose-800/50 dark:bg-rose-950/40 dark:text-rose-300'
                                }`}
                            >
                                <span className="size-1.5 rounded-full bg-current" />
                                {staff.is_active ? 'Akun Aktif' : 'Nonaktif'}
                            </span>
                        </div>

                        {/* Top Action Buttons */}
                        <div className="flex flex-wrap items-center gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleOpenChat}
                                className="h-8.5 rounded-xl border-slate-200/80 bg-white px-3.5 text-xs font-semibold text-slate-700 shadow-2xs hover:border-slate-300 hover:bg-slate-50 dark:border-white/10 dark:bg-[#14161b] dark:text-zinc-300 dark:hover:bg-zinc-800"
                            >
                                <MessageSquare className="mr-1.5 size-3.5 text-blue-500" />
                                Kirim Pesan
                            </Button>

                            {staff.phone && (
                                <Button
                                    asChild
                                    variant="outline"
                                    size="sm"
                                    className="h-8.5 rounded-xl border-emerald-200 bg-emerald-50/70 px-3.5 text-xs font-semibold text-emerald-700 shadow-2xs hover:bg-emerald-100 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-300"
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
                                className="h-8.5 rounded-xl border-slate-200/80 bg-white px-3.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-white/10 dark:bg-[#14161b] dark:text-zinc-300"
                            >
                                <a href={`mailto:${staff.email}`}>
                                    <Mail className="mr-1.5 size-3.5 text-slate-400" />
                                    Email
                                </a>
                            </Button>

                            <Button
                                type="button"
                                size="sm"
                                onClick={() => openEditWithTab('account')}
                                className="h-8.5 cursor-pointer rounded-xl bg-slate-900 px-4 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 active:scale-95 dark:bg-white dark:text-slate-900 dark:hover:bg-zinc-200"
                            >
                                <Pencil className="mr-1.5 size-3.5" />
                                Edit Profil Staf
                            </Button>
                        </div>
                    </div>

                    {/* 2. Top 4 Executive Stat Cards */}
                    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {/* 1. Kredensial Advokat */}
                        <div
                            onClick={() => setTab('Legalitas')}
                            className="group cursor-pointer rounded-2xl border border-slate-200/70 bg-white p-4 shadow-2xs transition-all hover:border-slate-300 hover:shadow-xs dark:border-white/[0.06] dark:bg-[#14161b] dark:hover:border-white/10"
                        >
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[10px] font-bold tracking-wider uppercase">
                                    Kredensial Advokat
                                </span>
                                <Scale className="size-4 text-slate-400 transition-colors group-hover:text-amber-600 dark:text-zinc-500" />
                            </div>
                            <div className="mt-2.5">
                                <p className="truncate font-mono text-sm font-bold text-slate-900 dark:text-white">
                                    {staff.advocate_license_no
                                        ? `NIA: ${staff.advocate_license_no}`
                                        : 'Legal / Associate Staff'}
                                </p>
                                <p className="mt-0.5 truncate text-[11px] text-slate-500 dark:text-zinc-400">
                                    {staff.bas_number
                                        ? `BAS No. ${staff.bas_number}`
                                        : 'Belum terdaftar sumpah advokat'}
                                </p>
                            </div>
                            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-[10.5px] text-slate-400 dark:border-white/[0.04]">
                                <span>Status Keabsahan</span>
                                <span className="font-semibold text-amber-700 dark:text-amber-400">
                                    {staff.advocate_license_no
                                        ? 'Advokat Resmi'
                                        : 'Staf Hukum'}
                                </span>
                            </div>
                        </div>

                        {/* 2. Portofolio Perkara */}
                        <div
                            onClick={() => setTab('Matters')}
                            className="group cursor-pointer rounded-2xl border border-slate-200/70 bg-white p-4 shadow-2xs transition-all hover:border-slate-300 hover:shadow-xs dark:border-white/[0.06] dark:bg-[#14161b] dark:hover:border-white/10"
                        >
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[10px] font-bold tracking-wider uppercase">
                                    Portofolio Perkara
                                </span>
                                <Briefcase className="size-4 text-slate-400 transition-colors group-hover:text-blue-600 dark:text-zinc-500" />
                            </div>
                            <div className="mt-2 flex items-baseline justify-between">
                                <span className="font-mono text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    {metrics.active_matters_count}
                                </span>
                                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                                    perkara aktif
                                </span>
                            </div>
                            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-[10.5px] text-slate-400 dark:border-white/[0.04]">
                                <span>Total Ditangani</span>
                                <span className="font-semibold text-slate-700 dark:text-zinc-300">
                                    {metrics.total_matters_count} Riwayat Kasus
                                </span>
                            </div>
                        </div>

                        {/* 3. Pendidikan & Almamater */}
                        <div
                            onClick={() => setTab('Legalitas')}
                            className="group cursor-pointer rounded-2xl border border-slate-200/70 bg-white p-4 shadow-2xs transition-all hover:border-slate-300 hover:shadow-xs dark:border-white/[0.06] dark:bg-[#14161b] dark:hover:border-white/10"
                        >
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[10px] font-bold tracking-wider uppercase">
                                    Pendidikan &amp; Gelar
                                </span>
                                <GraduationCap className="size-4 text-slate-400 transition-colors group-hover:text-purple-600 dark:text-zinc-500" />
                            </div>
                            <div className="mt-2.5">
                                <p className="truncate text-xs font-bold text-slate-900 dark:text-white">
                                    {staff.education ||
                                        'Gelar belum dicantumkan'}
                                </p>
                                <p className="mt-0.5 truncate text-[11px] text-slate-500 dark:text-zinc-400">
                                    {practiceAreasList.length > 0
                                        ? `${practiceAreasList.length} Bidang Keahlian`
                                        : 'Spesialisasi hukum umum'}
                                </p>
                            </div>
                            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-[10.5px] text-slate-400 dark:border-white/[0.04]">
                                <span>Kualifikasi Akademik</span>
                                <span className="font-semibold text-purple-700 dark:text-purple-400">
                                    {staff.education
                                        ? 'Lengkap'
                                        : 'Perlu Diisi'}
                                </span>
                            </div>
                        </div>

                        {/* 4. Otorisasi Sistem */}
                        <div
                            onClick={() => setTab('Akses')}
                            className="group cursor-pointer rounded-2xl border border-slate-200/70 bg-white p-4 shadow-2xs transition-all hover:border-slate-300 hover:shadow-xs dark:border-white/[0.06] dark:bg-[#14161b] dark:hover:border-white/10"
                        >
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[10px] font-bold tracking-wider uppercase">
                                    Role &amp; Otorisasi
                                </span>
                                <ShieldCheck className="size-4 text-slate-400 transition-colors group-hover:text-emerald-600 dark:text-zinc-500" />
                            </div>
                            <div className="mt-2.5">
                                <p className="truncate text-xs font-bold text-slate-900 dark:text-white">
                                    {staff.roles[0]?.name || 'Staf Biasa'}
                                </p>
                                <p className="mt-0.5 truncate text-[11px] text-slate-500 dark:text-zinc-400">
                                    {staff.roles.length > 1
                                        ? `+${staff.roles.length - 1} peran tambahan lainnya`
                                        : 'Akses modul standar'}
                                </p>
                            </div>
                            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-[10.5px] text-slate-400 dark:border-white/[0.04]">
                                <span>Izin Sistem</span>
                                <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                                    {staff.roles.length} Role Terdaftar
                                </span>
                            </div>
                        </div>
                    </section>

                    {/* 3. Hero Identity Card with Rich Lawyer Persona */}
                    <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-white/[0.08] dark:bg-[#12141a]">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                            {/* Left: Persona details */}
                            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                                <div className="relative shrink-0">
                                    <div className="rounded-2xl bg-gradient-to-b from-slate-200 to-slate-100 p-1 shadow-md dark:from-white/15 dark:to-white/5">
                                        <Avatar className="size-20 rounded-[18px] ring-2 ring-white dark:ring-[#12141a]">
                                            <AvatarImage
                                                src={
                                                    staff.avatar_url ??
                                                    undefined
                                                }
                                                className="object-cover"
                                            />
                                            <AvatarFallback className="rounded-[18px] bg-slate-900 text-xl font-extrabold text-white dark:bg-zinc-800 dark:text-zinc-200">
                                                {getInitials(staff.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>
                                    {staff.is_active && (
                                        <span
                                            className="absolute -right-1 -bottom-1 flex size-5.5 items-center justify-center rounded-full bg-emerald-500 shadow-md ring-3 ring-white dark:ring-[#12141a]"
                                            title="Staf Aktif & Terverifikasi"
                                        >
                                            <Check className="size-3 stroke-[3.5] text-white" />
                                        </span>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <div className="flex flex-wrap items-center gap-2.5">
                                        <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                                            {staff.name}
                                        </h1>

                                        {staff.advocate_license_no && (
                                            <span className="inline-flex items-center gap-1 rounded-full border border-amber-200/70 bg-amber-50/80 px-2.5 py-0.5 text-[11px] font-bold text-amber-800 dark:border-amber-800/40 dark:bg-amber-950/40 dark:text-amber-300">
                                                <Scale className="size-3 text-amber-600" />
                                                Advokat
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-zinc-300">
                                        <span className="font-bold text-slate-900 dark:text-white">
                                            {staff.position_title ||
                                                'Staf Kantor Hukum'}
                                        </span>
                                        {staff.department && (
                                            <>
                                                <span className="text-slate-300 dark:text-zinc-700">
                                                    •
                                                </span>
                                                <span className="inline-flex items-center gap-1 text-slate-600 dark:text-zinc-400">
                                                    <Building2 className="size-3" />
                                                    {staff.department}
                                                </span>
                                            </>
                                        )}
                                    </div>

                                    {/* Quick Micro Contact Chips */}
                                    <div className="flex flex-wrap items-center gap-2 pt-1">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleCopy(staff.email, 'email')
                                            }
                                            className="group inline-flex items-center gap-1.5 rounded-lg border border-slate-200/70 bg-slate-50/80 px-2.5 py-1 text-[11px] font-medium text-slate-600 transition-colors hover:border-slate-300 hover:bg-white dark:border-white/5 dark:bg-zinc-800/70 dark:text-zinc-300"
                                        >
                                            <Mail className="size-3 text-slate-400 group-hover:text-blue-500" />
                                            <span className="font-mono">
                                                {staff.email}
                                            </span>
                                            {copiedField === 'email' ? (
                                                <Check className="size-3 text-emerald-600" />
                                            ) : (
                                                <Copy className="size-2.5 opacity-40 group-hover:opacity-100" />
                                            )}
                                        </button>

                                        {staff.phone && (
                                            <a
                                                href={`https://wa.me/${staff.phone.replace(/[^0-9]/g, '')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200/70 bg-emerald-50/60 px-2.5 py-1 text-[11px] font-medium text-emerald-800 transition-colors hover:bg-emerald-100 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-300"
                                            >
                                                <Smartphone className="size-3 text-emerald-600" />
                                                <span className="font-mono">
                                                    {staff.phone}
                                                </span>
                                            </a>
                                        )}

                                        {staff.education && (
                                            <span className="inline-flex items-center gap-1 rounded-lg border border-purple-200/70 bg-purple-50/60 px-2.5 py-1 text-[11px] font-medium text-purple-800 dark:border-purple-900/40 dark:bg-purple-950/40 dark:text-purple-300">
                                                <GraduationCap className="size-3 text-purple-600" />
                                                {staff.education}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Right: Quick Action Banner */}
                            <div className="flex shrink-0 flex-wrap items-center gap-2 lg:flex-col lg:items-end">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => openEditWithTab('advocate')}
                                    className="h-8.5 rounded-xl border-slate-200 bg-slate-50/80 px-3 text-xs font-semibold text-slate-700 hover:bg-white dark:border-white/10 dark:bg-[#181a20] dark:text-zinc-300"
                                >
                                    <Award className="mr-1.5 size-3.5 text-amber-600" />
                                    Kelola Kredensial Advokat
                                </Button>

                                <span className="text-[10.5px] text-slate-400 dark:text-zinc-500">
                                    Terdaftar sejak:{' '}
                                    {staff.created_at
                                        ? formatDate(staff.created_at)
                                        : '-'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* 4. Segmented Navigation Tabs */}
                    <div className="flex flex-wrap items-center gap-1 rounded-2xl border border-slate-200/70 bg-slate-100/70 p-1.5 dark:border-white/[0.06] dark:bg-[#14161b]">
                        {navigationTabs.map((item) => {
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
                                    className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
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

                    {/* 5. Tab Content Sections */}

                    {/* TAB 1: EXECUTIVE OVERVIEW BENTO */}
                    {tab === 'Overview' && (
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                            {/* LEFT COLUMN (8 cols): Legalitas & Matters */}
                            <div className="space-y-6 lg:col-span-8">
                                {/* Legalitas Advokat Card */}
                                <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-white/[0.08] dark:bg-[#12141a]">
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-white/[0.06]">
                                        <div className="flex items-center gap-2.5">
                                            <div className="flex size-8 items-center justify-center rounded-xl bg-amber-50 text-amber-700 shadow-2xs dark:bg-amber-950/50 dark:text-amber-300">
                                                <Scale className="size-4" />
                                            </div>
                                            <div>
                                                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                                                    Legalitas &amp; Kredensial
                                                    Advokat
                                                </h2>
                                                <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                                                    Otorisasi resmi beracara dan
                                                    surat sumpah pengadilan
                                                </p>
                                            </div>
                                        </div>

                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                openEditWithTab('advocate')
                                            }
                                            className="h-7 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white"
                                        >
                                            <Pencil className="mr-1 size-3" />
                                            Edit Kredensial
                                        </Button>
                                    </div>

                                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-3.5 dark:border-white/5 dark:bg-[#15171e]">
                                            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase dark:text-zinc-400">
                                                Nomor Induk Advokat (NIA)
                                            </span>
                                            <p className="mt-1 font-mono text-xs font-bold text-slate-900 dark:text-white">
                                                {staff.advocate_license_no || (
                                                    <span className="font-sans font-normal text-slate-400 italic">
                                                        Belum dilengkapi
                                                    </span>
                                                )}
                                            </p>
                                        </div>

                                        <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-3.5 dark:border-white/5 dark:bg-[#15171e]">
                                            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase dark:text-zinc-400">
                                                No. BAS Pengadilan Tinggi
                                            </span>
                                            <p className="mt-1 font-mono text-xs font-bold text-slate-900 dark:text-white">
                                                {staff.bas_number || (
                                                    <span className="font-sans font-normal text-slate-400 italic">
                                                        Belum dilengkapi
                                                    </span>
                                                )}
                                            </p>
                                        </div>

                                        <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-3.5 dark:border-white/5 dark:bg-[#15171e]">
                                            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase dark:text-zinc-400">
                                                Tanggal Sumpah (BAS)
                                            </span>
                                            <p className="mt-1 text-xs font-semibold text-slate-900 dark:text-white">
                                                {staff.bas_date
                                                    ? formatDate(staff.bas_date)
                                                    : 'Belum dilengkapi'}
                                            </p>
                                        </div>

                                        <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-3.5 dark:border-white/5 dark:bg-[#15171e]">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase dark:text-zinc-400">
                                                    Masa Berlaku KTA
                                                </span>
                                                {ktaStatus && (
                                                    <span
                                                        className={`py-0.2 rounded-full border px-2 text-[9.5px] font-bold ${ktaStatus.color}`}
                                                    >
                                                        {ktaStatus.label}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="mt-1 text-xs font-semibold text-slate-900 dark:text-white">
                                                {staff.kta_expiry_date
                                                    ? formatDate(
                                                          staff.kta_expiry_date,
                                                      )
                                                    : 'Belum ditentukan'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Practice areas */}
                                    <div className="mt-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-3.5 dark:border-white/5 dark:bg-[#15171e]">
                                        <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase dark:text-zinc-400">
                                            Bidang Spesialisasi Hukum (Practice
                                            Areas)
                                        </span>
                                        <div className="mt-2 flex flex-wrap gap-1.5">
                                            {practiceAreasList.length > 0 ? (
                                                practiceAreasList.map(
                                                    (area, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white px-3 py-1 text-xs font-semibold text-slate-800 shadow-2xs dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200"
                                                        >
                                                            <Sparkles className="size-3 text-amber-500" />
                                                            {area}
                                                        </span>
                                                    ),
                                                )
                                            ) : (
                                                <div className="flex items-center justify-between py-1 text-xs text-slate-400">
                                                    <span>
                                                        Belum ada spesialisasi
                                                        hukum yang ditambahkan.
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openEditWithTab(
                                                                'advocate',
                                                            )
                                                        }
                                                        className="font-semibold text-blue-600 hover:underline dark:text-blue-400"
                                                    >
                                                        + Tambah
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Perkara Aktif */}
                                <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-white/[0.08] dark:bg-[#12141a]">
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-white/[0.06]">
                                        <div className="flex items-center gap-2.5">
                                            <div className="flex size-8 items-center justify-center rounded-xl bg-blue-50 text-blue-700 shadow-2xs dark:bg-blue-950/50 dark:text-blue-300">
                                                <Briefcase className="size-4" />
                                            </div>
                                            <div>
                                                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                                                    Perkara Sedang Ditangani (
                                                    {staff.matters?.length ?? 0}
                                                    )
                                                </h2>
                                                <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                                                    Kasus aktif yang melibatkan
                                                    staf sebagai advokat /
                                                    anggota tim
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 space-y-2.5">
                                        {staff.matters &&
                                        staff.matters.length > 0 ? (
                                            staff.matters.map((matter) => (
                                                <Link
                                                    key={matter.id}
                                                    href={matterRoutes.show.url(
                                                        matter.id,
                                                    )}
                                                    className="group flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-3.5 transition-all hover:border-slate-300 hover:bg-white dark:border-white/5 dark:bg-[#15171e] dark:hover:border-white/10 dark:hover:bg-zinc-800/60"
                                                >
                                                    <div className="min-w-0 space-y-0.5">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-mono text-[11px] font-bold text-blue-600 dark:text-blue-400">
                                                                {
                                                                    matter.matter_number
                                                                }
                                                            </span>
                                                            <span className="text-slate-300 dark:text-zinc-700">
                                                                ·
                                                            </span>
                                                            <StatusBadge
                                                                value={
                                                                    matter.status
                                                                }
                                                            />
                                                        </div>
                                                        <h3 className="truncate text-xs font-bold text-slate-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                                                            {matter.title}
                                                        </h3>
                                                    </div>
                                                    <ExternalLink className="size-4 shrink-0 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100 dark:text-zinc-500" />
                                                </Link>
                                            ))
                                        ) : (
                                            <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-400 dark:border-white/10 dark:text-zinc-500">
                                                <Briefcase className="mx-auto mb-2 size-6 opacity-40" />
                                                <p className="font-semibold text-slate-700 dark:text-zinc-300">
                                                    Belum Ada Penugasan Perkara
                                                </p>
                                                <p className="mt-1 text-[11px]">
                                                    Staf ini belum ditugaskan
                                                    pada perkara aktif.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT COLUMN (4 cols): Kontak, Bank, Security */}
                            <div className="space-y-6 lg:col-span-4">
                                {/* Kontak & Komunikasi */}
                                <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-white/[0.08] dark:bg-[#12141a]">
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-white/[0.06]">
                                        <div className="flex items-center gap-2.5">
                                            <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 shadow-2xs dark:bg-emerald-950/50 dark:text-emerald-300">
                                                <Phone className="size-4" />
                                            </div>
                                            <div>
                                                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                                                    Kontak Staf
                                                </h2>
                                                <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                                                    Saluran komunikasi langsung
                                                </p>
                                            </div>
                                        </div>

                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                openEditWithTab('contact')
                                            }
                                            className="h-7 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-zinc-400"
                                        >
                                            <Pencil className="mr-1 size-3" />
                                            Edit
                                        </Button>
                                    </div>

                                    <div className="mt-4 space-y-3">
                                        {/* Email */}
                                        <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/50 p-3 dark:border-white/5 dark:bg-[#15171e]">
                                            <div className="min-w-0">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase dark:text-zinc-400">
                                                    Email Resmi
                                                </span>
                                                <p className="truncate font-mono text-xs font-bold text-slate-900 dark:text-white">
                                                    {staff.email}
                                                </p>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    handleCopy(
                                                        staff.email,
                                                        'email',
                                                    )
                                                }
                                                className="h-7 text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-zinc-400"
                                            >
                                                {copiedField === 'email' ? (
                                                    <Check className="size-3 text-emerald-600" />
                                                ) : (
                                                    <Copy className="size-3" />
                                                )}
                                            </Button>
                                        </div>

                                        {/* WhatsApp */}
                                        <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/50 p-3 dark:border-white/5 dark:bg-[#15171e]">
                                            <div className="min-w-0">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase dark:text-zinc-400">
                                                    WhatsApp / HP
                                                </span>
                                                <p className="truncate font-mono text-xs font-bold text-slate-900 dark:text-white">
                                                    {staff.phone || (
                                                        <span className="font-sans font-normal text-slate-400 italic">
                                                            Belum diisi
                                                        </span>
                                                    )}
                                                </p>
                                            </div>
                                            {staff.phone && (
                                                <div className="flex items-center gap-1">
                                                    <a
                                                        href={`https://wa.me/${staff.phone.replace(/[^0-9]/g, '')}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex h-7 w-7 items-center justify-center rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                                                        title="Buka Chat WhatsApp"
                                                    >
                                                        <Smartphone className="size-3.5" />
                                                    </a>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleCopy(
                                                                staff.phone!,
                                                                'phone',
                                                            )
                                                        }
                                                        className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200"
                                                    >
                                                        {copiedField ===
                                                        'phone' ? (
                                                            <Check className="size-3 text-emerald-600" />
                                                        ) : (
                                                            <Copy className="size-3" />
                                                        )}
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {/* Alamat Domisili */}
                                        <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-3 dark:border-white/5 dark:bg-[#15171e]">
                                            <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase dark:text-zinc-400">
                                                <MapPin className="size-3" />
                                                Alamat Domisili
                                            </span>
                                            <p className="mt-1 text-xs text-slate-800 dark:text-zinc-200">
                                                {staff.address || (
                                                    <span className="text-slate-400 italic">
                                                        Belum dilengkapi
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Rekening & Pajak Widget */}
                                <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-white/[0.08] dark:bg-[#12141a]">
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-white/[0.06]">
                                        <div className="flex items-center gap-2.5">
                                            <div className="flex size-8 items-center justify-center rounded-xl bg-purple-50 text-purple-700 shadow-2xs dark:bg-purple-950/50 dark:text-purple-300">
                                                <CreditCard className="size-4" />
                                            </div>
                                            <div>
                                                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                                                    Rekening &amp; Pajak
                                                </h2>
                                                <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                                                    Informasi payroll dan pajak
                                                </p>
                                            </div>
                                        </div>

                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                openEditWithTab('billing')
                                            }
                                            className="h-7 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-zinc-400"
                                        >
                                            <Pencil className="mr-1 size-3" />
                                            Edit
                                        </Button>
                                    </div>

                                    <div className="mt-4 space-y-3">
                                        <div className="rounded-2xl border border-slate-200/70 bg-gradient-to-br from-slate-900 to-slate-800 p-4 text-white shadow-md dark:border-white/10 dark:from-zinc-900 dark:to-zinc-950">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                                                    {staff.bank_name ||
                                                        'BANK FIRMA'}
                                                </span>
                                                <CreditCard className="size-4 text-slate-400" />
                                            </div>
                                            <p className="mt-3 font-mono text-sm font-bold tracking-wider">
                                                {staff.bank_account_number ||
                                                    '•••• •••• ••••'}
                                            </p>
                                            <p className="mt-1 truncate text-[11px] text-slate-300">
                                                a.n.{' '}
                                                {staff.bank_account_holder ||
                                                    staff.name}
                                            </p>
                                        </div>

                                        <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-3 dark:border-white/5 dark:bg-[#15171e]">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase dark:text-zinc-400">
                                                Nomor Pokok Wajib Pajak (NPWP)
                                            </span>
                                            <p className="mt-1 font-mono text-xs font-bold text-slate-900 dark:text-white">
                                                {staff.npwp || (
                                                    <span className="font-sans font-normal text-slate-400 italic">
                                                        Belum dilengkapi
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Peran Sistem */}
                                <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-white/[0.08] dark:bg-[#12141a]">
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-white/[0.06]">
                                        <div className="flex items-center gap-2">
                                            <ShieldCheck className="size-4 text-emerald-600" />
                                            <h2 className="text-xs font-bold text-slate-900 uppercase dark:text-white">
                                                Role Otorisasi (
                                                {staff.roles.length})
                                            </h2>
                                        </div>
                                    </div>

                                    <div className="mt-3 flex flex-wrap gap-1.5">
                                        {staff.roles.map((r) => (
                                            <span
                                                key={r.id}
                                                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/80 bg-slate-50/80 px-2.5 py-1 text-xs font-semibold text-slate-800 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200"
                                            >
                                                <Shield className="size-3 text-purple-600" />
                                                {r.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 2: LEGALITAS & KREDENSIAL ADVOKAT */}
                    {tab === 'Legalitas' && (
                        <div className="space-y-6">
                            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-white/[0.08] dark:bg-[#12141a]">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-white/[0.06]">
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 shadow-2xs dark:bg-amber-950/50 dark:text-amber-300">
                                            <Scale className="size-5" />
                                        </div>
                                        <div>
                                            <h2 className="text-base font-bold text-slate-900 dark:text-white">
                                                Kredensial &amp; Keabsahan
                                                Beracara Advokat
                                            </h2>
                                            <p className="text-xs text-slate-500 dark:text-zinc-400">
                                                Dokumen legalitas advokat, nomor
                                                induk, dan berita acara sumpah
                                                pengadilan
                                            </p>
                                        </div>
                                    </div>

                                    <Button
                                        size="sm"
                                        onClick={() =>
                                            openEditWithTab('advocate')
                                        }
                                        className="h-8 rounded-xl bg-slate-900 px-4 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 dark:bg-white dark:text-slate-900"
                                    >
                                        <Pencil className="mr-1.5 size-3.5" />
                                        Perbarui Kredensial
                                    </Button>
                                </div>

                                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                    <div className="rounded-2xl border border-slate-200/70 bg-slate-50/60 p-4 dark:border-white/5 dark:bg-[#15171e]">
                                        <span className="text-[10.5px] font-bold text-slate-400 uppercase dark:text-zinc-400">
                                            Nomor Induk Advokat (NIA)
                                        </span>
                                        <p className="mt-1.5 font-mono text-sm font-bold text-slate-900 dark:text-white">
                                            {staff.advocate_license_no ||
                                                'Belum dilengkapi'}
                                        </p>
                                        <p className="mt-1 text-[11px] text-slate-500">
                                            Keanggotaan Organisasi Advokat Resmi
                                        </p>
                                    </div>

                                    <div className="rounded-2xl border border-slate-200/70 bg-slate-50/60 p-4 dark:border-white/5 dark:bg-[#15171e]">
                                        <span className="text-[10.5px] font-bold text-slate-400 uppercase dark:text-zinc-400">
                                            No. Surat BAS Pengadilan
                                        </span>
                                        <p className="mt-1.5 font-mono text-sm font-bold text-slate-900 dark:text-white">
                                            {staff.bas_number ||
                                                'Belum dilengkapi'}
                                        </p>
                                        <p className="mt-1 text-[11px] text-slate-500">
                                            Pengadilan Tinggi Penyumpah
                                        </p>
                                    </div>

                                    <div className="rounded-2xl border border-slate-200/70 bg-slate-50/60 p-4 dark:border-white/5 dark:bg-[#15171e]">
                                        <span className="text-[10.5px] font-bold text-slate-400 uppercase dark:text-zinc-400">
                                            Tanggal Pengambilan Sumpah
                                        </span>
                                        <p className="mt-1.5 text-sm font-bold text-slate-900 dark:text-white">
                                            {staff.bas_date
                                                ? formatDate(staff.bas_date)
                                                : 'Belum ditentukan'}
                                        </p>
                                        <p className="mt-1 text-[11px] text-slate-500">
                                            Tanggal Resmi Dilantik Advokat
                                        </p>
                                    </div>

                                    <div className="rounded-2xl border border-slate-200/70 bg-slate-50/60 p-4 dark:border-white/5 dark:bg-[#15171e]">
                                        <span className="text-[10.5px] font-bold text-slate-400 uppercase dark:text-zinc-400">
                                            Masa Berlaku KTA Advokat
                                        </span>
                                        <p className="mt-1.5 text-sm font-bold text-slate-900 dark:text-white">
                                            {staff.kta_expiry_date
                                                ? formatDate(
                                                      staff.kta_expiry_date,
                                                  )
                                                : 'Belum diatur'}
                                        </p>
                                        <div className="mt-1">
                                            {ktaStatus ? (
                                                <span
                                                    className={`py-0.2 inline-block rounded-full border px-2 text-[9.5px] font-bold ${ktaStatus.color}`}
                                                >
                                                    {ktaStatus.label}
                                                </span>
                                            ) : (
                                                <span className="text-[11px] text-slate-500">
                                                    Pengingat perpanjangan kartu
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Pendidikan & Practice areas deep card */}
                                <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                                    <div className="rounded-2xl border border-slate-200/70 bg-slate-50/50 p-5 dark:border-white/5 dark:bg-[#15171e]">
                                        <div className="flex items-center gap-2 text-slate-900 dark:text-white">
                                            <GraduationCap className="size-4.5 text-purple-600" />
                                            <h3 className="text-xs font-bold uppercase">
                                                Riwayat Pendidikan &amp;
                                                Almamater
                                            </h3>
                                        </div>
                                        <p className="mt-3 text-sm font-semibold text-slate-800 dark:text-zinc-200">
                                            {staff.education ||
                                                'Belum ada informasi almamater dan gelar akademik.'}
                                        </p>
                                        <p className="mt-1 text-xs text-slate-500">
                                            Gelar hukum, universitas asal, dan
                                            pelatihan keahlian profesi advokat.
                                        </p>
                                    </div>

                                    <div className="rounded-2xl border border-slate-200/70 bg-slate-50/50 p-5 dark:border-white/5 dark:bg-[#15171e]">
                                        <div className="flex items-center gap-2 text-slate-900 dark:text-white">
                                            <Sparkles className="size-4.5 text-amber-600" />
                                            <h3 className="text-xs font-bold uppercase">
                                                Bidang Keahlian Hukum
                                            </h3>
                                        </div>
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {practiceAreasList.length > 0 ? (
                                                practiceAreasList.map(
                                                    (area, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-2xs dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200"
                                                        >
                                                            <CheckCircle2 className="size-3 text-emerald-600" />
                                                            {area}
                                                        </span>
                                                    ),
                                                )
                                            ) : (
                                                <p className="text-xs text-slate-400 italic">
                                                    Belum ada bidang
                                                    spesialisasi yang
                                                    didaftarkan.
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 3: PERKARA DITANGANI */}
                    {tab === 'Matters' && (
                        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-white/[0.08] dark:bg-[#12141a]">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-white/[0.06]">
                                <div className="flex items-center gap-3">
                                    <div className="flex size-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 shadow-2xs dark:bg-blue-950/50 dark:text-blue-300">
                                        <Briefcase className="size-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-base font-bold text-slate-900 dark:text-white">
                                            Portofolio &amp; Penugasan Perkara (
                                            {staff.matters?.length ?? 0})
                                        </h2>
                                        <p className="text-xs text-slate-500 dark:text-zinc-400">
                                            Daftar perkara hukum yang ditugaskan
                                            kepada {staff.name}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 space-y-3">
                                {staff.matters && staff.matters.length > 0 ? (
                                    staff.matters.map((matter) => (
                                        <Link
                                            key={matter.id}
                                            href={matterRoutes.show.url(
                                                matter.id,
                                            )}
                                            className="group flex items-center justify-between gap-4 rounded-2xl border border-slate-200/70 bg-slate-50/50 p-4 transition-all hover:border-slate-300 hover:bg-white dark:border-white/5 dark:bg-[#15171e] dark:hover:border-white/10 dark:hover:bg-zinc-800/60"
                                        >
                                            <div className="min-w-0 space-y-1">
                                                <div className="flex items-center gap-2.5">
                                                    <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                                                        {matter.matter_number}
                                                    </span>
                                                    <span className="text-slate-300 dark:text-zinc-700">
                                                        ·
                                                    </span>
                                                    <StatusBadge
                                                        value={matter.status}
                                                    />
                                                    {matter.priority && (
                                                        <span className="rounded bg-slate-200/80 px-2 py-0.5 text-[10px] font-bold text-slate-700 uppercase dark:bg-zinc-800 dark:text-zinc-300">
                                                            {matter.priority}
                                                        </span>
                                                    )}
                                                </div>
                                                <h3 className="truncate text-sm font-bold text-slate-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                                                    {matter.title}
                                                </h3>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-8 shrink-0 rounded-xl text-xs font-semibold group-hover:border-blue-300"
                                            >
                                                Buka Berkas
                                                <ExternalLink className="ml-1.5 size-3" />
                                            </Button>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="rounded-2xl border border-dashed border-slate-200 p-12 text-center text-xs text-slate-400 dark:border-white/10 dark:text-zinc-500">
                                        <Briefcase className="mx-auto mb-2 size-8 opacity-40" />
                                        <p className="text-sm font-bold text-slate-700 dark:text-zinc-300">
                                            Tidak Ada Perkara Terdaftar
                                        </p>
                                        <p className="mt-1">
                                            Staf ini belum memiliki riwayat
                                            perkara atau penugasan aktif.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* TAB 4: KONTAK & DOMISILI */}
                    {tab === 'Kontak' && (
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-white/[0.08] dark:bg-[#12141a]">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-white/[0.06]">
                                    <div className="flex items-center gap-2.5">
                                        <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 shadow-2xs dark:bg-emerald-950/50 dark:text-emerald-300">
                                            <Phone className="size-4" />
                                        </div>
                                        <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                                            Saluran Komunikasi Resmi
                                        </h2>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            openEditWithTab('contact')
                                        }
                                        className="h-7 text-xs font-semibold text-slate-500"
                                    >
                                        <Pencil className="mr-1 size-3" /> Edit
                                    </Button>
                                </div>

                                <div className="mt-4 space-y-3">
                                    <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 dark:border-white/5 dark:bg-[#15171e]">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                                            Alamat Email
                                        </span>
                                        <p className="mt-1 font-mono text-sm font-bold text-slate-900 dark:text-white">
                                            {staff.email}
                                        </p>
                                    </div>

                                    <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 dark:border-white/5 dark:bg-[#15171e]">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                                            Nomor WhatsApp / HP
                                        </span>
                                        <p className="mt-1 font-mono text-sm font-bold text-slate-900 dark:text-white">
                                            {staff.phone || 'Belum diisi'}
                                        </p>
                                    </div>

                                    <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 dark:border-white/5 dark:bg-[#15171e]">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                                            Tanggal Lahir
                                        </span>
                                        <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                                            {staff.birth_date
                                                ? formatDate(staff.birth_date)
                                                : 'Belum dilengkapi'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-white/[0.08] dark:bg-[#12141a]">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-white/[0.06]">
                                    <div className="flex items-center gap-2.5">
                                        <div className="flex size-8 items-center justify-center rounded-xl bg-blue-50 text-blue-700 shadow-2xs dark:bg-blue-950/50 dark:text-blue-300">
                                            <MapPin className="size-4" />
                                        </div>
                                        <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                                            Alamat &amp; Lokasi Domisili
                                        </h2>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            openEditWithTab('contact')
                                        }
                                        className="h-7 text-xs font-semibold text-slate-500"
                                    >
                                        <Pencil className="mr-1 size-3" /> Edit
                                    </Button>
                                </div>

                                <div className="mt-4 space-y-3">
                                    <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 dark:border-white/5 dark:bg-[#15171e]">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                                            Alamat Domisili Saat Ini
                                        </span>
                                        <p className="mt-1.5 text-xs leading-relaxed text-slate-800 dark:text-zinc-200">
                                            {staff.address ||
                                                'Belum ada alamat tempat tinggal saat ini yang dicatat.'}
                                        </p>
                                    </div>

                                    <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 dark:border-white/5 dark:bg-[#15171e]">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                                            Alamat Sesuai KTP
                                        </span>
                                        <p className="mt-1.5 text-xs leading-relaxed text-slate-800 dark:text-zinc-200">
                                            {staff.ktp_address ||
                                                'Belum ada alamat KTP yang dicatat.'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 5: REKENING & PAJAK */}
                    {tab === 'Rekening' && (
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-white/[0.08] dark:bg-[#12141a]">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-white/[0.06]">
                                    <div className="flex items-center gap-2.5">
                                        <div className="flex size-8 items-center justify-center rounded-xl bg-purple-50 text-purple-700 shadow-2xs dark:bg-purple-950/50 dark:text-purple-300">
                                            <CreditCard className="size-4" />
                                        </div>
                                        <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                                            Rekening Bank Payroll / Honorarium
                                        </h2>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            openEditWithTab('billing')
                                        }
                                        className="h-7 text-xs font-semibold text-slate-500"
                                    >
                                        <Pencil className="mr-1 size-3" /> Edit
                                    </Button>
                                </div>

                                <div className="mt-4 space-y-4">
                                    <div className="rounded-3xl border border-slate-200/80 bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-900 p-6 text-white shadow-xl dark:border-white/10">
                                        <div className="flex items-center justify-between">
                                            <span className="font-mono text-xs font-bold tracking-widest text-slate-400">
                                                {staff.bank_name || 'BANK BCA'}
                                            </span>
                                            <CreditCard className="size-5 text-slate-300" />
                                        </div>
                                        <div className="my-6">
                                            <span className="text-[10px] text-slate-400 uppercase">
                                                Nomor Rekening
                                            </span>
                                            <p className="font-mono text-lg font-bold tracking-widest text-white">
                                                {staff.bank_account_number ||
                                                    '•••• •••• •••• ••••'}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-[10px] text-slate-400 uppercase">
                                                Nama Pemilik Rekening
                                            </span>
                                            <p className="text-xs font-bold tracking-wider text-slate-200 uppercase">
                                                {staff.bank_account_holder ||
                                                    staff.name}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-white/[0.08] dark:bg-[#12141a]">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-white/[0.06]">
                                    <div className="flex items-center gap-2.5">
                                        <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 shadow-2xs dark:bg-emerald-950/50 dark:text-emerald-300">
                                            <FileBadge className="size-4" />
                                        </div>
                                        <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                                            Identitas Perpajakan
                                        </h2>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            openEditWithTab('billing')
                                        }
                                        className="h-7 text-xs font-semibold text-slate-500"
                                    >
                                        <Pencil className="mr-1 size-3" /> Edit
                                    </Button>
                                </div>

                                <div className="mt-4 space-y-3">
                                    <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 dark:border-white/5 dark:bg-[#15171e]">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                                            Nomor Pokok Wajib Pajak (NPWP)
                                        </span>
                                        <p className="mt-1.5 font-mono text-sm font-bold text-slate-900 dark:text-white">
                                            {staff.npwp || 'Belum dilengkapi'}
                                        </p>
                                        <p className="mt-1 text-xs text-slate-500">
                                            Digunakan untuk pelaporan bukti
                                            potong PPh 21 / honorarium advokat.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 6: HAK AKSES & PERAN */}
                    {tab === 'Akses' && (
                        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-white/[0.08] dark:bg-[#12141a]">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-white/[0.06]">
                                <div className="flex items-center gap-3">
                                    <div className="flex size-10 items-center justify-center rounded-2xl bg-purple-50 text-purple-700 shadow-2xs dark:bg-purple-950/50 dark:text-purple-300">
                                        <ShieldCheck className="size-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-base font-bold text-slate-900 dark:text-white">
                                            Peran &amp; Otorisasi Sistem (
                                            {staff.roles.length})
                                        </h2>
                                        <p className="text-xs text-slate-500 dark:text-zinc-400">
                                            Hak akses modul, kewenangan
                                            operasional, dan hak izin workspace
                                        </p>
                                    </div>
                                </div>

                                <Button
                                    size="sm"
                                    onClick={() => openEditWithTab('account')}
                                    className="h-8 rounded-xl bg-slate-900 px-4 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 dark:bg-white dark:text-slate-900"
                                >
                                    <Pencil className="mr-1.5 size-3.5" />
                                    Kelola Role
                                </Button>
                            </div>

                            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                {staff.roles.map((role) => (
                                    <div
                                        key={role.id}
                                        className="rounded-2xl border border-slate-200/70 bg-slate-50/60 p-4 dark:border-white/5 dark:bg-[#15171e]"
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <Shield className="size-4 text-purple-600 dark:text-purple-400" />
                                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                                {role.name}
                                            </h3>
                                            <span className="rounded bg-slate-200/80 px-2 py-0.5 font-mono text-[10px] font-semibold text-slate-700 dark:bg-zinc-800 dark:text-zinc-300">
                                                {role.slug}
                                            </span>
                                        </div>
                                        <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-zinc-400">
                                            {role.description ||
                                                'Memiliki izin operasional sesuai konfigurasi role.'}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* Modal: Edit User (Tabbed & Refined) */}
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
                    router.visit(userRoutes.index());
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

    // Sync active tab when defaultTab changes
    useMemo(() => {
        setActiveTab(defaultTab);
    }, [defaultTab, open]);

    if (!user) return null;

    const assignedRoleIds = new Set(user.roles.map((role) => role.id));

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200/80 bg-white p-0 shadow-2xl sm:max-w-2xl dark:border-white/10 dark:bg-[#14161b]">
                <div className="border-b border-slate-100 bg-slate-50/70 p-5 dark:border-white/[0.06] dark:bg-[#121418]">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Avatar className="size-11 shrink-0 rounded-xl border border-slate-200 shadow-2xs dark:border-white/10">
                                <AvatarImage
                                    src={user.avatar_url ?? undefined}
                                    className="object-cover"
                                />
                                <AvatarFallback className="rounded-xl bg-slate-900 text-xs font-bold text-white dark:bg-zinc-800 dark:text-zinc-200">
                                    {getInitials(user.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                                <DialogTitle className="text-sm font-bold text-slate-900 dark:text-white">
                                    Kelola Staf: {user.name}
                                </DialogTitle>
                                <DialogDescription className="text-xs text-slate-500 dark:text-zinc-400">
                                    {user.email}{' '}
                                    {user.position_title
                                        ? `· ${user.position_title}`
                                        : ''}
                                </DialogDescription>
                            </div>
                        </div>

                        <span className="hidden rounded-lg border border-slate-200/70 bg-white px-2.5 py-1 font-mono text-[10.5px] font-bold text-slate-700 sm:inline-flex dark:border-white/5 dark:bg-zinc-800 dark:text-zinc-300">
                            {user.employee_code ||
                                `RPK-${user.id.toString().padStart(3, '0')}`}
                        </span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-1.5 border-t border-slate-200/60 pt-3 dark:border-white/5">
                        <button
                            type="button"
                            onClick={() => setActiveTab('account')}
                            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                                activeTab === 'account'
                                    ? 'bg-slate-900 text-white shadow-2xs dark:bg-white dark:text-slate-900'
                                    : 'text-slate-600 hover:bg-slate-200/60 dark:text-zinc-400 dark:hover:bg-zinc-800'
                            }`}
                        >
                            <UserCheck className="size-3.5" />
                            Akun &amp; Peran
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('advocate')}
                            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                                activeTab === 'advocate'
                                    ? 'bg-slate-900 text-white shadow-2xs dark:bg-white dark:text-slate-900'
                                    : 'text-slate-600 hover:bg-slate-200/60 dark:text-zinc-400 dark:hover:bg-zinc-800'
                            }`}
                        >
                            <Scale className="size-3.5" />
                            Kredensial Advokat
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('contact')}
                            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                                activeTab === 'contact'
                                    ? 'bg-slate-900 text-white shadow-2xs dark:bg-white dark:text-slate-900'
                                    : 'text-slate-600 hover:bg-slate-200/60 dark:text-zinc-400 dark:hover:bg-zinc-800'
                            }`}
                        >
                            <Phone className="size-3.5" />
                            Kontak &amp; Domisili
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('billing')}
                            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                                activeTab === 'billing'
                                    ? 'bg-slate-900 text-white shadow-2xs dark:bg-white dark:text-slate-900'
                                    : 'text-slate-600 hover:bg-slate-200/60 dark:text-zinc-400 dark:hover:bg-zinc-800'
                            }`}
                        >
                            <CreditCard className="size-3.5" />
                            Rekening &amp; Pajak
                        </button>
                    </div>
                </div>

                <Form
                    {...userRoutes.update.form(user.id)}
                    className="space-y-4 p-5"
                    onSuccess={() => onOpenChange(false)}
                >
                    {({ errors, processing }) => (
                        <>
                            {activeTab === 'account' && (
                                <div className="space-y-3">
                                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
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

                                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                                        <Field
                                            name="position_title"
                                            label="Jabatan / Posisi"
                                            defaultValue={
                                                user.position_title ?? ''
                                            }
                                            placeholder="Contoh: Senior Associate / Partner"
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

                                    <Field
                                        name="department"
                                        label="Departemen / Divisi"
                                        defaultValue={user.department ?? ''}
                                        placeholder="Litigasi & Arbitrase / Corporate"
                                    />

                                    <Field
                                        name="password"
                                        label="Ubah Password (Opsional)"
                                        type="password"
                                        placeholder="Kosongkan jika tidak ingin mengganti password"
                                    />

                                    <div className="space-y-2 rounded-2xl border border-slate-200/70 bg-slate-50/60 p-3.5 dark:border-white/[0.06] dark:bg-[#121418]">
                                        <Label className="text-xs font-semibold text-slate-900 dark:text-white">
                                            Role Kewenangan Sistem
                                        </Label>
                                        <div className="grid grid-cols-1 gap-1 pt-0.5 sm:grid-cols-2">
                                            {roles.map((role) => (
                                                <label
                                                    key={role.id}
                                                    className="flex cursor-pointer items-center gap-2 rounded-lg p-1.5 text-xs hover:bg-white dark:hover:bg-zinc-800"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        name="role_ids[]"
                                                        value={role.id}
                                                        defaultChecked={assignedRoleIds.has(
                                                            role.id,
                                                        )}
                                                        className="size-3.5 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                                                    />
                                                    <span className="font-semibold text-slate-900 dark:text-white">
                                                        {role.name}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                        <InputError message={errors.role_ids} />
                                    </div>

                                    <div className="flex items-center gap-2 rounded-xl border border-slate-200/70 bg-slate-50/60 p-3 dark:border-white/5 dark:bg-zinc-800/40">
                                        <input
                                            type="checkbox"
                                            id="is_active"
                                            name="is_active"
                                            value="1"
                                            defaultChecked={user.is_active}
                                            className="size-3.5 rounded border-slate-300 text-slate-900"
                                        />
                                        <Label
                                            htmlFor="is_active"
                                            className="cursor-pointer text-xs font-semibold text-slate-800 dark:text-zinc-200"
                                        >
                                            Akun Aktif (Dapat Login &amp;
                                            Mengakses Sistem)
                                        </Label>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'advocate' && (
                                <div className="space-y-3">
                                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                                        <Field
                                            name="advocate_license_no"
                                            label="Nomor Induk Advokat (NIA PERADI / KAI)"
                                            defaultValue={
                                                user.advocate_license_no ?? ''
                                            }
                                            placeholder="Contoh: 18.01234/PERADI"
                                        />
                                        <Field
                                            name="education"
                                            label="Gelar &amp; Riwayat Pendidikan"
                                            defaultValue={user.education ?? ''}
                                            placeholder="Contoh: S.H. (UI), LL.M. (Leiden)"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
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

                                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
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
                                            helperText="Sistem akan memberikan pengingat sebelum masa berlaku habis"
                                        />
                                    </div>

                                    <TextareaField
                                        name="practice_areas"
                                        label="Bidang Keahlian / Spesialisasi Hukum (Practice Areas)"
                                        defaultValue={user.practice_areas ?? ''}
                                        placeholder="Contoh: Corporate M&A, Commercial Litigation, Dispute Resolution, IPR, Employment Law"
                                        rows={3}
                                    />
                                </div>
                            )}

                            {activeTab === 'contact' && (
                                <div className="space-y-3">
                                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                                        <Field
                                            name="phone"
                                            label="Nomor WhatsApp / HP Resmi"
                                            defaultValue={user.phone ?? ''}
                                            placeholder="Contoh: 081234567890"
                                            helperText="Digunakan untuk tombol chat WhatsApp langsung"
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

                                    <TextareaField
                                        name="address"
                                        label="Alamat Domisili Saat Ini"
                                        defaultValue={user.address ?? ''}
                                        placeholder="Alamat tempat tinggal lengkap staf saat ini..."
                                        rows={2}
                                    />

                                    <TextareaField
                                        name="ktp_address"
                                        label="Alamat Sesuai KTP"
                                        defaultValue={user.ktp_address ?? ''}
                                        placeholder="Alamat resmi yang tertera pada kartu identitas KTP..."
                                        rows={2}
                                    />
                                </div>
                            )}

                            {activeTab === 'billing' && (
                                <div className="space-y-3">
                                    <Field
                                        name="npwp"
                                        label="Nomor Pokok Wajib Pajak (NPWP)"
                                        defaultValue={user.npwp ?? ''}
                                        placeholder="Contoh: 01.234.567.8-901.000"
                                    />

                                    <div className="space-y-2 rounded-2xl border border-slate-200/70 bg-slate-50/60 p-3.5 dark:border-white/[0.06] dark:bg-[#121418]">
                                        <Label className="text-xs font-semibold text-slate-900 dark:text-white">
                                            Informasi Rekening Bank (Payroll /
                                            Fee Share)
                                        </Label>
                                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                                            <Field
                                                name="bank_name"
                                                label="Nama Bank"
                                                defaultValue={
                                                    user.bank_name ?? ''
                                                }
                                                placeholder="BCA / Mandiri / BNI"
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
                                                label="Atas Nama Rekening"
                                                defaultValue={
                                                    user.bank_account_holder ??
                                                    ''
                                                }
                                                placeholder="Nama Pemilik Rekening"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-white/[0.06]">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        onOpenChange(false);
                                        onDeleteClick?.();
                                    }}
                                    className="h-8 cursor-pointer rounded-xl px-3 text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-950/30"
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
                                        className="h-8 rounded-xl border-slate-200 px-3.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-zinc-300"
                                    >
                                        Batal
                                    </Button>
                                    <Button
                                        size="sm"
                                        disabled={processing}
                                        className="h-8 cursor-pointer rounded-xl bg-slate-900 px-4.5 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-zinc-200"
                                    >
                                        {processing ? (
                                            <>
                                                <Spinner className="mr-1.5 size-3.5" />
                                                Menyimpan...
                                            </>
                                        ) : (
                                            'Simpan Perubahan'
                                        )}
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
                        {...userRoutes.destroy.form(user.id)}
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
                                    className="h-7.5 rounded-lg border-slate-200 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    variant="destructive"
                                    size="sm"
                                    disabled={processing}
                                    className="h-7.5 rounded-lg bg-rose-600 px-4 text-xs font-semibold text-white shadow-2xs hover:bg-rose-700"
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
        <div className="grid gap-1">
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
                className="h-8 rounded-lg border-slate-200 bg-slate-50/60 text-xs text-slate-900 focus:border-slate-400 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
            />
            {helperText && (
                <p className="text-[10px] text-slate-400 dark:text-zinc-500">
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
        <div className="grid gap-1">
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
                className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50/60 p-2.5 text-xs text-slate-900 focus:border-slate-400 focus:bg-white focus:outline-none dark:border-white/10 dark:bg-[#121418] dark:text-white"
            />
            {helperText && (
                <p className="text-[10px] text-slate-400 dark:text-zinc-500">
                    {helperText}
                </p>
            )}
        </div>
    );
}

UserShow.layout = {
    breadcrumbs: [
        { title: 'Pengguna & Akses', href: userRoutes.index() },
        { title: 'Profil Staf', href: '' },
    ],
};
