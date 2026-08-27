<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreExpenseRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->hasPermission('expense.manage') ?? false;
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
            'category' => ['required', 'string', 'max:100'],
            'charge_to' => ['nullable', 'string', 'in:office,client'],
            'description' => ['required', 'string', 'max:1000'],
            'vendor' => ['nullable', 'string', 'max:255'],
            'incurred_at' => ['required', 'date'],
            'amount' => ['required', 'integer', 'min:0'],
            'currency' => ['nullable', 'string', 'size:3'],
            'account_id' => ['nullable', 'exists:financial_accounts,id'],
            'partner_id' => ['nullable', 'exists:users,id'],
            'is_reimbursable' => ['nullable', 'boolean'],
            'status' => ['nullable', 'string', 'in:draft,pending_approval,approved,rejected'],
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
            'currency' => $this->input('currency') ?: 'IDR',
            'charge_to' => $this->input('charge_to') ?: 'office',
            'status' => $this->input('status') ?: 'approved',
        ]);
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'category.required' => 'Kategori pengeluaran wajib diisi.',
            'description.required' => 'Deskripsi / keterangan pengeluaran wajib diisi.',
            'incurred_at.required' => 'Tanggal pengeluaran wajib diisi.',
            'amount.required' => 'Nominal pengeluaran wajib diisi.',
            'amount.min' => 'Nominal pengeluaran tidak boleh negatif.',
        ];
    }
}
