import { Link } from '@inertiajs/react';
import {
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    ContactRound,
    Files,
    FolderKanban,
    Landmark,
    LayoutGrid,
    ListTodo,
    ScrollText,
    Settings,
    ShieldCheck,
    UsersRound,
    Mail,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
    useSidebar,
} from '@/components/ui/sidebar';
import { usePermission } from '@/hooks/use-permission';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import * as adminAudit from '@/routes/admin/audit';
import * as adminUsers from '@/routes/admin/users';
import * as calendar from '@/routes/calendar';
import * as clients from '@/routes/clients';
import * as contacts from '@/routes/contacts';
import * as documents from '@/routes/documents';
import * as finance from '@/routes/finance';
import * as governance from '@/routes/governance';
import * as matters from '@/routes/matters';
import * as profile from '@/routes/profile';
import * as tasks from '@/routes/tasks';
import type { NavItem } from '@/types';

export function AppSidebar() {
    const { can, canAny } = usePermission();
    const { isMobile, setOpenMobile } = useSidebar();

    // 1. Menu Utama
    const workspaceItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard.url(),
            icon: LayoutGrid,
        },
    ];

    if (canAny(['matter.view', 'matter.view.all'])) {
        workspaceItems.push({
            title: 'Perkara',
            href: matters.index.url(),
            icon: FolderKanban,
        });
    }

    if (can('client.view')) {
        workspaceItems.push({
            title: 'Klien',
            href: clients.index.url(),
            icon: UsersRound,
        });
    }

    if (can('contact.view')) {
        workspaceItems.push({
            title: 'Kontak',
            href: contacts.index.url(),
            icon: ContactRound,
        });
    }

    if (can('email.view')) {
        workspaceItems.push({ title: 'Email', href: '/email', icon: Mail });
    }

    // 2. Manajemen Perkara & Operasional
    const operationalItems: NavItem[] = [];

    if (can('task.view')) {
        operationalItems.push({
            title: 'Tugas',
            href: tasks.index.url(),
            icon: ListTodo,
        });
    }

    if (canAny(['matter.view', 'matter.view.all', 'task.view'])) {
        operationalItems.push({
            title: 'Kalender',
            href: calendar.index.url(),
            icon: CalendarDays,
        });
    }

    if (can('billing.view')) {
        operationalItems.push({
            title: 'Keuangan',
            href: finance.index.url(),
            icon: Landmark,
        });
    }

    if (canAny(['correspondence.view', 'conflict.view', 'archive.view'])) {
        operationalItems.push({
            title: 'Tata Kelola',
            href: governance.index.url(),
            icon: ShieldCheck,
        });
    }

    // 3. Pengetahuan & Berkas
    const knowledgeNavigationItems: NavItem[] = [];

    if (can('document.view')) {
        knowledgeNavigationItems.push({
            title: 'Dokumen',
            href: documents.index.url(),
            icon: Files,
        });
    }

    // 4. Pengaturan & Administrasi
    const adminItems: NavItem[] = [
        {
            title: 'Pengaturan',
            href: profile.edit.url(),
            icon: Settings,
        },
    ];

    if (can('admin.users.manage')) {
        adminItems.push({
            title: 'Pengguna & Akses',
            href: adminUsers.index.url(),
            icon: ShieldCheck,
        });
    }

    if (can('audit.view')) {
        adminItems.push({
            title: 'Audit Log',
            href: adminAudit.index.url(),
            icon: ScrollText,
        });
    }

    return (
        <Sidebar
            collapsible="icon"
            variant="sidebar"
            className="border-r border-slate-200/70 bg-[#fbfcfe]/94 text-slate-700 shadow-[8px_0_28px_rgba(15,23,42,0.035)] backdrop-blur-2xl dark:border-white/[0.08] dark:bg-[#121418]/94 dark:text-white [&_[data-sidebar=sidebar]]:bg-[#fbfcfe]/94 dark:[&_[data-sidebar=sidebar]]:bg-[#121418]/94"
        >
            <SidebarHeader className="flex h-auto shrink-0 flex-col items-stretch border-b border-slate-200/70 px-2.5 py-1.5 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-1.5 group-data-[collapsible=icon]:py-2 dark:border-white/[0.07]">
                <Link
                    href={dashboard()}
                    prefetch
                    onClick={() => {
                        if (isMobile) {
                            setOpenMobile(false);
                        }
                    }}
                    className="group flex h-9 w-full items-center rounded-xl px-1 group-data-[collapsible=icon]:justify-center focus:outline-none"
                >
                    <AppLogo />
                </Link>
                <NavUser variant="header" />
            </SidebarHeader>

            <SidebarContent className="space-y-0.5 px-1 py-1.5 group-data-[collapsible=icon]:px-0">
                <NavMain label="MENU UTAMA" items={workspaceItems} />
                <NavMain label="MANAJEMEN PERKARA" items={operationalItems} />
                <NavMain
                    label="PENGETAHUAN & BERKAS"
                    items={knowledgeNavigationItems}
                />
                <NavMain label="PENGATURAN" items={adminItems} />
            </SidebarContent>

            <SidebarFooter className="space-y-1 border-t border-slate-100 p-2 group-data-[collapsible=icon]:p-1.5 dark:border-white/[0.06]">
                <SidebarCollapseButton />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}

function SidebarCollapseButton() {
    const { state, toggleSidebar } = useSidebar();
    const isCollapsed = state === 'collapsed';

    return (
        <button
            type="button"
            onClick={toggleSidebar}
            title={isCollapsed ? 'Buka Sidebar (⌘B)' : 'Tutup Sidebar (⌘B)'}
            className={cn(
                'group flex h-8.5 w-full cursor-pointer items-center rounded-xl text-slate-500 transition-all duration-150',
                'hover:bg-slate-100/80 hover:text-slate-900 active:scale-[0.98]',
                'dark:text-zinc-400 dark:hover:bg-white/[0.06] dark:hover:text-white',
                isCollapsed
                    ? 'justify-center px-0'
                    : 'justify-start gap-2 px-2.5 text-xs font-normal text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white',
            )}
        >
            {isCollapsed ? (
                <ChevronRight className="size-4 text-slate-400 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-slate-700 dark:text-zinc-500 dark:group-hover:text-zinc-200" />
            ) : (
                <>
                    <ChevronLeft className="size-4 text-slate-400 transition-transform duration-150 group-hover:-translate-x-0.5 group-hover:text-slate-700 dark:text-zinc-500 dark:group-hover:text-zinc-200" />
                    <span className="text-xs font-medium tracking-tight">
                        Collapse
                    </span>
                </>
            )}
        </button>
    );
}
