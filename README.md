# BrightPath

BrightPath is an online learning platform. Teachers create and manage courses with video and image content; students browse the catalog, enroll, and track their progress.

## Table of Contents

- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Documentation](#documentation)
- [License](#license)

## Project Structure

| Folder | Description |
|---|---|
| [backend/](backend/) | Node.js/Express REST API backed by MongoDB |
| [frontend/](frontend/) | React (TypeScript) single-page app |
| [infra/](infra/) | Docker Compose setup to run or deploy the whole stack |

## Tech Stack

- **Backend:** Node.js, Express, MongoDB/Mongoose, JWT auth
- **Frontend:** React, TypeScript, Tailwind CSS
- **Infra:** Docker, Docker Compose

## Getting Started

The fastest way to run the whole stack is with Docker Compose:

```bash
cp infra/.env.local.example infra/.env.local   # fill in real values
./infra/deploy-local.sh
```

- Frontend: http://localhost:3000
- Backend: http://localhost:4000/api/health

To work on a single service directly (without Docker), see that service's own README.

## Documentation

- [backend/README.md](backend/README.md) — API setup, environment variables, endpoint reference
- [frontend/README.md](frontend/README.md) — app setup, environment variables, scripts
- [infra/README.md](infra/README.md) — local and cloud deployment

## License

All rights reserved — see [LICENSE](LICENSE). This code is proprietary; no permission is granted to use, copy, modify, or distribute it without prior written consent.

The frontend was bootstrapped from the Flowbite React CRA template (MIT); its original license is preserved in [frontend/THIRD_PARTY_NOTICES.md](frontend/THIRD_PARTY_NOTICES.md) and does not extend to BrightPath's own code.
