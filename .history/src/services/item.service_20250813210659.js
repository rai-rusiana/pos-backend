// services/inventory.service.js
import { PrismaClient } from "../../generated/prisma/index.js";

const prisma = new PrismaClient();

// Your existing service functions...

/**
 * @description
 * Creates or updates an Item, and creates or updates its associated InventoryItems
 * and Location in a single atomic transaction.
 *
 * This function uses an "upsert" pattern to prevent creating duplicate Items.
 * It also handles updating the quantity if the item already exists in the inventory.
 *
 * @param {object} itemData - The Item's data (name, price, categoryId, etc.).
 * @param {object} locationData - The Location's data (aisle, rack, shelf).
 * @param {number} inventoryId - The ID of the Inventory this item belongs to.
 * @param {number} quantity - The quantity of the item to add.
 * @returns {Promise<object>} The created/updated InventoryItems record with nested Item and Location.
 */
export const createOrUpdateInventoryItemAndLocation = async (itemData, locationData, inventoryId, quantity) => {
  return prisma.$transaction(async (tx) => {
    // 1. Create or find the Item.
    // We use a unique field (like a name or SKU) to upsert.
    // For this example, we'll use the 'name' field from itemData.
    // You may need to adjust this depending on your unique constraints.
    const item = await tx.item.upsert({
      where: { name: itemData.name },
      update: { ...itemData }, // Update existing item details
      create: { ...itemData }, // Create a new item
    });

    // 2. Create or update the InventoryItems record and its Location.
    // We use the unique constraint [inventoryId, itemId] to handle this.
    const inventoryItem = await tx.inventoryItems.upsert({
      where: {
        inventoryId_itemId: {
          inventoryId: inventoryId,
          itemId: item.id
        }
      },
      update: {
        quantity: {
          increment: quantity // Increment the quantity of the existing item
        },
        // We can also update the location if needed
        location: {
          update: { ...locationData }
        }
      },
      create: {
        inventory: {
          connect: { id: inventoryId }
        },
        item: {
          connect: { id: item.id }
        },
        quantity: quantity,
        location: {
          create: locationData // Create a new location for a new inventory item
        }
      },
      include: {
        item: true,
        location: true
      }
    });

    return inventoryItem;
  });
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
    const operations = items.map(async ({ itemData, locationData, inventoryId, quantity }) => {
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
            itemId: item.id
          }
        },
        update: {
          quantity: {
            increment: quantity
          },
          location: {
            update: { ...locationData }
          }
        },
        create: {
          inventory: { connect: { id: inventoryId } },
          item: { connect: { id: item.id } },
          quantity: quantity,
          location: { create: locationData }
        },
        include: {
          item: true,
          location: true
        }
      });
    });

    return Promise.all(operations);
  });
};
