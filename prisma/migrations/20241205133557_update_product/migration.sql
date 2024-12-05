/*
  Warnings:

  - The `size` column on the `products` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `color` column on the `products` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "products" DROP COLUMN "size",
ADD COLUMN     "size" TEXT[],
DROP COLUMN "color",
ADD COLUMN     "color" TEXT[];
