# BrightPath Backend

REST API for BrightPath: authentication, course management, student/teacher profiles, and media uploads.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Testing](#testing)
- [Docker](#docker)

## Tech Stack

- **Runtime:** Node.js 18+, Express 4
- **Database:** MongoDB with Mongoose
- **Auth:** JSON Web Tokens (`jsonwebtoken`), password hashing with `bcrypt`
- **Media storage:** Cloudinary, file handling via `express-fileupload`
- **Testing:** Jest, Supertest, `mongodb-memory-server`

## Prerequisites

- Node.js 18 or later
- npm
- A MongoDB connection string (e.g. a free MongoDB Atlas cluster)
- Cloudinary account credentials

## Getting Started

```bash
npm install
cp .env.example .env   # fill in real values, see below
npm run dev             # starts on http://localhost:4000
```

## Environment Variables

Set these in `.env` (see `.env.example`):

| Variable | Required | Description |
|---|---|---|
| `PORT` | Yes | Port the server listens on (e.g. `4000`) |
| `MONGO_URI` | Yes | MongoDB connection string |
| `SECRET` | Yes | Secret used to sign JWTs |
| `CORS_ORIGIN` | Yes | Origin allowed to call this API (the frontend's URL) |
| `CLOUDINARY_CLOUD_NAME` | Yes | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Yes | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Yes | Cloudinary API secret |

## Available Scripts

| Command | Description |
|---|---|
| `npm start` | Run the server |
| `npm run dev` | Run the server with nodemon (auto-restart on change) |
| `npm test` | Run the Jest test suite |

## Project Structure

```
backend/
├── config/         # Third-party service configuration (Cloudinary)
├── controllers/    # Request handlers (auth, course, student, teacher, upload)
├── middleware/      # Auth/role guards (requireAuth, requireTeacher, requireTeacherAuth)
├── models/          # Mongoose schemas (Student, Teacher, Course)
├── routes/          # Express route definitions
├── test/            # Jest test suites
└── server.js        # App entry point
```

## API Reference

Base path: `/api`

All protected routes require an `Authorization` header with a valid JWT (issued by `/auth/login`).

### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/login` | Public | Log in as a student or teacher, returns a JWT |

### Students

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/student/signup` | Public | Register a new student |
| POST | `/student/courses/:courseId/enroll` | Student | Enroll in a course |
| GET | `/student/courses/enrolled-courses` | Student | List courses the student is enrolled in |
| PUT | `/student/update-profile` | Student | Update the student's profile |

### Teachers

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/teacher/signup` | Public | Register a new teacher |
| PUT | `/teacher/:id` | Teacher | Update teacher profile |
| PUT | `/teacher/:id/password` | Teacher | Change teacher password |

### Courses

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/courses` | Public | List all courses |
| GET | `/courses/:id` | Public | Get a single course |
| POST | `/courses/create` | Teacher | Create a course |
| PUT | `/courses/:id` | Teacher | Update a course |
| DELETE | `/courses/:id` | Teacher | Delete a course |
| GET | `/courses/teacher/:teacherId` | Teacher | List courses created by a teacher |
| GET | `/courses/teacher/:teacherId/stats` | Teacher | Get a teacher's course statistics |
| POST | `/courses/:id/enroll` | Student | Enroll in a course |

### Uploads

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/upload/image` | Teacher | Upload a single image |
| POST | `/upload/images` | Teacher | Upload multiple images |
| POST | `/upload/video` | Teacher | Upload a single video |
| POST | `/upload/videos` | Teacher | Upload multiple videos |
| DELETE | `/upload/file/:publicId` | Teacher | Delete an uploaded file |

### Health

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/health` | Public | Health check, returns `{ "status": "ok" }` |

## Testing

```bash
npm test
```

Runs the Jest suite in `test/`, using mocked models and JWT verification.

## Docker

```bash
docker build -t brightpath-backend .
docker run -p 4000:4000 --env-file .env brightpath-backend
```

To run this together with the frontend, use [../infra](../infra) instead of building this image standalone.
