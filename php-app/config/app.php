<?php
declare(strict_types=1);

return [
    'name' => env('APP_NAME', 'ONPRINT'),
    'env' => env('APP_ENV', 'production'),
    'debug' => (bool) env('APP_DEBUG', false),
    'site_url' => rtrim((string) env('SITE_URL', 'https://www.0nprint.com'), '/'),
    'whatsapp_number' => whatsapp_number(),
    'support_email' => env('SUPPORT_EMAIL', '0nprint183@gmail.com'),
    'company_trn' => env('COMPANY_TRN', '100482910400003'),
    'adsense_pub_id' => env('ADSENSE_PUB_ID', 'pub-2412757543318629'),
    'google_verification' => env('GOOGLE_SITE_VERIFICATION', ''),
    'timezone' => 'Asia/Dubai',
    'currency' => 'AED',
    'vat_rate' => 0.05,
];
