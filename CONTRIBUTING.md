# Contribuindo para Futebol Cidade

Obrigado por querer contribuir! Abaixo um guia rápido para colaborar com o projeto.

Fluxo recomendado
1. Fork do repositório (se for externo) e clone
2. Crie branch com nome descritivo: `feature/descricao-curta` ou `bugfix/descricao`
3. Faça alterações pequenas e atômicas; escreva mensagens de commit claras
4. Rode o backend e frontend localmente e verifique que sua alteração funciona
5. Abra Pull Request descrevendo mudança e como testar

Executando localmente
- Backend:
  - Java 25, Maven
  - `mvn spring-boot:run` (ou `mvn clean package` e executar o jar em target)
- Frontend:
  - Node + npm
  - `npm install` e `npm run dev`

Testes
- O projeto inclui dependências de teste no backend (Spring Boot Test). Rodar:
  - `mvn test`
- Frontend: se houver testes adicionados, rodar via `npm test` conforme configuração.

Boas práticas
- Escrever testes quando possível para código novo/alterado.
- Seguir convenções de formatação do projeto (Java + Spring Boot padrão).
- Evitar commitar credenciais. Use `application.yml` com placeholders e variáveis de ambiente.

Reportando bugs
- Abra uma issue descrevendo:
  - Comportamento esperado
  - Comportamento atual
  - Passos para reproduzir
  - Logs / stacktrace se aplicável

Solicitações de features
- Abra uma issue com a proposta e discutiremos antes de implementar se a mudança for grande.

Revisão de PR
- PRs devem conter descrição, screenshots (se UI), e passos de verificação.
- Mantenedores revisarão e comentarão — responder às mudanças solicitadas.

Agradecimentos
- Obrigado por contribuir! Seu esforço ajuda a melhorar a plataforma para toda a comunidade.
