/*
  Warnings:

  - A unique constraint covering the columns `[vendorId]` on the table `couponCodes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `vendorId` to the `couponCodes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "couponCodes" ADD COLUMN     "vendorId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "couponCodes_vendorId_key" ON "couponCodes"("vendorId");

-- AddForeignKey
ALTER TABLE "couponCodes" ADD CONSTRAINT "couponCodes_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "vendors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
