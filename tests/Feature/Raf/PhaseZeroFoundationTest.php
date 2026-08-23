<?php

use App\Actions\GenerateDocumentNumber;
use App\DocumentNumberType;
use App\Jobs\ProcessDocumentVersion;
use App\Models\AuditLog;
use App\Models\DocumentNumberSequence;
use App\Models\Matter;
use App\Models\Permission;
use App\Services\AuditService;
use App\WorkflowStatus;
use Database\Seeders\RafPermissionSeeder;
use Illuminate\Support\Facades\Artisan;

it('generates independent, sequential numbers for finance and legal artifacts', function () {
    $generator = app(GenerateDocumentNumber::class);

    $firstInvoice = $generator->handle(DocumentNumberType::Invoice, 2026);
    $secondInvoice = $generator->handle(DocumentNumberType::Invoice, 2026);
    $quotation = $generator->handle(DocumentNumberType::Quotation, 2026);

    expect($firstInvoice)->toBe('INV-2026-0001')
        ->and($secondInvoice)->toBe('INV-2026-0002')
        ->and($quotation)->toBe('QT-2026-0001')
        ->and(DocumentNumberSequence::query()
            ->where('type', DocumentNumberType::Invoice->value)
            ->where('year', 2026)
            ->value('next_value'))->toBe(3);
});

it('enforces workflow transitions and records structured finance audit metadata', function () {
    $actor = rafUser();
    $matter = Matter::factory()->recycle($actor)->create();
    $audit = app(AuditService::class);

    $workflowLog = $audit->recordWorkflowTransition(
        $matter,
        'invoice.sent',
        WorkflowStatus::PendingApproval,
        WorkflowStatus::Sent,
        $actor,
    );
    $moneyLog = $audit->recordMonetaryChange(
        $matter,
        'invoice.amount_updated',
        1_500_000,
        2_000_000,
        $actor,
    );

    expect($workflowLog->category)->toBe('invoice')
        ->and($workflowLog->metadata['workflow'])->toBe([
            'from' => 'pending_approval',
            'to' => 'sent',
        ])
        ->and($moneyLog->category)->toBe('billing')
        ->and($moneyLog->metadata['amount'])->toBe([
            'before' => 1_500_000,
            'after' => 2_000_000,
            'currency' => 'IDR',
        ])
        ->and(AuditLog::query()->count())->toBe(2);

    expect(fn () => WorkflowStatus::Paid->ensureCanTransitionTo(WorkflowStatus::Sent))
        ->toThrow(LogicException::class);
});

it('seeds the complete phase zero permission catalogue idempotently', function () {
    Artisan::call('db:seed', ['--class' => RafPermissionSeeder::class]);
    Artisan::call('db:seed', ['--class' => RafPermissionSeeder::class]);

    expect(Permission::query()
        ->whereIn('name', [
            'billing.manage',
            'expense.manage',
            'payment.manage',
            'quotation.approve',
            'template.manage',
            'signature.manage',
            'correspondence.manage',
            'conflict.manage',
            'archive.legal_hold.manage',
        ])
        ->count())->toBe(9);
});

it('uses private storage and dedicated queues for asynchronous work', function () {
    expect(config('filesystems.disks.local.root'))->toBe(storage_path('app/private'))
        ->and(config('queue.connections.database.retry_after'))->toBeGreaterThan(240)
        ->and(config('raf.queues.documents'))->toBe('documents')
        ->and(config('raf.queues.notifications'))->toBe('notifications')
        ->and((new ProcessDocumentVersion('document-version-id'))->queue)->toBe('documents');
});
