-- ============================================================
-- V7__add_oauth_fields.sql
-- Adicionar suporte a login social via OAuth2 (Google, etc.)
-- ============================================================

-- Adicionar coluna google_id para armazenar o identificador do Google
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) UNIQUE;

-- Adicionar coluna para tracking de provider (para suportar outros provedores no futuro)
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS oauth_provider VARCHAR(50);

-- Tornar a senha nullable para permitir usuários que se registram apenas via OAuth
ALTER TABLE usuarios ALTER COLUMN senha DROP NOT NULL;

-- Criar índice para busca rápida por google_id
CREATE INDEX IF NOT EXISTS idx_usuarios_google_id ON usuarios(google_id);
CREATE INDEX IF NOT EXISTS idx_usuarios_oauth_provider ON usuarios(oauth_provider);
