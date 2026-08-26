import { Check, ChevronDown, Search, User, UserX, X } from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export type UserOption = {
    id: string | number;
    name?: string;
    email?: string;
    position_title?: string;
    department?: string;
    avatar_path?: string | null;
};

interface UserPickerProps {
    id?: string;
    value?: string | number | null;
    onChange: (value: string) => void;
    users: UserOption[];
    placeholder?: string;
    emptyOptionLabel?: string;
    allowClear?: boolean;
    disabledUserIds?: (string | number)[];
    disabledReason?: string;
    className?: string;
    error?: boolean;
}

function getAvatarUrl(avatarPath?: string | null): string {
    if (!avatarPath || avatarPath.trim() === '') {
        return '/images/default-avatar.svg';
    }
    if (avatarPath.startsWith('http') || avatarPath.startsWith('/')) {
        return avatarPath;
    }
    return `/storage/${avatarPath}`;
}

export default function UserPicker({
    id,
    value,
    onChange,
    users,
    placeholder = 'Pilih Staf / Advokat...',
    emptyOptionLabel = '-- Tanpa Pilihan --',
    allowClear = false,
    disabledUserIds = [],
    disabledReason = 'Sudah dipilih di posisi lain',
    className = '',
    error = false,
}: UserPickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const selectedUser = useMemo(() => {
        if (!value) return null;
        return users.find((u) => String(u.id) === String(value)) || null;
    }, [users, value]);

    // Close on click outside or escape key
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleKeyDown);
            // Auto focus search input when opening
            setTimeout(() => {
                searchInputRef.current?.focus();
            }, 50);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    // Filter and sort users based on id
    const filteredUsers = useMemo(() => {
        const sorted = [...users].sort((a, b) => {
            const numA = Number(a.id);
            const numB = Number(b.id);
            if (!isNaN(numA) && !isNaN(numB)) {
                return numA - numB;
            }
            return String(a.id).localeCompare(String(b.id));
        });

        const query = searchQuery.toLowerCase().trim();
        if (!query) return sorted;
        return sorted.filter((u) => {
            const name = (u.name || '').toLowerCase();
            const position = (u.position_title || '').toLowerCase();
            const department = (u.department || '').toLowerCase();
            const email = (u.email || '').toLowerCase();
            return (
                name.includes(query) ||
                position.includes(query) ||
                department.includes(query) ||
                email.includes(query)
            );
        });
    }, [users, searchQuery]);

    const handleSelect = (userId: string) => {
        onChange(userId);
        setIsOpen(false);
        setSearchQuery('');
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange('');
        setIsOpen(false);
        setSearchQuery('');
    };

    return (
        <div ref={containerRef} className={`relative w-full ${className}`}>
            {/* Trigger Button */}
            <button
                type="button"
                id={id}
                onClick={() => setIsOpen((prev) => !prev)}
                className={`flex h-10 w-full items-center justify-between rounded-lg border bg-white px-3 py-1.5 text-left text-xs shadow-2xs transition-all focus:outline-hidden dark:bg-[#191c22] ${
                    error
                        ? 'border-rose-300 ring-2 ring-rose-500/20 dark:border-rose-700'
                        : isOpen
                          ? 'border-blue-500 ring-2 ring-blue-500/20 dark:border-blue-500'
                          : 'border-slate-200 hover:border-slate-300 dark:border-white/10 dark:hover:border-white/20'
                }`}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <div className="flex min-w-0 flex-1 items-center gap-2.5">
                    {selectedUser ? (
                        <>
                            <Avatar className="size-6 shrink-0 rounded-full border border-slate-200 bg-slate-100 dark:border-white/10 dark:bg-zinc-800">
                                <AvatarImage
                                    src={getAvatarUrl(selectedUser.avatar_path)}
                                    alt={selectedUser.name || 'User'}
                                    className="object-cover"
                                />
                                <AvatarFallback className="bg-slate-100 dark:bg-zinc-800">
                                    <img
                                        src="/images/default-avatar.svg"
                                        alt="Default Avatar"
                                        className="size-full object-cover"
                                    />
                                </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1 truncate">
                                <span className="font-semibold text-slate-900 dark:text-white">
                                    {selectedUser.name}
                                </span>
                                {selectedUser.position_title && (
                                    <span className="ml-1.5 text-[11px] text-slate-500 dark:text-zinc-400">
                                        • {selectedUser.position_title}
                                    </span>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-2 text-slate-400 dark:text-zinc-500">
                            <User className="size-4 shrink-0 text-slate-400" />
                            <span className="truncate">{placeholder}</span>
                        </div>
                    )}
                </div>

                <div className="ml-2 flex shrink-0 items-center gap-1.5">
                    {allowClear && selectedUser && (
                        <span
                            role="button"
                            tabIndex={0}
                            onClick={handleClear}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    handleClear(e as unknown as React.MouseEvent);
                                }
                            }}
                            className="rounded-full p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-white/10 dark:hover:text-zinc-200"
                            title="Hapus pilihan"
                        >
                            <X className="size-3.5" />
                        </span>
                    )}
                    <ChevronDown
                        className={`size-3.5 text-slate-400 transition-transform duration-200 dark:text-zinc-500 ${
                            isOpen ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''
                        }`}
                    />
                </div>
            </button>

            {/* Dropdown Popover */}
            {isOpen && (
                <div className="absolute left-0 top-full z-50 mt-1.5 max-h-72 w-full min-w-[260px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl animate-in fade-in-50 zoom-in-95 dark:border-white/10 dark:bg-[#15171c]">
                    {/* Search Bar */}
                    <div className="sticky top-0 z-10 border-b border-slate-100 bg-slate-50/90 p-2 backdrop-blur-xs dark:border-white/[0.06] dark:bg-[#1a1d24]/90">
                        <div className="relative flex items-center">
                            <Search className="pointer-events-none absolute left-2.5 size-3.5 text-slate-400 dark:text-zinc-500" />
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari nama atau jabatan..."
                                className="h-8 w-full rounded-lg border border-slate-200 bg-white pl-8 pr-7 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-hidden dark:border-white/10 dark:bg-[#111317] dark:text-zinc-100 dark:placeholder-zinc-500"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-2 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200"
                                >
                                    <X className="size-3" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Options List */}
                    <div className="max-h-52 overflow-y-auto p-1 text-xs">
                        {allowClear && (
                            <button
                                type="button"
                                onClick={() => handleSelect('')}
                                className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors ${
                                    !value
                                        ? 'bg-blue-50/80 font-semibold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                                        : 'text-slate-500 hover:bg-slate-50 dark:text-zinc-400 dark:hover:bg-white/[0.04]'
                                }`}
                            >
                                <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-white/5 dark:text-zinc-500">
                                    <UserX className="size-3.5" />
                                </div>
                                <span className="flex-1 truncate italic">
                                    {emptyOptionLabel}
                                </span>
                                {!value && (
                                    <Check className="size-4 shrink-0 text-blue-600 dark:text-blue-400" />
                                )}
                            </button>
                        )}

                        {filteredUsers.length === 0 ? (
                            <div className="py-6 text-center text-xs text-slate-400 dark:text-zinc-500">
                                Tidak ada staf yang cocok dengan &quot;{searchQuery}&quot;
                            </div>
                        ) : (
                            filteredUsers.map((user) => {
                                const isSelected = String(user.id) === String(value);
                                const isDisabled = disabledUserIds
                                    .map(String)
                                    .includes(String(user.id));

                                return (
                                    <button
                                        key={user.id}
                                        type="button"
                                        disabled={isDisabled}
                                        onClick={() => handleSelect(String(user.id))}
                                        className={`flex w-full items-center justify-between gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors ${
                                            isDisabled
                                                ? 'cursor-not-allowed opacity-40'
                                                : isSelected
                                                  ? 'bg-blue-50/80 font-medium text-blue-900 dark:bg-blue-950/50 dark:text-blue-200'
                                                  : 'text-slate-700 hover:bg-slate-50 dark:text-zinc-300 dark:hover:bg-white/[0.05]'
                                        }`}
                                    >
                                        <div className="flex min-w-0 items-center gap-2.5">
                                            <Avatar className="size-7 shrink-0 rounded-full border border-slate-200 bg-slate-100 dark:border-white/10 dark:bg-zinc-800">
                                                <AvatarImage
                                                    src={getAvatarUrl(user.avatar_path)}
                                                    alt={user.name || 'User'}
                                                    className="object-cover"
                                                />
                                                <AvatarFallback className="bg-slate-100 dark:bg-zinc-800">
                                                    <img
                                                        src="/images/default-avatar.svg"
                                                        alt="Default Avatar"
                                                        className="size-full object-cover"
                                                    />
                                                </AvatarFallback>
                                            </Avatar>

                                            <div className="min-w-0 flex-1">
                                                <p
                                                    className={`truncate font-semibold ${
                                                        isSelected
                                                            ? 'text-blue-900 dark:text-blue-200'
                                                            : 'text-slate-900 dark:text-white'
                                                    }`}
                                                >
                                                    {user.name}
                                                </p>
                                                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-zinc-400">
                                                    {user.position_title && (
                                                        <span className="truncate">
                                                            {user.position_title}
                                                        </span>
                                                    )}
                                                    {user.department && (
                                                        <>
                                                            <span>•</span>
                                                            <span className="truncate">
                                                                {user.department}
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex shrink-0 items-center gap-2">
                                            {isDisabled && (
                                                <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500 dark:bg-white/10 dark:text-zinc-400">
                                                    {disabledReason}
                                                </span>
                                            )}
                                            {isSelected && (
                                                <Check className="size-4 text-blue-600 dark:text-blue-400" />
                                            )}
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
