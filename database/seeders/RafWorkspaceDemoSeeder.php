<?php

namespace Database\Seeders;

use App\Models\AuditLog;
use App\Models\Client;
use App\Models\ClientComplianceDocument;
use App\Models\Comment;
use App\Models\CommentReaction;
use App\Models\ConflictCheck;
use App\Models\Contact;
use App\Models\Correspondence;
use App\Models\Deadline;
use App\Models\DeadlineReminderDelivery;
use App\Models\DirectMessage;
use App\Models\DirectMessageReaction;
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
use App\Models\MatterChronology;
use App\Models\MatterEvent;
use App\Models\MatterEvidence;
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
        $this->referenceDate = CarbonImmutable::create(2026, 8, 23, 9, 0, 0, 'Asia/Jakarta');
        $this->actors = $this->resolveActors();

        $this->clearOperationalData();
        Storage::disk('local')->deleteDirectory('seeded-workspace');

        $practiceAreas = $this->seedPracticeAreas();
        $clients = $this->seedClients();
        $complianceDocs = $this->seedClientComplianceDocuments($clients);
        $contacts = $this->seedContacts($clients);
        $matters = $this->seedMatters($clients, $practiceAreas);
        $this->seedMatterOperations($matters, $contacts);
        $this->seedMatterChronologies($matters);
        $this->seedMatterEvidences($matters);
        $documents = $this->seedDocuments($matters);
        $templates = $this->seedTemplates();
        $this->seedTemplateGenerations($templates, $matters, $documents);
        $quotations = $this->seedFinance($matters, $documents);
        $this->seedGovernance($matters, $contacts, $documents, $quotations);
        $this->seedDocumentApprovals($documents);
        $this->seedSignatures($documents);
        $this->seedSequences();
        $this->seedComments($matters, $documents);
        $this->seedAuditTrail($matters, $documents);
        $this->seedNotifications($matters);
        $this->seedDirectMessages();
    }

    /** @return array<string, User> */
    private function resolveActors(): array
    {
        $fajarRoni = User::query()->where('email', 'fajarroni@rpklawoffice.com')->first();
        $anggara = User::query()->where('email', 'anggaraputra@rpklawoffice.com')->first();
        $reza = User::query()->where('email', 'rezakusumah@rpklawoffice.com')->first();
        $admin = User::query()->where('email', 'contact@rpklawoffice.com')->first();

        $fallback = User::query()->where('is_active', true)->oldest()->first();
        if ($fallback === null) {
            throw new RuntimeException('Seeder operasional membutuhkan minimal satu akun aktif.');
        }

        return [
            'administrator' => $admin ?? $fallback,
            'managing-partner' => $fajarRoni ?? $fallback,
            'partner' => $anggara ?? $fallback,
            'partner-corporate' => $reza ?? $fallback,
            'associate' => $anggara ?? $fallback,
            'associate-litigation' => $anggara ?? $fallback,
            'paralegal' => $admin ?? $fallback,
            'finance' => $admin ?? $fallback,
        ];
    }

    private function actor(string $role): User
    {
        return $this->actors[$role] ?? $this->actors['administrator'];
    }

    private function clearOperationalData(): void
    {
        $tables = [
            'client_compliance_documents', 'matter_evidences', 'direct_message_reactions', 'direct_messages',
            'comment_reactions', 'comments', 'matter_chronologies', 'correspondence_document',
            'payment_allocations', 'invoice_line_items', 'quote_line_items',
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
                if (Schema::hasTable($table)) {
                    DB::table($table)->delete();
                }
            }
        } finally {
            Schema::enableForeignKeyConstraints();
        }
    }

    /** @return array<int, PracticeArea> */
    private function seedPracticeAreas(): array
    {
        $items = [
            ['Litigasi & Penyelesaian Sengketa Strategis', 'Strategi sengketa komersial, perdata, pidana bisnis, tindak pidana korporasi, arbitrase BANI/SIAC, dan peradilan niaga.'],
            ['Korporasi, M&A & Joint Venture Multinasional', 'Pendirian, restrukturisasi korporasi, merger & akuisisi, due diligence, investasi PMA, dan kepatuhan perizinan OSS.'],
            ['Energi, Pertambangan Mineral & Infrastruktur EPC', 'Proyek pertambangan mineral & nikel, kontrak konstruksi EPC turnkey, perizinan IUP/ESDM, dan energi terbarukan.'],
            ['Perbankan, Keuangan Sindikasi & Sukuk Syariah', 'Pembiayaan sindikasi, restrukturisasi hutang, instrumen pasar modal, sukuk ijarah, dan kepatuhan regulasi OJK/BI.'],
            ['Ketenagakerjaan & Hubungan Industrial (PHI)', 'Kebijakan ketenagakerjaan, perselisihan hubungan industrial (PHI), perundingan PKB, dan audit regulasi Disnaker.'],
            ['Restrukturisasi Hutang, Kepailitan & PKPU Niaga', 'Pengurusan dan pendampingan debitur/kreditor dalam proses PKPU dan kepailitan di Pengadilan Niaga.'],
            ['Kekayaan Intelektual, Teknologi & Kepatuhan UU PDP', 'Perlindungan paten, merek dagang, lisensi teknologi, kepatuhan UU Perlindungan Data Pribadi (PDP), dan cyber law.'],
            ['Hukum Agraria, Pembebasan Lahan & Kawasan Industri', 'Akuisisi lahan skala besar, sertifikasi HGB/HGU, pembebasan lahan industri, dan izin pemanfaatan ruang.'],
        ];

        return collect($items)->map(fn (array $item, int $index): PracticeArea => PracticeArea::query()->create([
            'name' => $item[0],
            'slug' => Str::slug($item[0]),
            'description' => $item[1],
            'is_active' => true,
            'sort_order' => $index + 1,
        ]))->all();
    }

    /** @return array<int, Client> */
    private function seedClients(): array
    {
        $items = [
            ['PT Nusantara Energi Mega Perkasa', 'Nusantara Energi Perkasa', 'Energi & Sumber Daya Mineral', 'nusantaraenergi.co.id', '021-5098-1100', 'legal@nusantaraenergi.co.id', 'Menara Astra, Jl. Jenderal Sudirman Kav. 5-6', 'Lantai 38', 'Jakarta Pusat', 'DKI Jakarta', '10220', 'medium', 'verified'],
            ['PT Bumi Mineral Nusantara Tbk', 'Bumi Mineral Nusantara', 'Pertambangan & Smelter', 'buminusantara.co.id', '021-3970-8800', 'corporate.legal@buminusantara.co.id', 'Treasury Tower, District 8 SCBD', 'Lantai 27', 'Jakarta Selatan', 'DKI Jakarta', '12190', 'low', 'verified'],
            ['PT Sentosa Logistik Indonesia', 'Sentosa Logistik', 'Transportasi & Rantai Pasok', 'sentosalogistik.co.id', '021-2938-7600', 'legal@sentosalogistik.co.id', 'Jl. Raya Bekasi KM 22', 'Kawasan Industri Cakung', 'Jakarta Timur', 'DKI Jakarta', '13910', 'medium', 'verified'],
            ['PT Bank Syariah Mandiri Sejahtera', 'Bank Mandiri Sejahtera', 'Perbankan & Keuangan', 'syariahmandiri.co.id', '021-6912-4500', 'legal.compliance@syariahmandiri.co.id', 'Menara Mandiri, Jl. Jend. Sudirman', 'Lantai 15', 'Jakarta Selatan', 'DKI Jakarta', '12190', 'low', 'verified'],
            ['Yayasan Pendidikan Pasundan Bangsa', 'Pasundan Bangsa Foundation', 'Pendidikan & Sosial', 'pasundanbangsa.or.id', '022-730-4400', 'sekretariat@pasundanbangsa.or.id', 'Jl. R.E. Martadinata No. 72', 'Gedung Rektorat', 'Bandung', 'Jawa Barat', '40115', 'low', 'verified'],
            ['PT Cakrawala Farmasi Nusantara', 'Cakrawala Farmasi', 'Farmasi & Kesehatan', 'cakrawalafarmasi.co.id', '022-420-5588', 'corporate@cakrawalafarmasi.co.id', 'Jl. Soekarno-Hatta No. 590', 'Kawasan Niaga Metro', 'Bandung', 'Jawa Barat', '40286', 'low', 'verified'],
            ['PT Graha Propertindo Utama', 'Graha Propertindo', 'Properti & Kawasan Industri', 'grahapropertindo.id', '021-567-2233', 'legal@grahapropertindo.id', 'Jl. M.H. Thamrin No. 88', 'Lantai 9', 'Jakarta Pusat', 'DKI Jakarta', '10350', 'medium', 'verified'],
            ['Dr. H. Hendrawan Soediro, Sp.OG', 'Dr. Hendrawan Soediro', 'Private Client & Family Asset', 'hendrawan.soediro@example.test', '022-7281-9988', 'hendrawan.soediro@example.test', 'Jl. Dago Asri No. 18', 'Coblong', 'Bandung', 'Jawa Barat', '40135', 'low', 'verified'],
        ];

        return collect($items)->map(function (array $item, int $index): Client {
            $kycChecklist = [
                'identity_verified' => true,
                'beneficial_ownership_identified' => true,
                'sanctions_pep_screened' => true,
                'ad_art_and_sk_verified' => true,
                'source_of_funds_documented' => true,
            ];

            return Client::query()->create([
                'client_number' => sprintf('RPK-C-2026-%04d', $index + 1),
                'type' => $index === 7 ? 'individual' : 'organization',
                'legal_name' => $item[0],
                'display_name' => $item[1],
                'industry' => $item[2],
                'tax_identifier' => sprintf('01.%03d.%03d.7-0%02d.000', 100 + $index, 210 + $index, $index + 1),
                'registration_identifier' => $index === 7 ? 'NIK-3273-2026-0008' : sprintf('AHU-%06d.AH.01.01.TAHUN 2026', 1400 + $index),
                'website' => 'https://'.$item[3],
                'phone' => $item[4],
                'email' => $item[5],
                'address_line_1' => $item[6],
                'address_line_2' => $item[7],
                'city' => $item[8],
                'province' => $item[9],
                'postal_code' => $item[10],
                'country_code' => 'ID',
                'notes' => 'Klien terverifikasi resmi RPK Law Firm. Berkas KYC lengkap, Beneficial Ownership tertelusuri, dan lolos uji tapis sanksi (AML/CFT screening).',
                'kyc_risk_level' => $item[11],
                'kyc_status' => $item[12],
                'kyc_checklist' => $kycChecklist,
                'kyc_assessed_at' => $this->referenceDate->subMonths(3)->toDateString(),
                'kyc_assessed_by' => $this->actor('managing-partner')->getKey(),
                'kyc_notes' => 'Uji tuntas KYC/AML komprehensif selesai dilakukan. Struktur Beneficial Owner terverifikasi hingga ultimate holding. Bebas dari sanksi internasional PPATK/OFAC.',
                'status' => 'active',
                'relationship_partner_id' => $this->actor($index % 3 === 0 ? 'managing-partner' : ($index % 3 === 1 ? 'partner' : 'partner-corporate'))->getKey(),
                'opened_at' => $this->referenceDate->subMonths(24 - $index)->toDateString(),
                'closed_at' => null,
                'created_by' => $this->actor('administrator')->getKey(),
            ]);
        })->all();
    }

    /**
     * @param  array<int, Client>  $clients
     * @return array<int, ClientComplianceDocument>
     */
    private function seedClientComplianceDocuments(array $clients): array
    {
        $records = [
            // Client 0 (PT Nusantara Energi Mega Perkasa)
            [
                'client_id' => $clients[0]->getKey(),
                'document_type' => 'deed_establishment',
                'document_number' => 'AHU-0012489.AH.01.01.TAHUN 2018',
                'title' => 'Akta Pendirian No. 45 & SK Pengesahan Badan Hukum Kemenkumham RI',
                'issued_at' => '2018-04-12',
                'expires_at' => null,
                'issuer' => 'Kementerian Hukum dan HAM RI / Notaris Siti Rahmawati, S.H.',
                'notes' => 'Salinan resmi akta pendirian tersimpan dalam map arsip korporasi.',
            ],
            [
                'client_id' => $clients[0]->getKey(),
                'document_type' => 'deed_amendment_directors',
                'document_number' => 'AHU-AH.01.03-0098231.TAHUN 2024',
                'title' => 'Akta Perubahan Anggaran Dasar & Susunan Pengurus Terakhir No. 18',
                'issued_at' => '2024-06-20',
                'expires_at' => '2029-06-20',
                'issuer' => 'Kementerian Hukum dan HAM RI / Notaris FX Harryanto, S.H.',
                'notes' => 'Masa jabatan direksi berlaku selama 5 tahun sesuai Pasal 11 Anggaran Dasar.',
            ],
            [
                'client_id' => $clients[0]->getKey(),
                'document_type' => 'nib',
                'document_number' => '9120008920194',
                'title' => 'Nomor Induk Berusaha (NIB) OSS Berbasis Risiko Terverifikasi',
                'issued_at' => '2021-09-10',
                'expires_at' => null,
                'issuer' => 'Kementerian Investasi / BKPM RI (Sistem OSS RBA)',
                'notes' => 'KBLI Utama: 35101 (Pembangkitan Tenaga Listrik) & 07294 (Pertambangan Nikel).',
            ],
            [
                'client_id' => $clients[0]->getKey(),
                'document_type' => 'amdal_environmental',
                'document_number' => '660/AMDAL-DLH/IV/2020',
                'title' => 'Keputusan Kelayakan Lingkungan Hidup (AMDAL) Pembangkit & Smelter',
                'issued_at' => '2020-04-15',
                'expires_at' => '2030-04-15',
                'issuer' => 'Dinas Lingkungan Hidup Provinsi Maluku Utara',
                'notes' => 'Wajib menyampaikan Laporan Pelaksanaan RKL-RPL setiap 6 bulan sekali.',
            ],

            // Client 5 (PT Cakrawala Farmasi Nusantara)
            [
                'client_id' => $clients[5]->getKey(),
                'document_type' => 'deed_establishment',
                'document_number' => 'AHU-0045192.AH.01.01.TAHUN 2015',
                'title' => 'Akta Pendirian No. 22 & SK Pengesahan Menkumham RI',
                'issued_at' => '2015-08-20',
                'expires_at' => null,
                'issuer' => 'Kemenkumham RI / Notaris Hendra Gunawan, S.H.',
                'notes' => 'Dokumen dasar pendirian industri farmasi nasional.',
            ],
            [
                'client_id' => $clients[5]->getKey(),
                'document_type' => 'kbli_license',
                'document_number' => 'DKL2104523910A1',
                'title' => 'Sertifikat Standar CPOB & Izin Edar Produk Farmasi BPOM RI',
                'issued_at' => '2021-10-01',
                'expires_at' => $this->referenceDate->addDays(45)->toDateString(),
                'issuer' => 'Badan Pengawas Obat dan Makanan (BPOM RI)',
                'notes' => 'Perlu perpanjangan lisensi edar CPOB dalam 45 hari ke depan.',
            ],
            [
                'client_id' => $clients[5]->getKey(),
                'document_type' => 'trademark_ip',
                'document_number' => 'IDM000892344',
                'title' => 'Sertifikat Pendaftaran Merek Dagang Cakrawala Medika Kelas 05',
                'issued_at' => '2020-02-14',
                'expires_at' => '2030-02-14',
                'issuer' => 'Direktorat Jenderal Kekayaan Intelektual (DJKI Kemenkumham)',
                'notes' => 'Perlindungan merek 10 tahun untuk sediaan farmasi dan herbal.',
            ],

            // Client 1 (PT Bumi Mineral Nusantara Tbk)
            [
                'client_id' => $clients[1]->getKey(),
                'document_type' => 'kbli_license',
                'document_number' => '540/ESDM/IUP-OP/2021',
                'title' => 'Izin Usaha Pertambangan (IUP) Operasi Produksi Komoditas Nikel',
                'issued_at' => '2021-03-01',
                'expires_at' => '2031-03-01',
                'issuer' => 'Kementerian Energi dan Sumber Daya Mineral (ESDM RI)',
                'notes' => 'IUP Operasi Produksi wilayah konsesi 4.500 Hektar.',
            ],

            // Client 6 (PT Graha Propertindo Utama)
            [
                'client_id' => $clients[6]->getKey(),
                'document_type' => 'kbli_license',
                'document_number' => '00412/HGB/BPN-KRW/2019',
                'title' => 'Sertifikat Hak Guna Bangunan (HGB) Induk Kawasan Industri Karawang',
                'issued_at' => '2019-11-10',
                'expires_at' => '2039-11-10',
                'issuer' => 'Kantor Pertanahan Kabupaten Karawang (ATR/BPN)',
                'notes' => 'HGB Induk Luas 1.500.000 m2 (150 Ha) atas nama perseroan.',
            ],
        ];

        return collect($records)->map(function (array $item): ClientComplianceDocument {
            $slug = Str::slug($item['title']);
            $filePath = 'seeded-workspace/compliance/'.$slug.'.pdf';

            // Generate mock compliance PDF in storage
            if (! Storage::disk('local')->exists($filePath)) {
                $dompdf = new Dompdf;
                $html = "<html><body style='font-family: Arial; padding: 40px; color: #0f172a;'>
                    <h2 style='text-transform: uppercase; border-bottom: 2px solid #0f172a;'>DOKUMEN LEGALITAS KEPATUHAN KORPORASI</h2>
                    <table style='width: 100%; margin-top: 20px; font-size: 13px; line-height: 1.8;'>
                        <tr><td style='width: 30%; font-weight: bold;'>Jenis Dokumen:</td><td>{$item['document_type']}</td></tr>
                        <tr><td style='font-weight: bold;'>Nomor Register:</td><td>{$item['document_number']}</td></tr>
                        <tr><td style='font-weight: bold;'>Judul:</td><td>{$item['title']}</td></tr>
                        <tr><td style='font-weight: bold;'>Instansi Penerbit:</td><td>{$item['issuer']}</td></tr>
                        <tr><td style='font-weight: bold;'>Tanggal Terbit:</td><td>{$item['issued_at']}</td></tr>
                        <tr><td style='font-weight: bold;'>Masa Berlaku:</td><td>".($item['expires_at'] ?? 'Berlaku Selama Perusahaan Beroperasi')."</td></tr>
                    </table>
                    <div style='margin-top: 40px; padding: 15px; background: #f8fafc; border: 1px solid #cbd5e1; font-size: 11px;'>
                        Tervalidasi oleh Departemen Kepatuhan & Tata Kelola Korporasi RPK Law Firm.
                    </div>
                </body></html>";
                $dompdf->loadHtml($html);
                $dompdf->setPaper('A4', 'portrait');
                $dompdf->render();
                Storage::disk('local')->put($filePath, $dompdf->output());
            }

            return ClientComplianceDocument::query()->create([
                'client_id' => $item['client_id'],
                'document_type' => $item['document_type'],
                'document_number' => $item['document_number'],
                'title' => $item['title'],
                'issued_at' => $item['issued_at'],
                'expires_at' => $item['expires_at'],
                'issuer' => $item['issuer'],
                'notes' => $item['notes'],
                'file_path' => $filePath,
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
            [['Ir. Aditya', 'Pranoto, M.T.', 'Chief Operating Officer & General Counsel'], ['Maya', 'Kusuma, S.H.', 'Corporate Secretary & Compliance Head']],
            [['Nabila', 'Ardiansyah, S.H., LL.M.', 'Head of Legal & Regulatory Affairs'], ['Kevin', 'Tanujaya, B.Com.', 'Chief Financial Officer']],
            [['Bram', 'Wicaksono, S.H.', 'Legal & Compliance Manager'], ['Felicia', 'Gunawan, S.E.', 'Finance Controller']],
            [['Drs. H. Ahmad', 'Suryana, M.M.', 'Direktur Kepatuhan & Manajemen Risiko'], ['Dina', 'Larasati, S.H.', 'Legal Counsel - Wholesale Banking']],
            [['Prof. Dr. Ratih', 'Nugroho, M.Ed.', 'Ketua Dewan Pembina Yayasan'], ['Yusuf', 'Ramadhan, S.H.', 'Sekretaris Eksekutif & Legal Officer']],
            [['Rizky', 'Mahendra, S.H.', 'Legal & Corporate Affairs Director'], ['Sinta', 'Permatasari, Apt.', 'Regulatory Affairs Director']],
            [['Nadya', 'Suryadinata, S.H.', 'Head of Land Acquisition & Legal'], ['Dion', 'Prasetyo, S.T.', 'Commercial Project Director']],
            [['Dr. H. Hendrawan', 'Soediro, Sp.OG', 'Principal'], ['Monica', 'Hartanto, S.H.', 'Family Office Representative']],
        ];

        $contacts = [];
        foreach ($clients as $clientIndex => $client) {
            foreach ($names[$clientIndex] as $contactIndex => $person) {
                $contacts[(string) $client->getKey()][] = Contact::query()->create([
                    'client_id' => $client->getKey(),
                    'first_name' => $person[0],
                    'last_name' => $person[1],
                    'job_title' => $person[2],
                    'organization_name' => $client->legal_name,
                    'email' => Str::slug($person[0].'.'.$person[1], '.').'@'.Str::after($client->email, '@'),
                    'phone' => $client->phone.' ext. '.(110 + $contactIndex),
                    'mobile' => sprintf('+62 812-90%02d-%04d', $clientIndex + 10, 2100 + ($clientIndex * 10) + $contactIndex),
                    'notes' => $contactIndex === 0 ? 'Pemberi kuasa dan penandatangan dokumen hukum utama.' : 'Koordinator operasional, berkas pembuktian, dan penagihan.',
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
            // 0. Long-term EPC Smelter Nikel & Halmahera Project (Future closing Q4 2026 / Q1 2027)
            [0, 2, 'Project Titan — Negosiasi Kontrak EPC Turnkey Smelter Nikel & Akuisisi Lahan 200 Ha', 'Transactional', 'active', 'critical', 'restricted', 3_850_000_000, 'Indonesia', 'Non-litigasi / Proyek Strategis Nasional', 'PRJ-TITAN-EPC-2026'],

            // 1. Litigasi PN Bandung: Sengketa Wanprestasi Perjanjian Distribusi Farmasi (Sidang Pembuktian Sept 2026)
            [5, 0, 'Gugatan Wanprestasi Perjanjian Distribusi Eksklusif Obat & Alkes Jawa Barat', 'Litigation', 'active', 'critical', 'confidential', 1_450_000_000, 'Indonesia', 'Pengadilan Negeri Bandung Klas 1A Khusus', '412/Pdt.G/2026/PN.Bdg'],

            // 2. Restrukturisasi Hutang & Permohonan PKPU PT Sentosa Logistik di Pengadilan Niaga Jakarta Pusat
            [2, 5, 'Permohonan PKPU & Restrukturisasi Kewajiban Pembayaran Hutang Rp 180 Miliar', 'Dispute & Bankruptcy', 'active', 'high', 'restricted', 2_200_000_000, 'Indonesia', 'Pengadilan Niaga pada PN Jakarta Pusat', '88/Pdt.Sus-PKPU/2026/PN.Niaga.Jkt.Pst'],

            // 3. Arbitrase BANI: Konstruksi PLTU 2x100MW (Sidang Ahli Oktober 2026, Putusan Februari 2027)
            [0, 0, 'Arbitrase BANI Konstruksi Pembangkit Listrik Tenaga Uap (PLTU 2x100MW)', 'Arbitration', 'active', 'critical', 'restricted', 4_500_000_000, 'Indonesia', 'Badan Arbitrase Nasional Indonesia (BANI)', 'BANI-ARB/2026/042'],

            // 4. Sindikasi Pembiayaan Syariah & Sukuk Ijarah Energi Terbarukan Rp 1,5 Triliun (Closing Des 2026)
            [3, 3, 'Sindikasi Fasilitas Pembiayaan Syariah & Penerbitan Sukuk Ijarah Pembangkit Solar PV', 'Banking & Finance', 'active', 'high', 'confidential', 2_950_000_000, 'Indonesia', 'Non-litigasi / Sindikasi OJK', 'BMS-SUKUK-2026'],

            // 5. Hubungan Industrial & PHK Massal Restrukturisasi di Pengadilan Hubungan Industrial (PHI) Bandung
            [4, 4, 'Penyelesaian Perselisihan PHK Efisiensi & Hak Pesangon pada Pengadilan Hubungan Industrial', 'Employment Advisory', 'on_hold', 'normal', 'confidential', 480_000_000, 'Indonesia', 'Pengadilan Hubungan Industrial (PHI) PN Bandung', '45/Pdt.Sus-PHI/2026/PN.Bdg'],

            // 6. Private Client Estate & Asset Protection Restructuring (Jangka Panjang 2027)
            [7, 1, 'Restrukturisasi Kepemilikan Saham Keluarga & Proteksi Aset Lintas Yurisdiksi', 'Private Wealth', 'active', 'high', 'restricted', 1_600_000_000, 'Indonesia dan Singapura', 'Non-litigasi / Private Client', 'HS-FAMILY-TRUST-2026'],

            // 7. Closed Landmark: Uji Tuntas Hukum & Akuisisi Lahan Kawasan Industri Karawang 150 Ha
            [6, 7, 'Legal Due Diligence (LDD) & Pengadaan Lahan Kawasan Industri Terpadu Karawang', 'Real Estate & M&A', 'closed', 'normal', 'standard', 1_950_000_000, 'Indonesia', 'Kementerian ATR/BPN & Pemprov Jabar', 'GPU-LDD-KRW-2025'],

            // 8. Retainer Corporate Advisory RPK Law Firm 2026 (Active Standing Retainer)
            [1, 1, 'Standing Corporate Retainer & General Legal Counsel 2026', 'Corporate Retainer', 'active', 'normal', 'standard', 850_000_000, 'Indonesia', 'Non-litigasi / General Retainer', 'BMN-RET-2026'],

            // 9. Series B Cross-Border Tech Financing & Shareholders Agreement
            [1, 1, 'Series B Cross-Border Tech Financing & Shareholders Agreement', 'Corporate Transaction', 'prospective', 'normal', 'confidential', 1_750_000_000, 'Indonesia dan Singapura', 'Non-litigasi / Cross-border', 'SDF-SERIESB-2026'],

            // 10. Audit Regulasi & Kepatuhan AMDAL Pembangkit EBT
            [0, 2, 'Audit Regulasi & Kepatuhan AMDAL Pembangkit Listrik Energi Terbarukan', 'Regulatory Advisory', 'archived', 'low', 'standard', 600_000_000, 'Indonesia', 'Kementerian ESDM & KLHK', 'BLE-ESG-2026'],

            // 11. Akuisisi Saham Minoritas Operator Cold Storage Logistik
            [2, 1, 'Akuisisi Saham Minoritas Operator Rantai Dingin & Pergudangan Logistik', 'M&A', 'active', 'normal', 'confidential', 1_250_000_000, 'Indonesia', 'Non-litigasi / Transaksi M&A', 'CPI-MA-2026'],
        ];

        $partners = [
            $this->actor('managing-partner'),
            $this->actor('partner'),
            $this->actor('partner-corporate'),
        ];

        $matters = collect($items)->map(function (array $item, int $index) use ($clients, $practiceAreas, $partners): Matter {
            $status = $item[4];
            $responsiblePartner = $partners[$index % count($partners)];
            $closedAt = in_array($status, ['closed', 'archived'], true) ? $this->referenceDate->subMonths(8)->toDateString() : null;

            $matter = Matter::query()->create([
                'matter_number' => sprintf('RPK-2026-%04d', $index + 1),
                'title' => $item[2],
                'client_id' => $clients[$item[0]]->getKey(),
                'summary' => 'Pendampingan komprehensif oleh tim RPK Law Firm mencakup formulasi strategi hukum, perancangan draf kontrak/gugatan, telaah bukti formil-materiil, advokasi persidangan, serta pelaporan berkala berstandar prima.',
                'budget_amount' => $item[7],
                'currency' => 'IDR',
                'practice_area_id' => $practiceAreas[$item[1]]->getKey(),
                'matter_type' => $item[3],
                'status' => $status,
                'priority' => $item[5],
                'confidentiality_level' => $item[6],
                'responsible_partner_id' => $responsiblePartner->getKey(),
                'supervising_lawyer_id' => $index % 2 === 0 ? $this->actor('partner')->getKey() : $this->actor('partner-corporate')->getKey(),
                'opened_at' => $this->referenceDate->subDays(240 - ($index * 15))->toDateString(),
                'closed_at' => $closedAt,
                'jurisdiction' => $item[8],
                'court' => $item[9],
                'external_case_number' => $item[10],
                'archived_at' => $status === 'archived' ? $this->referenceDate->subDays(10) : null,
                'archived_by' => $status === 'archived' ? $this->actor('managing-partner')->getKey() : null,
                'legal_hold_at' => in_array($index, [1, 3], true) ? $this->referenceDate->subDays(20) : null,
                'legal_hold_by' => in_array($index, [1, 3], true) ? $responsiblePartner->getKey() : null,
                'legal_hold_reason' => in_array($index, [1, 3], true) ? 'Preservasi seluruh berkas, korespondensi, dan bukti elektronik selama proses persidangan berjalan.' : null,
                'created_by' => $this->actor('administrator')->getKey(),
            ]);

            // Assign members
            $memberIds = collect([
                $this->actor('managing-partner')->getKey(),
                $this->actor('partner')->getKey(),
                $this->actor('partner-corporate')->getKey(),
                $this->actor('administrator')->getKey(),
            ])->unique();

            $matter->members()->sync($memberIds->mapWithKeys(fn (int $userId, int $mIdx): array => [
                $userId => [
                    'role' => ['lead_counsel', 'associate_counsel', 'litigation_advocate', 'legal_researcher'][$mIdx % 4],
                    'assigned_by' => $this->actor('managing-partner')->getKey(),
                    'created_at' => $this->referenceDate->subDays(150),
                ],
            ])->all());

            return $matter;
        })->all();

        // Establish Matter Hierarchies (Parent-Child relationships)
        // Matter 3 (Arbitrase BANI PLTU) is child dispute of Master EPC Project (Matter 0)
        if (isset($matters[0], $matters[3])) {
            $matters[3]->updateQuietly([
                'parent_matter_id' => $matters[0]->getKey(),
                'relationship_type' => 'dispute',
            ]);
        }

        // Matter 10 (Audit Regulasi & Kepatuhan AMDAL) is child compliance of Master EPC Project (Matter 0)
        if (isset($matters[0], $matters[10])) {
            $matters[10]->updateQuietly([
                'parent_matter_id' => $matters[0]->getKey(),
                'relationship_type' => 'regulatory_compliance',
            ]);
        }

        // Matter 5 (Hubungan Industrial PHI) is related employment dispute to Sengketa Farmasi (Matter 1)
        if (isset($matters[1], $matters[5])) {
            $matters[5]->updateQuietly([
                'parent_matter_id' => $matters[1]->getKey(),
                'relationship_type' => 'related_dispute',
            ]);
        }

        // Matter 11 (Akuisisi Saham Minoritas Cold Storage) is child M&A of Restrukturisasi Sentosa Logistik (Matter 2)
        if (isset($matters[2], $matters[11])) {
            $matters[11]->updateQuietly([
                'parent_matter_id' => $matters[2]->getKey(),
                'relationship_type' => 'corporate_action',
            ]);
        }

        return $matters;
    }

    /** @param array<int, Matter> $matters
     * @param  array<string, array<int, Contact>>  $contacts
     */
    private function seedMatterOperations(array $matters, array $contacts): void
    {
        foreach ($matters as $index => $matter) {
            $clientContacts = $contacts[(string) $matter->client_id];
            foreach ([
                [$clientContacts[0], 'client_representative', 'Pemberi kuasa khusus utama dan penandatangan surat kuasa bermaterai.'],
                [$clientContacts[1], 'client_contact', 'Koordinator data operasional, verifikasi bukti surat, dan rekonsiliasi finansial.'],
            ] as $party) {
                MatterParty::query()->create([
                    'matter_id' => $matter->getKey(),
                    'contact_id' => $party[0]->getKey(),
                    'party_type' => $party[1],
                    'name' => $party[0]->full_name,
                    'organization_name' => $party[0]->organization_name,
                    'notes' => $party[2],
                    'created_by' => $this->actor('partner')->getKey(),
                ]);
            }
            MatterParty::query()->create([
                'matter_id' => $matter->getKey(),
                'contact_id' => null,
                'party_type' => $index % 2 === 0 ? 'opposing_party' : 'counterparty',
                'name' => 'Kuasa Hukum Pihak Lawan '.($index + 1),
                'organization_name' => 'Konsorsium Lawan / Tergugat '.chr(65 + $index),
                'notes' => 'Pihak lawan/tergugat yang wajib masuk dalam conflict check dan audit independensi firma.',
                'created_by' => $this->actor('partner')->getKey(),
            ]);

            // Tasks
            $taskData = [
                ['Penyusunan Eksepsi & Jawaban Gugatan / Replik', 'Telaah dalil wanprestasi lawan, yurisprudensi Mahkamah Agung, dan perumusan petitum ganti rugi materiil & immateriil.', 'in_progress', 'critical', 12, $this->actor('partner'), $this->actor('managing-partner')],
                ['Verifikasi Alat Bukti Surat P-1 s/d P-15 di Kantor Pos', 'Pelekatan meterai Rp 10.000 dan cap pos resmi (Nazegelen) di Kantor Pos Besar Bandung.', 'completed', 'high', -3, $this->actor('administrator'), $this->actor('partner')],
                ['Finalisasi Draf Kontrak EPC & Review Risiko Klausul Ganti Rugi', 'Memastikan limitasi tanggung jawab (liability cap) tidak mencakup gross negligence dan pelanggaran lingkungan.', 'review', 'critical', 8, $this->actor('partner-corporate'), $this->actor('managing-partner')],
                ['Konfirmasi Kehadiran & Lembar Kesaksian Saksi Ahli Hukum Kontrak', 'Penyusunan pokok-pokok pemeriksaan (Direct Examination Guide) untuk Prof. Dr. Budi Gunawan.', 'in_progress', 'high', 16, $this->actor('partner'), $this->actor('managing-partner')],
                ['Penyusunan Executive Case Status Report untuk Direksi Klien', 'Pembuatan laporan perkembangan berkala ber-kop surat resmi Bandung dan ringkasan audit finansial.', 'todo', 'normal', 25, $this->actor('administrator'), $this->actor('managing-partner')],
            ];

            foreach ($taskData as $t) {
                Task::query()->create([
                    'matter_id' => $matter->getKey(),
                    'title' => $t[0],
                    'description' => $t[1],
                    'assignee_id' => $t[5]->getKey(),
                    'reporter_id' => $t[6]->getKey(),
                    'reviewer_id' => $this->actor('managing-partner')->getKey(),
                    'status' => $t[2],
                    'priority' => $t[3],
                    'due_at' => $this->referenceDate->addDays($t[4] + ($index * 3))->setTime(17, 0),
                    'completed_at' => $t[2] === 'completed' ? $this->referenceDate->subDays(3) : null,
                ]);
            }

            // Deadlines
            foreach ([
                ['Sidang Pembuktian Pertama & Legalisir Surat', 'filing', 18 + ($index * 4), true],
                ['Batas Waktu Pengajuan Saksi Ahli & Saksi Fakta', 'court', 32 + ($index * 5), false],
                ['Closing & Penandatanganan Akta Notariil', 'client', 60 + ($index * 8), true],
            ] as $d) {
                $deadline = Deadline::query()->create([
                    'matter_id' => $matter->getKey(),
                    'title' => $d[0],
                    'description' => 'Tenggat waktu material perkara dengan notifikasi otomatis ke Managing Partner & Tim Sidang.',
                    'deadline_type' => $d[1],
                    'due_at' => $this->referenceDate->addDays($d[2])->setTime(10, 0),
                    'is_critical' => $d[3],
                    'reminder_metadata' => ['hours_before' => [168, 72, 24], 'escalate_to_partner' => true, 'channel' => ['database', 'mail']],
                    'owner_id' => $this->actor('partner')->getKey(),
                    'status' => 'open',
                    'created_by' => $this->actor('partner')->getKey(),
                ]);
                DeadlineReminderDelivery::query()->create([
                    'deadline_id' => $deadline->getKey(),
                    'user_id' => $this->actor('partner')->getKey(),
                    'hours_before' => 168,
                ]);
            }

            // Court Hearing Events & Checklists
            $isLitigation = in_array($index, [1, 2, 3, 5], true);
            $eventTitles = $isLitigation ? [
                ['court_hearing', 'Sidang Pembuktian Surat & Saksi Fakta', 'Pemeriksaan alat bukti P-1 s/d P-10 dan cross-examination saksi fakta dari Tergugat.', 14 + ($index * 2), 9, 'Ruang Sidang Utama Tirta — PN Bandung Klas 1A Khusus', 'partner'],
                ['partner_review', 'Rapat Taktik Pra-Sidang (Pre-Hearing Strategy Session)', 'Simulasi pertanyaan silang dan finalisasi tanggapan atas bukti lawan.', 10 + ($index * 2), 14, 'RPK Law Firm — Ruang Rapat Parahyangan', 'managing-partner'],
            ] : [
                ['client_meeting', 'Rapat Negosiasi Draf Kontrak EPC & Closing Milestone', 'Finalisasi klausul komersial bersama Direksi Klien dan Konsorsium Kontraktor.', 12 + ($index * 3), 10, 'Microsoft Teams — RPK Virtual Deal Room 01', 'partner-corporate'],
                ['partner_review', 'Executive Risk Assessment & Quality Control', 'Pemeriksaan akhir dokumen legal sebelum diterbitkan ke pihak regulator.', 20 + ($index * 4), 15, 'RPK Law Firm — Ruang Rapat Garuda', 'managing-partner'],
            ];

            foreach ($eventTitles as $event) {
                $checklist = $isLitigation ? [
                    ['item' => 'Surat Kuasa Khusus Asli bermaterai Rp 10.000', 'completed' => true],
                    ['item' => 'KTA Advokat & Berita Acara Sumpah (BAS) Pengadilan Tinggi', 'completed' => true],
                    ['item' => 'Bundel Bukti Surat P-1 s/d P-10 ber-meterai & Nazegelen Kantor Pos', 'completed' => true],
                    ['item' => 'Daftar Saksi Fakta & Identitas Lengkap (KTP)', 'completed' => true],
                    ['item' => 'Draf Lembar Pertanyaan Silang (Cross-Examination Points)', 'completed' => false],
                ] : [
                    ['item' => 'Draf Kontrak Terakhir (Clean Copy & Redline Comparison)', 'completed' => true],
                    ['item' => 'Summary Matrix Risiko Hukum & Klausul Eskalasi', 'completed' => true],
                    ['item' => 'Legal Opinion & Surat Persetujuan Partner', 'completed' => false],
                ];

                MatterEvent::query()->create([
                    'matter_id' => $matter->getKey(),
                    'event_type' => $event[0],
                    'title' => $event[1],
                    'description' => $event[2],
                    'starts_at' => $this->referenceDate->addDays($event[3])->setTime($event[4], 0),
                    'ends_at' => $this->referenceDate->addDays($event[3])->setTime($event[4] + 2, 0),
                    'location' => $event[5],
                    'checklist' => $checklist,
                    'owner_id' => $this->actor($event[6])->getKey(),
                    'created_by' => $this->actor('administrator')->getKey(),
                ]);
            }

            // Notes
            Note::query()->create([
                'matter_id' => $matter->getKey(),
                'client_id' => $matter->client_id,
                'classification' => 'privileged',
                'title' => 'Catatan Rahasia Strategi & Analisis Kekuatan Dalil',
                'body' => 'Analisis internal membuktikan bahwa klausul forum sengketa telah mengikat para pihak. Dokumen pembuktian pembayaran telah tervalidasi mutasi bank resmi.',
                'private_to_id' => $this->actor('managing-partner')->getKey(),
                'created_by' => $this->actor('partner')->getKey(),
            ]);
        }
    }

    /** @param array<int, Matter> $matters */
    private function seedMatterChronologies(array $matters): void
    {
        // 1. Litigasi PN Bandung (Perkara No. 412/Pdt.G/2026/PN.Bdg)
        $litigationMatter = $matters[1] ?? $matters[0];
        $events1 = [
            [
                'event_date' => '2024-05-12',
                'title' => 'Penandatanganan Perjanjian Distribusi Eksklusif Produk Farmasi',
                'description' => 'Klien (Penggugat) dan Tergugat menandatangani Perjanjian Distribusi Wilayah Jawa Barat & Banten No. 018/DIR-CPF/V/2024 dengan komitmen target minimal Rp 15 Miliar.',
                'evidence_reference' => 'Bukti P-1 (Perjanjian Distribusi No. 018/DIR-CPF/V/2024)',
                'witness_name' => 'Rizky Mahendra, S.H. (Legal Director)',
                'importance_level' => 'critical',
            ],
            [
                'event_date' => '2025-08-10',
                'title' => 'Tergugat Wanprestasi Pembayaran 4 Invoice Termin IV & Pelanggaran Kuota',
                'description' => 'Tergugat menolak melunasi 4 invoice jatuh tempo senilai Rp 3,85 Miliar dan terbukti memasok produk kompetitor ke apotek rekanan secara melawan hukum.',
                'evidence_reference' => 'Bukti P-2 s/d P-5 (Invoice Resmi, Surat Jalan & Berita Acara Rekonsiliasi)',
                'witness_name' => 'Sinta Permatasari, Apt.',
                'importance_level' => 'high',
            ],
            [
                'event_date' => '2025-11-04',
                'title' => 'Penyampaian Surat Peringatan Pertama (Somasi I)',
                'description' => 'RPK Law Firm atas nama Klien melayangkan Somasi I meminta pemenuhan kewajiban dan pembayaran denda keterlambatan dalam 14 hari kalender.',
                'evidence_reference' => 'Bukti P-6 (Surat Somasi I No. 112/RPK-EXT/XI/2025 & Resi Pos)',
                'witness_name' => null,
                'importance_level' => 'normal',
            ],
            [
                'event_date' => '2025-12-02',
                'title' => 'Penyampaian Surat Peringatan Keras Terakhir (Somasi II)',
                'description' => 'Somasi II dan undangan musyawarah disampaikan. Tergugat hadir namun menyatakan menolak klausul ganti rugi bunga moratoir.',
                'evidence_reference' => 'Bukti P-7 (Surat Somasi II & Notulen Rapat Klarifikasi)',
                'witness_name' => 'M. Anggara Putra, S.H., M.H.',
                'importance_level' => 'high',
            ],
            [
                'event_date' => '2026-03-10',
                'title' => 'Pendaftaran Gugatan Wanprestasi e-Court di Pengadilan Negeri Bandung',
                'description' => 'Gugatan resmi terdaftar di PN Bandung Klas 1A Khusus dengan register No. 412/Pdt.G/2026/PN.Bdg disertai permohonan Sita Jaminan (CB) atas aset gudang Tergugat.',
                'evidence_reference' => 'Bukti P-8 (Akta Pendaftaran Gugatan e-Court Mahkamah Agung)',
                'witness_name' => null,
                'importance_level' => 'critical',
            ],
            [
                'event_date' => '2026-05-18',
                'title' => 'Kegagalan Sidang Mediasi Pengadilan',
                'description' => 'Hakim Mediator menerbitkan laporan mediasi tidak berhasil (deadlock) karena tawaran perdamaian Tergugat tidak memenuhi rasa keadilan Klien.',
                'evidence_reference' => 'Bukti P-9 (Laporan Hakim Mediator No. 412/Med/2026/PN.Bdg)',
                'witness_name' => null,
                'importance_level' => 'normal',
            ],
            [
                'event_date' => '2026-07-22',
                'title' => 'Penyampaian Replik Penggugat Mematahkan Eksepsi Tergugat',
                'description' => 'Replik diajukan mematahkan seluruh eksepsi kompetensi relatif dan obscuur libel Tergugat berlandaskan yurisprudensi Mahkamah Agung No. 1045 K/Pdt/2021.',
                'evidence_reference' => 'Bukti P-10 (Naskah Replik Kuasa Hukum Penggugat)',
                'witness_name' => 'M. Anggara Putra, S.H., M.H.',
                'importance_level' => 'high',
            ],
        ];

        foreach ($events1 as $e) {
            MatterChronology::query()->create([
                'matter_id' => $litigationMatter->getKey(),
                'event_date' => $e['event_date'],
                'title' => $e['title'],
                'description' => $e['description'],
                'evidence_reference' => $e['evidence_reference'],
                'witness_name' => $e['witness_name'],
                'importance_level' => $e['importance_level'],
                'created_by' => $this->actor('managing-partner')->getKey(),
            ]);
        }

        // 2. Arbitrase BANI Konstruksi PLTU (Matter 3)
        $arbitrationMatter = $matters[3] ?? $matters[0];
        $events2 = [
            [
                'event_date' => '2023-06-20',
                'title' => 'Penandatanganan Kontrak EPC Turnkey Turbin PLTU 2x100MW',
                'description' => 'Klien menandatangani Kontrak EPC senilai USD 42.500.000 dengan klausul penyelesaian sengketa final melalui Arbitrase BANI Jakarta.',
                'evidence_reference' => 'Bukti C-1 (EPC Turnkey Agreement No. EPC-042/PLTU/2023)',
                'witness_name' => 'Ir. Aditya Pranoto, M.T.',
                'importance_level' => 'critical',
            ],
            [
                'event_date' => '2025-04-10',
                'title' => 'Keterlambatan Progres Konstruksi (Delay COD 210 Hari)',
                'description' => 'Kontraktor gagal menyelesaikan uji komisioning generator utama sesuai jadwal akibat kesalahan spesifikasi teknis komponen turbin uap.',
                'evidence_reference' => 'Bukti C-2 s/d C-5 (Independent Engineer Audit Report & Notice of Delay)',
                'witness_name' => 'Ir. Bambang Trihatmojo, IPU (Technical Expert)',
                'importance_level' => 'critical',
            ],
            [
                'event_date' => '2025-10-15',
                'title' => 'Penerbitan Klaim Liquidated Damages Senilai USD 4.250.000',
                'description' => 'Klien menerbitkan tagihan denda keterlambatan resmi. Kontraktor menolak dengan dalil force majeure cuaca yang tidak terbukti berdasarkan data BMKG.',
                'evidence_reference' => 'Bukti C-6 (Tagihan LD & Laporan Klimatologi BMKG)',
                'witness_name' => 'Maya Kusuma, S.H.',
                'importance_level' => 'high',
            ],
            [
                'event_date' => '2026-04-15',
                'title' => 'Pendaftaran Permohonan Arbitrase di BANI Sovereign Plaza Jakarta',
                'description' => 'Pendaftaran sengketa resmi dengan Register Perkara No. ARB/2026/042 di hadapan Majelis Arbitrase Majemuk (3 Arbiter).',
                'evidence_reference' => 'Bukti C-7 (Notice of Arbitration & Akta Register BANI)',
                'witness_name' => null,
                'importance_level' => 'critical',
            ],
        ];

        foreach ($events2 as $e) {
            MatterChronology::query()->create([
                'matter_id' => $arbitrationMatter->getKey(),
                'event_date' => $e['event_date'],
                'title' => $e['title'],
                'description' => $e['description'],
                'evidence_reference' => $e['evidence_reference'],
                'witness_name' => $e['witness_name'],
                'importance_level' => $e['importance_level'],
                'created_by' => $this->actor('partner')->getKey(),
            ]);
        }
    }

    /**
     * @param  array<int, Matter>  $matters
     * @return array<int, MatterEvidence>
     */
    private function seedMatterEvidences(array $matters): array
    {
        $records = [
            // Litigasi Sengketa Farmasi PN Bandung (Matter 1)
            [
                'matter_id' => $matters[1]->getKey(),
                'evidence_code' => 'Bukti P-1',
                'title' => 'Asli Perjanjian Distribusi Eksklusif Obat & Alkes Wilayah Jawa Barat No. 018/DIR-CPF/V/2024',
                'description' => 'Akta otentik perjanjian distribusi yang memuat klausul kewajiban pasokan minimum, termin pembayaran 30 hari, dan klausul ganti rugi bunga 2% per bulan.',
                'originality' => 'original',
                'vault_location' => 'Brankas Litigasi Lt.2 / Bantex P-01',
                'status' => 'in_vault',
                'custodian_name' => 'M. Anggara Putra, S.H., M.H.',
                'custody_notes' => 'Dokumen asli ber-meterai Rp 10.000 tersimpan aman dalam amplop anti-lembab di brankas utama.',
            ],
            [
                'matter_id' => $matters[1]->getKey(),
                'evidence_code' => 'Bukti P-2',
                'title' => 'Asli 4 Lembar Invoice Tagihan Jatuh Tempo & Tanda Terima Ekspedisi Resmi',
                'description' => 'Invoice No. INV/CPF/2025/08-001 s/d INV/CPF/2025/08-004 dengan total nilai terutang Rp 3.850.000.000 yang telah diterima dan ditandatangani oleh staf Tergugat.',
                'originality' => 'original',
                'vault_location' => 'Brankas Litigasi Lt.2 / Bantex P-01',
                'status' => 'in_vault',
                'custodian_name' => 'M. Anggara Putra, S.H., M.H.',
                'custody_notes' => 'Disertai bukti tanda terima resi ekspedisi JNE Cargo dan tanda tangan basah penerima gudang Tergugat.',
            ],
            [
                'matter_id' => $matters[1]->getKey(),
                'evidence_code' => 'Bukti P-3',
                'title' => 'Salinan Legalisir Rekening Koran Mutasi Bank Mandiri Periode Mei - Desember 2025',
                'description' => 'Rekening koran No. Rek 131-00-982173-1 atas nama Penggugat yang membuktikan tidak adanya pembayaran termin IV dari Tergugat.',
                'originality' => 'legalized_copy',
                'vault_location' => 'Brankas Litigasi Lt.2 / Bantex P-02',
                'status' => 'submitted_to_court',
                'custodian_name' => 'M. Anggara Putra, S.H., M.H.',
                'custody_notes' => 'Telah dilegalisir basah oleh Branch Manager Bank Mandiri KC Bandung Surapati dan diserahkan ke Panitera Pengganti pada sidang 18 Agustus 2026.',
            ],
            [
                'matter_id' => $matters[1]->getKey(),
                'evidence_code' => 'Bukti P-4',
                'title' => 'Salinan Surat Peringatan / Somasi I & Somasi II beserta Tanda Terima Kurir Pos',
                'description' => 'Surat Somasi I No. 042/SP-RPK/VIII/2025 dan Somasi II No. 058/SP-RPK/IX/2025 yang diterbitkan RPK Law Firm kepada Tergugat.',
                'originality' => 'original',
                'vault_location' => 'Brankas Litigasi Lt.2 / Bantex P-02',
                'status' => 'in_vault',
                'custodian_name' => 'M. Anggara Putra, S.H., M.H.',
                'custody_notes' => 'Lengkap dengan tanda terima Pos Kilat Khusus dan tracking konfirmasi penerimaan oleh Direktur Tergugat.',
            ],
            [
                'matter_id' => $matters[1]->getKey(),
                'evidence_code' => 'Bukti P-5',
                'title' => 'Digital Log Transaksi Audit Sistem ERP SAP & Korespondensi WhatsApp Bisnis',
                'description' => 'Ekstraksi log pesanan purchase order elektronik dan tangkapan layar komunikasi konfirmasi pesanan obat dari manager purchasing Tergugat.',
                'originality' => 'digital',
                'vault_location' => 'Cloud Secure Vault (SHA-256 Checksum)',
                'status' => 'in_vault',
                'custodian_name' => 'Muhamad Fajar Roni, S.H.',
                'custody_notes' => 'Metadata file terenkripsi dan diverifikasi integritas hash digitalnya sesuai standar UU ITE.',
            ],
            [
                'matter_id' => $matters[1]->getKey(),
                'evidence_code' => 'Bukti T-1',
                'title' => 'Salinan Surat Jawaban Tergugat & Eksepsi Kompetensi Relatif',
                'description' => 'Memori jawaban Tergugat yang diajukan dalam persidangan tanggal 4 Agustus 2026 yang mendalilkan sengketa harus diselesaikan lewat BANI.',
                'originality' => 'photocopy',
                'vault_location' => 'Brankas Litigasi Lemari B-03 / Bantex Lawan',
                'status' => 'borrowed_for_hearing',
                'custodian_name' => 'M. Anggara Putra, S.H., M.H.',
                'custody_notes' => 'Dipinjam untuk penyusunan Replik dan simulasi persidangan pembuktian.',
            ],

            // Arbitrase BANI EPC Smelter (Matter 3)
            [
                'matter_id' => $matters[3]->getKey(),
                'evidence_code' => 'Bukti C-1',
                'title' => 'Asli FIDIC EPC Turnkey Silver Book Contract Agreement 2023 No. NEP-EPC-001',
                'description' => 'Dokumen kontrak EPC turnkey 4 jilid tebal mencakup Technical Specifications, Employer Requirements, Payment Milestones, dan Liquidated Damages.',
                'originality' => 'original',
                'vault_location' => 'Brankas Khusus Korporasi Lt.3 / Bantex ARB-01',
                'status' => 'in_vault',
                'custodian_name' => 'Muhamad Fajar Roni, S.H.',
                'custody_notes' => 'Asli ditandatangani di hadapan Notaris dan disaksikan oleh konsultan pengawas internasional.',
            ],
            [
                'matter_id' => $matters[3]->getKey(),
                'evidence_code' => 'Bukti C-2',
                'title' => 'Laporan Audit Forensik Keterlambatan Proyek EPC oleh Independent Engineer (PT Surveyor Indonesia)',
                'description' => 'Laporan teknis 180 halaman yang membuktikan keterlambatan COD pembangkit 184 hari murni kelalaian Kontraktor EPC tanpa adanya Force Majeure.',
                'originality' => 'legalized_copy',
                'vault_location' => 'Brankas Khusus Korporasi Lt.3 / Bantex ARB-02',
                'status' => 'in_vault',
                'custodian_name' => 'Muhamad Fajar Roni, S.H.',
                'custody_notes' => 'Disiapkan sebagai alat bukti kunci untuk pemeriksaan Saksi Ahli Konstruksi di hadapan Majelis Arbiter BANI.',
            ],

            // Restrukturisasi PKPU Sentosa Logistik (Matter 2)
            [
                'matter_id' => $matters[2]->getKey(),
                'evidence_code' => 'Bukti PKPU-01',
                'title' => 'Asli Perjanjian Fasilitas Kredit Sindikasi Perbankan & Sertifikat Hak Tanggungan',
                'description' => 'Akta perjanjian kredit sindikasi senilai Rp 120 Miliar beserta bukti pendaftaran APHT pada Kantor Pertanahan.',
                'originality' => 'original',
                'vault_location' => 'Brankas Litigasi Lemari PKPU-01',
                'status' => 'in_vault',
                'custodian_name' => 'M. Anggara Putra, S.H., M.H.',
                'custody_notes' => 'Disimpan dalam safe deposit box khusus perkara restrukturisasi perbankan.',
            ],
            [
                'matter_id' => $matters[2]->getKey(),
                'evidence_code' => 'Bukti PKPU-02',
                'title' => 'Daftar Piutang Tetap & Rekapitulasi Tagihan Kreditor Konkuren dan Separatis',
                'description' => 'Berita acara verifikasi pencocokan piutang yang disahkan oleh Tim Pengurus PKPU dan Hakim Pengawas Pengadilan Niaga.',
                'originality' => 'legalized_copy',
                'vault_location' => 'Brankas Litigasi Lemari PKPU-01',
                'status' => 'submitted_to_court',
                'custodian_name' => 'M. Anggara Putra, S.H., M.H.',
                'custody_notes' => 'Telah diserahkan pada Rapat Kreditor Verifikasi Piutang di Pengadilan Niaga Jakarta Pusat.',
            ],
        ];

        return collect($records)->map(function (array $item): MatterEvidence {
            return MatterEvidence::query()->create([
                'matter_id' => $item['matter_id'],
                'evidence_code' => $item['evidence_code'],
                'title' => $item['title'],
                'description' => $item['description'],
                'originality' => $item['originality'],
                'vault_location' => $item['vault_location'],
                'status' => $item['status'],
                'custodian_name' => $item['custodian_name'],
                'custody_notes' => $item['custody_notes'],
                'created_by' => $this->actor('partner')->getKey(),
            ]);
        })->all();
    }

    /** @param array<int, Matter> $matters
     * @return array<string, array<int, Document>>
     */
    private function seedDocuments(array $matters): array
    {
        $documents = [];
        foreach ($matters as $matter) {
            $documents[(string) $matter->getKey()][] = $this->createTextDocument(
                $matter,
                'Legal Memorandum & Analisis Risiko — '.$matter->title,
                'legal_memorandum',
                'approved',
                $matter->confidentiality_level,
                "RPK LAW FIRM — LEGAL MEMORANDUM\n\nNomor Perkara: {$matter->matter_number}\nKlien: {$matter->client->legal_name}\nManaging Partner: Muhamad Fajar Roni, S.H.\n\nI. RINGKASAN EKSEKUTIF\nTelah dilakukan penelaahan yuridis mendalam mengenai posisi hukum Klien, validitas klausul kontrak, pembagian tanggung jawab wanprestasi, serta strategi mitigasi risiko litigasi dan komersial.\n\nII. LANDASAN HUKUM & YURISPRUDENSI\n1. Pasal 1243 dan Pasal 1338 Kitab Undang-Undang Hukum Perdata (KUHPerdata);\n2. Yurisprudensi Mahkamah Agung RI No. 1045 K/Pdt/2021 mengenai keabsahan pembuktian elektronik dan ganti rugi bunga moratoir;\n3. Peraturan Otoritas Jasa Keuangan / Kementerian ESDM terkait kepatuhan izin usaha dan tata kelola korporasi.\n\nIII. KESIMPULAN & REKOMENDASI TAKTIS\nPosisi hukum Klien sangat solid didukung alat bukti surat bernilai pembuktian sempurna.",
                3
            );

            $documents[(string) $matter->getKey()][] = $this->createTextDocument(
                $matter,
                'Draf Surat Kuasa Khusus & Dokumen Beracara Sidang',
                'court_filing',
                'approved',
                $matter->confidentiality_level,
                "SURAT KUASA KHUSUS\n\nYang bertanda tangan di bawah ini:\nNama: {$matter->client->legal_name}\nDalam hal ini memberikan kuasa penuh kepada:\n1. Muhamad Fajar Roni, S.H.\n2. M. Anggara Putra, S.H., M.H.\n3. Reza Evaldo Kusumah, S.H.\nAdvokat & Konsultan Hukum pada RPK LAW FIRM, beralamat kantor di Bandung & Jakarta.\n\nKHUSUS:\nUntuk dan atas nama Pemberi Kuasa mewakili, mendampingi, dan membela hak-hak hukum dalam perkara No. {$matter->external_case_number} di hadapan {$matter->court}.",
                2
            );

            $documents[(string) $matter->getKey()][] = $this->createPdfDocument(
                $matter,
                'Executive Summary & Opini Hukum Resmi (PDF Ber-meterai Digital)',
                'legal_opinion',
                'approved',
                $matter->confidentiality_level
            );

            $documents[(string) $matter->getKey()][] = $this->createDocxDocument(
                $matter,
                'Naskah Kontrak Komersial & Master Service Agreement (Word Draf)',
                'contract',
                'in_review',
                $matter->confidentiality_level
            );
        }

        return $documents;
    }

    private function createTextDocument(Matter $matter, string $title, string $category, string $status, string $confidentiality, string $content, int $versionCount): Document
    {
        $document = Document::query()->create([
            'matter_id' => $matter->getKey(),
            'client_id' => $matter->client_id,
            'title' => $title,
            'document_type' => $category,
            'status' => $status,
            'confidentiality_level' => $confidentiality,
            'created_by' => $this->actor('associate')->getKey(),
        ]);

        for ($v = 1; $v <= $versionCount; $v++) {
            $path = 'seeded-workspace/documents/'.$document->getKey()."/v{$v}.txt";
            $body = "{$content}\n\n[Catatan Revisi Versi {$v}: Telah diselaraskan dengan arahan Managing Partner per tanggal ".now()->subDays(10 - ($v * 2))->format('d F Y').']';
            Storage::disk('local')->put($path, $body);

            $version = DocumentVersion::query()->create([
                'document_id' => $document->getKey(),
                'version_number' => $v,
                'original_filename' => Str::slug($title)."-v{$v}.txt",
                'storage_disk' => 'local',
                'storage_path' => $path,
                'mime_type' => 'text/plain',
                'file_size' => strlen($body),
                'checksum' => hash('sha256', $body),
                'uploaded_by' => $this->actor('associate')->getKey(),
                'notes' => $v === 1 ? 'Draf awal disusun oleh Associate' : "Penyempurnaan klausul & integrasi bukti versi {$v}",
                'scan_status' => 'clean',
                'scan_message' => 'Lolos verifikasi keamanan sistem dan bebas ancaman.',
                'scanned_at' => now(),
                'extraction_status' => 'completed',
                'extracted_text' => $body,
                'extraction_metadata' => ['char_count' => strlen($body), 'paragraphs' => 6],
                'extracted_at' => now(),
            ]);

            if ($v === $versionCount) {
                $document->update(['current_version_id' => $version->getKey()]);
            }
        }

        return $document;
    }

    private function createPdfDocument(Matter $matter, string $title, string $category, string $status, string $confidentiality): Document
    {
        $document = Document::query()->create([
            'matter_id' => $matter->getKey(),
            'client_id' => $matter->client_id,
            'title' => $title,
            'document_type' => $category,
            'status' => $status,
            'confidentiality_level' => $confidentiality,
            'created_by' => $this->actor('managing-partner')->getKey(),
        ]);

        $html = "
            <html>
            <head>
                <style>
                    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1e293b; padding: 30px; font-size: 13px; line-height: 1.6; }
                    .header { border-bottom: 2px solid #0f172a; padding-bottom: 15px; margin-bottom: 25px; }
                    .logo { font-size: 20px; font-weight: bold; color: #0f172a; letter-spacing: 1px; }
                    .tagline { font-size: 10px; color: #64748b; text-transform: uppercase; margin-top: 4px; }
                    .title { font-size: 16px; font-weight: bold; color: #0f172a; margin-bottom: 15px; text-transform: uppercase; }
                    .meta { background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; border-radius: 6px; margin-bottom: 20px; }
                    .meta td { padding: 4px 8px; font-size: 11px; }
                    .section-title { font-weight: bold; color: #0f172a; margin-top: 20px; margin-bottom: 8px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; }
                    .footer { margin-top: 40px; border-top: 1px solid #cbd5e1; padding-top: 15px; font-size: 10px; color: #94a3b8; text-align: center; }
                </style>
            </head>
            <body>
                <div class='header'>
                    <div class='logo'>RPK LAW FIRM</div>
                    <div class='tagline'>Advocates & Legal Consultants • Bandung & Jakarta</div>
                </div>
                <div class='title'>{$title}</div>
                <div class='meta'>
                    <table width='100%'>
                        <tr><td><strong>Perkara:</strong> {$matter->title}</td><td><strong>Nomor:</strong> {$matter->matter_number}</td></tr>
                        <tr><td><strong>Klien:</strong> {$matter->client->legal_name}</td><td><strong>Partner:</strong> Muhamad Fajar Roni, S.H.</td></tr>
                    </table>
                </div>
                <div class='section-title'>I. ANALISIS HUKUM MATERIIL</div>
                <p>Berdasarkan kajian yuridis normatif dan dokumen pembuktian formil yang telah diserahkan, tim kuasa hukum menyimpulkan bahwa hak-hak hukum Klien memiliki perlindungan penuh di bawah peraturan perundang-undangan Republik Indonesia.</p>
                <div class='section-title'>II. KESIMPULAN & TATA LANGKAH ADVOKASI</div>
                <p>Direkomendasikan untuk segera mengajukan gugatan perdata melalui e-Court serta mencatatkan permohonan sita jaminan (conservatoir beslag) guna menjamin terpenuhinya ganti rugi materiil dan immateriil.</p>
                <div class='footer'>
                    Dokumen ini adalah produk hukum resmi dan rahasia milik RPK Law Firm. Dilarang menggandakan tanpa izin tertulis.
                </div>
            </body>
            </html>
        ";

        $dompdf = new Dompdf;
        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();
        $pdfOutput = $dompdf->output();

        $path = 'seeded-workspace/documents/'.$document->getKey().'/legal-opinion.pdf';
        Storage::disk('local')->put($path, $pdfOutput);

        $version = DocumentVersion::query()->create([
            'document_id' => $document->getKey(),
            'version_number' => 1,
            'original_filename' => Str::slug($title).'.pdf',
            'storage_disk' => 'local',
            'storage_path' => $path,
            'mime_type' => 'application/pdf',
            'file_size' => strlen($pdfOutput),
            'checksum' => hash('sha256', $pdfOutput),
            'uploaded_by' => $this->actor('managing-partner')->getKey(),
            'notes' => 'Penerbitan naskah resmi legal opinion ber-kop surat RPK Law Firm',
            'scan_status' => 'clean',
            'scan_message' => 'Lolos verifikasi keamanan sistem.',
            'scanned_at' => now(),
            'extraction_status' => 'completed',
            'extracted_text' => 'RPK LAW FIRM — LEGAL OPINION. Perkara: '.$matter->title,
            'extraction_metadata' => ['pages' => 2, 'language' => 'id'],
            'extracted_at' => now(),
        ]);

        $document->update(['current_version_id' => $version->getKey()]);

        return $document;
    }

    private function createDocxDocument(Matter $matter, string $title, string $category, string $status, string $confidentiality): Document
    {
        $document = Document::query()->create([
            'matter_id' => $matter->getKey(),
            'client_id' => $matter->client_id,
            'title' => $title,
            'document_type' => $category,
            'status' => $status,
            'confidentiality_level' => $confidentiality,
            'created_by' => $this->actor('partner-corporate')->getKey(),
        ]);

        $phpWord = new PhpWord;
        $section = $phpWord->addSection();
        $section->addTitle('RPK LAW FIRM — DRAF KONTRAK BISNIS', 1);
        $section->addText('Nomor Perkara: '.$matter->matter_number);
        $section->addText('Klien: '.$matter->client->legal_name);
        $section->addTextBreak(1);
        $section->addText('PASAL 1 — RUANG LINGKUP & OBJEK PERJANJIAN');
        $section->addText('Para pihak sepakat untuk mengikatkan diri dalam kerjasama strategis dengan standar kepatuhan hukum tertinggi di wilayah hukum Republik Indonesia.');

        $tempPath = tempnam(sys_get_temp_dir(), 'rpk-docx-');
        if ($tempPath === false) {
            throw new RuntimeException('Tidak dapat membuat file sementara untuk DOCX.');
        }

        $writer = IOFactory::createWriter($phpWord, 'Word2007');
        $writer->save($tempPath);
        $docxContent = file_get_contents($tempPath);
        unlink($tempPath);

        if ($docxContent === false) {
            throw new RuntimeException('Gagal membaca hasil pembuatan dokumen DOCX.');
        }

        $path = 'seeded-workspace/documents/'.$document->getKey().'/contract.docx';
        Storage::disk('local')->put($path, $docxContent);

        $version = DocumentVersion::query()->create([
            'document_id' => $document->getKey(),
            'version_number' => 1,
            'original_filename' => Str::slug($title).'.docx',
            'storage_disk' => 'local',
            'storage_path' => $path,
            'mime_type' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'file_size' => strlen($docxContent),
            'checksum' => hash('sha256', $docxContent),
            'uploaded_by' => $this->actor('partner-corporate')->getKey(),
            'notes' => 'Draf kontrak bisnis awal format Word untuk telaah bersama klien',
            'scan_status' => 'clean',
            'scan_message' => 'Lolos verifikasi keamanan sistem.',
            'scanned_at' => now(),
            'extraction_status' => 'completed',
            'extracted_text' => 'RPK LAW FIRM — DRAF KONTRAK BISNIS',
            'extraction_metadata' => ['paragraphs' => 5],
            'extracted_at' => now(),
        ]);

        $document->update(['current_version_id' => $version->getKey()]);

        return $document;
    }

    /** @return array<int, DocumentTemplate> */
    private function seedTemplates(): array
    {
        $templatesData = [
            [
                'name' => 'Surat Kuasa Khusus Litigasi (Standar Pengadilan Negeri)',
                'code' => 'SKK-LIT-01',
                'document_type' => 'court_filing',
                'description' => 'Format baku surat kuasa khusus advokat RPK Law Firm untuk persidangan perdata dan niaga.',
                'content_body' => "SURAT KUASA KHUSUS\nNomor: [[NOMOR_SURAT]]\n\nYang bertanda tangan di bawah ini:\nNama: [[NAMA_PEMBERI_KUASA]]\nJabatan: [[JABATAN]]\nPerusahaan: [[NAMA_KLIEN]]\nAlamat: [[ALAMAT_KLIEN]]\n\nMemberikan Kuasa Khusus Kepada Advokat RPK Law Firm...",
                'placeholders' => ['NOMOR_SURAT', 'NAMA_PEMBERI_KUASA', 'JABATAN', 'NAMA_KLIEN', 'ALAMAT_KLIEN', 'NOMOR_PERKARA', 'PENGADILAN_TUJUAN'],
            ],
            [
                'name' => 'Surat Somasi & Peringatan Hukum Pertama (Wanprestasi)',
                'code' => 'SMS-WAN-01',
                'document_type' => 'somasi',
                'description' => 'Format surat teguran hukum resmi penagihan kewajiban dan peringatan wanprestasi.',
                'content_body' => "SURAT PERINGATAN HUKUM (SOMASI I)\nNomor: [[NOMOR_SOMASI]]\n\nKepada Yth:\nDireksi [[NAMA_TERGUGAT]]\nAlamat: [[ALAMAT_TERGUGAT]]\n\nDengan hormat,\nBertindak untuk dan atas nama Klien kami, [[NAMA_KLIEN]]...",
                'placeholders' => ['NOMOR_SOMASI', 'NAMA_TERGUGAT', 'ALAMAT_TERGUGAT', 'NAMA_KLIEN', 'NILAI_TAGIHAN', 'TENGGAT_WAKTU'],
            ],
            [
                'name' => 'Perjanjian Kerahasiaan & Non-Disclosure Agreement (NDA)',
                'code' => 'NDA-CORP-01',
                'document_type' => 'contract',
                'description' => 'Format standar perjanjian kerahasiaan informasi rahasia pra-transaksi M&A dan due diligence.',
                'content_body' => "NON-DISCLOSURE AGREEMENT (NDA)\nNomor: [[NOMOR_NDA]]\n\nPerjanjian ini dibuat pada hari ini oleh dan antara:\n1. [[PIHAK_PERTAMA]]\n2. [[PIHAK_KEDUA]]\n\nMengenai pertukaran data rahasia proyek [[NAMA_PROYEK]]...",
                'placeholders' => ['NOMOR_NDA', 'PIHAK_PERTAMA', 'PIHAK_KEDUA', 'NAMA_PROYEK', 'DURASI_KERAHASIAAN'],
            ],
            [
                'name' => 'Perjanjian Kerjasama Operasional & Joint Venture (JV Agreement)',
                'code' => 'KSO-CORP-01',
                'document_type' => 'contract',
                'description' => 'Format perjanjian kerjasama konsorsium strategis dan bagi hasil operasi industri.',
                'content_body' => "PERJANJIAN KERJASAMA OPERASIONAL\nNomor: [[NOMOR_KSO]]\n\nAntara [[KONSORSIUM_A]] dan [[KONSORSIUM_B]] mengenai pengelolaan fasilitas smelter...",
                'placeholders' => ['NOMOR_KSO', 'KONSORSIUM_A', 'KONSORSIUM_B', 'OBJEK_PROYEK'],
            ],
            [
                'name' => 'Surat Permohonan Sita Jaminan (Conservatoir Beslag)',
                'code' => 'SITA-LIT-01',
                'document_type' => 'court_filing',
                'description' => 'Format resmi permohonan sita jaminan atas benda bergerak dan tidak bergerak debitur.',
                'content_body' => "PERMOHONAN SITA JAMINAN\nNomor Perkara: [[NOMOR_PERKARA]]\n\nKepada Ketua Majelis Hakim Pengadilan Negeri...",
                'placeholders' => ['NOMOR_PERKARA', 'NAMA_PEMOHON', 'OBJEK_SITA'],
            ],
        ];

        return collect($templatesData)->map(function (array $data): DocumentTemplate {
            $templatePath = 'seeded-workspace/templates/template-'.Str::slug($data['code']).'.docx';
            Storage::disk('local')->put($templatePath, $data['content_body']);

            return DocumentTemplate::query()->create([
                'name' => $data['name'],
                'document_type' => $data['document_type'],
                'storage_disk' => 'local',
                'storage_path' => $templatePath,
                'original_filename' => $data['code'].'.docx',
                'checksum' => hash('sha256', $data['content_body']),
                'placeholders' => $data['placeholders'],
                'status' => 'approved',
                'scan_status' => 'clean',
                'scan_message' => 'Template telah lolos validasi keamanan sistem dan bebas macro berbahaya.',
                'scanned_at' => $this->referenceDate->subMonths(2),
                'root_template_id' => null,
                'version' => 1,
                'superseded_at' => null,
                'created_by' => $this->actor('managing-partner')->getKey(),
            ]);
        })->all();
    }

    /**
     * @param  array<int, DocumentTemplate>  $templates
     * @param  array<int, Matter>  $matters
     * @param  array<string, array<int, Document>>  $documents
     */
    private function seedTemplateGenerations(array $templates, array $matters, array $documents): void
    {
        foreach ($templates as $idx => $template) {
            $matter = $matters[$idx % count($matters)];
            $doc = $documents[(string) $matter->getKey()][0];

            DocumentTemplateGeneration::query()->create([
                'document_template_id' => $template->getKey(),
                'document_id' => $doc->getKey(),
                'matter_id' => $matter->getKey(),
                'resolved_placeholders' => [
                    'NOMOR_SURAT' => 'SKK/RPK/2026/'.($idx + 101),
                    'NAMA_PEMBERI_KUASA' => 'Ir. Aditya Pranoto',
                    'JABATAN' => 'Direktur Utama',
                    'NAMA_KLIEN' => $matter->client->legal_name,
                    'ALAMAT_KLIEN' => $matter->client->address_line_1,
                ],
                'generated_by' => $this->actor('associate')->getKey(),
            ]);
        }
    }

    /**
     * @param  array<int, Matter>  $matters
     * @param  array<string, array<int, Document>>  $documents
     * @return array<int, Quotation>
     */
    private function seedFinance(array $matters, array $documents): array
    {
        $quotations = [];
        $taxRate = 11.00;

        foreach ($matters as $idx => $matter) {
            $quotationNumber = sprintf('RPK-QUO-2026-%04d', $idx + 1);

            $retainerFee = (int) ($matter->budget_amount * 0.4);
            $successFee = (int) ($matter->budget_amount * 0.6);
            $subtotal = $retainerFee + $successFee;
            $taxAmount = (int) round(($subtotal * $taxRate) / 100);
            $totalAmount = $subtotal + $taxAmount;

            // 1. Quotation
            $quotation = Quotation::query()->create([
                'quotation_number' => $quotationNumber,
                'matter_id' => $matter->getKey(),
                'client_id' => $matter->client_id,
                'title' => 'Penawaran Jasa Hukum & Struktur Honorarium Advokat — '.$matter->title,
                'scope' => "1. Formulasi strategi litigasi dan telaah yuridis materiil.\n2. Pendampingan di hadapan majelis hakim/arbiter.\n3. Penyusunan seluruh draf gugatan, replik, dan kesimpulan pembuktian.",
                'status' => in_array($idx, [0, 1, 2, 3, 4, 7], true) ? 'accepted' : 'draft',
                'currency' => 'IDR',
                'subtotal_amount' => $subtotal,
                'discount_amount' => 0,
                'tax_rate' => $taxRate,
                'tax_amount' => $taxAmount,
                'total_amount' => $totalAmount,
                'issued_at' => $this->referenceDate->subDays(180 - ($idx * 10))->toDateString(),
                'valid_until' => $this->referenceDate->subDays(150 - ($idx * 10))->toDateString(),
                'approved_by' => $this->actor('managing-partner')->getKey(),
                'approved_at' => $this->referenceDate->subDays(178 - ($idx * 10)),
                'converted_at' => in_array($idx, [0, 1, 2, 3, 4, 7], true) ? $this->referenceDate->subDays(140 - ($idx * 10)) : null,
                'created_by' => $this->actor('managing-partner')->getKey(),
            ]);

            QuoteLineItem::query()->create([
                'quotation_id' => $quotation->getKey(),
                'description' => 'Professional Retainer Legal Fee — Advokasi & Analisis Yuridis',
                'quantity' => 1,
                'unit_amount' => $retainerFee,
                'total_amount' => $retainerFee,
                'sort_order' => 1,
            ]);

            QuoteLineItem::query()->create([
                'quotation_id' => $quotation->getKey(),
                'description' => 'Success Fee & Trial Advocacy — Penyelesaian Sengketa BHT',
                'quantity' => 1,
                'unit_amount' => $successFee,
                'total_amount' => $successFee,
                'sort_order' => 2,
            ]);

            $quotations[] = $quotation;
        }

        // Seed precisely 10 invoices
        for ($idx = 0; $idx < 10; $idx++) {
            $matter = $matters[$idx];
            $quotation = $quotations[$idx];
            $invoiceNumber = sprintf('RPK-INV-2026-%04d', $idx + 1);
            $retainerFee = (int) ($matter->budget_amount * 0.4);

            // Status allocation:
            // 0, 1, 2, 3, 7: paid
            // 4, 6: partially_paid
            // 5: overdue
            // 8: cancelled
            // 9: sent
            if (in_array($idx, [0, 1, 2, 3, 7], true)) {
                $invoiceStatus = 'paid';
            } elseif (in_array($idx, [4, 6], true)) {
                $invoiceStatus = 'partially_paid';
            } elseif ($idx === 5) {
                $invoiceStatus = 'overdue';
            } elseif ($idx === 8) {
                $invoiceStatus = 'cancelled';
            } else {
                $invoiceStatus = 'sent';
            }

            $invSubtotal = $retainerFee;
            $invTax = (int) round(($invSubtotal * $taxRate) / 100);
            $invTotal = $invSubtotal + $invTax;
            $invPaid = $invoiceStatus === 'paid' ? $invTotal : ($invoiceStatus === 'partially_paid' ? (int) round($invTotal * 0.5) : 0);
            $invOutstanding = $invTotal - $invPaid;

            $invoice = Invoice::query()->create([
                'invoice_number' => $invoiceNumber,
                'matter_id' => $matter->getKey(),
                'client_id' => $matter->client_id,
                'quotation_id' => $quotation->getKey(),
                'title' => 'Tagihan Honorarium Termin 1 (Retainer Advokasi 40%) — '.$matter->title,
                'status' => $invoiceStatus,
                'currency' => 'IDR',
                'subtotal_amount' => $invSubtotal,
                'discount_amount' => 0,
                'tax_rate' => $taxRate,
                'tax_amount' => $invTax,
                'total_amount' => $invTotal,
                'paid_amount' => $invPaid,
                'outstanding_amount' => $invOutstanding,
                'issued_at' => $this->referenceDate->subDays(120 - ($idx * 10))->toDateString(),
                'due_at' => $invoiceStatus === 'overdue' ? $this->referenceDate->subDays(30)->toDateString() : $this->referenceDate->subDays(90 - ($idx * 10))->toDateString(),
                'sent_at' => $this->referenceDate->subDays(119 - ($idx * 10))->toDateString(),
                'paid_at' => $invoiceStatus === 'paid' ? $this->referenceDate->subDays(80 - ($idx * 10))->toDateString() : null,
                'cancelled_at' => $invoiceStatus === 'cancelled' ? $this->referenceDate->subDays(15) : null,
                'cancelled_by' => $invoiceStatus === 'cancelled' ? $this->actor('administrator')->getKey() : null,
                'cancellation_reason' => $invoiceStatus === 'cancelled' ? 'Dibatalkan dan digantikan dengan Invoice Revisi No. RPK-INV-2026-0012 atas permintaan Klien terkait perubahan NPWP Cabang.' : null,
                'created_by' => $this->actor('administrator')->getKey(),
            ]);

            InvoiceLineItem::query()->create([
                'invoice_id' => $invoice->getKey(),
                'description' => 'Tagihan Honorarium Termin 1 (Retainer Advokasi 40%)',
                'quantity' => 1,
                'unit_amount' => $invSubtotal,
                'total_amount' => $invSubtotal,
                'sort_order' => 1,
            ]);

            // 3. Payment
            if (in_array($invoiceStatus, ['paid', 'partially_paid'], true)) {
                $payAmount = $invPaid;
                $isReversed = $idx === 1;
                $isRefunded = $idx === 2;

                $payment = Payment::query()->create([
                    'client_id' => $matter->client_id,
                    'matter_id' => $matter->getKey(),
                    'currency' => 'IDR',
                    'amount' => $payAmount,
                    'method' => 'bank_transfer',
                    'reference_number' => 'MANDIRI-TRF-'.Str::upper(Str::random(8)),
                    'notes' => 'Pembayaran lunas terverifikasi via mutasi Bank Mandiri Rek. 131-00-982173-1.',
                    'received_at' => $this->referenceDate->subDays(80 - ($idx * 10)),
                    'proof_document_id' => null,
                    'recorded_by' => $this->actor('administrator')->getKey(),
                    'reversed_at' => $isReversed ? $this->referenceDate->subDays(12) : null,
                    'reversed_by' => $isReversed ? $this->actor('administrator')->getKey() : null,
                    'reversal_reason' => $isReversed ? 'Koreksi jurnal audit pembukuan kas kantor hukum.' : null,
                    'refunded_at' => $isRefunded ? $this->referenceDate->subDays(10) : null,
                    'refunded_by' => $isRefunded ? $this->actor('administrator')->getKey() : null,
                    'refund_reason' => $isRefunded ? 'Pengembalian sisa kelebihan pembayaran deposit honorarium.' : null,
                ]);

                PaymentAllocation::query()->create([
                    'payment_id' => $payment->getKey(),
                    'invoice_id' => $invoice->getKey(),
                    'amount' => $payAmount,
                ]);
            }

            // 4. Expenses
            Expense::query()->create([
                'matter_id' => $matter->getKey(),
                'category' => in_array($idx, [1, 2, 3, 5], true) ? 'court_fee' : 'travel',
                'description' => in_array($idx, [1, 2, 3, 5], true) ? 'Biaya PNBP Pendaftaran Gugatan e-Court & Relaas Panggilan Jurusita' : 'Transportasi Kereta Cepat Whoosh & Akomodasi Rapat Negosiasi Klien Jakarta-Bandung',
                'vendor' => in_array($idx, [1, 2, 3, 5], true) ? 'Pengadilan Negeri / BANI' : 'PT Kereta Cepat Indonesia China & Pullman Hotel',
                'incurred_at' => $this->referenceDate->subDays(100 - ($idx * 8))->toDateString(),
                'amount' => in_array($idx, [1, 2, 3, 5], true) ? 4_500_000 : 1_850_000,
                'currency' => 'IDR',
                'status' => in_array($idx, [0, 1, 2, 7], true) ? 'reimbursed' : 'approved',
                'proof_document_id' => null,
                'approved_by' => $this->actor('managing-partner')->getKey(),
                'approved_at' => $this->referenceDate->subDays(95 - ($idx * 8))->toDateString(),
                'created_by' => $this->actor('associate')->getKey(),
            ]);
        }

        return $quotations;
    }

    /**
     * @param  array<int, Matter>  $matters
     * @param  array<string, array<int, Contact>>  $contacts
     * @param  array<string, array<int, Document>>  $documents
     * @param  array<int, Quotation>  $quotations
     */
    private function seedGovernance(array $matters, array $contacts, array $documents, array $quotations): void
    {
        foreach ($matters as $idx => $matter) {
            // 1. Conflict Check
            ConflictCheck::query()->create([
                'client_id' => $matter->client_id,
                'matter_id' => $matter->getKey(),
                'quotation_id' => $quotations[$idx]->getKey(),
                'subject_name' => $matter->client->legal_name,
                'searched_names' => [$matter->client->legal_name, 'PT Mitra Global Logistik', 'Ir. Hendra Gunawan'],
                'matches' => [],
                'status' => 'cleared',
                'decision' => 'cleared',
                'decision_note' => 'Pemeriksaan silang database perkara dan entitas afiliasi membuktikan nihil konflik kepentingan. RPK Law Firm independen mewakili Klien.',
                'requested_by' => $this->actor('partner')->getKey(),
                'reviewed_by' => $this->actor('managing-partner')->getKey(),
                'reviewed_at' => $this->referenceDate->subDays(218),
                'expires_at' => $this->referenceDate->addMonths(12),
            ]);

            // 2. Correspondences (2 per matter = 24 total)
            $clientContacts = $contacts[(string) $matter->client_id] ?? [];
            $contactId = count($clientContacts) > 0 ? $clientContacts[0]->getKey() : null;

            $corr1 = Correspondence::query()->create([
                'matter_id' => $matter->getKey(),
                'client_id' => $matter->client_id,
                'contact_id' => $contactId,
                'direction' => 'outgoing',
                'source' => 'letter',
                'subject' => 'Surat Pengantar Berkas Dokumen Hukum Resmi — '.$matter->title,
                'from_addresses' => ['fajarroni@rpklawoffice.com'],
                'to_addresses' => [$matter->client->email],
                'cc_addresses' => ['anggaraputra@rpklawoffice.com'],
                'body' => 'Bersama surat ini kami lampirkan salinan draf resmi pembelaan perkara untuk dapat ditinjau oleh Dewan Direksi.',
                'external_message_id' => sprintf('042/RPK-OUT/VI/2026-%02d', $idx + 1),
                'occurred_at' => $this->referenceDate->subDays(60),
                'created_by' => $this->actor('administrator')->getKey(),
            ]);

            $corr2 = Correspondence::query()->create([
                'matter_id' => $matter->getKey(),
                'client_id' => $matter->client_id,
                'contact_id' => $contactId,
                'direction' => 'incoming',
                'source' => 'email',
                'subject' => 'Konfirmasi Penerimaan Dokumen & Bukti Pendukung — '.$matter->title,
                'from_addresses' => [$matter->client->email],
                'to_addresses' => ['fajarroni@rpklawoffice.com'],
                'cc_addresses' => ['rezakusumah@rpklawoffice.com'],
                'body' => 'Terima kasih Rekan RPK Law Firm, dokumen telah kami terima dengan baik dan siap kami teruskan ke Rapat Direksi.',
                'external_message_id' => sprintf('MSG-IN/2026-%02d', $idx + 1),
                'occurred_at' => $this->referenceDate->subDays(58),
                'created_by' => $this->actor('administrator')->getKey(),
            ]);

            // Link correspondence to document
            $doc = $documents[(string) $matter->getKey()][0];
            $corr1->documents()->attach($doc->getKey());
            $corr2->documents()->attach($doc->getKey());

            // 3. Matter Export
            $exportPath = 'seeded-workspace/exports/'.$matter->matter_number.'-handover.zip';
            $manifestJson = json_encode([
                'matter_number' => $matter->matter_number,
                'client' => $matter->client->legal_name,
                'exported_at' => $this->referenceDate->subDays(10)->toIso8601String(),
                'exported_by' => 'Muhamad Fajar Roni, S.H.',
                'files' => ['legal-opinion.pdf', 'contract.docx', 'manifest.json'],
            ], JSON_PRETTY_PRINT);

            if (! Storage::disk('local')->exists($exportPath)) {
                $zip = new ZipArchive;
                $tmpZip = tempnam(sys_get_temp_dir(), 'rpk-zip-');
                if ($tmpZip && $zip->open($tmpZip, ZipArchive::CREATE | ZipArchive::OVERWRITE) === true) {
                    $zip->addFromString('manifest.json', $manifestJson);
                    $zip->addFromString('README.txt', 'RPK Law Firm — Matter Archive Package for '.$matter->matter_number);
                    $zip->close();
                    Storage::disk('local')->put($exportPath, file_get_contents($tmpZip));
                    unlink($tmpZip);
                }
            }

            MatterExport::query()->create([
                'matter_id' => $matter->getKey(),
                'status' => 'completed',
                'storage_disk' => 'local',
                'storage_path' => $exportPath,
                'checksum' => hash('sha256', $manifestJson),
                'file_size' => 1024 * 512,
                'failure_message' => null,
                'requested_by' => $this->actor('managing-partner')->getKey(),
                'completed_at' => $this->referenceDate->subDays(10),
                'manifest_checksum' => hash('sha256', $manifestJson),
            ]);
        }
    }

    /** @param array<string, array<int, Document>> $documents */
    private function seedDocumentApprovals(array $documents): void
    {
        $allDocs = $this->flattenDocuments($documents, 8);
        foreach ($allDocs as $idx => $doc) {
            DocumentApproval::query()->create([
                'document_id' => $doc->getKey(),
                'requested_by' => $this->actor('associate')->getKey(),
                'reviewer_id' => $this->actor('managing-partner')->getKey(),
                'status' => $idx % 3 === 0 ? 'approved' : ($idx % 3 === 1 ? 'pending' : 'approved'),
                'request_note' => 'Mohon review akhir klausul ganti rugi dan persetujuan penerbitan draf resmi ke Klien.',
                'resolution_note' => $idx % 3 === 1 ? null : 'Disetujui. Struktur dalil hukum telah komprehensif dan memenuhi standar kualitas prima RPK Law Firm.',
                'resolved_at' => $idx % 3 === 1 ? null : $this->referenceDate->subDays(5),
            ]);
        }
    }

    /** @param array<string, array<int, Document>> $documents */
    private function seedSignatures(array $documents): void
    {
        $allDocs = $this->flattenDocuments($documents, 4);
        foreach ($allDocs as $idx => $doc) {
            $isCompleted = $idx % 2 === 0;
            $reqKey = (string) Str::ulid();

            $signedFinalPath = 'seeded-workspace/signatures/signed-final-'.$reqKey.'.pdf';
            $auditTrailPath = 'seeded-workspace/signatures/audit-trail-'.$reqKey.'.pdf';
            $certBundlePath = 'seeded-workspace/signatures/cert-'.$reqKey.'.json';

            if ($isCompleted) {
                Storage::disk('local')->put($signedFinalPath, "%PDF-1.4 Mock Signed PDF for {$doc->title}");
                Storage::disk('local')->put($auditTrailPath, "%PDF-1.4 Mock Audit Trail for {$doc->title}");
                Storage::disk('local')->put($certBundlePath, json_encode([
                    'issuer' => 'RPK Law Firm Trusted CA',
                    'timestamp' => $this->referenceDate->subDays(2)->toIso8601String(),
                    'algorithm' => 'SHA256withRSA',
                ]));
            }

            $req = SignatureRequest::query()->create([
                'id' => $reqKey,
                'document_id' => $doc->getKey(),
                'document_version_id' => $doc->current_version_id,
                'verification_code' => sprintf('RPK-VERIF-%04d', $idx + 1),
                'mode' => 'sequential',
                'status' => $isCompleted ? 'completed' : 'pending',
                'document_checksum' => hash('sha256', $doc->title),
                'expires_at' => $this->referenceDate->addDays(14),
                'sent_at' => $this->referenceDate->subDays(3),
                'completed_at' => $isCompleted ? $this->referenceDate->subDays(2) : null,
                'created_by' => $this->actor('managing-partner')->getKey(),
                'signed_record_disk' => $isCompleted ? 'local' : null,
                'signed_record_path' => $isCompleted ? $signedFinalPath : null,
                'certificate_disk' => $isCompleted ? 'local' : null,
                'certificate_path' => $isCompleted ? $certBundlePath : null,
                'assurance_level' => 'advanced_electronic_signature',
                'signed_final_started_at' => $this->referenceDate->subDays(3),
                'signed_final_completed_at' => $isCompleted ? $this->referenceDate->subDays(2) : null,
                'signed_final_disk' => $isCompleted ? 'local' : null,
                'signed_final_path' => $isCompleted ? $signedFinalPath : null,
                'signed_final_status' => $isCompleted ? 'completed' : 'pending',
                'signed_final_message' => $isCompleted ? 'Penandatanganan digital tersertifikasi selesai dan valid.' : null,
            ]);

            SignatureSigner::query()->create([
                'signature_request_id' => $req->getKey(),
                'name' => 'Muhamad Fajar Roni, S.H.',
                'email' => 'fajarroni@rpklawoffice.com',
                'signing_order' => 1,
                'signing_token' => Str::random(40),
                'status' => 'signed',
                'signed_at' => $this->referenceDate->subDays(3),
                'signed_ip_address' => '103.144.170.22',
                'signed_user_agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
                'accepted_name' => 'Muhamad Fajar Roni',
                'signature_data' => 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
            ]);

            SignatureSigner::query()->create([
                'signature_request_id' => $req->getKey(),
                'name' => 'Ir. Aditya Pranoto, M.T.',
                'email' => 'aditya.pranoto@nusantaraenergi.co.id',
                'signing_order' => 2,
                'signing_token' => Str::random(40),
                'status' => $isCompleted ? 'signed' : 'pending',
                'signed_at' => $isCompleted ? $this->referenceDate->subDays(2) : null,
                'signed_ip_address' => $isCompleted ? '114.122.204.18' : null,
                'signed_user_agent' => $isCompleted ? 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' : null,
                'accepted_name' => $isCompleted ? 'Ir. Aditya Pranoto' : null,
                'signature_data' => $isCompleted ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==' : null,
            ]);
        }
    }

    private function seedSequences(): void
    {
        MatterNumberSequence::query()->updateOrCreate(
            ['year' => 2026],
            ['next_value' => 13]
        );

        DocumentNumberSequence::query()->updateOrCreate(
            ['year' => 2026, 'type' => 'general'],
            ['next_value' => 49]
        );
    }

    /**
     * @param  array<int, Matter>  $matters
     * @param  array<string, array<int, Document>>  $documents
     */
    private function seedComments(array $matters, array $documents): void
    {
        $fajar = $this->actor('managing-partner');
        $anggara = $this->actor('partner');
        $reza = $this->actor('partner-corporate');

        // Matter comments
        foreach ($matters as $idx => $matter) {
            $rootComment = Comment::query()->create([
                'commentable_type' => Matter::class,
                'commentable_id' => $matter->getKey(),
                'parent_id' => null,
                'user_id' => $fajar->getKey(),
                'body' => 'Catatan arahan Managing Partner: Mohon prioritaskan verifikasi bukti surat fisik dan lakukan simulasi pemeriksaan saksi ahli 7 hari sebelum sidang.',
                'is_pinned' => true,
                'pinned_by' => $fajar->getKey(),
                'pinned_at' => $this->referenceDate->subDays(10),
            ]);

            CommentReaction::query()->create([
                'comment_id' => $rootComment->getKey(),
                'user_id' => $anggara->getKey(),
                'emoji' => '👍',
            ]);

            $reply = Comment::query()->create([
                'commentable_type' => Matter::class,
                'commentable_id' => $matter->getKey(),
                'parent_id' => $rootComment->getKey(),
                'user_id' => $anggara->getKey(),
                'body' => 'Siap Partner, bundel bukti P-1 sampai P-10 sudah selesai dicap meterai dan siap diserahkan ke panitera sidang.',
                'is_pinned' => false,
            ]);

            CommentReaction::query()->create([
                'comment_id' => $reply->getKey(),
                'user_id' => $fajar->getKey(),
                'emoji' => '❤️',
            ]);
        }

        // Document comments
        $allDocs = $this->flattenDocuments($documents, 6);
        foreach ($allDocs as $doc) {
            $docComment = Comment::query()->create([
                'commentable_type' => Document::class,
                'commentable_id' => $doc->getKey(),
                'parent_id' => null,
                'user_id' => $reza->getKey(),
                'body' => 'Klausul indemnifikasi di halaman 4 telah kami sesuaikan dengan limitasi tanggung jawab perdata terbaru.',
                'is_pinned' => false,
            ]);

            CommentReaction::query()->create([
                'comment_id' => $docComment->getKey(),
                'user_id' => $fajar->getKey(),
                'emoji' => '⚖️',
            ]);
        }
    }

    /**
     * @param  array<int, Matter>  $matters
     * @param  array<string, array<int, Document>>  $documents
     */
    private function seedAuditTrail(array $matters, array $documents): void
    {
        $lastHash = null;

        foreach ($matters as $idx => $matter) {
            $entry1Hash = hash('sha256', ($lastHash ?? 'ROOT_GENESIS').$matter->getKey().'matter.created');
            AuditLog::query()->create([
                'actor_id' => $this->actor('managing-partner')->getKey(),
                'event' => 'matter.created',
                'subject_type' => Matter::class,
                'subject_id' => $matter->getKey(),
                'metadata' => [
                    'matter_number' => $matter->matter_number,
                    'title' => $matter->title,
                    'status' => $matter->status,
                ],
                'ip_address' => '103.144.170.22',
                'user_agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
                'category' => 'matter',
                'previous_hash' => $lastHash,
                'entry_hash' => $entry1Hash,
                'created_at' => $matter->created_at,
            ]);
            $lastHash = $entry1Hash;

            $entry2Hash = hash('sha256', $lastHash.$matter->getKey().'conflict_check.cleared');
            AuditLog::query()->create([
                'actor_id' => $this->actor('partner')->getKey(),
                'event' => 'conflict_check.cleared',
                'subject_type' => Matter::class,
                'subject_id' => $matter->getKey(),
                'metadata' => [
                    'client_id' => $matter->client_id,
                    'decision' => 'cleared',
                ],
                'ip_address' => '103.144.170.22',
                'user_agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
                'category' => 'compliance',
                'previous_hash' => $lastHash,
                'entry_hash' => $entry2Hash,
                'created_at' => $this->referenceDate->subDays(200),
            ]);
            $lastHash = $entry2Hash;

            $entry3Hash = hash('sha256', $lastHash.$matter->getKey().'document.approved');
            AuditLog::query()->create([
                'actor_id' => $this->actor('managing-partner')->getKey(),
                'event' => 'document.approved',
                'subject_type' => Matter::class,
                'subject_id' => $matter->getKey(),
                'metadata' => [
                    'status' => 'approved',
                    'action' => 'review_completed',
                ],
                'ip_address' => '103.144.170.22',
                'user_agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
                'category' => 'document',
                'previous_hash' => $lastHash,
                'entry_hash' => $entry3Hash,
                'created_at' => $this->referenceDate->subDays(150),
            ]);
            $lastHash = $entry3Hash;

            $entry4Hash = hash('sha256', $lastHash.$matter->getKey().'invoice.generated');
            AuditLog::query()->create([
                'actor_id' => $this->actor('administrator')->getKey(),
                'event' => 'invoice.generated',
                'subject_type' => Matter::class,
                'subject_id' => $matter->getKey(),
                'metadata' => [
                    'status' => 'issued',
                    'action' => 'billing_cycle',
                ],
                'ip_address' => '103.144.170.22',
                'user_agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
                'category' => 'billing',
                'previous_hash' => $lastHash,
                'entry_hash' => $entry4Hash,
                'created_at' => $this->referenceDate->subDays(120),
            ]);
            $lastHash = $entry4Hash;
        }
    }

    /** @param array<int, Matter> $matters */
    private function seedNotifications(array $matters): void
    {
        $fajar = $this->actor('managing-partner');
        $anggara = $this->actor('partner');

        foreach ($matters as $idx => $matter) {
            if ($idx < 4) {
                DB::table('notifications')->insert([
                    'id' => (string) Str::uuid(),
                    'type' => 'App\Notifications\MatterDeadlineApproaching',
                    'notifiable_type' => User::class,
                    'notifiable_id' => $anggara->getKey(),
                    'data' => json_encode([
                        'matter_id' => $matter->getKey(),
                        'matter_title' => $matter->title,
                        'message' => 'Peringatan: Jadwal sidang pembuktian untuk perkara '.$matter->matter_number.' jatuh tempo dalam 7 hari.',
                        'action_url' => '/matters/'.$matter->getKey(),
                    ], JSON_THROW_ON_ERROR),
                    'read_at' => $idx % 2 === 0 ? now()->subHours(4) : null,
                    'created_at' => now()->subHours(12),
                    'updated_at' => now()->subHours(12),
                ]);
            }
        }
    }

    private function seedDirectMessages(): void
    {
        $fajar = $this->actor('managing-partner');
        $anggara = $this->actor('partner');
        $reza = $this->actor('partner-corporate');
        $admin = $this->actor('administrator');

        // Update presence
        $fajar->forceFill(['last_seen_at' => now()])->saveQuietly();
        $anggara->forceFill(['last_seen_at' => now()->subMinutes(2)])->saveQuietly();
        $reza->forceFill(['last_seen_at' => now()->subMinutes(15)])->saveQuietly();
        $admin->forceFill(['last_seen_at' => now()->subMinutes(1)])->saveQuietly();

        // 1. Thread between Fajar and Anggara
        $msg1 = DirectMessage::query()->create([
            'sender_id' => $fajar->getKey(),
            'recipient_id' => $anggara->getKey(),
            'message' => 'Rekan Anggara, bagaimana persiapan sidang pembuktian surat sengketa farmasi di PN Bandung besok lusa?',
            'read_at' => $this->referenceDate->subHours(5),
            'created_at' => $this->referenceDate->subHours(5),
            'updated_at' => $this->referenceDate->subHours(5),
        ]);

        $msg2 = DirectMessage::query()->create([
            'sender_id' => $anggara->getKey(),
            'recipient_id' => $fajar->getKey(),
            'reply_to_id' => $msg1->getKey(),
            'message' => 'Semua alat bukti P-1 sampai P-10 sudah dilegalisir di Kantor Pos Besar Bandung, Partner. Saksi ahli Prof. Dr. Budi Gunawan juga sudah mengonfirmasi hadir.',
            'read_at' => $this->referenceDate->subHours(4),
            'created_at' => $this->referenceDate->subHours(4),
            'updated_at' => $this->referenceDate->subHours(4),
        ]);

        $msg3 = DirectMessage::query()->create([
            'sender_id' => $fajar->getKey(),
            'recipient_id' => $anggara->getKey(),
            'reply_to_id' => $msg2->getKey(),
            'message' => 'Luar biasa. Pastikan naskah pertanyaan silang (cross-examination guide) sudah diselaraskan dengan replik.',
            'read_at' => $this->referenceDate->subHours(2),
            'created_at' => $this->referenceDate->subHours(2),
            'updated_at' => $this->referenceDate->subHours(2),
        ]);

        DirectMessageReaction::query()->create([
            'direct_message_id' => $msg2->getKey(),
            'user_id' => $fajar->getKey(),
            'reaction' => 'thumbs_up',
        ]);

        DirectMessageReaction::query()->create([
            'direct_message_id' => $msg3->getKey(),
            'user_id' => $anggara->getKey(),
            'reaction' => 'heart',
        ]);

        // 2. Thread between Reza and Fajar
        DirectMessage::query()->create([
            'sender_id' => $reza->getKey(),
            'recipient_id' => $fajar->getKey(),
            'message' => 'Pak Managing Partner, draf CSPA dan Shareholders Agreement untuk transaksi M&A PT Sentosa sudah selesai di-review internal dan siap diajukan ke Direksi.',
            'read_at' => $this->referenceDate->subHours(3),
            'created_at' => $this->referenceDate->subHours(3),
            'updated_at' => $this->referenceDate->subHours(3),
        ]);

        DirectMessage::query()->create([
            'sender_id' => $fajar->getKey(),
            'recipient_id' => $reza->getKey(),
            'message' => 'Terima kasih Rekan Reza. Tolong ajukan permohonan persetujuan resmi melalui modul Dokumen & Governance ya.',
            'read_at' => null,
            'created_at' => $this->referenceDate->subHours(1),
            'updated_at' => $this->referenceDate->subHours(1),
        ]);

        // 3. Thread between Admin and Fajar
        DirectMessage::query()->create([
            'sender_id' => $admin->getKey(),
            'recipient_id' => $fajar->getKey(),
            'message' => 'Laporan billing bulan ini sudah siap, Pak. Pembayaran termin 1 PT Nusantara Energi Mega Perkasa senilai Rp 1,7 Miliar sudah terkonfirmasi masuk ke rekening penampung.',
            'read_at' => null,
            'created_at' => $this->referenceDate->subMinutes(30),
            'updated_at' => $this->referenceDate->subMinutes(30),
        ]);
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
