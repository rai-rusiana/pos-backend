// routes/item.routes.js
import { Router } from 'express';
import * as itemController from '../controllers/item.controller.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.middleware.js';

const router = Router();

// Route to create or update multiple inventory items at once.
// This is a new route for the bulk processing service function.
// Example: POST /api/inventories/items/bulk
router.post('/items/bulk/', 
     authenticateToken,
     authorizeRole(['ADMIN', 'MANAGER']),
     itemController.bulkCreateInventoryItems);

// Route to get all inventory items for a given rack.
// Accessible to all authenticated users with the appropriate roles.
// Example: GET /api/inventories/1/items/by-rack
router.get('/:id/items/by-rack', authenticateToken, authorizeRole(['ADMIN', 'MANAGER', 'CASHIER']), itemController.getInventoryItemsByRack);

export default router;
