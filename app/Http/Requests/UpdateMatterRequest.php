<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateMatterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('matter'));
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
            'summary' => ['nullable', 'string', 'max:20000'],
            'practice_area_id' => ['nullable', 'exists:practice_areas,id'],
            'matter_type' => ['nullable', 'string', 'max:100'],
            'status' => ['required', 'in:prospective,active,on_hold,closed,archived'],
            'priority' => ['required', 'in:low,normal,high,critical'],
            'confidentiality_level' => ['required', 'in:standard,confidential,restricted'],
            'responsible_partner_id' => ['required', 'exists:users,id'],
            'supervising_lawyer_id' => ['nullable', 'exists:users,id'],
            'opened_at' => ['nullable', 'date'],
            'closed_at' => ['nullable', 'date', 'after_or_equal:opened_at'],
            'jurisdiction' => ['nullable', 'string', 'max:150'],
            'court' => ['nullable', 'string', 'max:255'],
            'external_case_number' => ['nullable', 'string', 'max:150'],
            'parent_matter_id' => ['nullable', 'exists:matters,id'],
            'relationship_type' => ['nullable', 'string', 'in:appeal_pt,cassation_ma,judicial_review_pk,execution,counterclaim_reconvention,related_dispute'],
            'member_ids' => ['present', 'array'],
            'member_ids.*' => ['integer', 'distinct', 'exists:users,id'],
        ];
    }
}
