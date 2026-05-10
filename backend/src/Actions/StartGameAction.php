<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\AuthUser;
use App\Repositories\GameRepository;
use App\Services\GameStateService;
use RuntimeException;

final class StartGameAction
{
    public function __construct(
        private readonly GameRepository $gameRepository,
        private readonly GameStateService $stateService
    ) {
    }

    public function execute(AuthUser $user, array $body): array
    {
        $state = $body['state'] ?? $this->stateService->initialState();
        if (!is_array($state)) {
            throw new RuntimeException('Game state must be an object.');
        }

        $metadata = $body['metadata'] ?? [];
        if (!is_array($metadata)) {
            throw new RuntimeException('Metadata must be an object.');
        }

        $save = $this->gameRepository->resetSave($user, $state, $metadata);

        return $this->stateService->response($save, $user);
    }
}
