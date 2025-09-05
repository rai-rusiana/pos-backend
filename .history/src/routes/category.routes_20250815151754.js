// routes/category.routes.js
// This file defines the API routes for handling category-related requests.
// It uses the Express Router to connect each route to a specific
// function in the category.controller.js file.

import express from "express";
import * as categoryController from "../controllers/category.controller.js";
import {
  authenticateToken,
  authorizeRole,
} from "../middleware/auth.middleware.js";

const router = express.Router();

// Route to create a new category
// POST /api/categories
router.post(
  "/",
  authenticateToken,
  authorizeRole(["ADMIN", "MANAGER"]),
  categoryController.createCategory
);

// Route to get all categories
// GET /api/categories
router.get(
  "/",
  authenticateToken,
  authorizeRole(["ADMIN", "MANAGER"]),
  categoryController.getAllCategories
);

// Route to get a single category by ID
// GET /api/categories/:id
router.get(
  "/:id",
  authenticateToken,
  authorizeRole(["ADMIN", "MANAGER"]),
  categoryController.getCategoryById
);

// Route to update a category by ID
// PUT /api/categories/:id
router.put(
  "/:id",
  authenticateToken,
  authorizeRole(["ADMIN", "MANAGER"]),
  categoryController.updateCategory
);

// Route to delete a category by ID
// DELETE /api/categories/:id
router.delete(
  "/:id",
  authenticateToken,
  authorizeRole(["ADMIN", "MANAGER"]),
  categoryController.deleteCategory
);

// New route to get all items belonging to a category
// GET /api/categories/:id/items
router.get(
  "/:id/items",
  authenticateToken,
  authorizeRole(["ADMIN", "MANAGER"]),
  categoryController.getItemsByCategory
);

export default router;
