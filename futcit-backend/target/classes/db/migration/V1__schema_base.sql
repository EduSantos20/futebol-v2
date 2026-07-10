-- ============================================================
-- V1__schema_base.sql
-- Schema limpo - Futebol da Cidade
-- ============================================================

-- =========================
-- USUÁRIOS
-- =========================
CREATE TABLE IF NOT EXISTS usuarios (
    id           VARCHAR(36) PRIMARY KEY,
    nome         VARCHAR(150) NOT NULL,
    email        VARCHAR(150) NOT NULL UNIQUE,
    senha        VARCHAR(255) NOT NULL,
    tipo_usuario VARCHAR(20) NOT NULL DEFAULT 'DONO', -- DONO | JOGADOR
    telefone     VARCHAR(20),
    cidade       VARCHAR(100),
    foto_perfil  TEXT,
    posicao      VARCHAR(50),
    criado_em    TIMESTAMP NOT NULL DEFAULT NOW()
);

-- =========================
-- TIMES
-- =========================
CREATE TABLE IF NOT EXISTS times (
    id                   VARCHAR(36) PRIMARY KEY,
    nome                 VARCHAR(150) NOT NULL,
    escudo_url           TEXT,
    bairro               VARCHAR(100) NOT NULL,
    cidade               VARCHAR(100) NOT NULL,
    numero_jogadores     INTEGER NOT NULL DEFAULT 0,
    horarios_disponiveis VARCHAR(255),
    status_desafio       VARCHAR(20) NOT NULL DEFAULT 'INDISPONIVEL',
    usuario_id           VARCHAR(36) NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    criado_em            TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_times_usuario ON times(usuario_id);
CREATE INDEX IF NOT EXISTS idx_times_status  ON times(status_desafio);

-- =========================
-- MEMBROS DO TIME
-- =========================
CREATE TABLE IF NOT EXISTS membros_time (
    id          VARCHAR(36) PRIMARY KEY,
    time_id     VARCHAR(36) NOT NULL REFERENCES times(id) ON DELETE CASCADE,
    usuario_id  VARCHAR(36) NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    posicao     VARCHAR(50),
    criado_em   TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_membro UNIQUE (time_id, usuario_id)
);

CREATE INDEX IF NOT EXISTS idx_membros_time ON membros_time(time_id);
CREATE INDEX IF NOT EXISTS idx_membros_usuario ON membros_time(usuario_id);

-- =========================
-- SOLICITAÇÕES (ENTRADA / SAÍDA)
-- =========================
CREATE TABLE IF NOT EXISTS solicitacoes_time (
    id            VARCHAR(36) PRIMARY KEY,
    time_id       VARCHAR(36) NOT NULL REFERENCES times(id) ON DELETE CASCADE,
    usuario_id    VARCHAR(36) NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    tipo          VARCHAR(10) NOT NULL, -- ENTRADA | SAIDA
    status        VARCHAR(15) NOT NULL DEFAULT 'PENDENTE',
    mensagem      TEXT,
    resposta      TEXT,
    criado_em     TIMESTAMP NOT NULL DEFAULT NOW(),
    respondido_em TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_solicitacao_pendente
ON solicitacoes_time (time_id, usuario_id, tipo)
WHERE status = 'PENDENTE';

CREATE INDEX IF NOT EXISTS idx_sol_time ON solicitacoes_time(time_id);
CREATE INDEX IF NOT EXISTS idx_sol_usuario ON solicitacoes_time(usuario_id);
CREATE INDEX IF NOT EXISTS idx_sol_status ON solicitacoes_time(status);

-- =========================
-- JOGOS (DESAFIOS)
-- =========================
CREATE TABLE IF NOT EXISTS jogos (
    id                      VARCHAR(36) PRIMARY KEY,
    time_desafiante_id      VARCHAR(36) NOT NULL REFERENCES times(id),
    time_desafiado_id       VARCHAR(36) NOT NULL REFERENCES times(id),
    data_jogo               DATE NOT NULL,
    horario_jogo            TIME,
    tem_campo               BOOLEAN NOT NULL DEFAULT FALSE,
    nome_campo              VARCHAR(200),
    local_campo             VARCHAR(300),
    status                  VARCHAR(20) NOT NULL DEFAULT 'PENDENTE',
    motivo_recusa           TEXT,
    observacao_cancelamento TEXT,
    cancelado_por_id        VARCHAR(36) REFERENCES usuarios(id),
    criado_em               TIMESTAMP NOT NULL DEFAULT NOW(),
    cancelado_em            TIMESTAMP,

    CONSTRAINT chk_times_diferentes CHECK (time_desafiante_id <> time_desafiado_id)
);

CREATE INDEX IF NOT EXISTS idx_jogos_desafiante ON jogos(time_desafiante_id);
CREATE INDEX IF NOT EXISTS idx_jogos_desafiado ON jogos(time_desafiado_id);
CREATE INDEX IF NOT EXISTS idx_jogos_status ON jogos(status);