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

        $this->merge([
            'basic_salary' => $cleanInt($this->input('basic_salary')) ?? 0,
            'fixed_allowance' => $cleanInt($this->input('fixed_allowance')) ?? 0,
            'transport_meal_allowance' => $cleanInt($this->input('transport_meal_allowance')) ?? 0,
            'overtime_amount' => $cleanInt($this->input('overtime_amount')) ?? 0,
            'bonus_amount' => $cleanInt($this->input('bonus_amount')) ?? 0,
            'deductions_amount' => $cleanInt($this->input('deductions_amount')) ?? 0,
            'tax_deduction_amount' => $cleanInt($this->input('tax_deduction_amount')) ?? 0,
        ]);
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'basic_salary.required' => 'Gaji pokok wajib diisi.',
            'basic_salary.min' => 'Gaji pokok tidak boleh bernilai negatif.',
        ];
    }
}
