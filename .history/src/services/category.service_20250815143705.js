import { PrismaClient } from "../../generated/prisma/index.js";

const prisma = new PrismaClient();

export const createCategory = async (categoryData) => {
  const newCategory = await prisma.category.create({
    data: {
      ...categoryData,
    },
  });

  return newCategory;
};

export const getCategoryById = async (id) => {
  const categoryFound = await prisma.user.findUnique({
    where: { id },
    select: {
     name: true
    }
  });
};
