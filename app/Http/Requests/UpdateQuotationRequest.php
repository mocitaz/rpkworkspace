<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateQuotationRequest extends FormRequest
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
            'title' => ['required', 'string', 'max:255'],
            'scope' => ['nullable', 'string', 'max:5000'],
            'status' => ['required', 'in:draft,pending_approval,approved,sent,rejected,converted,cancelled'],
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
}
