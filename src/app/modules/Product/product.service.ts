import { Request } from "express";
import { prisma } from "../../../shared/prisma";
import { TFile } from "../../interfaces/file";
import { uploadToCloudinary } from "../../../helpers/fileUploader";
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
  });

  return result;
};

const createProduct = async (req: Request): Promise<Product> => {
  await prisma.category.findUniqueOrThrow({
    where: {
      id: req.body.categoryId,
    },
  });
  await prisma.shop.findUniqueOrThrow({
    where: {
      id: req.body.shopId,
    },
  });
  const file = req.file as TFile;

  if (file) {
    const upload = await uploadToCloudinary(file);
    req.body.thumbnailImage = upload?.secure_url;
  }

  const result = await prisma.product.create({
    data: req.body,
  });

  return result;
};

const updateProduct = async (id: string, req: Request) => {
  await prisma.product.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
      status: "PUBLISHED",
    },
  });

  const file = req.file as TFile;

  if (file) {
    const upload = await uploadToCloudinary(file);
    req.body.thumbnailImage = upload?.secure_url;
  }

  const result = await prisma.product.update({
    where: {
      id,
    },
    data: req.body,
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
