<?php

namespace Wasl\Config;

class App
{
    public static function json(mixed $data, int $code = 200): void
    {
        http_response_code($code);
        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    public static function success(mixed $data, string $message = 'Success', int $code = 200): void
    {
        self::json(['data' => $data, 'message' => $message], $code);
    }

    public static function error(string $message, int $code = 400): void
    {
        self::json(['error' => $message], $code);
    }

    public static function paginate(array $items, int $total, int $page = 1, int $perPage = 20): array
    {
        return [
            'data'     => $items,
            'total'    => $total,
            'page'     => $page,
            'per_page' => $perPage,
        ];
    }
}
