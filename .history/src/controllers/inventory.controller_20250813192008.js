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
  } catch (error) {}
};
