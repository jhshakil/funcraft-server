/*
  Warnings:

  - You are about to drop the column `images` on the `products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "products" DROP COLUMN "images",
ALTER COLUMN "discount" DROP NOT NULL,
ALTER COLUMN "ratting" DROP NOT NULL,
ALTER COLUMN "reviewCount" DROP NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'PUBLISHED';
