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
            'stamp_layout' => ['nullable', 'string', 'in:sig_left,qr_left,stacked,sig_only,qr_only'],
            'name_position' => ['nullable', 'string', 'in:bottom,top,none'],
            'signer_title' => ['nullable', 'string', 'max:255'],
            'stamp_width' => ['nullable', 'numeric', 'min:20', 'max:150'],
            'stamp_height' => ['nullable', 'numeric', 'min:12', 'max:100'],
            'show_qr' => ['nullable', 'boolean'],
            'show_name' => ['nullable', 'boolean'],
            'show_title' => ['nullable', 'boolean'],
            'show_border' => ['nullable', 'boolean'],
            'signature_type' => ['nullable', 'string', 'in:draw,type,upload'],
        ];
    }
}
