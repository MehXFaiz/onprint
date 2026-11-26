<?php
declare(strict_types=1);

namespace App\Core;

final class Csrf
{
    public static function token(): string
    {
        Session::start();
        $token = Session::get('_csrf_token');
        if (!is_string($token) || strlen($token) < 32) {
            $token = bin2hex(random_bytes(32));
            Session::set('_csrf_token', $token);
        }
        return $token;
    }

    public static function verify(?string $submittedToken): bool
    {
        if (!is_string($submittedToken) || $submittedToken === '') {
            return false;
        }
        return hash_equals(self::token(), $submittedToken);
    }
}
