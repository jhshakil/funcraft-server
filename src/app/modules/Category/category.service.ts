import { Prisma } from "@prisma/client";
import { calculatePagination } from "../../../helpers/paginationHelper";
import { prisma } from "../../../shared/prisma";
import { TPaginationOptions } from "../../interfaces/pagination";
import { productSearchableFields } from "../Product/product.constant";

const getAllCategory = async (params: any, options: TPaginationOptions) => {
  const { searchTerm } = params;
  const { limit, page, skip, sortBy, sortOrder } = calculatePagination(options);
  const andConditions: Prisma.CategoryWhereInput[] = [];

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

  const whereConditions: Prisma.CategoryWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.category.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.category.count({
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

const getCategoryById = async (id: string) => {
  const result = await prisma.category.findUniqueOrThrow({
    where: { id },
  });

  return result;
};

const createCategory = async (payload: {
  name: string;
  description: string;
}) => {
  const result = await prisma.category.create({
    data: payload,
  });

  return result;
};

const updateCategory = async (
  id: string,
  payload: {
    name: string;
    description: string;
  }
) => {
  await prisma.category.findUniqueOrThrow({
    where: { id },
  });

  const result = await prisma.category.update({
    where: {
      id,
    },
    data: payload,
  });

  return result;
};

const deleteCategory = async (id: string) => {
  await prisma.category.findUniqueOrThrow({
    where: { id },
  });

  const result = await prisma.category.delete({
    where: {
      id,
    },
  });

  return result;
};

export const CategoryServices = {
  getAllCategory,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
