<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAdminUserRequest extends FormRequest
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
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique((new User)->getTable(), 'email')->ignore($this->route('user')),
            ],
            'position_title' => ['nullable', 'string', 'max:150'],
            'employee_code' => [
                'nullable',
                'string',
                'max:50',
                Rule::unique((new User)->getTable(), 'employee_code')->ignore($this->route('user')),
            ],
            'department' => ['nullable', 'string', 'max:100'],
            'phone' => ['nullable', 'string', 'max:30'],
            'address' => ['nullable', 'string', 'max:1000'],
            'ktp_address' => ['nullable', 'string', 'max:1000'],
            'birth_date' => ['nullable', 'date'],
            'advocate_license_no' => ['nullable', 'string', 'max:100'],
            'bas_number' => ['nullable', 'string', 'max:100'],
            'bas_date' => ['nullable', 'date'],
            'kta_expiry_date' => ['nullable', 'date'],
            'practice_areas' => ['nullable', 'string', 'max:1000'],
            'education' => ['nullable', 'string', 'max:255'],
            'bank_name' => ['nullable', 'string', 'max:100'],
            'bank_account_number' => ['nullable', 'string', 'max:50'],
            'bank_account_holder' => ['nullable', 'string', 'max:150'],
            'npwp' => ['nullable', 'string', 'max:50'],
            'password' => ['nullable', 'string', 'min:8'],
            'is_active' => ['required', 'boolean'],
            'role_ids' => ['required', 'array', 'min:1'],
            'role_ids.*' => ['integer', 'distinct', 'exists:roles,id'],
        ];
    }
}
