<?php

declare(strict_types=1);

namespace App\Actions;

use App\Core\Environment;
use App\Models\AuthUser;
use App\Repositories\GameRepository;
use App\Services\GameStateService;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use RuntimeException;

final class LinkGuestAccountAction
{
    public function __construct(
        private readonly GameRepository $gameRepository,
        private readonly GameStateService $stateService
    ) {
    }

    public function execute(AuthUser $targetUser, array $body): array
    {
        if ($targetUser->isGuest) {
            throw new RuntimeException('Guest sessions cannot merge another guest session.');
        }

        $guestToken = $body['guest_token'] ?? null;
        if (!is_string($guestToken) || trim($guestToken) === '') {
            throw new RuntimeException('Missing guest token.');
        }

        $decoded = JWT::decode($guestToken, new Key(Environment::required('JWT_SECRET'), 'HS256'));
        if ((bool) ($decoded->is_guest ?? false) !== true) {
            throw new RuntimeException('Token is not a guest session.');
        }

        $guestUserId = $decoded->sub ?? $decoded->user_id ?? null;
        if (!is_string($guestUserId) || $guestUserId === '') {
            throw new RuntimeException('Guest token is missing a user identifier.');
        }

        $save = $this->gameRepository->moveGuestSaveToUser($guestUserId, $targetUser);

        return [
            'merged' => true,
            'game' => $this->stateService->response($save, $targetUser),
        ];
    }
}
