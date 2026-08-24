<?php

namespace App\Support;

class Terbilang
{
    private static array $units = [
        '', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas',
    ];

    public static function make(float|int|string|null $number): string
    {
        $number = (float) ($number ?? 0);
        if ($number < 0) {
            return 'Minus '.self::make(abs($number));
        }

        $number = floor($number);

        if ($number < 12) {
            return self::$units[(int) $number];
        }
        if ($number < 20) {
            return self::make($number - 10).' Belas';
        }
        if ($number < 100) {
            return trim(self::make((int) ($number / 10)).' Puluh '.self::make($number % 10));
        }
        if ($number < 200) {
            return trim('Seratus '.self::make($number - 100));
        }
        if ($number < 1000) {
            return trim(self::make((int) ($number / 100)).' Ratus '.self::make($number % 100));
        }
        if ($number < 2000) {
            return trim('Seribu '.self::make($number - 1000));
        }
        if ($number < 1000000) {
            return trim(self::make((int) ($number / 1000)).' Ribu '.self::make($number % 1000));
        }
        if ($number < 1000000000) {
            return trim(self::make((int) ($number / 1000000)).' Juta '.self::make(fmod($number, 1000000)));
        }
        if ($number < 1000000000000) {
            return trim(self::make((int) ($number / 1000000000)).' Miliar '.self::make(fmod($number, 1000000000)));
        }

        return trim(self::make((int) ($number / 1000000000000)).' Triliun '.self::make(fmod($number, 1000000000000)));
    }
}
