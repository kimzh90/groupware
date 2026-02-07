# Project Structure (Updated: Turborepo + Next.js 15 App Router)

This project is a Turborepo-managed monorepo with a clear separation between the web frontend and the API backend.

## Monorepo Overview (Turborepo)

```text
/
├── apps/
│   ├── web/             # Next.js 15 (App Router) Frontend
│   └── api/             # NestJS Backend
├── package.json         # Workspace root configuration
├── turbo.json           # Turborepo configuration
└── STRUCTURE.md         # This file
```

## Backend Structure (NestJS - apps/api)

The backend is organized into domain-based modules.

```text
apps/api/
├── src/
│   ├── modules/
│   │   ├── auth/         # JWT Auth, Middleware
│   │   ├── users/        # User management
│   │   ├── departments/  # Department hierarchy
│   │   ├── boards/       # Board management
│   │   ├── posts/        # Post management
│   │   └── approvals/    # Electronic approval workflow
│   ├── common/           # Shared guards, decorators
│   ├── config/           # App configuration
│   └── main.ts           # Entry point
├── prisma/
│   └── schema.prisma     # Prisma Schema
└── .env                  # Database connection
```

## Frontend Structure (Next.js 15 App Router - apps/web)

The frontend uses Next.js 15's App Router for routing and follows a feature-based organization for business logic.

```text
apps/web/
├── app/                  # Next.js 15 App Router
│   ├── (auth)/           # Authentication routes (login, etc.)
│   ├── (dashboard)/      # Protected dashboard routes
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Landing page
├── components/           # Shared UI components (Shadcn/UI)
├── src/features/         # Domain-driven features
│   ├── auth/             # Login logic, state
│   ├── users/            # User profile components
│   ├── approvals/        # Approval request forms
│   └── ...
├── store/                # Zustand state management
├── hooks/                # Global React Query / custom hooks
├── lib/                  # Utilities, API clients (TanStack Query)
└── public/               # Static assets
```

### Tech Stack Highlights:
- **Next.js 15**: Leveraging Server Components and App Router.
- **NestJS**: Modular architecture for robust API development.
- **Turborepo**: Optimized build pipelines and caching.
- **Prisma**: Type-safe database access with PostgreSQL.
- **TanStack Query**: Efficient server state management and caching in the frontend.
