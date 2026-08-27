<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreAccountTransferRequest extends FormRequest
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
            'from_account_id' => ['required', 'exists:financial_accounts,id'],
            'to_account_id' => ['required', 'exists:financial_accounts,id', 'different:from_account_id'],
            'amount' => ['required', 'integer', 'min:1'],
            'transferred_at' => ['required', 'date'],
            'reference_number' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string', 'max:1000'],
            'proof' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png,webp', 'max:10240'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $cleanInt = function ($value): ?int {
            if ($value === null || $value === '') {
                return null;
            }
            if (is_int($value)) {
                return $value;
            }
            $cleaned = preg_replace('/[^\d-]/', '', (string) $value);

            return $cleaned === '' ? null : (int) $cleaned;
        };

        $this->merge([
            'amount' => $cleanInt($this->input('amount')) ?? 0,
        ]);
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'from_account_id.required' => 'Rekening sumber dana wajib dipilih.',
            'from_account_id.exists' => 'Rekening sumber dana tidak valid.',
            'to_account_id.required' => 'Rekening tujuan transfer wajib dipilih.',
            'to_account_id.exists' => 'Rekening tujuan transfer tidak valid.',
            'to_account_id.different' => 'Rekening tujuan tidak boleh sama dengan rekening sumber.',
            'amount.required' => 'Nominal transfer wajib diisi.',
            'amount.min' => 'Nominal transfer minimal Rp 1.',
            'transferred_at.required' => 'Tanggal & waktu transfer wajib diisi.',
        ];
    }
}
