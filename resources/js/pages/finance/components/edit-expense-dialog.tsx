import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import {
    AlertCircle,
    ChevronDown,
    CreditCard,
    Loader2,
    Save,
    Trash2,
    UserCheck,
    WalletCards,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { FileInput } from '@/components/ui/file-input';
import { Input } from '@/components/ui/input';
import { MoneyInput } from '@/components/ui/money-input';
import { Label } from '@/components/ui/label';
import UserPicker, { type UserOption } from '@/components/user-picker';
import { financeDialogPanelClass } from './finance-dialog-design';

export type ExpenseItem = {
    id: string;
    matter_id?: string;
    matter?: { id: string; matter_number: string; title: string };
    category?: string;
    charge_to?: string;
    description?: string;
    vendor?: string;
    incurred_at?: string;
    amount?: number;
    currency?: string;
    account_id?: string;
    account?: { id: string; name: string };
    partner_id?: number;
    partner?: { id: number; name: string };
    is_reimbursable?: boolean;
    status?: string;
};

const EXPENSE_CATEGORIES = [
    { value: 'office_supplies', label: 'ATK & Keperluan Kantor' },
    { value: 'utilities', label: 'Listrik, Air & Internet' },
    { value: 'rent', label: 'Sewa Gedung / Kantor' },
    { value: 'software', label: 'Langganan Software / Cloud / IT' },
    { value: 'court_fee', label: 'Biaya Pengadilan & Legalisasi (PNBP)' },
    { value: 'travel', label: 'Transportasi & Akomodasi Sidang' },
    { value: 'courier', label: 'Kurir & Pengiriman Dokumen' },
    { value: 'printing', label: 'Percetakan & Fotokopi Berkas' },
    { value: 'general', label: 'Operasional Umum Lainnya' },
];

export function EditExpenseDialog({
    open,
    onOpenChange,
    expense,
    matters = [],
    accounts = [],
    partners = [],
    onDelete,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    expense: ExpenseItem | null;
    matters?: { id: string; matter_number: string; title: string }[];
    accounts?: { id: string; name: string }[];
    partners?: UserOption[];
    onDelete?: (expense: ExpenseItem) => void;
}) {
    const [data, setData] = useState({
        matter_id: '',
        category: 'general',
        charge_to: 'office',
        description: '',
        vendor: '',
        incurred_at: '',
        amount: 0,
        currency: 'IDR',
        paid_by: 'account' as 'account' | 'partner',
        account_id: '',
        partner_id: '',
        proof: null as File | null,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (expense) {
            const hasPartner = !!expense.partner_id || !!expense.partner?.id;
            setData({
                matter_id: expense.matter_id || expense.matter?.id || '',
                category: expense.category || 'general',
                charge_to:
                    expense.charge_to ||
                    (expense.matter_id ? 'client' : 'office'),
                description: expense.description || '',
                vendor: expense.vendor || '',
                incurred_at: expense.incurred_at
                    ? expense.incurred_at.slice(0, 10)
                    : '',
                amount: expense.amount || 0,
                currency: expense.currency || 'IDR',
                paid_by: hasPartner ? 'partner' : 'account',
                account_id: expense.account_id || expense.account?.id || '',
                partner_id:
                    expense.partner_id?.toString() ||
                    expense.partner?.id?.toString() ||
                    '',
                proof: null,
            });
            setErrors({});
        }
    }, [expense, open]);

    if (!expense) return null;

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        const formData = new FormData();
        formData.append('_method', 'PUT');
        if (data.matter_id) formData.append('matter_id', data.matter_id);
        formData.append('category', data.category);
        formData.append('charge_to', data.charge_to);
        formData.append('description', data.description);
        if (data.vendor) formData.append('vendor', data.vendor);
        formData.append('incurred_at', data.incurred_at);
        formData.append('amount', data.amount.toString());
        formData.append('currency', data.currency);

        if (data.paid_by === 'partner') {
            if (data.partner_id) formData.append('partner_id', data.partner_id);
        } else {
            if (data.account_id) formData.append('account_id', data.account_id);
        }

        if (data.proof) {
            formData.append('proof', data.proof);
        }

        router.post(`/finance/expenses/${expense.id}`, formData, {
            preserveScroll: true,
            onSuccess: () => {
                setProcessing(false);
                onOpenChange(false);
            },
            onError: (errs) => {
                setErrors(errs);
                setProcessing(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={financeDialogPanelClass('default')}>
                {/* Header */}
                <DialogHeader className="border-b border-slate-100 pb-3 dark:border-white/[0.06]">
                    <div className="flex items-center gap-2.5">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
                            <WalletCards className="size-4.5" />
                        </div>
                        <div>
                            <DialogTitle className="text-sm font-bold text-slate-900 sm:text-base dark:text-white">
                                Edit Biaya &amp; Pengeluaran
                            </DialogTitle>
                            <DialogDescription className="text-xs text-slate-500 dark:text-zinc-400">
                                Perbarui rincian beban operasional atau
                                reimbursement perkara.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={submit} className="space-y-3.5 pt-1 text-xs">
                    {/* Section 1: Classification & Matter */}
                    <div className="space-y-2.5 rounded-xl border border-slate-200/80 bg-slate-50/50 p-3 dark:border-white/[0.06] dark:bg-[#16181f]">
                        <div className="grid gap-2.5 sm:grid-cols-2">
                            <div>
                                <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                                    Beban Biaya (Charge To){' '}
                                    <span className="text-rose-500">*</span>
                                </Label>
                                <div className="relative mt-1">
                                    <select
                                        value={data.charge_to}
                                        onChange={(e) =>
                                            setData({
                                                ...data,
                                                charge_to: e.target.value,
                                            })
                                        }
                                        required
                                        className="h-8.5 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white pr-8 pl-2.5 text-xs text-slate-900 shadow-2xs outline-hidden transition-all hover:border-slate-300 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 dark:border-white/10 dark:bg-[#121418] dark:text-zinc-200"
                                    >
                                        <option value="office">
                                            Beban Operasional Kantor
                                        </option>
                                        <option value="client">
                                            Reimbursement Klien (Perkara)
                                        </option>
                                    </select>
                                    <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-slate-400" />
                                </div>
                            </div>

                            <div>
                                <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                                    Terkait Perkara (Matter)
                                </Label>
                                <div className="relative mt-1">
                                    <select
                                        value={data.matter_id}
                                        onChange={(e) =>
                                            setData({
                                                ...data,
                                                matter_id: e.target.value,
                                            })
                                        }
                                        className="h-8.5 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white pr-8 pl-2.5 text-xs text-slate-900 shadow-2xs outline-hidden transition-all hover:border-slate-300 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 dark:border-white/10 dark:bg-[#121418] dark:text-zinc-200"
                                    >
                                        <option value="">
                                            -- Non-Perkara / Umum --
                                        </option>
                                        {matters.map((m) => (
                                            <option key={m.id} value={m.id}>
                                                {m.matter_number} — {m.title}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-slate-400" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Expense Details */}
                    <div className="space-y-2.5 rounded-xl border border-slate-200/80 bg-slate-50/50 p-3 dark:border-white/[0.06] dark:bg-[#16181f]">
                        <div className="grid gap-2.5 sm:grid-cols-2">
                            <div>
                                <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                                    Kategori Pengeluaran{' '}
                                    <span className="text-rose-500">*</span>
                                </Label>
                                <div className="relative mt-1">
                                    <select
                                        value={data.category}
                                        onChange={(e) =>
                                            setData({
                                                ...data,
                                                category: e.target.value,
                                            })
                                        }
                                        required
                                        className="h-8.5 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white pr-8 pl-2.5 text-xs text-slate-900 shadow-2xs outline-hidden transition-all hover:border-slate-300 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 dark:border-white/10 dark:bg-[#121418] dark:text-zinc-200"
                                    >
                                        {EXPENSE_CATEGORIES.map((cat) => (
                                            <option
                                                key={cat.value}
                                                value={cat.value}
                                            >
                                                {cat.label}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-slate-400" />
                                </div>
                            </div>

                            <div>
                                <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                                    Vendor / Penerima Pembayaran
                                </Label>
                                <Input
                                    type="text"
                                    value={data.vendor}
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            vendor: e.target.value,
                                        })
                                    }
                                    placeholder="cth: PT Telkom / PN Jakarta Pusat"
                                    className="mt-1 h-8.5 rounded-lg border-slate-200 bg-white text-xs dark:border-white/10 dark:bg-[#121418]"
                                />
                            </div>
                        </div>

                        <div>
                            <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                                Deskripsi Biaya{' '}
                                <span className="text-rose-500">*</span>
                            </Label>
                            <Input
                                type="text"
                                required
                                value={data.description}
                                onChange={(e) =>
                                    setData({
                                        ...data,
                                        description: e.target.value,
                                    })
                                }
                                placeholder="cth: Biaya pendaftaran perkara kasasi & leges dokumen..."
                                className="mt-1 h-8.5 rounded-lg border-slate-200 bg-white text-xs dark:border-white/10 dark:bg-[#121418]"
                            />
                        </div>
                    </div>

                    {/* Section 3: Amount & Payment Source */}
                    <div className="space-y-2.5 rounded-xl border border-slate-200/80 bg-slate-50/50 p-3 dark:border-white/[0.06] dark:bg-[#16181f]">
                        <div className="grid gap-2.5 sm:grid-cols-2">
                            <div>
                                <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                                    Nominal Biaya (IDR){' '}
                                    <span className="text-rose-500">*</span>
                                </Label>
                                <MoneyInput
                                    required
                                    value={data.amount}
                                    onValueChange={(val) =>
                                        setData({ ...data, amount: val })
                                    }
                                    placeholder="0"
                                    className="mt-1 h-8.5 rounded-lg border-slate-200 bg-white font-mono text-xs font-semibold text-slate-900 dark:border-white/10 dark:bg-[#121418] dark:text-white"
                                />
                            </div>

                            <div>
                                <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                                    Tanggal Pengeluaran{' '}
                                    <span className="text-rose-500">*</span>
                                </Label>
                                <Input
                                    type="date"
                                    required
                                    value={data.incurred_at}
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            incurred_at: e.target.value,
                                        })
                                    }
                                    className="mt-1 h-8.5 rounded-lg border-slate-200 bg-white text-xs dark:border-white/10 dark:bg-[#121418]"
                                />
                            </div>
                        </div>

                        {/* Paid By Toggle */}
                        <div className="border-t border-slate-200/60 pt-2.5 dark:border-white/[0.06]">
                            <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                                Sumber Dana Pembayaran{' '}
                                <span className="text-rose-500">*</span>
                            </Label>
                            <div className="mt-1.5 grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setData({ ...data, paid_by: 'account' })
                                    }
                                    className={`flex items-center gap-2 rounded-lg border p-2 text-left transition-all ${
                                        data.paid_by === 'account'
                                            ? 'border-rose-600 bg-rose-50/60 ring-1 ring-rose-600 dark:border-rose-500 dark:bg-rose-950/30'
                                            : 'border-slate-200 bg-white hover:border-slate-300 dark:border-white/10 dark:bg-[#121418]'
                                    }`}
                                >
                                    <div
                                        className={`flex size-6 shrink-0 items-center justify-center rounded-md ${
                                            data.paid_by === 'account'
                                                ? 'bg-rose-600 text-white'
                                                : 'bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-zinc-400'
                                        }`}
                                    >
                                        <CreditCard className="size-3" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p
                                            className={`text-xs font-semibold ${data.paid_by === 'account' ? 'text-rose-950 dark:text-rose-200' : 'text-slate-800 dark:text-zinc-200'}`}
                                        >
                                            Kas / Rekening Kantor
                                        </p>
                                        <p className="truncate text-[10px] text-slate-400 dark:text-zinc-500">
                                            Pengeluaran kas operasional
                                        </p>
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setData({ ...data, paid_by: 'partner' })
                                    }
                                    className={`flex items-center gap-2 rounded-lg border p-2 text-left transition-all ${
                                        data.paid_by === 'partner'
                                            ? 'border-amber-600 bg-amber-50/60 ring-1 ring-amber-600 dark:border-amber-500 dark:bg-amber-950/30'
                                            : 'border-slate-200 bg-white hover:border-slate-300 dark:border-white/10 dark:bg-[#121418]'
                                    }`}
                                >
                                    <div
                                        className={`flex size-6 shrink-0 items-center justify-center rounded-md ${
                                            data.paid_by === 'partner'
                                                ? 'bg-amber-600 text-white'
                                                : 'bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-zinc-400'
                                        }`}
                                    >
                                        <UserCheck className="size-3" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p
                                            className={`text-xs font-semibold ${data.paid_by === 'partner' ? 'text-amber-950 dark:text-amber-200' : 'text-slate-800 dark:text-zinc-200'}`}
                                        >
                                            Ditalangi Partner
                                        </p>
                                        <p className="truncate text-[10px] text-slate-400 dark:text-zinc-500">
                                            Dana talangan pribadi partner
                                        </p>
                                    </div>
                                </button>
                            </div>

                            <div className="mt-2">
                                {data.paid_by === 'account' ? (
                                    <div className="relative">
                                        <select
                                            value={data.account_id}
                                            onChange={(e) =>
                                                setData({
                                                    ...data,
                                                    account_id: e.target.value,
                                                })
                                            }
                                            className="h-8.5 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white pr-8 pl-2.5 text-xs text-slate-900 shadow-2xs outline-hidden transition-all hover:border-slate-300 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 dark:border-white/10 dark:bg-[#121418] dark:text-zinc-200"
                                        >
                                            <option value="">
                                                -- Pilih Rekening Kas Pembayar
                                                --
                                            </option>
                                            {accounts.map((a) => (
                                                <option key={a.id} value={a.id}>
                                                    {a.name}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-slate-400" />
                                    </div>
                                ) : (
                                    <UserPicker
                                        id="edit_expense_partner_id"
                                        value={data.partner_id}
                                        onChange={(val) =>
                                            setData({
                                                ...data,
                                                partner_id: val,
                                            })
                                        }
                                        users={partners}
                                        placeholder="-- Pilih Partner yang Menalangi --"
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Section 4: Proof Document */}
                    <div className="space-y-2 rounded-xl border border-slate-200/80 bg-slate-50/50 p-3 dark:border-white/[0.06] dark:bg-[#16181f]">
                        <div>
                            <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                                Ganti / Unggah Bukti Kuitansi (Opsional)
                            </Label>
                            <div className="mt-1">
                                <FileInput
                                    name="proof"
                                    accept=".pdf,.jpg,.jpeg,.png,.webp,image/*,application/pdf"
                                    buttonText="Pilih Berkas"
                                    placeholder="Unggah berkas kuitansi baru..."
                                    onFileSelect={(file) =>
                                        setData({ ...data, proof: file })
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    {Object.keys(errors).length > 0 && (
                        <div className="rounded-xl border border-rose-200/80 bg-rose-50/70 p-2.5 text-xs text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300">
                            <div className="flex items-center gap-1.5 font-semibold text-rose-700 dark:text-rose-400">
                                <AlertCircle className="size-3.5 shrink-0" />
                                <span>Terdapat kesalahan validasi:</span>
                            </div>
                            <ul className="mt-1 list-inside list-disc space-y-0.5 pl-1 text-[11px]">
                                {Object.values(errors).map((err, i) => (
                                    <li key={i}>{err}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <DialogFooter className="flex flex-row items-center justify-between border-t border-slate-100 pt-3 sm:justify-between dark:border-white/[0.06]">
                        {onDelete ? (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    onOpenChange(false);
                                    onDelete(expense);
                                }}
                                disabled={processing}
                                className="h-8.5 gap-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30"
                            >
                                <Trash2 className="size-3.5" />
                                Hapus Biaya
                            </Button>
                        ) : (
                            <div />
                        )}

                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => onOpenChange(false)}
                                disabled={processing}
                                className="h-8.5 rounded-lg text-xs font-semibold"
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="h-8.5 gap-1.5 rounded-lg bg-blue-600 px-4 text-xs font-semibold text-white shadow-2xs hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="size-3.5 animate-spin" />
                                        Menyimpan...
                                    </>
                                ) : (
                                    <>
                                        <Save className="size-3.5" />
                                        Simpan Perubahan
                                    </>
                                )}
                            </Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
