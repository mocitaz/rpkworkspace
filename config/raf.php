<?php

return [
    'firm' => [
        'name' => env('RAF_FIRM_NAME', 'RPK Law Firm'),
        'code' => env('RAF_FIRM_CODE', 'RPK'),
    ],
    'finance' => [
        'currency' => env('RAF_FINANCE_CURRENCY', 'IDR'),
    ],
    'numbering' => [
        'prefixes' => [
            'invoice' => env('RAF_INVOICE_PREFIX', 'INV'),
            'quotation' => env('RAF_QUOTATION_PREFIX', 'QT'),
            'engagement_letter' => env('RAF_ENGAGEMENT_LETTER_PREFIX', 'EL'),
            'export_bundle' => env('RAF_EXPORT_BUNDLE_PREFIX', 'EXP'),
        ],
    ],
    'queues' => [
        'documents' => env('RAF_QUEUE_DOCUMENTS', 'documents'),
        'notifications' => env('RAF_QUEUE_NOTIFICATIONS', 'notifications'),
        'generation' => env('RAF_QUEUE_GENERATION', 'generation'),
        'exports' => env('RAF_QUEUE_EXPORTS', 'exports'),
        'calendar' => env('RAF_QUEUE_CALENDAR', 'notifications'),
    ],

    'signature' => [
        'verification_url_path' => env('RAF_SIGNATURE_VERIFICATION_URL_PATH', 'verify/signature'),
        'reminder_interval_hours' => env('RAF_SIGNATURE_REMINDER_INTERVAL_HOURS', 24),
        'libreoffice_binary' => env('RAF_LIBREOFFICE_BINARY', 'soffice'),
        'conversion_timeout' => (int) env('RAF_SIGNATURE_CONVERSION_TIMEOUT', 180),
    ],
    'timezone' => env('RAF_TIMEZONE', 'Asia/Jakarta'),
    'documents' => [
        'disk' => env('RAF_DOCUMENT_DISK', 'local'),
        'require_clean_downloads' => (bool) env('RAF_REQUIRE_CLEAN_DOWNLOADS', false),
        'scanner' => [
            'binary' => env('RAF_CLAMAV_BINARY', 'clamscan'),
            'timeout' => (int) env('RAF_CLAMAV_TIMEOUT', 120),
        ],
        'extraction' => [
            'allow_unscanned' => (bool) env('RAF_EXTRACT_UNSCANNED', true),
            'pdftotext_binary' => env('RAF_PDFTOTEXT_BINARY', 'pdftotext'),
            'tesseract_binary' => env('RAF_TESSERACT_BINARY', 'tesseract'),
            'ocr_languages' => env('RAF_OCR_LANGUAGES', 'ind+eng'),
            'timeout' => (int) env('RAF_EXTRACTION_TIMEOUT', 180),
            'max_characters' => (int) env('RAF_EXTRACTED_TEXT_MAX_CHARACTERS', 500000),
        ],
    ],
    'notifications' => [
        'deadline_reminder_hours' => [48, 24, 4],
    ],
    'inbound_email' => [
        'secret' => env('RAF_INBOUND_EMAIL_SECRET'),
        'actor_id' => env('RAF_INBOUND_EMAIL_ACTOR_ID'),
    ],
];
