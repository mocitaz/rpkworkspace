<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdatePartnerTransactionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->hasPermission('billing.manage') ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'partner_id' => ['required', 'exists:users,id'],
            'matter_id' => ['nullable', 'exists:matters,id'],
            'type' => ['required', 'string', 'in:advance_incurred,advance_reimbursed,advance_repaid,profit_distribution,capital_injection,draw_prive,draw'],
            'amount' => ['required', 'integer', 'min:1'],
            'transaction_date' => ['required', 'date'],
            'account_id' => ['nullable', 'exists:financial_accounts,id'],
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

        $type = $this->input('type');
        if ($type === 'advance_repaid') {
            $type = 'advance_reimbursed';
        } elseif ($type === 'draw') {
            $type = 'draw_prive';
        }

        $this->merge([
            'amount' => $cleanInt($this->input('amount')) ?? 0,
            'type' => $type,
        ]);
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'partner_id.required' => 'Partner / Advokat wajib dipilih.',
            'partner_id.exists' => 'Data partner tidak ditemukan dalam sistem.',
            'type.required' => 'Jenis transaksi partner wajib dipilih.',
            'type.in' => 'Pilihan jenis transaksi partner tidak valid.',
            'amount.required' => 'Nominal transaksi wajib diisi.',
            'amount.min' => 'Nominal transaksi minimal Rp 1.',
            'transaction_date.required' => 'Tanggal transaksi wajib diisi.',
        ];
    }
}
