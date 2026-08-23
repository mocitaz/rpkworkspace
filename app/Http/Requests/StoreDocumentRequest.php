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
            'status' => ['required', 'in:draft,under_review,revision_requested,approved,final,signed'],
            'confidentiality_level' => ['required', 'in:standard,confidential,restricted'],
            'file' => ['required', File::types(['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'jpg', 'jpeg', 'png'])->max(25 * 1024)],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
