<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateFinancialAccountRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasPermission('billing.manage') ?? false;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'bank_name' => ['nullable', 'string', 'max:100'],
            'account_number' => ['nullable', 'string', 'max:100'],
            'partner_id' => ['nullable', 'exists:users,id'],
            'description' => ['nullable', 'string', 'max:1000'],
            'is_active' => ['nullable', 'boolean'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Nama akun atau rekening wajib diisi.',
            'name.max' => 'Nama akun maksimal 255 karakter.',
            'bank_name.max' => 'Nama bank maksimal 100 karakter.',
            'account_number.max' => 'Nomor rekening maksimal 100 karakter.',
            'partner_id.exists' => 'Partner yang dipilih tidak ditemukan.',
            'description.max' => 'Deskripsi maksimal 1000 karakter.',
        ];
    }
}
