import { Link } from '@inertiajs/react';
import {
    BookOpen,
    Briefcase,
    Calendar,
    CheckSquare,
    DollarSign,
    FileText,
    LayoutGrid,
    ShieldCheck,
    Users,
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import * as clients from '@/routes/clients';
import * as documents from '@/routes/documents';
import * as matters from '@/routes/matters';
import * as tasks from '@/routes/tasks';

const apps = [
    {
        name: 'Perkara',
        desc: 'Portofolio Kasus',
        href: matters.index(),
        icon: Briefcase,
        color: 'text-blue-600 dark:text-blue-400',
        bg: 'bg-blue-50 dark:bg-blue-950/50',
    },
    {
        name: 'Klien',
        desc: 'Direktori Klien',
        href: clients.index(),
        icon: Users,
        color: 'text-indigo-600 dark:text-indigo-400',
        bg: 'bg-indigo-50 dark:bg-indigo-950/50',
    },
    {
        name: 'Dokumen',
        desc: 'Vault & Kontrak',
        href: documents.index(),
        icon: FileText,
        color: 'text-emerald-600 dark:text-emerald-400',
        bg: 'bg-emerald-50 dark:bg-emerald-950/50',
    },
    {
        name: 'Tugas',
        desc: 'Monitoring Kerja',
        href: tasks.index(),
        icon: CheckSquare,
        color: 'text-amber-600 dark:text-amber-400',
        bg: 'bg-amber-50 dark:bg-amber-950/50',
    },
    {
        name: 'Keuangan',
        desc: 'Billing & Fee',
        href: '/finance',
        icon: DollarSign,
        color: 'text-teal-600 dark:text-teal-400',
        bg: 'bg-teal-50 dark:bg-teal-950/50',
    },
    {
        name: 'Kalender',
        desc: 'Sidang & Agenda',
        href: '/calendar',
        icon: Calendar,
        color: 'text-rose-600 dark:text-rose-400',
        bg: 'bg-rose-50 dark:bg-rose-950/50',
    },
    {
        name: 'Kepatuhan',
        desc: 'Audit & KYC',
        href: '/governance',
        icon: ShieldCheck,
        color: 'text-purple-600 dark:text-purple-400',
        bg: 'bg-purple-50 dark:bg-purple-950/50',
    },
    {
        name: 'Panduan',
        desc: 'Dokumentasi OS',
        href: '/guide',
        icon: BookOpen,
        color: 'text-sky-600 dark:text-sky-400',
        bg: 'bg-sky-50 dark:bg-sky-950/50',
    },
];

export function QuickAppsMenu() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    aria-label="Aplikasi & Modul Cepat"
                    title="Aplikasi & Modul Cepat"
                    className="flex size-9 cursor-pointer items-center justify-center rounded-full text-slate-600 transition-all hover:bg-slate-100 hover:text-slate-900 active:scale-95 dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-white"
                >
                    <LayoutGrid className="size-4.5" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="w-[320px] rounded-2xl border border-slate-200/90 bg-white/95 p-3 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-[#181a20]/95"
            >
                <div className="mb-2.5 px-2 pt-1">
                    <h4 className="text-xs font-bold tracking-tight text-slate-900 dark:text-white">
                        Modul &amp; Aplikasi Cepat
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                        Pintas ke seluruh ruang kerja RPK
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                    {apps.map((app) => (
                        <Link
                            key={app.name}
                            href={app.href}
                            className="group flex items-center gap-2.5 rounded-xl p-2 transition-all hover:bg-slate-100/80 active:scale-[0.98] dark:hover:bg-white/[0.06]"
                        >
                            <div
                                className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${app.bg} ${app.color} transition-transform group-hover:scale-105`}
                            >
                                <app.icon className="size-4" />
                            </div>
                            <div className="min-w-0 flex-1 leading-tight">
                                <span className="block truncate text-xs font-semibold text-slate-800 transition-colors group-hover:text-blue-600 dark:text-zinc-200 dark:group-hover:text-blue-400">
                                    {app.name}
                                </span>
                                <span className="block truncate text-[10px] text-slate-400 dark:text-zinc-500">
                                    {app.desc}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
