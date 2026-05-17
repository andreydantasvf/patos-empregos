-- AlterTable: convert area from JobArea enum to TEXT, preserving existing data
ALTER TABLE "jobs" ALTER COLUMN "area" TYPE TEXT USING "area"::text;

-- DropEnum
DROP TYPE "JobArea";

-- RecreateIndex (drop first in case it exists from initial migration)
DROP INDEX IF EXISTS "jobs_area_idx";
CREATE INDEX "jobs_area_idx" ON "jobs"("area");
