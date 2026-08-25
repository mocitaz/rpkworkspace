<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateClientRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('client'));
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $merges = [];

        if (! $this->filled('country_code')) {
            $merges['country_code'] = $this->route('client')?->country_code ?? 'ID';
        }

        if ($this->has('relationship_partner_id') && ($this->input('relationship_partner_id') === '' || $this->input('relationship_partner_id') === null)) {
            $merges['relationship_partner_id'] = null;
        }

        if ($this->has('kyc_assessed_by') && ($this->input('kyc_assessed_by') === '' || $this->input('kyc_assessed_by') === null)) {
            $merges['kyc_assessed_by'] = null;
        }

        if (! empty($merges)) {
            $this->merge($merges);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'type' => ['required', 'in:organization,individual'],
            'legal_name' => ['required', 'string', 'max:255'],
            'display_name' => ['required', 'string', 'max:255'],
            'industry' => ['nullable', 'string', 'max:150'],
            'tax_identifier' => ['sometimes', 'nullable', 'string', 'max:100'],
            'registration_identifier' => ['nullable', 'string', 'max:100'],
            'website' => ['nullable', 'url', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:255'],
            'address_line_1' => ['nullable', 'string', 'max:255'],
            'address_line_2' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:100'],
            'province' => ['nullable', 'string', 'max:100'],
            'postal_code' => ['nullable', 'string', 'max:20'],
            'country_code' => ['sometimes', 'nullable', 'string', 'size:2'],
            'notes' => ['nullable', 'string', 'max:10000'],
            'kyc_risk_level' => ['sometimes', 'nullable', 'in:low,medium,high'],
            'kyc_status' => ['sometimes', 'nullable', 'in:verified,in_review,pending_documents,rejected'],
            'kyc_checklist' => ['sometimes', 'nullable', 'array'],
            'kyc_notes' => ['sometimes', 'nullable', 'string', 'max:10000'],
            'kyc_assessed_at' => ['sometimes', 'nullable', 'date'],
            'kyc_assessed_by' => ['sometimes', 'nullable', 'exists:users,id'],
            'status' => ['required', 'in:active,inactive,closed'],
            'relationship_partner_id' => ['nullable', 'exists:users,id'],
            'opened_at' => ['nullable', 'date'],
            'closed_at' => ['nullable', 'date', 'after_or_equal:opened_at'],
        ];
    }
}
