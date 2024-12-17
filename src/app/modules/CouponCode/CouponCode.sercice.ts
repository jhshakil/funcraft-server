import { prisma } from "../../../shared/prisma";
import { TAuthUser } from "../../interfaces/common";
import { generateAlphanumericCode } from "./CuponCode.utnis";

const getAllCoupon = async (user: TAuthUser) => {
  const userData = await prisma.vendor.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });

  const result = await prisma.couponCode.findMany({
    where: {
      vendorId: userData.id,
    },
  });

  return result;
};

const getCouponByCode = async (payload: { code: string }) => {
  const result = await prisma.couponCode.findUniqueOrThrow({
    where: {
      code: payload.code,
    },
  });

  return result;
};
const createCoupon = async (payload: { discount: string }, user: TAuthUser) => {
  const userData = await prisma.vendor.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });

  const data = {
    code: generateAlphanumericCode(),
    discount: payload.discount,
    vendorId: userData?.id as string,
  };
  const result = await prisma.couponCode.create({
    data,
  });

  return result;
};

const deleteCoupon = async (id: string) => {
  await prisma.couponCode.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const result = await prisma.couponCode.delete({
    where: {
      id,
    },
  });

  return result;
};

export const CouponCodeServices = {
  getAllCoupon,
  getCouponByCode,
  createCoupon,
  deleteCoupon,
};
