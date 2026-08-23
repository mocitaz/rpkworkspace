<?php

namespace App\Http\Requests;

use App\Models\Matter;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreMatterConflictCheckRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', Matter::class) && $this->user()->hasPermission('conflict.manage');
    }

    /** @return array<string, ValidationRule|array<mixed>|string> */
    public function rules(): array
    {
        return [
            'client_id' => ['required', 'exists:clients,id'],
            'names' => ['required', 'array', 'min:1', 'max:30'],
            'names.*' => ['nullable', 'string', 'max:255'],
        ];
    }
}
