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
    },
    {
        name: 'Klien',
        desc: 'Direktori Klien',
        href: clients.index(),
        icon: Users,
    },
    {
        name: 'Dokumen',
        desc: 'Vault & Kontrak',
        href: documents.index(),
        icon: FileText,
    },
    {
        name: 'Tugas',
        desc: 'Monitoring Kerja',
        href: tasks.index(),
        icon: CheckSquare,
    },
    {
        name: 'Keuangan',
        desc: 'Billing & Fee',
        href: '/finance',
        icon: DollarSign,
    },
    {
        name: 'Kalender',
        desc: 'Sidang & Agenda',
        href: '/calendar',
        icon: Calendar,
    },
    {
        name: 'Kepatuhan',
        desc: 'Audit & KYC',
        href: '/governance',
        icon: ShieldCheck,
    },
    {
        name: 'Panduan',
        desc: 'Dokumentasi OS',
        href: '/guide',
        icon: BookOpen,
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
                            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700 transition-all group-hover:bg-blue-50 group-hover:text-blue-600 dark:bg-white/[0.06] dark:text-zinc-300 dark:group-hover:bg-blue-950/40 dark:group-hover:text-blue-400">
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
