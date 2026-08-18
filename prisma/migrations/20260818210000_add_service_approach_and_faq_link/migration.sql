-- ==========================================================
-- NEW FILE
-- LOCATION: prisma/migrations/20260818210000_add_service_approach_and_faq_link/migration.sql
-- ==========================================================
-- AlterTable
ALTER TABLE "Service" ADD COLUMN "approach" TEXT;

-- AlterTable
-- serviceId is nullable: every existing FAQ row becomes serviceId = NULL,
-- i.e. it stays a global FAQ exactly as before. No existing FAQ data changes
-- meaning.
ALTER TABLE "FAQ" ADD COLUMN "serviceId" TEXT;

-- CreateIndex
CREATE INDEX "FAQ_serviceId_idx" ON "FAQ"("serviceId");

-- AddForeignKey
ALTER TABLE "FAQ" ADD CONSTRAINT "FAQ_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;
