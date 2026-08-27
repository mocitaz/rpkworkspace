<?php

namespace App\Http\Requests;

use App\Models\Matter;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreQuotationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->hasPermission('quotation.manage') ?? false;
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
            'conflict_check_id' => ['nullable', 'required_without:matter_id', 'exists:conflict_checks,id'],
            'title' => ['required', 'string', 'max:255'],
            'scope' => ['nullable', 'string', 'max:5000'],
            'status' => ['required', 'in:draft,pending_approval,sent,cancelled'],
            'currency' => ['required', 'string', 'size:3'],
            'issued_at' => ['nullable', 'date'],
            'valid_until' => ['nullable', 'date', 'after_or_equal:issued_at'],
            'discount_amount' => ['nullable', 'integer', 'min:0'],
            'tax_rate' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.description' => ['required', 'string', 'max:255'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.unit_amount' => ['required', 'integer', 'min:0'],
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
            'status' => $this->input('status') ?: 'draft',
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
            'title.required' => 'Judul penawaran fee jasa hukum wajib diisi.',
            'items.required' => 'Minimal harus ada 1 rincian item penawaran.',
            'items.min' => 'Minimal harus ada 1 rincian item penawaran.',
            'valid_until.after_or_equal' => 'Masa berlaku penawaran tidak boleh sebelum tanggal penerbitan.',
        ];
    }
}
