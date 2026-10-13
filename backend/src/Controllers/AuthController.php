<?php

namespace Wasl\Controllers;

use Wasl\Config\App;
use Wasl\Helpers\JwtHelper;
use Wasl\Models\User;
use Wasl\Models\FreelancerProfile;
use Wasl\Models\ClientProfile;
use Wasl\Models\LoginAttempt;

class AuthController
{
    /** Must match COUNTRIES in frontend/src/lib/utils.ts */
    private const COUNTRIES = [
        'Jordan', 'Saudi Arabia', 'UAE', 'Egypt', 'Kuwait', 'Qatar', 'Bahrain', 'Oman',
        'Lebanon', 'Palestine', 'Iraq', 'Syria', 'Morocco', 'Tunisia', 'Algeria',
    ];

    public function register(): void
    {
        $body = json_decode(file_get_contents('php://input'), true);

        $name     = trim($body['name'] ?? '');
        $email    = strtolower(trim($body['email'] ?? ''));
        $password = $body['password'] ?? '';
        $role     = $body['role'] ?? '';
        $country  = trim((string)($body['country'] ?? ''));

        if (strlen($name) < 2) App::error('Name must be at least 2 characters');
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) App::error('Invalid email address');
        if (strlen($password) < 8) App::error('Password must be at least 8 characters');
        if (!in_array($role, ['freelancer', 'client'], true)) App::error('Role must be freelancer or client');
        if ($country !== '' && !in_array($country, self::COUNTRIES, true)) App::error('Unsupported country', 422, ['code' => 'invalid_country']);

        $userModel = new User();
        if ($userModel->findByEmail($email)) App::error('Email already registered', 409, ['code' => 'email_taken']);

        $userId = $userModel->create([
            'name'     => $name,
            'email'    => $email,
            'password' => password_hash($password, PASSWORD_BCRYPT),
            'role'     => $role,
            'country'  => $country !== '' ? $country : null,
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

        if ($email === '' || $password === '') {
            App::error('Email and password are required', 422, ['code' => 'missing_fields']);
        }

        $ip       = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
        $attempts = new LoginAttempt();

        $wait = $attempts->retryAfter($email, $ip);
        if ($wait > 0) {
            header('Retry-After: ' . $wait);
            App::error('Too many login attempts. Try again later.', 429, ['code' => 'too_many_attempts', 'retry_after' => $wait]);
        }

        $userModel = new User();
        $user      = $userModel->findByEmail($email);

        // Always run one bcrypt check (same cost as real hashes) so unknown emails take as long
        // as wrong passwords, which stops account enumeration by response time.
        $hash  = $user['password'] ?? '$2y$10$0gDFp89rJrwEfz7/FVYmqei.6cPmC/iNFRLzR9hQOePCzFH.5ykc.';
        $valid = password_verify($password, $hash) && $user !== null;

        if (!$valid) {
            $attempts->record($email, $ip);
            App::error('Invalid credentials', 401, ['code' => 'invalid_credentials']);
        }

        $attempts->clear($email, $ip);
        $token = JwtHelper::encode(['user_id' => $user['id'], 'role' => $user['role']]);
        unset($user['password']);

        App::success(['token' => $token, 'user' => $user]);
    }

    public function logout(): void
    {
        App::success(null, 'Logged out');
    }
}
