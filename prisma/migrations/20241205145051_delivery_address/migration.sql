/*
  Warnings:

  - Added the required column `address` to the `deliveryAddresses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "deliveryAddresses" ADD COLUMN     "address" TEXT NOT NULL;
