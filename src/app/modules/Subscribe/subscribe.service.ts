import { prisma } from "../../../shared/prisma";

const createSubscribe = async (payload: { email: string }) => {
  const existingSubscription = await prisma.subscribe.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (existingSubscription) {
    return "";
  }

  await prisma.subscribe.create({
    data: payload,
  });

  return "";
};

export const SubscribeServices = {
  createSubscribe,
};
