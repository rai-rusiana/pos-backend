// controllers/inventory.controller.js
import * as inventoryService from '../services/inventory.service.js';

/**
 * @description
 * Creates or updates a single inventory item and its location.
 */
export const createInventoryItem = async (req, res) => {
  const { id } = req.params;
  const { itemData, locationData, quantity } = req.body;

  if (!itemData || !locationData || !quantity) {
    return res.status(400).json({ error: "Missing required fields: itemData, locationData, or quantity." });
  }

  try {
    const newInventoryItem = await inventoryService.createOrUpdateInventoryItemAndLocation(
      itemData,
      locationData,
      parseInt(id),
      quantity
    );
    return res.status(201).json(newInventoryItem);
  } catch (error) {
    console.error("Error creating inventory item:", error);
    return res.status(500).json({ error: "An internal server error occurred." });
  }
};

/**
 * @description
 * Creates or updates multiple inventory items and their locations in a single request.
 */
export const bulkCreateInventoryItems = async (req, res) => {
  const { items } = req.body;

  // Basic validation to ensure a non-empty array of items is provided
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Expected a non-empty array of items in the request body." });
  }
  
  // You might want to add more detailed validation for each item object here.
  // For example, checking for required properties like itemData, locationData, etc.

  try {
    const createdItems = await inventoryService.createOrUpdateMultipleInventoryItems(items);
    return res.status(201).json(createdItems);
  } catch (error) {
    console.error("Error creating multiple inventory items:", error);
    return res.status(500).json({ error: "An internal server error occurred." });
  }
};

// ... other controller functions would go here ...
