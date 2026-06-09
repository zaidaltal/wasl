<?php

namespace Wasl\Controllers;

use Wasl\Config\App;
use Wasl\Middleware\AdminMiddleware;
use Wasl\Models\User;
use Wasl\Models\Job;
use Wasl\Models\Application;

class AdminController
{
    public function getStats(): void
    {
        AdminMiddleware::handle();

        $userModel = new User();
        $jobModel  = new Job();
        $appModel  = new Application();

        $roleCounts = $userModel->countByRole();

        App::success([
            'total_users'        => array_sum($roleCounts),
            'total_freelancers'  => $roleCounts['freelancer'] ?? 0,
            'total_clients'      => $roleCounts['client'] ?? 0,
            'total_jobs'         => $jobModel->countTotal(),
            'open_jobs'          => $jobModel->countOpen(),
            'total_applications' => $appModel->countTotal(),
        ]);
    }

    public function getUsers(): void
    {
        AdminMiddleware::handle();
        $users = (new User())->getAll();
        App::success(App::paginate($users, count($users)));
    }

    public function deleteUser(int $id): void
    {
        AdminMiddleware::handle();
        $user = (new User())->findById($id);
        if (!$user) App::error('User not found', 404);
        if ($user['role'] === 'admin') App::error('Cannot delete admin users', 403);
        (new User())->delete($id);
        App::success(null, 'User deleted');
    }

    public function getJobs(): void
    {
        AdminMiddleware::handle();
        [$jobs] = (new Job())->findAll([], 1, 100);
        App::success(App::paginate($jobs, count($jobs)));
    }

    public function deleteJob(int $id): void
    {
        AdminMiddleware::handle();
        $job = (new Job())->findById($id);
        if (!$job) App::error('Job not found', 404);
        (new Job())->delete($id);
        App::success(null, 'Job deleted');
    }
}
