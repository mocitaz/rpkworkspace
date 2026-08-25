import {
    ArrowLeft,
    Check,
    CheckCheck,
    CornerUpLeft,
    MessageSquare,
    Search,
    Send,
    Smile,
    X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    formatChatDate,
    formatChatTime,
    formatContactListTime,
    formatDate,
} from '@/lib/format';
import { cn } from '@/lib/utils';

type Reaction = {
    reaction: string;
    count: number;
    user_reacted: boolean;
};

type ReplyQuote = {
    id: string;
    sender_name: string;
    message: string;
};

type Contact = {
    id: number;
    name: string;
    email: string;
    avatar_url?: string | null;
    title: string;
    is_online: boolean;
    status_text: string;
    last_seen_at?: string | null;
    last_message?: {
        id: string;
        message: string;
        is_outgoing: boolean;
        created_at: string;
    } | null;
    unread_count: number;
};

type Message = {
    id: string;
    sender_id: number;
    recipient_id: number;
    message: string;
    reply_to?: ReplyQuote | null;
    reactions?: Reaction[];
    is_outgoing: boolean;
    read_at?: string | null;
    created_at: string;
};

const EMOJI_OPTIONS = ['❤️', '👍', '😂', '😮', '😢', '🙏', '🔥'] as const;

function getRealPresence(contact: { is_online: boolean; status_text: string; last_seen_at?: string | null }): {
    isOnline: boolean;
    statusText: string;
} {
    if (contact.last_seen_at) {
        const diffSeconds = Math.floor((Date.now() - new Date(contact.last_seen_at).getTime()) / 1000);

        if (diffSeconds < 0 || diffSeconds <= 120) {
            return { isOnline: true, statusText: 'Aktif sekarang' };
        }

        const diffMinutes = Math.floor(diffSeconds / 60);
        if (diffMinutes < 60) {
            return { isOnline: false, statusText: `Aktif ${diffMinutes} menit lalu` };
        }

        const diffHours = Math.floor(diffMinutes / 60);
        if (diffHours < 24) {
            return { isOnline: false, statusText: `Aktif ${diffHours} jam lalu` };
        }

        const diffDays = Math.floor(diffHours / 24);
        if (diffDays === 1) {
            const timeStr = new Intl.DateTimeFormat('id-ID', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
                timeZone: 'Asia/Jakarta',
            }).format(new Date(contact.last_seen_at));
            return { isOnline: false, statusText: `Aktif kemarin pukul ${timeStr} WIB` };
        }

        if (diffDays < 7) {
            return { isOnline: false, statusText: `Aktif ${diffDays} hari lalu` };
        }

        const dateStr = new Intl.DateTimeFormat('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            timeZone: 'Asia/Jakarta',
        }).format(new Date(contact.last_seen_at));

        return { isOnline: false, statusText: `Aktif ${dateStr}` };
    }

    return { isOnline: contact.is_online, statusText: contact.status_text || 'Offline' };
}

export function FloatingChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [activeContact, setActiveContact] = useState<Contact | null>(null);
    const activeContactRef = useRef<Contact | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [inputText, setInputText] = useState('');
    const [replyingTo, setReplyingTo] = useState<Message | null>(null);
    const [activeReactionMenu, setActiveReactionMenu] = useState<string | null>(null);
    const [totalUnread, setTotalUnread] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Keep activeContactRef synced
    useEffect(() => {
        activeContactRef.current = activeContact;
    }, [activeContact]);

    // 1. Fetch contacts list
    const fetchContacts = async () => {
        try {
            const res = await fetch('/api/chat/contacts', {
                headers: {
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });
            if (res.ok) {
                const data = await res.json();
                setContacts(data.contacts || []);
                setTotalUnread(data.total_unread || 0);

                // Update active contact presence ONLY if currently viewing
                if (activeContactRef.current) {
                    const currentId = activeContactRef.current.id;
                    const updatedActive = data.contacts?.find(
                        (c: Contact) => c.id === currentId,
                    );
                    if (updatedActive) {
                        setActiveContact((prev) =>
                            prev && prev.id === currentId ? updatedActive : prev,
                        );
                    }
                }
            }
        } catch {
            // Ignore error
        }
    };

    // 2. Fetch conversation with active contact
    const fetchMessages = async (userId: number) => {
        try {
            const res = await fetch(`/api/chat/messages/${userId}`, {
                headers: {
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });
            if (res.ok) {
                // If user navigated away or back to contact list, discard
                if (activeContactRef.current?.id !== userId) return;

                const data = await res.json();
                if (activeContactRef.current?.id !== userId) return;

                setMessages(data.messages || []);
                if (data.contact) {
                    setActiveContact((prev) =>
                        prev && prev.id === userId ? { ...prev, ...data.contact } : prev,
                    );
                }
                // Reset unread count locally
                setContacts((prev) =>
                    prev.map((c) =>
                        c.id === userId ? { ...c, unread_count: 0 } : c,
                    ),
                );
            }
        } catch {
            // Ignore error
        }
    };

    // Initial and periodic polling for unread messages, blue checkmarks, and presence
    useEffect(() => {
        fetchContacts();
        const pollRate = isOpen ? (activeContact ? 3000 : 5000) : 10000;
        const interval = setInterval(() => {
            fetchContacts();
            if (activeContactRef.current && isOpen) {
                fetchMessages(activeContactRef.current.id);
            }
        }, pollRate);
        return () => clearInterval(interval);
    }, [activeContact, isOpen]);

    // Immediate fresh fetch and relative presence ticker when popup opens
    useEffect(() => {
        if (isOpen) {
            fetchContacts();
            if (activeContactRef.current) {
                fetchMessages(activeContactRef.current.id);
            }
        }
    }, [isOpen]);

    // Periodic local re-render ticker to update "Aktif X menit lalu" live without lag
    useEffect(() => {
        if (!isOpen) return;
        const ticker = setInterval(() => {
            setContacts((prev) => [...prev]);
        }, 15000);
        return () => clearInterval(ticker);
    }, [isOpen]);

    // Select a contact to chat with
    const handleSelectContact = (contact: Contact) => {
        setActiveContact(contact);
        activeContactRef.current = contact;
        setReplyingTo(null);
        setActiveReactionMenu(null);
        setIsLoading(true);
        fetchMessages(contact.id).finally(() => setIsLoading(false));
    };

    // Back to contact list
    const handleBack = () => {
        setActiveContact(null);
        activeContactRef.current = null;
        setMessages([]);
        setReplyingTo(null);
        setActiveReactionMenu(null);
        fetchContacts();
    };

    // Auto-scroll on new messages
    useEffect(() => {
        if (activeContact) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, activeContact]);

    // Focus input when replying
    useEffect(() => {
        if (replyingTo) {
            inputRef.current?.focus();
        }
    }, [replyingTo]);

    // Send direct message with reply
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim() || !activeContact || isSending) return;

        const textToSend = inputText.trim();
        const replyMessageId = replyingTo?.id;

        setInputText('');
        setReplyingTo(null);
        setActiveReactionMenu(null);
        setIsSending(true);

        // Optimistic UI update
        const tempId = `temp-${Date.now()}`;
        const optimisticMsg: Message = {
            id: tempId,
            sender_id: 0,
            recipient_id: activeContact.id,
            message: textToSend,
            reply_to: replyingTo
                ? {
                      id: replyingTo.id,
                      sender_name: replyingTo.is_outgoing
                          ? 'Anda'
                          : activeContact.name,
                      message: replyingTo.message,
                  }
                : null,
            reactions: [],
            is_outgoing: true,
            created_at: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, optimisticMsg]);

        try {
            const res = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN':
                        (
                            document.querySelector(
                                'meta[name="csrf-token"]',
                            ) as HTMLMetaElement
                        )?.content || '',
                },
                body: JSON.stringify({
                    recipient_id: activeContact.id,
                    message: textToSend,
                    reply_to_id: replyMessageId,
                }),
            });

            if (res.ok) {
                fetchMessages(activeContact.id);
            }
        } catch {
            // Error handling
        } finally {
            setIsSending(false);
        }
    };

    // Toggle emoji reaction on a message
    const handleToggleReaction = async (messageId: string, emoji: string) => {
        setActiveReactionMenu(null);

        // Optimistic update
        setMessages((prev) =>
            prev.map((msg) => {
                if (msg.id !== messageId) return msg;

                const currentReactions = msg.reactions || [];
                const existing = currentReactions.find(
                    (r) => r.reaction === emoji,
                );

                let updatedReactions: Reaction[];
                if (existing) {
                    if (existing.user_reacted) {
                        // User removing reaction
                        if (existing.count <= 1) {
                            updatedReactions = currentReactions.filter(
                                (r) => r.reaction !== emoji,
                            );
                        } else {
                            updatedReactions = currentReactions.map((r) =>
                                r.reaction === emoji
                                    ? {
                                          ...r,
                                          count: r.count - 1,
                                          user_reacted: false,
                                      }
                                    : r,
                            );
                        }
                    } else {
                        // User adding reaction
                        updatedReactions = currentReactions.map((r) =>
                            r.reaction === emoji
                                ? {
                                      ...r,
                                      count: r.count + 1,
                                      user_reacted: true,
                                  }
                                : r,
                        );
                    }
                } else {
                    // New reaction added
                    updatedReactions = [
                        ...currentReactions,
                        {
                            reaction: emoji,
                            count: 1,
                            user_reacted: true,
                        },
                    ];
                }

                return { ...msg, reactions: updatedReactions };
            }),
        );

        try {
            const res = await fetch(`/api/chat/messages/${messageId}/reaction`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN':
                        (
                            document.querySelector(
                                'meta[name="csrf-token"]',
                            ) as HTMLMetaElement
                        )?.content || '',
                },
                body: JSON.stringify({ reaction: emoji }),
            });

            if (res.ok) {
                const data = await res.json();
                setMessages((prev) =>
                    prev.map((msg) =>
                        msg.id === messageId
                            ? { ...msg, reactions: data.reactions }
                            : msg,
                    ),
                );
            }
        } catch {
            // Ignore error
        }
    };

    const filteredContacts = contacts.filter(
        (c) =>
            (c.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (c.title || '').toLowerCase().includes(searchQuery.toLowerCase()),
    );

    return (
        <div className="fixed right-3.5 bottom-17 sm:right-5 sm:bottom-5 z-40 flex flex-col items-end">
            {/* Pop-up Modal Window */}
            {isOpen && (
                <div className="mb-2.5 flex h-[calc(100svh-8.5rem)] max-h-[520px] w-[calc(100vw-1.75rem)] max-w-[380px] flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xl transition-all sm:h-[510px] sm:w-[390px] dark:border-white/10 dark:bg-[#14161b]">
                    {/* View A: Contact List */}
                    {!activeContact ? (
                        <div className="flex h-full flex-col">
                            {/* Header */}
                            <div className="flex h-13 items-center justify-between border-b border-slate-100 bg-slate-50/60 px-4 dark:border-white/[0.06] dark:bg-[#121418]">
                                <div className="flex items-center gap-2">
                                    <MessageSquare className="size-4 text-blue-600 dark:text-blue-400" />
                                    <h2 className="text-xs font-bold text-slate-900 dark:text-white">
                                        Pesan Langsung
                                    </h2>
                                    {totalUnread > 0 && (
                                        <span className="rounded-full bg-blue-600 px-1.5 py-0.2 font-mono text-[9px] font-bold text-white">
                                            {totalUnread}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        onClick={() => setIsOpen(false)}
                                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 dark:hover:bg-white/[0.06] dark:hover:text-white"
                                    >
                                        <X className="size-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Search Input */}
                            <div className="border-b border-slate-100 p-2.5 dark:border-white/[0.06]">
                                <div className="relative">
                                    <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-slate-400" />
                                    <Input
                                        type="text"
                                        placeholder="Cari nama advokat..."
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        className="h-7.5 rounded-lg border-slate-200/80 bg-white pl-8 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 dark:border-white/10 dark:bg-zinc-800 dark:text-white"
                                    />
                                </div>
                            </div>

                            {/* Contact List */}
                            <div className="flex-1 divide-y divide-slate-100 overflow-y-auto dark:divide-white/[0.04]">
                                {filteredContacts.length === 0 ? (
                                    <div className="p-8 text-center text-xs text-slate-400 dark:text-zinc-500">
                                        Tidak ada rekan advokat ditemukan.
                                    </div>
                                ) : (
                                    filteredContacts.map((contact) => {
                                        const presence = getRealPresence(contact);

                                        return (
                                            <button
                                                key={contact.id}
                                                type="button"
                                                onClick={() =>
                                                    handleSelectContact(contact)
                                                }
                                                className="flex w-full items-center gap-3 p-3 text-left transition-colors hover:bg-slate-50 dark:hover:bg-white/[0.02]"
                                            >
                                                {/* Avatar & Accurate Presence Dot */}
                                                <div className="relative shrink-0">
                                                    <div className="flex size-8.5 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-700 dark:bg-zinc-700 dark:text-zinc-200">
                                                        {contact.avatar_url ? (
                                                            <img
                                                                src={
                                                                    contact.avatar_url
                                                                }
                                                                alt={contact.name}
                                                                className="size-full rounded-full object-cover"
                                                            />
                                                        ) : (
                                                            contact.name
                                                                .split(' ')
                                                                .map((n) => n[0])
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
                                                        title={presence.statusText}
                                                    />
                                                </div>

                                                {/* Info */}
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center justify-between gap-1">
                                                        <span className="truncate text-xs font-semibold text-slate-900 dark:text-white">
                                                            {contact.name}
                                                        </span>
                                                        {contact.last_message ? (
                                                            <span className="shrink-0 text-[9.5px] text-slate-400 dark:text-zinc-500">
                                                                {formatContactListTime(
                                                                    contact
                                                                        .last_message
                                                                        .created_at,
                                                                )}
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
                                                                {presence.statusText}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="mt-0.5 flex items-center justify-between gap-1">
                                                        <p className="truncate text-[10.5px] text-slate-500 dark:text-zinc-400">
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
                                                                <span className="italic text-slate-400">
                                                                    {contact.title}
                                                                </span>
                                                            )}
                                                        </p>
                                                        {contact.unread_count >
                                                            0 && (
                                                            <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[9.5px] font-bold text-white">
                                                                {
                                                                    contact.unread_count
                                                                }
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    ) : (
                        /* View B: Active Chat Conversation */
                        <div className="flex h-full flex-col">
                            {/* Active Chat Header */}
                            {(() => {
                                const activePresence = getRealPresence(activeContact);
                                return (
                                    <div className="flex h-13 items-center justify-between border-b border-slate-100 bg-slate-50/60 px-3 dark:border-white/[0.06] dark:bg-[#121418]">
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={handleBack}
                                                className="rounded-lg p-1 text-slate-500 hover:bg-slate-200/60 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-white/[0.06] dark:hover:text-white"
                                            >
                                                <ArrowLeft className="size-4" />
                                            </button>
                                            <div className="relative shrink-0">
                                                <div className="flex size-7.5 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-700 dark:bg-zinc-700 dark:text-zinc-200">
                                                    {activeContact.avatar_url ? (
                                                        <img
                                                            src={
                                                                activeContact.avatar_url
                                                            }
                                                            alt={activeContact.name}
                                                            className="size-full rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        activeContact.name
                                                            .split(' ')
                                                            .map((n) => n[0])
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
                                            <div className="min-w-0">
                                                <h3 className="truncate text-xs font-bold text-slate-900 dark:text-white">
                                                    {activeContact.name}
                                                </h3>
                                                <p
                                                    className={cn(
                                                        'text-[9.5px]',
                                                        activePresence.isOnline
                                                            ? 'font-medium text-emerald-600 dark:text-emerald-400'
                                                            : 'text-slate-400 dark:text-zinc-500',
                                                    )}
                                                >
                                                    {activePresence.statusText}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button
                                                type="button"
                                                onClick={() => setIsOpen(false)}
                                                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 dark:hover:bg-white/[0.06] dark:hover:text-white"
                                            >
                                                <X className="size-4" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })()}

                            {/* Message Feed with Date Grouping */}
                            <div className="flex-1 space-y-3.5 overflow-y-auto p-3.5">
                                {messages.length === 0 ? (
                                    <div className="flex h-full flex-col items-center justify-center text-center">
                                        <MessageSquare className="size-6 text-slate-300 dark:text-zinc-600" />
                                        <p className="mt-2 text-xs font-semibold text-slate-700 dark:text-zinc-300">
                                            Mulai percakapan langsung
                                        </p>
                                        <p className="text-[10.5px] text-slate-400">
                                            Kirim pesan pertama ke{' '}
                                            {activeContact.name.split(' ')[0]}
                                        </p>
                                    </div>
                                ) : (
                                    messages.map((msg, index) => {
                                        // Check if date divider is needed
                                        const prevMsg = messages[index - 1];
                                        const currentDateStr = new Date(
                                            msg.created_at,
                                        ).toDateString();
                                        const prevDateStr = prevMsg
                                            ? new Date(
                                                  prevMsg.created_at,
                                              ).toDateString()
                                            : null;
                                        const showDateDivider =
                                            currentDateStr !== prevDateStr;

                                        return (
                                            <div
                                                key={msg.id}
                                                className="space-y-3.5"
                                            >
                                                {/* Date Separator Pill */}
                                                {showDateDivider && (
                                                    <div className="my-2.5 flex items-center justify-center">
                                                        <span className="rounded-full border border-slate-200/80 bg-slate-100/90 px-2.5 py-0.5 text-[9.5px] font-semibold text-slate-600 shadow-2xs dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-300">
                                                            {formatChatDate(
                                                                msg.created_at,
                                                            )}
                                                        </span>
                                                    </div>
                                                )}

                                                {/* Message Row */}
                                                <div
                                                    className={cn(
                                                        'group flex flex-col',
                                                        msg.is_outgoing
                                                            ? 'items-end'
                                                            : 'items-start',
                                                    )}
                                                >
                                                    {/* Bubble + Action Buttons Row */}
                                                    <div
                                                        className={cn(
                                                            'flex max-w-[92%] items-center gap-1.5',
                                                            msg.is_outgoing
                                                                ? 'flex-row-reverse'
                                                                : 'flex-row',
                                                        )}
                                                    >
                                                        {/* Bubble Container */}
                                                        <div className="relative">
                                                            {/* Bubble Box */}
                                                            <div
                                                                className={cn(
                                                                    'rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-xs',
                                                                    msg.is_outgoing
                                                                        ? 'rounded-tr-xs bg-blue-600 text-white'
                                                                        : 'rounded-tl-xs bg-slate-100 text-slate-900 dark:bg-zinc-800 dark:text-zinc-100',
                                                                )}
                                                            >
                                                                {/* Clean Quoted Reply Card */}
                                                                {msg.reply_to && (
                                                                    <div
                                                                        className={cn(
                                                                            'mb-2 rounded-lg px-2.5 py-1.5 text-left border-l-[3px]',
                                                                            msg.is_outgoing
                                                                                ? 'border-white/90 bg-blue-700/80 text-white'
                                                                                : 'border-blue-600 bg-slate-200/80 text-slate-800 dark:bg-zinc-700/80 dark:text-zinc-200',
                                                                        )}
                                                                    >
                                                                        <div className="flex items-center gap-1">
                                                                            <CornerUpLeft className="size-2.5 shrink-0 opacity-80" />
                                                                            <span
                                                                                className={cn(
                                                                                    'text-[10.5px] font-bold tracking-tight',
                                                                                    msg.is_outgoing
                                                                                        ? 'text-white'
                                                                                        : 'text-blue-600 dark:text-blue-400',
                                                                                )}
                                                                            >
                                                                                {
                                                                                    msg
                                                                                        .reply_to
                                                                                        .sender_name
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                        <p
                                                                            className={cn(
                                                                                'mt-0.5 line-clamp-1 text-[11px] italic',
                                                                                msg.is_outgoing
                                                                                    ? 'text-blue-100'
                                                                                    : 'text-slate-600 dark:text-zinc-300',
                                                                            )}
                                                                        >
                                                                            {
                                                                                msg
                                                                                    .reply_to
                                                                                    .message
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                )}

                                                                <p className="text-[12.5px] leading-relaxed break-words font-normal">
                                                                    {msg.message}
                                                                </p>
                                                            </div>

                                                            {/* Instagram Emoji Reaction Popover (Floating above bubble) */}
                                                            {activeReactionMenu ===
                                                                msg.id && (
                                                                <div
                                                                    className={cn(
                                                                        'absolute -top-10 z-30 flex items-center gap-1.5 rounded-full border border-slate-200/90 bg-white px-2.5 py-1 shadow-xl dark:border-white/10 dark:bg-zinc-800',
                                                                        msg.is_outgoing
                                                                            ? 'right-0'
                                                                            : 'left-0',
                                                                    )}
                                                                >
                                                                    {EMOJI_OPTIONS.map(
                                                                        (
                                                                            emoji,
                                                                        ) => (
                                                                            <button
                                                                                key={
                                                                                    emoji
                                                                                }
                                                                                type="button"
                                                                                onClick={() =>
                                                                                    handleToggleReaction(
                                                                                        msg.id,
                                                                                        emoji,
                                                                                    )
                                                                                }
                                                                                className="p-0.5 text-sm transition hover:scale-130 active:scale-95"
                                                                            >
                                                                                {
                                                                                    emoji
                                                                                }
                                                                            </button>
                                                                        ),
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Action Buttons: Smile & Reply (Appears beside the bubble on hover) */}
                                                        <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                                                            <button
                                                                type="button"
                                                                title="Beri Reaksi Emote"
                                                                onClick={() =>
                                                                    setActiveReactionMenu(
                                                                        activeReactionMenu ===
                                                                            msg.id
                                                                            ? null
                                                                            : msg.id,
                                                                    )
                                                                }
                                                                className="flex size-6.5 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-200/70 hover:text-amber-500 dark:hover:bg-white/10 dark:hover:text-amber-400"
                                                            >
                                                                <Smile className="size-3.5" />
                                                            </button>

                                                            <button
                                                                type="button"
                                                                title="Balas Pesan"
                                                                onClick={() =>
                                                                    setReplyingTo(
                                                                        msg,
                                                                    )
                                                                }
                                                                className="flex size-6.5 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-200/70 hover:text-slate-900 dark:hover:bg-white/10 dark:hover:text-white"
                                                            >
                                                                <CornerUpLeft className="size-3.5" />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Reactions Emote Pills (Attached Below Bubble) */}
                                                    {msg.reactions &&
                                                        msg.reactions.length >
                                                            0 && (
                                                            <div className="mt-1 flex flex-wrap items-center gap-1 px-1">
                                                                {msg.reactions.map(
                                                                    (r) => (
                                                                        <button
                                                                            key={
                                                                                r.reaction
                                                                            }
                                                                            type="button"
                                                                            onClick={() =>
                                                                                handleToggleReaction(
                                                                                    msg.id,
                                                                                    r.reaction,
                                                                                )
                                                                            }
                                                                            className={cn(
                                                                                'flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] font-semibold transition active:scale-95',
                                                                                r.user_reacted
                                                                                    ? 'border-blue-300 bg-blue-50 text-blue-800 dark:border-blue-700 dark:bg-blue-950/50 dark:text-blue-200'
                                                                                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-300',
                                                                            )}
                                                                        >
                                                                            <span>
                                                                                {
                                                                                    r.reaction
                                                                                }
                                                                            </span>
                                                                            {r.count >
                                                                                1 && (
                                                                                <span className="font-bold text-[9px]">
                                                                                    {
                                                                                        r.count
                                                                                    }
                                                                                </span>
                                                                            )}
                                                                        </button>
                                                                    ),
                                                                )}
                                                            </div>
                                                        )}

                                                    {/* Timestamp (Jam:Menit) & Status Check Receipt */}
                                                    <div className="mt-0.5 flex items-center gap-1 px-1 text-[9.5px] text-slate-400 dark:text-zinc-500">
                                                        <span>
                                                            {formatChatTime(
                                                                msg.created_at,
                                                            )}
                                                        </span>
                                                        {msg.is_outgoing && (
                                                            <span
                                                                className="inline-flex items-center"
                                                                title={
                                                                    msg.read_at
                                                                        ? `Dibaca pada ${formatDate(msg.read_at, true)}`
                                                                        : msg.id.startsWith(
                                                                                'temp-',
                                                                            )
                                                                          ? 'Mengirim ke server...'
                                                                          : 'Terkirim (Belum dibaca)'
                                                                }
                                                            >
                                                                {msg.read_at ? (
                                                                    <CheckCheck className="size-3 text-sky-500 drop-shadow-xs dark:text-sky-400" />
                                                                ) : msg.id.startsWith(
                                                                      'temp-',
                                                                  ) ? (
                                                                    <Check className="size-3 animate-pulse text-slate-400" />
                                                                ) : (
                                                                    <CheckCheck className="size-3 text-slate-400 dark:text-zinc-500" />
                                                                )}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Replying Banner */}
                            {replyingTo && (
                                <div className="flex items-center justify-between border-t border-slate-200/80 bg-blue-50/70 px-3 py-1.5 text-xs dark:border-white/10 dark:bg-zinc-800/80">
                                    <div className="min-w-0 pr-2">
                                        <p className="text-[10px] font-bold text-blue-900 dark:text-blue-300">
                                            Membalas{' '}
                                            {replyingTo.is_outgoing
                                                ? 'Anda'
                                                : activeContact.name}
                                        </p>
                                        <p className="line-clamp-1 text-[10.5px] text-slate-600 dark:text-zinc-300">
                                            {replyingTo.message}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setReplyingTo(null)}
                                        className="shrink-0 rounded p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                                    >
                                        <X className="size-3.5" />
                                    </button>
                                </div>
                            )}

                            {/* Message Input Form */}
                            <form
                                onSubmit={handleSendMessage}
                                className="border-t border-slate-100 bg-slate-50/50 p-2.5 dark:border-white/[0.06] dark:bg-[#121418]"
                            >
                                <div className="flex items-center gap-1.5">
                                    <Input
                                        ref={inputRef}
                                        type="text"
                                        autoFocus
                                        value={inputText}
                                        onChange={(e) =>
                                            setInputText(e.target.value)
                                        }
                                        placeholder={
                                            replyingTo
                                                ? 'Tulis balasan...'
                                                : `Ketik pesan...`
                                        }
                                        className="h-8 flex-1 rounded-lg border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 dark:border-white/10 dark:bg-zinc-800 dark:text-white"
                                    />
                                    <Button
                                        type="submit"
                                        size="sm"
                                        disabled={!inputText.trim() || isSending}
                                        className="h-8 shrink-0 rounded-lg bg-slate-900 px-3 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 active:scale-95 disabled:opacity-50 dark:bg-white dark:text-slate-900"
                                    >
                                        <Send className="size-3" />
                                    </Button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            )}

            {/* Floating Trigger Button (Bottom Right) */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="group relative flex size-12 items-center justify-center rounded-full bg-slate-900 text-white shadow-xl transition-all hover:scale-105 hover:bg-slate-800 active:scale-95 dark:bg-white dark:text-slate-900"
                title="Pesan Langsung"
            >
                {isOpen ? (
                    <X className="size-5" />
                ) : (
                    <>
                        <MessageSquare className="size-5.5" />
                        {totalUnread > 0 && (
                            <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full border-2 border-white bg-blue-600 text-[10px] font-bold text-white shadow-sm dark:border-[#0c0d10]">
                                {totalUnread}
                            </span>
                        )}
                    </>
                )}
            </button>
        </div>
    );
}
