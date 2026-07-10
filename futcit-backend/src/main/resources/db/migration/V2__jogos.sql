CREATE TABLE jogos (
    id VARCHAR(36) PRIMARY KEY,
    time_desafiante_id VARCHAR(36) NOT NULL REFERENCES times(id) ON DELETE CASCADE,
    time_desafiado_id  VARCHAR(36) NOT NULL REFERENCES times(id) ON DELETE CASCADE,
    data_jogo DATE NOT NULL,
    horario_jogo TIME,
    tem_campo BOOLEAN NOT NULL DEFAULT FALSE,
    nome_campo VARCHAR(200),
    local_campo VARCHAR(300),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDENTE',
    motivo_recusa TEXT,
    observacao_cancelamento TEXT,
    cancelado_por_id VARCHAR(36) REFERENCES usuarios(id),
    criado_em TIMESTAMP NOT NULL DEFAULT NOW(),
    cancelado_em TIMESTAMP,
    CONSTRAINT chk_times_diferentes CHECK (time_desafiante_id <> time_desafiado_id)
);