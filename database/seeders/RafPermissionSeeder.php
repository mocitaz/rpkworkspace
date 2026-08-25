<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class RafPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissionDefinitions = [
            'matter.view' => 'Melihat perkara yang ditugaskan / standar',
            'matter.view.all' => 'Melihat seluruh perkara firma (termasuk rahasia/restricted)',
            'matter.create' => 'Membuka dan mendaftarkan perkara baru',
            'matter.update' => 'Mengubah perkara, tim penasihat, jadwal, & catatan',
            'matter.archive' => 'Mengarsipkan perkara yang telah selesai/ditutup',

            'client.view' => 'Melihat data profil dan riwayat klien',
            'client.manage' => 'Menambah, mengedit, & mengelola kepatuhan klien',
            'contact.view' => 'Melihat buku kontak eksternal & pengadilan',
            'contact.manage' => 'Menambah, mengubah, dan menghapus kontak',

            'task.view' => 'Melihat daftar tugas dan agenda kerja',
            'task.create' => 'Membuat tugas baru untuk diri sendiri atau rekan',
            'task.manage' => 'Menugaskan, mengubah status, & mengelola tugas',

            'document.view' => 'Melihat dan membaca berkas dokumen perkara',
            'document.upload' => 'Mengunggah versi berkas baru & draf dokumen',
            'document.download' => 'Mengunduh berkas dokumen perkara',
            'document.delete' => 'Menghapus berkas dokumen dari repositori',
            'document.approve' => 'Memberikan persetujuan / revisi draf dokumen',

            'billing.view' => 'Mengakses menu keuangan dan rekap penagihan',
            'billing.manage' => 'Menerbitkan, mengirim, & membatalkan invoice',
            'expense.view' => 'Melihat buku besar biaya perkara & disbursement',
            'expense.manage' => 'Mencatat, unggah kuitansi, & hapus biaya perkara',
            'payment.view' => 'Melihat riwayat penerimaan kas pembayaran klien',
            'payment.manage' => 'Mencatat penerimaan kas, alokasi tagihan, & refund',
            'quotation.view' => 'Melihat daftar penawaran biaya (fee quotation)',
            'quotation.manage' => 'Membuat & merancang draf penawaran honorarium',
            'quotation.approve' => 'Persetujuan resmi penawaran biaya jasa hukum',

            'signature.view' => 'Melihat status dan verifikasi tanda tangan digital',
            'signature.manage' => 'Mengajukan permohonan e-sign & kirim pengingat',

            'correspondence.view' => 'Melihat log surat masuk & surat keluar resmi',
            'correspondence.manage' => 'Mencatat surat, disposisi lampiran, & hapus surat',
            'conflict.view' => 'Melihat riwayat pemeriksaan benturan kepentingan',
            'conflict.manage' => 'Menjalankan penelusuran konflik pihak lawan',
            'conflict.approve' => 'Persetujuan waiver benturan kepentingan partner',

            'archive.view' => 'Melihat repositori arsip perkara terdahulu',
            'archive.manage' => 'Mengelola status arsip & permintaan ekspor ZIP',
            'archive.legal_hold.manage' => 'Mengunci perkara dalam status Legal Hold',
            'audit.view' => 'Mengakses rekaman jejak audit aktivitas sistem',
            'admin.users.manage' => 'Mengelola akun staf, peran (role), & hak akses',
        ];

        Permission::query()->whereNotIn('name', array_keys($permissionDefinitions))->delete();

        $permissions = [];
        foreach ($permissionDefinitions as $name => $description) {
            $permissions[$name] = Permission::query()->updateOrCreate(
                ['name' => $name],
                ['description' => $description],
            )->getKey();
        }

        $rolesData = [
            'administrator' => [
                'name' => 'Administrator Sistem',
                'description' => 'Akses penuh administrasi sistem, pengguna, tata kelola, dan konfigurasi.',
                'permissions' => array_values($permissions),
            ],
            'managing-partner' => [
                'name' => 'Managing Partner',
                'description' => 'Pimpinan firma dengan kewenangan penuh operasional, persetujuan, dan pengawasan perkara.',
                'permissions' => array_values($permissions),
            ],
            'partner' => [
                'name' => 'Partner',
                'description' => 'Partner penanggung jawab perkara, persetujuan dokumen, dan manajemen klien.',
                'permissions' => array_values(array_filter($permissions, fn ($id, $name) => ! in_array($name, ['admin.users.manage']), ARRAY_FILTER_USE_BOTH)),
            ],
            'associate' => [
                'name' => 'Associate',
                'description' => 'Advokat dan staf hukum pelaksana tugas, riset, dan penyusunan dokumen perkara.',
                'permissions' => array_values(array_filter($permissions, fn ($id, $name) => in_array($name, [
                    'matter.view', 'matter.create', 'matter.update',
                    'client.view', 'contact.view', 'contact.manage',
                    'task.view', 'task.create', 'task.manage',
                    'document.view', 'document.upload', 'document.download',
                    'correspondence.view', 'correspondence.manage',
                    'conflict.view', 'conflict.manage',
                    'signature.view',
                ]), ARRAY_FILTER_USE_BOTH)),
            ],
            'finance' => [
                'name' => 'Finance & Billing Specialist',
                'description' => 'Manajemen penagihan invoice, pembayaran honorarium, dan pencatatan pengeluaran.',
                'permissions' => array_values(array_filter($permissions, fn ($id, $name) => in_array($name, [
                    'matter.view', 'client.view', 'contact.view',
                    'billing.view', 'billing.manage',
                    'expense.view', 'expense.manage',
                    'payment.view', 'payment.manage',
                    'quotation.view', 'quotation.manage',
                    'document.view', 'document.download',
                ]), ARRAY_FILTER_USE_BOTH)),
            ],
            'intern' => [
                'name' => 'Magang (Legal Intern)',
                'description' => 'Mahasiswa atau staf magang pelaksana riset yuridis, telaah pustaka, dan draf awal berkas.',
                'permissions' => array_values(array_filter($permissions, fn ($id, $name) => in_array($name, [
                    'matter.view',
                    'client.view', 'contact.view',
                    'task.view', 'task.manage',
                    'document.view', 'document.upload', 'document.download',
                    'correspondence.view',
                ]), ARRAY_FILTER_USE_BOTH)),
            ],
        ];

        foreach ($rolesData as $slug => $data) {
            $role = Role::query()->updateOrCreate(
                ['slug' => $slug],
                ['name' => $data['name'], 'description' => $data['description']],
            );

            $role->permissions()->sync($data['permissions']);
        }
    }
}
