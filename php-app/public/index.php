<?php
declare(strict_types=1);

/**
 * ONPRINT — Hostinger Shared Hosting Front Controller (PHP 8.2+)
 *
 * Supports both deployment layouts automatically:
 *   Layout A (Secure Split): public_html/index.php + ../php-app/{app,config,views,.env}
 *   Layout B (Standard Root): php-app/public/index.php + php-app/{app,config,views,.env}
 */

define('ONPRINT_PUBLIC_PATH', __DIR__);

$candidateRoots = [
    dirname(__DIR__),
    dirname(__DIR__) . DIRECTORY_SEPARATOR . 'php-app',
    __DIR__ . DIRECTORY_SEPARATOR . 'php-app',
];

$resolvedRoot = dirname(__DIR__);
foreach ($candidateRoots as $candidate) {
    if (is_file($candidate . DIRECTORY_SEPARATOR . 'vendor' . DIRECTORY_SEPARATOR . 'autoload.php')) {
        $resolvedRoot = $candidate;
        break;
    }
}

define('ONPRINT_BASE_PATH', $resolvedRoot);

// When running via PHP built-in CLI server for local QA (`php -S`), serve existing static files directly
if (PHP_SAPI === 'cli-server') {
    $reqPath = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
    $staticFile = __DIR__ . str_replace('/', DIRECTORY_SEPARATOR, $reqPath);
    if ($reqPath !== '/' && $reqPath !== '/index.php' && is_file($staticFile)) {
        return false;
    }
}

require_once ONPRINT_BASE_PATH . DIRECTORY_SEPARATOR . 'vendor' . DIRECTORY_SEPARATOR . 'autoload.php';

use App\Controllers\HealthController;
use App\Core\Env;
use App\Core\Request;
use App\Core\Response;
use App\Core\Router;
use App\Core\Session;
use App\Middleware\AuthMiddleware;

HealthController::markBoot();
Env::load(ONPRINT_BASE_PATH . DIRECTORY_SEPARATOR . '.env');

$appConfig = require base_path('config/app.php');
date_default_timezone_set((string) ($appConfig['timezone'] ?? 'Asia/Dubai'));

if ($appConfig['debug']) {
    ini_set('display_errors', '1');
    error_reporting(E_ALL);
} else {
    ini_set('display_errors', '0');
    error_reporting(E_ALL & ~E_DEPRECATED & ~E_STRICT);
}

// Security response headers
if (!headers_sent()) {
    header_remove('X-Powered-By');
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: SAMEORIGIN');
    header('Referrer-Policy: strict-origin-when-cross-origin');
}

Session::start();

set_exception_handler(static function (Throwable $e) use ($appConfig): void {
    $logDir = storage_path('logs');
    if (!is_dir($logDir)) {
        @mkdir($logDir, 0775, true);
    }
    @file_put_contents(
        $logDir . DIRECTORY_SEPARATOR . 'error.log',
        sprintf("[%s] %s in %s:%d\n%s\n\n", date('Y-m-d H:i:s'), $e->getMessage(), $e->getFile(), $e->getLine(), $e->getTraceAsString()),
        FILE_APPEND
    );

    $reqUri = (string) ($_SERVER['REQUEST_URI'] ?? '/');
    $isApi = str_starts_with($reqUri, '/api/');
    $statusCode = ($e->getCode() >= 400 && $e->getCode() < 600) ? (int) $e->getCode() : 500;

    if ($isApi) {
        Response::json([
            'success' => false,
            'message' => $appConfig['debug'] ? $e->getMessage() : ($statusCode < 500 ? $e->getMessage() : 'Internal server error'),
        ], $statusCode);
    }

    Response::html(
        '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>Error — ONPRINT</title></head>'
        . '<body style="font-family:sans-serif;background:#F5F0E7;color:#352719;padding:48px;text-align:center;">'
        . '<h1>Something went wrong</h1>'
        . '<p>' . ($appConfig['debug'] ? e($e->getMessage()) : 'Our engineering desk has logged this request. Please try again shortly.') . '</p>'
        . '<p><a href="/" style="color:#795C43;font-weight:bold;">Return to ONPRINT Homepage</a></p>'
        . '</body></html>',
        $statusCode
    );
});

$request = new Request();
AuthMiddleware::resolveUser($request);

$router = new Router();

$webRoutes = base_path('routes/web.php');
if (is_file($webRoutes)) {
    require $webRoutes;
}

$apiRoutes = base_path('routes/api.php');
if (is_file($apiRoutes)) {
    require $apiRoutes;
}

$router->dispatch($request);
