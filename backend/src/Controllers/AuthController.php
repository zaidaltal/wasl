<?php

namespace Wasl\Controllers;

use Wasl\Config\App;
use Wasl\Helpers\JwtHelper;
use Wasl\Models\User;
use Wasl\Models\FreelancerProfile;
use Wasl\Models\ClientProfile;

class AuthController
{
    public function register(): void
    {
        $body = json_decode(file_get_contents('php://input'), true);

        $name     = trim($body['name'] ?? '');
        $email    = strtolower(trim($body['email'] ?? ''));
        $password = $body['password'] ?? '';
        $role     = $body['role'] ?? '';

        if (strlen($name) < 2) App::error('Name must be at least 2 characters');
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) App::error('Invalid email address');
        if (strlen($password) < 8) App::error('Password must be at least 8 characters');
        if (!in_array($role, ['freelancer', 'client'], true)) App::error('Role must be freelancer or client');

        $userModel = new User();
        if ($userModel->findByEmail($email)) App::error('Email already registered');

        $userId = $userModel->create([
            'name'     => $name,
            'email'    => $email,
            'password' => password_hash($password, PASSWORD_BCRYPT),
            'role'     => $role,
        ]);

        if ($role === 'freelancer') (new FreelancerProfile())->create($userId);
        else (new ClientProfile())->create($userId);

        $user  = $userModel->findById($userId);
        $token = JwtHelper::encode(['user_id' => $userId, 'role' => $role]);

        App::success(['token' => $token, 'user' => $user], 'Registration successful', 201);
    }

    public function login(): void
    {
        $body     = json_decode(file_get_contents('php://input'), true);
        $email    = strtolower(trim($body['email'] ?? ''));
        $password = $body['password'] ?? '';

        $userModel = new User();
        $user      = $userModel->findByEmail($email);

        if (!$user || !password_verify($password, $user['password'])) {
            App::error('Invalid credentials', 401);
        }

        $token = JwtHelper::encode(['user_id' => $user['id'], 'role' => $user['role']]);
        unset($user['password']);

        App::success(['token' => $token, 'user' => $user]);
    }

    public function logout(): void
    {
        App::success(null, 'Logged out');
    }
}
