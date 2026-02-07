# Project Structure

This project follows a monorepo structure using a module-based organization for the backend (NestJS) and a feature-based organization for the frontend (React).

## Monorepo Overview

```text
/
├── apps/
│   ├── client/          # React (Vite) Frontend
│   └── server/          # NestJS Backend
├── package.json         # Workspace root configuration
└── STRUCTURE.md         # This file
```

## Backend Structure (NestJS)

The backend is organized into modules to ensure high cohesion and low coupling. Each module encapsulates its own controllers, services, and entities.

```text
apps/server/
├── src/
│   ├── modules/
│   │   ├── auth/         # Authentication (JWT, RBAC)
│   │   ├── users/        # User management
│   │   ├── departments/  # Department hierarchy management
│   │   ├── boards/       # Board types and configuration
│   │   ├── posts/        # Board posts and content
│   │   └── approvals/    # Electronic approval workflows
│   ├── common/           # Shared guards, decorators, filters, interceptors
│   ├── config/           # Environment and app configuration
│   ├── database/         # Prisma service and module
│   └── main.ts           # Application entry point
├── prisma/
│   └── schema.prisma     # Database schema (Prisma)
└── ...
```

### Key Modules:
- **AuthModule**: Handles JWT Access/Refresh tokens and Role-Based Access Control.
- **ApprovalModule**: Manages the multi-step approval process.

## Frontend Structure (React)

The frontend uses a feature-based architecture. This allows for better scalability as the application grows, keeping all related components, hooks, and logic for a specific feature together.

```text
apps/client/
├── src/
│   ├── api/              # Axios instance and global API configuration
│   ├── components/       # Common UI components (Shadcn/UI)
│   ├── features/         # Feature-specific modules
│   │   ├── auth/         # Login, registration, token handling
│   │   ├── users/        # User profile, directory
│   │   ├── departments/  # Org chart, department views
│   │   ├── boards/       # Post lists, post creation
│   │   └── approvals/    # Approval requests, pending lists
│   ├── hooks/            # Global reusable hooks
│   ├── layouts/          # Page layouts (Sidebar, Header, etc.)
│   ├── pages/            # Routable page components (using features)
│   ├── store/            # Zustand state management
│   ├── types/            # TypeScript definitions/interfaces
│   ├── utils/            # Helper functions
│   └── App.tsx           # Main application component
└── ...
```

### Feature Pattern:
Each feature inside `features/` typically contains:
- `components/`: Feature-specific components.
- `hooks/`: Feature-specific React Query hooks.
- `api/`: Feature-specific API calls.
- `types.ts`: Feature-specific types.
