import { Form, Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Building2,
    Check,
    ChevronDown,
    ChevronRight,
    Columns2,
    Copy,
    ExternalLink,
    LayoutList,
    Mail,
    MapPin,
    MessageCircle,
    Pencil,
    Phone,
    Plus,
    RotateCcw,
    Search,
    Share2,
    Star,
    Trash2,
    User,
    UserPlus,
    X,
    Camera,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { ContactsDirectoryHero } from '@/components/contacts-directory-hero';
import { EmptyState } from '@/components/empty-state';
import InputError from '@/components/input-error';
import { Pagination } from '@/components/pagination';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import * as clientRoutes from '@/routes/clients';
import * as contactRoutes from '@/routes/contacts';

type Contact = {
    id: string;
    full_name: string;
    first_name: string;
    last_name?: string;
    job_title?: string;
    organization_name?: string;
    email?: string;
    phone?: string;
    mobile?: string;
    avatar_url?: string | null;
    notes?: string;
    client?: { id: string; display_name: string; address?: string };
};

type Page = {
    data: Contact[];
    links: { url: string | null; label: string; active: boolean }[];
    total: number;
};

const AVAILABLE_AVATARS = Array.from({ length: 15 }, (_, i) => ({
    id: `avatar-${i + 1}`,
    url: `/images/avatars/avatar-${i + 1}.svg`,
    label: `Avatar 3D ${i + 1}`,
}));

function getInitials(name?: string) {
    if (!name) return '??';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getContactAvatarUrl(
    contact?: {
        id?: string;
        full_name?: string;
        avatar_url?: string | null;
    } | null,
): string {
    if (!contact) return '/images/avatars/avatar-1.svg';
    if (contact.avatar_url && contact.avatar_url.trim() !== '') {
        return contact.avatar_url;
    }
    let hash = 0;
    const str = (contact.id || '') + (contact.full_name || '');
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = (Math.abs(hash) % 15) + 1;
    return `/images/avatars/avatar-${index}.svg`;
}

export default function ContactsIndex({
    contacts,
    clients,
    metrics,
    filters,
    can,
}: {
    contacts: Page;
    clients: { id: string; display_name: string }[];
    metrics: {
        total: number;
        client_linked: number;
        independent: number;
        connected_clients: number;
    };
    filters: { search?: string; client_id?: string };
    can: { create: boolean; update?: boolean; delete?: boolean };
}) {
    const [openCreate, setOpenCreate] = useState(() =>
        typeof window !== 'undefined'
            ? new URLSearchParams(window.location.search).has('create')
            : false,
    );
    const [selectedContact, setSelectedContact] = useState<Contact | null>(
        () => {
            return contacts.data.length > 0 ? contacts.data[0] : null;
        },
    );
    const [editingContact, setEditingContact] = useState<Contact | null>(null);
    const [contactToDelete, setContactToDelete] = useState<Contact | null>(
        null,
    );
    const [isDeletingContact, setIsDeletingContact] = useState(false);
    const [viewMode, setViewMode] = useState<'split' | 'table'>('split');
    const [searchQuery, setSearchQuery] = useState(filters.search ?? '');
    const [copiedInfo, setCopiedInfo] = useState(false);
    const [onlyStarred, setOnlyStarred] = useState(false);
    const [createAvatar, setCreateAvatar] = useState<string>(
        '/images/avatars/avatar-1.svg',
    );
    const [editAvatar, setEditAvatar] = useState<string>('');

    // Sync selectedContact and editAvatar when contacts data or editing contact changes
    useEffect(() => {
        if (selectedContact) {
            const found = contacts.data.find(
                (c) => c.id === selectedContact.id,
            );
            if (found) {
                setSelectedContact(found);
            }
        }
    }, [contacts.data]);

    useEffect(() => {
        if (editingContact) {
            setEditAvatar(
                editingContact.avatar_url ||
                    getContactAvatarUrl(editingContact),
            );
        }
    }, [editingContact]);

    // Starred contacts stored in localStorage
    const [starredIds, setStarredIds] = useState<string[]>(() => {
        if (typeof window === 'undefined') return [];
        try {
            const saved = localStorage.getItem('rpk_starred_contacts');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    const toggleStar = (id: string, e?: React.MouseEvent) => {
        e?.stopPropagation();
        setStarredIds((prev) => {
            const next = prev.includes(id)
                ? prev.filter((x) => x !== id)
                : [...prev, id];
            try {
                localStorage.setItem(
                    'rpk_starred_contacts',
                    JSON.stringify(next),
                );
            } catch {
                // ignore
            }
            return next;
        });
    };

    // Ensure selected contact is always in sync with list updates
    useEffect(() => {
        if (contacts.data.length > 0) {
            if (
                !selectedContact ||
                !contacts.data.some((c) => c.id === selectedContact.id)
            ) {
                setSelectedContact(contacts.data[0]);
            } else {
                const refreshed = contacts.data.find(
                    (c) => c.id === selectedContact.id,
                );
                if (refreshed) {
                    setSelectedContact(refreshed);
                }
            }
        } else {
            setSelectedContact(null);
        }
    }, [contacts.data]);

    const handleFilterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const queryParams = new URLSearchParams(window.location.search);
        if (searchQuery.trim()) {
            queryParams.set('search', searchQuery.trim());
        } else {
            queryParams.delete('search');
        }
        router.get(
            contactRoutes.index.url(),
            Object.fromEntries(queryParams.entries()),
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleClientFilter = (clientId: string) => {
        const queryParams = new URLSearchParams(window.location.search);
        if (clientId) {
            queryParams.set('client_id', clientId);
        } else {
            queryParams.delete('client_id');
        }
        router.get(
            contactRoutes.index.url(),
            Object.fromEntries(queryParams.entries()),
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleResetFilters = () => {
        setSearchQuery('');
        setOnlyStarred(false);
        router.get(
            contactRoutes.index.url(),
            {},
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleCopyContact = (contact: Contact) => {
        const text = [
            `Nama: ${contact.full_name}`,
            contact.job_title ? `Jabatan: ${contact.job_title}` : '',
            contact.client
                ? `Klien: ${contact.client.display_name}`
                : contact.organization_name
                  ? `Organisasi: ${contact.organization_name}`
                  : '',
            contact.email ? `Email: ${contact.email}` : '',
            contact.mobile ? `No. Ponsel: ${contact.mobile}` : '',
            contact.phone ? `No. Telepon: ${contact.phone}` : '',
            contact.notes ? `Catatan: ${contact.notes}` : '',
        ]
            .filter(Boolean)
            .join('\n');

        navigator.clipboard.writeText(text);
        setCopiedInfo(true);
        setTimeout(() => setCopiedInfo(false), 2000);
    };

    // Filtered items for starred toggle tab
    const displayedContacts = useMemo(() => {
        if (!onlyStarred) return contacts.data;
        return contacts.data.filter((c) => starredIds.includes(c.id));
    }, [contacts.data, onlyStarred, starredIds]);

    const isCurrentStarred = selectedContact
        ? starredIds.includes(selectedContact.id)
        : false;

    return (
        <>
            <Head title="Direktori Kontak & Perwakilan Stakeholder" />

            <div className="min-h-screen bg-[#fafafc] pb-20 dark:bg-[#0c0d10]">
                <main className="mx-auto max-w-7xl space-y-5 px-4 py-5 sm:px-6 lg:px-8">
                    <ContactsDirectoryHero
                        totalContacts={metrics.total}
                        visibleContacts={contacts.data.length}
                        clientRepresentatives={metrics.client_linked}
                        independentContacts={metrics.independent}
                        connectedClients={metrics.connected_clients}
                        canCreate={can.create}
                        onCreate={() => setOpenCreate(true)}
                    />

                    {/* 3. Filter Bar & View Switcher */}
                    <div className="space-y-2 rounded-xl border border-slate-200/60 bg-slate-50/50 p-2.5 dark:border-white/[0.04] dark:bg-[#121418]">
                        <div className="flex flex-wrap items-center gap-2">
                            {/* Search form */}
                            <form
                                onSubmit={handleFilterSubmit}
                                className="relative min-w-[220px] flex-1"
                            >
                                <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-slate-400" />
                                <Input
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    placeholder="Cari nama personil, jabatan, email, no HP/telepon..."
                                    className="h-8.5 w-full rounded-lg border-slate-200 bg-white pr-8 pl-8 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 dark:border-white/10 dark:bg-zinc-800 dark:text-white"
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSearchQuery('');
                                            const queryParams =
                                                new URLSearchParams(
                                                    window.location.search,
                                                );
                                            queryParams.delete('search');
                                            router.get(
                                                contactRoutes.index.url(),
                                                Object.fromEntries(
                                                    queryParams.entries(),
                                                ),
                                                {
                                                    preserveState: true,
                                                    preserveScroll: true,
                                                },
                                            );
                                        }}
                                        className="absolute top-1/2 right-2.5 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200"
                                    >
                                        <X className="size-3.5" />
                                    </button>
                                )}
                            </form>

                            {/* Client select filter */}
                            <div className="relative min-w-[180px] sm:min-w-[220px]">
                                <select
                                    defaultValue={filters.client_id ?? ''}
                                    onChange={(e) =>
                                        handleClientFilter(e.target.value)
                                    }
                                    className="h-8.5 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white pr-7 pl-2.5 text-xs text-slate-900 outline-none hover:bg-slate-50 focus:border-blue-500 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200"
                                >
                                    <option value="">
                                        Semua Klien &amp; Entitas Terkait
                                    </option>
                                    {clients.map((client) => (
                                        <option
                                            key={client.id}
                                            value={client.id}
                                        >
                                            {client.display_name}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="pointer-events-none absolute top-1/2 right-2 size-3.5 -translate-y-1/2 text-slate-400" />
                            </div>

                            {/* View Switcher: Split Pane (Default) & Table */}
                            <div className="flex items-center gap-0.5 rounded-lg border border-slate-200/70 bg-white p-0.5 dark:border-white/10 dark:bg-zinc-800">
                                <button
                                    type="button"
                                    onClick={() => setViewMode('split')}
                                    className={`flex h-7.5 items-center gap-1.5 rounded-md px-2.5 text-xs font-semibold transition-all ${
                                        viewMode === 'split'
                                            ? 'bg-slate-900 text-white shadow-2xs dark:bg-white dark:text-slate-900'
                                            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-400'
                                    }`}
                                    title="Tampilan Split Master-Detail"
                                >
                                    <Columns2 className="size-3.5" />
                                    <span>Split View</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setViewMode('table')}
                                    className={`flex h-7.5 items-center gap-1.5 rounded-md px-2.5 text-xs font-semibold transition-all ${
                                        viewMode === 'table'
                                            ? 'bg-slate-900 text-white shadow-2xs dark:bg-white dark:text-slate-900'
                                            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-400'
                                    }`}
                                    title="Tampilan Tabel Data"
                                >
                                    <LayoutList className="size-3.5" />
                                    <span>Tabel</span>
                                </button>
                            </div>

                            {(filters.search || filters.client_id) && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={handleResetFilters}
                                    className="h-8.5 shrink-0 rounded-lg border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-300"
                                    title="Reset Semua Filter"
                                >
                                    <RotateCcw className="mr-1 size-3.5 text-slate-400" />
                                    Reset
                                </Button>
                            )}

                            <span className="shrink-0 rounded-md border border-slate-200/70 bg-white px-2.5 py-1.5 font-mono text-[11px] font-semibold text-slate-700 shadow-2xs dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-300">
                                {contacts.total} kontak
                            </span>
                        </div>
                    </div>

                    {/* 4. MAIN CONTENT AREA */}
                    {contacts.data.length === 0 ? (
                        <div className="flex min-h-[360px] items-center justify-center rounded-2xl border border-slate-200/70 bg-white p-8 text-center shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                            <EmptyState
                                icon={UserPlus}
                                title={
                                    filters.search || filters.client_id
                                        ? 'Belum ada kontak yang sesuai pencarian'
                                        : 'Buku Direktori Kontak Kosong'
                                }
                                description={
                                    filters.search || filters.client_id
                                        ? 'Coba sesuaikan kata kunci pencarian atau reset filter untuk melihat semua kontak.'
                                        : 'Simpan data kontak PIC klien, pengacara eksternal, saksi ahli, dan perwakilan hukum di sini.'
                                }
                                action={
                                    <div className="flex flex-wrap items-center justify-center gap-2">
                                        {can.create && (
                                            <Button
                                                type="button"
                                                onClick={() =>
                                                    setOpenCreate(true)
                                                }
                                                className="h-8.5 cursor-pointer rounded-lg bg-blue-600 px-3.5 text-xs font-semibold text-white shadow-2xs hover:bg-blue-700"
                                            >
                                                <Plus className="mr-1 size-3.5" />{' '}
                                                Tambah Kontak Baru
                                            </Button>
                                        )}
                                        {(filters.search ||
                                            filters.client_id) && (
                                            <Button
                                                asChild
                                                variant="outline"
                                                className="h-8.5 rounded-lg border-slate-200 px-3.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-zinc-300"
                                            >
                                                <Link
                                                    href={contactRoutes.index.url()}
                                                >
                                                    Reset Filter
                                                </Link>
                                            </Button>
                                        )}
                                    </div>
                                }
                            />
                        </div>
                    ) : viewMode === 'split' ? (
                        /* ========================================================================= */
                        /* MASTER-DETAIL SPLIT PANE VIEW (MATCHING USER REFERENCE IMAGE)             */
                        /* ========================================================================= */
                        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xs dark:border-white/10 dark:bg-[#14161b]">
                            <div className="flex min-h-[620px] flex-col lg:h-[calc(100vh-270px)] lg:flex-row">
                                {/* LEFT MASTER LIST PANE */}
                                <div
                                    className={`flex w-full shrink-0 flex-col border-r border-slate-200/70 bg-slate-50/40 lg:w-[340px] xl:w-[380px] dark:border-white/[0.08] dark:bg-[#111317] ${
                                        selectedContact
                                            ? 'hidden lg:flex'
                                            : 'flex'
                                    }`}
                                >
                                    {/* Left Pane Search & Filter Tabs */}
                                    <div className="space-y-2 border-b border-slate-200/70 bg-white p-3 dark:border-white/[0.08] dark:bg-[#14161b]">
                                        <div className="relative">
                                            <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-slate-400" />
                                            <Input
                                                value={searchQuery}
                                                onChange={(e) =>
                                                    setSearchQuery(
                                                        e.target.value,
                                                    )
                                                }
                                                onKeyDown={(e) =>
                                                    e.key === 'Enter' &&
                                                    handleFilterSubmit(e)
                                                }
                                                placeholder="Cari Kontak..."
                                                className="h-9 w-full rounded-xl border-slate-200 bg-slate-50/60 pr-3 pl-9 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white dark:border-white/10 dark:bg-zinc-800/80 dark:text-white"
                                            />
                                        </div>

                                        {/* Starred vs All Tabs */}
                                        <div className="flex items-center gap-1">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setOnlyStarred(false)
                                                }
                                                className={`flex-1 rounded-lg py-1 text-center text-[11px] font-semibold transition-all ${
                                                    !onlyStarred
                                                        ? 'bg-slate-900 text-white shadow-2xs dark:bg-white dark:text-slate-900'
                                                        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-zinc-800'
                                                }`}
                                            >
                                                Semua ({contacts.data.length})
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setOnlyStarred(true)
                                                }
                                                className={`flex flex-1 items-center justify-center gap-1 rounded-lg py-1 text-center text-[11px] font-semibold transition-all ${
                                                    onlyStarred
                                                        ? 'bg-slate-900 text-white shadow-2xs dark:bg-white dark:text-slate-900'
                                                        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-zinc-800'
                                                }`}
                                            >
                                                <Star className="size-3 fill-amber-400 text-amber-400" />
                                                Favorit (
                                                {
                                                    contacts.data.filter((c) =>
                                                        starredIds.includes(
                                                            c.id,
                                                        ),
                                                    ).length
                                                }
                                                )
                                            </button>
                                        </div>
                                    </div>

                                    {/* Left Pane Contacts List */}
                                    <div className="flex-1 divide-y divide-slate-100 overflow-y-auto dark:divide-white/[0.04]">
                                        {displayedContacts.length === 0 ? (
                                            <div className="p-6 text-center text-xs text-slate-400 dark:text-zinc-500">
                                                {onlyStarred
                                                    ? 'Belum ada kontak yang ditandai bintang.'
                                                    : 'Tidak ada kontak yang sesuai.'}
                                            </div>
                                        ) : (
                                            displayedContacts.map((contact) => {
                                                const isSelected =
                                                    selectedContact?.id ===
                                                    contact.id;
                                                const isStarred =
                                                    starredIds.includes(
                                                        contact.id,
                                                    );

                                                return (
                                                    <div
                                                        key={contact.id}
                                                        onClick={() =>
                                                            setSelectedContact(
                                                                contact,
                                                            )
                                                        }
                                                        className={`group relative flex cursor-pointer items-center justify-between gap-3 p-3 transition-all ${
                                                            isSelected
                                                                ? 'border-l-4 border-blue-600 bg-blue-50/80 pl-2.5 dark:border-blue-500 dark:bg-blue-950/40'
                                                                : 'hover:bg-white dark:hover:bg-zinc-800/60'
                                                        }`}
                                                    >
                                                        {/* Avatar + Info */}
                                                        <div className="flex min-w-0 flex-1 items-center gap-3">
                                                            <Avatar className="size-10.5 shrink-0 overflow-hidden rounded-full bg-slate-100 shadow-xs dark:bg-zinc-800">
                                                                <AvatarImage
                                                                    src={getContactAvatarUrl(
                                                                        contact,
                                                                    )}
                                                                    alt={
                                                                        contact.full_name
                                                                    }
                                                                    className="size-full object-cover"
                                                                />
                                                                <AvatarFallback className="bg-blue-50 text-xs font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                                                                    {getInitials(
                                                                        contact.full_name,
                                                                    )}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div className="min-w-0 flex-1">
                                                                <h4
                                                                    className={`truncate text-xs leading-snug font-bold ${
                                                                        isSelected
                                                                            ? 'text-blue-900 dark:text-blue-200'
                                                                            : 'text-slate-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400'
                                                                    }`}
                                                                >
                                                                    {
                                                                        contact.full_name
                                                                    }
                                                                </h4>
                                                                <p className="mt-0.5 truncate text-[11px] text-slate-500 dark:text-zinc-400">
                                                                    {contact.job_title ||
                                                                        contact
                                                                            .client
                                                                            ?.display_name ||
                                                                        contact.organization_name ||
                                                                        'Perwakilan'}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Actions: Star + Delete */}
                                                        <div className="flex shrink-0 items-center gap-1">
                                                            <button
                                                                type="button"
                                                                onClick={(e) =>
                                                                    toggleStar(
                                                                        contact.id,
                                                                        e,
                                                                    )
                                                                }
                                                                className={`flex size-7 items-center justify-center rounded-lg transition-all ${
                                                                    isStarred
                                                                        ? 'text-amber-500 hover:text-amber-600'
                                                                        : 'text-slate-300 opacity-60 hover:text-amber-500 hover:opacity-100 dark:text-zinc-600'
                                                                }`}
                                                                title={
                                                                    isStarred
                                                                        ? 'Hapus Bintang'
                                                                        : 'Beri Bintang'
                                                                }
                                                            >
                                                                <Star
                                                                    className={`size-3.5 ${
                                                                        isStarred
                                                                            ? 'fill-amber-400 text-amber-400'
                                                                            : ''
                                                                    }`}
                                                                />
                                                            </button>

                                                            {can.delete && (
                                                                <button
                                                                    type="button"
                                                                    onClick={(
                                                                        e,
                                                                    ) => {
                                                                        e.stopPropagation();
                                                                        setContactToDelete(
                                                                            contact,
                                                                        );
                                                                    }}
                                                                    className="flex size-7 items-center justify-center rounded-lg text-slate-300 opacity-0 transition-all group-hover:opacity-100 hover:bg-rose-50 hover:text-rose-600 dark:text-zinc-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
                                                                    title="Hapus Kontak"
                                                                >
                                                                    <Trash2 className="size-3.5" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>

                                    {/* Left Pane Pagination */}
                                    <div className="border-t border-slate-200/70 bg-white p-2.5 dark:border-white/[0.08] dark:bg-[#14161b]">
                                        <Pagination links={contacts.links} />
                                    </div>
                                </div>

                                {/* RIGHT DETAILS PANE ("Contact Details") */}
                                <div
                                    className={`flex flex-1 flex-col overflow-y-auto bg-white dark:bg-[#14161b] ${
                                        selectedContact
                                            ? 'flex'
                                            : 'hidden lg:flex'
                                    }`}
                                >
                                    {selectedContact ? (
                                        <div className="flex h-full flex-col">
                                            {/* Header Bar: "Contact Details" + Action Icons */}
                                            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-3.5 dark:border-white/[0.06]">
                                                <div className="flex items-center gap-2">
                                                    {/* Mobile Back Button */}
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setSelectedContact(
                                                                null,
                                                            )
                                                        }
                                                        className="flex size-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 lg:hidden dark:border-white/10 dark:text-zinc-300"
                                                    >
                                                        <ArrowLeft className="size-4" />
                                                    </button>
                                                    <h2 className="text-sm font-bold text-slate-900 sm:text-base dark:text-white">
                                                        Rincian Informasi Kontak
                                                    </h2>
                                                </div>

                                                {/* Top Right Action Icons */}
                                                <div className="flex items-center gap-0.5">
                                                    {/* Star Toggle */}
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            toggleStar(
                                                                selectedContact.id,
                                                            )
                                                        }
                                                        className={`flex size-8 items-center justify-center rounded-lg transition-all ${
                                                            isCurrentStarred
                                                                ? 'text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/30'
                                                                : 'text-slate-400 hover:bg-slate-100 hover:text-amber-500 dark:hover:bg-zinc-800'
                                                        }`}
                                                        title={
                                                            isCurrentStarred
                                                                ? 'Hapus Bintang'
                                                                : 'Tandai Favorit'
                                                        }
                                                    >
                                                        <Star
                                                            className={`size-4 ${
                                                                isCurrentStarred
                                                                    ? 'fill-amber-400 text-amber-400'
                                                                    : ''
                                                            }`}
                                                        />
                                                    </button>

                                                    {/* Edit Pencil */}
                                                    {can.update && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setEditingContact(
                                                                    selectedContact,
                                                                )
                                                            }
                                                            className="flex size-8 items-center justify-center rounded-lg text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-zinc-800 dark:hover:text-white"
                                                            title="Edit Data Kontak"
                                                        >
                                                            <Pencil className="size-3.5" />
                                                        </button>
                                                    )}

                                                    {/* Delete Trash */}
                                                    {can.delete && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setContactToDelete(
                                                                    selectedContact,
                                                                )
                                                            }
                                                            className="flex size-8 items-center justify-center rounded-lg text-slate-400 transition-all hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30 dark:hover:text-rose-400"
                                                            title="Hapus Kontak"
                                                        >
                                                            <Trash2 className="size-3.5" />
                                                        </button>
                                                    )}

                                                    {/* Copy Info */}
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleCopyContact(
                                                                selectedContact,
                                                            )
                                                        }
                                                        className="flex size-8 items-center justify-center rounded-lg text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-zinc-800 dark:hover:text-white"
                                                        title="Salin Rincian Kontak"
                                                    >
                                                        {copiedInfo ? (
                                                            <Check className="size-3.5 text-emerald-600" />
                                                        ) : (
                                                            <Copy className="size-3.5" />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Profile Content Body */}
                                            <div className="flex-1 space-y-6 px-6 py-5">
                                                {/* Hero Profile: Avatar, Name, Title, Company */}
                                                <div className="flex items-center gap-4">
                                                    <Avatar className="size-16 shrink-0 overflow-hidden rounded-full border-2 border-white bg-slate-100 shadow-xs sm:size-18 dark:border-zinc-800 dark:bg-zinc-800">
                                                        <AvatarImage
                                                            src={getContactAvatarUrl(
                                                                selectedContact,
                                                            )}
                                                            alt={
                                                                selectedContact.full_name
                                                            }
                                                            className="size-full object-cover"
                                                        />
                                                        <AvatarFallback className="bg-blue-50 text-lg font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                                                            {getInitials(
                                                                selectedContact.full_name,
                                                            )}
                                                        </AvatarFallback>
                                                    </Avatar>

                                                    <div className="min-w-0 space-y-0.5">
                                                        <h3 className="text-base leading-tight font-bold text-slate-900 sm:text-lg dark:text-white">
                                                            {
                                                                selectedContact.full_name
                                                            }
                                                        </h3>

                                                        <p className="text-xs font-medium text-slate-600 dark:text-zinc-300">
                                                            {selectedContact.job_title ||
                                                                'Perwakilan Stakeholder'}
                                                        </p>

                                                        {selectedContact.client ? (
                                                            <Link
                                                                href={clientRoutes.show.url(
                                                                    selectedContact
                                                                        .client
                                                                        .id,
                                                                )}
                                                                className="inline-flex items-center gap-1 pt-0.5 text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400"
                                                            >
                                                                <Building2 className="size-3" />
                                                                <span>
                                                                    {
                                                                        selectedContact
                                                                            .client
                                                                            .display_name
                                                                    }
                                                                </span>
                                                                <ExternalLink className="size-2.5" />
                                                            </Link>
                                                        ) : (
                                                            <p className="pt-0.5 text-xs text-slate-400 dark:text-zinc-500">
                                                                {selectedContact.organization_name ||
                                                                    'Independen / Perseorangan'}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Structured 2-Column Info Grid */}
                                                <div className="grid grid-cols-1 gap-x-8 gap-y-4 border-t border-slate-100 pt-4 sm:grid-cols-2 dark:border-white/[0.06]">
                                                    {/* Phone Number */}
                                                    <div className="space-y-0.5">
                                                        <span className="text-[11px] font-medium text-slate-400 dark:text-zinc-500">
                                                            Nomor Telepon / HP
                                                        </span>
                                                        <div>
                                                            {selectedContact.mobile ||
                                                            selectedContact.phone ? (
                                                                <a
                                                                    href={`tel:${selectedContact.mobile || selectedContact.phone}`}
                                                                    className="font-mono text-xs font-semibold text-slate-900 hover:text-blue-600 sm:text-sm dark:text-white dark:hover:text-blue-400"
                                                                >
                                                                    {selectedContact.mobile ||
                                                                        selectedContact.phone}
                                                                </a>
                                                            ) : (
                                                                <span className="text-xs text-slate-400 dark:text-zinc-600">
                                                                    Tidak
                                                                    tercatat
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Email Address */}
                                                    <div className="space-y-0.5">
                                                        <span className="text-[11px] font-medium text-slate-400 dark:text-zinc-500">
                                                            Alamat Email
                                                        </span>
                                                        <div>
                                                            {selectedContact.email ? (
                                                                <a
                                                                    href={`mailto:${selectedContact.email}`}
                                                                    className="font-mono text-xs font-semibold break-all text-slate-900 hover:text-blue-600 sm:text-sm dark:text-white dark:hover:text-blue-400"
                                                                >
                                                                    {
                                                                        selectedContact.email
                                                                    }
                                                                </a>
                                                            ) : (
                                                                <span className="text-xs text-slate-400 dark:text-zinc-600">
                                                                    Tidak
                                                                    tercatat
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Address */}
                                                    <div className="space-y-0.5">
                                                        <span className="text-[11px] font-medium text-slate-400 dark:text-zinc-500">
                                                            Alamat Domisili
                                                        </span>
                                                        <p className="text-xs font-semibold text-slate-900 sm:text-sm dark:text-white">
                                                            {selectedContact
                                                                .client
                                                                ?.address ||
                                                                'Kantor Pusat / Sesuai Domisili Klien'}
                                                        </p>
                                                    </div>

                                                    {/* Department */}
                                                    <div className="space-y-0.5">
                                                        <span className="text-[11px] font-medium text-slate-400 dark:text-zinc-500">
                                                            Departemen / Posisi
                                                        </span>
                                                        <p className="text-xs font-semibold text-slate-900 sm:text-sm dark:text-white">
                                                            {selectedContact.job_title ||
                                                                'General Legal / Manajemen'}
                                                        </p>
                                                    </div>

                                                    {/* Company */}
                                                    <div className="space-y-0.5 sm:col-span-2">
                                                        <span className="text-[11px] font-medium text-slate-400 dark:text-zinc-500">
                                                            Perusahaan / Entitas
                                                            Klien
                                                        </span>
                                                        <p className="text-xs font-semibold text-slate-900 sm:text-sm dark:text-white">
                                                            {selectedContact
                                                                .client
                                                                ?.display_name ||
                                                                selectedContact.organization_name ||
                                                                'Pihak Independen / Non-Korporasi'}
                                                        </p>
                                                    </div>

                                                    {/* Notes */}
                                                    <div className="space-y-1 pt-1 sm:col-span-2">
                                                        <span className="text-[11px] font-medium text-slate-400 dark:text-zinc-500">
                                                            Catatan Khusus
                                                        </span>
                                                        <div className="rounded-lg border border-slate-100 bg-slate-50/60 p-3 text-xs leading-relaxed text-slate-700 dark:border-white/[0.04] dark:bg-[#121418] dark:text-zinc-300">
                                                            {selectedContact.notes ||
                                                                'Belum ada catatan preferensi komunikasi atau arahan khusus untuk kontak ini.'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Footer Bar */}
                                            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/30 px-6 py-3.5 dark:border-white/[0.06] dark:bg-[#121418]">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    {selectedContact.email && (
                                                        <Button
                                                            size="sm"
                                                            className="h-8 rounded-lg bg-blue-600 px-3 text-xs font-semibold text-white shadow-2xs hover:bg-blue-700"
                                                            asChild
                                                        >
                                                            <a
                                                                href={`mailto:${selectedContact.email}`}
                                                            >
                                                                <Mail className="mr-1.5 size-3.5" />
                                                                Kirim Email
                                                            </a>
                                                        </Button>
                                                    )}

                                                    {(selectedContact.mobile ||
                                                        selectedContact.phone) && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="h-8 rounded-lg border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-[#16181d] dark:text-zinc-200"
                                                            asChild
                                                        >
                                                            <a
                                                                href={`tel:${selectedContact.mobile || selectedContact.phone}`}
                                                            >
                                                                <Phone className="mr-1.5 size-3.5 text-emerald-600" />
                                                                Hubungi Telepon
                                                            </a>
                                                        </Button>
                                                    )}
                                                </div>

                                                {can.update && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            setEditingContact(
                                                                selectedContact,
                                                            )
                                                        }
                                                        className="h-8 rounded-lg border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-[#16181d] dark:text-zinc-200"
                                                    >
                                                        <Pencil className="mr-1.5 size-3.5 text-slate-400" />
                                                        Edit Kontak
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-1 items-center justify-center p-8 text-center">
                                            <EmptyState
                                                icon={User}
                                                title="Pilih Kontak"
                                                description="Pilih salah satu kontak dari daftar di sebelah kiri untuk melihat rincian informasi profil."
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Precision Data Table View */
                        <div className="overflow-hidden rounded-xl border border-slate-200/70 bg-white shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead>
                                        <tr className="border-b border-slate-100 bg-slate-50/60 text-[10px] font-semibold text-slate-500 uppercase dark:border-white/[0.04] dark:bg-[#121418]">
                                            <th className="py-2.5 pr-3 pl-4 font-semibold">
                                                Kontak &amp; Jabatan
                                            </th>
                                            <th className="px-3 py-2.5 font-semibold">
                                                Entitas / Klien
                                            </th>
                                            <th className="px-3 py-2.5 font-semibold">
                                                Email
                                            </th>
                                            <th className="px-3 py-2.5 font-semibold">
                                                No. Telepon / HP
                                            </th>
                                            <th className="px-3 py-2.5 font-semibold">
                                                Catatan
                                            </th>
                                            <th className="py-2.5 pr-4 pl-1 text-right font-semibold"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                                        {contacts.data.map((contact) => (
                                            <tr
                                                key={contact.id}
                                                className="group transition-colors hover:bg-slate-50/50 dark:hover:bg-white/[0.02]"
                                            >
                                                <td className="py-2.5 pr-3 pl-4">
                                                    <div
                                                        onClick={() => {
                                                            setSelectedContact(
                                                                contact,
                                                            );
                                                            setViewMode(
                                                                'split',
                                                            );
                                                        }}
                                                        className="flex cursor-pointer items-center gap-2.5"
                                                    >
                                                        <Avatar className="size-8 shrink-0 overflow-hidden rounded-full bg-slate-100 shadow-xs dark:bg-zinc-800">
                                                            <AvatarImage
                                                                src={getContactAvatarUrl(
                                                                    contact,
                                                                )}
                                                                alt={
                                                                    contact.full_name
                                                                }
                                                                className="size-full object-cover"
                                                            />
                                                            <AvatarFallback className="bg-blue-50 text-[10px] font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                                                                {getInitials(
                                                                    contact.full_name,
                                                                )}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="min-w-0">
                                                            <span className="truncate text-xs font-semibold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                                                                {
                                                                    contact.full_name
                                                                }
                                                            </span>
                                                            <p className="truncate text-[10px] text-slate-500 dark:text-zinc-400">
                                                                {contact.job_title ??
                                                                    'Perwakilan'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-3 py-2.5 whitespace-nowrap">
                                                    {contact.client ? (
                                                        <Link
                                                            href={clientRoutes.show.url(
                                                                contact.client
                                                                    .id,
                                                            )}
                                                            className="inline-flex max-w-[200px] items-center gap-1 truncate rounded-md bg-blue-50/80 px-2 py-0.5 text-[10px] font-semibold text-blue-700 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-300"
                                                        >
                                                            <Building2 className="size-3 shrink-0" />
                                                            <span className="truncate">
                                                                {
                                                                    contact
                                                                        .client
                                                                        .display_name
                                                                }
                                                            </span>
                                                        </Link>
                                                    ) : contact.organization_name ? (
                                                        <span className="inline-flex max-w-[200px] items-center gap-1 truncate rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700 dark:bg-white/[0.06] dark:text-zinc-300">
                                                            <Building2 className="size-3 shrink-0" />
                                                            <span className="truncate">
                                                                {
                                                                    contact.organization_name
                                                                }
                                                            </span>
                                                        </span>
                                                    ) : (
                                                        <span className="text-[10px] text-slate-400">
                                                            Independen
                                                        </span>
                                                    )}
                                                </td>

                                                <td className="px-3 py-2.5 whitespace-nowrap">
                                                    {contact.email ? (
                                                        <a
                                                            href={`mailto:${contact.email}`}
                                                            className="flex items-center gap-1 text-[11px] text-slate-600 hover:text-blue-600 dark:text-zinc-300 dark:hover:text-blue-400"
                                                        >
                                                            <Mail className="size-3 shrink-0 text-slate-400" />
                                                            <span>
                                                                {contact.email}
                                                            </span>
                                                        </a>
                                                    ) : (
                                                        <span className="font-mono text-slate-400">
                                                            -
                                                        </span>
                                                    )}
                                                </td>

                                                <td className="px-3 py-2.5 font-mono text-[11px] whitespace-nowrap text-slate-700 dark:text-zinc-300">
                                                    {contact.mobile ||
                                                    contact.phone ? (
                                                        <a
                                                            href={`tel:${contact.mobile || contact.phone}`}
                                                            className="flex items-center gap-1 hover:text-emerald-600 dark:hover:text-emerald-400"
                                                        >
                                                            <Phone className="size-3 shrink-0 text-slate-400" />
                                                            <span>
                                                                {contact.mobile ||
                                                                    contact.phone}
                                                            </span>
                                                        </a>
                                                    ) : (
                                                        <span className="text-slate-400">
                                                            -
                                                        </span>
                                                    )}
                                                </td>

                                                <td className="max-w-xs truncate px-3 py-2.5 text-[11px] text-slate-500 dark:text-zinc-400">
                                                    {contact.notes || '-'}
                                                </td>

                                                <td className="py-2.5 pr-4 pl-1 text-right whitespace-nowrap">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => {
                                                            setSelectedContact(
                                                                contact,
                                                            );
                                                            setViewMode(
                                                                'split',
                                                            );
                                                        }}
                                                        className="h-7 px-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-300 dark:hover:bg-white/[0.06]"
                                                    >
                                                        Detail
                                                        <ChevronRight className="ml-0.5 size-3 text-slate-400" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex flex-col justify-between gap-3 border-t border-slate-100 bg-slate-50/50 px-4 py-2.5 sm:flex-row sm:items-center dark:border-white/[0.04] dark:bg-[#121418]">
                                <span className="text-xs text-slate-500 dark:text-zinc-400">
                                    Menampilkan{' '}
                                    <span className="font-semibold text-slate-900 dark:text-white">
                                        {contacts.data.length}
                                    </span>{' '}
                                    dari{' '}
                                    <span className="font-semibold text-slate-900 dark:text-white">
                                        {contacts.total}
                                    </span>{' '}
                                    kontak
                                </span>
                                <Pagination links={contacts.links} />
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* Modal Dialog: Tambah Kontak Baru */}
            <Dialog open={openCreate} onOpenChange={setOpenCreate}>
                <DialogContent className="max-h-[88vh] overflow-y-auto rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xl sm:max-w-lg sm:p-6 dark:border-white/10 dark:bg-[#14161b]">
                    <DialogHeader className="border-b border-slate-100 pb-3.5 dark:border-white/[0.06]">
                        <div className="flex items-center gap-2.5">
                            <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                                <UserPlus className="size-4" />
                            </div>
                            <div>
                                <DialogTitle className="text-sm font-bold text-slate-900 sm:text-base dark:text-white">
                                    Tambah Kontak Baru
                                </DialogTitle>
                                <DialogDescription className="text-xs text-slate-500 dark:text-zinc-400">
                                    Daftarkan representasi klien, saksi ahli,
                                    pengacara rekanan, atau stakeholder.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <Form
                        action={contactRoutes.store.url()}
                        method="post"
                        className="space-y-4 pt-1"
                        resetOnSuccess
                        onSuccess={() => setOpenCreate(false)}
                    >
                        {({ errors, processing }) => (
                            <>
                                {/* Avatar Selector */}
                                <AvatarPicker
                                    value={createAvatar}
                                    onChange={setCreateAvatar}
                                    contactName="Kontak Baru"
                                />

                                <div className="grid gap-3 sm:grid-cols-2">
                                    <Field
                                        label="Nama Depan"
                                        name="first_name"
                                        error={errors.first_name}
                                        placeholder="Nama depan"
                                        required
                                    />
                                    <Field
                                        label="Nama Belakang"
                                        name="last_name"
                                        error={errors.last_name}
                                        placeholder="Nama belakang"
                                    />
                                </div>

                                <div className="grid gap-1">
                                    <Label
                                        htmlFor="client_id"
                                        className="text-xs font-semibold text-slate-700 dark:text-zinc-300"
                                    >
                                        Terhubung ke Klien (Opsional)
                                    </Label>
                                    <div className="relative">
                                        <select
                                            id="client_id"
                                            name="client_id"
                                            className="h-8.5 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-slate-50/70 pr-7 pl-2.5 text-xs font-medium text-slate-900 outline-hidden transition-colors hover:bg-slate-100 focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-zinc-200"
                                        >
                                            <option value="">
                                                Independen / Tanpa Relasi Klien
                                                Khusus
                                            </option>
                                            {clients.map((client) => (
                                                <option
                                                    key={client.id}
                                                    value={client.id}
                                                >
                                                    {client.display_name}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="pointer-events-none absolute top-1/2 right-2 size-3.5 -translate-y-1/2 text-slate-400" />
                                    </div>
                                    <InputError message={errors.client_id} />
                                </div>

                                <div className="grid gap-3 sm:grid-cols-2">
                                    <Field
                                        label="Jabatan / Posisi"
                                        name="job_title"
                                        error={errors.job_title}
                                        placeholder="Contoh: Legal Counsel, Direktur"
                                    />
                                    <Field
                                        label="Organisasi / Lembaga"
                                        name="organization_name"
                                        error={errors.organization_name}
                                        placeholder="Nama entitas jika non-klien"
                                    />
                                </div>

                                <div className="grid gap-3 sm:grid-cols-2">
                                    <Field
                                        label="Email"
                                        name="email"
                                        type="email"
                                        error={errors.email}
                                        placeholder="nama@email.com"
                                    />
                                    <Field
                                        label="No. HP / Ponsel"
                                        name="mobile"
                                        error={errors.mobile}
                                        placeholder="+62 812-xxxx-xxxx"
                                    />
                                </div>

                                <div className="grid gap-1">
                                    <Label
                                        htmlFor="notes"
                                        className="text-xs font-semibold text-slate-700 dark:text-zinc-300"
                                    >
                                        Catatan Tambahan
                                    </Label>
                                    <textarea
                                        id="notes"
                                        name="notes"
                                        rows={2}
                                        placeholder="Keterangan preferensi komunikasi atau arahan khusus..."
                                        className="w-full rounded-lg border border-slate-200 bg-slate-50/70 p-2.5 text-xs leading-relaxed text-slate-900 outline-hidden transition-colors focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
                                    />
                                    <InputError message={errors.notes} />
                                </div>

                                <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3.5 dark:border-white/[0.06]">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setOpenCreate(false)}
                                        className="h-8.5 rounded-lg border-slate-200 px-3.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-zinc-300"
                                    >
                                        Batal
                                    </Button>
                                    <Button
                                        size="sm"
                                        disabled={processing}
                                        className="h-8.5 rounded-lg bg-blue-600 px-4 text-xs font-semibold text-white shadow-2xs hover:bg-blue-700 active:scale-95 disabled:opacity-50"
                                    >
                                        {processing ? (
                                            <>
                                                <Spinner className="mr-1.5 size-3" />
                                                Menyimpan...
                                            </>
                                        ) : (
                                            'Simpan Kontak'
                                        )}
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                </DialogContent>
            </Dialog>

            {/* Modal Dialog: Edit Kontak In-Place */}
            <Dialog
                open={!!editingContact}
                onOpenChange={(open) => !open && setEditingContact(null)}
            >
                {editingContact && (
                    <DialogContent className="max-h-[88vh] overflow-y-auto rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xl sm:max-w-lg sm:p-6 dark:border-white/10 dark:bg-[#14161b]">
                        <DialogHeader className="border-b border-slate-100 pb-3.5 dark:border-white/[0.06]">
                            <div className="flex items-center gap-2.5">
                                <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                                    <Pencil className="size-4" />
                                </div>
                                <div>
                                    <DialogTitle className="text-sm font-bold text-slate-900 sm:text-base dark:text-white">
                                        Edit Data Kontak
                                    </DialogTitle>
                                    <DialogDescription className="text-xs text-slate-500 dark:text-zinc-400">
                                        Perbarui foto profil, identitas, dan
                                        detail perwakilan.
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>

                        <Form
                            action={contactRoutes.update.url(editingContact.id)}
                            method="put"
                            className="space-y-4 pt-1"
                            onSuccess={() => setEditingContact(null)}
                        >
                            {({ errors, processing }) => (
                                <>
                                    {/* Avatar Selector */}
                                    <AvatarPicker
                                        value={editAvatar}
                                        onChange={setEditAvatar}
                                        contactName={editingContact.full_name}
                                    />

                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <Field
                                            label="Nama Depan"
                                            name="first_name"
                                            defaultValue={
                                                editingContact.first_name
                                            }
                                            error={errors.first_name}
                                            required
                                        />
                                        <Field
                                            label="Nama Belakang"
                                            name="last_name"
                                            defaultValue={
                                                editingContact.last_name
                                            }
                                            error={errors.last_name}
                                        />
                                    </div>

                                    <div className="grid gap-1">
                                        <Label
                                            htmlFor="client_id_edit"
                                            className="text-xs font-semibold text-slate-700 dark:text-zinc-300"
                                        >
                                            Terhubung ke Klien
                                        </Label>
                                        <div className="relative">
                                            <select
                                                id="client_id_edit"
                                                name="client_id"
                                                defaultValue={
                                                    editingContact.client?.id ??
                                                    ''
                                                }
                                                className="h-8.5 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-slate-50/70 pr-7 pl-2.5 text-xs font-medium text-slate-900 outline-hidden transition-colors hover:bg-slate-100 focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-zinc-200"
                                            >
                                                <option value="">
                                                    Independen / Tanpa Relasi
                                                    Klien Khusus
                                                </option>
                                                {clients.map((client) => (
                                                    <option
                                                        key={client.id}
                                                        value={client.id}
                                                    >
                                                        {client.display_name}
                                                    </option>
                                                ))}
                                            </select>
                                            <ChevronDown className="pointer-events-none absolute top-1/2 right-2 size-3.5 -translate-y-1/2 text-slate-400" />
                                        </div>
                                        <InputError
                                            message={errors.client_id}
                                        />
                                    </div>

                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <Field
                                            label="Jabatan / Posisi"
                                            name="job_title"
                                            defaultValue={
                                                editingContact.job_title
                                            }
                                            error={errors.job_title}
                                        />
                                        <Field
                                            label="Organisasi / Lembaga"
                                            name="organization_name"
                                            defaultValue={
                                                editingContact.organization_name
                                            }
                                            error={errors.organization_name}
                                        />
                                    </div>

                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <Field
                                            label="Email"
                                            name="email"
                                            type="email"
                                            defaultValue={editingContact.email}
                                            error={errors.email}
                                        />
                                        <Field
                                            label="No. HP / Ponsel"
                                            name="mobile"
                                            defaultValue={editingContact.mobile}
                                            error={errors.mobile}
                                        />
                                    </div>

                                    <div className="grid gap-1">
                                        <Label
                                            htmlFor="notes_edit"
                                            className="text-xs font-semibold text-slate-700 dark:text-zinc-300"
                                        >
                                            Catatan Tambahan
                                        </Label>
                                        <textarea
                                            id="notes_edit"
                                            name="notes"
                                            rows={2}
                                            defaultValue={editingContact.notes}
                                            placeholder="Keterangan preferensi komunikasi..."
                                            className="w-full rounded-lg border border-slate-200 bg-slate-50/70 p-2.5 text-xs leading-relaxed text-slate-900 outline-hidden transition-colors focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
                                        />
                                        <InputError message={errors.notes} />
                                    </div>

                                    <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3.5 dark:border-white/[0.06]">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                setEditingContact(null)
                                            }
                                            className="h-8.5 rounded-lg border-slate-200 px-3.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-zinc-300"
                                        >
                                            Batal
                                        </Button>
                                        <Button
                                            size="sm"
                                            disabled={processing}
                                            className="h-8.5 rounded-lg bg-blue-600 px-4 text-xs font-semibold text-white shadow-2xs hover:bg-blue-700 active:scale-95 disabled:opacity-50"
                                        >
                                            {processing ? (
                                                <>
                                                    <Spinner className="mr-1.5 size-3" />
                                                    Menyimpan...
                                                </>
                                            ) : (
                                                'Simpan Perubahan'
                                            )}
                                        </Button>
                                    </div>
                                </>
                            )}
                        </Form>
                    </DialogContent>
                )}
            </Dialog>

            {/* Modal Konfirmasi Hapus Kontak */}
            <ConfirmDialog
                open={!!contactToDelete}
                onOpenChange={(open) => !open && setContactToDelete(null)}
                title="Hapus Kontak"
                description={
                    contactToDelete
                        ? `Apakah Anda yakin ingin menghapus data kontak "${contactToDelete.full_name || contactToDelete.first_name}"?`
                        : ''
                }
                confirmLabel="Hapus Kontak"
                variant="danger"
                processing={isDeletingContact}
                onConfirm={() => {
                    if (!contactToDelete) return;
                    setIsDeletingContact(true);
                    router.delete(`/contacts/${contactToDelete.id}`, {
                        onFinish: () => {
                            setIsDeletingContact(false);
                            setContactToDelete(null);
                            if (selectedContact?.id === contactToDelete.id) {
                                setSelectedContact(null);
                            }
                        },
                    });
                }}
            />
        </>
    );
}

function AvatarPicker({
    value,
    onChange,
    name = 'avatar_url',
    contactName = 'Kontak',
}: {
    value: string;
    onChange: (url: string) => void;
    name?: string;
    contactName?: string;
}) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-3 transition-all dark:border-white/10 dark:bg-[#121418]">
            <input type="hidden" name={name} value={value} />

            {/* Header: Compact preview + toggle button */}
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div
                        className="group relative cursor-pointer"
                        onClick={() => setIsOpen(!isOpen)}
                        title="Klik untuk membuka pilihan avatar"
                    >
                        <Avatar className="size-11 shrink-0 overflow-hidden rounded-full border-2 border-white bg-white shadow-xs ring-1 ring-slate-200/80 transition-transform group-hover:scale-105 dark:border-zinc-800 dark:bg-zinc-800 dark:ring-white/10">
                            <AvatarImage
                                src={value || '/images/avatars/avatar-1.svg'}
                                alt={contactName}
                                className="size-full object-cover"
                            />
                            <AvatarFallback className="bg-blue-50 text-xs font-bold text-blue-700">
                                {getInitials(contactName)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                            <Pencil className="size-3 text-white" />
                        </div>
                    </div>
                    <div>
                        <Label
                            className="cursor-pointer text-xs font-bold text-slate-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            Foto Profil Kontak
                        </Label>
                        <p className="mt-0.5 text-[11px] text-slate-500 dark:text-zinc-400">
                            {isOpen
                                ? 'Pilih salah satu karakter di bawah'
                                : 'Avatar 3D aktif · Klik untuk mengganti'}
                        </p>
                    </div>
                </div>

                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsOpen(!isOpen)}
                    className={`h-7.5 gap-1.5 rounded-lg border-slate-200 px-2.5 text-xs font-medium transition-colors hover:bg-slate-100 dark:border-white/10 dark:hover:bg-zinc-800 ${
                        isOpen
                            ? 'border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-400'
                            : 'text-slate-700 dark:text-zinc-300'
                    }`}
                >
                    <Camera className="size-3.5 text-blue-600 dark:text-blue-400" />
                    <span>{isOpen ? 'Tutup' : 'Pilih Avatar'}</span>
                    <ChevronDown
                        className={`size-3 text-slate-400 transition-transform duration-200 ${
                            isOpen ? 'rotate-180 text-blue-500' : ''
                        }`}
                    />
                </Button>
            </div>

            {/* Collapsible Avatar Gallery */}
            {isOpen && (
                <div className="mt-2.5 border-t border-slate-200/70 pt-2.5 dark:border-white/[0.06]">
                    <div className="mb-2 flex items-center justify-between px-0.5">
                        <span className="text-[11px] font-semibold text-slate-600 dark:text-zinc-300">
                            Koleksi Karakter 3D (1 - 15):
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-zinc-500">
                            Klik untuk memilih
                        </span>
                    </div>
                    <div className="grid grid-cols-5 gap-1.5 rounded-lg bg-slate-100/60 p-1.5 sm:grid-cols-8 dark:bg-zinc-900/60">
                        {AVAILABLE_AVATARS.map((avatar, idx) => {
                            const isSelected =
                                value === avatar.url || (!value && idx === 0);
                            return (
                                <button
                                    key={avatar.id}
                                    type="button"
                                    onClick={() => {
                                        onChange(avatar.url);
                                    }}
                                    className={`group relative flex size-9 items-center justify-center rounded-full p-0.5 transition-all sm:size-9.5 ${
                                        isSelected
                                            ? 'scale-105 bg-white shadow-xs ring-2 ring-blue-600 ring-offset-2 dark:bg-blue-950 dark:ring-offset-[#121418]'
                                            : 'opacity-75 hover:scale-105 hover:bg-white/80 hover:opacity-100 dark:hover:bg-zinc-800'
                                    }`}
                                    title={`Avatar ${idx + 1}`}
                                >
                                    <img
                                        src={avatar.url}
                                        alt={avatar.label}
                                        className="size-full rounded-full object-cover shadow-2xs"
                                    />
                                    {isSelected && (
                                        <span className="absolute -right-0.5 -bottom-0.5 flex size-3.5 items-center justify-center rounded-full bg-blue-600 text-white shadow-xs">
                                            <Check className="size-2.5 stroke-[3]" />
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

function Field({
    label,
    name,
    defaultValue,
    error,
    className,
    type = 'text',
    placeholder,
    required = false,
}: {
    label: string;
    name: string;
    defaultValue?: string;
    error?: string;
    className?: string;
    type?: string;
    placeholder?: string;
    required?: boolean;
}) {
    return (
        <div className={`grid gap-1 ${className ?? ''}`}>
            <Label
                htmlFor={name}
                className="text-xs font-semibold text-slate-700 dark:text-zinc-300"
            >
                {label} {required && <span className="text-rose-500">*</span>}
            </Label>
            <Input
                id={name}
                name={name}
                type={type}
                defaultValue={defaultValue}
                required={required}
                placeholder={placeholder}
                className="h-8.5 rounded-lg border-slate-200 bg-slate-50/70 text-xs text-slate-900 transition-colors placeholder:text-slate-400 focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
            />
            <InputError message={error} />
        </div>
    );
}

ContactsIndex.layout = {
    breadcrumbs: [{ title: 'Kontak', href: contactRoutes.index.url() }],
};
