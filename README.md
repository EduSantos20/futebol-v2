# Futebol Cidade

Plataforma para organizar jogos e times de futebol da cidade.

Este repositório contém duas partes principais:

- futcit-backend: API em Spring Boot (Java, Maven)
- futcit-frontend: Aplicação frontend em React + Vite

Tecnologias principais
- Backend: Java 25, Spring Boot, Spring Security, Spring Data JPA, PostgreSQL, Flyway
- Frontend: React, Vite, Axios

Sumário
- Instalação
- Execução
- Variáveis de ambiente importantes
- Documentação da API (resumo) — ver `futcit-backend/API.md`
- Contribuição — ver `CONTRIBUTING.md`
- Exemplos rápidos — ver `EXAMPLES.md`


Pré-requisitos
- Java 25 (JDK)
- Maven
- Node.js (v18+ recomendado) e npm
- PostgreSQL (ou ajuste a datasource em `futcit-backend/src/main/resources/application.yml`)

Instalação e execução (desenvolvimento)

1) Backend

```bash
cd c:\Faculdade\futebol-v2\futcit-backend
# configurar variáveis de ambiente (opcionais) ou editar application.yml
# Exemplo: no Windows PowerShell
$env:DB_USERNAME = "postgres"
$env:DB_PASSWORD = "minha_senha"
$env:JWT_SECRET = "seu_segredo_aqui"

mvn spring-boot:run
```

O backend roda por padrão em http://localhost:8080 (port configurável em application.yml).

Observações:
- As propriedades sensíveis (DB, SMTP, JWT) são parametrizadas via environment variables conforme `application.yml`.
- Flyway está presente no projeto; por padrão `flyway.enabled` está `false` no `application.yml` (rodar migrações manualmente se desejado).

2) Frontend

```bash
cd c:\Faculdade\futebol-v2\futcit-frontend
npm install
npm run dev
```

O Vite por padrão roda em http://localhost:5173. Ajuste `FRONTEND_URL` no backend se necessário.

Banco de dados
- Crie o banco PostgreSQL `futebol_cidade` (ou altere a URL no application.yml).
- As migrations estão aguardando execução em `src/main/resources/db/migration` (se houver) e Flyway pode ser usado para aplicá-las.

Estrutura rápida do repositório
- futcit-backend/: backend Spring Boot
  - src/main/java/com/futebol/controller: controllers REST (Auth, Time, Jogo, Solicitacao)
  - src/main/resources/application.yml: configurações
- futcit-frontend/: app React + Vite

Documentação da API
Uma documentação detalhada de endpoints e exemplos está em `futcit-backend/API.md`.

Contribuindo
Leia `CONTRIBUTING.md` para convenções, como rodar testes e fluxo de PR.

Contato
Se tiver dúvidas, abra uma issue ou mande um e-mail para o mantenedor do projeto.
