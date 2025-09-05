import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Your existing service functions...

/**
 * Inserts multiple new items into the database in a single, efficient query.
 * @param {Array<object>} data - An array of item objects to create.
 * @returns {Promise<object>} An object containing the count of created items.
 */
export const bulkCreateItems = async (data) => {
  try {
    const result = await prisma.item.createMany({
      data: data,
      // The `skipDuplicates: true` option is important here.
      // It will prevent the operation from failing if an item with a
      // unique field (like `name`) already exists in the database.
      skipDuplicates: true,
    });
    console.log(`Successfully created ${result.count} items.`);
    return result;
  } catch (error) {
    console.error("Error with bulk item creation:", error);
    throw new Error("Failed to create all items.");
  }
};
/**
 * @description
 * Creates or updates multiple items, their associated InventoryItems, and Locations
 * in a single atomic transaction.
 *
 * @param {array} items - An array of item objects, each with itemData, locationData, inventoryId, and quantity.
 * @returns {Promise<object[]>} An array of the created/updated InventoryItems records.
 */
export const createOrUpdateMultipleInventoryItems = async (items) => {
  // Use a transaction to ensure all or none of the items are created/updated.
  return prisma.$transaction(async (tx) => {
    const operations = items.map(
      async ({ itemData, locationData, inventoryId, quantity }) => {
        // 1. Create or find the Item for each entry.
        const item = await tx.item.upsert({
          where: { name: itemData.name },
          update: { ...itemData },
          create: { ...itemData },
        });

        // 2. Create or update the InventoryItems record.
        return tx.inventoryItems.upsert({
          where: {
            inventoryId_itemId: {
              inventoryId: inventoryId,
              itemId: item.id,
            },
          },
          update: {
            quantity: {
              increment: quantity,
            },
            location: {
              update: { ...locationData },
            },
          },
          create: {
            inventory: { connect: { id: inventoryId } },
            item: { connect: { id: item.id } },
            quantity: quantity,
            location: { create: locationData },
          },
          include: {
            item: true,
            location: true,
          },
        });
      }
    );

    return Promise.all(operations);
  });
};
