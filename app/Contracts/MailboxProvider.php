<?php

namespace App\Contracts;

interface MailboxProvider
{
    public function authorizationUrl(string $state): string;

    /** @return array{access_token: string, refresh_token?: string|null, expires_at?: \DateTimeInterface|null} */
    public function exchangeAuthorizationCode(string $code): array;
}
