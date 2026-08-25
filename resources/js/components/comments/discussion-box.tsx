import { router, usePage } from '@inertiajs/react';
import {
    CornerDownRight,
    ExternalLink,
    Flame,
    Heart,
    MessageSquare,
    Pin,
    Scale,
    Send,
    Smile,
    Sparkles,
    Target,
    ThumbsUp,
    Trash2,
    X,
} from 'lucide-react';
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/confirm-dialog';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import * as commentRoutes from '@/routes/comments';

export type DiscussionStaff = {
    id: number;
    name: string;
    position_title?: string;
    avatar_path?: string | null;
    avatar_url?: string | null;
};

export type CommentReactionItem = {
    id: string;
    user_id: number;
    emoji: string;
    user?: { id: number; name: string };
};

export type DiscussionComment = {
    id: string;
    user_id: number;
    body: string;
    is_pinned: boolean;
    pinned_at?: string | null;
    created_at: string;
    user: DiscussionStaff;
    pinned_by_user?: DiscussionStaff | null;
    reactions: CommentReactionItem[];
    replies?: DiscussionComment[];
};

const EMOJI_OPTIONS = [
    { key: 'thumbs_up', label: 'Setuju / Siap', symbol: '👍' },
    { key: 'heart', label: 'Apresiasi', symbol: '❤️' },
    { key: 'scale', label: 'Analisis Hukum', symbol: '⚖️' },
    { key: 'target', label: 'Tepat Sasaran', symbol: '🎯' },
    { key: 'fire', label: 'Urgensi Tinggi', symbol: '🔥' },
    { key: 'eyes', label: 'Sedang Ditinjau', symbol: '👀' },
] as const;

function formatRelativeTime(dateString: string): string {
    if (!dateString) return '';
    const now = new Date();
    const date = new Date(dateString);
    const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSec < 45) return 'Baru saja';
    if (diffSec < 3600) return `${Math.max(1, Math.floor(diffSec / 60))} mnt lalu`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} jam lalu`;
    if (diffSec < 172800) return 'Kemarin';

    return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        timeZone: 'Asia/Jakarta',
    }).format(date);
}

function getInitials(name?: string): string {
    if (!name) return 'U';
    return name
        .split(' ')
        .map((n) => n[0])
        .filter(Boolean)
        .slice(0, 2)
        .join('')
        .toUpperCase();
}

export function DiscussionBox({
    commentableType,
    commentableId,
    comments = [],
    staffList = [],
    title = 'Diskusi Internal Tim',
    subtitle = 'Kolaborasi strategi perkara, catatan draf, dan instruksi tim hukum.',
}: {
    commentableType: 'matter' | 'document' | 'task';
    commentableId: string;
    comments: DiscussionComment[];
    staffList: DiscussionStaff[];
    title?: string;
    subtitle?: string;
}) {
    const page = usePage();
    const currentUser = page.props.auth?.user as DiscussionStaff | undefined;

    // Local state for instant optimistic updates without page reload
    const [localComments, setLocalComments] = useState<DiscussionComment[]>(comments);
    const [inputText, setInputText] = useState('');
    const [replyingTo, setReplyingTo] = useState<DiscussionComment | null>(null);
    const [mentionSearch, setMentionSearch] = useState<string | null>(null);
    const [mentionIndex, setMentionIndex] = useState<number>(-1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Keep in sync when fresh Inertia props arrive
    useEffect(() => {
        setLocalComments(comments);
    }, [comments]);

    const filteredStaff = useMemo(() => {
        if (!mentionSearch) return [];
        const q = mentionSearch.toLowerCase();
        return staffList
            .filter((s) => s.name.toLowerCase().includes(q) || (s.position_title && s.position_title.toLowerCase().includes(q)))
            .slice(0, 6);
    }, [staffList, mentionSearch]);

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value;
        const cursor = e.target.selectionStart;
        setInputText(val);

        // Auto-detect @ trigger
        const textBeforeCursor = val.slice(0, cursor);
        const lastAt = textBeforeCursor.lastIndexOf('@');

        if (lastAt !== -1 && (lastAt === 0 || /\s/.test(textBeforeCursor[lastAt - 1]))) {
            const query = textBeforeCursor.slice(lastAt + 1);
            if (!query.includes(' ') && query.length <= 20) {
                setMentionSearch(query);
                setMentionIndex(lastAt);
                return;
            }
        }
        setMentionSearch(null);
    };

    const insertMention = (staff: DiscussionStaff) => {
        if (mentionIndex === -1) return;
        const before = inputText.slice(0, mentionIndex);
        const after = inputText.slice(textareaRef.current?.selectionStart ?? inputText.length);
        const newText = `${before}@${staff.name} ${after}`;
        setInputText(newText);
        setMentionSearch(null);
        if (textareaRef.current) {
            textareaRef.current.focus();
        }
    };

    const insertQuickEmoji = (emojiSymbol: string) => {
        setInputText((prev) => (prev ? `${prev} ${emojiSymbol}` : emojiSymbol));
        if (textareaRef.current) {
            textareaRef.current.focus();
        }
    };

    // Instant Optimistic Submit
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = inputText.trim();
        if (!trimmed || isSubmitting) return;

        const parentId = replyingTo ? replyingTo.id : null;
        const tempId = `temp-${Date.now()}`;

        const newCommentObj: DiscussionComment = {
            id: tempId,
            user_id: currentUser?.id ?? 0,
            body: trimmed,
            is_pinned: false,
            pinned_at: null,
            created_at: new Date().toISOString(),
            user: currentUser ?? { id: 0, name: 'Anda' },
            reactions: [],
            replies: [],
        };

        // Optimistic update
        if (parentId) {
            setLocalComments((prev) =>
                prev.map((c) => {
                    if (c.id === parentId) {
                        return {
                            ...c,
                            replies: [...(c.replies || []), newCommentObj],
                        };
                    }
                    return c;
                }),
            );
        } else {
            setLocalComments((prev) => [newCommentObj, ...prev]);
        }

        setInputText('');
        setReplyingTo(null);
        setMentionSearch(null);
        setIsSubmitting(true);

        router.post(
            commentRoutes.store.url(),
            {
                commentable_type: commentableType,
                commentable_id: commentableId,
                parent_id: parentId ?? '',
                body: trimmed,
            },
            {
                preserveScroll: true,
                preserveState: true,
                onFinish: () => setIsSubmitting(false),
            },
        );
    };

    // Instant Optimistic Reaction
    const handleReaction = (commentId: string, emojiKey: string) => {
        if (!currentUser) return;

        setLocalComments((prev) => {
            const updateItem = (item: DiscussionComment): DiscussionComment => {
                if (item.id === commentId) {
                    const existingIdx = item.reactions.findIndex(
                        (r) => r.emoji === emojiKey && r.user_id === currentUser.id,
                    );
                    let newReactions = [...item.reactions];
                    if (existingIdx !== -1) {
                        newReactions.splice(existingIdx, 1);
                    } else {
                        newReactions.push({
                            id: `temp-r-${Date.now()}`,
                            user_id: currentUser.id,
                            emoji: emojiKey,
                            user: { id: currentUser.id, name: currentUser.name },
                        });
                    }
                    return { ...item, reactions: newReactions };
                }
                if (item.replies && item.replies.length > 0) {
                    return { ...item, replies: item.replies.map(updateItem) };
                }
                return item;
            };
            return prev.map(updateItem);
        });

        router.post(
            commentRoutes.reaction.url(commentId),
            { emoji: emojiKey },
            { preserveScroll: true, preserveState: true },
        );
    };

    // Instant Optimistic Pin
    const handlePin = (commentId: string) => {
        setLocalComments((prev) =>
            prev.map((c) => {
                if (c.id === commentId) {
                    return {
                        ...c,
                        is_pinned: !c.is_pinned,
                        pinned_at: !c.is_pinned ? new Date().toISOString() : null,
                    };
                }
                return c;
            }),
        );

        router.post(
            commentRoutes.pin.url(commentId),
            {},
            { preserveScroll: true, preserveState: true },
        );
    };

    // Instant Optimistic Delete
    const handleDelete = (commentId: string) => {
        setCommentToDelete(commentId);
    };

    const confirmDeleteComment = () => {
        if (!commentToDelete) return;
        const commentId = commentToDelete;
        setCommentToDelete(null);

        setLocalComments((prev) =>
            prev
                .filter((c) => c.id !== commentId)
                .map((c) => ({
                    ...c,
                    replies: (c.replies || []).filter((r) => r.id !== commentId),
                })),
        );

        router.delete(commentRoutes.destroy.url(commentId), {
            preserveScroll: true,
            preserveState: true,
        });
    };

    // Sort: Pinned first, then newest
    const sortedComments = useMemo(() => {
        return [...localComments].sort((a, b) => {
            if (a.is_pinned && !b.is_pinned) return -1;
            if (!a.is_pinned && b.is_pinned) return 1;
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
    }, [localComments]);

    const totalCommentCount = useMemo(() => {
        return localComments.reduce((acc, c) => acc + 1 + (c.replies?.length ?? 0), 0);
    }, [localComments]);

    return (
        <div className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-2xs dark:border-white/[0.08] dark:bg-[#15171c]">
            {/* Header Toolbar */}
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-white/[0.06]">
                <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                        <MessageSquare className="size-4" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-xs font-black tracking-wider text-slate-900 uppercase dark:text-white">
                                {title}
                            </h3>
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-700 dark:bg-white/[0.08] dark:text-zinc-300">
                                {totalCommentCount}
                            </span>
                        </div>
                        <p className="text-[11px] font-medium text-slate-500 dark:text-zinc-400">
                            {subtitle}
                        </p>
                    </div>
                </div>
            </div>

            {/* Comment Stream */}
            <div className="divide-y divide-slate-100 p-5 dark:divide-white/[0.04]">
                {sortedComments.length > 0 ? (
                    sortedComments.map((comment) => (
                        <InstagramCommentRow
                            key={comment.id}
                            comment={comment}
                            staffList={staffList}
                            currentUserId={currentUser?.id}
                            onReply={(target) => {
                                setReplyingTo(target);
                                setInputText(`@${target.user.name} `);
                                textareaRef.current?.focus();
                            }}
                            onReaction={handleReaction}
                            onPin={handlePin}
                            onDelete={handleDelete}
                        />
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="flex size-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-white/[0.04] dark:text-zinc-500">
                            <MessageSquare className="size-5" />
                        </div>
                        <h4 className="mt-3 text-xs font-bold text-slate-900 dark:text-white">
                            Belum Ada Diskusi Tim
                        </h4>
                        <p className="mt-1 max-w-xs text-[11px] text-slate-500 dark:text-zinc-400">
                            Mulai diskusi atau berikan instruksi kepada tim advokat perkara ini.
                        </p>
                    </div>
                )}
            </div>

            {/* Bottom Composer Box */}
            <div className="relative border-t border-slate-100 bg-slate-50/60 p-4 dark:border-white/[0.06] dark:bg-[#121418]/60">
                {/* Replying banner */}
                {replyingTo && (
                    <div className="mb-2.5 flex items-center justify-between rounded-xl bg-blue-50/90 px-3 py-1.5 text-xs font-medium text-blue-900 dark:bg-blue-950/50 dark:text-blue-200">
                        <span className="flex items-center gap-1.5">
                            <CornerDownRight className="size-3.5 text-blue-600 dark:text-blue-400" />
                            Membalas <strong className="font-bold">{replyingTo.user.name}</strong>
                        </span>
                        <button
                            type="button"
                            onClick={() => {
                                setReplyingTo(null);
                                setInputText('');
                            }}
                            className="rounded-full p-0.5 text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/50"
                        >
                            <X className="size-3.5" />
                        </button>
                    </div>
                )}

                {/* Mention Autocomplete Popup */}
                {mentionSearch !== null && filteredStaff.length > 0 && (
                    <div className="absolute bottom-full left-5 z-40 mb-2 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-2xl dark:border-white/10 dark:bg-[#1f222a]">
                        <div className="px-2.5 py-1 text-[9.5px] font-extrabold tracking-wider text-slate-400 uppercase dark:text-zinc-400">
                            TAG ANGGOTA TIM HUKUM
                        </div>
                        {filteredStaff.map((staff) => (
                            <button
                                key={staff.id}
                                type="button"
                                onClick={() => insertMention(staff)}
                                className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-1.5 text-left text-xs transition-colors hover:bg-slate-100 dark:hover:bg-white/[0.08]"
                            >
                                <Avatar className="size-6 rounded-full border border-black/10">
                                    <AvatarImage src={staff.avatar_url || (staff.avatar_path ? `/storage/${staff.avatar_path}` : '/images/default-avatar.svg')} />
                                    <AvatarFallback className="bg-slate-800 text-[9px] font-bold text-white">
                                        {getInitials(staff.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-xs font-bold text-slate-900 dark:text-white">{staff.name}</p>
                                    <p className="truncate text-[10px] text-slate-500 dark:text-zinc-400">{staff.position_title ?? 'Advokat'}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {/* Main Composer Form */}
                <form onSubmit={handleSubmit} className="flex items-start gap-3">
                    {/* User Avatar */}
                    <div className="shrink-0 pt-0.5">
                        <Avatar className="size-8.5 rounded-full border border-slate-200/80 shadow-2xs dark:border-white/10">
                            <AvatarImage src={currentUser?.avatar_url || (currentUser?.avatar_path ? `/storage/${currentUser.avatar_path}` : '/images/default-avatar.svg')} />
                            <AvatarFallback className="bg-slate-900 text-xs font-black text-white dark:bg-slate-800">
                                {getInitials(currentUser?.name)}
                            </AvatarFallback>
                        </Avatar>
                    </div>

                    {/* Clean Textarea Card */}
                    <div className="flex-1 overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-2.5 shadow-2xs transition-all focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-600/10 dark:border-white/10 dark:bg-[#16181d]">
                        <textarea
                            ref={textareaRef}
                            rows={2}
                            value={inputText}
                            onChange={handleTextChange}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit(e);
                                }
                            }}
                            placeholder="Tulis catatan diskusi, atau ketik @ untuk tag rekan kerja..."
                            className="block w-full resize-none border-0 bg-transparent p-1 text-xs leading-relaxed text-slate-900 placeholder:text-slate-400 focus:outline-hidden dark:text-white dark:placeholder:text-zinc-500"
                        />

                        {/* Action Footer inside box */}
                        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-2 dark:border-white/[0.04]">
                            {/* Quick Emoji & Tag Helpers */}
                            <div className="flex items-center gap-1">
                                <span className="mr-1 text-[11px] font-semibold text-slate-400 dark:text-zinc-500">Reaksi cepat:</span>
                                {['👍', '⚖️', '🎯', '🔥', '❤️'].map((em) => (
                                    <button
                                        key={em}
                                        type="button"
                                        onClick={() => insertQuickEmoji(em)}
                                        className="rounded-md px-1.5 py-0.5 text-xs transition-transform hover:scale-125 hover:bg-slate-100 dark:hover:bg-white/[0.06]"
                                    >
                                        {em}
                                    </button>
                                ))}
                            </div>

                            {/* Submit Button */}
                            <div className="flex items-center gap-2">
                                <span className="hidden font-mono text-[10px] text-slate-400 sm:inline-block">
                                    Tekan <kbd className="rounded bg-slate-100 px-1 py-0.5 text-slate-600 dark:bg-zinc-800 dark:text-zinc-300">Enter ↵</kbd>
                                </span>
                                <Button
                                    type="submit"
                                    size="sm"
                                    disabled={!inputText.trim() || isSubmitting}
                                    className={`h-7.5 rounded-xl px-3.5 text-xs font-bold transition-all ${
                                        inputText.trim()
                                            ? 'bg-blue-600 text-white shadow-xs hover:bg-blue-700 active:scale-95'
                                            : 'bg-slate-200 text-slate-400 opacity-50 dark:bg-zinc-800 dark:text-zinc-500'
                                    }`}
                                >
                                    <Send className="mr-1.5 size-3" />
                                    Kirim
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            {/* Modal Konfirmasi Hapus Komentar */}
            <ConfirmDialog
                open={!!commentToDelete}
                onOpenChange={(open) => !open && setCommentToDelete(null)}
                title="Hapus Catatan Diskusi"
                description="Apakah Anda yakin ingin menghapus catatan diskusi strategi perkara ini? Catatan dan balasan terkait akan dihapus."
                confirmLabel="Hapus Catatan"
                variant="danger"
                onConfirm={confirmDeleteComment}
            />
        </div>
    );
}

/**
 * Instagram-Style Compact Comment Row Component
 */
function InstagramCommentRow({
    comment,
    staffList = [],
    currentUserId,
    onReply,
    onReaction,
    onPin,
    onDelete,
    isReply = false,
}: {
    comment: DiscussionComment;
    staffList?: DiscussionStaff[];
    currentUserId?: number;
    onReply: (comment: DiscussionComment) => void;
    onReaction: (commentId: string, emojiKey: string) => void;
    onPin: (commentId: string) => void;
    onDelete: (commentId: string) => void;
    isReply?: boolean;
}) {
    const isAuthor = currentUserId === comment.user_id;
    const [showReplies, setShowReplies] = useState(true);
    const [showReactionPicker, setShowReactionPicker] = useState(false);

    // Group reactions
    const activeReactions = useMemo(() => {
        const map: Record<string, { count: number; users: string[]; hasReacted: boolean; symbol: string }> = {};
        for (const r of comment.reactions || []) {
            const sym = EMOJI_OPTIONS.find((e) => e.key === r.emoji)?.symbol ?? '👍';
            if (!map[r.emoji]) {
                map[r.emoji] = { count: 0, users: [], hasReacted: false, symbol: sym };
            }
            map[r.emoji].count += 1;
            if (r.user?.name) {
                map[r.emoji].users.push(r.user.name);
            }
            if (r.user_id === currentUserId) {
                map[r.emoji].hasReacted = true;
            }
        }
        return Object.entries(map);
    }, [comment.reactions, currentUserId]);

    return (
        <div className={`group relative transition-colors ${isReply ? 'pt-3 pb-1' : 'py-3.5'}`}>
            {/* Pinned Pill Banner */}
            {comment.is_pinned && !isReply && (
                <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-amber-300/80 bg-amber-50 px-2.5 py-0.5 text-[9.5px] font-extrabold tracking-wider text-amber-800 uppercase dark:border-amber-500/30 dark:bg-amber-950/40 dark:text-amber-300">
                    <Pin className="size-2.5 fill-amber-600 text-amber-600 dark:text-amber-400" />
                    <span>Disematkan oleh Partner</span>
                </div>
            )}

            <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="shrink-0 pt-0.5">
                    <Avatar className={`${isReply ? 'size-7' : 'size-8'} rounded-full border border-slate-200/80 shadow-2xs dark:border-white/10`}>
                        <AvatarImage src={comment.user.avatar_url || (comment.user.avatar_path ? `/storage/${comment.user.avatar_path}` : '/images/default-avatar.svg')} />
                        <AvatarFallback className="bg-slate-800 text-[10px] font-black text-white dark:bg-slate-700">
                            {getInitials(comment.user.name)}
                        </AvatarFallback>
                    </Avatar>
                </div>

                {/* Content Block */}
                <div className="min-w-0 flex-1 space-y-1">
                    {/* User Header Line */}
                    <div className="flex flex-wrap items-baseline gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {comment.user.name}
                        </span>
                        {comment.user.position_title && (
                            <span className="rounded-md bg-slate-100 px-1.5 py-0.2 font-mono text-[9px] font-semibold text-slate-600 dark:bg-white/[0.06] dark:text-zinc-300">
                                {comment.user.position_title}
                            </span>
                        )}
                        <span className="font-mono text-[10px] text-slate-400 dark:text-zinc-500">
                            {formatRelativeTime(comment.created_at)}
                        </span>
                    </div>

                    {/* Text Body */}
                    <FormattedCommentBody text={comment.body} staffList={staffList} />

                    {/* Action Bar */}
                    <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] font-semibold text-slate-500 dark:text-zinc-400">
                        {/* Reaction Picker Button */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setShowReactionPicker((p) => !p)}
                                className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-white"
                            >
                                <Smile className="size-3 text-slate-400" />
                                <span>Reaksi</span>
                            </button>

                            {showReactionPicker && (
                                <div className="absolute top-full left-0 z-30 mt-1 flex items-center gap-1 rounded-full border border-slate-200 bg-white p-1 shadow-lg dark:border-white/10 dark:bg-[#1f222a]">
                                    {EMOJI_OPTIONS.map((opt) => (
                                        <button
                                            key={opt.key}
                                            type="button"
                                            onClick={() => {
                                                onReaction(comment.id, opt.key);
                                                setShowReactionPicker(false);
                                            }}
                                            className="rounded-full p-1 text-sm transition-transform hover:scale-130 active:scale-95"
                                        >
                                            {opt.symbol}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Reply Action */}
                        {!isReply && (
                            <button
                                type="button"
                                onClick={() => onReply(comment)}
                                className="hover:text-blue-600 hover:underline dark:hover:text-blue-400"
                            >
                                Balas
                            </button>
                        )}

                        {/* Pin Action (Partner/Admin) */}
                        <button
                            type="button"
                            onClick={() => onPin(comment.id)}
                            className={`inline-flex items-center gap-1 transition-colors ${
                                comment.is_pinned
                                    ? 'font-bold text-amber-600 dark:text-amber-400'
                                    : 'hover:text-slate-900 dark:hover:text-white'
                            }`}
                        >
                            <Pin className={`size-3 ${comment.is_pinned ? 'fill-amber-600' : ''}`} />
                            <span>{comment.is_pinned ? 'Lepas Pin' : 'Pin Catatan'}</span>
                        </button>

                        {/* Delete Action (Author only) */}
                        {isAuthor && (
                            <button
                                type="button"
                                onClick={() => onDelete(comment.id)}
                                className="text-rose-500 opacity-0 transition-opacity group-hover:opacity-100 hover:underline dark:text-rose-400"
                            >
                                Hapus
                            </button>
                        )}

                        {/* Active Reactions Pills */}
                        {activeReactions.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1">
                                {activeReactions.map(([emojiKey, data]) => (
                                    <TooltipProvider key={emojiKey} delayDuration={200}>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <button
                                                    type="button"
                                                    onClick={() => onReaction(comment.id, emojiKey)}
                                                    className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-bold transition-all active:scale-95 ${
                                                        data.hasReacted
                                                            ? 'border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-500/40 dark:bg-blue-950/50 dark:text-blue-300'
                                                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-zinc-800/80 dark:text-zinc-200 dark:hover:bg-zinc-700/80'
                                                    }`}
                                                >
                                                    <span>{data.symbol}</span>
                                                    <span className="font-mono text-[10px]">{data.count}</span>
                                                </button>
                                            </TooltipTrigger>
                                            <TooltipContent className="text-xs">
                                                {data.users.length > 0 && data.users.join(', ')}
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Instagram-style nested replies with collapse button */}
                    {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-2.5">
                            <button
                                type="button"
                                onClick={() => setShowReplies((s) => !s)}
                                className="flex items-center gap-2 text-[10.5px] font-bold text-slate-400 hover:text-slate-700 dark:text-zinc-500 dark:hover:text-zinc-300"
                            >
                                <span className="h-[1px] w-6 bg-slate-300 dark:bg-zinc-700" />
                                {showReplies
                                    ? `Sembunyikan balasan (${comment.replies.length})`
                                    : `Lihat ${comment.replies.length} balasan lainnya`}
                            </button>

                            {showReplies && (
                                <div className="mt-2 space-y-2 border-l-2 border-slate-100 pl-3.5 dark:border-white/[0.04]">
                                    {comment.replies.map((reply) => (
                                        <InstagramCommentRow
                                            key={reply.id}
                                            comment={reply}
                                            staffList={staffList}
                                            currentUserId={currentUserId}
                                            onReply={onReply}
                                            onReaction={onReaction}
                                            onPin={onPin}
                                            onDelete={onDelete}
                                            isReply={true}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/**
 * Format comment body text with styled @mentions and clickable URLs
 */
function FormattedCommentBody({
    text,
    staffList = [],
}: {
    text: string;
    staffList?: DiscussionStaff[];
}) {
    const knownNames = useMemo(() => {
        const names = (staffList || []).map((s) => s.name).filter(Boolean);
        const defaults = [
            'Muhamad Fajar Roni, S.H.',
            'Muhamad Fajar Roni',
            'Fajar Roni',
            'M. Anggara Putra, S.H., M.H.',
            'M. Anggara Putra',
            'Anggara Putra',
            'Anggara',
            'Reza Evaldo Kusumah, S.H.',
            'Reza Evaldo Kusumah',
            'Reza Kusumah',
            'Reza',
            'RPK Administrator',
            'Admin',
        ];
        for (const d of defaults) {
            if (!names.includes(d)) names.push(d);
        }
        return names.sort((a, b) => b.length - a.length);
    }, [staffList]);

    const parts = useMemo(() => {
        const namePattern = knownNames
            .map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
            .join('|');

        // Regex capturing: URLs, @KnownName, or @SingleWord
        const regex = new RegExp(`((?:https?:\\/\\/[^\\s]+)|(?:@(?:${namePattern}|[A-Za-z0-9_.-]+)))`, 'g');
        return text.split(regex);
    }, [text, knownNames]);

    return (
        <p className="text-xs leading-relaxed font-normal text-slate-800 break-words dark:text-zinc-200">
            {parts.map((part, index) => {
                if (/^https?:\/\//i.test(part)) {
                    return (
                        <a
                            key={index}
                            href={part}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:underline dark:text-blue-400"
                        >
                            <span>{part.length > 35 ? part.slice(0, 35) + '…' : part}</span>
                            <ExternalLink className="size-2.5 shrink-0" />
                        </a>
                    );
                }
                if (part.startsWith('@')) {
                    return (
                        <span
                            key={index}
                            className="inline-flex items-center rounded-md bg-blue-50 px-1.5 py-0.5 font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
                        >
                            {part}
                        </span>
                    );
                }
                return <Fragment key={index}>{part}</Fragment>;
            })}
        </p>
    );
}
