<?php
declare(strict_types=1);

use App\Controllers\HealthController;

/** @var \App\Core\Router $router */

$router->get('/api/health', [HealthController::class, 'check']);
$router->get('/api/health/db', [HealthController::class, 'checkDb']);
