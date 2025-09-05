// controllers/category.controller.js
// This file contains the controller functions for the Category model.
// It handles incoming HTTP requests and delegates the business logic to the service layer.

import * as categoryService from "../services/category.service.js";

/**
 * @description
 * Creates a new category.
 */
export const createCategory = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({
      error: "Missing required field: name.",
    });
  }

  try {
    const newCategory = await categoryService.createCategory({ name });
    res.status(201).json(newCategory);
  } catch (error) {
    // Check for Prisma's unique constraint violation error
    if (error.code === "P2002") {
      return res.status(409).json({
        error: "A category with this name already exists.",
      });
    }
    console.error("Error creating category:", error);
    res.status(500).json({
      error: "An internal server error occurred.",
    });
  }
};

/**
 * @description
 * Retrieves a list of all categories.
 */
export const getAllCategories = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error getting categories:", error);
    res.status(500).json({
      error: "An internal server error occurred.",
    });
  }
};

/**
 * @description
 * Retrieves a single category by its ID.
 */
export const getCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await categoryService.getCategoryById(parseInt(id));
    if (!category) {
      return res.status(404).json({
        error: "Category not found.",
      });
    }
    res.status(200).json(category);
  } catch (error) {
    console.error("Error getting category by ID:", error);
    res.status(500).json({
      error: "An internal server error occurred.",
    });
  }
};

/**
 * @description
 * Updates an existing category.
 */
export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({
      error: "Missing required field: name.",
    });
  }

  try {
    const updatedCategory = await categoryService.updateCategory(
      parseInt(id), { name }
    );
    res.status(200).json(updatedCategory);
  } catch (error) {
    // Check for Prisma errors (unique constraint or not found)
    if (error.code === "P2002") {
      return res.status(409).json({
        error: "A category with this name already exists.",
      });
    }
    if (error.code === "P2025") {
      return res.status(404).json({
        error: "Category not found.",
      });
    }
    console.error("Error updating category:", error);
    res.status(500).json({
      error: "An internal server error occurred.",
    });
  }
};

/**
 * @description
 * Deletes a category from the database.
 */
export const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    await categoryService.deleteCategory(parseInt(id));
    res.status(204).send(); // 204 No Content for successful deletion
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        error: "Category not found.",
      });
    }
    console.error("Error deleting category:", error);
    res.status(500).json({
      error: "An internal server error occurred.",
    });
  }
};
