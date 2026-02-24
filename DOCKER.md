# Docker Setup

This project supports two Docker environments: **development** (Neon Local) and **production** (Neon Cloud).

## How It Works

The key difference is the `NEON_LOCAL_HOST` environment variable:

- **Set** (dev) → the app configures the Neon serverless driver to route through the local proxy via HTTP
- **Not set** (prod) → the app connects directly to Neon Cloud over the standard serverless endpoint

## Development (Neon Local)

Neon Local runs as a Docker container that proxies to your Neon project. It creates an **ephemeral database branch** on startup and deletes it on shutdown, giving you a clean DB for every session.

### Prerequisites

You need three values from the [Neon Console](https://console.neon.tech):

- **NEON_API_KEY** — Settings → API Keys
- **NEON_PROJECT_ID** — Project Settings → General
- **PARENT_BRANCH_ID** — The branch to fork from (usually your `main` branch ID)

### Setup

1. Copy and fill in your credentials:

```sh
cp .env.development .env.development.local
# Edit .env.development.local with your real NEON_API_KEY, NEON_PROJECT_ID, and PARENT_BRANCH_ID
```

2. Start the stack:

```sh
docker compose -f docker-compose.dev.yml --env-file .env.development up --build
```

This starts:
- `neon-local` — the Neon Local proxy on port 5432 (creates an ephemeral branch)
- `app` — the Express API on port 8008

3. Run migrations (from your host, or exec into the container):

```sh
docker compose -f docker-compose.dev.yml exec app npx drizzle-kit migrate
```

4. Stop and clean up (the ephemeral branch is automatically deleted):

```sh
docker compose -f docker-compose.dev.yml down
```

### Connection details

Inside the compose network the app connects to:

```
postgres://neon:npg@neon-local:5432/neondb
```

From your host (e.g. for psql or Drizzle Studio):

```
postgres://neon:npg@localhost:5432/neondb?sslmode=require
```

## Production (Neon Cloud)

In production the app connects directly to your Neon Cloud database. No local proxy is involved.

### Setup

1. Copy and fill in your production secrets:

```sh
cp .env.production .env.production.local
# Edit .env.production.local with your real DATABASE_URL, JWT_SECRET, etc.
```

2. Start the app:

```sh
docker compose -f docker-compose.prod.yml --env-file .env.production up --build -d
```

3. Stop:

```sh
docker compose -f docker-compose.prod.yml down
```

## Environment Variables

| Variable | Dev | Prod | Description |
|---|---|---|---|
| `DATABASE_URL` | `postgres://neon:npg@neon-local:5432/neondb` | `postgres://...neon.tech...` | Database connection string |
| `NEON_LOCAL_HOST` | `neon-local` | *(not set)* | Triggers local proxy configuration |
| `NEON_API_KEY` | Required | Not needed | Neon API key for branch management |
| `NEON_PROJECT_ID` | Required | Not needed | Neon project identifier |
| `PARENT_BRANCH_ID` | Required | Not needed | Branch to fork ephemeral dev DBs from |
| `NODE_ENV` | `development` | `production` | Controls logging, secure cookies, etc. |
| `JWT_SECRET` | Any dev value | Strong secret | Token signing key |
| `PORT` | `8008` | `8008` | HTTP listen port |

## File Overview

```
Dockerfile              → App image (Node 22 Alpine)
docker-compose.dev.yml  → App + Neon Local (ephemeral branches)
docker-compose.prod.yml → App only (connects to Neon Cloud)
.env.development        → Dev env template
.env.production         → Prod env template
.dockerignore           → Excludes node_modules, .env files, .git, etc.
```
