<?php

namespace Wasl\Middleware;

use Wasl\Helpers\JwtHelper;
use Wasl\Config\App;

class AuthMiddleware
{
    public static function handle(): array
    {
        $payload = JwtHelper::fromRequest();
        if (!$payload) {
            App::error('Unauthorized', 401);
        }
        return $payload;
    }

    public static function requireRole(string ...$roles): array
    {
        $payload = self::handle();
        if (!in_array($payload['role'] ?? '', $roles, true)) {
            App::error('Forbidden', 403);
        }
        return $payload;
    }
}
