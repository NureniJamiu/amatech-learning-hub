-- AlterTable
ALTER TABLE "activity_logs" 
ADD COLUMN IF NOT EXISTS "endpoint" TEXT,
ADD COLUMN IF NOT EXISTS "method" TEXT,
ADD COLUMN IF NOT EXISTS "statusCode" INTEGER,
ADD COLUMN IF NOT EXISTS "duration" INTEGER,
ADD COLUMN IF NOT EXISTS "error" TEXT,
ALTER COLUMN "details" TYPE JSONB USING details::jsonb;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "activity_logs_endpoint_idx" ON "activity_logs"("endpoint");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "activity_logs_statusCode_idx" ON "activity_logs"("statusCode");
