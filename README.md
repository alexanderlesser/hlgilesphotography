# HL Giles Photography

Monorepo for the HL Giles Photography website.

- **client/** — React + Vite + TypeScript frontend
- **server/** — Laravel API backend (runs in Docker)

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- [Docker](https://www.docker.com/) & Docker Compose

## Getting Started

1. **Clone the repo**
   ```sh
   git clone git@github.com:alexanderlesser/hlgilesphotography.git
   cd hlgilesphotography
   ```

2. **Install dependencies**
   ```sh
   npm install            # root (concurrently)
   npm run install:client # client dependencies
   ```

3. **Configure environment files**
   ```sh
   cp client/.env.example client/.env
   cp server/.env.example server/.env
   ```
   Edit the `.env` files as needed.

4. **Start development**
   ```sh
   npm run dev
   ```
   This starts the Docker server containers **and** the Vite dev server simultaneously.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start both server (Docker) and client (Vite) |
| `npm run dev:client` | Start only the Vite dev server |
| `npm run dev:server` | Start only the Docker containers |
| `npm run stop` | Stop the Docker containers |
| `npm run build:client` | Build the client for production |
| `npm run install:client` | Install client dependencies |

## Project Structure

```
hlgilesphotography/
├── client/          # React + Vite frontend
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
├── server/          # Laravel backend
│   ├── app/
│   ├── routes/
│   ├── docker/
│   ├── docker-compose.yml
│   └── ...
├── package.json     # Root scripts (concurrently)
└── README.md
```
