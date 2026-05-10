<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\AuthUser;
use App\Repositories\GameRepository;
use App\Services\GameStateService;
use RuntimeException;

final class ApplyIntentAction
{
    public function __construct(
        private readonly GameRepository $gameRepository,
        private readonly GameStateService $stateService
    ) {
    }

    public function execute(AuthUser $user, array $body): array
    {
        $intent = $body['intent'] ?? null;
        if (!is_string($intent) || trim($intent) === '') {
            throw new RuntimeException('Missing game intent.');
        }

        $payload = $body['payload'] ?? [];
        if (!is_array($payload)) {
            throw new RuntimeException('Intent payload must be an object.');
        }

        $save = $this->gameRepository->loadOrCreateSave($user, $this->stateService->initialState());
        $state = $this->stateService->applyIntent($save['state'], $intent, $payload);
        $updatedSave = $this->gameRepository->replaceSave($user, $state, [
            'last_intent' => $intent,
            'last_intent_at' => gmdate('Y-m-d H:i:s'),
        ]);

        return $this->stateService->response($updatedSave, $user);
    }
}
