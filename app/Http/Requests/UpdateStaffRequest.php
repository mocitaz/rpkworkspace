<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateStaffRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->hasPermission('admin.users.manage') ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($this->route('user'))],
            'position_title' => ['required', 'string', 'max:255'],
            'department' => ['required', Rule::in(['Corporate', 'Dispute Resolution', 'Finance & Tax', 'Operations', 'People & Culture'])],
            'employment_type' => ['required', Rule::in(['Permanent', 'Contract', 'Internship'])],
            'employment_status' => ['required', Rule::in(['Active', 'On leave', 'Inactive'])],
            'work_mode' => ['required', Rule::in(['Hybrid', 'Office', 'Remote'])],
            'joined_at' => ['required', 'date'],
            'contract_end' => ['nullable', 'date', 'after_or_equal:joined_at'],
            'leave_balance' => ['required', 'integer', 'min:0', 'max:365'],
            'utilization' => ['required', 'integer', 'min:0', 'max:100'],
            'performance_score' => ['required', 'numeric', 'min:0', 'max:5'],
            'next_review' => ['nullable', 'date'],
        ];
    }
}
