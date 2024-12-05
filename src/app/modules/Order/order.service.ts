import { prisma } from "../../../shared/prisma";

// const createOrder = async (payload: any) => {
//   const result = await prisma.order.create({
//     data: {
//       customerId: payload.customerId,
//       deliveryAddressId: payload.deliveryAddressId,
//       totalPrice: payload.totalPrice,
//       orderStatus: payload.orderStatus,
//       paymentStatus: payload.paymentStatus,
//       orderProduct: {
//         create: payload.orderProduct.map((item: any) => ({
//           productId: item.productId,
//           quantity: item.quantity,
//         })),
//       },
//     },
//   });
// };
