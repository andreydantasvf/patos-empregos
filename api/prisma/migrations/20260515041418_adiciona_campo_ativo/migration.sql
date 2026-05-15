-- AlterTable
ALTER TABLE "jobs" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE INDEX "jobs_active_idx" ON "jobs"("active");
