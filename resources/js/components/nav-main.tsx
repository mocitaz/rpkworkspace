import { Link } from '@inertiajs/react';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavItem } from '@/types';

export function NavMain({
    items = [],
    label,
}: {
    items: NavItem[];
    label: string;
}) {
    const { isCurrentUrl } = useCurrentUrl();
    const { isMobile, setOpenMobile } = useSidebar();

    if (!items || items.length === 0) {
        return null;
    }

    return (
        <SidebarGroup className="px-2.5 py-2 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:py-1">
            <SidebarGroupLabel className="h-5 px-2 text-[8.5px] font-extrabold tracking-[0.16em] text-slate-400 uppercase group-data-[collapsible=icon]:hidden dark:text-zinc-500">
                {label}
            </SidebarGroupLabel>
            <SidebarMenu className="gap-1 group-data-[collapsible=icon]:items-center">
                {items.map((item) => {
                    const active = isCurrentUrl(item.href);
                    const Icon = item.icon;

                    return (
                        <SidebarMenuItem
                            key={item.title}
                            className="flex w-full justify-center"
                        >
                            <SidebarMenuButton
                                asChild
                                isActive={active}
                                tooltip={{
                                    children: item.title,
                                    side: 'right',
                                }}
                            >
                                <Link
                                    href={item.href}
                                    prefetch
                                    onClick={() => {
                                        if (isMobile) {
                                            setOpenMobile(false);
                                        }
                                    }}
                                    className={`group relative flex h-9 w-full items-center gap-2.5 rounded-xl px-2.5 text-xs transition-all duration-150 group-data-[collapsible=icon]:mx-auto! group-data-[collapsible=icon]:size-9! group-data-[collapsible=icon]:justify-center! group-data-[collapsible=icon]:p-0! ${
                                        active
                                            ? 'bg-slate-100 font-semibold text-slate-950 dark:bg-white/[0.07] dark:text-white'
                                            : 'font-medium text-slate-600 hover:bg-slate-100/90 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-white/[0.08] dark:hover:text-white'
                                    }`}
                                >
                                    {Icon && (
                                        <Icon
                                            className={`size-4 shrink-0 transition-transform group-hover:scale-110 ${
                                                active
                                                    ? 'text-slate-700 dark:text-zinc-100'
                                                    : 'text-slate-400 group-hover:text-slate-700 dark:text-zinc-500 dark:group-hover:text-zinc-300'
                                            }`}
                                        />
                                    )}
                                    <span className="truncate group-data-[collapsible=icon]:hidden">
                                        {item.title}
                                    </span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
