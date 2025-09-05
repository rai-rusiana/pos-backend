// routes/inventory.routes.js
import { Router } from 'express';
import * as inventoryController from '../controllers/inventory.controller.js';

const router = Router();

// Route to create a new inventory for a specific store.
// Example: POST /api/inventories/1
router.post('/:id', inventoryController.createInventory);

// Route to get a single inventory for a specific store.
// Example: GET /api/inventories/1
router.get('/:id', inventoryController.getInventoryByStoreId);

// Route to update an inventory.
// Example: PUT /api/inventories/1
router.put('/:id', inventoryController.updateInventory);

// Route to delete an inventory.
// Example: DELETE /api/inventories/1
router.delete('/:id', inventoryController.deleteInventory);

// Route to create a new inventory item for an inventory.
// Example: POST /api/inventories/1/items
router.post('/:id/items', inventoryController.createInventoryItem);

// Route to get all inventory items for a given rack.
// Example: GET /api/inventories/1/items/by-rack
router.get('/:id/items/by-rack', inventoryController.getInventoryItemsByRack);

export default router;