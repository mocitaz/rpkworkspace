<?php

namespace App\Http\Requests;

use App\Models\Task;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreTaskRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('create', Task::class);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'task_number' => ['nullable', 'string', 'max:50', 'unique:tasks,task_number'],
            'matter_id' => ['nullable', 'exists:matters,id'],
            'title' => ['required', 'string', 'max:255'],
            'category' => ['nullable', 'string', 'max:50'],
            'stage' => ['nullable', 'string', 'max:50'],
            'description' => ['nullable', 'string', 'max:20000'],
            'assignee_id' => ['nullable', 'exists:users,id'],
            'reviewer_id' => ['nullable', 'different:assignee_id', 'exists:users,id'],
            'status' => ['required', 'in:todo,in_progress,waiting,review,completed,cancelled'],
            'priority' => ['required', 'in:low,normal,high,critical'],
            'start_date' => ['nullable', 'date'],
            'due_at' => ['nullable', 'date'],
            'is_billable' => ['nullable', 'boolean'],
            'estimated_hours' => ['nullable', 'numeric', 'min:0', 'max:9999.99'],
            'actual_hours' => ['nullable', 'numeric', 'min:0', 'max:9999.99'],
            'checklists' => ['nullable', 'array'],
            'checklists.*.id' => ['nullable', 'string'],
            'checklists.*.title' => ['required_with:checklists', 'string', 'max:255'],
            'checklists.*.is_completed' => ['nullable', 'boolean'],
            'checklists.*.completed_at' => ['nullable', 'string'],
            'completion_notes' => ['nullable', 'string', 'max:10000'],
        ];
    }
}
