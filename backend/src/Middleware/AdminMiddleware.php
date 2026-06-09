<?php

namespace Wasl\Middleware;

use Wasl\Config\App;

class AdminMiddleware
{
    public static function handle(): array
    {
        return AuthMiddleware::requireRole('admin');
    }
}
