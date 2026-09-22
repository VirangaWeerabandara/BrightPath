# BrightPath Frontend

React (TypeScript) single-page app for BrightPath — the UI teachers and students use to create, browse, and take courses.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Docker](#docker)
- [Acknowledgements](#acknowledgements)

## Tech Stack

- **Framework:** React 18 + TypeScript, bootstrapped with Create React App
- **Routing:** React Router v7
- **Styling:** Tailwind CSS, Flowbite React
- **HTTP:** Axios
- **UI/UX extras:** Framer Motion, React Hot Toast / React Toastify, Recharts, Lottie, Vidstack (video player)
- **Tooling:** ESLint, Prettier, TypeScript

## Prerequisites

- Node.js 18 or later
- npm
- The [backend](../backend) running and reachable

## Getting Started

```bash
npm install
cp .env.example .env   # set REACT_APP_API_URL to the backend's address
npm start                # http://localhost:3000
```

## Environment Variables

Set these in `.env` (see `.env.example`):

| Variable | Required | Description |
|---|---|---|
| `REACT_APP_API_URL` | Yes | Base URL of the backend API (e.g. `http://localhost:4000/api`). Baked into the JS bundle at build time. |

## Available Scripts

| Command | Description |
|---|---|
| `npm start` | Run the dev server with hot reload |
| `npm run build` | Production build, output to `build/` |
| `npm test` | Run tests |
| `npm run lint` / `npm run lint:fix` | Lint with ESLint |
| `npm run format` / `npm run format:check` | Format with Prettier |
| `npm run typecheck` | Type-check with `tsc --noEmit` |

## Project Structure

```
frontend/
├── public/           # Static assets and index.html
├── src/
│   ├── components/   # Reusable UI components
│   ├── pages/        # Route-level page components
│   ├── hooks/        # Custom React hooks
│   └── App.tsx        # Route definitions
└── nginx.conf         # Nginx config used to serve the production build
```

## Docker

```bash
docker build --build-arg REACT_APP_API_URL=http://localhost:4000/api -t brightpath-frontend .
docker run -p 3000:80 brightpath-frontend
```

To run this together with the backend, use [../infra](../infra) instead of building this image standalone.

## Acknowledgements

Bootstrapped from the [Flowbite React CRA template](https://github.com/themesberg/flowbite-react-template-cra) (MIT) — see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
