import { z } from "zod";

const createDeliveryAddress = z.object({
  body: z.object({
    customerId: z.string({
      required_error: "Customer Id is required",
    }),
    address: z.string({
      required_error: "Address is reuired",
    }),
  }),
});

const updateDeliveryAddress = z.object({
  body: z.object({
    address: z.string(),
  }),
});

export const DeliveryAddressValidations = {
  createDeliveryAddress,
  updateDeliveryAddress,
};
