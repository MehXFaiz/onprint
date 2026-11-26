<?php
declare(strict_types=1);

namespace App\Core;

final class Response
{
    /**
     * @param array<string, mixed> $data
     * @param array<string, string> $headers
     */
    public static function json(array $data, int $status = 200, array $headers = []): never
    {
        if (!headers_sent()) {
            http_response_code($status);
            header('Content-Type: application/json; charset=UTF-8');
            foreach ($headers as $k => $v) {
                header("{$k}: {$v}");
            }
        }
        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    /**
     * @param array<string, string> $headers
     */
    public static function html(string $content, int $status = 200, array $headers = []): never
    {
        if (!headers_sent()) {
            http_response_code($status);
            header('Content-Type: text/html; charset=UTF-8');
            foreach ($headers as $k => $v) {
                header("{$k}: {$v}");
            }
        }
        echo $content;
        exit;
    }

    /**
     * @param array<string, string> $headers
     */
    public static function text(string $content, int $status = 200, string $contentType = 'text/plain; charset=UTF-8', array $headers = []): never
    {
        if (!headers_sent()) {
            http_response_code($status);
            header("Content-Type: {$contentType}");
            foreach ($headers as $k => $v) {
                header("{$k}: {$v}");
            }
        }
        echo $content;
        exit;
    }

    public static function redirect(string $to, int $status = 302): never
    {
        $target = (str_starts_with($to, 'http://') || str_starts_with($to, 'https://'))
            ? $to
            : url($to);

        if (!headers_sent()) {
            http_response_code($status);
            header("Location: {$target}");
        }
        exit;
    }

    public static function download(string $content, string $filename, string $mimeType = 'text/csv; charset=UTF-8'): never
    {
        if (!headers_sent()) {
            http_response_code(200);
            header("Content-Type: {$mimeType}");
            header('Content-Disposition: attachment; filename="' . addslashes($filename) . '"');
            header('Cache-Control: no-store, no-cache, must-revalidate');
        }
        echo $content;
        exit;
    }
}
