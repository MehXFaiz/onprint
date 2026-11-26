<?php
declare(strict_types=1);

namespace App\Middleware;

use App\Core\Csrf;
use App\Core\Request;
use App\Core\Response;

final class CsrfMiddleware
{
    public function handle(Request $request): void
    {
        if (in_array($request->method, ['GET', 'HEAD', 'OPTIONS'], true)) {
            return;
        }

        // Stateless Bearer JWT API calls are inherently immune to cookie-based CSRF
        if ($request->bearerToken() !== null) {
            return;
        }

        $token = $request->header('x-csrf-token') ?? (string) $request->input('_csrf', '');
        if (!Csrf::verify($token)) {
            if ($request->expectsJson()) {
                Response::json([
                    'success' => false,
                    'message' => 'Invalid or expired security token (CSRF). Please refresh the page and try again.',
                ], 419);
            }
            Response::html('<h1>419 Page Expired</h1><p>Security token mismatch. Please go back, refresh, and submit again.</p>', 419);
        }
    }
}
