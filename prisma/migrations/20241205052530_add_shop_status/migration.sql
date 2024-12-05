-- CreateEnum
CREATE TYPE "ShopStatus" AS ENUM ('ACTIVE', 'BLOCKED', 'DISABLE');

-- AlterTable
ALTER TABLE "shops" ADD COLUMN     "status" "ShopStatus" NOT NULL DEFAULT 'ACTIVE';
