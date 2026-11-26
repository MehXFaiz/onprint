<?php
declare(strict_types=1);

namespace App\Core;

final class Env
{
    private static bool $loaded = false;
    /** @var array<string, string> */
    private static array $vars = [];

    public static function load(string $path): void
    {
        if (self::$loaded || !is_file($path)) {
            return;
        }

        $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        if ($lines === false) {
            return;
        }

        foreach ($lines as $line) {
            $trimmed = trim($line);
            if ($trimmed === '' || str_starts_with($trimmed, '#')) {
                continue;
            }

            $pos = strpos($trimmed, '=');
            if ($pos === false) {
                continue;
            }

            $key = trim(substr($trimmed, 0, $pos));
            $val = trim(substr($trimmed, $pos + 1));

            if (
                (str_starts_with($val, '"') && str_ends_with($val, '"')) ||
                (str_starts_with($val, "'") && str_ends_with($val, "'"))
            ) {
                $val = substr($val, 1, -1);
            }

            self::$vars[$key] = $val;
            if (getenv($key) === false) {
                putenv("{$key}={$val}");
                $_ENV[$key] = $val;
            }
        }

        self::$loaded = true;
    }

    public static function get(string $key, mixed $default = null): mixed
    {
        $val = self::$vars[$key] ?? $_ENV[$key] ?? getenv($key);
        if ($val === false || $val === null) {
            return $default;
        }

        $lower = strtolower((string) $val);
        return match ($lower) {
            'true', '(true)' => true,
            'false', '(false)' => false,
            'null', '(null)' => null,
            default => $val,
        };
    }
}
