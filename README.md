# NLW | Agents

## Backend

### Getting started

```bash
docker compose up -d --build
```

### Drizzle ORM

#### Commands

1. Generate

```bash
pnpm --filter backend run db:generate
```

2. Migrate

```bash
pnpm --filter backend run db:migrate
```

3. Studio

```bash
pnpm --filter backend run db:studio
# https://local.drizzle.studio/
```
