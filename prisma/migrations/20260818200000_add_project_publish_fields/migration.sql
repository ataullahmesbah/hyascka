-- ==========================================================
-- NEW FILE
-- LOCATION: prisma/migrations/20260818200000_add_project_publish_fields/migration.sql
-- ==========================================================
-- AlterTable
ALTER TABLE "Project"
  ADD COLUMN "published" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "order" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "projectUrl" TEXT,
  ADD COLUMN "clientName" TEXT,
  ADD COLUMN "seoTitle" TEXT,
  ADD COLUMN "seoDescription" TEXT;

-- Backfill: every project that could previously appear on the public
-- portfolio (status = COMPLETED, the only value the old public queries
-- filtered on) is marked published so nothing currently live disappears.
-- Anything else defaults to unpublished (draft), matching "draft projects
-- must never appear publicly."
UPDATE "Project" SET "published" = true WHERE "status" = 'COMPLETED';

-- CreateIndex
CREATE INDEX "Project_published_idx" ON "Project"("published");
