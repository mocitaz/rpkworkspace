export type StatusTextItem = {
    value: string;
    label: string;
    colorClass: string;
    hasLeadingSeparator: boolean;
};

const labels: Record<string, string> = {
    active: 'Aktif',
    prospective: 'Prospektif',
    on_hold: 'Ditunda',
    closed: 'Ditutup',
    archived: 'Diarsipkan',
    todo: 'Belum Dimulai',
    in_progress: 'Dikerjakan',
    waiting: 'Menunggu',
    review: 'Menunggu Review',
    completed: 'Selesai',
    cancelled: 'Dibatalkan',
    draft: 'Draf',
    under_review: 'Dalam Review',
    revision_requested: 'Perlu Revisi',
    approved: 'Disetujui',
    final: 'Final',
    signed: 'Ditandatangani',
    low: 'Rendah',
    normal: 'Normal',
    high: 'Tinggi',
    critical: 'Kritis',
    open: 'Terbuka',
    standard: 'Standar',
    confidential: 'Rahasia',
    restricted: 'Terbatas',
    internal: 'Internal',
    private: 'Privat',
    scheduled: 'Terjadwal',
    postponed: 'Ditunda / Lanjutan',
    in_vault: 'Di Brankas Firma',
    borrowed_for_hearing: 'Dipinjam Advokat Sidang',
    submitted_to_court: 'Diserahkan ke Majelis Hakim',
    returned_to_client: 'Dikembalikan ke Klien',
    rejected: 'Ditolak / Risiko Tinggi',
    pending_documents: 'Menunggu Berkas',
    in_review: 'Dalam Penelaahan',
    verified: 'Terverifikasi',
    expired: 'Kedaluwarsa',
    expiring_soon: 'Segera Berakhir',
    no_expiry: 'Tetap / Tidak Berakhir',
    complete: 'Lengkap',
    incomplete: 'Belum Terlampir',
};

const criticalStatuses = new Set([
    'critical',
    'restricted',
    'cancelled',
    'private',
    'rejected',
    'expired',
]);
const warningStatuses = new Set([
    'high',
    'confidential',
    'revision_requested',
    'under_review',
    'waiting',
    'review',
    'todo',
    'postponed',
    'borrowed_for_hearing',
    'submitted_to_court',
    'pending_documents',
    'expiring_soon',
    'incomplete',
]);
const successStatuses = new Set([
    'active',
    'completed',
    'approved',
    'signed',
    'in_vault',
    'verified',
    'complete',
]);
const infoStatuses = new Set([
    'in_progress',
    'draft',
    'open',
    'scheduled',
    'in_review',
]);

function getColorClass(value: string): string {
    if (criticalStatuses.has(value)) {
        return 'text-rose-600 dark:text-rose-400';
    }

    if (warningStatuses.has(value)) {
        return 'text-amber-600 dark:text-amber-400';
    }

    if (successStatuses.has(value)) {
        return 'text-emerald-600 dark:text-emerald-400';
    }

    if (infoStatuses.has(value)) {
        return 'text-blue-600 dark:text-blue-400';
    }

    return 'text-slate-600 dark:text-zinc-400';
}

export function getStatusTextItems(values: string[]): StatusTextItem[] {
    return values.map((value, index) => ({
        value,
        label: labels[value] ?? value,
        colorClass: getColorClass(value),
        hasLeadingSeparator: index > 0,
    }));
}
