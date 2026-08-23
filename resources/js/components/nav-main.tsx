import { Link } from '@inertiajs/react';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
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

    return (
        <SidebarGroup className="px-2 py-1 group-data-[collapsible=icon]:px-0">
            <SidebarGroupLabel className="h-5 px-2 text-[10px] font-semibold tracking-wider text-[#787774] uppercase group-data-[collapsible=icon]:hidden dark:text-zinc-500">
                {label}
            </SidebarGroupLabel>
            <SidebarMenu className="gap-0.5 group-data-[collapsible=icon]:items-center">
                {items.map((item) => {
                    const active = isCurrentUrl(item.href);
                    const Icon = item.icon;

                    return (
                        <SidebarMenuItem key={item.title} className="w-full flex justify-center">
                            <SidebarMenuButton
                                asChild
                                isActive={active}
                                tooltip={{ children: item.title, side: 'right' }}
                            >
                                <Link
                                    href={item.href}
                                    prefetch
                                    className={`group flex h-8 w-full items-center gap-2 rounded-lg px-2 text-xs font-medium transition-colors duration-100 group-data-[collapsible=icon]:size-8.5! group-data-[collapsible=icon]:p-0! group-data-[collapsible=icon]:justify-center! group-data-[collapsible=icon]:mx-auto! ${
                                        active
                                            ? 'bg-black/[0.07] font-semibold text-[#111111] dark:bg-white/[0.12] dark:text-white'
                                            : 'text-[#555558] hover:bg-black/[0.03] hover:text-[#111111] dark:text-zinc-400 dark:hover:bg-white/[0.05] dark:hover:text-white'
                                    }`}
                                >
                                    {Icon && (
                                        <Icon
                                            className={`size-3.5 shrink-0 ${
                                                active
                                                    ? 'text-[#111111] dark:text-white'
                                                    : 'text-[#787774] group-hover:text-[#111111] dark:text-zinc-400 dark:group-hover:text-white'
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
