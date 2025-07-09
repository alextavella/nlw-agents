# NLW | Agents

## Stacks e Principais Bibliotecas

### Backend (Node.js + Fastify)
- fastify
- drizzle-orm
- postgres
- zod
- fastify-type-provider-zod

### Frontend (React + Vite + Tailwind)
- react
- react-router-dom
- @tanstack/react-query
- tailwindcss
- axios

---

## Setup Rápido

### 1. Pré-requisitos
- [Node.js](https://nodejs.org/) 18+
- [pnpm](https://pnpm.io/) 8+
- [Docker](https://www.docker.com/) (opcional, recomendado para banco de dados)

### 2. Instalação das dependências

```bash
pnpm install
```

### 3. Subindo o banco de dados (PostgreSQL)

```bash
docker compose up -d
```

### 4. Gerando e rodando as migrations (Drizzle ORM)

```bash
pnpm --filter backend run db:generate
pnpm --filter backend run db:migrate
```

### 5. Rodando o Backend

```bash
pnpm run dev:backend
```

### 6. Rodando o Frontend

```bash
pnpm run dev:frontend
```

---

## Comandos Úteis

- Acessar Drizzle Studio:
  ```bash
  pnpm --filter backend run db:studio
  # https://local.drizzle.studio/
  ```
- Formatar código:
  ```bash
  pnpm format
  ```

---

## Observações
- Configure as variáveis de ambiente do backend conforme necessário (ex: conexão com o banco).
- O projeto utiliza monorepo com workspaces pnpm.
