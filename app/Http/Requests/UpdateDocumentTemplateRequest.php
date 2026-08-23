<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateDocumentTemplateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasPermission('template.manage') ?? false;
    }

    /** @return array<string, ValidationRule|array<mixed>|string> */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'document_type' => ['nullable', 'string', 'max:100'],
            'placeholders' => ['nullable', 'array'],
            'placeholders.*' => ['string', 'max:100'],
            'status' => ['required', 'in:active,inactive'],
        ];
    }
}
