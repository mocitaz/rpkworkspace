<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdatePayrollRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
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
            'basic_salary' => ['required', 'integer', 'min:0'],
            'fixed_allowance' => ['nullable', 'integer', 'min:0'],
            'transport_meal_allowance' => ['nullable', 'integer', 'min:0'],
            'overtime_amount' => ['nullable', 'integer', 'min:0'],
            'bonus_amount' => ['nullable', 'integer', 'min:0'],
            'deductions_amount' => ['nullable', 'integer', 'min:0'],
            'tax_deduction_amount' => ['nullable', 'integer', 'min:0'],
            'status' => ['required', 'string', 'in:draft,approved,paid'],
            'payment_account_id' => ['nullable', 'exists:financial_accounts,id'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
