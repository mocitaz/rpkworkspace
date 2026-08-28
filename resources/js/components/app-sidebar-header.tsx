import { usePage } from '@inertiajs/react';
import { CommandPalette } from '@/components/command-palette';
import { NotificationMenu } from '@/components/notification-menu';
import { QuickAppsMenu } from '@/components/quick-apps-menu';
import { ThemeToggle } from '@/components/theme-toggle';
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
    const page = usePage();
    const { auth } = page.props;
    const getInitials = useInitials();

    return (
        <header className="sticky top-0 z-30 w-full px-4 pt-3.5 pb-1.5 sm:px-6 lg:px-8">
            <div className="flex h-14 w-full items-center justify-between rounded-2xl border border-slate-200/80 bg-white/95 px-3.5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] backdrop-blur-xl transition-all sm:h-[54px] sm:px-4.5 dark:border-white/[0.08] dark:bg-[#161820]/95 dark:shadow-black/20">
                {/* 1. Left Section: Sidebar Trigger & Search Bar */}
                <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
                    <SidebarTrigger className="size-8.5 shrink-0 rounded-full text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-900 active:scale-95 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white" />

                    {/* Search Bar on the Left (Desktop & Mobile) */}
                    <div className="w-full max-w-[220px] sm:max-w-[320px] md:max-w-[380px]">
                        <CommandPalette />
                    </div>
                </div>

                {/* 2. Right Section Actions: Theme Toggle -> App Grid -> Notifications -> User Avatar with Online Dot */}
                <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
                    {/* Theme Mode Toggle (Light/Dark) */}
                    <ThemeToggle />

                    {/* Quick Apps / Module Launcher */}
                    <QuickAppsMenu />

                    {/* Interactive Notification Bell with Badge */}
                    <NotificationMenu />

                    {/* User Profile Avatar with Online Green Dot */}
                    {auth.user && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    type="button"
                                    aria-label="Menu Pengguna"
                                    className="group relative ml-1 flex size-9 cursor-pointer items-center justify-center rounded-full transition-all active:scale-95"
                                >
                                    <Avatar className="size-9 shrink-0 rounded-full border border-slate-200/90 shadow-2xs transition-all group-hover:scale-105 group-hover:ring-2 group-hover:ring-blue-500/30 dark:border-white/15">
                                        <AvatarImage
                                            src={
                                                auth.user.avatar_url ??
                                                auth.user.avatar
                                            }
                                            alt={auth.user.name}
                                        />
                                        <AvatarFallback className="rounded-full bg-blue-50 text-[11px] font-extrabold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                                            {getInitials(auth.user.name)}
                                        </AvatarFallback>
                                    </Avatar>

                                    {/* Emerald Online Status Indicator */}
                                    <span className="absolute right-0 bottom-0 size-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#161820]" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-[252px] max-w-[calc(100vw-1rem)] rounded-2xl border border-slate-200/90 bg-white p-1.5 shadow-[0_14px_36px_-18px_rgba(15,23,42,0.3)] dark:border-white/10 dark:bg-[#16181d]"
                                align="end"
                                side="bottom"
                            >
                                <UserMenuContent user={auth.user} />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </div>
        </header>
    );
}
