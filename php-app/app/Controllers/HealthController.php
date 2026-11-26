<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Core\Database;
use App\Core\Request;
use App\Core\Response;

final class HealthController
{
    private static float $bootTime = 0.0;

    public static function markBoot(): void
    {
        if (self::$bootTime === 0.0) {
            self::$bootTime = $_SERVER['REQUEST_TIME_FLOAT'] ?? microtime(true);
        }
    }

    public function check(Request $request): void
    {
        if ($request->method === 'HEAD') {
            http_response_code(200);
            exit;
        }

        $connected = Database::isConnected();
        Response::json([
            'success' => true,
            'status' => 'ok',
            'health' => 'healthy',
            'service' => 'ONPRINT',
            'runtime' => 'PHP ' . PHP_VERSION,
            'database' => 'mysql',
            'databaseConnected' => $connected,
            'timestamp' => gmdate('c'),
            'message' => 'ONPRINT Production PHP/MySQL API is running',
        ], 200);
    }

    public function checkDb(Request $request): void
    {
        $connected = Database::isConnected();
        if ($connected) {
            Response::json([
                'success' => true,
                'database' => 'MySQL',
                'connected' => true,
            ], 200);
        }

        Response::json([
            'success' => false,
            'database' => 'MySQL',
            'connected' => false,
            'error' => 'Database connection unavailable',
        ], 500);
    }
}
