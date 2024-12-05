/*
  Warnings:

  - You are about to drop the column `orderStatus` on the `orders` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[customerId]` on the table `reviews` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "orders" DROP COLUMN "orderStatus",
ALTER COLUMN "paymentStatus" SET DEFAULT 'UNPAID';

-- DropEnum
DROP TYPE "OrderStatus";

-- CreateIndex
CREATE UNIQUE INDEX "reviews_customerId_key" ON "reviews"("customerId");
