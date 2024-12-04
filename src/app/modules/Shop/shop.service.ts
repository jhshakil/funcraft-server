import { Request } from "express";
import { TFile } from "../../interfaces/file";
import { uploadToCloudinary } from "../../../helpers/fileUploader";
import { prisma } from "../../../shared/prisma";
import { Prisma, Shop } from "@prisma/client";
import { TPaginationOptions } from "../../interfaces/pagination";
import { calculatePagination } from "../../../helpers/paginationHelper";
import { shopSearchableFields } from "./shop.constant";

export const getAllShop = async (params: any, options: TPaginationOptions) => {
  const { limit, page, skip, sortBy, sortOrder } = calculatePagination(options);
  const andConditions: Prisma.ShopWhereInput[] = [];

  if (params.searchTerm) {
    andConditions.push({
      OR: shopSearchableFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  const whereConditions: Prisma.ShopWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.shop.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      vendor: true,
    },
  });

  const total = await prisma.shop.count({
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

export const getShopById = async (id: string) => {
  const result = await prisma.shop.findUniqueOrThrow({
    where: {
      id,
    },
  });

  return result;
};

export const createShop = async (req: Request): Promise<Shop> => {
  await prisma.vendor.findUniqueOrThrow({
    where: {
      id: req.body.vendorId,
    },
  });
  const file = req.file as TFile;

  if (file) {
    const upload = await uploadToCloudinary(file);
    req.body.logo = upload?.secure_url;
  }

  const result = await prisma.shop.create({
    data: req.body,
  });

  return result;
};

export const ShopServices = {
  getAllShop,
  getShopById,
  createShop,
};
