<?php

namespace Wasl\Models;

use Wasl\Config\Database;
use PDO;

class ClientProfile
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getConnection();
    }

    public function findByUserId(int $userId): ?array
    {
        $stmt = $this->db->prepare(
            'SELECT cp.*, u.name, u.email, u.avatar, u.country, u.city
             FROM client_profiles cp
             JOIN users u ON u.id = cp.user_id
             WHERE cp.user_id = ?'
        );
        $stmt->execute([$userId]);
        return $stmt->fetch() ?: null;
    }

    public function create(int $userId): void
    {
        $stmt = $this->db->prepare('INSERT IGNORE INTO client_profiles (user_id) VALUES (?)');
        $stmt->execute([$userId]);
    }

    public function update(int $userId, array $data): bool
    {
        $fields = [];
        $values = [];
        foreach (['company_name', 'company_description', 'website'] as $field) {
            if (array_key_exists($field, $data)) {
                $fields[] = "{$field} = ?";
                $values[] = $data[$field];
            }
        }
        if (empty($fields)) return false;
        $values[] = $userId;
        $stmt = $this->db->prepare('UPDATE client_profiles SET ' . implode(', ', $fields) . ' WHERE user_id = ?');
        return $stmt->execute($values);
    }
}
