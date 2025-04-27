-- AlterTable
ALTER TABLE "InteractionLog" ALTER COLUMN "date" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "InteractionLog_clientId_idx" ON "InteractionLog"("clientId");

-- CreateIndex
CREATE INDEX "InteractionLog_projectId_idx" ON "InteractionLog"("projectId");
