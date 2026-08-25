import { Form, Head, Link, router } from '@inertiajs/react';
import {
    Check,
    CheckCheck,
    Clock,
    CornerDownLeft,
    MessageSquare,
    Search,
    Send,
    User,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { EmptyState } from '@/components/empty-state';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatDate } from '@/lib/format';
import { cn } from '@/lib/utils';
import * as chatRoutes from '@/routes/chat';

type Contact = {
    id: number;
    name: string;
    email: string;
    avatar_url?: string | null;
    title: string;
    is_online?: boolean;
    status_text?: string;
    last_seen_at?: string | null;
    last_message?: {
        id: string;
        message: string;
        is_outgoing: boolean;
        created_at: string;
    } | null;
    unread_count: number;
};

function getRealPresence(contact: {
    is_online?: boolean;
    status_text?: string;
    last_seen_at?: string | null;
}): {
    isOnline: boolean;
    statusText: string;
} {
    if (contact.last_seen_at) {
        const diffSeconds = Math.floor(
            (Date.now() - new Date(contact.last_seen_at).getTime()) / 1000,
        );

        if (diffSeconds < 0 || diffSeconds <= 120) {
            return { isOnline: true, statusText: 'Aktif sekarang' };
        }

        const diffMinutes = Math.floor(diffSeconds / 60);
        if (diffMinutes < 60) {
            return {
                isOnline: false,
                statusText: `Aktif ${diffMinutes} menit lalu`,
            };
        }

        const diffHours = Math.floor(diffMinutes / 60);
        if (diffHours < 24) {
            return {
                isOnline: false,
                statusText: `Aktif ${diffHours} jam lalu`,
            };
        }

        const diffDays = Math.floor(diffHours / 24);
        if (diffDays === 1) {
            const timeStr = new Intl.DateTimeFormat('id-ID', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
                timeZone: 'Asia/Jakarta',
            }).format(new Date(contact.last_seen_at));
            return {
                isOnline: false,
                statusText: `Aktif kemarin pukul ${timeStr} WIB`,
            };
        }

        if (diffDays < 7) {
            return {
                isOnline: false,
                statusText: `Aktif ${diffDays} hari lalu`,
            };
        }

        const dateStr = new Intl.DateTimeFormat('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            timeZone: 'Asia/Jakarta',
        }).format(new Date(contact.last_seen_at));

        return { isOnline: false, statusText: `Aktif ${dateStr}` };
    }

    return {
        isOnline: contact.is_online ?? false,
        statusText: contact.status_text || 'Offline',
    };
}

type Message = {
    id: string;
    sender_id: number;
    recipient_id: number;
    message: string;
    is_outgoing: boolean;
    read_at?: string | null;
    created_at: string;
};

export default function ChatIndex({
    contacts,
    activeContact,
    messages,
    totalUnread,
}: {
    contacts: Contact[];
    activeContact?: Contact | null;
    messages: Message[];
    totalUnread: number;
}) {
    const [searchQuery, setSearchQuery] = useState('');
    const [messageInput, setMessageInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto scroll to bottom when messages update
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const filteredContacts = contacts.filter(
        (c) =>
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!messageInput.trim() || !activeContact) return;

        router.post(
            chatRoutes.store.url(),
            {
                recipient_id: activeContact.id,
                message: messageInput.trim(),
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setMessageInput('');
                },
            },
        );
    };

    return (
        <>
            <Head title="Pesan Langsung & Chat Advokat - RPK Workspace" />

            <div className="min-h-screen bg-[#fafafc] pb-20 dark:bg-[#0c0d10]">
                <main className="mx-auto max-w-7xl space-y-5 px-4 py-5 sm:px-6 lg:px-8">
                    {/* 1. Header Navigation & Action Bar */}
                    <div className="flex flex-col justify-between gap-4 border-b border-slate-200/60 pb-5 sm:flex-row sm:items-center dark:border-white/[0.06]">
                        <div className="space-y-1">
                            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                                Pesan Langsung
                            </h1>
                            <p className="text-xs text-slate-500 dark:text-zinc-400">
                                Komunikasi pesan privat instan dan koordinasi
                                kerja langsung antar advokat dan staf internal
                                RPK Law Firm.
                            </p>
                        </div>
                    </div>

                    {/* 2. Dual Column Instagram-Style Chat Box */}
                    <div className="flex h-[660px] flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xs md:flex-row dark:border-white/[0.08] dark:bg-[#14161b]">
                        {/* Left Column: Contact & Message Thread List */}
                        <div className="flex w-full flex-col border-b border-slate-100 bg-slate-50/40 md:w-80 md:border-r md:border-b-0 dark:border-white/[0.06] dark:bg-[#121418]">
                            {/* Search Contacts */}
                            <div className="border-b border-slate-100 p-3 dark:border-white/[0.06]">
                                <div className="relative">
                                    <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-slate-400" />
                                    <Input
                                        type="text"
                                        placeholder="Cari rekan advokat..."
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        className="h-8 rounded-lg border-slate-200/80 bg-white pl-8 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 dark:border-white/10 dark:bg-zinc-800 dark:text-white"
                                    />
                                </div>
                            </div>

                            {/* Contact Roster */}
                            <div className="flex-1 divide-y divide-slate-100 overflow-y-auto dark:divide-white/[0.04]">
                                {filteredContacts.length === 0 ? (
                                    <div className="p-6 text-center text-xs text-slate-400 dark:text-zinc-500">
                                        Tidak ada rekan ditemukan.
                                    </div>
                                ) : (
                                    filteredContacts.map((contact) => {
                                        const isActive =
                                            activeContact?.id === contact.id;
                                        const presence =
                                            getRealPresence(contact);

                                        return (
                                            <Link
                                                key={contact.id}
                                                href={chatRoutes.index.url({
                                                    query: { user: contact.id },
                                                })}
                                                className={cn(
                                                    'flex items-center gap-3 p-3 text-left transition-colors',
                                                    isActive
                                                        ? 'bg-blue-50/80 dark:bg-white/[0.06]'
                                                        : 'hover:bg-slate-100/70 dark:hover:bg-white/[0.02]',
                                                )}
                                            >
                                                {/* Avatar & Online Dot */}
                                                <div className="relative shrink-0">
                                                    <div className="flex size-9 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-700 dark:bg-zinc-700 dark:text-zinc-200">
                                                        {contact.avatar_url ? (
                                                            <img
                                                                src={
                                                                    contact.avatar_url
                                                                }
                                                                alt={
                                                                    contact.name
                                                                }
                                                                className="size-full rounded-full object-cover"
                                                            />
                                                        ) : (
                                                            contact.name
                                                                .split(' ')
                                                                .map(
                                                                    (n) => n[0],
                                                                )
                                                                .slice(0, 2)
                                                                .join('')
                                                        )}
                                                    </div>
                                                    <span
                                                        className={cn(
                                                            'absolute right-0 bottom-0 size-2.5 rounded-full border-2 border-white dark:border-[#14161b]',
                                                            presence.isOnline
                                                                ? 'bg-emerald-500'
                                                                : 'bg-slate-300 dark:bg-zinc-600',
                                                        )}
                                                        title={
                                                            presence.statusText
                                                        }
                                                    />
                                                </div>

                                                {/* Text Snippet */}
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center justify-between gap-1">
                                                        <span
                                                            className={cn(
                                                                'truncate text-xs font-semibold',
                                                                isActive
                                                                    ? 'text-blue-900 dark:text-white'
                                                                    : 'text-slate-900 dark:text-zinc-200',
                                                            )}
                                                        >
                                                            {contact.name}
                                                        </span>
                                                        {contact.last_message ? (
                                                            <span className="shrink-0 text-[10px] text-slate-400 dark:text-zinc-500">
                                                                {formatDate(
                                                                    contact
                                                                        .last_message
                                                                        .created_at,
                                                                    true,
                                                                ).split(
                                                                    ' ',
                                                                )[1] || ''}
                                                            </span>
                                                        ) : (
                                                            <span
                                                                className={cn(
                                                                    'shrink-0 text-[9.5px]',
                                                                    presence.isOnline
                                                                        ? 'font-medium text-emerald-600 dark:text-emerald-400'
                                                                        : 'text-slate-400 dark:text-zinc-500',
                                                                )}
                                                            >
                                                                {
                                                                    presence.statusText
                                                                }
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="mt-0.5 flex items-center justify-between gap-1">
                                                        <p className="truncate text-[11px] text-slate-500 dark:text-zinc-400">
                                                            {contact.last_message ? (
                                                                <span>
                                                                    {contact
                                                                        .last_message
                                                                        .is_outgoing &&
                                                                        'Anda: '}
                                                                    {
                                                                        contact
                                                                            .last_message
                                                                            .message
                                                                    }
                                                                </span>
                                                            ) : (
                                                                <span className="text-slate-400 italic">
                                                                    {
                                                                        contact.title
                                                                    }
                                                                </span>
                                                            )}
                                                        </p>

                                                        {contact.unread_count >
                                                            0 && (
                                                            <span className="flex size-4.5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white shadow-2xs">
                                                                {
                                                                    contact.unread_count
                                                                }
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                        {/* Right Column: Chat Conversation Stream */}
                        <div className="flex flex-1 flex-col bg-white dark:bg-[#14161b]">
                            {activeContact ? (
                                <>
                                    {/* Top Chat Header */}
                                    {(() => {
                                        const activePresence =
                                            getRealPresence(activeContact);
                                        return (
                                            <div className="flex h-14 items-center justify-between border-b border-slate-100 px-5 dark:border-white/[0.06]">
                                                <div className="flex items-center gap-3">
                                                    <div className="relative">
                                                        <div className="flex size-8 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-700 dark:bg-zinc-700 dark:text-zinc-200">
                                                            {activeContact.avatar_url ? (
                                                                <img
                                                                    src={
                                                                        activeContact.avatar_url
                                                                    }
                                                                    alt={
                                                                        activeContact.name
                                                                    }
                                                                    className="size-full rounded-full object-cover"
                                                                />
                                                            ) : (
                                                                activeContact.name
                                                                    .split(' ')
                                                                    .map(
                                                                        (n) =>
                                                                            n[0],
                                                                    )
                                                                    .slice(0, 2)
                                                                    .join('')
                                                            )}
                                                        </div>
                                                        <span
                                                            className={cn(
                                                                'absolute right-0 bottom-0 size-2 rounded-full border-2 border-white dark:border-[#14161b]',
                                                                activePresence.isOnline
                                                                    ? 'bg-emerald-500'
                                                                    : 'bg-slate-300 dark:bg-zinc-600',
                                                            )}
                                                        />
                                                    </div>
                                                    <div>
                                                        <h2 className="text-xs font-bold text-slate-900 dark:text-white">
                                                            {activeContact.name}
                                                        </h2>
                                                        <p className="text-[10px] text-slate-500 dark:text-zinc-400">
                                                            {
                                                                activeContact.title
                                                            }{' '}
                                                            &middot;{' '}
                                                            <span
                                                                className={cn(
                                                                    'font-semibold',
                                                                    activePresence.isOnline
                                                                        ? 'text-emerald-600 dark:text-emerald-400'
                                                                        : 'text-slate-400 dark:text-zinc-500',
                                                                )}
                                                            >
                                                                {
                                                                    activePresence.statusText
                                                                }
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })()}

                                    {/* Message Stream */}
                                    <div className="flex-1 space-y-3 overflow-y-auto p-4 sm:p-5">
                                        {messages.length === 0 ? (
                                            <div className="flex h-full flex-col items-center justify-center text-center">
                                                <div className="flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-zinc-800">
                                                    <MessageSquare className="size-6" />
                                                </div>
                                                <h3 className="mt-3 text-xs font-bold text-slate-900 dark:text-white">
                                                    Mulai Percakapan
                                                </h3>
                                                <p className="mt-1 max-w-xs text-[11px] text-slate-500 dark:text-zinc-400">
                                                    Kirim pesan langsung ke{' '}
                                                    <strong className="text-slate-900 dark:text-white">
                                                        {activeContact.name}
                                                    </strong>{' '}
                                                    untuk koordinasi perkara dan
                                                    tugas internal.
                                                </p>
                                            </div>
                                        ) : (
                                            messages.map((msg) => (
                                                <div
                                                    key={msg.id}
                                                    className={cn(
                                                        'flex flex-col',
                                                        msg.is_outgoing
                                                            ? 'items-end'
                                                            : 'items-start',
                                                    )}
                                                >
                                                    <div
                                                        className={cn(
                                                            'max-w-md rounded-2xl p-3 text-xs leading-relaxed shadow-2xs',
                                                            msg.is_outgoing
                                                                ? 'rounded-tr-xs bg-slate-900 text-white dark:bg-blue-600'
                                                                : 'rounded-tl-xs bg-slate-100 text-slate-900 dark:bg-white/[0.06] dark:text-zinc-100',
                                                        )}
                                                    >
                                                        {msg.message}
                                                    </div>

                                                    {/* Timestamp & Status Check */}
                                                    <div className="mt-1 flex items-center gap-1 px-1 text-[9.5px] text-slate-400 dark:text-zinc-500">
                                                        <span>
                                                            {formatDate(
                                                                msg.created_at,
                                                                true,
                                                            ).split(' ')[1] ||
                                                                ''}
                                                        </span>
                                                        {msg.is_outgoing && (
                                                            <span>
                                                                {msg.read_at ? (
                                                                    <CheckCheck className="size-3 text-blue-500 dark:text-blue-300" />
                                                                ) : (
                                                                    <Check className="size-3 text-slate-400" />
                                                                )}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                        <div ref={messagesEndRef} />
                                    </div>

                                    {/* Bottom Message Input Bar */}
                                    <form
                                        onSubmit={handleSendMessage}
                                        className="border-t border-slate-100 bg-slate-50/50 p-3 dark:border-white/[0.06] dark:bg-[#121418]"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Input
                                                type="text"
                                                autoFocus
                                                value={messageInput}
                                                onChange={(e) =>
                                                    setMessageInput(
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder={`Tulis pesan ke ${activeContact.name.split(' ')[0]}...`}
                                                className="h-9 flex-1 rounded-lg border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 dark:border-white/10 dark:bg-zinc-800 dark:text-white"
                                            />
                                            <Button
                                                type="submit"
                                                size="sm"
                                                disabled={!messageInput.trim()}
                                                className="h-9 rounded-lg bg-slate-900 px-4 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 active:scale-95 disabled:opacity-50 dark:bg-white dark:text-slate-900"
                                            >
                                                <Send className="mr-1.5 size-3.5" />
                                                Kirim
                                            </Button>
                                        </div>
                                        <div className="mt-1.5 px-1 text-[10px] text-slate-400 dark:text-zinc-500">
                                            Tekan{' '}
                                            <kbd className="py-0.2 rounded border border-slate-200 px-1 font-mono text-[9px] dark:border-white/10">
                                                Enter
                                            </kbd>{' '}
                                            untuk mengirim pesan instan.
                                        </div>
                                    </form>
                                </>
                            ) : (
                                <div className="flex h-full items-center justify-center p-8 text-center">
                                    <EmptyState
                                        title="Pilih Rekan Advokat"
                                        description="Pilih salah satu kontak di sisi kiri untuk membuka riwayat pesan."
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}

ChatIndex.layout = {
    breadcrumbs: [{ title: 'Pesan Langsung', href: chatRoutes.index() }],
};
