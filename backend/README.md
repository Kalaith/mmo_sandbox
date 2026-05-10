# Mmo Sandbox Backend

Plain PHP backend for Mmo Sandbox using WebHatchery bearer-token auth and guest sessions.

## Endpoints

- `GET /api/health`
- `GET /api/auth/login-info`
- `POST /api/auth/guest-session`
- `GET /api/auth/session`
- `POST /api/auth/link-guest`
- `GET /api/game`
- `POST /api/game/start`
- `POST /api/game/save`

Protected endpoints require `Authorization: Bearer <token>`. Missing or invalid tokens return `401` with `login_url`.

## Migration

Run `database/migrations/001_create_players_and_saves.sql` against the `mmo_sandbox` database. The migration uses `CREATE TABLE IF NOT EXISTS` and is safe to rerun for the baseline tables.

## Configuration

Copy `.env.example` to `.env` or use `.env.preview` for local preview publishing, then set all required values explicitly. `JWT_SECRET` must match the shared WebHatchery login token secret for authenticated users.
