<?php
declare(strict_types=1);

namespace App\Core;

use Throwable;

final class Router
{
    /** @var array<int, array{methods: array<int, string>, pattern: string, regex: string, handler: callable|array{0: class-string, 1: string}, middleware: array<int, callable|class-string>}> */
    private array $routes = [];

    /** @var array<string, array{to: string, code: int}> */
    private array $redirects = [];

    /** @var callable|array{0: class-string, 1: string}|null */
    private mixed $notFoundHandler = null;

    /**
     * @param array<int, string> $methods
     * @param callable|array{0: class-string, 1: string} $handler
     * @param array<int, callable|class-string> $middleware
     */
    public function add(array $methods, string $pattern, callable|array $handler, array $middleware = []): void
    {
        $normalized = '/' . trim($pattern, '/');
        if ($normalized === '//') {
            $normalized = '/';
        }

        $regex = preg_replace_callback(
            '/\{([a-zA-Z_][a-zA-Z0-9_]*)\}/',
            static fn(array $m): string => '(?P<' . $m[1] . '>[^/]+)',
            $normalized
        );

        $this->routes[] = [
            'methods' => array_map('strtoupper', $methods),
            'pattern' => $normalized,
            'regex' => '#^' . $regex . '$#',
            'handler' => $handler,
            'middleware' => $middleware,
        ];
    }

    /** @param callable|array{0: class-string, 1: string} $handler @param array<int, callable|class-string> $middleware */
    public function get(string $pattern, callable|array $handler, array $middleware = []): void
    {
        $this->add(['GET', 'HEAD'], $pattern, $handler, $middleware);
    }

    /** @param callable|array{0: class-string, 1: string} $handler @param array<int, callable|class-string> $middleware */
    public function post(string $pattern, callable|array $handler, array $middleware = []): void
    {
        $this->add(['POST'], $pattern, $handler, $middleware);
    }

    /** @param callable|array{0: class-string, 1: string} $handler @param array<int, callable|class-string> $middleware */
    public function put(string $pattern, callable|array $handler, array $middleware = []): void
    {
        $this->add(['PUT'], $pattern, $handler, $middleware);
    }

    /** @param callable|array{0: class-string, 1: string} $handler @param array<int, callable|class-string> $middleware */
    public function patch(string $pattern, callable|array $handler, array $middleware = []): void
    {
        $this->add(['PATCH'], $pattern, $handler, $middleware);
    }

    /** @param callable|array{0: class-string, 1: string} $handler @param array<int, callable|class-string> $middleware */
    public function delete(string $pattern, callable|array $handler, array $middleware = []): void
    {
        $this->add(['DELETE'], $pattern, $handler, $middleware);
    }

    public function redirect(string $from, string $to, int $code = 301): void
    {
        $cleanFrom = '/' . trim($from, '/');
        $this->redirects[$cleanFrom] = ['to' => $to, 'code' => $code];
    }

    /** @param callable|array{0: class-string, 1: string} $handler */
    public function setNotFound(callable|array $handler): void
    {
        $this->notFoundHandler = $handler;
    }

    public function dispatch(Request $request): void
    {
        // Handle CORS preflight OPTIONS on API routes
        if ($request->method === 'OPTIONS') {
            header('Access-Control-Allow-Origin: ' . ($request->header('origin') ?? '*'));
            header('Access-Control-Allow-Credentials: true');
            header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
            header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-CSRF-Token, X-Cron-Secret');
            http_response_code(204);
            exit;
        }

        // Trailing-slash 301 normalization for GET/HEAD (except root /)
        if (in_array($request->method, ['GET', 'HEAD'], true) && strlen($request->path) > 1 && str_ends_with($request->path, '/')) {
            $cleanPath = rtrim($request->path, '/');
            $qs = $_SERVER['QUERY_STRING'] ?? '';
            Response::redirect($cleanPath . ($qs !== '' ? "?{$qs}" : ''), 301);
        }

        // Static 301 Redirects
        if (in_array($request->method, ['GET', 'HEAD'], true) && isset($this->redirects[$request->path])) {
            $rule = $this->redirects[$request->path];
            Response::redirect($rule['to'], $rule['code']);
        }

        // Dynamic Database-Driven 301/302 Redirect Manager (seo_redirects)
        if (
            in_array($request->method, ['GET', 'HEAD'], true)
            && !str_starts_with($request->path, '/api/')
            && !str_starts_with($request->path, '/assets/')
            && !str_starts_with($request->path, '/uploads/')
        ) {
            try {
                $redirectRow = Database::fetchOne(
                    'SELECT id, new_url, redirect_type FROM seo_redirects WHERE old_url = ? AND status = ? LIMIT 1',
                    [$request->path, 'active']
                );
                if ($redirectRow !== null && !empty($redirectRow['new_url'])) {
                    Database::query('UPDATE seo_redirects SET hit_count = hit_count + 1 WHERE id = ?', [$redirectRow['id']]);
                    $code = (int) ($redirectRow['redirect_type'] ?? 301);
                    if (!in_array($code, [301, 302, 307], true)) {
                        $code = 301;
                    }
                    Response::redirect((string) $redirectRow['new_url'], $code);
                }
            } catch (Throwable) {
                // Continue gracefully if DB is initializing
            }
        }

        // Match registered routes
        foreach ($this->routes as $route) {
            if (!in_array($request->method, $route['methods'], true)) {
                continue;
            }
            if (preg_match($route['regex'], $request->path, $matches)) {
                $params = [];
                foreach ($matches as $k => $v) {
                    if (is_string($k)) {
                        $params[$k] = rawurldecode($v);
                    }
                }
                $request->params = $params;

                foreach ($route['middleware'] as $mw) {
                    if (is_string($mw) && class_exists($mw)) {
                        $instance = new $mw();
                        $instance->handle($request);
                    } elseif (is_callable($mw)) {
                        $mw($request);
                    }
                }

                $this->invoke($route['handler'], $request);
                return;
            }
        }

        if ($request->expectsJson()) {
            Response::json([
                'success' => false,
                'message' => "Route not found: {$request->method} {$request->path}",
            ], 404);
        }

        if ($this->notFoundHandler !== null) {
            $this->invoke($this->notFoundHandler, $request);
            return;
        }

        Response::html('<h1>404 Not Found</h1>', 404);
    }

    /**
     * @param callable|array{0: class-string, 1: string} $handler
     */
    private function invoke(callable|array $handler, Request $request): void
    {
        if (is_array($handler)) {
            [$class, $method] = $handler;
            $controller = new $class();
            $controller->{$method}($request);
            return;
        }
        $handler($request);
    }
}
