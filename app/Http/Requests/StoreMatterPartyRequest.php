<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreMatterPartyRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->hasPermission('matter.update') ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'party_type' => ['required', 'string', 'max:100'],
            'name' => ['nullable', 'string', 'max:255', 'required_without:organization_name'],
            'organization_name' => ['nullable', 'string', 'max:255', 'required_without:name'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
