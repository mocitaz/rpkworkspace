import { usePage } from '@inertiajs/react';
import { ChevronsUpDown } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { UserInfo } from '@/components/user-info';
import { UserMenuContent } from '@/components/user-menu-content';
import { useIsMobile } from '@/hooks/use-mobile';

export function NavUser() {
    const { auth } = usePage().props;
    const { state } = useSidebar();
    const isMobile = useIsMobile();

    if (!auth.user) {
        return null;
    }

    return (
        <SidebarMenu className="group-data-[collapsible=icon]:items-center">
            <SidebarMenuItem className="flex w-full justify-center">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="group h-10 w-full rounded-xl border border-slate-200/80 bg-slate-50/70 px-2 text-slate-800 shadow-2xs transition-all duration-150 group-data-[collapsible=icon]:mx-auto! group-data-[collapsible=icon]:size-9! group-data-[collapsible=icon]:justify-center! group-data-[collapsible=icon]:border-0! group-data-[collapsible=icon]:bg-transparent! group-data-[collapsible=icon]:p-0! hover:border-slate-300 hover:bg-white hover:shadow-xs active:scale-[0.99] data-[state=open]:bg-white dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-white dark:hover:border-white/15 dark:hover:bg-white/[0.06] dark:data-[state=open]:bg-white/[0.08]"
                            data-test="sidebar-menu-button"
                        >
                            <UserInfo user={auth.user} />
                            <ChevronsUpDown className="ml-auto size-3.5 shrink-0 text-slate-400 transition-transform duration-150 group-hover:text-slate-700 group-data-[collapsible=icon]:hidden dark:text-zinc-500 dark:group-hover:text-zinc-300" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-2xl border border-slate-200/90 bg-white p-1.5 shadow-2xl dark:border-white/10 dark:bg-[#16181d]"
                        align="end"
                        side={
                            isMobile
                                ? 'bottom'
                                : state === 'collapsed'
                                  ? 'right'
                                  : 'top'
                        }
                    >
                        <UserMenuContent user={auth.user} />
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
