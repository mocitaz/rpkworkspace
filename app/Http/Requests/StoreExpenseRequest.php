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
            'matter_id' => ['required', 'exists:matters,id'],
            'category' => ['required', 'string', 'max:100'],
            'charge_to' => ['nullable', 'string', 'in:office,client'],
            'description' => ['required', 'string', 'max:1000'],
            'vendor' => ['nullable', 'string', 'max:255'],
            'incurred_at' => ['required', 'date'],
            'amount' => ['required', 'integer', 'min:0'],
            'currency' => ['required', 'string', 'size:3'],
            'account_id' => ['nullable', 'exists:financial_accounts,id'],
            'partner_id' => ['nullable', 'exists:users,id'],
            'is_reimbursable' => ['nullable', 'boolean'],
            'status' => ['required', 'in:draft,pending_approval,approved,rejected'],
            'proof' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png,webp', 'max:10240'],
        ];
    }
}
