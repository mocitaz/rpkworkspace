<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class GenerateDocumentFromTemplateRequest extends FormRequest
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
            'matter_id' => ['required', 'exists:matters,id'],
            'title' => ['required', 'string', 'max:255'],
            'placeholders' => ['nullable', 'array'],
            'placeholders.*' => ['nullable', 'string', 'max:5000'],
        ];
    }
}
