<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class IngestInboundEmailRequest extends FormRequest
{
    public function authorize(): bool
    {
        $secret = config('raf.inbound_email.secret');
        $timestamp = $this->header('X-RAF-Timestamp');
        $signature = $this->header('X-RAF-Signature');

        if (! is_string($secret) || $secret === '' || ! is_string($timestamp) || ! ctype_digit($timestamp) || ! is_string($signature)) {
            return false;
        }

        if (abs(now()->getTimestamp() - (int) $timestamp) > 300) {
            return false;
        }

        return hash_equals(hash_hmac('sha256', $timestamp.'.'.$this->getContent(), $secret), $signature);
    }

    /** @return array<string, ValidationRule|array<mixed>|string> */
    public function rules(): array
    {
        return [
            'message_id' => ['required', 'string', 'max:255'],
            'from' => ['required', 'array', 'min:1', 'max:20'],
            'from.*' => ['required', 'email:rfc', 'max:255'],
            'to' => ['required', 'array', 'min:1', 'max:50'],
            'to.*' => ['required', 'email:rfc', 'max:255'],
            'cc' => ['nullable', 'array', 'max:50'],
            'cc.*' => ['email:rfc', 'max:255'],
            'subject' => ['required', 'string', 'max:255'],
            'text' => ['nullable', 'string', 'max:20000'],
            'occurred_at' => ['nullable', 'date'],
            'attachments' => ['nullable', 'array', 'max:10'],
            'attachments.*.filename' => ['required_with:attachments', 'string', 'max:255'],
            'attachments.*.mime_type' => ['required_with:attachments', 'string', 'max:100'],
            'attachments.*.content_base64' => ['required_with:attachments', 'string', 'max:16000000'],
        ];
    }
}
