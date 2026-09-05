<?php

namespace App\Http\Requests;

use App\Models\Invoice;
use App\Models\Matter;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class StorePaymentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->hasPermission('payment.manage') ?? false;
    }

    /**
     * Prepare inputs before validation.
     */
    protected function prepareForValidation(): void
    {
        $clientId = $this->input('client_id');
        $matterId = $this->input('matter_id');

        if (empty($clientId) && ! empty($matterId)) {
            $clientId = Matter::query()->whereKey($matterId)->value('client_id');
        }

        $rawAllocations = $this->input('allocations');
        $cleanAllocations = [];

        if (is_array($rawAllocations)) {
            foreach ($rawAllocations as $alloc) {
                $invoiceId = $alloc['invoice_id'] ?? null;
                $rawAmount = $alloc['amount'] ?? null;

                if (! empty($invoiceId)) {
                    // If client_id is still empty, resolve from first invoice
                    if (empty($clientId)) {
                        $clientId = Invoice::query()->whereKey($invoiceId)->value('client_id');
                    }

                    $cleanAmount = (int) preg_replace('/[^\d]/', '', (string) $rawAmount);
                    if ($cleanAmount > 0) {
                        $cleanAllocations[] = [
                            'invoice_id' => $invoiceId,
                            'amount' => $cleanAmount,
                        ];
                    }
                }
            }
        }

        $rawAmount = $this->input('amount');
        $cleanAmount = is_numeric($rawAmount) ? (int) $rawAmount : (int) preg_replace('/[^\d]/', '', (string) $rawAmount);

        $this->merge([
            'client_id' => $clientId ?: null,
            'matter_id' => $matterId ?: null,
            'currency' => $this->input('currency', 'IDR') ?: 'IDR',
            'amount' => $cleanAmount,
            'allocations' => $cleanAllocations,
        ]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'client_id' => ['nullable', 'exists:clients,id'],
            'matter_id' => ['nullable', 'exists:matters,id'],
            'account_id' => ['required', 'exists:financial_accounts,id'],
            'currency' => ['required', 'string', 'size:3'],
            'amount' => ['required', 'integer', 'min:1'],
            'gross_amount' => ['nullable', 'integer', 'min:0'],
            'tax_withheld' => ['nullable', 'integer', 'min:0'],
            'net_amount' => ['nullable', 'integer', 'min:0'],
            'method' => ['required', 'string', 'max:100'],
            'reference_number' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string', 'max:2000'],
            'received_at' => ['required', 'date'],
            'allocations' => ['nullable', 'array'],
            'allocations.*.invoice_id' => ['required', 'exists:invoices,id'],
            'allocations.*.amount' => ['required', 'integer', 'min:1'],
            'proof' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png,webp', 'max:10240'],
        ];
    }

    /**
     * Custom validation logic for allocations.
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            $totalAmount = (int) $this->input('amount', 0);
            $allocations = $this->input('allocations', []);

            if (is_array($allocations) && count($allocations) > 0) {
                $totalAllocated = collect($allocations)->sum(fn ($a) => (int) ($a['amount'] ?? 0));

                if ($totalAllocated > $totalAmount) {
                    $validator->errors()->add(
                        'allocations',
                        'Total alokasi pelunasan invoice (Rp '.number_format($totalAllocated, 0, ',', '.').') melebihi nominal pembayaran (Rp '.number_format($totalAmount, 0, ',', '.').').'
                    );
                }
            }
        });
    }

    /**
     * Custom error messages in Indonesian.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'client_id.exists' => 'Data klien pembayar tidak ditemukan di sistem.',
            'account_id.required' => 'Rekening kas/bank penerima wajib dipilih.',
            'account_id.exists' => 'Rekening kas/bank yang dipilih tidak valid.',
            'amount.required' => 'Nominal pembayaran bersih wajib diisi.',
            'amount.min' => 'Nominal pembayaran minimal Rp 1.',
            'method.required' => 'Metode pembayaran wajib dipilih/diisi.',
            'received_at.required' => 'Tanggal & waktu penerimaan pembayaran wajib diisi.',
            'allocations.*.invoice_id.exists' => 'Invoice tagihan yang dipilih tidak valid.',
            'allocations.*.amount.min' => 'Nominal alokasi invoice harus lebih besar dari 0.',
        ];
    }
}
