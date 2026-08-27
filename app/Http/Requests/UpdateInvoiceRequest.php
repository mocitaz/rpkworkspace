<?php

namespace App\Http\Requests;

use App\Models\Matter;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateInvoiceRequest extends FormRequest
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
            'client_id' => ['required', 'exists:clients,id'],
            'matter_id' => ['nullable', 'exists:matters,id'],
            'title' => ['required', 'string', 'max:255'],
            'status' => ['required', 'in:draft,sent,partial,paid,cancelled'],
            'currency' => ['required', 'string', 'size:3'],
            'issued_at' => ['nullable', 'date'],
            'due_at' => ['nullable', 'date', 'after_or_equal:issued_at'],
            'discount_amount' => ['nullable', 'integer', 'min:0'],
            'tax_rate' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.description' => ['required', 'string', 'max:255'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.unit_amount' => ['required', 'integer', 'min:0'],
            'proof' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png,webp', 'max:20480'],
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

        $items = $this->input('items', []);
        if (is_array($items)) {
            $items = array_map(function ($item) use ($cleanInt) {
                if (is_array($item)) {
                    if (isset($item['quantity'])) {
                        $item['quantity'] = $cleanInt($item['quantity']) ?? 1;
                    }
                    if (isset($item['unit_amount'])) {
                        $item['unit_amount'] = $cleanInt($item['unit_amount']) ?? 0;
                    }
                }

                return $item;
            }, $items);
        }

        $this->merge([
            'client_id' => $clientId,
            'currency' => $this->input('currency') ?: 'IDR',
            'discount_amount' => $cleanInt($this->input('discount_amount')) ?? 0,
            'items' => $items,
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
            'title.required' => 'Judul invoice wajib diisi.',
            'items.required' => 'Minimal harus ada 1 rincian item tagihan.',
            'items.min' => 'Minimal harus ada 1 rincian item tagihan.',
            'due_at.after_or_equal' => 'Tanggal jatuh tempo tidak boleh sebelum tanggal penerbitan.',
        ];
    }
}
