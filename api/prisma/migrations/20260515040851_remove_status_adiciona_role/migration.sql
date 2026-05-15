/*
  Warnings:

  - You are about to drop the column `status` on the `jobs` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "jobs_status_idx";

-- AlterTable
ALTER TABLE "jobs" DROP COLUMN "status";

-- DropEnum
DROP TYPE "JobStatus";
