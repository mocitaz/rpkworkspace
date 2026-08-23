<?php

namespace Database\Seeders;

use App\Models\AuditLog;
use App\Models\Client;
use App\Models\ConflictCheck;
use App\Models\Contact;
use App\Models\Correspondence;
use App\Models\Deadline;
use App\Models\DeadlineReminderDelivery;
use App\Models\Document;
use App\Models\DocumentApproval;
use App\Models\DocumentNumberSequence;
use App\Models\DocumentTemplate;
use App\Models\DocumentTemplateGeneration;
use App\Models\DocumentVersion;
use App\Models\Expense;
use App\Models\Invoice;
use App\Models\InvoiceLineItem;
use App\Models\Matter;
use App\Models\MatterEvent;
use App\Models\MatterExport;
use App\Models\MatterNumberSequence;
use App\Models\MatterParty;
use App\Models\Note;
use App\Models\Payment;
use App\Models\PaymentAllocation;
use App\Models\PracticeArea;
use App\Models\Quotation;
use App\Models\QuoteLineItem;
use App\Models\SignatureRequest;
use App\Models\SignatureSigner;
use App\Models\Task;
use App\Models\User;
use Carbon\CarbonImmutable;
use Dompdf\Dompdf;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use PhpOffice\PhpWord\IOFactory;
use PhpOffice\PhpWord\PhpWord;
use RuntimeException;
use ZipArchive;

class RafWorkspaceDemoSeeder extends Seeder
{
    use WithoutModelEvents;

    /** @var array<string, User> */
    private array $actors;

    private CarbonImmutable $referenceDate;

    public function run(): void
    {
        $this->referenceDate = CarbonImmutable::create(2026, 8, 21, 9, 0, 0, 'Asia/Jakarta');
        $this->actors = $this->resolveActors();

        $this->clearOperationalData();
        Storage::disk('local')->deleteDirectory('seeded-workspace');

        $practiceAreas = $this->seedPracticeAreas();
        $clients = $this->seedClients();
        $contacts = $this->seedContacts($clients);
        $matters = $this->seedMatters($clients, $practiceAreas);
        $this->seedMatterOperations($matters, $contacts);
        $documents = $this->seedDocuments($matters);
        $templates = $this->seedTemplates();
        $this->seedTemplateGenerations($templates, $matters, $documents);
        $quotations = $this->seedFinance($matters, $documents);
        $this->seedGovernance($matters, $contacts, $documents, $quotations);
        $this->seedDocumentApprovals($documents);
        $this->seedSignatures($documents);
        $this->seedSequences();
        $this->seedAuditTrail($matters, $documents);
        $this->seedNotifications($matters);
    }

    /** @return array<string, User> */
    private function resolveActors(): array
    {
        $fallback = User::query()->where('is_active', true)->oldest()->first();
        if ($fallback === null) {
            throw new RuntimeException('Seeder operasional membutuhkan minimal satu akun aktif. Data auth sengaja tidak dibuat atau dihapus oleh seeder ini.');
        }

        $find = static fn (string $role): User => User::query()
            ->where('is_active', true)
            ->whereHas('roles', fn ($query) => $query->where('slug', $role))
            ->oldest()
            ->first() ?? $fallback;

        return [
            'administrator' => $find('administrator'),
            'managing-partner' => $find('managing-partner'),
            'partner' => $find('partner'),
            'associate' => $find('associate'),
            'finance' => $find('finance'),
        ];
    }

    private function clearOperationalData(): void
    {
        $tables = [
            'correspondence_document', 'payment_allocations', 'invoice_line_items', 'quote_line_items',
            'signature_signers', 'signature_requests', 'document_approvals', 'document_template_generations',
            'document_templates', 'deadline_reminder_deliveries', 'matter_exports', 'conflict_checks',
            'correspondences', 'payments', 'expenses', 'invoices', 'quotations', 'audit_logs',
            'document_versions', 'documents', 'notes', 'matter_events', 'deadlines', 'tasks',
            'matter_parties', 'matter_members', 'matters', 'contacts', 'clients', 'practice_areas',
            'document_number_sequences', 'matter_number_sequences', 'notifications', 'failed_jobs',
            'job_batches', 'jobs', 'cache_locks', 'cache',
        ];

        Schema::disableForeignKeyConstraints();
        try {
            foreach ($tables as $table) {
                DB::table($table)->delete();
            }
        } finally {
            Schema::enableForeignKeyConstraints();
        }
    }

    /** @return array<int, PracticeArea> */
    private function seedPracticeAreas(): array
    {
        $items = [
            ['Korporasi, M&A & Investasi', 'Pendirian, restrukturisasi, transaksi saham, joint venture, dan investasi strategis.'],
            ['Perbankan & Jasa Keuangan', 'Pembiayaan, fintech, kepatuhan OJK, serta transaksi pasar keuangan.'],
            ['Penyelesaian Sengketa', 'Strategi sengketa komersial, negosiasi, mediasi, arbitrase, dan litigasi.'],
            ['Ketenagakerjaan & Hubungan Industrial', 'Hubungan kerja, kebijakan internal, PHK, dan perselisihan industrial.'],
            ['Properti, Konstruksi & Infrastruktur', 'Akuisisi lahan, konstruksi, perizinan, dan pengembangan infrastruktur.'],
            ['Teknologi, Data & Kekayaan Intelektual', 'Perlindungan data, lisensi teknologi, platform digital, merek, dan hak cipta.'],
            ['Energi, Sumber Daya & ESG', 'Proyek energi, kepatuhan lingkungan, tata kelola, dan pembiayaan berkelanjutan.'],
            ['Kontrak Komersial & Legal Advisory', 'Penyusunan kontrak, pendapat hukum, retainer, dan konsultasi bisnis harian.'],
        ];

        return collect($items)->map(fn (array $item, int $index): PracticeArea => PracticeArea::query()->create([
            'name' => $item[0], 'slug' => Str::slug($item[0]), 'description' => $item[1],
            'is_active' => true, 'sort_order' => $index + 1,
        ]))->all();
    }

    /** @return array<int, Client> */
    private function seedClients(): array
    {
        $items = [
            ['PT Meridian Infrastruktur Nusantara', 'Meridian Infrastruktur', 'Infrastruktur', 'meridian.co.id', '021-5098-1100', 'legal@meridian.co.id', 'Menara Meridian, Jl. Jenderal Sudirman Kav. 45', 'Lantai 18', 'Jakarta Selatan', 'DKI Jakarta', '12930'],
            ['PT Sagara Digital Finansial', 'Sagara Digital', 'Teknologi Finansial', 'sagaradigital.id', '021-3970-8800', 'corporate.legal@sagaradigital.id', 'Treasury Tower, District 8 SCBD', 'Lantai 27', 'Jakarta Selatan', 'DKI Jakarta', '12190'],
            ['PT Cakrawala Pangan Indonesia', 'Cakrawala Pangan', 'FMCG & Distribusi', 'cakrawalapangan.co.id', '021-2938-7600', 'legal@cakrawalapangan.co.id', 'Jl. Raya Bekasi KM 22', 'Kawasan Industri Cakung', 'Jakarta Timur', 'DKI Jakarta', '13910'],
            ['PT Artha Prima Logistik', 'Artha Prima Logistics', 'Logistik & Rantai Pasok', 'arthaprimalogistics.com', '021-6912-4500', 'legal@arthaprimalogistics.com', 'Jl. Marunda Makmur No. 88', 'Blok C-12', 'Jakarta Utara', 'DKI Jakarta', '14150'],
            ['Yayasan Pendidikan Nusa Bangsa', 'Nusa Bangsa Foundation', 'Pendidikan', 'nusabangsa.or.id', '022-730-4400', 'sekretariat@nusabangsa.or.id', 'Jl. R.E. Martadinata No. 72', 'Gedung Rektorat', 'Bandung', 'Jawa Barat', '40115'],
            ['PT Bumi Lestari Energi', 'Bumi Lestari Energi', 'Energi Terbarukan', 'bumilestarienergi.co.id', '021-5790-2255', 'compliance@bumilestarienergi.co.id', 'World Trade Centre 3, Jl. Jenderal Sudirman', 'Lantai 12', 'Jakarta Selatan', 'DKI Jakarta', '12920'],
            ['CV Atelier Ruang Kota', 'Atelier Ruang Kota', 'Arsitektur & Desain', 'atelierruangkota.id', '031-567-2233', 'office@atelierruangkota.id', 'Jl. Mayjen Sungkono No. 99', 'Studio 5A', 'Surabaya', 'Jawa Timur', '60256'],
            ['Helena Wijaya', 'Helena Wijaya', 'Private Client', 'helenawijaya.id', '021-7281-9988', 'helena.wijaya@example.test', 'Jl. Pakubuwono VI No. 18', 'Kebayoran Baru', 'Jakarta Selatan', 'DKI Jakarta', '12120'],
        ];

        return collect($items)->map(function (array $item, int $index): Client {
            return Client::query()->create([
                'client_number' => sprintf('RAF-C-2026-%04d', $index + 1),
                'type' => $index === 7 ? 'individual' : 'organization', 'legal_name' => $item[0], 'display_name' => $item[1],
                'industry' => $item[2], 'tax_identifier' => sprintf('01.%03d.%03d.7-0%02d.000', 100 + $index, 210 + $index, $index + 1),
                'registration_identifier' => $index === 7 ? 'NIK-3174-2026-0008' : sprintf('AHU-%06d.AH.01.01.TAHUN 2026', 1400 + $index),
                'website' => 'https://'.$item[3], 'phone' => $item[4], 'email' => $item[5], 'address_line_1' => $item[6],
                'address_line_2' => $item[7], 'city' => $item[8], 'province' => $item[9], 'postal_code' => $item[10], 'country_code' => 'ID',
                'notes' => 'Klien terverifikasi. Dokumen KYC, beneficial ownership, dan surat penunjukan telah ditelaah saat pembukaan hubungan profesional.',
                'status' => $index === 6 ? 'inactive' : 'active',
                'relationship_partner_id' => $this->actor($index % 2 === 0 ? 'managing-partner' : 'partner')->getKey(),
                'opened_at' => $this->referenceDate->subMonths(18 - $index)->toDateString(),
                'closed_at' => $index === 6 ? $this->referenceDate->subMonth()->toDateString() : null,
                'created_by' => $this->actor('administrator')->getKey(),
            ]);
        })->all();
    }

    /** @param array<int, Client> $clients
     * @return array<string, array<int, Contact>>
     */
    private function seedContacts(array $clients): array
    {
        $names = [
            [['Aditya', 'Pranoto', 'General Counsel'], ['Maya', 'Kusuma', 'Corporate Secretary']],
            [['Nabila', 'Ardiansyah', 'Head of Legal & Compliance'], ['Kevin', 'Tanujaya', 'Chief Financial Officer']],
            [['Rizky', 'Mahendra', 'Legal & Corporate Affairs Director'], ['Sinta', 'Permatasari', 'Procurement Director']],
            [['Bram', 'Wicaksono', 'Legal Manager'], ['Felicia', 'Gunawan', 'Finance Controller']],
            [['Dr. Ratih', 'Nugroho', 'Ketua Pengurus'], ['Yusuf', 'Ramadhan', 'Sekretaris Eksekutif']],
            [['Dewi', 'Kartika', 'Chief Sustainability Officer'], ['Andreas', 'Halim', 'Project Finance Director']],
            [['Nadya', 'Suryadinata', 'Managing Architect'], ['Dion', 'Prasetyo', 'Commercial Manager']],
            [['Helena', 'Wijaya', 'Principal'], ['Monica', 'Hartanto', 'Family Office Representative']],
        ];
        $contacts = [];
        foreach ($clients as $clientIndex => $client) {
            foreach ($names[$clientIndex] as $contactIndex => $person) {
                $contacts[(string) $client->getKey()][] = Contact::query()->create([
                    'client_id' => $client->getKey(), 'first_name' => $person[0], 'last_name' => $person[1], 'job_title' => $person[2],
                    'organization_name' => $client->legal_name, 'email' => Str::slug($person[0].'.'.$person[1], '.').'@'.Str::after($client->email, '@'),
                    'phone' => $client->phone.' ext. '.(110 + $contactIndex),
                    'mobile' => sprintf('+62 812-90%02d-%04d', $clientIndex + 10, 2100 + ($clientIndex * 10) + $contactIndex),
                    'notes' => $contactIndex === 0 ? 'Kontak utama untuk instruksi hukum dan persetujuan ruang lingkup pekerjaan.' : 'Kontak sekunder untuk koordinasi komersial, dokumen, dan penagihan.',
                    'created_by' => $this->actor('associate')->getKey(),
                ]);
            }
        }

        return $contacts;
    }

    /** @param array<int, Client> $clients
     * @param  array<int, PracticeArea>  $practiceAreas
     * @return array<int, Matter>
     */
    private function seedMatters(array $clients, array $practiceAreas): array
    {
        $items = [
            [0, 4, 'Project Aurora — EPC Contract & Land Acquisition', 'Transactional', 'active', 'high', 'confidential', 2_850_000_000, 'Indonesia', 'Non-litigasi / proyek nasional', 'PRJ-AURORA-2026'],
            [1, 1, 'Series B Investment & Shareholders Agreement', 'Corporate Transaction', 'active', 'critical', 'restricted', 1_750_000_000, 'Indonesia dan Singapura', 'Non-litigasi / cross-border', 'SDF-SERIESB-2026'],
            [2, 7, 'National Distribution Agreement Review', 'Commercial Advisory', 'active', 'normal', 'standard', 480_000_000, 'Indonesia', 'Non-litigasi / komersial', 'CPI-DIST-2026'],
            [3, 2, 'Warehouse Service Level Commercial Dispute', 'Dispute', 'active', 'critical', 'restricted', 1_350_000_000, 'Indonesia', 'BANI Arbitration Center Jakarta', 'BANI-ARB/2026/041'],
            [4, 3, 'Employee Handbook & Industrial Relations Audit', 'Employment Advisory', 'on_hold', 'normal', 'confidential', 325_000_000, 'Indonesia', 'PHI Bandung', 'YPNB-HR-2026'],
            [5, 6, 'Solar Portfolio Regulatory & ESG Compliance', 'Regulatory Advisory', 'active', 'high', 'confidential', 925_000_000, 'Indonesia', 'Kementerian ESDM / KLHK', 'BLE-ESG-2026'],
            [6, 5, 'Architectural Copyright & Licensing Framework', 'Intellectual Property', 'closed', 'normal', 'standard', 240_000_000, 'Indonesia', 'Direktorat Jenderal Kekayaan Intelektual', 'ARK-IP-2026'],
            [7, 0, 'Family Holding Restructuring & Estate Planning', 'Private Client', 'active', 'high', 'restricted', 1_200_000_000, 'Indonesia dan Hong Kong', 'Non-litigasi / private wealth', 'HW-ESTATE-2026'],
            [0, 2, 'Procurement Claim — Elevated Rail Package', 'Dispute', 'active', 'critical', 'restricted', 2_100_000_000, 'Indonesia', 'Pengadilan Negeri Jakarta Pusat', '395/Pdt.G/2026/PN.Jkt.Pst'],
            [1, 5, 'Data Protection & Cloud Vendor Remediation', 'Technology Advisory', 'active', 'high', 'confidential', 675_000_000, 'Indonesia', 'Kementerian Komunikasi dan Digital', 'SDF-DP-2026'],
            [2, 0, 'Minority Acquisition of Cold Storage Operator', 'M&A', 'prospective', 'normal', 'confidential', 1_450_000_000, 'Indonesia', 'Non-litigasi / transaksi', 'CPI-MA-2026'],
            [5, 7, 'Annual Corporate Retainer 2026', 'Retainer', 'archived', 'low', 'standard', 600_000_000, 'Indonesia', 'Non-litigasi / retainer', 'BLE-RET-2026'],
        ];

        return collect($items)->map(function (array $item, int $index) use ($clients, $practiceAreas): Matter {
            $status = $item[4];
            $closedAt = in_array($status, ['closed', 'archived'], true) ? $this->referenceDate->subDays(35 - $index)->toDateString() : null;
            $matter = Matter::query()->create([
                'matter_number' => sprintf('RAF-2026-%04d', $index + 1), 'title' => $item[2], 'client_id' => $clients[$item[0]]->getKey(),
                'summary' => 'Pendampingan menyeluruh mencakup analisis risiko, penyusunan dan negosiasi dokumen, koordinasi pemangku kepentingan, pelaporan berkala, serta pengendalian tenggat dan bukti kerja.',
                'budget_amount' => $item[7], 'currency' => 'IDR', 'practice_area_id' => $practiceAreas[$item[1]]->getKey(),
                'matter_type' => $item[3], 'status' => $status, 'priority' => $item[5], 'confidentiality_level' => $item[6],
                'responsible_partner_id' => $this->actor($index % 2 === 0 ? 'managing-partner' : 'partner')->getKey(),
                'supervising_lawyer_id' => $this->actor('associate')->getKey(),
                'opened_at' => $this->referenceDate->subDays(210 - ($index * 12))->toDateString(), 'closed_at' => $closedAt,
                'jurisdiction' => $item[8], 'court' => $item[9], 'external_case_number' => $item[10],
                'archived_at' => $status === 'archived' ? $this->referenceDate->subDays(10) : null,
                'archived_by' => $status === 'archived' ? $this->actor('managing-partner')->getKey() : null,
                'legal_hold_at' => $index === 8 ? $this->referenceDate->subDays(12) : null,
                'legal_hold_by' => $index === 8 ? $this->actor('partner')->getKey() : null,
                'legal_hold_reason' => $index === 8 ? 'Preservasi dokumen diterapkan selama litigasi sampai ada instruksi pencabutan tertulis dari partner.' : null,
                'created_by' => $this->actor('administrator')->getKey(),
            ]);

            $memberIds = collect([$this->actor('associate')->getKey(), $this->actor('partner')->getKey(), $this->actor('managing-partner')->getKey()])->unique();
            $matter->members()->sync($memberIds->mapWithKeys(fn (int $userId, int $memberIndex): array => [
                $userId => ['role' => ['lead_counsel', 'reviewer', 'oversight'][$memberIndex], 'assigned_by' => $this->actor('administrator')->getKey(), 'created_at' => $this->referenceDate->subDays(120 - $index)],
            ])->all());

            return $matter;
        })->all();
    }

    /** @param array<int, Matter> $matters
     * @param  array<string, array<int, Contact>>  $contacts
     */
    private function seedMatterOperations(array $matters, array $contacts): void
    {
        foreach ($matters as $index => $matter) {
            $clientContacts = $contacts[(string) $matter->client_id];
            foreach ([
                [$clientContacts[0], 'client_representative', 'Pemberi instruksi utama dan pihak yang berwenang menyetujui strategi serta deliverable.'],
                [$clientContacts[1], 'client_contact', 'Koordinator dokumen, jadwal rapat, serta kebutuhan administrasi matter.'],
            ] as $party) {
                MatterParty::query()->create([
                    'matter_id' => $matter->getKey(), 'contact_id' => $party[0]->getKey(), 'party_type' => $party[1],
                    'name' => $party[0]->full_name, 'organization_name' => $party[0]->organization_name,
                    'notes' => $party[2], 'created_by' => $this->actor('associate')->getKey(),
                ]);
            }
            MatterParty::query()->create([
                'matter_id' => $matter->getKey(), 'contact_id' => null, 'party_type' => $index % 3 === 0 ? 'opposing_party' : 'counterparty',
                'name' => 'Perwakilan Hukum Counterparty '.($index + 1), 'organization_name' => 'PT Counterparty Strategis '.chr(65 + $index),
                'notes' => 'Pihak eksternal yang wajib dicakup dalam conflict check dan komunikasi formal.', 'created_by' => $this->actor('partner')->getKey(),
            ]);

            foreach ([
                ['Susun issue list dan matriks risiko', 'Kompilasi isu material, posisi hukum, dampak komersial, dan rekomendasi mitigasi.', 'completed', 'high', -12],
                ['Review dokumen dan bukti pendukung', 'Telaah fakta, kewenangan penandatangan, serta kelengkapan bukti.', 'in_progress', 'normal', 3],
                ['Siapkan draft advice untuk partner review', 'Draft mencantumkan executive summary, asumsi, caveat, dan action items.', 'review', 'high', 5],
                ['Konfirmasi langkah berikutnya dengan klien', 'Kirim minutes of meeting dan perbarui keputusan yang memerlukan instruksi.', $index % 4 === 0 ? 'waiting' : 'todo', 'normal', 9],
            ] as $task) {
                Task::query()->create([
                    'matter_id' => $matter->getKey(), 'title' => $task[0], 'description' => $task[1],
                    'assignee_id' => $this->actor('associate')->getKey(), 'reporter_id' => $this->actor('partner')->getKey(),
                    'reviewer_id' => $this->actor('managing-partner')->getKey(), 'status' => $task[2], 'priority' => $task[3],
                    'due_at' => $this->referenceDate->addDays($task[4] + $index)->setTime(17, 0),
                    'completed_at' => $task[2] === 'completed' ? $this->referenceDate->subDays(10 - $index)->setTime(16, 30) : null,
                ]);
            }

            foreach ([
                ['Internal review milestone', 'internal', 4 + $index, false],
                [$index % 3 === 0 ? 'Batas penyampaian formal' : 'Client decision deadline', $index % 3 === 0 ? 'filing' : 'client', 11 + ($index * 2), $index % 3 === 0],
            ] as $deadlineIndex => $item) {
                $status = $index === 6 && $deadlineIndex === 0 ? 'completed' : ($index === 11 && $deadlineIndex === 1 ? 'cancelled' : 'open');
                $deadline = Deadline::query()->create([
                    'matter_id' => $matter->getKey(), 'title' => $item[0], 'description' => 'Tenggat terkontrol dengan eskalasi otomatis kepada supervising lawyer dan responsible partner.',
                    'deadline_type' => $item[1], 'due_at' => $this->referenceDate->addDays($item[2])->setTime(17, 0), 'is_critical' => $item[3],
                    'reminder_metadata' => ['hours_before' => [168, 72, 24], 'escalate_to_partner' => true, 'channel' => ['database', 'mail']],
                    'owner_id' => $this->actor('associate')->getKey(), 'status' => $status,
                    'completed_at' => $status === 'completed' ? $this->referenceDate->subDays(2) : null,
                    'cancelled_at' => $status === 'cancelled' ? $this->referenceDate->subDays(5) : null,
                    'created_by' => $this->actor('partner')->getKey(),
                ]);
                DeadlineReminderDelivery::query()->create(['deadline_id' => $deadline->getKey(), 'user_id' => $this->actor('associate')->getKey(), 'hours_before' => 168]);
            }

            foreach ([
                ['client_meeting', 'Weekly matter coordination', 'Pembahasan progres, keputusan terbuka, perubahan risiko, dan rencana kerja.', 2 + $index, 10, 'Microsoft Teams — RAF Client Room '.sprintf('%02d', $index + 1), 'associate'],
                ['partner_review', 'Partner strategy review', 'Review strategi, quality control, privilege, dan persetujuan komunikasi eksternal.', 5 + $index, 15, 'RPK Law Firm — Meeting Room Garuda', 'partner'],
            ] as $event) {
                MatterEvent::query()->create([
                    'matter_id' => $matter->getKey(), 'event_type' => $event[0], 'title' => $event[1], 'description' => $event[2],
                    'starts_at' => $this->referenceDate->addDays($event[3])->setTime($event[4], 0),
                    'ends_at' => $this->referenceDate->addDays($event[3])->setTime($event[4] + 1, 0), 'location' => $event[5],
                    'owner_id' => $this->actor($event[6])->getKey(), 'created_by' => $this->actor('administrator')->getKey(),
                ]);
            }

            foreach ([
                ['internal', 'Strategic considerations', 'Pertahankan pendekatan berbasis risiko, dokumentasikan instruksi material, dan eskalasikan perubahan scope.', 'partner', 'associate'],
                ['privileged', 'Partner privileged note', 'Catatan dilindungi privilege untuk evaluasi posisi hukum, settlement range, serta risiko reputasi dan regulator.', 'managing-partner', 'partner'],
            ] as $note) {
                Note::query()->create([
                    'matter_id' => $matter->getKey(), 'client_id' => $matter->client_id, 'classification' => $note[0], 'title' => $note[1],
                    'body' => $note[2], 'private_to_id' => $this->actor($note[3])->getKey(), 'created_by' => $this->actor($note[4])->getKey(),
                ]);
            }
        }
    }

    /** @param array<int, Matter> $matters
     * @return array<string, array<int, Document>>
     */
    private function seedDocuments(array $matters): array
    {
        $documents = [];
        foreach ($matters as $index => $matter) {
            $documents[(string) $matter->getKey()][] = $this->createTextDocument(
                $matter, 'Legal Memorandum — '.$matter->title, 'legal_memorandum', $index % 3 === 0 ? 'approved' : 'review', $matter->confidentiality_level,
                "LEGAL MEMORANDUM\nMatter: {$matter->matter_number}\nClient: {$matter->client->display_name}\n\nExecutive summary\nAnalisis disusun berdasarkan dokumen, instruksi klien, dan peraturan yang berlaku. Rekomendasi menekankan mitigasi risiko, tata kelola keputusan, dan dokumentasi persetujuan material.\n\nScope\n1. Identifikasi isu dan fakta material.\n2. Analisis posisi hukum dan alternatif tindakan.\n3. Rencana implementasi dan kontrol tenggat.\n\nConfidential and legally privileged.",
                $index < 6 ? 2 : 1,
            );
            $documents[(string) $matter->getKey()][] = $this->createTextDocument(
                $matter, 'Matter Status Report — August 2026', 'status_report', $index % 4 === 0 ? 'final' : 'draft', 'standard',
                "MATTER STATUS REPORT\nReference: {$matter->matter_number}\nReporting period: August 2026\n\nCompleted work\n- Issue list and evidence register updated.\n- Key stakeholder instructions confirmed.\n- Draft deliverables circulated for review.\n\nNext steps\n- Close outstanding factual questions.\n- Obtain partner approval.\n- Deliver final advice within agreed timeline.",
            );
        }

        return $documents;
    }

    /** @return array<int, DocumentTemplate> */
    private function seedTemplates(): array
    {
        $definitions = [
            ['Legal Memorandum', 'legal_memorandum', ['client.name', 'matter.number', 'matter.title', 'partner.name', 'date']],
            ['Engagement Letter', 'engagement_letter', ['client.legal_name', 'client.address', 'matter.title', 'quotation.total', 'partner.name']],
            ['Board Resolution', 'corporate_resolution', ['client.legal_name', 'meeting.date', 'meeting.location', 'resolution.subject']],
            ['Formal Legal Notice', 'legal_notice', ['recipient.name', 'recipient.address', 'matter.number', 'notice.subject', 'deadline.date']],
        ];
        $templates = [];
        foreach ($definitions as $index => $definition) {
            $first = $this->createTemplate($definition[0], $definition[1], $definition[2], 1, $index === 0 ? 'inactive' : 'active');
            $templates[] = $first;
            if ($index === 0) {
                $first->update(['superseded_at' => $this->referenceDate->subDays(14)]);
                $templates[] = $this->createTemplate($definition[0].' — RAF Standard 2026', $definition[1], $definition[2], 2, 'active', $first);
            }
        }

        return $templates;
    }

    /** @param array<int, DocumentTemplate> $templates
     * @param  array<int, Matter>  $matters
     * @param  array<string, array<int, Document>>  $documents
     */
    private function seedTemplateGenerations(array $templates, array $matters, array $documents): void
    {
        foreach (array_slice($matters, 0, 4) as $index => $matter) {
            $template = $templates[$index + 1] ?? $templates[0];
            DocumentTemplateGeneration::query()->create([
                'document_template_id' => $template->getKey(), 'document_id' => $documents[(string) $matter->getKey()][0]->getKey(),
                'matter_id' => $matter->getKey(), 'resolved_placeholders' => [
                    'client.name' => $matter->client->display_name, 'matter.number' => $matter->matter_number,
                    'matter.title' => $matter->title, 'partner.name' => $matter->responsiblePartner->name,
                    'date' => $this->referenceDate->translatedFormat('d F Y'),
                ],
                'generated_by' => $this->actor('associate')->getKey(),
            ]);
        }
    }

    /** @param array<int, Matter> $matters
     * @param  array<string, array<int, Document>>  $documents
     * @return array<int, Quotation>
     */
    private function seedFinance(array $matters, array &$documents): array
    {
        $quotations = [];
        foreach (array_slice($matters, 0, 10) as $index => $matter) {
            $quoteStatus = ['approved', 'sent', 'pending_approval', 'approved', 'cancelled'][$index % 5];
            $quoteItems = [
                ['Professional fees — legal analysis and drafting', 1, 180_000_000 + ($index * 25_000_000)],
                ['Negotiation, stakeholder meetings, and partner review', 1, 95_000_000 + ($index * 12_500_000)],
                ['Matter management, reporting, and closing support', 1, 45_000_000 + ($index * 7_500_000)],
            ];
            $subtotal = collect($quoteItems)->sum(fn (array $item): int => $item[1] * $item[2]);
            $discount = $index % 3 === 0 ? 15_000_000 : 0;
            $tax = (int) round(($subtotal - $discount) * 0.11);
            $quotation = Quotation::query()->create([
                'quotation_number' => sprintf('QT-2026-%04d', $index + 1), 'client_id' => $matter->client_id,
                'matter_id' => $matter->getKey(), 'title' => 'Fee Proposal — '.$matter->title,
                'scope' => 'Legal due diligence, advice, drafting, negosiasi, rapat koordinasi, partner review, dan closing support. Pekerjaan di luar scope memerlukan persetujuan tertulis.',
                'status' => $quoteStatus, 'currency' => 'IDR', 'subtotal_amount' => $subtotal, 'discount_amount' => $discount,
                'tax_rate' => 11, 'tax_amount' => $tax, 'total_amount' => $subtotal - $discount + $tax,
                'issued_at' => $this->referenceDate->subDays(75 - ($index * 4))->toDateString(),
                'valid_until' => $this->referenceDate->addDays(30 + $index)->toDateString(),
                'approved_by' => in_array($quoteStatus, ['approved', 'sent'], true) ? $this->actor('partner')->getKey() : null,
                'approved_at' => in_array($quoteStatus, ['approved', 'sent'], true) ? $this->referenceDate->subDays(65 - ($index * 4)) : null,
                'converted_at' => $index < 7 ? $this->referenceDate->subDays(55 - ($index * 3)) : null,
                'created_by' => $this->actor('associate')->getKey(),
            ]);
            foreach ($quoteItems as $itemIndex => $item) {
                QuoteLineItem::query()->create([
                    'quotation_id' => $quotation->getKey(), 'description' => $item[0], 'quantity' => $item[1],
                    'unit_amount' => $item[2], 'total_amount' => $item[1] * $item[2], 'sort_order' => $itemIndex + 1,
                ]);
            }
            $quotations[] = $quotation;

            $invoiceStatus = ['paid', 'sent', 'overdue', 'draft', 'cancelled', 'sent'][$index % 6];
            $invoiceSubtotal = (int) round($subtotal * 0.55);
            $invoiceDiscount = $index % 4 === 0 ? 5_000_000 : 0;
            $invoiceTax = (int) round(($invoiceSubtotal - $invoiceDiscount) * 0.11);
            $invoiceTotal = $invoiceSubtotal - $invoiceDiscount + $invoiceTax;
            $partialAmount = $invoiceStatus === 'sent' && $index % 2 === 1 ? (int) round($invoiceTotal * 0.4) : 0;
            $paidAmount = $invoiceStatus === 'paid' ? $invoiceTotal : $partialAmount;
            $invoice = Invoice::query()->create([
                'invoice_number' => sprintf('INV-2026-%04d', $index + 1), 'client_id' => $matter->client_id,
                'matter_id' => $matter->getKey(), 'quotation_id' => $quotation->getKey(), 'title' => 'Professional Fees — '.$matter->matter_number,
                'status' => $invoiceStatus, 'currency' => 'IDR', 'subtotal_amount' => $invoiceSubtotal,
                'discount_amount' => $invoiceDiscount, 'tax_rate' => 11, 'tax_amount' => $invoiceTax, 'total_amount' => $invoiceTotal,
                'paid_amount' => $paidAmount, 'outstanding_amount' => $invoiceStatus === 'cancelled' ? $invoiceTotal : $invoiceTotal - $paidAmount,
                'issued_at' => $invoiceStatus === 'draft' ? null : $this->referenceDate->subDays(50 - ($index * 3))->toDateString(),
                'due_at' => $invoiceStatus === 'draft' ? null : ($invoiceStatus === 'overdue' ? $this->referenceDate->subDays(8)->toDateString() : $this->referenceDate->addDays(15 + $index)->toDateString()),
                'sent_at' => in_array($invoiceStatus, ['sent', 'paid', 'overdue'], true) ? $this->referenceDate->subDays(48 - ($index * 3)) : null,
                'paid_at' => $invoiceStatus === 'paid' ? $this->referenceDate->subDays(20 - $index) : null,
                'cancelled_at' => $invoiceStatus === 'cancelled' ? $this->referenceDate->subDays(18) : null,
                'cancelled_by' => $invoiceStatus === 'cancelled' ? $this->actor('partner')->getKey() : null,
                'cancellation_reason' => $invoiceStatus === 'cancelled' ? 'Invoice digantikan dengan termin penagihan yang disepakati ulang bersama klien.' : null,
                'created_by' => $this->actor('finance')->getKey(),
            ]);
            foreach ([
                ['Professional fees — first billing milestone', $invoiceSubtotal - 35_000_000],
                ['Matter administration and controlled disbursement', 35_000_000],
            ] as $itemIndex => $item) {
                InvoiceLineItem::query()->create([
                    'invoice_id' => $invoice->getKey(), 'description' => $item[0], 'quantity' => 1,
                    'unit_amount' => $item[1], 'total_amount' => $item[1], 'sort_order' => $itemIndex + 1,
                ]);
            }

            $proof = $this->createTextDocument(
                $matter, 'Bukti Transaksi & Disbursement — '.$matter->matter_number, 'financial_proof', 'final', 'restricted',
                "FINANCIAL EVIDENCE REGISTER\nMatter: {$matter->matter_number}\nClient: {$matter->client->display_name}\nReference: FIN-{$matter->matter_number}\nVerified by RAF Finance Operations.\nThis record represents sanitized demonstration evidence.",
            );
            $documents[(string) $matter->getKey()][] = $proof;

            foreach ([
                ['court_and_filing', 'Biaya pendaftaran, legalisasi, dan administrasi resmi', 'Institusi / Otoritas Terkait', 4_750_000 + ($index * 250_000)],
                ['travel_and_logistics', 'Transportasi dan logistik rapat atau pemeriksaan dokumen', 'RAF Approved Travel Vendor', 2_350_000 + ($index * 175_000)],
            ] as $expenseIndex => $expenseData) {
                $expenseStatus = $expenseIndex === 0 ? 'approved' : ($index % 4 === 0 ? 'pending_approval' : 'approved');
                Expense::query()->create([
                    'matter_id' => $matter->getKey(), 'category' => $expenseData[0], 'description' => $expenseData[1], 'vendor' => $expenseData[2],
                    'incurred_at' => $this->referenceDate->subDays(20 - $index)->toDateString(), 'amount' => $expenseData[3], 'currency' => 'IDR',
                    'status' => $expenseStatus, 'proof_document_id' => $proof->getKey(),
                    'approved_by' => $expenseStatus === 'approved' ? $this->actor('partner')->getKey() : null,
                    'approved_at' => $expenseStatus === 'approved' ? $this->referenceDate->subDays(15 - $index) : null,
                    'created_by' => $this->actor('finance')->getKey(),
                ]);
            }

            if ($paidAmount > 0) {
                $payment = Payment::query()->create([
                    'client_id' => $matter->client_id, 'matter_id' => $matter->getKey(), 'currency' => 'IDR', 'amount' => $paidAmount,
                    'method' => 'bank_transfer', 'reference_number' => sprintf('BCA/RAF/%04d/%06d', $index + 1, 882100 + $index),
                    'notes' => 'Pembayaran diverifikasi terhadap mutasi rekening dan dialokasikan ke invoice terkait.',
                    'received_at' => $this->referenceDate->subDays(19 - $index)->setTime(11, 20),
                    'proof_document_id' => $proof->getKey(), 'recorded_by' => $this->actor('finance')->getKey(),
                ]);
                PaymentAllocation::query()->create(['payment_id' => $payment->getKey(), 'invoice_id' => $invoice->getKey(), 'amount' => $paidAmount]);
            }
        }

        $reversalMatter = $matters[3];
        Payment::query()->create([
            'client_id' => $reversalMatter->client_id, 'matter_id' => $reversalMatter->getKey(), 'currency' => 'IDR', 'amount' => 75_000_000,
            'method' => 'bank_transfer', 'reference_number' => 'REVERSAL-DEMO-2026-0041', 'notes' => 'Transaksi salah referensi dan telah dibalik setelah rekonsiliasi.',
            'received_at' => $this->referenceDate->subDays(30), 'proof_document_id' => $documents[(string) $reversalMatter->getKey()][0]->getKey(),
            'recorded_by' => $this->actor('finance')->getKey(), 'reversed_at' => $this->referenceDate->subDays(28),
            'reversal_reason' => 'Dana teridentifikasi sebagai pembayaran untuk entitas dan invoice yang berbeda.', 'reversed_by' => $this->actor('partner')->getKey(),
        ]);
        $refundMatter = $matters[5];
        Payment::query()->create([
            'client_id' => $refundMatter->client_id, 'matter_id' => $refundMatter->getKey(), 'currency' => 'IDR', 'amount' => 50_000_000,
            'method' => 'bank_transfer', 'reference_number' => 'REFUND-DEMO-2026-0068', 'notes' => 'Kelebihan pembayaran dikembalikan sesuai rekonsiliasi dan persetujuan partner.',
            'received_at' => $this->referenceDate->subDays(40), 'proof_document_id' => $documents[(string) $refundMatter->getKey()][0]->getKey(),
            'recorded_by' => $this->actor('finance')->getKey(), 'refunded_at' => $this->referenceDate->subDays(35),
            'refund_reason' => 'Kelebihan pembayaran atas termin sebelumnya telah dikonfirmasi oleh klien.', 'refunded_by' => $this->actor('partner')->getKey(),
        ]);

        return $quotations;
    }

    /** @param array<int, Matter> $matters
     * @param  array<string, array<int, Contact>>  $contacts
     * @param  array<string, array<int, Document>>  $documents
     * @param  array<int, Quotation>  $quotations
     */
    private function seedGovernance(array $matters, array $contacts, array $documents, array $quotations): void
    {
        foreach ($matters as $index => $matter) {
            $clientContacts = $contacts[(string) $matter->client_id];
            foreach ([
                ['inbound', $index % 2 === 0 ? 'bcc' : 'manual', 'Client instructions and document confirmation', $clientContacts[0]->email, 'matters@raf-law.example'],
                ['outbound', 'manual', 'RAF status update and next action items', 'matters@raf-law.example', $clientContacts[0]->email],
            ] as $messageIndex => $message) {
                $correspondence = Correspondence::query()->create([
                    'matter_id' => $matter->getKey(), 'client_id' => $matter->client_id, 'contact_id' => $clientContacts[0]->getKey(),
                    'direction' => $message[0], 'source' => $message[1], 'subject' => '['.$matter->matter_number.'] '.$message[2],
                    'from_addresses' => [$message[3]], 'to_addresses' => [$message[4]], 'cc_addresses' => [$clientContacts[1]->email, 'records@raf-law.example'],
                    'body' => 'Dear Counsel, berikut konfirmasi status pekerjaan, dokumen yang diterima, keputusan yang masih diperlukan, dan jadwal penyelesaian. Mohon seluruh instruksi material menggunakan nomor matter pada subject email.',
                    'external_message_id' => sprintf('<raf-%s-%02d@workspace.raf-law.example>', Str::lower($matter->matter_number), $messageIndex + 1),
                    'occurred_at' => $this->referenceDate->subDays(8 - $messageIndex)->addHours($index), 'created_by' => $this->actor('associate')->getKey(),
                ]);
                $correspondence->documents()->attach($documents[(string) $matter->getKey()][$messageIndex % 2]->getKey());
            }

            $status = ['clear', 'potential_match', 'blocked'][$index % 3];
            ConflictCheck::query()->create([
                'client_id' => $matter->client_id, 'matter_id' => $matter->getKey(), 'quotation_id' => $quotations[$index % count($quotations)]->getKey(),
                'subject_name' => 'Conflict intake — '.$matter->client->legal_name,
                'searched_names' => [$matter->client->legal_name, 'PT Counterparty Strategis '.chr(65 + $index), $clientContacts[0]->full_name],
                'matches' => $status === 'clear' ? [] : [['type' => 'matter_party', 'id' => (string) $matter->getKey(), 'name' => 'PT Counterparty Strategis '.chr(65 + $index), 'risk' => $status === 'blocked' ? 'blocked' : 'potential_match']],
                'status' => $status, 'decision' => $status === 'clear' ? 'cleared' : ($status === 'potential_match' ? 'waived' : 'blocked'),
                'decision_note' => $status === 'clear'
                    ? 'Tidak ditemukan hubungan yang menimbulkan konflik setelah pencarian nama, afiliasi, pihak lawan, dan matter historis.'
                    : ($status === 'potential_match' ? 'Partner menyetujui waiver setelah scope dan tim dipisahkan, informed consent dicatat, dan information barrier diterapkan.' : 'Instruksi ditolak karena terdapat konflik langsung dengan representasi aktif firma.'),
                'requested_by' => $this->actor('associate')->getKey(), 'reviewed_by' => $this->actor('partner')->getKey(),
                'reviewed_at' => $this->referenceDate->subDays(90 - $index), 'expires_at' => $this->referenceDate->addDays(30 + $index),
            ]);
        }

        foreach (array_slice($matters, 0, 3) as $index => $matter) {
            if ($index === 0) {
                [$path, $contents] = $this->storeHandoverBundle($matter);
                MatterExport::query()->create([
                    'matter_id' => $matter->getKey(), 'status' => 'completed', 'storage_disk' => 'local', 'storage_path' => $path,
                    'checksum' => hash('sha256', $contents), 'manifest_checksum' => hash('sha256', $matter->matter_number.'|manifest|2026'),
                    'file_size' => mb_strlen($contents, '8bit'), 'failure_message' => null,
                    'requested_by' => $this->actor('partner')->getKey(), 'completed_at' => $this->referenceDate->subDays(2),
                ]);
            } else {
                MatterExport::query()->create([
                    'matter_id' => $matter->getKey(), 'status' => $index === 1 ? 'failed' : 'queued',
                    'storage_disk' => null, 'storage_path' => null, 'checksum' => null, 'manifest_checksum' => null, 'file_size' => null,
                    'failure_message' => $index === 1 ? 'Export simulasi gagal karena satu dokumen masih menunggu hasil pemindaian keamanan.' : null,
                    'requested_by' => $this->actor('partner')->getKey(), 'completed_at' => null,
                ]);
            }
        }
    }

    /** @param array<string, array<int, Document>> $documents */
    private function seedDocumentApprovals(array $documents): void
    {
        foreach ($this->flattenDocuments($documents, 8) as $index => $document) {
            $status = ['approved', 'pending', 'changes_requested', 'approved'][$index % 4];
            DocumentApproval::query()->create([
                'document_id' => $document->getKey(), 'requested_by' => $this->actor('associate')->getKey(),
                'reviewer_id' => $this->actor($index % 2 === 0 ? 'partner' : 'managing-partner')->getKey(), 'status' => $status,
                'request_note' => 'Mohon review substansi, konsistensi fakta, privilege, asumsi, dan kesiapan dokumen untuk disampaikan kepada klien.',
                'resolution_note' => $status === 'pending' ? null : ($status === 'approved' ? 'Disetujui setelah quality control. Pastikan versi final dan checksum dicatat sebelum pengiriman.' : 'Perlu revisi pada executive summary, caveat, dan rujukan kewenangan penandatangan.'),
                'resolved_at' => $status === 'pending' ? null : $this->referenceDate->subDays(3 + $index),
            ]);
        }
    }

    /** @param array<string, array<int, Document>> $documents */
    private function seedSignatures(array $documents): void
    {
        foreach ($this->flattenDocuments($documents, 4) as $index => $document) {
            $version = $document->currentVersion;
            $status = ['completed', 'sent', 'sent', 'expired'][$index];
            $artifacts = [];
            if ($status === 'completed') {
                $artifacts['record'] = $this->storePdf('signatures/'.$document->getKey().'/signed-record.pdf', 'RAF Internal Acceptance Record', $document->title);
                $artifacts['certificate'] = $this->storePdf('signatures/'.$document->getKey().'/certificate.pdf', 'RAF Verification Certificate', 'Checksum '.$version->checksum);
                $artifacts['final'] = $this->storePdf('signatures/'.$document->getKey().'/signed-final.pdf', 'RAF Signed-Final Visual Copy', $document->title);
            }
            $request = SignatureRequest::query()->create([
                'document_id' => $document->getKey(), 'document_version_id' => $version->getKey(), 'verification_code' => Str::upper(Str::random(20)),
                'mode' => $index === 2 ? 'parallel' : 'sequential', 'status' => $status, 'assurance_level' => 'internal_acceptance', 'document_checksum' => $version->checksum,
                'signed_record_disk' => $status === 'completed' ? 'local' : null, 'signed_record_path' => $artifacts['record']['path'] ?? null,
                'signed_final_disk' => $status === 'completed' ? 'local' : null, 'signed_final_path' => $artifacts['final']['path'] ?? null,
                'signed_final_status' => $status === 'completed' ? 'completed' : ($status === 'sent' ? 'queued' : 'unavailable'),
                'signed_final_message' => $status === 'completed' ? 'Signed-final berhasil dibuat dan checksum terverifikasi.' : 'Menunggu seluruh signer menyelesaikan internal acceptance.',
                'certificate_disk' => $status === 'completed' ? 'local' : null, 'certificate_path' => $artifacts['certificate']['path'] ?? null,
                'expires_at' => $status === 'expired' ? $this->referenceDate->subDay() : $this->referenceDate->addDays(14 + $index),
                'sent_at' => $this->referenceDate->subDays(6 + $index), 'completed_at' => $status === 'completed' ? $this->referenceDate->subDays(3) : null,
                'signed_final_started_at' => $status === 'completed' ? $this->referenceDate->subDays(3)->addMinutes(2) : null,
                'signed_final_completed_at' => $status === 'completed' ? $this->referenceDate->subDays(3)->addMinutes(3) : null,
                'created_by' => $this->actor('associate')->getKey(),
            ]);
            foreach ([['Aditya Pranoto', 'aditya.pranoto@example.test'], ['Maya Kusuma', 'maya.kusuma@example.test']] as $signerIndex => $signer) {
                $signed = $status === 'completed' || ($status === 'sent' && $signerIndex === 0 && $index === 1);
                SignatureSigner::query()->create([
                    'signature_request_id' => $request->getKey(), 'name' => $signer[0], 'email' => $signer[1], 'signing_order' => $signerIndex + 1,
                    'signing_token' => hash('sha256', $request->getKey().'|'.$signer[1]), 'status' => $signed ? 'signed' : ($status === 'expired' ? 'expired' : 'pending'),
                    'signed_at' => $signed ? $this->referenceDate->subDays(3)->addMinutes($signerIndex * 8) : null,
                    'last_reminded_at' => $signed ? null : $this->referenceDate->subHours(30 + $signerIndex),
                    'signed_ip_address' => $signed ? '203.0.113.'.(40 + $signerIndex) : null,
                    'signed_user_agent' => $signed ? 'Mozilla/5.0 RAF Workspace Seeded Acceptance Client' : null,
                    'accepted_name' => $signed ? $signer[0] : null,
                ]);
            }
        }
    }

    private function seedSequences(): void
    {
        MatterNumberSequence::query()->create(['year' => 2026, 'next_value' => 13]);
        foreach ([['invoice', 11], ['quotation', 11]] as $sequence) {
            DocumentNumberSequence::query()->create(['type' => $sequence[0], 'year' => 2026, 'next_value' => $sequence[1]]);
        }
    }

    /** @param array<int, Matter> $matters
     * @param  array<string, array<int, Document>>  $documents
     */
    private function seedAuditTrail(array $matters, array $documents): void
    {
        $previousHash = null;
        $events = [];
        foreach ($matters as $index => $matter) {
            $events[] = [$matter, 'matter.opened', 'matter', ['matter_number' => $matter->matter_number, 'status' => $matter->status, 'budget_amount' => $matter->budget_amount]];
            $events[] = [$matter, 'matter.team_assigned', 'matter', ['member_count' => $matter->members()->count(), 'responsible_partner_id' => $matter->responsible_partner_id]];
            $events[] = [$documents[(string) $matter->getKey()][0], 'document.version_uploaded', 'document', ['version' => 1, 'scan_status' => 'clean', 'matter_number' => $matter->matter_number]];
            if ($index < 10) {
                $invoice = $matter->invoices()->first();
                $events[] = [$invoice, 'invoice.lifecycle_seeded', 'finance', ['invoice_number' => $invoice?->invoice_number, 'status' => $invoice?->status]];
            }
        }
        foreach ($events as $index => $event) {
            $subject = $event[0];
            if ($subject === null) {
                continue;
            }
            $createdAt = $this->referenceDate->subDays(90)->addHours($index);
            $payload = [
                'actor_id' => $this->actor($index % 3 === 0 ? 'partner' : 'associate')->getKey(), 'event' => $event[1], 'category' => $event[2],
                'subject_type' => $subject::class, 'subject_id' => (string) $subject->getKey(), 'metadata' => $event[3], 'created_at' => $createdAt->toIso8601String(),
            ];
            $entryHash = hash('sha256', json_encode([$previousHash, $payload], JSON_THROW_ON_ERROR));
            AuditLog::query()->create([
                ...$payload, 'ip_address' => '10.20.0.'.(($index % 200) + 10), 'user_agent' => 'RAF Workspace Seeder/2026.08 (controlled dataset)',
                'previous_hash' => $previousHash, 'entry_hash' => $entryHash,
            ]);
            $previousHash = $entryHash;
        }
    }

    /** @param array<int, Matter> $matters */
    private function seedNotifications(array $matters): void
    {
        foreach (array_slice($matters, 0, 8) as $index => $matter) {
            DB::table('notifications')->insert([
                'id' => (string) Str::uuid(), 'type' => 'App\\Notifications\\WorkspaceAttentionRequired',
                'notifiable_type' => User::class, 'notifiable_id' => $this->actor('associate')->getKey(),
                'data' => json_encode([
                    'title' => $index % 2 === 0 ? 'Tenggat matter memerlukan perhatian' : 'Dokumen menunggu partner review',
                    'message' => $matter->matter_number.' — '.$matter->title, 'matter_id' => $matter->getKey(),
                    'severity' => $index % 3 === 0 ? 'high' : 'normal',
                ], JSON_THROW_ON_ERROR),
                'read_at' => $index > 4 ? $this->referenceDate->subHours($index) : null,
                'created_at' => $this->referenceDate->subHours(12 - $index), 'updated_at' => $this->referenceDate->subHours(12 - $index),
            ]);
        }
    }

    private function createTextDocument(Matter $matter, string $title, string $documentType, string $status, string $confidentiality, string $contents, int $versionCount = 1): Document
    {
        $document = Document::query()->create([
            'matter_id' => $matter->getKey(), 'client_id' => $matter->client_id, 'title' => $title, 'document_type' => $documentType,
            'status' => $status, 'confidentiality_level' => $confidentiality, 'created_by' => $this->actor('associate')->getKey(),
        ]);
        $currentVersion = null;
        foreach (range(1, $versionCount) as $versionNumber) {
            $versionContents = $contents."\n\nVersion {$versionNumber} — controlled copy generated for RAF Workspace demonstration.";
            $path = 'seeded-workspace/documents/'.$document->getKey().'/v'.$versionNumber.'.txt';
            Storage::disk('local')->put($path, $versionContents);
            $currentVersion = DocumentVersion::query()->create([
                'document_id' => $document->getKey(), 'version_number' => $versionNumber,
                'original_filename' => Str::slug($title).'-v'.$versionNumber.'.txt', 'storage_disk' => 'local', 'storage_path' => $path,
                'mime_type' => 'text/plain', 'file_size' => mb_strlen($versionContents, '8bit'), 'checksum' => hash('sha256', $versionContents),
                'uploaded_by' => $this->actor('associate')->getKey(), 'notes' => $versionNumber === 1 ? 'Initial working version.' : 'Revised after internal legal and factual review.',
                'scan_status' => 'clean', 'scan_message' => 'Seeded fixture passed controlled malware scan simulation.', 'scanned_at' => $this->referenceDate->subDays(5 - $versionNumber),
                'extraction_status' => 'completed', 'extracted_text' => $versionContents,
                'extraction_metadata' => ['extractor' => 'native-text', 'language' => 'id-en', 'pages_estimated' => 2 + $versionNumber],
                'extracted_at' => $this->referenceDate->subDays(5 - $versionNumber)->addMinute(), 'created_at' => $this->referenceDate->subDays(20 - $versionNumber),
            ]);
        }
        $document->update(['current_version_id' => $currentVersion->getKey()]);

        return $document->fresh(['currentVersion', 'client', 'matter']);
    }

    /** @param array<int, string> $placeholders */
    private function createTemplate(string $name, string $documentType, array $placeholders, int $version, string $status, ?DocumentTemplate $root = null): DocumentTemplate
    {
        $phpWord = new PhpWord;
        $section = $phpWord->addSection();
        $section->addTitle($name, 1);
        $section->addText('RPK Law Firm — Controlled Document Template');
        foreach ($placeholders as $placeholder) {
            $section->addText('{{'.$placeholder.'}}');
        }
        $temporaryPath = tempnam(sys_get_temp_dir(), 'raf-template-');
        if ($temporaryPath === false) {
            throw new RuntimeException('Tidak dapat membuat file sementara template DOCX.');
        }
        IOFactory::createWriter($phpWord, 'Word2007')->save($temporaryPath);
        $contents = file_get_contents($temporaryPath);
        unlink($temporaryPath);
        if ($contents === false) {
            throw new RuntimeException('Tidak dapat membaca template DOCX yang dihasilkan.');
        }
        $path = 'seeded-workspace/templates/'.Str::slug($name).'-v'.$version.'.docx';
        Storage::disk('local')->put($path, $contents);

        return DocumentTemplate::query()->create([
            'root_template_id' => $root?->getKey(), 'name' => $name, 'document_type' => $documentType, 'storage_disk' => 'local', 'storage_path' => $path,
            'original_filename' => Str::slug($name).'-v'.$version.'.docx', 'checksum' => hash('sha256', $contents), 'placeholders' => $placeholders,
            'status' => $status, 'version' => $version, 'superseded_at' => null, 'scan_status' => 'clean',
            'scan_message' => 'Template DOCX valid dan lolos pemindaian controlled fixture.', 'scanned_at' => $this->referenceDate->subDays(7),
            'created_by' => $this->actor('administrator')->getKey(),
        ]);
    }

    /** @return array{path: string, contents: string} */
    private function storePdf(string $relativePath, string $heading, string $body): array
    {
        $dompdf = new Dompdf;
        $dompdf->loadHtml('<html><body style="font-family: sans-serif; padding: 48px"><h1>'.e($heading).'</h1><p>'.e($body).'</p><hr><p>RPK Law Firm · Jakarta · Controlled verification evidence</p></body></html>');
        $dompdf->render();
        $contents = $dompdf->output();
        $path = 'seeded-workspace/'.$relativePath;
        Storage::disk('local')->put($path, $contents);

        return ['path' => $path, 'contents' => $contents];
    }

    /** @return array{string, string} */
    private function storeHandoverBundle(Matter $matter): array
    {
        $temporaryPath = tempnam(sys_get_temp_dir(), 'raf-handover-');
        if ($temporaryPath === false) {
            throw new RuntimeException('Tidak dapat membuat file sementara handover.');
        }
        $zip = new ZipArchive;
        if ($zip->open($temporaryPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
            throw new RuntimeException('Tidak dapat membuat handover ZIP.');
        }
        $manifest = json_encode([
            'matter_number' => $matter->matter_number, 'title' => $matter->title,
            'generated_at' => $this->referenceDate->toIso8601String(), 'evidence_policy' => 'checksum-and-audit-chain',
        ], JSON_PRETTY_PRINT | JSON_THROW_ON_ERROR);
        $zip->addFromString('metadata/manifest.json', $manifest);
        $zip->addFromString('README.txt', 'RPK Law Firm controlled matter handover bundle.');
        $zip->close();
        $contents = file_get_contents($temporaryPath);
        unlink($temporaryPath);
        if ($contents === false) {
            throw new RuntimeException('Tidak dapat membaca handover ZIP.');
        }
        $path = 'seeded-workspace/exports/'.$matter->matter_number.'-handover.zip';
        Storage::disk('local')->put($path, $contents);

        return [$path, $contents];
    }

    private function actor(string $role): User
    {
        return $this->actors[$role];
    }

    /**
     * @param  array<string, array<int, Document>>  $documents
     * @return array<int, Document>
     */
    private function flattenDocuments(array $documents, int $limit): array
    {
        return array_slice(array_merge(...array_values($documents)), 0, $limit);
    }
}
