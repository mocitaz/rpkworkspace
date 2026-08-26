import { Link, usePage } from '@inertiajs/react';
import {
    BriefcaseBusiness,
    Files,
    Landmark,
    LayoutDashboard,
    ListTodo,
    Menu,
} from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import * as documents from '@/routes/documents';
import * as finance from '@/routes/finance';
import * as matters from '@/routes/matters';
import * as tasks from '@/routes/tasks';

export function MobileBottomNav() {
    const { isCurrentUrl } = useCurrentUrl();
    const { isMobile, setOpenMobile, openMobile } = useSidebar();
    const { auth } = usePage().props;

    if (!isMobile) {
        return null;
    }

    const navItems = [
        {
            title: 'Dashboard',
            href: dashboard.url(),
            icon: LayoutDashboard,
            active: isCurrentUrl(dashboard.url()),
        },
        {
            title: 'Perkara',
            href: matters.index.url(),
            icon: BriefcaseBusiness,
            active: isCurrentUrl('/matters'),
        },
        {
            title: 'Dokumen',
            href: documents.index.url(),
            icon: Files,
            active: isCurrentUrl('/documents'),
        },
        auth.permissions?.includes('billing.view')
            ? {
                  title: 'Keuangan',
                  href: finance.index.url(),
                  icon: Landmark,
                  active: isCurrentUrl('/finance'),
              }
            : {
                  title: 'Tugas',
                  href: tasks.index.url(),
                  icon: ListTodo,
                  active: isCurrentUrl('/tasks'),
              },
    ];

    return (
        <nav
            aria-label="Navigasi Utama Mobile"
            className="fixed inset-x-0 bottom-0 z-40 flex h-14 items-center justify-around border-t border-slate-200/80 bg-white/92 px-1 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgba(0,0,0,0.04)] backdrop-blur-2xl md:hidden dark:border-white/[0.08] dark:bg-[#101216]/92 dark:shadow-[0_-4px_20px_rgba(0,0,0,0.3)]"
        >
            {navItems.map((item) => {
                const Icon = item.icon;
                return (
                    <Link
                        key={item.title}
                        href={item.href}
                        prefetch
                        onClick={() => {
                            if (openMobile) {
                                setOpenMobile(false);
                            }
                        }}
                        className={cn(
                            'relative flex flex-1 flex-col items-center justify-center py-1 text-center transition-all active:scale-90',
                            item.active
                                ? 'text-blue-600 dark:text-blue-400'
                                : 'text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white',
                        )}
                    >
                        {item.active && (
                            <span className="absolute top-0 h-0.75 w-6 rounded-full bg-blue-600 dark:bg-blue-400" />
                        )}
                        <Icon
                            className={cn(
                                'size-4.5 transition-transform',
                                item.active
                                    ? 'stroke-[2.25px] text-blue-600 dark:text-blue-400'
                                    : 'stroke-[1.75px] text-slate-400 dark:text-zinc-500',
                            )}
                        />
                        <span
                            className={cn(
                                'mt-0.5 text-[9.5px] tracking-tight transition-colors',
                                item.active
                                    ? 'font-bold text-blue-600 dark:text-blue-400'
                                    : 'font-medium text-slate-500 dark:text-zinc-400',
                            )}
                        >
                            {item.title}
                        </span>
                    </Link>
                );
            })}

            {/* All Menus Drawer Trigger */}
            <button
                type="button"
                onClick={() => setOpenMobile(!openMobile)}
                className={cn(
                    'relative flex flex-1 flex-col items-center justify-center py-1 text-center transition-all active:scale-90',
                    openMobile
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white',
                )}
            >
                {openMobile && (
                    <span className="absolute top-0 h-0.75 w-6 rounded-full bg-blue-600 dark:bg-blue-400" />
                )}
                <Menu
                    className={cn(
                        'size-4.5 transition-transform',
                        openMobile
                            ? 'stroke-[2.25px] text-blue-600 dark:text-blue-400'
                            : 'stroke-[1.75px] text-slate-400 dark:text-zinc-500',
                    )}
                />
                <span
                    className={cn(
                        'mt-0.5 text-[9.5px] tracking-tight transition-colors',
                        openMobile
                            ? 'font-bold text-blue-600 dark:text-blue-400'
                            : 'font-medium text-slate-500 dark:text-zinc-400',
                    )}
                >
                    Menu
                </span>
            </button>
        </nav>
    );
}
