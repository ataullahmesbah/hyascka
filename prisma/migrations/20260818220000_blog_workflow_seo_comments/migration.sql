-- ==========================================================
-- NEW FILE
-- LOCATION: prisma/migrations/20260818220000_blog_workflow_seo_comments/migration.sql
-- ==========================================================
-- AlterEnum
-- Existing rows already using DRAFT/PUBLISHED/SCHEDULED/ARCHIVED are
-- untouched by adding new enum values.
ALTER TYPE "BlogStatus" ADD VALUE 'PENDING_REVIEW';
ALTER TYPE "BlogStatus" ADD VALUE 'REJECTED';

-- CreateEnum
CREATE TYPE "CommentStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "Blog"
  ADD COLUMN "contentImages" TEXT[] DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "authorDesignation" TEXT,
  ADD COLUMN "seoTitle" TEXT,
  ADD COLUMN "seoDescription" TEXT,
  ADD COLUMN "canonicalUrl" TEXT;

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "blogId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" "CommentStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Comment_blogId_idx" ON "Comment"("blogId");

-- CreateIndex
CREATE INDEX "Comment_status_idx" ON "Comment"("status");

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blog"("id") ON DELETE CASCADE ON UPDATE CASCADE;
