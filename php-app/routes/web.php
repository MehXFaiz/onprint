<?php
declare(strict_types=1);

use App\Controllers\HealthController;
use App\Core\Response;

/** @var \App\Core\Router $router */

$router->get('/health', [HealthController::class, 'check']);
$router->get('/healthz', [HealthController::class, 'check']);
$router->get('/ping', [HealthController::class, 'check']);
