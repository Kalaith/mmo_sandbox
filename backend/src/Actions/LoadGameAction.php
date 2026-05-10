<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\AuthUser;
use App\Repositories\GameRepository;
use App\Services\GameStateService;

final class LoadGameAction
{
    public function __construct(
        private readonly GameRepository $gameRepository,
        private readonly GameStateService $stateService
    ) {
    }

    public function execute(AuthUser $user): array
    {
        $save = $this->gameRepository->loadOrCreateSave($user, $this->stateService->initialState());

        return $this->stateService->response($save, $user);
    }
}
