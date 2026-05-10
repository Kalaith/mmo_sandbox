<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\AuthUser;
use PDO;
use RuntimeException;

final class GameRepository
{
    private const DEFAULT_SLOT = 'default';

    public function __construct(private readonly PDO $db)
    {
    }

    public function loadOrCreateSave(AuthUser $user, array $initialState): array
    {
        $this->upsertPlayer($user);

        $save = $this->findSaveByUserId($user->id);
        if ($save !== null) {
            return $save;
        }

        return $this->insertSave($user->id, $initialState, []);
    }

    public function resetSave(AuthUser $user, array $state, array $metadata): array
    {
        $this->upsertPlayer($user);

        $existing = $this->findSaveByUserId($user->id);
        if ($existing !== null) {
            $delete = $this->db->prepare('DELETE FROM game_saves WHERE id = :id');
            $delete->execute(['id' => (int) $existing['id']]);
        }

        return $this->insertSave($user->id, $state, $metadata);
    }

    public function replaceSave(AuthUser $user, array $state, array $metadata): array
    {
        $this->upsertPlayer($user);

        $existing = $this->findSaveByUserId($user->id);
        if ($existing === null) {
            return $this->insertSave($user->id, $state, $metadata);
        }

        $statement = $this->db->prepare(
            'UPDATE game_saves
             SET state_json = :state_json,
                 metadata_json = :metadata_json,
                 version = version + 1,
                 updated_at = :updated_at
             WHERE id = :id'
        );
        $statement->execute([
            'state_json' => $this->json($state),
            'metadata_json' => $this->json($metadata),
            'updated_at' => $this->now(),
            'id' => (int) $existing['id'],
        ]);

        return $this->getSave((int) $existing['id']);
    }

    public function moveGuestSaveToUser(string $guestUserId, AuthUser $targetUser): array
    {
        if ($guestUserId === $targetUser->id) {
            throw new RuntimeException('Guest session is already linked to this account.');
        }

        $this->db->beginTransaction();
        try {
            $this->upsertPlayer($targetUser);

            $guestSave = $this->findSaveByUserId($guestUserId);
            if ($guestSave === null) {
                throw new RuntimeException('Guest save not found.');
            }

            $targetSave = $this->findSaveByUserId($targetUser->id);
            if ($targetSave !== null) {
                $delete = $this->db->prepare('DELETE FROM game_saves WHERE id = :id');
                $delete->execute(['id' => (int) $targetSave['id']]);
            }

            $move = $this->db->prepare(
                'UPDATE game_saves
                 SET auth_user_id = :target_user_id,
                     updated_at = :updated_at
                 WHERE id = :save_id'
            );
            $move->execute([
                'target_user_id' => $targetUser->id,
                'updated_at' => $this->now(),
                'save_id' => (int) $guestSave['id'],
            ]);

            $deleteGuest = $this->db->prepare('DELETE FROM players WHERE auth_user_id = :guest_user_id');
            $deleteGuest->execute(['guest_user_id' => $guestUserId]);

            $this->db->commit();
            return $this->getSave((int) $guestSave['id']);
        } catch (\Throwable $error) {
            if ($this->db->inTransaction()) {
                $this->db->rollBack();
            }

            throw $error;
        }
    }

    public function upsertPlayer(AuthUser $user): void
    {
        $now = $this->now();
        $statement = $this->db->prepare(
            'INSERT INTO players (
                auth_user_id, email, username, display_name, role, roles_json,
                is_guest, auth_type, created_at, updated_at
             ) VALUES (
                :auth_user_id, :email, :username, :display_name, :role, :roles_json,
                :is_guest, :auth_type, :created_at, :updated_at
             )
             ON DUPLICATE KEY UPDATE
                email = VALUES(email),
                username = VALUES(username),
                display_name = VALUES(display_name),
                role = VALUES(role),
                roles_json = VALUES(roles_json),
                is_guest = VALUES(is_guest),
                auth_type = VALUES(auth_type),
                updated_at = VALUES(updated_at)'
        );
        $statement->execute([
            'auth_user_id' => $user->id,
            'email' => $user->email,
            'username' => $user->username,
            'display_name' => $user->displayName,
            'role' => $user->role(),
            'roles_json' => $this->json($user->roles),
            'is_guest' => $user->isGuest ? 1 : 0,
            'auth_type' => $user->authType,
            'created_at' => $now,
            'updated_at' => $now,
        ]);
    }

    public function findSaveByUserId(string $authUserId): ?array
    {
        $statement = $this->db->prepare(
            'SELECT * FROM game_saves WHERE auth_user_id = :auth_user_id AND save_slot = :save_slot'
        );
        $statement->execute([
            'auth_user_id' => $authUserId,
            'save_slot' => self::DEFAULT_SLOT,
        ]);

        $row = $statement->fetch();
        return $row ? $this->decodeSave($row) : null;
    }

    public function getSave(int $saveId): array
    {
        $statement = $this->db->prepare('SELECT * FROM game_saves WHERE id = :id');
        $statement->execute(['id' => $saveId]);
        $row = $statement->fetch();
        if (!$row) {
            throw new RuntimeException('Game save not found.');
        }

        return $this->decodeSave($row);
    }

    private function insertSave(string $authUserId, array $state, array $metadata): array
    {
        $now = $this->now();
        $statement = $this->db->prepare(
            'INSERT INTO game_saves (
                auth_user_id, save_slot, state_json, metadata_json, version,
                status, created_at, updated_at
             ) VALUES (
                :auth_user_id, :save_slot, :state_json, :metadata_json, 1,
                :status, :created_at, :updated_at
             )'
        );
        $statement->execute([
            'auth_user_id' => $authUserId,
            'save_slot' => self::DEFAULT_SLOT,
            'state_json' => $this->json($state),
            'metadata_json' => $this->json($metadata),
            'status' => 'active',
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        return $this->getSave((int) $this->db->lastInsertId());
    }

    private function decodeSave(array $row): array
    {
        return [
            'id' => (int) $row['id'],
            'auth_user_id' => (string) $row['auth_user_id'],
            'save_slot' => (string) $row['save_slot'],
            'state' => $this->decodeJson((string) $row['state_json']),
            'metadata' => $this->decodeJson((string) $row['metadata_json']),
            'version' => (int) $row['version'],
            'status' => (string) $row['status'],
            'created_at' => (string) $row['created_at'],
            'updated_at' => (string) $row['updated_at'],
        ];
    }

    private function json(array $value): string
    {
        return json_encode($value, JSON_UNESCAPED_SLASHES);
    }

    private function decodeJson(string $json): array
    {
        $decoded = json_decode($json, true);
        return is_array($decoded) ? $decoded : [];
    }

    private function now(): string
    {
        return gmdate('Y-m-d H:i:s');
    }
}
