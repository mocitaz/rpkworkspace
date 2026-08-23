<?php

namespace App\Http\Requests;

use App\Models\Matter;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreMatterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('create', Matter::class);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'client_id' => ['required', 'exists:clients,id'],
            'summary' => ['nullable', 'string', 'max:20000'],
            'practice_area_id' => ['nullable', 'exists:practice_areas,id'],
            'matter_type' => ['nullable', 'string', 'max:100'],
            'status' => ['required', 'in:prospective,active,on_hold,closed,archived'],
            'priority' => ['required', 'in:low,normal,high,critical'],
            'confidentiality_level' => ['required', 'in:standard,confidential,restricted'],
            'responsible_partner_id' => ['required', 'exists:users,id'],
            'supervising_lawyer_id' => ['nullable', 'exists:users,id'],
            'opened_at' => ['nullable', 'date'],
            'jurisdiction' => ['nullable', 'string', 'max:150'],
            'court' => ['nullable', 'string', 'max:255'],
            'external_case_number' => ['nullable', 'string', 'max:150'],
            'member_ids' => ['nullable', 'array'],
            'member_ids.*' => ['integer', 'exists:users,id'],
            'conflict_check_id' => ['required', 'exists:conflict_checks,id'],
        ];
    }
}
