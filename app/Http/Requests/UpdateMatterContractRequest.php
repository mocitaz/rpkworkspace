<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateMatterContractRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->hasPermission('billing.manage');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'budget_amount' => ['required', 'integer', 'min:0'],
            'currency' => ['required', 'string', 'size:3', 'in:IDR,USD,SGD'],
            'contract_date' => ['nullable', 'date'],
            'billing_model' => ['nullable', 'string', 'in:fixed_fee,retainer,hourly,milestone,success_fee,hybrid'],
        ];
    }
}
