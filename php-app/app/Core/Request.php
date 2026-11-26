<?php
declare(strict_types=1);

namespace App\Core;

final class Request
{
    public string $method;
    public string $path;
    public string $rawUri;
    /** @var array<string, mixed> */
    public array $query;
    /** @var array<string, mixed> */
    public array $body;
    /** @var array<string, string> */
    public array $headers;
    /** @var array<string, mixed> */
    public array $files;
    /** @var array<string, string> */
    public array $params = [];
    /** @var array<string, mixed>|null */
    public ?array $user = null;

    public function __construct()
    {
        $rawMethod = strtoupper((string) ($_SERVER['REQUEST_METHOD'] ?? 'GET'));
        $this->headers = self::parseHeaders();
        $this->query = $_GET;
        $this->files = $_FILES;
        $this->body = self::parseBody($rawMethod, $this->headers);

        // Support HTML form _method override (PUT, PATCH, DELETE)
        if ($rawMethod === 'POST' && !empty($this->body['_method'])) {
            $override = strtoupper((string) $this->body['_method']);
            if (in_array($override, ['PUT', 'PATCH', 'DELETE'], true)) {
                $rawMethod = $override;
            }
        }
        $this->method = $rawMethod;

        $this->rawUri = (string) ($_SERVER['REQUEST_URI'] ?? '/');
        $uriPath = (string) (parse_url($this->rawUri, PHP_URL_PATH) ?? '/');

        // Normalize subdirectory prefix if hosted inside a subfolder
        $scriptName = str_replace('\\', '/', (string) ($_SERVER['SCRIPT_NAME'] ?? ''));
        $scriptDir = rtrim(dirname($scriptName), '/');
        if ($scriptDir !== '' && $scriptDir !== '.' && str_starts_with($uriPath, $scriptDir)) {
            $uriPath = substr($uriPath, strlen($scriptDir)) ?: '/';
        }
        if (str_ends_with($scriptDir, '/public')) {
            $parentDir = substr($scriptDir, 0, -7);
            if ($parentDir !== '' && str_starts_with($uriPath, $parentDir)) {
                $uriPath = substr($uriPath, strlen($parentDir)) ?: '/';
            }
        }

        $this->path = '/' . ltrim($uriPath, '/');
    }

    public function input(string $key, mixed $default = null): mixed
    {
        return $this->body[$key] ?? $this->query[$key] ?? $default;
    }

    /**
     * @return array<string, mixed>
     */
    public function all(): array
    {
        return array_merge($this->query, $this->body);
    }

    public function header(string $name, ?string $default = null): ?string
    {
        $lower = strtolower($name);
        return $this->headers[$lower] ?? $default;
    }

    public function bearerToken(): ?string
    {
        $auth = $this->header('authorization')
            ?? ($_SERVER['HTTP_AUTHORIZATION'] ?? null)
            ?? ($_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? null);

        if (is_string($auth) && preg_match('/^Bearer\s+(.+)$/i', trim($auth), $m)) {
            return trim($m[1]);
        }
        return null;
    }

    public function expectsJson(): bool
    {
        if (str_starts_with($this->path, '/api/')) {
            return true;
        }
        $accept = strtolower((string) $this->header('accept', ''));
        $xhr = strtolower((string) $this->header('x-requested-with', ''));
        return str_contains($accept, 'application/json') || $xhr === 'xmlhttprequest';
    }

    public function ip(): string
    {
        $forwarded = $this->header('x-forwarded-for');
        if (is_string($forwarded) && $forwarded !== '') {
            return trim(explode(',', $forwarded)[0]);
        }
        return (string) ($_SERVER['REMOTE_ADDR'] ?? '127.0.0.1');
    }

    public function userAgent(): string
    {
        return substr((string) ($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 255);
    }

    /**
     * @return array<string, string>
     */
    private static function parseHeaders(): array
    {
        $headers = [];
        if (function_exists('getallheaders')) {
            foreach ((array) getallheaders() as $k => $v) {
                $headers[strtolower((string) $k)] = (string) $v;
            }
        }
        foreach ($_SERVER as $key => $val) {
            if (str_starts_with($key, 'HTTP_')) {
                $name = strtolower(str_replace('_', '-', substr($key, 5)));
                $headers[$name] = (string) $val;
            } elseif (in_array($key, ['CONTENT_TYPE', 'CONTENT_LENGTH'], true)) {
                $name = strtolower(str_replace('_', '-', $key));
                $headers[$name] = (string) $val;
            }
        }
        return $headers;
    }

    /**
     * @param array<string, string> $headers
     * @return array<string, mixed>
     */
    private static function parseBody(string $method, array $headers): array
    {
        $contentType = strtolower($headers['content-type'] ?? '');
        if (str_contains($contentType, 'application/json')) {
            $raw = file_get_contents('php://input');
            if (is_string($raw) && trim($raw) !== '') {
                $decoded = json_decode($raw, true);
                if (is_array($decoded)) {
                    return $decoded;
                }
            }
            return [];
        }

        if ($method === 'POST') {
            return $_POST;
        }

        if (in_array($method, ['PUT', 'PATCH', 'DELETE'], true) && str_contains($contentType, 'application/x-www-form-urlencoded')) {
            $raw = file_get_contents('php://input');
            if (is_string($raw) && $raw !== '') {
                parse_str($raw, $parsed);
                return is_array($parsed) ? $parsed : [];
            }
        }

        return $_POST;
    }
}
