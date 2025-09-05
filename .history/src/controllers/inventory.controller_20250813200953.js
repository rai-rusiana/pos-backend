import * as inventoryService from "../services/inventory.service.js";

export const createInventory = async (req, res) => {
  const { name } = res.body;
  const storeId = req.params;

  if (!storeId) {
    return res.status(400).json({
      error: "Missing storeId",
    });
  }
  try {
    const newInventory = await inventoryService.createInventory(
      { name },
      parseInt(storeId)
    );
    res.status(201).json({
      newInventory,
    });
  } catch (error) {
    console.error("Error creating Inventory:", error);
    res.status(500).json({
      error: "Internal server error has occured.",
    });
  }
};

export const getInventoryByStoreId = async (req, res) => {
  const storeId = req.params;
  try {
    const inventory = await inventoryService.getInvetoryByStoreId(
      parseInt(storeId)
    );
    if (!inventory) {
      return res.status(404).json({
        error: "Inventory not found",
      });
    }
    res.status(200).json({
      inventory,
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        error: "Store not found.",
      });
    }
    console.error("Error getting Store:", error);
    res.status(500).json({
      error: "An internal server has occured.",
    });
  }
};

export const updateInventory = async (req, res) => {
  const id = req.params;
  const { ...invnetorydata } = req.body;

  try {
    const updatedInventory = await inventoryService.updateInventory(
      {
        ...invnetorydata,
      },
      parseInt(id)
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

export const deleteInventory = async (req, res) => {
  const id = req.params;

  try {
    const inventroy = await inventoryService.deleteInventory(parseInt(id));
    if (!inventroy) {
      return res.status(404).json({
        error: "Inventory to delete not found",
      });
    }
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting Store", error);
    res.status(500).json({
      error: "An internal server error has occured",
    });
  }
};


export const createInventoryItem = async (req, res) => {
     const { ...itemData, ...locationData } = req.body
     
}