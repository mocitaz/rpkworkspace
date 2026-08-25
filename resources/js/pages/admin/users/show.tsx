import { Form, Head, Link, router } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowLeft,
    Banknote,
    Briefcase,
    Building2,
    Calendar,
    Check,
    CheckCircle2,
    Copy,
    CreditCard,
    ExternalLink,
    FileBadge,
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
    User,
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
                <main className="mx-auto max-w-7xl space-y-5 px-4 py-5 sm:px-6 lg:px-8">
                    {/* 1. Header Navigation & Client Cockpit Bar */}
                    <div className="flex flex-col justify-between gap-4 border-b border-slate-200/60 pb-5 lg:flex-row lg:items-center dark:border-white/[0.06]">
                        <div className="space-y-1.5">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                                    {displayId}
                                </span>
                                <span className="text-slate-300 dark:text-zinc-700">
                                    •
                                </span>
                                <StatusBadge
                                    value={
                                        staff.is_active ? 'active' : 'inactive'
                                    }
                                />
                                {staff.advocate_license_no && (
                                    <span className="rounded-md border border-amber-200/70 bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:border-amber-800/40 dark:bg-amber-950/50 dark:text-amber-300">
                                        Advokat Resmi (NIA:{' '}
                                        {staff.advocate_license_no})
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <Avatar className="size-11 rounded-xl border border-slate-200/80 shadow-2xs dark:border-white/10">
                                        <AvatarImage
                                            src={staff.avatar_url ?? undefined}
                                            className="object-cover"
                                        />
                                        <AvatarFallback className="rounded-xl bg-slate-900 text-sm font-bold text-white dark:bg-zinc-800 dark:text-zinc-200">
                                            {getInitials(staff.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    {staff.is_active && (
                                        <span
                                            className="absolute -right-1 -bottom-1 flex size-3.5 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#0c0d10]"
                                            title="Aktif"
                                        />
                                    )}
                                </div>

                                <div>
                                    <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                                        {staff.name}
                                    </h1>
                                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-zinc-400">
                                        <span className="font-semibold text-slate-700 dark:text-zinc-200">
                                            {staff.position_title ||
                                                'Staf Kantor Hukum'}
                                        </span>
                                        {staff.department && (
                                            <>
                                                <span className="text-slate-300 dark:text-zinc-700">
                                                    •
                                                </span>
                                                <span>{staff.department}</span>
                                            </>
                                        )}
                                        {staff.education && (
                                            <>
                                                <span className="text-slate-300 dark:text-zinc-700">
                                                    •
                                                </span>
                                                <span className="text-purple-700 dark:text-purple-400">
                                                    {staff.education}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Cockpit Action Buttons */}
                        <div className="flex shrink-0 flex-wrap items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 rounded-lg border-slate-200/80 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-[#16181d] dark:text-zinc-300"
                                asChild
                            >
                                <Link href={userRoutes.index()}>
                                    <ArrowLeft className="mr-1 size-3 text-slate-400" />
                                    Kembali
                                </Link>
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleOpenChat}
                                className="h-8 rounded-lg border-slate-200/80 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-[#16181d] dark:text-zinc-300"
                            >
                                <MessageSquare className="mr-1 size-3 text-blue-500" />
                                Kirim Pesan
                            </Button>

                            {staff.phone && (
                                <Button
                                    asChild
                                    variant="outline"
                                    size="sm"
                                    className="h-8 rounded-lg border-emerald-200 bg-emerald-50/70 px-3 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 dark:border-emerald-900/40 dark:bg-emerald-950/50 dark:text-emerald-300"
                                >
                                    <a
                                        href={`https://wa.me/${staff.phone.replace(/[^0-9]/g, '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Smartphone className="mr-1 size-3" />
                                        WhatsApp
                                    </a>
                                </Button>
                            )}

                            <Button
                                asChild
                                variant="outline"
                                size="sm"
                                className="h-8 rounded-lg border-slate-200/80 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-[#16181d] dark:text-zinc-300"
                            >
                                <a href={`mailto:${staff.email}`}>
                                    <Mail className="mr-1 size-3 text-slate-400" />
                                    Email
                                </a>
                            </Button>

                            <Button
                                type="button"
                                size="sm"
                                onClick={() => openEditWithTab('account')}
                                className="h-8 cursor-pointer rounded-lg bg-slate-900 px-3.5 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 active:scale-95 dark:bg-white dark:text-slate-900"
                            >
                                <Pencil className="mr-1 size-3" />
                                Edit Profil
                            </Button>
                        </div>
                    </div>

                    {/* 2. Segmented Navigation Tabs */}
                    <div className="flex flex-wrap items-center gap-1 rounded-xl border border-slate-200/70 bg-slate-100/70 p-1 dark:border-white/[0.06] dark:bg-[#14161b]">
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
                                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
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

                    {/* 3. 2-Column Split Cockpit Workspace Layout */}
                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
                        {/* Sisi Kiri: Main Workspace (8 Columns) */}
                        <div className="space-y-4 lg:col-span-8">
                            {/* TAB 1: OVERVIEW */}
                            {tab === 'Overview' && (
                                <div className="space-y-4">
                                    {/* Kredensial & Legalitas Advokat Card */}
                                    <div className="rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                        <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-white/[0.04]">
                                            <div className="flex items-center gap-1.5">
                                                <Scale className="size-3.5 text-slate-500 dark:text-zinc-400" />
                                                <span className="text-[11px] font-semibold text-slate-500 uppercase dark:text-zinc-400">
                                                    Legalitas &amp; Kredensial
                                                    Advokat
                                                </span>
                                            </div>
                                            <button
                                                onClick={() =>
                                                    openEditWithTab('advocate')
                                                }
                                                className="cursor-pointer text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
                                            >
                                                Edit Kredensial →
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                            <div className="rounded-lg border border-slate-200/70 bg-slate-50/60 p-3 dark:border-white/[0.04] dark:bg-[#121418]">
                                                <span className="text-[10px] font-semibold text-slate-500 uppercase dark:text-zinc-400">
                                                    NOMOR INDUK ADVOKAT (NIA)
                                                </span>
                                                <p className="mt-1 font-mono text-xs font-bold text-slate-900 dark:text-white">
                                                    {staff.advocate_license_no || (
                                                        <span className="font-sans font-normal text-slate-400">
                                                            Belum dilengkapi
                                                        </span>
                                                    )}
                                                </p>
                                            </div>

                                            <div className="rounded-lg border border-slate-200/70 bg-slate-50/60 p-3 dark:border-white/[0.04] dark:bg-[#121418]">
                                                <span className="text-[10px] font-semibold text-slate-500 uppercase dark:text-zinc-400">
                                                    NO. BAS PENGADILAN TINGGI
                                                </span>
                                                <p className="mt-1 font-mono text-xs font-bold text-slate-900 dark:text-white">
                                                    {staff.bas_number || (
                                                        <span className="font-sans font-normal text-slate-400">
                                                            Belum dilengkapi
                                                        </span>
                                                    )}
                                                </p>
                                            </div>

                                            <div className="rounded-lg border border-slate-200/70 bg-slate-50/60 p-3 dark:border-white/[0.04] dark:bg-[#121418]">
                                                <span className="text-[10px] font-semibold text-slate-500 uppercase dark:text-zinc-400">
                                                    TANGGAL SUMPAH (BAS)
                                                </span>
                                                <p className="mt-1 text-xs font-bold text-slate-900 dark:text-white">
                                                    {staff.bas_date ? (
                                                        formatDate(
                                                            staff.bas_date,
                                                        )
                                                    ) : (
                                                        <span className="font-normal text-slate-400">
                                                            Belum dilengkapi
                                                        </span>
                                                    )}
                                                </p>
                                            </div>

                                            <div className="rounded-lg border border-slate-200/70 bg-slate-50/60 p-3 dark:border-white/[0.04] dark:bg-[#121418]">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[10px] font-semibold text-slate-500 uppercase dark:text-zinc-400">
                                                        MASA BERLAKU KTA
                                                    </span>
                                                    {ktaStatus && (
                                                        <span
                                                            className={`py-0.2 rounded px-1.5 font-mono text-[9px] font-bold ${ktaStatus.color}`}
                                                        >
                                                            {ktaStatus.label}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="mt-1 text-xs font-bold text-slate-900 dark:text-white">
                                                    {staff.kta_expiry_date ? (
                                                        formatDate(
                                                            staff.kta_expiry_date,
                                                        )
                                                    ) : (
                                                        <span className="font-normal text-slate-400">
                                                            Belum ditentukan
                                                        </span>
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Practice Areas */}
                                        <div className="mt-3 rounded-lg border border-slate-200/70 bg-slate-50/60 p-3 dark:border-white/[0.04] dark:bg-[#121418]">
                                            <span className="text-[10px] font-semibold text-slate-500 uppercase dark:text-zinc-400">
                                                BIDANG SPESIALISASI HUKUM
                                                (PRACTICE AREAS)
                                            </span>
                                            <div className="mt-2 flex flex-wrap gap-1.5">
                                                {practiceAreasList.length >
                                                0 ? (
                                                    practiceAreasList.map(
                                                        (area, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="inline-flex items-center gap-1 rounded-md border border-slate-200/80 bg-white px-2 py-0.5 text-xs font-medium text-slate-800 shadow-2xs dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200"
                                                            >
                                                                <Sparkles className="size-3 text-amber-500" />
                                                                {area}
                                                            </span>
                                                        ),
                                                    )
                                                ) : (
                                                    <div className="flex items-center justify-between text-xs text-slate-400">
                                                        <span>
                                                            Belum ada
                                                            spesialisasi hukum
                                                            yang ditambahkan.
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
                                            <p className="text-xs text-slate-400">
                                                Staf ini belum ditugaskan pada
                                                perkara aktif saat ini.
                                            </p>
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
                                            onClick={() =>
                                                openEditWithTab('advocate')
                                            }
                                            className="h-8 rounded-lg bg-slate-900 px-3 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 dark:bg-white dark:text-slate-900"
                                        >
                                            <Pencil className="mr-1 size-3" />
                                            Edit Kredensial
                                        </Button>
                                    </div>

                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        <div className="rounded-lg border border-slate-200/70 bg-slate-50/60 p-3 dark:border-white/[0.04] dark:bg-[#121418]">
                                            <span className="text-[10px] font-semibold text-slate-500 uppercase dark:text-zinc-400">
                                                Nomor Induk Advokat (NIA)
                                            </span>
                                            <p className="mt-1 font-mono text-xs font-bold text-slate-900 dark:text-white">
                                                {staff.advocate_license_no ||
                                                    'Belum dilengkapi'}
                                            </p>
                                        </div>

                                        <div className="rounded-lg border border-slate-200/70 bg-slate-50/60 p-3 dark:border-white/[0.04] dark:bg-[#121418]">
                                            <span className="text-[10px] font-semibold text-slate-500 uppercase dark:text-zinc-400">
                                                No. Berita Acara Sumpah (BAS)
                                            </span>
                                            <p className="mt-1 font-mono text-xs font-bold text-slate-900 dark:text-white">
                                                {staff.bas_number ||
                                                    'Belum dilengkapi'}
                                            </p>
                                        </div>

                                        <div className="rounded-lg border border-slate-200/70 bg-slate-50/60 p-3 dark:border-white/[0.04] dark:bg-[#121418]">
                                            <span className="text-[10px] font-semibold text-slate-500 uppercase dark:text-zinc-400">
                                                Tanggal Sumpah Pengadilan (BAS)
                                            </span>
                                            <p className="mt-1 text-xs font-bold text-slate-900 dark:text-white">
                                                {staff.bas_date
                                                    ? formatDate(staff.bas_date)
                                                    : 'Belum dilengkapi'}
                                            </p>
                                        </div>

                                        <div className="rounded-lg border border-slate-200/70 bg-slate-50/60 p-3 dark:border-white/[0.04] dark:bg-[#121418]">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-semibold text-slate-500 uppercase dark:text-zinc-400">
                                                    Masa Berlaku KTA Advokat
                                                </span>
                                                {ktaStatus && (
                                                    <span
                                                        className={`py-0.2 rounded px-1.5 font-mono text-[9px] font-bold ${ktaStatus.color}`}
                                                    >
                                                        {ktaStatus.label}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="mt-1 text-xs font-bold text-slate-900 dark:text-white">
                                                {staff.kta_expiry_date
                                                    ? formatDate(
                                                          staff.kta_expiry_date,
                                                      )
                                                    : 'Belum ditentukan'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="rounded-lg border border-slate-200/70 bg-slate-50/60 p-3 dark:border-white/[0.04] dark:bg-[#121418]">
                                        <span className="text-[10px] font-semibold text-slate-500 uppercase dark:text-zinc-400">
                                            Riwayat Pendidikan &amp; Almamater
                                        </span>
                                        <p className="mt-1 text-xs font-semibold text-slate-800 dark:text-zinc-200">
                                            {staff.education ||
                                                'Belum dilengkapi (Contoh: S.H. - Universitas Indonesia, LL.M. - Leiden)'}
                                        </p>
                                    </div>

                                    <div className="rounded-lg border border-slate-200/70 bg-slate-50/60 p-3 dark:border-white/[0.04] dark:bg-[#121418]">
                                        <span className="text-[10px] font-semibold text-slate-500 uppercase dark:text-zinc-400">
                                            Bidang Spesialisasi Hukum (Practice
                                            Areas)
                                        </span>
                                        <div className="mt-2 flex flex-wrap gap-1.5">
                                            {practiceAreasList.length > 0 ? (
                                                practiceAreasList.map(
                                                    (area, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="inline-flex items-center gap-1 rounded-md border border-slate-200/80 bg-white px-2 py-0.5 text-xs font-medium text-slate-800 shadow-2xs dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200"
                                                        >
                                                            <Sparkles className="size-3 text-amber-500" />
                                                            {area}
                                                        </span>
                                                    ),
                                                )
                                            ) : (
                                                <p className="text-xs text-slate-400">
                                                    Belum ada spesialisasi
                                                    hukum.
                                                </p>
                                            )}
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
                                        <p className="text-xs text-slate-400">
                                            Belum ada perkara terkait staf ini.
                                        </p>
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
                                            onClick={() =>
                                                openEditWithTab('contact')
                                            }
                                            className="h-8 rounded-lg bg-slate-900 px-3 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 dark:bg-white dark:text-slate-900"
                                        >
                                            <Pencil className="mr-1 size-3" />
                                            Edit Kontak
                                        </Button>
                                    </div>

                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        <div className="rounded-lg border border-slate-200/70 bg-slate-50/60 p-3 dark:border-white/[0.04] dark:bg-[#121418]">
                                            <span className="text-[10px] font-semibold text-slate-500 uppercase dark:text-zinc-400">
                                                EMAIL KERJA RESMI
                                            </span>
                                            <p className="mt-1 font-mono text-xs font-bold text-slate-900 dark:text-white">
                                                {staff.email}
                                            </p>
                                        </div>

                                        <div className="rounded-lg border border-slate-200/70 bg-slate-50/60 p-3 dark:border-white/[0.04] dark:bg-[#121418]">
                                            <span className="text-[10px] font-semibold text-slate-500 uppercase dark:text-zinc-400">
                                                WHATSAPP / NO. HP
                                            </span>
                                            <p className="mt-1 font-mono text-xs font-bold text-slate-900 dark:text-white">
                                                {staff.phone || 'Belum diisi'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="rounded-lg border border-slate-200/70 bg-slate-50/60 p-3 dark:border-white/[0.04] dark:bg-[#121418]">
                                        <span className="text-[10px] font-semibold text-slate-500 uppercase dark:text-zinc-400">
                                            ALAMAT DOMISILI SAAT INI
                                        </span>
                                        <p className="mt-1 text-xs text-slate-800 dark:text-zinc-200">
                                            {staff.address ||
                                                'Belum dilengkapi'}
                                        </p>
                                    </div>

                                    <div className="rounded-lg border border-slate-200/70 bg-slate-50/60 p-3 dark:border-white/[0.04] dark:bg-[#121418]">
                                        <span className="text-[10px] font-semibold text-slate-500 uppercase dark:text-zinc-400">
                                            ALAMAT SESUAI KTP
                                        </span>
                                        <p className="mt-1 text-xs text-slate-800 dark:text-zinc-200">
                                            {staff.ktp_address ||
                                                'Belum dilengkapi'}
                                        </p>
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
                                            onClick={() =>
                                                openEditWithTab('billing')
                                            }
                                            className="h-8 rounded-lg bg-slate-900 px-3 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 dark:bg-white dark:text-slate-900"
                                        >
                                            <Pencil className="mr-1 size-3" />
                                            Edit Keuangan
                                        </Button>
                                    </div>

                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        <div className="rounded-lg border border-slate-200/70 bg-slate-50/60 p-3 dark:border-white/[0.04] dark:bg-[#121418]">
                                            <span className="text-[10px] font-semibold text-slate-500 uppercase dark:text-zinc-400">
                                                NAMA BANK
                                            </span>
                                            <p className="mt-1 font-bold text-slate-900 dark:text-white">
                                                {staff.bank_name ||
                                                    'Belum diisi'}
                                            </p>
                                        </div>

                                        <div className="rounded-lg border border-slate-200/70 bg-slate-50/60 p-3 dark:border-white/[0.04] dark:bg-[#121418]">
                                            <span className="text-[10px] font-semibold text-slate-500 uppercase dark:text-zinc-400">
                                                NOMOR REKENING
                                            </span>
                                            <p className="mt-1 font-mono text-xs font-bold text-slate-900 dark:text-white">
                                                {staff.bank_account_number ||
                                                    '-'}
                                            </p>
                                        </div>

                                        <div className="rounded-lg border border-slate-200/70 bg-slate-50/60 p-3 dark:border-white/[0.04] dark:bg-[#121418]">
                                            <span className="text-[10px] font-semibold text-slate-500 uppercase dark:text-zinc-400">
                                                ATAS NAMA REKENING
                                            </span>
                                            <p className="mt-1 text-xs font-semibold text-slate-900 dark:text-white">
                                                {staff.bank_account_holder ||
                                                    '-'}
                                            </p>
                                        </div>

                                        <div className="rounded-lg border border-slate-200/70 bg-slate-50/60 p-3 dark:border-white/[0.04] dark:bg-[#121418]">
                                            <span className="text-[10px] font-semibold text-slate-500 uppercase dark:text-zinc-400">
                                                NOMOR POKOK WAJIB PAJAK (NPWP)
                                            </span>
                                            <p className="mt-1 font-mono text-xs font-bold text-slate-900 dark:text-white">
                                                {staff.npwp ||
                                                    'Belum dilengkapi'}
                                            </p>
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
                                            onClick={() =>
                                                openEditWithTab('account')
                                            }
                                            className="h-8 rounded-lg bg-slate-900 px-3 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 dark:bg-white dark:text-slate-900"
                                        >
                                            <Pencil className="mr-1 size-3" />
                                            Kelola Role
                                        </Button>
                                    </div>

                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        {staff.roles.map((role) => (
                                            <div
                                                key={role.id}
                                                className="rounded-lg border border-slate-200/70 bg-slate-50/60 p-3 dark:border-white/[0.04] dark:bg-[#121418]"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Shield className="size-3.5 text-purple-600 dark:text-purple-400" />
                                                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                                                        {role.name}
                                                    </span>
                                                    <span className="py-0.2 rounded bg-slate-200/80 px-1.5 font-mono text-[9px] font-semibold text-slate-700 dark:bg-zinc-800 dark:text-zinc-300">
                                                        {role.slug}
                                                    </span>
                                                </div>
                                                {role.description && (
                                                    <p className="mt-1 text-[11px] text-slate-500 dark:text-zinc-400">
                                                        {role.description}
                                                    </p>
                                                )}
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
                                <div className="mb-2.5 flex items-center justify-between border-b border-slate-100 pb-2 dark:border-white/[0.04]">
                                    <div className="flex items-center gap-1.5">
                                        <Phone className="size-3.5 text-slate-500 dark:text-zinc-400" />
                                        <span className="text-[11px] font-semibold text-slate-500 uppercase dark:text-zinc-400">
                                            Kontak Staf
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            openEditWithTab('contact')
                                        }
                                        className="cursor-pointer text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
                                    >
                                        Edit
                                    </button>
                                </div>

                                <div className="space-y-2.5 text-xs">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] text-slate-500 dark:text-zinc-400">
                                            Email
                                        </span>
                                        <div className="flex items-center gap-1.5">
                                            <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
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
                                                className="text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200"
                                            >
                                                {copiedField === 'email' ? (
                                                    <Check className="size-3 text-emerald-600" />
                                                ) : (
                                                    <Copy className="size-3" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] text-slate-500 dark:text-zinc-400">
                                            WhatsApp
                                        </span>
                                        <span className="font-mono font-bold text-slate-900 dark:text-white">
                                            {staff.phone || (
                                                <span className="font-sans font-normal text-slate-400">
                                                    -
                                                </span>
                                            )}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] text-slate-500 dark:text-zinc-400">
                                            Tanggal Lahir
                                        </span>
                                        <span className="font-medium text-slate-700 dark:text-zinc-300">
                                            {staff.birth_date
                                                ? formatDate(staff.birth_date)
                                                : '-'}
                                        </span>
                                    </div>

                                    <div className="border-t border-slate-100 pt-2 dark:border-white/[0.04]">
                                        <span className="text-[11px] text-slate-500 dark:text-zinc-400">
                                            Domisili Saat Ini
                                        </span>
                                        <p className="mt-0.5 text-xs text-slate-800 dark:text-zinc-200">
                                            {staff.address || (
                                                <span className="text-slate-400">
                                                    Belum dilengkapi
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Rekening & Pajak */}
                            <div className="rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                <div className="mb-2.5 flex items-center justify-between border-b border-slate-100 pb-2 dark:border-white/[0.04]">
                                    <div className="flex items-center gap-1.5">
                                        <CreditCard className="size-3.5 text-slate-500 dark:text-zinc-400" />
                                        <span className="text-[11px] font-semibold text-slate-500 uppercase dark:text-zinc-400">
                                            Rekening &amp; Pajak
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            openEditWithTab('billing')
                                        }
                                        className="cursor-pointer text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
                                    >
                                        Edit
                                    </button>
                                </div>

                                <div className="space-y-2.5 text-xs">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] text-slate-500 dark:text-zinc-400">
                                            Bank
                                        </span>
                                        <span className="font-bold text-slate-900 dark:text-white">
                                            {staff.bank_name || '-'}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] text-slate-500 dark:text-zinc-400">
                                            No. Rekening
                                        </span>
                                        <span className="font-mono font-bold text-slate-900 dark:text-white">
                                            {staff.bank_account_number || '-'}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] text-slate-500 dark:text-zinc-400">
                                            Atas Nama
                                        </span>
                                        <span className="font-medium text-slate-700 dark:text-zinc-300">
                                            {staff.bank_account_holder || '-'}
                                        </span>
                                    </div>

                                    <div className="border-t border-slate-100 pt-2 dark:border-white/[0.04]">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[11px] text-slate-500 dark:text-zinc-400">
                                                NPWP
                                            </span>
                                            <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                                                {staff.npwp || '-'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Otorisasi & Sistem */}
                            <div className="rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                <div className="mb-2.5 flex items-center justify-between border-b border-slate-100 pb-2 dark:border-white/[0.04]">
                                    <div className="flex items-center gap-1.5">
                                        <ShieldCheck className="size-3.5 text-slate-500 dark:text-zinc-400" />
                                        <span className="text-[11px] font-semibold text-slate-500 uppercase dark:text-zinc-400">
                                            Otorisasi Sistem
                                        </span>
                                    </div>
                                    <span className="text-[11px] font-semibold text-slate-700 dark:text-zinc-300">
                                        {staff.roles.length} Role
                                    </span>
                                </div>

                                <div className="space-y-2 text-xs">
                                    <div className="flex flex-wrap gap-1">
                                        {staff.roles.map((r) => (
                                            <span
                                                key={r.id}
                                                className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700 dark:bg-white/[0.08] dark:text-zinc-300"
                                            >
                                                <Shield className="size-2.5" />
                                                {r.name}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="border-t border-slate-100 pt-2 text-[11px] text-slate-400 dark:border-white/[0.04]">
                                        <div className="flex items-center justify-between">
                                            <span>Email Terverifikasi</span>
                                            <span className="font-semibold text-slate-700 dark:text-zinc-300">
                                                {staff.email_verified_at
                                                    ? 'Ya'
                                                    : 'Belum'}
                                            </span>
                                        </div>
                                        <div className="mt-1 flex items-center justify-between">
                                            <span>Terdaftar Sejak</span>
                                            <span className="font-semibold text-slate-700 dark:text-zinc-300">
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

    useMemo(() => {
        setActiveTab(defaultTab);
    }, [defaultTab, open]);

    if (!user) return null;

    const assignedRoleIds = new Set(user.roles.map((role) => role.id));

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200/80 bg-white p-0 shadow-2xl sm:max-w-2xl dark:border-white/10 dark:bg-[#14161b]">
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

                                    <div className="space-y-2 rounded-xl border border-slate-200/70 bg-slate-50/60 p-3 dark:border-white/[0.06] dark:bg-[#121418]">
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

                                    <div className="space-y-2 rounded-xl border border-slate-200/70 bg-slate-50/60 p-3 dark:border-white/[0.06] dark:bg-[#121418]">
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
                                    className="h-8 cursor-pointer rounded-lg px-3 text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-950/30"
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
                                        className="h-8 rounded-lg border-slate-200 px-3.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-zinc-300"
                                    >
                                        Batal
                                    </Button>
                                    <Button
                                        size="sm"
                                        disabled={processing}
                                        className="h-8 cursor-pointer rounded-lg bg-slate-900 px-4 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-zinc-200"
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
