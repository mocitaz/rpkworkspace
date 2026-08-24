# PANDUAN PENGGUNA SISTEM (USER OPERATING MANUAL)
## RPK Legal Workspace — Integrated Law Firm Practice Management System
**Firma Hukum Roni, Putra & Kusumah (RPK Law Firm)**  
*Dokumen Resmi Operasional Internal & Standar Prosedur Penggunaan Sistem*

---

## DAFTAR ISI DOKUMEN

1. [INFORMASI DOKUMEN & KONTROL REVISI](#1-informasi-dokumen--kontrol-revisi)
2. [AKUN PENGUJIAN RESMI & KREDENSIAL SISTEM](#2-akun-pengujian-resmi--kredensial-sistem)
3. [BAB 1: OTENTIKASI, KEAMANAN & AKSES MASUK (LOGIN)](#3-bab-1-otentikasi-keamanan--akses-masuk-login)
4. [BAB 2: DASHBOARD UTAMA & COCKPIT EKSEKUTIF](#4-bab-2-dashboard-utama--cockpit-eksekutif)
5. [BAB 3: MANAJEMEN KLIEN & KEPATUHAN (CLIENTS & COMPLIANCE)](#5-bab-3-manajemen-klien--kepatuhan-clients--compliance)
6. [BAB 4: MANAJEMEN PERKARA & LITIGASI (MATTER OPERATIONS)](#6-bab-4-manajemen-perkara--litigasi-matter-operations)
7. [BAB 5: MANAJEMEN TUGAS & BEBAN KERJA (TASKS & COLLABORATION)](#7-bab-5-manajemen-tugas--beban-kerja-tasks--collaboration)
8. [BAB 6: REPOSITORI DOKUMEN, PERSETUJUAN & TANDA TANGAN ELEKTRONIK (DMS & E-SIGN)](#8-bab-6-repositori-dokumen-persetujuan--tanda-tangan-elektronik-dms--e-sign)
9. [BAB 7: SMART LEGAL DRAFTING & TEMPLATE DOKUMEN DINAMIS (/templates)](#9-bab-7-smart-legal-drafting--template-dokumen-dinamis-templates)
10. [BAB 8: TATA KELOLA, KORESPONDENSI & KEBIJAKAN FIRMA (GOVERNANCE)](#10-bab-8-tata-kelola-korespondensi--kebijakan-firma-governance)
11. [BAB 9: KEUANGAN, PENAGIHAN & KAS MASUK (FINANCE & BILLING)](#11-bab-9-keuangan-penagihan--kas-masuk-finance--billing)
12. [BAB 10: JEJAK AUDIT, KEAMANAN & LEGAL HOLD COMPLIANCE](#12-bab-10-jejak-audit-keamanan--legal-hold-compliance)
13. [BAB 11: PANDUAN PEMECAHAN MASALAH (TROUBLESHOOTING & FAQ)](#13-bab-11-panduan-pemecahan-masalah-troubleshooting--faq)

---

## 1. INFORMASI DOKUMEN & KONTROL REVISI

| Parameter | Rincian Dokumen |
| :--- | :--- |
| **Nama Dokumen** | Buku Panduan Pengguna Sistem (User Manual) |
| **Nama Aplikasi** | RPK Legal Workspace (Firma Hukum Roni, Putra & Kusumah) |
| **Versi Sistem** | v2.4.0 (Enterprise LegalTech Suite) |
| **Bahasa Antarmuka** | Bahasa Indonesia (Bilingual Legal Standard) |
| **Klasifikasi Akses** | RAHASIA & TERBATAS (Internal Law Firm Confidential) |
| **Format Target Cetak** | Dokumen Standar A4 / PDF Export Ready |

---

## 2. AKUN PENGUJIAN RESMI & KREDENSIAL SISTEM

Sistem telah dilengkapi dengan **4 (empat) akun resmi** dengan peran (*role*) dan otorisasi wewenang yang berbeda untuk pengujian seluruh skenario alur kerja firma:

> [!IMPORTANT]
> **Kata Sandi Standar untuk Seluruh Akun Pengujian:**
> ```text
> password
> ```

### Tabel Matriks Akun Pengujian:

| No | Nama Pejabat / Pengguna | Alamat Email Resmi | Kata Sandi | Jabatan / Peran (*Role*) | Lingkup Wewenang Utama |
| :---: | :--- | :--- | :---: | :--- | :--- |
| **1** | **Muhamad Fajar Roni, S.H.** | `fajarroni@rpklawoffice.com` | `password` | **Managing Partner** / *Administrator* | Otoritas Penuh, Approval Biaya/Quotation, Akses Seluruh Perkara Strategis, Pengesahan Dokumen. |
| **2** | **M. Anggara Putra, S.H., M.H.** | `anggaraputra@rpklawoffice.com` | `password` | **Partner** (*Litigation & Dispute*) | Penanggung Jawab Perkara Litigasi, Sidang Pengadilan, Validasi Bukti, Pendelegasian Tugas. |
| **3** | **Reza Evaldo Kusumah, S.H.** | `rezakusumah@rpklawoffice.com` | `password` | **Partner** (*Corporate, M&A & Energy*) | Penanggung Jawab Transaksi Korporasi, Audit Kepatuhan, Legal Opinion, Kontrak Bisnis. |
| **4** | **RPK Administrator** | `contact@rpklawoffice.com` | `password` | **Head of Legal Ops & Finance** | Operasional Kantor, Penatausahaan Invoice & Pembayaran Kasir, Manajemen Template, Log Audit. |

---

## 3. BAB 1: OTENTIKASI, KEAMANAN & AKSES MASUK (LOGIN)

### 3.1 Prosedur Masuk Sistem (Login)
1. Buka peramban (*web browser*) dan akses URL portal: `http://127.0.0.1:8001/login`.
2. Pada layar login, masukkan salah satu **Alamat Email** di atas.
3. Masukkan kata sandi: `password`.
4. Klik tombol **Masuk ke Workspace** (*Sign In*).
5. Sistem akan memverifikasi kredensial dan mengarahkan Anda langsung ke **Dashboard Utama**.

### 3.2 Autentikasi Biometrik / Passkeys (WebAuthn)
* Sistem mendukung masuk tanpa sandi (*passwordless*) menggunakan Touch ID, Face ID, atau Windows Hello.
* **Aktivasi**: Masuk ke menu **Pengaturan Akun** (`/settings/security`) ➔ Pilih **Daftarkan Kunci Keamanan (Passkey)** ➔ Ikuti instruksi verifikasi biometrik pada perangkat Anda.

### 3.3 Autentikasi Dua Faktor (Two-Factor Authentication / 2FA)
* Untuk mengamankan data rahasia perkara, pengguna dapat mengaktifkan TOTP 2FA.
* **Langkah**: Menu **Pengaturan** ➔ **Keamanan** ➔ Pindai QR Code menggunakan aplikasi *Google Authenticator* atau *Microsoft Authenticator* ➔ Masukkan 6 digit token verifikasi.

### 3.4 Sesi Aktif & Indikator Kehadiran Real-time
* Status online terdeteksi secara otomatis dan terisolasi secara akurat per user.
* Jika pengguna tidak beraktivitas lebih dari 30 menit, sesi akan dilindungi secara otomatis.

---

## 4. BAB 2: DASHBOARD UTAMA & COCKPIT EKSEKUTIF

Dashboard utama (`/dashboard`) adalah pusat komando operasional firma hukum yang menyajikan ikhtisar real-time:

### 4.1 Komponen Indikator Finansial & Operasional
1. **Total Perkara Aktif**: Menampilkan jumlah perkara litigasi dan non-litigasi yang sedang ditangani.
2. **Tagihan Terbit & Kas Diterima**: Ringkasan akumulasi nilai invoice penagihan dan realisasi kas masuk firma.
3. **Piutang Berjalan (*Receivables*)**: Monitoring sisa piutang klien yang mendekati atau telah melewati jatuh tempo.
4. **Beban Kerja Tim (*Team Utilization*)**: Persentase pemanfaatan jam kerja dan alokasi tugas masing-masing advokat.

### 4.2 Menu Navigasi Cepat (Command Hub)
* Tekan pintasan keyboard `Cmd + K` (di Mac) atau `Ctrl + K` (di Windows) di mana saja untuk membuka **Pencarian Cepat Global**.
* Pengguna dapat mencari nomor perkara, nama klien, judul dokumen, atau instruksi navigasi langsung tanpa berpindah halaman.

### 4.3 Mini Pop-up Chat & Komunikasi Internal
* Terletak di sudut kanan bawah antarmuka.
* Berfungsi untuk koordinasi cepat antar advokat terkait perkara tanpa keluar dari konteks kerja saat ini.

---

## 5. BAB 3: MANAJEMEN KLIEN & KEPATUHAN (CLIENTS & COMPLIANCE)

Modul ini mengelola data prinsipal, identitas korporasi, serta kepatuhan anti-benturan kepentingan.

### 5.1 Registrasi Klien Baru
1. Akses menu **Klien** (`/clients`) pada bilah navigasi utama.
2. Klik tombol **+ Tambah Klien Baru**.
3. Lengkapi formulir:
   * **Nama Dagang / Tampilan (*Display Name*)**: Nama umum entitas atau individu.
   * **Nama Badan Hukum (*Legal Name*)**: Nama resmi sesuai akta (misal: *PT Mahakarya Prima Nusantara*).
   * **Klasifikasi Klien**: Pilih *Korporasi (Badan Hukum)* atau *Perorangan (Individu)*.
   * **Nomor Pokok Wajib Pajak (NPWP / Tax ID)** dan Alamat Domisili Hukum Lengkap.
4. Klik **Simpan Data Klien**.

### 5.2 Uji Tuntas Benturan Kepentingan (*Conflict of Interest Check*)
* Sebelum membuka perkara baru atau menerbitkan surat penawaran, sistem mewajibkan verifikasi bebas benturan kepentingan.
* Masuk ke tab **Conflict Check** pada profil klien untuk memastikan firma tidak sedang mewakili pihak lawan yang bersengketa.

### 5.3 Berkas Kepatuhan (*KYC & Compliance Repository*)
* Unggah berkas legal standing klien: Akta Pendirian, SK Menkumham, NIB, KTP Direksi, dan Surat Keterangan Domisili pada tab **Kepatuhan Klien**.

---

## 6. BAB 4: MANAJEMEN PERKARA & LITIGASI (MATTER OPERATIONS)

Modul Perkara (`/matters`) adalah inti operasional firma hukum yang mengorganisir seluruh berkas perkara, persidangan, dan alat bukti.

### 6.1 Pembukaan Perkara Baru (*Matter Intake*)
1. Akses menu **Perkara** (`/matters`) ➔ Klik **Buka Perkara Baru**.
2. Masukkan **Judul Perkara** (misal: *Sengketa Wanprestasi Perjanjian Pasokan Batubara*).
3. Pilih **Klien Terdaftar** dan **Bidang Hukum (*Practice Area*)** (misal: *Litigasi Komersial, Perdata, Pidana Khusus*).
4. Tentukan **Managing Partner** dan **Advokat Pelaksana (*Assigned Lawyer*)**.
5. Sistem akan otomatis menerbitkan **Nomor Registrasi Perkara Resmi** (Contoh: `MAT-2026-001`).

### 6.2 Matriks Para Pihak (*Parties Roster*)
* Pada halaman detail perkara, catat seluruh pihak terkait:
  * **Penggugat / Pemohon**
  * **Tergugat / Termohon**
  * **Turut Tergugat**
  * Kuasa Hukum Lawan (*Opposing Counsel*) dan Nama Majelis Hakim.

### 6.3 Berita Acara Kronologi Fakta Hukum (*Chronology of Events*)
1. Buka tab **Kronologi Fakta** pada detail perkara.
2. Klik **+ Catat Kronologi**.
3. Masukkan tanggal kejadian, judul peristiwa, uraian fakta kronologis, saksi terkait, dan tautkan ke alat bukti pendukung.
4. Tentukan tingkat kepentingan: `KRUSIAL (P-1)`, `PENTING`, atau `FAKTUAL`.
5. Klik **Cetak PDF Kronologi** untuk mengunduh dokumen berita acara siap sidang.

### 6.4 Manajemen Daftar Alat Bukti (*Evidence Checklist*)
* Catat seluruh bukti surat/dokumen dengan penomoran resmi (Contoh: Bukti P-1 s/d P-20 untuk Penggugat, atau Bukti T-1 s/d T-15 untuk Tergugat).
* Pantau status kesiapan: *Tersedia Asli*, *Legalisir / Posita*, atau *Draf Permohonan*.

### 6.5 Kalender Agenda Persidangan (*Court Hearing Schedule*)
* Daftarkan jadwal sidang pengadilan, mediasi, atau pemeriksaan setempat (PS).
* Sistem akan memicu notifikasi tenggat waktu (*deadline reminder*) kepada tim kuasa hukum H-3 dan H-1 sebelum agenda persidangan.

### 6.6 Unduh Laporan Perkembangan Perkara PDF (*Matter Status Report*)
* Klik tombol **Cetak Laporan Perkara (PDF)** di pojok kanan atas detail perkara.
* Sistem merender laporan eksekutif lengkap dengan kop surat resmi firma, rincian pihak, jadwal sidang, alat bukti, dan kolom persetujuan Partner.

---

## 7. BAB 5: MANAJEMEN TUGAS & BEBAN KERJA (TASKS & COLLABORATION)

Modul Tugas (`/tasks`) memastikan seluruh instruksi kerja dan tenggat waktu peradilan terlaksana secara terukur.

### 7.1 Pendelegasian Tugas (*Task Assignment*)
1. Akses menu **Tugas** (`/tasks`) ➔ Klik **Buat Tugas Baru**.
2. Masukkan judul instruksi (Contoh: *Penyusunan Draf Jawaban Gugatan & Eksepsi Kompetensi Relatif*).
3. Pilih perkara terkait dan tunjuk advokat pelaksana (*Assignee*).
4. Tentukan tingkat urgensi (*Urgent, High, Normal*) dan tanggal jatuh tempo.
5. Klik **Tugaskan**.

### 7.2 Modal Detail Tugas & Cockpit Siku Simetris
* Klik salah satu baris tugas untuk membuka modal cockpit terpadu.
* Pada modal ini, pengguna dapat:
  * Mengubah status: `Belum Dimulai` ➔ `Sedang Dikerjakan` ➔ `Dalam Review` ➔ `Selesai`.
  * Menulis catatan internal dan komentar tim.
  * Memberikan reaksi emoji dan melampirkan berkas draf kerja.

---

## 8. BAB 6: REPOSITORI DOKUMEN, PERSETUJUAN & TANDA TANGAN ELEKTRONIK (DMS & E-SIGN)

Sistem Repositori Dokumen (`/documents`) menyediakan manajemen berkas hukum berstandar perbankan dan integritas kriptografi.

### 8.1 Manajemen Berkas & Versi Dokumen (*Document Versioning*)
* Unggah berkas surat kuasa, gugatan, atau perjanjian (PDF/DOCX).
* Setiap revisi baru akan tersimpan sebagai versi bertingkat (`v1.0`, `v2.0`, `v3.0`), menjaga riwayat perubahan berkas asli.

### 8.2 Alur Persetujuan Dokumen (*Document Approval Workflow*)
* Draf dokumen penting dapat dikirimkan ke Partner untuk melalui tahapan peninjauan (*Review*), revisi (*Revision*), hingga disetujui resmi (*Approved*).

### 8.3 Tanda Tangan Digital Resmi (*Digital Signature & UU ITE Compliance*)
1. Pilih dokumen yang telah disetujui ➔ Klik **Minta Tanda Tangan Digital**.
2. Tentukan metode pengesahan: **Berurutan (*Sequential*)** atau **Bersamaan (*Parallel*)**.
3. Masukkan nama penandatangan, alamat email, dan urutan tandatangan.
4. Para pihak menandatangani melalui tautan verifikasi aman.
5. Setelah seluruh pihak menandatangani, sistem otomatis membubuhkan **Seal of Digital Authenticity** dan menerbitkan **Sertifikat Pengesahan Tanda Tangan Digital PDF** yang memuat:
   * Kode Verifikasi Unik Dokumen
   * Nilai Hash Kriptografi SHA-256
   * Log Audit Waktu & IP Address
   * Embedded High-Res QR Code Verifikasi Online

---

## 9. BAB 7: SMART LEGAL DRAFTING & TEMPLATE DOKUMEN DINAMIS (/templates)

Modul Smart Drafting (`/templates`) mengotomatisasi standardisasi draf instrumen hukum menggunakan variabel substitusi dinamis.

### 9.1 Mengunggah Template DOCX Baru
1. Akses menu **Template Dokumen** (`/templates`) ➔ Klik **Unggah Template DOCX**.
2. Masukkan Nama Template (misal: *Surat Kuasa Khusus Litigasi Perdata*).
3. Pilih Kategori (misal: *Surat Kuasa Khusus, Gugatan, Somasi, Kontrak Bisnis*).
4. Pilih berkas Microsoft Word (`.docx`) yang memuat tag variabel seperti `{{NAMA_KLIEN}}`, `{{NOMOR_PERKARA}}`, `{{ALAMAT_PIHAK}}`.
5. Klik **Simpan Template**. Sistem secara otomatis memindai integritas berkas dan mengekstrak daftar variabel.

### 9.2 Menghasilkan Dokumen Baru dari Template (*Draft Perkara*)
1. Pada kartu template yang diinginkan, klik **Draft Perkara**.
2. Pilih perkara tujuan.
3. Masukkan nilai untuk masing-masing variabel placeholder yang disediakan.
4. Klik **Hasilkan Dokumen**.
5. Sistem akan menerbitkan berkas dokumen draf final yang siap diunduh atau dimasukkan ke alur persetujuan.

---

## 10. BAB 8: TATA KELOLA, KORESPONDENSI & KEBIJAKAN FIRMA (GOVERNANCE)

Modul Tata Kelola (`/governance`) mencatat surat menyurat resmi dan kebijakan tata tertib firma.

### 10.1 Pencatatan Korespondensi Resmi
1. Akses menu **Tata Kelola** (`/governance`) ➔ Klik **Catat Korespondensi Resmi**.
2. Pilih Tipe: **Surat Masuk**, **Surat Keluar**, **Memo Internal**, atau **Email Perkara Resmi**.
3. Masukkan nomor surat, perihal, instansi pengirim/penerima, dan tanggal surat.
4. Lampirkan berkas pindaian (*scan*) surat asli.
5. Klik **Simpan Korespondensi**.

### 10.2 Detail Korespondensi Berstandar Eksekutif
* Klik pada nomor korespondensi untuk melihat ikhtisar status pengiriman, catatan penanganan, dan disposisi tindak lanjut kuasa hukum.

---

## 11. BAB 9: KEUANGAN, PENAGIHAN & KAS MASUK (FINANCE & BILLING)

Modul Keuangan (`/finance`) mengelola seluruh siklus finansial firma mulai dari penawaran biaya, faktur tagihan, penerimaan pembayaran kasir, hingga pengeluaran operasional perkara.

### 11.1 Pembuatan Surat Penawaran Biaya Jasa Hukum (*Quotation / Fee Proposal*)
1. Pada menu **Keuangan**, klik tombol **Quotation**.
2. Pilih Perkara Terkait dan Klien Penerima.
3. Tuliskan **Ruang Lingkup Jasa Hukum (*Scope of Legal Services*)**.
4. Tambahkan rincian tahapan honorarium advokat (misal: *Tahap Non-Litigasi, Sidang Pengadilan Tingkat Pertama*).
5. Klik **Simpan Data**.
6. Klik ikon unduh PDF untuk mencetak **Surat Penawaran Biaya Resmi (Quotation PDF)** berstempel firma dan klausul persetujuan klien.

### 11.2 Penerbitan Faktur Tagihan Klien (*Invoice Billing*)
1. Klik tombol **Buat Invoice**.
2. Masukkan Perkara Terkait, Klien Pembayar, Tanggal Terbit, dan Tanggal Jatuh Tempo.
3. Tambahkan baris tagihan profesional: *Deskripsi Jasa, Kuantitas, dan Tarif Satuan*.
4. Masukkan diskon potongan (jika ada) dan tarif PPN (default: 11%).
5. Periksa **Live Calculation Preview Card** (Subtotal, Diskon, PPN, Grand Total).
6. Klik **Simpan Data**. Faktur tersimpan dalam status `Draft`.

### 11.3 Transisi Status & Pengiriman Invoice
* Pada daftar invoice, klik tombol **Kirim** untuk mengubah status menjadi `Sent` (Terkirim).
* Klik ikon berkas PDF untuk mengunduh **Faktur Tagihan Resmi (Invoice PDF)** yang memuat rincian rekening bank resmi BCA firma.

### 11.4 Pencatatan Penerimaan Pembayaran & Alokasi Tagihan
1. Saat klien melakukan transfer pembayaran, klik tombol **Pembayaran**.
2. Masukkan nominal uang yang diterima, metode pembayaran (Transfer Bank / Tunai), serta tanggal & waktu transaksi.
3. Unggah bukti transfer bank.
4. Pada bagian **Alokasi ke Invoice**, masukkan nominal pembayaran ke nomor invoice terkait.
5. Klik **Simpan Data**. Sistem otomatis memotong sisa tagihan (*outstanding*) invoice dan memperbarui status menjadi `Paid` (Lunas) jika tagihan telah tertutup penuh.

### 11.5 Pencetakan Kuitansi Resmi Pembayaran (*Payment Receipt PDF*)
* Klik nominal pembayaran pada ledger untuk membuka detail pembayaran.
* Klik tombol **Cetak Kuitansi Resmi (PDF)**.
* Sistem merender **Kuitansi Tanda Terima Sah** berbingkai ganda emas, lengkap dengan konversi kalimat terbilang Rupiah otomatis, stempel `LUNAS / SETTLED`, dan tanda tangan pejabat keuangan.

### 11.6 Pencatatan Biaya Perkara & Pengeluaran (*Disbursements / Expenses*)
1. Klik tombol **Catat Biaya**.
2. Pilih perkara terkait, kategori biaya (Biaya Pendaftaran Pengadilan PNBP, Transportasi Sidang, Saksi Ahli, Notaris), tanggal biaya, dan nominal.
3. Lampirkan bukti kuitansi / struk pengeluaran.
4. Klik **Simpan Data**. Pengeluaran akan langsung diperhitungkan dalam kalkulasi *Net Margin* perkara.

### 11.7 Koreksi (*Reversal*) dan Pengembalian Dana (*Refund*)
* Jika terjadi salah transfer atau kelebihan bayar, pejabat berwenang dapat menekan tombol **Koreksi** atau **Refund** pada ledger pembayaran dengan menyertakan alasan pembatalan resmi.

---

## 12. BAB 10: JEJAK AUDIT, KEAMANAN & LEGAL HOLD COMPLIANCE

Modul Audit (`/audit`) menjamin seluruh akuntabilitas hukum dan rekam jejak digital firma.

### 12.1 Log Audit Tidak Dapat Diubah (*Immutable Audit Trail*)
* Seluruh aktivitas sistem tercatat secara permanen:
  * Waktu persis kejadian (*Timestamp* WIB)
  * Nama pengguna & peran (*Actor & Role*)
  * Alamat IP & User Agent perangkat
  * Nilai data sebelum dan sesudah perubahan (*Old vs New Value Delta*)

### 12.2 Penegakan Pembekuan Berkas (*Legal Hold*)
* Jika suatu perkara ditetapkan dalam status *Legal Hold* oleh Managing Partner, sistem secara otomatis mengunci seluruh dokumen, catatan keuangan, dan kronologi fakta dari tindakan penghapusan atau modifikasi oleh pengguna mana pun.

---

## 13. BAB 11: PANDUAN PEMECAHAN MASALAH (TROUBLESHOOTING & FAQ)

### T: Mengapa invoice baru tidak bisa langsung dialokasikan pembayaran?
**J**: Invoice yang baru dibuat berstatus `Draft`. Anda harus meninjau dan menekan tombol **Kirim** (*Sent*) terlebih dahulu sebelum pembayaran dapat dialokasikan ke nomor faktur tersebut.

### T: Bagaimana jika saya lupa kata sandi akun saya?
**J**: Hubungi **RPK Administrator** (`contact@rpklawoffice.com`) atau gunakan fitur *Lupa Kata Sandi* pada halaman login untuk menerima tautan pemulihan sandi melalui email.

### T: Apakah berkas PDF yang diunduh memiliki keabsahan hukum?
**J**: Ya. Seluruh template PDF yang dihasilkan (Invoice, Kuitansi, Laporan Perkara, Berita Acara Kronologi, dan Sertifikat Tanda Tangan) telah dirancang sesuai standar formal hukum Indonesia dan memuat identitas integritas digital firma hukum Roni, Putra & Kusumah.

---

*Buku Panduan Pengguna ini diterbitkan dan disahkan oleh:*  
**MANAJEMEN FIRMA HUKUM RONI, PUTRA & KUSUMAH (RPK LAW FIRM)**  
*Menara Hukum RPK, Lantai 5, Jl. LLRE Martadinata No. 88, Bandung 40115*
