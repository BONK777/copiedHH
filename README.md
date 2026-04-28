# Job Board MVP (Next.js 15 + Prisma + NextAuth)

Production-ready MVP job board (hh.ru core analogue):

- Auth (Credentials): sign up / sign in
- Roles: CANDIDATE / EMPLOYER
- Vacancy CRUD (EMPLOYER)
- Resume CRUD (CANDIDATE)
- Apply to vacancy (CANDIDATE)
- Employer sees applications to own vacancies
- Vacancy search via PostgreSQL FTS

## Tech stack

- Next.js 15 (App Router)
- TypeScript strict
- Prisma + PostgreSQL
- NextAuth (Auth.js) credentials provider + JWT sessions
- Tailwind CSS + minimal shadcn-like primitives
- Vitest

## Local run

1. Copy env:

```bash
cp .env.example .env
```

2. Start PostgreSQL (local/docker) and update `DATABASE_URL`.

3. Install dependencies:

```bash
npm install
```

4. Generate Prisma client and migrate:

```bash
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```

5. Run app:

```bash
npm run dev
```

## Quality gates

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

## Deploy to Vercel

1. Push repo to GitHub.
2. Import project in Vercel.
3. Set environment variables:
   - `DATABASE_URL`
   - `NEXTAUTH_URL`
   - `NEXTAUTH_SECRET`
4. Provision PostgreSQL (Neon/Supabase/RDS).
5. Run migrations in CI or via `npx prisma migrate deploy`.
