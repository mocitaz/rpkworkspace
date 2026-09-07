<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreSignatureRequestRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        if (! $this->has('mode') || empty($this->input('mode'))) {
            $this->merge(['mode' => 'parallel']);
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
            'document_version_id' => ['nullable', 'string', 'exists:document_versions,id'],
            'mode' => ['nullable', 'in:sequential,parallel'],
            'expires_at' => ['nullable', 'date', 'after:now'],
            'signers' => ['required', 'array', 'min:1', 'max:20'],
            'signers.*.name' => ['required', 'string', 'max:255'],
            'signers.*.email' => ['required', 'string', 'max:255'],
            'signers.*.signing_order' => ['nullable', 'integer', 'min:1'],
        ];
    }
}
