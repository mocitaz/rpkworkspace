import { router } from '@inertiajs/react';
import {
    AlertCircle,
    Building2,
    Calendar,
    ChevronDown,
    Coins,
    FilePlus2,
    FileText,
    FolderKanban,
    Plus,
    Trash2,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { MoneyInput } from '@/components/ui/money-input';
import { Label } from '@/components/ui/label';
import { formatMoney } from '@/lib/format';

export type QuotationData = {
    id: string;
    quotation_number: string;
    client_id?: string;
    matter_id?: string;
    title: string;
    scope?: string;
    status: string;
    currency: string;
    subtotal_amount?: number;
    discount_amount?: number;
    tax_rate?: number;
    tax_amount?: number;
    total_amount: number;
    issued_at?: string;
    valid_until?: string;
    client?: {
        id?: string;
        display_name: string;
        legal_name?: string;
    };
    matter?: {
        id: string;
        matter_number: string;
        title: string;
    };
    line_items?: {
        id?: string;
        description: string;
        quantity: number;
        unit_amount: number;
        total_amount?: number;
    }[];
    lineItems?: {
        id?: string;
        description: string;
        quantity: number;
        unit_amount: number;
        total_amount?: number;
    }[];
};

type LineItemRow = {
    description: string;
    quantity: string | number;
    unit_amount: string | number;
};

export function EditQuotationDialog({
    open,
    onOpenChange,
    quotation,
    clients = [],
    matters = [],
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    quotation: QuotationData | null;
    clients?: { id: string; display_name: string; legal_name?: string }[];
    matters?: {
        id: string;
        matter_number: string;
        title: string;
        client_id?: string;
    }[];
}) {
    const [clientId, setClientId] = useState('');
    const [matterId, setMatterId] = useState('');
    const [title, setTitle] = useState('');
    const [scope, setScope] = useState('');
    const [status, setStatus] = useState('draft');
    const [currency, setCurrency] = useState('IDR');
    const [issuedAt, setIssuedAt] = useState('');
    const [validUntil, setValidUntil] = useState('');
    const [discountAmount, setDiscountAmount] = useState('0');
    const [taxRate, setTaxRate] = useState('0');
    const [lineItems, setLineItems] = useState<LineItemRow[]>([]);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (quotation) {
            setClientId(quotation.client_id || quotation.client?.id || '');
            setMatterId(quotation.matter_id || quotation.matter?.id || '');
            setTitle(quotation.title || '');
            setScope(quotation.scope || '');
            setStatus(quotation.status || 'draft');
            setCurrency(quotation.currency || 'IDR');
            setIssuedAt(
                quotation.issued_at
                    ? quotation.issued_at.substring(0, 10)
                    : new Date().toISOString().split('T')[0],
            );
            setValidUntil(
                quotation.valid_until ? quotation.valid_until.substring(0, 10) : '',
            );
            setDiscountAmount(String(quotation.discount_amount ?? 0));
            setTaxRate(String(quotation.tax_rate ?? 0));

            const rawItems = quotation.line_items || quotation.lineItems || [];
            if (rawItems.length > 0) {
                setLineItems(
                    rawItems.map((item) => ({
                        description: item.description || '',
                        quantity: item.quantity ?? 1,
                        unit_amount: item.unit_amount ?? 0,
                    })),
                );
            } else {
                setLineItems([
                    {
                        description: quotation.title || 'Proposal Jasa Hukum',
                        quantity: 1,
                        unit_amount: quotation.total_amount || 0,
                    },
                ]);
            }
            setErrors({});
        }
    }, [quotation, open]);

    if (!quotation) return null;

    // Filter matters by client if client is selected
    const availableMatters = clientId
        ? matters.filter((m) => !m.client_id || m.client_id === clientId)
        : matters;

    // Financial calculations
    const subtotal = lineItems.reduce((sum, item) => {
        const qty = Number(item.quantity) || 0;
        const rate = Number(item.unit_amount) || 0;
        return sum + qty * rate;
    }, 0);

    const discount = Math.max(0, Number(discountAmount) || 0);
    const taxableAmount = Math.max(0, subtotal - discount);
    const parsedTaxRate = Number(taxRate) || 0;
    const taxAmount = Math.round((taxableAmount * parsedTaxRate) / 100);
    const grandTotal = taxableAmount + taxAmount;

    const handleAddRow = () => {
        setLineItems((prev) => [
            ...prev,
            { description: '', quantity: 1, unit_amount: 0 },
        ]);
    };

    const handleRemoveRow = (index: number) => {
        if (lineItems.length <= 1) return;
        setLineItems((prev) => prev.filter((_, i) => i !== index));
    };

    const handleUpdateRow = (
        index: number,
        field: keyof LineItemRow,
        value: string | number,
    ) => {
        setLineItems((prev) =>
            prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        const payload = {
            client_id: clientId,
            matter_id: matterId || null,
            title,
            scope: scope || null,
            status,
            currency,
            issued_at: issuedAt || null,
            valid_until: validUntil || null,
            discount_amount: Math.round(discount),
            tax_rate: parsedTaxRate,
            items: lineItems.map((item) => ({
                description: item.description.trim(),
                quantity: Math.max(1, Number(item.quantity) || 1),
                unit_amount: Math.max(0, Math.round(Number(item.unit_amount) || 0)),
            })),
        };

        router.put(`/finance/quotations/${quotation.id}`, payload, {
            preserveScroll: true,
            onSuccess: () => {
                setProcessing(false);
                onOpenChange(false);
            },
            onError: (errs) => {
                setProcessing(false);
                setErrors(errs);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xl sm:max-w-3xl dark:border-white/10 dark:bg-[#121418]">
                {/* Header with Title & Badge */}
                <DialogHeader className="border-b border-slate-100 pb-4 dark:border-white/[0.06]">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 ring-1 ring-amber-500/20 dark:bg-amber-950/50 dark:text-amber-400">
                                <FilePlus2 className="size-5" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2.5">
                                    <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
                                        Edit Penawaran Biaya (Quotation)
                                    </DialogTitle>
                                    <span className="rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 font-mono text-xs font-semibold text-slate-700 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-300">
                                        {quotation.quotation_number}
                                    </span>
                                </div>
                                <DialogDescription className="mt-0.5 text-xs text-slate-500 dark:text-zinc-400">
                                    Perbarui proposal honorarium advokat, ruang lingkup penanganan, dan estimasi biaya jasa hukum.
                                </DialogDescription>
                            </div>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    {/* Error Banner */}
                    {Object.keys(errors).length > 0 && (
                        <div className="rounded-xl border border-red-200 bg-red-50/90 p-3.5 text-xs text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
                            <div className="flex items-center gap-2 font-semibold">
                                <AlertCircle className="size-4 shrink-0" />
                                Terdapat kesalahan pada formulir:
                            </div>
                            <ul className="mt-1.5 list-inside list-disc space-y-0.5 pl-1 text-[11.5px]">
                                {Object.entries(errors).map(([key, msg]) => (
                                    <li key={key}>{msg}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Section: Client & Matter (Symmetrical 2-column) */}
                    <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-4 dark:border-white/[0.06] dark:bg-[#16181f]">
                        <div className="mb-2.5 text-[11px] font-bold tracking-wider text-slate-400 uppercase dark:text-zinc-500">
                            Informasi Calon / Klien &amp; Perkara
                        </div>
                        <div className="grid gap-3.5 sm:grid-cols-2">
                            <div>
                                <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                                    Calon / Klien Terkait <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative mt-1">
                                    <select
                                        value={clientId}
                                        onChange={(e) => {
                                            setClientId(e.target.value);
                                            setMatterId('');
                                        }}
                                        required
                                        className="h-9 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white pr-9 pl-3 text-xs font-medium text-slate-800 shadow-2xs outline-hidden transition-all hover:border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200"
                                    >
                                        <option value="" disabled>
                                            -- Pilih Klien --
                                        </option>
                                        {clients.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.display_name} {c.legal_name && c.legal_name !== c.display_name ? `(${c.legal_name})` : ''}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-slate-400 dark:text-zinc-400" />
                                </div>
                            </div>

                            <div>
                                <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                                    Terkait Perkara (Matter)
                                </Label>
                                <div className="relative mt-1">
                                    <select
                                        value={matterId}
                                        onChange={(e) => setMatterId(e.target.value)}
                                        className="h-9 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white pr-9 pl-3 text-xs font-medium text-slate-800 shadow-2xs outline-hidden transition-all hover:border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200"
                                    >
                                        <option value="">-- Tanpa Perkara (Proposal Pra-Perkara / Standalone) --</option>
                                        {availableMatters.map((m) => (
                                            <option key={m.id} value={m.id}>
                                                {m.matter_number} — {m.title}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-slate-400 dark:text-zinc-400" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section: Title & Meta Grid */}
                    <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-4 dark:border-white/[0.06] dark:bg-[#16181f]">
                        <div className="mb-2.5 text-[11px] font-bold tracking-wider text-slate-400 uppercase dark:text-zinc-500">
                            Perihal &amp; Ruang Lingkup Penawaran
                        </div>
                        <div className="space-y-3">
                            <div>
                                <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                                    Perihal / Judul Proposal Penawaran <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="cth: Proposal Pendampingan Hukum Restrukturisasi Hutang PT Sentosa"
                                    required
                                    className="mt-1 h-9 rounded-lg border-slate-200 bg-white text-xs font-medium dark:border-white/10 dark:bg-zinc-800"
                                />
                            </div>

                            <div>
                                <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                                    Ruang Lingkup &amp; Ketentuan Jasa Hukum (Scope of Work)
                                </Label>
                                <textarea
                                    value={scope}
                                    onChange={(e) => setScope(e.target.value)}
                                    rows={2}
                                    placeholder="Rincian lingkup kerja, batasan bantuan hukum, termin persetujuan..."
                                    className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 shadow-2xs focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200"
                                />
                            </div>

                            <div className="grid gap-3 sm:grid-cols-4">
                                <div>
                                    <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                                        Status Penawaran <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="relative mt-1">
                                        <select
                                            value={status}
                                            onChange={(e) => setStatus(e.target.value)}
                                            required
                                            className="h-9 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white pr-9 pl-3 text-xs font-medium text-slate-800 shadow-2xs outline-hidden transition-all hover:border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200"
                                        >
                                            <option value="draft">Draft (Konsep)</option>
                                            <option value="pending_approval">Menunggu Persetujuan</option>
                                            <option value="approved">Disetujui (Approved)</option>
                                            <option value="sent">Terkirim ke Klien</option>
                                            <option value="converted">Dikonversi ke Invoice</option>
                                            <option value="rejected">Ditolak (Rejected)</option>
                                            <option value="cancelled">Dibatalkan (Cancelled)</option>
                                        </select>
                                        <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-slate-400 dark:text-zinc-400" />
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                                        Mata Uang
                                    </Label>
                                    <Input
                                        type="text"
                                        value={currency}
                                        onChange={(e) => setCurrency(e.target.value.toUpperCase())}
                                        maxLength={3}
                                        required
                                        className="mt-1 h-9 rounded-lg border-slate-200 bg-white font-mono text-xs uppercase dark:border-white/10 dark:bg-zinc-800"
                                    />
                                </div>

                                <div>
                                    <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                                        Tanggal Penawaran
                                    </Label>
                                    <Input
                                        type="date"
                                        value={issuedAt}
                                        onChange={(e) => setIssuedAt(e.target.value)}
                                        className="mt-1 h-9 rounded-lg border-slate-200 bg-white text-xs dark:border-white/10 dark:bg-zinc-800"
                                    />
                                </div>

                                <div>
                                    <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                                        Berlaku Hingga
                                    </Label>
                                    <Input
                                        type="date"
                                        value={validUntil}
                                        onChange={(e) => setValidUntil(e.target.value)}
                                        className="mt-1 h-9 rounded-lg border-slate-200 bg-white text-xs dark:border-white/10 dark:bg-zinc-800"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section: Line Items Dynamic Builder */}
                    <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-4 dark:border-white/[0.06] dark:bg-[#16181f]">
                        <div className="flex items-center justify-between pb-2.5">
                            <div>
                                <div className="text-[11px] font-bold tracking-wider text-slate-400 uppercase dark:text-zinc-500">
                                    Rincian Komponen Honorarium &amp; Biaya (Line Items)
                                </div>
                                <p className="text-xs text-slate-500 dark:text-zinc-400">
                                    Daftar estimasi tarif jasa advokasi, retainer, dan operasional perkara.
                                </p>
                            </div>
                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={handleAddRow}
                                className="h-8 rounded-lg border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200"
                            >
                                <Plus className="mr-1.5 size-3.5 text-amber-600 dark:text-amber-400" />
                                Tambah Baris
                            </Button>
                        </div>

                        {/* Table Header */}
                        <div className="hidden grid-cols-[1fr_5rem_8.5rem_7.5rem_2.5rem] gap-2 px-3 py-1.5 text-[11px] font-bold text-slate-500 uppercase dark:text-zinc-400 sm:grid">
                            <span>Deskripsi Jasa / Biaya</span>
                            <span className="text-center">Kuantitas</span>
                            <span className="text-right">Tarif Satuan</span>
                            <span className="text-right">Subtotal</span>
                            <span className="text-center">Aksi</span>
                        </div>

                        <div className="space-y-2">
                            {lineItems.map((item, index) => {
                                const rowTotal =
                                    (Number(item.quantity) || 0) *
                                    (Number(item.unit_amount) || 0);

                                return (
                                    <div
                                        key={index}
                                        className="flex flex-col gap-2 rounded-xl border border-slate-200/80 bg-white p-2.5 shadow-2xs dark:border-white/[0.04] dark:bg-[#121418] sm:grid sm:grid-cols-[1fr_5rem_8.5rem_7.5rem_2.5rem] sm:items-center sm:gap-2"
                                    >
                                        <div>
                                            <Input
                                                value={item.description}
                                                onChange={(e) =>
                                                    handleUpdateRow(index, 'description', e.target.value)
                                                }
                                                placeholder="Deskripsi layanan / jasa hukum..."
                                                required
                                                className="h-8 rounded-lg border-slate-200 bg-slate-50/50 text-xs dark:border-white/10 dark:bg-zinc-800"
                                            />
                                        </div>

                                        <div>
                                            <Input
                                                type="number"
                                                min="1"
                                                value={item.quantity}
                                                onChange={(e) =>
                                                    handleUpdateRow(index, 'quantity', e.target.value)
                                                }
                                                placeholder="Qty"
                                                required
                                                className="h-8 rounded-lg border-slate-200 bg-slate-50/50 text-center text-xs dark:border-white/10 dark:bg-zinc-800"
                                            />
                                        </div>

                                        <div>
                                            <MoneyInput
                                                value={item.unit_amount}
                                                onValueChange={(val) =>
                                                    handleUpdateRow(index, 'unit_amount', String(val))
                                                }
                                                placeholder="Tarif (IDR)"
                                                required
                                                className="h-8 rounded-lg border-slate-200 bg-slate-50/50 text-right font-mono text-xs dark:border-white/10 dark:bg-zinc-800"
                                            />
                                        </div>

                                        <div className="text-right font-mono text-xs font-bold text-slate-800 dark:text-zinc-200">
                                            {currency} {formatMoney(rowTotal)}
                                        </div>

                                        <div className="flex justify-center">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleRemoveRow(index)}
                                                disabled={lineItems.length <= 1}
                                                className="size-8 rounded-lg p-0 text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-20 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                                            >
                                                <Trash2 className="size-3.5" />
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Section: Discount, Tax & Financial Live Breakdown */}
                    <div className="grid gap-3.5 sm:grid-cols-2">
                        <div className="space-y-3 rounded-xl border border-slate-200/80 bg-slate-50/60 p-4 dark:border-white/[0.06] dark:bg-[#16181f]">
                            <div className="text-[11px] font-bold tracking-wider text-slate-400 uppercase dark:text-zinc-500">
                                Penyesuaian Diskon &amp; Pajak
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div>
                                    <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                                        Potongan Diskon ({currency})
                                    </Label>
                                    <MoneyInput
                                        value={discountAmount}
                                        onValueChange={(val) => setDiscountAmount(String(val))}
                                        placeholder="0"
                                        className="mt-1 h-9 rounded-lg border-slate-200 bg-white font-mono text-xs dark:border-white/10 dark:bg-zinc-800"
                                    />
                                </div>

                                <div>
                                    <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                                        Tarif PPN (%)
                                    </Label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max="100"
                                        value={taxRate}
                                        onChange={(e) => setTaxRate(e.target.value)}
                                        placeholder="0"
                                        className="mt-1 h-9 rounded-lg border-slate-200 bg-white font-mono text-xs dark:border-white/10 dark:bg-zinc-800"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Realtime Live Breakdown Card */}
                        <div className="flex flex-col justify-between rounded-xl border border-amber-200/80 bg-amber-50/40 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
                            <div className="space-y-2 text-xs">
                                <div className="flex justify-between text-slate-600 dark:text-zinc-300">
                                    <span>Subtotal Penawaran:</span>
                                    <span className="font-mono font-semibold text-slate-900 dark:text-white">
                                        {currency} {formatMoney(subtotal)}
                                    </span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                                        <span>Potongan Diskon:</span>
                                        <span className="font-mono font-semibold">
                                            - {currency} {formatMoney(discount)}
                                        </span>
                                    </div>
                                )}
                                {taxAmount > 0 && (
                                    <div className="flex justify-between text-slate-600 dark:text-zinc-300">
                                        <span>PPN ({parsedTaxRate}%):</span>
                                        <span className="font-mono font-semibold text-slate-900 dark:text-white">
                                            + {currency} {formatMoney(taxAmount)}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="mt-3 border-t border-amber-200/80 pt-2.5 dark:border-amber-900/60">
                                <div className="flex items-baseline justify-between">
                                    <span className="text-xs font-bold tracking-tight text-slate-900 uppercase dark:text-white">
                                        TOTAL PENAWARAN:
                                    </span>
                                    <span className="font-mono text-base font-extrabold text-amber-600 dark:text-amber-400">
                                        {currency} {formatMoney(grandTotal)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="border-t border-slate-100 pt-4 dark:border-white/[0.06]">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={processing}
                            className="h-9 rounded-xl border-slate-200 px-4 text-xs font-medium hover:bg-slate-50 dark:border-white/10 dark:text-zinc-300"
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="h-9 rounded-xl bg-amber-600 px-5 text-xs font-semibold text-white shadow-2xs hover:bg-amber-700 active:scale-95 dark:bg-amber-600 dark:hover:bg-amber-500"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan Quotation'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
