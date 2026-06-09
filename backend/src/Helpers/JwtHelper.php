<?php

namespace Wasl\Helpers;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Exception;

class JwtHelper
{
    private static string $algo = 'HS256';

    public static function encode(array $payload): string
    {
        $secret  = $_ENV['JWT_SECRET'] ?? 'wasl-secret-key';
        $expire  = (int)($_ENV['JWT_EXPIRE'] ?? 604800);
        $payload = array_merge($payload, ['iat' => time(), 'exp' => time() + $expire]);
        return JWT::encode($payload, $secret, self::$algo);
    }

    public static function decode(string $token): ?array
    {
        try {
            $secret  = $_ENV['JWT_SECRET'] ?? 'wasl-secret-key';
            $decoded = JWT::decode($token, new Key($secret, self::$algo));
            return (array)$decoded;
        } catch (Exception) {
            return null;
        }
    }

    public static function fromRequest(): ?array
    {
        $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        if (!str_starts_with($header, 'Bearer ')) return null;
        $token = substr($header, 7);
        return self::decode($token);
    }
}
