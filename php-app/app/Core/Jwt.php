<?php
declare(strict_types=1);

namespace App\Core;

/**
 * Pure PHP 8.2+ RFC 7519 HMAC-SHA256 JWT implementation.
 * Zero external runtime dependencies required on Hostinger shared hosting.
 */
final class Jwt
{
    /**
     * @param array<string, mixed> $payload
     */
    public static function encode(array $payload, ?string $secret = null, int $ttlSeconds = 604800): string
    {
        $cfg = require base_path('config/auth.php');
        $key = $secret ?? (string) $cfg['jwt_secret'];

        $now = time();
        $payload['iat'] = $payload['iat'] ?? $now;
        $payload['exp'] = $payload['exp'] ?? ($now + $ttlSeconds);

        $header = ['alg' => 'HS256', 'typ' => 'JWT'];
        $segments = [
            self::base64UrlEncode((string) json_encode($header)),
            self::base64UrlEncode((string) json_encode($payload)),
        ];

        $signingInput = implode('.', $segments);
        $signature = hash_hmac('sha256', $signingInput, $key, true);
        $segments[] = self::base64UrlEncode($signature);

        return implode('.', $segments);
    }

    /**
     * @return array<string, mixed>|null
     */
    public static function decode(string $token, ?string $secret = null): ?array
    {
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            return null;
        }

        [$headB64, $bodyB64, $sigB64] = $parts;
        $header = json_decode(self::base64UrlDecode($headB64), true);
        $payload = json_decode(self::base64UrlDecode($bodyB64), true);
        $sig = self::base64UrlDecode($sigB64);

        if (!is_array($header) || !is_array($payload) || ($header['alg'] ?? '') !== 'HS256') {
            return null;
        }

        $cfg = require base_path('config/auth.php');
        $key = $secret ?? (string) $cfg['jwt_secret'];
        $expected = hash_hmac('sha256', "{$headB64}.{$bodyB64}", $key, true);

        if (!hash_equals($expected, $sig)) {
            return null;
        }

        if (isset($payload['exp']) && is_numeric($payload['exp']) && (int) $payload['exp'] < time()) {
            return null;
        }

        return $payload;
    }

    private static function base64UrlEncode(string $data): string
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    private static function base64UrlDecode(string $data): string
    {
        $remainder = strlen($data) % 4;
        if ($remainder > 0) {
            $data .= str_repeat('=', 4 - $remainder);
        }
        $decoded = base64_decode(strtr($data, '-_', '+/'), true);
        return $decoded === false ? '' : $decoded;
    }
}
