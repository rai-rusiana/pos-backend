import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * @description
 * Processes a new transaction by creating a transaction record, creating
 * associated cart items, and deducting the sold items from the inventory.
 * All operations are wrapped in a single Prisma transaction for atomicity.
 *
 * @param {object} transactionData - The transaction details (storeId, cashierId, total, etc.).
 * @param {array} itemsSold - An array of items sold, each with itemId and quantity.
 * @returns {Promise<object>} The newly created transaction record.
 */
export const processTransaction = async (transactionData, itemsSold) => {
  // Use a transaction to ensure all database operations succeed or fail together.
  return prisma.$transaction(async (tx) => {
    // 1. Deduct items from the inventory.
    // We'll iterate through each item and decrement the quantity.
    for (const item of itemsSold) {
      // Find the specific InventoryItems record for this item and store.
      const inventoryItem = await tx.inventoryItems.findUnique({
        where: {
          inventoryId_itemId: {
            inventoryId: transactionData.inventoryId,
            itemId: item.itemId,
          },
        },
      });

      if (!inventoryItem || inventoryItem.quantity < item.quantity) {
        throw new Error(`Insufficient stock for item ID: ${item.itemId}`);
      }

      // Decrement the quantity.
      await tx.inventoryItems.update({
        where: {
          id: inventoryItem.id,
        },
        data: {
          quantity: {
            decrement: item.quantity,
          },
        },
      });
    }

    // 2. Create the transaction record.
    const newTransaction = await tx.transaction.create({
      data: {
        ...transactionData,
        // Create the CartItem records and link them to the transaction.
        items: {
          createMany: {
            data: itemsSold.map((item) => ({
              itemId: item.itemId,
              quantity: item.quantity,
            })),
          },
        },
      },
      include: {
        items: true, // Include the CartItems in the response
      },
    });

    return newTransaction;
  });
};
/**
 * @description
 * Retrieves a list of all transactions for a specific store.
 * @param {number} storeId - The ID of the store.
 * @param {string} [startDate] - Optional start date for filtering (ISO 8601 string).
 * @param {string} [endDate] - Optional end date for filtering (ISO 8601 string).
 * @returns {Promise<object[]>} An array of transaction records.
 */
export const getTransactionsByStoreId = async (storeId, startDate, endDate) => {
  // Build the `where` clause dynamically based on the provided parameters.
  const where = {
    storeId: storeId,
  };

  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) {
      where.createdAt.gte = new Date(startDate);
    }
    if (endDate) {
      where.createdAt.lte = new Date(endDate);
    }
  }

  const transactions = await prisma.transaction.findMany({
    where,
    include: {
      store: true,
      cashier: true,
      items: {
        include: {
          item: true, // Include item details in the cart items
        },
      },
    },
    orderBy: {
      createdAt: 'desc', // Order by most recent transactions
    },
  });

  return transactions;
};
