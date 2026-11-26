<?php
declare(strict_types=1);

return [
    'driver' => env('DB_CONNECTION', 'mysql'),
    'host' => env('DB_HOST', '127.0.0.1'),
    'port' => (int) env('DB_PORT', 3306),
    'database' => env('DB_NAME', 'onprint_php_db'),
    'username' => env('DB_USER', 'root'),
    'password' => (string) env('DB_PASSWORD', ''),
    'charset' => env('DB_CHARSET', 'utf8mb4'),
    'collation' => 'utf8mb4_unicode_ci',
];
