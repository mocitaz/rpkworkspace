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
            'type' => ['required', 'string', 'in:advance_incurred,advance_reimbursed,profit_distribution,capital_injection,draw_prive'],
            'amount' => ['required', 'integer', 'min:1'],
            'transaction_date' => ['required', 'date'],
            'account_id' => ['nullable', 'exists:financial_accounts,id'],
            'notes' => ['nullable', 'string', 'max:1000'],
            'proof' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png,webp', 'max:10240'],
        ];
    }
}
