<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the operational workspace without replacing authentication data.
     */
    public function run(): void
    {
        $this->call([
            RafPermissionSeeder::class,
            RafWorkspaceDemoSeeder::class,
        ]);
    }
}
