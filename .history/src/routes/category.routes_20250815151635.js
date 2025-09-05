// routes/category.routes.js
// This file defines the API routes for handling category-related requests.
// It uses the Express Router to connect each route to a specific
// function in the category.controller.js file.

import express from "express";
import * as categoryController from "../controllers/category.controller.js";

const router = express.Router();

// Route to create a new category
// POST /api/categories
router.post("/", categoryController.createCategory);

// Route to get all categories
// GET /api/categories
router.get("/", categoryController.getAllCategories);

// Route to get a single category by ID
// GET /api/categories/:id
router.get("/:id", categoryController.getCategoryById);

// Route to update a category by ID
// PUT /api/categories/:id
router.put("/:id", categoryController.updateCategory);

// Route to delete a category by ID
// DELETE /api/categories/:id
router.delete("/:id", categoryController.deleteCategory);

// New route to get all items belonging to a category
// GET /api/categories/:id/items
router.get("/:id/items", categoryController.getItemsByCategory);

export default router;
