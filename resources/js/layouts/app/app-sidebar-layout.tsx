import workspaceLandscapeBackground from '@/../images/workspace-landscape-bg.png';
import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { FloatingChat } from '@/components/floating-chat';
import { MobileBottomNav } from '@/components/mobile-bottom-nav';
import type { AppLayoutProps } from '@/types';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent
                variant="sidebar"
                className="overflow-x-hidden bg-cover bg-fixed bg-bottom bg-no-repeat pb-20 md:pb-6 dark:bg-[#101216] dark:bg-none [&>div.min-h-screen]:!bg-transparent"
                style={{
                    backgroundImage: `radial-gradient(ellipse 68% 58% at 50% 48%, rgba(250, 250, 252, 0.72) 0%, rgba(250, 250, 252, 0.46) 44%, rgba(250, 250, 252, 0.12) 74%, transparent 100%), linear-gradient(rgba(250, 250, 252, 0.24), rgba(250, 250, 252, 0.24)), url(${workspaceLandscapeBackground})`,
                }}
            >
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                {children}
            </AppContent>
            <FloatingChat />
            <MobileBottomNav />
        </AppShell>
    );
}
