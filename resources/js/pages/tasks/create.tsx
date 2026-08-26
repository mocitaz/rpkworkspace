import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Briefcase,
    Calendar,
    CalendarClock,
    CheckCircle2,
    ChevronDown,
    Clock,
    DollarSign,
    FileText,
    Gavel,
    Layers,
    ListChecks,
    Plus,
    Scale,
    Trash2,
    UserCheck,
    Users,
} from 'lucide-react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useInitials } from '@/hooks/use-initials';
import * as matterRoutes from '@/routes/matters';
import * as taskRoutes from '@/routes/tasks';

type Choice = {
    id: number | string;
    name?: string;
    matter_number?: string;
    title?: string;
    client_id?: string;
    client?: {
        id: string;
        client_number: string;
        name: string;
        type: string;
    };
    position_title?: string;
    department?: string;
    avatar_path?: string | null;
};

type CategoryChoice = {
    id: string;
    name: string;
};

type ChecklistItem = {
    id: string;
    title: string;
    is_completed: boolean;
};

export default function TaskCreate({
    defaultTaskNumber,
    matters,
    users,
    categories,
    stages,
    preselectedMatterId,
}: {
    defaultTaskNumber: string;
    matters: Choice[];
    users: Choice[];
    categories: CategoryChoice[];
    stages: CategoryChoice[];
    preselectedMatterId?: string | null;
}) {
    const initials = useInitials();

    const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([
        { id: 'chk-1', title: '', is_completed: false },
    ]);

    const { data, setData, post, processing, errors } = useForm({
        task_number: defaultTaskNumber,
        matter_id: preselectedMatterId || '',
        title: '',
        category: 'drafting',
        stage: 'district_court',
        description: '',
        assignee_id: '',
        reviewer_id: '',
        status: 'todo',
        priority: 'normal',
        start_date: new Date().toISOString().split('T')[0],
        due_at: '',
        is_billable: false,
        estimated_hours: '',
        actual_hours: '',
        checklists: [] as ChecklistItem[],
        completion_notes: '',
    });

    const addChecklistRow = () => {
        setChecklistItems((prev) => [
            ...prev,
            { id: `chk-${Date.now()}`, title: '', is_completed: false },
        ]);
    };

    const updateChecklistTitle = (index: number, title: string) => {
        setChecklistItems((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], title };
            return updated;
        });
    };

    const removeChecklistRow = (index: number) => {
        setChecklistItems((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const validChecklists = checklistItems.filter((c) => c.title.trim().length > 0);
        data.checklists = validChecklists;
        post(taskRoutes.store.url());
    };

    return (
        <>
            <Head title="Buat Tugas Baru" />

            <div className="min-h-screen bg-[#fafafc] pb-24 dark:bg-[#0c0d10]">
                <main className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
                    {/* Header Navigation */}
                    <div className="flex flex-col justify-between gap-4 border-b border-slate-200/70 pb-5 sm:flex-row sm:items-center dark:border-white/[0.06]">
                        <div className="space-y-1">
                            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                                Delegasi &amp; Penugasan Baru
                            </h1>
                            <p className="text-xs text-slate-500 dark:text-zinc-400">
                                Delegasikan instruksi pekerjaan hukum, riset, sidang, atau administrasi kantor kepada tim.
                            </p>
                        </div>

                        <div className="flex shrink-0 items-center">
                            <Button
                                variant="outline"
                                className="h-8 rounded-lg border-slate-200/80 bg-white px-3 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-white/10 dark:bg-[#16181d] dark:text-zinc-300"
                                asChild
                            >
                                <Link href={taskRoutes.index.url()}>
                                    <ArrowLeft className="mr-1.5 size-3.5 text-slate-400" />
                                    Kembali ke Daftar Tugas
                                </Link>
                            </Button>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* 1. Informasi Utama Tugas */}
                        <section className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-white/[0.07] dark:bg-[#13151a]">
                            <div className="flex items-center gap-2 border-b border-slate-100 pb-3.5 dark:border-white/[0.06]">
                                <FileText className="size-4 text-blue-600 dark:text-blue-400" />
                                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                                    1. Informasi Utama & Klasifikasi Hukum
                                </h2>
                            </div>

                            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="sm:col-span-2 space-y-1.5">
                                    <Label htmlFor="title" className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                                        Judul / Instruksi Tugas <span className="text-rose-500">*</span>
                                    </Label>
                                    <Input
                                        id="title"
                                        type="text"
                                        placeholder="Contoh: Susun Draf Replik Perkara PT KKG vs PT Megah Mandiri"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        className="h-9 text-xs"
                                        required
                                    />
                                    <InputError message={errors.title} />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="category" className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                                        Kategori Tugas Hukum <span className="text-rose-500">*</span>
                                    </Label>
                                    <div className="relative">
                                        <select
                                            id="category"
                                            value={data.category}
                                            onChange={(e) => setData('category', e.target.value)}
                                            className="h-9 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-8 text-xs text-slate-800 shadow-2xs focus:border-blue-500 focus:outline-hidden dark:border-white/10 dark:bg-[#191c22] dark:text-zinc-200"
                                            required
                                        >
                                            {categories.map((c) => (
                                                <option key={c.id} value={c.id}>
                                                    {c.name}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
                                    </div>
                                    <InputError message={errors.category} />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="stage" className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                                        Tahapan Perkara
                                    </Label>
                                    <div className="relative">
                                        <select
                                            id="stage"
                                            value={data.stage}
                                            onChange={(e) => setData('stage', e.target.value)}
                                            className="h-9 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-8 text-xs text-slate-800 shadow-2xs focus:border-blue-500 focus:outline-hidden dark:border-white/10 dark:bg-[#191c22] dark:text-zinc-200"
                                        >
                                            {stages.map((s) => (
                                                <option key={s.id} value={s.id}>
                                                    {s.name}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
                                    </div>
                                    <InputError message={errors.stage} />
                                </div>

                                <div className="sm:col-span-2 space-y-1.5">
                                    <Label htmlFor="matter_id" className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                                        Hubungkan ke Perkara Terkait
                                    </Label>
                                    <div className="relative">
                                        <select
                                            id="matter_id"
                                            value={data.matter_id}
                                            onChange={(e) => setData('matter_id', e.target.value)}
                                            className="h-9 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-8 text-xs text-slate-800 shadow-2xs focus:border-blue-500 focus:outline-hidden dark:border-white/10 dark:bg-[#191c22] dark:text-zinc-200"
                                        >
                                            <option value="">-- Tanpa Perkara (Tugas Operasional Kantor / Non-Perkara) --</option>
                                            {matters.map((m) => (
                                                <option key={m.id} value={m.id}>
                                                    {m.matter_number} - {m.title} {m.client ? `(${m.client.name})` : ''}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
                                    </div>
                                    <p className="text-[11px] text-slate-500 dark:text-zinc-500">
                                        Jika dihubungkan, tugas akan otomatis tampil pada tab Berkas Kerja Perkara terkait.
                                    </p>
                                    <InputError message={errors.matter_id} />
                                </div>

                                <div className="sm:col-span-2 space-y-2">
                                    <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                                        Tingkat Prioritas Tugas
                                    </Label>
                                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                                        {[
                                            { id: 'low', label: 'Rendah (Low)', desc: 'Fleksibel', color: 'border-slate-200 dark:border-white/10 hover:border-slate-300' },
                                            { id: 'normal', label: 'Normal', desc: 'Standar Pengerjaan', color: 'border-blue-200 dark:border-blue-900/40 hover:border-blue-300' },
                                            { id: 'high', label: 'Tinggi (High)', desc: 'Prioritas Tim', color: 'border-amber-200 dark:border-amber-900/40 hover:border-amber-300' },
                                            { id: 'critical', label: 'Mendesak (Critical)', desc: 'Batas Sidang / Segera', color: 'border-rose-200 dark:border-rose-900/40 hover:border-rose-300' },
                                        ].map((p) => (
                                            <button
                                                key={p.id}
                                                type="button"
                                                onClick={() => setData('priority', p.id)}
                                                className={`flex flex-col items-start rounded-lg border p-2.5 text-left transition-all ${
                                                    data.priority === p.id
                                                        ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-600/20 dark:border-blue-500 dark:bg-blue-950/40 dark:ring-blue-500/30'
                                                        : `bg-slate-50/50 dark:bg-[#181a20] ${p.color}`
                                                }`}
                                            >
                                                <span className="text-xs font-bold text-slate-900 dark:text-white">
                                                    {p.label}
                                                </span>
                                                <span className="text-[10px] text-slate-500 dark:text-zinc-400">
                                                    {p.desc}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                    <InputError message={errors.priority} />
                                </div>
                            </div>
                        </section>

                        {/* 2. Penugasan & Tim */}
                        <section className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-white/[0.07] dark:bg-[#13151a]">
                            <div className="flex items-center gap-2 border-b border-slate-100 pb-3.5 dark:border-white/[0.06]">
                                <Users className="size-4 text-indigo-600 dark:text-indigo-400" />
                                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                                    2. Delegasi Staf &amp; Pemeriksa Hasil
                                </h2>
                            </div>

                            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <Label htmlFor="assignee_id" className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                                        Pelaksana Utama (Assignee) <span className="text-rose-500">*</span>
                                    </Label>
                                    <div className="relative">
                                        <select
                                            id="assignee_id"
                                            value={data.assignee_id}
                                            onChange={(e) => setData('assignee_id', e.target.value)}
                                            className="h-9 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-8 text-xs text-slate-800 shadow-2xs focus:border-indigo-500 focus:outline-hidden dark:border-white/10 dark:bg-[#191c22] dark:text-zinc-200"
                                            required
                                        >
                                            <option value="">-- Pilih Staf / Advokat Pelaksana --</option>
                                            {users.map((u) => (
                                                <option key={u.id} value={u.id}>
                                                    {u.name} ({u.position_title || 'Staf'})
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
                                    </div>
                                    <p className="text-[11px] text-slate-500 dark:text-zinc-500">
                                        Staf akan menerima notifikasi penugasan otomatis.
                                    </p>
                                    <InputError message={errors.assignee_id} />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="reviewer_id" className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                                        Pemeriksa Hasil (Reviewer / Partner In Charge)
                                    </Label>
                                    <div className="relative">
                                        <select
                                            id="reviewer_id"
                                            value={data.reviewer_id}
                                            onChange={(e) => setData('reviewer_id', e.target.value)}
                                            className="h-9 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-8 text-xs text-slate-800 shadow-2xs focus:border-indigo-500 focus:outline-hidden dark:border-white/10 dark:bg-[#191c22] dark:text-zinc-200"
                                        >
                                            <option value="">-- Tanpa Reviewer Khusus (Opsional) --</option>
                                            {users.map((u) => (
                                                <option key={u.id} value={u.id}>
                                                    {u.name} ({u.position_title || 'Advokat'})
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
                                    </div>
                                    <p className="text-[11px] text-slate-500 dark:text-zinc-500">
                                        Partner/Senior yang akan memvalidasi draf sebelum difinalisasi.
                                    </p>
                                    <InputError message={errors.reviewer_id} />
                                </div>
                            </div>
                        </section>

                        {/* 3. Jadwal & Finansial */}
                        <section className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-white/[0.07] dark:bg-[#13151a]">
                            <div className="flex items-center gap-2 border-b border-slate-100 pb-3.5 dark:border-white/[0.06]">
                                <Clock className="size-4 text-emerald-600 dark:text-emerald-400" />
                                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                                    3. Jadwal Tenggat & Finansial Billable
                                </h2>
                            </div>

                            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <Label htmlFor="start_date" className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                                        Tanggal Mulai
                                    </Label>
                                    <Input
                                        id="start_date"
                                        type="date"
                                        value={data.start_date}
                                        onChange={(e) => setData('start_date', e.target.value)}
                                        className="h-9 text-xs"
                                    />
                                    <InputError message={errors.start_date} />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="due_at" className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                                        Tenggat Waktu (Due Date)
                                    </Label>
                                    <Input
                                        id="due_at"
                                        type="datetime-local"
                                        value={data.due_at}
                                        onChange={(e) => setData('due_at', e.target.value)}
                                        className="h-9 text-xs"
                                    />
                                    <InputError message={errors.due_at} />
                                </div>

                                <div className="sm:col-span-2 rounded-lg border border-slate-200/80 bg-slate-50/70 p-3 dark:border-white/[0.07] dark:bg-[#181a20]">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={data.is_billable}
                                            onChange={(e) => setData('is_billable', e.target.checked)}
                                            className="size-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-white/20 dark:bg-zinc-800"
                                        />
                                        <div>
                                            <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                                <DollarSign className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                                                Dapat Ditagihkan ke Klien (Billable Task)
                                            </span>
                                            <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                                                Centang jika tugas ini akan dicatat ke tagihan/invoice klien.
                                            </p>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </section>

                        {/* 4. Deskripsi & Panduan Detail */}
                        <section className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-white/[0.07] dark:bg-[#13151a]">
                            <div className="flex items-center gap-2 border-b border-slate-100 pb-3.5 dark:border-white/[0.06]">
                                <FileText className="size-4 text-purple-600 dark:text-purple-400" />
                                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                                    4. Deskripsi & Petunjuk Teknis Pekerjaan
                                </h2>
                            </div>

                            <div className="mt-4 space-y-1.5">
                                <Label htmlFor="description" className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                                    Detail Instruksi & Catatan Khusus
                                </Label>
                                <textarea
                                    id="description"
                                    rows={5}
                                    placeholder="Tuliskan petunjuk teknis, pasal acuan, kronologis singkat, format dokumen yang diharapkan, atau kontak pihak yang perlu dihubungi..."
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className="w-full rounded-lg border border-slate-200 bg-white p-3 text-xs text-slate-800 shadow-2xs focus:border-purple-500 focus:outline-hidden dark:border-white/10 dark:bg-[#191c22] dark:text-zinc-200 leading-relaxed"
                                />
                                <InputError message={errors.description} />
                            </div>
                        </section>

                        {/* 5. Sub-Tugas Checklist */}
                        <section className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-white/[0.07] dark:bg-[#13151a]">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 dark:border-white/[0.06]">
                                <div className="flex items-center gap-2">
                                    <ListChecks className="size-4 text-amber-600 dark:text-amber-400" />
                                    <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                                        5. Checklist Butir Pekerjaan (Sub-Tasks)
                                    </h2>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={addChecklistRow}
                                    className="h-7 text-xs gap-1 border-dashed text-slate-700 dark:text-zinc-300"
                                >
                                    <Plus className="size-3" />
                                    Tambah Butir
                                </Button>
                            </div>

                            <div className="mt-4 space-y-2.5">
                                {checklistItems.map((item, index) => (
                                    <div key={item.id} className="flex items-center gap-2">
                                        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-600 dark:bg-white/10 dark:text-zinc-300">
                                            {index + 1}
                                        </span>
                                        <Input
                                            type="text"
                                            placeholder={`Contoh butir ${index + 1}: Kumpulkan bukti surat P-1 s/d P-5`}
                                            value={item.title}
                                            onChange={(e) => updateChecklistTitle(index, e.target.value)}
                                            className="h-8.5 text-xs flex-1"
                                        />
                                        {checklistItems.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeChecklistRow(index)}
                                                className="size-8 p-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                                            >
                                                <Trash2 className="size-3.5" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                                <p className="text-[11px] text-slate-500 dark:text-zinc-500 pt-1">
                                    Checklist ini dapat langsung dicentang satu per satu oleh staf pelaksana saat mengerjakan tugas.
                                </p>
                            </div>
                        </section>

                        {/* Submit Action Bar */}
                        <div className="flex items-center justify-end gap-3 border-t border-slate-200/70 pt-5 dark:border-white/[0.06]">
                            <Button
                                type="button"
                                variant="outline"
                                className="h-9 px-4 text-xs font-semibold"
                                asChild
                            >
                                <Link href={taskRoutes.index.url()}>Batal</Link>
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="h-9 bg-blue-600 px-5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500"
                            >
                                {processing ? (
                                    <>
                                        <Spinner className="mr-1.5 size-3.5" />
                                        Menyimpan...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="mr-1.5 size-3.5" />
                                        Delegasikan & Simpan Tugas
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </main>
            </div>
        </>
    );
}
