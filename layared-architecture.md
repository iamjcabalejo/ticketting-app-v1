# 🧱 Layered Architecture Guide

## 1. Data Access Layer (`/data`)
- `*.repository.ts`: Handles raw DB queries (e.g., Prisma, SQL).
- `*.model.ts`: Defines DTOs or domain models.
- `*.schema.ts`: Zod schemas for validation.

## 2. Services Layer (`/services`)
- Encapsulates business logic.
- Combines multiple DAL calls.
- Enforces domain rules and permissions.
- Each **service** resides in its own folder for modularity and scalability.

### 📂 Folder Structure per Service
Each folder under `/services` must contain:
- **`component/`** → UI or functional components specific to the service.
- **`data-access/`** → Handles data-related operations, with three subfolders:
  1. **`form-actions/`** → Logic for form handling and submissions.
  2. **`mutations/`** → Database operations for **CREATE**, **UPDATE**, and **DELETE**.
  3. **`queries/`** → Database operations for **READ** and data retrieval only.

```
services/
└── user/
    ├── component/
    │   ├── UserCard.tsx
    │   └── UserForm.tsx
    └── data-access/
        ├── form-actions/
        │   └── submitUserForm.ts
        ├── mutations/
        │   ├── createUser.ts
        │   ├── updateUser.ts
        │   └── deleteUser.ts
        └── queries/
            ├── getUserById.ts
            └── listUsers.ts
```

## 3. UI Layer (`/components`)
- Follows ShadCN conventions.
- Split into primitives (`ui/`), layouts, and shared widgets.

## 4. Routing Layer (`/app`)
- Uses Next.js App Router.
- Supports nested layouts, loading states, and route segments.

---

## 📁 Folder Overview

```
/
├── app/                  # App Router pages, layouts, and routes
├── components/           # Reusable UI components
│   ├── ui/               # ShadCN primitives
│   ├── layout/           # Page layouts
│   └── shared/           # Widgets (modals, toasts, etc.)
├── data/                 # Data Access Layer
│   └── [domain]/         # e.g., user/, product/
│       ├── *.repository.ts
│       ├── *.model.ts
│       └── *.schema.ts
├── services/             # Business logic layer
│   └── [service]/        # Each service in its own folder
│       ├── component/
│       └── data-access/
│           ├── form-actions/
│           ├── mutations/
│           └── queries/
├── lib/                  # Utilities and helpers
├── types/                # Global types and interfaces
├── config/               # App-wide config (env, constants)
├── public/               # Static assets
├── styles/               # Global styles and themes
├── middleware.ts         # Middleware logic
└── next.config.js        # Next.js config
```

---

## 🧠 Best Practices
- ✅ Use **barrel files (`index.ts`)** for clean imports.
- ✅ Group by **domain/service** for scalability.
- ✅ Keep DAL **pure**—no side effects or UI logic.
- ✅ Use **Zod schemas** for input/output validation.
- ✅ Avoid mixing **business logic** in components or pages.
- ✅ Use **async/await** consistently in DAL and services.
- ✅ Keep **service folders self-contained**—easy to move or reuse.

---

## 📌 Naming Conventions

| Layer       | Convention              | Example                  |
|--------------|--------------------------|---------------------------|
| DAL          | `[entity].repository.ts` | `user.repository.ts`     |
| Models       | `[entity].model.ts`      | `product.model.ts`       |
| Schemas      | `[entity].schema.ts`     | `order.schema.ts`        |
| Services     | `[entity].service.ts` or `services/[entity]/` | `auth.service.ts`, `services/auth/` |
| Components   | PascalCase folders/files | `Button.tsx`, `Modal.tsx` |

---

## 🧪 Testing Strategy (Optional)
- Unit test DAL and services using **Vitest** or **Jest**.
- Use **Playwright** or **Cypress** for end-to-end testing.
- Mock external dependencies in services.

---

## 📦 Deployment Notes
- Use `.env.local` for local secrets.
- Use `next.config.js` for runtime config.
- Consider **Vercel** or **Docker** for deployment.

---

**Happy coding! 🚀**