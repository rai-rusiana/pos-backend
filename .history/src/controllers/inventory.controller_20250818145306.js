import * as inventoryService from "../services/inventory.service.js";

/**
 * @description
 * Creates a new inventory record for a store.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const createInventory = async (req, res) => {
  const { id: storeId } = req.params; // Correct way to get id from params and rename it
  let { name } = req.body
  
  if (!storeId) {
    return res.status(400).json({
      error: "Missing storeId in request parameters.",
    });
  }
  if (!name === null) {
    name = ''
  }
  console.log('Store Id', storeId)
  try {
    const newInventory = await inventoryService.createInventory(
      name,
      parseInt(storeId)
    );
    res.status(201).json({ newInventory });
  } catch (error) {
    console.error("Error creating Inventory:", error);
    res.status(500).json({
      error: "Internal server error has occurred.",
    });
  }
};

/**
 * @description
 * Retrieves the inventory for a specific store.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const getInventoryByStoreId = async (req, res) => {
  const { id: storeId } = req.params; // Correctly get the storeId from params

  try {
    const inventory = await inventoryService.getInvetoryByStoreId(
      parseInt(storeId)
    );
    if (!inventory) {
      return res.status(404).json({
        error: "Inventory not found.",
      });
    }
    res.status(200).json({ inventory });
  } catch (error) {
    console.error("Error getting Inventory:", error);
    res.status(500).json({
      error: "An internal server error has occurred.",
    });
  }
};
/**
 * @description
 * Updates an existing inventory record.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const updateInventory = async (req, res) => {
  const id = req.params;
  const {name} = req.body; // Correctly get the entire body

  try {
    const updatedInventory = await inventoryService.updateInventory(
      parseInt(id),
      name
    );
    res.status(200).json({
      updatedInventory,
    });
  } catch (error) {
    console.error("Error updating inventory:", error);
    return res.status(500).json({
      error: "Internal server error has occured.",
    });
  }
};

/**
 * @description
 * Deletes an inventory record and all its associated items.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const deleteInventory = async (req, res) => {
  const { id } = req.params;

  try {
    // The service function now returns a promise that resolves on success or rejects on failure.
    // There is no value to check, so the `if(!inventory)` is not needed.
    await inventoryService.deleteInventory(parseInt(id));
    res.status(204).send();
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        error: "Inventory to delete not found.",
      });
    }
    console.error("Error deleting Inventory:", error);
    res.status(500).json({
      error: "An internal server error has occurred.",
    });
  }
};

/**
 * @description
 * Creates a new inventory item and its location for a specific inventory.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const createInventoryItem = async (req, res) => {
  const { id: inventoryId } = req.params; // Get the inventoryId from the URL
  let { itemData, locationData } = req.body; // Separate item and location data from the body
  if (!locationData) {
    locationData = null
  }
  if (!itemData || !inventoryId) {
    return res
      .status(400)
      .json({ error: "Missing required item, location, or inventory data." });
  }

  try {
    const newInventoryItem = await inventoryService.createInventoryItem(
      itemData,
      locationData,
      parseInt(inventoryId)
    );
    res.status(201).json(newInventoryItem);
  } catch (error) {
    console.error("Error creating inventory item:", error);
    res.status(500).json({ error: "An internal server error occurred." });
  }
};
/**
 * @description
 * Retrieves inventory items by rack from a specific inventory.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const getInventoryItemsByRack = async (req, res) => {
  const { id: inventoryId } = req.params; // Correctly destructure the ID from params
  const { rackName } = req.body;

  try {
    if (!inventoryId || !rackName) {
      return res.status(400).json({
        error: "Missing inventoryId or rackName in request.",
      });
    }
    const inventory = await inventoryService.getInventoryItemsByRack(
      parseInt(inventoryId),
      rackName
    );
    if (!inventory || inventory.length === 0) {
      return res.status(404).json({
        error: "Inventory items not found on this rack.",
      });
    }
    res.status(200).json({ inventory });
  } catch (error) {
    console.error("Error retrieving Inventory:", error);
    return res.status(500).json({
      error: "An internal server error has occurred.",
    });
  }
};
