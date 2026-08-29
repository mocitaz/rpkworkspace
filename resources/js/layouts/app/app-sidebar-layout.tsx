import workspaceLandscapeBackground from '@/../images/workspace-landscape-bg.png';
import workspaceArchitecturalDarkBackground from '@/../images/workspace-architectural-dark-bg.png';
import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { FloatingChat } from '@/components/floating-chat';
import { MobileBottomNav } from '@/components/mobile-bottom-nav';
import type { AppLayoutProps } from '@/types';
import type { CSSProperties } from 'react';

const workspaceBackgrounds = {
    '--workspace-light-background': `radial-gradient(ellipse 68% 58% at 50% 48%, rgba(250, 250, 252, 0.72) 0%, rgba(250, 250, 252, 0.46) 44%, rgba(250, 250, 252, 0.12) 74%, transparent 100%), linear-gradient(rgba(250, 250, 252, 0.24), rgba(250, 250, 252, 0.24)), url(${workspaceLandscapeBackground})`,
    '--workspace-dark-background': `radial-gradient(ellipse 72% 62% at 50% 42%, rgba(15, 23, 42, 0.08) 0%, rgba(8, 15, 28, 0.2) 66%, rgba(5, 10, 19, 0.38) 100%), url(${workspaceArchitecturalDarkBackground})`,
} as CSSProperties;

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent
                variant="sidebar"
                className="workspace-mobile-safe overflow-x-hidden [background-image:var(--workspace-light-background)] bg-cover bg-fixed bg-bottom bg-no-repeat pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-6 dark:bg-[#101216] dark:[background-image:var(--workspace-dark-background)] [&>div.min-h-screen]:!bg-transparent"
                style={workspaceBackgrounds}
            >
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                {children}
            </AppContent>
            <FloatingChat />
            <MobileBottomNav />
        </AppShell>
    );
}
