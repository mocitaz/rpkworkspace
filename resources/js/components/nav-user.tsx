import { usePage } from '@inertiajs/react';
import { ChevronsUpDown } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { useInitials } from '@/hooks/use-initials';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

export function NavUser({
    variant = 'footer',
}: {
    variant?: 'footer' | 'header';
}) {
    const { auth } = usePage().props;
    const { state } = useSidebar();
    const isMobile = useIsMobile();
    const isHeader = variant === 'header';
    const getInitials = useInitials();

    if (!auth.user) {
        return null;
    }

    if (isHeader) {
        return (
            <div
                data-sidebar-profile="header"
                className="relative mt-1.5 flex w-full flex-col items-center px-2 py-3 text-center group-data-[collapsible=icon]:mt-0 group-data-[collapsible=icon]:size-10 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0"
            >
                <Avatar className="relative size-12 rounded-full border-[3px] border-white shadow-[0_5px_14px_rgba(30,64,175,0.12)] ring-1 ring-blue-100 group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:border-2 dark:border-[#17191f] dark:ring-white/10">
                    <AvatarImage
                        src={
                            auth.user.avatar_url ||
                            auth.user.avatar ||
                            '/images/default-avatar.svg'
                        }
                        alt={auth.user.name}
                    />
                    <AvatarFallback className="rounded-full bg-blue-50 text-[11px] font-extrabold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                        {getInitials(auth.user.name)}
                    </AvatarFallback>
                </Avatar>
                <div className="relative mt-2 w-full min-w-0 px-1 group-data-[collapsible=icon]:hidden">
                    <p className="truncate text-xs leading-4 font-bold tracking-tight text-slate-900 dark:text-white">
                        {auth.user.name}
                    </p>
                    <p className="mt-0.5 truncate text-[9.5px] leading-3.5 text-slate-400 dark:text-zinc-500">
                        {auth.user.email}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <SidebarMenu className="group-data-[collapsible=icon]:items-center">
            <SidebarMenuItem className="flex w-full justify-center">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className={cn(
                                'group w-full rounded-xl px-2 text-slate-800 transition-all duration-150 group-data-[collapsible=icon]:mx-auto! group-data-[collapsible=icon]:size-9! group-data-[collapsible=icon]:justify-center! group-data-[collapsible=icon]:border-0! group-data-[collapsible=icon]:bg-transparent! group-data-[collapsible=icon]:p-0! active:scale-[0.99] dark:text-white',
                                'h-10 border border-slate-200/80 bg-slate-50/70 shadow-2xs hover:border-slate-300 hover:bg-white hover:shadow-xs data-[state=open]:bg-white dark:border-white/[0.08] dark:bg-white/[0.03] dark:hover:border-white/15 dark:hover:bg-white/[0.06] dark:data-[state=open]:bg-white/[0.08]',
                            )}
                            data-test="sidebar-menu-button"
                            data-sidebar-profile={variant}
                        >
                            <UserInfo user={auth.user} />
                            <ChevronsUpDown className="ml-auto size-3.5 shrink-0 text-slate-400 transition-transform duration-150 group-hover:text-slate-700 group-data-[collapsible=icon]:hidden dark:text-zinc-500 dark:group-hover:text-zinc-300" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[252px] max-w-[calc(100vw-1rem)] rounded-xl border border-slate-200/90 bg-white p-1.5 shadow-[0_14px_36px_-18px_rgba(15,23,42,0.3)] dark:border-white/10 dark:bg-[#16181d]"
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
