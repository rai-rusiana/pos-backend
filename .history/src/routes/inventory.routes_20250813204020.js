import { Router } from 'express';
import * as inventoryController from '../controllers/inventory.controller.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.middleware.js';

const router = Router();

// Route to create a new inventory for a specific store.
// Only accessible to ADMIN and MANAGER roles.
// Example: POST /api/inventories/1
router.post('/:id', authenticateToken, authorizeRole(['ADMIN', 'MANAGER']), inventoryController.createInventory);

// Route to get a single inventory for a specific store.
// Accessible to all authenticated users.
// Example: GET /api/inventories/1
router.get('/:id', authenticateToken, inventoryController.getInventoryByStoreId);

// Route to update an inventory.
// Only accessible to ADMIN and MANAGER roles.
// Example: PUT /api/inventories/1
router.put('/:id', authenticateToken, authorizeRole(['ADMIN', 'MANAGER']), inventoryController.updateInventory);

// Route to delete an inventory.
// Only accessible to ADMIN and MANAGER roles.
// Example: DELETE /api/inventories/1
router.delete('/:id', authenticateToken, authorizeRole(['ADMIN', 'MANAGER']), inventoryController.deleteInventory);

// Route to create a new inventory item for an inventory.
// Only accessible to ADMIN and MANAGER roles.
// Example: POST /api/inventories/1/items
router.post('/:id/items', authenticateToken, authorizeRole(['ADMIN', 'MANAGER']), inventoryController.createInventoryItem);

// Route to get all inventory items for a given rack.
// Accessible to all authenticated users.
// Example: GET /api/inventories/1/items/by-rack
router.get('/:id/items/by-rack', authenticateToken, inventoryController.getInventoryItemsByRack);

export default router;