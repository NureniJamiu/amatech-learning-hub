/*
  Warnings:

  - You are about to drop the column `isFirstTime` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `lastLoginAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `tourCompleted` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "materials" ADD COLUMN     "chunksCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "processingCompletedAt" TIMESTAMP(3),
ADD COLUMN     "processingError" TEXT,
ADD COLUMN     "processingStartedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "users" DROP COLUMN "isFirstTime",
DROP COLUMN "lastLoginAt",
DROP COLUMN "tourCompleted";

-- CreateTable
CREATE TABLE "processing_queue" (
    "id" TEXT NOT NULL,
    "materialId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "maxAttempts" INTEGER NOT NULL DEFAULT 3,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "processing_queue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "processing_queue_materialId_key" ON "processing_queue"("materialId");

-- CreateIndex
CREATE INDEX "processing_queue_status_idx" ON "processing_queue"("status");

-- CreateIndex
CREATE INDEX "processing_queue_createdAt_idx" ON "processing_queue"("createdAt");

-- CreateIndex
CREATE INDEX "materials_processingStatus_idx" ON "materials"("processingStatus");

-- CreateIndex
CREATE INDEX "materials_courseId_idx" ON "materials"("courseId");

-- AddForeignKey
ALTER TABLE "processing_queue" ADD CONSTRAINT "processing_queue_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "materials"("id") ON DELETE CASCADE ON UPDATE CASCADE;
