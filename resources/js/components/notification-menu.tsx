import { Form, Link, usePage } from '@inertiajs/react';
import { Bell, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDate } from '@/lib/format';
import * as notificationRoutes from '@/routes/notifications';

export function NotificationMenu() {
    const { auth } = usePage().props;
    const notifications = auth.notifications ?? [];
    const unread = auth.unread_notifications_count ?? 0;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    className="relative flex size-7.5 items-center justify-center rounded-lg border border-black/[0.08] bg-white text-[#787774] shadow-2xs transition-colors hover:bg-black/[0.03] hover:text-[#111111] focus-visible:outline-none dark:border-white/[0.1] dark:bg-[#1c1c1e] dark:text-zinc-400 dark:hover:bg-white/[0.08] dark:hover:text-white"
                    aria-label={`Notifikasi${unread ? `, ${unread} belum dibaca` : ''}`}
                >
                    <Bell className="size-3.5" />
                    {unread > 0 && (
                        <span className="absolute top-1 right-1 flex size-1.5 rounded-full bg-rose-500" />
                    )}
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 rounded-3xl border border-black/10 bg-white/95 p-0 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-[#1c1c1e]/95">
                <div className="flex items-center justify-between border-b border-black/[0.06] px-4 py-3 dark:border-white/[0.06]">
                    <span className="text-xs font-bold tracking-tight text-[#1d1d1f] dark:text-white">
                        Notifikasi
                    </span>
                    {unread > 0 && (
                        <Form {...notificationRoutes.readAll.form()}>
                            <Button variant="ghost" size="sm" className="h-6 rounded-full px-2 text-[11px] font-medium text-[#0071e3] hover:bg-blue-50 dark:text-[#2997ff] dark:hover:bg-blue-950/40">
                                <CheckCheck className="mr-1 size-3" /> Tandai semua
                            </Button>
                        </Form>
                    )}
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-black/[0.04] p-1.5 dark:divide-white/[0.04]">
                    {notifications.length === 0 ? (
                        <div className="px-4 py-8 text-center text-xs text-[#86868b] dark:text-zinc-400">
                            Belum ada notifikasi baru.
                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <Link
                                key={notification.id}
                                href={notificationRoutes.read(notification.id)}
                                method="patch"
                                as="button"
                                className={`block w-full rounded-2xl p-3 text-left transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50 ${notification.read_at ? '' : 'bg-blue-50/40 dark:bg-blue-950/20'}`}
                            >
                                <span className="block text-xs font-semibold text-[#1d1d1f] dark:text-white">
                                    {notification.data.title ?? 'Notifikasi'}
                                </span>
                                <span className="mt-0.5 block text-[11px] text-[#86868b] line-clamp-2 dark:text-zinc-400">
                                    {notification.data.message}
                                </span>
                                <span className="mt-1 block font-mono text-[10px] text-[#86868b]/70">
                                    {formatDate(notification.created_at, true)}
                                </span>
                            </Link>
                        ))
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
