-- ==========================================================
-- NEW FILE
-- LOCATION: prisma/migrations/20260818240000_testimonial_workflow/migration.sql
-- ==========================================================
-- CreateEnum
CREATE TYPE "TestimonialStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
-- Every existing row in this table was admin-created (there was no client
-- submission flow before this migration), so DEFAULT 'APPROVED' correctly
-- reflects their implicit status without needing a manual backfill.
ALTER TABLE "Testimonial"
  ADD COLUMN "status" "TestimonialStatus" NOT NULL DEFAULT 'APPROVED',
  ADD COLUMN "image" TEXT,
  ADD COLUMN "permissionToPublish" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "userId" TEXT,
  ADD COLUMN "projectId" TEXT,
  ADD COLUMN "serviceId" TEXT;

-- CreateIndex
CREATE INDEX "Testimonial_status_idx" ON "Testimonial"("status");

-- CreateIndex
CREATE INDEX "Testimonial_userId_idx" ON "Testimonial"("userId");

-- AddForeignKey
ALTER TABLE "Testimonial" ADD CONSTRAINT "Testimonial_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Testimonial" ADD CONSTRAINT "Testimonial_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Testimonial" ADD CONSTRAINT "Testimonial_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;
