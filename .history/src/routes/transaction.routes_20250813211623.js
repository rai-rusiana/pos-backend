// routes/transaction.routes.js
import { Router } from 'express';
import * as transactionController from '../controllers/transaction.controller.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.middleware.js';

const router = Router();

// Route to create a new transaction.
// This route is typically accessed by a POS device and requires authentication.
// Only accessible to ADMIN, MANAGER, and CASHIER roles.
// Example: POST /api/transactions
router.post('/', authenticateToken, authorizeRole(['ADMIN', 'MANAGER', 'CASHIER']), transactionController.createTransaction);

export default router;
