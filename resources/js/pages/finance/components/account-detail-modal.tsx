import { useState } from 'react';
import {
    ArrowDownLeft,
    ArrowRightLeft,
    ArrowUpRight,
    Banknote,
    Building2,
    Calendar,
    Check,
    Copy,
    CreditCard,
    FileText,
    Landmark,
    Pencil,
    Receipt,
    Shield,
    Trash2,
    User,
    Users,
    Wallet,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { formatDate, formatMoney, terbilang } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { FinancialAccountItem } from './accounts-view';
import { financeDialogPanelClass } from './finance-dialog-design';
import { FinanceDialogHeader } from './finance-dialog-ui';

const typeBadgeConfig: Record<
    string,
    { label: string; icon: typeof Landmark; color: string; desc: string }
> = {
    bank: {
        label: 'Bank Operasional',
        icon: Landmark,
        color: 'text-blue-600 dark:text-blue-400',
        desc: 'Rekening giro/tabungan operasional firma',
    },
    cash: {
        label: 'Kas Tunai',
        icon: Banknote,
        color: 'text-emerald-600 dark:text-emerald-400',
        desc: 'Petty cash kantor untuk belanja operasional',
    },
    partner_advance: {
        label: 'Talangan Partner',
        icon: Users,
        color: 'text-amber-600 dark:text-amber-400',
        desc: 'Pos utang/piutang dan talangan partner',
    },
    client_trust: {
        label: 'Dana Titipan Klien',
        icon: Shield,
        color: 'text-cyan-600 dark:text-cyan-400',
        desc: 'Rekening escrow titipan perkara & panjar pengadilan',
    },
};

export function AccountDetailModal({
    account,
    open,
    onOpenChange,
    onTransfer,
    onDelete,
    onEdit,
    canManage = false,
}: {
    account: FinancialAccountItem | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onTransfer?: (account: FinancialAccountItem) => void;
    onDelete?: (account: FinancialAccountItem) => void;
    onEdit?: (account: FinancialAccountItem) => void;
    canManage?: boolean;
}) {
    const [copied, setCopied] = useState(false);

    if (!account) {
        return null;
    }

    const cfg = typeBadgeConfig[account.type] || {
        label: account.type,
        icon: Wallet,
        color: 'text-slate-600 dark:text-zinc-400',
        desc: 'Rekening keuangan firma',
    };

    const TypeIcon = cfg.icon;

    const copyAccountNumber = () => {
        if (!account.account_number) return;
        navigator.clipboard.writeText(account.account_number);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const totalTransactions =
        (account.expenses_count ?? 0) +
        (account.payments_count ?? 0) +
        (account.outgoing_transfers_count ?? 0) +
        (account.incoming_transfers_count ?? 0) +
        (account.partner_transactions_count ?? 0) +
        (account.client_trust_funds_count ?? 0) +
        (account.payrolls_count ?? 0);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={financeDialogPanelClass('default')}>
                {/* 1. Standardized Header matching CreateAccountDialog */}
                <FinanceDialogHeader
                    icon={Building2}
                    eyebrow="Kas & Bank"
                    title={account.name}
                    description={
                        account.bank_name
                            ? `${cfg.label} · ${account.bank_name}`
                            : cfg.desc
                    }
                />

                {/* 2. Body matching CreateAccountDialog spacing and container styling */}
                <div className="space-y-3.5 overflow-y-auto px-5 py-4 text-xs sm:px-6">
                    {/* Real-time Balance Card */}
                    <div className="space-y-2.5 rounded-xl border border-slate-200/80 bg-slate-50/50 p-3.5 dark:border-white/[0.06] dark:bg-[#16181f]">
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                                <span className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase dark:text-zinc-400">
                                    Saldo Saat Ini (Real-Time)
                                </span>
                                <p className="mt-0.5 font-mono text-2xl font-bold tracking-tight text-slate-900 sm:text-[26px] dark:text-white">
                                    {formatMoney(account.current_balance, 'IDR')}
                                </p>
                                <p
                                    className="mt-0.5 line-clamp-1 text-[10px] text-slate-400 italic dark:text-zinc-500"
                                    title={terbilang(account.current_balance) + ' Rupiah'}
                                >
                                    {account.current_balance > 0
                                        ? `“${terbilang(account.current_balance)} Rupiah”`
                                        : 'Nol Rupiah'}
                                </p>
                            </div>

                            <div className="shrink-0 text-right">
                                <span className="text-[10px] font-semibold text-slate-500 dark:text-zinc-400">
                                    Saldo Awal
                                </span>
                                <p className="mt-0.5 font-mono text-xs font-semibold text-slate-700 dark:text-zinc-300">
                                    {formatMoney(account.opening_balance, 'IDR')}
                                </p>
                            </div>
                        </div>

                        {/* Account Number Strip if bank account */}
                        {account.account_number && (
                            <div className="flex items-center justify-between border-t border-slate-200/70 pt-2.5 dark:border-white/[0.06]">
                                <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-zinc-300">
                                    <CreditCard className="size-3.5 text-slate-400 dark:text-zinc-500" />
                                    <span className="font-mono text-xs font-medium tracking-wide">
                                        {account.account_number}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={copyAccountNumber}
                                    className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium text-blue-600 transition-colors hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/40"
                                >
                                    {copied ? (
                                        <>
                                            <Check className="size-3 text-emerald-600 dark:text-emerald-400" />
                                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                                Tersalin
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="size-3" />
                                            <span>Salin No. Rek</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Account Type Classification Card (styled like CreateAccountDialog's account type card) */}
                    <div>
                        <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                            Klasifikasi Rekening
                        </Label>
                        <div className="mt-1 flex items-start gap-2.5 rounded-lg border border-slate-200 bg-white p-2.5 dark:border-white/10 dark:bg-[#16181f]">
                            <div
                                className={cn(
                                    'mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-slate-100 dark:bg-white/10',
                                    cfg.color,
                                )}
                            >
                                <TypeIcon className="size-3.5" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-2">
                                    <p className="text-xs font-semibold text-slate-800 dark:text-zinc-200">
                                        {cfg.label}
                                    </p>
                                    {account.partner && (
                                        <span className="text-[11px] text-slate-500 dark:text-zinc-400">
                                            Partner:{' '}
                                            <strong className="font-semibold text-slate-800 dark:text-zinc-200">
                                                {account.partner.name}
                                            </strong>
                                        </span>
                                    )}
                                </div>
                                <p className="mt-0.5 text-[10px] text-slate-400 dark:text-zinc-500">
                                    {cfg.desc}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Transaction Breakdown: 4 Stat Tiles */}
                    <div>
                        <div className="flex items-center justify-between pb-1">
                            <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                                Riwayat Mutasi & Transaksi
                            </Label>
                            <span className="font-mono text-[10px] text-slate-400 dark:text-zinc-500">
                                {totalTransactions} riwayat transaksi
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            {/* Payments In */}
                            <div className="flex items-center gap-2.5 rounded-lg border border-slate-200/80 bg-white p-2.5 transition-colors dark:border-white/10 dark:bg-[#16181f]">
                                <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                                    <ArrowDownLeft className="size-3.5" strokeWidth={2.2} />
                                </div>
                                <div className="min-w-0">
                                    <span className="block text-[10px] text-slate-400 truncate dark:text-zinc-500">
                                        Invoice Masuk
                                    </span>
                                    <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                                        {account.payments_count ?? 0}{' '}
                                        <span className="text-[10px] font-normal text-slate-400">transaksi</span>
                                    </span>
                                </div>
                            </div>

                            {/* Expenses Out */}
                            <div className="flex items-center gap-2.5 rounded-lg border border-slate-200/80 bg-white p-2.5 transition-colors dark:border-white/10 dark:bg-[#16181f]">
                                <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
                                    <ArrowUpRight className="size-3.5" strokeWidth={2.2} />
                                </div>
                                <div className="min-w-0">
                                    <span className="block text-[10px] text-slate-400 truncate dark:text-zinc-500">
                                        Biaya Keluar
                                    </span>
                                    <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                                        {account.expenses_count ?? 0}{' '}
                                        <span className="text-[10px] font-normal text-slate-400">transaksi</span>
                                    </span>
                                </div>
                            </div>

                            {/* Transfers */}
                            <div className="flex items-center gap-2.5 rounded-lg border border-slate-200/80 bg-white p-2.5 transition-colors dark:border-white/10 dark:bg-[#16181f]">
                                <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                                    <ArrowRightLeft className="size-3.5" strokeWidth={2} />
                                </div>
                                <div className="min-w-0">
                                    <span className="block text-[10px] text-slate-400 truncate dark:text-zinc-500">
                                        Mutasi Transfer
                                    </span>
                                    <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                                        {(account.outgoing_transfers_count ?? 0) +
                                            (account.incoming_transfers_count ?? 0)}{' '}
                                        <span className="text-[10px] font-normal text-slate-400">kali</span>
                                    </span>
                                </div>
                            </div>

                            {/* Payroll & Trust */}
                            <div className="flex items-center gap-2.5 rounded-lg border border-slate-200/80 bg-white p-2.5 transition-colors dark:border-white/10 dark:bg-[#16181f]">
                                <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400">
                                    <Receipt className="size-3.5" strokeWidth={2} />
                                </div>
                                <div className="min-w-0">
                                    <span className="block text-[10px] text-slate-400 truncate dark:text-zinc-500">
                                        Payroll & Titipan
                                    </span>
                                    <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                                        {(account.payrolls_count ?? 0) +
                                            (account.client_trust_funds_count ?? 0) +
                                            (account.partner_transactions_count ?? 0)}{' '}
                                        <span className="text-[10px] font-normal text-slate-400">data</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Metadata Details Card */}
                    <div className="space-y-2 rounded-xl border border-slate-200/80 bg-slate-50/50 p-3 text-xs dark:border-white/[0.06] dark:bg-[#16181f]">
                        {account.created_at && (
                            <div className="flex items-center justify-between text-slate-600 dark:text-zinc-300">
                                <span className="flex items-center gap-1.5 text-slate-500 dark:text-zinc-400">
                                    <Calendar className="size-3.5 text-slate-400" />
                                    Tanggal Terdaftar
                                </span>
                                <span className="font-semibold text-slate-800 dark:text-zinc-200">
                                    {formatDate(account.created_at)}
                                </span>
                            </div>
                        )}

                        {account.creator && (
                            <div className="flex items-center justify-between text-slate-600 dark:text-zinc-300">
                                <span className="flex items-center gap-1.5 text-slate-500 dark:text-zinc-400">
                                    <User className="size-3.5 text-slate-400" />
                                    Didaftarkan Oleh
                                </span>
                                <span className="font-semibold text-slate-800 dark:text-zinc-200">
                                    {account.creator.name}
                                </span>
                            </div>
                        )}

                        {account.description && (
                            <div className="border-t border-slate-200/70 pt-2 dark:border-white/[0.06]">
                                <span className="flex items-center gap-1.5 text-[10px] font-semibold tracking-wider text-slate-500 uppercase dark:text-zinc-400">
                                    <FileText className="size-3.5 text-slate-400" />
                                    Catatan
                                </span>
                                <p className="mt-1 text-xs leading-relaxed text-slate-700 dark:text-zinc-300">
                                    {account.description}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* 3. Footer Actions: Balanced, Clean & Symmetrical Corners */}
                <div className="flex shrink-0 items-center justify-between border-t border-slate-100 bg-slate-50/60 px-5 py-3 sm:px-6 dark:border-white/[0.06] dark:bg-[#151821]/60">
                    <div>
                        {canManage && onDelete && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    onOpenChange(false);
                                    onDelete(account);
                                }}
                                className="h-8 gap-1.5 rounded-lg px-2.5 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-950/30"
                            >
                                <Trash2 className="size-3.5" />
                                Hapus Rekening
                            </Button>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        {canManage && onEdit && (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    onOpenChange(false);
                                    onEdit(account);
                                }}
                                className="h-8 gap-1.5 rounded-lg border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-300"
                            >
                                <Pencil className="size-3.5 text-slate-500" />
                                Edit Rekening
                            </Button>
                        )}
                        {onTransfer && (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    onOpenChange(false);
                                    onTransfer(account);
                                }}
                                className="h-8 gap-1.5 rounded-lg border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-300"
                            >
                                <ArrowRightLeft className="size-3.5 text-slate-500" />
                                Transfer Dana
                            </Button>
                        )}
                        <Button
                            type="button"
                            size="sm"
                            onClick={() => onOpenChange(false)}
                            className="h-8 rounded-lg bg-slate-900 px-4 text-xs font-semibold text-white shadow-xs transition-all hover:bg-slate-800 active:scale-[0.98] dark:bg-white dark:text-slate-900 dark:hover:bg-zinc-200"
                        >
                            Tutup
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
