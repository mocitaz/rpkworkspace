import { Link, usePage } from '@inertiajs/react';
import {
    CalendarDays,
    ContactRound,
    Files,
    FileStack,
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
} from '@/components/ui/sidebar';
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
import * as templates from '@/routes/templates';
import type { NavItem } from '@/types';

const workspaceItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    { title: 'Matters', href: matters.index(), icon: FolderKanban },
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
            title: 'Governance',
            href: governance.index(),
            icon: ShieldCheck,
        });
    }

    if (auth.permissions?.includes('template.view')) {
        knowledgeNavigationItems.push({
            title: 'Template',
            href: templates.index(),
            icon: FileStack,
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
            className="border-r border-black/[0.06] bg-[#fbfbfa] shadow-none dark:border-white/[0.06] dark:bg-[#121212]"
        >
            <SidebarHeader className="p-3 group-data-[collapsible=icon]:p-2">
                <Link
                    href={dashboard()}
                    prefetch
                    className="group flex w-full items-center rounded-lg p-1 transition-colors hover:bg-black/[0.03] dark:hover:bg-white/[0.04] focus:outline-none"
                >
                    <AppLogo />
                </Link>
            </SidebarHeader>

            <SidebarContent className="px-1.5 space-y-0.5 group-data-[collapsible=icon]:px-0">
                <NavMain label="Workspace" items={workspaceItems} />
                <NavMain label="Operasional" items={operationalItems} />
                <NavMain label="Pengetahuan & Berkas" items={knowledgeNavigationItems} />
                <NavMain label="Administrasi" items={adminItems} />
            </SidebarContent>

            <SidebarFooter className="border-t border-black/[0.05] p-2 group-data-[collapsible=icon]:p-1 dark:border-white/[0.05]">
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
