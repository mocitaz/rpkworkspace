<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class SignSignatureRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'accepted_name' => ['required', 'string', 'max:255'],
            'accept_terms' => ['accepted'],
            'signature_data' => ['nullable', 'string', 'max:500000'],
            'page_number' => ['nullable', 'integer', 'min:1'],
            'position_x' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'position_y' => ['nullable', 'numeric', 'min:0', 'max:100'],
        ];
    }
}
