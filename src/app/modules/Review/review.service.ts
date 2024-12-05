import { Review } from "@prisma/client";
import { prisma } from "../../../shared/prisma";

const createReview = async (payload: any): Promise<Review> => {
  const result = await prisma.review.create({
    data: payload,
  });

  return result;
};

const updateReview = async (id: string, payload: any): Promise<Review> => {
  await prisma.review.findUniqueOrThrow({
    where: {
      id,
    },
  });
  const result = await prisma.review.update({
    where: {
      id,
    },
    data: payload,
  });

  return result;
};

const deleteReview = async (id: string): Promise<Review> => {
  await prisma.review.findUniqueOrThrow({
    where: {
      id,
    },
  });
  const result = await prisma.review.delete({
    where: {
      id,
    },
  });

  return result;
};

export const ReviewServices = {
  createReview,
  updateReview,
  deleteReview,
};
