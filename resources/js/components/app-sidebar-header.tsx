import { usePage } from '@inertiajs/react';
import { ChevronDown, Sparkles } from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { CommandPalette } from '@/components/command-palette';
import { NotificationMenu } from '@/components/notification-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const { auth } = usePage().props;
    const getInitials = useInitials();

    return (
        <header className="sticky top-0 z-30 flex h-13 shrink-0 items-center justify-between gap-2 border-b border-slate-200/80 bg-white/95 px-2.5 backdrop-blur-xl transition-colors sm:gap-3 sm:px-5 dark:border-white/[0.08] dark:bg-[#121418]/95">
            {/* Left: Breadcrumbs & Mobile Toggle */}
            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                <SidebarTrigger className="size-8.5 rounded-xl text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-900 active:scale-95 md:hidden dark:text-zinc-400 dark:hover:bg-white/[0.08] dark:hover:text-white" />
                {breadcrumbs.length > 0 && (
                    <div className="hidden min-w-0 sm:flex">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                )}
            </div>

            {/* Center: Symmetrical Spotlight Search Capsule */}
            <div className="flex flex-1 items-center justify-center px-1 sm:px-4">
                <div className="w-full max-w-md">
                    <CommandPalette className="shadow-2xs" />
                </div>
            </div>

            {/* Right: Notifications & Clean Unboxed User Profile */}
            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                <NotificationMenu />

                {auth.user && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                type="button"
                                className="group flex cursor-pointer items-center gap-2 rounded-xl p-1 text-left transition-all hover:bg-slate-100/80 active:scale-[0.98] data-[state=open]:bg-slate-100/80 dark:hover:bg-white/[0.06] dark:data-[state=open]:bg-white/[0.06]"
                            >
                                <Avatar className="size-8 shrink-0 rounded-xl border border-slate-200/90 shadow-2xs transition-transform group-hover:scale-105 dark:border-white/15">
                                    <AvatarImage
                                        src={
                                            auth.user.avatar_url ??
                                            auth.user.avatar
                                        }
                                        alt={auth.user.name}
                                    />
                                    <AvatarFallback className="rounded-xl bg-blue-50 text-[10px] font-extrabold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                                        {getInitials(auth.user.name)}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="hidden min-w-0 flex-col leading-tight sm:flex">
                                    <span className="max-w-[130px] truncate text-xs font-bold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                                        {auth.user.name}
                                    </span>
                                    <span className="max-w-[130px] truncate text-[10px] font-medium text-slate-400 dark:text-zinc-500">
                                        {auth.user.position_title ??
                                            auth.user.email}
                                    </span>
                                </div>

                                <ChevronDown className="size-3.5 text-slate-400 transition-transform duration-200 group-hover:text-slate-600 group-data-[state=open]:rotate-180 dark:text-zinc-500 dark:group-hover:text-zinc-300" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="w-60 rounded-2xl border border-slate-200/90 bg-white p-1.5 shadow-2xl dark:border-white/10 dark:bg-[#16181d]"
                            align="end"
                            side="bottom"
                        >
                            <UserMenuContent user={auth.user} />
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
        </header>
    );
}
