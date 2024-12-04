import { z } from "zod";

const createShop = z.object({
  vendorId: z.string({
    required_error: "Vendor Id is required",
  }),
  name: z.string({
    required_error: "Shop name is required",
  }),
  description: z.string().optional(),
});

export const ShopValidations = {
  createShop,
};
