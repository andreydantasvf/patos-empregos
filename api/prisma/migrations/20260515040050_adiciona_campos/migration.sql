/*
  Warnings:

  - Added the required column `amountPaid` to the `jobs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `jobs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paidAt` to the `jobs` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "JobPlan" AS ENUM ('BASIC', 'PRO', 'PREMIUM');

-- AlterTable
ALTER TABLE "jobs" ADD COLUMN     "amountPaid" TEXT NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "paidAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "plan" "JobPlan" NOT NULL DEFAULT 'BASIC';

-- CreateIndex
CREATE INDEX "jobs_plan_idx" ON "jobs"("plan");
