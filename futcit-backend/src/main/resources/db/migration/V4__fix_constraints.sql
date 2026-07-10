-- ============================================================
-- V2__fix_constraints.sql
-- Corrige a constraint de unicidade em solicitacoes_time:
-- A constraint antiga impedia o banco de ter mais de uma
-- solicitação com o mesmo tipo+status combinação.
-- Substituímos por um índice parcial que só bloqueia PENDENTES.
-- ============================================================

-- Remove constraint antiga (se existir)
ALTER TABLE solicitacoes_time
    DROP CONSTRAINT IF EXISTS uq_solicitacao_pendente;

-- Cria índice parcial: só uma solicitação PENDENTE por (time, usuario, tipo) ao mesmo tempo
CREATE UNIQUE INDEX IF NOT EXISTS uq_solic_pendente_parcial
    ON solicitacoes_time (time_id, usuario_id, tipo)
    WHERE status = 'PENDENTE';

-- Garante que tipo_usuario tem valor padrão
ALTER TABLE usuarios
    ALTER COLUMN tipo_usuario SET DEFAULT 'DONO';

ALTER TABLE usuarios
    ALTER COLUMN foto_perfil TYPE TEXT;

ALTER TABLE times
    ALTER COLUMN escudo_url TYPE TEXT;
