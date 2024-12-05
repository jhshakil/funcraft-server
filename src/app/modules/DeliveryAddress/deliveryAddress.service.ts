import { prisma } from "../../../shared/prisma";

const createDeliveryAddress = async (payload: {
  customerId: string;
  address: string;
}) => {
  const result = await prisma.deliveryAddress.create({
    data: payload,
  });

  return result;
};

const updateDeliveryAddress = async (
  id: string,
  payload: { address: string }
) => {
  await prisma.deliveryAddress.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const result = await prisma.deliveryAddress.update({
    where: {
      id,
    },
    data: {
      address: payload.address,
    },
  });

  return result;
};

export const DeliveryAddressServices = {
  createDeliveryAddress,
  updateDeliveryAddress,
};