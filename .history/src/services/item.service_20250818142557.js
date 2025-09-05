import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Your existing service functions...

/**
 * Creates a new item or updates an existing one in the database.
 * This function handles the creation of the product record itself, independent of inventory.
 *
 * @param {object} itemData - The data for the item to be created or updated.
 * @returns {Promise<object>} The created or updated item record.
 */
 export const createOrUpdateItem = async (itemData) => {
  try {
    // We use `upsert` to either find an existing item by its unique name
    // and update its details, or create a new item if it doesn't exist.
    // The `name` field is used as the unique identifier for this upsert.
    const item = await prisma.item.upsert({
      where: {
        name: itemData.name
      },
      update: {
        // This spreads all properties from itemData to update the existing record.
        ...itemData
      },
      create: {
        // This spreads all properties from itemData to create a new record.
        ...itemData
      },
    });

    // Return the full item record after it has been created or updated.
    return item;
  } catch (error) {
    // Log the error for debugging purposes.
    console.error("Error creating or updating item:", error);
    // Rethrow the error to be handled by the calling function.
    throw new Error("Failed to create or update the item.");
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
