<?php

namespace App\Http\Requests;

use App\Models\Document;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\File;

class StoreDocumentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('create', Document::class);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'matter_id' => ['nullable', 'exists:matters,id'],
            'client_id' => ['nullable', 'exists:clients,id'],
            'title' => ['required', 'string', 'max:255'],
            'document_type' => ['nullable', 'string', 'max:100'],
            'status' => ['nullable', 'string', 'in:draft,under_review,revision_requested,approved,final,signed'],
            'confidentiality_level' => ['nullable', 'string', 'in:standard,confidential,restricted,strictly_confidential'],
            'file' => ['required', File::types(['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'jpg', 'jpeg', 'png'])->max(50 * 1024)],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'matter_id' => $this->filled('matter_id') ? $this->input('matter_id') : null,
            'client_id' => $this->filled('client_id') ? $this->input('client_id') : null,
            'status' => $this->filled('status') ? $this->input('status') : 'draft',
            'confidentiality_level' => $this->filled('confidentiality_level') ? $this->input('confidentiality_level') : 'standard',
        ]);
    }
}
