<?php

declare(strict_types=1);

require_once __DIR__ . '/../vendor/autoload.php';

use Dotenv\Dotenv;
use Wasl\Controllers\AuthController;
use Wasl\Controllers\UserController;
use Wasl\Controllers\FreelancerController;
use Wasl\Controllers\ClientController;
use Wasl\Controllers\JobController;
use Wasl\Controllers\ApplicationController;
use Wasl\Controllers\CategoryController;
use Wasl\Controllers\AdminController;
use Wasl\Config\App;

// Load env
if (file_exists(__DIR__ . '/../.env')) {
    $dotenv = Dotenv::createImmutable(__DIR__ . '/..');
    $dotenv->load();
}

// CORS
$origin = $_ENV['FRONTEND_URL'] ?? 'http://localhost:3000';
header("Access-Control-Allow-Origin: {$origin}");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Router
$method = $_SERVER['REQUEST_METHOD'];
$uri    = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri    = rtrim(preg_replace('/^\/api/', '', $uri), '/') ?: '/';
$parts  = explode('/', ltrim($uri, '/'));

try {
    match (true) {
        // Auth
        $method === 'POST' && $uri === '/auth/register'
            => (new AuthController())->register(),

        $method === 'POST' && $uri === '/auth/login'
            => (new AuthController())->login(),

        $method === 'POST' && $uri === '/auth/logout'
            => (new AuthController())->logout(),

        // Categories
        $method === 'GET' && $uri === '/categories'
            => (new CategoryController())->getAll(),

        // Freelancers - specific routes first
        $method === 'GET' && $uri === '/freelancers/featured'
            => (new FreelancerController())->getFeatured(),

        $method === 'GET' && $uri === '/freelancers/me/applications'
            => (new FreelancerController())->getMyApplications(),

        $method === 'GET' && $parts[0] === 'freelancers' && isset($parts[1]) && is_numeric($parts[1])
            => (new FreelancerController())->getProfile((int)$parts[1]),

        $method === 'PUT' && $parts[0] === 'freelancers' && isset($parts[1]) && is_numeric($parts[1])
            => (new FreelancerController())->updateProfile((int)$parts[1]),

        // Clients
        $method === 'GET' && $parts[0] === 'clients' && isset($parts[1]) && is_numeric($parts[1])
            => (new ClientController())->getProfile((int)$parts[1]),

        $method === 'PUT' && $parts[0] === 'clients' && isset($parts[1]) && is_numeric($parts[1])
            => (new ClientController())->updateProfile((int)$parts[1]),

        // Users
        $method === 'GET' && $parts[0] === 'users' && isset($parts[1]) && is_numeric($parts[1])
            => (new UserController())->getUser((int)$parts[1]),

        $method === 'PUT' && $parts[0] === 'users' && isset($parts[1]) && is_numeric($parts[1])
            => (new UserController())->updateUser((int)$parts[1]),

        $method === 'POST' && $parts[0] === 'users' && isset($parts[1]) && is_numeric($parts[1]) && ($parts[2] ?? '') === 'avatar'
            => (new UserController())->uploadAvatar((int)$parts[1]),

        // Jobs
        $method === 'GET' && $uri === '/jobs'
            => (new JobController())->getJobs(),

        $method === 'POST' && $uri === '/jobs'
            => (new JobController())->createJob(),

        $method === 'GET' && $parts[0] === 'jobs' && isset($parts[1]) && is_numeric($parts[1]) && !isset($parts[2])
            => (new JobController())->getJob((int)$parts[1]),

        $method === 'PUT' && $parts[0] === 'jobs' && isset($parts[1]) && is_numeric($parts[1]) && !isset($parts[2])
            => (new JobController())->updateJob((int)$parts[1]),

        $method === 'DELETE' && $parts[0] === 'jobs' && isset($parts[1]) && is_numeric($parts[1]) && !isset($parts[2])
            => (new JobController())->deleteJob((int)$parts[1]),

        $method === 'POST' && $parts[0] === 'jobs' && isset($parts[1]) && is_numeric($parts[1]) && ($parts[2] ?? '') === 'apply'
            => (new JobController())->applyToJob((int)$parts[1]),

        $method === 'GET' && $parts[0] === 'jobs' && isset($parts[1]) && is_numeric($parts[1]) && ($parts[2] ?? '') === 'applicants'
            => (new JobController())->getApplicants((int)$parts[1]),

        // Applications
        $method === 'PUT' && $parts[0] === 'applications' && isset($parts[1]) && is_numeric($parts[1]) && ($parts[2] ?? '') === 'status'
            => (new ApplicationController())->updateStatus((int)$parts[1]),

        // Admin
        $method === 'GET' && $uri === '/admin/stats'
            => (new AdminController())->getStats(),

        $method === 'GET' && $uri === '/admin/users'
            => (new AdminController())->getUsers(),

        $method === 'DELETE' && $parts[0] === 'admin' && ($parts[1] ?? '') === 'users' && isset($parts[2]) && is_numeric($parts[2])
            => (new AdminController())->deleteUser((int)$parts[2]),

        $method === 'GET' && $uri === '/admin/jobs'
            => (new AdminController())->getJobs(),

        $method === 'DELETE' && $parts[0] === 'admin' && ($parts[1] ?? '') === 'jobs' && isset($parts[2]) && is_numeric($parts[2])
            => (new AdminController())->deleteJob((int)$parts[2]),

        default => App::error('Route not found', 404),
    };
} catch (\Throwable $e) {
    App::error('Internal server error: ' . $e->getMessage(), 500);
}
