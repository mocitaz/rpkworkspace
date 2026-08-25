<?php

namespace Tests\Feature;

use App\Models\Client;
use App\Models\Document;
use App\Models\DocumentApproval;
use App\Models\Matter;
use App\Models\Task;
use App\Models\User;
use App\Notifications\ClientPartnerAssignedNotification;
use App\Notifications\ComplianceExpiringNotification;
use App\Notifications\DocumentApprovalRequestedNotification;
use App\Notifications\DocumentCommentAddedNotification;
use App\Notifications\DocumentSignedExecutedNotification;
use App\Notifications\HearingOutcomeNotification;
use App\Notifications\HearingReminderNotification;
use App\Notifications\HearingScheduledNotification;
use App\Notifications\MatterAssignedNotification;
use App\Notifications\MatterStageChangedNotification;
use App\Notifications\PaymentVerificationRequestedNotification;
use App\Notifications\TaskAssignedNotification;
use App\Notifications\TaskCompletedNotification;
use App\Notifications\TaskDueReminderNotification;
use App\Notifications\TaskOverdueNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StaffEmailNotificationsTest extends TestCase
{
    use RefreshDatabase;

    public function test_renders_all_15_staff_email_notifications_without_errors(): void
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
        $this->assertStringContainsString('Penugasan Tugas Baru', (string) $mail1->render());

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
    }
}
