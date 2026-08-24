<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $assignedSequences = DB::table('users')
            ->whereNotNull('employee_code')
            ->pluck('employee_code')
            ->mapWithKeys(function (string $employeeCode): array {
                preg_match('/^RPK-(\d+)$/', $employeeCode, $matches);

                return isset($matches[1]) ? [(int) $matches[1] => true] : [];
            })
            ->all();

        $nextSequence = 1;

        DB::table('users')
            ->whereNull('employee_code')
            ->orderBy('created_at')
            ->orderBy('id')
            ->get(['id'])
            ->each(function (object $user) use (&$assignedSequences, &$nextSequence): void {
                while (isset($assignedSequences[$nextSequence])) {
                    $nextSequence++;
                }

                DB::table('users')->where('id', $user->id)->update([
                    'employee_code' => 'RPK-'.str_pad((string) $nextSequence, 3, '0', STR_PAD_LEFT),
                ]);

                $assignedSequences[$nextSequence] = true;
                $nextSequence++;
            });
    }

    public function down(): void
    {
        // Employee codes are durable business identifiers and must not be cleared.
    }
};
