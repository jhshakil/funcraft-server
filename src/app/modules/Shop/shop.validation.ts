import { z } from "zod";

const createShop = z.object({
  body: z.object({
    vendorId: z.string({
      required_error: "Vendor Id is required",
    }),
    name: z.string({
      required_error: "Shop name is required",
    }),
    description: z.string().optional(),
  }),
});

const updateShop = z.object({
  body: z.object({
    vendorId: z.string().optional(),
    name: z.string().optional(),
    description: z.string().optional(),
  }),
});

export const ShopValidations = {
  createShop,
  updateShop,
};
