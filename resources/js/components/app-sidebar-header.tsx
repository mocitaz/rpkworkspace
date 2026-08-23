import { Breadcrumbs } from '@/components/breadcrumbs';
import { CommandPalette } from '@/components/command-palette';
import { NotificationMenu } from '@/components/notification-menu';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    return (
        <header className="sticky top-0 z-30 flex h-12 shrink-0 items-center justify-between gap-4 border-b border-black/[0.06] bg-[#fbfbfa]/90 px-4 backdrop-blur-md transition-colors sm:px-6 dark:border-white/[0.06] dark:bg-[#121212]/90">
            {/* Left: Sidebar Toggle + Breadcrumbs */}
            <div className="flex min-w-0 items-center gap-2.5">
                <SidebarTrigger className="size-7.5 rounded-lg border border-black/[0.08] bg-white text-[#787774] shadow-2xs transition-colors hover:bg-black/[0.03] hover:text-[#111111] dark:border-white/[0.1] dark:bg-[#1c1c1e] dark:text-zinc-400 dark:hover:bg-white/[0.08] dark:hover:text-white" />
                <div className="h-3.5 w-px bg-black/[0.08] dark:bg-white/[0.1]" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>

            {/* Right: Search Capsule & Notification Menu */}
            <div className="flex shrink-0 items-center gap-2">
                <CommandPalette />
                <NotificationMenu />
            </div>
        </header>
    );
}
