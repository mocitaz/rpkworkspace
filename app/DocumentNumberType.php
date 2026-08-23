<?php

namespace App;

enum DocumentNumberType: string
{
    case Invoice = 'invoice';
    case Quotation = 'quotation';
    case EngagementLetter = 'engagement_letter';
    case ExportBundle = 'export_bundle';

    public function prefix(): string
    {
        $prefix = config("raf.numbering.prefixes.{$this->value}");

        return is_string($prefix) && $prefix !== '' ? $prefix : match ($this) {
            self::Invoice => 'INV',
            self::Quotation => 'QT',
            self::EngagementLetter => 'EL',
            self::ExportBundle => 'EXP',
        };
    }
}
