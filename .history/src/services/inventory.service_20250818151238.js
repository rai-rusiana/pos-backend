import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * @description Creates a new inventory record for a given store.
 * This is typically a one-to-one relationship.
 * @param {number} storeId - The ID of the store to create an inventory for.
 * @returns {Promise<object>} The newly created inventory record.
 */
export const createInventory = async (name, storeId) => {
  // Step 1: Check if an inventory already exists for this store
  const existingInventory = await prisma.inventory.findUnique({
    where: {
      storeId: storeId,
    },
  });

  // If an inventory already exists, return it immediately to prevent the error
  if (existingInventory) {
    console.log(`Inventory already exists for storeId ${storeId}, returning existing record.`);
    return existingInventory;
  }

  // Step 2: If no inventory exists, proceed with the creation logic
  let inventoryName = name;

  // If no name is provided, fetch the store's name to generate one
  if (!inventoryName) {
    const store = await prisma.store.findUnique({
      where: { id: storeId },
      select: {
        name: true,
      },
    });

    if (store && store.name) {
      // Check if the store's name already contains "inventory" (case-insensitive)
      if (store.name.toLowerCase().includes(' inventory')) {
        inventoryName = store.name;
      } else {
        inventoryName = `${store.name} Inventory`;
      }
    } else {
      // Fallback name if the store is not found or has no name
      inventoryName = 'Default Inventory';
    }
  }

  // Step 3: Create the new inventory with the determined name and storeId
  const newInventory = await prisma.inventory.create({
    data: {
      name: inventoryName, // Use the determined inventoryName variable
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
export const updateInventory = async (id, name) => {
  const updatedInventory = await prisma.inventory.update({
    where: { id },
    data: name,
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
 * Bulk creates multiple inventory items for a given inventory.
 * @param {Array<object>} itemsData - An array of item objects with itemId and quantity.
 * @param {number} inventoryId - The ID of the inventory to add the items to.
 * @returns {Promise<object>} An object containing the count of created items.
 */
export const createInventoryItem = async (
  itemsData,
  inventoryId
) => {
  // Map the input array to add the inventoryId to each object.
  // This is the key step to convert the nested data into the flat format
  // required by `createMany`.
  const itemsToCreate = itemsData.map(item => ({
    ...item,
    inventoryId: inventoryId, // Add the inventoryId to each item object
  }));

  const newInventoryItems = await prisma.inventoryItems.createMany({
    data: itemsToCreate,
   // skipDuplicates: true, // This is a good practice to prevent errors on unique constraints
  });

  return newInventoryItems;
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

