<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreCorrespondenceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->hasPermission('correspondence.manage') ?? false;
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
            'direction' => ['required', 'in:inbound,outbound'],
            'source' => ['required', 'in:manual,bcc,gmail,microsoft'],
            'subject' => ['required', 'string', 'max:255'],
            'from_addresses' => ['required', 'string', 'max:2000'],
            'to_addresses' => ['required', 'string', 'max:2000'],
            'body' => ['nullable', 'string', 'max:20000'],
            'occurred_at' => ['required', 'date'],
            'document_ids' => ['nullable', 'array'],
            'document_ids.*' => ['string', 'exists:documents,id'],
        ];
    }
}
