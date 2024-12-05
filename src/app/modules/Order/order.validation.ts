import { z } from "zod";

const createOrder = z.object({
  body: z.object({
    customerId: z.string({
      required_error: "Customer id is required",
    }),
    deliveryAddressId: z.string({
      required_error: "Delivery address id is required",
    }),
    shopId: z.string({
      required_error: "Shop id is required",
    }),
    totalPrice: z.number({
      required_error: "Total price is required",
    }),
    orderStatus: z
      .enum(["PENDING", "DELIVERED", "BLOCKED", "CANCEL"])
      .optional(),
    paymentStatus: z.enum(["PAID", "UNPAID"]).optional(),
    products: z.array(
      z.object({
        productId: z.string({
          required_error: "Product id is required",
        }),
        quantity: z.number({
          required_error: "Quantity is required",
        }),
      })
    ),
  }),
});

const updateOrder = z.object({
  body: z.object({
    orderStatus: z
      .enum(["PENDING", "DELIVERED", "BLOCKED", "CANCEL"])
      .optional(),
    paymentStatus: z.enum(["PAID", "UNPAID"]).optional(),
  }),
});

export const OrderValidations = {
  createOrder,
  updateOrder,
};
