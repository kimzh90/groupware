-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('NORMAL', 'LATE', 'EARLY_LEAVE', 'ABSENT');

-- CreateTable
CREATE TABLE "attendances" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "clockIn" TIMESTAMP(3),
    "clockOut" TIMESTAMP(3),
    "status" "AttendanceStatus" NOT NULL DEFAULT 'NORMAL',
    "memo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attendances_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "attendances_userId_idx" ON "attendances"("userId");

-- CreateIndex
CREATE INDEX "attendances_date_idx" ON "attendances"("date");

-- CreateIndex
CREATE UNIQUE INDEX "attendances_userId_date_key" ON "attendances"("userId", "date");

-- AddForeignKey
ALTER TABLE "attendances" ADD CONSTRAINT "attendances_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
