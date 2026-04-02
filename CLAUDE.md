# Lexis Agency ERP — CLAUDE.md

## Project Overview

**Lexis Agency ERP** is a full-stack agency management system built with Payload CMS v3 + Next.js 16.
It manages clients and their services, with automated expiration reminder emails.

The UI language is **Greek (Ελληνικά)**.

---

## Stack

| Layer | Technology |
|-------|-----------|
| CMS / Backend | Payload CMS v3.81 |
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5.7 |
| Database | SQLite (`@payloadcms/db-sqlite`) |
| Styling | Tailwind CSS v3 + `@tailwindcss/forms` |
| Email | Resend |
| Runtime | Node.js ≥18.20.2 |
| Package manager | pnpm |

---

## Roles

| Role | Access |
|------|--------|
| `superadmin` | Payload CMS admin panel at `/admin` |
| `admin` | Custom frontend dashboard at `/dashboard` — full CRUD |
| `client` | Client portal at `/portal` — view own data, edit contact details only |

---

## Routes

```
/                  → redirects based on role
/login             → shared login page (Greek)
/admin             → Payload CMS panel (superadmin only)
/dashboard         → Admin CRUD frontend (admin role)
/dashboard/clients → Client management
/dashboard/services → Service management
/dashboard/categories → Service category management
/portal            → Client portal (client role)
/portal/profile    → Edit own contact details
/api/cron/run-jobs → External cron trigger (requires x-cron-secret header)
```

---

## Collections

- **users** — Auth + roles (`superadmin`, `admin`, `client`)
- **clients** — Agency clients with contact info, linked to a user account
- **services** — Services per client with optional expiration date
- **service-categories** — Simple lookup table for service categories
- **media** — File uploads

---

## Email Notifications

Resend sends Greek-language emails when a service approaches expiration:
- 30 days before
- 14 days before
- 3 days before
- 1 day before

Deduplication tracked via `notifiedDays` field on Services.

Job runs daily at 08:00 via Payload's built-in job queue (`autoRun` cron).
External trigger available at `GET /api/cron/run-jobs` (header: `x-cron-secret`).

---

## Key Commands

```bash
pnpm dev                  # Start dev server
pnpm build                # Production build
pnpm generate:types       # Regenerate payload-types.ts (run after schema changes)
pnpm generate:importmap   # Regenerate Payload import map (run after schema changes)
pnpm lint                 # ESLint
```

**Always run both generate commands after modifying any collection.**

---

## Environment Variables

```bash
DATABASE_URL=file:./.db
PAYLOAD_SECRET=<secret>
RESEND_API_KEY=<resend-api-key>
RESEND_FROM_EMAIL=noreply@yourdomain.com
CRON_SECRET=<random-secret-for-cron-endpoint>
```

---

## File Structure Highlights

```
src/
├── access/               # Role-based access helpers
├── collections/          # Payload collection definitions
├── components/
│   ├── admin/            # Admin dashboard UI components
│   └── portal/           # Client portal UI components
├── email/templates/      # HTML email templates (Greek)
├── jobs/tasks/           # Payload job queue tasks
├── lib/                  # Auth helpers, utility functions
└── app/
    ├── (frontend)/       # Next.js frontend (login, dashboard, portal)
    └── (payload)/        # Payload CMS routes and API
```

---

## Conventions

- All user-facing strings are in **Greek** — hardcoded directly in JSX (no i18n library)
- Greek labels live in component files directly; shared labels can go in `src/lib/labels.ts`
- Use **Server Actions** (React 19) for form submissions — call Payload Local API directly
- Every protected page calls `requireRole()` or `requireAdminOrSuperAdmin()` as the first line
- After every schema change: `pnpm generate:types && pnpm generate:importmap`
- Tailwind for all styling — no CSS modules or styled-components
