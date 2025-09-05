import { PrismaClient } from "../../generated/prisma/index.js";

const prisma = new PrismaClient();

/**
 * @description Creates a new inventory record for a given store.
 * This is typically a one-to-one relationship.
 * @param {number} storeId - The ID of the store to create an inventory for.
 * @returns {Promise<object>} The newly created inventory record.
 */
export const createInventory = async (inventoryData, storeId) => {
  // Use a temporary variable to hold the name
  let inventoryName = inventoryData.name;

  // If no name is provided, we fetch the store's name to generate one
  if (!inventoryName) {
    // We need to get the store's name to use it in our inventory name
    const store = await prisma.store.findUnique({
      where: { id: storeId }, // Corrected: use storeId from the function parameter
      select: {
        name: true,
      },
    });

    if (store && store.name) {
      // Check if the store's name already ends with "inventory" (case-insensitive)
      if (store.name.toLowerCase().endsWith(' inventory')) {
        inventoryName = store.name;
      } else {
        inventoryName = `${store.name} Inventory`;
      }
    } else {
      // Fallback name if the store is not found or has no name
      inventoryName = 'Default Inventory';
    }
  }
  const newInventory = await prisma.inventory.create({
    data: {
      name,
      store: {
        connect: {
          id: storeId,
        },
      },
    },
  });

  return newInventory;
};
/**
 * @description Retrieves a single inventory record by its storeId.
 * @param {number} storeId - The ID of the store.
 * @returns {Promise<object>} The inventory record.
 */
export const getInvetoryByStoreId = async (storeId) => {
  const storeInventory = await prisma.inventory.findUnique({
    where: { storeId: storeId },
    include: {
      store: true,
    },
  });
  return storeInventory;
};

/**
 * @description Updates an existing inventory record.
 * @param {number} id - The ID of the inventory record to update.
 * @param {object} inventoryData - The data to update.
 * @returns {Promise<object>} The updated inventory record.
 */
export const updateInventory = async (id, inventoryData) => {
  const updatedInventory = await prisma.inventory.update({
    where: { id },
    data: inventoryData,
  });
  return updatedInventory;
};

/**
 * @description Deletes an inventory record and all of its associated inventory items.
 * Uses a transaction to ensure atomicity.
 * @param {number} id - The ID of the inventory record to delete.
 * @returns {Promise<void>}
 */
export const deleteInventory = async (id) => {
  await prisma.$transaction(async (tx) => {
    // Delete all inventory items associated with the inventory first.
    await tx.inventoryItems.deleteMany({
      where: {
        inventoryId: id,
      },
    });

    // Then, delete the inventory record itself.
    await tx.inventory.delete({
      where: {
        id: id,
      },
    });
  });
};

/**
 * @description Creates a new inventory item and its associated location in a single
 * atomic operation using a nested write.
 * @param {object} itemData - The item's data (name, quantity).
 * @param {object} locationData - The location's data (aisle, rack, shelf).
 * @param {number} inventoryId - The ID of the inventory this item belongs to.
 * @returns {Promise<object>} The newly created inventory item with its location.
 */
export const createInventoryItem = async (
  itemData,
  locationData,
  inventoryId
) => {
  const newInventoryItem = await prisma.inventoryItems.create({
    data: {
      ...itemData,
      inventory: {
        connect: {
          id: inventoryId,
        },
      },
      // Nested write to create the Location at the same time.
      location: {
        create: locationData,
      },
    },
    include: {
      location: true, // Include the new location in the response
    },
  });

  return newInventoryItem;
};

/**
 * @description Retrieves all inventory items on a specific rack for a given inventory.
 * @param {number} inventoryId - The ID of the inventory to search.
 * @param {string} rackName - The name of the rack to filter by.
 * @returns {Promise<object[]>} An array of inventory items.
 */
export const getInventoryItemsByRack = async (inventoryId, rackName) => {
  const items = await prisma.inventoryItems.findMany({
    where: {
      inventoryId: inventoryId,
      // Filter by the rack field inside the nested location object.
      location: {
        rack: rackName,
      },
    },
    include: {
      location: true,
    },
  });

  return items;
};

