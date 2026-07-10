CREATE TABLE membros_time (
    id VARCHAR(36) PRIMARY KEY,
    time_id VARCHAR(36) NOT NULL REFERENCES times(id) ON DELETE CASCADE,
    usuario_id VARCHAR(36) NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    criado_em TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_membro UNIQUE (time_id, usuario_id)
);

CREATE TABLE solicitacoes_time (
    id VARCHAR(36) PRIMARY KEY,
    time_id VARCHAR(36) NOT NULL REFERENCES times(id) ON DELETE CASCADE,
    usuario_id VARCHAR(36) NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    tipo VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDENTE',
    mensagem TEXT,
    criado_em TIMESTAMP NOT NULL DEFAULT NOW(),
    respondido_em TIMESTAMP
);