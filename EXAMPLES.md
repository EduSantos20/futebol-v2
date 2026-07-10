# Exemplos de uso rápido (curl)

Substitua `BASE` por `http://localhost:8080` e `TOKEN` pelo JWT obtido no login.

1) Registrar usuário

curl -X POST "${BASE}/api/auth/registrar" -H "Content-Type: application/json" -d \
'{
  "nome": "João",
  "email": "joao@example.com",
  "senha": "senha123"
}'

2) Login

curl -X POST "${BASE}/api/auth/login" -H "Content-Type: application/json" -d \
'{
  "email": "joao@example.com",
  "senha": "senha123"
}'

Resposta: { "token": "...", "usuario": { ... } }

3) Criar time (autenticado)

curl -X POST "${BASE}/api/times/registrar" -H "Authorization: Bearer ${TOKEN}" -H "Content-Type: application/json" -d \
'{
  "nome": "Amigos da Vila",
  "descricao": "Time de amigos",
  "publico": true
}'

4) Enviar escudo (multipart)

curl -X POST "${BASE}/api/times/{id}/escudo" -H "Authorization: Bearer ${TOKEN}" -F "arquivo=@./escudo.png"

5) Desafiar um time

curl -X POST "${BASE}/api/jogos/desafiar" -H "Authorization: Bearer ${TOKEN}" -H "Content-Type: application/json" -d \
'{
  "timeDesafianteId": "uuid-123",
  "timeDesafiadoId": "uuid-456",
  "dataHora": "2026-07-10T15:00:00",
  "local": "Campo Central"
}'

6) Listar confrontos públicos por data

curl "${BASE}/api/jogos/confrontos?data=2026-07-10"

7) Solicitar entrada em time

curl -X POST "${BASE}/api/times/{timeId}/solicitar-entrada" -H "Authorization: Bearer ${TOKEN}" -d "{}"

Observações
- Ajuste campos de payload conforme os DTOs reais presentes em `src/main/java/com/futebol/dto`.
- Use ferramentas como Postman ou Insomnia para testes interativos.
