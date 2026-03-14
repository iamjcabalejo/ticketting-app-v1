# Ticketing App v1

Event ticketing app for organizers: attendees register, receive a confirmation email with a QR code, and staff can scan QR codes at the door.

## Features

- **Registration** — Attendees sign up with name, email, and phone; receive a confirmation email with an inline QR code
- **QR scanner** — Scan attendee QR codes (e.g. at event entrance)
- **Email** — Sends registration confirmation with QR code via [Resend](https://resend.com)

## Tech stack

- **Next.js 15** (App Router, Turbopack)
- **React 19**
- **PostgreSQL** (Neon) with **Drizzle ORM**
- **Resend** for transactional email
- **Tailwind CSS**, **react-hook-form**, **Zod**

## Prerequisites

- Node.js 18+
- npm, yarn, or pnpm
- [Resend](https://resend.com) account (API key + verified sending domain)
- PostgreSQL database (e.g. [Neon](https://neon.tech))

## Setup

1. **Clone and install**

   ```bash
   cd ticketting-app-v1
   npm install
   ```

2. **Environment variables**

   Create a `.env` file in the project root and set:

   | Variable             | Description                                      |
   |----------------------|--------------------------------------------------|
   | `DATABASE_URL`       | PostgreSQL connection string (e.g. Neon)        |
   | `RESEND_API_KEY`     | Resend API key                                   |
   | `RESEND_FROM_EMAIL`  | Sender address, e.g. `Support <support@yourdomain.com>` (must use a [verified domain](https://resend.com/domains)) |

   Example:

   ```env
   DATABASE_URL='postgresql://user:pass@host/db?sslmode=require'
   RESEND_API_KEY=re_xxxxxxxxx
   RESEND_FROM_EMAIL="Support <support@yourdomain.com>"
   ```

3. **Database**

   Run migrations (if you use Drizzle migrations):

   ```bash
   npx drizzle-kit push
   # or
   npx drizzle-kit migrate
   ```

4. **Run the app**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command        | Description                |
|----------------|----------------------------|
| `npm run dev`  | Start dev server (Turbopack) |
| `npm run build`| Production build           |
| `npm run start`| Start production server    |
| `npm run lint` | Run ESLint                 |

## Routes

| Path           | Description                          |
|----------------|--------------------------------------|
| `/`            | Home: links to Registration & Scanner |
| `/registration`| Attendee registration form           |
| `/scanner`     | QR code scanner                      |
| `/login`       | Redirects to `/` (no auth in this app) |

## Project structure

```
ticketting-app-v1/
├── app/                    # Next.js App Router
│   ├── page.tsx            # Home
│   ├── registration/       # Registration form
│   ├── scanner/            # QR scanner
│   └── layout.tsx
├── components/             # Shared UI (e.g. Button)
├── data/                   # Drizzle schema & DB client
├── lib/                    # Shared utilities
│   └── email-services/     # Resend email (registration + QR)
├── services/               # Feature logic
│   ├── registration/       # Registration form + mutations
│   └── qr-scanner/         # Scanner component
├── .env                    # Local env (not committed)
├── drizzle.config.ts
└── next.config.ts
```

## License

Private.
