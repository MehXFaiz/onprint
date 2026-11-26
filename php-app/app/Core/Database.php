<?php
declare(strict_types=1);

namespace App\Core;

use PDO;
use PDOException;
use PDOStatement;

final class Database
{
    private static ?PDO $pdo = null;
    private static ?string $lastError = null;

    public static function connection(bool $withDatabase = true): PDO
    {
        if (self::$pdo !== null && $withDatabase) {
            return self::$pdo;
        }

        $cfg = require base_path('config/database.php');
        $driver = (string) ($cfg['driver'] ?? 'mysql');

        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ];

        if ($driver === 'sqlite') {
            $sqlitePath = (string) ($cfg['database'] ?? storage_path('database.sqlite'));
            $pdo = new PDO('sqlite:' . $sqlitePath, null, null, $options);
            $pdo->exec('PRAGMA foreign_keys = ON;');
            if ($withDatabase) {
                self::$pdo = $pdo;
            }
            return $pdo;
        }

        $host = (string) $cfg['host'];
        $port = (int) $cfg['port'];
        $charset = (string) $cfg['charset'];
        $dsn = $withDatabase
            ? sprintf('mysql:host=%s;port=%d;dbname=%s;charset=%s', $host, $port, $cfg['database'], $charset)
            : sprintf('mysql:host=%s;port=%d;charset=%s', $host, $port, $charset);

        $pdo = new PDO($dsn, (string) $cfg['username'], (string) $cfg['password'], $options);
        $pdo->exec("SET NAMES {$charset} COLLATE {$cfg['collation']}");

        if ($withDatabase) {
            self::$pdo = $pdo;
        }
        self::$lastError = null;

        return $pdo;
    }

    public static function isConnected(): bool
    {
        try {
            $stmt = self::connection()->query('SELECT 1 AS connected');
            return $stmt !== false && (bool) $stmt->fetchColumn();
        } catch (PDOException $e) {
            self::$lastError = $e->getMessage();
            return false;
        }
    }

    public static function lastError(): ?string
    {
        return self::$lastError;
    }

    /**
     * Execute a prepared SQL statement safely with bound parameters.
     *
     * @param array<int|string, mixed> $params
     */
    public static function query(string $sql, array $params = []): PDOStatement
    {
        $stmt = self::connection()->prepare($sql);
        $stmt->execute($params);
        return $stmt;
    }

    /**
     * @param array<int|string, mixed> $params
     * @return array<int, array<string, mixed>>
     */
    public static function fetchAll(string $sql, array $params = []): array
    {
        return self::query($sql, $params)->fetchAll();
    }

    /**
     * @param array<int|string, mixed> $params
     * @return array<string, mixed>|null
     */
    public static function fetchOne(string $sql, array $params = []): ?array
    {
        $row = self::query($sql, $params)->fetch();
        return is_array($row) ? $row : null;
    }

    /**
     * @param array<int|string, mixed> $params
     */
    public static function fetchScalar(string $sql, array $params = [], mixed $default = 0): mixed
    {
        $val = self::query($sql, $params)->fetchColumn();
        return $val === false ? $default : $val;
    }

    /**
     * Insert a row and return the new auto-increment ID.
     *
     * @param array<string, mixed> $data
     */
    public static function insert(string $table, array $data): int
    {
        $columns = array_keys($data);
        $quotedCols = array_map(static fn(string $c): string => '`' . str_replace('`', '', $c) . '`', $columns);
        $placeholders = array_fill(0, count($columns), '?');

        $sql = sprintf(
            'INSERT INTO `%s` (%s) VALUES (%s)',
            str_replace('`', '', $table),
            implode(', ', $quotedCols),
            implode(', ', $placeholders)
        );

        $values = array_map([self::class, 'normalizeParam'], array_values($data));
        self::query($sql, $values);
        return (int) self::connection()->lastInsertId();
    }

    /**
     * Update rows matching a WHERE clause and return affected row count.
     *
     * @param array<string, mixed> $data
     * @param array<int, mixed> $whereParams
     */
    public static function update(string $table, array $data, string $whereSql, array $whereParams = []): int
    {
        if ($data === []) {
            return 0;
        }
        $sets = [];
        $values = [];
        foreach ($data as $col => $val) {
            $sets[] = '`' . str_replace('`', '', $col) . '` = ?';
            $values[] = self::normalizeParam($val);
        }
        $sql = sprintf(
            'UPDATE `%s` SET %s WHERE %s',
            str_replace('`', '', $table),
            implode(', ', $sets),
            $whereSql
        );
        $stmt = self::query($sql, array_merge($values, $whereParams));
        return $stmt->rowCount();
    }

    public static function beginTransaction(): void
    {
        self::connection()->beginTransaction();
    }

    public static function commit(): void
    {
        if (self::connection()->inTransaction()) {
            self::connection()->commit();
        }
    }

    public static function rollBack(): void
    {
        if (self::connection()->inTransaction()) {
            self::connection()->rollBack();
        }
    }

    private static function normalizeParam(mixed $val): mixed
    {
        if (is_bool($val)) {
            return $val ? 1 : 0;
        }
        if (is_array($val) || is_object($val)) {
            return json_encode($val, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        }
        return $val;
    }
}
