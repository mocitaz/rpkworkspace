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
            'matter_id' => ['nullable', 'exists:matters,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:20000'],
            'assignee_id' => ['nullable', 'exists:users,id'],
            'reviewer_id' => ['nullable', 'different:assignee_id', 'exists:users,id'],
            'status' => ['required', 'in:todo,in_progress,waiting,review,completed,cancelled'],
            'priority' => ['required', 'in:low,normal,high,critical'],
            'due_at' => ['nullable', 'date'],
        ];
    }
}
