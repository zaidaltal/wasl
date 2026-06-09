<?php

namespace Wasl\Controllers;

use Wasl\Config\App;
use Wasl\Middleware\AuthMiddleware;
use Wasl\Models\FreelancerProfile;
use Wasl\Models\Application;

class FreelancerController
{
    public function getProfile(int $id): void
    {
        $profile = (new FreelancerProfile())->findByUserId($id);
        if (!$profile) App::error('Freelancer not found', 404);
        App::success($profile);
    }

    public function updateProfile(int $id): void
    {
        $payload = AuthMiddleware::requireRole('freelancer');
        if ((int)$payload['user_id'] !== $id) App::error('Forbidden', 403);

        $body    = json_decode(file_get_contents('php://input'), true) ?? [];
        $model   = new FreelancerProfile();

        $allowed = ['bio', 'hourly_rate', 'skills', 'portfolio_links'];
        $data    = array_intersect_key($body, array_flip($allowed));
        $model->update($id, $data);

        App::success($model->findByUserId($id));
    }

    public function getMyApplications(): void
    {
        $payload = AuthMiddleware::requireRole('freelancer');
        $apps    = (new Application())->findByFreelancer((int)$payload['user_id']);
        App::success(App::paginate($apps, count($apps)));
    }

    public function getFeatured(): void
    {
        $freelancers = (new FreelancerProfile())->getFeatured(20);
        App::success(App::paginate($freelancers, count($freelancers)));
    }
}
