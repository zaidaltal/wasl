<?php

namespace Wasl\Controllers;

use Wasl\Config\App;
use Wasl\Helpers\JwtHelper;
use Wasl\Middleware\AuthMiddleware;
use Wasl\Models\Job;
use Wasl\Models\Application;

class JobController
{
    public function getJobs(): void
    {
        $filters = [
            'search'      => $_GET['search'] ?? '',
            'category_id' => $_GET['category_id'] ?? null,
            'country'     => $_GET['country'] ?? null,
            'status'      => $_GET['status'] ?? 'open',
            'client_id'   => $_GET['client_id'] ?? null,
        ];
        $page    = (int)($_GET['page'] ?? 1);
        $perPage = min((int)($_GET['per_page'] ?? 20), 50);

        [$jobs, $total] = (new Job())->findAll($filters, $page, $perPage);

        foreach ($jobs as &$job) {
            $job['category'] = [
                'id'      => $job['category_id'],
                'name_en' => $job['category_name_en'],
                'name_ar' => $job['category_name_ar'],
                'icon'    => $job['category_icon'],
            ];
            $job['client'] = [
                'id'             => $job['client_id'],
                'name'           => $job['client_name'],
                'avatar'         => $job['client_avatar'],
                'country'        => $job['client_country'],
                'client_profile' => ['company_name' => $job['company_name']],
            ];
        }

        App::success(App::paginate($jobs, $total, $page, $perPage));
    }

    public function getJob(int $id): void
    {
        $job = (new Job())->findById($id);
        if (!$job) App::error('Job not found', 404);
        App::success($job);
    }

    public function createJob(): void
    {
        $payload = AuthMiddleware::requireRole('client');
        $body    = json_decode(file_get_contents('php://input'), true) ?? [];

        if (empty($body['title'])) App::error('Title is required');
        if (empty($body['description'])) App::error('Description is required');

        $id = (new Job())->create([
            'client_id'   => (int)$payload['user_id'],
            'title'       => trim($body['title']),
            'description' => trim($body['description']),
            'budget'      => isset($body['budget']) ? (float)$body['budget'] : null,
            'country'     => $body['country'] ?? null,
            'category_id' => isset($body['category_id']) ? (int)$body['category_id'] : null,
        ]);

        App::success((new Job())->findById($id), 'Job created', 201);
    }

    public function updateJob(int $id): void
    {
        $payload = AuthMiddleware::requireRole('client');
        $model   = new Job();
        $job     = $model->findById($id);
        if (!$job) App::error('Job not found', 404);
        if ((int)$job['client_id'] !== (int)$payload['user_id']) App::error('Forbidden', 403);

        $body    = json_decode(file_get_contents('php://input'), true) ?? [];
        $allowed = ['title', 'description', 'budget', 'country', 'status', 'category_id'];
        $data    = array_intersect_key($body, array_flip($allowed));
        $model->update($id, $data);

        App::success($model->findById($id));
    }

    public function deleteJob(int $id): void
    {
        $payload = AuthMiddleware::handle();
        $model   = new Job();
        $job     = $model->findById($id);
        if (!$job) App::error('Job not found', 404);

        $isOwner = (int)$job['client_id'] === (int)$payload['user_id'];
        $isAdmin = $payload['role'] === 'admin';
        if (!$isOwner && !$isAdmin) App::error('Forbidden', 403);

        $model->delete($id);
        App::success(null, 'Job deleted');
    }

    public function applyToJob(int $id): void
    {
        $payload = AuthMiddleware::requireRole('freelancer');
        $model   = new Application();
        $job     = (new Job())->findById($id);

        if (!$job) App::error('Job not found', 404);
        if ($job['status'] !== 'open') App::error('This job is no longer accepting applications');

        $freelancerId = (int)$payload['user_id'];
        if ($model->alreadyApplied($id, $freelancerId)) App::error('You have already applied to this job');

        $body = json_decode(file_get_contents('php://input'), true) ?? [];
        $appId = $model->create([
            'job_id'       => $id,
            'freelancer_id' => $freelancerId,
            'cover_letter' => $body['cover_letter'] ?? null,
        ]);

        App::success(['id' => $appId], 'Application submitted', 201);
    }

    public function getApplicants(int $id): void
    {
        $payload = AuthMiddleware::requireRole('client');
        $job     = (new Job())->findById($id);
        if (!$job) App::error('Job not found', 404);
        if ((int)$job['client_id'] !== (int)$payload['user_id']) App::error('Forbidden', 403);

        $apps = (new Application())->findByJob($id);
        App::success(App::paginate($apps, count($apps)));
    }
}
