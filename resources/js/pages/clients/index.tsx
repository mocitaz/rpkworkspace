import { Form, Head, Link } from '@inertiajs/react';
import {
    Briefcase,
    Building2,
    ChevronDown,
    ChevronRight,
    Plus,
    Search,
    UserCheck,
    Users,
} from 'lucide-react';
import { EmptyState } from '@/components/empty-state';
import { Pagination } from '@/components/pagination';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import * as clientRoutes from '@/routes/clients';

type Client = {
    id: string;
    client_number: string;
    display_name: string;
    type: string;
    industry?: string;
    status: string;
    contacts_count: number;
    matters_count: number;
    relationship_partner?: {
        id?: number;
        name: string;
        position_title?: string;
        avatar_url?: string | null;
    };
};

type Page = {
    data: Client[];
    links: { url: string | null; label: string; active: boolean }[];
    total: number;
};

export default function ClientsIndex({
    clients,
    filters,
    can,
}: {
    clients: Page;
    filters: Record<string, string>;
    can: { create: boolean };
}) {
    const activeClientsCount = clients.data.filter((c) => c.status === 'active').length;
    const totalMattersCount = clients.data.reduce((acc, c) => acc + (c.matters_count || 0), 0);
    const totalContactsCount = clients.data.reduce((acc, c) => acc + (c.contacts_count || 0), 0);

    return (
        <>
            <Head title="Klien" />

            <div className="min-h-screen w-full bg-[#fbfbfa] text-[#111111] antialiased dark:bg-[#121212] dark:text-[#fbfbfa]">
                <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
                    {/* Notion Minimalist Page Header */}
                    <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div className="space-y-1">
                            <h1 className="text-2xl font-bold tracking-tight text-[#111111] dark:text-white">
                                Klien
                            </h1>
                            <p className="text-xs text-[#787774] dark:text-zinc-400">
                                Direktori seluruh profil korporasi & individu klien, kontak perwakilan, serta riwayat perkara.
                            </p>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex shrink-0 items-center gap-2">
                            {can.create && (
                                <Button
                                    className="h-8 rounded-lg bg-[#111111] px-3.5 text-xs font-semibold text-white shadow-2xs transition-colors hover:bg-black active:scale-95 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                                    asChild
                                >
                                    <Link href={clientRoutes.create()}>
                                        <Plus className="mr-1.5 size-3.5" />
                                        Buat Klien
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </header>

                    {/* Compact 4-Column Stat Strip (h-[76px]) */}
                    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {/* 1. Total Klien */}
                        <div className="flex h-[76px] flex-col justify-between rounded-xl border border-black/[0.07] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                            <div className="flex items-center justify-between text-[11px] font-medium text-[#787774] dark:text-zinc-400">
                                <span>Total Portofolio</span>
                                <Building2 className="size-3.5 text-[#1f6c9f] dark:text-sky-400" />
                            </div>
                            <div className="flex items-baseline justify-between">
                                <span className="font-mono text-lg font-bold tracking-tight text-[#111111] dark:text-white">
                                    {clients.total}
                                </span>
                                <span className="text-[10px] text-[#787774] dark:text-zinc-400">
                                    entitas terdaftar
                                </span>
                            </div>
                        </div>

                        {/* 2. Klien Aktif */}
                        <div className="flex h-[76px] flex-col justify-between rounded-xl border border-black/[0.07] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                            <div className="flex items-center justify-between text-[11px] font-medium text-[#787774] dark:text-zinc-400">
                                <span>Klien Aktif</span>
                                <span className="size-2 rounded-full bg-emerald-500" />
                            </div>
                            <div className="flex items-baseline justify-between">
                                <span className="font-mono text-lg font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                                    {activeClientsCount}
                                </span>
                                <span className="text-[10px] text-[#787774] dark:text-zinc-400">
                                    status aktif
                                </span>
                            </div>
                        </div>

                        {/* 3. Total Matter Klien */}
                        <div className="flex h-[76px] flex-col justify-between rounded-xl border border-black/[0.07] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                            <div className="flex items-center justify-between text-[11px] font-medium text-[#787774] dark:text-zinc-400">
                                <span>Perkara Terkait</span>
                                <Briefcase className="size-3.5 text-[#956400] dark:text-amber-400" />
                            </div>
                            <div className="flex items-baseline justify-between">
                                <span className="font-mono text-lg font-bold tracking-tight text-[#111111] dark:text-white">
                                    {totalMattersCount}
                                </span>
                                <span className="text-[10px] text-[#787774] dark:text-zinc-400">
                                    total perkara
                                </span>
                            </div>
                        </div>

                        {/* 4. Kontak Representatif */}
                        <div className="flex h-[76px] flex-col justify-between rounded-xl border border-black/[0.07] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                            <div className="flex items-center justify-between text-[11px] font-medium text-[#787774] dark:text-zinc-400">
                                <span>Kontak Terdata</span>
                                <UserCheck className="size-3.5 text-[#787774] dark:text-zinc-300" />
                            </div>
                            <div className="flex items-baseline justify-between">
                                <span className="font-mono text-lg font-bold tracking-tight text-[#111111] dark:text-white">
                                    {totalContactsCount}
                                </span>
                                <span className="text-[10px] text-[#787774] dark:text-zinc-400">
                                    personil perwakilan
                                </span>
                            </div>
                        </div>
                    </section>

                    {/* Notion Inline Filter Toolbar */}
                    <Form
                        {...clientRoutes.index.form()}
                        className="flex flex-col gap-2 rounded-xl border border-black/[0.08] bg-white p-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] sm:flex-row sm:items-center sm:justify-between dark:border-white/[0.08] dark:bg-[#1a1a1c]"
                    >
                        {/* Search Input */}
                        <div className="relative flex-1 min-w-[240px]">
                            <Search className="pointer-events-none absolute left-3 top-2 size-3.5 text-[#787774]" />
                            <Input
                                name="search"
                                defaultValue={filters.search}
                                placeholder="Cari nama, nomor klien, atau kontak..."
                                className="h-7.5 w-full rounded-lg border-black/[0.08] bg-[#fbfbfa] pl-8.5 pr-3 text-xs text-[#2f3437] placeholder:text-[#787774] focus:border-black/20 focus:bg-white focus:outline-none dark:border-white/[0.1] dark:bg-[#121212] dark:text-zinc-200 dark:focus:border-white/20"
                            />
                        </div>

                        {/* Filter Status */}
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <select
                                    name="status"
                                    defaultValue={filters.status ?? ''}
                                    className="h-7.5 cursor-pointer appearance-none rounded-lg border border-black/[0.08] bg-[#fbfbfa] pl-3 pr-7 text-xs font-medium text-[#2f3437] outline-none transition-colors hover:bg-black/[0.02] focus:border-black/20 focus:bg-white dark:border-white/[0.1] dark:bg-[#121212] dark:text-zinc-200"
                                >
                                    <option value="">Semua Status</option>
                                    <option value="active">Aktif</option>
                                    <option value="inactive">Tidak Aktif</option>
                                    <option value="closed">Ditutup</option>
                                </select>
                                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3 -translate-y-1/2 text-[#787774]" />
                            </div>

                            <Button
                                type="submit"
                                variant="outline"
                                className="h-7.5 rounded-lg border-black/10 bg-white px-3 text-xs font-medium text-[#111111] shadow-2xs hover:bg-black/[0.03] dark:border-white/10 dark:bg-[#1c1c1e] dark:text-zinc-200"
                            >
                                Cari
                            </Button>
                        </div>
                    </Form>

                    {/* Notion Database Table View */}
                    <div className="overflow-hidden rounded-xl border border-black/[0.08] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                        {clients.data.length === 0 ? (
                            <div className="flex min-h-[380px] items-center justify-center p-12 text-center">
                                <EmptyState
                                    title="Belum ada klien yang sesuai"
                                    description="Coba sesuaikan kata kunci pencarian atau buat profil klien baru."
                                />
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead>
                                        <tr className="border-b border-black/[0.04] bg-[#fafafa] text-[10px] font-semibold tracking-wider text-[#787774] uppercase dark:border-white/[0.06] dark:bg-[#161618]">
                                            <th className="py-2.5 pl-4 pr-3 font-semibold">Klien</th>
                                            <th className="px-3 py-2.5 font-semibold">Industri</th>
                                            <th className="px-3 py-2.5 text-center font-semibold">Partner</th>
                                            <th className="px-3 py-2.5 text-center font-semibold">Matter</th>
                                            <th className="px-3 py-2.5 text-center font-semibold">Kontak</th>
                                            <th className="px-3 py-2.5 font-semibold">Status</th>
                                            <th className="py-2.5 pl-1 pr-4 text-right font-semibold"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-black/[0.04] dark:divide-white/[0.05]">
                                        {clients.data.map((client) => (
                                            <tr
                                                key={client.id}
                                                className="group transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.03]"
                                            >
                                                {/* 1. Client Title & Number */}
                                                <td className="py-3 pl-4 pr-3">
                                                    <Link
                                                        href={clientRoutes.show(client.id)}
                                                        className="flex items-center gap-2.5"
                                                    >
                                                        <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-black/[0.04] text-[#787774] dark:bg-white/[0.06] dark:text-zinc-300">
                                                            <Building2 className="size-3.5" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="truncate text-xs font-semibold text-[#111111] group-hover:text-blue-600 dark:text-zinc-100 dark:group-hover:text-sky-400">
                                                                {client.display_name}
                                                            </p>
                                                            <span className="inline-block rounded bg-[#e1f3fe] px-1.5 py-0.2 font-mono text-[10px] font-medium text-[#1f6c9f] dark:bg-blue-950/50 dark:text-sky-300">
                                                                {client.client_number}
                                                            </span>
                                                        </div>
                                                    </Link>
                                                </td>

                                                {/* 2. Industry */}
                                                <td className="whitespace-nowrap px-3 py-3">
                                                    <span className="inline-flex items-center rounded-md bg-black/[0.04] px-2 py-0.5 text-[10px] font-medium text-[#787774] dark:bg-white/[0.06] dark:text-zinc-400">
                                                        {client.industry ?? 'Umum'}
                                                    </span>
                                                </td>

                                                {/* 3. Partner (Avatar with Tooltip) */}
                                                <td className="whitespace-nowrap px-3 py-3 text-center">
                                                    {client.relationship_partner ? (
                                                        <TooltipProvider delayDuration={150}>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <div className="inline-flex cursor-pointer items-center justify-center">
                                                                        <div className="relative flex size-6.5 shrink-0 items-center justify-center overflow-hidden rounded-full bg-black/[0.05] text-[10px] font-semibold text-zinc-700 dark:bg-white/[0.1] dark:text-zinc-300">
                                                                            {client.relationship_partner.avatar_url ? (
                                                                                <img
                                                                                    src={client.relationship_partner.avatar_url}
                                                                                    alt={client.relationship_partner.name}
                                                                                    className="size-full object-cover"
                                                                                />
                                                                            ) : (
                                                                                client.relationship_partner.name
                                                                                    .split(' ')
                                                                                    .map((n) => n[0])
                                                                                    .slice(0, 2)
                                                                                    .join('')
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </TooltipTrigger>
                                                                <TooltipContent className="rounded-lg border border-black/10 bg-[#111111] px-2.5 py-1 text-xs text-white shadow-lg dark:border-white/10 dark:bg-white dark:text-black">
                                                                    <p className="font-semibold">{client.relationship_partner.name}</p>
                                                                    <p className="text-[10px] text-[#787774]">
                                                                        {client.relationship_partner.position_title ?? 'Partner'}
                                                                    </p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    ) : (
                                                        <span className="text-[11px] text-[#787774] dark:text-zinc-500">—</span>
                                                    )}
                                                </td>

                                                {/* 4. Matters Count */}
                                                <td className="whitespace-nowrap px-3 py-3 text-center font-mono text-xs font-semibold text-[#111111] dark:text-zinc-200">
                                                    {client.matters_count}
                                                </td>

                                                {/* 5. Contacts Count */}
                                                <td className="whitespace-nowrap px-3 py-3 text-center font-mono text-xs font-semibold text-[#111111] dark:text-zinc-200">
                                                    {client.contacts_count}
                                                </td>

                                                {/* 6. Status */}
                                                <td className="whitespace-nowrap px-3 py-3">
                                                    <StatusBadge value={client.status} />
                                                </td>

                                                {/* 7. Action Chevron */}
                                                <td className="py-3 pl-1 pr-4 text-right whitespace-nowrap">
                                                    <Link
                                                        href={clientRoutes.show(client.id)}
                                                        className="inline-flex size-6 items-center justify-center text-[#787774] opacity-0 transition-opacity group-hover:opacity-100 hover:text-[#111111] dark:hover:text-white"
                                                    >
                                                        <ChevronRight className="size-3.5" />
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Unified Table Footer with Pagination */}
                        <div className="flex flex-col justify-between gap-3 border-t border-black/[0.04] bg-[#fafafa] px-4 py-2.5 sm:flex-row sm:items-center dark:border-white/[0.06] dark:bg-[#161618]">
                            <span className="text-xs text-[#787774] dark:text-zinc-400">
                                Menampilkan <span className="font-semibold text-[#111111] dark:text-white">{clients.data.length}</span> dari{' '}
                                <span className="font-semibold text-[#111111] dark:text-white">{clients.total}</span> klien
                            </span>

                            <Pagination links={clients.links} />
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}

ClientsIndex.layout = {
    breadcrumbs: [{ title: 'Klien', href: clientRoutes.index() }],
};
