<?php

namespace Wasl\Models;

use Wasl\Config\Database;
use PDO;

class Job
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getConnection();
    }

    public function findAll(array $filters = [], int $page = 1, int $perPage = 20): array
    {
        $where = ['1=1'];
        $params = [];

        if (!empty($filters['status'])) {
            $where[] = 'j.status = ?';
            $params[] = $filters['status'];
        }
        if (!empty($filters['category_id'])) {
            $where[] = 'j.category_id = ?';
            $params[] = (int)$filters['category_id'];
        }
        if (!empty($filters['country'])) {
            $where[] = 'j.country = ?';
            $params[] = $filters['country'];
        }
        if (!empty($filters['client_id'])) {
            $where[] = 'j.client_id = ?';
            $params[] = (int)$filters['client_id'];
        }
        if (!empty($filters['search'])) {
            $where[] = '(j.title LIKE ? OR j.description LIKE ?)';
            $params[] = '%' . $filters['search'] . '%';
            $params[] = '%' . $filters['search'] . '%';
        }

        $whereClause = implode(' AND ', $where);
        $offset = ($page - 1) * $perPage;

        $countStmt = $this->db->prepare("SELECT COUNT(*) FROM jobs j WHERE {$whereClause}");
        $countStmt->execute($params);
        $total = (int)$countStmt->fetchColumn();

        $stmt = $this->db->prepare(
            "SELECT j.*, c.name_en as category_name_en, c.name_ar as category_name_ar, c.icon as category_icon,
                    u.name as client_name, u.avatar as client_avatar, u.country as client_country,
                    cp.company_name,
                    (SELECT COUNT(*) FROM applications a WHERE a.job_id = j.id) as applications_count
             FROM jobs j
             LEFT JOIN categories c ON c.id = j.category_id
             LEFT JOIN users u ON u.id = j.client_id
             LEFT JOIN client_profiles cp ON cp.user_id = j.client_id
             WHERE {$whereClause}
             ORDER BY j.created_at DESC
             LIMIT ? OFFSET ?"
        );
        $params[] = $perPage;
        $params[] = $offset;
        $stmt->execute($params);
        $jobs = $stmt->fetchAll();

        return [$jobs, $total];
    }

    public function findById(int $id): ?array
    {
        $stmt = $this->db->prepare(
            "SELECT j.*, c.name_en as category_name_en, c.name_ar as category_name_ar, c.icon as category_icon,
                    u.id as client_id, u.name as client_name, u.avatar as client_avatar, u.country as client_country, u.city as client_city,
                    cp.company_name,
                    (SELECT COUNT(*) FROM applications a WHERE a.job_id = j.id) as applications_count
             FROM jobs j
             LEFT JOIN categories c ON c.id = j.category_id
             LEFT JOIN users u ON u.id = j.client_id
             LEFT JOIN client_profiles cp ON cp.user_id = j.client_id
             WHERE j.id = ?"
        );
        $stmt->execute([$id]);
        $job = $stmt->fetch();
        if (!$job) return null;
        return $this->formatJob($job);
    }

    public function create(array $data): int
    {
        $stmt = $this->db->prepare(
            'INSERT INTO jobs (client_id, category_id, title, description, budget, country, status)
             VALUES (?, ?, ?, ?, ?, ?, "open")'
        );
        $stmt->execute([
            $data['client_id'],
            $data['category_id'] ?? null,
            $data['title'],
            $data['description'],
            $data['budget'] ?? null,
            $data['country'] ?? null,
        ]);
        return (int)$this->db->lastInsertId();
    }

    public function update(int $id, array $data): bool
    {
        $fields = [];
        $values = [];
        foreach (['title', 'description', 'budget', 'country', 'status', 'category_id'] as $field) {
            if (array_key_exists($field, $data)) {
                $fields[] = "{$field} = ?";
                $values[] = $data[$field];
            }
        }
        if (empty($fields)) return false;
        $values[] = $id;
        $stmt = $this->db->prepare('UPDATE jobs SET ' . implode(', ', $fields) . ' WHERE id = ?');
        return $stmt->execute($values);
    }

    public function delete(int $id): bool
    {
        $stmt = $this->db->prepare('DELETE FROM jobs WHERE id = ?');
        return $stmt->execute([$id]);
    }

    public function countTotal(): int
    {
        return (int)$this->db->query('SELECT COUNT(*) FROM jobs')->fetchColumn();
    }

    public function countOpen(): int
    {
        return (int)$this->db->query('SELECT COUNT(*) FROM jobs WHERE status = "open"')->fetchColumn();
    }

    private function formatJob(array $job): array
    {
        $job['category'] = [
            'id'      => $job['category_id'],
            'name_en' => $job['category_name_en'],
            'name_ar' => $job['category_name_ar'],
            'icon'    => $job['category_icon'],
        ];
        $job['client'] = [
            'id'      => $job['client_id'],
            'name'    => $job['client_name'],
            'avatar'  => $job['client_avatar'],
            'country' => $job['client_country'],
            'city'    => $job['client_city'],
            'client_profile' => ['company_name' => $job['company_name']],
        ];
        return $job;
    }
}
