<?php

namespace Wasl\Models;

use Wasl\Config\Database;
use PDO;

/**
 * Tracks failed logins so password guessing can be throttled.
 * Limits apply per email+IP (targeted guessing) and per IP (spraying many emails).
 */
class LoginAttempt
{
    public const WINDOW_SECONDS   = 900; // 15 minutes
    public const MAX_PER_ACCOUNT  = 5;
    public const MAX_PER_IP       = 30;

    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getConnection();
    }

    /** Seconds until another attempt is allowed, or 0 if not throttled. */
    public function retryAfter(string $email, string $ip): int
    {
        $this->prune();

        $perAccount = $this->db->prepare(
            'SELECT COUNT(*) AS n, MIN(attempted_at) AS oldest FROM login_attempts
             WHERE email = ? AND ip_address = ? AND attempted_at > (NOW() - INTERVAL ? SECOND)'
        );
        $perAccount->execute([$email, $ip, self::WINDOW_SECONDS]);
        $acc = $perAccount->fetch();

        $perIp = $this->db->prepare(
            'SELECT COUNT(*) AS n, MIN(attempted_at) AS oldest FROM login_attempts
             WHERE ip_address = ? AND attempted_at > (NOW() - INTERVAL ? SECOND)'
        );
        $perIp->execute([$ip, self::WINDOW_SECONDS]);
        $byIp = $perIp->fetch();

        $oldest = null;
        if ((int)$acc['n'] >= self::MAX_PER_ACCOUNT) $oldest = $acc['oldest'];
        if ((int)$byIp['n'] >= self::MAX_PER_IP) $oldest = $oldest ? min($oldest, $byIp['oldest']) : $byIp['oldest'];
        if ($oldest === null) return 0;

        $stmt = $this->db->prepare('SELECT GREATEST(1, ? - TIMESTAMPDIFF(SECOND, ?, NOW())) AS wait');
        $stmt->execute([self::WINDOW_SECONDS, $oldest]);
        return (int)$stmt->fetch()['wait'];
    }

    public function record(string $email, string $ip): void
    {
        $this->db->prepare('INSERT INTO login_attempts (email, ip_address) VALUES (?, ?)')->execute([$email, $ip]);
    }

    /** Successful login clears that account's failures from this IP. */
    public function clear(string $email, string $ip): void
    {
        $this->db->prepare('DELETE FROM login_attempts WHERE email = ? AND ip_address = ?')->execute([$email, $ip]);
    }

    private function prune(): void
    {
        $this->db->prepare('DELETE FROM login_attempts WHERE attempted_at < (NOW() - INTERVAL ? SECOND)')
            ->execute([self::WINDOW_SECONDS]);
    }
}
