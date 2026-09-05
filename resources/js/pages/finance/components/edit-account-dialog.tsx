import { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import {
    Banknote,
    Building2,
    Landmark,
    Lock,
    Shield,
    Users,
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import UserPicker, { type UserOption } from '@/components/user-picker';
import { formatMoney } from '@/lib/format';
import type { FinancialAccountItem } from './accounts-view';
import { financeDialogPanelClass } from './finance-dialog-design';
import {
    FinanceDialogErrors,
    FinanceDialogFooter,
    FinanceDialogHeader,
} from './finance-dialog-ui';

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

export function EditAccountDialog({
    account,
    open,
    onOpenChange,
    partners,
}: {
    account: FinancialAccountItem | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    partners: UserOption[];
}) {
    const form = useForm({
        name: '',
        bank_name: '',
        account_number: '',
        partner_id: '',
        description: '',
    });

    useEffect(() => {
        if (account) {
            form.setData({
                name: account.name || '',
                bank_name: account.bank_name || '',
                account_number: account.account_number || '',
                partner_id: account.partner?.id ? String(account.partner.id) : '',
                description: account.description || '',
            });
            form.clearErrors();
        }
    }, [account]);

    if (!account) {
        return null;
    }

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.put(`/finance/accounts/${account.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                onOpenChange(false);
            },
        });
    };

    const cfg = typeBadgeConfig[account.type] || {
        label: account.type,
        icon: Landmark,
        color: 'text-slate-600 dark:text-zinc-400',
        desc: 'Akun Kas & Bank',
    };
    const TypeIcon = cfg.icon;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={financeDialogPanelClass('default')}>
                {/* 1. Header identical to CreateAccountDialog */}
                <FinanceDialogHeader
                    icon={Building2}
                    eyebrow="Kas & Bank"
                    title="Edit Akun Kas / Bank"
                    description={`Perbarui identitas, nama bank, nomor rekening, dan catatan akun ${account.name}.`}
                />

                {/* 2. Form directly under DialogContent with space-y-3.5 and pt-1 (exact same structure as CreateAccountDialog) */}
                <form onSubmit={submit} className="space-y-3.5 pt-1 text-xs">
                    {/* Sleek Summary & Locked Balance Card */}
                    <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-slate-50/50 p-3 dark:border-white/[0.06] dark:bg-[#16181f]">
                        <div className="flex items-center gap-2.5 min-w-0">
                            <div
                                className={`flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-white/10 ${cfg.color}`}
                            >
                                <TypeIcon className="size-4" />
                            </div>
                            <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                    <p className="truncate text-xs font-semibold text-slate-800 dark:text-zinc-200">
                                        {cfg.label}
                                    </p>
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase tracking-wide dark:text-zinc-400">
                                        <Lock className="size-2.5 text-slate-400" />
                                        Saldo Terkunci
                                    </span>
                                </div>
                                <p className="truncate text-[10px] text-slate-400 dark:text-zinc-500">
                                    {cfg.desc}
                                </p>
                            </div>
                        </div>

                        <div className="shrink-0 text-right">
                            <span className="block text-[10px] font-semibold text-slate-400 dark:text-zinc-500">
                                Saldo Saat Ini
                            </span>
                            <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                                {formatMoney(account.current_balance, 'IDR')}
                            </span>
                        </div>
                    </div>

                    {/* Account Details Form Card */}
                    <div className="space-y-2.5 rounded-xl border border-slate-200/80 bg-slate-50/50 p-3 dark:border-white/[0.06] dark:bg-[#16181f]">
                        <div>
                            <Label
                                htmlFor="edit_acc_name"
                                className="text-xs font-semibold text-slate-700 dark:text-zinc-200"
                            >
                                Nama Akun / Rekening *
                            </Label>
                            <Input
                                id="edit_acc_name"
                                required
                                placeholder="cth: Bank Mandiri Operasional / Kas Tunai Jakarta"
                                value={form.data.name}
                                onChange={(e) =>
                                    form.setData('name', e.target.value)
                                }
                                className="mt-1 h-8.5 rounded-lg border-slate-200 bg-white text-xs dark:border-white/10 dark:bg-[#121418]"
                            />
                        </div>

                        {account.type !== 'cash' && (
                            <div className="grid gap-2 pt-0.5 sm:grid-cols-2">
                                <div>
                                    <Label
                                        htmlFor="edit_bank_name"
                                        className="text-xs font-semibold text-slate-700 dark:text-zinc-200"
                                    >
                                        Nama Bank
                                    </Label>
                                    <Input
                                        id="edit_bank_name"
                                        placeholder="cth: Bank Mandiri / BCA"
                                        value={form.data.bank_name}
                                        onChange={(e) =>
                                            form.setData(
                                                'bank_name',
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1 h-8.5 rounded-lg border-slate-200 bg-white text-xs dark:border-white/10 dark:bg-[#121418]"
                                    />
                                </div>
                                <div>
                                    <Label
                                        htmlFor="edit_acc_num"
                                        className="text-xs font-semibold text-slate-700 dark:text-zinc-200"
                                    >
                                        Nomor Rekening
                                    </Label>
                                    <Input
                                        id="edit_acc_num"
                                        placeholder="cth: 131-00-2233445-5"
                                        value={form.data.account_number}
                                        onChange={(e) =>
                                            form.setData(
                                                'account_number',
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1 h-8.5 rounded-lg border-slate-200 bg-white font-mono text-xs dark:border-white/10 dark:bg-[#121418]"
                                    />
                                </div>
                            </div>
                        )}

                        {account.type === 'partner_advance' && (
                            <div className="pt-0.5">
                                <Label
                                    htmlFor="edit_account_partner_id"
                                    className="text-xs font-semibold text-slate-700 dark:text-zinc-200"
                                >
                                    Partner Pemilik Akun
                                </Label>
                                <div className="mt-1">
                                    <UserPicker
                                        id="edit_account_partner_id"
                                        value={form.data.partner_id}
                                        onChange={(val) =>
                                            form.setData('partner_id', val)
                                        }
                                        users={partners}
                                        placeholder="Pilih Partner Pemilik..."
                                        emptyOptionLabel="-- Pilih Partner Pemilik --"
                                        allowClear
                                    />
                                </div>
                            </div>
                        )}

                        <div className="pt-0.5">
                            <Label
                                htmlFor="edit_acc_desc"
                                className="text-xs font-semibold text-slate-700 dark:text-zinc-200"
                            >
                                Catatan / Deskripsi (Opsional)
                            </Label>
                            <Input
                                id="edit_acc_desc"
                                placeholder="cth: Rekening utama penampung honorarium perkara"
                                value={form.data.description}
                                onChange={(e) =>
                                    form.setData('description', e.target.value)
                                }
                                className="mt-1 h-8.5 rounded-lg border-slate-200 bg-white text-xs dark:border-white/10 dark:bg-[#121418]"
                            />
                        </div>
                    </div>

                    <FinanceDialogErrors errors={form.errors} />
                    <FinanceDialogFooter
                        onCancel={() => onOpenChange(false)}
                        processing={form.processing}
                        submitLabel="Simpan Perubahan"
                    />
                </form>
            </DialogContent>
        </Dialog>
    );
}
