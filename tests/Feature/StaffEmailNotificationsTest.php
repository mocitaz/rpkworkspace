<?php

namespace Tests\Feature;

use App\Models\Client;
use App\Models\Correspondence;
use App\Models\Document;
use App\Models\DocumentApproval;
use App\Models\DocumentVersion;
use App\Models\Matter;
use App\Models\SignatureRequest;
use App\Models\SignatureSigner;
use App\Models\Task;
use App\Models\User;
use App\Notifications\ClientPartnerAssignedNotification;
use App\Notifications\ComplianceExpiringNotification;
use App\Notifications\CorrespondenceDispatchedNotification;
use App\Notifications\DocumentApprovalRequestedNotification;
use App\Notifications\DocumentCommentAddedNotification;
use App\Notifications\DocumentSignedExecutedNotification;
use App\Notifications\HearingOutcomeNotification;
use App\Notifications\HearingReminderNotification;
use App\Notifications\HearingScheduledNotification;
use App\Notifications\MatterAssignedNotification;
use App\Notifications\MatterStageChangedNotification;
use App\Notifications\NewStaffWelcomeNotification;
use App\Notifications\PaymentVerificationRequestedNotification;
use App\Notifications\SecurityAlertNotification;
use App\Notifications\SignatureReminderNotification;
use App\Notifications\TaskApprovedNotification;
use App\Notifications\TaskAssignedNotification;
use App\Notifications\TaskCompletedNotification;
use App\Notifications\TaskDueReminderNotification;
use App\Notifications\TaskOverdueNotification;
use App\Notifications\TaskReviewRequestedNotification;
use App\Notifications\TaskRevisionRequestedNotification;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StaffEmailNotificationsTest extends TestCase
{
    use RefreshDatabase;

    public function test_branded_layout_renders_the_optional_template_badge(): void
    {
        $user = User::factory()->create();
        $client = Client::factory()->create(['relationship_partner_id' => $user->id]);

        $html = (string) (new ClientPartnerAssignedNotification($client))->toMail($user)->render();

        $this->assertStringContainsString('Penugasan Klien Baru', $html);
    }

    public function test_correspondence_cta_uses_the_registered_governance_route_and_application_url(): void
    {
        config()->set('app.url', 'https://staging.rpk.test');

        $user = User::factory()->create();
        $correspondence = Correspondence::factory()->create();

        $html = (string) (new CorrespondenceDispatchedNotification($correspondence))->toMail($user)->render();

        $this->assertStringContainsString(
            'https://staging.rpk.test/governance/correspondences/'.$correspondence->id,
            $html,
        );
        $this->assertStringNotContainsString('https://app.rpklawoffice.com/correspondences/', $html);
    }

    public function test_account_email_ctas_follow_the_configured_application_url(): void
    {
        config()->set('app.url', 'https://staging.rpk.test');

        $user = User::factory()->create();
        $welcomeHtml = (string) (new NewStaffWelcomeNotification($user, 'TemporaryPassword!'))->toMail($user)->render();
        $securityHtml = (string) (new SecurityAlertNotification('Password diubah'))->toMail($user)->render();

        $this->assertStringContainsString('https://staging.rpk.test/login', $welcomeHtml);
        $this->assertStringContainsString('https://staging.rpk.test/settings/security', $securityHtml);
    }

    public function test_signature_reminder_uses_the_branded_rpk_email_layout(): void
    {
        config()->set('app.url', 'https://staging.rpk.test');

        $user = User::factory()->create();
        $document = Document::factory()->create(['created_by' => $user->id]);
        $documentVersion = DocumentVersion::factory()->create(['document_id' => $document->id]);
        $signatureRequest = SignatureRequest::create([
            'document_id' => $document->id,
            'document_version_id' => $documentVersion->id,
            'verification_code' => 'SIG-REMINDER-TEST',
            'document_checksum' => $documentVersion->checksum,
            'created_by' => $user->id,
        ]);
        $signer = SignatureSigner::create([
            'signature_request_id' => $signatureRequest->id,
            'name' => 'Budi Santoso',
            'email' => 'budi.santoso@example.com',
            'signing_token' => 'signature-reminder-token',
        ]);

        $html = (string) (new SignatureReminderNotification($signer))->toMail($user)->render();

        $this->assertStringContainsString('Pengingat Tanda Tangan Dokumen', $html);
        $this->assertStringContainsString('CONFIDENTIALITY NOTICE', $html);
        $this->assertStringContainsString('https://staging.rpk.test/sign/signature-reminder-token', $html);
    }

    public function test_branded_layout_keeps_actions_and_information_grids_mobile_safe(): void
    {
        $user = User::factory()->create();
        $task = Task::factory()->create(['assignee_id' => $user->id]);

        $html = (string) (new TaskOverdueNotification($task, 7, true))->toMail($user)->render();

        $this->assertStringContainsString('box-sizing: border-box', $html);
        $this->assertStringContainsString('.email-container td[width="50%"]', $html);
        $this->assertStringContainsString('Buka Detail Tugas', $html);
        $this->assertStringContainsString('Buka tautan alternatif', $html);
        $this->assertStringNotContainsString('Tindak Lanjuti Tugas Sekarang →', $html);
    }

    public function test_renders_all_23_staff_email_notifications_without_errors(): void
    {
        $user = User::factory()->create([
            'name' => 'Muhamad Fajar Roni, S.H.',
            'email' => 'muhamadfajarroni@gmail.com',
        ]);

        $client = Client::factory()->create([
            'display_name' => 'PT Sentra Megah Solusindo',
            'legal_name' => 'PT Sentra Megah Solusindo Tbk',
            'relationship_partner_id' => $user->id,
        ]);

        $matter = Matter::factory()->create([
            'client_id' => $client->id,
            'title' => 'Sengketa Kontrak Kerjasama Distribusi',
            'matter_number' => 'RPK-LIT-2026-008',
            'responsible_partner_id' => $user->id,
        ]);

        $task = Task::factory()->create([
            'matter_id' => $matter->id,
            'assignee_id' => $user->id,
            'reporter_id' => $user->id,
            'title' => 'Penyusunan Eksepsi & Jawaban Tergugat',
            'due_at' => now()->addDays(2),
        ]);

        $document = Document::factory()->create([
            'matter_id' => $matter->id,
            'client_id' => $client->id,
            'title' => 'Draf Kontrak Perjanjian Kerjasama Retainer',
            'created_by' => $user->id,
        ]);

        $approval = DocumentApproval::factory()->create([
            'document_id' => $document->id,
            'reviewer_id' => $user->id,
            'requested_by' => $user->id,
            'request_note' => 'Mohon tinjau klausul ganti rugi pasal 12.',
        ]);

        // 1. Task Assigned
        $notif1 = new TaskAssignedNotification($task);
        $mail1 = $notif1->toMail($user);
        $this->assertStringContainsString('Pemberitahuan Tugas Baru', (string) $mail1->render());

        // 2. Task Due Reminder
        $notif2 = new TaskDueReminderNotification($task);
        $mail2 = $notif2->toMail($user);
        $this->assertStringContainsString('Pengingat Batas Waktu', (string) $mail2->render());

        // 3. Task Overdue
        $notif3 = new TaskOverdueNotification($task);
        $mail3 = $notif3->toMail($user);
        $this->assertStringContainsString('Peringatan Tugas Terlambat', (string) $mail3->render());

        // 4. Task Completed
        $notif4 = new TaskCompletedNotification($task);
        $mail4 = $notif4->toMail($user);
        $this->assertStringContainsString('Laporan Penyelesaian Tugas', (string) $mail4->render());

        // 5. Matter Assigned
        $notif5 = new MatterAssignedNotification($matter);
        $mail5 = $notif5->toMail($user);
        $this->assertStringContainsString('Penugasan Perkara Baru', (string) $mail5->render());

        // 6. Matter Stage Changed
        $notif6 = new MatterStageChangedNotification($matter, 'Sidang Pembuktian', 'Mediasi', $user->name, 'Mediasi gagal.');
        $mail6 = $notif6->toMail($user);
        $this->assertStringContainsString('Perkembangan Tahapan Perkara', (string) $mail6->render());

        // 7. Client Partner Assigned
        $notif7 = new ClientPartnerAssignedNotification($client);
        $mail7 = $notif7->toMail($user);
        $this->assertStringContainsString('Penunjukan Relationship Partner', (string) $mail7->render());

        // 8. Hearing Scheduled
        $notif8 = new HearingScheduledNotification(
            hearingTitle: 'Sidang Pertama Pembacaan Gugatan',
            hearingDate: 'Senin, 1 September 2026',
            hearingTime: '09:30 WIB',
            courtName: 'PN Jakarta Pusat',
            courtRoom: 'Ruang Prof. Mr. Wirjono Prodjodikoro',
            matter: $matter,
            scheduledBy: $user->name
        );
        $mail8 = $notif8->toMail($user);
        $this->assertStringContainsString('Jadwal Sidang Pengadilan Baru', (string) $mail8->render());

        // 9. Hearing Reminder
        $notif9 = new HearingReminderNotification(
            hearingTitle: 'Sidang Pembuktian Surat & Saksi Fakta',
            hearingDate: 'Rabu, 3 September 2026',
            daysBefore: 'H-1',
            courtName: 'PN Jakarta Barat'
        );
        $mail9 = $notif9->toMail($user);
        $this->assertStringContainsString('Pengingat Jadwal Sidang Pengadilan', (string) $mail9->render());

        // 10. Hearing Outcome
        $notif10 = new HearingOutcomeNotification(
            hearingTitle: 'Sidang Mediasi Lanjutan ke-2',
            hearingDate: 'Jumat, 5 September 2026',
            outcomeSummary: 'Hakim mediator memberikan waktu 7 hari untuk merumuskan resume perdamaian.',
            courtName: 'PN Jakarta Selatan',
            matter: $matter,
            attendedBy: $user->name,
            nextHearingDate: 'Jumat, 12 September 2026',
            nextHearingAgenda: 'Penyampaian Draf Akta Perdamaian'
        );
        $mail10 = $notif10->toMail($user);
        $this->assertStringContainsString('Hasil Persidangan Dicatat', (string) $mail10->render());

        // 11. Document Review Requested
        $notif11 = new DocumentApprovalRequestedNotification($approval, $document, $user);
        $mail11 = $notif11->toMail($user);
        $this->assertStringContainsString('Permintaan Telaah', (string) $mail11->render());

        // 12. Document Comment Added
        $notif12 = new DocumentCommentAddedNotification(
            document: $document,
            commentBody: 'Perlu ditambahkan klausul pembatasan tanggung jawab maksimal 100% dari fee tahunan.',
            commenterName: $user->name,
            clauseRef: 'Pasal 8 Ayat 2'
        );
        $mail12 = $notif12->toMail($user);
        $this->assertStringContainsString('Catatan Baru pada Dokumen', (string) $mail12->render());

        // 13. Document Signed Executed
        $notif13 = new DocumentSignedExecutedNotification(
            document: $document,
            signerName: 'Direktur Utama PT Sentra Megah',
            securityHash: '8f4c2b98e1a72d3f65c0b11e29a8f4c2b98e1a72d3f65c0b11e29a8f4c2b98e1'
        );
        $mail13 = $notif13->toMail($user);
        $this->assertStringContainsString('Dokumen Telah Sah Ditandatangani', (string) $mail13->render());

        // 14. Compliance Expiring
        $notif14 = new ComplianceExpiringNotification(
            clientName: $client->display_name,
            docName: 'Nomor Induk Berusaha (NIB)',
            expiryDate: '30 September 2026',
            clientId: $client->id
        );
        $mail14 = $notif14->toMail($user);
        $this->assertStringContainsString('Peringatan Masa Berlaku Dokumen', (string) $mail14->render());

        // 15. Payment Verification Requested
        $notif15 = new PaymentVerificationRequestedNotification(
            invoiceNumber: 'INV-2026-08-001',
            clientName: $client->display_name,
            amountPaid: 'Rp 75.000.000',
            paymentMethod: 'BCA Escrow Transfer',
            paymentDate: '25 Agustus 2026'
        );
        $mail15 = $notif15->toMail($user);
        $this->assertStringContainsString('Verifikasi Pembayaran Klien Masuk', (string) $mail15->render());

        // 16. Correspondence Dispatched
        $correspondence = Correspondence::factory()->create([
            'matter_id' => $matter->id,
            'client_id' => $client->id,
            'subject' => 'Surat Panggilan Sidang Pertama Perkara Perdata No. 12/Pdt.G/2026/PN.Jkt.Pst',
            'direction' => 'inbound',
            'source' => 'manual',
            'from_addresses' => ['panitera@pn-jakartapusat.go.id'],
            'to_addresses' => ['litigasi@rpklawoffice.com'],
            'occurred_at' => now(),
            'created_by' => $user->id,
        ]);
        $notif16 = new CorrespondenceDispatchedNotification($correspondence, 'Harap dipelajari dan disiapkan surat kuasa sebelum hari sidang.');
        $mail16 = $notif16->toMail($user);
        $this->assertStringContainsString('Disposisi Surat Masuk Resmi', (string) $mail16->render());

        // 17. Security Alert
        $notif17 = new SecurityAlertNotification(
            activityType: 'Penggantian Kata Sandi Akun Berhasil',
            ipAddress: '103.145.22.18',
            userAgent: 'Chrome on macOS'
        );
        $mail17 = $notif17->toMail($user);
        $this->assertStringContainsString('Pemberitahuan Keamanan Akun', (string) $mail17->render());

        // 18. Reset Password
        $notif18 = new ResetPassword('sample-reset-token-12345');
        $mail18 = $notif18->toMail($user);
        $this->assertStringContainsString('Permintaan Reset Password', (string) $mail18->render());

        // 19. Verify Email
        $notif19 = new VerifyEmail;
        $mail19 = $notif19->toMail($user);
        $this->assertStringContainsString('Verifikasi Alamat Email', (string) $mail19->render());

        // 20. New Staff Welcome
        $notif20 = new NewStaffWelcomeNotification($user, 'SecretTempPass2026!');
        $mail20 = $notif20->toMail($user);
        $this->assertStringContainsString('Selamat Datang di RPK Law Firm', (string) $mail20->render());

        // 21. Task Review Requested
        $notif21 = new TaskReviewRequestedNotification($task, $user, 'Mohon review hasil pekerjaan ini.');
        $mail21 = $notif21->toMail($user);
        $this->assertStringContainsString('Permintaan Review Tugas', (string) $mail21->render());

        // 22. Task Revision Requested
        $notif22 = new TaskRevisionRequestedNotification($task, $user, 'Perbaiki bagian analisis dan kesimpulan.');
        $mail22 = $notif22->toMail($user);
        $this->assertStringContainsString('Permintaan Revisi Tugas', (string) $mail22->render());

        // 23. Task Approved
        $notif23 = new TaskApprovedNotification($task, $user, 'Hasil pekerjaan telah sesuai.');
        $mail23 = $notif23->toMail($user);
        $this->assertStringContainsString('Tugas Telah Disetujui', (string) $mail23->render());
    }
}
