<?php

use App\Models\Task;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->string('task_number')->nullable()->unique()->after('id');
            $table->string('category')->nullable()->index()->after('title');
            $table->string('stage')->nullable()->index()->after('category');
            $table->date('start_date')->nullable()->index()->after('due_at');
            $table->boolean('is_billable')->default(false)->after('start_date');
            $table->decimal('estimated_hours', 6, 2)->nullable()->after('is_billable');
            $table->decimal('actual_hours', 6, 2)->nullable()->after('estimated_hours');
            $table->json('checklists')->nullable()->after('actual_hours');
            $table->text('completion_notes')->nullable()->after('checklists');
        });

        // Backfill existing tasks with sequential task numbers
        $tasks = Task::query()->orderBy('created_at')->get();
        $index = 1;
        foreach ($tasks as $task) {
            $year = $task->created_at ? $task->created_at->format('Y') : '2026';
            $taskNumber = sprintf('TSK-%s-%04d', $year, $index++);
            DB::table('tasks')->where('id', $task->id)->update([
                'task_number' => $taskNumber,
                'category' => $task->category ?? 'general',
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropColumn([
                'task_number',
                'category',
                'stage',
                'start_date',
                'is_billable',
                'estimated_hours',
                'actual_hours',
                'checklists',
                'completion_notes',
            ]);
        });
    }
};
