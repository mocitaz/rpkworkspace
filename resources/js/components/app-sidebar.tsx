import { Link, usePage } from '@inertiajs/react';
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

const workspaceItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    { title: 'Perkara', href: matters.index(), icon: FolderKanban },
    { title: 'Klien', href: clients.index(), icon: UsersRound },
    { title: 'Kontak', href: contacts.index(), icon: ContactRound },
];

const workItems: NavItem[] = [
    { title: 'Tugas', href: tasks.index(), icon: ListTodo },
    { title: 'Kalender', href: calendar.index(), icon: CalendarDays },
];

const knowledgeItems: NavItem[] = [
    { title: 'Dokumen', href: documents.index(), icon: Files },
];

const administrationItems: NavItem[] = [
    { title: 'Pengaturan', href: profile.edit(), icon: Settings },
];

export function AppSidebar() {
    const { auth } = usePage().props;
    const { isMobile, setOpenMobile } = useSidebar();
    const adminItems = [...administrationItems];
    const operationalItems = [...workItems];
    const knowledgeNavigationItems = [...knowledgeItems];

    if (auth.permissions?.includes('billing.view')) {
        operationalItems.push({
            title: 'Keuangan',
            href: finance.index(),
            icon: Landmark,
        });
    }

    if (
        auth.permissions?.includes('correspondence.view') ||
        auth.permissions?.includes('conflict.view') ||
        auth.permissions?.includes('archive.view')
    ) {
        operationalItems.push({
            title: 'Tata Kelola',
            href: governance.index(),
            icon: ShieldCheck,
        });
    }

    if (auth.permissions?.includes('admin.users.manage')) {
        adminItems.push({
            title: 'Pengguna & Akses',
            href: adminUsers.index(),
            icon: ShieldCheck,
        });
    }

    if (auth.permissions?.includes('audit.view')) {
        adminItems.push({
            title: 'Audit Log',
            href: adminAudit.index(),
            icon: ScrollText,
        });
    }

    return (
        <Sidebar
            collapsible="icon"
            variant="sidebar"
            className="border-r border-slate-200/80 bg-white text-slate-700 shadow-none dark:border-white/[0.08] dark:bg-[#121418] dark:text-white [&_[data-sidebar=sidebar]]:bg-white dark:[&_[data-sidebar=sidebar]]:bg-[#121418]"
        >
            <SidebarHeader className="border-b border-slate-100 p-2.5 group-data-[collapsible=icon]:p-2.5 dark:border-white/[0.06]">
                <Link
                    href={dashboard()}
                    prefetch
                    onClick={() => {
                        if (isMobile) {
                            setOpenMobile(false);
                        }
                    }}
                    className="group flex w-full items-center rounded-xl p-1 transition-colors hover:bg-slate-100/80 focus:outline-none dark:hover:bg-white/[0.06]"
                >
                    <AppLogo />
                </Link>
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

            <SidebarFooter className="border-t border-slate-100 p-2 group-data-[collapsible=icon]:p-1.5 dark:border-white/[0.06] space-y-1">
                <NavUser />
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
                    : 'justify-start gap-2 px-2.5 text-xs font-normal text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white',
            )}
        >
            {isCollapsed ? (
                <ChevronRight className="size-4 text-slate-400 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-slate-700 dark:text-zinc-500 dark:group-hover:text-zinc-200" />
            ) : (
                <>
                    <ChevronLeft className="size-4 text-slate-400 transition-transform duration-150 group-hover:-translate-x-0.5 group-hover:text-slate-700 dark:text-zinc-500 dark:group-hover:text-zinc-200" />
                    <span className="text-xs font-medium tracking-tight">Collapse</span>
                </>
            )}
        </button>
    );
}
