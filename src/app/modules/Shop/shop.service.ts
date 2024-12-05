import { Request } from "express";
import { TFile } from "../../interfaces/file";
import { uploadToCloudinary } from "../../../helpers/fileUploader";
import { prisma } from "../../../shared/prisma";
import { Prisma, Shop, ShopStatus } from "@prisma/client";
import { TPaginationOptions } from "../../interfaces/pagination";
import { calculatePagination } from "../../../helpers/paginationHelper";
import { shopSearchableFields } from "./shop.constant";

const getAllShop = async (params: any, options: TPaginationOptions) => {
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

const getShopById = async (id: string) => {
  const result = await prisma.shop.findUniqueOrThrow({
    where: {
      id,
      status: "ACTIVE",
    },
  });

  return result;
};

const createShop = async (req: Request): Promise<Shop> => {
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

const updateShop = async (id: string, req: Request) => {
  await prisma.shop.findUniqueOrThrow({
    where: {
      id,
      status: "ACTIVE",
    },
  });

  const file = req.file as TFile;

  if (file) {
    const upload = await uploadToCloudinary(file);
    req.body.logo = upload?.secure_url;
  }

  const result = await prisma.shop.update({
    where: {
      id,
    },
    data: req.body,
  });

  return result;
};

const deleteShop = async (id: string) => {
  await prisma.shop.findUniqueOrThrow({
    where: {
      id,
      status: "ACTIVE",
    },
  });

  const result = await prisma.shop.delete({
    where: {
      id,
    },
  });

  return result;
};

const updateStatus = async (id: string, payload: { status: ShopStatus }) => {
  await prisma.shop.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const result = await prisma.shop.update({
    where: {
      id,
    },
    data: {
      status: payload.status,
    },
  });

  return result;
};
const updateBanner = async (id: string, req: Request) => {
  await prisma.shop.findUniqueOrThrow({
    where: {
      id,
      status: "ACTIVE",
    },
  });

  const file = req.file as TFile;

  if (file) {
    const upload = await uploadToCloudinary(file);
    req.body.banner = upload?.secure_url;
  }

  const result = await prisma.shop.update({
    where: {
      id,
    },
    data: {
      banner: req.body.banner,
    },
  });

  return result;
};

export const ShopServices = {
  getAllShop,
  getShopById,
  createShop,
  updateShop,
  deleteShop,
  updateStatus,
  updateBanner,
};
