import { OrderStatus, Prisma } from "@prisma/client";
import { calculatePagination } from "../../../helpers/paginationHelper";
import { prisma } from "../../../shared/prisma";
import { TPaginationOptions } from "../../interfaces/pagination";
import { productSearchableFields } from "../Product/product.constant";

const getAllOrder = async (params: any, options: TPaginationOptions) => {
  const { searchTerm, ...filterData } = params;
  const { limit, page, skip, sortBy, sortOrder } = calculatePagination(options);
  const andConditions: Prisma.OrderWhereInput[] = [];

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

  const whereConditions: Prisma.OrderWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.order.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      orderProduct: true,
      shop: true,
      customer: true,
    },
  });

  const total = await prisma.order.count({
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

const getAllOrderByShop = async (
  params: any,
  options: TPaginationOptions,
  shopId: string
) => {
  const { searchTerm, ...filterData } = params;
  const { limit, page, skip, sortBy, sortOrder } = calculatePagination(options);
  const andConditions: Prisma.OrderWhereInput[] = [];

  console.log(shopId);

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

  const whereConditions: Prisma.OrderWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.order.findMany({
    where: {
      ...whereConditions,
      shopId,
    },
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      orderProduct: true,
      shop: true,
      customer: true,
    },
  });

  const total = await prisma.order.count({
    where: {
      ...whereConditions,
      shopId,
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

const getAllOrderByCustomer = async (
  params: any,
  options: TPaginationOptions,
  customerId: string
) => {
  const { searchTerm, ...filterData } = params;
  const { limit, page, skip, sortBy, sortOrder } = calculatePagination(options);
  const andConditions: Prisma.OrderWhereInput[] = [];

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

  const whereConditions: Prisma.OrderWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.order.findMany({
    where: {
      ...whereConditions,
      customerId,
      orderStatus: {
        notIn: [OrderStatus.CANCEL, OrderStatus.BLOCKED],
      },
    },
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      orderProduct: {
        include: {
          product: true,
        },
      },
      deliveryAddress: true,
      shop: true,
      customer: true,
    },
  });

  const total = await prisma.order.count({
    where: {
      ...whereConditions,
      customerId,
      orderStatus: {
        notIn: [OrderStatus.CANCEL, OrderStatus.BLOCKED],
      },
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

const createOrder = async (payload: any) => {
  const result = await prisma.$transaction(async (TC) => {
    const orderData = await TC.order.create({
      data: {
        customerId: payload.customerId,
        deliveryAddressId: payload.deliveryAddressId,
        shopId: payload.shopId,
        totalPrice: payload.totalPrice,
      },
    });

    for (const product of payload.products) {
      const productRecord = await TC.product.findUniqueOrThrow({
        where: { id: product.productId },
      });

      if (product.quantity > productRecord.inventoryCount) {
        throw new Error(
          `Insufficient stock for product: ${productRecord.name}. Requested: ${product.quantity}, Available: ${productRecord.inventoryCount}`
        );
      }

      await TC.product.update({
        where: { id: product.productId },
        data: {
          inventoryCount: productRecord.inventoryCount - product.quantity,
        },
      });
    }

    await TC.orderProduct.createMany({
      data: payload.products.map(
        (product: { productId: string; quantity: number }) => ({
          productId: product.productId,
          orderId: orderData.id,
          quantity: product.quantity,
        })
      ),
    });

    return orderData;
  });

  return result;
};

const updateOrder = async (id: string, payload: any) => {
  await prisma.order.findUniqueOrThrow({
    where: {
      id,
      orderStatus: {
        not: "DELIVERED",
      },
    },
  });

  const result = await prisma.order.update({
    where: {
      id,
    },
    data: payload,
  });

  return result;
};

const CancelOrder = async (id: string) => {
  await prisma.order.findUniqueOrThrow({
    where: {
      id,
      orderStatus: {
        not: "DELIVERED",
      },
    },
  });

  const result = await prisma.$transaction(async (TC) => {
    const orderData = await TC.order.update({
      where: {
        id,
      },
      data: {
        // orderStatus: "PENDING",
        orderStatus: "CANCEL",
      },
      include: {
        orderProduct: true,
      },
    });

    for (const product of orderData.orderProduct) {
      const productRecord = await TC.product.findUniqueOrThrow({
        where: { id: product.productId },
      });

      await TC.product.update({
        where: { id: product.productId },
        data: {
          inventoryCount: productRecord.inventoryCount + product.quantity,
        },
      });
    }

    return orderData;
  });

  return result;
};

export const OrderServices = {
  getAllOrder,
  getAllOrderByShop,
  getAllOrderByCustomer,
  createOrder,
  updateOrder,
  CancelOrder,
};
