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
            aria-label="Mobile Navigation"
            className="pb-safe fixed inset-x-0 bottom-0 z-40 flex h-15 items-center justify-around border-t border-slate-200/90 bg-white/95 px-2 backdrop-blur-xl md:hidden dark:border-white/[0.08] dark:bg-[#121418]/95"
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
                            'group flex flex-1 flex-col items-center justify-center gap-1 py-1 text-center transition-all active:scale-95',
                            item.active
                                ? 'text-blue-600 dark:text-blue-400'
                                : 'text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white',
                        )}
                    >
                        <div
                            className={cn(
                                'flex size-7 items-center justify-center rounded-xl transition-all',
                                item.active &&
                                    'bg-blue-50/80 shadow-2xs dark:bg-blue-950/40',
                            )}
                        >
                            <Icon
                                className={cn(
                                    'size-4.5 transition-transform group-hover:scale-110',
                                    item.active
                                        ? 'stroke-[2.35px] text-blue-600 dark:text-blue-400'
                                        : 'stroke-[1.8px] text-slate-500 dark:text-zinc-400',
                                )}
                            />
                        </div>
                        <span
                            className={cn(
                                'text-[10px] tracking-tight',
                                item.active
                                    ? 'font-bold text-blue-700 dark:text-blue-300'
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
                    'group flex flex-1 flex-col items-center justify-center gap-1 py-1 text-center transition-all active:scale-95',
                    openMobile
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white',
                )}
            >
                <div
                    className={cn(
                        'flex size-7 items-center justify-center rounded-xl transition-all',
                        openMobile &&
                            'bg-blue-50/80 shadow-2xs dark:bg-blue-950/40',
                    )}
                >
                    <Menu className="size-4.5 stroke-[1.8px]" />
                </div>
                <span className="text-[10px] font-medium tracking-tight">
                    Menu
                </span>
            </button>
        </nav>
    );
}
