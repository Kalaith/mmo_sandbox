<?php

declare(strict_types=1);

namespace App\Core;

use RuntimeException;

final class Environment
{
    public static function required(string $key, bool $allowEmpty = false): string
    {
        if (!array_key_exists($key, $_ENV) || !is_string($_ENV[$key])) {
            throw new RuntimeException('Missing required environment variable: ' . $key);
        }

        $value = $_ENV[$key];
        if (!$allowEmpty && trim($value) === '') {
            throw new RuntimeException('Missing required environment variable: ' . $key);
        }

        return $value;
    }
}
