import { Form, Link, router, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    AtSign,
    Bell,
    Check,
    CheckCheck,
    CheckSquare,
    ExternalLink,
    FileCheck,
    FileText,
    Gavel,
    MessageSquare,
    Scale,
    Sparkles,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDate } from '@/lib/format';
import * as notificationRoutes from '@/routes/notifications';

interface NotificationData {
    title?: string;
    message?: string;
    category?:
        'mention' | 'task' | 'hearing' | 'document' | 'signature' | string;
    url?: string;
    matter_number?: string;
    sender_name?: string;
    sender_avatar?: string;
    sender_title?: string;
    severity?: 'critical' | 'high' | 'normal' | string;
}

interface NotificationItem {
    id: string;
    type: string;
    data: NotificationData;
    read_at: string | null;
    created_at: string;
}

type TabType = 'all' | 'unread' | 'mentions' | 'hearings_tasks';

export function NotificationMenu() {
    const { auth } = usePage().props;
    const initialNotifications = (auth.notifications ??
        []) as NotificationItem[];
    const unreadCount = auth.unread_notifications_count ?? 0;

    const [activeTab, setActiveTab] = useState<TabType>('all');
    const [localNotifications, setLocalNotifications] =
        useState<NotificationItem[]>(initialNotifications);
    const [isOpen, setIsOpen] = useState(false);

    // Keep in sync with Inertia props
    React.useEffect(() => {
        setLocalNotifications(initialNotifications);
    }, [auth.notifications]);

    // Background auto-refresh every 30s to keep notifications real-time
    React.useEffect(() => {
        const interval = setInterval(() => {
            if (document.visibilityState === 'visible') {
                router.reload({ only: ['auth'] });
            }
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    const unreadLocalCount = useMemo(() => {
        return localNotifications.filter((n) => !n.read_at).length;
    }, [localNotifications]);

    // Filter by tab
    const filteredNotifications = useMemo(() => {
        return localNotifications.filter((n) => {
            if (activeTab === 'unread') {
                return !n.read_at;
            }
            if (activeTab === 'mentions') {
                return (
                    n.data?.category === 'mention' ||
                    n.data?.title?.toLowerCase().includes('menyebut') ||
                    n.data?.message?.includes('@')
                );
            }
            if (activeTab === 'hearings_tasks') {
                return (
                    n.data?.category === 'hearing' ||
                    n.data?.category === 'task' ||
                    n.data?.title?.toLowerCase().includes('sidang') ||
                    n.data?.title?.toLowerCase().includes('tugas') ||
                    n.data?.title?.toLowerCase().includes('tenggat')
                );
            }
            return true;
        });
    }, [localNotifications, activeTab]);

    // Mark single as read & navigate
    const handleNotificationClick = (n: NotificationItem) => {
        // Optimistically mark as read
        if (!n.read_at) {
            setLocalNotifications((prev) =>
                prev.map((item) =>
                    item.id === n.id
                        ? { ...item, read_at: new Date().toISOString() }
                        : item,
                ),
            );
            router.patch(
                notificationRoutes.read.url(n.id),
                {},
                { preserveScroll: true, preserveState: true },
            );
        }

        setIsOpen(false);

        // Jump to target URL
        if (n.data?.url) {
            router.visit(n.data.url);
        }
    };

    // Mark single item as read without navigation
    const handleMarkSingleRead = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setLocalNotifications((prev) =>
            prev.map((item) =>
                item.id === id
                    ? { ...item, read_at: new Date().toISOString() }
                    : item,
            ),
        );
        router.patch(
            notificationRoutes.read.url(id),
            {},
            { preserveScroll: true, preserveState: true },
        );
    };

    // Mark all as read
    const handleMarkAllRead = () => {
        setLocalNotifications((prev) =>
            prev.map((item) => ({
                ...item,
                read_at: new Date().toISOString(),
            })),
        );
    };

    const getCategoryIcon = (n: NotificationItem) => {
        const cat = n.data?.category?.toLowerCase() || '';
        const title = n.data?.title?.toLowerCase() || '';

        if (
            cat === 'mention' ||
            title.includes('menyebut') ||
            n.data?.message?.includes('@')
        ) {
            return (
                <div className="flex size-7 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                    <AtSign className="size-3.5" />
                </div>
            );
        }

        if (
            cat === 'hearing' ||
            title.includes('sidang') ||
            title.includes('pengadilan')
        ) {
            return (
                <div className="flex size-7 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
                    <Gavel className="size-3.5" />
                </div>
            );
        }

        if (
            cat === 'task' ||
            title.includes('tugas') ||
            title.includes('ditugaskan')
        ) {
            return (
                <div className="flex size-7 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
                    <CheckSquare className="size-3.5" />
                </div>
            );
        }

        if (
            cat === 'signature' ||
            cat === 'document' ||
            title.includes('dokumen') ||
            title.includes('tanda tangan')
        ) {
            return (
                <div className="flex size-7 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                    <FileCheck className="size-3.5" />
                </div>
            );
        }

        return (
            <div className="flex size-7 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-300">
                <Bell className="size-3.5" />
            </div>
        );
    };

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    className="relative flex size-8.5 cursor-pointer items-center justify-center rounded-xl border border-slate-200/90 bg-white text-slate-600 shadow-2xs transition-all hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none active:scale-95 dark:border-white/[0.1] dark:bg-[#1c1f24] dark:text-zinc-300 dark:hover:bg-white/[0.08] dark:hover:text-white"
                    aria-label={`Notifikasi${unreadLocalCount ? `, ${unreadLocalCount} belum dibaca` : ''}`}
                >
                    <Bell className="size-4" />
                    {unreadLocalCount > 0 && (
                        <>
                            <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-rose-600 text-[9px] font-black text-white shadow-xs">
                                {unreadLocalCount > 9 ? '9+' : unreadLocalCount}
                            </span>
                            <span className="absolute -top-1 -right-1 size-4 animate-ping rounded-full bg-rose-400 opacity-60" />
                        </>
                    )}
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className="w-[420px] max-w-[calc(100vw-1.5rem)] rounded-3xl border border-slate-200/90 bg-white/95 p-0 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-[#181a20]/95"
            >
                {/* Header */}
                <div className="border-b border-slate-100 px-4 pt-3.5 pb-3 dark:border-white/[0.06]">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-black tracking-wider text-slate-900 uppercase dark:text-white">
                                Pusat Notifikasi
                            </span>
                            {unreadLocalCount > 0 && (
                                <span className="rounded-full bg-rose-50 px-2 py-0.5 font-mono text-[10px] font-bold text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                                    {unreadLocalCount} Baru
                                </span>
                            )}
                        </div>

                        {unreadLocalCount > 0 && (
                            <Form
                                {...notificationRoutes.readAll.form()}
                                onSuccess={handleMarkAllRead}
                            >
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    type="submit"
                                    className="h-7 cursor-pointer rounded-full px-2.5 text-[11px] font-bold text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/40"
                                >
                                    <CheckCheck className="mr-1 size-3.5" />{' '}
                                    Tandai Semua Dibaca
                                </Button>
                            </Form>
                        )}
                    </div>

                    {/* Filter Tabs - Single Clean Row */}
                    <div className="mt-3 grid grid-cols-4 gap-1 rounded-xl bg-slate-100/80 p-1 dark:bg-white/[0.04]">
                        <button
                            type="button"
                            onClick={() => setActiveTab('all')}
                            className={`flex items-center justify-center rounded-lg px-2 py-1.5 text-center text-[11px] font-bold whitespace-nowrap transition-all ${
                                activeTab === 'all'
                                    ? 'bg-white text-slate-900 shadow-2xs dark:bg-[#252830] dark:text-white'
                                    : 'text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white'
                            }`}
                        >
                            Semua
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('unread')}
                            className={`flex items-center justify-center gap-1 rounded-lg px-2 py-1.5 text-center text-[11px] font-bold whitespace-nowrap transition-all ${
                                activeTab === 'unread'
                                    ? 'bg-white text-slate-900 shadow-2xs dark:bg-[#252830] dark:text-white'
                                    : 'text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white'
                            }`}
                        >
                            <span>Belum Dibaca</span>
                            {unreadLocalCount > 0 && (
                                <span className="py-0.2 rounded-full bg-rose-100 px-1 text-[9.5px] font-extrabold text-rose-700 dark:bg-rose-950/80 dark:text-rose-300">
                                    {unreadLocalCount}
                                </span>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('mentions')}
                            className={`flex items-center justify-center rounded-lg px-2 py-1.5 text-center text-[11px] font-bold whitespace-nowrap transition-all ${
                                activeTab === 'mentions'
                                    ? 'bg-white text-slate-900 shadow-2xs dark:bg-[#252830] dark:text-white'
                                    : 'text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white'
                            }`}
                        >
                            Mentions
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('hearings_tasks')}
                            className={`flex items-center justify-center rounded-lg px-2 py-1.5 text-center text-[11px] font-bold whitespace-nowrap transition-all ${
                                activeTab === 'hearings_tasks'
                                    ? 'bg-white text-slate-900 shadow-2xs dark:bg-[#252830] dark:text-white'
                                    : 'text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white'
                            }`}
                        >
                            Sidang & Tugas
                        </button>
                    </div>
                </div>

                {/* Notifications List */}
                <div className="max-h-[380px] divide-y divide-slate-100 overflow-y-auto p-1.5 dark:divide-white/[0.04]">
                    {filteredNotifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 text-center">
                            <div className="flex size-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-white/[0.04] dark:text-zinc-500">
                                <Bell className="size-4.5" />
                            </div>
                            <h4 className="mt-2.5 text-xs font-bold text-slate-800 dark:text-zinc-200">
                                Tidak ada notifikasi
                            </h4>
                            <p className="mt-0.5 text-[11px] text-slate-400 dark:text-zinc-500">
                                {activeTab === 'unread'
                                    ? 'Semua notifikasi telah Anda baca.'
                                    : 'Belum ada aktivitas baru di workspace.'}
                            </p>
                        </div>
                    ) : (
                        filteredNotifications.map((notification) => {
                            const isUnread = !notification.read_at;
                            return (
                                <div
                                    key={notification.id}
                                    onClick={() =>
                                        handleNotificationClick(notification)
                                    }
                                    className={`group relative flex cursor-pointer items-start gap-3 rounded-2xl p-3 transition-all hover:bg-slate-50 dark:hover:bg-white/[0.04] ${
                                        isUnread
                                            ? 'bg-blue-50/50 dark:bg-blue-950/20'
                                            : ''
                                    }`}
                                >
                                    {/* Icon / Sender Avatar */}
                                    {notification.data?.sender_avatar &&
                                    notification.data.sender_avatar !==
                                        '/images/default-avatar.svg' ? (
                                        <Avatar className="size-7.5 shrink-0 rounded-xl border border-slate-200 shadow-2xs dark:border-white/10">
                                            <AvatarImage
                                                src={
                                                    notification.data
                                                        .sender_avatar
                                                }
                                            />
                                            <AvatarFallback className="text-[10px] font-bold">
                                                {notification.data
                                                    .sender_name?.[0] ?? 'U'}
                                            </AvatarFallback>
                                        </Avatar>
                                    ) : (
                                        getCategoryIcon(notification)
                                    )}

                                    {/* Content */}
                                    <div className="min-w-0 flex-1 space-y-1">
                                        <div className="flex items-center justify-between gap-1">
                                            <span className="truncate text-xs font-bold text-slate-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                                                {notification.data?.title ??
                                                    'Pemberitahuan Sistem'}
                                            </span>
                                            {isUnread && (
                                                <span className="size-2 shrink-0 rounded-full bg-blue-600 dark:bg-blue-400" />
                                            )}
                                        </div>

                                        <p className="line-clamp-2 text-[11.5px] leading-snug text-slate-600 dark:text-zinc-300">
                                            {notification.data?.message}
                                        </p>

                                        <div className="flex items-center justify-between gap-2 pt-0.5">
                                            <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-400 dark:text-zinc-500">
                                                <span>
                                                    {formatDate(
                                                        notification.created_at,
                                                        true,
                                                    )}
                                                </span>
                                                {notification.data
                                                    ?.matter_number && (
                                                    <>
                                                        <span>•</span>
                                                        <span className="py-0.2 rounded bg-slate-100 px-1 font-semibold text-slate-600 dark:bg-white/[0.06] dark:text-zinc-300">
                                                            {
                                                                notification
                                                                    .data
                                                                    .matter_number
                                                            }
                                                        </span>
                                                    </>
                                                )}
                                            </div>

                                            {/* Quick Mark Read Button */}
                                            {isUnread && (
                                                <button
                                                    type="button"
                                                    onClick={(e) =>
                                                        handleMarkSingleRead(
                                                            e,
                                                            notification.id,
                                                        )
                                                    }
                                                    className="flex items-center gap-0.5 text-[10px] font-bold text-slate-400 opacity-0 transition-opacity group-hover:opacity-100 hover:text-blue-600 dark:hover:text-blue-400"
                                                    title="Tandai sudah dibaca"
                                                >
                                                    <Check className="size-3" />
                                                    <span>Dibaca</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
