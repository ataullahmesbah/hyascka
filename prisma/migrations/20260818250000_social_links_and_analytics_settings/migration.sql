-- ==========================================================
-- NEW FILE
-- LOCATION: prisma/migrations/20260818250000_social_links_and_analytics_settings/migration.sql
-- ==========================================================
-- CreateTable
CREATE TABLE "SocialLink" (
    "id" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "icon" TEXT,
    "label" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SocialLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SocialLink_active_idx" ON "SocialLink"("active");

-- AlterTable
ALTER TABLE "SiteSettings"
  ADD COLUMN "fbPixelId" TEXT,
  ADD COLUMN "fbPixelEnabled" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "metaCapiAccessToken" TEXT,
  ADD COLUMN "metaCapiEnabled" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "gtmContainerId" TEXT,
  ADD COLUMN "gtmEnabled" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "ga4MeasurementId" TEXT,
  ADD COLUMN "ga4Enabled" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "clarityProjectId" TEXT,
  ADD COLUMN "clarityEnabled" BOOLEAN NOT NULL DEFAULT false;
