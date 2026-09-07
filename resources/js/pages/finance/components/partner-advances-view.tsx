import {
    AlertTriangle,
    Coins,
    HandCoins,
    Paperclip,
    Pencil,
    Plus,
    TrendingDown,
    TrendingUp,
    Wallet,
} from 'lucide-react';
import { useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { UserOption } from '@/components/user-picker';
import { useInitials } from '@/hooks/use-initials';
import { formatDate, formatMoney } from '@/lib/format';
import { cn } from '@/lib/utils';
import { EditPartnerTransactionDialog } from './edit-partner-transaction-dialog';
import { financeDialogPanelClass } from './finance-dialog-design';
import type {
    FinanceEntityProofTarget,
    ProofDocumentData,
} from './finance-proof-dialog';

export type PartnerAdvanceSummaryItem = {
    account_id: string;
    account_name: string;
    partner_id: number;
    partner_name: string;
    opening_balance: number;
    advances_incurred: number;
    advances_reimbursed: number;
    profit_distributed: number;
    prive_drawn: number;
    net_due_to_partner: number;
};

export type PartnerTransactionItem = {
    id: string;
    transaction_number: string;
    partner?: { id: number; name: string };
    matter?: { id: string; matter_number: string; title: string };
    type:
        | 'advance_incurred'
        | 'advance_reimbursed'
        | 'profit_distribution'
        | 'capital_injection'
        | 'draw_prive';
    amount: number;
    transaction_date: string;
    account?: { id: string; name: string };
    notes?: string;
    status: string;
    proof_document?: ProofDocumentData | null;
    proofDocument?: ProofDocumentData | null;
};

function getAvatarUrl(avatarPath?: string | null): string {
    if (!avatarPath || avatarPath.trim() === '') return '';
    if (avatarPath.startsWith('http') || avatarPath.startsWith('/'))
        return avatarPath;
    return `/storage/${avatarPath}`;
}

const aggregateConfig: Record<
    string,
    {
        icon: typeof HandCoins;
        color: string;
        bgClass: string;
        borderClass: string;
        textClass: string;
        accentClass: string;
    }
> = {
    profit_distribution: {
        icon: Coins,
        color: 'text-blue-600 dark:text-blue-400',
        bgClass: 'bg-blue-50/80 dark:bg-blue-950/20',
        borderClass: 'border-blue-200/80 dark:border-blue-500/20',
        textClass: 'text-blue-700 dark:text-blue-300',
        accentClass: 'bg-blue-600 text-white hover:bg-blue-500',
    },
    draw_prive: {
        icon: Wallet,
        color: 'text-purple-600 dark:text-purple-400',
        bgClass: 'bg-purple-50/80 dark:bg-purple-950/20',
        borderClass: 'border-purple-200/80 dark:border-purple-500/20',
        textClass: 'text-purple-700 dark:text-purple-300',
        accentClass: 'bg-purple-600 text-white hover:bg-purple-500',
    },
    advance_incurred: {
        icon: TrendingUp,
        color: 'text-amber-600 dark:text-amber-400',
        bgClass: 'bg-amber-50/80 dark:bg-amber-950/20',
        borderClass: 'border-amber-200/80 dark:border-amber-500/20',
        textClass: 'text-amber-700 dark:text-amber-300',
        accentClass: 'bg-amber-600 text-white hover:bg-amber-500',
    },
    advance_reimbursed: {
        icon: TrendingDown,
        color: 'text-emerald-600 dark:text-emerald-400',
        bgClass: 'bg-emerald-50/80 dark:bg-emerald-950/20',
        borderClass: 'border-emerald-200/80 dark:border-emerald-500/20',
        textClass: 'text-emerald-700 dark:text-emerald-300',
        accentClass: 'bg-emerald-600 text-white hover:bg-emerald-500',
    },
};

type ManagedAggregate = {
    partnerId: number;
    partnerName: string;
    type: PartnerTransactionItem['type'];
    label: string;
};

export function PartnerAdvancesView({
    advancesSummary,
    transactions,
    onOpenPartnerModal,
    partners = [],
    matters = [],
    accounts = [],
    onViewDetail,
    onViewProof,
}: {
    advancesSummary: PartnerAdvanceSummaryItem[];
    transactions: PartnerTransactionItem[];
    onOpenPartnerModal: () => void;
    partners?: UserOption[];
    matters?: { id: string; matter_number: string; title: string }[];
    accounts?: { id: string; name: string }[];
    onViewDetail?: (transaction: PartnerTransactionItem) => void;
    onViewProof?: (target: FinanceEntityProofTarget) => void;
}) {
    const getInitials = useInitials();
    const [selectedTransForEdit, setSelectedTransForEdit] =
        useState<PartnerTransactionItem | null>(null);
    const [confirmTransForEdit, setConfirmTransForEdit] =
        useState<PartnerTransactionItem | null>(null);
    const [managedAggregate, setManagedAggregate] =
        useState<ManagedAggregate | null>(null);

    const lastManagedAggregateRef = useRef<ManagedAggregate | null>(null);
    if (managedAggregate) {
        lastManagedAggregateRef.current = managedAggregate;
    }
    const activeAggregate = managedAggregate || lastManagedAggregateRef.current;

    const lastConfirmTransRef = useRef<PartnerTransactionItem | null>(null);
    if (confirmTransForEdit) {
        lastConfirmTransRef.current = confirmTransForEdit;
    }
    const activeConfirmTrans =
        confirmTransForEdit || lastConfirmTransRef.current;

    const managedTransactions = activeAggregate
        ? transactions.filter(
              (transaction) =>
                  transaction.partner?.id === activeAggregate.partnerId &&
                  transaction.type === activeAggregate.type,
          )
        : [];

    const totalDueToPartners = advancesSummary.reduce(
        (acc, p) => acc + p.net_due_to_partner,
        0,
    );
    const totalOpening = advancesSummary.reduce(
        (acc, p) => acc + (p.opening_balance || 0),
        0,
    );
    const totalIncurred = advancesSummary.reduce(
        (acc, p) => acc + (p.advances_incurred || 0),
        0,
    );
    const totalReimbursed = advancesSummary.reduce(
        (acc, p) => acc + (p.advances_reimbursed || 0),
        0,
    );
    const totalProfitDistributed = advancesSummary.reduce(
        (acc, p) => acc + (p.profit_distributed || 0),
        0,
    );
    const totalPriveDrawn = advancesSummary.reduce(
        (acc, p) => acc + (p.prive_drawn || 0),
        0,
    );

    const getPartnerAvatar = (partnerId: number) => {
        const fromPartners = partners.find(
            (p) => Number(p.id) === Number(partnerId),
        );
        if (fromPartners?.avatar_path)
            return getAvatarUrl(fromPartners.avatar_path);
        const fromAccounts = (accounts as any[]).find(
            (a) => a.partner && Number(a.partner.id) === Number(partnerId),
        );
        if (
            fromAccounts?.partner?.avatar_url ||
            fromAccounts?.partner?.avatar_path
        ) {
            return getAvatarUrl(
                fromAccounts.partner.avatar_url ||
                    fromAccounts.partner.avatar_path,
            );
        }
        const fromTx = transactions.find(
            (t) => t.partner && Number(t.partner.id) === Number(partnerId),
        );
        if (
            (fromTx?.partner as any)?.avatar_url ||
            (fromTx?.partner as any)?.avatar_path
        ) {
            return getAvatarUrl(
                (fromTx?.partner as any)?.avatar_url ||
                    (fromTx?.partner as any)?.avatar_path,
            );
        }
        return '';
    };

    const managedTotalAmount = managedTransactions.reduce(
        (total, t) => total + t.amount,
        0,
    );
    const currentAggregateConfig = activeAggregate
        ? aggregateConfig[activeAggregate.type]
        : null;
    const AggregateIcon = currentAggregateConfig?.icon || HandCoins;
    const managedPartnerAvatar = activeAggregate
        ? getPartnerAvatar(activeAggregate.partnerId)
        : '';

    const partnerComposition = advancesSummary.map((partner, index) => ({
        ...partner,
        shortName: partner.partner_name.replace(/,.*$/, ''),
        amount: Math.abs(partner.net_due_to_partner),
        color: ['bg-blue-500', 'bg-sky-300', 'bg-amber-400'][index % 3],
    }));
    const partnerCompositionTotal = Math.max(
        partnerComposition.reduce(
            (total, partner) => total + partner.amount,
            0,
        ),
        1,
    );

    const typeLabels: Record<string, { label: string; textClass: string }> = {
        advance_incurred: {
            label: 'Talangan Partner (+)',
            textClass: 'text-amber-600 dark:text-amber-400',
        },
        advance_reimbursed: {
            label: 'Pengembalian Talangan (-)',
            textClass: 'text-emerald-600 dark:text-emerald-400',
        },
        profit_distribution: {
            label: 'Pembagian Bagi Hasil',
            textClass: 'text-blue-600 dark:text-blue-400',
        },
        capital_injection: {
            label: 'Setoran Modal (+)',
            textClass: 'text-blue-600 dark:text-blue-400',
        },
        draw_prive: {
            label: 'Penarikan Prive (-)',
            textClass: 'text-slate-600 dark:text-zinc-400',
        },
    };

    return (
        <div
            data-testid="partner-advances-workspace"
            className="overflow-hidden rounded-xl border border-slate-200/70 bg-white shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]"
        >
            {/* Header & Actions */}
            <div className="flex flex-col justify-between gap-2.5 border-b border-slate-200/70 px-4 py-3 sm:flex-row sm:items-center dark:border-white/[0.06]">
                <div>
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                        Talangan &amp; Hak Partner
                    </h2>
                    <p className="mt-0.5 max-w-4xl text-[11px] text-slate-500 dark:text-zinc-400">
                        Rekapitulasi utang kantor kepada partner atas dana
                        pribadi talangan operasional/perkara, pengembalian
                        talangan, prive, dan bagi hasil.
                    </p>
                </div>
                <Button
                    size="sm"
                    onClick={onOpenPartnerModal}
                    className="h-7.5 rounded-lg bg-slate-950 px-3 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-zinc-200"
                >
                    <Plus className="mr-1 size-3.5" />
                    Catat Transaksi Partner
                </Button>
            </div>

            {/* Partner Advances Summary Card & Table (Mirroring Excel Sheet TALANGAN_PARTNER) */}
            <div className="grid gap-3 p-4 lg:grid-cols-5">
                <section className="relative flex min-h-[142px] flex-col justify-between overflow-hidden rounded-xl border border-blue-100 bg-[#eef5ff] p-4 lg:col-span-2 dark:border-blue-400/10 dark:bg-blue-500/[0.06]">
                    <div className="pointer-events-none absolute -top-12 -right-10 size-32 rounded-full border-[20px] border-white/60 dark:border-white/[0.025]" />
                    <p className="relative text-[10px] font-bold tracking-[0.14em] text-blue-600 uppercase dark:text-blue-300">
                        Total Utang Partner Bersih
                    </p>
                    <p className="relative mt-1 font-mono text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
                        {formatMoney(totalDueToPartners, 'IDR')}
                    </p>
                    <p className="relative mt-1 text-[10px] text-slate-500 dark:text-zinc-400">
                        Kewajiban firma setelah pengembalian talangan
                    </p>
                    <div className="relative mt-4 flex items-end justify-between border-t border-blue-200/60 pt-3 text-[9.5px] font-medium text-slate-500 dark:border-white/[0.06] dark:text-zinc-400">
                        <span>Posisi kewajiban tercatat</span>
                        <span>{advancesSummary.length} partner</span>
                    </div>
                </section>

                <section
                    data-testid="partner-composition-panel"
                    className="flex min-h-[142px] flex-col rounded-xl border border-slate-200/70 bg-slate-50/60 p-4 lg:col-span-3 dark:border-white/[0.06] dark:bg-white/[0.025]"
                >
                    <div>
                        <p className="text-[10px] font-bold tracking-[0.12em] text-slate-500 uppercase dark:text-zinc-400">
                            Komposisi Kewajiban Partner
                        </p>
                        <p className="mt-0.5 text-[10px] text-slate-400 dark:text-zinc-500">
                            Distribusi utang bersih firma per partner
                        </p>
                    </div>
                    <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-slate-200/80 dark:bg-white/[0.07]">
                        {partnerComposition.map((partner) => (
                            <div
                                key={partner.partner_id || partner.account_id}
                                className={partner.color}
                                style={{
                                    width: `${(partner.amount / partnerCompositionTotal) * 100}%`,
                                }}
                            />
                        ))}
                    </div>
                    <div className="mt-3 grid flex-1 divide-y divide-slate-200/70 sm:grid-cols-3 sm:divide-x sm:divide-y-0 dark:divide-white/[0.06]">
                        {partnerComposition.map((partner) => (
                            <div
                                key={partner.partner_id || partner.account_id}
                                className="py-2 first:pl-0 sm:px-3 sm:py-0"
                            >
                                <p className="truncate text-[9px] font-semibold text-slate-400 uppercase dark:text-zinc-500">
                                    {partner.shortName}
                                </p>
                                <p className="mt-1 font-mono text-sm font-bold text-slate-950 dark:text-white">
                                    {formatMoney(
                                        partner.net_due_to_partner,
                                        'IDR',
                                    )}
                                </p>
                                <p className="mt-0.5 text-[9px] text-slate-400 dark:text-zinc-500">
                                    Kontribusi{' '}
                                    {(
                                        (partner.amount /
                                            partnerCompositionTotal) *
                                        100
                                    ).toFixed(1)}
                                    %
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <div className="border-t border-slate-200/70 px-4 py-3.5 sm:px-5 dark:border-white/[0.06]">
                <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                                Rincian Posisi Talangan &amp; Ekuitas Partner
                            </h3>
                            <span className="text-xs text-slate-500 dark:text-zinc-400">
                                ({advancesSummary.length} Partner)
                            </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                            Rekonsiliasi saldo awal, talangan berjalan,
                            pengembalian, bagi hasil laba, dan prive.
                        </p>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-zinc-500">
                        <Pencil className="size-3 text-slate-400 dark:text-zinc-500" />
                        <span>
                            Klik nominal bertanda edit untuk kelola mutasi
                        </span>
                    </div>
                </div>

                <div className="mt-3 overflow-hidden rounded-xl border border-slate-200/80 bg-white dark:border-white/[0.06] dark:bg-[#14161b]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="border-b border-slate-200/80 bg-slate-50/70 text-[10.5px] font-semibold tracking-wider text-slate-500 uppercase dark:border-white/[0.06] dark:bg-white/[0.02] dark:text-zinc-400">
                                <tr>
                                    <th className="px-4 py-3 whitespace-nowrap">
                                        Nama Partner
                                    </th>
                                    <th className="px-3.5 py-3 text-right whitespace-nowrap">
                                        Saldo Awal
                                    </th>
                                    <th className="px-3.5 py-3 text-right whitespace-nowrap">
                                        Talangan Berjalan (+)
                                    </th>
                                    <th className="px-3.5 py-3 text-right whitespace-nowrap">
                                        Pengembalian (-)
                                    </th>
                                    <th className="px-3.5 py-3 text-right whitespace-nowrap">
                                        Utang Partner Bersih
                                    </th>
                                    <th className="px-3.5 py-3 text-right whitespace-nowrap">
                                        Bagi Hasil
                                    </th>
                                    <th className="px-3.5 py-3 text-right whitespace-nowrap">
                                        Prive
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium text-slate-700 dark:divide-white/[0.04] dark:text-zinc-300">
                                {advancesSummary.map((partner) => {
                                    const avatarUrl = getPartnerAvatar(
                                        partner.partner_id,
                                    );

                                    return (
                                        <tr
                                            key={
                                                partner.partner_id ||
                                                partner.account_id
                                            }
                                            className="transition-colors hover:bg-slate-50/60 dark:hover:bg-white/[0.02]"
                                        >
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <div className="flex items-center gap-2.5">
                                                    <Avatar
                                                        aria-hidden="true"
                                                        className="size-7.5 shrink-0 rounded-full border border-slate-200 dark:border-white/10"
                                                    >
                                                        <AvatarImage
                                                            src={avatarUrl}
                                                            alt=""
                                                            className="object-cover"
                                                        />
                                                        <AvatarFallback
                                                            aria-hidden="true"
                                                            className="bg-slate-100 text-[9px] font-semibold text-slate-600 dark:bg-white/10 dark:text-zinc-300"
                                                        >
                                                            {getInitials(
                                                                partner.partner_name,
                                                            )}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="min-w-0">
                                                        <p className="truncate text-xs font-semibold text-slate-900 dark:text-white">
                                                            {
                                                                partner.partner_name
                                                            }
                                                        </p>
                                                        <p className="mt-0.5 truncate font-mono text-[10px] text-slate-400 dark:text-zinc-500">
                                                            {partner.account_name ||
                                                                'Kas Talangan'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-3.5 py-3 text-right font-mono whitespace-nowrap text-slate-500 dark:text-zinc-400">
                                                {formatMoney(
                                                    partner.opening_balance,
                                                    'IDR',
                                                )}
                                            </td>
                                            <td className="px-3.5 py-3 text-right whitespace-nowrap">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setManagedAggregate({
                                                            partnerId:
                                                                partner.partner_id,
                                                            partnerName:
                                                                partner.partner_name,
                                                            type: 'advance_incurred',
                                                            label: 'Talangan Berjalan',
                                                        })
                                                    }
                                                    title={`Kelola Talangan Berjalan ${partner.partner_name}`}
                                                    className="group inline-flex items-center justify-end gap-1.5 font-mono text-xs font-medium text-slate-800 transition-colors hover:text-slate-950 dark:text-zinc-200 dark:hover:text-white"
                                                >
                                                    <span>
                                                        {formatMoney(
                                                            partner.advances_incurred,
                                                            'IDR',
                                                        )}
                                                    </span>
                                                    <Pencil className="size-3 text-slate-400 opacity-40 transition-opacity group-hover:text-slate-700 group-hover:opacity-100 dark:group-hover:text-zinc-200" />
                                                </button>
                                            </td>
                                            <td className="px-3.5 py-3 text-right whitespace-nowrap">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setManagedAggregate({
                                                            partnerId:
                                                                partner.partner_id,
                                                            partnerName:
                                                                partner.partner_name,
                                                            type: 'advance_reimbursed',
                                                            label: 'Pengembalian Talangan',
                                                        })
                                                    }
                                                    title={`Kelola Pengembalian Talangan ${partner.partner_name}`}
                                                    className="group inline-flex items-center justify-end gap-1.5 font-mono text-xs font-medium text-slate-800 transition-colors hover:text-slate-950 dark:text-zinc-200 dark:hover:text-white"
                                                >
                                                    <span>
                                                        {formatMoney(
                                                            partner.advances_reimbursed,
                                                            'IDR',
                                                        )}
                                                    </span>
                                                    <Pencil className="size-3 text-slate-400 opacity-40 transition-opacity group-hover:text-slate-700 group-hover:opacity-100 dark:group-hover:text-zinc-200" />
                                                </button>
                                            </td>
                                            <td className="px-3.5 py-3 text-right font-mono text-xs font-bold whitespace-nowrap text-slate-900 dark:text-white">
                                                {formatMoney(
                                                    partner.net_due_to_partner,
                                                    'IDR',
                                                )}
                                            </td>
                                            <td className="px-3.5 py-3 text-right whitespace-nowrap">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setManagedAggregate({
                                                            partnerId:
                                                                partner.partner_id,
                                                            partnerName:
                                                                partner.partner_name,
                                                            type: 'profit_distribution',
                                                            label: 'Bagi Hasil',
                                                        })
                                                    }
                                                    title={`Kelola Bagi Hasil ${partner.partner_name}`}
                                                    className="group inline-flex items-center justify-end gap-1.5 font-mono text-xs font-medium text-slate-800 transition-colors hover:text-slate-950 dark:text-zinc-200 dark:hover:text-white"
                                                >
                                                    <span>
                                                        {formatMoney(
                                                            partner.profit_distributed,
                                                            'IDR',
                                                        )}
                                                    </span>
                                                    <Pencil className="size-3 text-slate-400 opacity-40 transition-opacity group-hover:text-slate-700 group-hover:opacity-100 dark:group-hover:text-zinc-200" />
                                                </button>
                                            </td>
                                            <td className="px-3.5 py-3 text-right whitespace-nowrap">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setManagedAggregate({
                                                            partnerId:
                                                                partner.partner_id,
                                                            partnerName:
                                                                partner.partner_name,
                                                            type: 'draw_prive',
                                                            label: 'Prive',
                                                        })
                                                    }
                                                    title={`Kelola Prive ${partner.partner_name}`}
                                                    className="group inline-flex items-center justify-end gap-1.5 font-mono text-xs font-medium text-slate-800 transition-colors hover:text-slate-950 dark:text-zinc-200 dark:hover:text-white"
                                                >
                                                    <span>
                                                        {formatMoney(
                                                            partner.prive_drawn,
                                                            'IDR',
                                                        )}
                                                    </span>
                                                    <Pencil className="size-3 text-slate-400 opacity-40 transition-opacity group-hover:text-slate-700 group-hover:opacity-100 dark:group-hover:text-zinc-200" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                            <tfoot className="border-t border-slate-200/80 bg-slate-50/70 font-mono text-xs font-bold text-slate-900 dark:border-white/10 dark:bg-white/[0.02] dark:text-white">
                                <tr>
                                    <td className="px-4 py-3 font-sans text-xs font-semibold text-slate-900 dark:text-white">
                                        Total Firma
                                    </td>
                                    <td className="px-3.5 py-3 text-right text-slate-500 dark:text-zinc-400">
                                        {formatMoney(totalOpening, 'IDR')}
                                    </td>
                                    <td className="px-3.5 py-3 text-right text-slate-800 dark:text-zinc-200">
                                        {formatMoney(totalIncurred, 'IDR')}
                                    </td>
                                    <td className="px-3.5 py-3 text-right text-slate-800 dark:text-zinc-200">
                                        {formatMoney(totalReimbursed, 'IDR')}
                                    </td>
                                    <td className="px-3.5 py-3 text-right font-bold text-slate-950 dark:text-white">
                                        {formatMoney(totalDueToPartners, 'IDR')}
                                    </td>
                                    <td className="px-3.5 py-3 text-right text-slate-800 dark:text-zinc-200">
                                        {formatMoney(
                                            totalProfitDistributed,
                                            'IDR',
                                        )}
                                    </td>
                                    <td className="px-3.5 py-3 text-right text-slate-800 dark:text-zinc-200">
                                        {formatMoney(totalPriveDrawn, 'IDR')}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>

            {/* Partner Transactions Table (Mirroring Excel Sheet PARTNER) */}
            <div className="border-t border-slate-200/70 dark:border-white/[0.06]">
                <div className="px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                Register Transaksi &amp; Mutasi Partner
                            </h3>
                            <p className="mt-0.5 text-[11px] text-slate-500 dark:text-zinc-400">
                                Log lengkap pencatatan talangan, reimbursement,
                                penarikan prive, dan pembagian laba.
                            </p>
                        </div>
                        <span className="font-mono text-[10px] font-semibold text-slate-500 dark:text-zinc-400">
                            {transactions.length} Transaksi
                        </span>
                    </div>
                </div>

                {transactions.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-400 dark:text-zinc-500">
                        Belum ada riwayat transaksi partner.
                    </div>
                ) : (
                    <div className="mx-4 mb-4 overflow-x-auto rounded-xl border border-slate-200/70 dark:border-white/[0.06]">
                        <table className="w-full min-w-[1120px] text-left text-xs">
                            <thead className="border-b border-slate-200/70 bg-slate-50/70 text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:border-white/[0.06] dark:bg-[#121418] dark:text-zinc-400">
                                <tr>
                                    <th className="px-3.5 py-2.5 whitespace-nowrap">
                                        No Transaksi &amp; Tanggal
                                    </th>
                                    <th className="px-3 py-2.5 whitespace-nowrap">
                                        Partner
                                    </th>
                                    <th className="px-3 py-2.5 whitespace-nowrap">
                                        Jenis Transaksi
                                    </th>
                                    <th className="px-3 py-2.5 whitespace-nowrap">
                                        Perkara / Rekening
                                    </th>
                                    <th className="px-3 py-2.5 text-right whitespace-nowrap">
                                        Nominal
                                    </th>
                                    <th className="px-3 py-2.5">Keterangan</th>
                                    <th className="px-3 py-2.5 text-center whitespace-nowrap">
                                        Status
                                    </th>
                                    <th className="px-3 py-2.5 text-center whitespace-nowrap">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200/60 font-medium text-slate-700 dark:divide-white/[0.04] dark:text-zinc-300">
                                {transactions.map((t) => {
                                    const typeInfo = typeLabels[t.type] || {
                                        label: t.type,
                                        textClass:
                                            'text-slate-600 dark:text-zinc-400',
                                    };

                                    return (
                                        <tr
                                            key={t.id}
                                            className="transition-colors hover:bg-slate-50/60 dark:hover:bg-white/[0.02]"
                                        >
                                            <td className="px-3.5 py-2.5 whitespace-nowrap">
                                                <div>
                                                    <span className="font-mono text-xs font-bold text-slate-950 dark:text-white">
                                                        {t.transaction_number}
                                                    </span>
                                                    <p className="mt-0.5 text-[10px] text-slate-400 dark:text-zinc-500">
                                                        {formatDate(
                                                            t.transaction_date,
                                                        )}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-3 py-2.5 font-bold whitespace-nowrap text-slate-900 dark:text-white">
                                                {t.partner?.name || '-'}
                                            </td>
                                            <td className="px-3 py-2.5 whitespace-nowrap">
                                                <span
                                                    className={`text-[10px] font-bold whitespace-nowrap ${typeInfo.textClass}`}
                                                >
                                                    {typeInfo.label}
                                                </span>
                                            </td>
                                            <td className="px-3 py-2.5 whitespace-nowrap">
                                                {t.matter ? (
                                                    <span className="font-mono text-xs font-semibold text-slate-700 dark:text-zinc-300">
                                                        {t.matter.matter_number}
                                                    </span>
                                                ) : t.account ? (
                                                    <span className="text-xs text-slate-600 dark:text-zinc-300">
                                                        {t.account.name}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-slate-400">
                                                        -
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-3 py-2.5 text-right font-mono font-bold whitespace-nowrap text-slate-900 dark:text-white">
                                                {formatMoney(t.amount, 'IDR')}
                                            </td>
                                            <td
                                                className="max-w-[320px] truncate px-3 py-2.5 text-xs text-slate-500 dark:text-zinc-400"
                                                title={t.notes || ''}
                                            >
                                                {t.notes || '-'}
                                            </td>
                                            <td className="px-3 py-2.5 text-center whitespace-nowrap">
                                                <span className="text-[10px] font-bold text-emerald-600 uppercase dark:text-emerald-400">
                                                    Disetujui
                                                </span>
                                            </td>
                                            <td className="px-3 py-2.5 text-center whitespace-nowrap">
                                                <div className="flex items-center justify-center gap-1.5">
                                                    {onViewProof && (
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() =>
                                                                onViewProof({
                                                                    id: t.id,
                                                                    entity: 'partner-transactions',
                                                                    title: `Bukti Transaksi Partner: ${t.transaction_number}`,
                                                                    subtitle: `${t.partner?.name || 'Partner'} • ${formatMoney(t.amount, 'IDR')}`,
                                                                    proof_document:
                                                                        t.proof_document ||
                                                                        t.proofDocument,
                                                                })
                                                            }
                                                            className={`size-7 rounded-lg ${
                                                                t.proof_document ||
                                                                t.proofDocument
                                                                    ? 'text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/30'
                                                                    : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:text-zinc-500 dark:hover:bg-white/[0.06] dark:hover:text-zinc-200'
                                                            }`}
                                                            title={
                                                                t.proof_document ||
                                                                t.proofDocument
                                                                    ? 'Lihat Bukti Transaksi Partner'
                                                                    : 'Unggah Bukti Transaksi Partner'
                                                            }
                                                        >
                                                            <Paperclip className="size-3.5" />
                                                        </Button>
                                                    )}
                                                    {onViewDetail && (
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() =>
                                                                onViewDetail(t)
                                                            }
                                                            className="h-7 rounded-lg px-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-300 dark:hover:bg-white/10"
                                                            title="Lihat Rincian Transaksi Partner"
                                                        >
                                                            Detail
                                                        </Button>
                                                    )}
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            setConfirmTransForEdit(
                                                                t,
                                                            )
                                                        }
                                                        className="h-7 rounded-lg border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-white/10 dark:bg-[#121418] dark:text-zinc-200"
                                                    >
                                                        <Pencil className="mr-1 size-3 text-slate-400" />
                                                        Edit
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <Dialog
                open={Boolean(managedAggregate)}
                onOpenChange={(open) => !open && setManagedAggregate(null)}
            >
                <DialogContent className={financeDialogPanelClass('compact')}>
                    <DialogHeader className="border-b border-slate-100 px-5 py-3.5 sm:px-6 dark:border-white/[0.06]">
                        <div className="flex items-center gap-3 pr-6">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-slate-500 dark:border-white/10 dark:bg-white/[0.06] dark:text-zinc-400">
                                <AggregateIcon
                                    className="size-4.5 text-slate-600 dark:text-zinc-300"
                                    strokeWidth={1.8}
                                />
                            </div>
                            <div className="min-w-0 flex-1">
                                <DialogTitle className="text-sm font-bold tracking-tight text-slate-900 sm:text-[15px] dark:text-white">
                                    Kelola {activeAggregate?.label}
                                </DialogTitle>
                                <div className="mt-0.5 flex items-center gap-1.5">
                                    <Avatar className="size-4 shrink-0 rounded-full border border-slate-200 dark:border-white/10">
                                        <AvatarImage
                                            src={managedPartnerAvatar}
                                            alt=""
                                        />
                                        <AvatarFallback className="bg-slate-700 text-[8px] font-bold text-white">
                                            {getInitials(
                                                activeAggregate?.partnerName ||
                                                    '',
                                            )}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="truncate text-[11px] font-medium text-slate-600 dark:text-zinc-300">
                                        {activeAggregate?.partnerName}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="min-h-0 space-y-3 overflow-y-auto px-5 py-4 sm:px-6">
                        {/* Compact Summary Strip */}
                        <div className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5 dark:border-white/[0.06] dark:bg-white/[0.02]">
                            <div>
                                <p className="text-[10px] font-medium tracking-wider text-slate-400 uppercase dark:text-zinc-500">
                                    Total {activeAggregate?.label}
                                </p>
                                <p className="mt-0.5 font-mono text-base font-bold tracking-tight text-slate-900 dark:text-white">
                                    {formatMoney(managedTotalAmount, 'IDR')}
                                </p>
                            </div>
                            <span className="rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600 dark:bg-white/[0.06] dark:text-zinc-300">
                                {managedTransactions.length} Mutasi
                            </span>
                        </div>

                        {/* Transactions List */}
                        {managedTransactions.length > 0 ? (
                            <div className="max-h-[300px] space-y-2 overflow-y-auto pr-0.5">
                                {managedTransactions.map((transaction) => (
                                    <div
                                        key={transaction.id}
                                        className="rounded-xl border border-slate-200/80 bg-white p-3 transition-all hover:border-slate-300 hover:shadow-2xs dark:border-white/[0.08] dark:bg-[#16181f] dark:hover:border-white/15"
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                                                        {
                                                            transaction.transaction_number
                                                        }
                                                    </span>
                                                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-white/[0.06] dark:text-zinc-400">
                                                        {formatDate(
                                                            transaction.transaction_date,
                                                        )}
                                                    </span>
                                                </div>
                                                <p
                                                    className="mt-1 truncate text-[11px] text-slate-500 dark:text-zinc-400"
                                                    title={
                                                        transaction.notes || ''
                                                    }
                                                >
                                                    {transaction.notes ||
                                                        transaction.account
                                                            ?.name ||
                                                        'Tanpa catatan'}
                                                </p>
                                            </div>
                                            <div className="shrink-0 text-right">
                                                <span className="font-mono text-xs font-bold text-slate-950 dark:text-white">
                                                    {formatMoney(
                                                        transaction.amount,
                                                        'IDR',
                                                    )}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 dark:border-white/[0.05]">
                                            <div className="truncate text-[10.5px] text-slate-400 dark:text-zinc-500">
                                                {transaction.account?.name ||
                                                    'Kas Rekening'}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                {onViewProof &&
                                                    (transaction.proof_document ||
                                                        transaction.proofDocument) && (
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() =>
                                                                onViewProof({
                                                                    id: transaction.id,
                                                                    entity: 'partner-transactions',
                                                                    title: `Bukti Mutasi: ${transaction.transaction_number}`,
                                                                    subtitle: `${transaction.partner?.name || 'Partner'} • ${formatMoney(transaction.amount, 'IDR')}`,
                                                                    proof_document:
                                                                        transaction.proof_document ||
                                                                        transaction.proofDocument,
                                                                })
                                                            }
                                                            className="h-7 px-2 text-[11px] font-semibold text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white"
                                                            title="Lihat Bukti"
                                                        >
                                                            <Paperclip className="mr-1 size-3" />
                                                            Bukti
                                                        </Button>
                                                    )}
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => {
                                                        setManagedAggregate(
                                                            null,
                                                        );
                                                        setSelectedTransForEdit(
                                                            transaction,
                                                        );
                                                    }}
                                                    className="h-7 rounded-lg border-slate-200 bg-white px-2.5 text-[11px] font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-slate-950 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-200 dark:hover:bg-white/10"
                                                >
                                                    <Pencil className="mr-1 size-3 text-slate-400" />
                                                    Edit
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center dark:border-white/10">
                                <div className="mx-auto flex size-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-slate-500 dark:border-white/10 dark:bg-white/[0.06] dark:text-zinc-400">
                                    <AggregateIcon
                                        className="size-4.5 text-slate-600 dark:text-zinc-300"
                                        strokeWidth={1.8}
                                    />
                                </div>
                                <p className="mt-2 text-xs font-bold text-slate-800 dark:text-zinc-200">
                                    Belum Ada {activeAggregate?.label}
                                </p>
                                <p className="mt-1 text-[11px] text-slate-400 dark:text-zinc-500">
                                    Belum ada pencatatan{' '}
                                    {activeAggregate?.label.toLowerCase()} untuk{' '}
                                    {activeAggregate?.partnerName}.
                                </p>
                                <Button
                                    type="button"
                                    size="sm"
                                    onClick={() => {
                                        setManagedAggregate(null);
                                        onOpenPartnerModal();
                                    }}
                                    className="mt-3.5 h-7.5 rounded-lg bg-slate-950 px-3 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-zinc-200"
                                >
                                    <Plus className="mr-1 size-3" />
                                    Catat {activeAggregate?.label} Sekarang
                                </Button>
                            </div>
                        )}
                    </div>

                    <DialogFooter className="flex items-center justify-between gap-3 border-t border-slate-100 px-5 !py-3.5 sm:px-6 sm:!py-4 dark:border-white/[0.06]">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setManagedAggregate(null)}
                            className="h-8.5 rounded-lg border-slate-200 px-4 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:text-zinc-400"
                        >
                            Tutup
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            onClick={() => {
                                setManagedAggregate(null);
                                onOpenPartnerModal();
                            }}
                            className="h-8.5 rounded-lg bg-slate-950 px-4 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-zinc-200"
                        >
                            <Plus className="mr-1.5 size-3.5" />
                            Tambah Transaksi
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal Konfirmasi Edit Transaksi Disetujui */}
            <Dialog
                open={Boolean(confirmTransForEdit)}
                onOpenChange={(open) => !open && setConfirmTransForEdit(null)}
            >
                <DialogContent className={financeDialogPanelClass('compact')}>
                    <DialogHeader className="border-b border-slate-100 pb-3 dark:border-white/[0.06]">
                        <div className="grid grid-cols-[36px_minmax(0,1fr)] items-center gap-3">
                            <div className="flex size-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-slate-500 dark:border-white/10 dark:bg-white/[0.06] dark:text-zinc-400">
                                <AlertTriangle
                                    className="size-4.5"
                                    strokeWidth={1.8}
                                />
                            </div>
                            <div className="min-w-0 self-center">
                                <DialogTitle className="text-sm leading-5 font-bold text-slate-900 dark:text-white">
                                    Edit Transaksi Rekonsiliasi
                                </DialogTitle>
                                <p className="truncate text-[11px] leading-4 text-slate-500 dark:text-zinc-400">
                                    Konfirmasi sebelum mengubah transaksi.
                                </p>
                            </div>
                        </div>
                    </DialogHeader>

                    {activeConfirmTrans && (
                        <div className="space-y-3 px-5 py-4 text-xs sm:px-6">
                            <div className="rounded-xl border border-amber-200/80 bg-amber-50/50 p-3 dark:border-amber-900/40 dark:bg-amber-950/20">
                                <p className="font-semibold text-amber-900 dark:text-amber-200">
                                    Perhatian Penyesuaian Saldo:
                                </p>
                                <p className="mt-1 text-[11px] text-amber-800/90 dark:text-amber-300/80">
                                    Apakah Anda yakin ingin mengedit transaksi
                                    ini? Perubahan nominal atau jenis transaksi
                                    akan otomatis menyesuaikan saldo kas dan
                                    saldo utang partner.
                                </p>
                            </div>
                        </div>
                    )}

                    <DialogFooter className="gap-2 border-t border-slate-100 px-5 py-3.5 sm:px-6 dark:border-white/[0.06]">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setConfirmTransForEdit(null)}
                            className="h-8.5 rounded-lg border-slate-200 px-3.5 text-xs font-semibold hover:bg-slate-50 dark:border-white/10 dark:text-zinc-300"
                        >
                            Batal
                        </Button>
                        <Button
                            size="sm"
                            onClick={() => {
                                if (activeConfirmTrans) {
                                    setSelectedTransForEdit(activeConfirmTrans);
                                    setConfirmTransForEdit(null);
                                }
                            }}
                            className="h-8.5 rounded-lg bg-amber-600 px-4 text-xs font-semibold text-white shadow-2xs hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-700"
                        >
                            Ya, Tetap Edit
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal Form Edit Transaksi Partner */}
            <EditPartnerTransactionDialog
                open={!!selectedTransForEdit}
                onOpenChange={(open) => !open && setSelectedTransForEdit(null)}
                transaction={selectedTransForEdit}
                partners={partners}
                matters={matters}
                accounts={accounts}
            />
        </div>
    );
}
