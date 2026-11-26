<?php
declare(strict_types=1);

return [
    'jwt_secret' => (string) env('JWT_SECRET', 'change_this_to_a_secure_jwt_hmac_sha256_secret_key_2026'),
    'jwt_expires_days' => (int) env('JWT_EXPIRES_DAYS', 7),
    'cron_secret' => (string) env('CRON_SECRET', 'onprint_daily_seo_cron_secret_2026'),
    'roles' => [
        'super_admin' => [
            'label' => 'Super Administrator',
            'modules' => ['*'],
            'actions' => ['view', 'create', 'edit', 'delete', 'post', 'manage_roles', 'settings'],
        ],
        'admin' => [
            'label' => 'Administrator',
            'modules' => ['dashboard', 'products', 'categories', 'services', 'blog', 'seo', 'orders', 'quotes', 'customers', 'portfolio', 'messages', 'settings'],
            'actions' => ['view', 'create', 'edit', 'delete', 'post', 'settings'],
        ],
        'employee' => [
            'label' => 'Staff / Press Coordinator',
            'modules' => ['dashboard', 'products', 'categories', 'services', 'blog', 'orders', 'quotes', 'portfolio', 'messages'],
            'actions' => ['view', 'create', 'edit', 'post'],
        ],
        'customer' => [
            'label' => 'Customer',
            'modules' => ['customer_portal'],
            'actions' => ['view', 'create'],
        ],
    ],
];
