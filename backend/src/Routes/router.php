<?php

declare(strict_types=1);

use App\Controllers\AuthController;
use App\Controllers\GameController;
use App\Controllers\SystemController;
use App\Core\Router;
use App\Middleware\WebHatcheryJwtMiddleware;

return function (Router $router): void {
    $api = '/api';

    $router->get('/health', [SystemController::class, 'health']);
    $router->get($api . '/health', [SystemController::class, 'health']);

    $router->get($api . '/auth/login-info', [AuthController::class, 'loginInfo']);
    $router->post($api . '/auth/guest-session', [AuthController::class, 'guestSession']);
    $router->get($api . '/auth/session', [AuthController::class, 'session'], [WebHatcheryJwtMiddleware::class]);
    $router->post($api . '/auth/link-guest', [AuthController::class, 'linkGuest'], [WebHatcheryJwtMiddleware::class]);

    $router->get($api . '/game', [GameController::class, 'current'], [WebHatcheryJwtMiddleware::class]);
    $router->get($api . '/game/content', [GameController::class, 'content'], [WebHatcheryJwtMiddleware::class]);
    $router->post($api . '/game/start', [GameController::class, 'start'], [WebHatcheryJwtMiddleware::class]);
    $router->post($api . '/game/save', [GameController::class, 'save'], [WebHatcheryJwtMiddleware::class]);
    $router->post($api . '/game/intent', [GameController::class, 'intent'], [WebHatcheryJwtMiddleware::class]);
};
