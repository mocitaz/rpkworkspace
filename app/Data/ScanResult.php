<?php

namespace App\Data;

final readonly class ScanResult
{
    public function __construct(
        public string $status,
        public string $message,
    ) {}
}
