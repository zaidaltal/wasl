<?php

namespace Wasl\Models;

use Wasl\Config\Database;
use PDO;

class FreelancerProfile
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getConnection();
    }

    public function findByUserId(int $userId): ?array
    {
        $stmt = $this->db->prepare(
            'SELECT fp.*, u.name, u.email, u.avatar, u.country, u.city, u.created_at
             FROM freelancer_profiles fp
             JOIN users u ON u.id = fp.user_id
             WHERE fp.user_id = ?'
        );
        $stmt->execute([$userId]);
        $row = $stmt->fetch();
        if (!$row) return null;
        $row['skills']          = $row['skills'] ? json_decode($row['skills'], true) : [];
        $row['portfolio_links'] = $row['portfolio_links'] ? json_decode($row['portfolio_links'], true) : [];
        return $row;
    }

    public function create(int $userId): void
    {
        $stmt = $this->db->prepare('INSERT IGNORE INTO freelancer_profiles (user_id) VALUES (?)');
        $stmt->execute([$userId]);
    }

    public function update(int $userId, array $data): bool
    {
        $fields = [];
        $values = [];
        foreach (['bio', 'hourly_rate'] as $field) {
            if (array_key_exists($field, $data)) {
                $fields[] = "{$field} = ?";
                $values[] = $data[$field];
            }
        }
        if (isset($data['skills'])) {
            $fields[] = 'skills = ?';
            $values[] = json_encode($data['skills']);
        }
        if (isset($data['portfolio_links'])) {
            $fields[] = 'portfolio_links = ?';
            $values[] = json_encode($data['portfolio_links']);
        }
        if (empty($fields)) return false;
        $values[] = $userId;
        $stmt = $this->db->prepare('UPDATE freelancer_profiles SET ' . implode(', ', $fields) . ' WHERE user_id = ?');
        return $stmt->execute($values);
    }

    public function getFeatured(int $limit = 20): array
    {
        $stmt = $this->db->prepare(
            'SELECT u.id, u.name, u.email, u.avatar, u.country, u.city,
                    fp.bio, fp.skills, fp.portfolio_links, fp.hourly_rate
             FROM freelancer_profiles fp
             JOIN users u ON u.id = fp.user_id
             WHERE u.role = "freelancer"
             ORDER BY u.created_at DESC
             LIMIT ?'
        );
        $stmt->execute([$limit]);
        $rows = $stmt->fetchAll();
        foreach ($rows as &$row) {
            $row['skills']          = $row['skills'] ? json_decode($row['skills'], true) : [];
            $row['portfolio_links'] = $row['portfolio_links'] ? json_decode($row['portfolio_links'], true) : [];
            $row['freelancer_profile'] = [
                'bio'             => $row['bio'],
                'skills'          => $row['skills'],
                'portfolio_links' => $row['portfolio_links'],
                'hourly_rate'     => $row['hourly_rate'],
            ];
        }
        return $rows;
    }
}
