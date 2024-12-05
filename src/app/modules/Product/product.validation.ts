import { z } from "zod";

const createProduct = z.object({
  categoryId: z.string({
    required_error: "Category id is required",
  }),
  shopId: z.string({
    required_error: "Shop id is required",
  }),
  name: z.string({
    required_error: "Name is required",
  }),
  description: z.string().optional(),
  price: z.number({
    required_error: "Price is required",
  }),
  inventoryCount: z.number({
    required_error: "Inventory Count is required",
  }),
  size: z.array(z.string()).optional(),
  color: z.array(z.string()).optional(),
  status: z.enum(["PUBLISHED", "DRAFT", "BLOCKED"]).optional(),
});

const updateProduct = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  price: z.number().optional(),
  inventoryCount: z.number().optional(),
  size: z.array(z.string()).optional(),
  color: z.array(z.string()).optional(),
  status: z.enum(["PUBLISHED", "DRAFT", "BLOCKED"]).optional(),
});

export const ProductValidations = {
  createProduct,
  updateProduct,
};
