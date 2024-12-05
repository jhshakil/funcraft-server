import { z } from "zod";

const createReview = z.object({
  body: z.object({
    productId: z.string({
      required_error: "Product id is required",
    }),
    customerId: z.string({
      required_error: "Customer id is required",
    }),
    ratting: z.number({
      required_error: "Ratting is required",
    }),
    review: z.string({
      required_error: "Review is required",
    }),
  }),
});

const updateReview = z.object({
  body: z.object({
    ratting: z.number().optional(),
    review: z.string().optional(),
  }),
});

export const ReviewValidations = {
  createReview,
  updateReview,
};
