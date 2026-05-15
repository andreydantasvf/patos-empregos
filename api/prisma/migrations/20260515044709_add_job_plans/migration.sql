/*
  Warnings:

  - You are about to drop the column `active` on the `jobs` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('PENDING', 'ACTIVE', 'EXPIRED');

-- DropIndex
DROP INDEX "jobs_active_idx";

-- AlterTable
ALTER TABLE "jobs" DROP COLUMN "active",
ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "paymentId" TEXT,
ADD COLUMN     "status" "JobStatus" NOT NULL DEFAULT 'PENDING',
ALTER COLUMN "paidAt" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "jobs_status_idx" ON "jobs"("status");
