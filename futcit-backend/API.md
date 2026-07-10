# API - futcit-backend

Base URL (desenvolvimento): http://localhost:8080

Autenticação
- O sistema usa JWT para endpoints autenticados.
- Endpoints de autenticação retornam um token no login/registro (ver AuthController).

Endpoints principais

1) Auth
- POST /api/auth/registrar
  - Descrição: Registrar novo usuário
  - Exemplo de payload:
    {
      "nome": "João da Silva",
      "email": "joao@example.com",
      "senha": "senha123"
    }
  - Resposta: AuthResponse com token e dados do usuário

- POST /api/auth/login
  - Payload:
    {
      "email": "joao@example.com",
      "senha": "senha123"
    }
  - Resposta: AuthResponse (token JWT)

- GET /api/auth/me
  - Descrição: Retorna dados do usuário autenticado
  - Autorização: Bearer <token>

- POST /api/auth/forgot-password
  - Payload: { "email": "exemplo@dominio.com" }
  - Retorno: 200 OK sempre (por segurança)

- POST /api/auth/reset-password
  - Payload: { "token": "...", "senha": "novaSenha" }
  - Retorno: 204 No Content

2) Times
Base: /api/times

- GET /api/times/publicos
  - Lista pública de times

- GET /api/times/disponiveis
  - Lista de times marcados como disponíveis

- GET /api/times/{id}
  - Buscar time por ID (público)

- GET /api/times/meus
  - Listar times do usuário autenticado
  - Autorização: Bearer

- POST /api/times/registrar
  - Criar novo time (autenticado)
  - Exemplo payload (TimeDTO.Request):
    {
      "nome": "Time Exemplo",
      "descricao": "Descrição do time",
      "publico": true
    }

- PUT /api/times/{id}
  - Atualizar time (dono)

- POST /api/times/{id}/escudo
  - Upload de escudo (multipart/form-data com campo `arquivo`)
  - Autorização: Bearer

- PATCH /api/times/{id}/disponibilidade
  - Alterna disponibilidade do time (dono)

- DELETE /api/times/{id}
  - Deleta time (dono)
  - Retorno: 204 No Content

- DELETE /api/times/{id}/membros/{membroId}
  - Remove membro do time (dono)

3) Solicitações (entrar/sair times)
- POST /api/times/{timeId}/solicitar-entrada
  - Jogador solicita entrar em um time
  - Retorna objeto de Solicitação

- POST /api/times/{timeId}/solicitar-saida
  - Jogador solicita sair do time

- PATCH /api/solicitacoes/{id}/responder
  - Dono responde (aprovar/recusar)
  - Payload: { "acao": "aprovada" | "recusada", "observacao": "..." }

- GET /api/times/{timeId}/solicitacoes
  - Dono vê solicitações pendentes do seu time

- GET /api/solicitacoes/minhas
  - Jogador vê suas solicitações

- GET /api/times/{timeId}/membros
  - Lista pública de membros de um time

4) Jogos
Base: /api/jogos

- POST /api/jogos/desafiar
  - Dono desafia outro time
  - Payload (exemplo):
    {
      "timeDesafianteId": "uuid",
      "timeDesafiadoId": "uuid",
      "dataHora": "2026-07-10T15:00:00",
      "local": "Campo A"
    }

- PATCH /api/jogos/{jogoId}/responder
  - Dono responde ao desafio (aceitar/recusar)

- PATCH /api/jogos/{jogoId}/cancelar
  - Dono cancela jogo confirmado

- GET /api/jogos/meus
  - Lista de jogos do usuário autenticado

- GET /api/jogos/pendentes
  - Desafios pendentes para responder (autenticado)

- PATCH /api/jogos/{jogoId}/registrar-placar
  - Registrar placar do jogo (dono)
  - Payload: { "golsTimeA": 2, "golsTimeB": 1 }

- GET /api/jogos/confrontos?data=YYYY-MM-DD
  - Lista pública de confrontos; parâmetro `data` opcional filtra por data

Observações de segurança
- Endpoints que alteram estado exigem autenticação e checagem de propriedade (dono do time/jogo).
- Não retornar mensagens que revelem existência de e-mail no fluxo de forgot-password.

Formato de erros
- API usa respostas HTTP padrão: 4xx para erros do cliente, 5xx para erros do servidor.
- Validações usam Bean Validation (400 Bad Request com detalhes de campo).

Seções internas e DTOs
- Os DTOs estão em `src/main/java/com/futebol/dto` — conferir tipos e exemplos reais quando necessário.

Para gerar documentação OpenAPI/Swagger
- Projeto não inclui automaticamente Swagger; pode-se adicionar `springdoc-openapi-ui` para documentação interativa.
