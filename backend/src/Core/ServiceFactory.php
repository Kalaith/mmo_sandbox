<?php

declare(strict_types=1);

namespace App\Core;

use App\Actions\ApplyIntentAction;
use App\Actions\GetContentAction;
use App\Actions\LinkGuestAccountAction;
use App\Actions\LoadGameAction;
use App\Actions\SaveGameAction;
use App\Actions\StartGameAction;
use App\Controllers\AuthController;
use App\Controllers\GameController;
use App\Controllers\SystemController;
use App\Repositories\GameRepository;
use App\Services\GameStateService;
use PDO;
use RuntimeException;

final class ServiceFactory
{
    private ?PDO $db = null;
    private ?GameRepository $gameRepository = null;
    private ?GameStateService $stateService = null;

    public function create(string $class): object
    {
        return match ($class) {
            SystemController::class => new SystemController(),
            AuthController::class => new AuthController(
                fn (): LinkGuestAccountAction => new LinkGuestAccountAction(
                    $this->gameRepository(),
                    $this->stateService()
                )
            ),
            GameController::class => new GameController(
                new LoadGameAction($this->gameRepository(), $this->stateService()),
                new StartGameAction($this->gameRepository(), $this->stateService()),
                new SaveGameAction($this->gameRepository(), $this->stateService()),
                new ApplyIntentAction($this->gameRepository(), $this->stateService()),
                new GetContentAction($this->gameRepository(), $this->stateService())
            ),
            default => throw new RuntimeException('Unknown class ' . $class),
        };
    }

    private function gameRepository(): GameRepository
    {
        if ($this->gameRepository instanceof GameRepository) {
            return $this->gameRepository;
        }

        $this->gameRepository = new GameRepository($this->db());
        return $this->gameRepository;
    }

    private function stateService(): GameStateService
    {
        if ($this->stateService instanceof GameStateService) {
            return $this->stateService;
        }

        $this->stateService = new GameStateService('mmo_sandbox', 'Mmo Sandbox');
        return $this->stateService;
    }

    private function db(): PDO
    {
        if ($this->db instanceof PDO) {
            return $this->db;
        }

        $this->db = Database::getConnection();
        return $this->db;
    }
}
