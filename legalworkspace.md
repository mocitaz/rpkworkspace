# RPK LEGAL WORKSPACE

## Buku Panduan Pengguna dan Operasional Sistem

**Integrated Law Firm Practice Management System**  
**Roni, Putra & Kusumah Law Firm**

| Informasi dokumen | Keterangan |
| --- | --- |
| Versi panduan | 3.0 |
| Tanggal revisi | 6 September 2026 |
| Cakupan sistem | Build operasional September 2026 |
| Pemilik dokumen | Manajemen RPK Law Firm |
| Pengelola | Legal Operations dan Administrator Sistem |
| Klasifikasi | Internal — Rahasia dan Terbatas |
| Status | Panduan operasional; tunduk pada pembaruan aplikasi dan kebijakan firma |

> **Pemberitahuan kerahasiaan**  
> Dokumen ini memuat prosedur internal, struktur otorisasi, serta tata kerja RPK Law Firm. Pengguna dilarang menyebarkan dokumen, tangkapan layar, tautan privat, token kalender, data klien, data perkara, dan data keuangan kepada pihak yang tidak berwenang.

---

## Kontrol Dokumen

### Riwayat revisi

| Versi | Tanggal | Ringkasan perubahan |
| --- | --- | --- |
| 1.0 | — | Penerbitan awal panduan pengguna. |
| 2.0 | 24 Agustus 2026 | Penataan ulang manual dan penambahan lembar kontrol. |
| 3.0 | 6 September 2026 | Audit menyeluruh terhadap implementasi aktual; koreksi klaim, rute, peran, keamanan, kalender, reminder, queue, tata kelola, keuangan, dan penambahan modul Email. |

### Siklus pemeliharaan

Panduan ditinjau ketika terjadi perubahan modul, permission, alur persetujuan, integrasi pihak ketiga, kebijakan keamanan, atau proses deployment. Pemilik proses wajib memastikan tangkapan layar dan istilah antarmuka tetap sesuai dengan versi produksi.

### Hierarki acuan

Jika terdapat perbedaan antara panduan dan sistem, urutan acuan yang berlaku adalah:

1. Kebijakan tertulis dan keputusan resmi Manajemen Firma.
2. Hak akses serta validasi yang aktif pada sistem produksi.
3. Prosedur dalam panduan versi terbaru.
4. Kebiasaan operasional tidak tertulis.

> Panduan ini bukan opini hukum dan tidak menyatakan bahwa setiap keluaran elektronik otomatis memenuhi seluruh syarat pembuktian atau tanda tangan elektronik tersertifikasi. Penilaian keabsahan tetap memperhatikan jenis dokumen, metode penandatanganan, kewenangan pihak, kebijakan firma, dan hukum yang berlaku.

---

## Daftar Isi

1. [Pendahuluan](#1-pendahuluan)
2. [Memulai dan Mengamankan Akun](#2-memulai-dan-mengamankan-akun)
3. [Navigasi, Dashboard, Pencarian, dan Notifikasi](#3-navigasi-dashboard-pencarian-dan-notifikasi)
4. [Pengguna, Role, dan Permission](#4-pengguna-role-dan-permission)
5. [Klien dan Kontak](#5-klien-dan-kontak)
6. [Perkara](#6-perkara)
7. [Tugas dan Kolaborasi](#7-tugas-dan-kolaborasi)
8. [Kalender dan Sinkronisasi Google Calendar](#8-kalender-dan-sinkronisasi-google-calendar)
9. [Dokumen, Persetujuan, dan Tanda Tangan](#9-dokumen-persetujuan-dan-tanda-tangan)
10. [Email Firma](#10-email-firma)
11. [Tata Kelola](#11-tata-kelola)
12. [Keuangan](#12-keuangan)
13. [Audit, Keamanan Data, dan Retensi](#13-audit-keamanan-data-dan-retensi)
14. [Notifikasi, Scheduler, dan Queue](#14-notifikasi-scheduler-dan-queue)
15. [Prosedur Operasional Berkala](#15-prosedur-operasional-berkala)
16. [Troubleshooting](#16-troubleshooting)
17. [Lampiran](#17-lampiran)

---

## 1. Pendahuluan

### 1.1 Tujuan

RPK Legal Workspace adalah pusat kerja digital firma untuk mengelola data klien, perkara, tugas, agenda, dokumen, komunikasi, tata kelola, dan transaksi keuangan. Panduan ini bertujuan:

- Menyeragamkan cara pencatatan dan pemutakhiran data.
- Mengurangi ketergantungan pada informasi yang tersebar di chat, email pribadi, atau perangkat lokal.
- Menjelaskan batas kewenangan setiap peran.
- Menjadi bahan onboarding, supervisi, audit, dan pemulihan kendala.
- Menetapkan kontrol minimum sebelum data dikirim, disahkan, dihapus, atau diekspor.

### 1.2 Prinsip penggunaan

Setiap pengguna wajib mengikuti lima prinsip berikut:

1. **Satu sumber data.** Catatan resmi dibuat pada modul yang sesuai, bukan hanya melalui percakapan informal.
2. **Akses minimum.** Gunakan data sesuai penugasan dan permission yang diberikan.
3. **Verifikasi sebelum aksi.** Periksa penerima, perkara, nominal, tanggal, status, dan lampiran sebelum menyimpan atau mengirim.
4. **Jejak yang dapat dijelaskan.** Alasan koreksi, pembatalan, refund, revisi, dan keputusan harus jelas.
5. **Tidak membagikan rahasia.** Jangan menyalin data ke layanan publik atau perangkat yang tidak disetujui.

### 1.3 Lingkungan dan alamat halaman

Produksi diakses melalui domain resmi yang ditetapkan firma. Path dalam panduan, misalnya `/matters`, ditambahkan setelah domain aplikasi. Lingkungan lokal atau staging dapat memakai domain berbeda dan tidak boleh digunakan untuk data produksi tanpa persetujuan.

### 1.4 Istilah instruksi

- **Klik** berarti memilih tombol atau tautan pada antarmuka.
- **Simpan** membuat atau memperbarui data, tetapi tidak selalu berarti menerbitkan atau menyetujui.
- **Kirim** dapat memicu proses queue; keberhasilan menekan tombol belum selalu berarti pesan telah diterima.
- **Unduh** menghasilkan atau mengambil berkas dari sistem.
- **Hapus** adalah tindakan material dan harus dilakukan hanya terhadap target yang telah diverifikasi.

---

## 2. Memulai dan Mengamankan Akun

### 2.1 Masuk ke sistem

1. Buka portal resmi RPK Workspace.
2. Masukkan email pengguna yang terdaftar.
3. Masukkan kata sandi atau gunakan passkey apabila telah dikonfigurasi.
4. Selesaikan verifikasi dua faktor jika diminta.
5. Pastikan nama dan avatar pada menu akun sesuai identitas Anda.

Jangan menggunakan kredensial bersama. Akun harus mewakili satu orang agar audit trail dapat dipertanggungjawabkan.

### 2.2 Verifikasi email dan pemulihan kata sandi

Alamat email perlu diverifikasi agar fitur yang dilindungi middleware verifikasi dapat digunakan. Jika lupa kata sandi, gunakan **Lupa Kata Sandi** pada halaman login. Periksa folder spam dan pastikan queue serta konfigurasi mail berfungsi apabila email tidak diterima.

### 2.3 Pengaturan profil

Menu **Pengaturan** mencakup:

- **Profil & Identitas** (`/settings/profile`) untuk data profil dan avatar.
- **Keamanan & Autentikasi** (`/settings/security`) untuk kata sandi, 2FA, dan passkey.
- **Tema & Tampilan** (`/settings/appearance`) untuk mode terang, gelap, atau mengikuti sistem.

### 2.4 Kata sandi, 2FA, dan passkey

- Gunakan kata sandi unik yang tidak dipakai pada layanan lain.
- Aktifkan TOTP 2FA menggunakan aplikasi autentikator yang disetujui.
- Simpan recovery code di media yang aman dan terpisah dari perangkat utama.
- Passkey dapat menggunakan kemampuan keamanan perangkat seperti Touch ID, Face ID, atau Windows Hello, tergantung dukungan perangkat dan browser.
- Hapus passkey milik perangkat yang hilang atau tidak lagi digunakan.

### 2.5 Respons insiden akun

Jika mencurigai penyalahgunaan akun:

1. Ganti kata sandi secepatnya.
2. Cabut atau hapus autentikator yang tidak dikenali.
3. Laporkan waktu, perangkat, dan aktivitas mencurigakan kepada Administrator.
4. Administrator meninjau audit log dan menonaktifkan akun bila diperlukan.

---

## 3. Navigasi, Dashboard, Pencarian, dan Notifikasi

### 3.1 Struktur navigasi

Menu ditampilkan berdasarkan permission pengguna:

- **Menu Utama:** Dashboard.
- **Manajemen Perkara:** Perkara, Tugas, Kalender, Dokumen.
- **Klien & Komunikasi:** Klien, Kontak, Email.
- **Operasional Firma:** Keuangan dan Tata Kelola.
- **Administrasi:** Pengaturan, Pengguna & Akses, dan Audit Log.

Tidak tampilnya menu biasanya menunjukkan permission belum diberikan, akun belum aktif, atau cache aplikasi perlu diperbarui setelah deployment.

### 3.2 Dashboard

Dashboard (`/dashboard`) menyajikan ikhtisar sesuai akses pengguna, termasuk perkara, tugas, tenggat, dokumen, agenda, dan informasi operasional. Angka dashboard adalah ringkasan; gunakan halaman sumber untuk pemeriksaan rinci sebelum mengambil keputusan.

### 3.3 Pencarian global

Gunakan kolom pencarian pada topbar atau pintasan yang ditampilkan antarmuka untuk mencari entitas yang didukung. Gunakan nomor perkara, nama klien, judul dokumen, atau kata kunci yang spesifik. Hasil pencarian tetap tunduk pada permission dan visibilitas perkara.

### 3.4 Notifikasi aplikasi

Notifikasi memberi tahu pengguna mengenai penugasan, review, reminder, pembayaran, perubahan perkara, dokumen, dan kejadian relevan lainnya. Pengguna dapat menandai satu atau seluruh notifikasi sebagai telah dibaca.

Notifikasi bukan pengganti pemeriksaan daftar tugas dan kalender. Apabila email gagal, notifikasi aplikasi dapat tetap tersedia, bergantung jenis notifikasinya.

### 3.5 Chat internal

Menu Chat (`/chat`) digunakan untuk komunikasi internal antarpengguna aktif. Pesan mendukung status baca dan reaksi. Keputusan atau instruksi material tetap harus dicatat pada tugas, catatan perkara, dokumen, atau korespondensi agar tidak hanya tersimpan dalam percakapan.

---

## 4. Pengguna, Role, dan Permission

### 4.1 Pengelolaan personel

Pengguna dengan `admin.users.manage` dapat membuka **Pengguna & Akses** (`/admin/users`) untuk:

- Menambah akun personel.
- Melihat kartu pegawai dan profil.
- Memperbarui data pekerjaan dan status akun.
- Menetapkan satu atau lebih role.
- Meninjau matriks permission.
- Menonaktifkan atau menghapus akun sesuai kontrol yang tersedia.

Sebelum membuat akun, pastikan email benar, jabatan sesuai, dan role tidak melebihi kebutuhan kerja.

### 4.2 Role standar

Sistem menyediakan baseline role:

- Administrator Sistem.
- Managing Partner.
- Partner.
- Associate.
- Finance & Billing Specialist.
- Magang (Legal Intern).

Role dapat membawa banyak permission. Seorang pengguna dapat memiliki beberapa role; akses efektif merupakan gabungan permission dari seluruh role tersebut.

### 4.3 Prinsip perubahan permission

1. Gunakan least privilege.
2. Hindari memberi role Administrator untuk kebutuhan sementara.
3. Tinjau akses Finance, email eksternal, dokumen terbatas, audit, dan Legal Hold secara khusus.
4. Setelah pencabutan akses, bersihkan notifikasi lama yang sudah tidak berwenang menggunakan prosedur administrator.
5. Catat alasan perubahan role pada proses administrasi internal.

> **Temuan audit:** baseline saat ini memberikan `email.send` kepada Associate dan Intern, serta `task.manage` kepada Intern. Manajemen perlu mengonfirmasi apakah kewenangan tersebut memang dikehendaki. Seeder permission bersifat menentukan ulang matriks role; perubahan manual dapat tertimpa ketika seeder dijalankan kembali.

### 4.4 Penonaktifan pengguna

Saat personel keluar atau akses harus dihentikan:

1. Alihkan tanggung jawab perkara dan tugas.
2. Pastikan dokumen kerja telah masuk repositori.
3. Nonaktifkan akun.
4. Tinjau kalender, passkey, dan integrasi pribadi.
5. Tinjau notifikasi atau data sensitif yang masih terasosiasi.
6. Jangan menghapus rekam audit yang diperlukan untuk pertanggungjawaban.

---

## 5. Klien dan Kontak

### 5.1 Membuat klien

Pada **Klien** (`/clients`), pilih **Tambah Klien** dan lengkapi identitas yang tersedia, seperti nama tampilan, nama legal, tipe klien, identitas pajak, alamat, dan data relevan lain. Gunakan nama legal sesuai dokumen sumber; jangan memasukkan nama singkatan sebagai nama badan hukum resmi.

### 5.2 Pemeriksaan sebelum menyimpan

- Pastikan klien belum terdaftar dengan variasi nama lain.
- Verifikasi NPWP atau identitas lain dari dokumen sumber.
- Periksa ejaan nama direksi, pengurus, dan alamat.
- Hindari menyimpan data pribadi yang tidak diperlukan.

### 5.3 Dokumen kepatuhan

Dokumen kepatuhan dapat ditambah, diperbarui, atau dihapus sesuai permission. Contoh dokumen meliputi akta, dokumen pengesahan, NIB, NPWP, dan identitas pengurus. Status dan tanggal kedaluwarsa harus diperbarui agar reminder kepatuhan bermakna.

### 5.4 Buku kontak

Menu **Kontak** (`/contacts`) menyimpan pihak eksternal, pengadilan, kuasa hukum, vendor, dan kontak lain. Gunakan satu record per identitas dan perbarui email sebelum digunakan sebagai penerima komunikasi.

### 5.5 Pemisahan klien dan kontak

Klien adalah pihak pemberi pekerjaan atau entitas utama, sedangkan kontak adalah individu atau organisasi yang dapat terlibat dalam komunikasi. Jangan membuat klien baru hanya untuk menyimpan alamat email penerima.

---

## 6. Perkara

### 6.1 Membuka perkara

1. Buka **Perkara** (`/matters`).
2. Pilih **Buka Perkara Baru**.
3. Tentukan klien, judul, jenis perkara, bidang praktik, prioritas, kerahasiaan, partner penanggung jawab, dan data lain yang tersedia.
4. Jalankan conflict check sesuai kebijakan firma sebelum penerimaan final.
5. Simpan dan periksa nomor perkara yang dihasilkan sistem.

Format nomor aktual mengikuti generator sistem, misalnya `RPK-2026-0001`; jangan menetapkan nomor manual di luar alur resmi.

### 6.2 Visibilitas perkara

Perkara standar dapat terlihat sesuai permission. Perkara restricted/rahasia dibatasi berdasarkan akses seluruh perkara, penanggung jawab, supervising lawyer, atau keanggotaan perkara. Jangan mengandalkan penyembunyian menu sebagai satu-satunya kontrol; akses server tetap melakukan otorisasi.

### 6.3 Tim dan tanggung jawab

Tetapkan responsible partner, supervising lawyer, serta anggota perkara dengan tepat. Perubahan tim memengaruhi visibilitas, notifikasi, kalender, dan tanggung jawab tindak lanjut.

### 6.4 Para pihak

Catat klien, pihak lawan, kuasa hukum, saksi, dan pihak lain menggunakan peran yang tepat. Data ini penting untuk conflict check dan konteks perkara. Hindari duplikasi serta variasi ejaan yang tidak perlu.

### 6.5 Kronologi

Kronologi mencatat tanggal, judul, uraian, tingkat kepentingan, dan referensi pendukung. Gunakan fakta terverifikasi, bedakan fakta dari analisis, dan hubungkan alat bukti bila tersedia. Kronologi dapat diekspor ke PDF.

### 6.6 Alat bukti

Catat identitas, nomor, deskripsi, dan status kesiapan bukti. Perubahan status harus didukung pemeriksaan fisik atau digital. Penghapusan hanya dilakukan jika salah input dan tidak melanggar Legal Hold.

### 6.7 Tenggat, agenda, dan hasil

Gunakan tenggat untuk batas waktu formal dan event untuk agenda seperti sidang, mediasi, rapat, atau pemeriksaan. Setelah agenda selesai, catat outcome serta checklist agar kalender dan laporan perkara tetap akurat.

### 6.8 Catatan dan laporan

Catatan perkara digunakan untuk konteks internal yang relevan. Laporan status perkara dapat diunduh melalui fungsi PDF yang tersedia. Periksa isi sebelum dikirim kepada klien karena laporan dapat memuat informasi internal.

---

## 7. Tugas dan Kolaborasi

### 7.1 Membuat tugas

1. Buka **Tugas** (`/tasks`) dan pilih pembuatan tugas.
2. Isi judul yang berorientasi hasil, bukan instruksi yang ambigu.
3. Kaitkan perkara bila relevan.
4. Tetapkan assignee, reporter, reviewer, prioritas, dan tenggat.
5. Tambahkan checklist atau konteks pendukung.
6. Simpan dan pastikan penerima tugas benar.

Contoh judul yang baik: **Finalisasi Draf Jawaban dan Eksepsi untuk Review Partner**.

### 7.2 Siklus status

Status operasional mencakup `todo`, proses pengerjaan, review, selesai, atau dibatalkan sesuai pilihan antarmuka. Gunakan alur submit review, approve, atau request revision agar keputusan reviewer tercatat.

### 7.3 Komentar dan kolaborasi

Komentar mendukung diskusi, mention, pin, reaksi, dan penghapusan sesuai kewenangan. Instruksi penting sebaiknya ditulis jelas dan tidak hanya menggunakan reaksi emoji.

### 7.4 Reminder tugas lewat tenggat

Scheduler memeriksa setiap jam, tetapi reminder hanya dijadwalkan pada:

- H+1 dan H+3 kepada assignee.
- H+7 kepada assignee serta reporter apabila berbeda.
- H+14 dan setiap kelipatan tujuh hari berikutnya sampai tugas selesai, dibatalkan, atau tenggat diperbarui.

Sistem menyimpan delivery untuk mencegah pengiriman ganda pada siklus yang sama. Status `completed` dan `cancelled` dikecualikan.

### 7.5 Praktik kerja

- Perbarui status pada hari yang sama.
- Jangan mengubah deadline hanya untuk menghilangkan status terlambat tanpa persetujuan.
- Gunakan reviewer untuk keluaran yang membutuhkan kontrol kualitas.
- Tutup atau batalkan tugas yang tidak lagi berlaku.

---

## 8. Kalender dan Sinkronisasi Google Calendar

### 8.1 Tampilan kalender

Kalender (`/calendar`) menggabungkan sidang/agenda, tenggat perkara, dan tugas terkait sesuai akses pengguna. Sabtu, Minggu, serta hari libur nasional Indonesia ditandai untuk membantu perencanaan; penandaan hari libur tidak otomatis mengubah tenggat hukum.

### 8.2 Feed ICS

Pengguna dapat:

- Mengunduh kalender manual `.ics`.
- Berlangganan melalui URL feed privat untuk Apple Calendar, Google Calendar, atau Outlook.
- Membuat ulang token kalender apabila tautan diduga bocor.

URL feed adalah rahasia karena dapat memberi akses baca terhadap jadwal yang diizinkan. Jangan membagikannya di grup publik atau memasukkannya ke dokumentasi terbuka.

### 8.3 Google Calendar OAuth

Jika integrasi telah dikonfigurasi oleh Administrator:

1. Pilih **Hubungkan Google Calendar**.
2. Masuk ke akun Google yang benar.
3. Berikan consent untuk scope yang ditampilkan.
4. Sistem membuat kalender RPK khusus dan memulai sinkronisasi.
5. Pilih sinkronisasi agenda, tenggat, dan/atau tugas.

Mode privasi:

- **Lengkap:** menampilkan nomor perkara dan judul sesuai implementasi.
- **Terbatas:** menampilkan jenis aktivitas dengan detail minimum.
- **Privat:** menampilkan blok kesibukan tanpa rincian sensitif.

### 8.4 Sinkronisasi dan pencabutan

Sinkronisasi otomatis dijalankan setiap 15 menit. Tombol **Sinkronkan Sekarang** dapat digunakan untuk kebutuhan segera. Jika terjadi error, periksa email akun, waktu sinkron terakhir, dan pesan error. Gunakan **Putuskan** untuk mencabut koneksi sistem; bila diperlukan, cabut pula akses aplikasi melalui pengaturan akun Google.

### 8.5 Mode Testing Google

Jika aplikasi OAuth masih berstatus Testing, hanya email yang dimasukkan sebagai test user pada Google Cloud Console yang dapat menyambungkan akun. Pengguna lain akan menerima `403 access_denied` sampai ditambahkan sebagai tester atau aplikasi dipublikasikan dan memenuhi persyaratan verifikasi Google.

---

## 9. Dokumen, Persetujuan, dan Tanda Tangan

### 9.1 Repositori dokumen

Menu **Dokumen** (`/documents`) menyimpan dokumen berdasarkan perkara, klien, tipe, tingkat kerahasiaan, dan metadata lainnya. Hanya unggah berkas yang relevan dan telah diperiksa dari malware atau konten tidak sah.

### 9.2 Versi dokumen

Unggah revisi sebagai versi baru pada dokumen yang sama. Jangan membuat record baru hanya karena ada revisi kecil, kecuali dokumen memang berbeda secara substantif. Sistem memproses versi melalui queue untuk ekstraksi atau preview; status pemrosesan tidak selalu instan.

### 9.3 Preview dan unduh

Preview bergantung pada format serta keberhasilan pemrosesan. Jika preview belum tersedia, periksa status job dan coba proses ulang menggunakan kontrol yang disediakan. Unduhan tetap tunduk pada permission `document.download`.

### 9.4 Persetujuan

Pengguna dapat mengajukan approval kepada reviewer yang berwenang. Reviewer memberikan keputusan dan catatan. Revisi setelah approval perlu melalui kontrol ulang sesuai tingkat perubahan dan kebijakan firma.

### 9.5 Permintaan tanda tangan

1. Pilih dokumen dan buat signature request.
2. Tentukan penandatangan serta urutannya.
3. Sistem mengirim tautan penandatanganan.
4. Pengingat dapat dikirim sesuai kewenangan.
5. Setelah lengkap, sistem menghasilkan artefak final dan sertifikat/verifikasi yang tersedia.

Tautan publik penandatanganan dan verifikasi harus diperlakukan sebagai data sensitif. Jangan mengirimkannya ke penerima yang tidak sesuai.

### 9.6 Batas klaim legal

Hash, timestamp, alamat IP, QR, atau sertifikat aplikasi mendukung integritas dan penelusuran, tetapi tidak dengan sendirinya menjadikan tanda tangan sebagai tanda tangan elektronik tersertifikasi. Untuk dokumen yang mensyaratkan tingkat jaminan tertentu, gunakan penyelenggara sertifikasi elektronik dan prosedur hukum yang disetujui firma.

### 9.7 Template dokumen

Rute `/templates` saat ini mengarah ke modul Dokumen. Gunakan fasilitas template/generasi yang tersedia dari area dokumen; jangan mengandalkan panduan lama yang menyebut halaman Template terpisah tanpa memeriksa antarmuka aktual.

---

## 10. Email Firma

### 10.1 Tujuan

Email (`/email`) adalah workspace pengiriman komunikasi eksternal melalui alamat firma yang dikonfigurasi pada mail server. Modul ini bukan pengganti inbox penuh seperti Gmail; versi saat ini berfokus pada penyusunan, draft, queue, pengiriman, dan register email keluar.

### 10.2 Menulis email

1. Pilih **Tulis Email Baru**.
2. Periksa alamat **Dari** yang dikunci oleh konfigurasi sistem.
3. Isi **Kepada**, serta CC/BCC bila diperlukan. Beberapa alamat dapat dipisahkan dengan spasi, koma, atau titik koma.
4. Isi subjek yang ringkas dan spesifik.
5. Tulis body profesional; hindari data rahasia yang tidak diperlukan.
6. Pilih perkara dan klien terkait bila komunikasi berhubungan dengan penugasan.
7. Pilih **Simpan Draft** atau **Kirim Email**.

### 10.3 Status email

- **Draft:** tersimpan dan belum dijadwalkan untuk dikirim.
- **Dalam antrean:** job menunggu atau sedang diproses queue.
- **Terkirim:** mailer tidak melaporkan kegagalan saat pengiriman.
- **Gagal:** terjadi error dan pesan teknis disimpan untuk diagnosis.

Status Terkirim menunjukkan aplikasi berhasil menyerahkan pesan melalui mailer, bukan jaminan penerima telah membaca atau bahwa server tujuan tidak akan melakukan bounce setelahnya.

### 10.4 Integrasi perkara

Email yang dikirim dengan perkara terkait otomatis dicatat sebagai korespondensi keluar bersumber email. Pilih perkara dengan cermat karena pencatatan ini menjadi bagian dari register tata kelola.

### 10.5 Visibilitas dan keterbatasan

Pengguna dengan `email.view` dapat membuka modul. Tanpa `email.manage`, pengguna hanya melihat email yang dibuat sendiri. Pengguna dengan `email.manage` dapat melihat register yang lebih luas. Versi saat ini belum menyediakan inbox percakapan lengkap, reply/forward thread, penjadwalan kirim, tracking buka, atau lampiran langsung dari composer kecuali fitur tersebut kemudian ditambahkan.

### 10.6 Checklist sebelum kirim

- Pastikan domain dan ejaan penerima benar.
- Gunakan BCC untuk daftar penerima yang tidak boleh saling melihat alamat.
- Periksa privilege komunikasi dengan klien atau pihak lawan.
- Pastikan subjek tidak mengungkap data sensitif secara berlebihan.
- Kaitkan perkara hanya jika benar.
- Untuk dokumen, gunakan mekanisme lampiran yang telah disetujui firma sampai composer mendukung lampiran terkontrol.

---

## 11. Tata Kelola

### 11.1 Korespondensi resmi

Pada **Tata Kelola** (`/governance`), catat surat masuk, surat keluar, memo, atau email perkara. Isi perkara, arah, sumber, subjek, pengirim, penerima, waktu, ringkasan, dan dokumen terkait secara akurat.

Lampiran korespondensi harus berasal dari perkara yang sama. Bukti finansial bertipe khusus tidak ditampilkan sebagai pilihan dokumen umum untuk mencegah kebocoran data lintas modul.

### 11.2 Conflict of Interest Check

1. Masukkan calon klien dan seluruh nama pihak yang relevan.
2. Gunakan pemindaian awal untuk melihat kemungkinan kecocokan.
3. Telaah hasil; kesamaan nama bukan otomatis konflik.
4. Simpan pemeriksaan resmi.
5. Reviewer berwenang menetapkan keputusan dan catatan.
6. Unduh sertifikat jika diperlukan.

Hasil conflict check berlaku sesuai masa yang ditampilkan sistem dan perlu diperbarui jika pihak, afiliasi, atau ruang lingkup berubah.

### 11.3 Legal Hold

Legal Hold mencegah penghapusan data tertentu ketika perkara harus dipertahankan. Hanya pengguna dengan `archive.legal_hold.manage` yang dapat memasang atau melepas hold.

> **Koreksi audit:** panduan lama menyatakan Legal Hold mengunci seluruh perubahan dan penghapusan oleh semua pengguna termasuk Administrator. Implementasi aktual terutama menegakkan pembatasan pada operasi penghapusan/arsip dan tindakan tertentu yang dilindungi. Jangan menyimpulkan bahwa setiap field otomatis tidak dapat diedit; verifikasi kontrol pada operasi yang digunakan.

### 11.4 Arsip dan handover

Perkara dapat diarsipkan sesuai permission. Bundel handover dibuat melalui job queue dan diunduh setelah status selesai. Sebelum arsip:

- Tutup tugas yang tidak berlaku.
- Perbarui kronologi dan outcome agenda.
- Pastikan versi dokumen final tersedia.
- Rekonsiliasi transaksi dan dana titipan.
- Tinjau korespondensi serta pihak penerima handover.

### 11.5 Verifikasi publik

Sistem menyediakan halaman verifikasi publik untuk jenis keluaran tertentu, termasuk invoice, quotation, kuitansi pembayaran, slip gaji, korespondensi, sertifikat conflict check, status perkara, dan artefak tanda tangan. Kode atau QR membantu pemeriksaan terhadap record sistem, tetapi tidak boleh digunakan untuk membuka informasi yang tidak dimaksudkan bagi publik.

---

## 12. Keuangan

### 12.1 Ruang lingkup

Modul **Keuangan** (`/finance`) mencakup empat kelompok:

- **Perkara & Klien:** profitabilitas, invoice, quotation, dana titipan, biaya, dan penerimaan.
- **Operasional Kantor:** rekening, beban operasional, payroll, dan talangan partner.
- **Laporan Keuangan:** ringkasan serta ekspor audit Excel.
- **Analitik:** komposisi saldo, arus kas, beban, payroll, partner, dan kinerja.

Angka pada dashboard harus direkonsiliasi dengan dokumen sumber dan rekening bank; sistem tidak menggantikan kewajiban pembukuan, pajak, atau pemeriksaan profesional.

### 12.2 Quotation

1. Pilih perkara dan klien.
2. Isi judul, masa berlaku, ruang lingkup, dan line item.
3. Periksa subtotal, pajak, diskon, serta total.
4. Simpan draft dan ajukan approval kepada pengguna berwenang.
5. Unduh PDF setelah data terverifikasi.

Gunakan `quotation.approve` hanya untuk pejabat yang memang berwenang menyetujui penawaran.

### 12.3 Invoice

Isi klien, perkara, tanggal terbit, jatuh tempo, line item, diskon, pajak, dan rekening tujuan. Invoice dapat diedit sesuai status dan permission, ditransisikan, dibatalkan, serta diunduh sebagai PDF. Scheduler menandai invoice overdue setiap hari sekitar pukul 00.10 waktu aplikasi.

Jangan mengubah invoice yang telah dikomunikasikan tanpa mencatat alasan dan memastikan dampaknya pada pembayaran serta laporan.

### 12.4 Pembayaran klien

Catat tanggal penerimaan, akun tujuan, metode, nominal, referensi, dan alokasi invoice. Unggah bukti keuangan bila tersedia. Setelah tersimpan, verifikasi bahwa alokasi tidak melebihi kebutuhan invoice dan saldo akun berubah sesuai transaksi.

Koreksi penerimaan menggunakan reversal; pengembalian dana menggunakan refund. Keduanya memerlukan alasan yang jelas dan tidak boleh dipakai untuk menyembunyikan kesalahan pencatatan.

### 12.5 Pengeluaran dan biaya perkara

Catat kategori, vendor, tanggal, nominal, perkara, pihak yang menalangi, serta bukti. Biaya perkara dan beban kantor perlu diklasifikasikan benar karena memengaruhi profitabilitas serta laporan.

Penghapusan biaya harus menjadi pilihan terakhir. Untuk koreksi yang memiliki konsekuensi audit, utamakan mekanisme perubahan atau pencatatan pembalik yang sesuai kebijakan akuntansi firma.

### 12.6 Rekening kas dan bank

Pengguna berwenang dapat menambah, mengedit, atau menghapus rekening dengan kontrol sistem. Jenis rekening meliputi kas tunai, giro/tabungan, dana titipan, atau akun relevan lain. Rekening dengan transaksi tidak boleh dihapus sembarangan.

### 12.7 Transfer antar rekening

Pilih akun sumber dan tujuan yang berbeda, isi tanggal, nominal, referensi, serta bukti. Transfer adalah perpindahan internal dan tidak boleh dihitung sebagai pendapatan atau beban baru.

### 12.8 Dana titipan klien

Catat mutasi masuk dan keluar dana titipan dengan klien, perkara, akun, tujuan penggunaan, dan bukti. Dana titipan bukan pendapatan firma sampai dasar pengakuannya terpenuhi. Rekonsiliasi per klien secara berkala.

### 12.9 Talangan dan transaksi partner

Transaksi partner mencakup saldo awal, talangan, pengembalian, bagi hasil, dan prive sesuai tipe yang tersedia. Setiap nilai harus berasal dari transaksi, bukan angka hard-coded. Gunakan modal pengelolaan untuk menambah atau mengedit rincian pembentuk total.

### 12.10 Payroll

Slip penghasilan mencakup periode, pegawai, gaji pokok, tunjangan/bonus, potongan, nilai bersih, status, dan bukti. Slip lunas membutuhkan kehati-hatian tambahan sebelum diedit. PDF slip hanya diberikan kepada pihak yang berwenang dan data payroll tidak boleh terlihat oleh pengguna non-Finance.

### 12.11 Bukti keuangan

Fitur preview/upload bukti digunakan untuk invoice, biaya, penerimaan, transfer, payroll, dan transaksi lain yang didukung. Dokumen bertipe `financial_proof` dibatasi dari pemilih dokumen umum. Pastikan file dapat dibaca, relevan, dan tidak berisi data rekening yang tidak perlu.

### 12.12 Ekspor Excel

Gunakan **Export Audit (.xlsx)** atau **Export Excel** dan konfirmasi unduhan. File dapat memuat data sensitif dalam jumlah besar; simpan pada media terkontrol, jangan mengunggah ke layanan pribadi, dan hapus salinan kerja setelah tidak diperlukan.

### 12.13 Rekonsiliasi minimum

Setiap periode:

1. Cocokkan saldo sistem dengan rekening bank dan kas fisik.
2. Cocokkan pembayaran dengan invoice.
3. Periksa transaksi tanpa bukti atau tanpa perkara/klien yang seharusnya terkait.
4. Rekonsiliasi dana titipan per klien.
5. Periksa talangan, pengembalian, bagi hasil, dan prive per partner.
6. Tinjau payroll serta status lunas.
7. Ekspor laporan dan simpan sesuai kebijakan retensi.

---

## 13. Audit, Keamanan Data, dan Retensi

### 13.1 Audit log

Pengguna dengan `audit.view` membuka **Audit Log** (`/admin/audit`). Log mencatat konteks seperti actor, event, target, waktu, IP, user agent, dan metadata perubahan apabila disediakan oleh aksi terkait.

> **Koreksi audit:** jangan menyebut log “tidak dapat dihapus secara absolut”. Sistem memiliki fungsi prune yang dilindungi permission. Integritas audit bergantung pada kontrol akses, kebijakan retensi, backup, dan pembatasan operasi administrator.

### 13.2 Ekspor dan prune

Ekspor audit digunakan untuk pemeriksaan resmi. Prune adalah tindakan destruktif; hanya lakukan berdasarkan masa retensi yang disahkan, setelah target dan backup diverifikasi. Catat siapa yang menyetujui, rentang waktu, serta alasan tindakan.

### 13.3 Defense-in-depth notifikasi

Notifikasi sensitif disaring berdasarkan permission pada saat diterima dan ditampilkan. Administrator dapat menjalankan pembersihan notification yang tidak lagi berwenang. Perubahan role harus diikuti pemeriksaan notifikasi lama.

### 13.4 Data pribadi dan kerahasiaan profesi

- Kumpulkan data secukupnya.
- Jangan menaruh password, token, atau secret pada catatan perkara.
- Jangan membagikan screenshot tanpa menyamarkan data.
- Gunakan mode privasi kalender yang sesuai.
- Batasi unduhan data massal.
- Segera laporkan salah kirim email atau kebocoran URL feed.

### 13.5 Backup dan pemulihan

Backup database dan storage harus dikelola di tingkat infrastruktur. Keberadaan tombol unduh bukan pengganti backup. Prosedur restore wajib diuji berkala pada lingkungan terisolasi.

---

## 14. Notifikasi, Scheduler, dan Queue

### 14.1 Scheduler aktif

Jadwal implementasi saat audit:

| Proses | Frekuensi |
| --- | --- |
| Reminder tenggat perkara | Setiap jam |
| Reminder tugas lewat deadline | Setiap jam, dengan cadence H+1/H+3/H+7/mingguan |
| Reminder tanda tangan | Setiap jam |
| Penandaan invoice overdue | Setiap hari pukul 00.10 |
| Sinkronisasi Google Calendar | Setiap 15 menit |

Cron scheduler perlu menjalankan `php artisan schedule:run` setiap menit.

### 14.2 Queue

Email, notifikasi, pemrosesan dokumen, generasi artefak, handover, dan Google Calendar dapat menggunakan queue. Worker harus memproses queue yang dikonfigurasi, termasuk `notifications`, `default`, `documents`, dan `generation` bila digunakan.

Untuk produksi, gunakan process manager seperti Supervisor/systemd. Jika akses administrator server terbatas, cron dengan `flock` dan `--stop-when-empty` dapat menjadi fallback, tetapi memiliki latensi sampai jadwal cron berikutnya.

### 14.3 Pemeriksaan operasional

```bash
php artisan schedule:list
php artisan queue:monitor database:notifications --max=10
php artisan queue:failed
```

`queue:monitor` memakai format `connection:queue`; `notifications:10` keliru karena dianggap sebagai nama connection.

### 14.4 Job gagal karena model dihapus

`ModelNotFoundException` pada notification dapat terjadi ketika model, misalnya tugas, dihapus sebelum job diproses. Jangan retry job tersebut tanpa menilai apakah target masih ada. Hapus failed job yang tidak lagi relevan atau perbaiki desain serialisasi sebelum retry massal.

### 14.5 Deployment

Prosedur umum setelah pull, disesuaikan dengan kebijakan server:

```bash
git pull origin main
composer install --no-dev --optimize-autoloader
php artisan migrate --force
npm ci
npm run build
php artisan optimize:clear
php artisan optimize
php artisan queue:restart
```

Jalankan seeder permission hanya jika perubahan permission memang menjadi bagian release dan telah ditinjau, karena seeder menyinkronkan ulang permission role.

---

## 15. Prosedur Operasional Berkala

### 15.1 Checklist harian pengguna

- Periksa notifikasi, tugas, kalender, dan tenggat.
- Perbarui status tugas serta outcome agenda.
- Unggah dokumen ke record yang benar.
- Pastikan email penting terhubung dengan perkara.
- Laporkan error tanpa menampilkan data sensitif.

### 15.2 Checklist harian Administrator

- Periksa failed jobs dan backlog queue.
- Periksa error aplikasi terbaru.
- Pastikan scheduler berjalan.
- Tinjau akun yang harus dinonaktifkan.
- Pantau sinkronisasi kalender dan mail.

### 15.3 Checklist mingguan Legal Operations

- Tinjau perkara tanpa partner/tim yang jelas.
- Tinjau deadline dan tugas overdue.
- Tinjau dokumen yang menunggu review/signature.
- Tinjau conflict check yang belum diselesaikan.
- Tinjau arsip, Legal Hold, dan handover yang tertunda.

### 15.4 Checklist bulanan Finance

- Rekonsiliasi bank, kas, invoice, pembayaran, dan biaya.
- Periksa dana titipan klien.
- Periksa kewajiban dan transaksi partner.
- Verifikasi payroll dan bukti.
- Ekspor laporan yang diperlukan.
- Catat selisih serta koreksi dengan alasan.

### 15.5 Offboarding

- Alihkan perkara, tugas, review, dan agenda.
- Amankan dokumen pada repositori.
- Cabut integrasi dan akses.
- Nonaktifkan akun.
- Verifikasi notifikasi sensitif dan akses residual.
- Pertahankan audit trail sesuai retensi.

---

## 16. Troubleshooting

### Email tidak diterima

Periksa status Email Workspace, backlog `notifications`, failed jobs, konfigurasi mail, alamat penerima, serta folder spam. Status `DONE` pada queue menunjukkan job selesai; penerimaan akhir masih bergantung pada server email tujuan.

### Data baru tidak muncul

Segarkan halaman. Setelah deployment frontend, pastikan `npm run build` telah dijalankan dan cache dihapus. Periksa juga permission dan filter aktif.

### Menu tidak terlihat

Pastikan akun aktif dan role memiliki permission terkait. Jika role baru disinkronkan melalui seeder, logout/login kembali dan bersihkan cache aplikasi bila perlu.

### Error 403 Google Calendar

Jika OAuth berstatus Testing, tambahkan email sebagai test user. Verifikasi redirect URI harus sama persis dengan URL callback produksi, termasuk skema HTTPS dan path.

### Callback Google Calendar 404

Pastikan release yang memuat route callback sudah ter-deploy, `route:list` menampilkan route, proxy meneruskan request ke Laravel, serta route cache diperbarui.

### Queue menumpuk

Pastikan worker aktif dan mendengarkan connection/queue yang benar. Restart worker setelah deployment. Jangan menganggap `queue:failed` kosong berarti queue berjalan; periksa jumlah pending job.

### Preview dokumen belum tersedia

Periksa job pemrosesan dokumen, format berkas, dan failed jobs. Jalankan proses ulang melalui fitur aplikasi jika tersedia.

### Error 500

Catat URL, waktu, pengguna, dan langkah terakhir; lalu periksa log terbaru. Jangan hanya menyalin stack trace tanpa baris error pertama. Setelah perbaikan, deploy kode, jalankan migration bila ada, bersihkan cache, restart queue, dan uji kembali skenario spesifik.

### Data salah terhapus

Hentikan perubahan lanjutan, catat target serta waktu, dan hubungi Administrator. Pemulihan bergantung pada backup dan relasi database; tidak semua penghapusan dapat dibatalkan dari UI.

### Salah kirim email atau bocor token kalender

Segera laporkan insiden. Untuk kalender, rotate token. Untuk email, catatan pada database tidak dapat menarik kembali pesan yang sudah diterima; tindak lanjut dilakukan sesuai prosedur insiden firma.

---

## 17. Lampiran

### Lampiran A — Matriks permission ringkas

| Area | Permission utama |
| --- | --- |
| Perkara | `matter.view`, `matter.view.all`, `matter.create`, `matter.update`, `matter.archive` |
| Klien dan kontak | `client.view`, `client.manage`, `contact.view`, `contact.manage` |
| Email | `email.view`, `email.send`, `email.manage` |
| Tugas | `task.view`, `task.create`, `task.manage` |
| Dokumen | `document.view`, `document.upload`, `document.download`, `document.delete`, `document.approve` |
| Finance | `billing.*`, `expense.*`, `payment.*`, `quotation.*` sesuai definisi sistem |
| Tanda tangan | `signature.view`, `signature.manage` |
| Tata Kelola | `correspondence.*`, `conflict.*`, `archive.*` |
| Audit dan admin | `audit.view`, `admin.users.manage` |

Permission efektif harus diperiksa dari matriks yang aktif, bukan hanya nama jabatan.

### Lampiran B — Matriks role baseline

| Role | Cakupan umum |
| --- | --- |
| Administrator | Seluruh permission baseline. |
| Managing Partner | Seluruh permission baseline. |
| Partner | Seluruh permission kecuali administrasi pengguna. |
| Associate | Perkara, klien/kontak, email, tugas, dokumen, korespondensi, conflict check, dan lihat signature sesuai daftar seeder. |
| Finance | Perkara/klien/kontak terbatas, billing, biaya, pembayaran, quotation, serta baca/unduh dokumen. |
| Intern | Perkara, klien/kontak, email, tugas, dokumen, dan lihat korespondensi sesuai daftar seeder. |

### Lampiran C — Glosarium

| Istilah | Arti operasional |
| --- | --- |
| Assignee | Pengguna yang bertanggung jawab mengerjakan tugas. |
| Reporter | Pengguna yang membuat atau memantau tugas. |
| Reviewer | Pengguna yang menilai hasil tugas atau dokumen. |
| Matter | Record perkara atau penugasan hukum, litigasi maupun non-litigasi. |
| Conflict Check | Pemeriksaan potensi benturan kepentingan terhadap pihak dan data historis. |
| Correspondence | Register komunikasi resmi masuk atau keluar. |
| Legal Hold | Status preservasi yang membatasi operasi destruktif pada data perkara. |
| Queue | Antrean proses latar belakang seperti email, notifikasi, dokumen, dan sinkronisasi. |
| Scheduler | Pemicu berkala untuk menjalankan command otomatis. |
| Reversal | Pembalikan pencatatan pembayaran yang salah. |
| Refund | Pengembalian dana kepada pembayar. |
| Escrow/Dana Titipan | Dana klien yang dikelola terpisah dan belum menjadi pendapatan firma. |
| Talangan Partner | Dana pribadi partner yang digunakan untuk kebutuhan firma/perkara dan harus direkonsiliasi. |
| Passkey | Kredensial autentikasi berbasis perangkat/WebAuthn. |
| TOTP | Kode autentikasi sekali pakai berbasis waktu. |
| ICS | Format kalender yang dapat diunduh atau dilanggan. |
| OAuth | Mekanisme pemberian akses terbatas ke layanan pihak ketiga tanpa membagikan password. |

### Lampiran D — Checklist mutu data

Sebelum menyimpan record material, periksa:

- Identitas pihak dan ejaan nama.
- Perkara dan klien terkait.
- Tanggal, zona waktu, status, serta tenggat.
- Nominal, mata uang, rekening, dan alokasi.
- Penerima email/notifikasi.
- Jenis serta kerahasiaan dokumen.
- Alasan perubahan atau pembatalan.
- Permission pengguna yang melakukan tindakan.

### Lampiran E — Kontak dukungan

Kendala operasional dilaporkan kepada Legal Operations atau Administrator melalui kanal resmi firma. Sertakan:

1. Nama pengguna dan modul.
2. Waktu kejadian dalam WIB.
3. URL halaman tanpa token rahasia.
4. Langkah yang dilakukan.
5. Pesan error dan screenshot yang telah disamarkan.
6. Dampak terhadap pekerjaan.

Jangan mengirim password, recovery code, client secret, access token, URL feed kalender privat, atau seluruh isi `.env`.

---

## Lembar Pengesahan

| Fungsi | Nama/Jabatan | Tanda tangan dan tanggal |
| --- | --- | --- |
| Disusun oleh | Legal Operations dan Administrator Sistem |  |
| Ditinjau oleh | Partner yang ditunjuk |  |
| Disahkan oleh | Managing Partner |  |

Dengan pengesahan ini, Buku Panduan Pengguna dan Operasional Sistem RPK Legal Workspace versi 3.0 berlaku sebagai acuan internal sampai diterbitkan revisi berikutnya.

**Roni, Putra & Kusumah Law Firm**  
*Internal — Rahasia dan Terbatas*

© 2026 Roni, Putra & Kusumah Law Firm. Seluruh hak dilindungi.
