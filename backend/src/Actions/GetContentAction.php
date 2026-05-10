<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\AuthUser;
use App\Repositories\GameRepository;
use App\Services\GameStateService;
use RuntimeException;

final class GetContentAction
{
    public function __construct(
        private readonly GameRepository $gameRepository,
        private readonly GameStateService $stateService
    ) {
    }

    public function execute(AuthUser $user, array $query): mixed
    {
        $resource = $query['resource'] ?? null;
        if (!is_string($resource) || trim($resource) === '') {
            throw new RuntimeException('Content resource is required.');
        }

        $save = $this->gameRepository->loadOrCreateSave($user, $this->stateService->initialState());
        return $this->stateService->content($save['state'], $resource, $query);
    }
}
