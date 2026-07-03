# CollegeCompass

A full-stack college discovery app for India — search colleges, compare options, predict admissions from exam rank, save shortlists, and join Q&A discussions.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Prisma_7-336791)

## Features

- **Search & filter** colleges by state, type, category, fees, and name
- **College profiles** with courses, placements, and reviews
- **Compare** up to 3 colleges side-by-side
- **Rank predictor** for JEE, NEET, and CUET
- **Save shortlist** (login required)
- **Q&A discussions** — ask and answer questions
- **JWT authentication** (register / login)

## Tech stack

| Layer | Tools |
|-------|--------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS 4 |
| Backend | Next.js API Routes |
| Database | PostgreSQL, Prisma 7 |
| Auth | JWT, bcrypt |

## Quick start

### Prerequisites

- Node.js 20+
- PostgreSQL (local or cloud)

### Setup

```bash
git clone <your-repo-url>
cd college-discovery

npm install
cp .env.example .env
# Edit .env: DATABASE_URL, JWT_SECRET

npx prisma generate
npm run db:push
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**Demo login:** `demo@example.com` / `password123`

## Environment variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret for signing JWT tokens (long random string) |

## License

MIT (or your chosen license)
