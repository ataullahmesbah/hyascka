-- CreateEnum
CREATE TYPE "ServiceAcquisitionType" AS ENUM ('FIXED_PRICE', 'CUSTOM_QUOTE');

-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "acquisitionType" "ServiceAcquisitionType" NOT NULL DEFAULT 'FIXED_PRICE';

-- AlterTable
ALTER TABLE "ServiceCategory" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;
