# HLGiles Photography — API

Laravel 12 JSON API for the HLGiles Photography website. Runs in Docker with MySQL and Nginx.

## Architecture

```
┌─────────────────────────────────────────────────┐
│  hlgiles_web network (external)                 │
│                                                 │
│   ┌───────────┐                                 │
│   │   nginx   │ :8000 (dev) / reverse proxy     │
│   └─────┬─────┘                                 │
│─────────┼───────────────────────────────────────│
│  hlgiles_internal network (no internet access)  │
│         │                                       │
│   ┌─────┴─────┐       ┌───────────┐            │
│   │  app      │       │   mysql   │            │
│   │ (PHP-FPM) │◄─────►│  (8.0)   │            │
│   └───────────┘       └───────────┘            │
└─────────────────────────────────────────────────┘
```

- **mysql** is on the `internal` network only — it has no published ports and cannot be reached from outside Docker.
- **nginx** bridges both networks: it receives traffic from the web and forwards it to the app.
- **app** (PHP-FPM) only lives on the internal network.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose (v2+)

## Local Development Setup

```bash
# 1. Clone the repository
git clone <repo-url>
cd server

# 2. Copy environment file
cp .env.example .env

# 3. Start containers
docker compose up -d --build

# 4. Install dependencies (first time)
docker compose exec app composer install

# 5. Generate app key
docker compose exec app php artisan key:generate

# 6. Run migrations
docker compose exec app php artisan migrate

# 7. Verify
curl http://localhost:8000/api/health
```

The API is now available at `http://localhost:8000/api`.

> **Note:** `docker-compose.override.yml` exposes MySQL on port `3306` to your host for local DB tooling. This file is gitignored and should never be deployed.

## Useful Commands

```bash
# Start / stop containers
docker compose up -d
docker compose down

# Restart a single container
docker compose restart app

# Run artisan commands
docker compose exec app php artisan <command>

# Run composer
docker compose exec app composer <command>

# View logs
docker compose logs -f app
docker compose logs -f mysql

# Open a shell in the app container
docker compose exec app bash

# Run migrations
docker compose exec app php artisan migrate

# Fresh migration (destroys data)
docker compose exec app php artisan migrate:fresh --seed
```

## API Authentication

This project uses [Laravel Sanctum](https://laravel.com/docs/12.x/sanctum) for token-based API authentication. Protected routes use the `auth:sanctum` middleware.

## Project Structure

```
server/
├── app/
│   ├── Http/Controllers/   # API controllers
│   ├── Models/              # Eloquent models
│   └── Providers/
├── bootstrap/app.php        # App bootstrap (routes, middleware, exceptions)
├── config/
│   ├── database.php
│   └── sanctum.php
├── database/migrations/
├── docker/
│   ├── nginx/default.conf
│   └── php/Dockerfile
├── routes/
│   ├── api.php              # API routes (/api/*)
│   ├── console.php
│   └── web.php
├── docker-compose.yml
├── docker-compose.override.yml  # Dev-only (gitignored)
└── .env
```

## Production Deployment (Hetzner CX33)

This project is designed to run alongside other projects on a single Hetzner CX33 server.

### Network Isolation

The `docker-compose.yml` defines two networks:

- **`hlgiles_internal`** (`internal: true`) — MySQL and the app container communicate here. This network has no internet access by design, so MySQL is completely isolated.
- **`hlgiles_web`** — Nginx is attached to this network. A shared reverse proxy (e.g. Traefik or Nginx Proxy Manager) on the host should also be on this network to route traffic to this and other projects.

### Deployment Steps

1. **Do not copy `docker-compose.override.yml`** to the server — it exposes MySQL to the host.
2. Set production values in `.env`:
   ```
   APP_ENV=production
   APP_DEBUG=false
   APP_URL=https://api.yourdomain.com
   DB_PASSWORD=<strong-password>
   DB_ROOT_PASSWORD=<strong-root-password>
   ```
3. Start containers:
   ```bash
   docker compose up -d --build
   docker compose exec app composer install --no-dev --optimize-autoloader
   docker compose exec app php artisan migrate --force
   docker compose exec app php artisan config:cache
   docker compose exec app php artisan route:cache
   ```
4. Connect the shared reverse proxy to `hlgiles_web` and route your domain to the `hlgiles_nginx` container.

### Multi-Project Setup

Each project on the server should define its own `_internal` network (isolated) and connect its web-facing container to a shared external network. Example:

```yaml
# Shared network (created once on the server)
# docker network create shared_web

networks:
  hlgiles_web:
    external: true
    name: shared_web
```

This way, a single reverse proxy container on `shared_web` can route traffic to all projects, while each project's database remains completely isolated.
