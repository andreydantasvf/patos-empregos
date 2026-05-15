/*
  Warnings:

  - Added the required column `userId` to the `jobs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "jobs" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "jobs_userId_idx" ON "jobs"("userId");

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
