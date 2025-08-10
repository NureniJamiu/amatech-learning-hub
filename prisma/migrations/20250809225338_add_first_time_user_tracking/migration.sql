-- AlterTable
ALTER TABLE "users" ADD COLUMN     "isFirstTime" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "lastLoginAt" TIMESTAMP(3),
ADD COLUMN     "tourCompleted" BOOLEAN NOT NULL DEFAULT false;
