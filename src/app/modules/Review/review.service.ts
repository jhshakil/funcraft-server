import { Prisma, Review } from "@prisma/client";
import { prisma } from "../../../shared/prisma";
import { TPaginationOptions } from "../../interfaces/pagination";
import { calculatePagination } from "../../../helpers/paginationHelper";

const getAllReview = async (options: TPaginationOptions) => {
  const { limit, page, skip, sortBy, sortOrder } = calculatePagination(options);
  const andConditions: Prisma.ReviewWhereInput[] = [];

  const whereConditions: Prisma.ReviewWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.review.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      product: true,
      customer: true,
    },
  });

  const total = await prisma.review.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getAllUserReview = async (
  options: TPaginationOptions,
  customerId: string
) => {
  const { limit, page, skip, sortBy, sortOrder } = calculatePagination(options);
  const andConditions: Prisma.ReviewWhereInput[] = [];

  const whereConditions: Prisma.ReviewWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.review.findMany({
    where: {
      ...whereConditions,
      customerId,
    },
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      product: true,
      customer: true,
    },
  });

  const total = await prisma.review.count({
    where: {
      ...whereConditions,
      customerId,
    },
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getReviewByProductId = async (productId: string) => {
  const result = await prisma.review.findMany({
    where: {
      productId,
    },
    include: {
      customer: true,
    },
  });

  return result;
};

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

const checkForReview = async (
  customerId: string,
  productId: string
): Promise<boolean> => {
  await prisma.customer.findUniqueOrThrow({
    where: {
      id: customerId,
      isDeleted: false,
    },
  });

  const order = await prisma.order.findFirst({
    where: {
      customerId: customerId,
      paymentStatus: "PAID",
      orderProduct: {
        some: {
          productId: productId,
        },
      },
    },
  });

  return order !== null;
};

export const ReviewServices = {
  getAllReview,
  getAllUserReview,
  getReviewByProductId,
  createReview,
  updateReview,
  deleteReview,
  checkForReview,
};
