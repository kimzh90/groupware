# Groupware Solution - Project Guide

## 1. Project Context
We are building an Enterprise Groupware Solution using **Next.js 15 (App Router)** and **NestJS**.
To simplify development, we will use **Docker Compose** to manage infrastructure (PostgreSQL, pgAdmin).

**Tech Stack:**
- **Frontend:** Next.js 15, TypeScript, Tailwind CSS, Shadcn/UI, Zustand.
- **Backend:** NestJS, Prisma ORM, Passport(JWT).
- **Infra:** Docker Compose (PostgreSQL 15, pgAdmin 4).

---

## 2. Phase 0: Infrastructure Setup (Docker) **[COMPLETED]**
The development environment is set up using Docker.

**Infrastructure Details:**
1.  **`docker-compose.yml`** is located in the root directory.
    - **`postgres`**: Use image `postgres:15-alpine`.
      - Ports: `5432:5432`
      - Env: `POSTGRES_USER=jules`, `POSTGRES_PASSWORD=password`, `POSTGRES_DB=groupware`
      - Volumes: `./infra/postgres_data:/var/lib/postgresql/data` (Persist data locally)
    - **`pgadmin`**: Use image `dpage/pgadmin4`.
      - Ports: `5050:80`
      - Env: `PGADMIN_DEFAULT_EMAIL=admin@admin.com`, `PGADMIN_DEFAULT_PASSWORD=admin`
      - Depends on: `postgres`

2.  **Environment Variables (.env)**
    - The `.env` file in `apps/api` matches the Docker config:
    - `DATABASE_URL="postgresql://jules:password@localhost:5432/groupware?schema=public"`

**Goal:** Run `docker-compose up -d` to have the DB ready immediately.

---

## 3. Phase 1: Audit & Repair **[COMPLETED]**
The codebase has been audited and repaired.

**Completed Items:**
**A. Database (`schema.prisma`)**
1. [x] **Users Table:** Handles `managerId` (Self-relation) and `role` (enum: SUPER_ADMIN, ADMIN, USER).
2. [x] **Departments Table:** Tree structure (Self-relation with `parentId`).
3. [x] **Approvals:** Has `ApprovalDoc` and `ApprovalLine`.

**B. Backend (NestJS)**
1. [x] **Auth:** JWT Strategy & Guard implemented.
2. [x] **CORS:** CORS enabled for Next.js (`http://localhost:3000`).

**C. Frontend (Next.js)**
1. [x] **Routing:** `/dashboard` has Sidebar/Header Layout.
2. [x] **Middleware:** `middleware.ts` configured to protect routes.

---

## 4. Phase 2: Implementation (Advanced Features) **[COMPLETED]**
All advanced features have been implemented.

### Task A: Electronic Approval (전자결재)
**1. Backend (NestJS)**
- **Create Approval:** Status `PENDING`, create `ApprovalLine`.
- **Process Approval:** Update status (`APPROVED`/`REJECTED`) and move to next approver.

**2. Frontend (Next.js)**
- **UI:** Write Page (Editor + Org Chart Modal), List Page (Tabs for My Docs / To Approve).

### Task B: Monitoring & Audit Logs (관리자 및 로그) [UPDATED]
- [x] **Monitoring Dashboard:** 실시간 현황 통계 및 주간 로그인 차트 (Recharts).
- [x] **Audit Logs:** 시스템 전체 감사 로그 추적 및 조회 기능.
- [x] **User Management:** 검색 및 필터링 기능 강화, 역할/부서 편집 기능.
- [x] **Auth Stability:** 401/500 에러 해결 및 데이터 로딩 최적화.
- [x] **Auth Stability:** 401/500 에러 해결 및 데이터 로딩 최적화.
---

## 5. Execution Command Order
1. **Setup Infra:** `docker-compose up -d` (from root).
2. **Install Dependencies:** `npm install` (from root).
3. **Database Setup:** 
   - `cd apps/api`
   - `npx prisma generate`
   - `npx prisma migrate dev --name init_approval_system`
   - `npx prisma db seed` (Creates initial Admin user: `admin@groupware.com` / `admin1234`)
4. **Run Project:** `npm run dev` (from root).