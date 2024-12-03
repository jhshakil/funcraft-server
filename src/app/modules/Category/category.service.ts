import { prisma } from "../../../shared/prisma";

const getAllCategory = async () => {
  const result = await prisma.category.findMany();

  return result;
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
