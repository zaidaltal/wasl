<?php

namespace Wasl\Controllers;

use Wasl\Config\App;
use Wasl\Middleware\AuthMiddleware;
use Wasl\Models\User;

class UserController
{
    public function getUser(int $id): void
    {
        $user = (new User())->findById($id);
        if (!$user) App::error('User not found', 404);
        App::success($user);
    }

    public function updateUser(int $id): void
    {
        $payload = AuthMiddleware::handle();
        if ((int)$payload['user_id'] !== $id) App::error('Forbidden', 403);

        $body  = json_decode(file_get_contents('php://input'), true) ?? [];
        $model = new User();

        $allowed = ['name', 'country', 'city'];
        $data    = array_intersect_key($body, array_flip($allowed));

        $model->update($id, $data);
        App::success($model->findById($id));
    }

    public function uploadAvatar(int $id): void
    {
        $payload = AuthMiddleware::handle();
        if ((int)$payload['user_id'] !== $id) App::error('Forbidden', 403);

        if (empty($_FILES['avatar'])) App::error('No file uploaded');

        $file    = $_FILES['avatar'];
        $maxSize = (int)($_ENV['MAX_FILE_SIZE'] ?? 2097152);

        if ($file['error'] !== UPLOAD_ERR_OK) App::error('Upload failed');
        if ($file['size'] > $maxSize) App::error('File too large (max 2MB)');

        $mime = mime_content_type($file['tmp_name']);
        if (!in_array($mime, ['image/jpeg', 'image/png', 'image/webp', 'image/gif'], true)) {
            App::error('Only JPEG, PNG, WebP, GIF allowed');
        }

        $ext      = pathinfo($file['name'], PATHINFO_EXTENSION);
        $filename = "avatar_{$id}_" . time() . ".{$ext}";
        $uploadDir = $_SERVER['DOCUMENT_ROOT'] . '/../' . ($_ENV['UPLOAD_PATH'] ?? 'uploads/avatars/');

        if (!is_dir($uploadDir)) mkdir($uploadDir, 0775, true);

        $dest = $uploadDir . $filename;
        if (!move_uploaded_file($file['tmp_name'], $dest)) App::error('Failed to save file');

        $avatarPath = 'uploads/avatars/' . $filename;
        (new User())->update($id, ['avatar' => $avatarPath]);

        App::success(['avatar' => $avatarPath]);
    }
}
