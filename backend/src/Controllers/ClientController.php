<?php

namespace Wasl\Controllers;

use Wasl\Config\App;
use Wasl\Middleware\AuthMiddleware;
use Wasl\Models\ClientProfile;

class ClientController
{
    public function getProfile(int $id): void
    {
        $profile = (new ClientProfile())->findByUserId($id);
        if (!$profile) App::error('Client not found', 404);
        App::success($profile);
    }

    public function updateProfile(int $id): void
    {
        $payload = AuthMiddleware::requireRole('client');
        if ((int)$payload['user_id'] !== $id) App::error('Forbidden', 403);

        $body    = json_decode(file_get_contents('php://input'), true) ?? [];
        $model   = new ClientProfile();

        $allowed = ['company_name', 'company_description', 'website'];
        $data    = array_intersect_key($body, array_flip($allowed));
        $model->update($id, $data);

        App::success($model->findByUserId($id));
    }
}
