# Setup Guide

## 1. Install dependencies

```bash
cd "F:\Dev\repos\My Gym App II"
npm install
```

## 2. Create Neon database

1. Create a free Neon project and database.
2. Copy the connection string.
3. Set it in `apps/api/.env` as `DATABASE_URL`.

Example:

```env
DATABASE_URL="postgresql://<user>:<password>@<host>/<db>?sslmode=require"
JWT_SECRET="<min-32-char-secret>"
JWT_EXPIRES_IN="7d"
RATE_LIMIT_WINDOW_MS="60000"
RATE_LIMIT_MAX_REQUESTS="120"
```

## 3. Prisma generate + migrate + seed

```bash
cd apps/api
npx prisma generate
npx prisma migrate dev --name init
npx tsx prisma/seed.ts
```

## 4. Run API locally (Vercel functions)

```bash
cd apps/api
npx vercel dev
```

API routes:
- `/api/auth/register`
- `/api/auth/login`
- `/api/exercises`
- `/api/templates`
- `/api/workouts`
- `/api/stats`

## 5. Run Expo mobile app

```bash
cd apps/mobile
cp .env.example .env
# Set EXPO_PUBLIC_API_BASE_URL to your local/vercel API URL
npx expo start
```

## 6. Deploy API to Vercel

1. Import `apps/api` as a Vercel project.
2. Set environment variables from `apps/api/.env.example`.
3. Deploy.
4. Update mobile `EXPO_PUBLIC_API_BASE_URL` to deployed URL.

## 7. Offline-first behavior

- Templates/workout writes attempt network first.
- On failure, payload is queued in AsyncStorage (`offline-queue-v1`).
- Sync runs on app bootstrap and every 30 seconds when authenticated.

## 8. Security notes

- Tokens stored with `expo-secure-store`.
- API uses JWT bearer validation in middleware.
- Basic in-memory rate limit included (swap with Redis/Upstash for multi-region production hardening).
