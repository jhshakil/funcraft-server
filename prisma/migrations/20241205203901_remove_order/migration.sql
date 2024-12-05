-- DropForeignKey
ALTER TABLE "orderProducts" DROP CONSTRAINT "orderProducts_orderId_fkey";

-- AddForeignKey
ALTER TABLE "orderProducts" ADD CONSTRAINT "orderProducts_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
