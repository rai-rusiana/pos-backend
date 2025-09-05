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

// Route to get a list of transactions for a specific store.
// This route now supports optional query parameters for date filtering.
// Only accessible to ADMIN, MANAGER, and CASHIER roles.
// Example: GET /api/transactions/store/123
// Example with date filtering: GET /api/transactions/store/123?startDate=2024-01-01T00:00:00Z&endDate=2024-01-31T23:59:59Z
router.get('/store/:id', authenticateToken, authorizeRole(['ADMIN', 'MANAGER', 'CASHIER']), transactionController.getTransactionsByStoreId);

export default router;
