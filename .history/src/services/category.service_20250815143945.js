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
  const categoryFound = await prisma.category.findUnique({
    where: { id },
    select: {
     name: true
    }
  });
  return categoryFound
};

export const getItemsByCategory = async (id) => {
     const categoryItems = await prisma.category.findMany({
          where: { id },
          select: {
               items: true
          }
     })
}