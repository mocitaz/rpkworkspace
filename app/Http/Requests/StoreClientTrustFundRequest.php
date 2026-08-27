<?php

namespace App\Http\Requests;

use App\Models\Matter;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreClientTrustFundRequest extends FormRequest
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
            'client_id' => ['required', 'exists:clients,id'],
            'matter_id' => ['nullable', 'exists:matters,id'],
            'account_id' => ['required', 'exists:financial_accounts,id'],
            'type' => ['required', 'string', 'in:deposit_in,disbursement_out'],
            'amount' => ['required', 'integer', 'min:1'],
            'transaction_date' => ['required', 'date'],
            'purpose' => ['required', 'string', 'max:255'],
            'recipient_party' => ['nullable', 'string', 'max:255'],
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

        $clientId = $this->input('client_id');
        if (! $clientId && $this->filled('matter_id')) {
            $clientId = Matter::whereKey($this->input('matter_id'))->value('client_id');
        }

        $this->merge([
            'client_id' => $clientId,
            'amount' => $cleanInt($this->input('amount')) ?? 0,
        ]);
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'client_id.required' => 'Klien wajib dipilih.',
            'client_id.exists' => 'Klien yang dipilih tidak ditemukan dalam sistem.',
            'account_id.required' => 'Rekening trust / escrow wajib dipilih.',
            'account_id.exists' => 'Rekening yang dipilih tidak valid.',
            'type.required' => 'Jenis transaksi trust wajib dipilih.',
            'amount.required' => 'Nominal transaksi wajib diisi.',
            'amount.min' => 'Nominal transaksi minimal Rp 1.',
            'transaction_date.required' => 'Tanggal transaksi wajib diisi.',
            'purpose.required' => 'Peruntukan dana trust wajib diisi.',
        ];
    }
}
