// controllers/item.controller.js
import * as itemService from '../services/item.service.js';

/**
 * @description
 * Creates or updates multiple inventory items for a store in a single bulk operation.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const bulkCreateInventoryItems = async (req, res) => {
  const items = req.body;


  if (!inventoryId || !items || !Array.isArray(items)) {
    return res.status(400).json({ error: 'Invalid request body. Expected inventoryId and an array of items.' });
  }
  console.log(items)

  try {
    const createdItems = await itemService.bulkCreateInventoryItems(items);
    return res.status(201).json(createdItems);
  } catch (error) {
    console.error('Error in bulkCreateInventoryItems:', error);
    return res.status(500).json({ error: 'An internal server error occurred.' });
  }
};

/**
 * @description
 * Retrieves all inventory items for a given store, organized by rack.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const getInventoryItemsByRack = async (req, res) => {
  const { id: storeId } = req.params;

  if (!storeId) {
    return res.status(400).json({ error: 'Missing store ID in request parameters.' });
  }

  try {
    const itemsByRack = await itemService.getInventoryItemsByRack(parseInt(storeId));
    if (!itemsByRack) {
      return res.status(404).json({ error: 'No inventory items found for this store.' });
    }
    return res.status(200).json(itemsByRack);
  } catch (error) {
    console.error('Error retrieving items by rack:', error);
    return res.status(500).json({ error: 'An internal server error occurred.' });
  }
};
