<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\File;

class CreateDocumentTemplateVersionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->hasPermission('template.manage') ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'file' => ['required', File::types(['docx'])->max(25 * 1024)],
            'name' => ['nullable', 'string', 'max:255'],
            'document_type' => ['nullable', 'string', 'max:100'],
            'placeholders' => ['nullable', 'array'],
            'placeholders.*' => ['string', 'max:100'],
        ];
    }
}
