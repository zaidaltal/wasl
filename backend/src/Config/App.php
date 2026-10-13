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
        // Flatten paginated responses so the client always reads r.data.data for items
        if (is_array($data) && isset($data['data'], $data['total'], $data['page'])) {
            self::json(array_merge($data, ['message' => $message]), $code);
        } else {
            self::json(['data' => $data, 'message' => $message], $code);
        }
    }

    /** $extra adds machine-readable fields (e.g. 'code', 'retry_after') so clients can localize the message. */
    public static function error(string $message, int $code = 400, array $extra = []): void
    {
        self::json(array_merge(['error' => $message], $extra), $code);
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
