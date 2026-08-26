<?php

use App\Models\FinancialAccount;
use App\Models\Matter;

test('authorized user can download comprehensive audit excel file', function () {
    $user = rafUser(['matter.view', 'billing.view', 'billing.manage']);

    $account = FinancialAccount::query()->create([
        'name' => 'Bank Mandiri Utama',
        'type' => 'bank',
        'opening_balance' => 10000000,
        'current_balance' => 15000000,
        'created_by' => $user->getKey(),
    ]);

    $matter = Matter::factory()->create([
        'title' => 'Project Titan Auditing',
        'budget_amount' => 50000000,
    ]);

    $response = $this->actingAs($user)->get(route('finance.export.excel', ['year' => 2026]));

    $response->assertOk();
    $response->assertHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    expect($response->headers->get('Content-Disposition'))->toContain('Laporan_Keuangan_Audit_RPK_2026_');

    // Save temporary stream to verify zip/xlsx contents
    $temp = tempnam(sys_get_temp_dir(), 'test_audit_').'.xlsx';
    file_put_contents($temp, $response->streamedContent());

    $zip = new ZipArchive;
    expect($zip->open($temp))->toBeTrue();

    // Verify all 11 worksheets exist in the zip
    expect($zip->locateName('[Content_Types].xml'))->not->toBeFalse()
        ->and($zip->locateName('xl/workbook.xml'))->not->toBeFalse()
        ->and($zip->locateName('xl/styles.xml'))->not->toBeFalse()
        ->and($zip->locateName('xl/worksheets/sheet1.xml'))->not->toBeFalse()
        ->and($zip->locateName('xl/worksheets/sheet2.xml'))->not->toBeFalse()
        ->and($zip->locateName('xl/worksheets/sheet3.xml'))->not->toBeFalse()
        ->and($zip->locateName('xl/worksheets/sheet4.xml'))->not->toBeFalse()
        ->and($zip->locateName('xl/worksheets/sheet5.xml'))->not->toBeFalse()
        ->and($zip->locateName('xl/worksheets/sheet6.xml'))->not->toBeFalse()
        ->and($zip->locateName('xl/worksheets/sheet7.xml'))->not->toBeFalse()
        ->and($zip->locateName('xl/worksheets/sheet8.xml'))->not->toBeFalse()
        ->and($zip->locateName('xl/worksheets/sheet9.xml'))->not->toBeFalse()
        ->and($zip->locateName('xl/worksheets/sheet10.xml'))->not->toBeFalse()
        ->and($zip->locateName('xl/worksheets/sheet11.xml'))->not->toBeFalse();

    // Read workbook xml to verify sheet names
    $wbXml = $zip->getFromName('xl/workbook.xml');
    expect($wbXml)->toContain('00_Ringkasan_Audit')
        ->and($wbXml)->toContain('01_Laba_Rugi')
        ->and($wbXml)->toContain('02_Arus_Kas')
        ->and($wbXml)->toContain('03_Neraca')
        ->and($wbXml)->toContain('04_Profitabilitas_Perkara')
        ->and($wbXml)->toContain('05_Buku_Kas_Bank')
        ->and($wbXml)->toContain('06_Biaya_Operasional')
        ->and($wbXml)->toContain('07_Talangan_Partner')
        ->and($wbXml)->toContain('08_Dana_Titipan_Klien')
        ->and($wbXml)->toContain('09_Payroll_Gaji_Staf')
        ->and($wbXml)->toContain('10_Piutang_Invoices');

    $zip->close();
    @unlink($temp);
});

test('unauthorized user cannot export finance audit excel', function () {
    $user = rafUser([]); // No billing.view permission

    $response = $this->actingAs($user)->get(route('finance.export.excel'));

    $response->assertForbidden();
});
