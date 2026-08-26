<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAdminUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->hasPermission('admin.users.manage');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique((new User)->getTable(), 'email')],
            'position_title' => ['nullable', 'string', 'max:150'],
            'employee_code' => ['nullable', 'string', 'max:50', Rule::unique((new User)->getTable(), 'employee_code')],
            'department' => ['nullable', 'string', 'max:100'],
            'employment_type' => ['nullable', 'string', 'max:50'],
            'work_mode' => ['nullable', 'string', 'max:50'],
            'phone' => ['nullable', 'string', 'max:30'],
            'password' => ['nullable', 'string', 'min:8'],
            'role_ids' => ['required', 'array', 'min:1'],
            'role_ids.*' => ['integer', 'distinct', 'exists:roles,id'],
        ];
    }
}
