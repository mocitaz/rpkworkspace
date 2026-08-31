import { router } from '@inertiajs/react';
import { FolderKanban, Pencil, Scale } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MoneyInput } from '@/components/ui/money-input';
import { formatMoney } from '@/lib/format';
import { financeDialogPanelClass } from './finance-dialog-design';
import { FinanceDialogBody, FinanceDialogHeader } from './finance-dialog-ui';

export type ProfitabilityItem = {
    id: string;
    matter_number: string;
    title: string;
    client_name: string;
    status: string;
    contract_value: number;
    currency?: string;
    contract_date?: string | null;
    billing_model?: string | null;
    invoiced_amount: number;
    collected_amount: number;
    unbilled_contract: number;
    office_expenses: number;
    client_expenses: number;
    total_expenses: number;
    net_margin: number;
    margin_percentage: number;
};

function ProgressRing({
    value,
    color,
    label,
}: {
    value: number;
    color: string;
    label: string;
}) {
    const normalizedValue = Math.min(Math.max(value, 0), 100);
    const circumference = 2 * Math.PI * 16;
    const dashOffset = circumference * (1 - normalizedValue / 100);

    return (
        <div
            className="relative size-12 shrink-0"
            role="img"
            aria-label={`${label} ${normalizedValue.toFixed(1)}%`}
        >
            <svg
                viewBox="0 0 40 40"
                className="size-full -rotate-90"
                aria-hidden="true"
            >
                <circle
                    cx="20"
                    cy="20"
                    r="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="text-slate-100 dark:text-white/[0.07]"
                />
                <circle
                    cx="20"
                    cy="20"
                    r="16"
                    fill="none"
                    stroke={color}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={dashOffset}
                />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center font-mono text-[9px] font-bold text-slate-700 dark:text-zinc-200">
                {normalizedValue.toFixed(0)}%
            </span>
        </div>
    );
}

export function ProfitabilityTable({
    items,
    canManageContract = false,
}: {
    items: ProfitabilityItem[];
    canManageContract?: boolean;
}) {
    const [selectedMatter, setSelectedMatter] =
        useState<ProfitabilityItem | null>(null);
    const [contractValue, setContractValue] = useState(0);
    const [currency, setCurrency] = useState('IDR');
    const [contractDate, setContractDate] = useState('');
    const [billingModel, setBillingModel] = useState('');
    const [saving, setSaving] = useState(false);

    const openContractEditor = (item: ProfitabilityItem) => {
        setSelectedMatter(item);
        setContractValue(item.contract_value);
        setCurrency(item.currency || 'IDR');
        setContractDate(item.contract_date || '');
        setBillingModel(item.billing_model || '');
    };

    const saveContract = () => {
        if (!selectedMatter) {
            return;
        }

        setSaving(true);
        router.patch(
            `/finance/matters/${selectedMatter.id}/contract`,
            {
                budget_amount: contractValue,
                currency,
                contract_date: contractDate || null,
                billing_model: billingModel || null,
            },
            {
                preserveScroll: true,
                onSuccess: () => setSelectedMatter(null),
                onFinish: () => setSaving(false),
            },
        );
    };

    if (!items || items.length === 0) {
        return (
            <div className="rounded-xl border border-slate-200/70 bg-white p-8 text-center dark:border-white/[0.06] dark:bg-[#14161b]">
                <FolderKanban className="mx-auto size-9 text-slate-300 dark:text-zinc-600" />
                <p className="mt-2 text-xs font-semibold text-slate-700 dark:text-zinc-300">
                    Belum Ada Data Profitabilitas Perkara
                </p>
                <p className="text-[11px] text-slate-500 dark:text-zinc-500">
                    Data akan otomatis terhitung saat nilai kontrak perkara
                    diisi dan tagihan/biaya dicatat.
                </p>
            </div>
        );
    }

    const totalContract = items.reduce((acc, i) => acc + i.contract_value, 0);
    const totalInvoiced = items.reduce((acc, i) => acc + i.invoiced_amount, 0);
    const totalCollected = items.reduce(
        (acc, i) => acc + i.collected_amount,
        0,
    );
    const totalExpenses = items.reduce((acc, i) => acc + i.total_expenses, 0);
    const totalMargin = items.reduce((acc, i) => acc + i.net_margin, 0);
    const avgMarginPct =
        totalCollected > 0
            ? ((totalMargin / totalCollected) * 100).toFixed(1)
            : '0';
    const invoicedProgress =
        totalContract > 0
            ? Math.min((totalInvoiced / totalContract) * 100, 100)
            : 0;
    const collectedProgress =
        totalContract > 0
            ? Math.min((totalCollected / totalContract) * 100, 100)
            : 0;
    const expenseShare =
        totalCollected > 0
            ? Math.min((totalExpenses / totalCollected) * 100, 100)
            : 0;
    const collectionRate =
        totalInvoiced > 0
            ? Math.min((totalCollected / totalInvoiced) * 100, 100)
            : 0;
    const marginShare = Math.max(100 - expenseShare, 0);

    return (
        <div
            data-testid="profitability-workspace"
            className="overflow-hidden rounded-xl border border-slate-200/70 bg-white shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]"
        >
            <div className="flex items-center justify-between px-4 py-3">
                <div>
                    <h3 className="text-sm font-bold text-slate-950 dark:text-white">
                        Profitabilitas Perkara
                    </h3>
                    <p className="mt-0.5 text-[11px] text-slate-500 dark:text-zinc-400">
                        Nilai kontrak, realisasi penagihan, biaya, dan margin
                        perkara.
                    </p>
                </div>
                <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase dark:text-zinc-500">
                    {items.length} perkara
                </span>
            </div>

            <div className="border-t border-slate-200/70 p-3 sm:p-4 dark:border-white/[0.06]">
                <div className="grid gap-3 lg:grid-cols-5">
                    <section className="relative overflow-hidden rounded-xl border border-blue-100 bg-[#eef5ff] p-4 lg:col-span-3 dark:border-blue-400/10 dark:bg-blue-500/[0.06]">
                        <div className="pointer-events-none absolute -top-16 -right-10 size-40 rounded-full border-[24px] border-white/60 dark:border-white/[0.025]" />
                        <div className="pointer-events-none absolute right-24 bottom-0 h-px w-44 bg-blue-200/70 dark:bg-blue-400/10" />
                        <div className="relative flex items-start justify-between gap-3">
                            <div>
                                <p className="text-[10px] font-semibold tracking-[0.14em] text-blue-600 uppercase dark:text-blue-300">
                                    Total Nilai Kontrak
                                </p>
                                <p className="mt-1 font-mono text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl dark:text-white">
                                    {formatMoney(totalContract, 'IDR')}
                                </p>
                            </div>
                            {canManageContract && (
                                <button
                                    type="button"
                                    onClick={() => openContractEditor(items[0])}
                                    className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-blue-200/80 bg-white/80 px-2.5 py-1.5 text-[10.5px] font-semibold text-slate-700 shadow-xs transition-colors hover:border-blue-300 hover:bg-white hover:text-slate-950 dark:border-white/10 dark:bg-white/[0.06] dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-white"
                                    title="Atur Nilai Kontrak"
                                >
                                    <Pencil className="size-3" />
                                    Atur kontrak
                                </button>
                            )}
                        </div>

                        <div className="relative mt-5 space-y-3.5">
                            <div>
                                <div className="mb-1.5 flex items-center justify-between text-[10.5px]">
                                    <span className="text-slate-600 dark:text-zinc-400">
                                        Realisasi penagihan
                                    </span>
                                    <span className="font-mono font-semibold text-slate-950 dark:text-white">
                                        {invoicedProgress.toFixed(1)}%
                                    </span>
                                </div>
                                <div className="h-1.5 overflow-hidden rounded-full bg-blue-200/70 dark:bg-white/10">
                                    <div
                                        className="h-full rounded-full bg-blue-500"
                                        style={{
                                            width: `${invoicedProgress}%`,
                                        }}
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="mb-1.5 flex items-center justify-between text-[10.5px]">
                                    <span className="text-slate-600 dark:text-zinc-400">
                                        Kas diterima terhadap kontrak
                                    </span>
                                    <span className="font-mono font-semibold text-slate-950 dark:text-white">
                                        {collectedProgress.toFixed(1)}%
                                    </span>
                                </div>
                                <div className="h-1.5 overflow-hidden rounded-full bg-blue-200/70 dark:bg-white/10">
                                    <div
                                        className="h-full rounded-full bg-emerald-400"
                                        style={{
                                            width: `${collectedProgress}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="rounded-xl border border-slate-200/70 bg-slate-50/70 p-4 lg:col-span-2 dark:border-white/[0.06] dark:bg-white/[0.025]">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-[10px] font-semibold tracking-[0.14em] text-slate-400 uppercase dark:text-zinc-500">
                                    Margin Firma
                                </p>
                                <p className="mt-1 font-mono text-xl font-bold text-slate-950 dark:text-white">
                                    {formatMoney(totalMargin, 'IDR')}
                                </p>
                            </div>
                            <span className="font-mono text-lg font-bold text-slate-950 dark:text-white">
                                {avgMarginPct}%
                            </span>
                        </div>

                        <div className="mt-6">
                            <div className="flex h-2.5 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                                <div
                                    className="h-full bg-slate-400 dark:bg-zinc-500"
                                    style={{ width: `${expenseShare}%` }}
                                />
                                <div
                                    className="h-full bg-emerald-400"
                                    style={{ width: `${marginShare}%` }}
                                />
                            </div>
                            <div className="mt-2.5 flex items-center justify-between gap-3 text-[10px] font-medium text-slate-500 dark:text-zinc-400">
                                <span>Biaya {expenseShare.toFixed(1)}%</span>
                                <span>Margin {avgMarginPct}%</span>
                            </div>
                        </div>
                    </section>
                </div>

                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                    <section className="flex items-center justify-between gap-3 rounded-xl border border-slate-200/70 bg-white p-3.5 dark:border-white/[0.06] dark:bg-white/[0.025]">
                        <div className="min-w-0">
                            <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase dark:text-zinc-500">
                                Sudah Ditagih
                            </p>
                            <p className="mt-1 truncate font-mono text-base font-bold text-slate-950 dark:text-white">
                                {formatMoney(totalInvoiced, 'IDR')}
                            </p>
                            <p className="mt-1 text-[9.5px] text-slate-500 dark:text-zinc-500">
                                dari nilai kontrak
                            </p>
                        </div>
                        <ProgressRing
                            value={invoicedProgress}
                            color="#2563eb"
                            label="Penagihan kontrak"
                        />
                    </section>

                    <section className="flex items-center justify-between gap-3 rounded-xl border border-slate-200/70 bg-white p-3.5 dark:border-white/[0.06] dark:bg-white/[0.025]">
                        <div className="min-w-0">
                            <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase dark:text-zinc-500">
                                Kas Diterima
                            </p>
                            <p className="mt-1 truncate font-mono text-base font-bold text-slate-950 dark:text-white">
                                {formatMoney(totalCollected, 'IDR')}
                            </p>
                            <p className="mt-1 text-[9.5px] text-slate-500 dark:text-zinc-500">
                                dari tagihan terbit
                            </p>
                        </div>
                        <ProgressRing
                            value={collectionRate}
                            color="#10b981"
                            label="Kolektibilitas tagihan"
                        />
                    </section>

                    <section className="flex items-center justify-between gap-3 rounded-xl border border-slate-200/70 bg-white p-3.5 dark:border-white/[0.06] dark:bg-white/[0.025]">
                        <div className="min-w-0">
                            <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase dark:text-zinc-500">
                                Biaya Terpakai
                            </p>
                            <p className="mt-1 truncate font-mono text-base font-bold text-slate-950 dark:text-white">
                                {formatMoney(totalExpenses, 'IDR')}
                            </p>
                            <p className="mt-1 text-[9.5px] text-slate-500 dark:text-zinc-500">
                                dari kas diterima
                            </p>
                        </div>
                        <ProgressRing
                            value={expenseShare}
                            color="#f59e0b"
                            label="Rasio biaya"
                        />
                    </section>
                </div>
            </div>

            <Dialog
                open={Boolean(selectedMatter)}
                onOpenChange={(open) => !open && setSelectedMatter(null)}
            >
                <DialogContent className={financeDialogPanelClass('default')}>
                    <FinanceDialogHeader
                        icon={Scale}
                        eyebrow="Kontrak Perkara"
                        title="Atur Nilai Kontrak"
                        description={`${selectedMatter?.matter_number} · ${selectedMatter?.title}`}
                        tone="neutral"
                    />

                    <FinanceDialogBody className="grid gap-4 sm:grid-cols-2">
                        {items.length > 1 && (
                            <div className="space-y-1.5 sm:col-span-2">
                                <Label htmlFor="finance_contract_matter">
                                    Perkara
                                </Label>
                                <select
                                    id="finance_contract_matter"
                                    value={selectedMatter?.id || ''}
                                    onChange={(event) => {
                                        const matter = items.find(
                                            (item) =>
                                                item.id === event.target.value,
                                        );

                                        if (matter) {
                                            openContractEditor(matter);
                                        }
                                    }}
                                    className="flex h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs dark:border-white/10 dark:bg-zinc-800"
                                >
                                    {items.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.matter_number} — {item.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                        <div className="space-y-1.5 sm:col-span-2">
                            <Label htmlFor="finance_contract_value">
                                Nilai Kontrak
                            </Label>
                            <MoneyInput
                                id="finance_contract_value"
                                value={contractValue}
                                onValueChange={setContractValue}
                                prefixText={currency}
                            />
                            <p className="text-[10.5px] text-slate-400">
                                Nilai kesepakatan kontrak, bukan total invoice.
                            </p>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="finance_contract_currency">
                                Mata Uang
                            </Label>
                            <select
                                id="finance_contract_currency"
                                value={currency}
                                onChange={(event) =>
                                    setCurrency(event.target.value)
                                }
                                className="flex h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs dark:border-white/10 dark:bg-zinc-800"
                            >
                                <option value="IDR">IDR — Rupiah</option>
                                <option value="USD">USD — US Dollar</option>
                                <option value="SGD">
                                    SGD — Singapore Dollar
                                </option>
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="finance_contract_date">
                                Tanggal Kontrak
                            </Label>
                            <Input
                                id="finance_contract_date"
                                type="date"
                                value={contractDate}
                                onChange={(event) =>
                                    setContractDate(event.target.value)
                                }
                            />
                        </div>

                        <div className="space-y-1.5 sm:col-span-2">
                            <Label htmlFor="finance_billing_model">
                                Model Penagihan
                            </Label>
                            <select
                                id="finance_billing_model"
                                value={billingModel}
                                onChange={(event) =>
                                    setBillingModel(event.target.value)
                                }
                                className="flex h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs dark:border-white/10 dark:bg-zinc-800"
                            >
                                <option value="">Belum ditentukan</option>
                                <option value="fixed_fee">Fixed Fee</option>
                                <option value="retainer">Retainer</option>
                                <option value="hourly">Hourly Rate</option>
                                <option value="milestone">
                                    Per Tahapan / Milestone
                                </option>
                                <option value="success_fee">Success Fee</option>
                                <option value="hybrid">Hybrid</option>
                            </select>
                        </div>
                    </FinanceDialogBody>

                    <DialogFooter className="shrink-0 border-t border-slate-100 px-5 py-3.5 sm:px-6 dark:border-white/[0.06]">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setSelectedMatter(null)}
                        >
                            Batal
                        </Button>
                        <Button
                            type="button"
                            disabled={saving}
                            onClick={saveContract}
                        >
                            {saving ? 'Menyimpan…' : 'Simpan Kontrak'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
