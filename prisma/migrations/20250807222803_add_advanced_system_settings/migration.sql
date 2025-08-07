-- AlterTable
ALTER TABLE "system_settings" ADD COLUMN     "cacheLifetime" INTEGER DEFAULT 3600,
ADD COLUMN     "debugMode" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "maxUploadSize" INTEGER DEFAULT 50,
ADD COLUMN     "sessionTimeout" INTEGER DEFAULT 120;
