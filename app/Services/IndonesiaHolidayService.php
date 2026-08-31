<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Throwable;

class IndonesiaHolidayService
{
    /**
     * @return list<array{date: string, name: string, type: string, is_joint_leave: bool}>
     */
    public function forYear(int $year): array
    {
        $apiKey = config('services.indonesia_holidays.key');
        $endpoint = config('services.indonesia_holidays.url');

        if (! is_string($apiKey) || blank($apiKey) || ! is_string($endpoint) || blank($endpoint)) {
            return [];
        }

        $cacheKey = "indonesia-holidays:{$year}";
        $cachedHolidays = Cache::get($cacheKey);

        if (is_array($cachedHolidays)) {
            return $cachedHolidays;
        }

        $holidays = $this->fetch($endpoint, $apiKey, $year);

        if ($holidays === null) {
            return [];
        }

        Cache::put($cacheKey, $holidays, now()->addDay());

        return $holidays;
    }

    /**
     * @return list<array{date: string, name: string, type: string, is_joint_leave: bool}>|null
     */
    private function fetch(string $endpoint, string $apiKey, int $year): ?array
    {
        try {
            $response = Http::acceptJson()
                ->withHeaders(['x-api-key' => $apiKey])
                ->connectTimeout(3)
                ->timeout(5)
                ->get($endpoint, ['tahun' => $year]);

            if ($response->failed() || ! is_array($response->json('data'))) {
                return null;
            }

            return collect($response->json('data'))
                ->filter(fn (mixed $holiday): bool => is_array($holiday)
                    && ($holiday['is_active'] ?? 1)
                    && is_string($holiday['date'] ?? null)
                    && is_string($holiday['name'] ?? null))
                ->map(fn (array $holiday): array => [
                    'date' => $holiday['date'],
                    'name' => $holiday['name'],
                    'type' => is_string($holiday['type'] ?? null) ? $holiday['type'] : 'nasional',
                    'is_joint_leave' => (bool) ($holiday['is_joint_leave'] ?? false),
                ])
                ->values()
                ->all();
        } catch (Throwable) {
            return null;
        }
    }
}
