export function getMetricProgress(part: number, total: number): number {
    if (!Number.isFinite(part) || !Number.isFinite(total) || total <= 0) {
        return 0;
    }

    return Math.round(Math.min(Math.max(part / total, 0), 1) * 100);
}
