import assert from 'node:assert/strict';
import test from 'node:test';

import {
    financeExcelExportUrl,
    financeDialogPanelClass,
    financeDialogTone,
} from '../../resources/js/pages/finance/components/finance-dialog-design.ts';

test('finance dialog panels keep a stable scrollable shell for every supported width', () => {
    for (const width of ['compact', 'default', 'wide', 'preview']) {
        const className = financeDialogPanelClass(width);

        assert.match(className, /flex max-h-\[92dvh\] flex-col/);
        assert.match(className, /overflow-hidden/);
        assert.match(className, /rounded-2xl/);
        assert.match(className, /p-0/);
        assert.doesNotMatch(className, /first-child[^ ]*\]:hidden/);
        assert.match(
            className,
            /first-child:not\(\[data-finance-dialog-copy\]\)\]:bg-slate-100/,
        );
        assert.match(
            className,
            /first-child:not\(\[data-finance-dialog-copy\]\)\]:text-slate-500/,
        );
        assert.match(className, /\[&_\[data-slot=dialog-title\]\]:text-sm/);
        assert.match(
            className,
            /\[&_\[data-slot=dialog-description\]\]:text-\[11px\]/,
        );
    }

    assert.match(financeDialogPanelClass('compact'), /sm:max-w-md/);
    assert.match(financeDialogPanelClass('default'), /sm:max-w-xl/);
    assert.match(financeDialogPanelClass('wide'), /sm:max-w-3xl/);
    assert.match(financeDialogPanelClass('preview'), /sm:max-w-5xl/);
});

test('finance Excel confirmation keeps the official export endpoint', () => {
    assert.equal(financeExcelExportUrl(), '/finance/export/excel');
});

test('finance dialog tones reserve semantic colors for transaction meaning', () => {
    assert.equal(
        financeDialogTone('primary').button,
        'bg-blue-600 hover:bg-blue-700',
    );
    assert.match(financeDialogTone('success').icon, /emerald/);
    assert.match(financeDialogTone('warning').icon, /amber/);
    assert.match(financeDialogTone('danger').button, /rose/);
    assert.doesNotMatch(
        financeDialogTone('neutral').button,
        /emerald|amber|rose/,
    );
});
