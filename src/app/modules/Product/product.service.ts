import { prisma } from "../../../shared/prisma";
import { Prisma, Product } from "@prisma/client";
import { TPaginationOptions } from "../../interfaces/pagination";
import { calculatePagination } from "../../../helpers/paginationHelper";
import { productSearchableFields } from "./product.constant";

const getAllProduct = async (params: any, options: TPaginationOptions) => {
  const { searchTerm, ...filterData } = params;
  const { limit, page, skip, sortBy, sortOrder } = calculatePagination(options);
  const andConditions: Prisma.ProductWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: productSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.ProductWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.product.findMany({
    where: {
      ...whereConditions,
      isDeleted: false,
      status: "PUBLISHED",
    },
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      category: true,
      shop: true,
    },
  });

  const total = await prisma.product.count({
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

const getProductById = async (id: string): Promise<Product> => {
  const result = await prisma.product.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
      status: "PUBLISHED",
    },
    include: {
      category: true,
      shop: true,
      review: true,
    },
  });

  return result;
};

const createProduct = async (payload: any): Promise<Product> => {
  await prisma.category.findUniqueOrThrow({
    where: {
      id: payload.categoryId,
    },
  });
  await prisma.shop.findUniqueOrThrow({
    where: {
      id: payload.shopId,
    },
  });

  const result = await prisma.product.create({
    data: payload,
  });

  return result;
};

const updateProduct = async (id: string, payload: any) => {
  await prisma.product.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
      status: "PUBLISHED",
    },
  });

  const result = await prisma.product.update({
    where: {
      id,
    },
    data: payload,
  });

  return result;
};

const deleteProduct = async (id: string) => {
  const result = await prisma.product.update({
    where: {
      id,
      isDeleted: false,
      status: "PUBLISHED",
    },
    data: {
      isDeleted: true,
    },
  });

  return result;
};

export const ProductServices = {
  getAllProduct,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
