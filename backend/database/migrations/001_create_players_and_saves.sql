CREATE TABLE IF NOT EXISTS players (
    auth_user_id VARCHAR(128) PRIMARY KEY,
    email VARCHAR(255) NULL,
    username VARCHAR(120) NULL,
    display_name VARCHAR(160) NULL,
    role VARCHAR(64) NOT NULL,
    roles_json JSON NOT NULL,
    is_guest TINYINT(1) NOT NULL,
    auth_type VARCHAR(32) NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS game_saves (
    id INT AUTO_INCREMENT PRIMARY KEY,
    auth_user_id VARCHAR(128) NOT NULL,
    save_slot VARCHAR(64) NOT NULL,
    state_json JSON NOT NULL,
    metadata_json JSON NOT NULL,
    version INT NOT NULL DEFAULT 1,
    status VARCHAR(32) NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    UNIQUE KEY uq_game_saves_auth_slot (auth_user_id, save_slot),
    INDEX idx_game_saves_auth_user (auth_user_id),
    CONSTRAINT fk_game_saves_player
        FOREIGN KEY (auth_user_id) REFERENCES players(auth_user_id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
