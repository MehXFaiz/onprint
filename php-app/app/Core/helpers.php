<?php
declare(strict_types=1);

use App\Core\Csrf;
use App\Core\Env;
use App\Core\Session;

if (!function_exists('env')) {
    function env(string $key, mixed $default = null): mixed
    {
        return Env::get($key, $default);
    }
}

if (!function_exists('e')) {
    function e(mixed $value): string
    {
        return htmlspecialchars((string) ($value ?? ''), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    }
}

if (!function_exists('base_path')) {
    function base_path(string $subPath = ''): string
    {
        $root = defined('ONPRINT_BASE_PATH') ? ONPRINT_BASE_PATH : dirname(__DIR__, 2);
        return $subPath === '' ? $root : $root . DIRECTORY_SEPARATOR . ltrim(str_replace(['/', '\\'], DIRECTORY_SEPARATOR, $subPath), DIRECTORY_SEPARATOR);
    }
}

if (!function_exists('public_path')) {
    function public_path(string $subPath = ''): string
    {
        $pub = defined('ONPRINT_PUBLIC_PATH') ? ONPRINT_PUBLIC_PATH : base_path('public');
        return $subPath === '' ? $pub : $pub . DIRECTORY_SEPARATOR . ltrim(str_replace(['/', '\\'], DIRECTORY_SEPARATOR, $subPath), DIRECTORY_SEPARATOR);
    }
}

if (!function_exists('storage_path')) {
    function storage_path(string $subPath = ''): string
    {
        return base_path('storage' . ($subPath !== '' ? '/' . ltrim($subPath, '/') : ''));
    }
}

if (!function_exists('site_url')) {
    function site_url(string $path = ''): string
    {
        $base = rtrim((string) env('SITE_URL', 'https://www.0nprint.com'), '/');
        if ($path === '' || $path === '/') {
            return $base . ($path === '/' ? '/' : '');
        }
        return $base . '/' . ltrim($path, '/');
    }
}

if (!function_exists('url')) {
    function url(string $path = '/'): string
    {
        $scriptDir = '';
        if (!empty($_SERVER['SCRIPT_NAME'])) {
            $dir = str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME']));
            if ($dir !== '/' && $dir !== '.' && !str_ends_with($dir, '/public')) {
                $scriptDir = rtrim($dir, '/');
            }
        }
        if ($path === '' || $path === '/') {
            return $scriptDir === '' ? '/' : $scriptDir . '/';
        }
        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return $path;
        }
        return $scriptDir . '/' . ltrim($path, '/');
    }
}

if (!function_exists('asset')) {
    function asset(string $path): string
    {
        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://') || str_starts_with($path, 'data:')) {
            return $path;
        }
        $clean = ltrim($path, '/');
        if (!str_starts_with($clean, 'assets/') && !str_starts_with($clean, 'uploads/')) {
            // Root public files like logo_icon.png, favicon.svg
            return url('/' . $clean);
        }
        return url('/' . $clean);
    }
}

if (!function_exists('csrf_token')) {
    function csrf_token(): string
    {
        return Csrf::token();
    }
}

if (!function_exists('csrf_field')) {
    function csrf_field(): string
    {
        return '<input type="hidden" name="_csrf" value="' . e(Csrf::token()) . '">';
    }
}

if (!function_exists('current_user')) {
    function current_user(): ?array
    {
        return Session::get('auth_user');
    }
}

if (!function_exists('whatsapp_number')) {
    function whatsapp_number(): string
    {
        $raw = preg_replace('/\D+/', '', (string) env('WHATSAPP_NUMBER', '447344546056'));
        return ltrim((string) $raw, '0') ?: '447344546056';
    }
}

if (!function_exists('whatsapp_url')) {
    function whatsapp_url(string $message = 'Hello ONPRINT, I would like a printing quotation in Dubai.'): string
    {
        return 'https://wa.me/' . whatsapp_number() . '?text=' . rawurlencode($message);
    }
}

if (!function_exists('slugify')) {
    function slugify(string $text): string
    {
        $slug = strtolower(trim($text));
        $slug = preg_replace('/\s+/', '-', $slug) ?? '';
        $slug = preg_replace('/[^\w\-]+/', '', $slug) ?? '';
        $slug = preg_replace('/\-\-+/', '-', $slug) ?? '';
        return trim($slug, '-');
    }
}
