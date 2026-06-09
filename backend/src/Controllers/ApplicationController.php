<?php

namespace Wasl\Controllers;

use Wasl\Config\App;
use Wasl\Middleware\AuthMiddleware;
use Wasl\Models\Application;
use Wasl\Models\Job;

class ApplicationController
{
    public function updateStatus(int $id): void
    {
        $payload = AuthMiddleware::requireRole('client');
        $model   = new Application();
        $app     = $model->findById($id);

        if (!$app) App::error('Application not found', 404);

        $job = (new Job())->findById((int)$app['job_id']);
        if (!$job || (int)$job['client_id'] !== (int)$payload['user_id']) App::error('Forbidden', 403);

        $body   = json_decode(file_get_contents('php://input'), true) ?? [];
        $status = $body['status'] ?? '';
        if (!in_array($status, ['accepted', 'rejected'], true)) App::error('Invalid status');

        $model->updateStatus($id, $status);
        App::success(['id' => $id, 'status' => $status]);
    }
}
