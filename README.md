# Skill Tank TPO Partner Dashboard

Skill Tank is a Next.js B2B SaaS dashboard for college Training and Placement Officers and Skill Tank super admins. It includes role-based authentication, Prisma-backed persistence, seeded demo data, placement tracking, finance views, report exports, and notification hooks for email and Telegram.

## Demo Accounts

All seeded users use the password `password123`.

| Role | Email |
| --- | --- |
| Super Admin | `admin@skilltank.com` |
| TPO Admin | `tpo1@gtu.edu` |
| TPO Admin | `tpo2@nie.edu` |
| TPO Admin | `tpo3@fsc.edu` |

## Local Setup

```bash
npm install
npx prisma migrate deploy
npx prisma db seed
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

```bash
DATABASE_URL="file:./dev.db"
AUTH_SECRET="replace-with-a-long-random-secret"
RESEND_API_KEY=""
TELEGRAM_BOT_TOKEN=""
TELEGRAM_CHAT_ID=""
```

Email and Telegram integrations are safe to run without provider keys. When keys are missing, the app logs stub notifications so demos and builds keep working.

## Production Notes

For Vercel, configure `DATABASE_URL` with a hosted SQL/libSQL database instead of a local file database. A local SQLite file works for development but is not persistent in serverless production.

After configuring environment variables on Vercel, run:

```bash
npx prisma migrate deploy
npx prisma db seed
```

## Features

- Super admin and TPO admin authentication with protected routes.
- Admin college/TPO dashboards and college onboarding.
- TPO student roster management and placement recording.
- Revenue-share finance dashboard.
- MOU renewal alerts for agreements expiring within 30 days.
- Placement summary CSV/PDF exports and cohort performance CSV export.
- Resend email and Telegram bot notification hooks.
- Seeder with 3 colleges, 3 TPOs, 60 students, enrollments, MOUs, communications, and 24 placements.
