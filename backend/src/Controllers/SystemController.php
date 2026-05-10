<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\Request;
use App\Core\Response;

final class SystemController
{
    public function health(Request $request, Response $response): void
    {
        $response->success([
            'status' => 'ok',
            'service' => 'mmo_sandbox-backend',
            'timestamp' => gmdate('Y-m-d H:i:s'),
        ]);
    }
}
