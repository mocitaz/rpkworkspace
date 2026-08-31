import { Download, FileSpreadsheet } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
    financeDialogPanelClass,
    financeExcelExportUrl,
} from './finance-dialog-design';
import { FinanceDialogBody, FinanceDialogHeader } from './finance-dialog-ui';

export function ExportExcelConfirmButton({
    label = 'Export Excel',
    className,
}: {
    label?: string;
    className?: string;
}) {
    const [open, setOpen] = useState(false);

    const download = () => {
        setOpen(false);
        window.location.assign(financeExcelExportUrl());
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className={className}
                title="Download laporan keuangan lengkap dalam format Excel"
            >
                <FileSpreadsheet className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                {label}
            </button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className={financeDialogPanelClass('compact')}>
                    <FinanceDialogHeader
                        icon={FileSpreadsheet}
                        eyebrow="Export Laporan"
                        title="Download Laporan Keuangan?"
                        description="File Excel berisi laporan dan transaksi keuangan lengkap untuk kebutuhan rekonsiliasi serta audit."
                        tone="success"
                    />
                    <FinanceDialogBody className="space-y-4">
                        <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-4 dark:border-white/[0.07] dark:bg-white/[0.025]">
                            <p className="text-xs font-semibold text-slate-800 dark:text-zinc-100">
                                Laporan Keuangan Lengkap (.xlsx)
                            </p>
                            <p className="mt-1 text-[11px] leading-5 text-slate-500 dark:text-zinc-400">
                                Pastikan data transaksi terbaru sudah tersimpan
                                sebelum membuat berkas export.
                            </p>
                        </div>
                        <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 pt-4 dark:border-white/[0.06]">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                                className="h-9 rounded-lg px-4 text-xs font-semibold"
                            >
                                Batal
                            </Button>
                            <Button
                                type="button"
                                onClick={download}
                                className="h-9 rounded-lg bg-blue-600 px-4 text-xs font-semibold text-white hover:bg-blue-700"
                            >
                                <Download className="mr-1.5 size-3.5" />
                                Download Excel
                            </Button>
                        </div>
                    </FinanceDialogBody>
                </DialogContent>
            </Dialog>
        </>
    );
}
