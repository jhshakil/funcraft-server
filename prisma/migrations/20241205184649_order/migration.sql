/*
  Warnings:

  - Added the required column `orderStatus` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'DELIVERED', 'BLOCKED', 'CANCEL');

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "orderStatus" "OrderStatus" NOT NULL;
