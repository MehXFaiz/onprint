<?php
declare(strict_types=1);

namespace App\Middleware;

use App\Core\Database;
use App\Core\Jwt;
use App\Core\Request;
use App\Core\Response;
use App\Core\Session;
use Throwable;

final class AuthMiddleware
{
    public static function resolveUser(Request $request): ?array
    {
        if ($request->user !== null) {
            return $request->user;
        }

        // 1. Check Bearer JWT token (API / SPA / AJAX compatibility)
        $token = $request->bearerToken();
        if ($token !== null) {
            $decoded = Jwt::decode($token);
            if (is_array($decoded) && !empty($decoded['id'])) {
                $user = self::fetchUserFromDb((int) $decoded['id']);
                if ($user !== null && ($user['status'] ?? 'active') === 'active') {
                    $request->user = $user;
                    return $user;
                }
            }
        }

        // 2. Check PHP server-side session
        $sessionUser = Session::get('auth_user');
        if (is_array($sessionUser) && !empty($sessionUser['id'])) {
            $fresh = self::fetchUserFromDb((int) $sessionUser['id']) ?? $sessionUser;
            if (($fresh['status'] ?? 'active') === 'active') {
                Session::set('auth_user', $fresh);
                $request->user = $fresh;
                return $fresh;
            }
            Session::forget('auth_user');
        }

        return null;
    }

    public function handle(Request $request): void
    {
        $user = self::resolveUser($request);
        if ($user === null) {
            if ($request->expectsJson()) {
                Response::json([
                    'success' => false,
                    'message' => 'Authentication required. Please sign in.',
                ], 401);
            }
            $loginTarget = str_starts_with($request->path, '/admin') ? '/admin/login' : '/login';
            Response::redirect($loginTarget);
        }
    }

    public static function requireStaff(string $module = '*', string $action = 'view'): callable
    {
        return static function (Request $request) use ($module, $action): void {
            $user = self::resolveUser($request);
            if ($user === null) {
                if ($request->expectsJson()) {
                    Response::json(['success' => false, 'message' => 'Authentication required'], 401);
                }
                Response::redirect('/admin/login');
            }

            $role = strtolower((string) ($user['role'] ?? 'customer'));
            if (!in_array($role, ['super_admin', 'admin', 'administrator', 'employee'], true)) {
                if ($request->expectsJson()) {
                    Response::json(['success' => false, 'message' => 'Staff or Administrator privileges required'], 403);
                }
                Response::redirect('/admin/login');
            }

            if (!self::hasPermission($user, $module, $action)) {
                if ($request->expectsJson()) {
                    Response::json([
                        'success' => false,
                        'message' => "Insufficient permissions for '{$action}' on '{$module}'.",
                    ], 403);
                }
                Session::flash('error', "You do not have '{$action}' permission for {$module}.");
                Response::redirect('/admin');
            }
        };
    }

    public static function requireAdmin(): callable
    {
        return static function (Request $request): void {
            $user = self::resolveUser($request);
            if ($user === null) {
                if ($request->expectsJson()) {
                    Response::json(['success' => false, 'message' => 'Authentication token required'], 401);
                }
                Response::redirect('/admin/login');
            }

            $role = strtolower((string) ($user['role'] ?? 'customer'));
            if (!in_array($role, ['super_admin', 'admin', 'administrator'], true) && empty($user['is_super_admin'])) {
                if ($request->expectsJson()) {
                    Response::json(['success' => false, 'message' => 'Administrator privileges required'], 403);
                }
                Response::redirect('/admin/login');
            }
        };
    }

    public static function hasPermission(array $user, string $module = '*', string $action = 'view'): bool
    {
        $role = strtolower((string) ($user['role'] ?? 'customer'));
        if ($role === 'super_admin' || !empty($user['is_super_admin'])) {
            return true;
        }
        if ($role === 'administrator') {
            $role = 'admin';
        }

        // Check user-specific JSON overrides if present
        $customPerms = $user['permissions'] ?? null;
        if (is_string($customPerms) && $customPerms !== '') {
            $customPerms = json_decode($customPerms, true);
        }
        if (is_array($customPerms)) {
            if (isset($customPerms['modules']) && is_array($customPerms['modules']) && $module !== '*') {
                if (!in_array('*', $customPerms['modules'], true) && !in_array($module, $customPerms['modules'], true)) {
                    return false;
                }
            }
            if (isset($customPerms['actions']) && is_array($customPerms['actions'])) {
                if (!in_array('*', $customPerms['actions'], true) && !in_array($action, $customPerms['actions'], true)) {
                    return false;
                }
            }
            if (isset($customPerms['modules']) || isset($customPerms['actions'])) {
                return true;
            }
        }

        $authCfg = require base_path('config/auth.php');
        $roleCfg = $authCfg['roles'][$role] ?? null;
        if (!is_array($roleCfg)) {
            return false;
        }

        $allowedModules = $roleCfg['modules'] ?? [];
        $allowedActions = $roleCfg['actions'] ?? [];

        $moduleOk = $module === '*' || in_array('*', $allowedModules, true) || in_array($module, $allowedModules, true);
        $actionOk = in_array('*', $allowedActions, true) || in_array($action, $allowedActions, true);

        return $moduleOk && $actionOk;
    }

    private static function fetchUserFromDb(int $id): ?array
    {
        try {
            return Database::fetchOne(
                'SELECT id, name, email, phone, company, role, permissions, is_super_admin, status, last_login_at, created_at FROM users WHERE id = ? LIMIT 1',
                [$id]
            );
        } catch (Throwable) {
            return null;
        }
    }
}
