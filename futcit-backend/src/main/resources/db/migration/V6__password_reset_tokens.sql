CREATE TABLE password_reset_tokens (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  token varchar(255) NOT NULL UNIQUE,
  usuario_id uuid NOT NULL,
  expiry_at timestamp NOT NULL,
  created_at timestamp NOT NULL
);

CREATE INDEX idx_password_reset_token_token ON password_reset_tokens(token);

ALTER TABLE password_reset_tokens
  ADD CONSTRAINT fk_password_reset_tokens_usuario
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id);