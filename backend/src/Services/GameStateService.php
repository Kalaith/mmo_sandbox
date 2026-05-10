<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\AuthUser;
use RuntimeException;

final class GameStateService
{
    public function __construct(
        private readonly string $gameSlug,
        private readonly string $gameName
    ) {
    }

    public function initialState(): array
    {
        $currentRegion = $this->data('current-region.json');

        return [
            'game_slug' => $this->gameSlug,
            'game_name' => $this->gameName,
            'schema_version' => 2,
            'character' => [
                'created' => false,
                'name' => '',
            ],
            'resources' => [
                'gold' => 1000,
                'energy' => 100,
                'skillPoints' => 10,
                'level' => 10,
            ],
            'attributes' => [
                ['name' => 'Strength', 'value' => 10],
                ['name' => 'Dexterity', 'value' => 10],
                ['name' => 'Intelligence', 'value' => 10],
                ['name' => 'Constitution', 'value' => 10],
            ],
            'equipment' => [
                ['slot' => 'Head'],
                ['slot' => 'Chest'],
                ['slot' => 'Legs'],
                ['slot' => 'Weapon'],
                ['slot' => 'Accessory'],
            ],
            'inventory' => $this->data('inventory.json'),
            'currentRegionId' => is_array($currentRegion) && isset($currentRegion['id'])
                ? (string) $currentRegion['id']
                : 'capital',
            'pvpStats' => $this->data('pvp/stats.json'),
            'combatLog' => $this->data('pvp/combat-log.json'),
            'guild' => $this->data('guild.json'),
            'guildMembers' => $this->data('guild-members.json'),
            'guildAlliances' => $this->data('guild-alliances.json'),
            'marketListings' => $this->data('market-listings.json'),
            'activities' => [
                [
                    'id' => 'welcome',
                    'timestamp' => gmdate('Y-m-d H:i'),
                    'message' => 'Welcome to the game!',
                ],
            ],
            'events' => [],
            'skills' => $this->initialSkills(),
            'created_at' => gmdate('Y-m-d H:i:s'),
        ];
    }

    public function applyIntent(array $state, string $intent, array $payload): array
    {
        $state = $this->withDefaults($state);

        return match ($intent) {
            'create_character' => $this->createCharacter($state, $payload),
            'craft' => $this->craft($state, $payload),
            'travel' => $this->travel($state, $payload),
            'market_buy' => $this->marketBuy($state, $payload),
            'combat_action' => $this->combatAction($state, $payload),
            'guild_action' => $this->guildAction($state, $payload),
            'upgrade_skill' => $this->upgradeSkill($state, $payload),
            default => throw new RuntimeException('Unsupported game intent: ' . $intent),
        };
    }

    public function content(array $state, string $resource, array $params): mixed
    {
        $state = $this->withDefaults($state);

        return match ($resource) {
            'profile' => [
                'character' => $state['character'],
                'resources' => $state['resources'],
                'attributes' => $state['attributes'],
                'equipment' => $state['equipment'],
                'activities' => $state['activities'],
                'events' => $state['events'],
                'skills' => $state['skills'],
            ],
            'crafting-stations' => $this->data('crafting-stations.json'),
            'recipes' => $this->recipes($params),
            'inventory' => $state['inventory'],
            'pvp-zones' => $this->data('pvp/zones.json'),
            'pvp-stats' => $state['pvpStats'],
            'combat-log' => $state['combatLog'],
            'guild' => $state['guild'],
            'guild-members' => $state['guildMembers'],
            'guild-alliances' => $state['guildAlliances'],
            'regions' => $this->data('regions.json'),
            'current-region' => $this->currentRegion($state),
            'region-activities' => $this->regionActivities($params),
            'market-listings' => $this->marketListings($state, $params),
            'skills' => $state['skills'],
            default => throw new RuntimeException('Unknown content resource: ' . $resource),
        };
    }

    public function response(array $save, AuthUser $user): array
    {
        return [
            'user' => $user->toArray(),
            'save' => [
                'id' => $save['id'],
                'slot' => $save['save_slot'],
                'state' => $this->withDefaults($save['state']),
                'metadata' => $save['metadata'],
                'version' => $save['version'],
                'status' => $save['status'],
                'created_at' => $save['created_at'],
                'updated_at' => $save['updated_at'],
            ],
        ];
    }

    private function createCharacter(array $state, array $payload): array
    {
        $name = $payload['name'] ?? null;
        if (!is_string($name) || trim($name) === '') {
            throw new RuntimeException('Character name is required.');
        }

        $state['character'] = [
            'created' => true,
            'name' => substr(trim($name), 0, 40),
        ];
        return $this->withActivity($state, 'Character entered the world.');
    }

    private function craft(array $state, array $payload): array
    {
        $recipeId = $payload['recipeId'] ?? null;
        if (!is_string($recipeId) || trim($recipeId) === '') {
            throw new RuntimeException('Recipe id is required.');
        }

        $recipe = $this->findById($this->data('recipes.json'), $recipeId);
        if ($recipe === null) {
            throw new RuntimeException('Recipe not found.');
        }

        foreach ($recipe['ingredients'] as $ingredient) {
            $slot = $this->inventoryIndex($state['inventory'], (string) $ingredient['itemId']);
            if ($slot === null || (int) $state['inventory'][$slot]['quantity'] < (int) $ingredient['quantity']) {
                throw new RuntimeException('Not enough ingredients.');
            }
        }

        foreach ($recipe['ingredients'] as $ingredient) {
            $slot = $this->inventoryIndex($state['inventory'], (string) $ingredient['itemId']);
            $state['inventory'][$slot]['quantity'] = (int) $state['inventory'][$slot]['quantity'] - (int) $ingredient['quantity'];
        }

        $result = $recipe['result'];
        $this->addInventoryItem($state, (string) $result['itemId'], $this->labelFromItemId((string) $result['itemId']), (int) $result['quantity']);

        return $this->withActivity($state, 'Crafted ' . $this->labelFromItemId((string) $result['itemId']) . '.');
    }

    private function travel(array $state, array $payload): array
    {
        $regionId = $payload['regionId'] ?? null;
        if (!is_string($regionId) || $this->findById($this->data('regions.json'), $regionId) === null) {
            throw new RuntimeException('Unknown travel destination.');
        }

        $state['currentRegionId'] = $regionId;
        $state['resources']['energy'] = max(0, (int) $state['resources']['energy'] - 5);
        $region = $this->currentRegion($state);
        return $this->withActivity($state, 'Traveled to ' . (string) $region['name'] . '.');
    }

    private function marketBuy(array $state, array $payload): array
    {
        $listingId = $payload['listingId'] ?? null;
        $quantity = $this->positiveInt($payload['quantity'] ?? 1, 'Quantity');
        if (!is_string($listingId) || trim($listingId) === '') {
            throw new RuntimeException('Listing id is required.');
        }

        foreach ($state['marketListings'] as $index => $listing) {
            if (($listing['id'] ?? '') !== $listingId) {
                continue;
            }

            if ((int) $listing['quantity'] < $quantity) {
                throw new RuntimeException('Listing does not have enough quantity.');
            }

            $total = (int) $listing['price'] * $quantity;
            if ((int) $state['resources']['gold'] < $total) {
                throw new RuntimeException('Not enough gold.');
            }

            $state['resources']['gold'] = (int) $state['resources']['gold'] - $total;
            $state['marketListings'][$index]['quantity'] = (int) $listing['quantity'] - $quantity;
            $this->addInventoryItem($state, $this->itemIdFromLabel((string) $listing['item']), (string) $listing['item'], $quantity);
            return $this->withActivity($state, 'Bought ' . $quantity . 'x ' . (string) $listing['item'] . '.');
        }

        throw new RuntimeException('Listing not found.');
    }

    private function combatAction(array $state, array $payload): array
    {
        $zoneId = $payload['zoneId'] ?? null;
        $action = $payload['action'] ?? 'attack';
        if (!is_string($zoneId) || $this->findById($this->data('pvp/zones.json'), $zoneId) === null) {
            throw new RuntimeException('Select a PvP zone first.');
        }
        if (!is_string($action) || !in_array($action, ['attack', 'defend', 'flee'], true)) {
            throw new RuntimeException('Unknown combat action.');
        }

        $messages = [
            'attack' => 'You landed a clean hit in the arena.',
            'defend' => 'You held your ground and avoided heavy damage.',
            'flee' => 'You disengaged and left the skirmish.',
        ];

        if ($action === 'attack') {
            $state['pvpStats']['kills'] = (int) $state['pvpStats']['kills'] + 1;
            $state['pvpStats']['rating'] = (int) $state['pvpStats']['rating'] + 8;
        } elseif ($action === 'flee') {
            $state['pvpStats']['rating'] = max(0, (int) $state['pvpStats']['rating'] - 2);
        }

        $state['resources']['energy'] = max(0, (int) $state['resources']['energy'] - 3);
        return $this->withCombatLog($this->withActivity($state, $messages[$action]), $messages[$action]);
    }

    private function guildAction(array $state, array $payload): array
    {
        $action = $payload['action'] ?? 'message';
        if (!is_string($action) || !in_array($action, ['invite', 'promote', 'kick', 'message'], true)) {
            throw new RuntimeException('Unknown guild action.');
        }

        return $this->withActivity($state, 'Guild action completed: ' . $action . '.');
    }

    private function upgradeSkill(array $state, array $payload): array
    {
        $skillName = $payload['skillName'] ?? null;
        if (!is_string($skillName) || trim($skillName) === '') {
            throw new RuntimeException('Skill name is required.');
        }
        if ((int) $state['resources']['skillPoints'] <= 0) {
            throw new RuntimeException('No skill points available.');
        }

        foreach ($state['skills'] as $categoryIndex => $category) {
            foreach ($category['skills'] as $skillIndex => $skill) {
                if ($skill['name'] !== $skillName) {
                    continue;
                }

                $state['skills'][$categoryIndex]['skills'][$skillIndex]['level'] = (int) $skill['level'] + 1;
                $state['skills'][$categoryIndex]['skills'][$skillIndex]['xp'] = 0;
                $state['resources']['skillPoints'] = (int) $state['resources']['skillPoints'] - 1;
                return $this->withActivity($state, 'Upgraded ' . $skillName . '.');
            }
        }

        throw new RuntimeException('Skill not found.');
    }

    private function recipes(array $params): array
    {
        $recipes = $this->data('recipes.json');
        $stationId = $params['stationId'] ?? null;
        if (!is_string($stationId) || trim($stationId) === '') {
            return $recipes;
        }

        return array_values(array_filter(
            $recipes,
            fn (array $recipe): bool => ($recipe['stationId'] ?? null) === $stationId
        ));
    }

    private function currentRegion(array $state): array
    {
        $region = $this->findById($this->data('regions.json'), (string) $state['currentRegionId']);
        if ($region === null) {
            throw new RuntimeException('Current region is unavailable.');
        }

        return $region;
    }

    private function regionActivities(array $params): array
    {
        $regionId = $params['regionId'] ?? '';
        if (!is_string($regionId) || !in_array($regionId, ['capital', 'forest', 'mountains'], true)) {
            return [];
        }

        return $this->data('region-activities-' . $regionId . '.json');
    }

    private function marketListings(array $state, array $params): array
    {
        $search = $params['search'] ?? '';
        if (!is_string($search) || trim($search) === '') {
            return array_values(array_filter(
                $state['marketListings'],
                fn (array $listing): bool => (int) ($listing['quantity'] ?? 0) > 0
            ));
        }

        return array_values(array_filter(
            $state['marketListings'],
            fn (array $listing): bool => (int) ($listing['quantity'] ?? 0) > 0
                && str_contains(strtolower((string) $listing['item']), strtolower($search))
        ));
    }

    private function withDefaults(array $state): array
    {
        return array_replace_recursive($this->initialState(), $state);
    }

    private function data(string $file): array
    {
        $path = dirname(__DIR__, 2) . '/data/' . $file;
        if (!is_file($path)) {
            throw new RuntimeException('Missing game data file: ' . $file);
        }

        $decoded = json_decode((string) file_get_contents($path), true);
        if (!is_array($decoded)) {
            throw new RuntimeException('Invalid game data file: ' . $file);
        }

        return $decoded;
    }

    private function findById(array $items, string $id): ?array
    {
        foreach ($items as $item) {
            if (is_array($item) && ($item['id'] ?? null) === $id) {
                return $item;
            }
        }

        return null;
    }

    private function inventoryIndex(array $inventory, string $itemId): ?int
    {
        foreach ($inventory as $index => $item) {
            if (($item['itemId'] ?? null) === $itemId) {
                return (int) $index;
            }
        }

        return null;
    }

    private function addInventoryItem(array &$state, string $itemId, string $name, int $quantity): void
    {
        $slot = $this->inventoryIndex($state['inventory'], $itemId);
        if ($slot !== null) {
            $state['inventory'][$slot]['quantity'] = (int) $state['inventory'][$slot]['quantity'] + $quantity;
            return;
        }

        $state['inventory'][] = [
            'itemId' => $itemId,
            'name' => $name,
            'quantity' => $quantity,
        ];
    }

    private function withActivity(array $state, string $message): array
    {
        array_unshift($state['activities'], [
            'id' => 'activity-' . bin2hex(random_bytes(4)),
            'timestamp' => gmdate('Y-m-d H:i'),
            'message' => $message,
        ]);
        $state['activities'] = array_slice($state['activities'], 0, 20);
        return $state;
    }

    private function withCombatLog(array $state, string $message): array
    {
        array_unshift($state['combatLog'], [
            'id' => 'combat-' . bin2hex(random_bytes(4)),
            'timestamp' => gmdate('Y-m-d H:i'),
            'message' => $message,
        ]);
        $state['combatLog'] = array_slice($state['combatLog'], 0, 20);
        return $state;
    }

    private function positiveInt(mixed $value, string $label): int
    {
        if (!is_int($value) && !is_float($value)) {
            throw new RuntimeException($label . ' must be a number.');
        }

        $number = (int) $value;
        if ($number < 1) {
            throw new RuntimeException($label . ' must be at least 1.');
        }

        return $number;
    }

    private function labelFromItemId(string $itemId): string
    {
        return ucwords(str_replace('_', ' ', $itemId));
    }

    private function itemIdFromLabel(string $label): string
    {
        $slug = preg_replace('/[^a-z0-9]+/', '_', strtolower($label));
        return trim(is_string($slug) ? $slug : strtolower($label), '_');
    }

    private function initialSkills(): array
    {
        return [
            [
                'name' => 'Combat',
                'color' => '#ff6b6b',
                'skills' => [
                    ['name' => 'Melee Combat', 'level' => 5, 'xp' => 40, 'maxXp' => 100],
                    ['name' => 'Ranged Combat', 'level' => 3, 'xp' => 20, 'maxXp' => 80],
                    ['name' => 'Magic', 'level' => 2, 'xp' => 10, 'maxXp' => 60],
                    ['name' => 'Defense', 'level' => 4, 'xp' => 30, 'maxXp' => 90],
                ],
            ],
            [
                'name' => 'Crafting',
                'color' => '#4ecdc4',
                'skills' => [
                    ['name' => 'Smithing', 'level' => 6, 'xp' => 60, 'maxXp' => 120],
                    ['name' => 'Alchemy', 'level' => 2, 'xp' => 15, 'maxXp' => 50],
                    ['name' => 'Tailoring', 'level' => 1, 'xp' => 5, 'maxXp' => 40],
                    ['name' => 'Enchanting', 'level' => 0, 'xp' => 0, 'maxXp' => 30],
                ],
            ],
            [
                'name' => 'Gathering',
                'color' => '#45b7d1',
                'skills' => [
                    ['name' => 'Mining', 'level' => 3, 'xp' => 25, 'maxXp' => 70],
                    ['name' => 'Herbalism', 'level' => 2, 'xp' => 10, 'maxXp' => 50],
                    ['name' => 'Fishing', 'level' => 1, 'xp' => 5, 'maxXp' => 40],
                    ['name' => 'Hunting', 'level' => 2, 'xp' => 12, 'maxXp' => 45],
                ],
            ],
            [
                'name' => 'Social',
                'color' => '#96ceb4',
                'skills' => [
                    ['name' => 'Leadership', 'level' => 1, 'xp' => 5, 'maxXp' => 30],
                    ['name' => 'Trading', 'level' => 2, 'xp' => 10, 'maxXp' => 40],
                    ['name' => 'Diplomacy', 'level' => 0, 'xp' => 0, 'maxXp' => 20],
                    ['name' => 'Guild Management', 'level' => 0, 'xp' => 0, 'maxXp' => 20],
                ],
            ],
        ];
    }
}
