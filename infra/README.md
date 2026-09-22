# BrightPath Infra

Docker Compose setup that runs the backend and frontend together, either on your machine or on a cloud host, with a single command each.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Local Deployment](#local-deployment)
- [Cloud Deployment](#cloud-deployment)
- [Architecture Notes](#architecture-notes)

## Prerequisites

- Docker Engine with the Compose plugin (`docker compose version`)
- For cloud deployment: a Docker host (VM/droplet) reachable over SSH, with Docker installed

## Project Structure

```
infra/
├── docker-compose.yml          # Shared service definitions (build context, network, healthcheck)
├── docker-compose.local.yml    # Local override: ports 3000/4000
├── docker-compose.prod.yml     # Cloud override: port 80, restart: always
├── .env.local.example          # Template for infra/.env.local
├── .env.prod.example           # Template for infra/.env.prod
├── deploy-local.sh             # One-command local deploy
└── deploy-cloud.sh             # One-command cloud deploy
```

## Local Deployment

```bash
cp infra/.env.local.example infra/.env.local   # fill in real values
./infra/deploy-local.sh
```

This builds and starts both services:

- Frontend: http://localhost:3000
- Backend: http://localhost:4000/api/health

## Cloud Deployment

Run this on the target Docker host (VM/droplet):

```bash
cp infra/.env.prod.example infra/.env.prod   # fill in real values
./infra/deploy-cloud.sh
```

Set `REACT_APP_API_URL` in `.env.prod` to the backend's **public** URL (e.g. `http://<server-ip>:4000/api`) — the frontend needs it at build time, not just at runtime.

- Frontend: http://\<server-ip\>
- Backend: http://\<server-ip\>:4000/api/health

## Architecture Notes

- `docker-compose.yml` is the shared base; `docker-compose.local.yml` and `docker-compose.prod.yml` are overrides merged on top of it via `-f`.
- The backend exposes `/api/health`, used as the Compose healthcheck; the frontend only starts once the backend reports healthy.
- `REACT_APP_API_URL` is a Create React App variable — it gets compiled into the static JS bundle at `docker build` time, so it must be set correctly per environment before building, not after.
- `.env.local` and `.env.prod` hold real secrets and are gitignored — never commit them. Only the `.example` templates are tracked.
