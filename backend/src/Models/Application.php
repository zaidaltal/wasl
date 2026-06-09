<?php

namespace Wasl\Models;

use Wasl\Config\Database;
use PDO;

class Application
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getConnection();
    }

    public function create(array $data): int
    {
        $stmt = $this->db->prepare(
            'INSERT INTO applications (job_id, freelancer_id, cover_letter) VALUES (?, ?, ?)'
        );
        $stmt->execute([$data['job_id'], $data['freelancer_id'], $data['cover_letter'] ?? null]);
        return (int)$this->db->lastInsertId();
    }

    public function alreadyApplied(int $jobId, int $freelancerId): bool
    {
        $stmt = $this->db->prepare('SELECT id FROM applications WHERE job_id = ? AND freelancer_id = ?');
        $stmt->execute([$jobId, $freelancerId]);
        return (bool)$stmt->fetch();
    }

    public function findByJob(int $jobId): array
    {
        $stmt = $this->db->prepare(
            'SELECT a.*, u.name as freelancer_name, u.avatar as freelancer_avatar, u.country as freelancer_country,
                    fp.bio, fp.skills, fp.hourly_rate
             FROM applications a
             JOIN users u ON u.id = a.freelancer_id
             LEFT JOIN freelancer_profiles fp ON fp.user_id = a.freelancer_id
             WHERE a.job_id = ?
             ORDER BY a.applied_at DESC'
        );
        $stmt->execute([$jobId]);
        $apps = $stmt->fetchAll();
        foreach ($apps as &$app) {
            $app['freelancer'] = [
                'id'     => $app['freelancer_id'],
                'name'   => $app['freelancer_name'],
                'avatar' => $app['freelancer_avatar'],
                'country' => $app['freelancer_country'],
                'freelancer_profile' => [
                    'bio'         => $app['bio'],
                    'skills'      => $app['skills'] ? json_decode($app['skills'], true) : [],
                    'hourly_rate' => $app['hourly_rate'],
                ],
            ];
        }
        return $apps;
    }

    public function findByFreelancer(int $freelancerId): array
    {
        $stmt = $this->db->prepare(
            'SELECT a.*, j.title as job_title, j.status as job_status, j.budget as job_budget, j.country as job_country
             FROM applications a
             JOIN jobs j ON j.id = a.job_id
             WHERE a.freelancer_id = ?
             ORDER BY a.applied_at DESC'
        );
        $stmt->execute([$freelancerId]);
        $apps = $stmt->fetchAll();
        foreach ($apps as &$app) {
            $app['job'] = [
                'id'      => $app['job_id'],
                'title'   => $app['job_title'],
                'status'  => $app['job_status'],
                'budget'  => $app['job_budget'],
                'country' => $app['job_country'],
            ];
        }
        return $apps;
    }

    public function findById(int $id): ?array
    {
        $stmt = $this->db->prepare('SELECT * FROM applications WHERE id = ?');
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }

    public function updateStatus(int $id, string $status): bool
    {
        $stmt = $this->db->prepare('UPDATE applications SET status = ? WHERE id = ?');
        return $stmt->execute([$status, $id]);
    }

    public function countTotal(): int
    {
        return (int)$this->db->query('SELECT COUNT(*) FROM applications')->fetchColumn();
    }
}
