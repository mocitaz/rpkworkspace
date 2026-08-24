<?php

namespace Database\Factories;

use App\Models\SignatureRequest;
use App\Models\SignatureSigner;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<SignatureSigner>
 */
class SignatureSignerFactory extends Factory
{
    protected $model = SignatureSigner::class;

    public function definition(): array
    {
        return [
            'signature_request_id' => SignatureRequest::factory(),
            'name' => fake()->name(),
            'email' => fake()->safeEmail(),
            'signing_order' => 1,
            'signing_token' => Str::random(40),
            'status' => 'pending',
            'signed_at' => null,
            'last_reminded_at' => null,
            'signed_ip_address' => fake()->ipv4(),
            'signed_user_agent' => fake()->userAgent(),
            'accepted_name' => null,
            'signature_data' => null,
        ];
    }
}
